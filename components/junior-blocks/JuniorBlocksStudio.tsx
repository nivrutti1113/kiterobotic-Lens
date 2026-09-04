'use client';

import React, { useState, useEffect } from 'react';
import { Project, Sprite, BlockInstance } from '@/lib/junior-blocks/types';
import {
  createDefaultProject,
  loadProjectFromStorage,
  saveProjectToStorage,
  exportProjectAsJSON,
} from '@/lib/junior-blocks/storage';
import { interpreterEngine } from '@/lib/junior-blocks/interpreter';
import { TopBar } from './TopBar';
import { BlockPalette } from './BlockPalette';
import { Workspace } from './Workspace';
import { StageCanvas } from './StageCanvas';
import { SpriteScenePanel } from './SpriteScenePanel';
import { HelpModal } from './HelpModal';
import { PythonCodeDrawer } from './PythonCodeDrawer';

export function JuniorBlocksStudio() {
  const [project, setProject] = useState<Project>(createDefaultProject);
  const [activeSpriteId, setActiveSpriteId] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [askPrompt, setAskPrompt] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [showPythonDrawer, setShowPythonDrawer] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [workspaceActions, setWorkspaceActions] = useState<{
    zoomIn?: () => void;
    zoomOut?: () => void;
    resetZoom?: () => void;
    undo?: () => void;
    redo?: () => void;
    cleanUp?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
  }>({});

  // Load project on mount
  useEffect(() => {
    const loaded = loadProjectFromStorage();
    setProject(loaded);
    if (loaded.sprites.length > 0) {
      setActiveSpriteId(loaded.sprites[0].id);
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Subscribe to interpreter engine state updates
  useEffect(() => {
    interpreterEngine.subscribeStateChange((running) => setIsRunning(running));
    interpreterEngine.subscribeAskPrompt((prompt) => setAskPrompt(prompt));

    const handleKeyDown = (e: KeyboardEvent) => {
      interpreterEngine.runProject(
        project,
        (updatedProj) => setProject({ ...updatedProj }),
        'key',
        { key: e.key }
      );
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project]);

  // Debounced auto-save project changes to localStorage
  useEffect(() => {
    const timeout = setTimeout(() => {
      saveProjectToStorage(project);
    }, 500);
    return () => clearTimeout(timeout);
  }, [project]);

  const activeSprite = project.sprites.find((s) => s.id === activeSpriteId) || project.sprites[0];

  const handleUpdateSpriteScripts = (spriteId: string, scripts: BlockInstance[]) => {
    setProject((prev) => ({
      ...prev,
      sprites: prev.sprites.map((s) => (s.id === spriteId ? { ...s, scripts } : s)),
    }));
  };

  const handleBlockInputChange = (blockId: string, inputName: string, value: number | string | BlockInstance) => {
    if (!activeSprite) return;

    const updateInTree = (blocks: BlockInstance[]): BlockInstance[] => {
      return blocks.map((b) => {
        if (b.id === blockId) {
          return {
            ...b,
            inputs: { ...b.inputs, [inputName]: value },
          };
        }
        let updated = { ...b };
        if (updated.next) {
          updated.next = updateInTree([updated.next])[0];
        }
        if (updated.children) {
          updated.children = updateInTree(updated.children);
        }
        if (updated.elseChildren) {
          updated.elseChildren = updateInTree(updated.elseChildren);
        }
        return updated;
      });
    };

    const updatedScripts = updateInTree(activeSprite.scripts);
    handleUpdateSpriteScripts(activeSprite.id, updatedScripts);
  };

  const handleDragStartBlockTemplate = (e: React.DragEvent, blockType: string) => {
    e.dataTransfer.setData('kms/block_type', blockType);
  };

  const handleToggleRun = () => {
    if (isRunning) {
      interpreterEngine.stopAll();
    } else {
      interpreterEngine.runProject(project, (updatedProj) => {
        setProject({ ...updatedProj });
      }, 'flag');
    }
  };

  const handleRestart = () => {
    interpreterEngine.stopAll();
    const defaultProj = createDefaultProject();
    setProject((prev) => ({
      ...prev,
      sprites: prev.sprites.map((s) => {
        const found = defaultProj.sprites.find((d) => d.id === s.id);
        return {
          ...s,
          x: found ? found.x : 0,
          y: found ? found.y : 0,
          rotation: 0,
          size: 100,
          visible: true,
          sayBubble: null,
        };
      }),
    }));
  };

  const handleTakeScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '_')}_screenshot.png`;
    a.click();
  };

  const handleAddSprite = (newSprite: Sprite) => {
    setProject((prev) => ({
      ...prev,
      sprites: [...prev.sprites, newSprite],
    }));
    setActiveSpriteId(newSprite.id);
  };

  const handleDeleteSprite = (spriteId: string) => {
    if (project.sprites.length <= 1) return;
    const remaining = project.sprites.filter((s) => s.id !== spriteId);
    setProject((prev) => ({
      ...prev,
      sprites: remaining,
    }));
    setActiveSpriteId(remaining[0].id);
  };

  const handleToggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    }
  };

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#FAF9FC] w-screen h-screen flex flex-col overflow-hidden select-none'
          : 'flex flex-col h-[calc(100vh-5rem)] min-h-[680px] w-full bg-[#FAF9FC] text-slate-900 font-sans select-none rounded-3xl border border-slate-200 shadow-xl overflow-hidden'
      }
    >
      
      {/* 1. TOP HEADER BAR: PictoBlox 2-Row Header (Main Header + Editor Sub-Header Row) */}
      <TopBar
        project={project}
        showPythonDrawer={showPythonDrawer}
        onTogglePythonDrawer={() => setShowPythonDrawer(!showPythonDrawer)}
        onNewProject={() => {
          const fresh = createDefaultProject();
          setProject(fresh);
          setActiveSpriteId(fresh.sprites[0].id);
        }}
        onSaveProject={() => saveProjectToStorage(project)}
        onLoadProject={() => setProject(loadProjectFromStorage())}
        onExportProject={() => exportProjectAsJSON(project)}
        onLoadExampleProject={(exProj) => {
          setProject(exProj);
          if (exProj.sprites.length > 0) setActiveSpriteId(exProj.sprites[0].id);
        }}
        onOpenHelp={() => setHelpOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onZoomIn={workspaceActions.zoomIn}
        onZoomOut={workspaceActions.zoomOut}
        onResetZoom={workspaceActions.resetZoom}
        onUndo={workspaceActions.undo}
        onRedo={workspaceActions.redo}
        onCleanUp={workspaceActions.cleanUp}
        canUndo={workspaceActions.canUndo}
        canRedo={workspaceActions.canRedo}
      />

      {/* 2. CORE STUDIO BODY: Authentic PictoBlox 3-Column IDE Layout */}
      <div className="flex-1 flex flex-col md:flex-row gap-0 min-h-0 overflow-hidden bg-[#FAF9FC]">
        
        {/* COLUMN 1: Left Block Palette Sidebar (Fixed Width ~280px) */}
        <div className="w-full md:w-[280px] h-64 md:h-full shrink-0 overflow-hidden flex flex-col z-10">
          <BlockPalette
            onDragStartBlockTemplate={handleDragStartBlockTemplate}
          />
        </div>

        {/* COLUMN 2: Large Block Workspace Canvas (Fluid Center Width & Height) */}
        <div className="flex-1 overflow-hidden min-h-0 relative flex flex-col min-w-0">
          {activeSprite ? (
            <Workspace
              activeSprite={activeSprite}
              onUpdateSpriteScripts={handleUpdateSpriteScripts}
              onInputChange={handleBlockInputChange}
              onRegisterActions={setWorkspaceActions}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500 font-bold">
              Select a sprite to start coding
            </div>
          )}
        </div>

        {/* COLUMN 3: Stage Preview Canvas & Sprites Panel (Fixed Width ~340px) */}
        <div className="w-full md:w-[340px] flex flex-col gap-2.5 shrink-0 overflow-y-auto max-h-full p-2.5 bg-slate-100/60 border-l border-slate-200/80 min-w-0">
          <StageCanvas
            project={project}
            activeSpriteId={activeSpriteId}
            gridVisible={project.gridVisible}
            isRunning={isRunning}
            askPrompt={askPrompt}
            onToggleRun={handleToggleRun}
            onRestart={handleRestart}
            onTakeScreenshot={handleTakeScreenshot}
            onToggleGrid={() => setProject((prev) => ({ ...prev, gridVisible: !prev.gridVisible }))}
            onSubmitAnswer={(ans) => interpreterEngine.submitAnswer(ans)}
            onSelectSprite={setActiveSpriteId}
            onSpriteClickTrigger={(sId) => {
              interpreterEngine.runProject(
                project,
                (updated) => setProject({ ...updated }),
                'click',
                { spriteId: sId }
              );
            }}
          />

          <SpriteScenePanel
            project={project}
            activeSpriteId={activeSpriteId}
            onSelectSprite={setActiveSpriteId}
            onAddSprite={handleAddSprite}
            onDeleteSprite={handleDeleteSprite}
            onChangeBackdrop={(bgId) => setProject((prev) => ({ ...prev, backdropUrl: bgId }))}
          />
        </div>

        {/* Read-Only Python Code Drawer */}
        {activeSprite && (
          <PythonCodeDrawer
            activeSprite={activeSprite}
            isOpen={showPythonDrawer}
            onClose={() => setShowPythonDrawer(false)}
          />
        )}

      </div>

      {/* Searchable Help Modal */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

    </div>
  );
}
