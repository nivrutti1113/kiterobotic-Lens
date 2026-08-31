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
import { BottomToolbar } from './BottomToolbar';
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
          ? 'fixed inset-0 z-50 bg-[#FAF3EC] w-screen h-screen flex flex-col overflow-hidden select-none'
          : 'flex flex-col h-[calc(100vh-6rem)] min-h-[680px] w-full bg-[#FAF3EC] text-slate-900 font-sans select-none rounded-3xl border-2 border-[#EEDCD0] shadow-xl overflow-hidden'
      }
    >
      
      {/* Top Header Bar with File Menu, Example Projects & Fullscreen Minimize Toggle */}
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
      />

      {/* Studio Core Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-2.5 gap-2.5 min-h-0">
        
        {/* Left Palette & Center Workspace Container */}
        <div className="flex-1 flex flex-col sm:flex-row bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] shadow-sm overflow-hidden min-h-0">
          
          {/* Palette Column */}
          <div className="w-full sm:w-72 h-64 sm:h-full shrink-0 border-r border-[#EEDCD0] overflow-hidden">
            <BlockPalette
              onDragStartBlockTemplate={handleDragStartBlockTemplate}
            />
          </div>

          {/* Workspace Column */}
          <div className="flex-1 h-full min-h-0 relative overflow-hidden">
            {activeSprite ? (
              <Workspace
                activeSprite={activeSprite}
                onUpdateSpriteScripts={handleUpdateSpriteScripts}
                onInputChange={handleBlockInputChange}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500 font-bold">
                Select a sprite to start coding
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Stage & Sprite Panel */}
        <div className="w-full md:w-[400px] flex flex-col gap-2.5 shrink-0 overflow-y-auto max-h-full">
          
          <StageCanvas
            project={project}
            activeSpriteId={activeSpriteId}
            gridVisible={project.gridVisible}
            askPrompt={askPrompt}
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

          <BottomToolbar
            isRunning={isRunning}
            gridVisible={project.gridVisible}
            onToggleRun={handleToggleRun}
            onRestart={handleRestart}
            onTakeScreenshot={handleTakeScreenshot}
            onToggleGrid={() => setProject((prev) => ({ ...prev, gridVisible: !prev.gridVisible }))}
            onToggleFullscreen={handleToggleFullscreen}
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
