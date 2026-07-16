"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CreditCard, RefreshCw } from "lucide-react";
import { authFetch, getCurrentUser } from "@/lib/auth-client";
import Panel from "@/components/dashboard/Panel";
import EmptyState from "@/components/dashboard/EmptyState";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { RowSkeleton } from "@/components/dashboard/Skeletons";
import FullScreenLoader from "@/components/dashboard/FullScreenLoader";

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  user?: { name: string; email: string };
  appointment?: { date: string; time: string };
}

const API_URL = "/api/backend";
const STATUS_OPTIONS = ["all", "pending", "succeeded", "failed", "refunded"] as const;

export default function AdminPaymentsPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("all");

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) return router.replace("/login");
      if (user.role !== "admin") return router.replace(`/dashboard/${user.role}`);
      setCheckingAuth(false);
    })();
  }, [router]);

  const loadPayments = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_URL}/payments`);
      if (!res.ok) throw new Error(`Failed to load payments (${res.status})`);
      const json = await res.json();
      setPayments(json.data?.payments ?? []);
    } catch (err: any) {
      setError(err.message || "Failed to load payments");
      toast.error(err.message || "Failed to load payments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!checkingAuth) loadPayments();
  }, [checkingAuth, loadPayments]);

  const filtered = useMemo(
    () =>
      payments
        .filter((p) => statusFilter === "all" || p.status === statusFilter)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [payments, statusFilter]
  );

  const totalAmount = useMemo(
    () => filtered.filter((p) => p.status === "succeeded").reduce((sum, p) => sum + (p.amount || 0), 0),
    [filtered]
  );

  if (checkingAuth) return <FullScreenLoader label="Checking your session..." />;

  return (
    <div className="min-h-screen bg-[#F4F9FC] p-6 md:p-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#4A90D9]/10 p-3">
              <CreditCard className="h-7 w-7 text-[#2C5F8A]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
              <p className="text-sm text-gray-500">
                Total collected: <span className="font-semibold text-gray-700">${totalAmount.toFixed(2)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => loadPayments(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Couldn&apos;t load payments</p>
            <p className="mt-1">{error}</p>
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
              {s}
            </button>
          ))}
        </div>

        <Panel title={`Payments (${filtered.length})`}>
          {loading ? (
            <RowSkeleton rows={6} />
          ) : filtered.length === 0 ? (
            <EmptyState text="No payments match this filter" />
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <div key={p._id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {p.user?.name ?? "Unknown user"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {p.paymentMethod} &bull; {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      {(p.currency || "usd").toUpperCase()} ${p.amount?.toFixed(2)}
                    </p>
                    <StatusBadge status={p.status} />
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