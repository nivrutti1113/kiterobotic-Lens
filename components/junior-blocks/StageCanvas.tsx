'use client';

import React, { useRef, useEffect } from 'react';
import { Project } from '@/lib/junior-blocks/types';
import { BACKDROP_CATALOG } from '@/lib/junior-blocks/catalog';
import { Play, Square, MessageSquare, Send } from 'lucide-react';

interface StageCanvasProps {
  project: Project;
  activeSpriteId: string;
  gridVisible: boolean;
  isRunning: boolean;
  askPrompt: string | null;
  onToggleRun: () => void;
  onSubmitAnswer: (answer: string) => void;
  onSelectSprite: (spriteId: string) => void;
  onSpriteClickTrigger?: (spriteId: string) => void;
}

export const StageCanvas: React.FC<StageCanvasProps> = ({
  project,
  activeSpriteId,
  gridVisible,
  isRunning,
  askPrompt,
  onToggleRun,
  onSubmitAnswer,
  onSelectSprite,
  onSpriteClickTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [answerInput, setAnswerInput] = React.useState('');

  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const activeBackdrop = BACKDROP_CATALOG.find((b) => b.id === project.backdropUrl) || BACKDROP_CATALOG[0];
  const activeSprite = project.sprites.find((s) => s.id === activeSpriteId) || project.sprites[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // 1. Draw Background
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = activeBackdrop.color || '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Coordinate Grid Ruler if enabled
      if (gridVisible) {
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;

        const cellSize = 20;
        for (let x = 0; x <= width; x += cellSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y <= height; y += cellSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Center Axis Lines
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
      }

      // 3. Draw Sprites
      project.sprites.forEach((sprite) => {
        if (!sprite.visible) return;

        ctx.save();
        const stageX = centerX + sprite.x;
        const stageY = centerY + sprite.y;

        ctx.translate(stageX, stageY);
        ctx.rotate((sprite.rotation * Math.PI) / 180);
        const scale = (sprite.size || 100) / 100;
        ctx.scale(scale, scale);

        // Cached SVG costume image lookup
        const svgString = sprite.costumeUrl || sprite.costumes[0]?.svg || '';
        let cachedImg = imageCacheRef.current.get(svgString);

        if (!cachedImg && svgString) {
          cachedImg = new Image();
          cachedImg.src = svgString.startsWith('data:') ? svgString : 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
          imageCacheRef.current.set(svgString, cachedImg);
        }

        if (cachedImg && cachedImg.complete && cachedImg.naturalWidth !== 0) {
          ctx.drawImage(cachedImg, -35, -35, 70, 70);
        } else {
          // Fallback shape while image is initially loading
          ctx.fillStyle = '#6D28D9';
          ctx.beginPath();
          ctx.arc(0, 0, 25, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw selection ring for currently active sprite
        if (sprite.id === activeSpriteId) {
          ctx.strokeStyle = '#7C3AED';
          ctx.lineWidth = 3;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(-40, -40, 80, 80);
          ctx.setLineDash([]);
        }

        ctx.restore();

        // 4. Draw Speech Bubble if active
        if (sprite.sayBubble?.text) {
          ctx.save();
          ctx.font = 'bold 12px sans-serif';
          const textMetrics = ctx.measureText(sprite.sayBubble.text);
          const bubbleW = textMetrics.width + 20;
          const bubbleH = 28;
          const bubbleX = stageX - bubbleW / 2;
          const bubbleY = stageY - 65;

          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#5B21B6';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 10);
          ctx.fill();
          ctx.stroke();

          // Bubble tail
          ctx.beginPath();
          ctx.moveTo(stageX - 5, bubbleY + bubbleH);
          ctx.lineTo(stageX, bubbleY + bubbleH + 8);
          ctx.lineTo(stageX + 5, bubbleY + bubbleH);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#1E1B4B';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(sprite.sayBubble.text, stageX, bubbleY + bubbleH / 2);
          ctx.restore();
        }
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, [project, activeSpriteId, gridVisible, activeBackdrop]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left - canvas.width / 2;
    const clickY = e.clientY - rect.top - canvas.height / 2;

    for (const sprite of project.sprites) {
      const dist = Math.hypot(clickX - sprite.x, clickY - sprite.y);
      if (dist <= 35) {
        onSelectSprite(sprite.id);
        if (onSpriteClickTrigger) onSpriteClickTrigger(sprite.id);
        break;
      }
    }
  };

  return (
    <div className="relative bg-white rounded-2xl border-2 border-slate-200 shadow-md overflow-hidden flex flex-col font-sans">
      
      {/* Authentic Scratch Stage Top Header Bar (Green Flag & Stop Controls) */}
      <div className="px-3 py-1.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          {/* Green Flag Button */}
          <button
            onClick={onToggleRun}
            className={`p-1.5 rounded-lg transition-all ${
              isRunning ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-400' : 'hover:bg-emerald-100 text-emerald-600'
            }`}
            title="Go / Run Flag Scripts"
          >
            <Play className="w-4 h-4 fill-emerald-600 text-emerald-600" />
          </button>

          {/* Red Octagon Stop Button */}
          <button
            onClick={onToggleRun}
            className={`p-1.5 rounded-lg transition-all ${
              !isRunning ? 'hover:bg-rose-100 text-rose-600' : 'bg-rose-600 text-white ring-2 ring-rose-400'
            }`}
            title="Stop Execution"
          >
            <Square className="w-4 h-4 fill-rose-600 text-rose-600" />
          </button>
        </div>

        {/* Active Sprite Info Label */}
        <span className="text-[11px] font-black text-slate-700 tracking-tight">
          {activeSprite?.name || 'Stage'}
        </span>
      </div>

      {/* Stage Backdrop & Ruler Canvas */}
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        onClick={handleCanvasClick}
        className="w-full h-auto cursor-pointer block"
      />

      {/* Ask & Wait Input Overlay Box */}
      {askPrompt && (
        <div className="absolute bottom-3 left-3 right-3 bg-white/95 border-2 border-purple-500 p-3 rounded-2xl shadow-2xl flex items-center gap-2 backdrop-blur-md animate-bounce">
          <MessageSquare className="w-5 h-5 text-purple-600 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-extrabold text-slate-900">{askPrompt}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmitAnswer(answerInput);
                setAnswerInput('');
              }}
              className="flex items-center gap-2 mt-1"
            >
              <input
                type="text"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Type your answer..."
                autoFocus
                className="flex-1 bg-slate-100 text-slate-900 font-bold px-3 py-1.5 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow transition-colors flex items-center gap-1"
              >
                <span>Submit</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
