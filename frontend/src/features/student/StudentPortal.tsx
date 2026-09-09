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
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2.5rem' }}>
          <div
            className="shimmer-badge"
            style={{ marginBottom: '1.25rem' }}
          >
            <SparklesIcon size={14} />
            <span>Autonomous Campus Infrastructure Intelligence</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2rem, 4.5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1rem' 
          }}>
            Report Campus Disruptions.{' '}
            <span style={{ 
              background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              We Correlate Them.
            </span>
          </h1>

          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.125rem)', 
            color: 'var(--text-secondary)', 
            lineHeight: 1.65, 
            maxWidth: '680px', 
            margin: '0 auto 1.5rem' 
          }}>
            Single complaints look isolated. CampusPulse AI connects reports across space, time, and semantics to alert facilities before disruptions cascade across buildings.
          </p>

          {/* Operational Telemetry Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            flexWrap: 'wrap',
            marginBottom: '0.5rem'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-full)',
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#34d399'
            }}>
              <span className="pulse-dot" style={{ width: 6, height: 6, backgroundColor: '#10b981' }} />
              Cluster Engine: Real-Time Active
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              borderRadius: 'var(--radius-full)',
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#60a5fa'
            }}>
              <span>Multi-Factor Weights:</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#93c5fd' }}>0.55/0.20/0.15/0.10</span>
            </div>

            {tickets.length > 0 && (
              <button
                onClick={() => setShowTracker(true)}
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.35)',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#c7d2fe',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>You have {tickets.length} submitted ticket{tickets.length > 1 ? 's' : ''}</span>
                <span style={{ textDecoration: 'underline' }}>Track Status →</span>
              </button>
            )}
          </div>
        </div>

        {/* Emergency Hotline Alert Bar */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(249, 115, 22, 0.08) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.85rem 1.35rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.85rem',
            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangleIcon size={18} style={{ color: '#f87171' }} />
            </div>
            <span style={{ fontSize: '0.875rem', color: '#fca5a5', fontWeight: 500 }}>
              Life-threatening emergencies or active gas/fire/structural hazards? Call campus emergency dispatch immediately.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', fontWeight: 600, color: '#f87171' }}>
            <span style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '3px 8px', borderRadius: '4px' }}>Security: 555-0199</span>
            <span style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '3px 8px', borderRadius: '4px' }}>Facilities: 555-0144</span>
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
