/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Star, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface ServiceItem {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  isAvailable: boolean;
  requiresSpecialist: boolean;
  image?: string;
  createdAt: string;
}

const categories = [
  { value: "All", label: "All Categories" },
  { value: "consultation", label: "Consultation" },
  { value: "vaccination", label: "Vaccination" },
  { value: "surgery", label: "Surgery" },
  { value: "dental", label: "Dental Care" },
  { value: "diagnostic", label: "Diagnostic" },
  { value: "emergency", label: "Emergency" },
  { value: "wellness", label: "Wellness" },
  { value: "specialist", label: "Specialist" },
];

const categoryLabels: Record<string, string> = {
  consultation: "Consultation",
  vaccination: "Vaccination",
  surgery: "Surgery",
  dental: "Dental Care",
  diagnostic: "Diagnostic",
  emergency: "Emergency",
  wellness: "Wellness",
  specialist: "Specialist",
};

export default function ExploreServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = `http://localhost:8000/api/services`;
        const params = new URLSearchParams();
        
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (sortBy === 'price-low') params.append('sort', 'price');
        if (sortBy === 'price-high') params.append('sort', '-price');

        const response = await fetch(`${url}?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }

        const data = await response.json();
        setServices(data.data?.services || data.data || []);
        
      } catch (err: any) {
        console.error("Error:", err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchServices();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory, sortBy]);

  const getCategoryLabel = (category: string) => {
    return categoryLabels[category] || category;
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

  return (
    <div className="min-h-screen bg-slate-50 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 uppercase tracking-tight">
            Explore Paw<span className="text-[#4A90D9]">Med</span> Services
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Find the best diagnostic, medical, and surgical treatments for your companion.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 mb-10 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-4">
          
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search veterinary treatments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-slate-700 font-medium placeholder-slate-400 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative min-w-[180px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-slate-600 font-bold text-xs tracking-wider uppercase cursor-pointer appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>

            <div className="relative min-w-[180px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-slate-600 font-bold text-xs tracking-wider uppercase cursor-pointer appearance-none"
              >
                <option value="popular">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl mb-10 text-center font-semibold text-sm">
            ⚠️ {error}. Please check your server connection.
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="animate-pulse bg-white border border-slate-200 rounded-2xl h-[420px] flex flex-col p-4 space-y-4">
                <div className="bg-slate-200 h-44 rounded-xl w-full" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="mt-auto h-11 bg-slate-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <div 
                key={service._id} 
                className="flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-[440px] w-full"
              >
                <div className="h-44 relative bg-slate-100">
                  <img 
                    src={service.image || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600'} 
                    alt={service.name} 
                    className="w-full h-full object-cover" 
                  />
                  <span className={`absolute top-3 left-3 backdrop-blur-sm text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-lg ${getCategoryColor(service.category)}`}>
                    {getCategoryLabel(service.category)}
                  </span>
                  {service.requiresSpecialist && (
                    <span className="absolute top-3 right-3 bg-[#2C5F8A] text-white text-[9px] font-bold px-2 py-1 rounded-lg">
                      Specialist
                    </span>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-black text-[#1A1A2E] flex items-center">
                      <DollarSign className="w-4 h-4 text-slate-500" />
                      {service.price}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> 
                      {service.duration} min
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-800 text-base tracking-tight mb-2 line-clamp-1">
                    {service.name}
                  </h3>
                  
                  <p className="text-slate-500 text-xs line-clamp-3 mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-auto">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${service.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {service.isAvailable ? '✅ Available' : '❌ Unavailable'}
                    </span>
                  </div>

                  <Link 
                    href={`/services/${service._id}`} 
                    className="mt-4 block w-full text-center bg-[#4A90D9] hover:bg-[#2C5F8A] text-white text-xs font-bold py-3 rounded-xl transition-all duration-200"
                  >
                    VIEW DETAILS
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center">
            <div className="inline-flex p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Services Found</h3>
            <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search keywords.</p>
          </div>
        )}
      </div>
    </div>
  );
}