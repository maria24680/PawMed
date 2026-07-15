// src/app/profile/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Loader2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Shield,
  Calendar,
  PawPrint,
  Stethoscope,
  Clock,
} from 'lucide-react';
import { authFetch } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: 'admin' | 'veterinarian' | 'client';
  profileImage?: string;
  specialization?: string[];
  licenseNumber?: string;
  experience?: number;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age?: number;
  profileImage?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    profileImage: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchUserProfile();
    fetchUserPets();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found, redirecting to login');
        router.push('/auth/login');
        return;
      }

      // Use authFetch which handles the Authorization header
      const response = await authFetch(`${API_URL}/api/auth/me`);

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - token might be expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/auth/login');
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile data:', data);

      if (data.success && data.data?.user) {
        const userData = data.data.user;
        setProfile(userData);
        setFormData({
          name: userData.name || '',
          phone: userData.phone || '',
          address: userData.address || '',
          profileImage: userData.profileImage || '',
        });
      } else {
        throw new Error(data.message || 'Failed to load profile');
      }
    } catch (err: any) {
      console.error('Profile fetch error:', err);
      setError(err.message || 'Failed to load profile');
      toast.error(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPets = async () => {
    try {
      const response = await authFetch(`${API_URL}/api/pets`);
      const data = await response.json();
      
      if (data.success) {
        setPets(data.data?.pets || []);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update profile
      const response = await authFetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          profileImage: formData.profileImage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setProfile(data.data?.user || profile);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        
        // Update stored user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          user.name = formData.name;
          user.phone = formData.phone;
          user.address = formData.address;
          user.profileImage = formData.profileImage;
          localStorage.setItem('user', JSON.stringify(user));
        }
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Update error:', err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-700',
      veterinarian: 'bg-blue-100 text-blue-700',
      client: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-700'}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#4A90D9]" />
        <p className="mt-4 text-sm text-slate-400 font-medium">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-sm max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Something went wrong</h3>
          <p className="text-sm text-slate-500 mt-2">{error}</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="mt-4 px-6 py-2 bg-[#4A90D9] text-white rounded-xl text-sm font-bold hover:bg-[#2C5F8A] transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-slate-500">No profile data available</p>
        <button
          onClick={fetchUserProfile}
          className="mt-4 px-6 py-2 bg-[#4A90D9] text-white rounded-xl text-sm font-bold hover:bg-[#2C5F8A] transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-[#4A90D9]" />
            My Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage your personal information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2.5 bg-[#4A90D9] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#2C5F8A] transition"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#ADD8E6] bg-slate-100 flex items-center justify-center">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-1.5 bg-[#4A90D9] rounded-full cursor-pointer hover:bg-[#2C5F8A] transition">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2.5 bg-[#4A90D9] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#2C5F8A] transition flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: profile.name || '',
                          phone: profile.phone || '',
                          address: profile.address || '',
                          profileImage: profile.profileImage || '',
                        });
                        setImageFile(null);
                      }}
                      className="px-6 py-2.5 border border-slate-300 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-xl font-bold text-slate-800">{profile.name}</h2>
                    {getRoleBadge(profile.role)}
                    {profile.isActive ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        <X className="w-3.5 h-3.5" />
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {profile.email}
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {profile.phone || 'Not provided'}
                    </div>
                    {profile.address && (
                      <div className="flex items-center gap-2 text-slate-600 sm:col-span-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {profile.address}
                      </div>
                    )}
                  </div>
                  {profile.role === 'veterinarian' && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-xl">
                      <div className="flex items-center gap-4 text-sm text-blue-700 flex-wrap">
                        {profile.specialization && (
                          <span>Specialization: {profile.specialization.join(', ')}</span>
                        )}
                        {profile.licenseNumber && (
                          <span>License: {profile.licenseNumber}</span>
                        )}
                        {profile.experience && (
                          <span>Experience: {profile.experience} years</span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                    <span>Joined {formatDate(profile.createdAt)}</span>
                    {profile.emailVerified ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Not verified
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pets Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <PawPrint className="w-5 h-5 text-[#4A90D9]" />
            My Pets ({pets.length})
          </h2>
          <Link
            href="/pets/add"
            className="px-4 py-2 bg-[#ADD8E6] text-[#1A1A2E] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#9BC5D6] transition"
          >
            Add Pet
          </Link>
        </div>

        {pets.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <PawPrint className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No pets registered yet</p>
            <Link
              href="/pets/add"
              className="inline-block mt-3 text-[#4A90D9] text-sm font-bold hover:underline"
            >
              Add your first pet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map((pet) => (
              <Link
                key={pet._id}
                href={`/pets/${pet._id}`}
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-[#ADD8E6] transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#ADD8E6]/20 flex items-center justify-center overflow-hidden">
                    {pet.profileImage ? (
                      <img src={pet.profileImage} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                      <PawPrint className="w-6 h-6 text-[#4A90D9]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{pet.name}</h3>
                    <p className="text-xs text-slate-500">{pet.species} • {pet.breed}</p>
                    {pet.age && <p className="text-xs text-slate-400">{pet.age} years old</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              router.push('/auth/login');
            }}
            className="px-6 py-2.5 border border-red-300 text-red-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition"
          >
            Logout
          </button>
          <button
            onClick={() => router.push('/change-password')}
            className="px-6 py-2.5 border border-slate-300 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 transition"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}