'use client';

import React, { useState } from 'react';
import { Sprite } from '@/lib/junior-blocks/types';
import { generatePythonFromSprite } from '@/lib/junior-blocks/python-generator';
import { Copy, Check, Terminal } from 'lucide-react';

interface PythonCodeDrawerProps {
  activeSprite: Sprite;
  isOpen: boolean;
  onClose: () => void;
}

export const PythonCodeDrawer: React.FC<PythonCodeDrawerProps> = ({
  activeSprite,
  isOpen,
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
    <div className="w-80 bg-[#0F172A] text-slate-100 rounded-2xl border border-[#EEDCD0] shadow-2xl flex flex-col overflow-hidden h-full font-sans">
      
      {/* Drawer Header */}
      <div className="p-3 bg-[#090D16] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-black text-white font-heading">Python Code Preview</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-[11px] transition-colors shadow-sm font-heading"
          title="Copy Code"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Viewer Body */}
      <div className="p-3 flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-emerald-300 bg-[#090D16]/90">
        <pre className="whitespace-pre-wrap font-mono">{pythonCode}</pre>
      </div>

      {/* Footer Info */}
      <div className="p-2 bg-[#090D16] border-t border-slate-800 text-[11px] text-slate-300 text-center font-bold font-heading">
        Live Python Code Translation
      </div>

    </div>
  );
};
