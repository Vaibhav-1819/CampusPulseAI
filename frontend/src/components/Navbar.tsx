import React, { useEffect, useState } from 'react';
import { reportService, BackendConnectionMode } from '../services/reportService';
import { SparklesIcon } from './Icons';

interface NavbarProps {
  onOpenTracker?: () => void;
  savedTicketCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTracker, savedTicketCount = 0 }) => {
  const [mode, setMode] = useState<BackendConnectionMode>('detecting');

  useEffect(() => {
    const unsubscribe = reportService.subscribe((currentMode) => {
      setMode(currentMode);
    });
    return unsubscribe;
  }, []);

  const handleToggleMode = () => {
    if (mode === 'live') {
      reportService.setMode('mock');
    } else {
      reportService.detectBackend();
    }
  };

  return (
    <header
      style={{
        borderBottom: '1px solid var(--card-border)',
        background: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.25rem'
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(79, 70, 229, 0.4)'
            }}
          >
            <SparklesIcon size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: '#ffffff' }}>
                CampusPulse<span style={{ color: 'var(--accent-cyan)' }}>AI</span>
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(79, 70, 229, 0.18)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(79, 70, 229, 0.3)',
                  fontWeight: 600
                }}
              >
                STUDENT
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', margin: 0 }}>
              Campus Infrastructure Incident Portal
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Connection Status Indicator */}
          <button
            onClick={handleToggleMode}
            title="Click to re-check backend connection or switch mode"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--card-border)',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.2s ease'
            }}
          >
            <span
              className="pulse-dot"
              style={{
                backgroundColor:
                  mode === 'live' ? 'var(--status-resolved)' : mode === 'mock' ? 'var(--status-open)' : 'var(--text-subtle)'
              }}
            />
            <span>
              {mode === 'live'
                ? 'Live Backend API'
                : mode === 'mock'
                ? 'Mock Standalone Mode'
                : 'Detecting API...'}
            </span>
          </button>

          {/* Track Tickets Button */}
          {onOpenTracker && (
            <button
              onClick={onOpenTracker}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(79, 70, 229, 0.12)',
                border: '1px solid rgba(79, 70, 229, 0.3)',
                color: '#a5b4fc',
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span>My Reports</span>
              {savedTicketCount > 0 && (
                <span
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    padding: '0.05rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700
                  }}
                >
                  {savedTicketCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
