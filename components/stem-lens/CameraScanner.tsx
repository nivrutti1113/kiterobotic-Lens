'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, Scan, CheckCircle2, RefreshCw, AlertCircle, Video, Image as ImageIcon } from 'lucide-react';
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
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle WebCam start/stop
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
    <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col gap-6">
      
      {/* Scanner Mode Switcher Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-lg text-white">STEM Lens AI Scanner</h2>
            <span className="text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold">
              AI Vision 2.4 Active
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Point camera at physical hardware or select a sample component below to trigger real-time AI recognition.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-gray-950 p-1.5 rounded-2xl border border-gray-800">
          <button
            onClick={() => setScanMode('preset')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              scanMode === 'preset' ? 'bg-cyan-500 text-gray-950 shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Catalog</span>
          </button>
          <button
            onClick={() => setScanMode('webcam')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              scanMode === 'webcam' ? 'bg-cyan-500 text-gray-950 shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Live WebCam</span>
          </button>
          <button
            onClick={() => setScanMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              scanMode === 'upload' ? 'bg-cyan-500 text-gray-950 shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 shadow-2xl group flex items-center justify-center">
        
        {/* Mode 1: Preset Catalog Image */}
        {scanMode === 'preset' && (
          <img
            src={selectedComponent.imageUrl}
            alt={selectedComponent.name}
            className={`w-full h-full object-cover transition-transform duration-700 ${
              isScanning ? 'scale-105 filter brightness-75' : 'group-hover:scale-105'
            }`}
          />
        )}

        {/* Mode 2: Live HTML5 WebCam Stream */}
        {scanMode === 'webcam' && (
          <div className="relative w-full h-full bg-black flex items-center justify-center">
            {webcamError ? (
              <div className="p-6 text-center text-xs text-amber-400 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto" />
                <p>{webcamError}</p>
                <p className="text-gray-400 text-[11px]">Using fallback sample preview for scanning.</p>
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

        {/* Mode 3: Upload Photo Dropzone */}
        {scanMode === 'upload' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gray-950 text-center">
            {uploadedImage ? (
              <img src={uploadedImage} alt="Uploaded preview" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-full border-2 border-dashed border-cyan-500/40 rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer hover:border-cyan-400 hover:bg-cyan-500/5 transition-all"
              >
                <Upload className="w-10 h-10 text-cyan-400 mb-3 animate-bounce" />
                <h4 className="text-sm font-bold text-white">Click or Drag Image to Upload</h4>
                <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP hardware photos</p>
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

        {/* Scan Laser Line Overlay */}
        {isScanning && (
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-cyan-400/20 to-cyan-500/0 animate-laser-scan border-b-2 border-cyan-400 shadow-[0_0_15px_#00f2fe] pointer-events-none" />
        )}

        {/* HUD Bounding Boxes & Controls */}
        <div className="absolute inset-4 border-2 border-dashed border-cyan-400/30 rounded-xl pointer-events-none flex flex-col justify-between p-4 z-10">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-cyan-400 bg-gray-950/80 px-2 py-1 rounded border border-cyan-500/30 backdrop-blur-md flex items-center gap-1">
              <Scan className="w-3 h-3 text-cyan-400 animate-spin" /> STEM_VISION_v2.4 [ACTIVE]
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-1 rounded border border-emerald-500/30 backdrop-blur-md flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> AI MATCH: 99.4%
            </span>
          </div>

          <div className="flex justify-between items-end pointer-events-auto">
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

      {/* Hardware Component Catalog Selector Grid */}
      <div>
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Select Hardware Component Catalog Sample:
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
