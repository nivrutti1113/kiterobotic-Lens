'use client';

import React from 'react';
import { TelemetryGrapher } from '@/components/hardware-lab/TelemetryGrapher';
import { CircuitWiringGenerator } from '@/components/hardware-lab/CircuitWiringGenerator';
import { ProjectDocExporter } from '@/components/hardware-lab/ProjectDocExporter';
import { PinoutInspector } from '@/components/hardware-lab/PinoutInspector';
import { HardwareDiagnostics } from '@/components/hardware-lab/HardwareDiagnostics';
import { WiringExporter } from '@/components/hardware-lab/WiringExporter';
import { BuddyBotGuide } from '@/components/BuddyBotGuide';

export default function HardwareLabPage() {
  return (
    <div className="space-y-8 font-sans text-[#374151]">
      
      {/* BuddyBot Student Guide */}
      <BuddyBotGuide
        step1="Pick components to view breadboard wiring 🔌"
        step2="Check 5V vs GND wire safety colors ⚡"
        step3="Export 1-Click PDF Manual for ATL Fair 📄"
        currentStep={1}
      />

      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EEDCD0]">
        <div>
          <h1 className="text-xl font-black text-[#111827] flex items-center gap-2.5 font-heading">
            <span>Hardware Wiring Lab & Exhibition Exporter</span>
            <span className="text-xs bg-purple-100 text-purple-950 border border-purple-300 px-2.5 py-0.5 rounded-full font-black">
              Class 3–12 Ready
            </span>
          </h1>
          <p className="text-xs text-[#374151] mt-1 font-semibold">
            View easy color-coded breadboard wiring schematics, export printable exhibition project manuals, and test sensor signals!
          </p>
        </div>
      </div>

      {/* 1. Multi-Component Circuit Wiring Generator */}
      <CircuitWiringGenerator />

      {/* 2. PDF Manual & Printable Exporter */}
      <ProjectDocExporter />

      {/* 3. Multi-Channel Telemetry Oscilloscope */}
      <TelemetryGrapher />

      {/* 4. Interactive Board Pinout Inspector */}
      <PinoutInspector />

      {/* 5. Diagnostic & Benchmark Suite */}
      <HardwareDiagnostics />

      {/* 6. Wiring Schematics Exporter */}
      <WiringExporter />

    </div>
  );
}
