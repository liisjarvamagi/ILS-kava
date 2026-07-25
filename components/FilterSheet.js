'use client';
// Altpoolt avanev valikuleht nagu Brellas: otsing, linnukestega
// valikud ja Rakenda nupp. Valik rakendub alles Rakenda vajutusel,
// nii et poolikud klõpsud ei muuda kava enne, kui oled valmis.
import { useState } from 'react';
import { t } from '../lib/i18n';

export default function FilterSheet({ title, options, selected, onApply, onClose, locale }) {
  const tr = t(locale);
  const [draft, setDraft] = useState(selected);
  const [query, setQuery] = useState('');

  const shown = options.filter((o) =>
    o.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  function toggle(id) {
    setDraft((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h2 className="sheet-title">{title}</h2>
        <input
          className="sheet-search"
          type="search"
          placeholder={tr.filter_search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="sheet-list">
          {shown.map((o) => {
            const on = draft.includes(o.id);
            return (
              <button
                key={o.id}
                className={`sheet-option ${on ? 'on' : ''}`}
                onClick={() => toggle(o.id)}
              >
                <span className="sheet-option-label">
                  {o.color && <span className="dot" style={{ background: o.color }} />}
                  {o.label}
                </span>
                <span className={`checkbox ${on ? 'checked' : ''}`} aria-hidden>
                  {on ? '✓' : ''}
                </span>
              </button>
            );
          })}
        </div>
        <button className="sheet-apply" onClick={() => { onApply(draft); onClose(); }}>
          {tr.filter_apply}
        </button>
      </div>
    </div>
  );
}
