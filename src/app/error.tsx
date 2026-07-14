"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle,
  RefreshCw,
  Home,
  PawPrint,
  Shield,
  Clock,
  Phone,
  Heart,
} from "lucide-react";

type ErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function Error({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#EAF8FC] via-white to-[#DDF5FF] flex items-center justify-center px-5 py-12">
      <div className="relative w-full max-w-3xl">
        
        {/* Blur Effects */}
        <div className="absolute -top-8 right-0 h-40 w-40 rounded-full bg-[#ADD8E6]/40 blur-3xl" />
        <div className="absolute -bottom-8 left-0 h-40 w-40 rounded-full bg-[#4A90D9]/20 blur-3xl" />

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-[#ADD8E6]/50 bg-white shadow-2xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4A90D9] to-[#2C5F8A] p-8">
            <div className="flex items-center gap-5">
              <div className="rounded-2xl bg-white/20 p-3 animate-pulse">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Something Went Wrong
                </h1>
                <p className="mt-1 text-blue-100">
                  An unexpected error occurred.
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Error Box */}
            <div className="rounded-xl border border-[#ADD8E6] bg-[#EAF8FC] p-5">
              <div className="flex gap-3">
                <AlertCircle className="mt-1 h-5 w-5 text-[#2C5F8A]" />
                <div className="flex-1">
                  <h3 className="font-semibold text-[#2C5F8A]">
                    Error Message
                  </h3>
                  <p className="mt-1 break-words text-[#3e638a]">
                    {error.message || "Unknown error"}
                  </p>
                  {error.digest && (
                    <p className="mt-3 rounded bg-[#ADD8E6]/40 px-3 py-1 font-mono text-xs text-[#2C5F8A]">
                      Error ID : {error.digest}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <button
                onClick={reset}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#4A90D9] px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-[#2C5F8A]"
              >
                <RefreshCw className="h-5 w-5" />
                Try Again
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
              >
                <Home className="h-5 w-5" />
                Go Home
              </Link>
            </div>

            {/* Support Options */}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-[#3e638a] transition hover:border-[#4A90D9] hover:bg-[#EAF8FC]"
              >
                <Phone className="h-5 w-5 text-[#4A90D9]" />
                Contact Support
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-[#3e638a] transition hover:border-[#4A90D9] hover:bg-[#EAF8FC]"
              >
                <RefreshCw className="h-5 w-5 text-[#4A90D9]" />
                Reload Page
              </button>
            </div>
          </div>

          {/* Footer (Fixed HTML elements flow hierarchy) */}
          <div className="border-t border-[#ADD8E6]/40 bg-slate-50 px-8 py-5">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[#4A90D9]" />
                <span>Secure Connection</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#4A90D9]" />
                <span>24/7 Emergency</span>
              </div>
              <div className="flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-[#4A90D9]" />
                <span>PawMed Care</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-[#4A90D9]" />
                <span>We Love Pets</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Text */}
        <div className="mt-8 text-center">
          <h3 className="text-xl font-bold text-[#2C5F8A]">
            PawMed Veterinary Clinic
          </h3>
          <p className="mt-2 text-sm text-[#3e638a]">
            Caring for your pets with love, compassion and professional veterinary care.
          </p>
          <p className="mt-3 animate-pulse text-xs text-[#4A90D9]">
            We&apos;re working hard to fix this issue...
          </p>
        </div>

      </div>
    </main>
  );
}