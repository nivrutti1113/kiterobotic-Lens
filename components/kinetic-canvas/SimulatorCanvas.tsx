'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sliders, Activity, Radar, Bot, Zap, Sun, ShieldAlert } from 'lucide-react';
import { ProjectTemplate } from '@/lib/projects-data';

interface SimulatorCanvasProps {
  project: ProjectTemplate;
  isRunning: boolean;
  onToggleRun: () => void;
}

export const SimulatorCanvas: React.FC<SimulatorCanvasProps> = ({
  project,
  isRunning,
  onToggleRun,
}) => {
  const [obstacleDistance, setObstacleDistance] = useState(35); // cm
  const [servoAngle, setServoAngle] = useState(90); // degrees
  const [robotX, setRobotX] = useState(150); // px
  const [motionDetected, setMotionDetected] = useState(false);
  const [lightOn, setLightOn] = useState(false);

  // Simulation Loop Effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        if (project.simulationType === 'obstacle-bot') {
          if (obstacleDistance < 20) {
            setServoAngle(45); // Turn radar right
          } else {
            setServoAngle(90); // Center radar
            setRobotX((prev) => (prev > 450 ? 100 : prev + 4));
          }
        } else if (project.simulationType === 'line-follower') {
          setRobotX((prev) => (prev > 480 ? 80 : prev + 5));
        } else if (project.simulationType === 'smart-home') {
          if (motionDetected) {
            setLightOn(true);
          }
        }
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, obstacleDistance, project.simulationType, motionDetected]);

  return (
    <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col gap-5 h-[600px]">
      
      {/* Simulation Toolbar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="font-bold text-sm text-white">Interactive 2D Physics Simulator</h3>
            <p className="text-[11px] text-gray-400">Simulation Target: {project.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleRun}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-gray-950 shadow-amber-500/20'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-gray-950 shadow-emerald-500/20'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'Pause Sim' : 'Start Sim'}</span>
          </button>

          <button
            onClick={() => {
              setRobotX(100);
              setObstacleDistance(35);
              setServoAngle(90);
              setMotionDetected(false);
              setLightOn(false);
            }}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Simulation Interactive Canvas Viewport */}
      <div className="flex-1 bg-gray-950 rounded-2xl border border-gray-800 relative overflow-hidden flex flex-col justify-between p-4 bg-grid-pattern">
        
        {/* Canvas Display according to simulationType */}
        <div className="relative flex-1 w-full flex items-center justify-center">
          
          {/* 1. Obstacle Bot Simulation */}
          {project.simulationType === 'obstacle-bot' && (
            <div className="relative w-full h-full flex items-center">
              
              {/* Virtual Black Track */}
              <div className="absolute inset-x-0 h-32 bg-gray-900/80 border-y border-gray-800 flex items-center px-6">
                <div className="w-full h-1 border-b border-dashed border-gray-700" />
              </div>

              {/* Virtual Obstacle Box */}
              <div
                style={{ left: `${60 + obstacleDistance * 3}px` }}
                className="absolute top-1/2 -translate-y-1/2 w-12 h-20 bg-red-950/80 border-2 border-red-500/80 rounded-xl flex flex-col items-center justify-center text-center p-1 shadow-2xl transition-all"
              >
                <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
                <span className="text-[9px] font-bold text-red-300 mt-1">WALL</span>
              </div>

              {/* Virtual Robot Chassis */}
              <div
                style={{ left: `${robotX}px` }}
                className="absolute top-1/2 -translate-y-1/2 w-32 h-24 bg-cyan-950/90 border-2 border-cyan-400 rounded-2xl shadow-2xl p-2 flex flex-col justify-between transition-all"
              >
                <div className="flex items-center justify-between text-[9px] font-bold text-cyan-300">
                  <span>ROVER v2</span>
                  <span className="flex items-center gap-1">
                    <Radar className="w-3 h-3 text-amber-400" /> {servoAngle}°
                  </span>
                </div>

                {/* Simulated Sound Wave Pulse */}
                {isRunning && (
                  <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 flex gap-1 animate-pulse">
                    <div className="w-2 h-8 border-r-2 border-cyan-400 rounded-r-full" />
                    <div className="w-2 h-12 border-r-2 border-cyan-300 rounded-r-full" />
                  </div>
                )}

                <div className="flex justify-between items-end">
                  <div className="w-3 h-6 bg-gray-800 rounded border border-gray-600 animate-spin" />
                  <span className="text-[8px] text-emerald-400 bg-emerald-950/80 px-1 rounded">
                    {obstacleDistance < 20 ? 'BRAKE / TURN' : 'FORWARD'}
                  </span>
                  <div className="w-3 h-6 bg-gray-800 rounded border border-gray-600 animate-spin" />
                </div>
              </div>

            </div>
          )}

          {/* 2. Line Follower Simulation */}
          {project.simulationType === 'line-follower' && (
            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Black Tape Oval Track */}
              <div className="w-[80%] h-44 rounded-full border-8 border-gray-800 flex items-center justify-center relative">
                
                {/* Robot following track */}
                <div
                  style={{ left: `${robotX}px` }}
                  className="absolute top-[-15px] w-24 h-14 bg-blue-950 border-2 border-blue-400 rounded-xl p-1.5 flex flex-col justify-between shadow-xl"
                >
                  <div className="flex justify-between text-[8px] text-cyan-300">
                    <span>L: IR ON</span>
                    <span>R: IR OFF</span>
                  </div>
                  <div className="text-[9px] font-bold text-white text-center">LINE TRACKER</div>
                </div>

              </div>

            </div>
          )}

          {/* 3. Smart Home IoT Simulation */}
          {project.simulationType === 'smart-home' && (
            <div className="w-full h-full flex flex-col items-center justify-center gap-6">
              
              <div className="flex items-center gap-8">
                {/* Virtual Light Bulb */}
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all ${
                  lightOn
                    ? 'bg-amber-400/30 border-amber-400 shadow-[0_0_50px_#f59e0b]'
                    : 'bg-gray-900 border-gray-800'
                }`}>
                  <Zap className={`w-12 h-12 ${lightOn ? 'text-amber-400 animate-bounce' : 'text-gray-600'}`} />
                </div>

                {/* Smart Relay Module */}
                <div className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex flex-col gap-2">
                  <span className="text-xs font-bold text-white">ESP32 GPIO 2 Relay</span>
                  <button
                    onClick={() => setLightOn(!lightOn)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      lightOn ? 'bg-emerald-500 text-gray-950' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {lightOn ? 'RELAY STATE: ACTIVE ON' : 'RELAY STATE: OFF'}
                  </button>
                </div>
              </div>

              {/* PIR Motion Sensor Trigger Toggle */}
              <button
                onClick={() => setMotionDetected(!motionDetected)}
                className={`px-6 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  motionDetected
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-lg shadow-purple-500/20'
                    : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4 text-purple-400" />
                <span>{motionDetected ? 'PIR Motion Sensor: DETECTED' : 'Simulate PIR Motion Trigger'}</span>
              </button>

            </div>
          )}

        </div>

        {/* Live Controls Dashboard Footer */}
        <div className="pt-3 border-t border-gray-900 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-300 shrink-0">
          
          <div className="flex items-center gap-4 flex-1 min-w-[240px]">
            <span className="font-semibold text-gray-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" /> Obstacle Distance:
            </span>
            <input
              type="range"
              min="10"
              max="100"
              value={obstacleDistance}
              onChange={(e) => setObstacleDistance(Number(e.target.value))}
              className="flex-1 accent-cyan-400 bg-gray-900 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-cyan-400 font-bold">{obstacleDistance} cm</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="bg-gray-900 border border-gray-800 px-3 py-1 rounded-lg text-gray-400">
              Sensor Reading: <strong className="text-white">{obstacleDistance * 29.1 * 2} µs</strong>
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
