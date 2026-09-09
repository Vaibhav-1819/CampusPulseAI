import React, { useState } from 'react';
import { CreateReportRequest, CreateReportResponseData, IssueCategory } from '../../types';
import { reportService } from '../../services/reportService';
import { CategorySelector } from './CategorySelector';
import { LocationPicker } from './LocationPicker';
import { Button } from '../../components/Button';
import { SparklesIcon, AlertTriangleIcon } from '../../components/Icons';
import { useToast } from '../../components/Toast';

interface ReportFormProps {
  onSuccess: (data: CreateReportResponseData) => void;
}

const DEMO_PRESETS = [
  {
    title: 'CSE WiFi Outage',
    desc: 'WiFi is completely down in CSE Block Lab 3 since morning, no one can access course materials or lab servers.',
    category: 'NETWORK' as IssueCategory,
    building: 'CSE Block',
    room: 'Lab 3'
  },
  {
    title: 'Library Water Leak',
    desc: 'Major water pipe leaking near the 2nd floor restrooms in Central Library, water seeping into study room.',
    category: 'PLUMBING' as IssueCategory,
    building: 'Central Library',
    room: '2nd Floor Restroom'
  },
  {
    title: 'Science Annex HVAC',
    desc: 'Air conditioning unit in Science Annex Room 102 is blowing warm air and making a loud rattling sound.',
    category: 'HVAC' as IssueCategory,
    building: 'Science Annex',
    room: 'Room 102'
  }
];

export const ReportForm: React.FC<ReportFormProps> = ({ onSuccess }) => {
  const { showToast } = useToast();

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory | undefined>(undefined);
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleApplyPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setDescription(preset.desc);
    setCategory(preset.category);
    setBuilding(preset.building);
    setRoom(preset.room);
    setValidationError(null);
    showToast(`Loaded preset: "${preset.title}"`, 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation per api-contract
    const trimmed = description.trim();
    if (!trimmed || trimmed.length < 5) {
      setValidationError('Please provide at least 5 characters describing the issue.');
      return;
    }

    setValidationError(null);
    setLoading(true);

    try {
      const payload: CreateReportRequest = {
        description: trimmed,
        building: building.trim() || undefined,
        room: room.trim() || undefined,
        category: category || undefined,
        user_id: 'usr_student_web'
      };

      const result = await reportService.submitReport(payload);
      showToast('Incident report processed successfully!', 'success');
      onSuccess(result);

      // Reset form
      setDescription('');
      setCategory(undefined);
      setBuilding('');
      setRoom('');
    } catch (err: any) {
      console.error('[ReportForm] Submission error:', err);
      setValidationError(err.message || 'Failed to submit report. Please try again.');
      showToast(err.message || 'Submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const charCount = description.trim().length;

  return (
    <div className="glass-card" style={{ padding: 'clamp(1.25rem, 3vw, 2rem)', position: 'relative' }}>
      {/* Demo Scenario Quick-Fill Bar */}
      <div
        style={{
          background: 'rgba(79, 70, 229, 0.08)',
          border: '1px solid rgba(79, 70, 229, 0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 0.95rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <SparklesIcon size={16} style={{ color: '#c084fc' }} />
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#e2e8f0' }}>
            Quick Demo Presets:
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {DEMO_PRESETS.map((p) => (
            <button
              key={p.title}
              type="button"
              id={`preset-${p.title.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleApplyPreset(p)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-main)',
                fontSize: '0.75rem',
                fontWeight: 500,
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Step 1: Issue Description */}
        <div>
          <div className="input-label">
            <label htmlFor="description-input">
              What is the issue? <span style={{ color: 'var(--status-critical)' }}>*</span>
            </label>
            <span
              style={{
                fontSize: '0.75rem',
                color: charCount >= 5 ? 'var(--status-resolved)' : 'var(--text-subtle)',
                fontWeight: 500
              }}
            >
              {charCount}/5 characters minimum
            </span>
          </div>
          <textarea
            id="description-input"
            className="textarea-field"
            rows={4}
            placeholder="Describe what's wrong (e.g. WiFi down, power socket sparking, water leaking from 2nd floor restroom ceiling...)"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (validationError && e.target.value.trim().length >= 5) {
                setValidationError(null);
              }
            }}
          />
        </div>

        {/* Step 2: Category Selector */}
        <CategorySelector selectedCategory={category} onSelect={setCategory} />

        {/* Step 3: Location Picker */}
        <LocationPicker
          building={building}
          room={room}
          onBuildingChange={setBuilding}
          onRoomChange={setRoom}
        />

        {/* Validation Error Banner */}
        {validationError && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: '#fca5a5',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <AlertTriangleIcon size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
            AI will analyze, extract location, and correlate with campus active incidents.
          </span>
          <Button
            type="submit"
            size="lg"
            loading={loading}
            icon={<SparklesIcon size={18} />}
            id="submit-report-btn"
          >
            Submit Incident Report
          </Button>
        </div>
      </form>
    </div>
  );
};
