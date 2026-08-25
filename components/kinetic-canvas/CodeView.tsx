'use client';

import React, { useState } from 'react';
import { Code, Copy, Check, Download, Terminal, Edit3 } from 'lucide-react';
import { ProjectTemplate } from '@/lib/projects-data';

interface CodeViewProps {
  project: ProjectTemplate;
  customPython?: string;
  customCpp?: string;
}

export const CodeView: React.FC<CodeViewProps> = ({
  project,
  customPython,
  customCpp,
}) => {
  const [activeTab, setActiveTab] = useState<'python' | 'cpp'>('python');
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const defaultCodeText = activeTab === 'python'
    ? (customPython || project.generatedPython)
    : (customCpp || project.generatedCpp);

  const [codeContent, setCodeContent] = useState(defaultCodeText);

  // Sync when props change if not manually editing
  React.useEffect(() => {
    if (!isEditing) {
      setCodeContent(
        activeTab === 'python'
          ? (customPython || project.generatedPython)
          : (customCpp || project.generatedCpp)
      );
    }
  }, [activeTab, customPython, customCpp, project, isEditing]);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeTab === 'python' ? 'py' : 'ino';
    const blob = new Blob([codeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.id}_code.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-gray-800 flex flex-col gap-4 h-[600px]">
      
      {/* Header Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-white">Dual Code Generator & IDE</h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-950 p-1 rounded-xl border border-gray-800">
            <button
              onClick={() => setActiveTab('python')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'python'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Python (MicroPython)
            </button>
            <button
              onClick={() => setActiveTab('cpp')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'cpp'
                  ? 'bg-cyan-500 text-gray-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Arduino C++ (.ino)
            </button>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-xl border text-xs font-bold transition-colors ${
              isEditing ? 'bg-cyan-500 text-gray-950 border-cyan-400' : 'bg-gray-900 border-gray-800 text-gray-300 hover:text-white'
            }`}
            title={isEditing ? 'Lock Edit Mode' : 'Enable Manual Code Editing'}
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-cyan-500/50 text-gray-300 hover:text-cyan-400 transition-colors"
            title="Copy Code to Clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-cyan-500/50 text-gray-300 hover:text-cyan-400 transition-colors"
            title="Download Firmware File"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Viewer / Editor Container */}
      <div className="flex-1 bg-gray-950 rounded-2xl border border-gray-800 p-4 font-mono text-xs overflow-y-auto text-gray-300 leading-relaxed shadow-inner relative">
        {isEditing ? (
          <textarea
            value={codeContent}
            onChange={(e) => setCodeContent(e.target.value)}
            className="w-full h-full bg-transparent text-cyan-300 font-mono text-xs focus:outline-none resize-none leading-relaxed"
          />
        ) : (
          <pre className="whitespace-pre-wrap">{codeContent}</pre>
        )}
      </div>

      {/* Compiler Footer Status */}
      <div className="pt-2 border-t border-gray-900 flex items-center justify-between text-[11px] text-gray-400 shrink-0 font-mono">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <Terminal className="w-3.5 h-3.5" /> Compiler Target: {activeTab === 'python' ? 'ESP32 / Python 3.11' : 'ATmega328P / GCC C++'}
        </span>
        <span>Status: {isEditing ? 'Manual Editing Mode' : 'Live Compiled Stack'}</span>
      </div>

    </div>
  );
};
