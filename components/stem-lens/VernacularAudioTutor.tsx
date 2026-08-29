'use client';

import React, { useState } from 'react';
import { Globe, Volume2, BookOpen, Sparkles, Check } from 'lucide-react';
import { VERNACULAR_DICTIONARY, VernacularTerm } from '@/lib/vernacular-data';
import { LANGUAGES, SupportedLanguage } from '@/lib/languages';

interface VernacularAudioTutorProps {
  currentLang?: SupportedLanguage;
}

export const VernacularAudioTutor: React.FC<VernacularAudioTutorProps> = ({ currentLang = 'hi' }) => {
  const [activeLang, setActiveLang] = useState<SupportedLanguage>(currentLang);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const langCode = activeLang === 'en' ? 'hi' : (activeLang as 'hi' | 'ta' | 'mr' | 'te' | 'bn');

  const handlePlayTTS = (termObj: VernacularTerm) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const trans = termObj.translations[langCode] || termObj.translations.hi;
    const textToSpeak = `${trans.term}. ${trans.explanation}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;

    // Set voice language code if supported
    const langMap: Record<string, string> = {
      hi: 'hi-IN',
      ta: 'ta-IN',
      mr: 'mr-IN',
      te: 'te-IN',
      bn: 'bn-IN',
      en: 'en-IN'
    };
    utterance.lang = langMap[activeLang] || 'hi-IN';

    utterance.onstart = () => setIsPlaying(termObj.englishTerm);
    utterance.onend = () => setIsPlaying(null);
    utterance.onerror = () => setIsPlaying(null);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
            <Globe className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
              <span>Vernacular Audio Tutor & NEP 2020 Glossary</span>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
                6 Indian Languages
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Listen to hardware concepts in your regional mother tongue with native Web Speech TTS audio synthesis.
            </p>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setActiveLang(lang.code)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeLang === lang.code
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dictionary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {VERNACULAR_DICTIONARY.map((term) => {
          const trans = term.translations[langCode] || term.translations.hi;
          const playingThis = isPlaying === term.englishTerm;

          return (
            <div key={term.englishTerm} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between gap-3 shadow-lg">
              
              <div>
                <div className="flex justify-between items-start text-xs mb-1">
                  <span className="font-bold text-slate-100">{term.englishTerm}</span>
                  <span className="text-[10px] text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                    {term.category}
                  </span>
                </div>

                <div className="text-sm font-extrabold text-purple-300 my-1 font-sans">
                  {trans.term}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {trans.explanation}
                </p>
              </div>

              <button
                onClick={() => handlePlayTTS(term)}
                className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  playingThis
                    ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                    : 'bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600 hover:text-white'
                }`}
              >
                <Volume2 className={`w-4 h-4 ${playingThis ? 'animate-pulse' : ''}`} />
                <span>{playingThis ? 'Playing Audio...' : 'Listen Audio 🔊'}</span>
              </button>

            </div>
          );
        })}
      </div>

    </div>
  );
};
