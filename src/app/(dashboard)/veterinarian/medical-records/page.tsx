// src/app/veterinarian/medical-records/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Stethoscope,
  Search,
  Calendar,
  User,
  PawPrint,
  Loader2,
  AlertCircle,
  FileText,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface MedicalRecord {
  _id: string;
  pet: {
    _id: string;
    name: string;
    species: string;
    breed: string;
  };
  veterinarian: {
    _id: string;
    name: string;
    specialization: string[];
  };
  visitDate: string;
  chiefComplaint: string;
  diagnosis: string;
  treatment: string;
  status: 'active' | 'resolved' | 'chronic';
  followUpDate?: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  active: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  chronic: 'bg-blue-100 text-blue-700',
};

export default function VeterinarianMedicalRecordsPage() {
  const router = useRouter();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
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
    fetchRecords();
  }, [user, isPending, router]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/medicalrecords`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch medical records');

      const data = await res.json();
      setRecords(data.data?.medicalRecords || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredRecords = records.filter((record) =>
    record.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.chiefComplaint?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isPending || loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A90D9]" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Medical Records...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-[#4A90D9]" />
            Medical Records
          </h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            View all medical records
          </p>
        </div>
        <Link
          href="/veterinarian/medical-records/new"
          className="bg-[#4A90D9] hover:bg-[#2C5F8A] text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          New Record
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-black text-slate-800">{records.length}</p>
          <p className="text-xs text-slate-400 font-medium">Total</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-black text-yellow-600">
            {records.filter(r => r.status === 'active').length}
          </p>
          <p className="text-xs text-slate-400 font-medium">Active</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-black text-green-600">
            {records.filter(r => r.status === 'resolved').length}
          </p>
          <p className="text-xs text-slate-400 font-medium">Resolved</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-black text-blue-600">
            {records.filter(r => r.status === 'chronic').length}
          </p>
          <p className="text-xs text-slate-400 font-medium">Chronic</p>
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
            placeholder="Search by pet, diagnosis, or complaint..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
          />
        </div>
      </div>

      {/* Records List */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <Stethoscope className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No medical records found</h3>
          <p className="text-slate-400 text-sm mt-1">
            {searchTerm ? 'Try adjusting your search' : 'No records yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div
              key={record._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#ADD8E6] transition-all duration-300 p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-[#ADD8E6]/20 p-3 rounded-xl">
                    <FileText className="w-6 h-6 text-[#4A90D9]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800 text-lg">
                        {record.pet?.name || 'Unknown Pet'}
                      </h3>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-sm text-slate-500">
                        {record.pet?.species || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(record.visitDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5" />
                        {record.diagnosis}
                      </span>
                      {record.followUpDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Follow-up: {formatDate(record.followUpDate)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{record.chiefComplaint}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[record.status]}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                  <Link
                    href={`/veterinarian/medical-records/${record._id}`}
                    className="px-3 py-1.5 text-xs font-bold text-[#4A90D9] border border-[#4A90D9] rounded-lg hover:bg-[#4A90D9] hover:text-white transition flex items-center gap-1"
                  >
                    View
                    <ArrowRight className="w-3.5 h-3.5" />
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