'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'What services does PawMed offer?',
    answer: 'PawMed offers a comprehensive range of veterinary services including general checkups, vaccinations, surgeries, dental care, emergency services, and wellness care for all types of pets.'
  },
  {
    question: 'How do I book an appointment?',
    answer: 'You can book an appointment through our website by clicking on the "Book Appointment" button, or by calling our clinic directly at +1 (555) 123-4567.'
  },
  {
    question: 'What are your operating hours?',
    answer: 'We are open Monday through Saturday from 8:00 AM to 8:00 PM. For emergencies, we offer 24/7 services.'
  },
  {
    question: 'Do you accept pet insurance?',
    answer: 'Yes, we accept most major pet insurance providers. Please contact our office for more details about insurance coverage.'
  },
  {
    question: 'How can I access my pet\'s medical records?',
    answer: 'You can access your pet\'s medical records through your PawMed account dashboard. Simply log in to view and download records anytime.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#F8FAFC] relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#ADD8E6]/20 px-4 py-2 rounded-full mb-4">
            <span className="text-sm font-medium text-[#2C5F8A]">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A2E] mb-4">
            Frequently Asked <span className="text-[#4A90D9]">Questions</span>
          </h2>
          <p className="text-lg text-gray-600">Find answers to common questions about our services</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#ADD8E6]/5 transition-colors"
              >
                <span className="font-semibold text-[#1A1A2E]">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-[#4A90D9] flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  openIndex === index ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}