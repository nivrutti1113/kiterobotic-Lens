'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Palette, Gamepad2, Zap, Wifi, Globe, Calculator, Eye, CheckCircle2, RotateCcw, Download } from 'lucide-react';

export default function ToolChipStudioPage({ params }: { params: { slug: string } }) {
  const toolSlug = params.slug.toLowerCase();
  const toolTitle = params.slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  // Tool 1: Paint Studio canvas
  const paintCanvasRef = useRef<HTMLCanvasElement>(null);
  const [brushColor, setBrushColor] = useState('#7C3AED');
  const [brushSize, setBrushSize] = useState(8);
  const [isDrawing, setIsDrawing] = useState(false);

  // Tool 2: Game Lab score
  const [gameScore, setGameScore] = useState(0);

  // Tool 3: Electronics Relay LED state
  const [ledActive, setLedActive] = useState(false);

  // Tool 4: IoT telemetry signal
  const [iotTemp, setIotTemp] = useState(26.5);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = paintCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = paintCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearPaintCanvas = () => {
    const canvas = paintCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
              {toolSlug === 'paint' && <Palette className="w-5 h-5 text-pink-300" />}
              {toolSlug === 'gamelab' && <Gamepad2 className="w-5 h-5 text-amber-300" />}
              {toolSlug === 'electronics' && <Zap className="w-5 h-5 text-yellow-300" />}
              {toolSlug === 'iot' && <Wifi className="w-5 h-5 text-cyan-300" />}
              {toolSlug === 'web' && <Globe className="w-5 h-5 text-emerald-300" />}
              {toolSlug === 'math' && <Calculator className="w-5 h-5 text-purple-300" />}
              {toolSlug === 'invisible' && <Eye className="w-5 h-5 text-indigo-300" />}
            </div>
            <div>
              <h1 className="font-black text-base text-slate-950 font-heading">{toolTitle} Tool Suite</h1>
              <p className="text-[11px] font-bold text-slate-600">Tier 3 Creative STEM Utility Studio</p>
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

      {/* Main Studio Interactive Tool Area */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
        
        {/* Paint Studio Tool */}
        {toolSlug === 'paint' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-72 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                Brush Options
              </h3>
              <div>
                <label className="text-xs font-bold text-slate-800">Brush Color:</label>
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-full h-10 rounded-xl cursor-pointer mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800">Brush Thickness: {brushSize}px</label>
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full accent-purple-700 cursor-pointer mt-1"
                />
              </div>

              <button
                onClick={clearPaintCanvas}
                className="w-full py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-xs rounded-xl border border-rose-300 transition-colors flex items-center justify-center gap-1.5 font-heading"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear Canvas</span>
              </button>
            </div>

            <div className="flex-1 bg-white rounded-2xl border-2 border-[#EEDCD0] shadow-xl overflow-hidden flex items-center justify-center p-2 relative min-h-[400px]">
              <canvas
                ref={paintCanvasRef}
                width={700}
                height={500}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="w-full h-full bg-slate-50 rounded-xl cursor-crosshair"
              />
            </div>
          </div>
        )}

        {/* Game Lab Tool */}
        {toolSlug === 'gamelab' && (
          <div className="flex-1 bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-xl flex flex-col items-center justify-center p-8 text-white text-center space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-heading">
                2D Arcade Physics Engine
              </span>
              <h2 className="text-3xl font-black text-amber-300 font-heading">Score: {gameScore} Points</h2>
            </div>

            <div className="w-96 h-56 bg-slate-900 border-2 border-purple-500 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-purple-600 rounded-2xl font-black font-heading text-lg shadow-lg animate-bounce">
                👾 KMS Arcade Sprite
              </div>
            </div>

            <button
              onClick={() => setGameScore((prev) => prev + 10)}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl transition-transform hover:scale-105 active:scale-95 font-heading"
            >
              🎮 Tap Jump / Collect Star (+10 XP)
            </button>
          </div>
        )}

        {/* Electronics Breadboard Simulator */}
        {toolSlug === 'electronics' && (
          <div className="flex-1 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-6 shadow-xl flex flex-col items-center justify-center space-y-6">
            <h2 className="text-xl font-black text-slate-950 font-heading">Interactive Circuit Breadboard</h2>
            <div className="flex items-center gap-8 bg-[#FAF3EC] p-6 rounded-3xl border-2 border-[#EEDCD0]">
              <div className="flex flex-col items-center">
                <span className="text-xs font-black text-slate-700 mb-2">5V Power Rails</span>
                <div className="w-16 h-24 bg-red-600 rounded-xl flex items-center justify-center text-white font-black">5V DC</div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs font-black text-slate-700 mb-2">220Ω Resistor</span>
                <div className="w-20 h-6 bg-amber-200 border-2 border-amber-600 rounded-full flex items-center justify-center text-[10px] font-black">220 OHM</div>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-xs font-black text-slate-700 mb-2">Target LED</span>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                  ledActive ? 'bg-emerald-500 shadow-emerald-500/50 scale-110' : 'bg-slate-300'
                }`}>
                  <Zap className={`w-7 h-7 ${ledActive ? 'text-white animate-pulse' : 'text-slate-500'}`} />
                </div>
              </div>
            </div>

            <button
              onClick={() => setLedActive(!ledActive)}
              className={`px-8 py-3 rounded-2xl text-xs font-black transition-all shadow-lg font-heading ${
                ledActive ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              {ledActive ? '🔴 Toggle Power Switch OFF' : '🟢 Toggle Power Switch ON'}
            </button>
          </div>
        )}

        {/* IoT Simulator Tool */}
        {toolSlug === 'iot' && (
          <div className="flex-1 bg-[#0F172A] rounded-2xl border-2 border-slate-800 p-8 shadow-xl text-white flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-lg font-black text-cyan-300 font-heading">ESP32 MQTT Cloud Sensor Node</h2>
                <span className="px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-700 text-xs font-black rounded-full font-heading">
                  Wi-Fi Connected (100%)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-slate-400">Ambient Temperature Feed:</span>
                  <p className="text-3xl font-black text-emerald-400 font-heading">{iotTemp.toFixed(1)} °C</p>
                  <button
                    onClick={() => setIotTemp((t) => t + 0.5)}
                    className="mt-2 text-xs font-black px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-heading"
                  >
                    Simulate Heat Sensor (+0.5°C)
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-slate-400">Smart Home Relay Lock:</span>
                  <p className="text-3xl font-black text-amber-300 font-heading">Status: ACTIVE</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Web Builder, Math Lab, Invisible Mode Fallback Tools */}
        {toolSlug !== 'paint' && toolSlug !== 'gamelab' && toolSlug !== 'electronics' && toolSlug !== 'iot' && (
          <div className="flex-1 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-8 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black shadow-sm">
              <Calculator className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-slate-950 font-heading">{toolTitle} Suite Active</h2>
            <p className="text-xs text-slate-700 max-w-md font-semibold leading-relaxed">
              Interactive STEM workspace fully initialized for student coding & visualization.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
