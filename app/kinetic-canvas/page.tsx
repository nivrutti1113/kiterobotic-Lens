'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket, ArrowRight, Cpu, Sparkles, Smile, Layers, Clock, Palette, Gamepad2, Zap, Wifi, Globe, Calculator, Eye } from 'lucide-react';

export default function KineticCanvasDashboard() {
  return (
    <div className="-mt-8 min-h-screen bg-[#FAF3EC] text-slate-900 pb-16 font-sans">
      
      {/* Warm Skin-Tone & Low-White Header Banner */}
      <div className="bg-gradient-to-r from-[#FDEEE9] via-[#FAF3EC] to-[#FFFDF9] border-b border-[#EEDCD0] py-10 px-4 sm:px-8 text-center shadow-sm">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-700 text-white text-xs font-black tracking-wide shadow-sm font-heading">
            <Rocket className="w-4 h-4 animate-bounce text-amber-300" />
            <span>KMS-AI (Kite Maker Studio)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight font-heading">
            What would you like to do today?
          </h1>
          <p className="text-base font-black text-purple-900 font-heading">
            Code · Simulate · Design · Innovate
          </p>
          <p className="text-sm text-slate-800 max-w-xl mx-auto font-semibold leading-relaxed">
            Drag-and-drop block studio, robotics simulation, Arduino wiring, and Python coding designed for Indian school students (Class 3 to Class 12).
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* Tier 1 — BASIC */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#EEDCD0] pb-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-200 text-purple-950 border border-purple-300 font-heading">
                  Perfect for Beginners
                </span>
                <h2 className="text-xl font-black text-slate-950 font-heading">Tier 1 — BASIC</h2>
              </div>
              <p className="text-xs text-slate-700 mt-1 font-bold">Foundational block coding and virtual robotics labs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Card 1: Junior Blocks (FULLY FUNCTIONAL) */}
            <div className="bg-[#FFFDF9] rounded-2xl border-2 border-purple-300 hover:border-purple-600 p-5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-bold shadow-sm">
                    <Smile className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-purple-100 text-purple-950 border border-purple-300 font-heading">
                    Ages 6+
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-950 group-hover:text-purple-700 transition-colors font-heading">
                  Junior Blocks
                </h3>
                <p className="text-xs text-slate-800 mt-1.5 leading-relaxed font-bold">
                  Drag and drop colorful coding blocks for absolute beginners. Control sprites & sound effects live!
                </p>
              </div>

              <Link
                href="/kinetic-canvas/junior-blocks"
                className="mt-5 w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow-md transition-colors font-heading"
              >
                <span>Open Junior Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 2: Blocks (AGAIN FULLY FUNCTIONAL ENGINE) */}
            <div className="bg-[#FFFDF9] rounded-2xl border-2 border-blue-300 hover:border-blue-600 p-5 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-blue-100 text-blue-950 border border-blue-300 font-heading">
                    Ages 7+
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-950 group-hover:text-blue-700 transition-colors font-heading">
                  Blocks
                </h3>
                <p className="text-xs text-slate-800 mt-1.5 leading-relaxed font-bold">
                  Learn logic with puzzle-shaped blocks, sensing, variables, and math operators.
                </p>
              </div>

              <Link
                href="/kinetic-canvas/blocks"
                className="mt-5 w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs shadow-md transition-colors font-heading"
              >
                <span>Open Blocks Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 3: Arduino Coding (HONEST COMING SOON) */}
            <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-slate-200 text-slate-900 border border-slate-300 font-heading">
                    Ages 10+
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-950 font-heading">Arduino Coding</h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300 font-heading">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-semibold">
                  Code with Arduino C++ and build real-world microcontroller projects.
                </p>
              </div>

              <Link
                href="/kinetic-canvas/arduino"
                className="mt-5 w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#FAF3EC] hover:bg-purple-100 text-slate-900 font-black text-xs transition-colors border border-[#EEDCD0] font-heading"
              >
                <span>View Overview</span>
                <Clock className="w-4 h-4 text-slate-700" />
              </Link>
            </div>

            {/* Card 4: Science Experiment (HONEST COMING SOON) */}
            <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-slate-200 text-slate-900 border border-slate-300 font-heading">
                    Ages 10+
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-950 font-heading">Science Experiment</h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300 font-heading">
                    Coming Soon
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-1.5 leading-relaxed font-semibold">
                  Perform virtual science experiments and kinetic physics simulations.
                </p>
              </div>

              <Link
                href="/kinetic-canvas/science"
                className="mt-5 w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#FAF3EC] hover:bg-purple-100 text-slate-900 font-black text-xs transition-colors border border-[#EEDCD0] font-heading"
              >
                <span>View Overview</span>
                <Clock className="w-4 h-4 text-slate-700" />
              </Link>
            </div>

          </div>
        </section>

        {/* Tier 2 — INTERMEDIATE */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#EEDCD0] pb-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-200 text-purple-950 border border-purple-300 font-heading">
                  Build Advanced Skills
                </span>
                <h2 className="text-xl font-black text-slate-950 font-heading">Tier 2 — INTERMEDIATE</h2>
              </div>
              <p className="text-xs text-slate-700 mt-1 font-bold">Advanced Python, Artificial Intelligence, and 3D XR design</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { id: 'python', title: 'Python Coding', age: 'Ages 12+', desc: 'Real text-based Python scripts for Class 8-12.' },
              { id: 'ml', title: 'Machine Learning', age: 'Ages 12+', desc: 'Train AI models for image & voice recognition.' },
              { id: 'xr', title: '3D & XR Studio', age: 'Ages 12+', desc: 'Interactive 3D environments & physics simulation.' },
              { id: 'arvr', title: 'AR/VR Lab', age: 'Ages 12+', desc: 'Augmented & Virtual Reality immersive experiences.' },
              { id: 'design3d', title: '3D Designing', age: 'Ages 12+', desc: '3D modeling & CAD for robotics printing.' },
            ].map((tool) => (
              <div
                key={tool.id}
                className="bg-[#FFFDF9] rounded-2xl border border-[#EEDCD0] p-4 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black text-slate-700 font-heading">{tool.age}</span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-slate-200 text-slate-900 border border-slate-300 font-heading">
                      Coming Soon
                    </span>
                  </div>
                  <h4 className="font-black text-base text-slate-950 font-heading">{tool.title}</h4>
                  <p className="text-xs text-slate-700 mt-1.5 leading-snug font-semibold">{tool.desc}</p>
                </div>
                <Link
                  href={`/kinetic-canvas/${tool.id}`}
                  className="mt-4 text-center py-2 rounded-xl bg-[#FAF3EC] hover:bg-purple-100 text-slate-950 text-xs font-black block border border-[#EEDCD0] font-heading"
                >
                  Details
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Tier 3 — MORE TOOLS */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#EEDCD0] pb-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-200 text-amber-950 border border-amber-300 font-heading">
                  Explore, Create & Innovate
                </span>
                <h2 className="text-xl font-black text-slate-950 font-heading">Tier 3 — MORE TOOLS</h2>
              </div>
              <p className="text-xs text-slate-700 mt-1 font-bold">Creative utility toolchips and specialized STEM suites</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'paint', title: 'Paint Studio', icon: <Palette className="w-4 h-4 text-purple-700" /> },
              { id: 'gamelab', title: 'Game Lab', icon: <Gamepad2 className="w-4 h-4 text-blue-700" /> },
              { id: 'electronics', title: 'Electronics', icon: <Zap className="w-4 h-4 text-amber-700" /> },
              { id: 'iot', title: 'IoT Simulator', icon: <Wifi className="w-4 h-4 text-cyan-700" /> },
              { id: 'web', title: 'Web Builder', icon: <Globe className="w-4 h-4 text-emerald-700" /> },
              { id: 'math', title: 'Math Lab', icon: <Calculator className="w-4 h-4 text-pink-700" /> },
              { id: 'invisible', title: 'Invisible Mode', icon: <Eye className="w-4 h-4 text-indigo-700" /> },
            ].map((chip) => (
              <Link
                key={chip.id}
                href={`/kinetic-canvas/tool/${chip.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-[#FFFDF9] hover:bg-purple-100 border border-[#EEDCD0] rounded-xl shadow-sm text-xs font-black text-slate-950 transition-all hover:scale-105 font-heading"
              >
                {chip.icon}
                <span>{chip.title}</span>
                <span className="text-[10px] font-black text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full border border-slate-300">
                  Soon
                </span>
              </Link>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
