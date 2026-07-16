"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Users,
  RefreshCw,
  Search,
  ShieldCheck,
  Stethoscope,
  UserCircle,
  Loader2,
} from "lucide-react";
import { authFetch, getCurrentUser } from "@/lib/auth-client";
import Panel from "@/components/dashboard/Panel";
import EmptyState from "@/components/dashboard/EmptyState";
import { RowSkeleton } from "@/components/dashboard/Skeletons";
import FullScreenLoader from "@/components/dashboard/FullScreenLoader";

// ============================================
// TYPES
// ============================================

type Role = "admin" | "veterinarian" | "client";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

const API_URL = "/api/backend"; // same-origin proxy -> Express

const ROLE_OPTIONS: Role[] = ["client", "veterinarian", "admin"];

const ROLE_STYLES: Record<Role, { bg: string; text: string; icon: React.ReactNode }> = {
  admin: { bg: "bg-purple-50", text: "text-purple-700", icon: <ShieldCheck size={14} /> },
  veterinarian: { bg: "bg-[#4A90D9]/10", text: "text-[#2C5F8A]", icon: <Stethoscope size={14} /> },
  client: { bg: "bg-gray-100", text: "text-gray-600", icon: <UserCircle size={14} /> },
};

// ============================================
// PAGE
// ============================================

export default function AdminUsersPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

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

  const loadUsers = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(null);

    try {
      const res = await authFetch(`${API_URL}/admin/users`);
      if (!res.ok) throw new Error(`Failed to load users (${res.status})`);

      const json = await res.json();
      setUsers(json.data?.users ?? []);
    } catch (err: any) {
      console.error("Admin users load error:", err);
      const message = err?.message || "Failed to load users";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!checkingAuth) loadUsers();
  }, [checkingAuth, loadUsers]);

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    setBusyUserId(userId);
    const previous = users;

    // optimistic update
    setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));

    try {
      const res = await authFetch(`${API_URL}/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Failed to update role (${res.status})`);
      }

      toast.success("Role updated successfully");
    } catch (err: any) {
      setUsers(previous); // rollback
      toast.error(err.message || "Could not update role");
    } finally {
      setBusyUserId(null);
    }
  };

  const handleToggleActive = async (userId: string, currentlyActive: boolean) => {
    setBusyUserId(userId);
    const previous = users;

    // optimistic update
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, isActive: !currentlyActive } : u))
    );

    try {
      const res = await authFetch(`${API_URL}/admin/users/${userId}/toggle`, {
        method: "PUT",
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Failed to update status (${res.status})`);
      }

      toast.success(`User ${!currentlyActive ? "activated" : "deactivated"}`);
    } catch (err: any) {
      setUsers(previous); // rollback
      toast.error(err.message || "Could not update user status");
    } finally {
      setBusyUserId(null);
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
              <Users className="h-7 w-7 text-[#2C5F8A]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Users</h1>
              <p className="text-sm text-gray-500">Manage all registered users</p>
            </div>
          </div>

          <button
            onClick={() => loadUsers(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p className="font-medium">Couldn&apos;t load users</p>
            <p className="mt-1">{error}</p>
            <button
              onClick={() => loadUsers()}
              className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#ADD8E6]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(["all", ...ROLE_OPTIONS] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  roleFilter === r
                    ? "bg-[#4A90D9] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Panel title={`All Users (${filteredUsers.length})`}>
          {loading ? (
            <RowSkeleton rows={6} />
          ) : filteredUsers.length === 0 ? (
            <EmptyState text="No users match your search" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-400">
                    <th className="py-3 pr-4 font-medium">User</th>
                    <th className="py-3 pr-4 font-medium">Phone</th>
                    <th className="py-3 pr-4 font-medium">Role</th>
                    <th className="py-3 pr-4 font-medium">Status</th>
                    <th className="py-3 pr-4 font-medium">Joined</th>
                    <th className="py-3 pr-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((u) => {
                    const style = ROLE_STYLES[u.role];
                    const isBusy = busyUserId === u._id;

                    return (
                      <tr key={u._id} className="align-middle">
                        <td className="py-3 pr-4">
                          <p className="font-semibold text-gray-900">{u.name || "—"}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{u.phone || "—"}</td>
                        <td className="py-3 pr-4">
                          <select
                            value={u.role}
                            disabled={isBusy}
                            onChange={(e) => handleRoleChange(u._id, e.target.value as Role)}
                            className={`rounded-lg border-0 px-2.5 py-1.5 text-xs font-semibold capitalize outline-none ring-1 ring-inset ring-gray-200 disabled:opacity-50 ${style.bg} ${style.text}`}
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                              u.isActive
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                u.isActive ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                            {u.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-gray-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <button
                            onClick={() => handleToggleActive(u._id, u.isActive)}
                            disabled={isBusy}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                              u.isActive
                                ? "border-red-200 text-red-600 hover:bg-red-50"
                                : "border-green-200 text-green-700 hover:bg-green-50"
                            }`}
                          >
                            {isBusy ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : u.isActive ? (
                              "Deactivate"
                            ) : (
                              "Activate"
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}