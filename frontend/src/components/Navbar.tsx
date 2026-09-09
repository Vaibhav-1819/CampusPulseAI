import React, { useEffect, useState } from 'react';
import { reportService, BackendConnectionMode } from '../services/reportService';
import { api } from '../services/api';
import { SparklesIcon } from './Icons';
import { User, Shield, Activity, Clock, Terminal } from 'lucide-react';

interface NavbarProps {
  activeView?: 'student' | 'admin';
  onSelectView?: (view: 'student' | 'admin') => void;
  onOpenTracker?: () => void;
  savedTicketCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeView = 'student', 
  onSelectView, 
  onOpenTracker, 
  savedTicketCount = 0 
}) => {
  const [mode, setMode] = useState<BackendConnectionMode>('detecting');

  useEffect(() => {
    const unsubscribe = reportService.subscribe((currentMode) => {
      setMode(currentMode);
      api.setForceMockMode(currentMode === 'mock');
    });
    return unsubscribe;
  }, []);

  const handleToggleMode = () => {
    if (mode === 'live') {
      reportService.setMode('mock');
      api.setForceMockMode(true);
    } else {
      reportService.detectBackend();
      api.setForceMockMode(false);
    }
  };

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(7, 10, 19, 0.82)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          minHeight: '4.5rem',
          paddingTop: '0.65rem',
          paddingBottom: '0.65rem'
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 20px rgba(79, 70, 229, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}
          >
            <SparklesIcon size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', color: '#ffffff' }}>
                CampusPulse<span style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '0.15rem 0.55rem',
                  borderRadius: 'var(--radius-full)',
                  background: activeView === 'admin' ? 'rgba(168, 85, 247, 0.16)' : 'rgba(56, 189, 248, 0.16)',
                  color: activeView === 'admin' ? '#d8b4fe' : '#7dd3fc',
                  border: activeView === 'admin' ? '1px solid rgba(168, 85, 247, 0.35)' : '1px solid rgba(56, 189, 248, 0.35)',
                  fontWeight: 700,
                  letterSpacing: '0.04em'
                }}
              >
                {activeView === 'admin' ? 'COMMAND CENTER' : 'STUDENT PORTAL'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', margin: 0 }}>
                Autonomous Infrastructure Incident Intelligence
              </p>
              <span style={{ fontSize: '0.7rem', color: 'var(--border-strong)' }}>•</span>
              <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="pulse-dot" style={{ width: 6, height: 6, backgroundColor: '#10b981' }} />
                Operational
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          
          {/* Linear-Style Segmented View Switcher */}
          {onSelectView && (
            <div 
              style={{
                display: 'flex',
                background: 'rgba(13, 18, 34, 0.95)',
                padding: '3px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-medium)',
                gap: '3px',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.5)'
              }}
            >
              <button
                onClick={() => onSelectView('student')}
                title="Press '1' to switch to Student Portal"
                style={{
                  background: activeView === 'student' ? 'linear-gradient(135deg, #4f46e5, #06b6d4)' : 'transparent',
                  border: 'none',
                  color: activeView === 'student' ? '#ffffff' : 'var(--text-muted)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  transition: 'all 0.2s ease',
                  boxShadow: activeView === 'student' ? '0 2px 10px rgba(79, 70, 229, 0.4)' : 'none'
                }}
              >
                <User size={14} /> 
                <span>Student Portal</span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: activeView === 'student' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeView === 'student' ? '#ffffff' : 'var(--text-subtle)',
                  fontFamily: 'var(--font-mono)'
                }}>1</span>
              </button>

              <button
                onClick={() => onSelectView('admin')}
                title="Press '2' to switch to Admin Command Center"
                style={{
                  background: activeView === 'admin' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                  border: 'none',
                  color: activeView === 'admin' ? '#ffffff' : 'var(--text-muted)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  transition: 'all 0.2s ease',
                  boxShadow: activeView === 'admin' ? '0 2px 10px rgba(59, 130, 246, 0.4)' : 'none'
                }}
              >
                <Shield size={14} /> 
                <span>Admin Command</span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: activeView === 'admin' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeView === 'admin' ? '#ffffff' : 'var(--text-subtle)',
                  fontFamily: 'var(--font-mono)'
                }}>2</span>
              </button>
            </div>
          )}

          {/* Connection Status Orb Button */}
          <button
            onClick={handleToggleMode}
            title="Click to toggle between Live Express Backend and Standalone Offline Simulation Sandbox"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-medium)',
              padding: '0.45rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-sans)',
              transition: 'all 0.2s ease'
            }}
          >
            <span
              className="pulse-dot"
              style={{
                backgroundColor:
                  mode === 'live' ? '#10b981' : mode === 'mock' ? '#f59e0b' : 'var(--text-subtle)',
                boxShadow: mode === 'live' ? '0 0 10px #10b981' : mode === 'mock' ? '0 0 10px #f59e0b' : 'none'
              }}
            />
            <span style={{ fontWeight: 600, fontSize: '0.78rem' }}>
              {mode === 'live'
                ? '🟢 Live Cluster Engine'
                : mode === 'mock'
                ? '⚡ Demo Sandbox'
                : 'Detecting Engine...'}
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                color: mode === 'live' ? '#34d399' : '#fbbf24',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '1px 5px',
                borderRadius: '4px'
              }}
            >
              {mode === 'live' ? '<8ms' : 'mock'}
            </span>
          </button>

          {/* Track Tickets Button (Shown in student mode) */}
          {activeView === 'student' && onOpenTracker && (
            <button
              onClick={onOpenTracker}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                color: '#c7d2fe',
                padding: '0.45rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 10px rgba(99, 102, 241, 0.15)'
              }}
            >
              <Clock size={14} />
              <span>My Reports</span>
              {savedTicketCount > 0 && (
                <span
                  style={{
                    background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    padding: '0.1rem 0.45rem',
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
