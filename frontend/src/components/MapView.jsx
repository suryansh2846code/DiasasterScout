import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup, ScaleControl, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StatusBadge from './StatusBadge';

// Fix Leaflet marker icons in Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl, shadowUrl: iconShadow });

const MapView = ({ geojsonData, onFeatureClick }) => {
  const [visibleLayers, setVisibleLayers] = useState({
    structural_damage: true,
    flood: true,
    road_blockage: true
  });

  const getStyle = (feature) => {
    const type = feature.properties.damageType;
    let color = '#3B8BD4'; // Default flood
    if (type === 'structural_damage') color = '#E24B4A';
    if (type === 'road_blockage') color = '#EF9F27';

    return {
      fillColor: color,
      fillOpacity: 0.45,
      weight: 1.5,
      color: color
    };
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({ fillOpacity: 0.7 });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle({ fillOpacity: 0.45 });
      },
      click: () => {
        if (onFeatureClick) onFeatureClick(feature.properties);
      }
    });

    // Content for popup
    const props = feature.properties;
    const severityDots = '●'.repeat(props.severity) + '○'.repeat(5 - props.severity);
    
    layer.bindPopup(`
      <div class="p-2 min-w-[180px] bg-[#1a1d2e] text-[#f0f2f5]">
        <h3 class="font-bold text-lg mb-1">${props.sectorName}</h3>
        <div class="mb-2" id="badge-${props.id}"></div>
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs text-[#8b90a7]">Severity:</span>
          <span class="text-[#EF9F27]">${severityDots}</span>
        </div>
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs text-[#8b90a7]">Confidence:</span>
          <span class="text-[#22c55e]">${(props.confidence * 100).toFixed(0)}%</span>
        </div>
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs text-[#8b90a7]">Area:</span>
          <span>${props.areaKm2.toFixed(3)} km²</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-[#8b90a7]">Buildings:</span>
          <span>${props.affectedBuildings}</span>
        </div>
      </div>
    `, { className: 'dark-popup' });
  };

  const filteredGeoJSON = geojsonData ? {
    ...geojsonData,
    features: geojsonData.features.filter(f => visibleLayers[f.properties.damageType])
  } : null;

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        center={[37.57, 36.93]} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#0f1117' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        {filteredGeoJSON && (
          <GeoJSON 
            data={filteredGeoJSON} 
            style={getStyle} 
            onEachFeature={onEachFeature} 
          />
        )}
        <ScaleControl position="bottomleft" />
        <ZoomControl position="topright" />
      </MapContainer>

      {/* Layer Controls */}
      <div className="absolute top-4 right-14 z-[1000] bg-[var(--card-bg)] border border-[var(--sidebar-border)] p-3 rounded-lg shadow-xl min-w-[150px]">
        <h4 className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-bold">Layers</h4>
        <div className="flex flex-col gap-2">
          {Object.keys(visibleLayers).map(layer => (
            <label key={layer} className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={visibleLayers[layer]}
                onChange={() => setVisibleLayers(prev => ({ ...prev, [layer]: !prev[layer] }))}
                className="w-4 h-4 rounded border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] text-[var(--accent)] focus:ring-0 focus:ring-offset-0"
              />
              <span className="text-xs text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors capitalize">
                {layer.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;
