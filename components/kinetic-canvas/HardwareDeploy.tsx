'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Zap, Cpu, Terminal, CheckCircle2, AlertTriangle, RefreshCw, X, Send, Sliders, HardDrive } from 'lucide-react';
import { webSerialBridge, SerialStatus } from '@/lib/web-serial';

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
  const [txCommand, setTxCommand] = useState('');
  const [baudRate, setBaudRate] = useState(115200);
  const [serialStatus, setSerialStatus] = useState<SerialStatus>(webSerialBridge.getStatus());

  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Subscribe to serial data & status changes
  useEffect(() => {
    if (!isOpen) return;

    const unsubStatus = webSerialBridge.subscribeStatus((newStatus) => {
      setSerialStatus(newStatus);
    });

    const unsubData = webSerialBridge.subscribeData((incomingText) => {
      setLogs((prev) => [...prev.slice(-200), `[RX]: ${incomingText.trim()}`]);
    });

    return () => {
      unsubStatus();
      unsubData();
    };
  }, [isOpen]);

  // Auto-scroll terminal log
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const handleConnectPort = async () => {
    const res = await webSerialBridge.connect(baudRate);
    if (res.connected) {
      setLogs((prev) => [...prev, `[SYSTEM]: Connected to ${res.portName} at ${res.baudRate} baud.`]);
    } else {
      setLogs((prev) => [...prev, `[ERROR]: Connection failed: ${res.error || 'User cancelled port selection'}`]);
    }
  };

  const handleSendTx = async () => {
    if (!txCommand.trim()) return;
    const cmd = txCommand;
    setTxCommand('');
    setLogs((prev) => [...prev, `[TX]: ${cmd}`]);
    await webSerialBridge.sendData(cmd + '\n');
  };

  const handleFlash = async () => {
    setFlashing(true);
    setProgress(0);
    setLogs((prev) => [...prev, '[FLASH]: Initiating WebSerial flash payload delivery...']);

    try {
      await webSerialBridge.sendCode(code, (pct, msg) => {
        setProgress(pct);
        setStatusMsg(msg);
        setLogs((prev) => [...prev, `[FLASH ${pct}%]: ${msg}`]);
      });
    } catch (e: any) {
      setLogs((prev) => [...prev, `[ERROR]: Flash failed: ${e.message}`]);
    } finally {
      setFlashing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-panel-glow w-full max-w-2xl p-6 rounded-3xl border border-cyan-500/40 flex flex-col gap-5 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Production WebSerial Hardware Flasher</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  serialStatus.connected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {serialStatus.connected ? 'PORT OPEN' : 'PORT CLOSED'}
                </span>
              </h3>
              <p className="text-xs text-gray-400">Target: Arduino UNO / ESP32 / Micro:bit via USB (WebSerial)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-950 p-3 rounded-2xl border border-gray-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="text-gray-400">Baud Rate:</span>
              <select
                value={baudRate}
                onChange={(e) => setBaudRate(Number(e.target.value))}
                className="bg-gray-900 border border-gray-800 rounded-lg px-2 py-1 text-white font-bold cursor-pointer"
              >
                <option value={9600}>9600</option>
                <option value={57600}>57600</option>
                <option value={115200}>115200</option>
              </select>
            </div>

            <span className="text-gray-500">|</span>

            <span className="text-gray-300 font-mono flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              {serialStatus.portName || 'No Port Selected'}
            </span>
          </div>

          <button
            onClick={serialStatus.connected ? () => webSerialBridge.disconnect() : handleConnectPort}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              serialStatus.connected
                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                : 'bg-cyan-500 text-gray-950 hover:bg-cyan-400'
            }`}
          >
            {serialStatus.connected ? 'Disconnect Port' : 'Select Serial Port ⚡'}
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
        <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 font-mono text-[11px] h-48 overflow-y-auto space-y-1 text-gray-300 shadow-inner relative">
          <div className="text-gray-500 text-[10px] uppercase font-bold border-b border-gray-900 pb-1 mb-1 flex items-center justify-between sticky top-0 bg-gray-950 z-10">
            <span className="flex items-center gap-1 text-cyan-400">
              <Terminal className="w-3 h-3" /> WebSerial Live TX/RX Monitor
            </span>
            <button
              onClick={() => setLogs([])}
              className="text-gray-400 hover:text-white"
            >
              Clear Log
            </button>
          </div>

          {logs.length === 0 ? (
            <p className="text-gray-500 italic">Click "Flash Hardware Now" or connect USB port to stream data...</p>
          ) : (
            logs.map((log, idx) => (
              <p
                key={idx}
                className={
                  log.includes('ERROR')
                    ? 'text-red-400'
                    : log.includes('100%') || log.includes('SYSTEM')
                    ? 'text-emerald-400 font-bold'
                    : log.includes('[TX]')
                    ? 'text-amber-300'
                    : 'text-cyan-300'
                }
              >
                {log}
              </p>
            ))
          )}
          <div ref={terminalEndRef} />
        </div>

        {/* TX Serial Command Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendTx();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={txCommand}
            onChange={(e) => setTxCommand(e.target.value)}
            placeholder="Send command to serial port (e.g. GET_TEMP, MOTOR_ON)..."
            className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 font-mono focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-cyan-500/50 text-cyan-400 font-bold text-xs flex items-center gap-1 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send TX</span>
          </button>
        </form>

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
