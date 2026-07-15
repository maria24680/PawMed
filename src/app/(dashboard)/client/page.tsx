'use client';

import React, { useState, useEffect } from 'react';
import {
  PawPrint,
  Calendar,
  CreditCard,
  Pill,
  Loader2,
  Plus,
  AlertTriangle,
  Clock,
  Heart,
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import Link from 'next/link';
import { authFetch } from '@/lib/auth-client';

interface ClientStats {
  myPetsCount: number;
  activeBookings: number;
  prescriptionsCount: number;
  totalSpent: number;
  upcomingAppointments?: number;
  totalAppointments?: number;
}

export default function ClientDashboardPage() {
  const [stats, setStats] = useState<ClientStats | null>(null);
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
        // Fetch Client Stats - Note: This endpoint may not exist, use appointments instead
        const appointmentsResponse = await authFetch('http://localhost:8000/api/appointments');
        
        if (appointmentsResponse.ok) {
          const aptData = await appointmentsResponse.json();
          const apts = aptData.data?.appointments || [];
          setAppointments(apts);
          
          // Calculate stats from appointments
          const activeBookings = apts.filter((a: any) => 
            a.status === 'scheduled' || a.status === 'confirmed' || a.status === 'in-progress'
          ).length;
          
          // Get pets count - might need a separate endpoint
          const petsResponse = await authFetch('http://localhost:8000/api/pets');
          let petsCount = 0;
          if (petsResponse.ok) {
            const petsData = await petsResponse.json();
            petsCount = petsData.data?.pets?.length || 0;
          }
          
          setStats({
            myPetsCount: petsCount,
            activeBookings: activeBookings,
            prescriptionsCount: 0, // Will need prescriptions endpoint
            totalSpent: 0, // Will need payments endpoint
            totalAppointments: apts.length
          });
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

  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('bn-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get upcoming appointments (next 3)
  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments
      .filter((apt: any) => new Date(apt.date) >= now)
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 3);
  };

  const upcomingAppointments = getUpcomingAppointments();

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
      label: 'My Pets',
      value: stats?.myPetsCount || 0,
      icon: PawPrint,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      href: '/client/pets'
    },
    {
      label: 'Active Bookings',
      value: stats?.activeBookings || 0,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/client/appointments'
    },
    {
      label: 'Prescriptions',
      value: stats?.prescriptionsCount || 0,
      icon: Pill,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      href: '/client/prescriptions'
    },
    {
      label: 'Total Spent',
      value: formatBDT(stats?.totalSpent || 0),
      icon: CreditCard,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      href: '/client/payments'
    },
  ];

  const quickActions = [
    { label: 'Add New Pet', href: '/client/pets/add', icon: Plus, color: 'bg-purple-500' },
    { label: 'Book Appointment', href: '/client/appointments/book', icon: Calendar, color: 'bg-blue-500' },
    { label: 'View Prescriptions', href: '/client/prescriptions', icon: Pill, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
            Welcome Back, {userName || 'Pet Parent'}! 👋
          </h2>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Here&apos;s what&apos;s happening with your pets
          </p>
        </div>
        <Link 
          href="/client/appointments/book" 
          className="bg-[#4A90D9] hover:bg-[#2C5F8A] text-white text-[11px] font-black tracking-widest uppercase px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Book Appointment
        </Link>
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
                <div className={`p-3 ${card.bg} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#4A90D9]" />
            Upcoming Appointments
          </h3>
          <Link href="/client/appointments" className="text-xs text-[#4A90D9] hover:text-[#2C5F8A] font-medium flex items-center gap-1">
            View All
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((apt: any) => {
              const statusColor = 
                apt.status === 'confirmed' || apt.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                apt.status === 'scheduled' || apt.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                apt.status === 'completed' || apt.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                'bg-gray-100 text-gray-700';
              
              const displayStatus = apt.status ? apt.status.charAt(0).toUpperCase() + apt.status.slice(1) : 'Scheduled';

              return (
                <div key={apt._id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{apt.pet?.name || 'Unknown Pet'}</p>
                    <p className="text-xs text-slate-400">
                      {apt.appointmentType || 'Checkup'} • {new Date(apt.date).toLocaleDateString()} at {apt.time}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}>
                    {displayStatus}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="px-6 py-8 text-center">
              <Heart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No upcoming appointments</p>
              <Link href="/client/appointments/book" className="text-xs text-[#4A90D9] hover:underline">
                Book your first appointment
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}