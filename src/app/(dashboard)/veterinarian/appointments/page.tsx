// src/app/veterinarian/appointments/page.tsx

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
  Search,
  Loader2,
  AlertCircle,
  CalendarCheck,
  CalendarX,
  CalendarClock,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Appointment {
  _id: string;
  client: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  pet: {
    _id: string;
    name: string;
    species: string;
    breed: string;
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

const statusActions: Record<string, string[]> = {
  scheduled: ['confirm', 'cancel'],
  confirmed: ['start', 'cancel'],
  'in-progress': ['complete'],
  completed: [],
  cancelled: [],
  'no-show': [],
};

export default function VeterinarianAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
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
    fetchAppointments();
  }, [user, isPending, router]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/veterinarian/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch appointments');

      const data = await res.json();
      setAppointments(data.data?.appointments || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId: string, status: string) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/appointments/${appointmentId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
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
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter = filter === 'all' || apt.status === filter;
    const matchesSearch = apt.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.appointmentType?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: appointments.length,
    today: appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length,
    pending: appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length,
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
    <div className="space-y-6 max-w-7xl mx-auto w-full font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-[#4A90D9]" />
            Appointments
          </h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Manage all your appointments
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
          <p className="text-2xl font-black text-blue-600">{stats.today}</p>
          <p className="text-xs text-slate-400 font-medium">Today</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-black text-yellow-600">{stats.pending}</p>
          <p className="text-xs text-slate-400 font-medium">Pending</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-2xl font-black text-green-600">{stats.completed}</p>
          <p className="text-xs text-slate-400 font-medium">Completed</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by pet, client, or type..."
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
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
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
            {searchTerm ? 'Try adjusting your search' : 'No appointments scheduled'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#ADD8E6] transition-all duration-300 p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-[#ADD8E6]/20 p-3 rounded-xl">
                    <PawPrint className="w-6 h-6 text-[#4A90D9]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800 text-lg">{apt.pet?.name || 'Unknown Pet'}</h3>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-sm text-slate-500">{apt.pet?.species || 'Unknown'} • {apt.pet?.breed || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-sm font-medium text-slate-600 flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {apt.client?.name || 'Unknown Client'}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{apt.appointmentType}</span>
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
                      {apt.priority === 'emergency' && (
                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                          Emergency
                        </span>
                      )}
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

                <div className="flex flex-col items-end gap-3">
                  {getStatusBadge(apt.status)}
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {statusActions[apt.status]?.includes('confirm') && (
                      <button
                        onClick={() => updateStatus(apt._id, 'confirmed')}
                        className="px-3 py-1.5 text-xs font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Confirm
                      </button>
                    )}
                    {statusActions[apt.status]?.includes('start') && (
                      <button
                        onClick={() => updateStatus(apt._id, 'in-progress')}
                        className="px-3 py-1.5 text-xs font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        Start
                      </button>
                    )}
                    {statusActions[apt.status]?.includes('complete') && (
                      <button
                        onClick={() => updateStatus(apt._id, 'completed')}
                        className="px-3 py-1.5 text-xs font-bold bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Complete
                      </button>
                    )}
                    {statusActions[apt.status]?.includes('cancel') && (
                      <button
                        onClick={() => updateStatus(apt._id, 'cancelled')}
                        className="px-3 py-1.5 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    )}
                    <Link
                      href={`/veterinarian/appointments/${apt._id}`}
                      className="px-3 py-1.5 text-xs font-bold text-[#4A90D9] border border-[#4A90D9] rounded-lg hover:bg-[#4A90D9] hover:text-white transition"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}