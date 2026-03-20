import React from 'react';
import { Map, List, Layers, Download } from 'lucide-react';

const TabBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', Icon: Map },
    { id: 'locations', label: 'Locations', Icon: List },
    { id: 'compare', label: 'Before / After', Icon: Layers },
    { id: 'export', label: 'Export', Icon: Download },
  ];

  return (
    <div className="h-[48px] w-full bg-[var(--card-bg)] border-b border-[var(--sidebar-border)] flex px-4">
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center gap-2 px-4 h-full transition-all border-b-2 ${
              isActive 
                ? 'border-[var(--accent)] text-[var(--text-primary)] bg-white/5' 
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Icon size={16} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TabBar;
