'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  PawPrint,
  Menu,
  X,
  Calendar,
  UserCircle,
  ChevronDown,
  LogIn,
  LogOut,
  LayoutDashboard,
  Settings,
  Home,
  Stethoscope,
  Mail,
  Heart,
} from 'lucide-react';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user as any;
  const isLoading = isPending;

  // ✅ Role-based Dashboard Route — all dashboards now live under /dashboard/{role}
  const getDashboardRoute = () => {
    if (!user) return "/login";
    const role = user?.role;
    if (role === "veterinarian" || role === "doctor") return "/dashboard/veterinarian";
    if (role === "admin") return "/dashboard/admin";
    return "/dashboard/client";
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(href + "/");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await authClient.signOut();
    setDropdownOpen(false);
    setIsOpen(false);
    router.push('/login');
    router.refresh();
  };

  const dashboardRoute = getDashboardRoute();

  // ✅ Nav Links - আলাদা Dashboard
  const getNavLinks = () => {
    const baseLinks = [
      { href: "/", label: "HOME", icon: Home },
      { href: "/explore", label: "SERVICES", icon: Stethoscope },
    ];

    if (user) {
      const role = user?.role;

      // ✅ Admin Links
      if (role === "admin") {
        return [
          ...baseLinks,
          { href: "/dashboard/admin", label: "ADMIN DASHBOARD", icon: LayoutDashboard },
          { href: "/about", label: "ABOUT US", icon: Heart },
          { href: "/contact", label: "CONTACT", icon: Mail },
        ];
      }

      // ✅ Veterinarian Links
      if (role === "veterinarian" || role === "doctor") {
        return [
          ...baseLinks,
          { href: "/dashboard/veterinarian", label: "VET DASHBOARD", icon: LayoutDashboard },
          { href: "/about", label: "ABOUT US", icon: Heart },
          { href: "/contact", label: "CONTACT", icon: Mail },
          
        ];
      }

      // ✅ Client Links
      return [
        ...baseLinks,
        { href: "/dashboard/client", label: "MY DASHBOARD", icon: LayoutDashboard },
        { href: "/about", label: "ABOUT US", icon: Heart },
        { href: "/contact", label: "CONTACT", icon: Mail },
        
      ];
    }

    // ✅ Logged Out
    return [
      ...baseLinks,
      { href: "/about", label: "ABOUT US", icon: Heart },
      { href: "/contact", label: "CONTACT", icon: Mail },
    ];
  };

  const activeNavLinks = getNavLinks();

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50 font-sans border-b-2 border-[#ADD8E6]">

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="bg-[#ADD8E6] text-[#1A1A2E] p-2.5 rounded-xl shadow-md group-hover:bg-[#8ec9d9] transition-colors flex items-center justify-center">
            <PawPrint className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-800 leading-none">
              Paw<span className="text-[#466c94]">Med</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-0.5">
              Veterinary Clinic
            </span>
          </div>
        </Link>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-4">
            {isLoading ? (
              <div className="w-32 h-9 bg-slate-100 rounded-xl animate-pulse border border-slate-200" />
            ) : user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition-all text-slate-700 outline-none select-none"
                >
                  {user?.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={user.name || "User"}
                      width={40}
                      height={40}
                      className="w-7 h-7 rounded-lg object-cover"
                      priority
                    />
                  ) : (
                    <UserCircle className="w-7 h-7 text-slate-400" />
                  )}
                  <span className="text-xs font-bold max-w-[120px] truncate">{user.name}</span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-xl py-2 z-50 text-slate-700">
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      <p className="text-[10px] text-[#4A90D9] font-semibold capitalize mt-0.5">{user.role}</p>
                    </div>
                    <Link
                      href={dashboardRoute}
                      onClick={() => setDropdownOpen(false)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors ${
                        isActive(dashboardRoute) ? "bg-[#ADD8E6]/30 text-[#2C5F8A]" : "hover:bg-slate-50"
                      }`}
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" /> Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <UserCircle className="w-4 h-4 text-slate-400" /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full border-t border-slate-100 mt-1 flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-[#466c94] text-white hover:bg-[#2C5F8A] px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide shadow-md transition-all duration-200 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                LOGIN / REGISTER
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-slate-700 hover:text-[#4A90D9] p-2 focus:outline-none transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden lg:block w-full bg-[#1A1A2E] px-6">
        <div className="max-w-7xl mx-auto flex justify-start items-center">
          <nav className="flex items-center space-x-1 text-sm text-slate-200 font-bold">
            {activeNavLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-5 py-4 transition-colors flex items-center gap-2 ${
                  isActive(href)
                    ? "bg-[#4A90D9] text-white"
                    : "hover:bg-slate-800 hover:text-white text-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {isActive(href) && (
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/60" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#1A1A2E] text-white w-full border-t border-slate-800">

          {!isLoading && user && (
            <div className="flex items-center gap-3 px-6 py-4 bg-slate-900/60 border-b border-slate-800">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user.name || "User"} className="w-9 h-9 rounded-xl object-cover" />
              ) : (
                <UserCircle className="w-9 h-9 text-slate-500" />
              )}
              <div>
                <p className="text-xs font-bold text-white">{user.name}</p>
                <p className="text-[10px] text-slate-400">{user.email}</p>
                <p className="text-[10px] text-[#ADD8E6] capitalize">{user.role}</p>
              </div>
            </div>
          )}

          <nav className="flex flex-col text-sm font-bold divide-y divide-slate-800">
            {activeNavLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`px-6 py-4 flex items-center justify-between transition-colors ${
                  isActive(href)
                    ? "bg-[#4A90D9] text-white"
                    : "hover:bg-slate-900 text-slate-200"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
                {isActive(href) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                )}
              </Link>
            ))}
          </nav>

          <div className="p-6">
            <div className="grid grid-cols-2 gap-3">
              {!isLoading && user ? (
                <>
                  <Link
                    href="/services"
                    onClick={() => setIsOpen(false)}
                    className="border-2 border-[#ADD8E6] text-[#ADD8E6] hover:bg-[#ADD8E6] hover:text-[#1A1A2E] py-3 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2"
                  >
                    <Stethoscope className="w-4 h-4" /> SERVICES
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-rose-600 text-white hover:bg-rose-700 py-3 rounded-xl font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> LOGOUT
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/services"
                    onClick={() => setIsOpen(false)}
                    className="border-2 border-[#ADD8E6] text-[#ADD8E6] hover:bg-[#ADD8E6] hover:text-[#1A1A2E] py-3 rounded-xl font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2"
                  >
                    <Stethoscope className="w-4 h-4" /> SERVICES
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="bg-[#ADD8E6] text-[#1A1A2E] hover:bg-[#8ec9d9] py-3 rounded-xl font-bold text-xs tracking-wide text-center shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" /> LOGIN / REGISTER
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}