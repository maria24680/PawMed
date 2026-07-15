/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Star, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Activity,
  HeartPulse
} from 'lucide-react';
import Link from 'next/link';

interface ServiceDetails {
  _id: string;
  name: string;
  title: string;
  shortDesc: string;
  description: string;
  fullDesc: string;
  category: string;
  price: number;
  rating: number;
  location: string;
  image: string;
  imageUrl: string;
  date: string;
  duration?: number;
  highlights?: string[];
  isAvailable: boolean;
  requiresSpecialist: boolean;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`http://localhost:8000/api/services/${id}`);
        
        if (!response.ok) {
          throw new Error('Service not found');
        }

        const data = await response.json();
        const serviceData = data.data?.service || data.data || data;
        
        setService({
          ...serviceData,
          image: serviceData.image || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200',
          imageUrl: serviceData.image || serviceData.imageUrl || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200',
          rating: serviceData.rating || 4.8,
          location: serviceData.location || 'Dhaka, Bangladesh',
          date: serviceData.date || new Date().toLocaleDateString(),
          duration: serviceData.duration || 30,
          highlights: serviceData.highlights || [
            'Full clinical evaluation by certified veterinarian',
            'Post-treatment diagnostic and progress report',
            'Guidance and customized prescription plan',
            'Access to 24/7 follow-up helpline support'
          ]
        });
        
      } catch (err: any) {
        console.error("Fetch Error:", err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      consultation: 'bg-blue-100 text-blue-700',
      vaccination: 'bg-green-100 text-green-700',
      surgery: 'bg-purple-100 text-purple-700',
      dental: 'bg-pink-100 text-pink-700',
      diagnostic: 'bg-indigo-100 text-indigo-700',
      emergency: 'bg-red-100 text-red-700',
      wellness: 'bg-teal-100 text-teal-700',
      specialist: 'bg-orange-100 text-orange-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 animate-pulse">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-[400px] bg-slate-200 rounded-3xl w-full" />
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-10 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-5/6" />
            </div>
            <div className="h-[350px] bg-slate-200 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md text-center">
          <div className="p-3 bg-rose-50 rounded-full inline-block text-rose-500 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Something went wrong</h3>
          <p className="text-slate-500 text-sm mt-2">{error || 'Could not find the requested service.'}</p>
          <Link 
            href="/services" 
            className="mt-6 inline-block bg-[#4A90D9] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#2C5F8A] transition-all"
          >
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = imageError 
    ? 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200'
    : service.image || service.imageUrl;

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 text-slate-500 hover:text-[#4A90D9] text-xs font-bold uppercase tracking-wider mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Services
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-8">
            
            <div className="relative h-[300px] sm:h-[420px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
              <img 
                src={imageUrl}
                alt={service.name || service.title} 
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
              <span className={`absolute top-4 left-4 text-xs font-black tracking-widest uppercase px-4 py-2 rounded-xl shadow-md ${getCategoryColor(service.category)}`}>
                {service.category}
              </span>
              {!service.isAvailable && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="bg-red-500 text-white text-xl font-bold px-6 py-3 rounded-xl">
                    Currently Unavailable
                  </span>
                </div>
              )}
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-100">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="text-amber-700 text-sm font-bold">{service.rating.toFixed(1)} Rating</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-wide">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {service.duration} mins</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {service.location}</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight uppercase">
                {service.name || service.title}
              </h1>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#4A90D9]" /> About This Treatment
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {service.description || service.fullDesc || service.shortDesc}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-[#4A90D9]" /> Service Highlights & Inclusions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {service.highlights && service.highlights.length > 0 ? (
                  service.highlights.map((highlight: string, index: number) => (
                    <div key={index} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm font-medium">{highlight}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm font-medium">Full clinical evaluation by certified veterinarian</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm font-medium">Post-treatment diagnostic and progress report</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm font-medium">Guidance and customized prescription plan</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600 text-sm font-medium">Access to 24/7 follow-up helpline support</span>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-[#1A1A2E] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Standard Cost</p>
                <div className="flex items-baseline text-[#ADD8E6]">
                  <span className="text-3xl font-black flex items-center">
                    <DollarSign className="w-7 h-7 -mr-1" />
                    {formatBDT(service.price)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium ml-2">/ per pet</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-3 text-xs font-semibold text-slate-300">
                <div className="flex justify-between">
                  <span>Available Days:</span>
                  <span className="text-white font-bold">{service.date || 'Everyday'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hospital Branch:</span>
                  <span className="text-white font-bold">{service.location || 'Dhaka'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="text-white font-bold">{service.duration || 30} mins</span>
                </div>
                {service.requiresSpecialist && (
                  <div className="flex justify-between">
                    <span>Specialist:</span>
                    <span className="text-[#ADD8E6] font-bold">Required</span>
                  </div>
                )}
              </div>

              {service.isAvailable ? (
                <Link 
                  href={`/appointments/book?serviceId=${service._id}`}
                  className="block w-full text-center bg-[#ADD8E6] text-[#1A1A2E] hover:bg-white py-3.5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all shadow-md"
                >
                  Book Appointment Now
                </Link>
              ) : (
                <button 
                  disabled
                  className="block w-full text-center bg-slate-700 text-slate-400 py-3.5 rounded-2xl font-black text-xs tracking-widest uppercase cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-slate-400" /> Secure Clinic Reservation Guaranteed
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}