"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  PawPrint,
  Stethoscope,
  MapPin,
  Award,
  Calendar,
  Building2,
  Image as ImageIcon,
} from "lucide-react";

// ============================================
// TYPE DEFINITIONS
// ============================================

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  profileImage: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  hospital: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function RegisterForm() {
  const router = useRouter();

  // ============================================
  // STATE
  // ============================================

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"client" | "veterinarian">("client");

  // ============================================
  // REACT HOOK FORM
  // ============================================

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      profileImage: "",
      specialization: "",
      licenseNumber: "",
      experience: 0,
      hospital: "",
    },
  });

  const watchPassword = watch("password");

  // ============================================
  // FORM SUBMIT HANDLER
  // ============================================

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);

    try {
      // 1. Validate password strength
      const strongPasswordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;
      if (!strongPasswordRegex.test(data.password)) {
        toast.error("Password: min 6 chars, 1 number & 1 special char");
        setLoading(false);
        return;
      }

      // 2. Prepare user data
      const userData: any = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
        profileImage: data.profileImage || undefined,
        role: role,
      };

      // 3. Add veterinarian specific fields
      if (role === "veterinarian") {
        if (!data.specialization) {
          toast.error("Please select your specialization");
          setLoading(false);
          return;
        }
        if (!data.licenseNumber) {
          toast.error("Please enter your license number");
          setLoading(false);
          return;
        }
        userData.specialization = [data.specialization];
        userData.licenseNumber = data.licenseNumber;
        userData.experience = data.experience || 0;
      }

      console.log("📝 Registration Data:", userData);

      // 4. API Call (Backend)
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.message || "Registration failed");
        return;
      }

      // 5. Save token and user data
      const { user, token } = result.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 6. Show success message
      toast.success("Account created successfully! 🎉");

      // 7. Redirect to dashboard
      setTimeout(() => {
        if (role === "veterinarian") {
          router.push("/veterinarian/dashboard");
        } else {
          router.push("/client/dashboard");
        }
        router.refresh();
      }, 1000);

    } catch (error: any) {
      console.error("Registration Error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // PASSWORD STRENGTH INDICATOR
  // ============================================

  const getPasswordStrength = (password: string) => {
    if (!password) return { label: "", color: "" };
    let score = 0;
    if (password.length >= 6) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;

    if (score <= 1) return { label: "Weak", color: "text-red-500" };
    if (score <= 2) return { label: "Fair", color: "text-yellow-500" };
    if (score <= 3) return { label: "Good", color: "text-blue-500" };
    return { label: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(watchPassword || "");

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
              <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
              <p className="text-gray-500">Welcome to PawMed</p>
            </div>
          </div>
        </div>

        {/* ===== FORM ===== */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* ===== ROLE SELECTION ===== */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("client")}
                className={`rounded-2xl border p-4 transition-all duration-300 ${
                  role === "client"
                    ? "border-[#4A90D9] bg-[#ADD8E6]/20 shadow"
                    : "border-gray-300 hover:border-[#4A90D9]"
                }`}
              >
                <User className="mx-auto mb-2 text-[#2C5F8A]" size={28} />
                <p className="font-semibold text-gray-800">Pet Owner</p>
              </button>

              <button
                type="button"
                onClick={() => setRole("veterinarian")}
                className={`rounded-2xl border p-4 transition-all duration-300 ${
                  role === "veterinarian"
                    ? "border-[#4A90D9] bg-[#ADD8E6]/20 shadow"
                    : "border-gray-300 hover:border-[#4A90D9]"
                }`}
              >
                <Stethoscope className="mx-auto mb-2 text-[#2C5F8A]" size={28} />
                <p className="font-semibold text-gray-800">Veterinarian</p>
              </button>
            </div>
          </div>

          {/* ===== NAME ===== */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                {...register("name", { required: "Full Name is required" })}
                placeholder="John Doe"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

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

          {/* ===== PHONE ===== */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                {...register("phone")}
                placeholder="+8801XXXXXXXXX"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
              />
            </div>
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}

            {/* Password Strength Indicator */}
            {watchPassword && (
              <p className={`mt-1 text-xs ${passwordStrength.color}`}>
                Password Strength: {passwordStrength.label}
              </p>
            )}

            <p className="text-xs text-gray-500 mt-1">
              Min 6 chars, 1 uppercase, 1 number & 1 special character
            </p>
          </div>

          {/* ===== VETERINARIAN FIELDS ===== */}
          {role === "veterinarian" && (
            <div className="rounded-2xl border border-[#ADD8E6] bg-[#F7FCFE] p-5 space-y-5">
              <h3 className="font-bold text-[#2C5F8A] flex items-center gap-2">
                <Stethoscope size={18} />
                Veterinarian Information
              </h3>

              {/* Specialization */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Specialization <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Award size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <select
                    {...register("specialization", {
                      required: role === "veterinarian" ? "Specialization is required" : false,
                    })}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 pl-11 text-gray-800 outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
                  >
                    <option value="">Select Specialization</option>
                    <option value="Small Animal Medicine">Small Animal Medicine</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Dentistry">Dentistry</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Emergency Care">Emergency Care</option>
                  </select>
                </div>
                {errors.specialization && (
                  <p className="mt-1 text-sm text-red-500">{errors.specialization.message}</p>
                )}
              </div>

              {/* License Number */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  License Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    {...register("licenseNumber", {
                      required: role === "veterinarian" ? "License number is required" : false,
                    })}
                    placeholder="VET-2026-001"
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-800 outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
                  />
                </div>
                {errors.licenseNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.licenseNumber.message}</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Experience (Years)
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="number"
                    {...register("experience", { valueAsNumber: true })}
                    placeholder="5"
                    min="0"
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-800 outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
                  />
                </div>
              </div>

              {/* Hospital */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Hospital Name
                </label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    {...register("hospital")}
                    placeholder="PawMed Veterinary Hospital"
                    className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-800 outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ===== ADDRESS ===== */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Address
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-4 text-gray-500" />
              <textarea
                {...register("address")}
                rows={3}
                placeholder="Dhaka, Bangladesh"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
              />
            </div>
          </div>

          {/* ===== PROFILE IMAGE ===== */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Profile Image URL
            </label>
            <div className="relative">
              <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                {...register("profileImage")}
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
              />
            </div>
          </div>

          {/* ===== SUBMIT BUTTON ===== */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#4A90D9] py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#2C5F8A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
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

          {/* ===== GOOGLE BUTTON ===== */}
          <button
            type="button"
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

          {/* ===== LOGIN LINK ===== */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="ml-2 font-semibold text-[#4A90D9] transition hover:text-[#2C5F8A]"
            >
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}





