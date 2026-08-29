'use client';

import React, { useState } from 'react';
import { Award, CheckCircle2, AlertCircle, Play, RotateCcw, Lightbulb, Trophy, ArrowRight, Code } from 'lucide-react';
import { STEM_QUESTS, STEMQuest } from '@/lib/challenges-data';

export const ChallengeEngine: React.FC = () => {
  const [activeQuestIdx, setActiveQuestIdx] = useState(0);
  const quest = STEM_QUESTS[activeQuestIdx];

  const [studentCode, setStudentCode] = useState(quest.buggedCode);
  const [showHint, setShowHint] = useState(false);
  const [evalResult, setEvalResult] = useState<{ passed: boolean; message: string } | null>(null);
  const [userXP, setUserXP] = useState(0);

  const handleSelectQuest = (idx: number) => {
    setActiveQuestIdx(idx);
    setStudentCode(STEM_QUESTS[idx].buggedCode);
    setEvalResult(null);
    setShowHint(false);
  };

  const handleEvaluate = () => {
    const code = studentCode.trim();
    const params = quest.targetParams;

    let passed = true;
    let failureReason = '';

    if (params.requiredKeyword && !code.includes(params.requiredKeyword)) {
      passed = false;
      failureReason = `Missing required logic or parameter: "${params.requiredKeyword}"`;
    }

    if (passed) {
      setEvalResult({
        passed: true,
        message: `🎉 Quest Solved! AST Verification Passed. +${quest.xpPoints} XP Earned!`,
      });
      setUserXP((prev) => prev + quest.xpPoints);
    } else {
      setEvalResult({
        passed: false,
        message: `❌ Verification Failed: ${failureReason}. Check hint and try again!`,
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Score Header */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              <span>STEM Debugging Quests & Challenge Arena</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
                AST Programmatic Evaluator
              </span>
            </h2>
            <p className="text-xs text-slate-400">Solve real robotics code bugs and circuit flaws to earn XP badges.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">Total Score:</span>
            <strong className="text-amber-400 font-bold text-sm">{userXP} XP</strong>
          </div>
        </div>
      </div>

      {/* Main Quest Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Quest Selector List (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Available STEM Quests ({STEM_QUESTS.length})
          </h3>

          <div className="space-y-2">
            {STEM_QUESTS.map((q, idx) => {
              const isActive = activeQuestIdx === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuest(idx)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-sky-500/10 border-sky-500 text-slate-100 shadow-md shadow-sky-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{q.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{q.category} • +{q.xpPoints} XP</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    q.difficulty === 'Beginner' ? 'bg-emerald-950 text-emerald-400' : 'bg-purple-950 text-purple-400'
                  }`}>
                    {q.difficulty}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Editor & Evaluator (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100">{quest.title}</h3>
                <p className="text-xs text-slate-300 mt-1">{quest.description}</p>
              </div>

              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20 transition-all"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </button>
            </div>

            {showHint && (
              <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-xl text-xs text-amber-200 mt-3 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>Hint:</strong> {quest.solutionHint}</span>
              </div>
            )}
          </div>

          {/* Code Workbench */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Code className="w-4 h-4 text-sky-400" /> Edit Python Code Below to Fix the Bug:
              </span>
              <button
                onClick={() => setStudentCode(quest.buggedCode)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset Code
              </button>
            </div>

            <textarea
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              rows={7}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-sky-300 focus:outline-none focus:border-sky-500 leading-relaxed shadow-inner"
            />
          </div>

          {/* Evaluator Result Banner */}
          {evalResult && (
            <div className={`p-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2 ${
              evalResult.passed
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/60 border border-red-500/40 text-red-300'
            }`}>
              {evalResult.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
              <span>{evalResult.message}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2 border-t border-slate-900">
            <button
              onClick={handleEvaluate}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-sky-500/25 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Evaluate Solution (Run AST Test) ⚡</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
