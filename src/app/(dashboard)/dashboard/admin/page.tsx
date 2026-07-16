"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Users,
  PawPrint,
  CalendarCheck,
  Stethoscope,
  Pill,
  CreditCard,
  Clock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { authFetch, getCurrentUser } from "@/lib/auth-client";
import StatCard from "@/components/dashboard/StatCard";
import RoleBadge from "@/components/dashboard/RoleBadge";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Panel from "@/components/dashboard/Panel";
import EmptyState from "@/components/dashboard/EmptyState";
import { StatsSkeleton, RowSkeleton } from "@/components/dashboard/Skeletons";
import FullScreenLoader from "@/components/dashboard/FullScreenLoader";

// ============================================
// TYPES
// ============================================

interface AdminStats {
  totalUsers: number;
  totalPets: number;
  totalAppointments: number;
  totalServices: number;
  totalPrescriptions: number;
  totalPayments: number;
  pendingAppointments: number;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "veterinarian" | "client";
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

interface AppointmentRow {
  _id: string;
  date: string;
  time: string;
  status: string;
  appointmentType: string;
  client?: { name: string; email: string };
  pet?: { name: string; species: string };
  veterinarian?: { name: string };
}

const API_URL = "/api/backend"; // same-origin proxy -> Express

// ============================================
// PAGE
// ============================================

export default function AdminDashboardPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);

  // Guard: only admins may view this page
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      if (user.role !== "admin") {
        router.replace(`/dashboard/${user.role}`);
        return;
      }
      setCheckingAuth(false);
    })();
  }, [router]);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);

    try {
      const [statsRes, usersRes, apptRes] = await Promise.all([
        authFetch(`${API_URL}/admin/dashboard`),
        authFetch(`${API_URL}/admin/users`),
        authFetch(`${API_URL}/appointments`),
      ]);

      if (!statsRes.ok) throw new Error(`Failed to load stats (${statsRes.status})`);
      if (!usersRes.ok) throw new Error(`Failed to load users (${usersRes.status})`);
      if (!apptRes.ok) throw new Error(`Failed to load appointments (${apptRes.status})`);

      const statsJson = await statsRes.json();
      const usersJson = await usersRes.json();
      const apptJson = await apptRes.json();

      setStats(statsJson.data);
      setUsers((usersJson.data?.users ?? []).slice(0, 6));
      setAppointments(
        (apptJson.data?.appointments ?? [])
          .slice()
          .sort((a: AppointmentRow, b: AppointmentRow) => (a.date < b.date ? 1 : -1))
          .slice(0, 8)
      );
    } catch (err: any) {
      console.error("Admin dashboard load error:", err);
      const message = err?.message || "Failed to load dashboard data";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!checkingAuth) loadDashboard();
  }, [checkingAuth, loadDashboard]);

  if (checkingAuth) {
    return <FullScreenLoader label="Checking your session..." />;
  }

  return (
    <div className="min-h-screen bg-[#F4F9FC] p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#4A90D9]/10 p-3">
              <ShieldCheck className="h-7 w-7 text-[#2C5F8A]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Overview of PawMed clinic activity</p>
            </div>
          </div>

          <button
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Couldn&apos;t load dashboard data</p>
            <p className="mt-1">{error}</p>
            <button
              onClick={() => loadDashboard()}
              className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* Stat cards */}
        {loading ? (
          <StatsSkeleton count={7} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<Users size={22} />} label="Total Users" value={stats?.totalUsers} />
            <StatCard icon={<PawPrint size={22} />} label="Total Pets" value={stats?.totalPets} />
            <StatCard icon={<CalendarCheck size={22} />} label="Total Appointments" value={stats?.totalAppointments} />
            <StatCard icon={<Clock size={22} />} label="Pending Appointments" value={stats?.pendingAppointments} accent="amber" />
            <StatCard icon={<Stethoscope size={22} />} label="Services" value={stats?.totalServices} />
            <StatCard icon={<Pill size={22} />} label="Prescriptions" value={stats?.totalPrescriptions} />
            <StatCard icon={<CreditCard size={22} />} label="Payments" value={stats?.totalPayments} />
          </div>
        )}

        {/* Recent users / recent appointments */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel title="Recent Users">
            {loading ? (
              <RowSkeleton rows={5} />
            ) : users.length === 0 ? (
              <EmptyState text="No users found" />
            ) : (
              <div className="divide-y divide-gray-100">
                {users.map((u) => (
                  <div key={u._id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <RoleBadge role={u.role} />
                      <span
                        className={`h-2 w-2 rounded-full ${u.isActive ? "bg-green-500" : "bg-gray-300"}`}
                        title={u.isActive ? "Active" : "Inactive"}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel title="Recent Appointments">
            {loading ? (
              <RowSkeleton rows={5} />
            ) : appointments.length === 0 ? (
              <EmptyState text="No appointments found" />
            ) : (
              <div className="divide-y divide-gray-100">
                {appointments.map((a) => (
                  <div key={a._id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {a.pet?.name ?? "Unknown pet"} &middot; {a.appointmentType}
                      </p>
                      <p className="text-xs text-gray-500">
                        {a.client?.name ?? "Unknown client"} with Dr. {a.veterinarian?.name ?? "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(a.date).toLocaleDateString()} &bull; {a.time}
                      </p>
                      <StatusBadge status={a.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
