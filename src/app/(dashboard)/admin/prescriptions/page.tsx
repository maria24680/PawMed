// src/app/admin/prescriptions/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Pill,
  Search,
  User,
  Calendar,
  Stethoscope,
  Loader2,
  AlertTriangle,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  ArrowRight
} from 'lucide-react';
import { authFetch } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Prescription {
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
  client: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    refills: number;
    route: string;
    instructions?: string;
  }[];
  diagnosis: string;
  notes?: string;
  issuedDate: string;
  validUntil: string;
  isActive: boolean;
  isRefillable: boolean;
  refillsRemaining: number;
  createdAt: string;
}

const routeLabels: Record<string, string> = {
  oral: 'Oral',
  topical: 'Topical',
  injection: 'Injection',
  intravenous: 'Intravenous',
  subcutaneous: 'Subcutaneous',
};

export default function AdminPrescriptionsPage() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrescriptions();
  }, [searchTerm, filterStatus]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const res = await authFetch(`${API_URL}/prescriptions?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setPrescriptions(data.data?.prescriptions || []);
      } else {
        throw new Error(data.message || 'Failed to fetch prescriptions');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load prescriptions');
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

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredPrescriptions = prescriptions.filter((p) =>
    p.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.veterinarian?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: prescriptions.length,
    active: prescriptions.filter(p => p.isActive && !isExpired(p.validUntil)).length,
    expired: prescriptions.filter(p => !p.isActive || isExpired(p.validUntil)).length,
    refillable: prescriptions.filter(p => p.isRefillable).length,
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A90D9]" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Prescriptions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <Pill className="w-6 h-6 text-[#4A90D9]" />
            Prescriptions
          </h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Manage all prescriptions across the platform
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-black text-slate-800">{stats.total}</p>
          <p className="text-xs text-slate-400 font-medium">Total</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-black text-green-600">{stats.active}</p>
          <p className="text-xs text-slate-400 font-medium">Active</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-black text-red-600">{stats.expired}</p>
          <p className="text-xs text-slate-400 font-medium">Expired</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-black text-blue-600">{stats.refillable}</p>
          <p className="text-xs text-slate-400 font-medium">Refillable</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by pet, diagnosis, or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm min-w-[140px]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="refillable">Refillable</option>
          </select>
        </div>
      </div>

      {/* Prescriptions List */}
      {filteredPrescriptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <Pill className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No prescriptions found</h3>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => {
            const expired = isExpired(prescription.validUntil);
            const isActive = prescription.isActive && !expired;

            return (
              <div
                key={prescription._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#ADD8E6] transition-all duration-300 overflow-hidden"
              >
                <div className="p-5 cursor-pointer" onClick={() => toggleExpand(prescription._id)}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-[#ADD8E6]/20 p-3 rounded-xl">
                        <FileText className="w-6 h-6 text-[#4A90D9]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-800 text-lg">
                            {prescription.pet?.name || 'Unknown Pet'}
                          </h3>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-sm text-slate-500">
                            {prescription.diagnosis}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {prescription.client?.name || 'Unknown Client'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Stethoscope className="w-3.5 h-3.5" />
                            {prescription.veterinarian?.name || 'Unknown Vet'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(prescription.issuedDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {isActive ? 'Active' : 'Expired'}
                      </span>
                      {prescription.isRefillable && (
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          {prescription.refillsRemaining} refills
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {prescription.medications.length} meds
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === prescription._id && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100">
                    <div className="space-y-4">
                      {/* Medications */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Medications
                        </h4>
                        <div className="space-y-2">
                          {prescription.medications.map((med, index) => (
                            <div key={index} className="bg-slate-50 p-3 rounded-xl">
                              <div className="flex items-center justify-between">
                                <p className="font-semibold text-slate-800">{med.name}</p>
                                <span className="text-xs text-slate-500">{routeLabels[med.route] || med.route}</span>
                              </div>
                              <p className="text-sm text-slate-600">{med.dosage} • {med.frequency}</p>
                              <p className="text-xs text-slate-400">Duration: {med.duration}</p>
                              {med.instructions && (
                                <p className="text-xs text-slate-500 mt-1">{med.instructions}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      {prescription.notes && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Notes
                          </h4>
                          <p className="text-sm text-slate-600">{prescription.notes}</p>
                        </div>
                      )}

                      {/* Validity */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-slate-400">Issued Date</p>
                          <p className="font-medium text-slate-800">{formatDate(prescription.issuedDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Valid Until</p>
                          <p className={`font-medium ${expired ? 'text-red-500' : 'text-slate-800'}`}>
                            {formatDate(prescription.validUntil)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/admin/prescriptions/${prescription._id}`}
                          className="px-4 py-2 text-xs font-bold text-[#4A90D9] border border-[#4A90D9] rounded-lg hover:bg-[#4A90D9] hover:text-white transition flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}