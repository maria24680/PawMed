'use client';

import Link from 'next/link';
import { PawPrint, ArrowRight, CheckCircle, Heart, Star } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2C5F8A] via-[#4A90D9] to-[#ADD8E6]">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 lg:p-16 border border-white/20 shadow-2xl">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Heart className="h-4 w-4 text-[#ADD8E6] animate-pulse" />
                <span className="text-sm font-medium text-white">Trusted by 1000+ Pet Owners</span>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full shadow-lg animate-float">
                  <PawPrint className="h-16 w-16 text-white" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Ready to Give Your Pet the{' '}
                <span className="text-[#ADD8E6] relative">
                  Best Care
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#ADD8E6] rounded-full"></span>
                </span>
                ?
              </h2>

              {/* Description */}
              <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
                Join thousands of pet owners who trust PawMed for their veterinary needs.
                Quality care, modern technology, and a team you can rely on.
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-[#ADD8E6]" />
                  <span className="text-sm text-white">Expert Veterinarians</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-[#ADD8E6]" />
                  <span className="text-sm text-white">Modern Facilities</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-[#ADD8E6]" />
                  <span className="text-sm text-white">24/7 Emergency Care</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CheckCircle className="h-4 w-4 text-[#ADD8E6]" />
                  <span className="text-sm text-white">Affordable Prices</span>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-white/80 text-sm">4.9/5 from 500+ reviews</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <Link 
                  href="/register" 
                  className="group inline-flex items-center gap-2 px-8 py-3 bg-white text-[#2C5F8A] rounded-xl font-semibold hover:bg-[#ADD8E6] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Get Started Today
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link 
                  href="/services" 
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border-2 border-white hover:bg-white/20 transition-all duration-300"
                >
                  View Services
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-white/70 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  No hidden fees
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  Free consultation
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Satisfaction guaranteed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </section>
  );
}