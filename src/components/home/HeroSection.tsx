'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { PawPrint, ArrowRight, ChevronLeft, ChevronRight, Star, Shield, Clock } from 'lucide-react';

const slides = [
  {
    title: 'Welcome to PawMed',
    subtitle: "Your Pet's Health is Our Priority",
    description: 'Trusted veterinary care with modern technology. Book appointments, track medications, and manage your pets all in one place.',
    cta: 'Get Started',
    ctaLink: '/register',
    secondaryCta: 'Learn More',
    secondaryLink: '/services',
    image: '🐾',
    bgColor: 'from-[#ADD8E6] via-[#8ec9d9] to-[#6ab5c9]'
  },
  {
    title: 'Expert Veterinary Care',
    subtitle: 'Compassionate Care for Your Beloved Pets',
    description: 'Our team of experienced veterinarians provides the highest quality care for your pets with love and dedication.',
    cta: 'Book Appointment',
    ctaLink: '/appointments',
    secondaryCta: 'Meet Our Team',
    secondaryLink: '/about',
    image: '❤️',
    bgColor: 'from-[#4A90D9] via-[#3a7bc8] to-[#2C5F8A]'
  },
  {
    title: '24/7 Emergency Services',
    subtitle: "We're Here When You Need Us Most",
    description: 'Round-the-clock emergency care for your pets. Our team is always ready to provide immediate medical attention.',
    cta: 'Emergency Contact',
    ctaLink: '/contact',
    secondaryCta: 'Learn More',
    secondaryLink: '/services',
    image: '🚑',
    bgColor: 'from-[#2C5F8A] via-[#1a3f5e] to-[#0d1f2e]'
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [handleNext]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === 'ArrowRight') handleNext();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  const slide = slides[currentSlide];

  return (
    <section className="relative w-full min-h-fit py-12 md:py-20 lg:min-h-[70vh] flex items-center overflow-visible">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor} transition-all duration-1000 z-0`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full px-4 sm:px-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pb-12">
          
          {/* Left Content Side */}
          <div className={`text-white transition-all duration-700 transform ${
            isAnimating ? 'opacity-0 translate-x-5' : 'opacity-100 translate-x-0'
          }`}>
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4 border border-white/20">
              <PawPrint className="h-3.5 w-3.5 animate-pulse" />
              <span className="text-xs md:text-sm font-medium">🐾 Welcome to PawMed</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight leading-tight">
              {slide.title}
              <span className="block text-[#ADD8E6] drop-shadow-md mt-1 font-extrabold">{slide.subtitle}</span>
            </h1>

            {/* Description Paragraph */}
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 max-w-xl leading-relaxed">
              {slide.description}
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-white/90 bg-black/10 px-3 py-1 rounded-lg">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-white/90 bg-black/10 px-3 py-1 rounded-lg">
                <Shield className="h-4 w-4 text-[#ADD8E6]" />
                <span>Trusted Clinic</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-white/90 bg-black/10 px-3 py-1 rounded-lg">
                <Clock className="h-4 w-4 text-[#ADD8E6]" />
                <span>24/7 Support</span>
              </div>
            </div>

            {/* FIX: Explicit Buttons Wrapper with safe padding & z-index */}
            <div className="flex flex-row flex-wrap items-center gap-4 pt-2 relative z-50">
              <Link
                href={slide.ctaLink}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#2C5F8A] rounded-xl font-bold text-sm shadow-md hover:bg-[#ADD8E6] hover:text-[#1A1A2E] transition-all duration-200 active:scale-95 group"
              >
                {slide.cta}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              
              <Link
                href={slide.secondaryLink}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold text-sm border-2 border-white hover:bg-white/20 transition-all duration-200 active:scale-95"
              >
                {slide.secondaryCta}
              </Link>
            </div>
          </div>

          {/* Right Floating Image Side (Hidden on Mobile for cleaner view) */}
          <div className={`hidden lg:flex justify-center items-center transition-all duration-700 transform ${
            isAnimating ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'
          }`}>
            <div className="relative">
              <div className="text-[10rem] animate-float drop-shadow-2xl select-none">{slide.image}</div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>

      {/* Modern Horizontal Navigation Bars instead of low dots */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2 px-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              index === currentSlide ? 'w-8 bg-white' : 'w-3 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Floating Side Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all active:scale-90"
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all active:scale-90"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}