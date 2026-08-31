'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Play, Pause, RotateCcw, Activity, Zap, Beaker, Rocket } from 'lucide-react';

export default function ScienceMultiLabPage() {
  const [activeTab, setActiveTab] = useState<'pendulum' | 'projectile' | 'ohms' | 'ph'>('pendulum');

  // Lab 1: Pendulum
  const [gravity, setGravity] = useState<number>(9.8);
  const [length, setLength] = useState<number>(150);
  const [isPendulumRunning, setIsPendulumRunning] = useState<boolean>(true);
  const pendulumCanvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef = useRef<number>(Math.PI / 4);
  const angleVelRef = useRef<number>(0);

  // Lab 2: Projectile
  const [projAngle, setProjAngle] = useState<number>(45); // deg
  const [projVelocity, setProjVelocity] = useState<number>(45); // m/s
  const projCanvasRef = useRef<HTMLCanvasElement>(null);

  // Lab 3: Ohm's Law
  const [voltage, setVoltage] = useState<number>(12); // V
  const [resistance, setResistance] = useState<number>(220); // Ohm
  const current = (voltage / resistance).toFixed(3); // Amperes

  // Lab 4: Chemistry pH
  const [phValue, setPhValue] = useState<number>(7.0);

  // Pendulum Render Animation
  useEffect(() => {
    if (activeTab !== 'pendulum') return;
    let animId: number;

    const canvas = pendulumCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (isPendulumRunning) {
        const angleAcc = -1 * (gravity / 100) * Math.sin(angleRef.current);
        angleVelRef.current += angleAcc;
        angleVelRef.current *= 0.995;
        angleRef.current += angleVelRef.current;
      }

      const width = canvas.width;
      const height = canvas.height;
      const originX = width / 2;
      const originY = 60;

      const bobX = originX + length * Math.sin(angleRef.current);
      const bobY = originY + length * Math.cos(angleRef.current);

      ctx.clearRect(0, 0, width, height);

      // Grid
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
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

      // Gravity Arrow
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bobX, bobY);
      ctx.lineTo(bobX, bobY + 35);
      ctx.stroke();

      // Sphere bob
      ctx.fillStyle = '#7C3AED';
      ctx.beginPath();
      ctx.arc(bobX, bobY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#6D28D9';
      ctx.lineWidth = 2;
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeTab, gravity, length, isPendulumRunning]);

  // Projectile Motion Render
  useEffect(() => {
    if (activeTab !== 'projectile') return;
    const canvas = projCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Ground
    ctx.fillStyle = '#10B981';
    ctx.fillRect(0, height - 30, width, 30);

    const rad = (projAngle * Math.PI) / 180;
    const vx = projVelocity * Math.cos(rad);
    const vy = projVelocity * Math.sin(rad);

    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(30, height - 30);

    let t = 0;
    let x = 30;
    let y = height - 30;

    while (y <= height - 30 && x <= width) {
      x = 30 + vx * t * 4;
      y = height - 30 - (vy * t * 4 - 0.5 * 9.8 * t * t * 4);
      ctx.lineTo(x, y);
      t += 0.1;
    }
    ctx.stroke();

    // Target Ring at landing
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.arc(Math.min(width - 50, x), height - 30, 12, 0, Math.PI * 2);
    ctx.fill();
  }, [activeTab, projAngle, projVelocity]);

  // pH color calculator
  const getPhColor = (val: number) => {
    if (val < 3) return '#EF4444'; // Strong Acid (Red)
    if (val < 6) return '#F59E0B'; // Weak Acid (Orange/Yellow)
    if (val === 7) return '#10B981'; // Neutral (Green)
    if (val < 11) return '#3B82F6'; // Weak Base (Blue)
    return '#8B5CF6'; // Strong Base (Purple)
  };

  const periodSec = (2 * Math.PI * Math.sqrt((length / 100) / gravity)).toFixed(2);

  return (
    <div className="min-h-screen bg-[#FAF3EC] text-slate-900 flex flex-col font-sans select-none">
      
      {/* Header */}
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
              <h1 className="font-black text-base text-slate-950 font-heading">Multi-Lab Science & Physics Suite</h1>
              <p className="text-[11px] font-bold text-slate-600">Physics Motion, Circuit Ohm's Law & Chemistry pH Simulator</p>
            </div>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex items-center gap-1 bg-[#FAF3EC] p-1 rounded-2xl border border-[#EEDCD0]">
          {[
            { id: 'pendulum', label: '1. Pendulum', icon: <Activity className="w-3.5 h-3.5" /> },
            { id: 'projectile', label: '2. Projectile', icon: <Rocket className="w-3.5 h-3.5" /> },
            { id: 'ohms', label: "3. Ohm's Law", icon: <Zap className="w-3.5 h-3.5" /> },
            { id: 'ph', label: '4. Chemistry pH', icon: <Beaker className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all font-heading ${
                activeTab === tab.id
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'text-slate-800 hover:bg-purple-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Content View by Tab */}
      <div className="flex-1 p-4 flex flex-col overflow-hidden">
        
        {/* Tab 1: Pendulum */}
        {activeTab === 'pendulum' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-80 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                Pendulum Motion Parameters
              </h3>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Gravity: {gravity} m/s²</label>
                <input
                  type="range"
                  min="1.6"
                  max="24.7"
                  step="0.1"
                  value={gravity}
                  onChange={(e) => setGravity(parseFloat(e.target.value))}
                  className="w-full accent-purple-700 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Length: {(length / 100).toFixed(2)} m</label>
                <input
                  type="range"
                  min="60"
                  max="240"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full accent-purple-700 cursor-pointer"
                />
              </div>

              <div className="bg-[#FAF3EC] p-3 rounded-xl border border-[#EEDCD0] text-xs font-bold text-slate-800 space-y-1">
                <p>⏱️ <strong>Calculated Period (T):</strong> {periodSec} s</p>
                <p>🔮 <strong>Formula:</strong> T = 2π × √(L / g)</p>
              </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl border-2 border-[#EEDCD0] shadow-xl overflow-hidden flex items-center justify-center p-2 min-h-[380px]">
              <canvas ref={pendulumCanvasRef} width={650} height={420} className="w-full h-full object-contain bg-slate-50 rounded-xl" />
            </div>
          </div>
        )}

        {/* Tab 2: Projectile Cannon */}
        {activeTab === 'projectile' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-80 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                Cannon Launch Trajectory
              </h3>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Launch Angle: {projAngle}°</label>
                <input
                  type="range"
                  min="5"
                  max="85"
                  value={projAngle}
                  onChange={(e) => setProjAngle(parseInt(e.target.value))}
                  className="w-full accent-purple-700 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-800">Initial Velocity: {projVelocity} m/s</label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={projVelocity}
                  onChange={(e) => setProjVelocity(parseInt(e.target.value))}
                  className="w-full accent-purple-700 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl border-2 border-[#EEDCD0] shadow-xl overflow-hidden flex items-center justify-center p-2 min-h-[380px]">
              <canvas ref={projCanvasRef} width={650} height={420} className="w-full h-full object-contain bg-slate-50 rounded-xl" />
            </div>
          </div>
        )}

        {/* Tab 3: Ohm's Law Circuit */}
        {activeTab === 'ohms' && (
          <div className="flex-1 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-6 shadow-xl flex flex-col items-center justify-center space-y-6">
            <h2 className="text-xl font-black text-slate-950 font-heading">Ohm's Law Simulator (V = I × R)</h2>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-xl">
              <div className="flex-1 bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0] space-y-2">
                <label className="text-xs font-black text-slate-900 font-heading">Battery Voltage (V): {voltage} V</label>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={voltage}
                  onChange={(e) => setVoltage(parseInt(e.target.value))}
                  className="w-full accent-purple-700 cursor-pointer"
                />
              </div>

              <div className="flex-1 bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0] space-y-2">
                <label className="text-xs font-black text-slate-900 font-heading">Resistor Value (R): {resistance} Ω</label>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={resistance}
                  onChange={(e) => setResistance(parseInt(e.target.value))}
                  className="w-full accent-purple-700 cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-slate-900 text-white p-6 rounded-3xl border-2 border-purple-500 shadow-2xl text-center space-y-2 w-full max-w-md">
              <span className="text-xs font-bold text-slate-400">Calculated Current (I):</span>
              <h2 className="text-4xl font-black text-emerald-400 font-heading">{current} Amperes</h2>
              <p className="text-xs text-amber-300 font-bold">Formula: I = V / R = {voltage}V / {resistance}Ω</p>
            </div>
          </div>
        )}

        {/* Tab 4: Chemistry pH Scale */}
        {activeTab === 'ph' && (
          <div className="flex-1 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-6 shadow-xl flex flex-col items-center justify-center space-y-6">
            <h2 className="text-xl font-black text-slate-950 font-heading">Acid-Base Titration & pH Indicator Lab</h2>
            
            <div className="w-full max-w-md bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0] space-y-2">
              <div className="flex justify-between text-xs font-black font-heading">
                <span>Solution pH Scale:</span>
                <span className="text-purple-700 text-base">{phValue.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                step="0.1"
                value={phValue}
                onChange={(e) => setPhValue(parseFloat(e.target.value))}
                className="w-full accent-purple-700 cursor-pointer"
              />
            </div>

            <div
              className="w-64 h-64 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-300 border-4 border-white"
              style={{ backgroundColor: getPhColor(phValue) }}
            >
              <Beaker className="w-12 h-12 mb-2 animate-bounce" />
              <span className="text-3xl font-black font-heading">pH {phValue.toFixed(1)}</span>
              <span className="text-xs font-extrabold mt-1">
                {phValue < 7 ? 'ACIDIC SOLUTION' : phValue === 7 ? 'NEUTRAL WATER' : 'BASIC / ALKALINE'}
              </span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
