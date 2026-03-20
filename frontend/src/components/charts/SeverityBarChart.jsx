import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const SeverityBarChart = ({ stats }) => {
  const data = [
    { name: 'Critical', value: stats?.severeCases || 89,   fill: '#E24B4A' },
    { name: 'Moderate', value: stats?.moderateCases || 158, fill: '#EF9F27' },
    { name: 'Minor',    value: stats?.minorCases || 100,    fill: '#facc15' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: 'var(--card-bg)',
          border: '0.5px solid var(--sidebar-border)',
          borderRadius: '6px',
          padding: '6px 10px',
          fontSize: '12px'
        }}>
          <span style={{ color: data.fill, fontWeight: 500 }}>{data.name}</span>: {data.value}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: '8px' }}>
        SEVERITY BREAKDOWN
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height={130}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 20, bottom: 5, left: 10 }}
          >
            <CartesianGrid vertical={true} horizontal={false} stroke="var(--sidebar-border)" strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              tick={{ fontSize: 9, fill: 'var(--text-secondary)' }}
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={60}
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SeverityBarChart;
