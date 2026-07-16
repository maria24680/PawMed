import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value?: number;
  accent?: "blue" | "amber" | "green";
}

const ACCENT_CLASSES: Record<string, string> = {
  blue: "bg-[#4A90D9]/10 text-[#2C5F8A]",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-green-50 text-green-600",
};

export default function StatCard({ icon, label, value, accent = "blue" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className={`mb-3 inline-flex rounded-xl p-2.5 ${ACCENT_CLASSES[accent]}`}>{icon}</div>
      <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}
