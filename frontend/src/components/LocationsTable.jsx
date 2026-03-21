import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { Search, ChevronUp, ChevronDown, Navigation2 } from 'lucide-react';

const LocationsTable = ({ locations }) => {
  const [sortField, setSortField] = useState('severity');
  const [sortDir, setSortDir] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = locations
    .filter(loc => loc.sectorName.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const copyToClipboard = (loc) => {
    const text = `${loc.coords.lat}, ${loc.coords.lng}`;
    navigator.clipboard.writeText(text);
    setCopiedId(loc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[var(--sidebar-bg)]">
      <div className="p-4 border-b border-[var(--sidebar-border)]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
          <input
            type="text"
            placeholder="Search sectors..."
            className="w-full bg-[var(--card-bg)] border border-[var(--sidebar-border)] rounded-md py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[var(--card-bg)] text-[var(--text-secondary)] text-[10px] uppercase tracking-wider z-10">
            <tr>
              <th className="px-4 py-3 font-bold">Sector</th>
              <th className="px-4 py-3 font-bold">Type</th>
              <th className="px-4 py-3 font-bold">Priority</th>
              <th className="px-4 py-3 font-bold cursor-pointer hover:text-[var(--text-primary)] transition-colors" onClick={() => handleSort('severity')}>
                <div className="flex items-center gap-1">
                  Severity {sortField === 'severity' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
              </th>
              <th className="px-4 py-3 font-bold cursor-pointer hover:text-[var(--text-primary)] transition-colors" onClick={() => handleSort('confidence')}>
                <div className="flex items-center gap-1">
                  Confidence {sortField === 'confidence' && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                </div>
              </th>
              <th className="px-4 py-3 font-bold">Area</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--sidebar-border)]">
            {filtered.map((loc) => (
              <tr key={loc.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-4 text-sm font-medium text-[var(--text-primary)]">{loc.sectorName}</td>
                <td className="px-4 py-4">
                  <StatusBadge type={loc.damageType} size="sm" />
                </td>
                <td className="px-4 py-4">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tight ${
                    loc.priority === 'critical' ? 'bg-[var(--critical)]/20 text-[var(--critical)]' :
                    loc.priority === 'high' ? 'bg-[var(--high)]/20 text-[var(--high)]' :
                    'bg-[var(--medium)]/20 text-[var(--medium)]'
                  }`}>
                    {loc.priority}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-[var(--high)] font-mono">
                    {'●'.repeat(loc.severity)}{'○'.repeat(5 - loc.severity)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`font-mono text-sm ${
                    loc.confidence >= 0.8 ? 'text-[var(--success)]' :
                    loc.confidence >= 0.6 ? 'text-[var(--road)]' :
                    'text-[var(--structural)]'
                  }`}>
                    {(loc.confidence * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-[var(--text-secondary)]">{loc.areaKm2.toFixed(3)} km²</td>
                <td className="px-4 py-4 text-right">
                  <button
                    onClick={() => copyToClipboard(loc)}
                    className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded transition-colors ${
                      copiedId === loc.id 
                        ? 'bg-[var(--success)]/20 text-[var(--success)]' 
                        : 'bg-[var(--accent)]/10 text-[var(--accent)] hover:bg-[var(--accent)]/20'
                    }`}
                  >
                    <Navigation2 size={12} />
                    {copiedId === loc.id ? 'Copied!' : 'Navigate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocationsTable;
