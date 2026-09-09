import React, { useState } from 'react';
import { CreateReportResponseData } from '../../types';
import { CheckCircleIcon, CopyIcon, CloseIcon, SparklesIcon, AlertTriangleIcon } from '../../components/Icons';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast';

interface ReportReceiptModalProps {
  data: CreateReportResponseData;
  onClose: () => void;
  onNewReport: () => void;
}

export const ReportReceiptModal: React.FC<ReportReceiptModalProps> = ({
  data,
  onClose,
  onNewReport
}) => {
  const { report, incident } = data;
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(report.id);
    setCopied(true);
    showToast(`Ticket ID ${report.id} copied to clipboard!`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const isGrouped = Boolean(report.incident_id && report.correlation_score && report.correlation_score < 1.0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircleIcon size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#ffffff' }}>
                Incident Report Logged
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Parsed and correlated by CampusPulse AI
              </p>
            </div>
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

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Ticket ID Box */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(13, 18, 34, 0.9) 0%, rgba(20, 28, 51, 0.8) 100%)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Incident Tracking ID
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', letterSpacing: '0.02em', marginTop: '2px' }}>
                {report.id}
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyId}
              icon={<CopyIcon size={14} />}
            >
              {copied ? 'Copied!' : 'Copy Ticket'}
            </Button>
          </div>

          {/* AI Intelligence Dossier Card */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(24, 36, 66, 0.85) 0%, rgba(13, 18, 34, 0.95) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.35)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.35rem',
              boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.5), 0 0 25px rgba(99, 102, 241, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: '6px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc'
                }}>
                  <SparklesIcon size={16} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.01em' }}>
                  AI Incident Clustering Dossier
                </span>
              </div>
              {incident.is_emerging && (
                <span className="badge badge-emerging">
                  <AlertTriangleIcon size={12} />
                  CRITICAL SPIKE
                </span>
              )}
            </div>

            {/* Circular Match Gauge & Incident Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: isGrouped ? '100px 1fr' : '1fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
              {isGrouped && (
                <div style={{ textAlign: 'center', position: 'relative', width: 90, height: 90, margin: '0 auto' }}>
                  <svg viewBox="0 0 36 36" className="circular-chart" style={{ width: 90, height: 90 }}>
                    <path
                      className="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="circle"
                      stroke={report.correlation_score && report.correlation_score >= 0.8 ? '#10b981' : '#3b82f6'}
                      strokeDasharray={`${Math.round((report.correlation_score || 0.85) * 100)}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1
                  }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                      {Math.round((report.correlation_score || 0.85) * 100)}%
                    </span>
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-subtle)', textTransform: 'uppercase', marginTop: '2px', fontWeight: 700 }}>
                      Match
                    </span>
                  </div>
                </div>
              )}

              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                  {incident.title}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  <Badge variant="category" category={incident.category}>
                    {incident.category}
                  </Badge>
                  <Badge variant="severity" severity={incident.severity}>
                    {incident.severity} SEVERITY
                  </Badge>
                  <Badge variant="status" status={incident.status}>
                    {incident.status}
                  </Badge>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      alignSelf: 'center',
                      background: 'rgba(255, 255, 255, 0.06)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 600
                    }}
                  >
                    {incident.report_count} {incident.report_count === 1 ? 'Report' : 'Linked Reports'}
                  </span>
                </div>
              </div>
            </div>

            {/* Explainability reasoning with highlight */}
            {report.correlation_reason && (
              <div
                style={{
                  background: 'rgba(7, 10, 19, 0.7)',
                  borderLeft: '3px solid var(--accent-primary)',
                  padding: '0.85rem 1rem',
                  borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                  fontSize: '0.85rem',
                  color: '#e2e8f0',
                  lineHeight: 1.5,
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#a5b4fc', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {isGrouped ? '🔍 Multi-Factor Correlation Rationale' : '🎯 Anchor Incident Seeded'}
                </div>
                "{report.correlation_reason}"
              </div>
            )}
          </div>

          {/* AI Recommended Facility Action preview */}
          {incident.recommendation && (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.95rem 1.15rem',
                fontSize: '0.85rem',
                color: '#d1fae5',
                lineHeight: 1.5
              }}
            >
              <span style={{ fontWeight: 700, color: '#34d399', display: 'block', marginBottom: '0.3rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                🛠️ Campus Facilities Action Protocol:
              </span>
              {incident.recommendation}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1.15rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'flex-end',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <Button variant="secondary" onClick={onClose}>
            Done
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              onNewReport();
            }}
          >
            Submit Another Report
          </Button>
        </div>
      </div>
    </div>
  );
};
