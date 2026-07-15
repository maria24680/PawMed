// src/app/admin/services/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Stethoscope,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  Clock,
  Loader2,
  AlertTriangle,
  Filter,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';
import { authFetch } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  isAvailable: boolean;
  requiresSpecialist: boolean;
  preparationInstructions?: string;
  aftercareInstructions?: string;
  image?: string;
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  consultation: 'Consultation',
  vaccination: 'Vaccination',
  surgery: 'Surgery',
  dental: 'Dental Care',
  diagnostic: 'Diagnostic',
  emergency: 'Emergency',
  wellness: 'Wellness',
  specialist: 'Specialist',
};

export default function AdminServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchServices();
  }, [searchTerm, filterCategory]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterCategory !== 'all') params.append('category', filterCategory);

      const res = await authFetch(`${API_URL}/services?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setServices(data.data?.services || []);
      } else {
        throw new Error(data.message || 'Failed to fetch services');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      const res = await authFetch(`${API_URL}/services/${serviceId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Service deleted successfully');
        fetchServices();
      } else {
        throw new Error(data.message || 'Failed to delete service');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete service');
    }
  };

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const categories = [
    'consultation', 'vaccination', 'surgery', 'dental',
    'diagnostic', 'emergency', 'wellness', 'specialist'
  ];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A90D9]" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Services...</p>
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
            Services
          </h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Manage all veterinary services
          </p>
        </div>
        <Link
          href="/admin/services/add"
          className="bg-[#4A90D9] hover:bg-[#2C5F8A] text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search services by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm min-w-[140px]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{categoryLabels[cat]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <Stethoscope className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No services found</h3>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#ADD8E6] transition-all duration-300 group"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#4A90D9] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-slate-500">{categoryLabels[service.category] || service.category}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    service.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {service.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <p className="text-sm text-slate-600 mt-2 line-clamp-2">{service.description}</p>

                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="font-bold text-[#4A90D9] flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {formatBDT(service.price)}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {service.duration} min
                  </span>
                  {service.requiresSpecialist && (
                    <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                      Specialist
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={`/admin/services/${service._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#4A90D9] text-white rounded-xl text-xs font-bold hover:bg-[#2C5F8A] transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                  <Link
                    href={`/admin/services/${service._id}/edit`}
                    className="flex items-center justify-center p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                  >
                    <Edit className="w-4 h-4 text-slate-500" />
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setShowDeleteModal(true);
                    }}
                    className="flex items-center justify-center p-2 border border-slate-200 rounded-xl hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Service</h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to delete <span className="font-semibold text-slate-800">{selectedService.name}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteService(selectedService._id);
                  setShowDeleteModal(false);
                }}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
              >
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}