'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Cpu, ArrowLeft, Camera, Play, RefreshCw, Layers, CheckCircle2, Sparkles, Sliders } from 'lucide-react';

interface AIClass {
  id: string;
  name: string;
  samples: number;
  color: string;
}

export default function MachineLearningStudioPage() {
  const [classes, setClasses] = useState<AIClass[]>([
    { id: 'class1', name: 'Class 1: Hand Open', samples: 12, color: '#10B981' },
    { id: 'class2', name: 'Class 2: Closed Fist', samples: 14, color: '#3B82F6' },
    { id: 'class3', name: 'Class 3: Peace Sign', samples: 9, color: '#8B5CF6' },
  ]);
  const [epochs, setEpochs] = useState<number>(50);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainProgress, setTrainProgress] = useState<number>(0);
  const [trainLoss, setTrainLoss] = useState<number>(0.04);
  const [activePredictions, setActivePredictions] = useState<Record<string, number>>({
    class1: 88,
    class2: 8,
    class3: 4,
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  // Enable live webcam feed if user grants permission
  useEffect(() => {
    async function setupWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        // Fallback placeholder if webcam access is denied or headless
      }
    }
    setupWebcam();
  }, []);

  const handleAddSample = (classId: string) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, samples: c.samples + 1 } : c))
    );
  };

  const handleTrainModel = () => {
    setIsTraining(true);
    setTrainProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setTrainProgress(current);
      setTrainLoss(parseFloat((0.8 / (current / 10 + 1)).toFixed(3)));

      if (current >= 100) {
        clearInterval(interval);
        setIsTraining(false);
      }
    }, 200);
  };

  const handleSimulateInference = () => {
    const r1 = Math.floor(Math.random() * 20) + 75;
    const r2 = Math.floor(Math.random() * (100 - r1));
    const r3 = 100 - r1 - r2;
    setActivePredictions({
      class1: r1,
      class2: r2,
      class3: r3,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF3EC] text-slate-900 flex flex-col font-sans select-none">
      
      {/* Header */}
      <header className="bg-[#FFFDF9] border-b-2 border-[#EEDCD0] px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/kinetic-canvas"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100/90 hover:bg-purple-200 text-purple-950 font-black text-xs transition-colors border border-purple-300 shadow-sm font-heading"
          >
            <ArrowLeft className="w-4 h-4 text-purple-700" />
            <span>← Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black shadow-sm">
              <Cpu className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h1 className="font-black text-base text-slate-950 font-heading">Machine Learning AI Studio</h1>
              <p className="text-[11px] font-bold text-slate-600">Teachable Machine Vision & Feature Extraction Sandbox</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleTrainModel}
            disabled={isTraining}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-black transition-all shadow-lg font-heading"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isTraining ? `Training (${trainProgress}%)...` : 'Train Neural Network'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        
        {/* Left Classes & Training Parameters */}
        <div className="w-full lg:w-80 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-4">
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-heading">
              <Layers className="w-4 h-4 text-purple-700" />
              <span>Training Categories (Classes)</span>
            </h3>
            <div className="space-y-3">
              {classes.map((cls) => (
                <div key={cls.id} className="p-3 bg-[#FAF3EC] rounded-xl border border-[#EEDCD0] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs text-slate-950 font-heading">{cls.name}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300">
                      {cls.samples} samples
                    </span>
                  </div>
                  <button
                    onClick={() => handleAddSample(cls.id)}
                    className="w-full py-1.5 bg-white hover:bg-purple-50 text-slate-900 border border-[#EEDCD0] rounded-lg text-xs font-black transition-colors flex items-center justify-center gap-1 font-heading"
                  >
                    <Camera className="w-3.5 h-3.5 text-purple-700" />
                    <span>Hold to Record Sample</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[#EEDCD0] pt-3 space-y-2">
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5 font-heading">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>Hyperparameters</span>
            </h3>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Training Epochs: {epochs}</label>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={epochs}
                onChange={(e) => setEpochs(parseInt(e.target.value))}
                className="w-full accent-purple-700 cursor-pointer"
              />
            </div>
            <p className="text-[11px] font-bold text-slate-600">Current Model Loss: {trainLoss}</p>
          </div>
        </div>

        {/* Center Live Camera & Predictions Output */}
        <div className="flex-1 flex flex-col gap-4">
          
          <div className="flex-1 bg-slate-950 rounded-2xl border-2 border-slate-800 p-4 shadow-xl flex flex-col items-center justify-center relative min-h-[350px]">
            <div className="w-80 h-56 bg-slate-900 rounded-2xl border-2 border-purple-500/60 overflow-hidden relative flex items-center justify-center shadow-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-emerald-400/40 rounded-2xl pointer-events-none animate-pulse" />
            </div>

            <button
              onClick={handleSimulateInference}
              className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-md font-heading flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Run Live Inference Check</span>
            </button>
          </div>

          {/* Output Confidence Bars */}
          <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md space-y-3">
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-heading">
              Real-Time Model Class Confidence Match
            </h3>

            <div className="space-y-2">
              {classes.map((cls) => {
                const pct = activePredictions[cls.id] || 0;
                return (
                  <div key={cls.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="font-heading text-slate-900">{cls.name}</span>
                      <span className="font-black text-purple-700">{pct}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: cls.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
