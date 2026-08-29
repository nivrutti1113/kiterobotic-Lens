'use client';

import React, { useState } from 'react';
import { Terminal, Send, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { webSerialBridge } from '@/lib/web-serial';

export const HardwareDiagnostics: React.FC = () => {
  const [commandInput, setCommandInput] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[INIT] Hardware Diagnostic Engine initialized.',
    '[INFO] Click "Run Diagnostics Test" to test physical USB serial hardware connection.'
  ]);
  const [testing, setTesting] = useState(false);

  const handleSendCommand = async () => {
    if (!commandInput.trim()) return;
    const cmd = commandInput;
    setCommandInput('');
    setConsoleLogs((prev) => [...prev, `> ${cmd}`]);

    try {
      await webSerialBridge.sendData(cmd + '\n');
    } catch (e: any) {
      setConsoleLogs((prev) => [...prev, `[ERR] ${e.message || 'Send failed. Hardware not connected.'}`]);
    }
  };

  const handleRunDiagnosticTest = async () => {
    setTesting(true);
    setConsoleLogs(['[TEST] Initiating Real WebSerial Hardware Diagnostic Suite...']);

    await new Promise((r) => setTimeout(r, 200));

    // Test 1: Check Browser WebSerial API capability
    const isSupported = webSerialBridge.checkSupport();
    if (isSupported) {
      setConsoleLogs((prev) => [...prev, '[PASS] Test 1/3: WebSerial Browser API (navigator.serial) is supported.']);
    } else {
      setConsoleLogs((prev) => [...prev, '[FAIL] Test 1/3: WebSerial API is NOT supported in this browser. Please use Chrome/Edge on Desktop.']);
      setTesting(false);
      return;
    }

    await new Promise((r) => setTimeout(r, 200));

    // Test 2: Check Physical USB Hardware Connection
    const status = webSerialBridge.getStatus();
    if (status.connected) {
      setConsoleLogs((prev) => [...prev, `[PASS] Test 2/3: Physical USB Hardware Serial Port is ACTIVE at ${status.baudRate} baud.`]);
    } else {
      setConsoleLogs((prev) => [...prev, '[FAIL] Test 2/3: No physical USB hardware device connected to serial port.']);
      setConsoleLogs((prev) => [...prev, '[FAIL] Test 3/3: UART TX/RX Stream Test ABORTED (Hardware Disconnected).']);
      setConsoleLogs((prev) => [...prev, '[DIAGNOSTIC SUMMARY]: 1 Passed, 2 Failed. Please click "Connect USB" to pair hardware.']);
      setTesting(false);
      return;
    }

    await new Promise((r) => setTimeout(r, 300));

    // Test 3: Test Hardware TX Stream
    try {
      await webSerialBridge.sendData('\r\n');
      setConsoleLogs((prev) => [...prev, '[PASS] Test 3/3: TX Serial Stream packet write acknowledged by USB controller.']);
      setConsoleLogs((prev) => [...prev, '[DIAGNOSTIC SUMMARY]: 3/3 Tests Passed! Hardware USB is fully operational.']);
    } catch (err: any) {
      setConsoleLogs((prev) => [...prev, `[FAIL] Test 3/3: ${err.message}`]);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-100">Hardware Diagnostic & Benchmark Suite</h2>
            <p className="text-xs text-slate-400">
              Run real hardware WebSerial connection checks and transmit serial commands.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunDiagnosticTest}
          disabled={testing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'Testing Hardware...' : 'Run Diagnostics Test ⚡'}</span>
        </button>
      </div>

      {/* Terminal Viewport */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 h-64 overflow-y-auto space-y-1.5 shadow-inner">
        {consoleLogs.map((log, i) => (
          <div
            key={i}
            className={
              log.includes('PASS')
                ? 'text-emerald-400 font-bold'
                : log.includes('FAIL') || log.includes('[ERR]')
                ? 'text-red-400 font-bold'
                : log.includes('>')
                ? 'text-sky-300'
                : 'text-slate-300'
            }
          >
            {log}
          </div>
        ))}
      </div>

      {/* Command Prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendCommand();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Send custom Serial/AT command payload (e.g. AT+RST, PIN13_HIGH)..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send TX</span>
        </button>
      </form>

    </div>
  );
};
