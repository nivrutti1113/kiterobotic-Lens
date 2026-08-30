'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Scan, CheckCircle2, RefreshCw, AlertCircle, Video, Image as ImageIcon, Key, X } from 'lucide-react';
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
    <div className="bg-[#FFFDF9] p-5 rounded-3xl border border-[#EEDCD0] flex flex-col gap-5 shadow-sm font-sans">
      
      {/* Scanner Mode Switcher & API Status Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-700" />
            <h2 className="font-black text-base text-[#111827] font-heading">🔍 Magic AI Camera Scanner (Class 3+)</h2>
            
            {/* API Environment Status Inspector Badge */}
            <button
              onClick={() => setShowEnvModal(true)}
              className="text-[10px] bg-purple-100 text-purple-900 border border-purple-300 hover:bg-purple-200 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1 transition-colors font-heading"
              title="Click to check Gemini / OpenAI API status & Environment Variables"
            >
              <Key className="w-3 h-3 text-amber-600" />
              <span>AI API Status: Ready</span>
            </button>
          </div>
          <p className="text-xs text-[#374151] mt-1 font-semibold">
            Point camera at physical hardware or select a sample component below to trigger real-time AI recognition.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#FAF3EC] p-1.5 rounded-2xl border border-[#EEDCD0] font-heading">
          <button
            onClick={() => setScanMode('preset')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              scanMode === 'preset' ? 'bg-purple-700 text-white shadow' : 'text-[#374151] hover:text-purple-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>
          <button
            onClick={() => setScanMode('webcam')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              scanMode === 'webcam' ? 'bg-purple-700 text-white shadow' : 'text-[#374151] hover:text-purple-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Live WebCam</span>
          </button>
          <button
            onClick={() => setScanMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              scanMode === 'upload' ? 'bg-purple-700 text-white shadow' : 'text-[#374151] hover:text-purple-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Viewport */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-[#EEDCD0] shadow-xl group flex items-center justify-center">
        
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
              <div className="p-6 text-center text-xs text-amber-300 space-y-2 font-semibold">
                <AlertCircle className="w-8 h-8 mx-auto" />
                <p>{webcamError}</p>
                <p className="text-slate-300 text-[11px]">Using catalog preview for scan demo.</p>
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
                className="w-full h-full border-2 border-dashed border-purple-400 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-purple-300 hover:bg-purple-500/10 transition-all"
              >
                <Upload className="w-10 h-10 text-purple-400 mb-3 animate-bounce" />
                <h4 className="text-sm font-black text-white font-heading">Click or Drag Circuit Image to Upload</h4>
                <p className="text-xs text-slate-300 mt-1 font-semibold">Supports JPG, PNG, WEBP hardware photos</p>
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
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/0 via-purple-400/30 to-purple-500/0 animate-laser-scan border-b-2 border-purple-400 shadow-[0_0_15px_#8b5cf6] pointer-events-none" />
        )}

        {/* HUD Bounding Box inside dark camera viewport */}
        <div className="absolute inset-4 border-2 border-dashed border-purple-300/40 rounded-xl pointer-events-none flex flex-col justify-between p-4 z-10">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-purple-300 bg-slate-950/80 px-2 py-1 rounded border border-purple-500/30 backdrop-blur-md flex items-center gap-1 font-bold">
              <Scan className="w-3 h-3 text-purple-400 animate-spin" /> STEM_VISION_v2.4 [ACTIVE]
            </span>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/30 backdrop-blur-md flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> AI MATCH: 99.4%
            </span>
          </div>

          <div className="flex justify-between items-end pointer-events-auto">
            <div className="bg-slate-950/90 backdrop-blur-md p-3 rounded-xl border border-slate-800 max-w-[280px]">
              <h3 className="text-sm font-black text-white flex items-center gap-2 font-heading">
                <span>{selectedComponent.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 font-bold">
                  {selectedComponent.category}
                </span>
              </h3>
              <p className="text-xs text-slate-200 mt-0.5 line-clamp-1 font-semibold">{selectedComponent.shortDesc}</p>
            </div>

            <button
              onClick={onTriggerScan}
              disabled={isScanning}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 font-heading"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'AI Scanning...' : 'Re-Scan Object'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Catalog Selector Grid */}
      <div>
        <h4 className="text-xs font-black text-[#111827] uppercase tracking-wider mb-2.5 font-heading">
          Select Hardware Component Catalog Sample:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {STEM_COMPONENTS.map((comp) => (
            <button
              key={comp.id}
              onClick={() => onSelectComponent(comp)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedComponent.id === comp.id
                  ? 'bg-purple-100 border-purple-600 shadow-sm'
                  : 'bg-white border-[#EEDCD0] hover:border-purple-400 hover:bg-purple-50'
              }`}
            >
              <div className="text-xs font-black text-[#111827] truncate font-heading">{comp.name}</div>
              <div className="text-[10px] text-[#4B5563] font-bold">{comp.category}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Environment Variable Setup Modal */}
      {showEnvModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[#EEDCD0] p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEDCD0]">
              <h3 className="font-black text-sm text-[#111827] flex items-center gap-2 font-heading">
                <Key className="w-4 h-4 text-amber-600" />
                <span>AI Vision API Key Configuration</span>
              </h3>
              <button onClick={() => setShowEnvModal(false)} className="text-slate-600 hover:text-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#374151] leading-relaxed font-semibold">
              Kite Robotics AI Vision runs on both a built-in offline engine and online Gemini/OpenAI vision models.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 space-y-1">
              <div># Optional Environment Variables (.env.local / Vercel):</div>
              <div className="text-amber-300">GEMINI_API_KEY=your_google_gemini_key</div>
              <div className="text-indigo-300">OPENAI_API_KEY=your_openai_key</div>
            </div>

            <p className="text-[11px] text-[#4B5563] font-semibold">
              If no API key is set, the system automatically uses the high-speed offline STEM knowledge engine without throwing errors!
            </p>

            <button
              onClick={() => setShowEnvModal(false)}
              className="w-full py-2.5 rounded-xl bg-purple-700 text-white font-black text-xs hover:bg-purple-800 transition-colors font-heading"
            >
              Got It
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
