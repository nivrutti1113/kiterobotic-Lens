'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Cpu, Activity, Globe, Zap, Bot, Check, Trophy, Sparkles, Smile } from 'lucide-react';
import { LANGUAGES, SupportedLanguage, UI_TRANSLATIONS } from '@/lib/languages';

interface NavbarProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  hardwareConnected: boolean;
  onConnectHardware: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  hardwareConnected,
  onConnectHardware,
}) => {
  const pathname = usePathname();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [gradeMode, setGradeMode] = useState<'junior' | 'senior'>('junior');
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-13 py-1">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 via-indigo-600 to-amber-400 p-[1.5px] shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-wider text-slate-100">KITE ROBOTICS</span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Kids Friendly
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">STEM Lens & Kinetic Canvas</p>
            </div>
          </Link>

          {/* Student Mode Switcher Pill (Junior vs Senior) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 text-xs">
            <button
              onClick={() => setGradeMode('junior')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                gradeMode === 'junior'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Junior (Class 3-5)</span>
            </button>

            <button
              onClick={() => setGradeMode('senior')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all ${
                gradeMode === 'senior'
                  ? 'bg-sky-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Senior (Class 6-12)</span>
            </button>
          </div>

          {/* Compact Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80">
            <Link
              href="/stem-lens"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname.startsWith('/stem-lens')
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>AI Camera Lens</span>
            </Link>

            <Link
              href="/kinetic-canvas"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname.startsWith('/kinetic-canvas')
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Coding Studio</span>
            </Link>

            <Link
              href="/hardware-lab"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname.startsWith('/hardware-lab')
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Wiring Lab</span>
            </Link>

            <Link
              href="/challenges"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname.startsWith('/challenges')
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Fun Quests</span>
            </Link>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* Language Selector Dropdown Popover */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500/40 text-[11px] font-semibold text-slate-300 hover:text-slate-100 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>{currentLangObj.flag} {currentLangObj.nativeName}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50 backdrop-blur-lg">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Language / भाषा
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-left hover:bg-slate-800 text-slate-300 hover:text-sky-400 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{lang.flag}</span>
                        <span className="font-medium">{lang.nativeName}</span>
                      </span>
                      {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-sky-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Student Hardware Connect Button */}
            <button
              onClick={onConnectHardware}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                hardwareConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-sky-400 hover:border-sky-500/50 hover:bg-sky-500/10'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${hardwareConnected ? 'animate-pulse text-emerald-400' : 'text-sky-400'}`} />
              <span className="hidden sm:inline">
                {hardwareConnected ? '🔌 Robot Connected!' : '🔌 Plug Robot Board'}
              </span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
