import React from 'react';
import StatusBadge from './StatusBadge';

const Sidebar = ({ stats, event, alerts, loading }) => {
  if (loading) {
    return (
      <aside className="w-[320px] h-full bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col p-4 animate-pulse">
        <div className="h-20 bg-[var(--card-bg)] rounded mb-6"></div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-[var(--card-bg)] rounded"></div>)}
        </div>
        <div className="h-32 bg-[var(--card-bg)] rounded mb-6"></div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-[var(--card-bg)] rounded"></div>)}
        </div>
      </aside>
    );
  }

  const borderTopColor = event?.disasterType === 'earthquake' ? 'var(--structural)' : 'var(--flood)';

  return (
    <aside className="w-[320px] h-full bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col overflow-y-auto">
      {/* Section 1: Event Header */}
      <div className="p-4 border-t-4" style={{ borderTopColor }}>
        <h2 className="text-[15px] font-semibold text-[var(--text-primary)]">{event?.name}</h2>
        <p className="text-[12px] text-[var(--text-secondary)]">{event?.location} • {event?.disasterType}</p>
        <p className="text-[11px] text-[var(--text-secondary)] mt-2">
          Analyzed: {new Date(event?.analyzedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short' })}
        </p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-[11px] text-[var(--text-secondary)] italic">{event?.satelliteSource}</p>
          <p className="text-[11px] text-[var(--text-secondary)]">Processed in {event?.processingTimeSeconds}s</p>
        </div>
      </div>

      {/* Section 2: Stats Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-[var(--card-bg)] border border-[var(--sidebar-border)] rounded-lg p-3">
          <p className="text-[24px] font-semibold" style={{ color: 'var(--structural)' }}>{stats?.buildingsDamaged}</p>
          <p className="text-[11px] text-[var(--text-secondary)] uppercase">Buildings Damaged</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--sidebar-border)] rounded-lg p-3">
          <p className="text-[24px] font-semibold" style={{ color: 'var(--road)' }}>{stats?.roadsBlocked}</p>
          <p className="text-[11px] text-[var(--text-secondary)] uppercase">Roads Blocked</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--sidebar-border)] rounded-lg p-3">
          <p className="text-[24px] font-semibold" style={{ color: 'var(--flood)' }}>{stats?.totalAreaAnalyzedKm2}</p>
          <p className="text-[11px] text-[var(--text-secondary)] uppercase">Area km²</p>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--sidebar-border)] rounded-lg p-3">
          <p className="text-[24px] font-semibold" style={{ color: 'var(--success)' }}>{(stats?.confidenceScore * 100).toFixed(0)}%</p>
          <p className="text-[11px] text-[var(--text-secondary)] uppercase">Confidence</p>
        </div>
      </div>

      {/* Section 3: Severity Breakdown */}
      <div className="p-4">
        <h3 className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-3 font-bold">Damage Severity</h3>
        <div className="space-y-3">
          {[
            { label: 'Critical', count: stats?.severeCases, color: 'var(--critical)' },
            { label: 'Moderate', count: stats?.moderateCases, color: 'var(--road)' },
            { label: 'Minor', count: stats?.minorCases, color: 'var(--medium)' }
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between text-[11px] mb-1">
                <span>{item.label}</span>
                <span className="text-[var(--text-secondary)]">{item.count} ({((item.count / stats?.buildingsDamaged) * 100).toFixed(0)}%)</span>
              </div>
              <div className="h-1 bg-[var(--sidebar-border)] rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ width: `${(item.count / stats?.buildingsDamaged) * 100}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: AI Alerts */}
      <div className="p-4 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">AI Alerts</h3>
          <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-blink"></div>
        </div>
        <div className="space-y-2">
          {alerts?.map(alert => (
            <div 
              key={alert.id} 
              className="bg-[var(--card-bg)] rounded-lg p-3 border-l-4"
              style={{ borderLeftColor: alert.type === 'structural_damage' ? 'var(--structural)' : alert.type === 'flood' ? 'var(--flood)' : 'var(--road)' }}
            >
              <p className="text-[13px] text-[var(--text-primary)] leading-relaxed mb-2">
                {alert.message}
              </p>
              <div className="flex justify-between items-center">
                <StatusBadge type={alert.type} size="sm" />
                <span className="text-[10px] text-[var(--text-secondary)] uppercase">
                  {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
