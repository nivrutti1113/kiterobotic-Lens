import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    overview: {
      schoolName: 'Kite Robotics Partner School - Delhi Public School',
      atlLabId: 'ATL-IND-2026-8849',
      totalActiveStudents: 420,
      totalScansCompleted: 1485,
      totalSimulationsRun: 3290,
      hardwareFlashSuccessRate: '96.4%',
      nep2020GradeAlignment: '100% Compliant (Grade 6+ Computational Thinking & Coding)',
      vernacularUsage: {
        hindi: '45%',
        english: '30%',
        marathi: '12%',
        tamil: '8%',
        telugu: '5%'
      }
    },
    gradeStats: [
      { band: 'Grade 3–5', students: 120, avgScans: 8.4, topProject: 'Bat Eyes Ultrasonic Sensor' },
      { band: 'Grade 6–8', students: 160, avgScans: 12.1, topProject: 'Autonomous Obstacle Rover' },
      { band: 'Grade 9–10', students: 90, avgScans: 15.6, topProject: 'ESP32 Smart Home IoT' },
      { band: 'Grade 11–12', students: 50, avgScans: 18.2, topProject: 'ROS2 Node Telemetry & Hardware' }
    ]
  });
}
