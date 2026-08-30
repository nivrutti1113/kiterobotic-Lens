'use client';

import React from 'react';
import { Play, RotateCcw, Camera, Grid, Maximize, Square } from 'lucide-react';

interface BottomToolbarProps {
  isRunning: boolean;
  gridVisible: boolean;
  onToggleRun: () => void;
  onRestart: () => void;
  onTakeScreenshot: () => void;
  onToggleGrid: () => void;
  onToggleFullscreen: () => void;
}

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
  isRunning,
  gridVisible,
  onToggleRun,
  onRestart,
  onTakeScreenshot,
  onToggleGrid,
  onToggleFullscreen,
}) => {
  return (
    <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-2.5 shadow-md flex items-center justify-between gap-3 font-sans">
      
      {/* Run & Restart Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleRun}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs shadow-lg transition-all hover:scale-105 active:scale-95 font-heading ${
            isRunning
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
          }`}
          aria-label={isRunning ? 'Stop Script' : 'Run Script'}
        >
          {isRunning ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Execution</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-amber-300" />
              <span>▶ Run Green Flag</span>
            </>
          )}
        </button>

        <button
          onClick={onRestart}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FAF3EC] hover:bg-purple-100 text-slate-950 font-black text-xs rounded-xl transition-colors border border-[#EEDCD0] font-heading"
          title="Restart & Reset Sprites"
          aria-label="Restart & Reset Sprites"
        >
          <RotateCcw className="w-4 h-4 text-slate-800" />
          <span className="hidden sm:inline">Restart</span>
        </button>
      </div>

      {/* Utilities Tools */}
      <div className="flex items-center gap-2">
        
        {/* Screenshot Button */}
        <button
          onClick={onTakeScreenshot}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-100/90 hover:bg-purple-200 text-purple-950 font-black text-xs rounded-xl transition-colors border border-purple-300 font-heading"
          title="Download PNG Screenshot of Stage"
          aria-label="Download PNG Screenshot of Stage"
        >
          <Camera className="w-4 h-4 text-purple-700" />
          <span className="hidden md:inline">Screenshot</span>
        </button>

        {/* Grid Overlay Toggle */}
        <button
          onClick={onToggleGrid}
          className={`flex items-center gap-1.5 px-3.5 py-2 font-black text-xs rounded-xl transition-colors border font-heading ${
            gridVisible
              ? 'bg-cyan-600 text-white border-cyan-700 shadow-sm'
              : 'bg-[#FAF3EC] text-slate-950 border-[#EEDCD0] hover:bg-purple-100'
          }`}
          title="Toggle 0-20 Grid Ruler Overlay"
          aria-label="Toggle 0-20 Grid Ruler Overlay"
        >
          <Grid className="w-4 h-4" />
          <span className="hidden md:inline">Grid {gridVisible ? 'ON' : 'OFF'}</span>
        </button>

        {/* Fullscreen API Toggle */}
        <button
          onClick={onToggleFullscreen}
          className="p-2 bg-[#FAF3EC] hover:bg-purple-100 text-slate-950 font-black text-xs rounded-xl transition-colors border border-[#EEDCD0]"
          title="Toggle Fullscreen"
          aria-label="Toggle Fullscreen"
        >
          <Maximize className="w-4 h-4 text-slate-800" />
        </button>

      </div>

    </div>
  );
};
