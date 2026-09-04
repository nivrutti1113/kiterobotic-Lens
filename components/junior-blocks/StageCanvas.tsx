'use client';

import React, { useRef, useEffect } from 'react';
import { Project } from '@/lib/junior-blocks/types';
import { BACKDROP_CATALOG } from '@/lib/junior-blocks/catalog';
import { Play, Square, MessageSquare, Send, RotateCcw, Camera, Grid } from 'lucide-react';

interface StageCanvasProps {
  project: Project;
  activeSpriteId: string;
  gridVisible: boolean;
  isRunning: boolean;
  askPrompt: string | null;
  onToggleRun: () => void;
  onRestart?: () => void;
  onTakeScreenshot?: () => void;
  onToggleGrid?: () => void;
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
  onRestart,
  onTakeScreenshot,
  onToggleGrid,
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

      // 2. Draw Grid Ruler if enabled
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
          ctx.drawImage(cachedImg, -32, -32, 64, 64);
        } else {
          // Fallback circle while image loads
          ctx.fillStyle = '#6C2EB5';
          ctx.beginPath();
          ctx.arc(0, 0, 22, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw selection ring for currently active sprite
        if (sprite.id === activeSpriteId) {
          ctx.strokeStyle = '#6C2EB5';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(-36, -36, 72, 72);
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
          const bubbleY = stageY - 60;

          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#6C2EB5';
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

          ctx.fillStyle = '#0F172A';
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
    <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm p-2.5 flex flex-col gap-2 font-sans select-none">
      
      {/* Stage Header Controls Bar */}
      <div className="px-2 py-1 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          {/* Green Flag Button */}
          <button
            onClick={onToggleRun}
            className={`p-1.5 rounded-full transition-all ${
              isRunning ? 'bg-emerald-100 ring-2 ring-emerald-400' : 'hover:bg-emerald-100'
            }`}
            title="Run Flag Scripts"
          >
            <Play className="w-4 h-4 fill-emerald-600 text-emerald-600" />
          </button>

          {/* Red Octagon Stop Button */}
          <button
            onClick={onToggleRun}
            className={`p-1.5 rounded-full transition-all ${
              !isRunning ? 'hover:bg-rose-100' : 'bg-rose-600 text-white ring-2 ring-rose-400'
            }`}
            title="Stop Execution"
          >
            <Square className="w-4 h-4 fill-rose-600 text-rose-600" />
          </button>
        </div>

        {/* Active Sprite Name Label */}
        <span className="text-xs font-black text-slate-800 tracking-tight font-heading">
          {activeSprite?.name || 'Stage'}
        </span>
      </div>

      {/* 4:3 Aspect Ratio Stage Canvas */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-white">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onClick={handleCanvasClick}
          className="w-full h-full cursor-pointer block object-contain"
        />

        {/* Ask & Wait Input Overlay Box */}
        {askPrompt && (
          <div className="absolute bottom-2 left-2 right-2 bg-white/95 border-2 border-[#6C2EB5] p-2.5 rounded-2xl shadow-2xl flex items-center gap-2 backdrop-blur-md animate-bounce">
            <MessageSquare className="w-4 h-4 text-[#6C2EB5] shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-extrabold text-slate-900">{askPrompt}</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSubmitAnswer(answerInput);
                  setAnswerInput('');
                }}
                className="flex items-center gap-1.5 mt-1"
              >
                <input
                  type="text"
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="Type your answer..."
                  autoFocus
                  className="flex-1 bg-slate-100 text-slate-900 font-bold px-2.5 py-1 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-[#6C2EB5] hover:bg-[#5b259b] text-white font-black text-xs rounded-xl shadow transition-colors flex items-center gap-1"
                >
                  <span>Submit</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Below Stage: Run Controls Row (Pill buttons) */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap pt-0.5">
        <button
          onClick={onToggleRun}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-black text-xs shadow-xs transition-all hover:scale-105 font-heading ${
            isRunning
              ? 'bg-rose-600 text-white'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {isRunning ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
          <span>{isRunning ? 'Stop' : '▶ Run Green Flag'}</span>
        </button>

        {onRestart && (
          <button
            onClick={onRestart}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
            title="Reset Sprites"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>
        )}

        {onTakeScreenshot && (
          <button
            onClick={onTakeScreenshot}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
            title="Snapshot Stage"
          >
            <Camera className="w-3.5 h-3.5 text-slate-500" />
            <span>Snapshot</span>
          </button>
        )}

        {onToggleGrid && (
          <button
            onClick={onToggleGrid}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-bold transition-colors ${
              gridVisible ? 'bg-cyan-50 border-cyan-300 text-cyan-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-slate-500" />
            <span>Grid {gridVisible ? 'ON' : 'OFF'}</span>
          </button>
        )}
      </div>

    </div>
  );
};
