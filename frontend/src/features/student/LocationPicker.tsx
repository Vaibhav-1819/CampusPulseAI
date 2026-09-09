import React from 'react';
import { LocationPinIcon } from '../../components/Icons';

interface LocationPickerProps {
  building: string;
  room: string;
  onBuildingChange: (building: string) => void;
  onRoomChange: (room: string) => void;
}

const COMMON_BUILDINGS = [
  'CSE Block',
  'Central Library',
  'Mechanical Lab',
  'Science Annex',
  'Admin Block',
  'Student Hostel'
];

const ROOM_SUGGESTIONS = [
  'Lab 1',
  'Lab 2',
  'Lab 3',
  'Room 101',
  'Room 204',
  '2nd Floor Hallway',
  'Main Auditorium',
  'Reading Room'
];

export const LocationPicker: React.FC<LocationPickerProps> = ({
  building,
  room,
  onBuildingChange,
  onRoomChange
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Building Selector */}
      <div>
        <label className="input-label" htmlFor="building-select">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <LocationPinIcon size={16} style={{ color: 'var(--accent-cyan)' }} />
            <span>Campus Building</span>
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
            {building ? 'Selected' : 'Or let AI extract'}
          </span>
        </label>

        {/* Quick select pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.75rem' }}>
          {COMMON_BUILDINGS.map((b) => {
            const isSelected = building.toLowerCase() === b.toLowerCase();
            return (
              <button
                key={b}
                type="button"
                id={`building-pill-${b.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onBuildingChange(isSelected ? '' : b)}
                style={{
                  background: isSelected ? 'rgba(6, 182, 212, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                  color: isSelected ? '#38bdf8' : 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 600 : 500,
                  padding: '0.3rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isSelected ? '0 0 12px rgba(6, 182, 212, 0.25)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                {isSelected && <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#38bdf8' }} />}
                <span>{b}</span>
              </button>
            );
          })}
        </div>

        <div style={{ position: 'relative' }}>
          <input
            id="building-input"
            type="text"
            className="input-field"
            placeholder="e.g. CSE Block, Central Library, or type any specific campus facility..."
            value={building}
            onChange={(e) => onBuildingChange(e.target.value)}
          />
          {building && (
            <button
              type="button"
              onClick={() => onBuildingChange('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-subtle)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: '4px'
              }}
              title="Clear building"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Room / Floor Sublocation */}
      <div>
        <label className="input-label" htmlFor="room-input">
          <span>Room, Lab, or Specific Spot (Optional)</span>
          {room && (
            <span style={{ fontSize: '0.725rem', color: 'var(--accent-cyan)' }}>
              Location pinpointed
            </span>
          )}
        </label>
        <div style={{ position: 'relative' }}>
          <input
            id="room-input"
            type="text"
            className="input-field"
            placeholder="e.g. Lab 3, 2nd Floor Restroom, Room 102..."
            value={room}
            onChange={(e) => onRoomChange(e.target.value)}
          />
          {room && (
            <button
              type="button"
              onClick={() => onRoomChange('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-subtle)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: '4px'
              }}
              title="Clear room"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick room suggestion chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', alignSelf: 'center', marginRight: '0.2rem' }}>
            Quick Add:
          </span>
          {ROOM_SUGGESTIONS.slice(0, 6).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRoomChange(r)}
              style={{
                background: room === r ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                border: room === r ? '1px solid var(--accent-primary)' : '1px dashed var(--border-subtle)',
                color: room === r ? '#c7d2fe' : 'var(--text-muted)',
                fontSize: '0.74rem',
                fontWeight: 500,
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              + {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
