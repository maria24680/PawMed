'use client';

import { FaTooth } from 'react-icons/fa6';
import {
  Stethoscope,
  Syringe,
  Scissors,
  Heart,
  Ambulance,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Stethoscope,
    title: 'General Checkup',
    description: 'Comprehensive health examination for your pets',
    price: '$60',
    color: '#4A90D9'
  },
  {
    icon: Syringe,
    title: 'Vaccination',
    description: 'Complete vaccination packages for all pets',
    price: '$85',
    color: '#2C5F8A'
  },
  {
    icon: Scissors,
    title: 'Spay/Neuter',
    description: 'Safe surgical sterilization procedures',
    price: '$350',
    color: '#4A90D9'
  },
  {
  icon: FaTooth,
  title: "Dental Care",
  description: "Professional dental cleaning and care",
  price: "$250",
  color: "#2C5F8A",
},
  {
    icon: Heart,
    title: 'Wellness Care',
    description: 'Annual wellness checkups and preventive care',
    price: '$120',
    color: '#4A90D9'
  },
  {
    icon: Ambulance,
    title: 'Emergency Care',
    description: '24/7 emergency medical services',
    price: '$200',
    color: '#2C5F8A'
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#ADD8E6]/20 px-4 py-2 rounded-full mb-4">
            <span className="text-sm font-medium text-[#2C5F8A]">Our Services</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A2E] mb-4">
            Veterinary <span className="text-[#4A90D9]">Services</span>
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive veterinary services for your beloved pets
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                <div className="p-8">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${service.color}15` }}
                  >
                    <Icon className="h-7 w-7" style={{ color: service.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold" style={{ color: service.color }}>
                      {service.price}
                    </span>
                    <Link
                      href="/appointments"
                      className="inline-flex items-center gap-1 text-sm font-medium text-[#4A90D9] hover:text-[#2C5F8A] transition-colors"
                    >
                      Book Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-1.5"
                  style={{ background: service.color }}
                ></div>
              </div>
            );
          })}
        </div>

       
      </div>
    </section>
  );
}