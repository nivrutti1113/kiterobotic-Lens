'use client';

import React from 'react';
import { Award, CheckCircle, Zap, BookOpen, Bot, Star, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export const StudentProgress: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Student Overview Header Card */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/20 shrink-0">
            <div className="w-full h-full bg-gray-950 rounded-[14px] flex items-center justify-center">
              <Bot className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-xl text-white">Aarav Sharma</h2>
              <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
                Grade 7-B
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Delhi Public School, Mathura Road | ATL Tinkering Club</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex flex-wrap items-center gap-4 text-center">
          <div className="bg-gray-950 p-3 px-5 rounded-2xl border border-gray-800">
            <span className="text-xl font-extrabold text-cyan-400">18</span>
            <p className="text-[10px] text-gray-400 font-semibold uppercase">STEM Lens Scans</p>
          </div>
          <div className="bg-gray-950 p-3 px-5 rounded-2xl border border-gray-800">
            <span className="text-xl font-extrabold text-emerald-400">12</span>
            <p className="text-[10px] text-gray-400 font-semibold uppercase">Projects Built</p>
          </div>
          <div className="bg-gray-950 p-3 px-5 rounded-2xl border border-gray-800">
            <span className="text-xl font-extrabold text-amber-400">950 XP</span>
            <p className="text-[10px] text-gray-400 font-semibold uppercase">Level 4 Scholar</p>
          </div>
        </div>
      </div>

      {/* Skill Matrix Progression */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-panel p-5 rounded-3xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-amber-400 flex items-center gap-1">
              <Zap className="w-4 h-4" /> Block-Based Coding
            </span>
            <span className="text-emerald-400">Mastered (100%)</span>
          </div>
          <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
            <div className="w-full h-full bg-emerald-400 rounded-full" />
          </div>
          <p className="text-[11px] text-gray-400">Understands loops, conditional branching, and motor triggers.</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-cyan-400 flex items-center gap-1">
              <Zap className="w-4 h-4" /> Python & Microcontrollers
            </span>
            <span className="text-cyan-400">In Progress (75%)</span>
          </div>
          <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-cyan-400 rounded-full" />
          </div>
          <p className="text-[11px] text-gray-400">Writing custom ultrasonic distance logic and servo sweep loops.</p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-purple-400 flex items-center gap-1">
              <Zap className="w-4 h-4" /> ROS2 & Advanced Robotics
            </span>
            <span className="text-gray-400">Next Unlock (25%)</span>
          </div>
          <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
            <div className="w-1/4 h-full bg-purple-500 rounded-full" />
          </div>
          <p className="text-[11px] text-gray-400">Basic understanding of pub/sub node topology and sensor telemetries.</p>
        </div>

      </div>

      {/* Badges Earned */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col gap-4">
        <h3 className="font-bold text-base text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Earned STEM Badges & Achievements</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 flex items-center gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <h4 className="text-xs font-bold text-white">Circuit Pioneer</h4>
              <p className="text-[10px] text-gray-400">Scanned 10 hardware parts</p>
            </div>
          </div>

          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h4 className="text-xs font-bold text-white">Python Ninja</h4>
              <p className="text-[10px] text-gray-400">Compiled 20 clean code blocks</p>
            </div>
          </div>

          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 flex items-center gap-3">
            <span className="text-2xl">📡</span>
            <div>
              <h4 className="text-xs font-bold text-white">IoT Master</h4>
              <p className="text-[10px] text-gray-400">Built ESP32 Smart Home</p>
            </div>
          </div>

          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <h4 className="text-xs font-bold text-white">Showcase Star</h4>
              <p className="text-[10px] text-gray-400">Top 5 on Class Wall</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
