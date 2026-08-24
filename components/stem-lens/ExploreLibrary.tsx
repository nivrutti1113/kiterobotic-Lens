'use client';

import React from 'react';
import { Compass, Scan, Sparkles, ArrowUpRight } from 'lucide-react';
import { StemComponent, STEM_COMPONENTS } from '@/lib/stem-data';

interface ExploreLibraryProps {
  onSelectComponent: (comp: StemComponent) => void;
}

export const ExploreLibrary: React.FC<ExploreLibraryProps> = ({ onSelectComponent }) => {
  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="font-bold text-base text-white">Explore Mode Hardware Catalog</h3>
            <p className="text-xs text-gray-400">
              No physical hardware kit? Scan any component below virtually to inspect its internal mechanics.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          {STEM_COMPONENTS.length} Interactive Modules
        </span>
      </div>

      {/* Grid of STEM Hardware */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STEM_COMPONENTS.map((comp) => (
          <div
            key={comp.id}
            onClick={() => onSelectComponent(comp)}
            className="group relative rounded-2xl bg-gray-950 border border-gray-800 overflow-hidden hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="aspect-video w-full overflow-hidden bg-gray-900">
              <img
                src={comp.imageUrl}
                alt={comp.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            
            <div className="p-3.5 flex flex-col justify-between flex-1">
              <div>
                <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider">
                  {comp.category}
                </span>
                <h4 className="text-xs font-bold text-white mt-0.5 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {comp.name}
                </h4>
                <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">{comp.shortDesc}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-900 flex items-center justify-between text-[11px] font-semibold text-cyan-400">
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
