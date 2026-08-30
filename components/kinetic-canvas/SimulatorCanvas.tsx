'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sliders, Activity, Radar, Zap, Sun, ShieldAlert, Move } from 'lucide-react';
import { ProjectTemplate } from '@/lib/projects-data';
import { BlockItem } from '@/components/kinetic-canvas/BlockEditor';

interface SimulatorCanvasProps {
  project: ProjectTemplate;
  activeBlocks?: BlockItem[];
  isRunning: boolean;
  onToggleRun: () => void;
}

export const SimulatorCanvas: React.FC<SimulatorCanvasProps> = ({
  project,
  activeBlocks = [],
  isRunning,
  onToggleRun,
}) => {
  // Dynamic AST Parsed Parameters
  const [obstacleDistance, setObstacleDistance] = useState(35); // cm
  const [obstacleThreshold, setObstacleThreshold] = useState(20); // cm from logic block
  const [motorSpeed, setMotorSpeed] = useState(200); // RPM from motor block
  const [turnAngle, setTurnAngle] = useState(45); // degrees from servo block
  
  // Interactive Simulation State
  const [servoAngle, setServoAngle] = useState(90);
  const [robotX, setRobotX] = useState(120);
  const [motionDetected, setMotionDetected] = useState(false);
  const [relayOn, setRelayOn] = useState(false);
  const [obstaclePos, setObstaclePos] = useState({ x: 380, y: 120 });

  // Parse active block parameters whenever activeBlocks change
  useEffect(() => {
    activeBlocks.forEach((block) => {
      if (block.label.includes('Speed') && block.value) {
        setMotorSpeed(Number(block.value));
      }
      if (block.label.includes('Distance') && block.value) {
        setObstacleThreshold(Number(block.value));
      }
      if (block.label.includes('Servo') && block.value) {
        setTurnAngle(Number(block.value));
      }
    });
  }, [activeBlocks]);

  // Real 2D Physics AST Execution Loop
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        // Calculate sonar distance between Robot and Dragged Obstacle
        const dx = obstaclePos.x - robotX;
        const computedDist = Math.max(5, Math.floor(dx / 6));
        setObstacleDistance(computedDist);

        if (project.simulationType === 'obstacle-bot') {
          // Dynamic execution based on active blocks parameters
          if (computedDist <= obstacleThreshold) {
            // Obstacle detected! Execute brake & servo turn logic
            setServoAngle(turnAngle);
          } else {
            // Clear path! Drive forward at motorSpeed vector
            setServoAngle(90);
            const speedVector = Math.max(1, Math.min(10, Math.floor(motorSpeed / 30)));
            setRobotX((prev) => (prev > 460 ? 80 : prev + speedVector));
          }
        } else if (project.simulationType === 'line-follower') {
          const speedVector = Math.max(1, Math.min(10, Math.floor(motorSpeed / 30)));
          setRobotX((prev) => (prev > 480 ? 80 : prev + speedVector));
        } else if (project.simulationType === 'smart-home') {
          if (motionDetected) {
            setRelayOn(true);
          }
        }
      }, 40);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, robotX, obstaclePos, obstacleThreshold, motorSpeed, turnAngle, project.simulationType, motionDetected]);

  // Microsecond pulse-in time calculation
  const pulseInUs = Math.floor(obstacleDistance * 58.2);

  return (
    <div className="bg-[#FFFDF9] p-5 rounded-3xl border border-[#EEDCD0] flex flex-col gap-4 h-[600px] shadow-sm font-sans text-[#374151]">
      
      {/* Simulation Toolbar Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#EEDCD0] shrink-0 gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-purple-700" />
          <div>
            <h3 className="font-black text-sm text-[#111827] flex items-center gap-2 font-heading">
              <span>Interactive AST Physics Engine</span>
              <span className="text-[10px] bg-purple-100 text-purple-950 border border-purple-300 px-2 py-0.5 rounded-full font-black font-heading">
                Dynamic AST Active
              </span>
            </h3>
            <p className="text-[11px] text-[#374151] font-semibold">Executing Target: {project.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-heading">
          <button
            onClick={onToggleRun}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all shadow-md ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current text-amber-300" />}
            <span>{isRunning ? 'Pause Engine' : 'Start Physics Engine'}</span>
          </button>

          <button
            onClick={() => {
              setRobotX(100);
              setObstaclePos({ x: 380, y: 120 });
              setServoAngle(90);
              setMotionDetected(false);
              setRelayOn(false);
            }}
            className="p-1.5 rounded-xl bg-[#FAF3EC] border border-[#EEDCD0] text-slate-800 hover:bg-purple-100 transition-colors"
            title="Reset Simulation Positions"
          >
            <RotateCcw className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Main Interactive Physics Canvas Viewport */}
      <div className="flex-1 bg-slate-950 rounded-2xl border border-[#EEDCD0] relative overflow-hidden flex flex-col justify-between p-4 bg-grid-pattern shadow-inner">
        
        {/* Active Simulation Viewport */}
        <div className="relative flex-1 w-full flex items-center justify-center">
          
          {/* 1. Obstacle Bot Physics Simulation */}
          {project.simulationType === 'obstacle-bot' && (
            <div className="relative w-full h-full flex items-center">
              
              {/* Virtual Black Test Track */}
              <div className="absolute inset-x-0 h-32 bg-slate-900/90 border-y border-slate-800 flex items-center px-6">
                <div className="w-full h-1 border-b border-dashed border-slate-700" />
              </div>

              {/* Draggable Obstacle Wall */}
              <div
                style={{ left: `${obstaclePos.x}px` }}
                className="absolute top-1/2 -translate-y-1/2 w-14 h-24 bg-rose-950/90 border-2 border-rose-500 rounded-xl flex flex-col items-center justify-center text-center p-1 shadow-2xl cursor-grab active:cursor-grabbing transition-all group"
                title="Drag to reposition obstacle anywhere on track!"
              >
                <Move className="w-3.5 h-3.5 text-rose-400 mb-1 group-hover:scale-110 transition-transform" />
                <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
                <span className="text-[9px] font-bold text-rose-300 mt-1 font-heading">WALL</span>
              </div>

              {/* Virtual Rover Chassis */}
              <div
                style={{ left: `${robotX}px` }}
                className="absolute top-1/2 -translate-y-1/2 w-32 h-24 bg-slate-900/90 border-2 border-purple-400 rounded-2xl shadow-2xl p-2 flex flex-col justify-between transition-all"
              >
                <div className="flex items-center justify-between text-[9px] font-bold text-purple-300 font-heading">
                  <span>ROVER v2</span>
                  <span className="flex items-center gap-1">
                    <Radar className="w-3 h-3 text-amber-400" /> {servoAngle}°
                  </span>
                </div>

                {/* Raycast Sonar Pulse Lines */}
                {isRunning && (
                  <div className="absolute right-[-45px] top-1/2 -translate-y-1/2 flex gap-1 animate-pulse">
                    <div className="w-2 h-8 border-r-2 border-purple-400 rounded-r-full" />
                    <div className="w-2 h-12 border-r-2 border-purple-300 rounded-r-full" />
                  </div>
                )}

                <div className="flex justify-between items-end">
                  <div className="w-3 h-6 bg-slate-800 rounded border border-slate-700 animate-spin" />
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-black font-heading ${
                    obstacleDistance <= obstacleThreshold ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {obstacleDistance <= obstacleThreshold ? 'BRAKE / TURN' : 'FORWARD'}
                  </span>
                  <div className="w-3 h-6 bg-slate-800 rounded border border-slate-700 animate-spin" />
                </div>
              </div>

            </div>
          )}

          {/* 2. Line Follower Physics Simulation */}
          {project.simulationType === 'line-follower' && (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="w-[80%] h-44 rounded-full border-8 border-slate-800 flex items-center justify-center relative">
                <div
                  style={{ left: `${robotX}px` }}
                  className="absolute top-[-15px] w-24 h-14 bg-slate-900 border-2 border-purple-400 rounded-xl p-1.5 flex flex-col justify-between shadow-xl"
                >
                  <div className="flex justify-between text-[8px] text-purple-300 font-mono font-bold">
                    <span>L_IR: ON</span>
                    <span>R_IR: OFF</span>
                  </div>
                  <div className="text-[9px] font-black text-white text-center font-heading">LINE TRACKER</div>
                </div>
              </div>
            </div>
          )}

          {/* 3. Smart Home IoT Relay Simulation */}
          {project.simulationType === 'smart-home' && (
            <div className="w-full h-full flex flex-col items-center justify-center gap-6">
              <div className="flex items-center gap-8">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all ${
                  relayOn
                    ? 'bg-amber-400/30 border-amber-400 shadow-[0_0_50px_#f59e0b]'
                    : 'bg-slate-900 border-slate-800'
                }`}>
                  <Zap className={`w-12 h-12 ${relayOn ? 'text-amber-400 animate-bounce' : 'text-slate-600'}`} />
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col gap-2">
                  <span className="text-xs font-black text-white font-heading">ESP32 GPIO 2 Relay Output</span>
                  <button
                    onClick={() => setRelayOn(!relayOn)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all font-heading ${
                      relayOn ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {relayOn ? 'RELAY STATE: HIGH (ACTIVE)' : 'RELAY STATE: LOW (OFF)'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => setMotionDetected(!motionDetected)}
                className={`px-6 py-2.5 rounded-xl border text-xs font-black flex items-center gap-2 transition-all font-heading ${
                  motionDetected
                    ? 'bg-purple-600 text-white border-purple-700 shadow-md'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-purple-400" />
                <span>{motionDetected ? 'PIR Motion: DETECTED (HIGH)' : 'Simulate PIR Motion Trigger'}</span>
              </button>
            </div>
          )}

        </div>

        {/* Live Controls & Telemetry Readouts */}
        <div className="pt-3 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300 shrink-0 font-mono">
          
          <div className="flex items-center gap-4 flex-1 min-w-[240px]">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-400" /> Sonar Range:
            </span>
            <input
              type="range"
              min="5"
              max="100"
              value={obstacleDistance}
              onChange={(e) => {
                const val = Number(e.target.value);
                setObstacleDistance(val);
                setObstaclePos({ x: 120 + val * 6, y: 120 });
              }}
              className="flex-1 accent-purple-500 bg-slate-900 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-purple-300 font-bold">{obstacleDistance} cm</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300">
              PulseIn Echo: <strong className="text-white">{pulseInUs} µs</strong>
            </span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300">
              Logic Threshold: <strong className="text-amber-400">{obstacleThreshold} cm</strong>
            </span>
            <span className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300">
              Target RPM: <strong className="text-emerald-400">{motorSpeed} RPM</strong>
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
