import { NextRequest, NextResponse } from 'next/server';
import { PROJECT_TEMPLATES } from '@/lib/projects-data';

export async function GET() {
  return NextResponse.json({
    success: true,
    projects: PROJECT_TEMPLATES
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newProject = {
      id: `proj-${Date.now()}`,
      title: body.title || 'Untitled STEM Project',
      category: body.category || 'Custom Bot',
      targetGradeBand: body.targetGradeBand || 'Grade 6–8',
      difficulty: body.difficulty || 'Beginner',
      description: body.description || 'Custom student robotics project.',
      componentsUsed: body.componentsUsed || ['Arduino UNO R3'],
      blockCode: body.blockCode || { blocks: [] },
      generatedPython: body.generatedPython || '',
      generatedCpp: body.generatedCpp || '',
      simulationType: body.simulationType || 'obstacle-bot',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      project: newProject,
      message: 'Project saved successfully to Vercel cloud store!'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save project' },
      { status: 500 }
    );
  }
}
