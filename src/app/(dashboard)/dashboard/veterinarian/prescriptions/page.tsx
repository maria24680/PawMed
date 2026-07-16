"use client";
import { useEffect, useState } from "react";
import { Pill, Plus, X } from "lucide-react";
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
  client?: { name: string };
}

interface Pet {
  _id: string;
  name: string;
}

export default function VeterinarianPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    petId: "",
    diagnosis: "",
    medicationName: "",
    medicationDosage: "",
    validUntil: "",
    notes: "",
  });

  const loadData = async () => {
    try {
      const [presRes, petsRes] = await Promise.all([
        authFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prescriptions`),
        authFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets`),
      ]);
      if (!presRes.ok) throw new Error(`Request failed: ${presRes.status}`);
      if (!petsRes.ok) throw new Error(`Request failed: ${petsRes.status}`);

      const presJson = await presRes.json();
      const petsJson = await petsRes.json();
      setPrescriptions(presJson.data.prescriptions ?? []);
      setPets(petsJson.data.pets ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load prescriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.petId || !form.medicationName || !form.validUntil) {
      setError("Please fill in pet, medication name, and valid-until date.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prescriptions`, {
        method: "POST",
        body: JSON.stringify({
          petId: form.petId,
          diagnosis: form.diagnosis,
          medications: [{ name: form.medicationName, dosage: form.medicationDosage }],
          validUntil: form.validUntil,
          notes: form.notes,
        }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json = await res.json();
      setPrescriptions((prev) => [json.data.prescription, ...prev]);
      setShowForm(false);
      setForm({
        petId: "",
        diagnosis: "",
        medicationName: "",
        medicationDosage: "",
        validUntil: "",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to create prescription.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 bg-white min-h-screen">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#4A90D9]/10 p-3">
            <Pill className="h-6 w-6 text-[#2C5F8A]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A2E]">Prescriptions</h1>
            <p className="text-sm text-[#4A4A5A]">Issued to your patients</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-xl bg-[#4A90D9] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#2C5F8A] transition"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "New Prescription"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#1A1A2E]">Pet</label>
              <select
                value={form.petId}
                onChange={(e) => setForm({ ...form, petId: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/20"
              >
                <option value="">Select a pet</option>
                {pets.map((pet) => (
                  <option key={pet._id} value={pet._id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#1A1A2E]">Diagnosis</label>
              <input
                value={form.diagnosis}
                onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                placeholder="e.g. Ear infection"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#1A1A2E]">Medication</label>
              <input
                value={form.medicationName}
                onChange={(e) => setForm({ ...form, medicationName: e.target.value })}
                placeholder="e.g. Amoxicillin"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#1A1A2E]">Dosage</label>
              <input
                value={form.medicationDosage}
                onChange={(e) => setForm({ ...form, medicationDosage: e.target.value })}
                placeholder="e.g. 250mg twice daily"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#1A1A2E]">Valid Until</label>
              <input
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1A1A2E] outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/20"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#1A1A2E]">Notes</label>
              <input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Optional notes"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#1A1A2E] placeholder:text-gray-400 outline-none focus:border-[#4A90D9] focus:ring-2 focus:ring-[#4A90D9]/20"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-[#4A90D9] px-5 py-2 text-sm font-semibold text-white hover:bg-[#2C5F8A] disabled:opacity-60 transition"
          >
            {submitting ? "Saving..." : "Save Prescription"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-[#4A4A5A]">Loading prescriptions...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : prescriptions.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
          <p className="text-[#4A4A5A]">No prescriptions issued yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((rx) => (
            <div key={rx._id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition">
              <div className="mb-1 flex items-center justify-between">
                <h3 className="font-semibold text-[#1A1A2E]">
                  {rx.pet?.name ?? "Pet"} — {rx.diagnosis ?? "Prescription"}
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    rx.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {rx.isActive ? "Active" : "Expired"}
                </span>
              </div>
              <p className="text-sm text-[#4A4A5A]">
                {rx.medications?.map((m) => m.name).join(", ") || "No medications listed"}
              </p>
              <p className="mt-1 text-xs text-[#6B6B7B]">
                Owner: {rx.client?.name ?? "—"} · Issued {new Date(rx.issuedDate).toLocaleDateString()}
                {" · "}Valid until {new Date(rx.validUntil).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}