import { NextRequest, NextResponse } from 'next/server';
import { STEM_COMPONENTS } from '@/lib/stem-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { componentId, gradeBand = 'grade6_8' } = body;

    const matchedComponent = STEM_COMPONENTS.find(
      (c) => c.id === componentId
    ) || STEM_COMPONENTS[0];

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      component: matchedComponent,
      gradeExplanation: matchedComponent.grades[gradeBand as keyof typeof matchedComponent.grades],
      aiConfidence: 0.98,
      detectedFeatures: [
        'Integrated Microcontroller Pins',
        'PWM Signal Traces',
        'Regulated 5V Line',
        'Serial Baud Communication'
      ]
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to analyze object' },
      { status: 500 }
    );
  }
}
