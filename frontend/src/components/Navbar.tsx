import React, { useEffect, useState } from 'react';
import { reportService, BackendConnectionMode } from '../services/reportService';
import { api } from '../services/api';
import { SparklesIcon } from './Icons';
import { User, Shield, Activity, Clock, Sun, Moon, Home, Search, Command } from 'lucide-react';

interface NavbarProps {
  activeView?: 'overview' | 'student' | 'admin';
  onSelectView?: (view: 'overview' | 'student' | 'admin') => void;
  onOpenTracker?: () => void;
  onOpenCommandPalette?: () => void;
  savedTicketCount?: number;
  currentTheme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeView = 'overview', 
  onSelectView, 
  onOpenTracker, 
  onOpenCommandPalette,
  savedTicketCount = 0,
  currentTheme,
  onToggleTheme
}) => {
  const [mode, setMode] = useState<BackendConnectionMode>('detecting');
  const [internalTheme, setInternalTheme] = useState<'dark' | 'light'>('dark');

  const theme = currentTheme || internalTheme;

  // Load theme preference on mount if not controlled
  useEffect(() => {
    if (currentTheme) return;
    try {
      const savedTheme = localStorage.getItem('campuspulse_theme') as 'dark' | 'light' | null;
      const initialTheme = savedTheme || 'dark';
      setInternalTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    } catch {
      // Ignore
    }
  }, [currentTheme]);

  const toggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
      return;
    }
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setInternalTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('campuspulse_theme', nextTheme);
    } catch {
      // Ignore
    }
  };

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
        backgroundColor: 'var(--bg-surface-1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        boxShadow: 'var(--shadow-sm)',
        transition: 'background-color var(--transition-fast)'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.85rem',
          minHeight: '4.25rem',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem'
        }}
      >
        {/* Brand */}
        <div 
          onClick={() => onSelectView && onSelectView('overview')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
            }}
          >
            <SparklesIcon size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                CampusPulse<span style={{ color: 'var(--accent-primary)' }}>AI</span>
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '0.12rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface-2)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  fontWeight: 700,
                  letterSpacing: '0.04em'
                }}
              >
                {activeView === 'admin' ? 'COMMAND CENTER' : activeView === 'student' ? 'STUDENT PORTAL' : 'OVERVIEW'}
              </span>
            </div>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', margin: 0 }}>
              Campus Infrastructure Incident Intelligence
            </p>
          </div>
        </div>

        {/* Center/Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Segmented View Switcher: Overview / Student Portal / Command Center */}
          {onSelectView && (
            <div 
              style={{
                display: 'flex',
                background: 'var(--bg-surface-2)',
                padding: '3px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                gap: '2px'
              }}
            >
              <button
                onClick={() => onSelectView('overview')}
                title="Press '0' to switch to Overview"
                style={{
                  background: activeView === 'overview' ? 'var(--bg-surface-1)' : 'transparent',
                  border: '1px solid ' + (activeView === 'overview' ? 'var(--border-medium)' : 'transparent'),
                  color: activeView === 'overview' ? 'var(--text-primary)' : 'var(--text-muted)',
                  padding: '5px 11px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all var(--transition-fast)',
                  boxShadow: activeView === 'overview' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <Home size={13} />
                <span>Overview</span>
                <span className="kbd-tag">0</span>
              </button>

              <button
                onClick={() => onSelectView('student')}
                title="Press '1' to switch to Student Portal"
                style={{
                  background: activeView === 'student' ? 'var(--bg-surface-1)' : 'transparent',
                  border: '1px solid ' + (activeView === 'student' ? 'var(--border-medium)' : 'transparent'),
                  color: activeView === 'student' ? 'var(--text-primary)' : 'var(--text-muted)',
                  padding: '5px 11px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all var(--transition-fast)',
                  boxShadow: activeView === 'student' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <User size={13} /> 
                <span>Student</span>
                <span className="kbd-tag">1</span>
              </button>

              <button
                onClick={() => onSelectView('admin')}
                title="Press '2' to switch to Admin Command Center"
                style={{
                  background: activeView === 'admin' ? 'var(--bg-surface-1)' : 'transparent',
                  border: '1px solid ' + (activeView === 'admin' ? 'var(--border-medium)' : 'transparent'),
                  color: activeView === 'admin' ? 'var(--text-primary)' : 'var(--text-muted)',
                  padding: '5px 11px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all var(--transition-fast)',
                  boxShadow: activeView === 'admin' ? 'var(--shadow-sm)' : 'none'
                }}
              >
                <Shield size={13} /> 
                <span>Command</span>
                <span className="kbd-tag">2</span>
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
              gap: '0.5rem',
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-subtle)',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-sans)',
              transition: 'all var(--transition-fast)'
            }}
          >
            <span
              className="pulse-dot"
              style={{
                backgroundColor:
                  mode === 'live' ? '#10b981' : mode === 'mock' ? '#f59e0b' : 'var(--text-subtle)'
              }}
            />
            <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>
              {mode === 'live'
                ? '● Live Engine'
                : mode === 'mock'
                ? '⚡ Sandbox'
                : 'Detecting...'}
            </span>
          </button>

          {/* Quick Universal Search Trigger (Cmd+K) inspired by Nexus */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              title="Universal Workspace Search & Quick Jump (Cmd+K / Ctrl+K)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.78rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Search size={14} style={{ color: 'var(--nexus-primary)' }} />
              <span style={{ fontSize: '0.75rem' }}>Search</span>
              <span className="kbd-tag">⌘K</span>
            </button>
          )}

          {/* Light / Dark Mode Toggle (Nexus) */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            style={{
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              padding: '0.4rem 0.6rem',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)'
            }}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Track Tickets Button (Shown in student mode) */}
          {activeView === 'student' && onOpenTracker && (
            <button
              onClick={onOpenTracker}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <Clock size={13} />
              <span>My Reports</span>
              {savedTicketCount > 0 && (
                <span
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    padding: '0.1rem 0.4rem',
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
