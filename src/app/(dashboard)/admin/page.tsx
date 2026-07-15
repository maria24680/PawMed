'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  PawPrint,
  Calendar,
  CreditCard,
  Clock,
  Loader2,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Activity,
  BarChart3,
  Stethoscope,
  Pill,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { authFetch } from '@/lib/auth-client';
import toast from 'react-hot-toast';

interface AdminStats {
  totalUsers: number;
  totalPets: number;
  totalAppointments: number;
  totalRevenueBDT: number;
  pendingAppointments: number;
  totalServices: number;
  totalPrescriptions: number;
  totalPayments: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

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
        // Fetch Admin Stats
        const statsResponse = await authFetch('http://localhost:8000/api/admin/dashboard');
        const statsPayload = await statsResponse.json();

        if (statsResponse.ok && statsPayload.success) {
          setStats(statsPayload.data);
        }

        // Fetch Recent Activities (Users)
        const usersResponse = await authFetch('http://localhost:8000/api/admin/users');
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          const users = usersData.data?.users || [];
          
          // Create recent activities from users
          const activities = users.slice(0, 5).map((user: any) => ({
            id: user._id,
            action: 'New user registered',
            user: user.name,
            time: new Date(user.createdAt).toLocaleDateString(),
          }));
          setRecentActivities(activities);
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
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/admin/users'
    },
    {
      label: 'Total Pets',
      value: stats?.totalPets || 0,
      icon: PawPrint,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      href: '/admin/pets'
    },
    {
      label: 'Appointments',
      value: stats?.totalAppointments || 0,
      icon: Calendar,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      href: '/admin/appointments'
    },
    {
      label: 'Pending Appointments',
      value: stats?.pendingAppointments || 0,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      href: '/admin/appointments?status=pending'
    },
    {
      label: 'Total Services',
      value: stats?.totalServices || 0,
      icon: Stethoscope,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      href: '/admin/services'
    },
    {
      label: 'Total Revenue',
      value: formatBDT(stats?.totalRevenueBDT || 0),
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50',
      href: '/admin/payments'
    }
  ];

  const quickActions = [
    { label: 'Manage Users', href: '/admin/users', icon: Users, color: 'bg-blue-500' },
    { label: 'Manage Pets', href: '/admin/pets', icon: PawPrint, color: 'bg-purple-500' },
    { label: 'View Appointments', href: '/admin/appointments', icon: Calendar, color: 'bg-amber-500' },
    { label: 'Manage Services', href: '/admin/services', icon: Stethoscope, color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto w-full font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
            Admin Dashboard
          </h2>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Real-time management data powered by PawMed Backend
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 font-bold bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#4A90D9]" /> System: Active
          </div>
          <div className="text-xs bg-[#ADD8E6]/20 text-[#2C5F8A] px-3 py-2 rounded-xl font-bold flex items-center gap-1">
            <Activity className="w-3 h-3" /> {new Date().toLocaleDateString()}
          </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Recent Activity
          </h3>
          <Link href="/admin/activity" className="text-xs text-[#4A90D9] hover:text-[#2C5F8A] font-medium flex items-center gap-1">
            View All
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                  <p className="text-xs text-slate-400">{activity.user}</p>
                </div>
                <span className="text-xs text-slate-400">{activity.time}</span>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center">
              <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}