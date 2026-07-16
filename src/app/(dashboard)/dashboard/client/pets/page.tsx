"use client";
import { useEffect, useState } from "react";
import { PawPrint } from "lucide-react";
import { authFetch } from "@/lib/auth-client";

interface Pet {
  _id: string;
  name: string;
  species: string;
  breed?: string;
  profileImage?: string;
  isActive?: boolean;
}

export default function ClientPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets`);
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        setPets(json.data.pets ?? []);
      } catch (err) {
        console.error(err);
        setError("Failed to load pets.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-[#4A90D9]/10 p-3">
          <PawPrint className="h-6 w-6 text-[#2C5F8A]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Pets</h1>
          <p className="text-sm text-gray-500">Manage your pets' profiles</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading pets...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : pets.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-gray-500">No pets yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <img
                src={pet.profileImage || "https://ui-avatars.com/api/?background=random&name=Pet"}
                alt={pet.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                <p className="text-sm text-gray-500">
                  {pet.species}
                  {pet.breed ? ` · ${pet.breed}` : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}