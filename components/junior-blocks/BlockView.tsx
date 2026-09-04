'use client';

import React, { useState } from 'react';
import { BlockInstance, BlockDefinition, Category } from '@/lib/junior-blocks/types';
import { BLOCK_DEFINITIONS, CATEGORY_COLORS } from '@/lib/junior-blocks/blocks-def';

interface BlockViewProps {
  block: BlockInstance;
  overrideDefinition?: BlockDefinition;
  onInputChange?: (blockId: string, inputName: string, value: number | string | BlockInstance) => void;
  onDragStart?: (e: React.DragEvent, block: BlockInstance) => void;
  onDropInsideCBlock?: (e: React.DragEvent, parentBlockId: string, isElseSlot?: boolean) => void;
  isTemplate?: boolean;
}

export const BlockView: React.FC<BlockViewProps> = ({
  block,
  overrideDefinition,
  onInputChange,
  onDragStart,
  onDropInsideCBlock,
  isTemplate = false,
}) => {
  const [isDragOverMain, setIsDragOverMain] = useState(false);
  const [isDragOverElse, setIsDragOverElse] = useState(false);

  const def: BlockDefinition = overrideDefinition || BLOCK_DEFINITIONS[block.type] || {
    type: block.type,
    category: block.category || 'movement',
    shape: 'stack',
    label: block.type,
    color: '#4C97FF',
  };

  const categoryColor = CATEGORY_COLORS[def.category as Category] || {
    bg: 'bg-[#4C97FF]',
    border: 'border-[#3373CC]',
    text: 'text-white',
    hex: def.color || '#4C97FF',
  };

  const fillColor = def.color || categoryColor.hex;

  // Determine text contrast color: dark navy for yellow/gold (events/control), white for all others
  const isDarkText = def.category === 'events' || def.category === 'control';
  const textColorClass = isDarkText ? 'text-[#1E293B] font-black' : 'text-white font-black drop-shadow-xs';

  const handleTextOrNumChange = (inputName: string, valStr: string) => {
    if (!onInputChange) return;
    const num = Number(valStr);
    const val = isNaN(num) || valStr.trim() === '' ? valStr : num;
    onInputChange(block.id, inputName, val);
  };

  // Render label parts with inputs inserted as unified inline white pill elements fused inside block
  const renderLabel = () => {
    const parts = def.label.split(/(\{[\w]+\})/g);
    return (
      <div className="relative z-10 flex items-center justify-start flex-row gap-1.5 whitespace-nowrap leading-none py-0.5">
        {parts.map((part, idx) => {
          if (!part) return null;
          if (part.startsWith('{') && part.endsWith('}')) {
            const inputName = part.slice(1, -1);
            const inputDef = def.inputs?.[inputName];
            const val = block.inputs?.[inputName] !== undefined ? block.inputs[inputName] : inputDef?.defaultValue ?? '';

            if (typeof val === 'object' && val !== null) {
              // Nested reporter/operator block
              return (
                <span key={idx} className="inline-flex items-center shrink-0">
                  <BlockView block={val as BlockInstance} onInputChange={onInputChange} isTemplate={false} />
                </span>
              );
            }

            if (inputDef?.type === 'select') {
              return (
                <div key={idx} className="relative inline-flex items-center shrink-0 my-0">
                  <select
                    value={String(val)}
                    onChange={(e) => onInputChange && onInputChange(block.id, inputName, e.target.value)}
                    className="bg-white text-[#1E293B] font-extrabold text-xs pl-2.5 pr-5 py-0.5 rounded-[10px] border border-black/15 shadow-inner focus:outline-none cursor-pointer appearance-none shrink-0 my-0 leading-tight"
                  >
                    {inputDef.options?.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-slate-900 text-white font-bold">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-1.5 pointer-events-none text-[#1E293B]">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              );
            }

            return (
              <input
                key={idx}
                type="text"
                value={String(val)}
                onChange={(e) => handleTextOrNumChange(inputName, e.target.value)}
                className="w-12 min-w-[36px] bg-white text-[#1E293B] font-extrabold text-xs px-2 py-0.5 rounded-[10px] border border-black/15 focus:outline-none focus:ring-2 focus:ring-purple-600 text-center shadow-inner shrink-0 my-0 leading-tight"
              />
            );
          }

          return (
            <span key={idx} className={`whitespace-nowrap ${textColorClass} text-xs tracking-tight leading-none`}>
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  const handleDragStartBlock = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('kms/existing_block_id', block.id);
    e.dataTransfer.setData('text/plain', block.id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart(e, block);
  };

  // Render authentic Scratch/PictoBlox puzzle piece shape SVG overlay
  const renderSingleBlock = () => {
    // 1. Hat Block (Dome Top + Bottom Socket)
    if (def.shape === 'hat') {
      return (
        <div
          draggable={!isTemplate}
          onDragStart={handleDragStartBlock}
          className={`relative cursor-grab active:cursor-grabbing select-none text-xs px-4 pt-5 pb-3 flex items-center justify-start flex-row gap-2 filter drop-shadow-md group`}
          style={{ minWidth: '150px' }}
        >
          {/* Hat SVG Path Background (Solid fill, no opacity reduction) */}
          <svg
            viewBox="0 0 200 52"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          >
            <path
              d="M 0,16 C 15,-4 65,-4 85,16 L 196,16 A 4,4 0 0 1 200,20 L 200,48 A 4,4 0 0 1 196,52 L 36,52 C 34,52 33,48 31,48 L 19,48 C 17,48 16,52 14,52 L 4,52 A 4,4 0 0 1 0,48 Z"
              fill={fillColor}
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="1.5"
            />
          </svg>
          {renderLabel()}
        </div>
      );
    }

    // 2. C-Block / Loop Block (Puzzle Notch Top, Loop Slot, Socket Bottom)
    if (def.shape === 'c_block' || def.shape === 'c_block_else') {
      return (
        <div
          draggable={!isTemplate}
          onDragStart={handleDragStartBlock}
          className={`relative cursor-grab active:cursor-grabbing select-none text-xs filter drop-shadow-md flex flex-col`}
          style={{ minWidth: '160px' }}
        >
          {/* C-Block Top Header Bar */}
          <div
            className="px-3.5 pt-2.5 pb-2 flex items-center justify-start flex-row gap-2 relative rounded-t-lg shadow-xs"
            style={{ backgroundColor: fillColor }}
          >
            {/* Top Notch SVG Tab */}
            <div className="absolute -top-1 left-4 w-4 h-1.5 bg-[#FFFFFF]/40 rounded-t-xs" />
            {renderLabel()}
          </div>

          {/* C-Block Main Loop Body Slot */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOverMain(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOverMain(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDragOverMain(false);
              if (onDropInsideCBlock) onDropInsideCBlock(e, block.id, false);
            }}
            className={`pl-4 py-2 min-h-[44px] space-y-1 border-l-[16px] transition-colors ${
              isDragOverMain ? 'bg-amber-400/40 border-amber-500' : 'bg-black/10'
            }`}
            style={{ borderLeftColor: fillColor }}
          >
            {block.children && block.children.length > 0 ? (
              block.children.map((child) => (
                <BlockView
                  key={child.id}
                  block={child}
                  onInputChange={onInputChange}
                  onDragStart={onDragStart}
                  onDropInsideCBlock={onDropInsideCBlock}
                />
              ))
            ) : (
              <div className="text-[10px] text-white/90 font-bold italic py-1 px-2.5 rounded bg-black/25 border border-dashed border-white/40 w-fit shadow-inner">
                📥 Drop blocks inside loop
              </div>
            )}
          </div>

          {/* C-Block Else Body if applicable */}
          {def.shape === 'c_block_else' && (
            <>
              <div
                className="px-3.5 py-1.5 font-black text-white relative flex items-center justify-start flex-row gap-2 shadow-xs"
                style={{ backgroundColor: fillColor }}
              >
                <span>Else</span>
              </div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragOverElse(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragOverElse(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragOverElse(false);
                  if (onDropInsideCBlock) onDropInsideCBlock(e, block.id, true);
                }}
                className={`pl-4 py-2 min-h-[44px] space-y-1 border-l-[16px] transition-colors ${
                  isDragOverElse ? 'bg-amber-400/40 border-amber-500' : 'bg-black/10'
                }`}
                style={{ borderLeftColor: fillColor }}
              >
                {block.elseChildren && block.elseChildren.length > 0 ? (
                  block.elseChildren.map((child) => (
                    <BlockView
                      key={child.id}
                      block={child}
                      onInputChange={onInputChange}
                      onDragStart={onDragStart}
                      onDropInsideCBlock={onDropInsideCBlock}
                    />
                  ))
                ) : (
                  <div className="text-[10px] text-white/90 font-bold italic py-1 px-2.5 rounded bg-black/25 border border-dashed border-white/40 w-fit shadow-inner">
                    📥 Drop else blocks
                  </div>
                )}
              </div>
            </>
          )}

          {/* C-Block Footer Bar with Bottom Socket */}
          <div
            className="h-4 w-full relative rounded-b-lg border-t border-black/10 shadow-xs"
            style={{ backgroundColor: fillColor }}
          >
            {/* Bottom Socket Indent */}
            <div className="absolute bottom-0 left-4 w-4 h-1 bg-black/30 rounded-t-xs" />
          </div>
        </div>
      );
    }

    // 3. Reporter (Oval Capsule) & Boolean (Hexagon Pointed)
    if (def.shape === 'reporter' || def.shape === 'boolean') {
      return (
        <div
          draggable={!isTemplate}
          onDragStart={handleDragStartBlock}
          className={`relative inline-flex items-center justify-start gap-2 cursor-grab active:cursor-grabbing select-none px-4 py-1.5 shadow-sm border border-black/20 ${
            def.shape === 'boolean' ? 'rounded-xs border-y border-black/20' : 'rounded-full'
          }`}
          style={{
            backgroundColor: fillColor,
            clipPath: def.shape === 'boolean'
              ? 'polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, calc(100% - 10px) 100%, 10px 100%, 0% 50%)'
              : undefined,
          }}
        >
          {renderLabel()}
        </div>
      );
    }

    // 4. Standard Puzzle Stack Block (Top Notch Tab + Bottom Socket Indent + Rounded Corners)
    return (
      <div
        draggable={!isTemplate}
        onDragStart={handleDragStartBlock}
        className={`relative cursor-grab active:cursor-grabbing select-none text-xs px-4 pt-2.5 pb-3 flex items-center justify-start flex-row gap-2 filter drop-shadow-md group`}
        style={{ minWidth: '140px' }}
      >
        {/* Puzzle Block SVG Layer with Top Notch Tab + Bottom Socket Indent (Solid Fill) */}
        <svg
          viewBox="0 0 200 40"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        >
          <path
            d="M 0,4 A 4,4 0 0 1 4,0 L 14,0 C 16,0 17,-4 19,-4 L 31,-4 C 33,-4 34,0 36,0 L 196,0 A 4,4 0 0 1 200,4 L 200,36 A 4,4 0 0 1 196,40 L 36,40 C 34,40 33,36 31,36 L 19,36 C 17,36 16,40 14,40 L 4,40 A 4,4 0 0 1 0,36 Z"
            fill={fillColor}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="1.5"
          />
        </svg>

        {renderLabel()}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-start w-fit group/stack">
      {renderSingleBlock()}

      {/* RECURSIVE STACK CHAIN RENDERING FOR BLOCK.NEXT WITH ZERO GAP FLUSH INTERLOCKING FIT */}
      {block.next && (
        <div className="-mt-[4px]">
          <BlockView
            block={block.next}
            onInputChange={onInputChange}
            onDragStart={onDragStart}
            onDropInsideCBlock={onDropInsideCBlock}
            isTemplate={isTemplate}
          />
        </div>
      )}
    </div>
  );
};
