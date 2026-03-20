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
    { i: 'map',      x: 0, y: 0,  w: 8, h: 12, minW: 4, minH: 6 },
    { i: 'donut',    x: 8, y: 0,  w: 4, h: 6,  minW: 3, minH: 5 },
    { i: 'gauge',    x: 8, y: 6,  w: 2, h: 6,  minW: 2, minH: 4 },
    { i: 'severity', x: 10, y: 6, w: 2, h: 6,  minW: 2, minH: 4 },
    { i: 'timeline', x: 0, y: 12, w: 12, h: 4, minW: 6, minH: 3 },
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
        <div className="flex-1 min-h-0 bg-[var(--card-bg)] border border-[var(--sidebar-border)] rounded-lg overflow-hidden p-4">
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
          <div key={l.i} className="panel-card flex flex-col">
            <div className="drag-handle h-[28px] bg-white/5 border-b-[0.5px] border-[var(--sidebar-border)] flex items-center justify-between px-[10px] cursor-grab active:cursor-grabbing">
              <span className="panel-header-label">{panels[l.i].title}</span>
              <button 
                onClick={(e) => { e.stopPropagation(); setMaximized(l.i); }}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                title="Maximize Panel"
              >
                <Maximize2 size={12} />
              </button>
            </div>
            <div className="flex-1 min-h-0 p-2 overflow-hidden relative">
              {panels[l.i].content}
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
};

export default DraggableDashboard;
