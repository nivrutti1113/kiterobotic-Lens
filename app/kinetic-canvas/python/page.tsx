'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Code, ArrowLeft, Play, RotateCcw, Download, Terminal, Layers, CheckCircle2, Sparkles, Variable, Eye } from 'lucide-react';
import { executePythonCode, PythonExecutionResult } from '@/lib/python-interpreter';

const PYTHON_PRESETS = [
  {
    id: 'basics',
    name: '1. Variables & Grade Calculator',
    code: `# KMS-AI Python Basics (Class 8-12 CBSE)
student_name = "Aarav Sharma"
math_score = 92
science_score = 88
coding_score = 96

total_marks = math_score + science_score + coding_score
average_percentage = total_marks / 3

print("Student Report Card:", student_name)
print("Total Marks Obtained:", total_marks, "/ 300")
print("Average Percentage:", round(average_percentage, 2), "%")

if average_percentage >= 90:
    print("Grade Result: A+ (Outstanding Performance!)")
elif average_percentage >= 80:
    print("Grade Result: A (Excellent Job!)")
else:
    print("Grade Result: B (Good Effort!)")
`,
  },
  {
    id: 'fibonacci',
    name: '2. Fibonacci Series & Prime Numbers',
    code: `# KMS-AI Fibonacci & Number Logic
print("Generating Fibonacci Series (First 10 Numbers):")

a = 0
b = 1
fib_sequence = []

for i in range(10):
    fib_sequence.append(a)
    temp = a + b
    a = b
    b = temp

print("Fibonacci List:", fib_sequence)

def is_prime(num):
    if num < 2:
        return False
    for i in range(2, num):
        if num % i == 0:
            return False
    return True

print("Checking Primes in Fibonacci List:")
for val in fib_sequence:
    if is_prime(val):
        print(" ->", val, "is a PRIME number!")
`,
  },
  {
    id: 'turtle',
    name: '3. Turtle Graphics Geometric Art',
    code: `# KMS-AI Turtle Graphics Renderer
import turtle

print("Rendering Turtle Spiral Geometry...")

turtle.color("#7C3AED")

for i in range(36):
    turtle.forward(80)
    turtle.right(170)
    turtle.forward(80)
    turtle.right(170)

print("Turtle Canvas Drawing Completed!")
`,
  },
  {
    id: 'dict',
    name: '4. Student Dictionary Data Structure',
    code: `# KMS-AI Python Dictionary Data Structure
students_db = {
    "101": "Ananya Patel - Robotics Lead",
    "102": "Rohan Verma - AI Vision Specialist",
    "103": "Priya Nair - Hardware Architect"
}

print("School Student Registry Database:")
for roll, info in students_db.items():
    print("Roll No", roll, ":", info)

print("Total Students Registered:", len(students_db))
`,
  },
  {
    id: 'mandala',
    name: '5. Turtle Hexagon Mandala Pattern',
    code: `# KMS-AI Turtle Hexagon Pattern Art
import turtle

print("Drawing 12-Sided Mandala Geometry...")
turtle.color("#10B981")

for step in range(12):
    for i in range(6):
        turtle.forward(60)
        turtle.right(60)
    turtle.right(30)

print("Mandala Pattern Rendered Successfully!")
`,
  },
];

export default function PythonStudioPage() {
  const [selectedPreset, setSelectedPreset] = useState(PYTHON_PRESETS[0]);
  const [code, setCode] = useState(PYTHON_PRESETS[0].code);
  const [execResult, setExecResult] = useState<PythonExecutionResult>({
    logs: ['[PYTHON 3.11 INTERPRETER READY]', 'Click "Run Python Script" to execute code'],
    variables: {},
    error: null,
    turtleCommands: [],
  });
  const [isExecuting, setIsExecuting] = useState(false);

  const turtleCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleRun = () => {
    setIsExecuting(true);
    setTimeout(() => {
      const res = executePythonCode(code);
      setExecResult(res);
      setIsExecuting(false);
    }, 150);
  };

  // Render Turtle Graphics commands on canvas
  useEffect(() => {
    const canvas = turtleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;

    // Grid lines
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    if (!execResult.turtleCommands || execResult.turtleCommands.length === 0) return;

    let posX = canvas.width / 2;
    let posY = canvas.height / 2;
    let headingDeg = 0;
    let strokeColor = '#7C3AED';

    ctx.lineWidth = 3;
    ctx.strokeStyle = strokeColor;

    execResult.turtleCommands.forEach((cmd) => {
      if (cmd.action === 'color' && cmd.color) {
        strokeColor = cmd.color;
        ctx.strokeStyle = strokeColor;
      } else if (cmd.action === 'right' && cmd.value) {
        headingDeg += cmd.value;
      } else if (cmd.action === 'left' && cmd.value) {
        headingDeg -= cmd.value;
      } else if (cmd.action === 'forward' && cmd.value) {
        const rad = (headingDeg * Math.PI) / 180;
        const nextX = posX + cmd.value * Math.cos(rad);
        const nextY = posY + cmd.value * Math.sin(rad);

        ctx.beginPath();
        ctx.moveTo(posX, posY);
        ctx.lineTo(nextX, nextY);
        ctx.stroke();

        posX = nextX;
        posY = nextY;
      } else if (cmd.action === 'backward' && cmd.value) {
        const rad = (headingDeg * Math.PI) / 180;
        const nextX = posX - cmd.value * Math.cos(rad);
        const nextY = posY - cmd.value * Math.sin(rad);

        ctx.beginPath();
        ctx.moveTo(posX, posY);
        ctx.lineTo(nextX, nextY);
        ctx.stroke();

        posX = nextX;
        posY = nextY;
      }
    });

    // Draw Turtle Pointer Arrow
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(posX, posY, 6, 0, Math.PI * 2);
    ctx.fill();
  }, [execResult]);

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `kms_python_script.py`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#FAF3EC] text-slate-900 flex flex-col font-sans select-none">
      
      {/* Header */}
      <header className="bg-[#FFFDF9] border-b-2 border-[#EEDCD0] px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/kinetic-canvas"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100/90 hover:bg-purple-200 text-purple-950 font-black text-xs transition-colors border border-purple-300 shadow-sm font-heading"
          >
            <ArrowLeft className="w-4 h-4 text-purple-700" />
            <span>← Back to Dashboard</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black shadow-sm">
              <Code className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="font-black text-base text-slate-950 font-heading">Python Coding Platform</h1>
              <p className="text-[11px] font-bold text-slate-600">Text-Based Python 3.11 IDE & Turtle Renderer</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-950 rounded-xl text-xs font-black transition-colors border border-purple-300 font-heading"
          >
            <Download className="w-4 h-4 text-purple-700" />
            <span>Download .py</span>
          </button>

          <button
            onClick={handleRun}
            disabled={isExecuting}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-lg font-heading"
          >
            <Play className="w-4 h-4 fill-current text-amber-300" />
            <span>▶ Run Python Code</span>
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        
        {/* Left Preset Drawer */}
        <div className="w-full lg:w-72 bg-[#FFFDF9] rounded-2xl border-2 border-[#EEDCD0] p-4 shadow-md flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-2.5 flex items-center gap-1.5 font-heading">
              <Layers className="w-4 h-4 text-purple-700" />
              <span>Curriculum Python Presets</span>
            </h3>
            <div className="space-y-2">
              {PYTHON_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPreset(preset);
                    setCode(preset.code);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-black transition-all border font-heading ${
                    selectedPreset.id === preset.id
                      ? 'bg-purple-100 text-purple-950 border-purple-400 shadow-sm'
                      : 'bg-[#FAF3EC] hover:bg-purple-50 border-[#EEDCD0] text-slate-800'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Variable Inspector Box */}
          <div className="border-t border-[#EEDCD0] pt-3">
            <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-heading">
              <Variable className="w-4 h-4 text-emerald-600" />
              <span>Live Variable State</span>
            </h3>
            <div className="bg-[#FAF3EC] rounded-xl p-3 border border-[#EEDCD0] text-xs font-bold text-slate-800 max-h-48 overflow-y-auto space-y-1">
              {Object.keys(execResult.variables).length > 0 ? (
                Object.entries(execResult.variables).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="font-mono text-purple-700 font-bold">{k}:</span>
                    <span className="font-mono text-emerald-700">{v}</span>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-500 italic">No variables stored yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Center Python Editor */}
        <div className="flex-1 flex flex-col bg-[#1E1E1E] rounded-2xl border-2 border-slate-800 shadow-xl overflow-hidden min-h-[420px]">
          <div className="bg-[#2D2D2D] px-4 py-2 border-b border-slate-700 flex items-center justify-between text-xs text-slate-300 font-mono">
            <span className="font-bold text-amber-400">main.py</span>
            <span className="text-[10px] text-slate-400">Standard Python 3.11</span>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-[#1E1E1E] text-emerald-400 font-mono text-sm p-4 focus:outline-none resize-none leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Right Output Terminal & Turtle Canvas */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          
          {/* Terminal Console */}
          <div className="flex-1 bg-[#0F172A] rounded-2xl border-2 border-slate-800 p-4 shadow-xl flex flex-col min-h-[220px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
              <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5 font-heading">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Console stdout / Log</span>
              </h3>
              <button
                onClick={() => setExecResult((r) => ({ ...r, logs: [] }))}
                className="text-[10px] text-slate-400 hover:text-white font-bold"
              >
                Clear
              </button>
            </div>
            <div className="font-mono text-xs text-emerald-400 space-y-1.5 overflow-y-auto max-h-56">
              {execResult.logs.map((log, i) => (
                <div key={i} className="leading-snug">{log}</div>
              ))}
            </div>
          </div>

          {/* Turtle Canvas Viewer */}
          <div className="bg-white rounded-2xl border-2 border-[#EEDCD0] p-3 shadow-md space-y-2">
            <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider flex items-center gap-1.5 font-heading">
              <Eye className="w-4 h-4 text-purple-700" />
              <span>Turtle Graphics Screen</span>
            </h4>
            <canvas
              ref={turtleCanvasRef}
              width={350}
              height={180}
              className="w-full h-44 bg-slate-50 rounded-xl border border-slate-200"
            />
          </div>

        </div>

      </div>

    </div>
  );
}
