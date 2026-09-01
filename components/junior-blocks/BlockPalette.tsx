'use client';

import React, { useState } from 'react';
import { Category, BlockInstance } from '@/lib/junior-blocks/types';
import { BLOCK_DEFINITIONS } from '@/lib/junior-blocks/blocks-def';
import { BlockView } from './BlockView';
import { Navigation, Eye, Zap, Sliders, Volume2, Radio, Calculator } from 'lucide-react';

interface BlockPaletteProps {
  onDragStartBlockTemplate: (e: React.DragEvent, blockType: string) => void;
}

const CATEGORY_TABS: { id: Category; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'movement', label: 'Movement', icon: <Navigation className="w-3.5 h-3.5" />, color: '#7C3AED' },
  { id: 'looks', label: 'Looks', icon: <Eye className="w-3.5 h-3.5" />, color: '#7C3AED' },
  { id: 'events', label: 'Events', icon: <Zap className="w-3.5 h-3.5" />, color: '#7C3AED' },
  { id: 'control', label: 'Control', icon: <Sliders className="w-3.5 h-3.5" />, color: '#7C3AED' },
  { id: 'sound', label: 'Sound', icon: <Volume2 className="w-3.5 h-3.5" />, color: '#7C3AED' },
  { id: 'sensing', label: 'Sensing', icon: <Radio className="w-3.5 h-3.5" />, color: '#7C3AED' },
  { id: 'operators', label: 'Operators', icon: <Calculator className="w-3.5 h-3.5" />, color: '#7C3AED' },
];

export const BlockPalette: React.FC<BlockPaletteProps> = ({
  onDragStartBlockTemplate,
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>('movement');

  const categoryBlocks = Object.values(BLOCK_DEFINITIONS).filter(
    (b) => b.category === activeCategory
  );

  return (
    <div className="flex flex-col h-full bg-[#FFFDF9] border-r border-[#EEDCD0] rounded-l-2xl shadow-sm overflow-hidden">
      
      {/* Category Selection Tabs - Fully Legible Scrollable Row */}
      <div className="p-2 bg-[#FAF3EC] border-b border-[#EEDCD0] flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-thin">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all font-heading shrink-0 ${
                isActive
                  ? 'bg-purple-700 text-white shadow-sm ring-2 ring-purple-400 font-black'
                  : 'bg-white text-slate-800 hover:bg-purple-100 border border-[#EEDCD0] font-bold'
              }`}
              title={tab.label}
              aria-label={tab.label}
            >
              <div className={`p-1 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-800'}`}>
                {tab.icon}
              </div>
              <span className="text-xs whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Block List Palette */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#FFFDF9]">
        <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>{activeCategory.toUpperCase()} BLOCKS</span>
          <span className="text-[11px] text-purple-700 font-extrabold">Drag to Workspace ➔</span>
        </div>

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
              className="hover:scale-[1.02] transition-transform cursor-grab active:cursor-grabbing"
              onDragStart={(e) => onDragStartBlockTemplate(e, def.type)}
            >
              <BlockView block={templateBlock} isTemplate={true} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
