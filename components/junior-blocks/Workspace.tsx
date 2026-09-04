'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BlockInstance, Sprite } from '@/lib/junior-blocks/types';
import { BLOCK_DEFINITIONS } from '@/lib/junior-blocks/blocks-def';
import { interpreterEngine } from '@/lib/junior-blocks/interpreter';
import { BlockView } from './BlockView';
import { ZoomIn, ZoomOut, Trash2, Copy, Sparkles, Home } from 'lucide-react';

interface WorkspaceProps {
  activeSprite: Sprite;
  onUpdateSpriteScripts: (spriteId: string, scripts: BlockInstance[]) => void;
  onInputChange: (blockId: string, inputName: string, value: number | string | BlockInstance) => void;
  onRegisterActions?: (actions: {
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
    undo: () => void;
    redo: () => void;
    cleanUp: () => void;
    canUndo: boolean;
    canRedo: boolean;
  }) => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  activeSprite,
  onUpdateSpriteScripts,
  onInputChange,
  onRegisterActions,
}) => {
  const [zoom, setZoom] = useState<number>(1.0);
  const [history, setHistory] = useState<BlockInstance[][]>([activeSprite.scripts]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; scriptId: string } | null>(null);
  const [snapTarget, setSnapTarget] = useState<{ x: number; y: number } | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const saveHistory = (newScripts: BlockInstance[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newScripts);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    onUpdateSpriteScripts(activeSprite.id, newScripts);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      onUpdateSpriteScripts(activeSprite.id, prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      onUpdateSpriteScripts(activeSprite.id, next);
    }
  };

  const handleCleanUp = () => {
    const updated = activeSprite.scripts.map((s, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      return {
        ...s,
        x: 30 + col * 240,
        y: 30 + row * 120,
      };
    });
    saveHistory(updated);
    setContextMenu(null);
  };

  // Expose action handlers to parent TopBar
  useEffect(() => {
    if (onRegisterActions) {
      onRegisterActions({
        zoomIn: () => setZoom((z) => Math.min(2.0, z + 0.1)),
        zoomOut: () => setZoom((z) => Math.max(0.5, z - 0.1)),
        resetZoom: () => setZoom(1.0),
        undo: handleUndo,
        redo: handleRedo,
        cleanUp: handleCleanUp,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
      });
    }
  }, [historyIndex, history.length, activeSprite]);

  const handleDropInsideCBlock = (e: React.DragEvent, parentBlockId: string, isElseSlot: boolean = false) => {
    const blockType = e.dataTransfer.getData('kms/block_type') || (window as any).__kms_dragged_block_type;
    if (!blockType) return;
    const def = BLOCK_DEFINITIONS[blockType];
    if (!def) return;

    const sampleInputs: Record<string, number | string | BlockInstance> = {};
    if (def.inputs) {
      Object.entries(def.inputs).forEach(([k, v]) => {
        sampleInputs[k] = v.defaultValue;
      });
    }

    const newBlock: BlockInstance = {
      id: `b_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: blockType,
      category: def.category,
      inputs: sampleInputs,
    };

    const insertIntoTree = (blocks: BlockInstance[]): BlockInstance[] => {
      return blocks.map((b) => {
        if (b.id === parentBlockId) {
          if (isElseSlot) {
            return { ...b, elseChildren: [...(b.elseChildren || []), newBlock] };
          }
          return { ...b, children: [...(b.children || []), newBlock] };
        }
        let updated = { ...b };
        if (updated.next) {
          updated.next = insertIntoTree([updated.next])[0];
        }
        if (updated.children) {
          updated.children = insertIntoTree(updated.children);
        }
        if (updated.elseChildren) {
          updated.elseChildren = insertIntoTree(updated.elseChildren);
        }
        return updated;
      });
    };

    const updatedScripts = insertIntoTree(activeSprite.scripts);
    saveHistory(updatedScripts);
  };

  const handleDropOnWorkspace = (e: React.DragEvent) => {
    e.preventDefault();
    const existingBlockId = e.dataTransfer.getData('kms/existing_block_id') || (window as any).__kms_dragged_existing_id;
    const blockType = e.dataTransfer.getData('kms/block_type') || (window as any).__kms_dragged_block_type;

    if (!workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    const dropX = Math.max(20, Math.round((e.clientX - rect.left) / zoom));
    const dropY = Math.max(20, Math.round((e.clientY - rect.top) / zoom));

    if (existingBlockId) {
      // Move existing root script
      const updated = activeSprite.scripts.map((s) =>
        s.id === existingBlockId ? { ...s, x: dropX, y: dropY } : s
      );
      saveHistory(updated);
      delete (window as any).__kms_dragged_existing_id;
      return;
    }

    if (blockType) {
      const def = BLOCK_DEFINITIONS[blockType];
      if (!def) return;

      const sampleInputs: Record<string, number | string | BlockInstance> = {};
      if (def.inputs) {
        Object.entries(def.inputs).forEach(([k, v]) => {
          sampleInputs[k] = v.defaultValue;
        });
      }

      const newScript: BlockInstance = {
        id: `b_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type: blockType,
        category: def.category,
        inputs: sampleInputs,
        x: dropX,
        y: dropY,
      };

      saveHistory([...activeSprite.scripts, newScript]);
      delete (window as any).__kms_dragged_block_type;
    }
  };

  const handleContextMenu = (e: React.MouseEvent, scriptId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, scriptId });
  };

  const handleDuplicateScript = (scriptId: string) => {
    const scriptToDup = activeSprite.scripts.find((s) => s.id === scriptId);
    if (!scriptToDup) return;

    const cloneBlock = (b: BlockInstance): BlockInstance => ({
      ...b,
      id: `b_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      next: b.next ? cloneBlock(b.next) : undefined,
      children: b.children ? b.children.map(cloneBlock) : undefined,
      elseChildren: b.elseChildren ? b.elseChildren.map(cloneBlock) : undefined,
    });

    const duplicated = cloneBlock(scriptToDup);
    duplicated.x = (scriptToDup.x || 40) + 30;
    duplicated.y = (scriptToDup.y || 40) + 30;

    saveHistory([...activeSprite.scripts, duplicated]);
    setContextMenu(null);
  };

  const handleDeleteScript = (scriptId: string) => {
    const updated = activeSprite.scripts.filter((s) => s.id !== scriptId);
    saveHistory(updated);
    setContextMenu(null);
  };

  const handleDragOverWorkspace = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';

    if (!workspaceRef.current) return;
    const rect = workspaceRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / zoom;
    const mouseY = (e.clientY - rect.top) / zoom;

    let foundSnap: { x: number; y: number } | null = null;

    for (const script of activeSprite.scripts) {
      const scriptX = script.x || 40;
      const scriptY = script.y || 40;

      if (Math.abs(mouseX - scriptX) < 80 && Math.abs(mouseY - scriptY) < 120) {
        let lastBlock = script;
        let stackDepth = 1;
        while (lastBlock.next) {
          lastBlock = lastBlock.next;
          stackDepth++;
        }
        foundSnap = { x: scriptX, y: scriptY + stackDepth * 40 };
        break;
      }
    }

    setSnapTarget(foundSnap);
  };

  return (
    <div
      ref={workspaceRef}
      onDragOver={handleDragOverWorkspace}
      onDrop={(e) => {
        setSnapTarget(null);
        handleDropOnWorkspace(e);
      }}
      onClick={() => setContextMenu(null)}
      className="relative flex-1 bg-[#F8F9FC] h-full overflow-auto shadow-inner font-sans select-none"
      style={{
        backgroundImage: `radial-gradient(#CBD5E1 1.5px, transparent 1.5px)`,
        backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
      }}
    >
      {/* Workspace Canvas Container */}
      <div
        className="min-w-[1400px] min-h-[1000px] p-8 relative transform-origin-top-left transition-transform duration-75"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Snap Line Highlight Preview */}
        {snapTarget && (
          <div
            className="absolute h-1.5 bg-amber-400 border border-purple-600 rounded-full shadow-lg animate-pulse z-40 pointer-events-none"
            style={{
              left: `${snapTarget.x}px`,
              top: `${snapTarget.y}px`,
              width: '140px',
            }}
          />
        )}

        {/* Workspace Root Block Scripts */}
        {activeSprite.scripts.map((script) => (
          <div
            key={script.id}
            draggable={true}
            onDragStart={(e) => handleDragStartExisting(e, script)}
            onContextMenu={(e) => handleContextMenu(e, script.id)}
            onClick={(e) => {
              e.stopPropagation();
              // Executing single script directly on stage when clicked
              interpreterEngine.runProject(
                {
                  id: 'run_temp',
                  name: 'Project',
                  sprites: [{ ...activeSprite, scripts: [script] }],
                  backdropUrl: 'default',
                  gridVisible: false,
                },
                () => {},
                'flag'
              );
            }}
            className="absolute cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-purple-500/50 rounded-xl transition-shadow"
            style={{ left: `${script.x || 40}px`, top: `${script.y || 40}px` }}
          >
            <BlockView
              block={script}
              onInputChange={onInputChange}
              onDragStart={(e) => handleDragStartExisting(e, script)}
              onDropInsideCBlock={handleDropInsideCBlock}
            />
          </div>
        ))}

        {/* Empty Workspace Placeholder */}
        {activeSprite.scripts.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-3xl bg-purple-100 text-[#6C2EB5] flex items-center justify-center mb-3 shadow-inner">
              <Sparkles className="w-8 h-8 text-[#6C2EB5]" />
            </div>
            <p className="font-black text-base text-slate-900 font-heading">Workspace is Empty</p>
            <p className="text-xs text-slate-600 font-bold mt-1">Drag blocks from the left palette to start coding {activeSprite.name}!</p>
          </div>
        )}
      </div>

      {/* Right-Click Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1.5 w-48 text-xs font-black text-slate-900 font-heading"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          <button
            onClick={() => handleDuplicateScript(contextMenu.scriptId)}
            className="w-full px-3.5 py-2 text-left hover:bg-purple-50 hover:text-[#6C2EB5] flex items-center gap-2"
          >
            <Copy className="w-4 h-4 text-[#6C2EB5]" />
            <span>Duplicate Script</span>
          </button>
          <button
            onClick={() => handleDeleteScript(contextMenu.scriptId)}
            className="w-full px-3.5 py-2 text-left hover:bg-rose-50 text-rose-700 flex items-center gap-2 border-t border-slate-100"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Delete Script</span>
          </button>
        </div>
      )}

      {/* Bottom-Left Trash Drop Zone (Pill shape) */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const existingBlockId = e.dataTransfer.getData('kms/existing_block_id') || (window as any).__kms_dragged_existing_id;
          if (existingBlockId) handleDeleteScript(existingBlockId);
        }}
        className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 border border-rose-300/80 rounded-full shadow-2xs text-xs font-black transition-colors font-heading cursor-pointer backdrop-blur-xs"
      >
        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
        <span>🗑 Drag here to delete</span>
      </div>

      {/* Floating Bottom-Right Circular Zoom & Pan Control Cluster */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-white/90 p-1.5 rounded-full border border-slate-200 shadow-md backdrop-blur-xs">
        <button
          onClick={() => setZoom((z) => Math.min(2.0, z + 0.1))}
          className="w-8 h-8 bg-white hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
          className="w-8 h-8 bg-white hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(1.0)}
          className="w-8 h-8 bg-white hover:bg-slate-100 rounded-full flex items-center justify-center text-slate-700 transition-colors shadow-2xs font-black text-xs cursor-pointer"
          title="Reset Zoom / Home"
        >
          <Home className="w-4 h-4 text-slate-700" />
        </button>
      </div>

    </div>
  );

  function handleDragStartExisting(e: React.DragEvent, script: BlockInstance) {
    e.stopPropagation();
    e.dataTransfer.setData('kms/existing_block_id', script.id);
    e.dataTransfer.setData('text/plain', script.id);
    e.dataTransfer.effectAllowed = 'move';
    (window as any).__kms_dragged_existing_id = script.id;
  }
};
