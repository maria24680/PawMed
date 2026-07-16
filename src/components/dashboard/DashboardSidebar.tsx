"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PawPrint,
  CalendarClock,
  Pill,
  Users,
  Stethoscope,
  CreditCard,
  ClipboardList,
  LogOut,
  X,
} from "lucide-react";
import { clearAuthData } from "@/lib/auth-client";

export type DashboardRole = "admin" | "veterinarian" | "client";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

// All routes now live under /dashboard/{role}/... — matches the Pawify
// app/dashboard/{admin,user,vendor}/page.tsx layout.
const NAV_ITEMS: Record<DashboardRole, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", icon: <LayoutDashboard size={18} /> },
    { label: "Users", href: "/dashboard/admin/users", icon: <Users size={18} /> },
    { label: "Appointments", href: "/dashboard/admin/appointments", icon: <CalendarClock size={18} /> },
    { label: "Services", href: "/dashboard/admin/services", icon: <Stethoscope size={18} /> },
    { label: "Payments", href: "/dashboard/admin/payments", icon: <CreditCard size={18} /> },
  ],
  veterinarian: [
    { label: "Dashboard", href: "/dashboard/veterinarian", icon: <LayoutDashboard size={18} /> },
    { label: "Appointments", href: "/dashboard/veterinarian/appointments", icon: <CalendarClock size={18} /> },
    { label: "Prescriptions", href: "/dashboard/veterinarian/prescriptions", icon: <Pill size={18} /> },
    { label: "Medical Records", href: "/dashboard/veterinarian/records", icon: <ClipboardList size={18} /> },
  ],
  client: [
    { label: "Dashboard", href: "/dashboard/client", icon: <LayoutDashboard size={18} /> },
    { label: "My Pets", href: "/dashboard/client/pets", icon: <PawPrint size={18} /> },
    { label: "Appointments", href: "/dashboard/client/appointments", icon: <CalendarClock size={18} /> },
    { label: "Prescriptions", href: "/dashboard/client/prescriptions", icon: <Pill size={18} /> },
    { label: "Payments", href: "/dashboard/client/payments", icon: <CreditCard size={18} /> },
  ],
};

interface DashboardSidebarProps {
  role: DashboardRole;
  userName: string;
  open: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ role, userName, open, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const items = NAV_ITEMS[role];

  const handleLogout = () => {
    clearAuthData();
    router.push("/auth/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-100 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-[#ADD8E6] p-2">
              <PawPrint size={20} className="text-[#2C5F8A]" />
            </div>
            <span className="text-lg font-black text-gray-900">
              Paw<span className="text-[#4A90D9]">Med</span>
            </span>
          </Link>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 lg:hidden">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Signed in as</p>
          <p className="mt-1 truncate text-sm font-semibold text-gray-800">{userName || "..."}</p>
          <span className="mt-1 inline-block rounded-full bg-[#4A90D9]/10 px-2 py-0.5 text-[11px] font-medium capitalize text-[#2C5F8A]">
            {role}
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-[#4A90D9] text-white shadow"
                    : "text-gray-600 hover:bg-[#4A90D9]/10 hover:text-[#2C5F8A]"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-100 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
