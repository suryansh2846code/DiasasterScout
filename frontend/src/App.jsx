import React, { useState } from 'react';
import { useAnalysis } from './hooks/useAnalysis';
import Sidebar from './components/Sidebar';
import TabBar from './components/TabBar';
import MapView from './components/MapView';
import LocationsTable from './components/LocationsTable';
import BeforeAfter from './components/BeforeAfter';
import ExportPanel from './components/ExportPanel';

function App() {
  const { data, loading } = useAnalysis();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--sidebar-bg)] text-[var(--text-primary)]">
      {/* Left Sidebar */}
      <Sidebar 
        stats={data?.stats} 
        event={data?.event} 
        alerts={data?.alerts} 
        loading={loading} 
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0">
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 relative overflow-hidden">
          {activeTab === 'overview' && (
            <MapView 
              geojsonData={data?.geojson} 
              onFeatureClick={(feature) => console.log('Feature clicked:', feature)} 
            />
          )}
          {activeTab === 'locations' && (
            <LocationsTable locations={data?.locations ?? []} />
          )}
          {activeTab === 'compare' && (
            <BeforeAfter eventName={data?.event?.name} />
          )}
          {activeTab === 'export' && (
            <ExportPanel data={data} />
          )}

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 z-[2000] bg-[var(--sidebar-bg)]/90 flex flex-col items-center justify-center backdrop-blur-sm">
              <div className="w-12 h-12 border-4 border-[var(--sidebar-border)] border-t-[var(--accent)] rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium text-[var(--text-secondary)] tracking-widest uppercase">
                Analyzing satellite imagery...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
