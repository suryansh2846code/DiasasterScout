import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TimelineChart = ({ stats }) => {
  const generateData = (stats) => {
    const points = 12;
    const total = stats?.buildingsDamaged || 347;
    return Array.from({ length: points }, (_, i) => {
      const progress = i / (points - 1);
      const eased = 1 - Math.pow(1 - progress, 2.5);
      return {
        time: i === 0 ? 'T+0h' : i === points - 1 ? 'Now' : `T+${i * 2}h`,
        buildings: Math.round(total * eased * (0.92 + Math.random() * 0.08)),
        confidence: Math.round(15 + ((stats?.confidenceScore || 0.81) * 100 - 15) * eased)
      };
    });
  };

  const data = React.useMemo(() => generateData(stats), [stats]);

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
          <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{data.time}</div>
          <div><span style={{ color: '#E24B4A', fontWeight: 500 }}>Buildings</span>: {data.buildings}</div>
          <div><span style={{ color: '#3B8BD4', fontWeight: 500 }}>Confidence</span>: {data.confidence}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
          DETECTION TIMELINE
        </div>
        <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
          24HR WINDOW
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height={85}>
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" vertical={false} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 9, fill: '#555' }}
              axisLine={false} 
              tickLine={false}
              ticks={[data[0].time, data[Math.floor(data.length/2)].time, data[data.length-1].time]}
            />
            <YAxis hide={true} />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="buildings" 
              stroke="#E24B4A" 
              strokeWidth={1.5} 
              fill="#E24B4A" 
              fillOpacity={0.12} 
            />
            <Area 
              type="monotone" 
              dataKey="confidence" 
              stroke="#3B8BD4" 
              strokeWidth={1} 
              fill="#3B8BD4" 
              fillOpacity={0.08} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimelineChart;
