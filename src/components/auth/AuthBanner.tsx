"use client";

import Image from "next/image";
import Link from "next/link";
import { PawPrint, CheckCircle } from "lucide-react";

export default function AuthBanner() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#2C5F8A] text-white">

      {/* Background Image */}
      <Image
        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop"
        alt="Pet"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#2C5F8A]/80 backdrop-blur-[2px]" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-between p-12">

        {/* Logo */}
        <div>
          <Link href="/" className="flex items-center gap-3">

            <div className="rounded-2xl bg-white/20 p-3 backdrop-blur">
              <PawPrint className="h-9 w-9 text-[#ADD8E6]" />
            </div>

            <div>
              <h1 className="text-4xl font-black">
                Paw<span className="text-[#ADD8E6]">Med</span>
              </h1>

              <p className="text-sm text-slate-200">
                Veterinary Hospital
              </p>
            </div>

          </Link>
        </div>

        {/* Middle */}
        <div>

          <h2 className="mb-5 text-5xl font-extrabold leading-tight">
            Caring for Every Paw,
            <br />
            Every Day.
          </h2>

          <p className="mb-10 text-lg text-slate-200">
            Trusted veterinary care for dogs, cats, birds,
            rabbits and every beloved companion.
          </p>

          <div className="space-y-5">

            <div className="flex items-center gap-3">
              <CheckCircle className="text-[#ADD8E6]" />
              <span>Experienced Veterinarians</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-[#ADD8E6]" />
              <span>24/7 Emergency Support</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-[#ADD8E6]" />
              <span>Online Appointment Booking</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-[#ADD8E6]" />
              <span>Vaccination & Surgery</span>
            </div>

          </div>

        </div>

        {/* Bottom Card */}

        <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">

          <h3 className="text-2xl font-bold">
            5000+
          </h3>

          <p className="text-slate-200">
            Happy Pet Owners
          </p>

          <div className="mt-4 h-2 rounded-full bg-white/20">
            <div className="h-full w-[92%] rounded-full bg-[#ADD8E6]" />
          </div>

          <p className="mt-2 text-sm text-slate-200">
            98% Positive Reviews
          </p>

        </div>

      </div>

    </div>
  );
}