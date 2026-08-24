'use client';

import React from 'react';
import { Bot, ShieldCheck, Heart, Sparkles, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-900 bg-gray-950/80 py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <span className="font-extrabold text-white tracking-wide">KITE ROBOTICS</span>
            <span className="text-xs text-gray-400">| STEM LENS & KINETIC CANVAS</span>
          </div>
          <p className="text-xs text-gray-400 max-w-lg">
            Empowering Indian School Students (Grades 3–12) with Vernacular AI, Robotics, IoT & Simulation Education.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>NEP 2020 & ATL Aligned</span>
          </div>
          <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-lg">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span>Vercel Serverless Ready</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-gray-900 mt-6 pt-4 text-center text-[11px] text-gray-400">
        © 2026 Kite Robotics India. Prepared by Pranab Chauhan, CEO & Co-Founder (kiterobotics.in).
      </div>
    </footer>
  );
};
