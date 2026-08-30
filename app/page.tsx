'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Cpu, Activity, Sparkles, ArrowRight, ShieldCheck, Zap, Bot, Globe, CheckCircle2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16 py-4 font-sans text-[#374151]">
      
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-6">
        
        {/* Proposal Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-300 text-purple-900 text-xs font-black shadow-sm font-heading">
          <Sparkles className="w-4 h-4 text-purple-700 animate-spin" />
          <span>KITE ROBOTICS FLAGSHIP SUITE • PRODUCTION EDITION</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#111827] leading-tight font-heading">
          STEM LENS, KINETIC CANVAS <br />
          <span className="text-gradient">& HARDWARE LAB WORKBENCH</span>
        </h1>

        <p className="text-base sm:text-xl text-[#374151] max-w-2xl mx-auto leading-relaxed font-semibold">
          A Unified AI, Robotics, IoT & Coding Learning Ecosystem for Indian School Students (Grades 3–12).
          Built to run simulation-first, in regional languages, and deployable directly to real hardware via WebSerial.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4 font-heading">
          <Link
            href="/stem-lens"
            className="flex items-center gap-3 px-7 py-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-sm shadow-xl shadow-purple-700/20 transition-all hover:scale-105 active:scale-95"
          >
            <Camera className="w-5 h-5 text-amber-300" />
            <span>Launch STEM Lens AI Scanner</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/kinetic-canvas"
            className="flex items-center gap-3 px-7 py-4 rounded-2xl bg-[#FFFDF9] border border-[#EEDCD0] hover:border-purple-500 text-[#111827] font-black text-sm transition-all hover:scale-105 shadow-sm"
          >
            <Cpu className="w-5 h-5 text-purple-700" />
            <span>Open Kinetic Canvas Studio</span>
          </Link>

          <Link
            href="/hardware-lab"
            className="flex items-center gap-3 px-7 py-4 rounded-2xl bg-purple-100 hover:bg-purple-200 border border-purple-300 text-purple-950 font-black text-sm transition-all hover:scale-105 shadow-sm"
          >
            <Activity className="w-5 h-5 text-purple-700" />
            <span>Hardware Telemetry Lab</span>
          </Link>
        </div>

        {/* Executive Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 text-left">
          <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EEDCD0] shadow-sm">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
            <h3 className="text-xs font-black text-[#111827] font-heading">Simulation-First</h3>
            <p className="text-[11px] text-[#4B5563] font-medium mt-0.5">Zero hardware cost barrier to start learning</p>
          </div>

          <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EEDCD0] shadow-sm">
            <Globe className="w-6 h-6 text-blue-600 mb-2" />
            <h3 className="text-xs font-black text-[#111827] font-heading">Vernacular AI</h3>
            <p className="text-[11px] text-[#4B5563] font-medium mt-0.5">Hindi, Tamil, Marathi, Telugu & Bengali TTS</p>
          </div>

          <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EEDCD0] shadow-sm">
            <Zap className="w-6 h-6 text-amber-600 mb-2" />
            <h3 className="text-xs font-black text-[#111827] font-heading">Real WebSerial USB</h3>
            <p className="text-[11px] text-[#4B5563] font-medium mt-0.5">One-click flash to Arduino & ESP32</p>
          </div>

          <div className="bg-[#FFFDF9] p-4 rounded-2xl border border-[#EEDCD0] shadow-sm">
            <Bot className="w-6 h-6 text-purple-600 mb-2" />
            <h3 className="text-xs font-black text-[#111827] font-heading">ATL & NEP 2020</h3>
            <p className="text-[11px] text-[#4B5563] font-medium mt-0.5">Mapped to NITI Aayog & PM SHRI standards</p>
          </div>
        </div>

      </section>

      {/* Flagship Modules Breakdown Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* STEM Lens Card */}
        <div className="bg-[#FFFDF9] p-8 rounded-3xl border border-[#EEDCD0] space-y-6 relative overflow-hidden group hover:border-purple-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 border border-cyan-300 flex items-center justify-center">
              <Camera className="w-6 h-6 text-cyan-800" />
            </div>
            <span className="text-xs font-black text-cyan-950 bg-cyan-100 px-3 py-1 rounded-full border border-cyan-300 font-heading">
              MODULE 1
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-[#111827] font-heading">STEM Lens</h2>
            <p className="text-xs text-cyan-800 font-black mt-0.5 font-heading">Discovery & AI Vision Module</p>
            <p className="text-xs text-[#374151] mt-3 leading-relaxed font-semibold">
              Point phone camera or select hardware to view AR circuit overlays, animated current signals, and grade-adapted explanations with Vernacular Text-to-Speech audio reading.
            </p>
          </div>

          <ul className="space-y-2 text-xs text-[#374151] font-semibold">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-700 shrink-0" />
              <span>Real HTML5 WebCam & Snapshot Capture</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-700 shrink-0" />
              <span>Grade 3–12 adaptive explanation engine</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-700 shrink-0" />
              <span>Web Speech API Text-to-Speech audio</span>
            </li>
          </ul>

          <Link
            href="/stem-lens"
            className="inline-flex items-center gap-2 text-xs font-black text-purple-700 hover:text-purple-900 pt-2 font-heading"
          >
            <span>Explore STEM Lens AI Scanner</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Kinetic Canvas Card */}
        <div className="bg-[#FFFDF9] p-8 rounded-3xl border border-[#EEDCD0] space-y-6 relative overflow-hidden group hover:border-purple-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-purple-800" />
            </div>
            <span className="text-xs font-black text-purple-950 bg-purple-100 px-3 py-1 rounded-full border border-purple-300 font-heading">
              MODULE 2
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-[#111827] font-heading">Kinetic Canvas</h2>
            <p className="text-xs text-purple-800 font-black mt-0.5 font-heading">Build, Code & Simulate Studio</p>
            <p className="text-xs text-[#374151] mt-3 leading-relaxed font-semibold">
              Visual block coding with real-time Block-to-Code Python & C++ compilation, 2D physics simulation, and WebSerial firmware deployment.
            </p>
          </div>

          <ul className="space-y-2 text-xs text-[#374151] font-semibold">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
              <span>Live Block-to-Code Python & C++ parser</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
              <span>Interactive 2D canvas physics simulation</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
              <span>AI Co-Pilot with 1-click auto-debug</span>
            </li>
          </ul>

          <Link
            href="/kinetic-canvas"
            className="inline-flex items-center gap-2 text-xs font-black text-purple-700 hover:text-purple-900 pt-2 font-heading"
          >
            <span>Open Kinetic Canvas Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Hardware Lab Workbench Card */}
        <div className="bg-[#FFFDF9] p-8 rounded-3xl border border-[#EEDCD0] space-y-6 relative overflow-hidden group hover:border-emerald-500 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center">
              <Activity className="w-6 h-6 text-emerald-800" />
            </div>
            <span className="text-xs font-black text-emerald-950 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 font-heading">
              MODULE 3
            </span>
          </div>

          <div>
            <h2 className="text-2xl font-black text-[#111827] font-heading">Hardware Lab</h2>
            <p className="text-xs text-emerald-800 font-black mt-0.5 font-heading">Telemetry & Diagnostics Studio</p>
            <p className="text-xs text-[#374151] mt-3 leading-relaxed font-semibold">
              Real-time WebSerial telemetry oscilloscope, interactive microcontroller pinout inspector, automated diagnostics benchmarks, and printable circuit schematics.
            </p>
          </div>

          <ul className="space-y-2 text-xs text-[#374151] font-semibold">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Live Oscilloscope Telemetry Line Plotter</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Arduino, ESP32 & Pico Pinout Inspector</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>ATL Hardware Wiring & BOM Card Exporter</span>
            </li>
          </ul>

          <Link
            href="/hardware-lab"
            className="inline-flex items-center gap-2 text-xs font-black text-purple-700 hover:text-purple-900 pt-2 font-heading"
          >
            <span>Open Hardware Lab Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </section>

      {/* Grade Band Progression Matrix Table */}
      <section className="bg-[#FFFDF9] p-8 rounded-3xl border border-[#EEDCD0] space-y-6 shadow-sm">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl font-black text-[#111827] font-heading">Grade Band Learning Progression</h2>
          <p className="text-xs text-[#4B5563] mt-1 font-semibold">Structured learning journey mapped to NEP 2020 standards</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#EEDCD0] text-[#111827] uppercase font-black font-heading">
                <th className="py-3 px-4">Grade Band</th>
                <th className="py-3 px-4">STEM Lens Experience</th>
                <th className="py-3 px-4">Kinetic Canvas & Hardware Lab</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEDCD0] text-[#374151] font-semibold">
              <tr>
                <td className="py-4 px-4 font-black text-amber-800 font-heading">Grade 3–5</td>
                <td className="py-4 px-4">Scan simple gadgets (torch, fan, toy car) with fun metaphors</td>
                <td className="py-4 px-4">Drag-and-drop visual blocks to move virtual rover, light LEDs</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-black text-cyan-800 font-heading">Grade 6–8</td>
                <td className="py-4 px-4">Scan circuits/sensors — AI explains input/output logic & signal flow</td>
                <td className="py-4 px-4">Build line-followers, obstacle-avoiders & inspect pinout safety</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-black text-blue-800 font-heading">Grade 9–10</td>
                <td className="py-4 px-4">Scan real Arduino/IoT boards — pinout breakdowns & technical specs</td>
                <td className="py-4 px-4">Python coding, sensor fusion, AI Co-Pilot auto-debug & WebSerial flash</td>
              </tr>
              <tr>
                <td className="py-4 px-4 font-black text-purple-900 font-heading">Grade 11–12</td>
                <td className="py-4 px-4">Scan advanced robotics/AI hardware — ROS2 protocol topology</td>
                <td className="py-4 px-4">MicroPython IoT dashboards, live telemetry oscilloscope & UART testing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
