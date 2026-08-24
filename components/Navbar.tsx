'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, Cpu, LayoutDashboard, Globe, Zap, Bot, Sparkles, Check } from 'lucide-react';
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
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;

  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-6 h-6 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-wider text-white">KITE ROBOTICS</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">NEP 2020</span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium tracking-tight">STEM Lens & Kinetic Canvas</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-900/80 p-1.5 rounded-2xl border border-gray-800">
            <Link
              href="/stem-lens"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                pathname.startsWith('/stem-lens')
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{t.stemLensTab}</span>
            </Link>

            <Link
              href="/kinetic-canvas"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                pathname.startsWith('/kinetic-canvas')
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>{t.kineticCanvasTab}</span>
            </Link>

            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                pathname.startsWith('/dashboard')
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/25'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.lmsTab}</span>
            </Link>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-cyan-500/50 text-xs font-semibold text-gray-300 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{currentLangObj.flag} {currentLangObj.nativeName}</span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-900 border border-gray-800 shadow-2xl py-2 z-50 backdrop-blur-lg">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Select Language / भाषा चुनें
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        onLanguageChange(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-gray-800 text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span className="font-medium">{lang.nativeName}</span>
                        <span className="text-[10px] text-gray-400">({lang.name})</span>
                      </span>
                      {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hardware Connect Button */}
            <button
              onClick={onConnectHardware}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                hardwareConnected
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                  : 'bg-gray-900 border border-gray-800 text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10'
              }`}
            >
              <Zap className={`w-4 h-4 ${hardwareConnected ? 'animate-pulse text-emerald-400' : 'text-cyan-400'}`} />
              <span className="hidden sm:inline">
                {hardwareConnected ? 'Hardware USB: Connected' : 'Connect Hardware USB'}
              </span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
