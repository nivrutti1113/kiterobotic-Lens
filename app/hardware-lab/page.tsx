'use client';

import React from 'react';
import { TelemetryGrapher } from '@/components/hardware-lab/TelemetryGrapher';
import { PinoutInspector } from '@/components/hardware-lab/PinoutInspector';
import { HardwareDiagnostics } from '@/components/hardware-lab/HardwareDiagnostics';
import { WiringExporter } from '@/components/hardware-lab/WiringExporter';

export default function HardwareLabPage() {
  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <span>Kite Hardware Lab & Telemetry Studio</span>
            <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2.5 py-1 rounded-full font-bold">
              WebSerial Active
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time WebSerial hardware oscilloscope, pinout specification inspector, diagnostics suite, and schematic exporter.
          </p>
        </div>
      </div>

      {/* 1. Live Telemetry Oscilloscope */}
      <TelemetryGrapher />

      {/* 2. Interactive Pinout Inspector */}
      <PinoutInspector />

      {/* 3. Diagnostic & Benchmark Suite */}
      <HardwareDiagnostics />

      {/* 4. Wiring Schematics & BOM Exporter */}
      <WiringExporter />

    </div>
  );
}
