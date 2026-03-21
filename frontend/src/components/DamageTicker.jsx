import React from 'react';

const DamageTicker = ({ locations }) => {
  const getTickerText = () => {
    if (!locations || locations.length === 0) {
      return [
        "▲  SECTOR B-7   STRUCTURAL · CRITICAL · 88% CONF",
        "■  SECTOR C-4   ROAD BLOCKED · 4 SEGMENTS AFFECTED",
        "▼  SECTOR D-1   MODERATE DAMAGE · 158 BUILDINGS",
        "●  SECTOR A-2   FLOOD DETECTED · 0.4 KM² SUBMERGED"
      ];
    }

    return locations.map(loc => {
      let icon = '▲';
      let color = '#E24B4A';
      if (loc.damageType === 'structural_damage') {
        icon = '▲'; color = '#E24B4A';
      } else if (loc.damageType === 'flood') {
        icon = '●'; color = '#3B8BD4';
      } else if (loc.damageType === 'road_blockage') {
        icon = '■'; color = '#EF9F27';
      }
      return {
        text: `${icon}  ${(loc.sectorName || 'UNKNOWN').toUpperCase()}   ${(loc.damageType || 'UNKNOWN').toUpperCase().replace('_', ' ')} · ${(loc.priority || 'severity ' + loc.severity).toUpperCase()} · ${Math.round((loc.confidence || 0) * 100)}% CONF · ${(loc.areaKm2 || 0).toFixed(3)} KM²`,
        color
      };
    });
  };

  const items = getTickerText();
  const isFallback = !locations || locations.length === 0;

  const renderItems = () => (
    <div className="flex items-center whitespace-nowrap" style={{ paddingRight: '20px' }}>
      {items.map((item, idx) => {
        const text = isFallback ? item : item.text;
        const color = isFallback ? (idx === 0 ? '#E24B4A' : idx === 1 ? '#EF9F27' : idx === 2 ? '#facc15' : '#3B8BD4') : item.color;
        
        return (
          <React.Fragment key={idx}>
            <span style={{ color }}>{text}</span>
            <span style={{ color: 'var(--text-secondary)', opacity: 0.5, margin: '0 24px' }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;·····&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div 
      style={{
        height: '36px',
        background: '#060810',
        borderBottom: '1px solid var(--sidebar-border)',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontFamily: 'monospace',
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.08em',
        padding: '0 8px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div 
        className="flex items-center" 
        style={{ 
          animation: 'ticker-scroll 45s linear infinite',
          width: 'max-content'
        }}
      >
        {renderItems()}
        {renderItems()}
      </div>
    </div>
  );
};

export default DamageTicker;
