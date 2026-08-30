'use client';

import React from 'react';
import { Download, FileText } from 'lucide-react';
import { PROJECT_TEMPLATES } from '@/lib/projects-data';

export const WiringExporter: React.FC = () => {
  const handleDownloadSchematic = (title: string) => {
    const content = `======================================================\nKITE ROBOTICS HARDWARE SCHEMATIC & WIRING BOM\nProject: ${title}\nDate: ${new Date().toLocaleDateString()}\n======================================================\n\nCOMPONENTS REQUIRED:\n1. Arduino UNO R3 / ESP32 Board\n2. HC-SR04 Ultrasonic Distance Sensor\n3. Micro Servo Motor (SG90)\n4. L298N Motor Driver Module\n5. Breadboard & Jumper Wires\n\nWIRING DIAGRAM CONNECTION TABLE:\n- Sensor VCC  --> Arduino 5V\n- Sensor GND  --> Arduino GND\n- Sensor Trig --> Arduino Pin 9\n- Sensor Echo --> Arduino Pin 10\n- Servo Signal --> Arduino Pin 6\n\nSAFETY GUIDELINE:\nVerify common ground before applying power!\n`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_schematic.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EEDCD0] flex flex-col gap-6 shadow-sm font-sans text-[#374151]">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#EEDCD0] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#111827] font-heading">ATL Hardware Project Schematics & BOM Exporter</h2>
            <p className="text-xs text-[#374151] font-semibold">
              Download printable wiring diagrams, Bill of Materials (BOM), and firmware packages for lab kits.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PROJECT_TEMPLATES.map((proj) => (
          <div key={proj.id} className="bg-white p-4 rounded-2xl border border-[#EEDCD0] flex flex-col justify-between space-y-4 shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-purple-100 text-purple-950 border border-purple-300 font-heading">
                  {proj.targetGradeBand}
                </span>
                <span className="text-[10px] text-[#4B5563] font-bold">{proj.category}</span>
              </div>
              <h3 className="text-sm font-black text-[#111827] mt-2 font-heading">{proj.title}</h3>
              <p className="text-xs text-[#374151] mt-1 line-clamp-2 font-semibold">{proj.description}</p>
            </div>

            <button
              onClick={() => handleDownloadSchematic(proj.title)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#FAF3EC] border border-[#EEDCD0] hover:border-purple-600 hover:bg-purple-50 text-xs font-black text-purple-900 transition-colors font-heading"
            >
              <Download className="w-4 h-4 text-purple-700" />
              <span>Download Wiring & BOM Card</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
