import React from 'react';
import { Search, Filter, RefreshCw, LayoutGrid, List, Zap, Building } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  severityFilter: string;
  onSeverityChange: (sev: string) => void;
  buildingFilter: string;
  onBuildingChange: (b: string) => void;
  emergingOnly: boolean;
  onEmergingOnlyToggle: () => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  autoSync: boolean;
  onAutoSyncToggle: () => void;
}

const BUILDINGS_LIST = [
  'All Buildings',
  'CSE Block',
  'Mechanical Lab',
  'Central Library',
  'Admin Block',
  'Science Annex'
];

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  severityFilter,
  onSeverityChange,
  buildingFilter,
  onBuildingChange,
  emergingOnly,
  onEmergingOnlyToggle,
  viewMode,
  onViewModeChange,
  onRefresh,
  isRefreshing,
  autoSync,
  onAutoSyncToggle
}) => {
  return (
    <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Top Filter Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by Title, Building, ID, or Category..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input-control"
            style={{ width: '100%', paddingLeft: '38px' }}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="input-control"
            style={{ minWidth: '130px' }}
          >
            <option value="ALL" style={{ background: '#101726' }}>All Statuses</option>
            <option value="OPEN" style={{ background: '#101726' }}>Open</option>
            <option value="INVESTIGATING" style={{ background: '#101726' }}>Investigating</option>
            <option value="IN_PROGRESS" style={{ background: '#101726' }}>In Progress</option>
            <option value="RESOLVED" style={{ background: '#101726' }}>Resolved</option>
            <option value="CLOSED" style={{ background: '#101726' }}>Closed</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => onSeverityChange(e.target.value)}
            className="input-control"
            style={{ minWidth: '130px' }}
          >
            <option value="ALL" style={{ background: '#101726' }}>All Severities</option>
            <option value="CRITICAL" style={{ background: '#101726' }}>Critical</option>
            <option value="HIGH" style={{ background: '#101726' }}>High</option>
            <option value="MEDIUM" style={{ background: '#101726' }}>Medium</option>
            <option value="LOW" style={{ background: '#101726' }}>Low</option>
          </select>

          {/* Building Filter */}
          <select
            value={buildingFilter}
            onChange={(e) => onBuildingChange(e.target.value)}
            className="input-control"
            style={{ minWidth: '140px' }}
          >
            {BUILDINGS_LIST.map(b => (
              <option key={b} value={b === 'All Buildings' ? 'ALL' : b} style={{ background: '#101726' }}>
                {b}
              </option>
            ))}
          </select>

          {/* Emerging Toggle */}
          <button
            onClick={onEmergingOnlyToggle}
            className={`btn ${emergingOnly ? 'btn-danger' : 'btn-secondary'}`}
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <Zap size={16} /> Emerging Spikes
          </button>
        </div>

        {/* View Mode & Auto Sync Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          
          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: 'rgba(0, 0, 0, 0.3)', padding: '2px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => onViewModeChange('grid')}
              style={{
                background: viewMode === 'grid' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                border: 'none',
                color: viewMode === 'grid' ? '#fff' : 'var(--text-muted)',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              style={{
                background: viewMode === 'table' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                border: 'none',
                color: viewMode === 'table' ? '#fff' : 'var(--text-muted)',
                padding: '6px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Table View"
            >
              <List size={16} />
            </button>
          </div>

          {/* Auto-Sync Toggle */}
          <button
            onClick={onAutoSyncToggle}
            className="btn btn-secondary btn-sm"
            style={{
              borderColor: autoSync ? 'var(--accent-blue)' : undefined,
              color: autoSync ? 'var(--accent-blue)' : 'var(--text-secondary)'
            }}
            title="Auto-refresh every 10 seconds"
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: autoSync ? '#3b82f6' : '#64748b' }} />
            Auto-Sync
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn btn-secondary btn-sm"
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};
