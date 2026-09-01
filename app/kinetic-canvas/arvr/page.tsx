'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, CheckCircle2 } from 'lucide-react';
import { ThreeCanvas } from '@/components/3d-studio/ThreeCanvas';

export default function ARVRStudioPage() {
  return (
    <div className="min-h-screen bg-[#FAF3EC] text-slate-900 flex flex-col font-sans select-none">
      <header className="bg-[#FFFDF9] border-b-2 border-[#EEDCD0] px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/kinetic-canvas"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100/90 hover:bg-purple-200 text-purple-950 font-black text-xs transition-colors border border-purple-300 shadow-sm font-heading"
          >
            <ArrowLeft className="w-4 h-4 text-purple-700" />
            <span>← Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black shadow-sm">
              <Eye className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h1 className="font-black text-base text-slate-950 font-heading">AR/VR Immersive Lab</h1>
              <p className="text-[11px] font-bold text-slate-600">Spatial Augmented & Virtual Reality Simulator</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 flex flex-col overflow-hidden">
        <ThreeCanvas initialShape="torus" title="AR/VR Spatial Scene Viewport" />
      </div>
    </div>
  );
}
