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
  onOpenKineticCanvas,
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
    <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col gap-6">
      
      {/* Grade Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-base text-white">Grade-Adaptive AI Explainer</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-gray-950 p-1.5 rounded-2xl border border-gray-800">
          <button
            onClick={() => setSelectedGrade('grade3_5')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGrade === 'grade3_5'
                ? 'bg-amber-500 text-gray-950 shadow-md shadow-amber-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Grade 3–5
          </button>

          <button
            onClick={() => setSelectedGrade('grade6_8')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGrade === 'grade6_8'
                ? 'bg-cyan-500 text-gray-950 shadow-md shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Grade 6–8
          </button>

          <button
            onClick={() => setSelectedGrade('grade9_10')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGrade === 'grade9_10'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Grade 9–10
          </button>

          <button
            onClick={() => setSelectedGrade('grade11_12')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedGrade === 'grade11_12'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Grade 11–12
          </button>
        </div>
      </div>

      {/* Vernacular Language Notice Banner */}
      {translatedData && (
        <div className="bg-cyan-950/40 border border-cyan-500/40 p-3.5 rounded-2xl flex items-center justify-between text-xs text-cyan-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="font-bold">{translatedData.name}:</span>
            <span>{translatedData.explanation}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 uppercase font-semibold">
            {currentLang} AI Mode
          </span>
        </div>
      )}

      {/* Grade 3-5 Content */}
      {selectedGrade === 'grade3_5' && (
        <div className="space-y-4">
          <div className="bg-amber-950/20 border border-amber-500/30 p-5 rounded-2xl">
            <h4 className="text-base font-bold text-amber-300 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              {g3_5.title}
            </h4>
            <p className="text-sm text-gray-200 mt-2 leading-relaxed">{g3_5.explanation}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">🎉 Fun Fact</span>
              <p className="text-xs text-gray-300 mt-1">{g3_5.funFact}</p>
            </div>
            <div className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">🚘 Real-World Analogy</span>
              <p className="text-xs text-gray-300 mt-1">{g3_5.realWorldAnalogy}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grade 6-8 Content */}
      {selectedGrade === 'grade6_8' && (
        <div className="space-y-4">
          <div className="bg-cyan-950/20 border border-cyan-500/30 p-5 rounded-2xl">
            <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              {g6_8.title}
            </h4>
            <p className="text-sm text-gray-200 mt-2 leading-relaxed">{g6_8.explanation}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">📥 Input / Output Logic</span>
              <p className="text-xs text-gray-300 mt-1">{g6_8.inputOutput}</p>
            </div>
            <div className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">⚡ Circuit Tip</span>
              <p className="text-xs text-gray-300 mt-1">{g6_8.circuitTip}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grade 9-10 Content */}
      {selectedGrade === 'grade9_10' && (
        <div className="space-y-4">
          <div className="bg-blue-950/20 border border-blue-500/30 p-5 rounded-2xl">
            <h4 className="text-base font-bold text-blue-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              {g9_10.title}
            </h4>
            <p className="text-sm text-gray-200 mt-2 leading-relaxed">{g9_10.explanation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 block">Technical Specifications</span>
              <ul className="space-y-1">
                {g9_10.specs.map((spec, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-900/80 p-4 rounded-2xl border border-gray-800">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2 block">Pinout Breakdown</span>
              <div className="space-y-1.5">
                {g9_10.pinout.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-xs border-b border-gray-800/60 pb-1">
                    <span className="font-mono text-cyan-300 font-bold">{p.pin}</span>
                    <span className="text-gray-400 text-[11px]">{p.function}</span>
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
          <div className="bg-purple-950/20 border border-purple-500/30 p-5 rounded-2xl">
            <h4 className="text-base font-bold text-purple-300 flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-400" />
              {g11_12.title}
            </h4>
            <p className="text-sm text-gray-200 mt-2 leading-relaxed">{g11_12.explanation}</p>
          </div>

          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1 block">
              ROS2 Protocol Topology
            </span>
            <p className="text-xs text-gray-300 font-mono bg-gray-900 p-2.5 rounded-xl border border-gray-800">
              {g11_12.ros2Protocol}
            </p>
          </div>
        </div>
      )}

      {/* Seamless Transition Handoff Button */}
      <div className="pt-2 flex justify-end">
        <Link
          href={`/kinetic-canvas?template=${component.defaultBlocklyProject}`}
          className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
        >
          <span>Build this in Kinetic Canvas 🚀</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
