'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Palette,
  Gamepad2,
  Zap,
  Wifi,
  Globe,
  Calculator,
  Eye,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Lock,
  Unlock,
  Play,
  Pause,
  RefreshCw,
} from 'lucide-react';

export default function ToolChipStudioPage({ params }: { params: { slug: string } }) {
  const toolSlug = params.slug.toLowerCase();
  const toolTitle = params.slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase());

  // -------------------------------------------------------------
  // Tool 1: Paint Studio State
  // -------------------------------------------------------------
  const paintCanvasRef = useRef<HTMLCanvasElement>(null);
  const [brushColor, setBrushColor] = useState('#7C3AED');
  const [brushSize, setBrushSize] = useState(8);
  const [isDrawing, setIsDrawing] = useState(false);

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

  // -------------------------------------------------------------
  // Tool 2: Game Lab 2D Physics Arcade Engine
  // -------------------------------------------------------------
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(true);
  const [gameOverMsg, setGameOverMsg] = useState<string | null>(null);

  const gameStateRef = useRef({
    playerX: 60,
    playerY: 200,
    playerVy: 0,
    isGrounded: false,
    stars: [
      { x: 300, y: 160, collected: false },
      { x: 500, y: 120, collected: false },
      { x: 700, y: 180, collected: false },
    ],
    hazards: [{ x: 400, y: 250, width: 24, height: 24 }],
    platforms: [
      { x: 0, y: 270, width: 800, height: 30 },
      { x: 250, y: 200, width: 120, height: 16 },
      { x: 450, y: 160, width: 120, height: 16 },
    ],
  });

  const handlePlayerJump = () => {
    const state = gameStateRef.current;
    if (state.isGrounded) {
      state.playerVy = -11;
      state.isGrounded = false;
    }
  };

  useEffect(() => {
    if (toolSlug !== 'gamelab') return;

    let animId: number;
    const canvas = gameCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gravity = 0.55;

    const loop = () => {
      if (gameRunning) {
        const state = gameStateRef.current;

        // Apply Gravity
        state.playerVy += gravity;
        state.playerY += state.playerVy;
        state.isGrounded = false;

        // Platform collisions
        const playerWidth = 32;
        const playerHeight = 32;

        state.platforms.forEach((plat) => {
          if (
            state.playerX + playerWidth > plat.x &&
            state.playerX < plat.x + plat.width &&
            state.playerY + playerHeight >= plat.y &&
            state.playerY + playerHeight <= plat.y + 16 &&
            state.playerVy >= 0
          ) {
            state.playerY = plat.y - playerHeight;
            state.playerVy = 0;
            state.isGrounded = true;
          }
        });

        // Check Star Collectibles
        state.stars.forEach((star) => {
          if (!star.collected) {
            const dist = Math.hypot(state.playerX + 16 - star.x, state.playerY + 16 - star.y);
            if (dist < 26) {
              star.collected = true;
              setGameScore((s) => s + 10);
            }
          }
        });

        // Respawn stars if all collected
        if (state.stars.every((s) => s.collected)) {
          state.stars.forEach((s) => (s.collected = false));
        }

        // Render Canvas Frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sky & Background Grid
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid lines
        ctx.strokeStyle = '#1E293B';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        // Draw Platforms
        ctx.fillStyle = '#6D28D9';
        state.platforms.forEach((p) => {
          ctx.fillRect(p.x, p.y, p.width, p.height);
          ctx.strokeStyle = '#A78BFA';
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x, p.y, p.width, p.height);
        });

        // Draw Stars
        state.stars.forEach((star) => {
          if (!star.collected) {
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FDE68A';
            ctx.stroke();
          }
        });

        // Draw Player Sprite (KMS Robot)
        ctx.fillStyle = '#10B981';
        ctx.fillRect(state.playerX, state.playerY, 32, 32);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(state.playerX + 6, state.playerY + 6, 6, 6);
        ctx.fillRect(state.playerX + 20, state.playerY + 6, 6, 6);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [toolSlug, gameRunning]);

  // -------------------------------------------------------------
  // Tool 3: Electronics Breadboard Simulator with Current Flow
  // -------------------------------------------------------------
  const [elecSwitchOn, setElecSwitchOn] = useState(false);
  const [hasResistor, setHasResistor] = useState(true);
  const [elecVoltage, setElecVoltage] = useState(5.0); // Volts
  const resistanceVal = hasResistor ? 220 : 0.1; // Ohms
  const currentAmp = elecSwitchOn ? elecVoltage / resistanceVal : 0; // Amps
  const currentmA = (currentAmp * 1000).toFixed(1);
  const powermW = (elecVoltage * currentAmp * 1000).toFixed(1);

  const isShortCircuit = elecSwitchOn && !hasResistor;
  const isCircuitActive = elecSwitchOn && hasResistor;

  // -------------------------------------------------------------
  // Tool 4: IoT Telemetry Stream & Smart Home Lock
  // -------------------------------------------------------------
  const [iotTempFeed, setIotTempFeed] = useState<number>(25.4);
  const [tempHistory, setTempHistory] = useState<number[]>([25.0, 25.2, 25.4]);
  const [relayLocked, setRelayLocked] = useState<boolean>(true);
  const [iotStreamActive, setIotStreamActive] = useState<boolean>(true);

  useEffect(() => {
    if (toolSlug !== 'iot' || !iotStreamActive) return;

    const interval = setInterval(() => {
      setIotTempFeed((prev) => {
        const noise = (Math.random() - 0.5) * 0.4;
        const next = Math.max(18, Math.min(45, parseFloat((prev + noise).toFixed(1))));
        setTempHistory((hist) => [...hist.slice(-14), next]);
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [toolSlug, iotStreamActive]);

  const handleSimulateHeatSpike = () => {
    setIotTempFeed((t) => {
      const next = parseFloat((t + 4.5).toFixed(1));
      setTempHistory((hist) => [...hist.slice(-14), next]);
      return next;
    });
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
              <h1 className="font-black text-base text-slate-950 font-heading">{toolTitle} Suite</h1>
              <p className="text-[11px] font-bold text-slate-600">Tier 3 Creative STEM Utility Studio</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
        
        {/* Tool 1: Paint Studio */}
        {toolSlug === 'paint' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-72 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                Brush Controls
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
                <label className="text-xs font-bold text-slate-800">Thickness: {brushSize}px</label>
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

        {/* Tool 2: GameLab 2D Physics Arcade */}
        {toolSlug === 'gamelab' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-72 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                Arcade Control Desk
              </h3>
              <div className="bg-[#FAF3EC] p-3 rounded-xl border border-[#EEDCD0] space-y-1">
                <span className="text-xs font-bold text-slate-600">Current Score:</span>
                <p className="text-3xl font-black text-purple-700 font-heading">{gameScore} XP</p>
              </div>

              <button
                onClick={handlePlayerJump}
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-heading"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>🎮 Tap / Click to Jump!</span>
              </button>

              <p className="text-xs text-slate-600 font-bold leading-relaxed">
                Physics engine active: jump over platforms and collect yellow stars to earn XP!
              </p>
            </div>

            <div className="flex-1 bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-xl overflow-hidden flex flex-col items-center justify-center p-3 relative min-h-[400px]">
              <canvas
                ref={gameCanvasRef}
                width={800}
                height={300}
                onClick={handlePlayerJump}
                className="w-full h-full object-contain cursor-pointer rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Tool 3: Electronics Breadboard Simulator */}
        {toolSlug === 'electronics' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-80 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                Circuit Configuration
              </h3>

              <div>
                <label className="text-xs font-bold text-slate-800">Supply Voltage: {elecVoltage}V DC</label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={elecVoltage}
                  onChange={(e) => setElecVoltage(parseFloat(e.target.value))}
                  className="w-full accent-purple-700 cursor-pointer mt-1"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FAF3EC] rounded-xl border border-[#EEDCD0]">
                <span className="text-xs font-bold text-slate-900 font-heading">220Ω Resistor Installed:</span>
                <button
                  onClick={() => setHasResistor(!hasResistor)}
                  className={`px-3 py-1 rounded-lg text-xs font-black transition-colors font-heading ${
                    hasResistor ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  {hasResistor ? 'YES' : 'NO (Dangerous!)'}
                </button>
              </div>

              <button
                onClick={() => setElecSwitchOn(!elecSwitchOn)}
                className={`w-full py-3 rounded-xl font-black text-xs shadow-md transition-all font-heading ${
                  elecSwitchOn ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {elecSwitchOn ? '🔴 Open Switch (Power OFF)' : '🟢 Close Switch (Power ON)'}
              </button>

              {/* Circuit Readouts */}
              <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-1.5 font-mono text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current (I):</span>
                  <span className={isShortCircuit ? 'text-rose-400 font-bold animate-pulse' : 'text-emerald-400 font-bold'}>
                    {currentmA} mA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Power (P):</span>
                  <span className="text-purple-300 font-bold">{powermW} mW</span>
                </div>
              </div>

              {/* Validation Warning */}
              {isShortCircuit && (
                <div className="p-3 bg-rose-100 border border-rose-300 rounded-xl flex items-center gap-2 text-rose-950 text-xs font-black">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>SHORT CIRCUIT WARN: Missing Resistor will burn LED!</span>
                </div>
              )}
            </div>

            {/* Breadboard Visual Studio */}
            <div className="flex-1 bg-slate-900 rounded-2xl border-2 border-slate-800 p-6 shadow-xl flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
              <div className="w-full max-w-xl bg-slate-100 rounded-3xl p-6 border-4 border-slate-300 shadow-2xl relative">
                <div className="text-xs font-black text-slate-800 font-heading mb-4 text-center">
                  BREADBOARD TERMINAL STRIP MATRIX
                </div>

                <div className="flex items-center justify-around py-4">
                  {/* 5V Power Source */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-20 bg-red-600 rounded-xl text-white flex flex-col items-center justify-center font-black shadow-md">
                      <span className="text-xs">5V RAIL</span>
                      <span className="text-[10px] mt-1">{elecVoltage}V DC</span>
                    </div>
                  </div>

                  {/* Wire 1 */}
                  <div className="flex-1 h-1 bg-slate-300 relative mx-2">
                    {isCircuitActive && (
                      <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                    )}
                  </div>

                  {/* Toggle Switch */}
                  <div className="flex flex-col items-center">
                    <div
                      onClick={() => setElecSwitchOn(!elecSwitchOn)}
                      className={`w-14 h-14 rounded-2xl cursor-pointer flex flex-col items-center justify-center text-white font-black shadow-md transition-colors ${
                        elecSwitchOn ? 'bg-purple-600' : 'bg-slate-400'
                      }`}
                    >
                      <Zap className="w-5 h-5 mb-0.5" />
                      <span className="text-[9px]">{elecSwitchOn ? 'CLOSED' : 'OPEN'}</span>
                    </div>
                  </div>

                  {/* Wire 2 */}
                  <div className="flex-1 h-1 bg-slate-300 relative mx-2">
                    {isCircuitActive && (
                      <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                    )}
                  </div>

                  {/* Resistor */}
                  <div className="flex flex-col items-center">
                    {hasResistor ? (
                      <div className="w-16 h-8 bg-amber-200 border-2 border-amber-600 rounded-full flex items-center justify-center text-[10px] font-black text-amber-950 shadow-sm">
                        220 Ω
                      </div>
                    ) : (
                      <div className="w-16 h-8 border-2 border-dashed border-rose-500 rounded-full flex items-center justify-center text-[9px] font-black text-rose-600">
                        NONE
                      </div>
                    )}
                  </div>

                  {/* Wire 3 */}
                  <div className="flex-1 h-1 bg-slate-300 relative mx-2">
                    {isCircuitActive && (
                      <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />
                    )}
                  </div>

                  {/* Target LED */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${
                        isCircuitActive
                          ? 'bg-emerald-500 ring-8 ring-emerald-400/40 shadow-emerald-500/80 scale-110'
                          : isShortCircuit
                          ? 'bg-rose-600 ring-8 ring-rose-500/50 animate-bounce'
                          : 'bg-slate-300'
                      }`}
                    >
                      <Zap className={`w-8 h-8 ${isCircuitActive ? 'text-white animate-pulse' : 'text-slate-500'}`} />
                    </div>
                    <span className="text-[10px] font-black text-slate-800 mt-2 font-heading">
                      {isCircuitActive ? 'LED ON' : isShortCircuit ? 'OVERLOAD!' : 'LED OFF'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tool 4: IoT Tool Suite */}
        {toolSlug === 'iot' && (
          <div className="flex-1 flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-80 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
              <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                IoT Node Controller
              </h3>

              <div className="bg-[#FAF3EC] p-3.5 rounded-xl border border-[#EEDCD0] space-y-1">
                <span className="text-xs font-bold text-slate-600">Live Ambient Temp:</span>
                <p className="text-3xl font-black text-emerald-600 font-heading">{iotTempFeed.toFixed(1)} °C</p>
              </div>

              <button
                onClick={handleSimulateHeatSpike}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 font-heading"
              >
                <Sparkles className="w-4 h-4 text-purple-950" />
                <span>Simulate Heat Sensor (+4.5°C)</span>
              </button>

              <button
                onClick={() => setRelayLocked(!relayLocked)}
                className={`w-full py-3 rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 font-heading ${
                  relayLocked ? 'bg-purple-700 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {relayLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                <span>Smart Relay: {relayLocked ? 'LOCKED' : 'UNLOCKED'}</span>
              </button>

              <div className="flex items-center justify-between pt-2 border-t border-[#EEDCD0]">
                <span className="text-xs font-bold text-slate-700">Auto Sensor Stream:</span>
                <button
                  onClick={() => setIotStreamActive(!iotStreamActive)}
                  className={`px-3 py-1 rounded-lg text-xs font-black ${
                    iotStreamActive ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {iotStreamActive ? 'ACTIVE' : 'PAUSED'}
                </button>
              </div>
            </div>

            {/* IoT Live Sensor Chart & Telemetry Canvas */}
            <div className="flex-1 bg-slate-950 rounded-2xl border-2 border-slate-800 p-6 shadow-xl flex flex-col justify-between min-h-[400px]">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <h2 className="text-sm font-black text-cyan-300 font-heading">ESP32 Telemetry Sparkline</h2>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">Status: ONLINE</span>
                </div>

                {/* SVG Live Sensor Sparkline Chart */}
                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 h-48 flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
                    <polyline
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      points={tempHistory
                        .map((val, idx) => {
                          const x = (idx / 14) * 300;
                          const y = 100 - ((val - 18) / 27) * 100;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs font-mono">
                  <span className="text-slate-400">Relay Switch:</span>
                  <p className={`text-lg font-black mt-1 ${relayLocked ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {relayLocked ? 'RELAY CLOSED (LOCKED)' : 'RELAY OPEN (UNLOCKED)'}
                  </p>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs font-mono">
                  <span className="text-slate-400">Thermal Alarm:</span>
                  <p className={`text-lg font-black mt-1 ${iotTempFeed > 30 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
                    {iotTempFeed > 30 ? '⚠️ HIGH TEMP WARNING' : 'NORMAL (SAFE)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fallback Tools */}
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
