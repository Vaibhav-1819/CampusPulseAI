import { useState, useEffect } from 'react';
import { ToastProvider } from './components/Toast';
import { Navbar } from './components/Navbar';
import { CommandPalette, NavigationOptions } from './components/CommandPalette';
import { LandingPage } from './features/landing/LandingPage';
import { StudentPortal } from './features/student/StudentPortal';
import { TrackReportsList } from './features/student/TrackReportsList';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { SubmittedTicket } from './types';

const STORAGE_KEY = 'campuspulse_student_tickets';

export function App() {
  const [activeView, setActiveView] = useState<'overview' | 'student' | 'admin'>('overview');
  const [tickets, setTickets] = useState<SubmittedTicket[]>([]);
  const [showTracker, setShowTracker] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Admin filter state driven from Command Palette
  const [adminFilters, setAdminFilters] = useState<NavigationOptions>({
    building: 'ALL',
    emergingOnly: false,
    severity: 'ALL',
    status: 'ALL'
  });

  // Load theme preference on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('campuspulse_theme') as 'dark' | 'light' | null;
      const initialTheme = savedTheme || 'dark';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    } catch {
      // Ignore
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem('campuspulse_theme', nextTheme);
    } catch {
      // Ignore
    }
  };

  const handleNavigate = (view: 'overview' | 'student' | 'admin', options?: NavigationOptions) => {
    setActiveView(view);
    if (view === 'admin' && options) {
      setAdminFilters(options);
    }
  };

  // Sync tickets with localStorage
  useEffect(() => {
    const loadTickets = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          setTickets(JSON.parse(saved));
        }
      } catch {
        // Ignore
      }
    };

    loadTickets();
    window.addEventListener('storage', loadTickets);
    return () => window.removeEventListener('storage', loadTickets);
  }, [showTracker]);

  // Global Keyboard Shortcuts: 'Cmd+K' -> Command Palette, '0' -> Overview, '1' -> Student, '2' -> Admin, 'Escape' -> Close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow Cmd+K or Ctrl+K anytime, even if focused on an input
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
        return;
      }

      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.key === '0') {
        setActiveView('overview');
      } else if (e.key === '1') {
        setActiveView('student');
      } else if (e.key === '2') {
        setActiveView('admin');
      } else if (e.key === 'Escape') {
        setShowTracker(false);
        setShowCommandPalette(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClearHistory = () => {
    setTickets([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <ToastProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
        <Navbar
          activeView={activeView}
          onSelectView={setActiveView}
          onOpenTracker={() => setShowTracker(true)}
          onOpenCommandPalette={() => setShowCommandPalette(true)}
          savedTicketCount={tickets.length}
          currentTheme={theme}
          onToggleTheme={toggleTheme}
        />

        <div style={{ flex: 1 }}>
          {activeView === 'overview' && (
            <LandingPage onNavigate={(view) => setActiveView(view)} />
          )}

          {activeView === 'student' && (
            <StudentPortal />
          )}

          {activeView === 'admin' && (
            <AdminDashboard
              initialBuildingFilter={adminFilters.building}
              initialEmergingOnly={adminFilters.emergingOnly}
              initialSeverityFilter={adminFilters.severity}
              initialStatusFilter={adminFilters.status}
            />
          )}
        </div>

        {showTracker && (
          <TrackReportsList
            tickets={tickets}
            onClose={() => setShowTracker(false)}
            onClear={handleClearHistory}
          />
        )}

        <CommandPalette
          open={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          onNavigate={handleNavigate}
          onOpenTracker={() => setShowTracker(true)}
          onToggleTheme={toggleTheme}
          currentTheme={theme}
        />

        {/* Global Footer */}
        <footer
          style={{
            borderTop: '1px solid var(--border-subtle)',
            padding: '2.5rem 0',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            background: 'var(--bg-surface-1)'
          }}
        >
          <div className="container">
            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontWeight: 600 }}>
              CampusPulseAI — Autonomous Infrastructure Incident Intelligence Platform
            </p>
            <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-subtle)' }}>
              Unified Operations: Public Overview · Student Reporting Portal · Admin Command Center
            </p>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}

export default App;
