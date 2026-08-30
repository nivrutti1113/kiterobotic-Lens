'use client';

import React, { useState } from 'react';
import { Sprite } from '@/lib/junior-blocks/types';
import { generatePythonFromSprite } from '@/lib/junior-blocks/python-generator';
import { Code, Copy, Check, Terminal } from 'lucide-react';

interface PythonCodeDrawerProps {
  activeSprite: Sprite;
  isOpen: boolean;
  onClose: () => void;
}

export const PythonCodeDrawer: React.FC<PythonCodeDrawerProps> = ({
  activeSprite,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const pythonCode = generatePythonFromSprite(activeSprite);

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-80 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden h-full">
      
      {/* Drawer Header */}
      <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-black text-slate-100">Python Pseudocode</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[11px] font-bold transition-colors border border-emerald-500/30"
          title="Copy Code"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Viewer Body */}
      <div className="p-3 flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-emerald-300 bg-slate-950/80">
        <pre className="whitespace-pre-wrap font-mono">{pythonCode}</pre>
      </div>

      {/* Footer Info */}
      <div className="p-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 text-center font-bold">
        Live Python Preview (Class 6-12 Ready)
      </div>

    </div>
  );
};
