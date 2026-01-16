import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=all`);

        if (!response.ok) {
            throw new Error(`Upstream API failed with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Contributions API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch contribution data' },
            { status: 500 }
        );
    }
}
