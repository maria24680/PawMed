'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, authClient } from '@/lib/auth-client';
import {
  LayoutDashboard,
  Users,
  PawPrint,
  Calendar,
  Stethoscope,
  Pill,
  CreditCard,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  Search,
  Loader2,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const user = session?.user as any;
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const isAdminRoute = pathname.startsWith('/admin');
    const isVetRoute = pathname.startsWith('/veterinarian');
    const isClientRoute = pathname.startsWith('/client');

    if (isAdminRoute && user.role !== 'admin') {
      router.push('/');
      return;
    }
    if (isVetRoute && user.role !== 'veterinarian') {
      router.push('/');
      return;
    }
    if (isClientRoute && user.role !== 'client') {
      router.push('/');
      return;
    }
  }, [user, isPending, pathname, router]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getNavItems = () => {
    const role = user?.role;

    if (role === 'admin') {
      return [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/pets', label: 'Pets', icon: PawPrint },
        { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
        { href: '/admin/services', label: 'Services', icon: Stethoscope },
        { href: '/admin/prescriptions', label: 'Prescriptions', icon: Pill },
        { href: '/admin/payments', label: 'Payments', icon: CreditCard },
      ];
    }

    if (role === 'veterinarian') {
      return [
        { href: '/veterinarian/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/veterinarian/appointments', label: 'Appointments', icon: Calendar },
        { href: '/veterinarian/patients', label: 'Patients', icon: PawPrint },
        { href: '/veterinarian/prescriptions', label: 'Prescriptions', icon: Pill },
        { href: '/veterinarian/medical-records', label: 'Medical Records', icon: Stethoscope },
      ];
    }

    return [
      { href: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/client/pets', label: 'My Pets', icon: PawPrint },
      { href: '/client/appointments', label: 'Appointments', icon: Calendar },
      { href: '/client/payments', label: 'Payments', icon: CreditCard },
      { href: '/client/prescriptions', label: 'Prescriptions', icon: Pill },
    ];
  };

  const navItems = getNavItems();
  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/login');
  };

  if (isPending || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#4A90D9] mx-auto" />
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-900/40 z-30 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen transition-all duration-300 flex flex-col shrink-0 ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20 overflow-hidden lg:overflow-visible'
        } bg-[#1A1A2E] text-white shadow-xl border-r border-slate-800`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800 flex-shrink-0">
          <div className="bg-[#ADD8E6] p-2 rounded-xl shrink-0">
            <PawPrint className="h-5 w-5 text-[#1A1A2E]" />
          </div>
          {sidebarOpen && (
            <span className="text-lg font-black uppercase tracking-tight text-white">
              Paw<span className="text-[#ADD8E6]">Med</span>
            </span>
          )}
        </div>

        {/* User Profile */}
        {sidebarOpen && (
          <div className="px-4 py-4 border-b border-slate-800 bg-slate-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4A90D9] text-white flex items-center justify-center font-black text-sm uppercase shrink-0">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                <span className="inline-block px-2 py-0.5 bg-[#ADD8E6]/10 text-[#ADD8E6] text-[9px] font-black uppercase tracking-wider rounded border border-[#ADD8E6]/20 mt-1.5">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 text-xs font-bold uppercase tracking-wider">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebarOnMobile}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-[#4A90D9] text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-slate-400'}`} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}

          <div className="border-t border-slate-800/80 my-4" />

          {/* Settings */}
          <Link
            href="/profile"
            onClick={closeSidebarOnMobile}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all ${
              isActive('/profile')
                ? 'bg-[#4A90D9] text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <Settings className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-950/20 text-left transition-all"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 bg-[#1A1A2E] border-2 border-slate-800 rounded-full p-1 text-white hover:bg-[#4A90D9] transition-all hidden lg:block shadow-md z-50"
        >
          {sidebarOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              <Menu className="h-4 w-4 text-slate-700" />
            </button>
            <h1 className="text-sm font-black text-slate-800 uppercase tracking-tight hidden sm:block">
              Welcome, <span className="text-[#4A90D9]">{user?.name?.split(' ')[0] || 'User'}</span>!
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#ADD8E6] transition-all">
              <Search className="h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-xs text-slate-700 w-40 lg:w-56 font-semibold placeholder-slate-400"
              />
            </div>

            {/* Notifications */}
            <button className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl relative transition-colors">
              <Bell className="h-4 w-4 text-slate-700" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <div className="w-8 h-8 rounded-lg bg-[#4A90D9] text-white flex items-center justify-center font-extrabold text-xs uppercase">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 min-h-[calc(100vh-4rem)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}