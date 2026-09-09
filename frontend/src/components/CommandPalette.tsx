import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Building2, 
  ShieldAlert, 
  FileText, 
  Sun, 
  Moon, 
  Clock, 
  Activity,
  Layers,
  X,
  Zap,
  AlertTriangle,
  PlusCircle
} from 'lucide-react';

export interface NavigationOptions {
  building?: string;
  emergingOnly?: boolean;
  severity?: string;
  status?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (view: 'overview' | 'student' | 'admin', options?: NavigationOptions) => void;
  onOpenTracker?: () => void;
  onToggleTheme?: () => void;
  currentTheme?: 'dark' | 'light';
}

interface CommandItem {
  id: string;
  category: 'Navigation' | 'Campus Buildings' | 'Incident Triage' | 'System';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  onNavigate,
  onOpenTracker,
  onToggleTheme,
  currentTheme = 'dark'
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keydown listener for Cmd+K / Ctrl+K
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  const items: CommandItem[] = [
    {
      id: 'nav-overview',
      category: 'Navigation',
      title: 'Go to Overview & Public Landing',
      subtitle: 'Hero, interactive telemetry preview, bento grid, and capability proof points',
      icon: <Layers size={16} color="var(--nexus-primary)" />,
      badge: '0',
      action: () => {
        onNavigate('overview');
        onClose();
      }
    },
    {
      id: 'nav-student',
      category: 'Navigation',
      title: 'Open Student Reporting Portal',
      subtitle: 'File campus infrastructure issues across Category, Location, and Details',
      icon: <FileText size={16} color="#38bdf8" />,
      badge: '1',
      action: () => {
        onNavigate('student');
        onClose();
      }
    },
    {
      id: 'nav-admin',
      category: 'Navigation',
      title: 'Open Admin Command Center',
      subtitle: 'Real-time telemetry, triage drawer, impact scoring, and emerging spikes',
      icon: <Activity size={16} color="#f97316" />,
      badge: '2',
      action: () => {
        onNavigate('admin', { building: 'ALL', emergingOnly: false, severity: 'ALL', status: 'ALL' });
        onClose();
      }
    },
    {
      id: 'nav-my-reports',
      category: 'Navigation',
      title: 'Track My Submitted Reports',
      subtitle: 'Review resolution lifecycles and ticket IDs saved on this device',
      icon: <Clock size={16} color="#10b981" />,
      action: () => {
        if (onOpenTracker) onOpenTracker();
        onClose();
      }
    },
    {
      id: 'action-new-report',
      category: 'Incident Triage',
      title: 'Submit New Incident Report',
      subtitle: 'Report power, water, network, lab, or HVAC failure',
      icon: <PlusCircle size={16} color="var(--accent-primary)" />,
      action: () => {
        onNavigate('student');
        onClose();
      }
    },
    {
      id: 'action-emerging',
      category: 'Incident Triage',
      title: 'View Emerging Spikes & Surge Alerts',
      subtitle: 'Filter incidents exceeding velocity thresholds (≥3 reports/60m)',
      icon: <Zap size={16} color="#ef4444" />,
      badge: 'Spike',
      action: () => {
        onNavigate('admin', { emergingOnly: true });
        onClose();
      }
    },
    {
      id: 'action-critical',
      category: 'Incident Triage',
      title: 'Filter Critical Severity Incidents',
      subtitle: 'Isolate life-safety, major outage, and campus-wide disruptions',
      icon: <ShieldAlert size={16} color="#ef4444" />,
      badge: 'Critical',
      action: () => {
        onNavigate('admin', { severity: 'CRITICAL' });
        onClose();
      }
    },
    {
      id: 'action-open',
      category: 'Incident Triage',
      title: 'Filter Open / Unresolved Incidents',
      subtitle: 'View incidents requiring immediate administrative triage dispatch',
      icon: <AlertTriangle size={16} color="#f59e0b" />,
      action: () => {
        onNavigate('admin', { status: 'OPEN' });
        onClose();
      }
    },
    {
      id: 'bldg-cse',
      category: 'Campus Buildings',
      title: 'Inspect CSE Block Incidents',
      subtitle: 'Labs, classrooms, servers, and departmental Wi-Fi networks',
      icon: <Building2 size={16} color="#a855f7" />,
      action: () => {
        onNavigate('admin', { building: 'CSE Block' });
        onClose();
      }
    },
    {
      id: 'bldg-library',
      category: 'Campus Buildings',
      title: 'Inspect Central Library Incidents',
      subtitle: 'Reading halls, HVAC, plumbing, and acoustic silence zones',
      icon: <Building2 size={16} color="#06b6d4" />,
      action: () => {
        onNavigate('admin', { building: 'Central Library' });
        onClose();
      }
    },
    {
      id: 'bldg-science',
      category: 'Campus Buildings',
      title: 'Inspect Science Annex Incidents',
      subtitle: 'Wet labs, chemical exhaust hoods, power lines, and chilled water',
      icon: <Building2 size={16} color="#eab308" />,
      action: () => {
        onNavigate('admin', { building: 'Science Annex' });
        onClose();
      }
    },
    {
      id: 'bldg-mech',
      category: 'Campus Buildings',
      title: 'Inspect Mechanical Lab Incidents',
      subtitle: 'Heavy machinery, pneumatic lines, high voltage, and fabrication bays',
      icon: <Building2 size={16} color="#f97316" />,
      action: () => {
        onNavigate('admin', { building: 'Mechanical Lab' });
        onClose();
      }
    },
    {
      id: 'bldg-admin',
      category: 'Campus Buildings',
      title: 'Inspect Admin Block Incidents',
      subtitle: 'Dean office, registrar, bursar, and central network distribution',
      icon: <Building2 size={16} color="#64748b" />,
      action: () => {
        onNavigate('admin', { building: 'Admin Block' });
        onClose();
      }
    },
    {
      id: 'sys-theme',
      category: 'System',
      title: `Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Mode`,
      subtitle: 'Toggle between Nexus Dark Slate and Light Slate design systems',
      icon: currentTheme === 'dark' ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#818cf8" />,
      action: () => {
        if (onToggleTheme) onToggleTheme();
        onClose();
      }
    }
  ];

  const filteredItems = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose} 
      style={{ 
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        inset: 0,
        backgroundColor: 'var(--bg-modal-overlay)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        padding: '1.25rem'
      }}
    >
      <div
        className="command-palette-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '640px',
          width: '100%',
          backgroundColor: 'var(--bg-surface-1)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(91, 77, 245, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
          margin: 'auto'
        }}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-2)',
            gap: '0.85rem'
          }}
        >
          <Sparkles size={20} style={{ color: 'var(--nexus-primary)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search incidents, campus buildings, or jump anywhere... (Cmd+K)"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-subtle)', cursor: 'pointer', padding: '2px' }}
            >
              <X size={16} />
            </button>
          )}
          <span className="kbd-tag" style={{ fontSize: '0.7rem' }}>ESC</span>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '55vh', overflowY: 'auto', padding: '0.65rem' }}>
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <Search size={32} style={{ opacity: 0.4, margin: '0 auto 0.75rem' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0 }}>
                No commands matching "<strong>{query}</strong>"
              </p>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                Try searching for "Student", "Admin", "WiFi", "Spikes", or "Library".
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {filteredItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;

                return (
                  <div
                    key={item.id}
                    onClick={() => item.action()}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--accent-primary-subtle)' : 'transparent',
                      border: isSelected ? '1px solid var(--accent-primary-border)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.1s ease',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-surface-2)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {item.badge && <span className="kbd-tag">{item.badge}</span>}
                      {isSelected && <ArrowRight size={14} color="var(--nexus-primary)" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.65rem 1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface-2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <span>Navigate <span className="kbd-tag">↑</span> <span className="kbd-tag">↓</span></span>
            <span>Select <span className="kbd-tag">↵</span></span>
          </div>
          <span>Nexus Global Quick Actions</span>
        </div>
      </div>
    </div>
  );
};
