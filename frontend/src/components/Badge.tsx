import React from 'react';
import { IssueCategory, SeverityLevel, IncidentStatus } from '../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'category' | 'severity' | 'status' | 'ai';
  category?: IssueCategory;
  severity?: SeverityLevel;
  status?: IncidentStatus;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  category,
  severity,
  status,
  className = ''
}) => {
  let style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.2rem 0.65rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap'
  };

  if (variant === 'category' && category) {
    const categoryColors: Record<IssueCategory, { bg: string; color: string; border: string }> = {
      NETWORK: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
      ELECTRICAL: { bg: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: 'rgba(234, 179, 8, 0.3)' },
      PLUMBING: { bg: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', border: 'rgba(6, 182, 212, 0.3)' },
      HVAC: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
      PHYSICAL: { bg: 'rgba(249, 115, 22, 0.15)', color: '#fb923c', border: 'rgba(249, 115, 22, 0.3)' },
      EQUIPMENT: { bg: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', border: 'rgba(139, 92, 246, 0.3)' },
      SAFETY: { bg: 'rgba(239, 68, 68, 0.18)', color: '#f87171', border: 'rgba(239, 68, 68, 0.4)' },
      OTHER: { bg: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', border: 'rgba(100, 116, 139, 0.3)' }
    };
    const c = categoryColors[category] || categoryColors.OTHER;
    style = { ...style, background: c.bg, color: c.color, border: `1px solid ${c.border}` };
  } else if (variant === 'severity' && severity) {
    const severityColors: Record<SeverityLevel, { bg: string; color: string; border: string }> = {
      LOW: { bg: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', border: 'rgba(100, 116, 139, 0.3)' },
      MEDIUM: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
      HIGH: { bg: 'rgba(249, 115, 22, 0.18)', color: '#fb923c', border: 'rgba(249, 115, 22, 0.4)' },
      CRITICAL: { bg: 'rgba(239, 68, 68, 0.22)', color: '#f87171', border: 'rgba(239, 68, 68, 0.5)' }
    };
    const s = severityColors[severity] || severityColors.LOW;
    style = { ...style, background: s.bg, color: s.color, border: `1px solid ${s.border}` };
  } else if (variant === 'status' && status) {
    const statusColors: Record<IncidentStatus, { bg: string; color: string; border: string }> = {
      OPEN: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
      INVESTIGATING: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.3)' },
      IN_PROGRESS: { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
      RESOLVED: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: 'rgba(16, 185, 129, 0.3)' },
      CLOSED: { bg: 'rgba(100, 116, 139, 0.15)', color: '#94a3b8', border: 'rgba(100, 116, 139, 0.3)' }
    };
    const st = statusColors[status] || statusColors.OPEN;
    style = { ...style, background: st.bg, color: st.color, border: `1px solid ${st.border}` };
  } else if (variant === 'ai') {
    style = {
      ...style,
      background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(139, 92, 246, 0.2))',
      color: '#c084fc',
      border: '1px solid rgba(139, 92, 246, 0.4)'
    };
  } else {
    style = {
      ...style,
      background: 'rgba(255, 255, 255, 0.08)',
      color: '#cbd5e1',
      border: '1px solid rgba(255, 255, 255, 0.12)'
    };
  }

  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
};
