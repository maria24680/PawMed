"use client";
import { useEffect, useState } from "react";
import { CreditCard } from "lucide-react";
import { authFetch } from "@/lib/auth-client";

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  receiptUrl?: string;
  appointment?: { appointmentType?: string };
}

export default function ClientPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        setPayments(json.data.payments ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load payments.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-[#4A90D9]/10 p-3">
          <CreditCard className="h-6 w-6 text-[#2C5F8A]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500">Your billing history</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading payments...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : payments.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-gray-500">No payments yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div>
                <h3 className="font-semibold text-gray-900">
                  {p.appointment?.appointmentType ?? "Payment"}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString()} · {p.paymentMethod}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {p.amount.toFixed(2)} {p.currency.toUpperCase()}
                </p>
                {p.receiptUrl && (
                  <a
                    href={p.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#2C5F8A] underline"
                  >
                    View receipt
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}