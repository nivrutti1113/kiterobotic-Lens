'use client';

import React, { useState } from 'react';
import { Camera, Upload, Sparkles, Scan, CheckCircle2, RefreshCw } from 'lucide-react';
import { StemComponent, STEM_COMPONENTS } from '@/lib/stem-data';

interface CameraScannerProps {
  selectedComponent: StemComponent;
  onSelectComponent: (component: StemComponent) => void;
  isScanning: boolean;
  onTriggerScan: () => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  selectedComponent,
  onSelectComponent,
  isScanning,
  onTriggerScan,
}) => {
  const [scanMode, setScanMode] = useState<'preset' | 'webcam' | 'upload'>('preset');

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col gap-6">
      
      {/* Scanner Mode Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-lg text-white">STEM Lens AI Scanner</h2>
            <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-medium">
              Point & Learn AI
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Point camera at physical hardware or select a sample component below to trigger real-time AI recognition.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-gray-900/90 p-1 rounded-xl border border-gray-800">
          <button
            onClick={() => setScanMode('preset')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              scanMode === 'preset' ? 'bg-cyan-500 text-gray-950 shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Hardware Catalog
          </button>
          <button
            onClick={() => setScanMode('webcam')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              scanMode === 'webcam' ? 'bg-cyan-500 text-gray-950 shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Live WebCam
          </button>
          <button
            onClick={() => setScanMode('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              scanMode === 'upload' ? 'bg-cyan-500 text-gray-950 shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            Upload Photo
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 shadow-2xl group">
        
        {/* Background Image / Viewport Content */}
        <img
          src={selectedComponent.imageUrl}
          alt={selectedComponent.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isScanning ? 'scale-105 filter brightness-75' : 'group-hover:scale-105'
          }`}
        />

        {/* Scan Laser Line Overlay */}
        {isScanning && (
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-cyan-400/20 to-cyan-500/0 animate-laser-scan border-b-2 border-cyan-400 shadow-[0_0_15px_#00f2fe]" />
        )}

        {/* HUD Bounding Boxes */}
        <div className="absolute inset-4 border-2 border-dashed border-cyan-400/30 rounded-xl pointer-events-none flex flex-col justify-between p-4">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-cyan-400 bg-gray-950/80 px-2 py-1 rounded border border-cyan-500/30 backdrop-blur-md flex items-center gap-1">
              <Scan className="w-3 h-3 text-cyan-400 animate-spin" /> STEM_VISION_v2.4 [ACTIVE]
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/30 backdrop-blur-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> AI MATCH: 99.4%
            </span>
          </div>

          <div className="flex justify-between items-end">
            <div className="bg-gray-950/90 backdrop-blur-md p-3 rounded-xl border border-gray-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{selectedComponent.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-normal">
                  {selectedComponent.category}
                </span>
              </h3>
              <p className="text-xs text-gray-300 mt-0.5 line-clamp-1">{selectedComponent.shortDesc}</p>
            </div>

            <button
              onClick={onTriggerScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-gray-950 font-bold text-xs shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'AI Scanning...' : 'Re-Scan Object'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Component Quick Selector Grid */}
      <div>
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Select Hardware Component to Scan:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {STEM_COMPONENTS.map((comp) => (
            <button
              key={comp.id}
              onClick={() => onSelectComponent(comp)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedComponent.id === comp.id
                  ? 'bg-cyan-500/10 border-cyan-500 shadow-lg shadow-cyan-500/10'
                  : 'bg-gray-900/60 border-gray-800 hover:border-gray-700 hover:bg-gray-800/50'
              }`}
            >
              <div className="text-xs font-bold text-white truncate">{comp.name}</div>
              <div className="text-[10px] text-gray-400">{comp.category}</div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
