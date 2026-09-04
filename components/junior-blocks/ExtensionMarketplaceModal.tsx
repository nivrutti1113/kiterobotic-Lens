'use client';

import React, { useState } from 'react';
import { EXTENSION_CATALOG, ExtensionItem } from '@/lib/junior-blocks/extensions-catalog';
import { ArrowLeft, Search, X, BookOpen, Wifi, Cpu, Check } from 'lucide-react';

interface ExtensionMarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeExtensionIds: string[];
  onToggleExtension: (extensionId: string) => void;
}

export const ExtensionMarketplaceModal: React.FC<ExtensionMarketplaceModalProps> = ({
  isOpen,
  onClose,
  activeExtensionIds,
  onToggleExtension,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  if (!isOpen) return null;

  const categoryPills = ['All', 'AI & ML', 'Hardware', 'Robots', 'IoT', 'Games & Animation'];

  const filteredExtensions = EXTENSION_CATALOG.filter((item) => {
    const matchesTag = selectedTag === 'All' || item.categoryTags.includes(selectedTag);
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#F0F2F5] flex flex-col overflow-hidden font-sans select-none animate-in fade-in duration-150">
      
      {/* 1. TOP PURPLE HEADER BAR (Height ~50px) */}
      <header className="h-12 bg-[#6C2EB5] text-white px-4 flex items-center justify-between shadow-md shrink-0 relative">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-black text-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Editor</span>
        </button>

        <h1 className="text-sm font-black tracking-tight font-heading absolute left-1/2 -translate-x-1/2">
          Choose an Extension
        </h1>

        <div className="w-24" /> {/* Spacer for balance */}
      </header>

      {/* 2. FILTER & SEARCH BAR (Sticky Second Row, Light Lavender Background #EDE7F6) */}
      <div className="bg-[#EDE7F6] border-b border-purple-200/80 px-6 py-3 flex items-center justify-between gap-4 overflow-x-auto shrink-0 scrollbar-none sticky top-0 z-10 shadow-2xs">
        
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Search Box */}
          <div className="relative shrink-0 w-56">
            <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search extensions..."
              className="w-full pl-9 pr-3 py-1.5 bg-white rounded-full text-xs font-bold text-slate-900 placeholder:text-slate-400 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#6C2EB5] shadow-2xs"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
            {categoryPills.map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#E8425A] text-white shadow-sm ring-2 ring-rose-400/40'
                      : 'bg-[#5B2A86] text-white hover:bg-[#4a2170]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Documentation Button (Far Right) */}
        <a
          href="https://ai.thestempedia.com/extensions/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#5B2A86] hover:bg-[#4a2170] text-white text-xs font-black shadow-2xs transition-colors shrink-0 ml-auto"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Read Documentation</span>
        </a>

      </div>

      {/* 3. EXTENSION CARDS GRID (Scrollable Page Body) */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-[#F0F2F5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
          {filteredExtensions.map((item) => {
            const isSelected = activeExtensionIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => onToggleExtension(item.id)}
                className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-xl flex flex-col justify-between border-2 ${
                  isSelected ? 'border-[#6C2EB5] ring-4 ring-purple-500/20 shadow-lg' : 'border-slate-200/80 hover:border-purple-300'
                }`}
                style={{ height: '265px' }}
              >
                
                {/* Top Illustrated Banner Area (~150px) */}
                <div
                  className="h-36 w-full relative flex items-center justify-center p-4 transition-colors"
                  style={{ backgroundColor: item.thumbnailBg }}
                >
                  {/* Large Icon Glyph */}
                  <span className="text-5xl group-hover:scale-110 transition-transform filter drop-shadow-md">
                    {item.iconGlyph}
                  </span>

                  {/* Ribbon Tag (Top Left) */}
                  {item.isNew && (
                    <div className="absolute top-2 left-2 bg-[#E8425A] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-2xs tracking-wider">
                      NEW
                    </div>
                  )}

                  {/* Requires Hardware Badge (Bottom Right) */}
                  {item.requiresHardware && item.requiresHardware.length > 0 && (
                    <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1 border border-white/50">
                      <Wifi className="w-3 h-3 text-purple-700" />
                      <span>Requires Wifi</span>
                    </div>
                  )}

                  {/* Selected Deselect Badge (Top Right Red X) */}
                  {isSelected && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleExtension(item.id);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer z-10"
                      title="Deselect Extension"
                    >
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}

                  {/* Overlapping Square Icon Badge */}
                  <div
                    className="absolute -bottom-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shadow-md border-2 border-white"
                    style={{ backgroundColor: item.iconColor }}
                  >
                    {item.iconGlyph}
                  </div>
                </div>

                {/* White Card Body (~115px) */}
                <div className="p-4 pt-5 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-black text-slate-900 text-sm font-heading leading-tight group-hover:text-[#6C2EB5] transition-colors">
                        {item.name}
                      </h3>
                      {isSelected && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-[#6C2EB5] flex items-center gap-0.5">
                          <Check className="w-3 h-3 text-[#6C2EB5]" />
                          <span>Added</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-semibold text-slate-500 line-clamp-2 mt-1 leading-snug">
                      {item.description}
                    </p>
                  </div>

                  {/* Tag Pill Badges */}
                  <div className="flex items-center gap-1.5 mt-2 overflow-hidden">
                    {item.categoryTags.map((t) => (
                      <span key={t} className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
