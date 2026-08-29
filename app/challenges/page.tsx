'use client';

import React from 'react';
import { ChallengeEngine } from '@/components/challenges/ChallengeEngine';

export default function ChallengesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
          <span>STEM Debugging & Robotics Challenge Arena</span>
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">
            NEP 2020 Experiential Learning
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Master real-world robotics code debugging, sensor calibration, and circuit safety through interactive AST evaluation quests.
        </p>
      </div>

      <ChallengeEngine />
    </div>
  );
}
