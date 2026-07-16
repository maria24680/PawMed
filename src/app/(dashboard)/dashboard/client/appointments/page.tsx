"use client";
import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { authFetch } from "@/lib/auth-client";

interface Appointment {
  _id: string;
  appointmentType: string;
  date: string;
  time: string;
  status: string;
  priority?: string;
  pet?: { name: string };
  veterinarian?: { name: string };
}

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function ClientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        setAppointments(json.data.appointments ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointments.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-[#4A90D9]/10 p-3">
          <CalendarClock className="h-6 w-6 text-[#2C5F8A]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500">Your upcoming visits</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading appointments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : appointments.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-gray-500">No appointments yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div>
                <h3 className="font-semibold text-gray-900">
                  {appt.appointmentType} — {appt.pet?.name ?? "Pet"}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(appt.date).toLocaleDateString()} at {appt.time}
                  {appt.veterinarian?.name ? ` · Dr. ${appt.veterinarian.name}` : ""}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  statusColors[appt.status] ?? "bg-gray-100 text-gray-700"
                }`}
              >
                {appt.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}