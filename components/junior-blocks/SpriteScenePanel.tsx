'use client';

import React, { useState } from 'react';
import { Project, Sprite } from '@/lib/junior-blocks/types';
import { SPRITE_CATALOG, BACKDROP_CATALOG } from '@/lib/junior-blocks/catalog';
import { Plus, Search, Trash2, X, Image as ImageIcon, Sparkles } from 'lucide-react';

interface SpriteScenePanelProps {
  project: Project;
  activeSpriteId: string;
  onSelectSprite: (spriteId: string) => void;
  onAddSprite: (sprite: Sprite) => void;
  onDeleteSprite: (spriteId: string) => void;
  onChangeBackdrop: (backdropId: string) => void;
}

export const SpriteScenePanel: React.FC<SpriteScenePanelProps> = ({
  project,
  activeSpriteId,
  onSelectSprite,
  onAddSprite,
  onDeleteSprite,
  onChangeBackdrop,
}) => {
  const [spritePickerOpen, setSpritePickerOpen] = useState(false);
  const [backdropPickerOpen, setBackdropPickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Robot', 'Animals', 'People', 'Fantasy', 'Dance', 'Music', 'Sports', 'Food', 'Fashion', 'Letters'];

  const filteredSprites = SPRITE_CATALOG.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleChooseSpriteTemplate = (template: typeof SPRITE_CATALOG[0]) => {
    const newSprite: Sprite = {
      id: `sprite_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: template.name,
      costumeUrl: template.svg,
      costumes: template.costumes,
      currentCostumeIndex: 0,
      x: 0,
      y: 0,
      rotation: 0,
      size: 100,
      visible: true,
      scripts: [],
    };
    onAddSprite(newSprite);
    setSpritePickerOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex flex-col gap-2.5 font-sans min-w-0 overflow-hidden">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-heading">
          SPRITES & STAGE BACKDROPS
        </h3>
        <span className="text-[11px] font-bold text-slate-500 font-heading">
          {project.sprites.length} Active Sprite{project.sprites.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Responsive Grid of Sprite Cards & Backdrop Selector (3 per row) */}
      <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-[220px] p-0.5 scrollbar-thin">
        
        {/* Stage Scene Backdrop Card */}
        <div
          onClick={() => setBackdropPickerOpen(true)}
          className="relative group cursor-pointer border-2 border-dashed border-purple-300 hover:border-[#6C2EB5] bg-purple-50/60 hover:bg-purple-100/80 rounded-xl p-1.5 h-20 flex flex-col items-center justify-center transition-all shadow-2xs"
        >
          <ImageIcon className="w-5 h-5 text-[#6C2EB5] mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black text-purple-950 text-center leading-tight font-heading">
            Stage Scene
          </span>
          <div className="absolute -bottom-1 -right-1 bg-[#6C2EB5] text-white rounded-full p-0.5 shadow-2xs">
            <Plus className="w-3 h-3" />
          </div>
        </div>

        {/* Active Sprites List */}
        {project.sprites.map((sprite) => {
          const isSelected = sprite.id === activeSpriteId;
          return (
            <div
              key={sprite.id}
              onClick={() => onSelectSprite(sprite.id)}
              title={sprite.name}
              className={`relative group cursor-pointer border-2 rounded-xl p-1.5 h-20 flex flex-col items-center justify-between transition-all min-w-0 ${
                isSelected
                  ? 'border-[#6C2EB5] bg-purple-50 ring-2 ring-purple-500/20 shadow-xs scale-102'
                  : 'border-slate-200 bg-white hover:border-purple-300'
              }`}
            >
              <div
                className="w-8 h-8 flex items-center justify-center shrink-0 mt-0.5"
                dangerouslySetInnerHTML={{ __html: sprite.costumeUrl || '' }}
              />
              <span className="text-[10px] font-extrabold text-slate-900 truncate w-full text-center font-heading px-0.5" title={sprite.name}>
                {sprite.name}
              </span>

              {/* Delete sprite button */}
              {project.sprites.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSprite(sprite.id);
                  }}
                  className="absolute -top-1 -right-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 shadow-2xs transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove Sprite"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add Sprite Button Card */}
        <button
          onClick={() => setSpritePickerOpen(true)}
          className="border-2 border-dashed border-slate-300 hover:border-[#6C2EB5] bg-slate-50 hover:bg-purple-50/50 rounded-xl p-1.5 h-20 flex flex-col items-center justify-center text-slate-700 hover:text-[#6C2EB5] transition-all shadow-2xs group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full bg-purple-100 text-[#6C2EB5] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 font-black" />
          </div>
          <span className="text-[10px] font-black text-slate-800 font-heading">Add Sprite</span>
        </button>

      </div>

      {/* Sprite Picker Modal */}
      {spritePickerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 font-sans">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#6C2EB5] text-white flex items-center justify-between">
              <div>
                <h2 className="text-base font-black flex items-center gap-2 font-heading">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Choose a Sprite</span>
                </h2>
                <p className="text-xs text-purple-100 font-bold mt-0.5">Select a character to add to your studio stage</p>
              </div>
              <button
                onClick={() => setSpritePickerOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Category Filter Chips */}
            <div className="p-4 border-b border-slate-200 space-y-3 bg-slate-50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sprites by name..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6C2EB5] shadow-2xs"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all font-heading ${
                      selectedCategory === cat
                        ? 'bg-[#6C2EB5] text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sprite Grid */}
            <div className="p-4 flex-1 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filteredSprites.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleChooseSpriteTemplate(item)}
                  className="border border-slate-200 hover:border-[#6C2EB5] bg-white hover:bg-purple-50/60 p-3 rounded-2xl flex flex-col items-center justify-between cursor-pointer transition-all hover:scale-105 shadow-2xs group"
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center mb-2 group-hover:rotate-6 transition-transform"
                    dangerouslySetInnerHTML={{ __html: item.svg }}
                  />
                  <span className="text-xs font-black text-slate-900 text-center leading-tight truncate w-full font-heading">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-extrabold text-[#6C2EB5] mt-1">{item.category}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Backdrop Picker Modal */}
      {backdropPickerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden font-sans">
            
            <div className="p-4 bg-[#6C2EB5] text-white flex items-center justify-between">
              <h2 className="text-base font-black flex items-center gap-2 font-heading">
                <ImageIcon className="w-5 h-5 text-amber-300" />
                <span>Choose a Stage Backdrop</span>
              </h2>
              <button
                onClick={() => setBackdropPickerOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
              {BACKDROP_CATALOG.map((backdrop) => (
                <div
                  key={backdrop.id}
                  onClick={() => {
                    onChangeBackdrop(backdrop.id);
                    setBackdropPickerOpen(false);
                  }}
                  className={`border-2 rounded-2xl p-2 cursor-pointer transition-all hover:scale-105 flex flex-col items-center ${
                    project.backdropUrl === backdrop.id ? 'border-[#6C2EB5] bg-purple-50 ring-2 ring-purple-500/20 shadow-xs' : 'border-slate-200 bg-white hover:border-purple-400'
                  }`}
                >
                  <div className="w-full h-24 rounded-xl overflow-hidden mb-2 border border-slate-200 flex items-center justify-center bg-slate-100">
                    {backdrop.svg ? (
                      <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: backdrop.svg }}
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center font-black text-xs text-slate-800 font-heading"
                        style={{ backgroundColor: backdrop.color || '#FFF' }}
                      >
                        {backdrop.name}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-900 text-center font-heading">{backdrop.name}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
