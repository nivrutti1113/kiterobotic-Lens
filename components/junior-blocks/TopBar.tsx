'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/junior-blocks/types';
import { EXAMPLE_PROJECTS } from '@/lib/junior-blocks/example-projects';
import { Bot, Folder, Sparkles, HelpCircle, ArrowLeft, Download, FilePlus, Save, Upload, Code } from 'lucide-react';

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
}) => {
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [exampleMenuOpen, setExampleMenuOpen] = useState(false);

  return (
    <header className="bg-[#FFFDF9] border-b-2 border-[#EEDCD0] px-4 py-2 flex items-center justify-between shadow-sm z-30 relative">
      
      {/* Left Branding & Menus */}
      <div className="flex items-center gap-4">
        
        {/* Back to Dashboard Link */}
        <Link
          href="/kinetic-canvas"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100/90 hover:bg-purple-200 text-purple-950 font-black text-xs transition-colors border border-purple-300 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-purple-700" />
          <span>← Back to Dashboard</span>
        </Link>

        {/* KMS-AI Wordmark Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shadow-sm">
            <Bot className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-slate-950 tracking-tight">KMS-AI</span>
              <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                Junior Blocks Studio
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-600">Kite Maker Studio IDE</p>
          </div>
        </div>

        {/* File Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setFileMenuOpen(!fileMenuOpen);
              setExampleMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF3EC] hover:bg-purple-100 text-slate-900 font-black text-xs transition-colors border border-[#EEDCD0] shadow-sm"
          >
            <Folder className="w-3.5 h-3.5 text-purple-700" />
            <span>File</span>
          </button>

          {fileMenuOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-[#FFFDF9] border border-[#EEDCD0] rounded-2xl shadow-2xl py-1.5 z-50 text-xs font-black text-slate-800">
              <button
                onClick={() => {
                  onNewProject();
                  setFileMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
              >
                <FilePlus className="w-4 h-4 text-purple-600" />
                <span>New Project</span>
              </button>

              <button
                onClick={() => {
                  onSaveProject();
                  setFileMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
              >
                <Save className="w-4 h-4 text-purple-600" />
                <span>Save Project (Local)</span>
              </button>

              <button
                onClick={() => {
                  onLoadProject();
                  setFileMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2"
              >
                <Upload className="w-4 h-4 text-purple-600" />
                <span>Load Saved Project</span>
              </button>

              <button
                onClick={() => {
                  onExportProject();
                  setFileMenuOpen(false);
                }}
                className="w-full px-3.5 py-2 text-left hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 border-t border-slate-100"
              >
                <Download className="w-4 h-4 text-purple-600" />
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-100/90 hover:bg-purple-200 text-purple-950 font-black text-xs transition-colors border border-purple-300 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>Example Projects</span>
          </button>

          {exampleMenuOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-[#FFFDF9] border border-[#EEDCD0] rounded-2xl shadow-2xl py-1.5 z-50 text-xs font-black text-slate-800">
              <div className="px-3.5 py-1 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                Pre-built Student Examples
              </div>
              {EXAMPLE_PROJECTS.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => {
                    onLoadExampleProject(ex.project);
                    setExampleMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-purple-50 hover:text-purple-700"
                >
                  <p className="font-black text-slate-900">{ex.name}</p>
                  <p className="text-[11px] text-slate-600 font-semibold truncate">{ex.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        
        {/* Python Code Drawer Toggle */}
        <button
          onClick={onTogglePythonDrawer}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs transition-all shadow-sm ${
            showPythonDrawer
              ? 'bg-emerald-600 text-white shadow'
              : 'bg-[#FAF3EC] text-slate-900 border border-[#EEDCD0] hover:bg-purple-50'
          }`}
        >
          <Code className="w-4 h-4 text-emerald-600" />
          <span>View Python Code</span>
        </button>

        {/* Help "?" Button */}
        <button
          onClick={onOpenHelp}
          className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl font-bold transition-colors shadow-sm"
          title="Open Help & Guide"
          aria-label="Open Help & Guide"
        >
          <HelpCircle className="w-4.5 h-4.5 text-purple-700" />
        </button>

      </div>

    </header>
  );
};
