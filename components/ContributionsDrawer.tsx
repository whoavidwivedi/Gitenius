import React, { useEffect, useState } from 'react';
import { ActivityCalendar, Activity } from 'react-activity-calendar';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface ContributionsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
}

interface ApiResponse {
    total: { [year: string]: number };
    contributions: Array<{
        date: string;
        count: number;
        level: number;
    }>;
}

export const ContributionsDrawer: React.FC<ContributionsDrawerProps> = ({ isOpen, onClose, username }) => {
    const [data, setData] = useState<ApiResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && username) {
            fetchContributions();
        }
    }, [isOpen, username]);

    const fetchContributions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/contributions?username=${username}`);
            if (!response.ok) throw new Error('Failed to fetch contributions');

            const json: ApiResponse = await response.json();
            setData(json);

            // Set default year to current year if available, else first available
            const years = Object.keys(json.total).sort((a, b) => Number(b) - Number(a));
            if (years.length > 0) setSelectedYear(years[0]);

        } catch (err) {
            setError('Could not load contribution data');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Filter data for selected year
    const yearData = data && selectedYear
        ? data.contributions.filter(day => day.date.startsWith(selectedYear))
        : [];

    // Calculate max year range for better viewing
    const years = data ? Object.keys(data.total).sort((a, b) => Number(b) - Number(a)) : [];

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="bg-zinc-950 border-t border-zinc-800 w-full max-w-5xl mx-auto p-8 pointer-events-auto animate-in slide-in-from-bottom duration-300 rounded-t-[20px] mb-0 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                {/* Handle */}
                <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-800 mb-8" />

                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tighter text-white uppercase">
                            Contribution Intelligence
                        </h3>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1">
                            Commit History for @{username}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest"
                    >
                        Close Panel
                    </button>
                </div>

                {loading && (
                    <div className="flex justify-center py-20 text-primary text-xs uppercase font-bold tracking-widest animate-pulse">
                        Analyzing Github Matrix...
                    </div>
                )}

                {error && (
                    <div className="text-red-500 text-center py-10 uppercase text-xs font-bold tracking-widest">
                        {error}
                    </div>
                )}

                {!loading && data && (
                    <div className="space-y-8">
                        {/* Year Selector */}
                        <div className="flex flex-wrap gap-2 justify-center border-b border-zinc-900 pb-8">
                            {years.map(year => (
                                <button
                                    key={year}
                                    onClick={() => setSelectedYear(year)}
                                    className={`
                                        px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all
                                        ${selectedYear === year
                                            ? 'bg-primary text-black border-primary'
                                            : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
                                        }
                                    `}
                                >
                                    {year} <span className="opacity-50 ml-1">({data.total[year]})</span>
                                </button>
                            ))}
                        </div>

                        {/* Calendar */}
                        <div className="flex justify-center w-full overflow-x-auto pb-4">
                            <div className="min-w-[800px]">
                                <ActivityCalendar
                                    data={yearData}
                                    theme={{
                                        light: ['#18181b', '#0e4429', '#006d32', '#26a641', '#39d353'],
                                        dark: ['#18181b', '#0e4429', '#006d32', '#26a641', '#39d353'],
                                    }}
                                    labels={{
                                        totalCount: '{{count}} contributions in ' + selectedYear,
                                    }}
                                    blockMargin={4}
                                    blockSize={14}
                                    fontSize={12}
                                    // Props removed due to deprecation/renaming in v3
                                    // Default behavior is usually to show these elements
                                    renderBlock={(block, activity) => (
                                        React.cloneElement(block, {
                                            'data-tooltip-id': 'react-tooltip',
                                            'data-tooltip-content': `${activity.count} commits on ${activity.date}`,
                                            'data-tooltip-place': 'top',
                                        })
                                    )}
                                    showWeekdayLabels
                                />
                                <ReactTooltip id="react-tooltip" />
                            </div>
                        </div>

                        <div className="text-center text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
                            Total Lifetime Contributions: {Object.values(data.total).reduce((a: number, b: number) => a + b, 0)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
