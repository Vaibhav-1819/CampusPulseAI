import React, { useState, useEffect } from 'react';
import { Incident, Report, IncidentEvent, IncidentStatus } from '@shared/types';
import { api } from '../../../services/api';
import { 
  X, 
  Brain, 
  Wrench, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Building2, 
  Zap,
  Activity,
  Send,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onStatusUpdated
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [timeline, setTimeline] = useState<IncidentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline'>('overview');
  
  // Triage state
  const [selectedStatus, setSelectedStatus] = useState<IncidentStatus>('OPEN');
  const [triageNotes, setTriageNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [triageSuccessMsg, setTriageSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (incident) {
      setSelectedStatus(incident.status);
      loadIncidentDetail(incident.id);
    }
  }, [incident]);

  const loadIncidentDetail = async (id: string) => {
    setLoading(true);
    try {
      const data = await api.getIncidentById(id);
      setReports(data.reports || []);
      setTimeline(data.timeline || []);
    } catch (err) {
      console.error("Failed to load incident detail", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: IncidentStatus) => {
    if (!incident) return;
    setIsUpdatingStatus(true);
    setTriageSuccessMsg(null);

    try {
      await api.updateIncidentStatus(incident.id, newStatus, triageNotes);
      setSelectedStatus(newStatus);
      setTriageNotes('');
      setTriageSuccessMsg(`Status updated to ${newStatus}`);
      await loadIncidentDetail(incident.id);
      onStatusUpdated();

      setTimeout(() => setTriageSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (!incident) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-elevated)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-status-open" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                ID: {incident.id}
              </span>
              <span className={`badge badge-sev-${incident.severity}`}>
                {incident.severity} SEVERITY
              </span>
              <span className={`badge badge-status-${incident.status.toLowerCase()}`}>
                {incident.status}
              </span>
              {incident.is_emerging && (
                <span className="badge badge-emerging">
                  <Zap size={12} /> EMERGING SPIKE
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>
              {incident.title}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span><Building2 size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> {incident.building}</span>
              <span>•</span>
              <span>Category: {incident.category}</span>
              <span>•</span>
              <span>Impact Score: <strong style={{ color: incident.impact_score >= 75 ? '#ef4444' : '#60a5fa' }}>{incident.impact_score}/100</strong></span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Status Triage Control Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          background: 'rgba(16, 23, 38, 0.9)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Admin Triage Action:
            </span>
            {triageSuccessMsg && (
              <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> {triageSuccessMsg}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(['INVESTIGATING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as IncidentStatus[]).map(status => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={isUpdatingStatus}
                className={`btn btn-sm ${selectedStatus === status ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  fontSize: '0.775rem',
                  fontWeight: 600,
                  opacity: isUpdatingStatus ? 0.7 : 1
                }}
              >
                Mark {status.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Optional Triage Note */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <input
              type="text"
              placeholder="Add optional administrative dispatch note to timeline..."
              value={triageNotes}
              onChange={(e) => setTriageNotes(e.target.value)}
              className="input-control"
              style={{ flex: 1, fontSize: '0.8rem', padding: '6px 10px' }}
            />
          </div>
        </div>

        {/* Nav Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '0 1.5rem'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'overview' ? '2px solid var(--accent-blue)' : '2px solid transparent',
              color: activeTab === 'overview' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: activeTab === 'overview' ? 600 : 400,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Brain size={16} /> AI Intelligence & Reports ({reports.length})
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'transparent',
              borderBottom: activeTab === 'timeline' ? '2px solid var(--accent-blue)' : '2px solid transparent',
              color: activeTab === 'timeline' ? '#ffffff' : 'var(--text-muted)',
              fontWeight: activeTab === 'timeline' ? 600 : 400,
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Clock size={16} /> Event Timeline ({timeline.length})
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading detailed telemetry...
            </div>
          ) : activeTab === 'overview' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* AI Summary Box */}
              {incident.summary && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '10px',
                  padding: '1.15rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
                    <Sparkles size={18} /> AI Executive Incident Synthesis
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                    {incident.summary}
                  </p>
                </div>
              )}

              {/* AI Facilities Recommendation */}
              {incident.recommendation && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '10px',
                  padding: '1.15rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
                    <Wrench size={18} /> Recommended Facilities Action
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                    {incident.recommendation}
                  </p>
                </div>
              )}

              {/* Correlated Reports Section */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="var(--accent-purple)" />
                  Correlated Student Complaints ({reports.length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reports.map((rep, idx) => (
                    <div key={rep.id} className="glass-panel" style={{ padding: '1rem', background: 'rgba(16, 23, 38, 0.6)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>#{idx + 1}</span>
                          <span className="badge badge-status-open" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                            Report {rep.id}
                          </span>
                          {rep.room && (
                            <span className="category-chip">
                              <MapPin size={12} /> {rep.room}
                            </span>
                          )}
                        </div>

                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(rep.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.875rem', color: '#f8fafc', marginBottom: '10px', lineHeight: 1.4 }}>
                        "{rep.description}"
                      </p>

                      {/* AI Explainability Card */}
                      {rep.correlation_reason && (
                        <div style={{
                          background: 'rgba(59, 130, 246, 0.08)',
                          borderLeft: '3px solid var(--accent-blue)',
                          borderRadius: '0 6px 6px 0',
                          padding: '8px 12px',
                          fontSize: '0.8rem',
                          color: '#94a3b8'
                        }}>
                          <div style={{ fontWeight: 600, color: '#60a5fa', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Info size={14} /> AI Clustering Reason (Match: {Math.round((rep.correlation_score || 1) * 100)}%)
                          </div>
                          <div>{rep.correlation_reason}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Interactive Event Timeline */
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="var(--accent-cyan)" />
                Incident Lifecycle Timeline
              </h4>

              <div style={{ position: 'relative', paddingLeft: '24px' }}>
                {/* Timeline vertical line */}
                <div style={{
                  position: 'absolute',
                  left: '7px',
                  top: '8px',
                  bottom: '8px',
                  width: '2px',
                  background: 'var(--border-strong)'
                }} />

                {timeline.map((evt, idx) => (
                  <div key={evt.id || idx} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    {/* Node Dot */}
                    <div style={{
                      position: 'absolute',
                      left: '-24px',
                      top: '2px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: evt.event_type === 'EMERGING_FLAGGED' ? '#ef4444' : evt.event_type === 'STATUS_CHANGED' ? '#3b82f6' : '#8b5cf6',
                      border: '3px solid var(--bg-surface)',
                      boxShadow: '0 0 8px rgba(0,0,0,0.5)'
                    }} />

                    <div className="glass-panel" style={{ padding: '0.85rem 1rem', background: 'rgba(16, 23, 38, 0.5)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: evt.event_type === 'EMERGING_FLAGGED' ? '#fca5a5' : 'var(--accent-blue)', textTransform: 'uppercase' }}>
                          {evt.event_type.replace('_', ' ')}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(evt.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>
                        {evt.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
