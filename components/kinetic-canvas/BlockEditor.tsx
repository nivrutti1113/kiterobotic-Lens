'use client';

import React, { useState } from 'react';
import { Blocks, Plus, Trash2, Move, Sparkles, Play } from 'lucide-react';
import { ProjectTemplate } from '@/lib/projects-data';

interface BlockEditorProps {
  project: ProjectTemplate;
  onUpdateBlocks: (blocks: any[]) => void;
  onRunSimulation: () => void;
}

interface BlockItem {
  id: string;
  type: 'event' | 'action' | 'sensor' | 'logic' | 'iot';
  label: string;
  color: string;
  value?: string | number;
}

const AVAILABLE_BLOCK_PALETTE: BlockItem[] = [
  { id: 'pal-1', type: 'event', label: 'When Hardware Powers ON', color: 'bg-amber-500' },
  { id: 'pal-2', type: 'sensor', label: 'Measure Distance (Ultrasonic cm)', color: 'bg-emerald-600' },
  { id: 'pal-3', type: 'sensor', label: 'Read Line Tracking IR Sensors', color: 'bg-emerald-600' },
  { id: 'pal-4', type: 'logic', label: 'If Obstacle Distance < 20cm', color: 'bg-purple-600', value: 20 },
  { id: 'pal-5', type: 'action', label: 'Set DC Motor Speed 200 RPM', color: 'bg-blue-600', value: 200 },
  { id: 'pal-6', type: 'action', label: 'Rotate Servo Radar to 45°', color: 'bg-blue-600', value: 45 },
  { id: 'pal-7', type: 'action', label: 'Steer Rover Left (Differential Speed)', color: 'bg-blue-600' },
  { id: 'pal-8', type: 'iot', label: 'Publish Payload to MQTT Cloud', color: 'bg-cyan-600' }
];

export const BlockEditor: React.FC<BlockEditorProps> = ({
  project,
  onUpdateBlocks,
  onRunSimulation,
}) => {
  const [activeBlocks, setActiveBlocks] = useState<BlockItem[]>(project.blockCode.blocks as BlockItem[]);

  const handleAddBlock = (block: BlockItem) => {
    const newBlock = { ...block, id: `block-${Date.now()}` };
    const updated = [...activeBlocks, newBlock];
    setActiveBlocks(updated);
    onUpdateBlocks(updated);
  };

  const handleRemoveBlock = (id: string) => {
    const updated = activeBlocks.filter((b) => b.id !== id);
    setActiveBlocks(updated);
    onUpdateBlocks(updated);
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-gray-800 flex flex-col gap-4 h-[600px]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <Blocks className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-sm text-white">Visual Block-Code Canvas</h3>
          <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
            Grades 3–8 Block Mode
          </span>
        </div>

        <button
          onClick={onRunSimulation}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-gray-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Run Logic</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden">
        
        {/* Block Palette (Left 4 cols) */}
        <div className="md:col-span-4 bg-gray-950 p-3.5 rounded-2xl border border-gray-800 flex flex-col gap-3 overflow-y-auto">
          <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">
            Block Toolbox (Click to Add)
          </span>

          <div className="space-y-2">
            {AVAILABLE_BLOCK_PALETTE.map((block) => (
              <button
                key={block.id}
                onClick={() => handleAddBlock(block)}
                className={`w-full p-2.5 rounded-xl ${block.color} text-white text-xs font-bold text-left flex items-center justify-between shadow-md hover:scale-[1.02] transition-transform`}
              >
                <span className="truncate">{block.label}</span>
                <Plus className="w-4 h-4 shrink-0 opacity-80" />
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Canvas (Right 8 cols) */}
        <div className="md:col-span-8 bg-gray-950 p-4 rounded-2xl border border-gray-800 flex flex-col gap-3 overflow-y-auto bg-grid-pattern relative">
          
          <div className="flex items-center justify-between text-xs text-gray-400 pb-2 border-b border-gray-900">
            <span>Program Execution Stack ({activeBlocks.length} blocks)</span>
            <span className="text-[10px] text-cyan-400">Blocks auto-compile to Python & C++</span>
          </div>

          <div className="space-y-2.5 flex-1">
            {activeBlocks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs py-12">
                <Blocks className="w-10 h-10 text-gray-700 mb-2 animate-bounce" />
                <p>Your workspace is empty! Click blocks on the left to start coding your robot.</p>
              </div>
            ) : (
              activeBlocks.map((block, idx) => (
                <div
                  key={block.id}
                  className={`p-3 rounded-xl ${block.color} text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-black/40 border border-white/10`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{block.label}</span>
                  </div>

                  <button
                    onClick={() => handleRemoveBlock(block.id)}
                    className="p-1 rounded bg-black/20 hover:bg-red-500/80 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
