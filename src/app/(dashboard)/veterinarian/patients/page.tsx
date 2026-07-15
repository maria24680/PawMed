// src/app/veterinarian/patients/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PawPrint,
  Search,
  User,
  Calendar,
  Heart,
  Loader2,
  AlertCircle,
  Stethoscope,
  Clock
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Patient {
  _id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  dateOfBirth: string;
  weight: number;
  color: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  lastVisit?: string;
  isActive: boolean;
  createdAt: string;
}

export default function VeterinarianPatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as any;

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'veterinarian') {
      router.push('/');
      return;
    }
    fetchPatients();
  }, [user, isPending, router]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/pets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch patients');

      const data = await res.json();
      setPatients(data.data?.pets || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date: string) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isPending || loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A90D9]" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Patients...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <PawPrint className="w-6 h-6 text-[#4A90D9]" />
            My Patients
          </h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Manage all your patients
          </p>
        </div>
        <div className="text-xs text-slate-400 font-bold bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-[#4A90D9]" /> {patients.length} Patients
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, species, breed, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
          />
        </div>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <PawPrint className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No patients found</h3>
          <p className="text-slate-400 text-sm mt-1">
            {searchTerm ? 'Try adjusting your search' : 'No patients yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#ADD8E6] transition-all duration-300 group"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#4A90D9] transition-colors">
                      {patient.name}
                    </h3>
                    <p className="text-sm text-slate-500">{patient.breed}</p>
                  </div>
                  <span className="text-sm">{patient.gender === 'male' ? '♂️' : '♀️'}</span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-center">
                    {patient.species}
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-center">
                    {calculateAge(patient.dateOfBirth)} years
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-center">
                    {patient.weight} {patient.weightUnit}
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-center">
                    🎨 {patient.color}
                  </span>
                </div>

                {/* Owner Info */}
                {patient.owner && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {patient.owner.name}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      Last visit: {formatDate(patient.lastVisit)}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={`/veterinarian/patients/${patient._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#4A90D9] text-white rounded-xl text-xs font-bold hover:bg-[#2C5F8A] transition"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    View Record
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}