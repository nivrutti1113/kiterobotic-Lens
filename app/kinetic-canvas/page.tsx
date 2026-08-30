'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Cpu, Zap, Play, Sparkles, FolderOpen, Save, RefreshCw } from 'lucide-react';
import { BlockEditor, BlockItem } from '@/components/kinetic-canvas/BlockEditor';
import { CodeView } from '@/components/kinetic-canvas/CodeView';
import { SimulatorCanvas } from '@/components/kinetic-canvas/SimulatorCanvas';
import { AICopilot } from '@/components/kinetic-canvas/AICopilot';
import { HardwareDeploy } from '@/components/kinetic-canvas/HardwareDeploy';
import { PROJECT_TEMPLATES, ProjectTemplate } from '@/lib/projects-data';

function StudioContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams ? searchParams.get('template') : null;

  const initialProject = PROJECT_TEMPLATES.find((p) => p.id === templateId) || PROJECT_TEMPLATES[0];

  const [activeProject, setActiveProject] = useState<ProjectTemplate>(initialProject);
  const [activeTab, setActiveTab] = useState<'blocks' | 'code'>('blocks');
  const [isSimRunning, setIsSimRunning] = useState(false);
  const [deployModalOpen, setDeployModalOpen] = useState(false);

  const [activeBlocks, setActiveBlocks] = useState<BlockItem[]>(
    (initialProject.blockCode.blocks as BlockItem[]) || []
  );
  const [customPython, setCustomPython] = useState<string>(initialProject.generatedPython);
  const [customCpp, setCustomCpp] = useState<string>(initialProject.generatedCpp);

  const handleSelectTemplate = (proj: ProjectTemplate) => {
    setActiveProject(proj);
    setActiveBlocks((proj.blockCode.blocks as BlockItem[]) || []);
    setCustomPython(proj.generatedPython);
    setCustomCpp(proj.generatedCpp);
    setIsSimRunning(false);
  };

  const handleUpdateBlocks = (blocks: BlockItem[], pythonCode: string, cppCode: string) => {
    setActiveBlocks(blocks);
    setCustomPython(pythonCode);
    setCustomCpp(cppCode);
  };

  const handleApplyCopilotFix = (fixedCode: string) => {
    setCustomPython(fixedCode);
    setActiveTab('code');
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header & Project Template Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-100 flex items-center gap-2.5">
            <span>Kinetic Canvas Studio</span>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-2.5 py-0.5 rounded-full font-bold">
              AST Physics Engine Active
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Build logic with drag-and-drop blocks or Python/C++, test virtually in simulation, and flash to real hardware via WebSerial.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Template Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1.5 text-xs">
            <FolderOpen className="w-4 h-4 text-sky-400 ml-1" />
            <select
              value={activeProject.id}
              onChange={(e) => {
                const found = PROJECT_TEMPLATES.find((p) => p.id === e.target.value);
                if (found) handleSelectTemplate(found);
              }}
              className="bg-transparent text-slate-100 font-bold focus:outline-none cursor-pointer pr-2"
            >
              {PROJECT_TEMPLATES.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.title} ({p.targetGradeBand})
                </option>
              ))}
            </select>
          </div>

          {/* Flash Hardware Button */}
          <button
            onClick={() => setDeployModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-slate-950 font-extrabold text-xs shadow-md shadow-sky-500/20 transition-all hover:scale-105"
          >
            <Zap className="w-4 h-4" />
            <span>One-Click Deploy USB ⚡</span>
          </button>

        </div>
      </div>

      {/* Editor View Tabs: Visual Blocks vs Code View */}
      <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('blocks')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'blocks'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Visual Block Coding
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'code'
              ? 'bg-sky-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Generated Python & C++ Code
        </button>
      </div>

      {/* Main Studio Dual Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Workspace Column (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {activeTab === 'blocks' ? (
            <BlockEditor
              project={activeProject}
              onUpdateBlocks={handleUpdateBlocks}
              onRunSimulation={() => setIsSimRunning(true)}
            />
          ) : (
            <CodeView
              project={activeProject}
              customPython={customPython}
              customCpp={customCpp}
            />
          )}

          <AICopilot
            project={activeProject}
            onApplyFix={handleApplyCopilotFix}
          />
        </div>

        {/* Right Simulator Column (6 cols) */}
        <div className="lg:col-span-6">
          <SimulatorCanvas
            project={activeProject}
            activeBlocks={activeBlocks}
            isRunning={isSimRunning}
            onToggleRun={() => setIsSimRunning(!isSimRunning)}
          />
        </div>

      </div>

      {/* WebSerial Deployment Modal */}
      <HardwareDeploy
        code={customCpp || customPython || activeProject.generatedCpp}
        isOpen={deployModalOpen}
        onClose={() => setDeployModalOpen(false)}
      />

    </div>
  );
}

export default function KineticCanvasPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sky-400 font-bold text-sm">Loading Studio...</div>}>
      <StudioContent />
    </Suspense>
  );
}
