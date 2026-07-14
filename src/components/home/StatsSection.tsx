/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState, useRef } from 'react';
import { Users, PawPrint, Calendar, Star, TrendingUp } from 'lucide-react';

export default function StatsSection() {
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats = [
    { 
      value: 1000, 
      label: 'Pets Treated', 
      icon: PawPrint,
      suffix: '+',
      color: '#2C5F8A'
    },
    { 
      value: 50, 
      label: 'Veterinarians', 
      icon: Users,
      suffix: '+',
      color: '#4A90D9'
    },
    { 
      value: 2000, 
      label: 'Appointments', 
      icon: Calendar,
      suffix: '+',
      color: '#1A1A2E'
    },
    { 
      value: 98, 
      label: 'Satisfaction Rate', 
      icon: Star,
      suffix: '%',
      color: '#2C5F8A'
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    const targetValues = stats.map(s => s.value);
    const increments = targetValues.map(v => v / steps);
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setCounts(prev => 
        prev.map((count, index) => {
          const next = Math.min(count + increments[index], targetValues[index]);
          return Math.ceil(next);
        })
      );
      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(targetValues);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section 
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #ADD8E6 0%, #8ec9d9 50%, #6ab5c9 100%)' }}
    >
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 2px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <TrendingUp className="h-4 w-4 text-[#2C5F8A]" />
            <span className="text-sm font-medium text-[#1A1A2E]">Our Impact</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
            Trusted by Pet Owners <span className="text-[#2C5F8A]">Worldwide</span>
          </h2>
          <p className="text-lg text-[#1A1A2E]/70 mt-2 max-w-2xl mx-auto">
            Numbers that speak for themselves
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative bg-white/20 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center hover:bg-white/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
              >
                {/* Hover Glow Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${stat.color}15, transparent 70%)`
                  }}
                ></div>

                {/* Icon */}
                <div 
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ background: `${stat.color}20` }}
                >
                  <Icon className="h-7 w-7 transition-all duration-300 group-hover:scale-110" style={{ color: stat.color }} />
                </div>

                {/* Value */}
                <div 
                  className="text-4xl md:text-5xl font-bold transition-all duration-300"
                  style={{ color: stat.color }}
                >
                  {counts[index]}{stat.suffix}
                </div>

                {/* Label */}
                <div className="text-[#1A1A2E] font-medium mt-2">
                  {stat.label}
                </div>

                {/* Animated Bottom Border */}
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-3/4 h-1 rounded-full transition-all duration-500"
                  style={{ background: stat.color }}
                ></div>
              </div>
            );
          })}
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-12">
          <p className="text-[#1A1A2E]/60 text-sm">
            🏆 Award-winning veterinary care with 98% client satisfaction rate
          </p>
        </div>
      </div>
    </section>
  );
}