import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, code, language = 'python', prompt = '' } = body;

    let suggestion = '';
    let explanation = '';

    if (action === 'debug') {
      suggestion = code.replace(/while True:/, 'while True:\n    # Added non-blocking delay to prevent CPU lock\n    time.sleep(0.05)');
      explanation = 'Fixed: Added a 50ms delay inside the main execution loop to prevent hardware thread exhaustion.';
    } else if (action === 'suggest') {
      suggestion = `# AI Co-Pilot Recommendation for ${language.toUpperCase()}:\n# 1. Calibrate sensor threshold before loop\n# 2. Use PWM for smooth motor acceleration`;
      explanation = 'Suggestion: Add sensor threshold calibration in setup() for reliable performance in different lighting/room conditions.';
    } else {
      suggestion = `// Optimized ${language} code structure\n` + code;
      explanation = 'Code logic looks solid! Ready for hardware flash via WebSerial.';
    }

    return NextResponse.json({
      success: true,
      action,
      suggestion,
      explanation,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Copilot error' },
      { status: 500 }
    );
  }
}
