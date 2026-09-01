'use client';

import React, { useState } from 'react';
import { Category, BlockInstance } from '@/lib/junior-blocks/types';
import { BLOCK_DEFINITIONS } from '@/lib/junior-blocks/blocks-def';
import { BlockView } from './BlockView';
import { Navigation, Eye, Zap, Sliders, Volume2, Radio, Calculator } from 'lucide-react';

interface BlockPaletteProps {
  onDragStartBlockTemplate: (e: React.DragEvent, blockType: string) => void;
}

const CATEGORY_TABS: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'movement', label: 'Movement', icon: <Navigation className="w-3.5 h-3.5" /> },
  { id: 'looks', label: 'Looks', icon: <Eye className="w-3.5 h-3.5" /> },
  { id: 'events', label: 'Events', icon: <Zap className="w-3.5 h-3.5" /> },
  { id: 'control', label: 'Control', icon: <Sliders className="w-3.5 h-3.5" /> },
  { id: 'sound', label: 'Sound', icon: <Volume2 className="w-3.5 h-3.5" /> },
  { id: 'sensing', label: 'Sensing', icon: <Radio className="w-3.5 h-3.5" /> },
  { id: 'operators', label: 'Operators', icon: <Calculator className="w-3.5 h-3.5" /> },
];

export const BlockPalette: React.FC<BlockPaletteProps> = ({
  onDragStartBlockTemplate,
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>('movement');

  const categoryBlocks = Object.values(BLOCK_DEFINITIONS).filter(
    (b) => b.category === activeCategory
  );

  return (
    <div className="flex flex-col h-full w-full bg-[#FFFDF9] font-sans overflow-hidden">
      
      {/* Category Selection Tabs - Horizontal Header across Top of Bottom Dock */}
      <div className="px-3 py-2 bg-[#FAF3EC] border-b border-[#EEDCD0] flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
        <span className="text-[11px] font-black text-purple-900 uppercase tracking-wider font-heading shrink-0 mr-1">
          Block Categories:
        </span>
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all font-heading shrink-0 ${
                isActive
                  ? 'bg-purple-700 text-white shadow-sm ring-2 ring-purple-400 font-black'
                  : 'bg-white text-slate-800 hover:bg-purple-100 border border-[#EEDCD0] font-bold'
              }`}
              title={tab.label}
              aria-label={tab.label}
            >
              <div className={`p-0.5 rounded ${isActive ? 'text-white' : 'text-purple-800'}`}>
                {tab.icon}
              </div>
              <span className="text-xs whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Horizontal Scrollable Tray for Draggable Blocks */}
      <div className="flex-1 px-4 py-2.5 overflow-x-auto overflow-y-hidden bg-[#FFFDF9] flex items-center gap-5 scrollbar-thin">
        {categoryBlocks.map((def) => {
          const sampleInputs: Record<string, number | string | BlockInstance> = {};
          if (def.inputs) {
            Object.entries(def.inputs).forEach(([k, v]) => {
              sampleInputs[k] = v.defaultValue;
            });
          }

          const templateBlock: BlockInstance = {
            id: `template_${def.type}`,
            type: def.type,
            category: def.category,
            inputs: sampleInputs,
          };

          return (
            <div
              key={def.type}
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData('kms/block_type', def.type);
                e.dataTransfer.setData('text/plain', def.type);
                e.dataTransfer.effectAllowed = 'copy';
                onDragStartBlockTemplate(e, def.type);
              }}
              className="hover:scale-105 transition-transform cursor-grab active:cursor-grabbing select-none shrink-0"
            >
              <BlockView block={templateBlock} isTemplate={true} />
            </div>
          );
        })}
      </div>

    </div>
  );
};
