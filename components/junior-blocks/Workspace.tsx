'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BlockInstance, Sprite } from '@/lib/junior-blocks/types';
import { BLOCK_DEFINITIONS } from '@/lib/junior-blocks/blocks-def';
import { BlockView } from './BlockView';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, RotateCw, Trash2, Copy, Sparkles } from 'lucide-react';

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
    let currentY = 30;
    const updated = activeSprite.scripts.map((s) => {
      const reordered = { ...s, x: 40, y: currentY };
      currentY += 160;
      return reordered;
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
    const blockType = e.dataTransfer.getData('kms/block_type');
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
      id: `block_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
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

    const updated = insertIntoTree(activeSprite.scripts);
    saveHistory(updated);
  };

  const handleDropOnWorkspace = (e: React.DragEvent) => {
    e.preventDefault();
    setContextMenu(null);

    const rect = workspaceRef.current?.getBoundingClientRect();
    const dropX = rect ? (e.clientX - rect.left) / zoom : 40;
    const dropY = rect ? (e.clientY - rect.top) / zoom : 40;

    const blockType = e.dataTransfer.getData('kms/block_type');
    const existingBlockId = e.dataTransfer.getData('kms/existing_block_id');

    if (blockType) {
      // Adding new block from palette
      const def = BLOCK_DEFINITIONS[blockType];
      if (!def) return;

      const sampleInputs: Record<string, number | string | BlockInstance> = {};
      if (def.inputs) {
        Object.entries(def.inputs).forEach(([k, v]) => {
          sampleInputs[k] = v.defaultValue;
        });
      }

      const newBlock: BlockInstance = {
        id: `block_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type: blockType,
        category: def.category,
        inputs: sampleInputs,
        x: Math.max(20, Math.round(dropX)),
        y: Math.max(20, Math.round(dropY)),
      };

      // Check magnetic snap to bottom of existing script
      const scripts = [...activeSprite.scripts];
      const targetScriptIndex = scripts.findIndex((s) => {
        const rootX = s.x || 40;
        const rootY = s.y || 40;
        return Math.abs(dropX - rootX) < 100 && Math.abs(dropY - rootY) < 220;
      });

      if (targetScriptIndex !== -1) {
        // Magnetic snap to bottom of chain
        let tail = scripts[targetScriptIndex];
        while (tail.next) {
          tail = tail.next;
        }
        delete newBlock.x;
        delete newBlock.y;
        tail.next = newBlock;
      } else {
        scripts.push(newBlock);
      }

      saveHistory(scripts);
    } else if (existingBlockId) {
      // Check if block exists as a root script
      const rootIndex = activeSprite.scripts.findIndex((s) => s.id === existingBlockId);
      if (rootIndex !== -1) {
        // Repositioning existing root script
        const scripts = activeSprite.scripts.map((s) => {
          if (s.id === existingBlockId) {
            return { ...s, x: Math.max(20, Math.round(dropX)), y: Math.max(20, Math.round(dropY)) };
          }
          return s;
        });
        saveHistory(scripts);
      } else {
        // Detach nested block from inside a stack or C-block loop
        let extractedBlock: BlockInstance | null = null;

        const removeFromTree = (blocks: BlockInstance[]): BlockInstance[] => {
          const result: BlockInstance[] = [];
          for (let b of blocks) {
            if (b.id === existingBlockId) {
              extractedBlock = {
                ...b,
                next: undefined,
                x: Math.max(20, Math.round(dropX)),
                y: Math.max(20, Math.round(dropY)),
              };
              if (b.next) {
                result.push(b.next);
              }
              continue;
            }
            let updated = { ...b };
            if (updated.next) {
              updated.next = removeFromTree([updated.next])[0] || undefined;
            }
            if (updated.children) {
              updated.children = removeFromTree(updated.children);
            }
            if (updated.elseChildren) {
              updated.elseChildren = removeFromTree(updated.elseChildren);
            }
            result.push(updated);
          }
          return result;
        };

        const cleanedScripts = removeFromTree(activeSprite.scripts);
        if (extractedBlock) {
          saveHistory([...cleanedScripts, extractedBlock]);
        }
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent, scriptId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, scriptId });
  };

  const handleDuplicateScript = (scriptId: string) => {
    const script = activeSprite.scripts.find((s) => s.id === scriptId);
    if (!script) return;

    const cloned: BlockInstance = JSON.parse(JSON.stringify(script));
    cloned.id = `block_${Date.now()}`;
    cloned.x = (script.x || 40) + 40;
    cloned.y = (script.y || 40) + 40;

    const updated = [...activeSprite.scripts, cloned];
    saveHistory(updated);
    setContextMenu(null);
  };

  const handleDeleteScript = (scriptId: string) => {
    const updated = activeSprite.scripts.filter((s) => s.id !== scriptId);
    saveHistory(updated);
    setContextMenu(null);
  };

  const handleDragStartExisting = (e: React.DragEvent, block: BlockInstance) => {
    e.dataTransfer.setData('kms/existing_block_id', block.id);
  };

  return (
    <div
      ref={workspaceRef}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDropOnWorkspace}
      onClick={() => setContextMenu(null)}
      className="relative flex-1 bg-white h-full overflow-auto shadow-inner rounded-r-2xl border-l border-[#EEDCD0] font-sans"
      style={{
        backgroundImage: `radial-gradient(#CBD5E1 1.5px, transparent 1.5px)`,
        backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
      }}
    >
      {/* Workspace Scripts Container */}
      <div
        className="min-w-[1200px] min-h-[900px] p-8 relative transform-origin-top-left transition-transform duration-75"
        style={{ transform: `scale(${zoom})` }}
      >
        {activeSprite.scripts.map((script) => (
          <div
            key={script.id}
            onContextMenu={(e) => handleContextMenu(e, script.id)}
            className="absolute cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-purple-500 rounded-xl transition-shadow"
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

        {activeSprite.scripts.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-800 flex items-center justify-center mb-3 shadow-inner">
              <Sparkles className="w-8 h-8 text-purple-700" />
            </div>
            <p className="font-black text-base text-slate-950 font-heading">Workspace is Empty</p>
            <p className="text-xs text-slate-700 font-bold mt-1">Drag blocks from the left palette to start coding {activeSprite.name}!</p>
          </div>
        )}
      </div>

      {/* Right-Click Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-[#FFFDF9] border border-[#EEDCD0] rounded-2xl shadow-2xl py-1.5 w-48 text-xs font-black text-slate-950 font-heading"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          <button
            onClick={() => handleDuplicateScript(contextMenu.scriptId)}
            className="w-full px-3.5 py-2 text-left hover:bg-purple-100 hover:text-purple-900 flex items-center gap-2"
          >
            <Copy className="w-4 h-4 text-purple-700" />
            <span>Duplicate Script</span>
          </button>
          <button
            onClick={() => handleDeleteScript(contextMenu.scriptId)}
            className="w-full px-3.5 py-2 text-left hover:bg-rose-100 text-rose-900 flex items-center gap-2 border-t border-slate-100"
          >
            <Trash2 className="w-4 h-4 text-rose-700" />
            <span>Delete Script</span>
          </button>
        </div>
      )}

      {/* Bottom Trash Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const existingBlockId = e.dataTransfer.getData('kms/existing_block_id');
          if (existingBlockId) handleDeleteScript(existingBlockId);
        }}
        className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-4 py-2.5 bg-rose-100/80 hover:bg-rose-200 text-rose-950 border border-rose-300 rounded-2xl shadow-md text-xs font-black transition-colors font-heading"
      >
        <Trash2 className="w-4 h-4 text-rose-700" />
        <span>Drag here to delete</span>
      </div>

    </div>
  );
};
