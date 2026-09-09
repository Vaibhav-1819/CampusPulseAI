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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '0.65rem' }}>
          {COMMON_BUILDINGS.map((b) => {
            const isSelected = building.toLowerCase() === b.toLowerCase();
            return (
              <button
                key={b}
                type="button"
                id={`building-pill-${b.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => onBuildingChange(b)}
                style={{
                  background: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--card-border)',
                  color: isSelected ? '#38bdf8' : 'var(--text-muted)',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {b}
              </button>
            );
          })}
        </div>

        <input
          id="building-input"
          type="text"
          className="input-field"
          placeholder="e.g. CSE Block, Central Library, or specific block..."
          value={building}
          onChange={(e) => onBuildingChange(e.target.value)}
        />
      </div>

      {/* Room / Floor Sublocation */}
      <div>
        <label className="input-label" htmlFor="room-input">
          <span>Room, Lab, or Specific Spot (Optional)</span>
        </label>
        <input
          id="room-input"
          type="text"
          className="input-field"
          placeholder="e.g. Lab 3, 2nd Floor Restroom, Room 102..."
          value={room}
          onChange={(e) => onRoomChange(e.target.value)}
        />

        {/* Quick room suggestion chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', alignSelf: 'center', marginRight: '0.2rem' }}>
            Suggestions:
          </span>
          {ROOM_SUGGESTIONS.slice(0, 5).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRoomChange(r)}
              style={{
                background: 'transparent',
                border: '1px dashed var(--card-border)',
                color: 'var(--text-subtle)',
                fontSize: '0.73rem',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
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
