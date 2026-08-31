'use client';

import React, { useState } from 'react';
import { Award, CheckCircle2, AlertCircle, Play, RotateCcw, Lightbulb, Trophy, Code } from 'lucide-react';
import { STEM_QUESTS } from '@/lib/challenges-data';

export const ChallengeEngine: React.FC = () => {
  const [activeQuestIdx, setActiveQuestIdx] = useState(0);
  const quest = STEM_QUESTS[activeQuestIdx];

  const [studentCode, setStudentCode] = useState(quest.buggedCode);
  const [showHint, setShowHint] = useState(false);
  const [evalResult, setEvalResult] = useState<{ passed: boolean; message: string } | null>(null);
  const [userXP, setUserXP] = useState(0);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedXP = localStorage.getItem('kms_student_xp');
      if (savedXP) setUserXP(Number(savedXP));
    }
  }, []);

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
      const newXP = userXP + quest.xpPoints;
      setUserXP(newXP);
      if (typeof window !== 'undefined') {
        localStorage.setItem('kms_student_xp', String(newXP));
      }
      setEvalResult({
        passed: true,
        message: `🎉 Quest Solved! AST Verification Passed. +${quest.xpPoints} XP Earned!`,
      });
    } else {
      setEvalResult({
        passed: false,
        message: `❌ Verification Failed: ${failureReason}. Check hint and try again!`,
      });
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#374151]">
      
      {/* Score Header */}
      <div className="bg-[#FFFDF9] p-5 rounded-3xl border border-[#EEDCD0] flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-700 animate-pulse" />
          </div>
          <div>
            <h2 className="font-black text-base text-[#111827] flex items-center gap-2 font-heading">
              <span>STEM Debugging Quests & Challenge Arena</span>
              <span className="text-[10px] bg-amber-100 text-amber-950 border border-amber-300 px-2.5 py-0.5 rounded-full font-black">
                AST Programmatic Evaluator
              </span>
            </h2>
            <p className="text-xs text-[#374151] font-semibold">Solve real robotics code bugs and circuit flaws to earn XP badges.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-heading">
          <div className="bg-[#FAF3EC] border border-[#EEDCD0] px-4 py-2 rounded-xl text-xs flex items-center gap-2 font-black">
            <Award className="w-4 h-4 text-amber-700" />
            <span className="text-[#374151]">Total Score:</span>
            <strong className="text-amber-800 font-black text-sm">{userXP} XP</strong>
          </div>
        </div>
      </div>

      {/* Main Quest Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Quest Selector List (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0] space-y-3 shadow-sm">
          <h3 className="text-xs font-black text-[#111827] uppercase tracking-wider font-heading">
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
                      ? 'bg-purple-700 border-purple-800 text-white shadow-md font-bold'
                      : 'bg-white border-[#EEDCD0] text-[#374151] hover:bg-purple-100/50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-black font-heading">{q.title}</div>
                    <div className="text-[10px] opacity-80 font-mono mt-0.5">{q.category} • +{q.xpPoints} XP</div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-black font-heading ${
                    q.difficulty === 'Beginner' ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-purple-100 text-purple-950 border border-purple-300'
                  }`}>
                    {q.difficulty}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Editor & Evaluator (8 cols) */}
        <div className="lg:col-span-8 bg-[#FFFDF9] p-5 rounded-2xl border border-[#EEDCD0] flex flex-col justify-between gap-4 shadow-sm">
          
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EEDCD0]">
              <div>
                <h3 className="text-base font-black text-[#111827] font-heading">{quest.title}</h3>
                <p className="text-xs text-[#374151] mt-1 font-semibold">{quest.description}</p>
              </div>

              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black hover:bg-amber-200 transition-all font-heading"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-700" />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </button>
            </div>

            {showHint && (
              <div className="bg-amber-100/80 border border-amber-300 p-3 rounded-xl text-xs text-amber-950 mt-3 flex items-start gap-2 font-semibold">
                <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span><strong className="font-heading">Hint:</strong> {quest.solutionHint}</span>
              </div>
            )}
          </div>

          {/* Code Workbench */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#374151] font-semibold">
              <span className="flex items-center gap-1.5 font-black text-[#111827] font-heading">
                <Code className="w-4 h-4 text-purple-700" /> Edit Python Code Below to Fix the Bug:
              </span>
              <button
                onClick={() => setStudentCode(quest.buggedCode)}
                className="text-[11px] text-[#4B5563] hover:text-[#111827] flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3 h-3 text-slate-700" /> Reset Code
              </button>
            </div>

            <textarea
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              rows={7}
              className="w-full bg-slate-950 border border-[#EEDCD0] rounded-xl p-4 font-mono text-xs text-emerald-300 focus:outline-none focus:ring-2 focus:ring-purple-600 leading-relaxed shadow-inner font-bold"
            />
          </div>

          {/* Evaluator Result Banner */}
          {evalResult && (
            <div className={`p-3 rounded-xl text-xs font-mono font-bold flex items-center gap-2 ${
              evalResult.passed
                ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                : 'bg-rose-100 text-rose-950 border border-rose-300'
            }`}>
              {evalResult.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-rose-700" />}
              <span>{evalResult.message}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-end pt-2 border-t border-[#EEDCD0]">
            <button
              onClick={handleEvaluate}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md transition-all hover:scale-105 font-heading"
            >
              <Play className="w-4 h-4 fill-current text-amber-300" />
              <span>Evaluate Solution (Run AST Test) ⚡</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
