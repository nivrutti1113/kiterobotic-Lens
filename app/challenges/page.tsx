'use client';

import React from 'react';
import { ChallengeEngine } from '@/components/challenges/ChallengeEngine';
import { BuddyBotGuide } from '@/components/BuddyBotGuide';

export default function ChallengesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* BuddyBot Student Guide */}
      <BuddyBotGuide
        step1="Pick a fun robot quest card below 🎮"
        step2="Fix the code parameters & click 'Submit' 🛠️"
        step3="Win XP points, medals & badges! 🏆"
        currentStep={1}
      />

      <div>
        <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2.5">
          <span>Robot Adventure Quests & Puzzles</span>
          <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full font-bold">
            Fun Learning for Kids
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Solve real-world robot puzzles, fix broken code, calibrate sensors, and earn XP points!
        </p>
      </div>

      <ChallengeEngine />
    </div>
  );
}
