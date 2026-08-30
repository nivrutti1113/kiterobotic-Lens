'use client';

import React, { useState } from 'react';
import { CameraScanner } from '@/components/stem-lens/CameraScanner';
import { AROverlayCanvas } from '@/components/stem-lens/AROverlayCanvas';
import { GradeExplainer } from '@/components/stem-lens/GradeExplainer';
import { DoubtSolverChat } from '@/components/stem-lens/DoubtSolverChat';
import { VernacularAudioTutor } from '@/components/stem-lens/VernacularAudioTutor';
import { ExploreLibrary } from '@/components/stem-lens/ExploreLibrary';
import { BuddyBotGuide } from '@/components/BuddyBotGuide';
import { STEM_COMPONENTS, StemComponent } from '@/lib/stem-data';
import { SupportedLanguage } from '@/lib/languages';

export default function StemLensPage() {
  const currentLang: SupportedLanguage = 'en';
  const [selectedComponent, setSelectedComponent] = useState<StemComponent>(STEM_COMPONENTS[0]);
  const [isScanning, setIsScanning] = useState(false);

  const handleTriggerScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      
      {/* BuddyBot Student Guide */}
      <BuddyBotGuide
        step1="Point camera or select component 🔍"
        step2="Listen to audio in your mother tongue 🔊"
        step3="Ask AI Robot Tutor any question 🤖"
        currentStep={1}
      />

      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-100 flex items-center gap-2.5">
            <span>Magic Camera & Native Language Audio Tutor</span>
            <span className="text-xs bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2.5 py-0.5 rounded-full font-bold">
              NEP 2020 Aligned
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Point camera or select any hardware part to view interactive AR pinouts and listen to audio in 6 Indian languages!
          </p>
        </div>
      </div>

      {/* Vernacular 6-Language Audio Tutor */}
      <VernacularAudioTutor currentLang={currentLang} />

      {/* Camera Scanner & AR Bounding Box Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <CameraScanner
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
            isScanning={isScanning}
            onTriggerScan={handleTriggerScan}
          />
        </div>

        <div className="lg:col-span-6">
          <AROverlayCanvas
            component={selectedComponent}
          />
        </div>
      </div>

      {/* Grade Explainer & AI Doubt Solver Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <GradeExplainer component={selectedComponent} currentLang={currentLang} />
        </div>

        <div className="lg:col-span-5">
          <DoubtSolverChat component={selectedComponent} />
        </div>
      </div>

      {/* Component Library */}
      <ExploreLibrary
        onSelectComponent={setSelectedComponent}
      />

    </div>
  );
}
