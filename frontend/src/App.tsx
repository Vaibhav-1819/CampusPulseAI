import React, { useState, useEffect } from 'react';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { StudentReportForm } from './features/student/StudentReportForm';
import { api } from './services/api';
import { Radio, Shield, User, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'admin' | 'student'>('admin');
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [isForceMock, setIsForceMock] = useState<boolean>(api.isForceMock());

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const checkBackendHealth = async () => {
    if (api.isForceMock()) {
      setIsLiveApi(false);
      return;
    }
    const alive = await api.checkHealth();
    setIsLiveApi(alive);
  };

  const handleToggleMockMode = () => {
    const forced = api.toggleForceMockMode();
    setIsForceMock(forced);
    if (forced) {
      setIsLiveApi(false);
    } else {
      checkBackendHealth();
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <header style={{
        background: 'rgba(16, 23, 38, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '0.75rem 1.5rem'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          
          {/* Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
            }}>
              <Radio size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
                  CampusPulse <span style={{ color: 'var(--accent-blue)' }}>AI</span>
                </h1>
                <span className="category-chip" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                  HACKATHON MVP
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Correlated Infrastructure Incident Intelligence
              </p>
            </div>
          </div>

          {/* Connection Status Pill & View Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            
            {/* Live API / Mock Interactive Toggle Button */}
            <button
              onClick={handleToggleMockMode}
              title="Click to toggle between Standalone Demo Mock Mode and Live Express API Mode"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '9999px',
                background: isLiveApi ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.18)',
                border: isLiveApi ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.5)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: isLiveApi ? '#34d399' : '#fbbf24',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isLiveApi ? '0 0 10px rgba(16, 185, 129, 0.2)' : '0 0 10px rgba(245, 158, 11, 0.2)'
              }}
            >
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isLiveApi ? '#10b981' : '#f59e0b',
                display: 'inline-block'
              }} />
              {isLiveApi ? '🟢 Live API Connected' : '⚡ Demo Mock Mode (Click to toggle)'}
            </button>

            {/* Role Switcher */}
            <div style={{
              display: 'flex',
              background: 'rgba(0, 0, 0, 0.4)',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                onClick={() => setActiveView('admin')}
                style={{
                  background: activeView === 'admin' ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' : 'transparent',
                  border: 'none',
                  color: activeView === 'admin' ? '#ffffff' : 'var(--text-muted)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Shield size={14} /> Admin Command Center
              </button>

              <button
                onClick={() => setActiveView('student')}
                style={{
                  background: activeView === 'student' ? 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' : 'transparent',
                  border: 'none',
                  color: activeView === 'student' ? '#ffffff' : 'var(--text-muted)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <User size={14} /> Student Portal
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main App Body */}
      <main style={{ flex: 1 }}>
        {activeView === 'admin' ? (
          <AdminDashboard />
        ) : (
          <StudentReportForm onReportSubmitted={() => setActiveView('admin')} />
        )}
      </main>
    </div>
  );
};
export default App;
