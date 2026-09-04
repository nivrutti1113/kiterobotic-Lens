'use client';

import React, { useState } from 'react';
import { Category, BlockInstance } from '@/lib/junior-blocks/types';
import { BLOCK_DEFINITIONS, CATEGORY_COLORS } from '@/lib/junior-blocks/blocks-def';
import { BlockView } from './BlockView';
import { Navigation, Eye, Zap, Sliders, Volume2, Radio, Calculator, Database } from 'lucide-react';

interface BlockPaletteProps {
  onDragStartBlockTemplate: (e: React.DragEvent, blockType: string) => void;
}

const CATEGORY_TABS: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'movement', label: 'Movement', icon: <Navigation className="w-4 h-4" /> },
  { id: 'looks', label: 'Looks', icon: <Eye className="w-4 h-4" /> },
  { id: 'sound', label: 'Sound', icon: <Volume2 className="w-4 h-4" /> },
  { id: 'events', label: 'Events', icon: <Zap className="w-4 h-4" /> },
  { id: 'control', label: 'Control', icon: <Sliders className="w-4 h-4" /> },
  { id: 'sensing', label: 'Sensing', icon: <Radio className="w-4 h-4" /> },
  { id: 'operators', label: 'Operators', icon: <Calculator className="w-4 h-4" /> },
  { id: 'variables', label: 'Variables', icon: <Database className="w-4 h-4" /> },
];

export const BlockPalette: React.FC<BlockPaletteProps> = ({
  onDragStartBlockTemplate,
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>('movement');

  const categoryBlocks = Object.values(BLOCK_DEFINITIONS).filter(
    (b) => b.category === activeCategory
  );

  const currentCategoryColor = CATEGORY_COLORS[activeCategory] || CATEGORY_COLORS.movement;

  return (
    <div className="flex h-full w-full bg-white font-sans overflow-hidden select-none border-r border-slate-200">
      
      {/* SUB-COLUMN A: VERTICAL CATEGORY ICON STRIP (Width ~68px) */}
      <div className="w-[68px] shrink-0 bg-slate-50 border-r border-slate-200/80 flex flex-col items-center py-2 space-y-1.5 overflow-y-auto scrollbar-none">
        {CATEGORY_TABS.map((tab) => {
          const isActive = activeCategory === tab.id;
          const catColor = CATEGORY_COLORS[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`w-full py-2 px-1 flex flex-col items-center justify-center transition-all relative group cursor-pointer ${
                isActive ? 'bg-white shadow-2xs font-black' : 'hover:bg-slate-100/80'
              }`}
              title={tab.label}
            >
              {/* Active Left Accent Border Line */}
              {isActive && (
                <div
                  className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full"
                  style={{ backgroundColor: catColor.hex }}
                />
              )}

              {/* Category Circle Icon Badge */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs ${
                  isActive ? 'ring-2 ring-offset-1' : ''
                }`}
                style={{
                  backgroundColor: catColor.hex,
                  color: tab.id === 'events' ? '#0F172A' : '#FFFFFF',
                }}
              >
                {tab.icon}
              </div>

              {/* Category Label */}
              <span
                className={`text-[9px] font-black tracking-tight mt-1 text-center truncate max-w-full font-heading ${
                  isActive ? 'text-slate-900 font-extrabold' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* SUB-COLUMN B: BLOCK LIST (Scrollable Remaining Width ~212px) */}
      <div className="flex-1 flex flex-col h-full bg-[#FFFDF9] min-w-0 overflow-hidden">
        
        {/* Category Header */}
        <div className="px-3 py-2 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <span
            className="text-[10px] font-black uppercase tracking-wider font-heading"
            style={{ color: currentCategoryColor.hex }}
          >
            {activeCategory} Blocks
          </span>
          <span className="text-[9px] font-bold text-slate-400">Drag ➔</span>
        </div>

        {/* Scrollable Draggable Blocks List */}
        <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin bg-slate-50/50">
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
                className="hover:scale-[1.02] transition-transform cursor-grab active:cursor-grabbing select-none w-fit"
              >
                <BlockView block={templateBlock} isTemplate={true} />
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
