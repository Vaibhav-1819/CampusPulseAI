import React, { useState, useEffect, useCallback } from 'react';
import { Incident, DashboardStats } from '@shared/types';
import { api } from '../../services/api';
import { StatsBar } from './components/StatsBar';
import { FilterBar } from './components/FilterBar';
import { IncidentCard } from './components/IncidentCard';
import { EmergingAlertBanner } from './components/EmergingAlertBanner';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { ShieldAlert, RefreshCw, LayoutGrid, List, FileText, ChevronRight, Activity } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  
  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [buildingFilter, setBuildingFilter] = useState('ALL');
  const [emergingOnly, setEmergingOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [autoSync, setAutoSync] = useState(true);

  // Fetch telemetry and incidents data
  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const [statsData, incidentsData] = await Promise.all([
        api.getDashboardStats(),
        api.getIncidents({
          status: statusFilter !== 'ALL' ? statusFilter : undefined,
          severity: severityFilter !== 'ALL' ? severityFilter : undefined,
          building: buildingFilter !== 'ALL' ? buildingFilter : undefined,
          is_emerging: emergingOnly ? true : undefined,
        })
      ]);

      setStats(statsData);
      setIncidents(incidentsData.incidents || []);
    } catch (err) {
      console.error("Error fetching admin telemetry", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [statusFilter, severityFilter, buildingFilter, emergingOnly]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-sync polling every 10 seconds
  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
      fetchData(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoSync, fetchData]);

  // Filtered incidents by live search query
  const filteredIncidents = incidents.filter(inc => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      inc.title.toLowerCase().includes(query) ||
      inc.building.toLowerCase().includes(query) ||
      inc.category.toLowerCase().includes(query) ||
      inc.id.toLowerCase().includes(query)
    );
  });

  const emergingIncidentsList = incidents.filter(i => i.is_emerging && i.status !== 'RESOLVED' && i.status !== 'CLOSED');

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      
      {/* Top Banner / Emerging Warning */}
      <EmergingAlertBanner
        emergingIncidents={emergingIncidentsList}
        onSelectIncident={(inc) => setSelectedIncident(inc)}
        onFilterEmergingOnly={() => setEmergingOnly(true)}
      />

      {/* KPI Stats Bar */}
      <StatsBar
        stats={stats}
        loading={loading}
        onFilterEmerging={() => setEmergingOnly(!emergingOnly)}
        onFilterSeverity={(sev) => setSeverityFilter(sev)}
      />

      {/* Search & Filter Controls */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
        buildingFilter={buildingFilter}
        onBuildingChange={setBuildingFilter}
        emergingOnly={emergingOnly}
        onEmergingOnlyToggle={() => setEmergingOnly(!emergingOnly)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={() => fetchData()}
        isRefreshing={isRefreshing}
        autoSync={autoSync}
        onAutoSyncToggle={() => setAutoSync(!autoSync)}
      />

      {/* Incident List Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} color="var(--accent-blue)" /> Active Campus Incidents
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>
            ({filteredIncidents.length} {filteredIncidents.length === 1 ? 'incident' : 'incidents'})
          </span>
        </h2>
      </div>

      {/* Content Area: Grid View vs Table View */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          <RefreshCw className="spin" size={32} style={{ marginBottom: '1rem' }} />
          <div>Syncing campus incident telemetry...</div>
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-secondary)' }}>
          <ShieldAlert size={48} style={{ opacity: 0.5, marginBottom: '1rem', color: 'var(--accent-blue)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>No Incidents Found</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            No incidents match your current search and filter criteria. Try resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setSeverityFilter('ALL');
              setBuildingFilter('ALL');
              setEmergingOnly(false);
            }}
            className="btn btn-secondary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredIncidents.map(incident => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onSelect={(inc) => setSelectedIncident(inc)}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Incident ID & Title</th>
                <th>Building</th>
                <th>Category</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Impact</th>
                <th>Reports</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map(inc => (
                <tr key={inc.id} onClick={() => setSelectedIncident(inc)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{inc.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inc.id}</div>
                  </td>
                  <td>{inc.building}</td>
                  <td><span className="category-chip">{inc.category}</span></td>
                  <td><span className={`badge badge-sev-${inc.severity}`}>{inc.severity}</span></td>
                  <td><span className={`badge badge-status-${inc.status.toLowerCase()}`}>{inc.status}</span></td>
                  <td>
                    <strong style={{ color: inc.impact_score >= 75 ? '#ef4444' : '#60a5fa' }}>
                      {inc.impact_score}
                    </strong>/100
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--accent-purple)' }}>{inc.report_count}</span>
                  </td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); setSelectedIncident(inc); }}>
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Incident Detail Inspection Drawer */}
      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onStatusUpdated={() => fetchData(true)}
      />
    </div>
  );
};
