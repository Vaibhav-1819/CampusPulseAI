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
  { category: 'OTHER', label: 'Other Issue', description: 'General facility maintenance', accent: '#94a3b8' }
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
        <span>Issue Category</span>
        <button
          type="button"
          onClick={() => onSelect(undefined)}
          style={{
            background: isAutoDetect ? 'rgba(79, 70, 229, 0.2)' : 'transparent',
            border: isAutoDetect ? '1px solid rgba(79, 70, 229, 0.5)' : '1px solid var(--card-border)',
            color: isAutoDetect ? '#c084fc' : 'var(--text-subtle)',
            fontSize: '0.78rem',
            padding: '0.2rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            transition: 'all 0.2s ease'
          }}
        >
          <SparklesIcon size={14} />
          <span>{isAutoDetect ? 'Auto-Detect (Enabled)' : 'Let AI Auto-Detect'}</span>
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '0.65rem'
        }}
      >
        {CATEGORIES.map((item) => {
          const isSelected = selectedCategory === item.category;

          return (
            <div
              key={item.category}
              id={`category-${item.category.toLowerCase()}`}
              onClick={() => onSelect(item.category)}
              style={{
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 0.65rem',
                background: isSelected ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.6)',
                border: isSelected ? `2px solid ${item.accent}` : '1px solid var(--card-border)',
                boxShadow: isSelected ? `0 0 16px -3px ${item.accent}55` : 'none',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 'var(--radius-md)',
                  background: `${item.accent}20`,
                  color: item.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CategoryIcon category={item.category} size={18} />
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-main)', lineHeight: 1.2 }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', lineHeight: 1.15 }}>
                {item.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
