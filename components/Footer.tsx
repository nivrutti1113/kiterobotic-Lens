'use client';

import React from 'react';
import { Bot, ShieldCheck, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#EEDCD0] bg-[#FAF3EC] py-6 px-4 sm:px-6 lg:px-8 mt-16 text-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <Bot className="w-4.5 h-4.5 text-purple-600" />
            <span className="font-black text-purple-950 text-sm tracking-wide">KITE ROBOTICS</span>
            <span className="text-xs font-bold text-slate-500">| KMS CODING STUDIO & STEM LENS</span>
          </div>
          <p className="text-xs text-slate-500 max-w-lg font-medium">
            Empowering Indian School Students (Grades 3–12) with Vernacular AI, Visual Block Coding, Robotics & Simulation.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-1.5 bg-[#FFFDF9] border border-[#EEDCD0] px-3 py-1.5 rounded-xl shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>NEP 2020 & ATL Aligned</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#FFFDF9] border border-[#EEDCD0] px-3 py-1.5 rounded-xl shadow-sm">
            <Terminal className="w-3.5 h-3.5 text-purple-600" />
            <span>WebSerial & MicroPython Active</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-[#EEDCD0] mt-4 pt-3 text-center text-[11px] text-slate-500 font-semibold">
        © 2026 Built by KiteRobotics Pvt Ltd (kiterobotics.in). All rights reserved.
      </div>
    </footer>
  );
};
