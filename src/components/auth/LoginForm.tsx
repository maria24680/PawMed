"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  PawPrint,
  Loader2,
} from "lucide-react";

// ============================================
// TYPE DEFINITIONS
// ============================================

interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function LoginForm() {
  const router = useRouter();

  // ============================================
  // STATE
  // ============================================

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // ============================================
  // REACT HOOK FORM
  // ============================================

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

  // ============================================
  // FORM SUBMIT HANDLER
  // ============================================

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      // 1. Validation
      if (!data.email || !data.password) {
        toast.error("Please fill in all fields");
        setLoading(false);
        return;
      }

      console.log("📝 Login Data:", { 
        email: data.email, 
        password: data.password,
        rememberMe: rememberMe 
      });

      // 2. API Call (Backend)
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.message || "Invalid credentials");
        return;
      }

      // 3. Save token and user data
      const { user, token } = result.data;
      
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      // 4. Show success message
      toast.success(`Welcome back, ${user.name}! 🎉`);

      // 5. Redirect based on role
      setTimeout(() => {
        if (user.role === "admin") {
          router.push("/admin/dashboard");
        } else if (user.role === "veterinarian") {
          router.push("/veterinarian/dashboard");
        } else {
          router.push("/client/dashboard");
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

  // ============================================
  // GOOGLE SIGN-IN HANDLER (Fixed)
  // ============================================

  const handleGoogleSignIn = () => {
    toast.loading("Connecting to Google...");
    // Google sign-in logic here
    // After success or failure, dismiss loading toast
    setTimeout(() => {
      toast.dismiss();
      toast.success("Google sign-in coming soon!");
    }, 1500);
  };

  // ============================================
  // UI RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF8FC] via-white to-[#DDF5FF] flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white border border-gray-200 shadow-2xl p-8">

        {/* ===== HEADER ===== */}
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

        {/* ===== FORM ===== */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* ===== EMAIL ===== */}
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

          {/* ===== PASSWORD ===== */}
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

          {/* ===== REMEMBER ME & FORGOT PASSWORD ===== */}
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

          {/* ===== LOGIN BUTTON ===== */}
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

          {/* ===== DIVIDER ===== */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">OR</span>
            </div>
          </div>

          {/* ===== GOOGLE BUTTON (Fixed) ===== */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white py-3 font-medium text-gray-700 transition-all duration-300 hover:bg-gray-50 hover:border-[#4A90D9]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.4 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.3l-6.2-5.2c-2.1 1.6-4.6 2.5-7.3 2.5-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.5 39.5 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.4 5.3-6.5 6.8l6.2 5.2C39.4 36.2 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z" />
            </svg>
            Continue with Google
          </button>

          {/* ===== REGISTER LINK ===== */}
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