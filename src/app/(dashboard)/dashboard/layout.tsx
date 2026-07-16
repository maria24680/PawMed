"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Loader2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-client";
import DashboardSidebar, { DashboardRole } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [role, setRole] = useState<DashboardRole | null>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setRole(user.role as DashboardRole);
      setUserName(user.name || "");
      setChecking(false);
    })();
  }, [router]);

  if (checking || !role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F9FC]">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F9FC]">
      <DashboardSidebar
        role={role}
        userName={userName}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile topbar */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gray-800">PawMed</span>
          <div className="w-9" />
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
