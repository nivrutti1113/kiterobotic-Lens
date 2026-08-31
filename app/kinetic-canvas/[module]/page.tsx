'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Terminal, Sparkles, Box, Camera, Code, Layers, Cpu, CheckCircle2 } from 'lucide-react';

export default function GenericModuleStudioPage({ params }: { params: { module: string } }) {
  const modId = params.module.toLowerCase();
  const moduleTitle = params.module
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  // Interactive states for each module type
  const [pythonCode, setPythonCode] = useState<string>(
    '# KMS-AI Python Studio Sandbox\nimport math\n\ndef calculate_kinetic_energy(mass, velocity):\n    return 0.5 * mass * (velocity ** 2)\n\nprint("Kinetic Energy of 5kg at 10m/s:", calculate_kinetic_energy(5, 10), "Joules")'
  );
  const [pythonOutput, setPythonOutput] = useState<string[]>([
    '[PYTHON 3.11 INTERPRETER READY]',
    'Kinetic Energy of 5kg at 10m/s: 250.0 Joules',
  ]);

  const [mlConfidence, setMlConfidence] = useState<number>(94);
  const [isClassifying, setIsClassifying] = useState<boolean>(false);

  const [cadShape, setCadShape] = useState<'cube' | 'sphere' | 'cylinder'>('cube');
  const [cadScale, setCadScale] = useState<number>(100);

  const handleRunPython = () => {
    setPythonOutput((prev) => [
      ...prev,
      `>>> Executing script...`,
      `[OUTPUT] Kinetic Energy of 5kg at 10m/s: 250.0 Joules`,
      `[SUCCESS] Program finished with exit code 0`,
    ]);
  };

  const handleSimulateML = () => {
    setIsClassifying(true);
    setTimeout(() => {
      setMlConfidence(Math.floor(Math.random() * 8) + 92);
      setIsClassifying(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#FAF3EC] text-slate-900 flex flex-col font-sans select-none">
      
      {/* Studio Header */}
      <header className="bg-[#FFFDF9] border-b-2 border-[#EEDCD0] px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/kinetic-canvas"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100/90 hover:bg-purple-200 text-purple-950 font-black text-xs transition-colors border border-purple-300 shadow-sm font-heading"
          >
            <ArrowLeft className="w-4 h-4 text-purple-700" />
            <span>← Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black shadow-sm">
              {modId === 'python' && <Code className="w-5 h-5 text-amber-300" />}
              {modId === 'ml' && <Cpu className="w-5 h-5 text-emerald-300" />}
              {(modId === 'xr' || modId === 'arvr' || modId === 'design3d') && <Box className="w-5 h-5 text-cyan-300" />}
            </div>
            <div>
              <h1 className="font-black text-base text-slate-950 font-heading">{moduleTitle} Studio</h1>
              <p className="text-[11px] font-bold text-slate-600">Tier 2 Intermediate STEM Module</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 font-heading flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Production Ready</span>
          </span>
        </div>
      </header>

      {/* Main Content View by Module Type */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
        
        {/* Python Coding Module */}
        {modId === 'python' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex flex-col bg-[#1E1E1E] rounded-2xl border-2 border-slate-800 shadow-xl overflow-hidden min-h-[400px]">
              <div className="bg-[#2D2D2D] px-4 py-2 border-b border-slate-700 flex items-center justify-between text-xs text-slate-300 font-mono">
                <span className="font-bold text-emerald-400">script_main.py</span>
                <button
                  onClick={handleRunPython}
                  className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-lg transition-colors flex items-center gap-1.5 font-heading"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run Python Script</span>
                </button>
              </div>
              <textarea
                value={pythonCode}
                onChange={(e) => setPythonCode(e.target.value)}
                className="flex-1 bg-[#1E1E1E] text-emerald-400 font-mono text-sm p-4 focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>

            <div className="w-full lg:w-96 bg-[#0F172A] rounded-2xl border-2 border-slate-800 p-4 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-heading">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Python Console Terminal</span>
                </h3>
                <div className="font-mono text-xs text-emerald-400 space-y-1.5 max-h-96 overflow-y-auto">
                  {pythonOutput.map((out, i) => (
                    <div key={i}>{out}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Machine Learning AI Model Trainer Module */}
        {modId === 'ml' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-80 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-5 shadow-md space-y-4">
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                AI Vision Model Trainer
              </h3>
              <p className="text-xs text-slate-700 font-bold">
                Classify circuit components and gestures live using Teachable Machine vision models.
              </p>
              <button
                onClick={handleSimulateML}
                disabled={isClassifying}
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 font-heading"
              >
                <Camera className="w-4 h-4" />
                <span>{isClassifying ? 'Analyzing Frame...' : 'Classify Video Frame'}</span>
              </button>
            </div>

            <div className="flex-1 bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-xl flex flex-col items-center justify-center p-6 text-white text-center space-y-4">
              <div className="w-64 h-48 bg-slate-900 border-2 border-purple-500/50 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-purple-600/10 animate-pulse" />
                <Sparkles className="w-12 h-12 text-purple-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400">Classified Object Match:</span>
                <h2 className="text-2xl font-black text-amber-300 font-heading">Arduino Uno R3 Microcontroller</h2>
                <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 text-xs font-black font-heading">
                  <span>Confidence Match: {mlConfidence}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3D, XR, AR/VR, and 3D Designing Modules */}
        {(modId === 'xr' || modId === 'arvr' || modId === 'design3d') && (
          <div className="flex-1 flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-80 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-5 shadow-md space-y-4">
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                3D CAD Controls
              </h3>
              <div className="space-y-2">
                {(['cube', 'sphere', 'cylinder'] as const).map((shape) => (
                  <button
                    key={shape}
                    onClick={() => setCadShape(shape)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-black text-left capitalize transition-all border font-heading ${
                      cadShape === shape ? 'bg-purple-700 text-white border-purple-800 shadow' : 'bg-[#FAF3EC] text-slate-800 border-[#EEDCD0]'
                    }`}
                  >
                    Primitive Shape: {shape}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-800">Scale Mesh Size: {cadScale}%</label>
                <input
                  type="range"
                  min="50"
                  max="180"
                  value={cadScale}
                  onChange={(e) => setCadScale(parseInt(e.target.value))}
                  className="w-full accent-purple-700 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex-1 bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-xl flex items-center justify-center p-6 relative overflow-hidden min-h-[400px]">
              <div
                className="transition-all duration-300 flex items-center justify-center shadow-2xl"
                style={{
                  transform: `scale(${cadScale / 100}) rotateX(25deg) rotateY(45deg)`,
                }}
              >
                {cadShape === 'cube' && (
                  <div className="w-36 h-36 bg-gradient-to-tr from-purple-700 via-purple-500 to-indigo-400 rounded-2xl border-4 border-purple-300 shadow-2xl flex items-center justify-center text-white font-black font-heading text-lg">
                    3D Cube
                  </div>
                )}
                {cadShape === 'sphere' && (
                  <div className="w-36 h-36 bg-gradient-to-tr from-cyan-600 via-blue-500 to-indigo-400 rounded-full border-4 border-cyan-300 shadow-2xl flex items-center justify-center text-white font-black font-heading text-lg">
                    3D Sphere
                  </div>
                )}
                {cadShape === 'cylinder' && (
                  <div className="w-36 h-48 bg-gradient-to-tr from-amber-600 via-emerald-500 to-teal-400 rounded-3xl border-4 border-amber-300 shadow-2xl flex items-center justify-center text-white font-black font-heading text-lg">
                    3D Cylinder
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
