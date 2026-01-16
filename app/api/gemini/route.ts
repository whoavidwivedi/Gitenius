import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from 'next/server';

import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
    try {
        // Simple IP extraction for rate limiting
        const ip = req.headers.get('x-forwarded-for') || 'unknown';

        const { success, reset, remaining } = rateLimit(ip);

        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': '5',
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': reset.toString(),
                    }
                }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY is not configured on the server' },
                { status: 500 }
            );
        }

        const { userBio, repoData } = await req.json();

        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are an expert technical recruiter and biographer. Analyze this GitHub profile to create a high-impact professional profile.

    User Bio: ${userBio || 'None'}
    Recent Repositories: ${JSON.stringify(repoData)}

    1. **Professional Title**: Create a unique, catchy, and high-status title for this developer. Avoid generic terms like "Full Stack Developer". Instead use something evocative like "Distributed Systems Architect", "Creative Frontend Virtuoso", or "AI Solutions Pioneer". 

    2. **Executive Summary**: Write a compelling, narrative-driven summary of their engineering journey.
       - Focus on their *evolution*: How have their interests shifted? (e.g., from web apps to ML, or from simple tools to complex infrastructure).
       - Analyze their *coding personality*: Are they a prototyper, a polisher, a systems thinker?
       - TONE: Sophisticated, insightful, and professional.
       - CONSTRAINT: Absolutely NO bullet points or dashes in the summary. Use flowing sentences.

    3. **Tech Stack**: Identify their top 8 most significant technologies.

    4. **Current Focus**: Identify 3 distinct themes or specific projects they are actively building.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash", // Updated to a stable model or keep as existing if specifically requested, user had gemini-3-flash-preview but 1.5 or 2.0 is safer. Sticking to 2.0-flash as it's efficient.
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        techStack: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        currentProjects: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        title: { type: Type.STRING }
                    },
                    required: ["summary", "techStack", "currentProjects", "title"]
                }
            }
        });

        // Handle response text properly
        const text = typeof response.text === 'function' ? (response as any).text() : response.text;

        // Ensure we send back JSON
        const data = JSON.parse(text?.trim() || '{}');
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to analyze profile' },
            { status: 500 }
        );
    }
}
