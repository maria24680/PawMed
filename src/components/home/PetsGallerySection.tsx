/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/immutability */
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  PawPrint, 
  Heart, 
  Calendar, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Clock,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Play
} from 'lucide-react';

// Mock data - Backend থেকে আসবে
const petsData = [
  {
    id: 1,
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80',
    owner: 'Sarah Johnson',
    status: 'Healthy',
    vaccinations: ['Rabies', 'Distemper'],
    color: '#4A90D9',
    description: 'Friendly and energetic Golden Retriever who loves to play fetch.'
  },
  {
    id: 2,
    name: 'Bella',
    species: 'Cat',
    breed: 'Persian Cat',
    age: 2,
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80',
    owner: 'Mike Peterson',
    status: 'Recovering',
    vaccinations: ['FVRCP', 'Rabies'],
    color: '#2C5F8A',
    description: 'Beautiful Persian cat with a calm and gentle personality.'
  },
  {
    id: 3,
    name: 'Charlie',
    species: 'Dog',
    breed: 'French Bulldog',
    age: 4,
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80',
    owner: 'Emma Wilson',
    status: 'Healthy',
    vaccinations: ['Rabies', 'Bordetella'],
    color: '#4A90D9',
    description: 'Playful French Bulldog who loves cuddles and attention.'
  },
  {
    id: 4,
    name: 'Luna',
    species: 'Cat',
    breed: 'Siamese Cat',
    age: 1,
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=600&q=80',
    owner: 'David Brown',
    status: 'Active',
    vaccinations: ['FVRCP', 'FeLV'],
    color: '#2C5F8A',
    description: 'Curious and talkative Siamese cat who loves to explore.'
  },
  {
    id: 5,
    name: 'Rocky',
    species: 'Dog',
    breed: 'German Shepherd',
    age: 5,
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&q=80',
    owner: 'Lisa Martinez',
    status: 'Healthy',
    vaccinations: ['Rabies', 'Distemper', 'Parvovirus'],
    color: '#4A90D9',
    description: 'Loyal and intelligent German Shepherd, great with families.'
  },
  {
    id: 6,
    name: 'Milo',
    species: 'Cat',
    breed: 'Maine Coon',
    age: 3,
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
    owner: 'James Wilson',
    status: 'Recovering',
    vaccinations: ['FVRCP', 'Rabies'],
    color: '#2C5F8A',
    description: 'Majestic Maine Coon with a friendly and affectionate nature.'
  },
  {
    id: 7,
    name: 'Coco',
    species: 'Dog',
    breed: 'Poodle',
    age: 2,
    gender: 'Female',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80',
    owner: 'Rachel Green',
    status: 'Healthy',
    vaccinations: ['Rabies', 'Parvovirus'],
    color: '#4A90D9',
    description: 'Smart and elegant Poodle who loves to perform tricks.'
  },
  {
    id: 8,
    name: 'Simba',
    species: 'Cat',
    breed: 'Bengal Cat',
    age: 4,
    gender: 'Male',
    image: 'https://images.unsplash.com/photo-1529778873920-4d0d79c1c7af?w=600&q=80',
    owner: 'Tom Harris',
    status: 'Active',
    vaccinations: ['FVRCP', 'Rabies', 'FeLV'],
    color: '#2C5F8A',
    description: 'Exotic Bengal cat with a wild look and playful personality.'
  }
];

export default function PetsGallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedPet, setSelectedPet] = useState<typeof petsData[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-slide
  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % petsData.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % petsData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + petsData.length) % petsData.length);
  };

  const openModal = (pet: typeof petsData[0]) => {
    setSelectedPet(pet);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPet(null);
    document.body.style.overflow = 'auto';
  };

  // Get 4 pets for grid view
  const displayPets = petsData.slice(0, 4);

  return (
    <section className="py-24 bg-linear-to-br from-white via-[#F8FAFC] to-[#EAF8FC] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-[#ADD8E6]/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#4A90D9]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-[#ADD8E6]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#ADD8E6]/30 px-5 py-2.5 rounded-full mb-5 shadow-lg">
            <Sparkles className="h-4 w-4 text-[#4A90D9]" />
            <span className="text-sm font-medium text-[#2C5F8A]">Pet Gallery</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A2E] mb-4 leading-tight">
            Meet Our <span className="text-[#4A90D9] relative">
              Happy Pets
              <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                <path d="M1 3C50 1 100 5 199 3" stroke="#4A90D9" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Discover the adorable pets in our care and their heartwarming stories
          </p>
        </div>

        {/* Featured Pet Carousel */}
        <div 
          className="relative max-w-5xl mx-auto mb-16"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-[#1A1A2E]/70 via-[#1A1A2E]/30 to-transparent z-10"></div>
            
            {/* Image */}
            <div className="relative h-112.5 md:h-125 w-full">
              <Image
                src={petsData[currentIndex].image}
                alt={petsData[currentIndex].name}
                fill
                className="object-cover transition-transform duration-1000 scale-105"
                priority
              />
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-20">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Featured Pet
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="h-4 w-4 fill-yellow-400" />
                        <span className="text-white text-sm">4.9</span>
                      </div>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">
                      {petsData[currentIndex].name}
                    </h3>
                    <p className="text-white/80 text-lg">
                      {petsData[currentIndex].breed} • {petsData[currentIndex].age} years • {petsData[currentIndex].gender}
                    </p>
                    <p className="text-white/60 text-sm mt-2 max-w-md line-clamp-2">
                      {petsData[currentIndex].description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {petsData[currentIndex].vaccinations.slice(0, 2).map((v, idx) => (
                        <span key={idx} className="text-xs bg-white/20 backdrop-blur-sm text-white/90 px-3 py-1 rounded-full">
                          {v}
                        </span>
                      ))}
                      {petsData[currentIndex].vaccinations.length > 2 && (
                        <span className="text-xs bg-white/20 backdrop-blur-sm text-white/70 px-3 py-1 rounded-full">
                          +{petsData[currentIndex].vaccinations.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                  
                 
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`absolute top-6 right-6 z-20 px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg
              ${petsData[currentIndex].status === 'Healthy' ? 'bg-green-500' : 
                petsData[currentIndex].status === 'Recovering' ? 'bg-yellow-500' : 
                'bg-blue-500'}`}
            >
              {petsData[currentIndex].status}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {petsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Pet Grid */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-[#1A1A2E]">
                All <span className="text-[#4A90D9]">Pets</span>
              </h3>
              <p className="text-sm text-gray-500">Our lovely pets looking for care</p>
            </div>
            <Link
              href="/pets"
              className="flex items-center gap-2 text-sm font-semibold text-[#4A90D9] hover:text-[#2C5F8A] transition-colors group"
            >
              View All
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayPets.map((pet, index) => (
              <div
                key={pet.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={pet.image}
                    alt={pet.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Quick View Button */}
                  <button
                    onClick={() => openModal(pet)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    <span className="bg-white/90 backdrop-blur-sm text-[#1A1A2E] px-4 py-2 rounded-full text-sm font-semibold shadow-lg hover:bg-white transition-colors">
                      Quick View
                    </span>
                  </button>

                  <div className={`absolute top-3 right-3 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg
                    ${pet.status === 'Healthy' ? 'bg-green-500' : 
                      pet.status === 'Recovering' ? 'bg-yellow-500' : 
                      'bg-blue-500'}`}
                  >
                    {pet.status}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-[#1A1A2E] group-hover:text-[#4A90D9] transition-colors">
                        {pet.name}
                      </h4>
                      <p className="text-sm text-gray-500">{pet.breed}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Heart className="h-4 w-4 text-red-400 fill-red-400" />
                      <span>{pet.age}y</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-medium text-gray-700">Owner:</span>
                    {pet.owner}
                  </div>

                  <button
                    onClick={() => openModal(pet)}
                    className="mt-4 w-full py-2.5 text-center text-sm font-semibold text-[#4A90D9] border-2 border-[#4A90D9] rounded-xl hover:bg-[#4A90D9] hover:text-white transition-all duration-300 group-hover:shadow-lg"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== MODAL ===== */}
        {isModalOpen && selectedPet && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <div 
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                >
                  ✕
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Image */}
                  <div className="relative h-80 md:h-full min-h-75">
                    <Image
                      src={selectedPet.image}
                      alt={selectedPet.name}
                      fill
                      className="object-cover"
                    />
                    <div className={`absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg
                      ${selectedPet.status === 'Healthy' ? 'bg-green-500' : 
                        selectedPet.status === 'Recovering' ? 'bg-yellow-500' : 
                        'bg-blue-500'}`}
                    >
                      {selectedPet.status}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-8">
                    <h3 className="text-3xl font-bold text-[#1A1A2E]">{selectedPet.name}</h3>
                    <p className="text-gray-500">{selectedPet.breed}</p>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-[#F8FAFC] p-4 rounded-xl">
                        <span className="text-xs text-gray-500">Species</span>
                        <p className="font-semibold">{selectedPet.species}</p>
                      </div>
                      <div className="bg-[#F8FAFC] p-4 rounded-xl">
                        <span className="text-xs text-gray-500">Age</span>
                        <p className="font-semibold">{selectedPet.age} years</p>
                      </div>
                      <div className="bg-[#F8FAFC] p-4 rounded-xl">
                        <span className="text-xs text-gray-500">Gender</span>
                        <p className="font-semibold">{selectedPet.gender}</p>
                      </div>
                      <div className="bg-[#F8FAFC] p-4 rounded-xl">
                        <span className="text-xs text-gray-500">Owner</span>
                        <p className="font-semibold">{selectedPet.owner}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <p className="text-gray-600 text-sm">{selectedPet.description}</p>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Vaccinations</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPet.vaccinations.map((v, idx) => (
                          <span key={idx} className="text-xs bg-[#ADD8E6]/20 text-[#2C5F8A] px-3 py-1 rounded-full">
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link
                      href={`/pets/${selectedPet.id}`}
                      className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4A90D9] text-white rounded-xl font-semibold hover:bg-[#2C5F8A] transition-all duration-300"
                    >
                      View Full Profile
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}