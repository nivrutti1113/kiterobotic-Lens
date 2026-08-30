'use client';

import React, { useState } from 'react';
import { BookOpen, Sparkles, Lightbulb, Zap, Code, ShieldCheck, ArrowRight } from 'lucide-react';
import { StemComponent } from '@/lib/stem-data';
import { SupportedLanguage } from '@/lib/languages';
import Link from 'next/link';

interface GradeExplainerProps {
  component: StemComponent;
  currentLang: SupportedLanguage;
  onOpenKineticCanvas?: () => void;
}

export type GradeBandKey = 'grade3_5' | 'grade6_8' | 'grade9_10' | 'grade11_12';

export const GradeExplainer: React.FC<GradeExplainerProps> = ({
  component,
  currentLang,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeBandKey>('grade6_8');

  // Vernacular translation lookup if active
  const hasTranslation = currentLang !== 'en' && component.translations[currentLang as keyof typeof component.translations];
  const translatedData = hasTranslation ? component.translations[currentLang as keyof typeof component.translations] : null;

  const g3_5 = component.grades.grade3_5;
  const g6_8 = component.grades.grade6_8;
  const g9_10 = component.grades.grade9_10;
  const g11_12 = component.grades.grade11_12;

  return (
    <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EEDCD0] flex flex-col gap-6 shadow-sm font-sans">
      
      {/* Grade Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EEDCD0]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-700" />
          <h3 className="font-black text-base text-[#111827] font-heading">Grade-Adaptive AI Explainer</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-[#FAF3EC] p-1.5 rounded-2xl border border-[#EEDCD0] font-heading">
          <button
            onClick={() => setSelectedGrade('grade3_5')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              selectedGrade === 'grade3_5'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-[#374151] hover:text-purple-900'
            }`}
          >
            Grade 3–5
          </button>

          <button
            onClick={() => setSelectedGrade('grade6_8')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              selectedGrade === 'grade6_8'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-[#374151] hover:text-purple-900'
            }`}
          >
            Grade 6–8
          </button>

          <button
            onClick={() => setSelectedGrade('grade9_10')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              selectedGrade === 'grade9_10'
                ? 'bg-blue-700 text-white shadow-md'
                : 'text-[#374151] hover:text-purple-900'
            }`}
          >
            Grade 9–10
          </button>

          <button
            onClick={() => setSelectedGrade('grade11_12')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              selectedGrade === 'grade11_12'
                ? 'bg-purple-700 text-white shadow-md'
                : 'text-[#374151] hover:text-purple-900'
            }`}
          >
            Grade 11–12
          </button>
        </div>
      </div>

      {/* Vernacular Language Notice Banner */}
      {translatedData && (
        <div className="bg-purple-100/70 border border-purple-300 p-3.5 rounded-2xl flex items-center justify-between text-xs text-purple-950 font-semibold">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-700 animate-spin" />
            <span className="font-black font-heading">{translatedData.name}:</span>
            <span>{translatedData.explanation}</span>
          </div>
          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-purple-200 uppercase tracking-wider font-heading text-purple-950">
            {currentLang} AI Mode
          </span>
        </div>
      )}

      {/* Grade 3-5 Content */}
      {selectedGrade === 'grade3_5' && (
        <div className="space-y-4">
          <div className="bg-amber-100/80 border border-amber-300 p-5 rounded-2xl">
            <h4 className="text-base font-black text-amber-950 flex items-center gap-2 font-heading">
              <Lightbulb className="w-5 h-5 text-amber-700" />
              {g3_5.title}
            </h4>
            <p className="text-sm text-[#374151] mt-2 leading-relaxed font-semibold">{g3_5.explanation}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0]">
              <span className="text-xs font-black text-amber-800 uppercase tracking-wider font-heading">🎉 Fun Fact</span>
              <p className="text-xs text-[#374151] mt-1 font-semibold">{g3_5.funFact}</p>
            </div>
            <div className="bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0]">
              <span className="text-xs font-black text-cyan-800 uppercase tracking-wider font-heading">🚘 Real-World Analogy</span>
              <p className="text-xs text-[#374151] mt-1 font-semibold">{g3_5.realWorldAnalogy}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grade 6-8 Content */}
      {selectedGrade === 'grade6_8' && (
        <div className="space-y-4">
          <div className="bg-cyan-100/80 border border-cyan-300 p-5 rounded-2xl">
            <h4 className="text-base font-black text-cyan-950 flex items-center gap-2 font-heading">
              <Zap className="w-5 h-5 text-cyan-700" />
              {g6_8.title}
            </h4>
            <p className="text-sm text-[#374151] mt-2 leading-relaxed font-semibold">{g6_8.explanation}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0]">
              <span className="text-xs font-black text-cyan-800 uppercase tracking-wider font-heading">📥 Input / Output Logic</span>
              <p className="text-xs text-[#374151] mt-1 font-semibold">{g6_8.inputOutput}</p>
            </div>
            <div className="bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0]">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider font-heading">⚡ Circuit Tip</span>
              <p className="text-xs text-[#374151] mt-1 font-semibold">{g6_8.circuitTip}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grade 9-10 Content */}
      {selectedGrade === 'grade9_10' && (
        <div className="space-y-4">
          <div className="bg-blue-100/80 border border-blue-300 p-5 rounded-2xl">
            <h4 className="text-base font-black text-blue-950 flex items-center gap-2 font-heading">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
              {g9_10.title}
            </h4>
            <p className="text-sm text-[#374151] mt-2 leading-relaxed font-semibold">{g9_10.explanation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0]">
              <span className="text-xs font-black text-blue-900 uppercase tracking-wider mb-2 block font-heading">Technical Specifications</span>
              <ul className="space-y-1">
                {g9_10.specs.map((spec, i) => (
                  <li key={i} className="text-xs text-[#374151] font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-700" /> {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0]">
              <span className="text-xs font-black text-purple-900 uppercase tracking-wider mb-2 block font-heading">Pinout Breakdown</span>
              <div className="space-y-1.5">
                {g9_10.pinout.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-xs border-b border-[#EEDCD0] pb-1 font-semibold">
                    <span className="font-mono text-purple-900 font-bold">{p.pin}</span>
                    <span className="text-[#4B5563] text-[11px]">{p.function}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grade 11-12 Content */}
      {selectedGrade === 'grade11_12' && (
        <div className="space-y-4">
          <div className="bg-purple-100/80 border border-purple-300 p-5 rounded-2xl">
            <h4 className="text-base font-black text-purple-950 flex items-center gap-2 font-heading">
              <Code className="w-5 h-5 text-purple-700" />
              {g11_12.title}
            </h4>
            <p className="text-sm text-[#374151] mt-2 leading-relaxed font-semibold">{g11_12.explanation}</p>
          </div>

          <div className="bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0]">
            <span className="text-xs font-black text-purple-900 uppercase tracking-wider mb-1 block font-heading">
              ROS2 Protocol Topology
            </span>
            <p className="text-xs text-[#111827] font-mono bg-white p-2.5 rounded-xl border border-[#EEDCD0] font-bold">
              {g11_12.ros2Protocol}
            </p>
          </div>
        </div>
      )}

      {/* Seamless Transition Handoff Button */}
      <div className="pt-2 flex justify-end">
        <Link
          href={`/kinetic-canvas?template=${component.defaultBlocklyProject}`}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-sm shadow-md transition-all hover:scale-105 active:scale-95 font-heading"
        >
          <span>Build this in Kinetic Canvas 🚀</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
