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
      background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(249, 115, 22, 0.15))',
      border: '1px solid rgba(239, 68, 68, 0.5)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
      boxShadow: '0 4px 20px rgba(239, 68, 68, 0.25)',
      animation: 'pulse-glow-red 2s infinite'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          padding: '10px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <ShieldAlert size={26} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              ⚡ Emerging Incident Spike Detected!
            </h3>
            <span className="badge badge-emerging">
              {emergingIncidents.length} High Velocity {emergingIncidents.length === 1 ? 'Surge' : 'Surges'}
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#fca5a5', marginTop: '2px' }}>
            Report arrival velocity exceeded critical thresholds (≥ 3 reports in 60m). Urgent admin triage advised.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {emergingIncidents.map(inc => (
          <button
            key={inc.id}
            onClick={() => onSelectIncident(inc)}
            className="btn btn-secondary btn-sm"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderColor: 'rgba(239, 68, 68, 0.5)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{inc.building} ({inc.report_count} reps)</span>
            <ArrowRight size={14} />
          </button>
        ))}

        <button
          onClick={onFilterEmergingOnly}
          className="btn btn-danger btn-sm"
          style={{ fontWeight: 600 }}
        >
          View All Emerging
        </button>
      </div>
    </div>
  );
};
