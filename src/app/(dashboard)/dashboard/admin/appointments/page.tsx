"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CalendarClock, RefreshCw, Loader2 } from "lucide-react";
import { authFetch, getCurrentUser } from "@/lib/auth-client";
import Panel from "@/components/dashboard/Panel";
import EmptyState from "@/components/dashboard/EmptyState";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { RowSkeleton } from "@/components/dashboard/Skeletons";
import FullScreenLoader from "@/components/dashboard/FullScreenLoader";

interface AppointmentRow {
  _id: string;
  date: string;
  time: string;
  status: string;
  appointmentType: string;
  priority: string;
  client?: { name: string; email: string };
  pet?: { name: string; species: string };
  veterinarian?: { name: string };
}

const API_URL = "/api/backend";

const STATUS_OPTIONS = [
  "all",
  "scheduled",
  "confirmed",
  "in-progress",
  "completed",
  "cancelled",
  "no-show",
] as const;

const STATUS_FLOW: Record<string, string[]> = {
  scheduled: ["confirmed", "cancelled"],
  confirmed: ["in-progress", "cancelled", "no-show"],
  "in-progress": ["completed"],
  completed: [],
  cancelled: [],
  "no-show": [],
};

export default function AdminAppointmentsPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) return router.replace("/login");
      if (user.role !== "admin") return router.replace(`/dashboard/${user.role}`);
      setCheckingAuth(false);
    })();
  }, [router]);

  const loadAppointments = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_URL}/appointments`);
      if (!res.ok) throw new Error(`Failed to load appointments (${res.status})`);
      const json = await res.json();
      setAppointments(json.data?.appointments ?? []);
    } catch (err: any) {
      setError(err.message || "Failed to load appointments");
      toast.error(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!checkingAuth) loadAppointments();
  }, [checkingAuth, loadAppointments]);

  const filtered = useMemo(
    () =>
      appointments
        .filter((a) => statusFilter === "all" || a.status === statusFilter)
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [appointments, statusFilter]
  );

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const previous = appointments;
    setAppointments((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
    try {
      const res = await authFetch(`${API_URL}/appointments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Failed to update (${res.status})`);
      }
      toast.success(`Marked as ${status.replace("-", " ")}`);
    } catch (err: any) {
      setAppointments(previous);
      toast.error(err.message || "Could not update appointment");
    } finally {
      setUpdatingId(null);
    }
  };

  if (checkingAuth) return <FullScreenLoader label="Checking your session..." />;

  return (
    <div className="min-h-screen bg-[#F4F9FC] p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#4A90D9]/10 p-3">
              <CalendarClock className="h-7 w-7 text-[#2C5F8A]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
              <p className="text-sm text-gray-500">All clinic appointments</p>
            </div>
          </div>
          <button
            onClick={() => loadAppointments(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Couldn&apos;t load appointments</p>
            <p className="mt-1">{error}</p>
            <button onClick={() => loadAppointments()} className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700">
              Try again
            </button>
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                statusFilter === s ? "bg-[#4A90D9] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {s.replace("-", " ")}
            </button>
          ))}
        </div>

        <Panel title={`Appointments (${filtered.length})`}>
          {loading ? (
            <RowSkeleton rows={6} />
          ) : filtered.length === 0 ? (
            <EmptyState text="No appointments match this filter" />
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((a) => {
                const nextActions = STATUS_FLOW[a.status] ?? [];
                const isBusy = updatingId === a._id;
                return (
                  <div key={a._id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {a.pet?.name ?? "Pet"} &middot; {a.appointmentType}
                      </p>
                      <p className="text-xs text-gray-500">
                        {a.client?.name ?? "Unknown client"} with Dr. {a.veterinarian?.name ?? "—"}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-400">
                        {new Date(a.date).toLocaleDateString()} &bull; {a.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={a.status} />
                      {isBusy ? (
                        <Loader2 size={16} className="animate-spin text-gray-400" />
                      ) : (
                        nextActions.map((action) => (
                          <button
                            key={action}
                            onClick={() => updateStatus(a._id, action)}
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
              })}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}