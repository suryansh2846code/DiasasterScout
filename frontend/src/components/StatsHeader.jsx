import React from 'react';

const StatsHeader = ({ stats, event, loading }) => {
  if (loading || !stats) {
    return (
      <div style={{
        height: '40px',
        background: '#080b14',
        borderBottom: '1px solid var(--sidebar-border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: '24px',
        overflow: 'hidden'
      }}>
        <div className="animate-pulse flex gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-4 bg-[var(--sidebar-border)] rounded w-24"></div>
          ))}
        </div>
      </div>
    );
  }

  const metrics = [
    { label: 'BUILDINGS', value: stats.buildingsDamaged, color: '#E24B4A' },
    { label: 'ROADS', value: stats.roadsBlocked, color: '#EF9F27' },
    { label: 'AREA', value: `${stats.totalAreaAnalyzedKm2} KM²`, color: '#3B8BD4' },
    { label: 'CONF', value: `${(stats.confidenceScore * 100).toFixed(0)}%`, color: '#22c55e' },
    { label: 'CRITICAL', value: stats.severeCases, color: '#E24B4A' },
    { label: 'EVENT', value: event?.name?.substring(0, 20) || 'UNKNOWN', color: 'var(--text-secondary)' }
  ];

  return (
    <div style={{
      height: '40px',
      background: '#080b14',
      borderBottom: '1px solid var(--sidebar-border)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '24px',
      overflow: 'hidden'
    }}>
      {metrics.map((m, idx) => (
        <React.Fragment key={idx}>
          <div className="flex items-baseline gap-2 whitespace-nowrap">
            <span style={{ fontSize: '9px', color: 'var(--text-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {m.label}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 500, fontFamily: 'monospace', color: m.color }}>
              {m.value}
            </span>
          </div>
          {idx < metrics.length - 1 && (
            <div style={{ color: 'var(--sidebar-border)', fontSize: '12px' }}>|</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatsHeader;
