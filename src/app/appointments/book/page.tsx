// src/app/appointments/book/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, PawPrint, User, ChevronLeft, Loader2, CalendarDays, Stethoscope } from 'lucide-react';
import { authFetch } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Service {
  _id: string;
  name: string;
  title: string;
  price: number;
  duration: number;
  category: string;
  description: string;
}

interface Veterinarian {
  _id: string;
  name: string;
  specialization: string[];
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');

  const [service, setService] = useState<Service | null>(null);
  const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    veterinarianId: '',
    appointmentType: 'consultation',
    date: '',
    time: '',
    symptoms: '',
    notes: '',
    priority: 'normal',
    amount: 0,
  });

  // Fetch service and veterinarians
  useEffect(() => {
    const fetchData = async () => {
      if (!serviceId) {
        toast.error('No service selected');
        router.push('/services');
        return;
      }

      try {
        setLoading(true);
        
        // Fetch service details
        const serviceRes = await fetch(`${API_URL}/services/${serviceId}`);
        const serviceData = await serviceRes.json();
        
        if (serviceData.success) {
          const serviceInfo = serviceData.data?.service || serviceData.data;
          setService(serviceInfo);
          setFormData(prev => ({
            ...prev,
            appointmentType: serviceInfo.category || 'consultation',
            amount: serviceInfo.price || 0,
          }));
        } else {
          toast.error('Service not found');
          router.push('/services');
          return;
        }

        // Fetch veterinarians (you'll need to add this endpoint or get from users)
        // For now, let's use a mock list or fetch from users with role 'veterinarian'
        const vetRes = await authFetch(`${API_URL}/api/admin/users?role=veterinarian`);
        const vetData = await vetRes.json();
        
        if (vetData.success) {
          const vets = vetData.data?.users?.filter((u: any) => u.role === 'veterinarian') || [];
          setVeterinarians(vets);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [serviceId, router]);

  // Fetch user's pets
  const [pets, setPets] = useState<any[]>([]);
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await authFetch(`${API_URL}/api/pets`);
        const data = await res.json();
        if (data.success) {
          setPets(data.data?.pets || []);
        }
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };
    fetchPets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Prepare data matching your backend schema
      const appointmentData = {
        petId: formData.petId,
        veterinarianId: formData.veterinarianId,
        appointmentType: formData.appointmentType,
        date: formData.date,
        time: formData.time,
        symptoms: formData.symptoms ? formData.symptoms.split(',').map(s => s.trim()) : [],
        notes: formData.notes,
        priority: formData.priority,
        amount: formData.amount,
      };

      const res = await authFetch(`${API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Appointment booked successfully!');
        // Redirect to appointments list or confirmation page
        router.push('/appointments');
      } else {
        toast.error(data.message || 'Failed to book appointment');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A90D9]" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Service not found</p>
          <Link href="/services" className="text-[#4A90D9] hover:underline">
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  // Get today's date for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-[#4A90D9] text-xs font-bold uppercase tracking-wider mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <CalendarDays className="w-6 h-6 text-[#4A90D9]" />
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Book Appointment
            </h1>
          </div>

          {/* Service Summary */}
          <div className="bg-gradient-to-r from-[#1A1A2E] to-[#2A2A4E] text-white p-4 rounded-2xl mb-6">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Selected Service</p>
            <p className="font-bold text-lg mt-1">{service.name || service.title}</p>
            <p className="text-sm text-slate-300 mt-0.5">{service.description}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {service.duration || 30} mins
              </span>
              <span>•</span>
              <span className="font-bold text-[#ADD8E6]">${service.price}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Pet Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Pet <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.petId}
                onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
              >
                <option value="">Select a pet</option>
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name} ({pet.species} - {pet.breed})
                  </option>
                ))}
              </select>
              {pets.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  No pets found. Please <Link href="/pets/add" className="text-[#4A90D9] font-bold hover:underline">add a pet</Link> first.
                </p>
              )}
            </div>

            {/* Veterinarian Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Veterinarian <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.veterinarianId}
                onChange={(e) => setFormData({ ...formData, veterinarianId: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
              >
                <option value="">Select a veterinarian</option>
                {veterinarians.map((vet) => (
                  <option key={vet._id} value={vet._id}>
                    {vet.name} {vet.specialization && `- ${vet.specialization.join(', ')}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Appointment Type <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.appointmentType}
                onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
              >
                <option value="checkup">Checkup</option>
                <option value="vaccination">Vaccination</option>
                <option value="surgery">Surgery</option>
                <option value="dental">Dental</option>
                <option value="emergency">Emergency</option>
                <option value="followup">Follow-up</option>
                <option value="consultation">Consultation</option>
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
                />
              </div>
            </div>

            {/* Symptoms and Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Symptoms (comma separated)
              </label>
              <input
                type="text"
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
                placeholder="e.g., fever, cough, lethargy"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm resize-none"
                rows={3}
                placeholder="Any special requirements or concerns..."
              />
            </div>

            {/* Priority (hidden but included for completeness) */}
            <input
              type="hidden"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            />

            <button
              type="submit"
              disabled={submitting || pets.length === 0}
              className="w-full bg-[#4A90D9] text-white hover:bg-[#2C5F8A] py-3.5 rounded-2xl font-black text-xs tracking-widest uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Booking...
                </span>
              ) : (
                `Confirm Appointment - ${service.price ? '$' + service.price : ''}`
              )}
            </button>

            <p className="text-center text-[10px] text-slate-400 font-medium">
              <Stethoscope className="w-3.5 h-3.5 inline mr-1" />
              Secure booking with certified veterinarians
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}