'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Loader2, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('http://localhost:5000/api/v1/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to transmit message payload. Please try again.');
      }

      setSuccessMsg('Your message has been delivered. Our support staff will contact you shortly.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'A network communication timeout occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header Section */}
        <div className="mb-12 text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 uppercase tracking-tight">
            Contact <span className="text-[#466c94]">PawMed</span> Hub
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Have queries regarding clinical diagnostics, surgery bookings, or billing info? Reach out to our 24/7 care support center in Dhaka.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Info Matrix Panel Column */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-[#1A1A2E] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
              <h3 className="text-sm font-black tracking-widest uppercase text-[#ADD8E6] border-b border-slate-800 pb-3">
                Clinic Coordinates
              </h3>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-slate-800 rounded-xl text-[#ADD8E6] mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dhaka HQ Address</h4>
                  <p className="text-white text-xs font-semibold mt-1 leading-relaxed">
                    House 42, Road 11, Banani<br />
                    Dhaka - 1213, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-slate-800 rounded-xl text-[#ADD8E6] mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Emergency Hotline</h4>
                  <p className="text-white text-xs font-bold mt-1 tracking-wide">+880 1712-345678</p>
                  <p className="text-slate-400 text-[10px] font-medium mt-0.5">Available 24/7 for trauma response</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-slate-800 rounded-xl text-[#ADD8E6] mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Correspondence</h4>
                  <p className="text-white text-xs font-semibold mt-1 truncate">support@pawmed.com.bd</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-slate-800 rounded-xl text-[#ADD8E6] mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operating Windows</h4>
                  <p className="text-white text-xs font-semibold mt-1">Mon - Sun : 24 Hours Emergency Intake</p>
                  <p className="text-slate-400 text-[10px] font-medium mt-0.5">Routine Checkups: 9:00 AM - 9:00 PM</p>
                </div>
              </div>
            </div>

            {/* Security Guarantee Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 text-slate-500 font-semibold text-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Encrypted data transport layer safeguarding client parameters.</span>
            </div>

          </div>

          {/* Interactive Request Message Form Column */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
            <h3 className="text-base font-black text-slate-800 uppercase tracking-tight mb-6">
              Transmit Digital Correspondence Form
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-xl">
                  ⚠️ Request Error: {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl">
                  🎉 Message Logged: {successMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Identity Name</label>
                  <input
                    type="text" required name="name" value={formData.name} onChange={handleChange}
                    placeholder="Rahim Ahmed"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm text-slate-700 font-medium placeholder-slate-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email" required name="email" value={formData.email} onChange={handleChange}
                    placeholder="rahim@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm text-slate-700 font-medium placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subject Heading</label>
                <input
                  type="text" required name="subject" value={formData.subject} onChange={handleChange}
                  placeholder="e.g., Requesting specialized diagnostics records transfer"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm text-slate-700 font-medium placeholder-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Detailed Message Body</label>
                <textarea
                  rows={5} required name="message" value={formData.message} onChange={handleChange}
                  placeholder="Elaborate details or pet ID tracking index..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ADD8E6] text-sm text-slate-700 font-medium placeholder-slate-400"
                />
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full sm:w-auto bg-[#466c94] hover:bg-[#1A1A2E] text-white text-xs font-black tracking-widest uppercase px-8 py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing Transmission...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Dispatch Request
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
}