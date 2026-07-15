'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  PawPrint,
  Pill,
  Stethoscope,
  Clock,
  Users,
  Loader2,
  Plus,
  AlertTriangle,
  Heart,
  ArrowRight,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { authFetch } from '@/lib/auth-client';

interface VetStats {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  todayAppointments: number;
  totalPrescriptions: number;
  totalPatients: number;
  completionRate: number;
}

export default function VeterinarianDashboardPage() {
  const [stats, setStats] = useState<VetStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user.name || '');
      } catch (e) {
        console.error('Error parsing user data');
      }
    }

    const fetchData = async () => {
      try {
        // Fetch Vet Stats
        const statsResponse = await authFetch('http://localhost:8000/api/veterinarian/stats');
        const statsPayload = await statsResponse.json();

        if (statsResponse.ok && statsPayload.success) {
          setStats(statsPayload.data);
        }

        // Fetch Appointments
        const appointmentsResponse = await authFetch('http://localhost:8000/api/veterinarian/appointments');

        if (appointmentsResponse.ok) {
          const aptData = await appointmentsResponse.json();
          setAppointments(aptData.data?.appointments || []);
        }

      } catch (err: any) {
        console.error('❌ Error fetching data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Get today's appointments (next 5)
  const getTodayAppointments = () => {
    const today = new Date().toDateString();
    return appointments
      .filter((apt: any) => new Date(apt.date).toDateString() === today)
      .sort((a: any, b: any) => a.time.localeCompare(b.time))
      .slice(0, 5);
  };

  const todayAppointments = getTodayAppointments();

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A90D9]" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" /> {error}
      </div>
    );
  }

  const statCards = [
    {
      label: "Today's Appointments",
      value: stats?.todayAppointments || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/veterinarian/appointments'
    },
    {
      label: 'Total Patients',
      value: stats?.totalPatients || 0,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      href: '/veterinarian/patients'
    },
    {
      label: 'Prescriptions',
      value: stats?.totalPrescriptions || 0,
      icon: Pill,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      href: '/veterinarian/prescriptions'
    },
    {
      label: 'Completion Rate',
      value: `${stats?.completionRate || 0}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      href: '/veterinarian/appointments'
    },
  ];

  const quickActions = [
    { label: 'New Prescription', href: '/veterinarian/prescriptions/new', icon: Pill, color: 'bg-amber-500' },
    { label: 'Add Medical Record', href: '/veterinarian/medical-records/new', icon: Stethoscope, color: 'bg-purple-500' },
    { label: "Today's Schedule", href: '/veterinarian/appointments', icon: Calendar, color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
            Good Morning, Dr. {userName?.split(' ').pop() || 'Veterinarian'}! 🏥
          </h2>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Here&apos;s your clinical overview for today
          </p>
        </div>
        <div className="text-xs text-slate-400 font-bold bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#4A90D9]" /> Shift: On Duty
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Link
              key={index}
              href={action.href}
              className={`${action.color} text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all flex items-center gap-2`}
            >
              <Icon className="w-4 h-4" />
              {action.label}
            </Link>
          );
        })}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={index}
              href={card.href}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#ADD8E6] transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {card.label}
                  </p>
                  <h3 className="text-2xl font-black text-slate-800 group-hover:text-[#4A90D9] transition-colors">
                    {card.value}
                  </h3>
                </div>
                <div className={`${card.bg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#4A90D9]" />
            Today's Appointments
          </h3>
          <Link href="/veterinarian/appointments" className="text-xs text-[#4A90D9] hover:text-[#2C5F8A] font-medium flex items-center gap-1">
            View All
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {todayAppointments.length > 0 ? (
            todayAppointments.map((apt: any) => {
              const statusColor =
                apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                apt.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                apt.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                'bg-yellow-100 text-yellow-700';

              return (
                <div key={apt._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-2 rounded-lg">
                      <PawPrint className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{apt.pet?.name || 'Unknown Pet'}</p>
                      <p className="text-xs text-slate-400">{apt.client?.name || 'Unknown Client'} • {apt.appointmentType || 'Checkup'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500">{formatTime(apt.time)}</span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
                      {apt.status ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1).replace('-', ' ') : 'Scheduled'}
                    </span>
                    <Link href={`/veterinarian/appointments/${apt._id}`} className="text-[#4A90D9] hover:text-[#2C5F8A]">
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-8 text-center">
              <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No appointments scheduled for today</p>
              <p className="text-xs text-gray-400">Enjoy your day! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}