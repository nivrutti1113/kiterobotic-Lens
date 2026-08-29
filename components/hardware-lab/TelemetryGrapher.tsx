'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Activity, Play, Pause, RotateCcw, Sliders, Zap, HardDrive, AlertTriangle } from 'lucide-react';
import { webSerialBridge, SerialStatus } from '@/lib/web-serial';

export const TelemetryGrapher: React.FC = () => {
  const [status, setStatus] = useState<SerialStatus>(webSerialBridge.getStatus());
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [baudRate, setBaudRate] = useState(115200);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const unsubStatus = webSerialBridge.subscribeStatus((newStatus) => {
      setStatus(newStatus);
    });

    const unsubData = webSerialBridge.subscribeData((chunk) => {
      if (isPaused) return;

      // Extract raw numbers from real hardware telemetry stream
      const matches = chunk.match(/-?\d+(\.\d+)?/g);
      if (matches) {
        const nums = matches.map(Number).filter((n) => !isNaN(n) && n >= -500 && n <= 500);
        if (nums.length > 0) {
          setDataPoints((prev) => [...prev.slice(-100), ...nums].slice(-100));
        }
      }
    });

    return () => {
      unsubStatus();
      unsubData();
    };
  }, [isPaused]);

  // Render Canvas Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (dataPoints.length < 2) return;

    // Plot Data Waveform
    const maxVal = Math.max(...dataPoints, 50);
    const minVal = Math.min(...dataPoints, 0);
    const range = maxVal - minVal || 1;

    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;

    const stepX = width / (dataPoints.length - 1);

    dataPoints.forEach((val, i) => {
      const x = i * stepX;
      const normalized = (val - minVal) / range;
      const y = height - 20 - normalized * (height - 40);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    // Gradient Fill Under Line
    ctx.lineTo((dataPoints.length - 1) * stepX, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
    ctx.fillStyle = grad;
    ctx.fill();

  }, [dataPoints]);

  const handleConnect = async () => {
    await webSerialBridge.connect(baudRate);
  };

  const currentVal = dataPoints.length > 0 ? dataPoints[dataPoints.length - 1] : 0;
  const maxVal = dataPoints.length > 0 ? Math.max(...dataPoints) : 0;
  const minVal = dataPoints.length > 0 ? Math.min(...dataPoints) : 0;
  const avgVal = dataPoints.length > 0 ? (dataPoints.reduce((a, b) => a + b, 0) / dataPoints.length) : 0;

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center">
            <Activity className="w-5 h-5 text-sky-400 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
              <span>Live Serial Telemetry & Oscilloscope</span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                status.connected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}>
                {status.connected ? 'HARDWARE ACTIVE' : 'DISCONNECTED'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Real-time WebSerial high-speed graphing of incoming hardware ADC sensor signals and telemetry streams.
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Baud Rate Selector */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span className="text-slate-400">Baud:</span>
            <select
              value={baudRate}
              onChange={(e) => setBaudRate(Number(e.target.value))}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              <option value={115200} className="bg-slate-900">115200</option>
              <option value={9600} className="bg-slate-900">9600</option>
              <option value={57600} className="bg-slate-900">57600</option>
            </select>
          </div>

          {/* Connect / Disconnect */}
          <button
            onClick={status.connected ? () => webSerialBridge.disconnect() : handleConnect}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold shadow-lg transition-all ${
              status.connected
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                : 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 shadow-sky-500/20'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{status.connected ? 'Disconnect USB' : 'Connect WebSerial USB ⚡'}</span>
          </button>

          {/* Pause Stream */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            disabled={!status.connected}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors disabled:opacity-40"
            title={isPaused ? 'Resume Telemetry Stream' : 'Pause Telemetry Stream'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Clear Graph */}
          <button
            onClick={() => setDataPoints([])}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Clear Data Buffer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl p-4 flex flex-col justify-between">
        
        {/* Canvas Element */}
        <canvas
          ref={canvasRef}
          width={800}
          height={280}
          className="w-full h-full rounded-xl object-cover"
        />

        {/* Disconnected Notice Overlay */}
        {!status.connected && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 text-xs text-slate-400 space-y-3 z-10">
            <AlertTriangle className="w-10 h-10 text-amber-400 animate-pulse" />
            <h4 className="text-sm font-bold text-slate-100">No Active USB Serial Stream Connected</h4>
            <p className="max-w-md text-slate-400">
              Click <strong>"Connect WebSerial USB"</strong> above to pair your physical micro-controller (Arduino, ESP32, Pico) and start plotting live ADC & sensor signals.
            </p>
          </div>
        )}

        {/* Real-Time Live Readout Badges */}
        {status.connected && (
          <div className="absolute top-6 right-6 flex items-center gap-3">
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-500/30 text-xs font-mono">
              <span className="text-slate-400 text-[10px] uppercase block">Current Readout</span>
              <span className="text-sky-400 font-bold text-sm">{currentVal.toFixed(2)}</span>
            </div>

            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 text-[10px] uppercase block">Peak Max</span>
              <span className="text-emerald-400 font-bold text-sm">{maxVal.toFixed(1)}</span>
            </div>

            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-400 text-[10px] uppercase block">Average</span>
              <span className="text-purple-400 font-bold text-sm">{avgVal.toFixed(1)}</span>
            </div>
          </div>
        )}

      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-2 border-t border-slate-900 font-mono">
        <span className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-sky-400" />
          <span>Active USB Serial Port: {status.portName || 'Disconnected'}</span>
        </span>
        <span>Buffer Data Stream: {dataPoints.length} / 100 samples</span>
      </div>

    </div>
  );
};
