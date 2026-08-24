'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Cpu, LayoutDashboard, Sparkles, ArrowRight, ShieldCheck, Zap, Bot, Compass, CheckCircle2, Globe, Flame, Layers } from 'lucide-react';
import { SupportedLanguage } from '@/lib/languages';

export default function Home() {
  const currentLang: SupportedLanguage = 'en';
  return (
    <div className="space-y-16 py-4">
      
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-6">
        
        {/* Proposal Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold shadow-lg shadow-cyan-500/10">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>KITE ROBOTICS FLAGSHIP SUITE • AUGUST 2026 PROPOSAL</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
          STEM LENS <span className="text-gray-500 font-light">&</span> <br />
          <span className="text-gradient">KINETIC CANVAS</span>
        </h1>

        <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          A Unified AI, Robotics, IoT & Coding Learning Ecosystem for Indian School Students (Grades 3–12).
          Built to run simulation-first, in regional languages, and deployable to real hardware.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/stem-lens"
            className="flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-black text-sm shadow-xl shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95"
          >
            <Camera className="w-5 h-5" />
            <span>Launch STEM Lens AI Scanner</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/kinetic-canvas"
            className="flex items-center gap-3 px-7 py-4 rounded-2xl bg-gray-900 border border-gray-800 hover:border-cyan-500/50 text-white font-bold text-sm transition-all hover:scale-105"
          >
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Open Kinetic Canvas Studio</span>
          </Link>
        </div>

        {/* Executive Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 text-left">
          <div className="bg-gray-950/80 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
            <h3 className="text-xs font-bold text-white">Simulation-First</h3>
            <p className="text-[11px] text-gray-400">Zero hardware cost barrier to start learning</p>
          </div>

          <div className="bg-gray-950/80 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
            <Globe className="w-6 h-6 text-cyan-400 mb-2" />
            <h3 className="text-xs font-bold text-white">Vernacular AI</h3>
            <p className="text-[11px] text-gray-400">Hindi, Tamil, Marathi, Telugu & Bengali</p>
          </div>

          <div className="bg-gray-950/80 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
            <Zap className="w-6 h-6 text-amber-400 mb-2" />
            <h3 className="text-xs font-bold text-white">WebSerial Deploy</h3>
            <p className="text-[11px] text-gray-400">One-click flash to Arduino & ESP32</p>
          </div>

          <div className="bg-gray-950/80 p-4 rounded-2xl border border-gray-800 backdrop-blur-md">
            <Bot className="w-6 h-6 text-purple-400 mb-2" />
            <h3 className="text-xs font-bold text-white">ATL & NEP 2020</h3>
            <p className="text-[11px] text-gray-400">Mapped to NITI Aayog & PM SHRI standards</p>
          </div>
        </div>

      </section>

      {/* Two Flagship Modules Breakdown */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* STEM Lens Card */}
        <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Camera className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
              MODULE 3.1
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">STEM Lens</h2>
            <p className="text-xs text-cyan-400 font-semibold mt-0.5">Discovery & AI Explainability Module</p>
            <p className="text-xs text-gray-300 mt-3 leading-relaxed">
              Students point their phone or tablet camera at real hardware objects, circuits, or robot components to see point-and-learn AR overlays and instant grade-adaptive explanations in their own language.
            </p>
          </div>

          <ul className="space-y-2 text-xs text-gray-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Point-and-learn AR circuit overlays & signal flows</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Grade 3–12 adaptive explanation engine</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Contextual AI Doubt-Solver Chat</span>
            </li>
          </ul>

          <Link
            href="/stem-lens"
            className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-2"
          >
            <span>Explore STEM Lens AI Scanner</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Kinetic Canvas Card */}
        <div className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
              MODULE 3.2
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">Kinetic Canvas</h2>
            <p className="text-xs text-purple-400 font-semibold mt-0.5">Build, Code & Simulate Studio</p>
            <p className="text-xs text-gray-300 mt-3 leading-relaxed">
              Visual block-based and text coding studio with a live 2D/3D physics simulator. Students design logic, code robot behavior, and deploy code directly to Arduino & ESP32 kits via WebSerial.
            </p>
          </div>

          <ul className="space-y-2 text-xs text-gray-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Block-based coding transitioning seamlessly to Python & C++</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Live 2D physics canvas simulation (Robots, Sensors, Smart Home)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>One-click WebSerial USB hardware flasher</span>
            </li>
          </ul>

          <Link
            href="/kinetic-canvas"
            className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 pt-2"
          >
            <span>Open Kinetic Canvas Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </section>

      {/* Grade Band Progression Matrix Table */}
      <section className="glass-panel p-8 rounded-3xl border border-gray-800 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-white">Grade Band Learning Journey</h2>
          <p className="text-xs text-gray-400 mt-1">Structured progression from Grade 3 up to Grade 12</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 uppercase font-semibold">
                <th className="py-3 px-4">Grade Band</th>
                <th className="py-3 px-4">STEM Lens Experience</th>
                <th className="py-3 px-4">Kinetic Canvas Experience</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-300">
              <tr>
                <td className="py-4 px-4 font-bold text-amber-400">Grade 3–5</td>
                <td className="py-4 px-4">Scan simple gadgets (torch, fan, toy car) — animated metaphors</td>
                <td className="py-4 px-4">Drag-and-drop blocks to move virtual robot, light LEDs & buzzers</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-cyan-400">Grade 6–8</td>
                <td className="py-4 px-4">Scan circuits/sensors — AI explains inputs, outputs, logic</td>
                <td className="py-4 px-4">Build line-followers, obstacle-avoiders & simple IoT dashboards</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-blue-400">Grade 9–10</td>
                <td className="py-4 px-4">Scan real Arduino/IoT boards — component & pinout breakdowns</td>
                <td className="py-4 px-4">Python-based coding, sensor fusion, AI Co-Pilot auto-fix debugging</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-bold text-purple-400">Grade 11–12</td>
                <td className="py-4 px-4">Scan advanced robotics/AI hardware — deep technical explainers</td>
                <td className="py-4 px-4">ROS2 basics, AI/ML mini-projects & real hardware deployments</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
