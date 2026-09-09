import { useState, useEffect } from 'react';
import { ToastProvider } from './components/Toast';
import { Navbar } from './components/Navbar';
import { StudentPortal } from './features/student/StudentPortal';
import { TrackReportsList } from './features/student/TrackReportsList';
import { SubmittedTicket } from './types';

const STORAGE_KEY = 'campuspulse_student_tickets';

export function App() {
  const [tickets, setTickets] = useState<SubmittedTicket[]>([]);
  const [showTracker, setShowTracker] = useState(false);

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

  const handleClearHistory = () => {
    setTickets([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ToastProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar
          onOpenTracker={() => setShowTracker(true)}
          savedTicketCount={tickets.length}
        />

        <div style={{ flex: 1 }}>
          <StudentPortal />
        </div>

        {showTracker && (
          <TrackReportsList
            tickets={tickets}
            onClose={() => setShowTracker(false)}
            onClear={handleClearHistory}
          />
        )}

        {/* Global Footer */}
        <footer
          style={{
            borderTop: '1px solid var(--card-border)',
            padding: '2rem 0',
            textAlign: 'center',
            fontSize: '0.85rem',
            color: 'var(--text-subtle)',
            background: 'rgba(10, 14, 26, 0.95)'
          }}
        >
          <div className="container">
            <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>
              CampusPulse AI — Autonomous Campus Infrastructure Intelligence & Incident Clustering
            </p>
            <p style={{ fontSize: '0.75rem', margin: 0, color: 'var(--text-subtle)' }}>
              Built for campus facilities operations. Student Reporting Module.
            </p>
          </div>
        </footer>
      </div>
    </ToastProvider>
  );
}

export default App;
