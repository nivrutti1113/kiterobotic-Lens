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
  const [gradeMode, setGradeMode] = useState<'junior' | 'senior'>('junior');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [askPrompt, setAskPrompt] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [showPythonDrawer, setShowPythonDrawer] = useState<boolean>(false);

  // Load project on mount
  useEffect(() => {
    const loaded = loadProjectFromStorage();
    setProject(loaded);
    if (loaded.sprites.length > 0) {
      setActiveSpriteId(loaded.sprites[0].id);
    }
  }, []);

  // Subscribe to interpreter engine state updates
  useEffect(() => {
    interpreterEngine.subscribeStateChange((running) => setIsRunning(running));
    interpreterEngine.subscribeAskPrompt((prompt) => setAskPrompt(prompt));

    // Listen for physical keyboard key presses to trigger 'When key pressed' blocks
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

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF3EC] text-slate-900 font-sans select-none">
      
      {/* Top Header Bar */}
      <TopBar
        project={project}
        gradeMode={gradeMode}
        showPythonDrawer={showPythonDrawer}
        onGradeModeChange={setGradeMode}
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
      />

      {/* Studio Core Body: Responsive 3-Column / Stacking Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-3 gap-3">
        
        {/* Left Palette & Center Workspace Container */}
        <div className="flex-1 flex flex-col sm:flex-row bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden min-h-[500px]">
          
          {/* Palette Column */}
          <div className="w-full sm:w-72 h-72 sm:h-auto shrink-0">
            <BlockPalette
              gradeMode={gradeMode}
              onDragStartBlockTemplate={handleDragStartBlockTemplate}
            />
          </div>

          {/* Workspace Column */}
          <div className="flex-1 h-96 sm:h-auto">
            {activeSprite ? (
              <Workspace
                activeSprite={activeSprite}
                onUpdateSpriteScripts={handleUpdateSpriteScripts}
                onInputChange={handleBlockInputChange}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Select a sprite to start coding
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Stage & Sprite Panel */}
        <div className="w-full md:w-[420px] flex flex-col gap-3 shrink-0">
          
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
            onToggleFullscreen={() => {
              const el = document.documentElement;
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                el.requestFullscreen();
              }
            }}
          />

        </div>

        {/* Senior Mode Read-Only Python Drawer */}
        {gradeMode === 'senior' && activeSprite && (
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
