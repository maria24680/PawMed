"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { PawPrint, CalendarClock, Pill, Plus, RefreshCw, Heart } from "lucide-react";
import { authFetch, getCurrentUser } from "@/lib/auth-client";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Panel from "@/components/dashboard/Panel";
import EmptyState from "@/components/dashboard/EmptyState";
import { RowSkeleton } from "@/components/dashboard/Skeletons";
import FullScreenLoader from "@/components/dashboard/FullScreenLoader";

// ============================================
// TYPES
// ============================================

interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  profileImage?: string;
  lastVisit?: string;
}

interface AppointmentRow {
  _id: string;
  date: string;
  time: string;
  status: string;
  appointmentType: string;
  pet?: { name: string; species: string };
  veterinarian?: { name: string; specialization?: string[] };
}

interface Prescription {
  _id: string;
  diagnosis: string;
  issuedDate: string;
  validUntil: string;
  isActive: boolean;
  medications: { name: string; dosage: string; frequency: string }[];
  pet?: { name: string };
  veterinarian?: { name: string };
}

const API_URL = "/api/backend"; // same-origin proxy -> Express

// ============================================
// HELPERS
// ============================================

// Pulls the most useful message out of a failed response: prefers the
// backend's own JSON `message`, falls back to status text.
async function extractErrorMessage(res: Response, fallbackLabel: string): Promise<string> {
  try {
    const body = await res.json();
    if (body?.message) return `${fallbackLabel}: ${body.message}`;
  } catch {
    // response wasn't JSON — fall through
  }
  return `${fallbackLabel} (${res.status})`;
}

// ============================================
// PAGE
// ============================================

export default function ClientDashboardPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  // Guard: only clients may view this page
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      if (user.role !== "client") {
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

    // Promise.allSettled instead of Promise.all: if one endpoint 500s,
    // the other two still render instead of blanking the whole page.
    const [petsResult, apptResult, presResult] = await Promise.allSettled([
      authFetch(`${API_URL}/pets`),
      authFetch(`${API_URL}/appointments`),
      authFetch(`${API_URL}/prescriptions`),
    ]);

    const errors: string[] = [];

    if (petsResult.status === "fulfilled" && petsResult.value.ok) {
      const json = await petsResult.value.json();
      setPets(json.data?.pets ?? []);
    } else {
      const res = petsResult.status === "fulfilled" ? petsResult.value : null;
      errors.push(
        res
          ? await extractErrorMessage(res, "Failed to load pets")
          : "Failed to load pets: network error"
      );
    }

    if (apptResult.status === "fulfilled" && apptResult.value.ok) {
      const json = await apptResult.value.json();
      setAppointments(json.data?.appointments ?? []);
    } else {
      const res = apptResult.status === "fulfilled" ? apptResult.value : null;
      errors.push(
        res
          ? await extractErrorMessage(res, "Failed to load appointments")
          : "Failed to load appointments: network error"
      );
    }

    if (presResult.status === "fulfilled" && presResult.value.ok) {
      const json = await presResult.value.json();
      setPrescriptions(json.data?.prescriptions ?? []);
    } else {
      const res = presResult.status === "fulfilled" ? presResult.value : null;
      errors.push(
        res
          ? await extractErrorMessage(res, "Failed to load prescriptions")
          : "Failed to load prescriptions: network error"
      );
    }

    if (errors.length > 0) {
      const message = errors.join(" · ");
      setError(message);
      toast.error(errors[0]);
      console.error("Client dashboard load errors:", errors);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (!checkingAuth) loadDashboard();
  }, [checkingAuth, loadDashboard]);

  const upcomingAppointments = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((a) => ["scheduled", "confirmed"].includes(a.status) && new Date(a.date) >= new Date(now.toDateString()))
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .slice(0, 5);
  }, [appointments]);

  const activePrescriptions = useMemo(
    () => prescriptions.filter((p) => p.isActive).slice(0, 5),
    [prescriptions]
  );

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
              <Heart className="h-7 w-7 text-[#2C5F8A]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {userName ? `Welcome back, ${userName.split(" ")[0]}!` : "Your Dashboard"}
              </h1>
              <p className="text-sm text-gray-500">Here&apos;s what&apos;s happening with your pets</p>
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
            <p className="font-medium">Some of your dashboard data couldn&apos;t load</p>
            <p className="mt-1">{error}</p>
            <button
              onClick={() => loadDashboard()}
              className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* Quick stats */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={<PawPrint size={22} />} label="My Pets" value={pets.length} />
            <StatCard icon={<CalendarClock size={22} />} label="Upcoming Appointments" value={upcomingAppointments.length} />
            <StatCard icon={<Pill size={22} />} label="Active Prescriptions" value={activePrescriptions.length} />
          </div>
        )}

        {/* My pets */}
        <Panel
          title="My Pets"
          action={
            <Link
              href="/dashboard/client/pets/new"
              className="flex items-center gap-1 text-sm font-medium text-[#4A90D9] hover:text-[#2C5F8A]"
            >
              <Plus size={16} /> Add Pet
            </Link>
          }
          className="mt-8"
        >
          {loading ? (
            <RowSkeleton rows={3} />
          ) : pets.length === 0 ? (
            <EmptyState text="You haven't added any pets yet." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pets.map((pet) => (
                <div key={pet._id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ADD8E6]/30 text-[#2C5F8A]">
                    <PawPrint size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{pet.name}</p>
                    <p className="text-xs text-gray-500">
                      {pet.breed} &middot; {pet.species}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Upcoming appointments / active prescriptions */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Panel
            title="Upcoming Appointments"
            action={
              <Link href="/dashboard/client/appointments/new" className="text-sm font-medium text-[#4A90D9] hover:text-[#2C5F8A]">
                Book new
              </Link>
            }
          >
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
                      <p className="text-xs text-gray-500">Dr. {a.veterinarian?.name ?? "—"}</p>
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

          <Panel title="Active Prescriptions">
            {loading ? (
              <RowSkeleton rows={4} />
            ) : activePrescriptions.length === 0 ? (
              <EmptyState text="No active prescriptions" />
            ) : (
              <div className="divide-y divide-gray-100">
                {activePrescriptions.map((p) => (
                  <div key={p._id} className="py-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">
                        {p.pet?.name ?? "Pet"} &middot; {p.diagnosis}
                      </p>
                      <p className="text-xs text-gray-500">
                        Valid until {new Date(p.validUntil).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {p.medications.map((m) => `${m.name} (${m.dosage})`).join(", ")}
                    </p>
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
