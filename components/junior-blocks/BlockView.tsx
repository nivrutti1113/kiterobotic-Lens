'use client';

import React from 'react';
import { BlockInstance, BlockDefinition, Category } from '@/lib/junior-blocks/types';
import { BLOCK_DEFINITIONS, CATEGORY_COLORS } from '@/lib/junior-blocks/blocks-def';

interface BlockViewProps {
  block: BlockInstance;
  onInputChange?: (blockId: string, inputName: string, value: number | string | BlockInstance) => void;
  onDragStart?: (e: React.DragEvent, block: BlockInstance) => void;
  isTemplate?: boolean;
}

export const BlockView: React.FC<BlockViewProps> = ({
  block,
  onInputChange,
  onDragStart,
  isTemplate = false,
}) => {
  const def: BlockDefinition = BLOCK_DEFINITIONS[block.type] || {
    type: block.type,
    category: block.category || 'movement',
    shape: 'stack',
    label: block.type,
    color: '#3B82F6',
  };

  const categoryColor = CATEGORY_COLORS[def.category as Category] || CATEGORY_COLORS.movement;

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
              className="bg-white/20 text-slate-900 font-bold px-2 py-0.5 rounded text-xs focus:outline-none cursor-pointer border border-black/10 mx-1"
            >
              {inputDef.options?.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
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
            className="w-14 bg-white/90 text-slate-900 font-bold px-1.5 py-0.5 rounded text-xs border border-black/20 focus:outline-none focus:ring-2 focus:ring-amber-400 text-center mx-1 shadow-inner"
          />
        );
      }
      return <span key={idx} className="whitespace-pre">{part}</span>;
    });
  };

  // Render different block shapes
  if (def.shape === 'hat') {
    return (
      <div
        draggable
        onDragStart={(e) => onDragStart && onDragStart(e, block)}
        className={`relative cursor-grab active:cursor-grabbing select-none text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-t-2xl rounded-b-md shadow-md flex items-center gap-1.5 border-t-2 border-l-2 border-r-2 border-white/30`}
        style={{ backgroundColor: categoryColor.hex }}
      >
        {/* Hat Top Curve Notch */}
        <div className="absolute -top-2 left-6 w-16 h-3 bg-amber-400/30 rounded-t-full" />
        <span className="relative z-10 flex items-center gap-1">{renderLabel()}</span>
      </div>
    );
  }

  if (def.shape === 'c_block' || def.shape === 'c_block_else') {
    return (
      <div
        draggable
        onDragStart={(e) => onDragStart && onDragStart(e, block)}
        className="relative cursor-grab active:cursor-grabbing select-none text-white font-extrabold text-xs shadow-md rounded-lg overflow-hidden border border-white/20"
        style={{ backgroundColor: categoryColor.hex }}
      >
        {/* C-Block Header */}
        <div className="px-3 py-2 flex items-center gap-1 border-b border-black/10">
          {renderLabel()}
        </div>

        {/* C-Block Body Slot */}
        <div className="pl-6 py-2 bg-black/10 min-h-[40px] space-y-1 border-l-8" style={{ borderLeftColor: categoryColor.hex }}>
          {block.children && block.children.length > 0 ? (
            block.children.map((child) => (
              <BlockView key={child.id} block={child} onInputChange={onInputChange} onDragStart={onDragStart} />
            ))
          ) : (
            <div className="text-[10px] text-white/50 italic py-1">Drop blocks inside loop</div>
          )}
        </div>

        {/* C-Block Else Body if applicable */}
        {def.shape === 'c_block_else' && (
          <>
            <div className="px-3 py-1.5 font-bold bg-black/20 text-white/90 border-t border-b border-black/10">
              Else
            </div>
            <div className="pl-6 py-2 bg-black/10 min-h-[40px] space-y-1 border-l-8" style={{ borderLeftColor: categoryColor.hex }}>
              {block.elseChildren && block.elseChildren.length > 0 ? (
                block.elseChildren.map((child) => (
                  <BlockView key={child.id} block={child} onInputChange={onInputChange} onDragStart={onDragStart} />
                ))
              ) : (
                <div className="text-[10px] text-white/50 italic py-1">Drop else blocks</div>
              )}
            </div>
          </>
        )}

        {/* C-Block Footer */}
        <div className="h-2 w-full" style={{ backgroundColor: categoryColor.hex }} />
      </div>
    );
  }

  if (def.shape === 'reporter' || def.shape === 'boolean') {
    return (
      <div
        draggable
        onDragStart={(e) => onDragStart && onDragStart(e, block)}
        className={`inline-flex items-center gap-1 cursor-grab active:cursor-grabbing select-none text-white font-extrabold text-[11px] px-3 py-1 shadow-sm ${
          def.shape === 'boolean' ? 'rounded-full border-2 border-emerald-300' : 'rounded-xl border border-white/30'
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
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, block)}
      className="relative cursor-grab active:cursor-grabbing select-none text-white font-extrabold text-xs px-3.5 py-2 rounded-lg shadow-md flex items-center gap-1.5 border border-white/20"
      style={{ backgroundColor: categoryColor.hex }}
    >
      {renderLabel()}
    </div>
  );
};
