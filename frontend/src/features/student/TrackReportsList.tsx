import React, { useState } from 'react';
import { SubmittedTicket, IncidentStatus } from '../../types';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { CloseIcon, SparklesIcon, CopyIcon } from '../../components/Icons';
import { useToast } from '../../components/Toast';
import { Check, Clock, Building2, Tag, ChevronRight, Search, CheckCircle2 } from 'lucide-react';

interface TrackReportsListProps {
  tickets: SubmittedTicket[];
  onClose: () => void;
  onClear: () => void;
  onSelectTicket?: (ticket: SubmittedTicket) => void;
}

const LIFECYCLE_STEPS = [
  { key: 'SUBMITTED', label: 'Submitted' },
  { key: 'UNDER_REVIEW', label: 'Under Review' },
  { key: 'INVESTIGATING', label: 'Investigating' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'RESOLVED', label: 'Resolved' }
];

export const TrackReportsList: React.FC<TrackReportsListProps> = ({
  tickets,
  onClose,
  onClear,
  onSelectTicket
}) => {
  const { showToast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    showToast(`Ticket ID ${id} copied!`, 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStepIndex = (status: IncidentStatus): number => {
    switch (status) {
      case 'OPEN':
        return 1; // Under Review
      case 'INVESTIGATING':
        return 2; // Investigating
      case 'IN_PROGRESS':
        return 3; // In Progress / Assigned
      case 'RESOLVED':
      case 'CLOSED':
        return 4; // Resolved
      default:
        return 0; // Submitted
    }
  };

  const filteredTickets = tickets.filter((t) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      t.report.id.toLowerCase().includes(q) ||
      t.incident.title.toLowerCase().includes(q) ||
      t.report.building.toLowerCase().includes(q) ||
      t.report.category.toLowerCase().includes(q) ||
      (t.report.room && t.report.room.toLowerCase().includes(q))
    );
  });

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1000 }}>
      <div
        className="glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '720px',
          width: '95%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-xl)',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
                My Reported Incidents
              </h3>
              <span
                style={{
                  background: 'var(--accent-primary)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                {tickets.length}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Track remediation lifecycles and real-time status updates from campus facilities.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-subtle)',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-sm)'
            }}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Filter Bar if multiple tickets */}
        {tickets.length > 2 && (
          <div
            style={{
              padding: '0.75rem 1.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-1)'
            }}
          >
            <div style={{ position: 'relative' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-subtle)'
                }}
              />
              <input
                type="text"
                placeholder="Search ticket by ID, title, or building..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 12px 6px 36px',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.825rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1 }}>
          {tickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem',
                  color: 'var(--text-subtle)'
                }}
              >
                <SparklesIcon size={24} />
              </div>
              <h4 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                No reports submitted yet
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '380px', margin: '0 auto' }}>
                When you submit an infrastructure issue, its ticket ID, lifecycle progression, and remediation status will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredTickets.map((t) => {
                const currentStepIdx = getStepIndex(t.incident.status);

                return (
                  <div
                    key={t.report.id}
                    onClick={() => onSelectTicket && onSelectTicket(t)}
                    className="card-3d-lift"
                    style={{
                      background: 'var(--bg-surface-1)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.15rem',
                      cursor: onSelectTicket ? 'pointer' : 'default',
                      transition: 'all var(--transition-fast)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    {/* Top Row: Ticket ID & Status */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            color: 'var(--accent-primary)',
                            background: 'var(--bg-surface-2)',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-subtle)'
                          }}
                        >
                          {t.report.id}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyId(e, t.report.id)}
                          title="Copy Ticket ID"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-subtle)',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {copiedId === t.report.id ? <Check size={13} color="var(--status-resolved)" /> : <CopyIcon size={13} />}
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Badge variant="status" status={t.incident.status}>
                          {t.incident.status}
                        </Badge>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(t.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Incident Title */}
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                      {t.incident.title}
                    </div>

                    {/* Report Description */}
                    <p
                      style={{
                        fontSize: '0.825rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '0.85rem',
                        lineHeight: 1.45,
                        background: 'var(--bg-surface-2)',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        fontStyle: 'italic'
                      }}
                    >
                      "{t.report.description}"
                    </p>

                    {/* Lifecycle Progression Visualizer */}
                    <div style={{ marginBottom: '0.85rem', padding: '0.6rem 0.75rem', background: 'var(--bg-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
                        Resolution Lifecycle:
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                        {LIFECYCLE_STEPS.map((st, sIdx) => {
                          const isComplete = sIdx <= currentStepIdx;
                          const isCurrent = sIdx === currentStepIdx;

                          return (
                            <div
                              key={st.key}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '3px',
                                flex: 1,
                                position: 'relative',
                                zIndex: 2
                              }}
                            >
                              <div
                                style={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: '50%',
                                  background: isComplete
                                    ? (isCurrent ? 'var(--accent-primary)' : 'var(--status-resolved)')
                                    : 'var(--bg-canvas)',
                                  border: `2px solid ${isComplete ? (isCurrent ? 'var(--accent-primary)' : 'var(--status-resolved)') : 'var(--border-medium)'}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: isCurrent ? '0 0 8px rgba(99, 102, 241, 0.4)' : 'none'
                                }}
                              >
                                {isComplete && !isCurrent && <Check size={10} color="#ffffff" />}
                              </div>
                              <span
                                style={{
                                  fontSize: '0.65rem',
                                  fontWeight: isCurrent ? 700 : 500,
                                  color: isCurrent ? 'var(--accent-primary)' : isComplete ? 'var(--text-primary)' : 'var(--text-subtle)',
                                  textAlign: 'center'
                                }}
                              >
                                {st.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Metadata Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                        <Badge variant="category" category={t.report.category}>
                          {t.report.category}
                        </Badge>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Building2 size={12} /> {t.report.building} {t.report.room ? `(${t.report.room})` : ''}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Logged: {new Date(t.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-surface-2)'
          }}
        >
          {tickets.length > 0 ? (
            <button
              onClick={onClear}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--status-critical)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                fontWeight: 600,
                padding: 0
              }}
            >
              Clear Ticket History
            </button>
          ) : (
            <div />
          )}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
