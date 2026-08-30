'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Zap, Cpu, Terminal, X, Send, Sliders, HardDrive, AlertTriangle, CheckCircle2, Bot, Play, Sparkles } from 'lucide-react';
import { webSerialBridge, SerialStatus } from '@/lib/web-serial';

interface HardwareDeployProps {
  code: string;
  isOpen: boolean;
  onClose: () => void;
}

export const HardwareDeploy: React.FC<HardwareDeployProps> = ({ code, isOpen, onClose }) => {
  const [flashing, setFlashing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [targetBoard, setTargetBoard] = useState<'esp32' | 'arduino' | 'pico'>('arduino');
  const [serialStatus, setSerialStatus] = useState<SerialStatus>(webSerialBridge.getStatus());

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-detect target microcontroller from code signature
  useEffect(() => {
    if (code.includes('setup()') || code.includes('#include') || code.includes('void loop()')) {
      setTargetBoard('arduino');
    } else if (code.includes('import ') || code.includes('machine.')) {
      setTargetBoard('esp32');
    }
  }, [code]);

  useEffect(() => {
    if (!isOpen) return;

    const initialStatus = webSerialBridge.getStatus();
    setSerialStatus(initialStatus);

    if (initialStatus.connected) {
      setStatusMsg('🔌 Robot Board is Connected & Ready! Click "Run My Robot" below.');
      setLogs((prev) => [...prev, `[ROBOT READY]: Connected to physical robot board via USB.`]);
    } else {
      setStatusMsg('🔌 No robot board connected. Click "Select Robot USB" below.');
    }

    const unsubStatus = webSerialBridge.subscribeStatus((newStatus) => {
      setSerialStatus(newStatus);
      if (!newStatus.connected) {
        setStatusMsg(newStatus.error || 'USB Disconnected. Please plug in your robot board.');
      } else {
        setStatusMsg('🔌 Robot Board Connected! Click "Run My Robot" below.');
      }
    });

    return () => {
      unsubStatus();
    };
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const handleConnectPort = async () => {
    const res = await webSerialBridge.connect(115200);
    if (res.connected) {
      setLogs((prev) => [...prev, `[ROBOT READY]: Connected to physical USB robot board!`]);
    } else {
      setLogs((prev) => [...prev, `[NOTICE]: Connection cancelled or port not selected.`]);
    }
  };

  const handleFlash = async () => {
    if (!serialStatus.connected) {
      setLogs((prev) => [...prev, '[NOTICE]: Please click "Select Robot USB" above to plug in your board.']);
      setStatusMsg('Please connect your robot board first!');
      return;
    }

    setFlashing(true);
    setProgress(0);
    setLogs((prev) => [...prev, `[ROBOT]: Starting code upload to ${targetBoard.toUpperCase()} board...`]);

    try {
      await webSerialBridge.sendCode(code, targetBoard, (pct, msg) => {
        setProgress(pct);
        setStatusMsg(msg);
        setLogs((prev) => [...prev, `[PROGRESS ${pct}%]: ${msg}`]);
      });
    } catch (e: any) {
      setLogs((prev) => [...prev, `[NOTICE]: ${e.message}`]);
    } finally {
      setFlashing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel-glow w-full max-w-2xl p-6 rounded-3xl border border-amber-500/40 flex flex-col gap-5 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Kid-Friendly Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Bot className="w-6 h-6 text-amber-400 animate-bounce" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                <span>🚀 Run My Robot on Real Hardware</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  serialStatus.connected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {serialStatus.connected ? 'ROBOT READY' : 'PLUG USB'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">One-click upload to Arduino, ESP32, or Raspberry Pi Pico</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Board Selection & Simple Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 font-bold">Select Robot Board:</span>
            <select
              value={targetBoard}
              onChange={(e) => setTargetBoard(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-100 font-bold cursor-pointer"
            >
              <option value="arduino">Arduino UNO (Default Board)</option>
              <option value="esp32">ESP32 (MicroPython IoT Board)</option>
              <option value="pico">Raspberry Pi Pico Board</option>
            </select>
          </div>

          <button
            onClick={serialStatus.connected ? () => webSerialBridge.disconnect() : handleConnectPort}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
              serialStatus.connected
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
            }`}
          >
            {serialStatus.connected ? 'Disconnect Board' : '🔌 Select Robot USB'}
          </button>
        </div>

        {/* Status Banner */}
        {!serialStatus.connected ? (
          <div className="bg-amber-950/30 border border-amber-500/30 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Click <strong>"🔌 Select Robot USB"</strong> above to pick your connected Arduino or robot board!</span>
          </div>
        ) : (
          <div className="bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-2xl flex items-center gap-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Robot Board is connected and active! Click <strong>"Run My Robot 🚀"</strong> below to start!</span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-amber-300">{statusMsg}</span>
            <span className="text-slate-400 font-mono">{progress}%</span>
          </div>

          <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_12px_#f59e0b]"
            />
          </div>
        </div>

        {/* Student Monitor */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-[11px] h-36 overflow-y-auto space-y-1 text-slate-300 shadow-inner relative">
          <div className="text-slate-500 text-[10px] uppercase font-bold border-b border-slate-900 pb-1 mb-1 flex items-center justify-between sticky top-0 bg-slate-950 z-10">
            <span className="flex items-center gap-1 text-amber-400">
              <Bot className="w-3 h-3" /> 💬 Live Robot Talk & Action Monitor
            </span>
            <button onClick={() => setLogs([])} className="text-slate-400 hover:text-slate-100">
              Clear Logs
            </button>
          </div>

          {logs.length === 0 ? (
            <p className="text-slate-500 italic">Logs from your robot will appear here...</p>
          ) : (
            logs.map((log, idx) => (
              <p
                key={idx}
                className={
                  log.includes('100%') || log.includes('ARDUINO') || log.includes('ROBOT READY')
                    ? 'text-emerald-400 font-bold'
                    : 'text-sky-300'
                }
              >
                {log}
              </p>
            ))
          )}
          <div ref={terminalEndRef} />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold hover:text-slate-100"
          >
            Close
          </button>

          <button
            onClick={handleFlash}
            disabled={flashing || !serialStatus.connected}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-sky-500 to-emerald-500 hover:from-amber-300 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <Play className={`w-4 h-4 fill-current ${flashing ? 'animate-spin' : ''}`} />
            <span>{flashing ? 'Uploading Code...' : 'Run My Robot 🚀'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
