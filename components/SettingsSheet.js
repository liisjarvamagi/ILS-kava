'use client';
// Vaate seaded nagu Brellas, aga lihtsamalt: vaade (nimekiri ⇄ ajajoon),
// suurendus ja tihedus. Valikud salvestuvad telefoni.
import { t } from '../lib/i18n';

const SCALES = [75, 100, 125, 150];

export default function SettingsSheet({ view, scale, density, onChange, onClose, locale }) {
  const tr = t(locale);
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h2 className="sheet-title">{tr.settings_title}</h2>

        <div className="setting-label">{tr.settings_mode}</div>
        <div className="segmented">
          <button
            className={view === 'list' ? 'active' : ''}
            onClick={() => onChange({ view: 'list' })}
          >
            {tr.view_list}
          </button>
          <button
            className={view === 'timeline' ? 'active' : ''}
            onClick={() => onChange({ view: 'timeline' })}
          >
            {tr.view_timeline}
          </button>
        </div>

        <div className="setting-label">{tr.settings_scale}</div>
        <div className="scale-row">
          <button
            aria-label="−"
            onClick={() => {
              const i = SCALES.indexOf(scale);
              if (i > 0) onChange({ scale: SCALES[i - 1] });
            }}
          >−</button>
          <span>{scale}%</span>
          <button
            aria-label="+"
            onClick={() => {
              const i = SCALES.indexOf(scale);
              if (i < SCALES.length - 1) onChange({ scale: SCALES[i + 1] });
            }}
          >+</button>
        </div>

        <div className="setting-label">{tr.settings_density}</div>
        <div className="segmented">
          <button
            className={density === 'compact' ? 'active' : ''}
            onClick={() => onChange({ density: 'compact' })}
          >
            {tr.settings_compact}
          </button>
          <button
            className={density === 'detailed' ? 'active' : ''}
            onClick={() => onChange({ density: 'detailed' })}
          >
            {tr.settings_detailed}
          </button>
        </div>
      </div>
    </div>
  );
}
