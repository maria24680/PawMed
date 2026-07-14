'use client';

import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden" style={{ background: '#ADD8E6' }}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Mail className="h-4 w-4 text-[#2C5F8A]" />
            <span className="text-sm font-medium text-[#1A1A2E]">Newsletter</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">
            Subscribe to Our <span className="text-[#2C5F8A]">Newsletter</span>
          </h2>
          <p className="text-lg text-[#1A1A2E]/80 mb-8">
            Get the latest pet care tips, health advice, and exclusive offers directly in your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-6 py-3 rounded-xl border-2 border-white/50 bg-white/20 backdrop-blur-sm focus:outline-none focus:border-white/80 placeholder-gray-500 text-[#1A1A2E]"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-[#2C5F8A] text-white rounded-xl font-semibold hover:bg-[#1a3f5e] transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap flex items-center justify-center gap-2"
            >
              Subscribe
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>

          {subscribed && (
            <div className="mt-4 text-[#2C5F8A] font-medium animate-fade-in">
              <CheckCircle className="h-5 w-5 inline-block mr-2" />
              Thank you for subscribing! 🎉
            </div>
          )}

          <p className="text-xs text-[#1A1A2E]/60 mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}