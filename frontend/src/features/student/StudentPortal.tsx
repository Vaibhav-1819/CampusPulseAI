import React, { useState, useEffect } from 'react';
import { CreateReportResponseData, SubmittedTicket } from '../../types';
import { ReportForm } from './ReportForm';
import { ReportReceiptModal } from './ReportReceiptModal';
import { TrackReportsList } from './TrackReportsList';
import { SparklesIcon, AlertTriangleIcon } from '../../components/Icons';

const STORAGE_KEY = 'campuspulse_student_tickets';

export const StudentPortal: React.FC = () => {
  const [tickets, setTickets] = useState<SubmittedTicket[]>([]);
  const [latestReceipt, setLatestReceipt] = useState<CreateReportResponseData | null>(null);
  const [showTracker, setShowTracker] = useState(false);

  // Load tickets from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTickets(JSON.parse(saved));
      }
    } catch {
      // Ignore storage read errors
    }
  }, []);

  const handleSuccess = (data: CreateReportResponseData) => {
    setLatestReceipt(data);
    const newTicket: SubmittedTicket = {
      report: data.report,
      incident: data.incident,
      submittedAt: new Date().toISOString()
    };

    const updated = [newTicket, ...tickets.filter((t) => t.report.id !== data.report.id)];
    setTickets(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage write errors
    }
  };

  const handleClearHistory = () => {
    setTickets([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <main style={{ padding: 'clamp(1.5rem, 4vw, 3rem) 0 4rem' }}>
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(79, 70, 229, 0.12)',
              border: '1px solid rgba(79, 70, 229, 0.25)',
              borderRadius: 'var(--radius-full)',
              padding: '0.3rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#c084fc',
              marginBottom: '1rem'
            }}
          >
            <SparklesIcon size={14} />
            <span>AI-Driven Campus Facility Intelligence</span>
          </div>

          <h1 style={{ marginBottom: '0.85rem' }}>
            Report Campus Disruptions.{' '}
            <span style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              We Correlate Them.
            </span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Single complaints look isolated. CampusPulse AI links your report across location, category, and semantics to alert administrators to systemic failures before disruptions cascade.
          </p>
        </div>

        {/* Emergency Hotline Alert Bar */}
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <AlertTriangleIcon size={18} style={{ color: '#ef4444' }} />
            <span style={{ fontSize: '0.85rem', color: '#fca5a5', fontWeight: 500 }}>
              Life-threatening emergencies or active gas/fire hazards? Call campus emergency dispatch immediately.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', fontWeight: 600, color: '#f87171' }}>
            <span>Security: 555-0199</span>
            <span>Facilities: 555-0144</span>
          </div>
        </div>

        {/* Main Report Form */}
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <ReportForm onSuccess={handleSuccess} />
        </div>
      </div>

      {/* Post-submission receipt modal */}
      {latestReceipt && (
        <ReportReceiptModal
          data={latestReceipt}
          onClose={() => setLatestReceipt(null)}
          onNewReport={() => setLatestReceipt(null)}
        />
      )}

      {/* Tracker history list modal */}
      {showTracker && (
        <TrackReportsList
          tickets={tickets}
          onClose={() => setShowTracker(false)}
          onClear={handleClearHistory}
        />
      )}
    </main>
  );
};
