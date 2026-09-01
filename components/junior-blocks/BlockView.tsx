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
    color: '#3B82F6',
  };

  const categoryColor = CATEGORY_COLORS[def.category as Category] || CATEGORY_COLORS.movement;
  const isDarkText = def.category === 'events' || def.category === 'sensing';

  const handleTextOrNumChange = (inputName: string, valStr: string) => {
    if (!onInputChange) return;
    const num = Number(valStr);
    const val = isNaN(num) || valStr.trim() === '' ? valStr : num;
    onInputChange(block.id, inputName, val);
  };

  // Render label parts with inputs inserted
  const renderLabel = () => {
    const parts = def.label.split(/(\{[\w]+\})/g);
    return parts.map((part, idx) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        const inputName = part.slice(1, -1);
        const inputDef = def.inputs?.[inputName];
        const val = block.inputs?.[inputName] !== undefined ? block.inputs[inputName] : inputDef?.defaultValue ?? '';

        if (typeof val === 'object' && val !== null) {
          // Nested operator block
          return (
            <span key={idx} className="inline-block mx-1">
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
              className="bg-white text-slate-950 font-black px-2 py-0.5 rounded-md text-xs focus:outline-none cursor-pointer border border-slate-300 mx-1 shadow-sm"
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
            className="w-14 bg-white text-slate-950 font-black px-1.5 py-0.5 rounded-md text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-center mx-1 shadow-sm"
          />
        );
      }
      return <span key={idx} className="whitespace-pre">{part}</span>;
    });
  };

  const textContrastClass = isDarkText ? 'text-slate-950 font-black' : 'text-white font-black drop-shadow-sm';

  const handleDragStartBlock = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.setData('kms/existing_block_id', block.id);
    e.dataTransfer.setData('text/plain', block.id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart(e, block);
  };

  // Render block element by shape
  const renderSingleBlock = () => {
    if (def.shape === 'hat') {
      return (
        <div
          draggable={!isTemplate}
          onDragStart={handleDragStartBlock}
          className={`relative cursor-grab active:cursor-grabbing select-none ${textContrastClass} text-xs px-4 py-2.5 rounded-t-2xl rounded-b-md shadow-md flex items-center gap-1.5 border-t-2 border-l-2 border-r-2 border-white/40`}
          style={{ backgroundColor: categoryColor.hex }}
        >
          <span className="relative z-10 flex items-center gap-1">{renderLabel()}</span>
        </div>
      );
    }

    if (def.shape === 'c_block' || def.shape === 'c_block_else') {
      return (
        <div
          draggable={!isTemplate}
          onDragStart={handleDragStartBlock}
          className={`relative cursor-grab active:cursor-grabbing select-none ${textContrastClass} text-xs shadow-md rounded-lg overflow-hidden border border-white/30`}
          style={{ backgroundColor: categoryColor.hex }}
        >
          {/* C-Block Header */}
          <div className="px-3 py-2 flex items-center gap-1 border-b border-black/10">
            {renderLabel()}
          </div>

          {/* C-Block Main Body Slot with Drop Target */}
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
            className={`pl-6 py-2.5 min-h-[48px] space-y-1.5 border-l-8 transition-colors ${
              isDragOverMain ? 'bg-purple-500/30 border-purple-400' : 'bg-black/10'
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
              <div className="text-[11px] text-white/90 font-bold italic py-1.5 px-2 rounded bg-black/20 border border-dashed border-white/40">
                📥 Drop blocks inside loop
              </div>
            )}
          </div>

          {/* C-Block Else Body if applicable */}
          {def.shape === 'c_block_else' && (
            <>
              <div className="px-3 py-1.5 font-black bg-black/20 text-white border-t border-b border-black/10">
                Else
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
                className={`pl-6 py-2.5 min-h-[48px] space-y-1.5 border-l-8 transition-colors ${
                  isDragOverElse ? 'bg-purple-500/30 border-purple-400' : 'bg-black/10'
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
                  <div className="text-[11px] text-white/90 font-bold italic py-1.5 px-2 rounded bg-black/20 border border-dashed border-white/40">
                    📥 Drop else blocks
                  </div>
                )}
              </div>
            </>
          )}

          {/* C-Block Footer */}
          <div className="h-2.5 w-full" style={{ backgroundColor: categoryColor.hex }} />
        </div>
      );
    }

    if (def.shape === 'reporter' || def.shape === 'boolean') {
      return (
        <div
          draggable={!isTemplate}
          onDragStart={handleDragStartBlock}
          className={`inline-flex items-center gap-1 cursor-grab active:cursor-grabbing select-none ${textContrastClass} text-[11px] px-3 py-1 shadow-sm ${
            def.shape === 'boolean' ? 'rounded-full border-2 border-emerald-300' : 'rounded-xl border border-white/40'
          }`}
          style={{ backgroundColor: categoryColor.hex }}
        >
          {renderLabel()}
        </div>
      );
    }

    // Standard Stack Block
    return (
      <div
        draggable={!isTemplate}
        onDragStart={handleDragStartBlock}
        className={`relative cursor-grab active:cursor-grabbing select-none ${textContrastClass} text-xs px-3.5 py-2 rounded-lg shadow-md flex items-center gap-1.5 border border-white/30`}
        style={{ backgroundColor: categoryColor.hex }}
      >
        {renderLabel()}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-start w-fit">
      {renderSingleBlock()}

      {/* RECURSIVE STACK CHAIN RENDERING FOR BLOCK.NEXT */}
      {block.next && (
        <div className="mt-0.5">
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

