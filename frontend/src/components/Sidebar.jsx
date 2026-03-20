import React from 'react';
import StatusBadge from './StatusBadge';
import SituationReport from './SituationReport';

const Sidebar = ({ stats, event, alerts, loading, report, onRegenerate }) => {
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
        {/* Buildings Card */}
        <div className="bg-[var(--card-bg)] border border-[var(--sidebar-border)] rounded-lg p-3" style={{ borderTop: '3px solid #E24B4A' }}>
          <p className="text-[11px] text-[var(--text-secondary)] uppercase mb-1">Buildings Damaged</p>
          <p style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: 600, color: 'var(--structural)', lineHeight: 1 }}>
            {stats?.buildingsDamaged || 0}
          </p>
          <p style={{ marginTop: '4px', fontSize: '10px', color: '#E24B4A', fontWeight: 500 }}>
            ↑ {stats?.severeCases || 0} CRITICAL CASES
          </p>
          <p style={{ marginTop: '6px', fontSize: '8px', color: '#333', letterSpacing: '0.05em' }}>
            SRC: SATELLITE AI
          </p>
        </div>
        
        {/* Roads Card */}
        <div className="bg-[var(--card-bg)] border border-[var(--sidebar-border)] rounded-lg p-3" style={{ borderTop: '3px solid #EF9F27' }}>
          <p className="text-[11px] text-[var(--text-secondary)] uppercase mb-1">Roads Blocked</p>
          <p style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: 600, color: 'var(--road)', lineHeight: 1 }}>
            {stats?.roadsBlocked || 0}
          </p>
          <p style={{ marginTop: '4px', fontSize: '10px', color: '#EF9F27', fontWeight: 500 }}>
            ■ ALL BLOCKED
          </p>
          <p style={{ marginTop: '6px', fontSize: '8px', color: '#333', letterSpacing: '0.05em' }}>
            SRC: SATELLITE AI
          </p>
        </div>

        {/* Area Card */}
        <div className="bg-[var(--card-bg)] border border-[var(--sidebar-border)] rounded-lg p-3" style={{ borderTop: '3px solid #3B8BD4' }}>
          <p className="text-[11px] text-[var(--text-secondary)] uppercase mb-1">Area km²</p>
          <p style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: 600, color: 'var(--flood)', lineHeight: 1 }}>
            {stats?.totalAreaAnalyzedKm2 || 0}
          </p>
          <p style={{ marginTop: '4px', fontSize: '10px', color: '#3B8BD4', fontWeight: 500 }}>
            ● ANALYZED
          </p>
          <p style={{ marginTop: '6px', fontSize: '8px', color: '#333', letterSpacing: '0.05em' }}>
            SRC: SATELLITE AI
          </p>
        </div>

        {/* Confidence Card */}
        <div className="bg-[var(--card-bg)] border border-[var(--sidebar-border)] rounded-lg p-3" style={{ borderTop: '3px solid #22c55e' }}>
          <p className="text-[11px] text-[var(--text-secondary)] uppercase mb-1">Confidence</p>
          <p style={{ fontFamily: 'monospace', fontSize: '24px', fontWeight: 600, color: 'var(--success)', lineHeight: 1 }}>
            {stats?.confidenceScore ? (stats.confidenceScore * 100).toFixed(0) : 0}%
          </p>
          <p style={{ marginTop: '4px', fontSize: '10px', color: '#22c55e', fontWeight: 500 }}>
            ✓ HIGH CONFIDENCE
          </p>
          <p style={{ marginTop: '6px', fontSize: '8px', color: '#333', letterSpacing: '0.05em' }}>
            SRC: SATELLITE AI
          </p>
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

      {/* Section 5: Situation Report */}
      <div className="px-4 pb-4">
        <SituationReport 
          report={report || null}
          loading={loading}
          onRegenerate={onRegenerate}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
