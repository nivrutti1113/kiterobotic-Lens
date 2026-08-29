'use client';

import React from 'react';
import { Bot, ShieldCheck, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90 py-6 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <Bot className="w-4.5 h-4.5 text-sky-400" />
            <span className="font-extrabold text-slate-100 text-sm tracking-wide">KITE ROBOTICS</span>
            <span className="text-xs text-slate-400">| STEM LENS & KINETIC CANVAS</span>
          </div>
          <p className="text-xs text-slate-400 max-w-lg">
            Empowering Indian School Students (Grades 3–12) with Vernacular AI, Robotics, IoT & Simulation Education.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NEP 2020 & ATL Aligned</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            <span>WebSerial & MicroPython Active</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-4 pt-3 text-center text-[11px] text-slate-400 font-medium">
        © 2026 Built by KiteRobotics Pvt Ltd (kiterobotics.in). All rights reserved.
      </div>
    </footer>
  );
};
