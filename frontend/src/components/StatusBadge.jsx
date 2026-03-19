import React from 'react';

const StatusBadge = ({ type, size = 'sm' }) => {
  const config = {
    structural_damage: { label: 'Structural', color: 'var(--structural)' },
    flood: { label: 'Flood', color: 'var(--flood)' },
    road_blockage: { label: 'Road Blocked', color: 'var(--road)' },
    no_change: { label: 'No Change', color: '#666' },
  };

  const { label, color } = config[type] || config.no_change;

  const sizeClasses = size === 'md' 
    ? 'text-[13px] px-[10px] py-[4px]' 
    : 'text-[11px] px-[8px] py-[3px]';

  return (
    <div 
      className={`inline-flex items-center gap-2 rounded-full font-medium ${sizeClasses}`}
      style={{ backgroundColor: `${color}26`, color: color }}
    >
      <span 
        className="w-[6px] h-[6px] rounded-full" 
        style={{ backgroundColor: color }}
      />
      {label}
    </div>
  );
};

export default StatusBadge;
