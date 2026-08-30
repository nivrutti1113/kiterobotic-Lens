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
  { id: 'movement', label: 'Movement', icon: <Navigation className="w-4 h-4" />, color: '#3B82F6' },
  { id: 'looks', label: 'Looks', icon: <Eye className="w-4 h-4" />, color: '#8B5CF6' },
  { id: 'events', label: 'Events', icon: <Zap className="w-4 h-4 text-slate-900" />, color: '#F5C518' },
  { id: 'control', label: 'Control', icon: <Sliders className="w-4 h-4" />, color: '#F97316' },
  { id: 'sound', label: 'Sound', icon: <Volume2 className="w-4 h-4" />, color: '#EC4899' },
  { id: 'sensing', label: 'Sensing', icon: <Radio className="w-4 h-4 text-slate-900" />, color: '#06B6D4' },
  { id: 'operators', label: 'Operators', icon: <Calculator className="w-4 h-4" />, color: '#22C55E' },
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
      
      {/* Category Selection Circular Tabs */}
      <div className="p-2.5 bg-[#FAF3EC] border-b border-[#EEDCD0] flex items-center justify-between gap-1 overflow-x-auto">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-white shadow-md scale-105 ring-2 ring-purple-600'
                  : 'hover:bg-[#EEDCD0]/50 opacity-90 hover:opacity-100'
              }`}
              title={tab.label}
              aria-label={tab.label}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                style={{ backgroundColor: tab.color }}
              >
                {tab.icon}
              </div>
              <span className="text-[11px] font-black text-slate-900 mt-1 whitespace-nowrap">
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
