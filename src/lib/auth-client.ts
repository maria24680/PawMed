// src/lib/auth-client.ts

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ------------------------------------------------------------------
// User storage (client-side cache of the logged-in user's email/role)
// ------------------------------------------------------------------

const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

const storeUser = (user: any) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("user", JSON.stringify(user));
};

// Resolve the current user's email — check local cache first, then
// fall back to asking Better Auth for the live session.
const getCurrentUserEmail = async (): Promise<string | null> => {
  const storedUser = getStoredUser();
  if (storedUser?.email) {
    return storedUser.email;
  }

  try {
    const sessionResult = await getSession();
    const user = (sessionResult as any)?.data?.user;
    if (user?.email) {
      storeUser(user);
      return user.email;
    }
    return null;
  } catch {
    return null;
  }
};

// ------------------------------------------------------------------
// Auth headers — Express only understands x-user-email, nothing else
// ------------------------------------------------------------------

export const buildAuthHeaders = async (headers: HeadersInit = {}) => {
  const newHeaders = new Headers(headers);

  const email = await getCurrentUserEmail();
  if (email) {
    newHeaders.set("x-user-email", email);
  }

  return newHeaders;
};

// ------------------------------------------------------------------
// Main fetch function for authenticated API calls
// ------------------------------------------------------------------

export const authFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
  const headers = await buildAuthHeaders(init.headers || {});

  if (!headers.has("Content-Type") && init.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  if (response.status === 401) {
    console.warn("Unauthorized request — clearing cached user and redirecting to login.");
    localStorage.removeItem("user");

    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  }

  return response;
};

// ------------------------------------------------------------------
// Google Sign-in helper
// ------------------------------------------------------------------

export const signInWithGoogle = () => {
  return signIn.social({
    provider: "google",
    callbackURL: "/auth/callback",
  });
};

// ------------------------------------------------------------------
// Session / user helpers
// ------------------------------------------------------------------

export const isAuthenticated = async (): Promise<boolean> => {
  const email = await getCurrentUserEmail();
  return !!email;
};

export const getCurrentUser = async () => {
  const storedUser = getStoredUser();
  if (storedUser) return storedUser;

  try {
    const session = await getSession();
    const user = (session as any)?.data?.user;
    if (user) {
      storeUser(user);
      return user;
    }
  } catch (error) {
    console.error("Error getting user:", error);
  }

  return null;
};

// Fetch the full user record (with role, etc.) from Express and cache it.
// Call this right after login so buildAuthHeaders/getCurrentUser have
// accurate, up-to-date data (role changes, isActive, etc.).
export const syncUserFromServer = async () => {
  const email = await getCurrentUserEmail();
  if (!email) return null;

  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { "x-user-email": email },
      credentials: "include",
    });
    if (!res.ok) return null;

    const json = await res.json();
    const user = json?.data?.user;
    if (user) {
      storeUser(user);
      return user;
    }
    return null;
  } catch (error) {
    console.error("Error syncing user from server:", error);
    return null;
  }
};

// ------------------------------------------------------------------
// Clear auth data
// ------------------------------------------------------------------

export const clearAuthData = () => {
  localStorage.removeItem("user");
  signOut();
};

// ------------------------------------------------------------------
// Initialize auth after Google OAuth callback
// ------------------------------------------------------------------

export const initAuth = async () => {
  try {
    const session = await getSession();
    if (session?.data?.user) {
      storeUser(session.data.user);
      // Pull the authoritative record (with role) from Express
      const synced = await syncUserFromServer();
      return { user: synced || session.data.user };
    }
    return null;
  } catch (error) {
    console.error("Init auth error:", error);
    return null;
  }
};