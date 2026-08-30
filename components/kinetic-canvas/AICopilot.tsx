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
    <div className="bg-[#FFFDF9] p-5 rounded-3xl border border-[#EEDCD0] flex flex-col gap-4 shadow-sm font-sans text-[#374151]">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-300 flex items-center justify-center">
            <Bot className="w-4.5 h-4.5 text-purple-700" />
          </div>
          <div>
            <h3 className="font-black text-sm text-[#111827] flex items-center gap-2 font-heading">
              <span>AI Co-Pilot & Automated Debugger</span>
              <span className="text-[10px] bg-purple-100 text-purple-950 border border-purple-300 px-2 py-0.5 rounded-full font-black">
                Code Inspector
              </span>
            </h3>
            <p className="text-[11px] text-[#374151] font-semibold">Step-by-step logic suggestions & hardware safe fixes</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-heading">
          <button
            onClick={() => handleRunCopilot('debug')}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF3EC] border border-[#EEDCD0] hover:bg-purple-100 text-xs font-black text-[#111827] transition-colors disabled:opacity-50"
          >
            <Bug className="w-3.5 h-3.5 text-purple-700" />
            <span>Auto-Debug</span>
          </button>

          <button
            onClick={() => handleRunCopilot('suggest')}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black transition-all shadow-md disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Code Suggest</span>
          </button>
        </div>
      </div>

      {/* Analysis Loading Box */}
      {loading && (
        <div className="p-4 rounded-2xl bg-purple-100/70 border border-purple-300 flex items-center gap-3 text-xs text-purple-950 font-mono font-bold">
          <Loader2 className="w-4 h-4 animate-spin text-purple-700" />
          <span>AI Co-Pilot is analyzing code logic against hardware constraints...</span>
        </div>
      )}

      {/* Transparent Error Box */}
      {errorMsg && !loading && (
        <div className="p-4 rounded-2xl bg-rose-100 border border-rose-300 flex items-center gap-3 text-xs text-rose-950 font-mono font-bold">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Analysis Output Box */}
      {analysisResult && !loading && (
        <div className="p-4 rounded-2xl bg-purple-100/70 border border-purple-300 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-purple-950 flex items-center gap-1.5 font-heading">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              {analysisResult.status}
            </span>
            <button
              onClick={handleApply}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-colors shadow font-heading"
            >
              <Wrench className="w-3 h-3" />
              <span>Apply Fix to Workspace</span>
            </button>
          </div>

          <p className="text-xs text-[#374151] font-semibold">{analysisResult.explanation}</p>

          <div className="bg-slate-950 p-3 rounded-xl font-mono text-[11px] text-emerald-300 overflow-x-auto border border-slate-800">
            <pre className="whitespace-pre-wrap">{analysisResult.suggestion}</pre>
          </div>
        </div>
      )}

    </div>
  );
};
