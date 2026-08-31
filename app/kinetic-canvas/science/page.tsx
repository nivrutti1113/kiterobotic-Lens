'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Play, Pause, RotateCcw, Activity } from 'lucide-react';

export default function SciencePhysicsStudioPage() {
  const [gravity, setGravity] = useState<number>(9.8); // m/s^2
  const [length, setLength] = useState<number>(150); // px
  const [angle, setAngle] = useState<number>(Math.PI / 4); // 45 degrees rad
  const [isRunning, setIsRunning] = useState<boolean>(true);
  
  const angleVelRef = useRef<number>(0);
  const angleAccRef = useRef<number>(0);
  const angleRef = useRef<number>(Math.PI / 4);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    angleRef.current = angle;
  }, [angle]);

  useEffect(() => {
    let animId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (isRunning) {
        // Simple harmonic pendulum equation: alpha = (-g / L) * sin(theta)
        angleAccRef.current = (-1 * (gravity / 100) * Math.sin(angleRef.current));
        angleVelRef.current += angleAccRef.current;
        angleVelRef.current *= 0.995; // air resistance damping
        angleRef.current += angleVelRef.current;
      }

      const width = canvas.width;
      const height = canvas.height;
      const originX = width / 2;
      const originY = 80;

      const bobX = originX + length * Math.sin(angleRef.current);
      const bobY = originY + length * Math.cos(angleRef.current);

      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Ceiling anchor
      ctx.fillStyle = '#334155';
      ctx.fillRect(originX - 40, originY - 10, 80, 10);

      // String line
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Force Vector (Gravity) arrow
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bobX, bobY);
      ctx.lineTo(bobX, bobY + 40);
      ctx.stroke();

      // Bob mass sphere
      ctx.fillStyle = '#7C3AED';
      ctx.beginPath();
      ctx.arc(bobX, bobY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#6D28D9';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Bob center dot
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(bobX, bobY, 4, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [gravity, length, isRunning]);

  const handleReset = () => {
    angleRef.current = Math.PI / 4;
    angleVelRef.current = 0;
    angleAccRef.current = 0;
    setAngle(Math.PI / 4);
  };

  const periodSec = (2 * Math.PI * Math.sqrt((length / 100) / gravity)).toFixed(2);

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
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="font-black text-base text-slate-950 font-heading">Science Experiment Physics Lab</h1>
              <p className="text-[11px] font-bold text-slate-600">Kinetic Energy & Pendulum Physics Engine</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all shadow-md font-heading ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause Simulation' : 'Run Simulation'}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-950 rounded-xl text-xs font-black transition-colors border border-purple-300 font-heading"
          >
            <RotateCcw className="w-4 h-4 text-purple-700" />
            <span>Reset Pendulum</span>
          </button>
        </div>
      </header>

      {/* Main Simulation Body */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        
        {/* Left Physics Control Panel */}
        <div className="w-full lg:w-80 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-5 shadow-md space-y-6">
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-heading">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Physics Parameters</span>
            </h3>

            {/* Gravity Slider */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-xs font-bold">
                <span>Gravity Acceleration (g)</span>
                <span className="text-purple-700 font-black">{gravity} m/s²</span>
              </div>
              <input
                type="range"
                min="1.6" // Moon gravity
                max="24.7" // Jupiter gravity
                step="0.1"
                value={gravity}
                onChange={(e) => setGravity(parseFloat(e.target.value))}
                className="w-full accent-purple-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-extrabold">
                <span>Moon (1.6)</span>
                <span>Earth (9.8)</span>
                <span>Jupiter (24.7)</span>
              </div>
            </div>

            {/* String Length Slider */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-xs font-bold">
                <span>Pendulum String Length (L)</span>
                <span className="text-purple-700 font-black">{(length / 100).toFixed(2)} m</span>
              </div>
              <input
                type="range"
                min="60"
                max="260"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="w-full accent-purple-700 cursor-pointer"
              />
            </div>
          </div>

          <div className="border-t border-[#EEDCD0] pt-4 space-y-2">
            <h4 className="text-xs font-black text-slate-950 font-heading">Calculated Physics Metrics:</h4>
            <div className="bg-[#FAF3EC] rounded-xl p-3 border border-[#EEDCD0] text-xs font-bold text-slate-800 space-y-1.5">
              <p>⏱️ <strong>Oscillation Period (T):</strong> {periodSec} seconds</p>
              <p>📐 <strong>Initial Angle (θ):</strong> 45°</p>
              <p>🔴 <strong>Red Arrow:</strong> Downward Gravity Vector</p>
              <p>🔮 <strong>Formula:</strong> T = 2π × √(L / g)</p>
            </div>
          </div>
        </div>

        {/* Center Interactive Simulation Canvas */}
        <div className="flex-1 bg-white rounded-2xl border-2 border-[#EEDCD0] shadow-xl overflow-hidden flex items-center justify-center p-2 relative min-h-[450px]">
          <canvas
            ref={canvasRef}
            width={700}
            height={500}
            className="w-full h-full object-contain bg-slate-50 rounded-xl"
          />
        </div>

      </div>

    </div>
  );
}
