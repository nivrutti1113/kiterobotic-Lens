'use client';

import React from 'react';
import { Bot, ArrowRight } from 'lucide-react';

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
    <div className="bg-gradient-to-r from-purple-100 via-[#FFFDF9] to-amber-100/60 p-4 rounded-3xl border border-[#EEDCD0] flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm font-sans">
      
      {/* Buddy Bot Avatar & Title */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-0.5 shadow-md shrink-0">
          <div className="w-full h-full bg-[#FFFDF9] rounded-[14px] flex items-center justify-center">
            <Bot className="w-6 h-6 text-purple-700 animate-bounce" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-black text-sm text-[#111827] font-heading">BuddyBot Student Guide</h3>
            <span className="text-[10px] bg-purple-200 text-purple-950 border border-purple-300 px-2 py-0.5 rounded-full font-black font-heading">
              Class 3–12 Easy Mode
            </span>
          </div>
          <p className="text-xs text-[#374151] font-semibold">Follow these 3 easy steps to build and run your robot!</p>
        </div>
      </div>

      {/* 3 Simple Action Cards */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-black font-heading">
        
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
          currentStep === 1
            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow'
            : 'bg-white border-[#EEDCD0] text-[#374151]'
        }`}>
          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-mono font-bold">1</span>
          <span>{step1}</span>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
          currentStep === 2
            ? 'bg-purple-700 text-white border-purple-800 shadow'
            : 'bg-white border-[#EEDCD0] text-[#374151]'
        }`}>
          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-mono font-bold">2</span>
          <span>{step2}</span>
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />

        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
          currentStep === 3
            ? 'bg-emerald-600 text-white border-emerald-700 shadow'
            : 'bg-white border-[#EEDCD0] text-[#374151]'
        }`}>
          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-mono font-bold">3</span>
          <span>{step3}</span>
        </div>

      </div>

    </div>
  );
};
