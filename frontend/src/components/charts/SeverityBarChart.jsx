import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts';

export default function SeverityBarChart({ stats }) {
  const data = [
    { name: 'Critical', value: stats?.severeCases || 89,
      fill: '#E24B4A' },
    { name: 'Moderate', value: stats?.moderateCases || 158,
      fill: '#EF9F27' },
    { name: 'Minor',    value: stats?.minorCases || 100,
      fill: '#facc15' }
  ]

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      padding: '8px 4px'
    }}>
      
      {/* Header */}
      <div style={{
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-secondary)',
        marginBottom: 8
      }}>
        Severity Breakdown
      </div>

      {/* Chart takes remaining space */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 24, bottom: 0, left: 8 }}
          >
            <CartesianGrid 
              vertical={true} 
              horizontal={false}
              stroke="var(--sidebar-border)" 
              strokeDasharray="3 3" 
            />
            <XAxis 
              type="number" 
              tick={{ fontSize: 9, fill: '#555' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              dataKey="name" 
              type="category"
              width={52}
              tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--card-bg)',
                border: '0.5px solid var(--sidebar-border)',
                borderRadius: 6,
                fontSize: 11
              }}
              formatter={(value) => [
                `${value} (${total > 0 ? Math.round(value/total*100) : 0}%)`,
                'Cases'
              ]}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} 
                 maxBarSize={24}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.fill} 
                      fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats below chart */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '0.5px solid var(--sidebar-border)',
        paddingTop: 8,
        marginTop: 8
      }}>
        {data.map((item) => (
          <div key={item.name} style={{ 
            textAlign: 'center',
            flex: 1
          }}>
            <div style={{ 
              fontSize: 14, 
              fontWeight: 600,
              fontFamily: 'monospace',
              color: item.fill
            }}>
              {item.value}
            </div>
            <div style={{ 
              fontSize: 9, 
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
