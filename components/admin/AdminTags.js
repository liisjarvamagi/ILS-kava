'use client';
// Tagide haldus: lihtne nimekiri, lisamine ja kustutamine.
// Tagid ilmuvad avalikus kavas filtrina, kui neid esinemistele lisada.
import { useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import { slugify, revalidatePublic } from './adminShared';

export default function AdminTags({ data, onChanged }) {
  const [nameEt, setNameEt] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [msg, setMsg] = useState(null);

  async function add() {
    if (nameEt.trim().length < 2) { setMsg('Tagi nimi on puudu.'); return; }
    const supabase = supabaseBrowser();
    const { error } = await supabase.from('tags').insert({
      slug: slugify(nameEt),
      name_et: nameEt.trim(),
      name_en: nameEn.trim() || nameEt.trim()
    });
    if (error) { setMsg('Lisamine ebaõnnestus: ' + error.message); return; }
    setNameEt(''); setNameEn(''); setMsg('Lisatud ✅');
    await revalidatePublic();
    await onChanged();
  }

  async function remove(tg) {
    if (!window.confirm(`Kustutan tagi "${tg.name_et}"? Ta kaob ka kõigilt esinemistelt.`)) return;
    const supabase = supabaseBrowser();
    const { error } = await supabase.from('tags').delete().eq('id', tg.id);
    if (error) { setMsg('Kustutamine ebaõnnestus: ' + error.message); return; }
    await revalidatePublic();
    await onChanged();
  }

  return (
    <section className="admin-card">
      <h2>Tagid ({data.tags.length})</h2>
      <p className="admin-hint">Tagid on märksõnad, mille järgi külastaja
        saab kava filtreerida, nt LIVE, töötuba, jooga. Esinemistele
        lisad neid Esinemised saki vormist.</p>
      <div className="admin-grid">
        <label>Nimi (ET)
          <input value={nameEt} onChange={(e) => setNameEt(e.target.value)} />
        </label>
        <label>Nimi (EN)
          <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
        </label>
      </div>
      {msg && <p className="admin-msg">{msg}</p>}
      <div className="admin-actions">
        <button className="btn-primary" onClick={add}>Lisa tag</button>
      </div>
      <div className="admin-list">
        {data.tags.map((tg) => (
          <div key={tg.id} className="admin-row">
            <div className="admin-row-main">
              <div className="admin-row-title">#{tg.name_et} <span className="admin-row-sub">/ {tg.name_en}</span></div>
            </div>
            <button className="admin-mini admin-mini-danger" onClick={() => remove(tg)}>Kustuta</button>
          </div>
        ))}
      </div>
    </section>
  );
}
