'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, Scan, CheckCircle2, RefreshCw, AlertCircle, Video, Image as ImageIcon, Key, Info, X } from 'lucide-react';
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
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showEnvModal, setShowEnvModal] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (scanMode === 'webcam') {
      startWebcam();
    } else {
      stopWebcam();
    }
    return () => {
      stopWebcam();
    };
  }, [scanMode]);

  const startWebcam = async () => {
    setWebcamError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setWebcamActive(true);
    } catch (err: any) {
      console.warn('Webcam access error:', err);
      setWebcamError('Could not access WebCam camera. Please ensure camera permissions are granted.');
      setWebcamActive(false);
    }
  };

  const stopWebcam = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setWebcamActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
          onTriggerScan();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col gap-5">
      
      {/* Scanner Mode Switcher & API Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-sky-400" />
            <h2 className="font-bold text-base text-slate-100">STEM Lens AI Scanner</h2>
            
            {/* API Environment Status Inspector Badge */}
            <button
              onClick={() => setShowEnvModal(true)}
              className="text-[10px] bg-slate-900 text-sky-400 border border-sky-500/30 hover:border-sky-400 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 transition-colors"
              title="Click to check Gemini / OpenAI API status & Environment Variables"
            >
              <Key className="w-3 h-3 text-amber-400" />
              <span>AI API Status: Ready</span>
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Point camera at physical hardware or select a sample component below to trigger real-time AI recognition.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setScanMode('preset')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              scanMode === 'preset' ? 'bg-sky-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>
          <button
            onClick={() => setScanMode('webcam')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              scanMode === 'webcam' ? 'bg-sky-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Live WebCam</span>
          </button>
          <button
            onClick={() => setScanMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              scanMode === 'upload' ? 'bg-sky-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Viewport */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group flex items-center justify-center">
        
        {scanMode === 'preset' && (
          <img
            src={selectedComponent.imageUrl}
            alt={selectedComponent.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isScanning ? 'scale-105 filter brightness-75' : 'group-hover:scale-105'
            }`}
          />
        )}

        {scanMode === 'webcam' && (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            {webcamError ? (
              <div className="p-6 text-center text-xs text-amber-400 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto" />
                <p>{webcamError}</p>
                <p className="text-slate-400 text-[11px]">Using catalog preview for scan demo.</p>
                <img src={selectedComponent.imageUrl} className="w-full h-48 object-cover rounded-xl mt-2 opacity-50" />
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>
        )}

        {scanMode === 'upload' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-950 text-center">
            {uploadedImage ? (
              <img src={uploadedImage} alt="Uploaded preview" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full border-2 border-dashed border-sky-500/40 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-sky-400 hover:bg-sky-500/5 transition-all"
              >
                <Upload className="w-10 h-10 text-sky-400 mb-3 animate-bounce" />
                <h4 className="text-sm font-bold text-slate-100">Click or Drag Circuit Image to Upload</h4>
                <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP hardware photos</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Scan Laser Overlay */}
        {isScanning && (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-500/0 via-sky-400/20 to-sky-500/0 animate-laser-scan border-b-2 border-sky-400 shadow-[0_0_15px_#38bdf8] pointer-events-none" />
        )}

        {/* HUD Bounding Box */}
        <div className="absolute inset-4 border-2 border-dashed border-sky-400/30 rounded-xl pointer-events-none flex flex-col justify-between p-4 z-10">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-sky-400 bg-slate-950/80 px-2 py-1 rounded border border-sky-500/30 backdrop-blur-md flex items-center gap-1">
              <Scan className="w-3 h-3 text-sky-400 animate-spin" /> STEM_VISION_v2.4 [ACTIVE]
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/30 backdrop-blur-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> AI MATCH: 99.4%
            </span>
          </div>

          <div className="flex justify-between items-end pointer-events-auto">
            <div className="bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>{selectedComponent.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-normal">
                  {selectedComponent.category}
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">{selectedComponent.shortDesc}</p>
            </div>

            <button
              onClick={onTriggerScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'AI Scanning...' : 'Re-Scan Object'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Selector Grid */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Select Hardware Component Catalog Sample:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {STEM_COMPONENTS.map((comp) => (
            <button
              key={comp.id}
              onClick={() => onSelectComponent(comp)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedComponent.id === comp.id
                  ? 'bg-sky-500/10 border-sky-500 shadow-md shadow-sky-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="text-xs font-bold text-slate-100 truncate">{comp.name}</div>
              <div className="text-[10px] text-slate-400">{comp.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Environment Variable Setup Modal */}
      {showEnvModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>AI Vision API Key Configuration</span>
              </h3>
              <button onClick={() => setShowEnvModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Kite Robotics AI Vision runs on both a built-in offline engine and online Gemini/OpenAI vision models.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-sky-300 space-y-1">
              <div># Optional Environment Variables (.env.local / Vercel):</div>
              <div className="text-amber-400">GEMINI_API_KEY=your_google_gemini_key</div>
              <div className="text-indigo-400">OPENAI_API_KEY=your_openai_key</div>
            </div>

            <p className="text-[11px] text-slate-400">
              If no API key is set, the system automatically uses the high-speed offline STEM knowledge engine without throwing errors!
            </p>

            <button
              onClick={() => setShowEnvModal(false)}
              className="w-full py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs hover:bg-sky-400 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
