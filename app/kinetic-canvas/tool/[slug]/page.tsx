'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ToolProjectsCatalog, ToolCatalogItem, ProjectItem } from '@/lib/tool-projects-catalog';
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
  Plus,
  CheckCircle,
  ExternalLink,
  Layers,
  Award,
  Grid,
  Clock,
  Send,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function ToolChipStudioPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeProjectId = searchParams.get('project');

  const toolSlug = params.slug.toLowerCase();
  const toolData: ToolCatalogItem = ToolProjectsCatalog.getTool(toolSlug) || ToolProjectsCatalog.TOOLS.paint;
  const activeProject = toolData.projects.find((p) => p.id === activeProjectId) || null;

  // -------------------------------------------------------------
  // Tool 1: Paint Studio State
  // -------------------------------------------------------------
  const paintCanvasRef = useRef<HTMLCanvasElement>(null);
  const [brushColor, setBrushColor] = useState('#7C3AED');
  const [brushSize, setBrushSize] = useState(8);
  const [isDrawing, setIsDrawing] = useState(false);
  const [pixelGridData, setPixelGridData] = useState<string[]>(Array(256).fill('#FFFFFF'));

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

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (activeProject?.initialData?.mode === 'symmetry') {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.moveTo(2 * centerX - x, y);
      ctx.lineTo(2 * centerX - x, y);
      ctx.stroke();
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearPaintCanvas = () => {
    const canvas = paintCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // -------------------------------------------------------------
  // Tool 2: Game Lab State & Engine
  // -------------------------------------------------------------
  const gameCanvasRef = useRef<HTMLCanvasElement>(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(true);
  const [memoryCards, setMemoryCards] = useState<Array<{ id: number; icon: string; flipped: boolean; matched: boolean }>>([
    { id: 1, icon: '🤖', flipped: false, matched: false },
    { id: 2, icon: '🤖', flipped: false, matched: false },
    { id: 3, icon: '🚀', flipped: false, matched: false },
    { id: 4, icon: '🚀', flipped: false, matched: false },
    { id: 5, icon: '⚡', flipped: false, matched: false },
    { id: 6, icon: '⚡', flipped: false, matched: false },
    { id: 7, icon: '🎮', flipped: false, matched: false },
    { id: 8, icon: '🎮', flipped: false, matched: false },
  ]);

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
    if (toolSlug !== 'gamelab' || !activeProject) return;

    let animId: number;
    const canvas = gameCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gravity = 0.55;

    const loop = () => {
      if (gameRunning && activeProject.id === 'platformer') {
        const state = gameStateRef.current;
        state.playerVy += gravity;
        state.playerY += state.playerVy;
        state.isGrounded = false;

        state.platforms.forEach((plat) => {
          if (
            state.playerX + 32 > plat.x &&
            state.playerX < plat.x + plat.width &&
            state.playerY + 32 >= plat.y &&
            state.playerY + 32 <= plat.y + 16 &&
            state.playerVy >= 0
          ) {
            state.playerY = plat.y - 32;
            state.playerVy = 0;
            state.isGrounded = true;
          }
        });

        state.stars.forEach((star) => {
          if (!star.collected) {
            const dist = Math.hypot(state.playerX + 16 - star.x, state.playerY + 16 - star.y);
            if (dist < 26) {
              star.collected = true;
              setGameScore((s) => s + 10);
            }
          }
        });

        if (state.stars.every((s) => s.collected)) {
          state.stars.forEach((s) => (s.collected = false));
        }

        ctx.fillStyle = '#0F172A';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#6D28D9';
        state.platforms.forEach((p) => ctx.fillRect(p.x, p.y, p.width, p.height));

        state.stars.forEach((star) => {
          if (!star.collected) {
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.arc(star.x, star.y, 8, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        ctx.fillStyle = '#10B981';
        ctx.fillRect(state.playerX, state.playerY, 32, 32);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [toolSlug, activeProject, gameRunning]);

  // -------------------------------------------------------------
  // Tool 3: Electronics Simulator State
  // -------------------------------------------------------------
  const [elecSwitchOn, setElecSwitchOn] = useState(false);
  const [hasResistor, setHasResistor] = useState(true);
  const [elecVoltage, setElecVoltage] = useState(5.0);
  const [rgbRed, setRgbRed] = useState(255);
  const [rgbGreen, setRgbGreen] = useState(128);
  const [rgbBlue, setRgbBlue] = useState(0);
  const [trafficLightStep, setTrafficLightStep] = useState<'red' | 'yellow' | 'green'>('red');
  const [potentiometerVal, setPotentiometerVal] = useState(5000); // 0-10k ohms

  const resistanceVal = hasResistor ? 220 : 0.1;
  const currentAmp = elecSwitchOn ? elecVoltage / (resistanceVal + potentiometerVal / 50) : 0;
  const currentmA = (currentAmp * 1000).toFixed(1);
  const powermW = (elecVoltage * currentAmp * 1000).toFixed(1);

  const isShortCircuit = elecSwitchOn && !hasResistor && activeProject?.id === 'led_resistor_button';
  const isCircuitActive = elecSwitchOn && (hasResistor || activeProject?.id !== 'led_resistor_button');

  // Traffic Light Sequencer loop
  useEffect(() => {
    if (toolSlug !== 'electronics' || activeProject?.id !== 'traffic_light' || !elecSwitchOn) return;
    const interval = setInterval(() => {
      setTrafficLightStep((prev) => (prev === 'red' ? 'green' : prev === 'green' ? 'yellow' : 'red'));
    }, 2000);
    return () => clearInterval(interval);
  }, [toolSlug, activeProject, elecSwitchOn]);

  // -------------------------------------------------------------
  // Tool 4: IoT Telemetry Streams
  // -------------------------------------------------------------
  const [iotSensorFeed, setIotSensorFeed] = useState<number>(25.4);
  const [iotHistory, setIotHistory] = useState<number[]>([22, 23, 24, 25.4]);
  const [relayLocked, setRelayLocked] = useState<boolean>(true);
  const [iotStreamActive, setIotStreamActive] = useState<boolean>(true);

  useEffect(() => {
    if (toolSlug !== 'iot' || !activeProject || !iotStreamActive) return;

    const interval = setInterval(() => {
      setIotSensorFeed((prev) => {
        let noise = (Math.random() - 0.5) * 0.5;
        let next = parseFloat((prev + noise).toFixed(1));
        if (activeProject.id === 'plant_watering') next = Math.max(5, Math.min(95, next));
        if (activeProject.id === 'street_light') next = Math.max(10, Math.min(1000, next + noise * 20));
        setIotHistory((hist) => [...hist.slice(-14), next]);
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [toolSlug, activeProject, iotStreamActive]);

  // -------------------------------------------------------------
  // Tool 5: Web Builder Inputs
  // -------------------------------------------------------------
  const [webHeading, setWebHeading] = useState('My STEM Robotics Portfolio');
  const [webSubheading, setSubheading] = useState('Building future AI and robotics solutions with Kite Robotics.');

  // -------------------------------------------------------------
  // Tool 6: Math Lab Inputs & Graphs
  // -------------------------------------------------------------
  const [mathSlope, setMathSlope] = useState(2);
  const [mathIntercept, setMathIntercept] = useState(1);
  const [polyWidth, setPolyWidth] = useState(8);
  const [polyHeight, setPolyHeight] = useState(5);
  const [diceRolls, setDiceRolls] = useState<number[]>([]);

  const handleRollDice = (count: number) => {
    const newRolls = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
    setDiceRolls((prev) => [...prev, ...newRolls]);
  };

  // -------------------------------------------------------------
  // Tool 7: Invisible Focus Mode State
  // -------------------------------------------------------------
  const [focusTimerSeconds, setFocusTimerSeconds] = useState(600); // 10 minutes
  const [focusTimerActive, setFocusTimerActive] = useState(false);

  useEffect(() => {
    if (toolSlug !== 'invisible' || !focusTimerActive) return;
    const timer = setInterval(() => {
      setFocusTimerSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [toolSlug, focusTimerActive]);

  // Select project handler
  const openProject = (projId: string) => {
    router.push(`/kinetic-canvas/tool/${toolSlug}?project=${projId}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF3EC] text-slate-900 flex flex-col font-sans select-none">
      
      {/* TOOL HEADER BAR */}
      <header className="bg-[#FFFDF9] border-b-2 border-[#EEDCD0] px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          {activeProject ? (
            <button
              onClick={() => router.push(`/kinetic-canvas/tool/${toolSlug}`)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-950 font-black text-xs transition-colors border border-purple-300 shadow-sm font-heading cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-purple-700" />
              <span>← Back to {toolData.title} Gallery</span>
            </button>
          ) : (
            <Link
              href="/kinetic-canvas"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-950 font-black text-xs transition-colors border border-purple-300 shadow-sm font-heading"
            >
              <ArrowLeft className="w-4 h-4 text-purple-700" />
              <span>← Back to Dashboard</span>
            </Link>
          )}

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#6C2EB5] text-white flex items-center justify-center font-black shadow-sm text-lg">
              {toolSlug === 'paint' && '🎨'}
              {toolSlug === 'gamelab' && '🎮'}
              {toolSlug === 'electronics' && '⚡'}
              {toolSlug === 'iot' && '📡'}
              {toolSlug === 'web' && '🌐'}
              {toolSlug === 'math' && '📐'}
              {toolSlug === 'invisible' && '👁️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base text-slate-950 font-heading">
                  {toolData.title} {activeProject ? `— ${activeProject.title}` : 'Gallery'}
                </h1>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
                  {toolData.projects.length} Activities
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-600">{toolData.subtitle}</p>
            </div>
          </div>
        </div>
      </header>

      {/* VIEW A: LANDING / GALLERY GRID (When no project is selected) */}
      {!activeProject && (
        <div className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
          
          <div className="bg-[#FFFDF9] rounded-3xl p-6 border-2 border-[#EEDCD0] shadow-md flex items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-black text-slate-950 font-heading">Choose a {toolData.title} Template</h2>
              <p className="text-xs text-slate-600 font-bold mt-1 max-w-2xl">{toolData.description}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-2xl">
              <Sparkles className="w-5 h-5 text-[#6C2EB5]" />
              <span className="text-xs font-black text-[#6C2EB5] font-heading">Interactive STEM Suite</span>
            </div>
          </div>

          {/* 6+ Project Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {toolData.projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => openProject(proj.id)}
                className="bg-[#FFFDF9] hover:bg-white rounded-3xl border-2 border-[#EEDCD0] hover:border-purple-500 p-5 shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      {proj.icon}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-wider font-heading">
                        {proj.tag}
                      </span>
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        proj.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        proj.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-900 border-amber-200' :
                        'bg-purple-50 text-purple-900 border-purple-200'
                      }`}>
                        {proj.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-slate-950 font-heading group-hover:text-[#6C2EB5] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold mt-1.5 leading-relaxed">
                    {proj.description}
                  </p>
                </div>

                <button className="mt-5 w-full py-2.5 bg-purple-50 group-hover:bg-[#6C2EB5] text-[#6C2EB5] group-hover:text-white font-black text-xs rounded-xl border border-purple-200 group-hover:border-purple-600 transition-all flex items-center justify-center gap-1.5 font-heading">
                  <span>🚀 Open Activity</span>
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* VIEW B: ACTIVE PROJECT INSTANCE (When project card is selected) */}
      {activeProject && (
        <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
          
          {/* TOOL 1: PAINT STUDIO INSTANCE */}
          {toolSlug === 'paint' && (
            <div className="flex-1 flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-72 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
                <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                  {activeProject.title} Tools
                </h3>

                {activeProject.initialData?.mode !== 'pixel' && (
                  <>
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
                  </>
                )}

                {activeProject.initialData?.mode === 'pixel' && (
                  <div>
                    <label className="text-xs font-bold text-slate-800">Active Pixel Color:</label>
                    <div className="flex gap-2 mt-2">
                      {['#7C3AED', '#EF4444', '#10B981', '#F59E0B', '#3B82F6', '#FFFFFF', '#000000'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setBrushColor(c)}
                          className={`w-7 h-7 rounded-full border-2 ${brushColor === c ? 'border-black scale-110' : 'border-slate-300'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={clearPaintCanvas}
                  className="w-full py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-xs rounded-xl border border-rose-300 transition-colors flex items-center justify-center gap-1.5 font-heading"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Canvas</span>
                </button>
              </div>

              <div className="flex-1 bg-white rounded-2xl border-2 border-[#EEDCD0] shadow-xl overflow-hidden flex items-center justify-center p-4 relative min-h-[400px]">
                {activeProject.initialData?.mode === 'pixel' ? (
                  <div className="grid grid-cols-16 gap-1 bg-slate-200 p-3 rounded-2xl border-2 border-slate-300">
                    {pixelGridData.map((color, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          const copy = [...pixelGridData];
                          copy[idx] = brushColor;
                          setPixelGridData(copy);
                        }}
                        className="w-6 h-6 rounded cursor-pointer border border-slate-300 shadow-2xs hover:scale-105 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                ) : (
                  <canvas
                    ref={paintCanvasRef}
                    width={700}
                    height={500}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-full bg-slate-50 rounded-xl cursor-crosshair border border-slate-200"
                  />
                )}
              </div>
            </div>
          )}

          {/* TOOL 2: GAME LAB INSTANCE */}
          {toolSlug === 'gamelab' && (
            <div className="flex-1 flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-72 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
                <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                  {activeProject.title} Desk
                </h3>
                <div className="bg-[#FAF3EC] p-3 rounded-xl border border-[#EEDCD0] space-y-1">
                  <span className="text-xs font-bold text-slate-600">Current Score:</span>
                  <p className="text-3xl font-black text-purple-700 font-heading">{gameScore} XP</p>
                </div>

                {activeProject.id === 'platformer' && (
                  <button
                    onClick={handlePlayerJump}
                    className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 font-heading"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>🎮 Jump (Space / Click)</span>
                  </button>
                )}

                <p className="text-xs text-slate-600 font-bold leading-relaxed">
                  {activeProject.description}
                </p>
              </div>

              <div className="flex-1 bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-xl overflow-hidden flex flex-col items-center justify-center p-3 relative min-h-[400px]">
                {activeProject.id === 'memory_match' ? (
                  <div className="grid grid-cols-4 gap-4 p-6 bg-slate-900 rounded-2xl border border-slate-800 max-w-md w-full">
                    {memoryCards.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => {
                          setMemoryCards((cards) =>
                            cards.map((c) => (c.id === card.id ? { ...c, flipped: !c.flipped } : c))
                          );
                        }}
                        className={`h-24 rounded-2xl flex items-center justify-center text-3xl font-black cursor-pointer transition-all ${
                          card.flipped ? 'bg-purple-600 text-white rotate-y-180' : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {card.flipped ? card.icon : '❓'}
                      </div>
                    ))}
                  </div>
                ) : (
                  <canvas
                    ref={gameCanvasRef}
                    width={800}
                    height={300}
                    onClick={handlePlayerJump}
                    className="w-full h-full object-contain cursor-pointer rounded-xl"
                  />
                )}
              </div>
            </div>
          )}

          {/* TOOL 3: ELECTRONICS INSTANCE */}
          {toolSlug === 'electronics' && (
            <div className="flex-1 flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-80 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
                <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                  {activeProject.title} Controls
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

                {activeProject.id === 'rgb_mixer' && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-bold text-rose-700">Red Channel: {rgbRed}</label>
                      <input type="range" min="0" max="255" value={rgbRed} onChange={(e) => setRgbRed(parseInt(e.target.value))} className="w-full accent-rose-600" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-emerald-700">Green Channel: {rgbGreen}</label>
                      <input type="range" min="0" max="255" value={rgbGreen} onChange={(e) => setRgbGreen(parseInt(e.target.value))} className="w-full accent-emerald-600" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-blue-700">Blue Channel: {rgbBlue}</label>
                      <input type="range" min="0" max="255" value={rgbBlue} onChange={(e) => setRgbBlue(parseInt(e.target.value))} className="w-full accent-blue-600" />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setElecSwitchOn(!elecSwitchOn)}
                  className={`w-full py-3 rounded-xl font-black text-xs shadow-md transition-all font-heading ${
                    elecSwitchOn ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {elecSwitchOn ? '🔴 Open Switch (Power OFF)' : '🟢 Close Switch (Power ON)'}
                </button>

                <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current (I):</span>
                    <span className="text-emerald-400 font-bold">{currentmA} mA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Power (P):</span>
                    <span className="text-purple-300 font-bold">{powermW} mW</span>
                  </div>
                </div>
              </div>

              {/* Breadboard Visual Studio */}
              <div className="flex-1 bg-slate-900 rounded-2xl border-2 border-slate-800 p-6 shadow-xl flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
                <div className="w-full max-w-xl bg-slate-100 rounded-3xl p-6 border-4 border-slate-300 shadow-2xl relative">
                  <div className="text-xs font-black text-slate-800 font-heading mb-4 text-center">
                    {activeProject.title.toUpperCase()} TERMINAL MATRIX
                  </div>

                  <div className="flex items-center justify-around py-4">
                    <div className="w-16 h-20 bg-red-600 rounded-xl text-white flex flex-col items-center justify-center font-black shadow-md text-xs">
                      <span>5V RAIL</span>
                      <span className="text-[10px] mt-1">{elecVoltage}V DC</span>
                    </div>

                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${
                        isCircuitActive ? 'bg-purple-600 scale-110 shadow-purple-500/80' : 'bg-slate-300'
                      }`}
                      style={{
                        backgroundColor: activeProject.id === 'rgb_mixer' && isCircuitActive ? `rgb(${rgbRed},${rgbGreen},${rgbBlue})` : undefined,
                      }}
                    >
                      <Zap className={`w-8 h-8 ${isCircuitActive ? 'text-white animate-pulse' : 'text-slate-500'}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 4: IOT SIMULATOR INSTANCE */}
          {toolSlug === 'iot' && (
            <div className="flex-1 flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-80 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
                <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                  {activeProject.title} Node
                </h3>

                <div className="bg-[#FAF3EC] p-3.5 rounded-xl border border-[#EEDCD0] space-y-1">
                  <span className="text-xs font-bold text-slate-600">Telemetry Feed:</span>
                  <p className="text-3xl font-black text-emerald-600 font-heading">{iotSensorFeed.toFixed(1)}</p>
                </div>

                <button
                  onClick={() => setRelayLocked(!relayLocked)}
                  className={`w-full py-3 rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 font-heading ${
                    relayLocked ? 'bg-purple-700 text-white' : 'bg-emerald-600 text-white'
                  }`}
                >
                  {relayLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  <span>Relay State: {relayLocked ? 'LOCKED' : 'UNLOCKED'}</span>
                </button>
              </div>

              <div className="flex-1 bg-slate-950 rounded-2xl border-2 border-slate-800 p-6 shadow-xl flex flex-col justify-between min-h-[400px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <h2 className="text-sm font-black text-cyan-300 font-heading">{activeProject.title} Stream</h2>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 font-bold">ONLINE</span>
                </div>

                <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800 h-48 flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
                    <polyline
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="3"
                      points={iotHistory
                        .map((val, idx) => `${(idx / 14) * 300},${100 - (val / 100) * 100}`)
                        .join(' ')}
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 5: WEB BUILDER INSTANCE */}
          {toolSlug === 'web' && (
            <div className="flex-1 flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-80 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
                <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                  {activeProject.title} Editor
                </h3>
                <div>
                  <label className="text-xs font-bold text-slate-800">Heading Title:</label>
                  <input
                    type="text"
                    value={webHeading}
                    onChange={(e) => setWebHeading(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-800">Subheading Description:</label>
                  <textarea
                    value={webSubheading}
                    onChange={(e) => setSubheading(e.target.value)}
                    className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold mt-1 h-20"
                  />
                </div>
              </div>

              <div className="flex-1 bg-white rounded-2xl border-2 border-slate-300 p-8 shadow-xl overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="bg-purple-700 text-white p-8 rounded-3xl shadow-lg">
                    <h1 className="text-3xl font-black font-heading">{webHeading}</h1>
                    <p className="text-sm font-bold mt-2 text-purple-200">{webSubheading}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-100 rounded-2xl font-bold text-xs text-slate-700">🚀 Feature Block 1</div>
                    <div className="p-4 bg-slate-100 rounded-2xl font-bold text-xs text-slate-700">🤖 Feature Block 2</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 6: MATH LAB INSTANCE */}
          {toolSlug === 'math' && (
            <div className="flex-1 flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-80 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
                <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
                  {activeProject.title} Parameters
                </h3>

                {activeProject.id === 'function_grapher' && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-800">Slope m: {mathSlope}</label>
                      <input type="range" min="-5" max="5" value={mathSlope} onChange={(e) => setMathSlope(parseInt(e.target.value))} className="w-full accent-purple-700" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-800">Intercept c: {mathIntercept}</label>
                      <input type="range" min="-10" max="10" value={mathIntercept} onChange={(e) => setMathIntercept(parseInt(e.target.value))} className="w-full accent-purple-700" />
                    </div>
                  </>
                )}

                {activeProject.id === 'geometry_explorer' && (
                  <div className="space-y-2 text-xs font-bold">
                    <p>Width: {polyWidth} units</p>
                    <p>Height: {polyHeight} units</p>
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-950 border border-purple-200">
                      <p>Area (A) = {polyWidth * polyHeight} sq units</p>
                      <p>Perimeter (P) = {2 * (polyWidth + polyHeight)} units</p>
                    </div>
                  </div>
                )}

                {activeProject.id === 'probability_sim' && (
                  <button
                    onClick={() => handleRollDice(10)}
                    className="w-full py-2.5 bg-purple-700 text-white font-black text-xs rounded-xl shadow"
                  >
                    🎲 Roll Dice 10 Times
                  </button>
                )}
              </div>

              <div className="flex-1 bg-white rounded-2xl border-2 border-slate-300 p-6 shadow-xl flex items-center justify-center">
                {activeProject.id === 'function_grapher' ? (
                  <svg className="w-full h-80 border border-slate-200 rounded-xl bg-slate-50" viewBox="-10 -10 20 20">
                    <line x1="-10" y1="0" x2="10" y2="0" stroke="#CBD5E1" strokeWidth="0.5" />
                    <line x1="0" y1="-10" x2="0" y2="10" stroke="#CBD5E1" strokeWidth="0.5" />
                    <line x1="-10" y1={-10 * mathSlope + mathIntercept} x2="10" y2={10 * mathSlope + mathIntercept} stroke="#7C3AED" strokeWidth="1" />
                  </svg>
                ) : (
                  <div className="text-center font-bold text-slate-700">
                    <p className="text-xl text-[#6C2EB5] font-heading font-black">{activeProject.title} Visualizer Active</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TOOL 7: INVISIBLE FOCUS MODE INSTANCE */}
          {toolSlug === 'invisible' && (
            <div className="flex-1 bg-slate-950 text-white rounded-2xl border-2 border-slate-800 p-8 shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
              <Eye className="w-12 h-12 text-indigo-400 animate-pulse" />
              <h2 className="text-2xl font-black font-heading text-indigo-300">{activeProject.title} Focus Active</h2>
              <div className="text-5xl font-mono font-black text-amber-400 bg-slate-900 px-8 py-4 rounded-3xl border border-slate-800">
                {Math.floor(focusTimerSeconds / 60)}:{(focusTimerSeconds % 60).toString().padStart(2, '0')}
              </div>
              <button
                onClick={() => setFocusTimerActive(!focusTimerActive)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow font-heading"
              >
                {focusTimerActive ? 'PAUSE FOCUS TIMER' : 'START FOCUS TIMER'}
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
