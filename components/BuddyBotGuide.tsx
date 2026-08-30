'use client';

import React from 'react';
import { Bot, Sparkles, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

interface BuddyBotGuideProps {
  step1: string;
  step2: string;
  step3: string;
  currentStep?: 1 | 2 | 3;
}

export const BuddyBotGuide: React.FC<BuddyBotGuideProps> = ({
  step1,
  step2,
  step3,
  currentStep = 1,
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-950/80 via-slate-950 to-purple-950/80 p-4 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
      
      {/* Buddy Bot Avatar & Title */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-sky-400 to-indigo-500 p-0.5 shadow-lg shadow-sky-500/20 shrink-0">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Bot className="w-6 h-6 text-amber-400 animate-bounce" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-slate-100">BuddyBot Student Guide</h3>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
              Class 3–12 Easy Mode
            </span>
          </div>
          <p className="text-xs text-slate-300">Follow these 3 easy steps to build and run your robot!</p>
        </div>
      </div>

      {/* 3 Simple Action Cards */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
          currentStep === 1
            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}>
          <span className="w-5 h-5 rounded-full bg-slate-950/40 flex items-center justify-center text-[10px] font-mono">1</span>
          <span>{step1}</span>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
          currentStep === 2
            ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md font-bold'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}>
          <span className="w-5 h-5 rounded-full bg-slate-950/40 flex items-center justify-center text-[10px] font-mono">2</span>
          <span>{step2}</span>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:inline" />

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
          currentStep === 3
            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold'
            : 'bg-slate-900 border-slate-800 text-slate-300'
        }`}>
          <span className="w-5 h-5 rounded-full bg-slate-950/40 flex items-center justify-center text-[10px] font-mono">3</span>
          <span>{step3}</span>
        </div>

      </div>

    </div>
  );
};
