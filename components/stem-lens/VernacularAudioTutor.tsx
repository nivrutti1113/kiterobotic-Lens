'use client';

import React, { useState, useEffect } from 'react';
import { Globe, Volume2, Sparkles, Play, Pause, X, FileText } from 'lucide-react';
import { VERNACULAR_DICTIONARY, VernacularTerm } from '@/lib/vernacular-data';
import { LANGUAGES, SupportedLanguage } from '@/lib/languages';

interface VernacularAudioTutorProps {
  currentLang?: SupportedLanguage;
}

export const VernacularAudioTutor: React.FC<VernacularAudioTutorProps> = ({ currentLang = 'en' }) => {
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(currentLang);
  const [activeScriptModal, setActiveScriptModal] = useState<{ term: VernacularTerm; script: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [voicesLoaded, setVoicesLoaded] = useState<boolean>(false);

  const langCode = activeLang as 'en' | 'hi' | 'ta' | 'mr' | 'te' | 'bn';

  // Voice Initialization Pump
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoicesLoaded(true);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  const handlePlayInDepthAudio = (termObj: VernacularTerm) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const trans = termObj.translations[langCode] || termObj.translations.en;
    const textToSpeak = trans.inDepthScript;

    // Open Script Inspector Modal
    setActiveScriptModal({ term: termObj, script: textToSpeak });

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.92;

    // Find best voice match for active language
    const voices = window.speechSynthesis.getVoices();
    const langMap: Record<SupportedLanguage, string[]> = {
      en: ['en-IN', 'en-US', 'en-GB'],
      hi: ['hi-IN', 'hi'],
      ta: ['ta-IN', 'ta'],
      mr: ['mr-IN', 'mr', 'hi-IN'],
      te: ['te-IN', 'te'],
      bn: ['bn-IN', 'bn-BD', 'bn']
    };

    const targetLangs = langMap[activeLang] || ['en-IN'];
    let matchedVoice = voices.find((v) => targetLangs.some((l) => v.lang.toLowerCase().includes(l.toLowerCase())));

    if (!matchedVoice && activeLang !== 'en') {
      // Fallback voice search
      matchedVoice = voices.find((v) => v.lang.startsWith(activeLang)) || voices.find((v) => v.lang.includes('hi'));
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
    } else {
      utterance.lang = targetLangs[0];
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  return (
    <div className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#EEDCD0] flex flex-col gap-6 shadow-sm font-sans">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EEDCD0] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 border border-purple-300 flex items-center justify-center">
            <Globe className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#111827] flex items-center gap-2 font-heading">
              <span>Vernacular In-Depth Audio Tutor (NEP 2020)</span>
              <span className="text-[10px] bg-purple-100 text-purple-950 border border-purple-300 px-2.5 py-0.5 rounded-full font-black">
                2-Min Audio Masterclasses
              </span>
            </h2>
            <p className="text-xs text-[#374151] font-semibold">
              Listen to 2-minute comprehensive STEM lessons in English or your regional mother tongue with native Web Speech TTS audio synthesis.
            </p>
          </div>
        </div>

        {/* Language Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#FAF3EC] p-1.5 rounded-2xl border border-[#EEDCD0] font-heading">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                handleStopAudio();
                setActiveLang(lang.code);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeLang === lang.code
                  ? 'bg-purple-700 text-white shadow'
                  : 'text-[#374151] hover:text-purple-900'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {VERNACULAR_DICTIONARY.map((term) => {
          const trans = term.translations[langCode] || term.translations.en;

          return (
            <div key={term.componentId} className="bg-white p-5 rounded-2xl border border-[#EEDCD0] flex flex-col justify-between gap-4 shadow-sm group hover:border-purple-500 transition-all">
              
              <div className="space-y-2">
                <div className="flex justify-between items-start text-xs">
                  <span className="font-black text-[#111827] font-heading">{term.englishTerm}</span>
                  <span className="text-[10px] text-purple-900 font-mono bg-purple-100 px-2 py-0.5 rounded border border-purple-300 font-bold">
                    {term.category}
                  </span>
                </div>

                <div className="text-sm font-black text-purple-900 font-heading">
                  {trans.term}
                </div>

                <p className="text-xs text-[#374151] leading-relaxed font-semibold">
                  {trans.shortDesc}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#EEDCD0]">
                <button
                  onClick={() => handlePlayInDepthAudio(term)}
                  className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-all font-heading"
                >
                  <Volume2 className="w-4 h-4 text-amber-300" />
                  <span>Play 2-Min Audio Masterclass ({langCode.toUpperCase()}) 🔊</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Interactive 2-Min Audio Transcript & Player Modal */}
      {activeScriptModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] border border-[#EEDCD0] p-6 rounded-3xl max-w-xl w-full flex flex-col gap-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#EEDCD0]">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-700" />
                <div>
                  <h3 className="font-black text-sm text-[#111827] font-heading">
                    {activeScriptModal.term.englishTerm} — In-Depth Lesson Script
                  </h3>
                  <span className="text-[10px] text-purple-900 font-mono font-bold">
                    Language: {activeLang.toUpperCase()} • Duration: ~2 Mins
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  handleStopAudio();
                  setActiveScriptModal(null);
                }}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Script Viewer Container */}
            <div className="bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0] font-sans text-xs text-[#111827] leading-relaxed max-h-60 overflow-y-auto space-y-2 shadow-inner">
              <div className="text-[10px] font-black uppercase tracking-wider text-purple-900 mb-1 flex items-center gap-1 font-heading">
                <Sparkles className="w-3 h-3 text-purple-700" /> Live Subtitle Transcript
              </div>
              <p className="text-[#374151] text-xs font-semibold leading-relaxed">{activeScriptModal.script}</p>
            </div>

            {/* Audio Control Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#EEDCD0]">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-600 animate-ping' : 'bg-slate-400'}`} />
                <span className="text-xs text-[#4B5563] font-bold">
                  {isPlaying ? 'TTS Voice Synthesizing Audio...' : 'Audio Paused'}
                </span>
              </div>

              <div className="flex items-center gap-2 font-heading">
                <button
                  onClick={isPlaying ? handleStopAudio : () => handlePlayInDepthAudio(activeScriptModal.term)}
                  className="px-4 py-2 rounded-xl bg-purple-700 text-white font-black text-xs flex items-center gap-1.5 hover:bg-purple-800 transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? 'Pause Speech' : 'Replay Speech'}</span>
                </button>

                <button
                  onClick={() => {
                    handleStopAudio();
                    setActiveScriptModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#FAF3EC] text-[#374151] font-black text-xs border border-[#EEDCD0] hover:bg-purple-100"
                >
                  Close Player
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
