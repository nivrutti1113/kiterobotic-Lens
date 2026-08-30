'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, ArrowLeft, Clock, Sparkles } from 'lucide-react';

export default function ArduinoComingSoonPage() {
  return (
    <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center p-6 text-slate-900">
      <div className="max-w-md w-full bg-white rounded-3xl border-2 border-slate-200 p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center font-bold shadow-sm">
          <Cpu className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            Ages 10+ · Tier 1 Basic
          </span>
          <h1 className="text-2xl font-black text-slate-900">Arduino Coding Studio</h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Honest Status: Coming Soon</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          The Arduino C++ Code & Hardware Wiring module is currently under active development for a future release pass. In the meantime, enjoy full drag-and-drop programming in <strong>Junior Blocks Studio</strong>!
        </p>

        <div className="pt-2 flex flex-col gap-2">
          <Link
            href="/kinetic-canvas/junior-blocks"
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Open Junior Blocks Studio Instead</span>
          </Link>

          <Link
            href="/kinetic-canvas"
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-2xl transition-colors flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
