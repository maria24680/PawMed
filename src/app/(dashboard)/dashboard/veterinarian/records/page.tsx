"use client";
import { useEffect, useState } from "react";
import { ClipboardList, AlertTriangle } from "lucide-react";
import { authFetch } from "@/lib/auth-client";

interface MedicalRecord {
  _id: string;
  diagnosis?: string;
  symptoms?: string[];
  treatment?: string;
  notes?: string;
  visitDate: string;
  isEmergency?: boolean;
  status: string;
  pet?: { name: string; species: string; breed?: string };
  appointment?: { appointmentType?: string };
}

export default function VetRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicalrecords`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        setRecords(json.data.medicalRecords ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load medical records.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-[#4A90D9]/10 p-3">
          <ClipboardList className="h-6 w-6 text-[#2C5F8A]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
          <p className="text-sm text-gray-500">Patient medical history</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading records...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : records.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-gray-500">No medical records yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <div key={r._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900">
                  {r.pet?.name ?? "Pet"}
                  {r.pet?.species ? ` (${r.pet.species})` : ""}
                  {r.isEmergency && (
                    <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      <AlertTriangle size={12} />
                      Emergency
                    </span>
                  )}
                </h3>
                <span className="text-xs text-gray-400">
                  {new Date(r.visitDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {r.diagnosis || "No diagnosis recorded"}
              </p>
              {r.symptoms && r.symptoms.length > 0 && (
                <p className="mt-1 text-xs text-gray-400">
                  Symptoms: {r.symptoms.join(", ")}
                </p>
              )}
              {r.treatment && (
                <p className="mt-1 text-xs text-gray-400">Treatment: {r.treatment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}