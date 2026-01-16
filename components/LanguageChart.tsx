
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GithubRepo } from '../types';

interface LanguageChartProps {
  repos: GithubRepo[];
}

const COLORS = [
  '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', 
  '#4ade80', '#86efac', '#bbf7d0', '#f0fdf4'
];

export const LanguageChart: React.FC<LanguageChartProps> = ({ repos }) => {
  const langCounts: { [key: string]: number } = {};
  
  repos.forEach(repo => {
    if (repo.language) {
      langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
    }
  });

  const data = Object.entries(langCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  if (data.length === 0) return <div className="text-muted text-sm italic">No language data available.</div>;

  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '0px' }}
            itemStyle={{ color: '#fafafa' }}
          />
          <Legend iconType="rect" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
