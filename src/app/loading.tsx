// src/app/loading.tsx
'use client';

import { PawPrint } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#EAF8FC] via-white to-[#DDF5FF]">
      {/* Logo Animation */}
      <div className="relative mb-8">
        <div className="absolute inset-0 -m-8 rounded-full bg-[#ADD8E6]/20 animate-ping"></div>
        <div className="absolute inset-0 -m-4 rounded-full bg-[#4A90D9]/10 animate-pulse"></div>
        
        <div className="relative bg-white rounded-2xl p-6 shadow-2xl">
          <PawPrint className="h-16 w-16 text-[#4A90D9] animate-bounce" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[#1A1A2E]">
          Paw<span className="text-[#4A90D9]">Med</span>
        </h2>
        <div className="flex items-center justify-center gap-1">
          <span className="text-gray-500">Loading</span>
          <span className="inline-flex gap-1">
            <span className="w-2 h-2 bg-[#4A90D9] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-[#4A90D9] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-[#4A90D9] rounded-full animate-bounce"></span>
          </span>
        </div>
        <p className="text-sm text-gray-400">Please wait...</p>
      </div>

      {/* Progress Bar */}
      <div className="mt-8 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full w-0 bg-gradient-to-r from-[#ADD8E6] to-[#4A90D9] rounded-full animate-progress"></div>
      </div>

      {/* CSS using Tailwind instead of styled-jsx */}
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}