'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/junior-blocks/types';
import { EXAMPLE_PROJECTS } from '@/lib/junior-blocks/example-projects';
import {
  Folder,
  Sparkles,
  HelpCircle,
  ArrowLeft,
  Download,
  FilePlus,
  Save,
  Upload,
  Code,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  ChevronDown,
} from 'lucide-react';

interface TopBarProps {
  project: Project;
  showPythonDrawer: boolean;
  onTogglePythonDrawer: () => void;
  onNewProject: () => void;
  onSaveProject: () => void;
  onLoadProject: () => void;
  onExportProject: () => void;
  onLoadExampleProject: (proj: Project) => void;
  onOpenHelp: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onCleanUp?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  project,
  showPythonDrawer,
  onTogglePythonDrawer,
  onNewProject,
  onSaveProject,
  onLoadProject,
  onExportProject,
  onLoadExampleProject,
  onOpenHelp,
  isFullscreen = false,
  onToggleFullscreen,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onUndo,
  onRedo,
  onCleanUp,
  canUndo = true,
  canRedo = false,
}) => {
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [exampleMenuOpen, setExampleMenuOpen] = useState(false);

  return (
    <div className="flex flex-col w-full shrink-0 z-30 font-sans border-b border-slate-200 bg-[#FAF9FC] select-none">
      
      {/* EDITOR TOOLBAR ROW (Single height ~48-52px) */}
      <div className="px-4 py-2 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
        
        {/* Left: Back Link & Project Title & Dropdowns */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/kinetic-canvas"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 shadow-2xs transition-colors shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="flex items-center gap-1.5 border-l border-slate-200/80 pl-2.5 pr-1">
            <span className="font-black text-xs text-slate-900 font-heading tracking-tight">{project.name || 'KMS Project'}</span>
            <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
              Junior Blocks
            </span>
          </div>

          {/* File Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setFileMenuOpen(!fileMenuOpen);
                setExampleMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-xs transition-colors border border-slate-200 shadow-2xs cursor-pointer"
            >
              <Folder className="w-3.5 h-3.5 text-[#6C2EB5]" />
              <span>File</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {fileMenuOpen && (
              <div className="absolute left-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 text-xs font-bold text-slate-800">
                <button
                  onClick={() => {
                    onNewProject();
                    setFileMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-purple-50 hover:text-[#6C2EB5] flex items-center gap-2"
                >
                  <FilePlus className="w-4 h-4 text-[#6C2EB5]" />
                  <span>New Project</span>
                </button>

                <button
                  onClick={() => {
                    onSaveProject();
                    setFileMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-purple-50 hover:text-[#6C2EB5] flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-[#6C2EB5]" />
                  <span>Save Project</span>
                </button>

                <button
                  onClick={() => {
                    onLoadProject();
                    setFileMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-purple-50 hover:text-[#6C2EB5] flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-[#6C2EB5]" />
                  <span>Load Saved Project</span>
                </button>

                <button
                  onClick={() => {
                    onExportProject();
                    setFileMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-purple-50 hover:text-[#6C2EB5] flex items-center gap-2 border-t border-slate-100"
                >
                  <Download className="w-4 h-4 text-[#6C2EB5]" />
                  <span>Export as JSON</span>
                </button>
              </div>
            )}
          </div>

          {/* Example Projects Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setExampleMenuOpen(!exampleMenuOpen);
                setFileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-[#6C2EB5] font-extrabold text-xs transition-colors border border-purple-200 shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#6C2EB5]" />
              <span className="hidden sm:inline">Examples</span>
              <ChevronDown className="w-3 h-3 text-purple-400" />
            </button>

            {exampleMenuOpen && (
              <div className="absolute left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 text-xs font-bold text-slate-800">
                <div className="px-3.5 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Pre-built Student Examples
                </div>
                {EXAMPLE_PROJECTS.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => {
                      onLoadExampleProject(ex.project);
                      setExampleMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-purple-50 hover:text-[#6C2EB5]"
                  >
                    <p className="font-black text-slate-900">{ex.name}</p>
                    <p className="text-[11px] text-slate-500 font-semibold truncate">{ex.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Tools (Python Toggle, Zoom, Clean Up, Help, Fullscreen) */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* View Python Code Pill Toggle */}
          <button
            onClick={onTogglePythonDrawer}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all border shadow-2xs cursor-pointer ${
              showPythonDrawer
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Code className={`w-3.5 h-3.5 ${showPythonDrawer ? 'text-white' : 'text-emerald-600'}`} />
            <span className="hidden sm:inline">&lt;/&gt; Python</span>
          </button>

          {/* Zoom Controls Bar */}
          {onZoomIn && (
            <div className="flex items-center gap-0.5 bg-white px-1.5 py-1 rounded-full border border-slate-200 shadow-2xs">
              <button
                onClick={onZoomIn}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-700 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onZoomOut}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-700 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onResetZoom}
                className="px-1.5 py-0.5 hover:bg-slate-100 rounded-full text-[10px] font-black text-slate-800 transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                100%
              </button>
            </div>
          )}

          {/* Undo / Redo */}
          {onUndo && (
            <div className="flex items-center gap-0.5 bg-white px-1.5 py-1 rounded-full border border-slate-200 shadow-2xs">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="p-1 hover:bg-slate-100 disabled:opacity-30 rounded-full text-slate-700 transition-colors cursor-pointer"
                title="Undo"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="p-1 hover:bg-slate-100 disabled:opacity-30 rounded-full text-slate-700 transition-colors cursor-pointer"
                title="Redo"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Clean Up Pill Button */}
          {onCleanUp && (
            <button
              onClick={onCleanUp}
              className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-purple-50 text-[#6C2EB5] rounded-full text-xs font-extrabold border border-purple-200 shadow-2xs transition-colors cursor-pointer"
              title="Auto Arrange Workspace Scripts"
            >
              <span>🧹 Clean Up</span>
            </button>
          )}

          {/* Help "?" Button */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-full border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            title="Open Help & Guide"
          >
            <HelpCircle className="w-4 h-4 text-purple-700" />
          </button>

          {/* Fullscreen Button */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-black transition-all border shadow-2xs cursor-pointer ${
                isFullscreen
                  ? 'bg-amber-500 text-slate-950 border-amber-600'
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5 text-[#6C2EB5]" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Exit' : '⛶ Fullscreen'}</span>
            </button>
          )}

        </div>

      </div>

    </div>
  );
};
