'use client';

import React from 'react';
import { Users, FileText, CheckCircle, Clock, Plus, Play, Download } from 'lucide-react';

export const TeacherManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Teacher Action Header */}
      <div className="glass-panel p-6 rounded-3xl border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-lg text-white">Classroom & Lesson Management</h2>
          <p className="text-xs text-gray-400 mt-0.5">Assigned Class: Grade 7-B Robotics Lab | 42 Active Students</p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-gray-950 font-bold text-xs shadow-lg shadow-cyan-500/20">
          <Plus className="w-4 h-4" />
          <span>Assign New STEM Project</span>
        </button>
      </div>

      {/* Lesson Plans & Assigned Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <span>Ready-Made CBSE / NEP 2020 Lesson Plans</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Lesson 4: Ultrasonic Echolocation</h4>
                <p className="text-[11px] text-gray-400">Duration: 45 min | Grade 6–8</p>
              </div>
              <button className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-cyan-400 hover:bg-gray-800">
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Lesson 8: Differential Line Tracking</h4>
                <p className="text-[11px] text-gray-400">Duration: 60 min | Grade 6–8</p>
              </div>
              <button className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-cyan-400 hover:bg-gray-800">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Student Completion Roster */}
        <div className="glass-panel p-6 rounded-3xl border border-gray-800 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>Live Class Submission Roster</span>
          </h3>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-gray-950 border border-gray-800">
              <span className="font-bold text-white">Aarav Sharma</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Project Passed
              </span>
            </div>

            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-gray-950 border border-gray-800">
              <span className="font-bold text-white">Ananya Gupta</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Project Passed
              </span>
            </div>

            <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-gray-950 border border-gray-800">
              <span className="font-bold text-white">Rohan Verma</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Simulation Active
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
