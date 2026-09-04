'use client';

import React, { useState } from 'react';
import { BlockInstance, BlockDefinition, Category } from '@/lib/junior-blocks/types';
import { BLOCK_DEFINITIONS, CATEGORY_COLORS } from '@/lib/junior-blocks/blocks-def';

interface BlockViewProps {
  block: BlockInstance;
  onInputChange?: (blockId: string, inputName: string, value: number | string | BlockInstance) => void;
  onDragStart?: (e: React.DragEvent, block: BlockInstance) => void;
  onDropInsideCBlock?: (e: React.DragEvent, parentBlockId: string, isElseSlot?: boolean) => void;
  isTemplate?: boolean;
}

export const BlockView: React.FC<BlockViewProps> = ({
  block,
  onInputChange,
  onDragStart,
  onDropInsideCBlock,
  isTemplate = false,
}) => {
  const [isDragOverMain, setIsDragOverMain] = useState(false);
  const [isDragOverElse, setIsDragOverElse] = useState(false);

  const def: BlockDefinition = BLOCK_DEFINITIONS[block.type] || {
    type: block.type,
    category: block.category || 'movement',
    shape: 'stack',
    label: block.type,
    color: '#4C97FF',
  };

  const categoryColor = CATEGORY_COLORS[def.category as Category] || CATEGORY_COLORS.movement;
  const isDarkText = def.category === 'events';

  const handleTextOrNumChange = (inputName: string, valStr: string) => {
    if (!onInputChange) return;
    const num = Number(valStr);
    const val = isNaN(num) || valStr.trim() === '' ? valStr : num;
    onInputChange(block.id, inputName, val);
  };

  // Render label parts with inputs inserted as unified inline white pill elements
  const renderLabel = () => {
    const parts = def.label.split(/(\{[\w]+\})/g);
    return (
      <div className="relative z-10 flex items-center justify-start flex-row gap-1.5 whitespace-nowrap leading-none">
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
                <select
                  key={idx}
                  value={String(val)}
                  onChange={(e) => onInputChange && onInputChange(block.id, inputName, e.target.value)}
                  className="bg-white/95 text-slate-950 font-black px-2 py-0.5 rounded-md text-xs focus:outline-none cursor-pointer border border-black/20 shadow-inner shrink-0 my-0"
                >
                  {inputDef.options?.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-slate-900 text-white font-bold">
                      {opt.label}
                    </option>
                  ))}
                </select>
              );
            }

            return (
              <input
                key={idx}
                type="text"
                value={String(val)}
                onChange={(e) => handleTextOrNumChange(inputName, e.target.value)}
                className="w-14 bg-white/95 text-slate-950 font-black px-2 py-0.5 rounded-md text-xs border border-black/20 focus:outline-none focus:ring-2 focus:ring-purple-600 text-center shadow-inner shrink-0 my-0"
              />
            );
          }

          return (
            <span key={idx} className="whitespace-nowrap font-black inline-block text-xs leading-none">
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  const textContrastClass = isDarkText ? 'text-slate-950 font-black' : 'text-white font-black drop-shadow-xs';

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
          className={`relative cursor-grab active:cursor-grabbing select-none ${textContrastClass} text-xs px-4 pt-4 pb-3 flex items-center justify-start flex-row gap-2 filter drop-shadow-md group`}
          style={{ minWidth: '150px' }}
        >
          {/* Hat SVG Path Background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <path
              d="M 0,16 C 20,-6 65,-6 85,16 L calc(100% - 6px),16 a 6,6 0 0 1 6,6 L 100%,calc(100% - 6px) a 6,6 0 0 1 -6,6 L 28,100% c -2,0 -3,4 -5,4 l -8,0 c -2,0 -3,-4 -5,-4 L 6,100% a 6,6 0 0 1 -6,-6 Z"
              fill={categoryColor.hex}
              stroke="rgba(0,0,0,0.25)"
              strokeWidth="1.5"
            />
          </svg>
          <div className="mt-1">{renderLabel()}</div>
        </div>
      );
    }

    // 2. C-Block / Loop Block (Puzzle Notch Top, Loop Slot, Socket Bottom)
    if (def.shape === 'c_block' || def.shape === 'c_block_else') {
      return (
        <div
          draggable={!isTemplate}
          onDragStart={handleDragStartBlock}
          className={`relative cursor-grab active:cursor-grabbing select-none ${textContrastClass} text-xs filter drop-shadow-md flex flex-col`}
          style={{ minWidth: '160px' }}
        >
          {/* C-Block Top Header Bar */}
          <div
            className="px-3 pt-2 pb-2.5 flex items-center justify-start flex-row gap-2 relative rounded-t-lg"
            style={{ backgroundColor: categoryColor.hex }}
          >
            {/* Top Notch SVG Tab */}
            <div className="absolute top-0 left-3 w-4 h-1 bg-white/40 rounded-b-sm" />
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
            className={`pl-5 py-2 min-h-[44px] space-y-1 border-l-[16px] transition-colors ${
              isDragOverMain ? 'bg-amber-400/40 border-amber-500' : 'bg-black/10'
            }`}
            style={{ borderLeftColor: categoryColor.hex }}
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
              <div className="text-[10px] text-white/90 font-bold italic py-1 px-2 rounded bg-black/20 border border-dashed border-white/40 w-fit">
                📥 Drop blocks inside loop
              </div>
            )}
          </div>

          {/* C-Block Else Body if applicable */}
          {def.shape === 'c_block_else' && (
            <>
              <div
                className="px-3 py-1.5 font-black text-white relative flex items-center justify-start flex-row gap-2"
                style={{ backgroundColor: categoryColor.hex }}
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
                className={`pl-5 py-2 min-h-[44px] space-y-1 border-l-[16px] transition-colors ${
                  isDragOverElse ? 'bg-amber-400/40 border-amber-500' : 'bg-black/10'
                }`}
                style={{ borderLeftColor: categoryColor.hex }}
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
                  <div className="text-[10px] text-white/90 font-bold italic py-1 px-2 rounded bg-black/20 border border-dashed border-white/40 w-fit">
                    📥 Drop else blocks
                  </div>
                )}
              </div>
            </>
          )}

          {/* C-Block Footer Bar with Bottom Socket */}
          <div
            className="h-4 w-full relative rounded-b-lg border-t border-black/10"
            style={{ backgroundColor: categoryColor.hex }}
          >
            {/* Bottom Socket Indent */}
            <div className="absolute bottom-0 left-3 w-4 h-1 bg-black/30 rounded-t-sm" />
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
          className={`inline-flex items-center justify-start flex-row gap-2 cursor-grab active:cursor-grabbing select-none ${textContrastClass} text-[11px] px-3.5 py-1.5 shadow-sm border border-black/20 ${
            def.shape === 'boolean' ? 'rounded-full border-2 border-emerald-300' : 'rounded-full'
          }`}
          style={{ backgroundColor: categoryColor.hex }}
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
        className={`relative cursor-grab active:cursor-grabbing select-none ${textContrastClass} text-xs px-4 pt-2.5 pb-3 flex items-center justify-start flex-row gap-2 filter drop-shadow-md group`}
        style={{ minWidth: '140px' }}
      >
        {/* Puzzle Block Top Notch + Bottom Socket SVG Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <path
            d="M 0,6 a 6,6 0 0 1 6,-6 l 6,0 c 2,0 3,4 5,4 l 8,0 c 2,0 3,-4 5,-4 L calc(100% - 6px),0 a 6,6 0 0 1 6,6 L 100%,calc(100% - 6px) a 6,6 0 0 1 -6,6 L 28,100% c -2,0 -3,4 -5,4 l -8,0 c -2,0 -3,-4 -5,-4 L 6,100% a 6,6 0 0 1 -6,-6 Z"
            fill={categoryColor.hex}
            stroke="rgba(0,0,0,0.25)"
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

      {/* RECURSIVE STACK CHAIN RENDERING FOR BLOCK.NEXT WITH INTERLOCKING FIT */}
      {block.next && (
        <div className="-mt-1.5">
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
