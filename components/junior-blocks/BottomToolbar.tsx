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
    <div className="bg-white rounded-2xl border-2 border-slate-200 p-2.5 shadow-md flex items-center justify-between gap-3">
      
      {/* Run & Restart Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleRun}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs shadow-lg transition-all hover:scale-105 active:scale-95 ${
            isRunning
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
              : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
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
              <Play className="w-4 h-4 fill-current" />
              <span>▶ Run Green Flag</span>
            </>
          )}
        </button>

        <button
          onClick={onRestart}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-colors border border-slate-300"
          title="Restart & Reset Sprites"
          aria-label="Restart & Reset Sprites"
        >
          <RotateCcw className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Restart</span>
        </button>
      </div>

      {/* Utilities Tools */}
      <div className="flex items-center gap-2">
        
        {/* Screenshot Button */}
        <button
          onClick={onTakeScreenshot}
          className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl transition-colors border border-purple-200"
          title="Download PNG Screenshot of Stage"
          aria-label="Download PNG Screenshot of Stage"
        >
          <Camera className="w-4 h-4 text-purple-600" />
          <span className="hidden md:inline">Screenshot</span>
        </button>

        {/* Grid Overlay Toggle */}
        <button
          onClick={onToggleGrid}
          className={`flex items-center gap-1.5 px-3 py-2 font-bold text-xs rounded-xl transition-colors border ${
            gridVisible
              ? 'bg-cyan-500 text-white border-cyan-600 shadow-sm'
              : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
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
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors border border-slate-300"
          title="Toggle Fullscreen"
          aria-label="Toggle Fullscreen"
        >
          <Maximize className="w-4 h-4 text-slate-600" />
        </button>

      </div>

    </div>
  );
};
