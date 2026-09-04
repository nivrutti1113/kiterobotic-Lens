'use client';

import React, { useState } from 'react';
import { Category, BlockInstance } from '@/lib/junior-blocks/types';
import { BLOCK_DEFINITIONS, CATEGORY_COLORS } from '@/lib/junior-blocks/blocks-def';
import { EXTENSION_CATALOG, ExtensionItem } from '@/lib/junior-blocks/extensions-catalog';
import { BlockView } from './BlockView';
import { Navigation, Eye, Zap, Sliders, Volume2, Radio, Calculator, Database, Plus } from 'lucide-react';

interface BlockPaletteProps {
  activeExtensionIds?: string[];
  onOpenMarketplace?: () => void;
  onDragStartBlockTemplate: (e: React.DragEvent, blockType: string) => void;
}

const NATIVE_CATEGORY_TABS: { id: Category; label: string; icon: React.ReactNode }[] = [
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
  activeExtensionIds = [],
  onOpenMarketplace,
  onDragStartBlockTemplate,
}) => {
  const [activeCategory, setActiveCategory] = useState<Category>('movement');

  // Lookup active extensions from catalog
  const activeExtensions = activeExtensionIds
    .map((id) => EXTENSION_CATALOG.find((ext) => ext.id === id))
    .filter(Boolean) as ExtensionItem[];

  // Determine if active category is native or extension
  const isExtensionCategory = activeCategory.startsWith('ext_');
  const currentExtension = isExtensionCategory
    ? EXTENSION_CATALOG.find((ext) => `ext_${ext.id}` === activeCategory)
    : null;

  // Standard native category blocks
  const nativeBlocks = Object.values(BLOCK_DEFINITIONS).filter(
    (b) => b.category === activeCategory
  );

  const nativeCatColor = !isExtensionCategory
    ? CATEGORY_COLORS[activeCategory as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.movement
    : null;

  const handleTemplateDragStart = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData('kms/block_type', blockType);
    e.dataTransfer.setData('text/plain', blockType);
    e.dataTransfer.effectAllowed = 'copy';
    (window as any).__kms_dragged_block_type = blockType;
    onDragStartBlockTemplate(e, blockType);
  };

  const handleTemplateDragEnd = () => {
    delete (window as any).__kms_dragged_block_type;
  };

  return (
    <div className="flex h-full w-full bg-white font-sans overflow-hidden select-none border-r border-slate-200">
      
      {/* SUB-COLUMN A: VERTICAL CATEGORY ICON STRIP (Width ~68px) */}
      <div className="w-[68px] shrink-0 bg-slate-50 border-r border-slate-200/80 flex flex-col items-center py-2 space-y-1.5 overflow-y-auto scrollbar-none">
        
        {/* Native Categories */}
        {NATIVE_CATEGORY_TABS.map((tab) => {
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
              {isActive && (
                <div
                  className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full"
                  style={{ backgroundColor: catColor.hex }}
                />
              )}

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs ${
                  isActive ? 'ring-2 ring-offset-1' : ''
                }`}
                style={{
                  backgroundColor: catColor.hex,
                  color: tab.id === 'events' || tab.id === 'control' ? '#1E293B' : '#FFFFFF',
                }}
              >
                {tab.icon}
              </div>

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

        {/* Divider if Active Extensions exist */}
        {activeExtensions.length > 0 && (
          <div className="w-8 h-[1px] bg-slate-200 my-1 shrink-0" />
        )}

        {/* Active Extensions Category Icons */}
        {activeExtensions.map((ext) => {
          const catId = `ext_${ext.id}`;
          const isActive = activeCategory === catId;

          return (
            <button
              key={ext.id}
              onClick={() => setActiveCategory(catId)}
              className={`w-full py-2 px-1 flex flex-col items-center justify-center transition-all relative group cursor-pointer ${
                isActive ? 'bg-white shadow-2xs font-black' : 'hover:bg-slate-100/80'
              }`}
              title={ext.name}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full"
                  style={{ backgroundColor: ext.iconColor }}
                />
              )}

              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-transform group-hover:scale-110 shadow-2xs ${
                  isActive ? 'ring-2 ring-offset-1 ring-purple-400' : ''
                }`}
                style={{ backgroundColor: ext.iconColor }}
              >
                {ext.iconGlyph}
              </div>

              <span
                className={`text-[9px] font-black tracking-tight mt-1 text-center truncate max-w-full font-heading ${
                  isActive ? 'text-slate-900 font-extrabold' : 'text-slate-600'
                }`}
              >
                {ext.name}
              </span>
            </button>
          );
        })}

        {/* Permanent "+ Add Extension" Button */}
        <button
          onClick={onOpenMarketplace}
          className="w-12 h-12 mt-2 rounded-2xl bg-purple-100/90 hover:bg-purple-200 text-[#6C2EB5] border-2 border-dashed border-purple-300 flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 shrink-0 shadow-2xs"
          title="Add Extension (Marketplace)"
        >
          <Plus className="w-5 h-5 font-black text-[#6C2EB5]" />
          <span className="text-[8px] font-black text-[#6C2EB5] leading-none mt-0.5">Add Ext</span>
        </button>

      </div>

      {/* SUB-COLUMN B: BLOCK LIST (Scrollable Remaining Width ~212px) */}
      <div className="flex-1 flex flex-col h-full bg-[#FFFDF9] min-w-0 overflow-hidden">
        
        {/* Category Header */}
        <div className="px-3 py-2 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <span
            className="text-[10px] font-black uppercase tracking-wider font-heading truncate pr-1"
            style={{
              color: isExtensionCategory ? currentExtension?.blockCategoryColor : nativeCatColor?.hex,
            }}
          >
            {isExtensionCategory ? currentExtension?.name : `${activeCategory} BLOCKS`}
          </span>
          <span className="text-[9px] font-bold text-slate-400 shrink-0">Drag ➔</span>
        </div>

        {/* Scrollable Draggable Blocks List */}
        <div className="flex-1 p-3 overflow-y-auto space-y-4 scrollbar-thin bg-slate-50/50">
          
          {/* A. Native Category Blocks */}
          {!isExtensionCategory &&
            nativeBlocks.map((def) => {
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
                  onDragStart={(e) => handleTemplateDragStart(e, def.type)}
                  onDragEnd={handleTemplateDragEnd}
                  className="hover:scale-[1.02] transition-transform cursor-grab active:cursor-grabbing select-none w-fit"
                >
                  <div className="pointer-events-none">
                    <BlockView block={templateBlock} isTemplate={true} />
                  </div>
                </div>
              );
            })}

          {/* B. Extension Category Blocks Grouped by Labeled Sections */}
          {isExtensionCategory && currentExtension && (
            <div className="space-y-4">
              {currentExtension.sections.map((sec, secIdx) => (
                <div key={secIdx} className="space-y-2.5">
                  <div
                    className="text-[10px] font-black uppercase tracking-wider font-heading border-b border-slate-200/60 pb-1"
                    style={{ color: currentExtension.blockCategoryColor }}
                  >
                    {sec.sectionLabel}
                  </div>

                  {sec.items.map((def) => {
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
                        onDragStart={(e) => handleTemplateDragStart(e, def.type)}
                        onDragEnd={handleTemplateDragEnd}
                        className="hover:scale-[1.02] transition-transform cursor-grab active:cursor-grabbing select-none w-fit flex items-center gap-1.5"
                      >
                        {/* Checkbox Monitor Stub if reporter block has checkbox */}
                        {def.hasCheckbox && (
                          <input
                            type="checkbox"
                            className="w-3.5 h-3.5 accent-purple-600 rounded cursor-pointer shrink-0"
                            title="Toggle Stage Monitor"
                            onClick={(e) => e.stopPropagation()}
                          />
                        )}
                        <div className="pointer-events-none">
                          <BlockView
                            block={templateBlock}
                            overrideDefinition={def}
                            isTemplate={true}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
