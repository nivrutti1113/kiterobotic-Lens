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
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF3EC]/95 border-b border-[#EEDCD0] backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 py-1">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 p-[2px] shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#FFFDF9] rounded-[10px] flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-purple-700 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-purple-950">KITE ROBOTICS</span>
                <span className="text-[9px] font-black px-2 py-0.2 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                  KMS Studio
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold tracking-tight">STEM Lens & Coding Canvas</p>
            </div>
          </Link>

          {/* Student Mode Switcher Pill (Junior vs Senior) */}
          <div className="hidden lg:flex items-center gap-1 bg-[#FFFDF9] p-1 rounded-xl border border-[#EEDCD0] text-xs shadow-inner">
            <button
              onClick={() => setGradeMode('junior')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg font-black transition-all ${
                gradeMode === 'junior'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Junior (Class 3-5)</span>
            </button>

            <button
              onClick={() => setGradeMode('senior')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg font-black transition-all ${
                gradeMode === 'senior'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Senior (Class 6-12)</span>
            </button>
          </div>

          {/* Clean Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#FFFDF9] p-1 rounded-xl border border-[#EEDCD0] shadow-sm">
            <Link
              href="/stem-lens"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                pathname.startsWith('/stem-lens')
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50/60'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Lens</span>
            </Link>

            <Link
              href="/kinetic-canvas"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                pathname.startsWith('/kinetic-canvas')
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Coding Studio</span>
            </Link>

            <Link
              href="/hardware-lab"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                pathname.startsWith('/hardware-lab')
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50/60'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Wiring Lab</span>
            </Link>

            <Link
              href="/challenges"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                pathname.startsWith('/challenges')
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-700 hover:text-purple-700 hover:bg-purple-50/60'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Fun Quests</span>
            </Link>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* Language Selector Dropdown Popover */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFDF9] border border-[#EEDCD0] hover:border-purple-400 text-xs font-black text-slate-700 hover:text-purple-700 transition-colors shadow-sm"
              >
                <Globe className="w-3.5 h-3.5 text-purple-600" />
                <span>{currentLangObj.flag} {currentLangObj.nativeName}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-[#FFFDF9] border border-[#EEDCD0] shadow-2xl py-1.5 z-50 backdrop-blur-lg">
                  <div className="px-3 py-1 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Select Language / भाषा
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition-colors font-bold"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{lang.flag}</span>
                        <span>{lang.nativeName}</span>
                      </span>
                      {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-purple-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Student Hardware Connect Button */}
            <button
              onClick={onConnectHardware}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shadow-sm ${
                hardwareConnected
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${hardwareConnected ? 'animate-pulse text-emerald-600' : 'text-amber-300'}`} />
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
