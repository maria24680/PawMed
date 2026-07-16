"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Clock,
  Pill,
  RefreshCw,
  Loader2,
  Stethoscope,
} from "lucide-react";
import { authFetch, getCurrentUser } from "@/lib/auth-client";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Panel from "@/components/dashboard/Panel";
import EmptyState from "@/components/dashboard/EmptyState";
import { StatsSkeleton, RowSkeleton } from "@/components/dashboard/Skeletons";
import FullScreenLoader from "@/components/dashboard/FullScreenLoader";

// ============================================
// TYPES
// ============================================

interface VetStats {
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  todayAppointments: number;
  totalPrescriptions: number;
  completionRate: number;
}

interface AppointmentRow {
  _id: string;
  date: string;
  time: string;
  status: string;
  appointmentType: string;
  priority: string;
  client?: { name: string; email: string; phone?: string };
  pet?: { name: string; species: string; breed?: string };
}

const API_URL = "/api/backend"; // same-origin proxy -> Express

const STATUS_FLOW: Record<string, string[]> = {
  scheduled: ["confirmed", "cancelled"],
  confirmed: ["in-progress", "cancelled", "no-show"],
  "in-progress": ["completed"],
  completed: [],
  cancelled: [],
  "no-show": [],
};

// ============================================
// PAGE
// ============================================

export default function VeterinarianDashboardPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [stats, setStats] = useState<VetStats | null>(null);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);

  // Guard: only veterinarians may view this page
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      if (user.role !== "veterinarian") {
        router.replace(`/dashboard/${user.role}`);
        return;
      }
      setUserName(user.name || "");
      setCheckingAuth(false);
    })();
  }, [router]);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);

    try {
      const [statsRes, apptRes] = await Promise.all([
        authFetch(`${API_URL}/veterinarian/stats`),
        authFetch(`${API_URL}/veterinarian/appointments`),
      ]);

      if (!statsRes.ok) throw new Error(`Failed to load stats (${statsRes.status})`);
      if (!apptRes.ok) throw new Error(`Failed to load appointments (${apptRes.status})`);

      const statsJson = await statsRes.json();
      const apptJson = await apptRes.json();

      setStats(statsJson.data);
      setAppointments(apptJson.data?.appointments ?? []);
    } catch (err: any) {
      console.error("Veterinarian dashboard load error:", err);
      const message = err?.message || "Failed to load your dashboard data";
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

  const todayAppointments = useMemo(() => {
    const today = new Date().toDateString();
    return appointments
      .filter((a) => new Date(a.date).toDateString() === today)
      .sort((a, b) => (a.time > b.time ? 1 : -1));
  }, [appointments]);

  const upcomingAppointments = useMemo(() => {
    const today = new Date().toDateString();
    return appointments
      .filter(
        (a) =>
          new Date(a.date).toDateString() !== today &&
          new Date(a.date) > new Date() &&
          ["scheduled", "confirmed"].includes(a.status)
      )
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .slice(0, 6);
  }, [appointments]);

  const updateStatus = async (appointmentId: string, status: string) => {
    setUpdatingId(appointmentId);
    try {
      const res = await authFetch(`${API_URL}/appointments/${appointmentId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Failed to update status (${res.status})`);
      }

      setAppointments((prev) =>
        prev.map((a) => (a._id === appointmentId ? { ...a, status } : a))
      );
      toast.success(`Appointment marked as ${status.replace("-", " ")}`);
    } catch (err: any) {
      toast.error(err.message || "Could not update appointment");
    } finally {
      setUpdatingId(null);
    }
  };

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
              <Stethoscope className="h-7 w-7 text-[#2C5F8A]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {userName ? `Welcome, Dr. ${userName.replace(/^Dr\.?\s*/i, "")}` : "Veterinarian Dashboard"}
              </h1>
              <p className="text-sm text-gray-500">Your schedule and patient activity</p>
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
            <p className="font-medium">Couldn&apos;t load your dashboard</p>
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
          <StatsSkeleton count={5} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard icon={<CalendarClock size={22} />} label="Today" value={stats?.todayAppointments} />
            <StatCard icon={<Clock size={22} />} label="Pending" value={stats?.pendingAppointments} accent="amber" />
            <StatCard icon={<CalendarCheck size={22} />} label="Total Appointments" value={stats?.totalAppointments} />
            <StatCard icon={<CheckCircle2 size={22} />} label="Completed" value={stats?.completedAppointments} accent="green" />
            <StatCard icon={<Pill size={22} />} label="Prescriptions" value={stats?.totalPrescriptions} />
          </div>
        )}

        {stats && !loading && (
          <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">Completion rate</span>
              <span className="font-semibold text-[#2C5F8A]">{stats.completionRate}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#4A90D9]"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
        )}

        {/* Today's schedule */}
        <Panel title="Today's Schedule" className="mt-8">
          {loading ? (
            <RowSkeleton rows={4} />
          ) : todayAppointments.length === 0 ? (
            <EmptyState text="No appointments scheduled for today" />
          ) : (
            <div className="divide-y divide-gray-100">
              {todayAppointments.map((a) => (
                <AppointmentItem
                  key={a._id}
                  appointment={a}
                  updating={updatingId === a._id}
                  onUpdateStatus={updateStatus}
                />
              ))}
            </div>
          )}
        </Panel>

        {/* Upcoming appointments */}
        <Panel title="Upcoming Appointments" className="mt-8">
          {loading ? (
            <RowSkeleton rows={4} />
          ) : upcomingAppointments.length === 0 ? (
            <EmptyState text="No upcoming appointments" />
          ) : (
            <div className="divide-y divide-gray-100">
              {upcomingAppointments.map((a) => (
                <div key={a._id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {a.pet?.name ?? "Pet"} &middot; {a.appointmentType}
                    </p>
                    <p className="text-xs text-gray-500">{a.client?.name ?? "Unknown client"}</p>
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
  );
}

// ============================================
// APPOINTMENT ITEM (with inline status actions)
// ============================================

function AppointmentItem({
  appointment,
  updating,
  onUpdateStatus,
}: {
  appointment: AppointmentRow;
  updating: boolean;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  const nextActions = STATUS_FLOW[appointment.status] ?? [];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div>
        <p className="text-sm font-semibold text-gray-900">
          {appointment.pet?.name ?? "Pet"} &middot; {appointment.appointmentType}
        </p>
        <p className="text-xs text-gray-500">
          {appointment.client?.name ?? "Unknown client"} &bull; {appointment.time}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <StatusBadge status={appointment.status} />
        {updating ? (
          <Loader2 size={16} className="animate-spin text-gray-400" />
        ) : (
          nextActions.map((action) => (
            <button
              key={action}
              onClick={() => onUpdateStatus(appointment._id, action)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium capitalize transition ${
                action === "cancelled" || action === "no-show"
                  ? "border-red-200 text-red-600 hover:bg-red-50"
                  : "border-[#4A90D9]/40 text-[#2C5F8A] hover:bg-[#4A90D9]/10"
              }`}
            >
              Mark {action.replace("-", " ")}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
