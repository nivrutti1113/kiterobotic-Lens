'use client';

import React, { useState } from 'react';
import { Zap, Cpu, Terminal, CheckCircle2, AlertTriangle, RefreshCw, X } from 'lucide-react';
import { webSerialBridge } from '@/lib/web-serial';

interface HardwareDeployProps {
  code: string;
  isOpen: boolean;
  onClose: () => void;
}

export const HardwareDeploy: React.FC<HardwareDeployProps> = ({ code, isOpen, onClose }) => {
  const [flashing, setFlashing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('Ready to flash firmware via WebSerial USB.');
  const [logs, setLogs] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleFlash = async () => {
    setFlashing(true);
    setProgress(0);
    setLogs(['Connecting to USB Serial port (115200 baud)...']);

    try {
      await webSerialBridge.sendCode(code, (pct, msg) => {
        setProgress(pct);
        setStatusMsg(msg);
        setLogs((prev) => [...prev, `[${pct}%] ${msg}`]);
      });
    } catch (e: any) {
      setLogs((prev) => [...prev, `[ERROR] ${e.message || 'Flash failed.'}`]);
    } finally {
      setFlashing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel-glow w-full max-w-lg p-6 rounded-3xl border border-cyan-500/40 flex flex-col gap-5 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">One-Click Hardware Flasher</h3>
              <p className="text-xs text-gray-400">Target: Arduino UNO / ESP32 via USB (WebSerial)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-cyan-300">{statusMsg}</span>
            <span className="text-gray-400">{progress}%</span>
          </div>

          <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800 p-0.5">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_12px_#00f2fe]"
            />
          </div>
        </div>

        {/* Real-Time Serial Monitor Log Window */}
        <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 font-mono text-[11px] h-44 overflow-y-auto space-y-1 text-gray-300 shadow-inner">
          <div className="text-gray-500 text-[10px] uppercase font-bold border-b border-gray-900 pb-1 mb-1 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-cyan-400" /> WebSerial Terminal Monitor
          </div>
          {logs.length === 0 ? (
            <p className="text-gray-500 italic">Click "Flash Hardware Now" to compile & stream hex payload...</p>
          ) : (
            logs.map((log, idx) => (
              <p key={idx} className={log.includes('ERROR') ? 'text-red-400' : log.includes('100%') ? 'text-emerald-400 font-bold' : 'text-cyan-300'}>
                {log}
              </p>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-900">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 text-xs font-semibold hover:text-white"
          >
            Close
          </button>

          <button
            onClick={handleFlash}
            disabled={flashing}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-extrabold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${flashing ? 'animate-spin' : ''}`} />
            <span>{flashing ? 'Flashing USB...' : 'Flash Hardware Now ⚡'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
