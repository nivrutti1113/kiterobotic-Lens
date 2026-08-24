'use client';

import React, { useState } from 'react';
import { ShieldCheck, Download, Server, PackageCheck, BarChart3, CheckCircle2, FileSpreadsheet } from 'lucide-react';

export const AdminCompliance: React.FC = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadReport = () => {
    setDownloading(true);
    setTimeout(() => {
      const csvData = `KITE ROBOTICS - ATL / NEP 2020 COMPLIANCE AUDIT REPORT\nGenerated Date: ${new Date().toISOString()}\nSchool Name: Delhi Public School, Mathura Road\nATL Grant ID: ATL-IND-2026-8849\n\nTotal Enrolled Students: 420\nCompleted STEM Lens AI Scans: 1,485\nKinetic Canvas Code Runs: 3,290\nHardware USB Flash Success Rate: 96.4%\nNEP 2020 Grade 6+ Coding Curriculum Coverage: 100% Fully Compliant\n`;
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KiteRobotics_ATL_Compliance_Report_2026.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* Government & Compliance Header */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="font-extrabold text-lg text-white">NEP 2020 & Atal Tinkering Labs (ATL) Audit Hub</h2>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Automated reporting for NITI Aayog ATL grant compliance, PM SHRI alignment, and hardware lab utilization.
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-gray-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>{downloading ? 'Generating Audit CSV...' : 'Download Official ATL Audit Report (.CSV)'}</span>
        </button>
      </div>

      {/* Compliance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">NEP 2020 Grade 6+ Coding</span>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">100% Compliant</div>
          <p className="text-[10px] text-gray-500 mt-1">Computational thinking & robotics modules mapped</p>
        </div>

        <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">ATL Lab Usage Ratio</span>
          <div className="text-2xl font-extrabold text-cyan-400 mt-1">94.2% Active</div>
          <p className="text-[10px] text-gray-500 mt-1">420 of 446 students engaged weekly</p>
        </div>

        <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vernacular Adoption</span>
          <div className="text-2xl font-extrabold text-purple-400 mt-1">70% Vernacular</div>
          <p className="text-[10px] text-gray-500 mt-1">Hindi, Tamil, Marathi, Telugu & Bengali scans</p>
        </div>

        <div className="bg-gray-950 p-5 rounded-2xl border border-gray-800">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hardware Flash Success</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">96.4% USB</div>
          <p className="text-[10px] text-gray-500 mt-1">WebSerial firmware deployments without bricking</p>
        </div>
      </div>

      {/* Hardware Inventory Status */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-cyan-400" />
          <span>School Hardware Kit Inventory Tracker</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-white">Kite Robotics Arduino Kits</h4>
              <p className="text-[11px] text-gray-400">Total In-Lab: 45 Kits</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg">
              45/45 Operational
            </span>
          </div>

          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-white">ESP32 IoT Modules</h4>
              <p className="text-[11px] text-gray-400">Total In-Lab: 30 Kits</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg">
              30/30 Operational
            </span>
          </div>

          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-white">Ultrasonic & Servo Sensor Packs</h4>
              <p className="text-[11px] text-gray-400">Total In-Lab: 90 Sensor Units</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-lg">
              88/90 Operational
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
