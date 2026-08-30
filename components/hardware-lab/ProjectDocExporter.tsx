'use client';

import React from 'react';
import { FileText, Printer } from 'lucide-react';
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
    <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EEDCD0] flex flex-col gap-4 shadow-sm font-sans text-[#374151]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#111827] flex items-center gap-2 font-heading">
              <span>ATL Project Manual & PDF Exporter</span>
              <span className="text-[10px] bg-purple-100 text-purple-950 border border-purple-300 px-2.5 py-0.5 rounded-full font-black">
                NEP 2020 Aligned
              </span>
            </h3>
            <p className="text-xs text-[#374151] font-semibold">Generate printable PDF documentation, BOM list, and firmware code for school exhibitions.</p>
          </div>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md transition-all hover:scale-105 font-heading"
        >
          <Printer className="w-4 h-4 text-amber-300" />
          <span>Export PDF Manual 🖨️</span>
        </button>
      </div>
    </div>
  );
};
