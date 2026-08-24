'use client';

import React, { useState } from 'react';
import { LayoutDashboard, User, ShieldCheck, Users } from 'lucide-react';
import { StudentProgress } from '@/components/dashboard/StudentProgress';
import { TeacherManagement } from '@/components/dashboard/TeacherManagement';
import { AdminCompliance } from '@/components/dashboard/AdminCompliance';

export default function DashboardPage() {
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');

  return (
    <div className="space-y-8">
      
      {/* Portal Header & Role Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <span>Kite Robotics LMS & Compliance Portal</span>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
              NEP 2020 Unified
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Single login dashboard for Students, Teachers, and School Admins.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-gray-950 p-1.5 rounded-2xl border border-gray-800">
          <button
            onClick={() => setRole('student')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              role === 'student'
                ? 'bg-cyan-500 text-gray-950 shadow-md shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student Dashboard</span>
          </button>

          <button
            onClick={() => setRole('teacher')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              role === 'teacher'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Teacher Portal</span>
          </button>

          <button
            onClick={() => setRole('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              role === 'admin'
                ? 'bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>School Admin & ATL Audit</span>
          </button>
        </div>
      </div>

      {/* Dynamic View by Role */}
      {role === 'student' && <StudentProgress />}
      {role === 'teacher' && <TeacherManagement />}
      {role === 'admin' && <AdminCompliance />}

    </div>
  );
}
