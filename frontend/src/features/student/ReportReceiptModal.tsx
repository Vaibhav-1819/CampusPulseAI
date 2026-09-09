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
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Your Tracking Ticket ID
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>
                {report.id}
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyId}
              icon={<CopyIcon size={14} />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          {/* AI Correlation Insight Card */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1px solid rgba(79, 70, 229, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '1.15rem',
              boxShadow: '0 4px 20px -4px rgba(79, 70, 229, 0.15)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <SparklesIcon size={16} style={{ color: '#c084fc' }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0' }}>
                  AI Incident Correlation
                </span>
              </div>
              {incident.is_emerging && (
                <span
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    padding: '0.15rem 0.55rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <AlertTriangleIcon size={13} />
                  EMERGING INCIDENT
                </span>
              )}
            </div>

            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              {incident.title}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
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
                  color: 'var(--text-muted)',
                  alignSelf: 'center',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                {incident.report_count} {incident.report_count === 1 ? 'Report' : 'Correlated Reports'}
              </span>
            </div>

            {/* Explainability reasoning */}
            {report.correlation_reason && (
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderLeft: '3px solid var(--accent-primary)',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                  fontSize: '0.82rem',
                  color: '#cbd5e1',
                  lineHeight: 1.4
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.75rem', color: '#a5b4fc', marginBottom: '0.2rem' }}>
                  {isGrouped ? 'Clustering Justification' : 'Anchor Incident Created'}
                </div>
                "{report.correlation_reason}"
              </div>
            )}
          </div>

          {/* AI Recommended Facility Action preview */}
          {incident.recommendation && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                fontSize: '0.82rem',
                color: '#d1fae5'
              }}
            >
              <span style={{ fontWeight: 700, color: '#34d399', display: 'block', marginBottom: '0.2rem' }}>
                Campus Facilities Action Notice:
              </span>
              {incident.recommendation}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--card-border)',
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
