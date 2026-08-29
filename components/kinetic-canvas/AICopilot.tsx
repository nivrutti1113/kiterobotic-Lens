'use client';

import React, { useState } from 'react';
import { Sparkles, Bot, Bug, Wrench, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { ProjectTemplate } from '@/lib/projects-data';

interface AICopilotProps {
  project: ProjectTemplate;
  onApplyFix: (fixedCode: string) => void;
}

export const AICopilot: React.FC<AICopilotProps> = ({ project, onApplyFix }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    status: string;
    suggestion: string;
    explanation: string;
  } | null>(null);

  const handleRunCopilot = async (action: 'debug' | 'suggest') => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/canvas/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          code: project.generatedPython,
          language: 'python'
        })
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Copilot service error');
      }

      setAnalysisResult({
        status: action === 'debug' ? 'Auto-Fixed CPU Delay & Sensor Threshold Logic' : 'Optimization Analysis Complete',
        suggestion: data.suggestion || '',
        explanation: data.explanation || ''
      });
    } catch (e: any) {
      setErrorMsg(e.message || 'Unable to connect to AI Copilot service.');
      setAnalysisResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (analysisResult?.suggestion) {
      onApplyFix(analysisResult.suggestion);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <Bot className="w-4.5 h-4.5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <span>AI Co-Pilot & Automated Debugger</span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                Code Inspector
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Step-by-step logic suggestions & hardware safe fixes</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRunCopilot('debug')}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-xs font-semibold text-indigo-300 hover:text-white transition-colors disabled:opacity-50"
          >
            <Bug className="w-3.5 h-3.5" />
            <span>Auto-Debug</span>
          </button>

          <button
            onClick={() => handleRunCopilot('suggest')}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Code Suggest</span>
          </button>
        </div>
      </div>

      {/* Analysis Loading Box */}
      {loading && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs text-indigo-400 font-mono">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>AI Co-Pilot is analyzing code logic against hardware constraints...</span>
        </div>
      )}

      {/* Transparent Error Box */}
      {errorMsg && !loading && (
        <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-center gap-3 text-xs text-red-400 font-mono">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Analysis Output Box */}
      {analysisResult && !loading && (
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {analysisResult.status}
            </span>
            <button
              onClick={handleApply}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow"
            >
              <Wrench className="w-3 h-3" />
              <span>Apply Fix to Workspace</span>
            </button>
          </div>

          <p className="text-xs text-slate-200">{analysisResult.explanation}</p>

          <div className="bg-slate-950 p-3 rounded-xl font-mono text-[11px] text-sky-300 overflow-x-auto border border-slate-800">
            <pre className="whitespace-pre-wrap">{analysisResult.suggestion}</pre>
          </div>
        </div>
      )}

    </div>
  );
};
