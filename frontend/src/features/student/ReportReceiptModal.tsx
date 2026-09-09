import React, { useState } from 'react';
import { CreateReportResponseData } from '../../types';
import { CheckCircleIcon, CopyIcon, CloseIcon, SparklesIcon, AlertTriangleIcon } from '../../components/Icons';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { useToast } from '../../components/Toast';
import { Check, Clock, Building2, Tag, ShieldCheck, ArrowRight, Share2 } from 'lucide-react';

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

  const hasCorrelation = Boolean(report.incident_id && report.correlation_score && report.correlation_score < 1.0);
  const matchPercent = report.correlation_score ? Math.round(report.correlation_score * 100) : 100;
  const formattedTime = new Date(report.created_at || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1000 }}>
      <div
        className="glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '620px',
          width: '95%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 0,
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-xl)',
          animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Modal Header with Confirmation Animation */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--status-resolved)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
              }}
            >
              <CheckCircleIcon size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Incident Submitted
                </h3>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--status-resolved)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  DISPATCHED
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                Logged into campus incident ledger and indexed for AI correlation.
              </p>
            </div>
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

        {/* Modal Body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Ticket ID Linear Card */}
          <div
            style={{
              background: 'var(--bg-surface-1)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                Incident Tracking Ticket ID
              </span>
              <div
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent-primary)',
                  letterSpacing: '0.02em',
                  marginTop: '2px'
                }}
              >
                {report.id}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Track live status under <strong>"My Reports"</strong> anytime.
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyId}
              icon={copied ? <Check size={14} /> : <CopyIcon size={14} />}
            >
              {copied ? 'Copied!' : 'Copy Ticket'}
            </Button>
          </div>

          {/* Quick Details Parameter Matrix */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem',
              background: 'var(--bg-surface-2)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Tag size={12} /> Category
              </span>
              <div style={{ marginTop: '4px' }}>
                <Badge variant="category" category={report.category}>
                  {report.category}
                </Badge>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={12} /> Location
              </span>
              <div style={{ marginTop: '4px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {report.building} {report.room ? `(${report.room})` : ''}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> Logged At
              </span>
              <div style={{ marginTop: '4px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {formattedTime}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} /> Current Status
              </span>
              <div style={{ marginTop: '4px' }}>
                <Badge variant="status" status={incident.status}>
                  {incident.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Incident Intelligence Correlation Card */}
          <div
            style={{
              background: 'var(--bg-surface-1)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-primary)'
                  }}
                >
                  <SparklesIcon size={16} />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  AI Incident Correlation Analysis
                </span>
              </div>
              {incident.is_emerging && (
                <span className="badge badge-emerging">
                  <AlertTriangleIcon size={12} />
                  VELOCITY SPIKE
                </span>
              )}
            </div>

            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                {incident.title}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.85rem' }}>
                <Badge variant="severity" severity={incident.severity}>
                  {incident.severity} SEVERITY
                </Badge>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    alignSelf: 'center',
                    background: 'var(--bg-surface-2)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: 600,
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  {incident.report_count} {incident.report_count === 1 ? 'Report' : 'Correlated Reports'}
                </span>
                {hasCorrelation && (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--status-resolved)',
                      background: 'rgba(16, 185, 129, 0.1)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      border: '1px solid rgba(16, 185, 129, 0.25)'
                    }}
                  >
                    {matchPercent}% Proximity Match
                  </span>
                )}
              </div>
            </div>

            {/* Explainability Rationale */}
            {report.correlation_reason ? (
              <div
                style={{
                  background: 'var(--bg-surface-2)',
                  borderLeft: '3px solid var(--accent-primary)',
                  padding: '0.85rem 1rem',
                  borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                  fontSize: '0.85rem',
                  color: 'var(--text-primary)',
                  lineHeight: 1.5
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--accent-primary)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {hasCorrelation ? '🔍 Correlation Rationale' : '🎯 Anchor Incident Established'}
                </div>
                "{report.correlation_reason}"
              </div>
            ) : (
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>
                Report assigned to active incident cluster. Awaiting correlating complaints across this zone.
              </p>
            )}
          </div>

          {/* AI Recommended Facility Action Protocol */}
          {incident.recommendation && (
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: '0.95rem 1.15rem',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                lineHeight: 1.5
              }}
            >
              <span style={{ fontWeight: 700, color: 'var(--status-resolved)', display: 'block', marginBottom: '0.3rem', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
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
            background: 'var(--bg-surface-2)'
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
