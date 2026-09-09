import React from 'react';
import { SubmittedTicket } from '../../types';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { CloseIcon, SparklesIcon } from '../../components/Icons';

interface TrackReportsListProps {
  tickets: SubmittedTicket[];
  onClose: () => void;
  onClear: () => void;
  onSelectTicket?: (ticket: SubmittedTicket) => void;
}

export const TrackReportsList: React.FC<TrackReportsListProps> = ({
  tickets,
  onClose,
  onClear,
  onSelectTicket
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
              My Reported Incidents ({tickets.length})
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', margin: 0 }}>
              Tickets submitted from this device and their current triage status
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-subtle)',
              cursor: 'pointer',
              padding: '0.3rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem 1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {tickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: 'var(--text-subtle)'
                }}
              >
                <SparklesIcon size={24} />
              </div>
              <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                No reports submitted yet
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                When you submit an infrastructure issue, it will be tracked here with live status updates.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {tickets.map((t) => (
                <div
                  key={t.report.id}
                  onClick={() => onSelectTicket && onSelectTicket(t)}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    cursor: onSelectTicket ? 'pointer' : 'default',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-cyan)' }}>
                      {t.report.id}
                    </span>
                    <Badge variant="status" status={t.incident.status}>
                      {t.incident.status}
                    </Badge>
                  </div>

                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
                    {t.incident.title}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.65rem', lineHeight: 1.35 }}>
                    "{t.report.description}"
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <Badge variant="category" category={t.report.category}>
                        {t.report.category}
                      </Badge>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                        📍 {t.report.building} {t.report.room ? `(${t.report.room})` : ''}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)' }}>
                      {new Date(t.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--card-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {tickets.length > 0 ? (
            <button
              onClick={onClear}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-subtle)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Clear History
            </button>
          ) : <div />}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
