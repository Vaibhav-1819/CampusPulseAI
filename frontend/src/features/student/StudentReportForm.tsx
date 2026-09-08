import React, { useState } from 'react';
import { api } from '../../services/api';
import { IssueCategory, Report, Incident } from '@shared/types';
import { Send, CheckCircle2, AlertCircle, Building2, MapPin, Tag, RefreshCw } from 'lucide-react';

const CATEGORIES: { id: IssueCategory; label: string; icon: string }[] = [
  { id: 'NETWORK', label: 'WiFi & Network', icon: '📡' },
  { id: 'ELECTRICAL', label: 'Power & Lights', icon: '⚡' },
  { id: 'PLUMBING', label: 'Water & Leaks', icon: '🚰' },
  { id: 'HVAC', label: 'AC & Climate', icon: '❄️' },
  { id: 'PHYSICAL', label: 'Doors & Windows', icon: '🚪' },
  { id: 'EQUIPMENT', label: 'Lab Equipment', icon: '🔬' },
  { id: 'SAFETY', label: 'Safety Hazard', icon: '⚠️' },
  { id: 'OTHER', label: 'Other Facilities', icon: '🔧' },
];

const BUILDINGS = [
  'CSE Block',
  'Mechanical Lab',
  'Central Library',
  'Admin Block',
  'Science Annex',
  'Student Center',
  'Hostel Block A'
];

interface StudentReportFormProps {
  onReportSubmitted?: () => void;
}

export const StudentReportForm: React.FC<StudentReportFormProps> = ({ onReportSubmitted }) => {
  const [description, setDescription] = useState('');
  const [building, setBuilding] = useState('CSE Block');
  const [room, setRoom] = useState('');
  const [category, setCategory] = useState<IssueCategory>('NETWORK');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{ report: Report; incident: Incident } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || description.length < 5) {
      setError('Description must be at least 5 characters long.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const result = await api.submitReport({
        description,
        building,
        room: room || undefined,
        category,
        user_id: 'usr_student_demo'
      });

      setSubmissionResult(result);
      setDescription('');
      setRoom('');
      if (onReportSubmitted) {
        onReportSubmitted();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmissionResult(null);
    setError(null);
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1rem' }}>
      <div className="glass-panel" style={{ padding: '1.75rem' }}>
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>📢</span> Submit Campus Infrastructure Issue
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Report facility disruptions, network outages, or maintenance needs. AI automatically correlates your complaint with active campus incidents.
          </p>
        </div>

        {submissionResult ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ display: 'inline-flex', padding: '16px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', color: '#34d399', marginBottom: '1rem' }}>
              <CheckCircle2 size={48} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
              Report Successfully Logged!
            </h3>

            <div className="badge badge-status-open" style={{ marginBottom: '1rem' }}>
              Ticket ID: {submissionResult.report.id}
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'left',
              marginBottom: '1.5rem',
              fontSize: '0.875rem'
            }}>
              <div style={{ fontWeight: 600, color: 'var(--accent-blue)', marginBottom: '4px' }}>
                🔗 Correlated Incident: {submissionResult.incident.title}
              </div>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Status: <span className={`badge badge-status-${submissionResult.incident.status.toLowerCase()}`}>{submissionResult.incident.status}</span>
              </div>
              {submissionResult.report.correlation_reason && (
                <div style={{
                  fontSize: '0.8rem',
                  color: '#94a3b8',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderLeft: '3px solid var(--accent-blue)',
                  padding: '8px 12px',
                  borderRadius: '0 4px 4px 0'
                }}>
                  <strong>AI Explanation:</strong> {submissionResult.report.correlation_reason}
                </div>
              )}
            </div>

            <button onClick={resetForm} className="btn btn-secondary">
              <RefreshCw size={16} /> Submit Another Report
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#fca5a5',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Issue Category
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px',
                      borderRadius: '8px',
                      background: category === cat.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: category === cat.id ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                      color: category === cat.id ? '#ffffff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: category === cat.id ? 600 : 400,
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <Building2 size={16} /> Campus Building
                </label>
                <select
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="input-control"
                  style={{ width: '100%' }}
                >
                  {BUILDINGS.map(b => (
                    <option key={b} value={b} style={{ background: '#101726', color: '#fff' }}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <MapPin size={16} /> Room / Sublocation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lab 3, 2nd Floor, Room 102"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="input-control"
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Description of the Problem
              </label>
              <textarea
                rows={4}
                placeholder="Describe what is broken, when it started, and how it impacts you (e.g. WiFi is down in CSE Lab 3 since 9 AM, no one can access course materials)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input-control"
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: 600, marginTop: '8px' }}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="spin" size={18} /> Running AI Extraction & Correlation...
                </>
              ) : (
                <>
                  <Send size={18} /> Submit Incident Report
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
