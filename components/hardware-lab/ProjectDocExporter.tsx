'use client';

import React from 'react';
import { FileText, Printer, Download, Sparkles, ShieldCheck } from 'lucide-react';
import { PROJECT_TEMPLATES, ProjectTemplate } from '@/lib/projects-data';
import { triggerPrintableProjectReport } from '@/lib/project-exporter';

interface ProjectDocExporterProps {
  project?: ProjectTemplate;
  customPython?: string;
  customCpp?: string;
}

export const ProjectDocExporter: React.FC<ProjectDocExporterProps> = ({
  project = PROJECT_TEMPLATES[0],
  customPython,
  customCpp,
}) => {
  const handleExport = () => {
    triggerPrintableProjectReport(project, customPython, customCpp);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
            <FileText className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <span>ATL Project Manual & PDF Exporter</span>
              <span className="text-[10px] bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full font-semibold">
                NEP 2020 Aligned
              </span>
            </h3>
            <p className="text-xs text-slate-400">Generate printable PDF documentation, BOM list, and firmware code for school exhibitions.</p>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-sky-500/25 transition-all hover:scale-105"
        >
          <Printer className="w-4 h-4" />
          <span>Export PDF Manual 🖨️</span>
        </button>
      </div>
    </div>
  );
};
