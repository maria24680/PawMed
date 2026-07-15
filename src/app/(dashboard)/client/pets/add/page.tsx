// src/app/client/pets/add/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  PawPrint,
  Loader2,
  CheckCircle2,
  User,
  Calendar,
  Weight,
  Ruler,
  Heart,
  Tag,
  AlertCircle
} from 'lucide-react';
import { authClient, authFetch } from '@/lib/auth-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface PetFormData {
  name: string;
  species: string;
  breed: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'neutered' | 'spayed';
  weight: number;
  weightUnit: 'kg' | 'lbs';
  color: string;
  microchipId?: string;
  allergies?: string;
  chronicConditions?: string;
}

const speciesList = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'];

export default function AddPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as any;

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, isPending, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PetFormData>({
    defaultValues: {
      weightUnit: 'kg',
      gender: 'male',
    },
  });

  const watchSpecies = watch('species');

  const onSubmit = async (data: PetFormData) => {
    setLoading(true);
    setError('');
    
    try {
      const petData = {
        name: data.name,
        species: data.species,
        breed: data.breed,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        weight: data.weight,
        weightUnit: data.weightUnit,
        color: data.color,
        microchipId: data.microchipId || undefined,
        allergies: data.allergies ? data.allergies.split(',').map((s: string) => s.trim()) : [],
        chronicConditions: data.chronicConditions ? data.chronicConditions.split(',').map((s: string) => s.trim()) : [],
      };

      const res = await authFetch(`${API_URL}/pets`, {
        method: 'POST',
        body: JSON.stringify(petData),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.message || result.error || 'Failed to add pet');
      }

      if (!result.success) {
        throw new Error(result.message || 'Failed to add pet');
      }

      setSuccess(true);
      toast.success('Pet added successfully! 🎉');

      setTimeout(() => {
        router.push('/client/pets');
      }, 1500);

    } catch (err: any) {
      console.error('Add pet error:', err);
      setError(err.message || 'Failed to add pet. Please try again.');
      toast.error(err.message || 'Failed to add pet');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A90D9]" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A2E]">Pet Added Successfully!</h2>
        <p className="text-slate-500 mt-1">Redirecting to your pets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/client/pets"
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-[#4A90D9]" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#1A1A2E] uppercase tracking-tight flex items-center gap-2">
            <PawPrint className="w-6 h-6 text-[#4A90D9]" />
            Add New Pet
          </h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Register your beloved pet
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
              Pet Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <PawPrint className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A90D9]" />
              <input
                {...register('name', { required: 'Pet name is required' })}
                type="text"
                placeholder="Enter pet name"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-[#1A1A2E] placeholder:text-slate-400"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Species & Breed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
                Species <span className="text-red-500">*</span>
              </label>
              <select
                {...register('species', { required: 'Species is required' })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-[#1A1A2E]"
              >
                <option value="" className="text-slate-400">Select Species</option>
                {speciesList.map((species) => (
                  <option key={species} value={species} className="text-[#1A1A2E]">{species}</option>
                ))}
              </select>
              {errors.species && (
                <p className="mt-1 text-xs text-red-500">{errors.species.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
                Breed <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A90D9]" />
                <input
                  {...register('breed', { required: 'Breed is required' })}
                  type="text"
                  placeholder="Enter breed"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-[#1A1A2E] placeholder:text-slate-400"
                />
              </div>
              {errors.breed && (
                <p className="mt-1 text-xs text-red-500">{errors.breed.message}</p>
              )}
            </div>
          </div>

          {/* Date of Birth & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A90D9]" />
                <input
                  {...register('dateOfBirth', { required: 'Date of birth is required' })}
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-[#1A1A2E]"
                />
              </div>
              {errors.dateOfBirth && (
                <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                {...register('gender', { required: 'Gender is required' })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-[#1A1A2E]"
              >
                <option value="male" className="text-[#1A1A2E]">Male ♂️</option>
                <option value="female" className="text-[#1A1A2E]">Female ♀️</option>
                <option value="neutered" className="text-[#1A1A2E]">Neutered</option>
                <option value="spayed" className="text-[#1A1A2E]">Spayed</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>
              )}
            </div>
          </div>

          {/* Weight & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
                Weight <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A90D9]" />
                  <input
                    {...register('weight', {
                      required: 'Weight is required',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Weight must be positive' }
                    })}
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-[#1A1A2E] placeholder:text-slate-400"
                  />
                </div>
                <select
                  {...register('weightUnit')}
                  className="w-24 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-[#1A1A2E]"
                >
                  <option value="kg" className="text-[#1A1A2E]">kg</option>
                  <option value="lbs" className="text-[#1A1A2E]">lbs</option>
                </select>
              </div>
              {errors.weight && (
                <p className="mt-1 text-xs text-red-500">{errors.weight.message}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
                Color <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A90D9]" />
                <input
                  {...register('color', { required: 'Color is required' })}
                  type="text"
                  placeholder="e.g. Golden, Black, White"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-[#1A1A2E] placeholder:text-slate-400"
                />
              </div>
              {errors.color && (
                <p className="mt-1 text-xs text-red-500">{errors.color.message}</p>
              )}
            </div>
          </div>

          {/* Microchip ID (Optional) */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
              Microchip ID (Optional)
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A90D9]" />
              <input
                {...register('microchipId')}
                type="text"
                placeholder="Enter microchip number"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-[#1A1A2E] placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Allergies (Optional) */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
              Allergies (comma separated)
            </label>
            <div className="relative">
              <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A90D9]" />
              <input
                {...register('allergies')}
                type="text"
                placeholder="e.g. Peanuts, Dust, Pollen"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-[#1A1A2E] placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Chronic Conditions (Optional) */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1A1A2E]">
              Chronic Conditions (comma separated)
            </label>
            <div className="relative">
              <Heart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A90D9]" />
              <input
                {...register('chronicConditions')}
                type="text"
                placeholder="e.g. Arthritis, Diabetes, Heart Disease"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-[#1A1A2E] placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4A90D9] text-white rounded-xl font-bold hover:bg-[#2C5F8A] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Adding Pet...
              </>
            ) : (
              'Add Pet'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}