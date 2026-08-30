'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Activity, RotateCcw, Sliders, Zap, AlertTriangle, Download } from 'lucide-react';
import { webSerialBridge, SerialStatus } from '@/lib/web-serial';

export const TelemetryGrapher: React.FC = () => {
  const [status, setStatus] = useState<SerialStatus>(webSerialBridge.getStatus());
  const [ch1Data, setCh1Data] = useState<number[]>([]);
  const [ch2Data, setCh2Data] = useState<number[]>([]);
  const [ch3Data, setCh3Data] = useState<number[]>([]);
  
  const [isPaused] = useState(false);
  const [baudRate, setBaudRate] = useState(115200);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const unsubStatus = webSerialBridge.subscribeStatus((newStatus) => {
      setStatus(newStatus);
    });

    const unsubData = webSerialBridge.subscribeData((chunk) => {
      if (isPaused) return;

      const matches = chunk.match(/-?\d+(\.\d+)?/g);
      if (matches) {
        const nums = matches.map(Number).filter((n) => !isNaN(n));
        if (nums.length >= 1) setCh1Data((prev) => [...prev.slice(-100), nums[0]].slice(-100));
        if (nums.length >= 2) setCh2Data((prev) => [...prev.slice(-100), nums[1]].slice(-100));
        if (nums.length >= 3) setCh3Data((prev) => [...prev.slice(-100), nums[3]].slice(-100));
      }
    });

    return () => {
      unsubStatus();
      unsubData();
    };
  }, [isPaused]);

  // Render Multi-Channel Canvas Oscilloscope Chart
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

    const drawChannel = (data: number[], color: string) => {
      if (data.length < 2) return;
      const maxVal = Math.max(...data, 100);
      const minVal = Math.min(...data, 0);
      const range = maxVal - minVal || 1;

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      const stepX = width / (data.length - 1);
      data.forEach((val, i) => {
        const x = i * stepX;
        const normalized = (val - minVal) / range;
        const y = height - 20 - normalized * (height - 40);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    drawChannel(ch1Data, '#38bdf8'); // Ch1: Sonar Echo (Cyan)
    drawChannel(ch2Data, '#10b981'); // Ch2: PWM Motor (Emerald)
    drawChannel(ch3Data, '#f59e0b'); // Ch3: ADC Sensor (Amber)

  }, [ch1Data, ch2Data, ch3Data]);

  const handleConnect = async () => {
    await webSerialBridge.connect(baudRate);
  };

  const exportCSV = () => {
    const lines = ['Sample,Ch1_Sonar,Ch2_PWM,Ch3_ADC'];
    const maxLen = Math.max(ch1Data.length, ch2Data.length, ch3Data.length);
    for (let i = 0; i < maxLen; i++) {
      lines.push(`${i + 1},${ch1Data[i] || 0},${ch2Data[i] || 0},${ch3Data[i] || 0}`);
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kiterobotics_telemetry_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EEDCD0] flex flex-col gap-6 shadow-sm font-sans text-[#374151]">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEDCD0] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center">
            <Activity className="w-5 h-5 text-purple-700 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#111827] flex items-center gap-2 font-heading">
              <span>Multi-Channel WebSerial Oscilloscope & Spectrum</span>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black border font-heading ${
                status.connected ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-rose-100 text-rose-950 border-rose-300'
              }`}>
                {status.connected ? 'HARDWARE ACTIVE' : 'DISCONNECTED'}
              </span>
            </h2>
            <p className="text-xs text-[#374151] font-semibold">
              Simultaneous 3-Channel ADC, PWM, & Ultrasonic pulse timing analysis with CSV data export.
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-3 font-heading">
          
          <div className="flex items-center gap-2 bg-[#FAF3EC] border border-[#EEDCD0] rounded-xl px-3 py-1.5 text-xs font-black">
            <Sliders className="w-4 h-4 text-purple-700" />
            <span className="text-[#374151]">Baud:</span>
            <select
              value={baudRate}
              onChange={(e) => setBaudRate(Number(e.target.value))}
              className="bg-transparent text-[#111827] font-black focus:outline-none cursor-pointer"
            >
              <option value={115200} className="bg-white text-slate-900">115200</option>
              <option value={9600} className="bg-white text-slate-900">9600</option>
              <option value={57600} className="bg-white text-slate-900">57600</option>
            </select>
          </div>

          <button
            onClick={status.connected ? () => webSerialBridge.disconnect() : handleConnect}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all ${
              status.connected
                ? 'bg-rose-100 text-rose-950 border border-rose-300 hover:bg-rose-200'
                : 'bg-purple-700 hover:bg-purple-800 text-white shadow-md'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>{status.connected ? 'Disconnect USB' : 'Connect WebSerial USB ⚡'}</span>
          </button>

          <button
            onClick={exportCSV}
            className="p-2 rounded-xl bg-[#FAF3EC] border border-[#EEDCD0] text-purple-900 hover:bg-purple-100 transition-colors"
            title="Download CSV Telemetry Log"
          >
            <Download className="w-4 h-4 text-purple-700" />
          </button>

          <button
            onClick={() => {
              setCh1Data([]);
              setCh2Data([]);
              setCh3Data([]);
            }}
            className="p-2 rounded-xl bg-[#FAF3EC] border border-[#EEDCD0] text-slate-800 hover:bg-purple-100 transition-colors"
            title="Clear Data Buffer"
          >
            <RotateCcw className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-[#EEDCD0] shadow-xl p-4 flex flex-col justify-between">
        
        <canvas
          ref={canvasRef}
          width={800}
          height={280}
          className="w-full h-full rounded-xl object-cover"
        />

        {!status.connected && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 text-xs text-slate-300 space-y-3 z-10 font-semibold">
            <AlertTriangle className="w-10 h-10 text-amber-400 animate-pulse" />
            <h4 className="text-sm font-black text-white font-heading">No Active USB Serial Stream Connected</h4>
            <p className="max-w-md text-slate-300">
              Click <strong>"Connect WebSerial USB"</strong> above to pair your physical micro-controller (Arduino, ESP32, Pico) and start plotting live ADC & sensor signals.
            </p>
          </div>
        )}

        {/* Multi-Channel Color Legend Badges */}
        <div className="absolute top-6 left-6 flex items-center gap-3 font-mono text-[11px] font-bold">
          <span className="flex items-center gap-1.5 bg-slate-950/90 border border-sky-400/40 px-2.5 py-1 rounded-lg text-sky-300">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Ch1: Sonar Echo (µs)
          </span>
          <span className="flex items-center gap-1.5 bg-slate-950/90 border border-emerald-400/40 px-2.5 py-1 rounded-lg text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Ch2: PWM Motor (%)
          </span>
          <span className="flex items-center gap-1.5 bg-slate-950/90 border border-amber-400/40 px-2.5 py-1 rounded-lg text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Ch3: ADC Sensor
          </span>
        </div>

      </div>

    </div>
  );
};
