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
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1rem',
        marginBottom: '1rem' 
      }}>
        {/* Active Incidents */}
        <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Incidents
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px', lineHeight: 1 }}>
                {active_incidents}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
              <Activity size={24} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', display: 'inline-block' }} />
            Open & Investigating
          </div>
        </div>

        {/* Emerging Spikes */}
        <div 
          className="glass-panel" 
          onClick={onFilterEmerging}
          style={{ 
            padding: '1.25rem', 
            cursor: onFilterEmerging ? 'pointer' : 'default',
            border: emerging_incidents > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : undefined,
            background: emerging_incidents > 0 ? 'rgba(239, 68, 68, 0.08)' : undefined
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: emerging_incidents > 0 ? '#fca5a5' : 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Emerging Spikes
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: emerging_incidents > 0 ? '#f87171' : '#f8fafc', marginTop: '4px', lineHeight: 1 }}>
                {emerging_incidents}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: emerging_incidents > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(100, 116, 139, 0.15)', color: emerging_incidents > 0 ? '#ef4444' : '#94a3b8' }}>
              <ShieldAlert size={24} className={emerging_incidents > 0 ? 'spin-pulse' : ''} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: emerging_incidents > 0 ? '#fca5a5' : 'var(--text-muted)', marginTop: '12px' }}>
            {emerging_incidents > 0 ? '⚡ Rapid velocity surge detected (Click to filter)' : 'No high-velocity spikes'}
          </div>
        </div>

        {/* Total Reports Today */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Student Reports Today
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px', lineHeight: 1 }}>
                {total_reports_today}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' }}>
              <FileText size={24} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>
            Processed & grouped by AI
          </div>
        </div>

        {/* Resolved Today */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Resolved Today
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', marginTop: '4px', lineHeight: 1 }}>
                {resolved_today}
              </div>
            </div>
            <div style={{ padding: '10px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <CheckCircle size={24} />
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '12px' }}>
            Successfully closed incidents
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
              <span onClick={() => onFilterSeverity && onFilterSeverity('CRITICAL')} style={{ cursor: 'pointer', color: '#ef4444' }}>CRITICAL ({severity_breakdown?.CRITICAL || 0})</span>
              <span onClick={() => onFilterSeverity && onFilterSeverity('HIGH')} style={{ cursor: 'pointer', color: '#f97316' }}>HIGH ({severity_breakdown?.HIGH || 0})</span>
              <span onClick={() => onFilterSeverity && onFilterSeverity('MEDIUM')} style={{ cursor: 'pointer', color: '#eab308' }}>MED ({severity_breakdown?.MEDIUM || 0})</span>
              <span onClick={() => onFilterSeverity && onFilterSeverity('LOW')} style={{ cursor: 'pointer', color: '#06b6d4' }}>LOW ({severity_breakdown?.LOW || 0})</span>
            </div>
          </div>
          <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'rgba(255, 255, 255, 0.05)' }}>
            <div style={{ width: `${critPct}%`, background: 'var(--sev-critical-color)', transition: 'width 0.3s' }} title={`Critical: ${critPct}%`} />
            <div style={{ width: `${highPct}%`, background: 'var(--sev-high-color)', transition: 'width 0.3s' }} title={`High: ${highPct}%`} />
            <div style={{ width: `${medPct}%`, background: 'var(--sev-medium-color)', transition: 'width 0.3s' }} title={`Medium: ${medPct}%`} />
            <div style={{ width: `${lowPct}%`, background: 'var(--sev-low-color)', transition: 'width 0.3s' }} title={`Low: ${lowPct}%`} />
          </div>
        </div>

        {/* Category Breakdown Chips */}
        {category_breakdown && Object.keys(category_breakdown).length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Domains:</span>
            {Object.entries(category_breakdown).map(([cat, count]) => (
              <div key={cat} className="category-chip">
                <span>{cat}</span>
                <span style={{ fontWeight: 700, color: '#fff', background: 'rgba(255, 255, 255, 0.1)', padding: '0 5px', borderRadius: '4px' }}>
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
