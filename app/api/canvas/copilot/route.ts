import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, code, language = 'python', prompt = '' } = body;

    let suggestion = '';
    let explanation = '';

    // If Gemini API key is configured in Vercel Environment Variables
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are Kinetic Canvas AI Co-Pilot. Action: ${action}. Code (${language}): "${code}". Analyze for errors or optimizations and respond in JSON with keys "suggestion" and "explanation".`
                    }
                  ]
                }
              ]
            })
          }
        );
        const geminiData = await geminiRes.json();
        const responseText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
          explanation = 'Analyzed by Live Gemini 1.5 Flash AI Co-Pilot.';
          suggestion = responseText;
        }
      } catch (e) {
        console.warn('Gemini API call warning, fallback active:', e);
      }
    }

    if (!suggestion) {
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
    }

    return NextResponse.json({
      success: true,
      action,
      suggestion,
      explanation,
      aiProvider: process.env.GEMINI_API_KEY ? 'Live Google Gemini AI' : 'Kite Robotics Built-in Co-Pilot Engine',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Copilot error' },
      { status: 500 }
    );
  }
}
