// src/app/(dashboard)/client/appointments/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  PawPrint,
  User,
  Stethoscope,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Plus,
  Search,
  AlertCircle,
  Loader2,
  CalendarCheck,
  CalendarX,
  CalendarClock
} from 'lucide-react';
import { authClient, authFetch, getCurrentUser, isAuthenticated, getOrCreateToken } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Appointment {
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
  appointmentType: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  symptoms?: string[];
  priority: string;
  notes?: string;
  paymentStatus: string;
  amount?: number;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  scheduled: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
  'no-show': 'bg-red-100 text-red-700',
};

const statusIcons: Record<string, any> = {
  scheduled: CalendarClock,
  confirmed: CheckCircle,
  'in-progress': ClockIcon,
  completed: CalendarCheck,
  cancelled: CalendarX,
  'no-show': XCircle,
};

const appointmentTypeLabels: Record<string, string> = {
  checkup: 'Checkup',
  vaccination: 'Vaccination',
  surgery: 'Surgery',
  dental: 'Dental',
  emergency: 'Emergency',
  followup: 'Follow-up',
  consultation: 'Consultation',
};

export default function ClientAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as any;

  useEffect(() => {
    const initAuth = async () => {
      if (isPending) return;
      
      // Check authentication
      const authenticated = await isAuthenticated();
      const currentUser = await getCurrentUser();
      
      if (!authenticated && !currentUser) {
        router.push('/auth/login');
        return;
      }
      
      // Ensure we have a JWT token
      if (authenticated) {
        const token = await getOrCreateToken();
        if (!token) {
          console.warn('Could not create JWT token');
        }
      }
      
      fetchAppointments();
    };
    
    initAuth();
  }, [user, isPending, router]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    
    try {
      // FIX: Remove duplicate /api from the URL
      // API_URL already includes /api, so we just need to add /appointments
      const url = `${API_URL}/appointments`;
      console.log('Fetching appointments from:', url);
      
      const response = await authFetch(url);

      console.log('Appointments response status:', response.status);

      if (response.status === 401) {
        // Try to get a fresh token
        const token = await getOrCreateToken();
        if (!token) {
          toast.error('Please login again');
          router.push('/auth/login');
          return;
        }
        
        // Retry with new token
        const retryResponse = await authFetch(`${API_URL}/appointments`);
        if (retryResponse.status === 401) {
          toast.error('Please login again');
          router.push('/auth/login');
          return;
        }
        
        const retryData = await retryResponse.json();
        if (retryData.success) {
          setAppointments(retryData.data?.appointments || []);
          return;
        }
        throw new Error(retryData.message || 'Failed to load appointments');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch appointments (${response.status})`);
      }

      const data = await response.json();
      console.log('Appointments data received:', data.success);

      if (data.success) {
        setAppointments(data.data?.appointments || []);
      } else {
        throw new Error(data.message || 'Failed to load appointments');
      }
    } catch (err: any) {
      console.error('Fetch appointments error:', err);
      setError(err.message || 'Failed to load appointments');
      toast.error(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSession = async () => {
    toast.loading('Refreshing session...');
    try {
      const token = await getOrCreateToken();
      if (token) {
        toast.success('Session refreshed!');
        await fetchAppointments();
      } else {
        toast.error('Failed to refresh session');
      }
    } catch (error) {
      toast.error('Failed to refresh session');
    }
  };

  const getStatusBadge = (status: string) => {
    const Icon = statusIcons[status] || AlertCircle;
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${statusColors[status]}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const formatDate = (date: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    if (!time) return 'N/A';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter = filter === 'all' || apt.status === filter;
    const matchesSearch = 
      apt.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.veterinarian?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.appointmentType?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'scheduled').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  if (isPending || loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A90D9]" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Appointments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#4A90D9]" />
            My Appointments
          </h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Manage all your pet appointments
          </p>
        </div>
        <Link
          href="/client/appointments/book"
          className="bg-[#4A90D9] hover:bg-[#2C5F8A] text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Book Appointment
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-black text-slate-800">{stats.total}</p>
          <p className="text-xs text-slate-400 font-medium">Total</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-black text-yellow-600">{stats.scheduled}</p>
          <p className="text-xs text-slate-400 font-medium">Scheduled</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-black text-green-600">{stats.confirmed}</p>
          <p className="text-xs text-slate-400 font-medium">Confirmed</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-black text-blue-600">{stats.completed}</p>
          <p className="text-xs text-slate-400 font-medium">Completed</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> 
          <span>{error}</span>
          <div className="ml-auto flex gap-2">
            <button 
              onClick={handleRefreshSession}
              className="px-3 py-1 bg-amber-100 hover:bg-amber-200 rounded-lg text-amber-700 transition text-[10px] uppercase tracking-wider font-bold"
            >
              Refresh Session
            </button>
            <button 
              onClick={fetchAppointments}
              className="px-3 py-1 bg-rose-100 hover:bg-rose-200 rounded-lg text-rose-700 transition text-[10px] uppercase tracking-wider font-bold"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by pet, doctor, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  filter === status
                    ? 'bg-[#4A90D9] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No appointments found</h3>
          <p className="text-slate-400 text-sm mt-1">
            {searchTerm ? 'Try adjusting your search' : 'Book your first appointment'}
          </p>
          {!searchTerm && (
            <Link
              href="/client/appointments/book"
              className="inline-block mt-4 px-6 py-2.5 bg-[#4A90D9] text-white rounded-xl text-sm font-bold hover:bg-[#2C5F8A] transition"
            >
              Book Appointment
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#ADD8E6] transition-all duration-300 p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-[#ADD8E6]/20 p-3 rounded-xl shrink-0">
                    <PawPrint className="w-6 h-6 text-[#4A90D9]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800 text-lg">{apt.pet?.name || 'Unknown Pet'}</h3>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-sm text-slate-500 truncate">{apt.pet?.species || 'Unknown'} • {apt.pet?.breed || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-sm font-medium text-slate-600">{apt.veterinarian?.name || 'Unknown Vet'}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{apt.veterinarian?.specialization?.join(', ') || 'General'}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(apt.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(apt.time)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5" />
                        {appointmentTypeLabels[apt.appointmentType] || apt.appointmentType}
                      </span>
                    </div>
                    {apt.symptoms && apt.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {apt.symptoms.map((s, i) => (
                          <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  {getStatusBadge(apt.status)}
                  <Link
                    href={`/client/appointments/${apt._id}`}
                    className="px-4 py-2 text-xs font-bold text-[#4A90D9] border-2 border-[#4A90D9] rounded-xl hover:bg-[#4A90D9] hover:text-white transition"
                  >
                    View Details
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