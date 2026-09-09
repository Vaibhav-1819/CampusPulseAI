import React from 'react';
import { DashboardStats } from '@shared/types';
import { AlertTriangle, Activity, CheckCircle, FileText, ShieldAlert } from 'lucide-react';

interface StatsBarProps {
  stats: DashboardStats | null;
  loading: boolean;
  onFilterEmerging?: () => void;
  onFilterSeverity?: (severity: string) => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({ 
  stats, 
  loading,
  onFilterEmerging,
  onFilterSeverity
}) => {
  if (loading || !stats) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="glass-panel" style={{ height: '110px', opacity: 0.6, animation: 'pulse 1.5s infinite' }} />
        ))}
      </div>
    );
  }

  const { active_incidents, emerging_incidents, total_reports_today, resolved_today, severity_breakdown, category_breakdown } = stats;

  const totalSeverityCount = (severity_breakdown?.CRITICAL || 0) + 
                             (severity_breakdown?.HIGH || 0) + 
                             (severity_breakdown?.MEDIUM || 0) + 
                             (severity_breakdown?.LOW || 0) || 1;

  const critPct = Math.round(((severity_breakdown?.CRITICAL || 0) / totalSeverityCount) * 100);
  const highPct = Math.round(((severity_breakdown?.HIGH || 0) / totalSeverityCount) * 100);
  const medPct = Math.round(((severity_breakdown?.MEDIUM || 0) / totalSeverityCount) * 100);
  const lowPct = Math.round(((severity_breakdown?.LOW || 0) / totalSeverityCount) * 100);

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* KPI Cards Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.15rem',
        marginBottom: '1.25rem' 
      }}>
        {/* Active Incidents */}
        <div 
          className="glass-card card-3d-lift" 
          style={{ 
            padding: '1.35rem', 
            position: 'relative', 
            overflow: 'hidden',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Active Incidents
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                {active_incidents}
              </div>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <Activity size={24} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot" style={{ width: '7px', height: '7px', backgroundColor: '#3b82f6' }} />
              Open & Investigating
            </span>
            <span className="kbd-tag">Real-time</span>
          </div>
        </div>

        {/* Emerging Spikes */}
        <div 
          className="glass-card card-3d-lift" 
          onClick={onFilterEmerging}
          style={{ 
            padding: '1.35rem', 
            cursor: onFilterEmerging ? 'pointer' : 'default',
            border: emerging_incidents > 0 ? '1px solid var(--sev-critical)' : '1px solid var(--border-medium)',
            background: emerging_incidents > 0 ? 'var(--sev-critical-bg)' : undefined,
            boxShadow: emerging_incidents > 0 ? '0 0 30px rgba(239, 68, 68, 0.2)' : 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: emerging_incidents > 0 ? 'var(--sev-critical)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Emerging Spikes
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: emerging_incidents > 0 ? 'var(--sev-critical)' : 'var(--text-primary)', marginTop: '4px', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                {emerging_incidents}
              </div>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: emerging_incidents > 0 ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface-2)', color: emerging_incidents > 0 ? 'var(--sev-critical)' : 'var(--text-muted)', border: emerging_incidents > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : undefined }}>
              <ShieldAlert size={24} className={emerging_incidents > 0 ? 'spin-pulse' : ''} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: emerging_incidents > 0 ? 'var(--sev-critical)' : 'var(--text-secondary)', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>
              {emerging_incidents > 0 ? '⚡ High velocity surge detected' : 'No active spikes'}
            </span>
            {emerging_incidents > 0 && <span className="kbd-tag" style={{ color: 'var(--sev-critical)' }}>Filter</span>}
          </div>
        </div>

        {/* Total Reports Today */}
        <div 
          className="glass-card card-3d-lift" 
          style={{ 
            padding: '1.35rem',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Student Reports Today
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                {total_reports_today}
              </div>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <FileText size={24} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Grouped & clustered by AI</span>
            <span className="kbd-tag">+100% parsed</span>
          </div>
        </div>

        {/* Resolved Today */}
        <div 
          className="glass-card card-3d-lift" 
          style={{ 
            padding: '1.35rem',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--status-resolved)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Resolved Today
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--status-resolved)', marginTop: '4px', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                {resolved_today}
              </div>
            </div>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--status-resolved)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <CheckCircle size={24} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Closed & verified incidents</span>
            <span className="kbd-tag" style={{ color: 'var(--status-resolved)' }}>Healthy</span>
          </div>
        </div>
      </div>

      {/* Severity Breakdown Bar & Category Chips */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Severity Distribution */}
        <div style={{ flex: '1 1 320px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            <span>SEVERITY DISTRIBUTION</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span onClick={() => onFilterSeverity && onFilterSeverity('CRITICAL')} style={{ cursor: 'pointer', color: 'var(--sev-critical)' }}>CRITICAL ({severity_breakdown?.CRITICAL || 0})</span>
              <span onClick={() => onFilterSeverity && onFilterSeverity('HIGH')} style={{ cursor: 'pointer', color: 'var(--sev-high)' }}>HIGH ({severity_breakdown?.HIGH || 0})</span>
              <span onClick={() => onFilterSeverity && onFilterSeverity('MEDIUM')} style={{ cursor: 'pointer', color: 'var(--sev-medium)' }}>MED ({severity_breakdown?.MEDIUM || 0})</span>
              <span onClick={() => onFilterSeverity && onFilterSeverity('LOW')} style={{ cursor: 'pointer', color: 'var(--sev-low)' }}>LOW ({severity_breakdown?.LOW || 0})</span>
            </div>
          </div>
          <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'var(--border-medium)' }}>
            <div style={{ width: `${critPct}%`, background: 'var(--sev-critical)', transition: 'width 0.3s' }} title={`Critical: ${critPct}%`} />
            <div style={{ width: `${highPct}%`, background: 'var(--sev-high)', transition: 'width 0.3s' }} title={`High: ${highPct}%`} />
            <div style={{ width: `${medPct}%`, background: 'var(--sev-medium)', transition: 'width 0.3s' }} title={`Medium: ${medPct}%`} />
            <div style={{ width: `${lowPct}%`, background: 'var(--sev-low)', transition: 'width 0.3s' }} title={`Low: ${lowPct}%`} />
          </div>
        </div>

        {/* Category Breakdown Chips */}
        {category_breakdown && Object.keys(category_breakdown).length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Domains:</span>
            {Object.entries(category_breakdown).map(([cat, count]) => (
              <div key={cat} className="category-chip">
                <span>{cat}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', padding: '0 5px', borderRadius: '4px' }}>
                  {String(count)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
