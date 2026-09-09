import React from 'react';
import { IssueCategory } from '../../types';
import { CategoryIcon, SparklesIcon } from '../../components/Icons';

interface CategoryOption {
  category: IssueCategory;
  label: string;
  description: string;
  accent: string;
}

const CATEGORIES: CategoryOption[] = [
  { category: 'NETWORK', label: 'Network & WiFi', description: 'Access points, LAN, DNS loss', accent: '#3b82f6' },
  { category: 'ELECTRICAL', label: 'Power & Lights', description: 'Outlets, breakers, blackouts', accent: '#eab308' },
  { category: 'PLUMBING', label: 'Water & Leaks', description: 'Burst pipes, restrooms, drains', accent: '#06b6d4' },
  { category: 'HVAC', label: 'Heating & AC', description: 'Room temperature, ventilation', accent: '#10b981' },
  { category: 'PHYSICAL', label: 'Structural & Doors', description: 'Broken locks, doors, furniture', accent: '#f97316' },
  { category: 'EQUIPMENT', label: 'Lab & AV Gear', description: 'Projectors, lab devices, PCs', accent: '#8b5cf6' },
  { category: 'SAFETY', label: 'Urgent Hazard', description: 'Smoke, gas, slip hazards', accent: '#ef4444' },
  { category: 'OTHER', label: 'Other Issue', description: 'General facility maintenance', accent: '#64748b' }
];

interface CategorySelectorProps {
  selectedCategory?: IssueCategory;
  onSelect: (category?: IssueCategory) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onSelect }) => {
  const isAutoDetect = !selectedCategory;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="input-label">
        <span>1. Select Category</span>
        <button
          type="button"
          onClick={() => onSelect(undefined)}
          style={{
            background: isAutoDetect ? 'var(--accent-primary-subtle)' : 'transparent',
            border: isAutoDetect ? '1px solid var(--accent-primary-border)' : '1px solid var(--border-subtle)',
            color: isAutoDetect ? 'var(--accent-primary)' : 'var(--text-muted)',
            fontSize: '0.75rem',
            padding: '0.2rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'all var(--transition-fast)'
          }}
        >
          <SparklesIcon size={13} />
          <span>{isAutoDetect ? 'Auto-Detect (Enabled)' : 'Let AI Auto-Detect'}</span>
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))',
          gap: '0.75rem'
        }}
      >
        {CATEGORIES.map((item) => {
          const isSelected = selectedCategory === item.category;

          return (
            <div
              key={item.category}
              id={`category-${item.category.toLowerCase()}`}
              onClick={() => onSelect(item.category)}
              className="card-3d-lift"
              style={{
                cursor: 'pointer',
                borderRadius: 'var(--radius-lg)',
                padding: '0.9rem 0.75rem',
                background: isSelected 
                  ? 'var(--bg-surface-2)' 
                  : 'var(--bg-surface-1)',
                border: isSelected ? `2px solid ${item.accent}` : '1px solid var(--border-subtle)',
                boxShadow: isSelected 
                  ? `0 0 15px ${item.accent}33` 
                  : 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.45rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Selected checkmark indicator */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '7px',
                  right: '7px',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: item.accent,
                  boxShadow: `0 0 6px ${item.accent}`
                }} />
              )}

              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-md)',
                  background: `${item.accent}18`,
                  color: item.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CategoryIcon category={item.category} size={18} />
              </div>
              <div style={{ 
                fontSize: '0.825rem', 
                fontWeight: isSelected ? 700 : 600, 
                color: 'var(--text-primary)', 
                lineHeight: 1.25 
              }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.2 }}>
                {item.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
