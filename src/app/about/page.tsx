'use client';

import React from 'react';
import { ShieldCheck, Heart, Award, Users, ArrowRight, PawPrint } from 'lucide-react';
import Link from 'next/link';

export default function AboutUsPage() {
  
  const coreValues = [
    {
      icon: Heart,
      title: "Compassionate Care",
      desc: "Every animal passing through our clinical doors is given unconditional kindness, priority attention, and thorough diagnostic scrutiny."
    },
    {
      icon: ShieldCheck,
      title: "Trusted Expertise",
      desc: "Our resident doctors are highly credentialed professionals executing verified protocols with state of the art operating equipment."
    },
    {
      icon: Award,
      title: "Accredited Excellence",
      desc: "Ranked among top veterinary trauma networks, we preserve international benchmarks for sanitation, anesthesia safety, and drug delivery."
    }
  ];

  const medicalTeam = [
    {
      name: "Dr. Farah Rahman, DVM",
      role: "Chief Veterinary Surgeon",
      specialty: "Orthopedics & Soft Tissue Trauma Surgery",
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Dr. Asif Zaman, PhD",
      role: "Senior Diagnostics Specialist",
      specialty: "Advanced Canine Cardiology & Internal Medicine",
      imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop"
    },
    {
      name: "Dr. Nusrat Jahan, DVM",
      role: "Lead Feline Practitioner",
      specialty: "Periodontal Scaler Science & Feline Behavior",
      imageUrl: "https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=400&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Hero Header Strip */}
      <section className="bg-[#1A1A2E] text-white py-16 sm:py-20 relative overflow-hidden border-b-4 border-[#ADD8E6]">
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <PawPrint className="w-[500px] h-[500px]" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
          <span className="bg-[#ADD8E6]/20 text-[#ADD8E6] text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full border border-[#ADD8E6]/30">
            Bangladesh&apos;s Elite Vet Care
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
            Pioneering Pet Care At <span className="text-[#ADD8E6]">PawMed</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            For over a decade, our clinic has integrated cutting-edge laboratory diagnostics with empathetic animal therapy to support lifelong companion vitality across Dhaka.
          </p>
        </div>
      </section>

      {/* Corporate Summary & Stats Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-tight">
            Setting Global Standards in Modern Veterinary Science
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            PawMed operates full-scale trauma centers equipped to navigate comprehensive medical cases. From standard preventative booster distributions to intense TPLO orthopedic interventions, our systems are optimized for optimal companion outcomes.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            We operate with absolute structural transparency, providing real-time scheduling updates and itemized medical history transparency for pet owners in Bangladesh.
          </p>
          
          {/* Quick Metrics Counter Deck */}
          <div className="grid grid-cols-3 gap-4 pt-4 text-center">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <p className="text-2xl font-black text-[#466c94]">14k+</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Pets Cured</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <p className="text-2xl font-black text-[#466c94]">99.4%</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Satisfaction</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <p className="text-2xl font-black text-[#466c94]">25+</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Surgeons</p>
            </div>
          </div>
        </div>

        {/* Visual Callout Asset */}
        <div className="relative h-[320px] sm:h-[400px] rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=800&auto=format&fit=crop" 
            alt="Veterinarian treating pet"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Core Operational Values Strip */}
      <section className="bg-slate-100 border-y border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Our Pillars of Operation</h2>
            <p className="text-xs text-slate-500 font-medium">The fundamental ethics driving every clinical diagnostic evaluation we execute.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((value, idx) => {
              const IconComponent = value.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
                  <div className="p-2.5 bg-[#ADD8E6]/30 text-[#466c94] w-fit rounded-xl">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">{value.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Medical Experts Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center justify-center gap-2">
            <Users className="w-6 h-6 text-[#466c94]" /> Medical Directors & Staff
          </h2>
          <p className="text-xs text-slate-500 font-medium">Meet the elite veterinary surgeons piloting our surgical and trauma units.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {medicalTeam.map((member, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[380px]">
              <div className="h-48 bg-slate-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={member.imageUrl} 
                  alt={member.name}
                  className="w-full h-full object-cover object-top" 
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-black text-slate-800 text-base uppercase tracking-tight">{member.name}</h3>
                  <p className="text-[#466c94] text-[11px] font-bold tracking-wider uppercase mt-0.5">{member.role}</p>
                </div>
                <div className="border-t border-slate-100 pt-3 mt-4 text-slate-500 text-xs font-medium">
                  <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Core Practice Focus</span>
                  {member.specialty}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Call To Action Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-[#1A1A2E] text-white p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">Ready to schedule a health assessment?</h3>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              Explore our comprehensive diagnostics panels or book immediate checkups with our top practitioners.
            </p>
          </div>
          <Link 
            href="/explore"
            className="bg-[#ADD8E6] text-[#1A1A2E] hover:bg-white text-xs font-black tracking-widest uppercase px-6 py-4 rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}