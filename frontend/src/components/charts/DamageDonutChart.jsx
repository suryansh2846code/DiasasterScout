import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const DamageDonutChart = ({ geojsonData }) => {
  const getChartData = () => {
    if (!geojsonData || !geojsonData.features || geojsonData.features.length === 0) {
      return [
        { name: 'Structural', value: 6, color: '#E24B4A' },
        { name: 'Flood',      value: 2, color: '#3B8BD4' },
        { name: 'Road',       value: 2, color: '#EF9F27' }
      ];
    }

    const counts = { structural: 0, flood: 0, road: 0 };
    geojsonData.features.forEach(f => {
      const type = f.properties?.damageType;
      if (type === 'structural_damage') counts.structural++;
      else if (type === 'flood') counts.flood++;
      else if (type === 'road_blockage') counts.road++;
    });

    const data = [];
    if (counts.structural > 0) data.push({ name: 'Structural', value: counts.structural, color: '#E24B4A' });
    if (counts.flood > 0) data.push({ name: 'Flood', value: counts.flood, color: '#3B8BD4' });
    if (counts.road > 0) data.push({ name: 'Road', value: counts.road, color: '#EF9F27' });
    return data;
  };

  const data = getChartData();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = total > 0 ? Math.round((data.value / total) * 100) : 0;
      return (
        <div style={{
          background: 'var(--card-bg)',
          border: '0.5px solid var(--sidebar-border)',
          borderRadius: '6px',
          padding: '6px 10px',
          fontSize: '12px'
        }}>
          <span style={{ color: data.color, fontWeight: 500 }}>{data.name}</span>: {data.value} ({percent}%)
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '8px 4px' }}>
      <div style={{ fontSize: '9px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: '8px' }}>
        DAMAGE DISTRIBUTION
      </div>
      
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="65%"
              outerRadius="90%"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
          </PieChart>
        </ResponsiveContainer>
        
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pointerEvents: 'none'
        }}>
          <span style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-primary)', lineHeight: 1 }}>{total}</span>
          <span style={{ fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>ZONES</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '12px', borderTop: '0.5px solid var(--sidebar-border)', paddingTop: '12px' }}>
        {data.map((entry, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }} />
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DamageDonutChart;
