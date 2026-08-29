'use client';

import React from 'react';
import { TelemetryGrapher } from '@/components/hardware-lab/TelemetryGrapher';
import { CircuitWiringGenerator } from '@/components/hardware-lab/CircuitWiringGenerator';
import { ProjectDocExporter } from '@/components/hardware-lab/ProjectDocExporter';
import { PinoutInspector } from '@/components/hardware-lab/PinoutInspector';
import { HardwareDiagnostics } from '@/components/hardware-lab/HardwareDiagnostics';
import { WiringExporter } from '@/components/hardware-lab/WiringExporter';

export default function HardwareLabPage() {
  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-100 flex items-center gap-2.5">
            <span>Kite Hardware Lab & Multi-Component Studio</span>
            <span className="text-xs bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2.5 py-0.5 rounded-full font-bold">
              WebSerial Active
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time WebSerial hardware oscilloscope, multi-component circuit wiring generator, PDF project manual exporter, and diagnostic suite.
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
