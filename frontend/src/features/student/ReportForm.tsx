import React, { useState } from 'react';
import { CreateReportRequest, CreateReportResponseData, IssueCategory } from '../../types';
import { reportService } from '../../services/reportService';
import { CategorySelector } from './CategorySelector';
import { LocationPicker } from './LocationPicker';
import { Button } from '../../components/Button';
import { SparklesIcon, AlertTriangleIcon, CheckCircleIcon } from '../../components/Icons';
import { useToast } from '../../components/Toast';
import { ArrowRight, ArrowLeft, Building2, MapPin, Tag, FileText, Check } from 'lucide-react';

interface ReportFormProps {
  onSuccess: (data: CreateReportResponseData) => void;
}

type FormStep = 1 | 2 | 3 | 4;

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

  const [currentStep, setCurrentStep] = useState<FormStep>(1);
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
    setCurrentStep(4); // Jump directly to Review for fast evaluation
    showToast(`Loaded preset "${preset.title}" — ready for review!`, 'info');
  };

  const validateStep = (step: FormStep): boolean => {
    setValidationError(null);
    if (step === 1) {
      if (!category) {
        setValidationError('Please select an incident category to continue.');
        return false;
      }
    } else if (step === 2) {
      if (!building.trim()) {
        setValidationError('Please specify or select the affected building.');
        return false;
      }
    } else if (step === 3) {
      const trimmed = description.trim();
      if (!trimmed || trimmed.length < 5) {
        setValidationError('Please provide at least 5 characters describing the issue.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(4, prev + 1) as FormStep);
    }
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(1, prev - 1) as FormStep);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = description.trim();
    if (!trimmed || trimmed.length < 5) {
      setValidationError('Please provide at least 5 characters describing the issue.');
      setCurrentStep(3);
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
      showToast('Incident report submitted and correlated successfully!', 'success');
      onSuccess(result);

      // Reset form
      setDescription('');
      setCategory(undefined);
      setBuilding('');
      setRoom('');
      setCurrentStep(1);
    } catch (err: any) {
      console.error('[ReportForm] Submission error:', err);
      setValidationError(err.message || 'Failed to submit report. Please try again.');
      showToast(err.message || 'Submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const charCount = description.trim().length;

  const stepsList = [
    { num: 1, label: 'Category', ready: Boolean(category) },
    { num: 2, label: 'Location', ready: Boolean(building.trim()) },
    { num: 3, label: 'Details', ready: charCount >= 5 },
    { num: 4, label: 'Review & Submit', ready: Boolean(category && building.trim() && charCount >= 5) }
  ];

  return (
    <div className="glass-card" style={{ padding: 'clamp(1.25rem, 3vw, 2.25rem)', position: 'relative' }}>
      
      {/* Demo Scenario Quick-Fill Bar */}
      <div
        style={{
          background: 'var(--accent-glow-subtle)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.85rem 1.15rem',
          marginBottom: '1.75rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SparklesIcon size={18} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
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
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.775rem',
                fontWeight: 600,
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all var(--transition-fast)'
              }}
            >
              <span className="kbd-tag">{idx + 1}</span>
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4-Step Linear Progress Stepper */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          gap: '0.5rem',
          overflowX: 'auto'
        }}
      >
        {stepsList.map((st, i) => {
          const isActive = currentStep === st.num;
          const isPassed = currentStep > st.num || (st.ready && !isActive);

          return (
            <React.Fragment key={st.num}>
              <div
                onClick={() => {
                  if (st.num < currentStep || st.ready) {
                    setCurrentStep(st.num as FormStep);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: (st.num < currentStep || st.ready) ? 'pointer' : 'default',
                  opacity: isActive ? 1 : isPassed ? 0.85 : 0.45,
                  transition: 'all var(--transition-fast)',
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 'var(--radius-full)',
                    background: isActive
                      ? 'var(--accent-primary)'
                      : isPassed
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'var(--bg-surface-2)',
                    border: `1px solid ${isActive ? 'var(--accent-primary)' : isPassed ? 'var(--status-resolved)' : 'var(--border-subtle)'}`,
                    color: isActive ? '#ffffff' : isPassed ? 'var(--status-resolved)' : 'var(--text-muted)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isActive ? '0 2px 8px rgba(99, 102, 241, 0.4)' : 'none'
                  }}
                >
                  {isPassed && currentStep !== st.num ? <Check size={14} /> : st.num}
                </div>
                <span
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {st.label}
                </span>
              </div>

              {i < stepsList.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    background: currentStep > st.num ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    minWidth: 16,
                    transition: 'background var(--transition-medium)'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Category Selection */}
        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Step 1: Select Incident Category
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                Choose the domain that best describes the campus infrastructure failure.
              </p>
            </div>

            <CategorySelector selectedCategory={category} onSelect={setCategory} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
              <Button
                type="button"
                variant="primary"
                onClick={handleNextStep}
                disabled={!category}
                icon={<ArrowRight size={16} />}
              >
                Continue to Location
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Location Picker */}
        {currentStep === 2 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Step 2: Pinpoint Location
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                Select the campus building and specify the room, floor, or zone.
              </p>
            </div>

            <LocationPicker
              building={building}
              room={room}
              onBuildingChange={setBuilding}
              onRoomChange={setRoom}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem' }}>
              <Button type="button" variant="secondary" onClick={handlePrevStep} icon={<ArrowLeft size={16} />}>
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleNextStep}
                disabled={!building.trim()}
                icon={<ArrowRight size={16} />}
              >
                Continue to Details
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Issue Details */}
        {currentStep === 3 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Step 3: Describe the Disruption
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                Describe what is malfunctioning so our AI can extract semantic entities and correlate related complaints.
              </p>
            </div>

            <div>
              <div className="input-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label htmlFor="description-input" style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  Detailed Description <span style={{ color: 'var(--status-critical)' }}>*</span>
                </label>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: charCount >= 5 ? 'var(--status-resolved)' : 'var(--text-subtle)',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {charCount} / 5 characters minimum
                </span>
              </div>
              <textarea
                id="description-input"
                className="textarea-field"
                rows={5}
                placeholder="Describe what's wrong (e.g. WiFi down, power socket sparking, water leaking from 2nd floor restroom ceiling...)"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (validationError && e.target.value.trim().length >= 5) {
                    setValidationError(null);
                  }
                }}
                style={{
                  width: '100%',
                  minHeight: '130px',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.85rem 1rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  fontFamily: 'var(--font-sans)',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem' }}>
              <Button type="button" variant="secondary" onClick={handlePrevStep} icon={<ArrowLeft size={16} />}>
                Back
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={handleNextStep}
                disabled={charCount < 5}
                icon={<ArrowRight size={16} />}
              >
                Review & Confirm
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Final Submission */}
        {currentStep === 4 && (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                Step 4: Review Incident Dossier
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
                Verify your incident parameters before submitting to the CampusPulse AI intelligence cluster.
              </p>
            </div>

            {/* Structured Review Summary Card */}
            <div
              style={{
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginBottom: '1.5rem'
              }}
            >
              {/* Category Review */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tag size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category:</span>
                  <span
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      color: 'var(--accent-primary)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}
                  >
                    {category || 'Not specified (AI will classify)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Edit
                </button>
              </div>

              {/* Location Review */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Location:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {building || 'Campus Wide'}
                    {room ? ` — ${room}` : ''}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Edit
                </button>
              </div>

              {/* Description Review */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} style={{ color: 'var(--status-resolved)' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Description:</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Edit
                  </button>
                </div>
                <div
                  style={{
                    background: 'var(--bg-surface-1)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.5,
                    fontStyle: 'italic'
                  }}
                >
                  "{description || 'No description provided'}"
                </div>
              </div>
            </div>

            {/* AI Correlation Notice */}
            <div
              style={{
                background: 'var(--accent-glow-subtle)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1.5rem'
              }}
            >
              <SparklesIcon size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Our intelligence pipeline will generate semantic embeddings, calculate multi-factor proximity (Space, Time, Category), and cluster this report into an incident dossier.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button type="button" variant="secondary" onClick={handlePrevStep} icon={<ArrowLeft size={16} />}>
                Back
              </Button>
              <Button
                type="submit"
                size="lg"
                variant="primary"
                loading={loading}
                icon={<SparklesIcon size={18} />}
                id="submit-report-btn"
              >
                Submit Incident Report →
              </Button>
            </div>
          </div>
        )}

        {/* Validation Error Banner */}
        {validationError && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 1rem',
              color: 'var(--status-critical)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1.25rem'
            }}
          >
            <AlertTriangleIcon size={18} style={{ color: 'var(--status-critical)', flexShrink: 0 }} />
            <span>{validationError}</span>
          </div>
        )}
      </form>
    </div>
  );
};
