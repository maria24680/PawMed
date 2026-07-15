// src/app/admin/pets/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  PawPrint,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Loader2,
  AlertTriangle,
  User,
  Phone,
  Mail,
  Filter,
  Plus
} from 'lucide-react';
import { authFetch } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'neutered' | 'spayed';
  weight: number;
  weightUnit: 'kg' | 'lbs';
  color: string;
  microchipId?: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export default function AdminPetsPage() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('all');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchPets();
  }, [searchTerm, filterSpecies]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterSpecies !== 'all') params.append('species', filterSpecies);

      const res = await authFetch(`${API_URL}/pets?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setPets(data.data?.pets || []);
      } else {
        throw new Error(data.message || 'Failed to fetch pets');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async (petId: string) => {
    try {
      const res = await authFetch(`${API_URL}/pets/${petId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Pet deleted successfully');
        fetchPets();
      } else {
        throw new Error(data.message || 'Failed to delete pet');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete pet');
    }
  };

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case 'male': return '♂️';
      case 'female': return '♀️';
      default: return '⚧️';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const speciesList = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Reptile', 'Other'];

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#4A90D9]" />
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading Pets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <PawPrint className="w-6 h-6 text-[#4A90D9]" />
            All Pets
          </h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Manage all pets across the platform
          </p>
        </div>
        <Link
          href="/admin/pets/add"
          className="bg-[#4A90D9] hover:bg-[#2C5F8A] text-white px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Pet
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search pets by name, species, or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
            />
          </div>
          <select
            value={filterSpecies}
            onChange={(e) => setFilterSpecies(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm min-w-[140px]"
          >
            <option value="all">All Species</option>
            {speciesList.map((species) => (
              <option key={species} value={species}>{species}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pets Grid */}
      {pets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <PawPrint className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">No pets found</h3>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pets.map((pet) => (
            <div
              key={pet._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#ADD8E6] transition-all duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div className="h-48 relative bg-gradient-to-br from-[#ADD8E6]/30 to-[#4A90D9]/30">
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🐾
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-sm">{getGenderIcon(pet.gender)}</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                  {pet.species} • {calculateAge(pet.dateOfBirth)} years
                </div>
                {!pet.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-lg">
                      Inactive
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#4A90D9] transition-colors">
                      {pet.name}
                    </h3>
                    <p className="text-sm text-slate-500">{pet.breed}</p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {pet.weight} {pet.weightUnit}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    🎨 {pet.color}
                  </span>
                  {pet.microchipId && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                      🔲 {pet.microchipId}
                    </span>
                  )}
                  <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    📅 {formatDate(pet.dateOfBirth)}
                  </span>
                </div>

                {/* Owner Info */}
                {pet.owner && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {pet.owner.name}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {pet.owner.phone || 'N/A'}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <Link
                    href={`/admin/pets/${pet._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#4A90D9] text-white rounded-xl text-xs font-bold hover:bg-[#2C5F8A] transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View
                  </Link>
                  <Link
                    href={`/admin/pets/${pet._id}/edit`}
                    className="flex items-center justify-center p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition"
                  >
                    <Edit className="w-4 h-4 text-slate-500" />
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedPet(pet);
                      setShowDeleteModal(true);
                    }}
                    className="flex items-center justify-center p-2 border border-slate-200 rounded-xl hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Pet</h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to delete <span className="font-semibold text-slate-800">{selectedPet.name}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeletePet(selectedPet._id);
                  setShowDeleteModal(false);
                }}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
              >
                Delete Pet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}