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
      className="glass-card card-3d-lift"
      onClick={() => onSelect(incident)}
      style={{
        padding: '1.35rem',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
        border: incident.is_emerging ? '1px solid rgba(239, 68, 68, 0.55)' : '1px solid var(--border-medium)',
        borderLeft: incident.is_emerging ? '4px solid #ef4444' : undefined,
        boxShadow: incident.is_emerging ? '0 0 25px rgba(239, 68, 68, 0.2)' : 'var(--shadow-sm)',
        overflow: 'hidden'
      }}
    >
      <div>
        {/* Top Badges Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className={`badge badge-status-${incident.status.toLowerCase()}`}>
              {incident.status.replace('_', ' ')}
            </span>
            <span className={`badge badge-sev-${incident.severity}`}>
              {incident.severity}
            </span>
            {incident.is_emerging && (
              <span className="badge badge-emerging" title="Rapid velocity spike detected">
                <Zap size={12} /> SPIKE
              </span>
            )}
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
            <Clock size={12} /> {formattedTime}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: 800, 
          color: 'var(--text-primary)', 
          marginBottom: '8px', 
          lineHeight: 1.3,
          letterSpacing: '-0.02em'
        }}>
          {incident.title}
        </h3>

        {/* Building & Category Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
            <Building2 size={13} color="var(--accent-blue)" /> {incident.building}
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
            lineHeight: 1.5
          }}>
            {incident.summary}
          </p>
        )}
      </div>

      {/* Footer Meter & Reports Count */}
      <div style={{ marginTop: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
        {/* Impact Meter */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '5px' }}>
            <span>CRITICALITY IMPACT</span>
            <span style={{ color: incident.impact_score >= 75 ? '#ef4444' : incident.impact_score >= 50 ? '#f97316' : '#38bdf8', fontFamily: 'var(--font-mono)' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <FileText size={14} /> {incident.report_count} {incident.report_count === 1 ? 'Report' : 'Correlated Reports'}
          </span>

          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '3px' }}>
            Deep Triage <ChevronRight size={15} />
          </span>
        </div>
      </div>
    </div>
  );
};
