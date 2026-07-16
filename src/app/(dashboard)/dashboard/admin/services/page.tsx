"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Stethoscope, RefreshCw, Plus, Trash2, Loader2, X } from "lucide-react";
import { authFetch, getCurrentUser } from "@/lib/auth-client";
import Panel from "@/components/dashboard/Panel";
import EmptyState from "@/components/dashboard/EmptyState";
import { RowSkeleton } from "@/components/dashboard/Skeletons";
import FullScreenLoader from "@/components/dashboard/FullScreenLoader";

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  isAvailable: boolean;
  requiresSpecialist: boolean;
}

const API_URL = "/api/backend";
const CATEGORIES = ["consultation", "vaccination", "surgery", "dental", "diagnostic", "emergency", "wellness", "specialist"];

const emptyForm = {
  name: "",
  description: "",
  category: "consultation",
  price: "",
  duration: "",
  requiresSpecialist: false,
};

export default function AdminServicesPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) return router.replace("/login");
      if (user.role !== "admin") return router.replace(`/dashboard/${user.role}`);
      setCheckingAuth(false);
    })();
  }, [router]);

  const loadServices = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_URL}/services`);
      if (!res.ok) throw new Error(`Failed to load services (${res.status})`);
      const json = await res.json();
      setServices(json.data?.services ?? []);
    } catch (err: any) {
      setError(err.message || "Failed to load services");
      toast.error(err.message || "Failed to load services");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!checkingAuth) loadServices();
  }, [checkingAuth, loadServices]);

  const toggleAvailability = async (service: Service) => {
    setBusyId(service._id);
    const previous = services;
    setServices((prev) =>
      prev.map((s) => (s._id === service._id ? { ...s, isAvailable: !s.isAvailable } : s))
    );
    try {
      const res = await authFetch(`${API_URL}/services/${service._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !service.isAvailable }),
      });
      if (!res.ok) throw new Error(`Failed to update (${res.status})`);
      toast.success(`Service ${!service.isAvailable ? "enabled" : "disabled"}`);
    } catch (err: any) {
      setServices(previous);
      toast.error(err.message || "Could not update service");
    } finally {
      setBusyId(null);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    setBusyId(id);
    const previous = services;
    setServices((prev) => prev.filter((s) => s._id !== id));
    try {
      const res = await authFetch(`${API_URL}/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Failed to delete (${res.status})`);
      toast.success("Service deleted");
    } catch (err: any) {
      setServices(previous);
      toast.error(err.message || "Could not delete service");
    } finally {
      setBusyId(null);
    }
  };

  const submitNewService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.duration) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const res = await authFetch(`${API_URL}/services`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          duration: Number(form.duration),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Failed to create service (${res.status})`);
      }
      toast.success("Service created");
      setForm(emptyForm);
      setShowForm(false);
      loadServices();
    } catch (err: any) {
      toast.error(err.message || "Could not create service");
    } finally {
      setSubmitting(false);
    }
  };

  if (checkingAuth) return <FullScreenLoader label="Checking your session..." />;

  return (
    <div className="min-h-screen bg-[#F4F9FC] p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#4A90D9]/10 p-3">
              <Stethoscope className="h-7 w-7 text-[#2C5F8A]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Services</h1>
              <p className="text-sm text-gray-500">Manage clinic services</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 rounded-xl bg-[#4A90D9] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2C5F8A]"
            >
              {showForm ? <X size={16} /> : <Plus size={16} />}
              {showForm ? "Cancel" : "Add Service"}
            </button>
            <button
              onClick={() => loadServices(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Couldn&apos;t load services</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {showForm && (
          <form onSubmit={submitNewService} className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">New Service</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                placeholder="Service name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm capitalize outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Price (USD)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="sm:col-span-2 rounded-xl border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
                rows={2}
              />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.requiresSpecialist}
                  onChange={(e) => setForm({ ...form, requiresSpecialist: e.target.checked })}
                />
                Requires specialist
              </label>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 flex items-center gap-2 rounded-xl bg-[#4A90D9] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2C5F8A] disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Create Service
            </button>
          </form>
        )}

        <Panel title={`All Services (${services.length})`}>
          {loading ? (
            <RowSkeleton rows={5} />
          ) : services.length === 0 ? (
            <EmptyState text="No services yet" />
          ) : (
            <div className="divide-y divide-gray-100">
              {services.map((s) => {
                const isBusy = busyId === s._id;
                return (
                  <div key={s._id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div className="max-w-lg">
                      <p className="text-sm font-semibold text-gray-900">
                        {s.name} <span className="ml-1 text-xs font-normal capitalize text-gray-400">({s.category})</span>
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">{s.description}</p>
                      <p className="mt-1 text-xs text-gray-400">${s.price} &bull; {s.duration} min{s.requiresSpecialist ? " · Specialist required" : ""}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleAvailability(s)}
                        disabled={isBusy}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition disabled:opacity-50 ${
                          s.isAvailable ? "border-green-200 text-green-700 hover:bg-green-50" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {s.isAvailable ? "Available" : "Unavailable"}
                      </button>
                      <button
                        onClick={() => deleteService(s._id)}
                        disabled={isBusy}
                        className="rounded-lg border border-red-200 p-1.5 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        {isBusy ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
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