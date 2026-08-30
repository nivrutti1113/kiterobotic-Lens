'use client';

import React from 'react';
import { Compass, Scan, ArrowUpRight } from 'lucide-react';
import { StemComponent, STEM_COMPONENTS } from '@/lib/stem-data';

interface ExploreLibraryProps {
  onSelectComponent: (comp: StemComponent) => void;
}

export const ExploreLibrary: React.FC<ExploreLibraryProps> = ({ onSelectComponent }) => {
  return (
    <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EEDCD0] flex flex-col gap-6 shadow-sm font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-purple-700" />
          <div>
            <h3 className="font-black text-base text-[#111827] font-heading">Explore Mode Hardware Catalog</h3>
            <p className="text-xs text-[#374151] font-semibold">
              No physical hardware kit? Scan any component below virtually to inspect its internal mechanics.
            </p>
          </div>
        </div>
        <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-100 text-purple-950 border border-purple-300 font-heading">
          {STEM_COMPONENTS.length} Interactive Modules
        </span>
      </div>

      {/* Grid of STEM Hardware */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STEM_COMPONENTS.map((comp) => (
          <div
            key={comp.id}
            onClick={() => onSelectComponent(comp)}
            className="group relative rounded-2xl bg-white border border-[#EEDCD0] overflow-hidden hover:border-purple-600 transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md"
          >
            <div className="aspect-video w-full overflow-hidden bg-slate-100">
              <img
                src={comp.imageUrl}
                alt={comp.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <div className="p-3.5 flex flex-col justify-between flex-1">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-800 tracking-wider font-heading">
                  {comp.category}
                </span>
                <h4 className="text-xs font-black text-[#111827] mt-0.5 line-clamp-1 group-hover:text-purple-700 transition-colors font-heading">
                  {comp.name}
                </h4>
                <p className="text-[11px] text-[#374151] mt-1 line-clamp-2 font-medium">{comp.shortDesc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#EEDCD0] flex items-center justify-between text-[11px] font-black text-purple-700 font-heading">
                <span className="flex items-center gap-1">
                  <Scan className="w-3.5 h-3.5" /> Virtual Scan
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
