import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    try {
        // Switch to Vercel API which provides full history (multi-year)
        const response = await fetch(`https://github-contributions.vercel.app/api/v1/${username}`);

        if (!response.ok) {
            throw new Error(`Upstream API failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Adapter: Transform Vercel format to Jogruber format expected by frontend

        // 1. Map 'years' array to 'total' object { "2025": 123, ... }
        const total: { [year: string]: number } = {};
        if (data.years && Array.isArray(data.years)) {
            data.years.forEach((yearData: any) => {
                total[yearData.year] = yearData.total;
            });
        }

        // 2. Map 'contributions' to expected format
        // Vercel API returns 'intensity' as string "0" to "4", which maps to our 'level'
        const contributions = data.contributions.map((item: any) => ({
            date: item.date,
            count: item.count,
            level: parseInt(item.intensity || '0', 10)
        }));

        return NextResponse.json({
            total,
            contributions
        });

    } catch (error: any) {
        console.error('Contributions API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch contribution data' },
            { status: 500 }
        );
    }
}
