import React from 'react';
import { Incident } from '@shared/types';
import { Building2, FileText, Zap, ChevronRight, Clock, AlertTriangle } from 'lucide-react';

interface IncidentCardProps {
  incident: Incident;
  onSelect: (incident: Incident) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onSelect }) => {
  const getImpactFillClass = (score: number) => {
    if (score >= 85) return 'impact-meter-fill-critical';
    if (score >= 60) return 'impact-meter-fill-high';
    if (score >= 30) return 'impact-meter-fill-medium';
    return 'impact-meter-fill-low';
  };

  const formattedTime = new Date(incident.updated_at || incident.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div 
      className="glass-panel glass-panel-hover"
      onClick={() => onSelect(incident)}
      style={{
        padding: '1.25rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
        borderLeft: incident.is_emerging ? '4px solid #ef4444' : undefined
      }}
    >
      <div>
        {/* Top Badges Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className={`badge badge-status-${incident.status.toLowerCase()}`}>
              {incident.status.replace('_', ' ')}
            </span>
            <span className={`badge badge-sev-${incident.severity}`}>
              {incident.severity}
            </span>
            {incident.is_emerging && (
              <span className="badge badge-emerging" title="Rapid velocity spike detected">
                <Zap size={12} /> EMERGING
              </span>
            )}
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> {formattedTime}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '8px', lineHeight: 1.3 }}>
          {incident.title}
        </h3>

        {/* Building & Category Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Building2 size={14} color="var(--accent-blue)" /> {incident.building}
          </span>
          <span className="category-chip">
            {incident.category}
          </span>
        </div>

        {/* AI Summary Snippet */}
        {incident.summary && (
          <p style={{
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4
          }}>
            {incident.summary}
          </p>
        )}
      </div>

      {/* Footer Meter & Reports Count */}
      <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px' }}>
        {/* Impact Meter */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            <span>IMPACT SCORE</span>
            <span style={{ color: incident.impact_score >= 75 ? '#ef4444' : '#f8fafc' }}>
              {incident.impact_score} / 100
            </span>
          </div>
          <div className="impact-meter-bg">
            <div 
              className={`impact-meter-fill ${getImpactFillClass(incident.impact_score)}`} 
              style={{ width: `${Math.min(100, Math.max(5, incident.impact_score))}%` }} 
            />
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FileText size={14} /> {incident.report_count} {incident.report_count === 1 ? 'Report' : 'Reports Linked'}
          </span>

          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '2px' }}>
            Inspect & Triage <ChevronRight size={16} />
          </span>
        </div>
      </div>
    </div>
  );
};
