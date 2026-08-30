'use client';

import React, { useState } from 'react';
import { Blocks, Plus, Trash2, Play, RotateCcw, Sliders } from 'lucide-react';
import { ProjectTemplate } from '@/lib/projects-data';

export interface BlockItem {
  id: string;
  type: 'event' | 'action' | 'sensor' | 'logic' | 'iot';
  label: string;
  color: string;
  value?: string | number;
  pythonSnippet?: string;
  cppSnippet?: string;
}

interface BlockEditorProps {
  project: ProjectTemplate;
  onUpdateBlocks: (blocks: BlockItem[], pythonCode: string, cppCode: string) => void;
  onRunSimulation: () => void;
}

const AVAILABLE_BLOCK_PALETTE: BlockItem[] = [
  {
    id: 'pal-1',
    type: 'event',
    label: 'When Hardware Powers ON',
    color: 'bg-amber-500',
    pythonSnippet: '# Microcontroller Setup Loop\nimport time\nfrom kite_robotics import Arduino\nboard = Arduino(port="COM3")',
    cppSnippet: 'void setup() {\n  Serial.begin(115200);'
  },
  {
    id: 'pal-2',
    type: 'sensor',
    label: 'Measure Distance (Ultrasonic cm)',
    color: 'bg-emerald-600',
    value: 20,
    pythonSnippet: 'dist = board.ultrasonic_read(trig=9, echo=10)',
    cppSnippet: 'long duration = pulseIn(10, HIGH);\nfloat dist = duration * 0.034 / 2;'
  },
  {
    id: 'pal-3',
    type: 'sensor',
    label: 'Read IR Line Tracking Sensors',
    color: 'bg-emerald-600',
    pythonSnippet: 'left_ir, right_ir = board.read_ir_pair(pin_left=2, pin_right=3)',
    cppSnippet: 'int left_ir = digitalRead(2);\nint right_ir = digitalRead(3);'
  },
  {
    id: 'pal-4',
    type: 'logic',
    label: 'If Obstacle Distance < 20cm',
    color: 'bg-purple-600',
    value: 20,
    pythonSnippet: 'if dist < 20.0:\n    board.set_motors(left=0, right=0)',
    cppSnippet: 'if (dist < 20.0) {\n  digitalWrite(2, LOW);\n}'
  },
  {
    id: 'pal-5',
    type: 'action',
    label: 'Set DC Motor Speed 200 RPM',
    color: 'bg-blue-600',
    value: 200,
    pythonSnippet: 'board.set_motor_speed(speed=200)',
    cppSnippet: 'analogWrite(5, 200);'
  },
  {
    id: 'pal-6',
    type: 'action',
    label: 'Rotate Servo Radar to 45°',
    color: 'bg-blue-600',
    value: 45,
    pythonSnippet: 'board.servo_write(pin=6, angle=45)',
    cppSnippet: 'scanServo.write(45);'
  },
  {
    id: 'pal-7',
    type: 'action',
    label: 'Steer Rover Left (Differential Speed)',
    color: 'bg-blue-600',
    pythonSnippet: 'board.steer_left(speed=180)',
    cppSnippet: 'digitalWrite(IN1, LOW);\ndigitalWrite(IN2, HIGH);'
  },
  {
    id: 'pal-8',
    type: 'iot',
    label: 'Publish Payload to MQTT Cloud',
    color: 'bg-cyan-600',
    pythonSnippet: 'mqtt.publish("kiterobotics/telemetry", {"dist": dist})',
    cppSnippet: 'mqttClient.publish("kiterobotics/telemetry", "OK");'
  }
];

export const BlockEditor: React.FC<BlockEditorProps> = ({
  project,
  onUpdateBlocks,
  onRunSimulation,
}) => {
  const [activeBlocks, setActiveBlocks] = useState<BlockItem[]>(
    (project.blockCode.blocks as BlockItem[]) || AVAILABLE_BLOCK_PALETTE.slice(0, 4)
  );

  const compileBlocksToCode = (blocks: BlockItem[]) => {
    const pyLines = [
      `# Generated Python Code from Kite Kinetic Canvas`,
      `import time`,
      `from kite_robotics import Arduino, Ultrasonic, Servo, MotorDriver`,
      ``,
      `board = Arduino(port='COM3')`,
      `print("🚀 Robot Initialized. Executing Block Stack...")`,
      ``,
      `while True:`
    ];

    const cppLines = [
      `// Generated Arduino C++ Firmware from Kite Kinetic Canvas`,
      `#include <Servo.h>`,
      ``,
      `Servo scanServo;`,
      ``,
      `void setup() {`,
      `  Serial.begin(115200);`,
      `  pinMode(9, OUTPUT); // Trig`,
      `  pinMode(10, INPUT);  // Echo`,
      `  scanServo.attach(6);`,
      `}`,
      ``,
      `void loop() {`
    ];

    blocks.forEach((b) => {
      if (b.pythonSnippet) pyLines.push(`    ${b.pythonSnippet}`);
      if (b.cppSnippet) cppLines.push(`  ${b.cppSnippet}`);
    });

    pyLines.push(`    time.sleep(0.05)`);
    cppLines.push(`  delay(50);\n}`);

    return { pyCode: pyLines.join('\n'), cppCode: cppLines.join('\n') };
  };

  const handleAddBlock = (block: BlockItem) => {
    const newBlock = { ...block, id: `block-${Date.now()}` };
    const updated = [...activeBlocks, newBlock];
    setActiveBlocks(updated);
    const { pyCode, cppCode } = compileBlocksToCode(updated);
    onUpdateBlocks(updated, pyCode, cppCode);
  };

  const handleUpdateValue = (id: string, newVal: number) => {
    const updated = activeBlocks.map((b) => {
      if (b.id === id) {
        return {
          ...b,
          value: newVal,
          label: b.label.replace(/\d+/, String(newVal)),
          pythonSnippet: b.pythonSnippet?.replace(/\d+/, String(newVal)),
          cppSnippet: b.cppSnippet?.replace(/\d+/, String(newVal)),
        };
      }
      return b;
    });
    setActiveBlocks(updated);
    const { pyCode, cppCode } = compileBlocksToCode(updated);
    onUpdateBlocks(updated, pyCode, cppCode);
  };

  const handleRemoveBlock = (id: string) => {
    const updated = activeBlocks.filter((b) => b.id !== id);
    setActiveBlocks(updated);
    const { pyCode, cppCode } = compileBlocksToCode(updated);
    onUpdateBlocks(updated, pyCode, cppCode);
  };

  const handleClearBlocks = () => {
    setActiveBlocks([]);
    const { pyCode, cppCode } = compileBlocksToCode([]);
    onUpdateBlocks([], pyCode, cppCode);
  };

  return (
    <div className="bg-[#FFFDF9] p-5 rounded-3xl border border-[#EEDCD0] flex flex-col gap-4 h-[600px] shadow-sm font-sans text-[#374151]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#EEDCD0] shrink-0">
        <div className="flex items-center gap-2">
          <Blocks className="w-5 h-5 text-purple-700" />
          <h3 className="font-black text-sm text-[#111827] font-heading">Visual Block-Code Canvas</h3>
          <span className="text-[10px] bg-purple-100 text-purple-950 border border-purple-300 px-2 py-0.5 rounded-full font-black font-heading">
            Live AST Compiler
          </span>
        </div>

        <div className="flex items-center gap-2 font-heading">
          <button
            onClick={handleClearBlocks}
            className="p-1.5 rounded-xl bg-[#FAF3EC] border border-[#EEDCD0] text-slate-800 hover:bg-purple-100 transition-colors"
            title="Clear Workspace"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-700" />
          </button>

          <button
            onClick={onRunSimulation}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-md hover:bg-emerald-700 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current text-amber-300" />
            <span>Run Logic</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden">
        
        {/* Block Palette (Left 4 cols) */}
        <div className="md:col-span-4 bg-[#FAF3EC] p-3.5 rounded-2xl border border-[#EEDCD0] flex flex-col gap-3 overflow-y-auto shadow-sm">
          <span className="text-[11px] font-black uppercase text-[#111827] tracking-wider font-heading">
            Block Toolbox (Click to Add)
          </span>

          <div className="space-y-2">
            {AVAILABLE_BLOCK_PALETTE.map((block) => (
              <button
                key={block.id}
                onClick={() => handleAddBlock(block)}
                className={`w-full p-2.5 rounded-xl ${block.color} text-white text-xs font-black text-left flex items-center justify-between shadow-md hover:scale-[1.02] transition-transform font-heading`}
              >
                <span className="truncate">{block.label}</span>
                <Plus className="w-4 h-4 shrink-0 opacity-90" />
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Canvas Stack (Right 8 cols) */}
        <div className="md:col-span-8 bg-[#FAF3EC] p-4 rounded-2xl border border-[#EEDCD0] flex flex-col gap-3 overflow-y-auto bg-grid-pattern relative shadow-sm">
          
          <div className="flex items-center justify-between text-xs text-[#374151] pb-2 border-b border-[#EEDCD0] font-semibold">
            <span className="font-black text-[#111827] font-heading">Program Execution Stack ({activeBlocks.length} blocks)</span>
            <span className="text-[10px] text-purple-900 font-mono font-bold">AST Real-Time Linked</span>
          </div>

          <div className="space-y-2.5 flex-1">
            {activeBlocks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 text-xs py-12 font-semibold">
                <Blocks className="w-10 h-10 text-purple-700 mb-2 animate-bounce" />
                <p>Your workspace is empty! Click blocks on the left to start coding your robot.</p>
              </div>
            ) : (
              activeBlocks.map((block, idx) => (
                <div
                  key={block.id}
                  className={`p-3 rounded-xl ${block.color} text-white font-black text-xs flex items-center justify-between shadow-md border border-white/20 font-heading`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center text-[10px] font-mono">
                      {idx + 1}
                    </span>
                    <span>{block.label}</span>

                    {/* Editable parameter input if block has numeric value */}
                    {block.value !== undefined && (
                      <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded border border-white/30 text-[11px] ml-auto mr-2">
                        <Sliders className="w-3 h-3 text-amber-300" />
                        <input
                          type="number"
                          value={block.value}
                          onChange={(e) => handleUpdateValue(block.id, Number(e.target.value))}
                          className="w-12 bg-transparent text-white font-mono font-bold focus:outline-none text-center"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleRemoveBlock(block.id)}
                    className="p-1 rounded bg-black/20 hover:bg-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
