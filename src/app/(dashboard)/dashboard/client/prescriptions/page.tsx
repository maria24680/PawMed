"use client";
import { useEffect, useState } from "react";
import { Pill } from "lucide-react";
import { authFetch } from "@/lib/auth-client";

interface Medication {
  name: string;
  dosage?: string;
}

interface Prescription {
  _id: string;
  diagnosis?: string;
  medications: Medication[];
  issuedDate: string;
  validUntil: string;
  isActive: boolean;
  pet?: { name: string };
  veterinarian?: { name: string };
}

export default function ClientPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prescriptions`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        setPrescriptions(json.data.prescriptions ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load prescriptions.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-[#4A90D9]/10 p-3">
          <Pill className="h-6 w-6 text-[#2C5F8A]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-sm text-gray-500">Your pets' prescriptions</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading prescriptions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : prescriptions.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-gray-500">No prescriptions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((rx) => (
            <div key={rx._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">
                  {rx.pet?.name ?? "Pet"} — {rx.diagnosis ?? "Prescription"}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    rx.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {rx.isActive ? "Active" : "Expired"}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {rx.medications?.map((m) => m.name).join(", ") || "No medications listed"}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Issued {new Date(rx.issuedDate).toLocaleDateString()} · Valid until{" "}
                {new Date(rx.validUntil).toLocaleDateString()}
                {rx.veterinarian?.name ? ` · Dr. ${rx.veterinarian.name}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}