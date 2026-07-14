'use client';

import { 
  PawPrint, 
  Calendar, 
  Stethoscope, 
  Pill, 
  Users, 
  CreditCard,
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const features = [
  { 
    icon: PawPrint, 
    title: 'Pet Management', 
    description: 'Manage all your pets with ease. Track medical history, vaccinations, and appointments in one place.',
    color: '#4A90D9',
    bgColor: '#ADD8E6',
    tag: 'Most Popular'
  },
  { 
    icon: Calendar, 
    title: 'Smart Appointments', 
    description: 'Book and manage appointments with your preferred veterinarians. Get reminders and notifications.',
    color: '#2C5F8A',
    bgColor: '#ADD8E6',
    tag: 'New'
  },
  { 
    icon: Stethoscope, 
    title: 'Medical Services', 
    description: 'Access quality veterinary care with our experienced team of professionals.',
    color: '#4A90D9',
    bgColor: '#ADD8E6',
    tag: null
  },
  { 
    icon: Pill, 
    title: 'Prescriptions', 
    description: 'Track medications, get refills, and manage prescriptions easily online.',
    color: '#2C5F8A',
    bgColor: '#ADD8E6',
    tag: null
  },
  { 
    icon: Users, 
    title: 'Expert Veterinarians', 
    description: 'Connect with qualified and experienced veterinarians in your area.',
    color: '#4A90D9',
    bgColor: '#ADD8E6',
    tag: 'Verified'
  },
  { 
    icon: CreditCard, 
    title: 'Secure Payments', 
    description: 'Easy and secure payment processing for all veterinary services.',
    color: '#2C5F8A',
    bgColor: '#ADD8E6',
    tag: null
  },
];

export default function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-gradient-to-b from-white via-[#F8FAFC] to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ADD8E6]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4A90D9]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ADD8E6]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(74, 144, 217, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(74, 144, 217, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#ADD8E6]/20 backdrop-blur-sm px-5 py-2.5 rounded-full mb-5 border border-[#ADD8E6]/30">
            <Sparkles className="h-4 w-4 text-[#4A90D9]" />
            <span className="text-sm font-medium text-[#2C5F8A]">Why Choose Us</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A2E] mb-4 leading-tight">
            Why Choose <span className="text-[#4A90D9] relative">
              PawMed
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                <path d="M1 5.5C50 2.5 100 2.5 199 5.5" stroke="#4A90D9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We provide comprehensive veterinary care with modern technology and a team of dedicated professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-[#ADD8E6]/10 to-[#4A90D9]/10 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
                
                {/* Top Border Accent */}
                <div 
                  className={`h-1 w-full transition-all duration-500 ${isHovered ? 'h-1.5' : 'h-1'}`}
                  style={{ background: `linear-gradient(to right, #ADD8E6, ${feature.color})` }}
                ></div>

                {/* Tag Badge */}
                {feature.tag && (
                  <div className="absolute top-4 right-4 z-10">
                    <span 
                      className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                      style={{ background: feature.color }}
                    >
                      {feature.tag}
                    </span>
                  </div>
                )}

                <div className="p-8 relative">
                  {/* Icon */}
                  <div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 ${isHovered ? 'scale-110 shadow-lg' : ''}`}
                    style={{ background: `${feature.bgColor}30` }}
                  >
                    <Icon className={`h-8 w-8 transition-all duration-500 ${isHovered ? 'scale-110' : ''}`} style={{ color: feature.color }} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl font-bold text-[#1A1A2E] mb-3 transition-colors duration-300 ${isHovered ? 'text-[#4A90D9]' : ''}`}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <div className={`mt-5 flex items-center gap-2 text-sm font-medium transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
                    <span style={{ color: feature.color }}>Learn More</span>
                    <ArrowRight className={`h-4 w-4 transition-transform duration-500 ${isHovered ? 'translate-x-1' : ''}`} style={{ color: feature.color }} />
                  </div>

                  {/* Bottom Indicator */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#ADD8E6] to-[#4A90D9] transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 text-gray-600">
              <Shield className="h-5 w-5 text-[#4A90D9]" />
              <span className="text-sm font-medium">Trusted by 1000+ pet owners</span>
              <span className="hidden sm:inline text-gray-300">|</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="h-5 w-5 text-[#4A90D9]" />
              <span className="text-sm font-medium">24/7 Support</span>
              <span className="hidden sm:inline text-gray-300">|</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Heart className="h-5 w-5 text-[#4A90D9]" />
              <span className="text-sm font-medium">100% Satisfaction</span>
            </div>
          </div>
          
          <div className="mt-8">
            <Link 
              href="/services" 
              className="group inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#4A90D9] to-[#2C5F8A] text-white rounded-2xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <span>View All Services</span>
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}