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

// Get JWT token from localStorage
const getJWTToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Get user from localStorage
const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Fetch session and get user email
const getCurrentUserEmail = async (): Promise<string | null> => {
  try {
    // First check if we have user in localStorage
    const storedUser = getStoredUser();
    if (storedUser?.email) {
      return storedUser.email;
    }
    
    // Fallback to Better Auth session
    const sessionResult = await getSession();
    const email = (sessionResult as any)?.data?.user?.email;
    return email || null;
  } catch {
    return null;
  }
};

// Get or create JWT token from Better Auth session
export const getOrCreateToken = async (): Promise<string | null> => {
  // First check if we already have a token
  const existingToken = getJWTToken();
  if (existingToken) {
    // Verify token is still valid by checking session
    try {
      const session = await getSession();
      if (session?.data) {
        return existingToken;
      }
    } catch {
      // Session invalid, token might be expired
      localStorage.removeItem('token');
    }
  }

  // Try to get user email from session
  const email = await getCurrentUserEmail();
  if (!email) {
    console.warn('No user email found to create token');
    return null;
  }

  // Exchange Better Auth session for JWT token
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/issue-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': process.env.NEXT_PUBLIC_INTERNAL_API_SECRET || '',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    
    if (data.success && data.data?.token) {
      const { token, user } = data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return token;
    }
    
    console.warn('Failed to issue token:', data.message);
    return null;
  } catch (error) {
    console.error('Error issuing token:', error);
    return null;
  }
};

// Build auth headers for API requests
export const buildAuthHeaders = async (headers: HeadersInit = {}) => {
  const newHeaders = new Headers(headers);
  
  // Try to get JWT token
  let token = getJWTToken();
  
  // If no token, try to create one from session
  if (!token) {
    token = await getOrCreateToken();
  }
  
  // If we have a token, add it to headers
  if (token) {
    newHeaders.set("Authorization", `Bearer ${token}`);
    return newHeaders;
  }
  
  // Fallback: try to get user email from Better Auth session
  const email = await getCurrentUserEmail();
  if (email) {
    newHeaders.set("user-email", email);
  }
  
  return newHeaders;
};

// Main fetch function for authenticated API calls
export const authFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
  // Build headers with authentication
  const headers = await buildAuthHeaders(init.headers || {});

  // Add Content-Type if not present and we have a body
  if (!headers.has("Content-Type") && init.body && typeof init.body === "string") {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });

  // If 401 Unauthorized, try to refresh the token
  if (response.status === 401) {
    console.warn('Unauthorized request, trying to refresh token...');
    
    // Clear existing token
    localStorage.removeItem('token');
    
    // Try to get a new token
    const newToken = await getOrCreateToken();
    
    if (newToken) {
      // Retry the request with new token
      const retryHeaders = new Headers(init.headers || {});
      retryHeaders.set("Authorization", `Bearer ${newToken}`);
      
      if (!retryHeaders.has("Content-Type") && init.body && typeof init.body === "string") {
        retryHeaders.set("Content-Type", "application/json");
      }
      
      const retryResponse = await fetch(input, {
        ...init,
        headers: retryHeaders,
        credentials: "include",
      });
      
      return retryResponse;
    }
    
    // If still unauthorized, redirect to login
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
      window.location.href = '/auth/login';
    }
  }

  return response;
};

// Google Sign-in helper
export const signInWithGoogle = () => {
  return signIn.social({
    provider: "google",
    callbackURL: "/auth/callback", // Make sure this matches your route
  });
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  // Check for JWT token first
  const token = getJWTToken();
  if (token) return true;
  
  // Try to get/create token
  const newToken = await getOrCreateToken();
  if (newToken) return true;
  
  // Check Better Auth session
  try {
    const session = await getSession();
    return !!session?.data;
  } catch {
    return false;
  }
};

// Get current user
export const getCurrentUser = async () => {
  // Check localStorage first
  const storedUser = getStoredUser();
  if (storedUser) return storedUser;
  
  // Try to get from session
  try {
    const session = await getSession();
    const user = (session as any)?.data?.user;
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
  } catch (error) {
    console.error('Error getting user:', error);
  }
  
  return null;
};

// Clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  signOut();
};

// Initialize auth after Google OAuth callback
export const initAuth = async () => {
  try {
    const session = await getSession();
    if (session?.data) {
      // Get or create JWT token
      const token = await getOrCreateToken();
      if (token) {
        const user = session.data.user;
        localStorage.setItem('user', JSON.stringify(user));
        return { token, user };
      }
    }
    return null;
  } catch (error) {
    console.error('Init auth error:', error);
    return null;
  }
};