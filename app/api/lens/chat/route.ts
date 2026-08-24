import { NextRequest, NextResponse } from 'next/server';
import { STEM_COMPONENTS } from '@/lib/stem-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, componentId, gradeBand = 'grade6_8' } = body;

    const component = STEM_COMPONENTS.find((c) => c.id === componentId) || STEM_COMPONENTS[0];
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

    let responseText = '';

    // If Gemini API Key is saved in Vercel Environment Variables, call live Gemini AI model
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
                      text: `You are Kite Robotics AI Tutor for Grade ${gradeBand}. Student asks about ${component.name}: "${question}". Keep explanation concise, highly educational, and clear.`
                    }
                  ]
                }
              ]
            })
          }
        );
        const geminiData = await geminiRes.json();
        if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
          responseText = geminiData.candidates[0].content.parts[0].text;
        }
      } catch (e) {
        console.warn('Gemini API call error, using built-in STEM knowledge engine:', e);
      }
    }

    // Fallback or default response if GEMINI_API_KEY is not set or network call falls through
    if (!responseText) {
      const qLower = (question || '').toLowerCase();
      const gradeInfo = component.grades[gradeBand as keyof typeof component.grades];
      const analogy = 'realWorldAnalogy' in gradeInfo ? (gradeInfo as { realWorldAnalogy: string }).realWorldAnalogy : 'a smart sensory switch';

      if (qLower.includes('how') || qLower.includes('work')) {
        responseText = `Great question! The ${component.name} works by: ${gradeInfo.explanation}. In real life, it works similar to: ${analogy}.`;
      } else if (qLower.includes('pin') || qLower.includes('wire') || qLower.includes('connect')) {
        responseText = `To connect the ${component.name}: Always ensure VCC goes to 5V/3.3V power, GND goes to Ground, and signal wires connect to Arduino digital or analog pins.`;
      } else if (qLower.includes('code') || qLower.includes('program')) {
        responseText = `You can code the ${component.name} easily in Kinetic Canvas! Click the "Build this in Kinetic Canvas" button to open visual block blocks ready to run in simulation.`;
      } else {
        responseText = `Regarding ${component.name}: ${component.shortDesc} Ask me about pins, real-world examples, or how to write code for it!`;
      }
    }

    return NextResponse.json({
      success: true,
      answer: responseText,
      componentName: component.name,
      aiProvider: process.env.GEMINI_API_KEY ? 'Live Google Gemini 1.5 Flash' : 'Kite Robotics Built-in AI Engine',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error in doubt solver' },
      { status: 500 }
    );
  }
}
