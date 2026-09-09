import React from 'react';
import { Incident } from '@shared/types';
import { Zap, ArrowRight, ShieldAlert } from 'lucide-react';

interface EmergingAlertBannerProps {
  emergingIncidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onFilterEmergingOnly: () => void;
}

export const EmergingAlertBanner: React.FC<EmergingAlertBannerProps> = ({
  emergingIncidents,
  onSelectIncident,
  onFilterEmergingOnly
}) => {
  if (emergingIncidents.length === 0) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.22) 0%, rgba(249, 115, 22, 0.18) 100%)',
      border: '1px solid rgba(239, 68, 68, 0.6)',
      borderRadius: 'var(--radius-lg)',
      padding: '1rem 1.35rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      boxShadow: '0 8px 32px rgba(239, 68, 68, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      animation: 'pulse-glow-red 2s infinite'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          padding: '12px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)'
        }}>
          <ShieldAlert size={28} className="spin-pulse" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
              ⚡ High-Velocity Incident Surge Detected
            </h3>
            <span className="badge badge-emerging" style={{ fontSize: '0.725rem' }}>
              {emergingIncidents.length} Active {emergingIncidents.length === 1 ? 'Surge' : 'Surges'}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#fca5a5', marginTop: '4px', marginBottom: 0, lineHeight: 1.4 }}>
            Report arrival velocity exceeded critical thresholds (≥ 3 reports in 60m window). Rapid admin triage recommended.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {emergingIncidents.map(inc => (
          <button
            key={inc.id}
            onClick={() => onSelectIncident(inc)}
            className="card-3d-lift"
            style={{
              background: 'rgba(10, 15, 30, 0.75)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#ffffff',
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <span>{inc.building}</span>
            <span style={{ background: 'rgba(239, 68, 68, 0.3)', padding: '1px 6px', borderRadius: '4px', fontSize: '0.72rem', color: '#fca5a5' }}>
              {inc.report_count} reps
            </span>
            <ArrowRight size={13} color="#f87171" />
          </button>
        ))}

        <button
          onClick={onFilterEmergingOnly}
          className="btn btn-danger btn-sm"
          style={{ fontWeight: 700, padding: '0.45rem 1rem' }}
        >
          View All Emerging
        </button>
      </div>
    </div>
  );
};
