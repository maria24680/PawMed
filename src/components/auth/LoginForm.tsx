"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { authClient, signInWithGoogle, syncUserFromServer } from "@/lib/auth-client";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  PawPrint,
  Loader2,
} from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      // Sign in with Better Auth
      const { data: result, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
        rememberMe,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Pull the authoritative user record (with role, from Express/Mongo)
      // now that Better Auth has confirmed the session. This also caches
      // it in localStorage so authFetch can send x-user-email afterward.
      const user = await syncUserFromServer();

      if (!user) {
        toast.error("Logged in, but we couldn't load your profile. Please try again.");
        setLoading(false);
        return;
      }

      toast.success(`Welcome back, ${user.name}! 🎉`);

      setTimeout(() => {
        if (user.role === "admin") {
          router.push("/dashboard/admin");
        } else if (user.role === "veterinarian") {
          router.push("/dashboard/veterinarian");
        } else {
          router.push("/dashboard/client");
        }
        router.refresh();
      }, 800);

    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Better Auth redirects the browser to Google, then to callbackURL.
      // After Google redirects back, the /auth/callback page should call
      // initAuth() to sync the user record into localStorage.
    } catch (error: any) {
      console.error("Google Sign-in Error:", error);
      toast.error("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF8FC] via-white to-[#DDF5FF] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white border border-gray-200 shadow-2xl p-8">

        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-[#ADD8E6] p-3 shadow">
              <PawPrint size={32} className="text-[#2C5F8A]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-500">Login to your PawMed account</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="example@gmail.com"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-12 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[#4A90D9] focus:ring-[#ADD8E6]"
              />
              <span>Remember Me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-[#4A90D9] hover:text-[#2C5F8A] transition-colors font-medium hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A90D9] py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#2C5F8A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing In...
              </>
            ) : (
              "Login"
            )}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">OR</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:border-[#4A90D9] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.4 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2c-2.1 1.6-4.6 2.5-7.3 2.5-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.5 39.5 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.4 5.3-6.5 6.8l6.2 5.2C39.4 36.2 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z" />
              </svg>
            )}
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="ml-2 font-semibold text-[#4A90D9] transition hover:text-[#2C5F8A]"
            >
              Register
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}