'use client';

import React, { useState } from 'react';
import { Cpu, CheckCircle2, ShieldAlert, Layers, Info } from 'lucide-react';
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
    <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EEDCD0] flex flex-col gap-6 shadow-sm font-sans text-[#374151]">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEDCD0] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center">
            <Layers className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#111827] flex items-center gap-2 font-heading">
              <span>Multi-Component Circuit Wiring Generator</span>
              <span className="text-[10px] bg-purple-100 text-purple-950 border border-purple-300 px-2 py-0.5 rounded-full font-black">
                Auto-Schematic Engine
              </span>
            </h2>
            <p className="text-xs text-[#374151] font-semibold">
              Select hardware components to render instant breadboard wiring schematics, pin voltage limits, and color legends.
            </p>
          </div>
        </div>

        {/* Multi-Selection Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 font-heading">
          {Object.values(CIRCUIT_DATABASE).map((config) => {
            const isSelected = selectedIds.includes(config.componentId);
            return (
              <button
                key={config.componentId}
                onClick={() => handleToggleComponent(config.componentId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border ${
                  isSelected
                    ? 'bg-purple-700 text-white border-purple-800 shadow-md'
                    : 'bg-[#FAF3EC] border-[#EEDCD0] text-[#374151] hover:text-purple-900'
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
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#EEDCD0] flex flex-col justify-between min-h-[380px] relative overflow-hidden bg-grid-pattern shadow-sm">
          
          <div className="flex items-center justify-between text-xs text-[#374151] pb-2 border-b border-[#EEDCD0] font-semibold">
            <span className="font-mono text-purple-900 font-bold flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-700" /> Microcontroller Master: Arduino UNO R3
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-950 border border-emerald-300 px-2 py-0.5 rounded-full font-black font-heading">
              Common GND Bus Active
            </span>
          </div>

          {/* SVG Connection Diagram */}
          <div className="my-6 space-y-4">
            {activeConfigs.map((config) => (
              <div key={config.componentId} className="bg-[#FAF3EC] border border-[#EEDCD0] p-4 rounded-xl space-y-3">
                
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-[#111827] font-heading">{config.componentName}</span>
                  <span className="text-[10px] text-purple-900 font-mono bg-purple-100 px-2 py-0.5 rounded border border-purple-300 font-bold">
                    {config.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {config.wireConnections.map((wire, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActivePin(wire)}
                      className="p-2 rounded-lg bg-white border border-[#EEDCD0] hover:border-purple-500 flex items-center justify-between text-[11px] cursor-pointer transition-colors group shadow-sm font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          style={{ backgroundColor: wire.wireColor }}
                          className="w-3 h-3 rounded-full border border-slate-300 shrink-0 group-hover:scale-110 transition-transform"
                        />
                        <span className="font-mono text-[#111827] font-bold">{wire.pinName}</span>
                      </div>
                      <span className="font-mono text-purple-800 text-[10px] font-bold">{wire.targetPin}</span>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

          <div className="text-[10px] text-[#4B5563] font-mono font-bold flex items-center justify-between pt-2 border-t border-[#EEDCD0]">
            <span>Legend: Red=5V, Black=GND, Blue/Yellow/Purple=Signals</span>
            <span>Click any wire for pin specifications</span>
          </div>

        </div>

        {/* Right Pin Inspector & Wiring Table (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Active Pin Detailed Inspector */}
          <div className="bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0] flex flex-col gap-3 shadow-sm">
            <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-1.5 font-heading">
              <Info className="w-4 h-4 text-purple-700" /> Pin Voltage & Signal Inspector
            </h3>

            {activePin ? (
              <div className="bg-white p-3 rounded-xl border border-[#EEDCD0] space-y-2 text-xs font-semibold shadow-sm">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-purple-900 font-heading">{activePin.pinName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 font-black">
                    Logic: {activePin.voltage}
                  </span>
                </div>
                <p className="text-[#374151] text-[11px]">Connect to: <strong className="text-[#111827]">{activePin.targetPin}</strong></p>
                <div className="text-[10px] text-[#4B5563] font-mono">
                  Wire Encoding: <span style={{ color: activePin.wireColor }} className="font-black">{activePin.wireColor}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#4B5563] font-semibold bg-white/80 p-3 rounded-xl border border-[#EEDCD0]">
                Click any wire on the left diagram to view detailed pin voltage limits and signal types.
              </p>
            )}
          </div>

          {/* Combined Bill of Materials & Safety Guide */}
          <div className="bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0] flex-1 flex flex-col justify-between gap-3 shadow-sm">
            <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-1.5 font-heading">
              <ShieldAlert className="w-4 h-4 text-amber-700" /> Circuit Safety & Voltage Mandates
            </h3>

            <div className="space-y-2 text-[11px] text-[#374151] font-semibold overflow-y-auto max-h-48 pr-1">
              {activeConfigs.flatMap((c) => c.safetyTips).map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-[#EEDCD0] shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#EEDCD0] text-[11px] text-[#4B5563] font-bold flex items-center justify-between">
              <span>Selected Modules: {activeConfigs.length}</span>
              <span className="text-purple-800 font-black font-heading">100% NEP & ATL Compliant</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
