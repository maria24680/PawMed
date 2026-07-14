'use client';

import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    pet: 'Max (Golden Retriever)',
    rating: 5,
    comment: 'Excellent service! The staff is very caring and professional. My dog Max loves coming here.',
    image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=ADD8E6&color=1A1A2E&size=128',
    alt: 'Sarah Johnson'
  },
  {
    name: 'Mike Peterson',
    pet: 'Bella (Persian Cat)',
    rating: 5,
    comment: 'Best veterinary clinic I have ever visited. Highly recommended! Bella is always happy here.',
    image: 'https://ui-avatars.com/api/?name=Mike+Peterson&background=4A90D9&color=fff&size=128',
    alt: 'Mike Peterson'
  },
  {
    name: 'Emma Wilson',
    pet: 'Charlie (French Bulldog)',
    rating: 5,
    comment: 'The online appointment system is so convenient. Great experience every time!',
    image: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=2C5F8A&color=fff&size=128',
    alt: 'Emma Wilson'
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-[#F8FAFC] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ADD8E6] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#4A90D9] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#ADD8E6]/20 px-4 py-2 rounded-full mb-4">
            <span className="text-sm font-medium text-[#2C5F8A]">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A2E] mb-4">
            What Our <span className="text-[#4A90D9]">Clients Say</span>
          </h2>
          <p className="text-lg text-gray-600">Real stories from our happy clients</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#ADD8E6]/5 to-[#4A90D9]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <Quote className="h-8 w-8 text-[#ADD8E6] mb-4 relative z-10" />

              <div className="flex gap-1 mb-4 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-6 relative z-10">
                &quot;{testimonial.comment}&quot;
              </p>

              <div className="flex items-center gap-3 border-t pt-4 relative z-10">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-[#ADD8E6]/30 group-hover:ring-[#4A90D9] transition-all duration-300">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.alt}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[#1A1A2E] group-hover:text-[#4A90D9] transition-colors duration-300">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.pet}</p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-[#ADD8E6] to-[#4A90D9] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}