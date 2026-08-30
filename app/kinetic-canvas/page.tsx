'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Cpu, Zap, Play, Sparkles, FolderOpen, Save, RefreshCw, Bot } from 'lucide-react';
import { BlockEditor, BlockItem } from '@/components/kinetic-canvas/BlockEditor';
import { CodeView } from '@/components/kinetic-canvas/CodeView';
import { SimulatorCanvas } from '@/components/kinetic-canvas/SimulatorCanvas';
import { AICopilot } from '@/components/kinetic-canvas/AICopilot';
import { HardwareDeploy } from '@/components/kinetic-canvas/HardwareDeploy';
import { BuddyBotGuide } from '@/components/BuddyBotGuide';
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
      
      {/* BuddyBot 3-Step Interactive Student Guide */}
      <BuddyBotGuide
        step1="Pick blocks from left toolbox 🧩"
        step2="Watch virtual robot move on track 🎮"
        step3="Plug USB & click 'Run My Robot' 🚀"
        currentStep={isSimRunning ? 2 : 1}
      />

      {/* Studio Header & Project Template Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-100 flex items-center gap-2.5">
            <span>Fun Robotics Coding Studio</span>
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
              Class 3–12 Ready
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Drag-and-drop colorful blocks to make your robot move, test in 2D simulation, and run on real board!
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

          {/* Run on Real Robot Board Button */}
          <button
            onClick={() => setDeployModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-sky-500 to-emerald-500 hover:from-amber-300 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
          >
            <Zap className="w-4 h-4" />
            <span>Run My Robot on Board 🚀</span>
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
          🧩 Visual Block Coding (Class 3+)
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'code'
              ? 'bg-sky-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          💻 Generated Python & C++ Code
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
