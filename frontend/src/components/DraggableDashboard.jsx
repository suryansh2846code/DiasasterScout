import React, { useState, useEffect, useRef } from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Maximize2, X } from 'lucide-react';

import MapView from './MapView';
import DamageDonutChart from './charts/DamageDonutChart';
import ConfidenceGauge from './charts/ConfidenceGauge';
import SeverityBarChart from './charts/SeverityBarChart';
import TimelineChart from './charts/TimelineChart';

const QuickStats = ({ stats }) => {
  return (
    <div style={{ padding: '8px 4px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-secondary)',
        marginBottom: 8
      }}>
        Quick Stats
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '6px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--sidebar-border)', borderRadius: '6px', padding: '8px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '16px', fontFamily: 'monospace', fontWeight: 600, color: '#E24B4A', lineHeight: 1 }}>{stats?.buildingsDamaged || 347}</div>
          <div style={{ fontSize: '8px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em', marginTop: '4px' }}>BUILDINGS</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--sidebar-border)', borderRadius: '6px', padding: '8px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '16px', fontFamily: 'monospace', fontWeight: 600, color: '#EF9F27', lineHeight: 1 }}>{stats?.roadsBlocked || 4}</div>
          <div style={{ fontSize: '8px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em', marginTop: '4px' }}>ROADS</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--sidebar-border)', borderRadius: '6px', padding: '8px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '16px', fontFamily: 'monospace', fontWeight: 600, color: '#3B8BD4', lineHeight: 1 }}>{stats?.totalAreaAnalyzedKm2 || 24.6} KM²</div>
          <div style={{ fontSize: '8px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em', marginTop: '4px' }}>AREA</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid var(--sidebar-border)', borderRadius: '6px', padding: '8px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '16px', fontFamily: 'monospace', fontWeight: 600, color: '#facc15', lineHeight: 1 }}>~1,041</div>
          <div style={{ fontSize: '8px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.08em', marginTop: '4px' }}>AFFECTED</div>
        </div>
      </div>
    </div>
  );
};

const DraggableDashboard = ({ geojsonData, stats, locations, loading }) => {
  const [width, setWidth] = useState(1000);
  const [maximized, setMaximized] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      setWidth(entries[0].contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const layout = [
    { i: 'map',      x: 0, y: 0,  w: 7,  h: 14, minW: 4, minH: 8 },
    { i: 'donut',    x: 7, y: 0,  w: 5,  h: 7,  minW: 3, minH: 5 },
    { i: 'gauge',    x: 7, y: 7,  w: 2,  h: 7,  minW: 2, minH: 5 },
    { i: 'severity', x: 9, y: 7,  w: 3,  h: 7,  minW: 2, minH: 5 },
    { i: 'timeline', x: 0, y: 14, w: 12, h: 5,  minW: 6, minH: 3 },
    { i: 'quickstats', x: 7, y: 14, w: 5, h: 5, minW: 3, minH: 3 }
  ];

  const panels = {
    map: {
      title: 'DAMAGE MAP',
      content: <MapView geojsonData={geojsonData} onFeatureClick={() => {}} />
    },
    donut: {
      title: 'DISTRIBUTION',
      content: <DamageDonutChart geojsonData={geojsonData} />
    },
    gauge: {
      title: 'CONFIDENCE',
      content: <ConfidenceGauge confidence={stats?.confidenceScore} />
    },
    severity: {
      title: 'SEVERITY',
      content: <SeverityBarChart stats={stats} />
    },
    timeline: {
      title: 'TIMELINE',
      content: <TimelineChart stats={stats} />
    },
    quickstats: {
      title: 'QUICK STATS',
      content: <QuickStats stats={stats} locations={locations} />
    }
  };

  if (maximized) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'var(--sidebar-bg)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div className="flex justify-between items-center mb-4">
          <h2 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-primary)', letterSpacing: '0.08em', fontWeight: 600 }}>
            {panels[maximized].title}
          </h2>
          <button 
            onClick={() => setMaximized(null)}
            className="p-2 hover:bg-[var(--sidebar-border)] rounded transition-colors"
          >
            <X size={20} className="text-[var(--text-secondary)]" />
          </button>
        </div>
        <div className="flex-1 min-h-0 bg-[var(--card-bg)] border border-[var(--sidebar-border)] rounded-lg overflow-hidden flex flex-col justify-center p-3">
          {panels[maximized].content}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto overflow-x-hidden p-2">
      <GridLayout
        className="layout"
        layout={layout}
        cols={12}
        rowHeight={42}
        width={width}
        draggableHandle=".drag-handle"
        isResizable={true}
        isDraggable={true}
        margin={[6, 6]}
        containerPadding={[6, 6]}
      >
        {layout.map(l => (
          <div key={l.i} className="panel-card flex flex-col h-full overflow-hidden">
            <div className="drag-handle h-[28px] bg-white/5 border-b-[0.5px] border-[var(--sidebar-border)] flex items-center justify-between px-[10px] cursor-grab active:cursor-grabbing shrink-0">
              <span className="panel-header-label">{panels[l.i].title}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setMaximized(l.i); }}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                title="Maximize Panel"
              >
                <Maximize2 size={12} />
              </button>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '12px', overflow: 'hidden' }}>
              {panels[l.i].content}
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default DraggableDashboard;
