'use client';

import React, { useState } from 'react';
import { Cpu, Zap, CheckCircle2, ShieldAlert, Layers, Download, Sliders, Info, Sparkles } from 'lucide-react';
import { CIRCUIT_DATABASE, HardwareCircuitConfig, PinMapping } from '@/lib/circuit-builder';

export const CircuitWiringGenerator: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['ultrasonic-hcsr04', 'servo-sg90']);
  const [activePin, setActivePin] = useState<PinMapping | null>(null);

  const activeConfigs = selectedIds
    .map((id) => CIRCUIT_DATABASE[id])
    .filter(Boolean) as HardwareCircuitConfig[];

  const handleToggleComponent = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((item) => item !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
              <span>Multi-Component Circuit Wiring Generator</span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">
                Auto-Schematic Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Select hardware components to render instant breadboard wiring schematics, pin voltage limits, and color legends.
            </p>
          </div>
        </div>

        {/* Multi-Selection Selector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.values(CIRCUIT_DATABASE).map((config) => {
            const isSelected = selectedIds.includes(config.componentId);
            return (
              <button
                key={config.componentId}
                onClick={() => handleToggleComponent(config.componentId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md shadow-sky-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}
                {config.componentName.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Breadboard Diagram Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive SVG Schematic Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between min-h-[380px] relative overflow-hidden bg-grid-pattern">
          
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-900">
            <span className="font-mono text-sky-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Microcontroller Master: Arduino UNO R3
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
              Common GND Bus Active
            </span>
          </div>

          {/* SVG Connection Diagram */}
          <div className="my-6 space-y-4">
            {activeConfigs.map((config) => (
              <div key={config.componentId} className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl space-y-3">
                
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-100">{config.componentName}</span>
                  <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                    {config.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {config.wireConnections.map((wire, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActivePin(wire)}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-sky-500/50 flex items-center justify-between text-[11px] cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          style={{ backgroundColor: wire.wireColor }}
                          className="w-3 h-3 rounded-full border border-white/20 shrink-0 group-hover:scale-110 transition-transform"
                        />
                        <span className="font-mono text-slate-300 font-semibold">{wire.pinName}</span>
                      </div>
                      <span className="font-mono text-sky-400 text-[10px]">{wire.targetPin}</span>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-900">
            <span>Legend: Red=5V, Black=GND, Blue/Yellow/Purple=Signals</span>
            <span>Click any wire for pin specifications</span>
          </div>

        </div>

        {/* Right Pin Inspector & Wiring Table (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Active Pin Detailed Inspector */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-400" /> Pin Voltage & Signal Inspector
            </h3>

            {activePin ? (
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-sky-300">{activePin.pinName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    Logic: {activePin.voltage}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px]">Connect to: <strong className="text-white">{activePin.targetPin}</strong></p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Wire Encoding: <span style={{ color: activePin.wireColor }} className="font-bold">{activePin.wireColor}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic bg-slate-900/50 p-3 rounded-xl border border-slate-900">
                Click any wire on the left diagram to view detailed pin voltage limits and signal types.
              </p>
            )}
          </div>

          {/* Combined Bill of Materials & Safety Guide */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex-1 flex flex-col justify-between gap-3">
            <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Circuit Safety & Voltage Mandates
            </h3>

            <div className="space-y-2 text-[11px] text-slate-300 overflow-y-auto max-h-48 pr-1">
              {activeConfigs.flatMap((c) => c.safetyTips).map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-900 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Selected Modules: {activeConfigs.length}</span>
              <span className="text-sky-400 font-bold">100% NEP & ATL Compliant</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
