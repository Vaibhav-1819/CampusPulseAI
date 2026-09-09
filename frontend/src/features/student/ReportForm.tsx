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
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.85rem 1.15rem',
          marginBottom: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SparklesIcon size={18} style={{ color: '#c084fc' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.01em' }}>
            Quick Demo Scenarios:
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {DEMO_PRESETS.map((p, idx) => (
            <button
              key={p.title}
              type="button"
              id={`preset-${p.title.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleApplyPreset(p)}
              className="card-3d-lift"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '0.775rem',
                fontWeight: 600,
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}
            >
              <span className="kbd-tag">{idx + 1}</span>
              <span>{p.title}</span>
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
