import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import useAnalysis from './hooks/useAnalysis';
import AnalyzePanel from './components/AnalyzePanel';
import Sidebar from './components/Sidebar';
import TabBar from './components/TabBar';
import MapView from './components/MapView';
import LocationsTable from './components/LocationsTable';
import BeforeAfter from './components/BeforeAfter';
import ExportPanel from './components/ExportPanel';

function App() {
  const { data, loading, error, progress, analyze, loadDemo, setData } = useAnalysis();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAnalyzePanel, setShowAnalyzePanel] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const regenerateReport = useCallback(async () => {
    if (!data) return;
    setRegenerating(true);
    try {
      const response = await axios.post('/api/report', {
        stats: data.stats,
        event_name: data.event.name,
        location: data.event.location
      });
      setData(prev => ({ ...prev, report: response.data.report }));
    } catch (err) {
      console.error('Report regeneration failed:', err);
      // silently fail — keep existing report
    } finally {
      setRegenerating(false);
    }
  }, [data, setData]);

  useEffect(() => {
    if (data) setShowAnalyzePanel(false);
  }, [data]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--sidebar-bg)] text-[var(--text-primary)]">
      {/* Left Sidebar */}
      <div className="relative">
        <Sidebar 
          stats={data?.stats} 
          event={data?.event} 
          alerts={data?.alerts} 
          report={data?.report}
          loading={loading || regenerating}
          onRegenerate={regenerateReport}
        />
        <button
          onClick={() => setShowAnalyzePanel(true)}
          className="absolute top-4 right-4 text-[11px] bg-[var(--card-bg)] border border-[var(--sidebar-border)] px-2 py-1 rounded hover:border-[var(--accent)] text-[var(--text-primary)] transition-colors z-[100]"
        >
          + New Analysis
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0">
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 relative overflow-hidden">
          {showAnalyzePanel && !data && (
            <AnalyzePanel 
              onAnalyze={analyze}
              onDemo={loadDemo}
              loading={loading}
              error={error}
            />
          )}

          {!showAnalyzePanel && data && activeTab === 'overview' && (
            <MapView 
              geojsonData={data.geojson} 
              onFeatureClick={(feature) => console.log('Feature clicked:', feature)} 
            />
          )}
          {!showAnalyzePanel && data && activeTab === 'locations' && (
            <LocationsTable locations={data.locations ?? []} />
          )}
          {!showAnalyzePanel && data && activeTab === 'compare' && (
            <BeforeAfter eventName={data.event?.name} />
          )}
          {!showAnalyzePanel && data && activeTab === 'export' && (
            <ExportPanel data={data} />
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 z-[2000] bg-[var(--sidebar-bg)]/90 flex flex-col items-center justify-center backdrop-blur-sm">
              <div style={{ textAlign: 'center' }}>
                <div className="w-12 h-12 border-4 border-[var(--sidebar-border)] border-t-[var(--accent)] rounded-full animate-spin mx-auto"></div>
                <p style={{ color: 'var(--text-secondary)', marginTop: 16, fontSize: 14 }} className="tracking-widest uppercase font-medium">
                  {progress?.stage || 'Analyzing satellite imagery...'}
                </p>
                {progress?.percent && (
                  <div style={{ 
                    width: 200, height: 4, background: 'var(--sidebar-border)', 
                    borderRadius: 2, margin: '12px auto 0' 
                  }}>
                    <div style={{ 
                      width: `${progress.percent}%`, height: '100%',
                      background: 'var(--accent)', borderRadius: 2,
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                )}
                <p style={{ 
                  color: 'var(--text-secondary)', marginTop: 8, fontSize: 12,
                  opacity: 0.6 
                }}>
                  {progress?.percent ? `${Math.round(progress.percent)}%` : ''}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
