'use client';

import React, { useState } from 'react';
import { BLOCK_DEFINITIONS, CATEGORY_COLORS } from '@/lib/junior-blocks/blocks-def';
import { HelpCircle, X, Search, BookOpen, Layers, PlayCircle, ShieldCheck } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'guide' | 'blocks'>('guide');

  if (!isOpen) return null;

  const blocksList = Object.values(BLOCK_DEFINITIONS).filter((b: { label: string; category: string }) =>
    b.label.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 bg-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            <div>
              <h2 className="text-base font-black">Junior Blocks Studio Guide & Reference</h2>
              <p className="text-xs text-purple-100">Learn how to drag, connect, and code your robots!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'guide' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>How to Use Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('blocks')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'blocks' ? 'bg-purple-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All Blocks Reference Cheat Sheet</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          {activeTab === 'guide' ? (
            <div className="space-y-6 text-slate-700 text-xs">
              
              {/* Page Description */}
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                <h3 className="font-black text-purple-900 text-sm mb-1 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-purple-600" />
                  <span>Page Description</span>
                </h3>
                <p className="leading-relaxed">
                  Junior Blocks Studio is a visual block-programming environment for Indian school students (Class 3 to 12). Drag puzzle-piece blocks from the palette to move sprites, play sounds, create animations, and simulate real robotics logic live on stage!
                </p>
              </div>

              {/* Layout Regions Overview */}
              <div>
                <h3 className="font-black text-slate-900 text-sm mb-3">Studio Regions Overview</h3>
                <ul className="space-y-2">
                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-purple-700">1. Left Palette:</strong> Contains 7 colorful block categories (Movement, Looks, Events, Control, Sound, Sensing, Operators). Drag blocks from here into the center workspace.
                  </li>
                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-purple-700">2. Center Workspace:</strong> Your coding canvas. Snap blocks top-to-bottom under hat blocks. Zoom, Undo, Redo, and right-click to Duplicate or Clean Up.
                  </li>
                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-purple-700">3. Right Stage:</strong> Renders live sprite animations, speech bubbles, backdrop scenes, and optional 0–20 coordinate ruler grid.
                  </li>
                  <li className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <strong className="text-purple-700">4. Bottom Toolbar:</strong> Click ▶ Green Flag to run scripts, ⟲ Restart to reset position, 📷 Screenshot to download PNG, and ▦ Grid to toggle coordinate ruler.
                  </li>
                </ul>
              </div>

              {/* Numbered How to Use Steps */}
              <div>
                <h3 className="font-black text-slate-900 text-sm mb-3">How to Use (Step-by-Step)</h3>
                <ol className="space-y-2 list-decimal list-inside font-semibold">
                  <li className="p-2.5 bg-purple-50/50 rounded-xl">Select a category tab (e.g. Events or Movement).</li>
                  <li className="p-2.5 bg-purple-50/50 rounded-xl">Drag a <span className="text-amber-600">When Green Flag Clicked</span> hat block into the workspace.</li>
                  <li className="p-2.5 bg-purple-50/50 rounded-xl">Snap movement, sound, or repeat loop blocks directly under the hat block.</li>
                  <li className="p-2.5 bg-purple-50/50 rounded-xl">Click the green ▶ <strong>Run</strong> button in the bottom toolbar to watch your code execute live!</li>
                  <li className="p-2.5 bg-purple-50/50 rounded-xl">Add new sprites or stage backdrops using the bottom panel pickers.</li>
                </ol>
              </div>

            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search block functions..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 text-slate-900 font-bold rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Blocks Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
                      <th className="p-3">Category</th>
                      <th className="p-3">Block Function</th>
                      <th className="p-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {blocksList.map((block: { type: string; category: string; label: string }) => (
                      <tr key={block.type} className="hover:bg-slate-50">
                        <td className="p-3 uppercase font-bold text-[10px] text-purple-700">
                          {block.category}
                        </td>
                        <td className="p-3 font-bold text-slate-900">{block.label}</td>
                        <td className="p-3 text-slate-500">
                          Executes real-time {block.category} action on the selected sprite canvas.
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
