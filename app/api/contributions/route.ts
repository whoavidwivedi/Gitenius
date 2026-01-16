import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    try {
        // Fallback to Deno API since Jogruber is down
        const response = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);

        if (!response.ok) {
            throw new Error(`Upstream API failed with status: ${response.status}`);
        }

        const denoData = await response.json();

        // Adapter: Transform Deno format to Jogruber format expected by frontend

        // 1. Flatten the 2D array of weeks
        const flatContributions = denoData.contributions.flat();

        // 2. Map to expected format
        const contributions = flatContributions.map((item: any) => {
            let level = 0;
            switch (item.contributionLevel) {
                case 'FIRST_QUARTILE': level = 1; break;
                case 'SECOND_QUARTILE': level = 2; break;
                case 'THIRD_QUARTILE': level = 3; break;
                case 'FOURTH_QUARTILE': level = 4; break;
                case 'NONE': default: level = 0; break;
            }

            return {
                date: item.date,
                count: item.contributionCount,
                level: level
            };
        });

        // 3. Calculate totals per year
        const total: { [year: string]: number } = {};
        contributions.forEach((item: any) => {
            const year = item.date.split('-')[0];
            total[year] = (total[year] || 0) + item.count;
        });

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
