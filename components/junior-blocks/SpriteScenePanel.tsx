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
    <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-3 shadow-md space-y-3 font-sans">
      
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-[#EEDCD0] pb-2">
        <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5 font-heading">
          <span>Sprites & Stage Backdrops</span>
        </h3>
        <span className="text-xs font-black text-slate-800 font-heading">
          {project.sprites.length} Active Sprite{project.sprites.length > 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid of Sprites & Backdrop Pickers */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1">
        
        {/* Backdrop Selector Card */}
        <div
          onClick={() => setBackdropPickerOpen(true)}
          className="relative group cursor-pointer border-2 border-dashed border-purple-400 hover:border-purple-700 bg-purple-100/60 hover:bg-purple-100 rounded-2xl p-2 w-20 h-20 shrink-0 flex flex-col items-center justify-center transition-all shadow-sm"
        >
          <ImageIcon className="w-6 h-6 text-purple-800 mb-1 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black text-purple-950 text-center leading-tight font-heading">
            Stage Scene
          </span>
          <div className="absolute -bottom-1 -right-1 bg-purple-700 text-white rounded-full p-0.5 shadow-sm">
            <Plus className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="w-[1px] h-14 bg-[#EEDCD0] shrink-0" />

        {/* Active Sprites List */}
        {project.sprites.map((sprite) => {
          const isSelected = sprite.id === activeSpriteId;
          return (
            <div
              key={sprite.id}
              onClick={() => onSelectSprite(sprite.id)}
              className={`relative group cursor-pointer border-2 rounded-2xl p-1.5 w-20 h-20 shrink-0 flex flex-col items-center justify-between transition-all ${
                isSelected
                  ? 'border-purple-700 bg-purple-100/70 ring-4 ring-purple-500/20 shadow-md scale-105'
                  : 'border-[#EEDCD0] bg-white hover:border-purple-400'
              }`}
            >
              <div
                className="w-10 h-10 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: sprite.costumeUrl || '' }}
              />
              <span className="text-[10px] font-black text-slate-950 truncate w-full text-center font-heading">
                {sprite.name}
              </span>

              {/* Delete sprite button */}
              {project.sprites.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSprite(sprite.id);
                  }}
                  className="absolute -top-1.5 -right-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 shadow transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove Sprite"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add Sprite Button */}
        <button
          onClick={() => setSpritePickerOpen(true)}
          className="border-2 border-dashed border-slate-300 hover:border-purple-700 bg-slate-50 hover:bg-purple-100/50 rounded-2xl p-2 w-20 h-20 shrink-0 flex flex-col items-center justify-center text-slate-900 hover:text-purple-900 transition-all shadow-sm group"
        >
          <div className="w-8 h-8 rounded-full bg-purple-200 text-purple-900 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5 font-black" />
          </div>
          <span className="text-[10px] font-black text-slate-950 font-heading">Add Sprite</span>
        </button>

      </div>

      {/* Sprite Picker Modal */}
      {spritePickerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#EEDCD0] overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="p-4 bg-purple-700 text-white flex items-center justify-between">
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
            <div className="p-4 border-b border-[#EEDCD0] space-y-3 bg-[#FAF3EC]">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sprites by name..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#EEDCD0] text-xs font-black text-slate-950 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all font-heading ${
                      selectedCategory === cat
                        ? 'bg-purple-700 text-white shadow-sm'
                        : 'bg-white text-slate-900 border border-[#EEDCD0] hover:bg-purple-100'
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
                  className="border border-[#EEDCD0] hover:border-purple-600 bg-white hover:bg-purple-50 p-3 rounded-2xl flex flex-col items-center justify-between cursor-pointer transition-all hover:scale-105 shadow-sm group"
                >
                  <div
                    className="w-14 h-14 flex items-center justify-center mb-2 group-hover:rotate-6 transition-transform"
                    dangerouslySetInnerHTML={{ __html: item.svg }}
                  />
                  <span className="text-xs font-black text-slate-950 text-center leading-tight truncate w-full font-heading">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-extrabold text-purple-800 mt-1">{item.category}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Backdrop Picker Modal */}
      {backdropPickerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FFFDF9] rounded-3xl max-w-xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-[#EEDCD0] overflow-hidden">
            
            <div className="p-4 bg-purple-700 text-white flex items-center justify-between">
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
                    project.backdropUrl === backdrop.id ? 'border-purple-700 bg-purple-100/70 ring-4 ring-purple-500/20 shadow-md' : 'border-[#EEDCD0] bg-white hover:border-purple-500'
                  }`}
                >
                  <div className="w-full h-24 rounded-xl overflow-hidden mb-2 border border-[#EEDCD0] flex items-center justify-center bg-slate-100">
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
                  <span className="text-xs font-black text-slate-950 text-center font-heading">{backdrop.name}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
