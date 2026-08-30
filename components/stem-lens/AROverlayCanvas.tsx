'use client';

import React, { useState } from 'react';
import { Layers, Activity, Zap, Info } from 'lucide-react';
import { StemComponent } from '@/lib/stem-data';

interface AROverlayCanvasProps {
  component: StemComponent;
}

export const AROverlayCanvas: React.FC<AROverlayCanvasProps> = ({ component }) => {
  const [activePinIndex, setActivePinIndex] = useState<number | null>(0);
  const [showCurrentFlow, setShowCurrentFlow] = useState(true);

  const activePin = activePinIndex !== null ? component.arOverlays.pins[activePinIndex] : null;

  return (
    <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EEDCD0] flex flex-col gap-5 shadow-sm font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-700" />
          <h3 className="font-black text-base text-[#111827] font-heading">Point-and-Learn AR Overlay</h3>
        </div>
        <button
          onClick={() => setShowCurrentFlow(!showCurrentFlow)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-colors font-heading ${
            showCurrentFlow
              ? 'bg-purple-700 text-white border-purple-800 shadow'
              : 'bg-[#FAF3EC] text-[#374151] border-[#EEDCD0] hover:bg-purple-100'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{showCurrentFlow ? 'Current Flow: ANIMATED' : 'Current Flow: PAUSED'}</span>
        </button>
      </div>

      {/* Interactive AR SVG Overlay Box */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-[#EEDCD0]">
        
        {/* Background Image */}
        <img
          src={component.imageUrl}
          alt={component.name}
          className="w-full h-full object-cover filter contrast-105 brightness-90"
        />

        {/* SVG AR Lines & Current Animation */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {showCurrentFlow && (
            <path
              d="M 100 150 Q 200 80 350 180 T 500 120"
              fill="none"
              stroke="#00f2fe"
              strokeWidth="3"
              strokeDasharray="8 8"
              className="animate-[dash_2s_linear_infinite]"
            />
          )}

          {/* SVG Pin Hotspots */}
          {component.arOverlays.pins.map((pin, idx) => (
            <g key={idx} className="pointer-events-auto cursor-pointer" onClick={() => setActivePinIndex(idx)}>
              <circle
                cx={`${pin.x}%`}
                cy={`${pin.y}%`}
                r="14"
                className={`transition-all ${
                  activePinIndex === idx
                    ? 'fill-cyan-500/30 stroke-cyan-400 stroke-2 animate-ping'
                    : 'fill-purple-500/20 stroke-purple-400 stroke-1 hover:fill-cyan-500/30'
                }`}
              />
              <circle
                cx={`${pin.x}%`}
                cy={`${pin.y}%`}
                r="6"
                className={activePinIndex === idx ? 'fill-cyan-400' : 'fill-purple-400'}
              />
            </g>
          ))}
        </svg>

        {/* Pin Tooltips inside dark viewport */}
        {component.arOverlays.pins.map((pin, idx) => (
          <button
            key={idx}
            onClick={() => setActivePinIndex(idx)}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-md text-[10px] font-black shadow-xl transition-transform font-heading ${
              activePinIndex === idx
                ? 'bg-cyan-400 text-slate-950 scale-110 z-20 ring-4 ring-cyan-400/40'
                : 'bg-slate-950/90 text-white hover:text-cyan-300 border border-slate-700 hover:scale-105 z-10'
            }`}
          >
            {pin.label}
          </button>
        ))}

        {/* Signal Flow Status Bar Overlay inside dark viewport */}
        <div className="absolute top-3 left-3 right-3 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-white">
          <span className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-black text-cyan-300 font-heading">Signal Path:</span> {component.arOverlays.signalFlow}
          </span>
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/40 font-heading">
            {component.arOverlays.forceType}
          </span>
        </div>
      </div>

      {/* Active Pin Details Box */}
      {activePin && (
        <div className="bg-purple-100/70 border border-purple-300 p-4 rounded-2xl flex items-start gap-3">
          <Info className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-black text-purple-950 flex items-center gap-2 font-heading">
              <span>{activePin.label} Pin Overlay Info</span>
            </h4>
            <p className="text-xs text-[#374151] mt-1 font-semibold">{activePin.desc}</p>
          </div>
        </div>
      )}

    </div>
  );
};
