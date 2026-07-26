'use client';
// Platvormi vaade (ainult platvormi omanik): korraldajate taotlused,
// kõigi sündmuste nimekiri lülititega ja tellijate arvud. RLS laseb
// siia ainult platform_admins tabelis olijad — teistele on kõik
// päringud tühjad.
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import { fmtDay } from './adminShared';

export default function AdminPlatform({ onChanged }) {
  const [orgs, setOrgs] = useState([]);
  const [events, setEvents] = useState([]);
  const [subs, setSubs] = useState({});
  const [reason, setReason] = useState({});
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const supabase = supabaseBrowser();
    const [{ data: o }, { data: e }] = await Promise.all([
      supabase.from('organizations').select('*').order('created_at', { ascending: false }),
      supabase.from('events').select('*').order('starts_on', { ascending: false })
    ]);
    setOrgs(o || []);
    setEvents(e || []);
    // tellijate arvud (ainult arvud, mitte kunagi meiliaadressid)
    const counts = {};
    for (const ev of e || []) {
      const { data: n } = await supabase.rpc('event_subscriber_count', { p_event: ev.id });
      if (typeof n === 'number') counts[ev.id] = n;
    }
    setSubs(counts);
  }
  useEffect(() => { load(); }, []);

  async function setOrgStatus(org, status) {
    const note = status === 'tagasi_lykatud' ? (reason[org.id] || '').trim() : null;
    if (status === 'tagasi_lykatud' && !note) {
      setMsg('Kirjuta tagasilükkamise põhjus — see aitab taotlejal aru saada.');
      return;
    }
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.from('organizations')
      .update({ status, notes: note || org.notes })
      .eq('id', org.id);
    setBusy(false);
    if (error) { setMsg('Ebaõnnestus: ' + error.message); return; }
    setMsg(status === 'kinnitatud'
      ? 'Kinnitatud ✅ Järgmine samm: saada arve ja pärast makset lülita sündmus sisse.'
      : 'Tagasi lükatud. Anna taotlejale põhjusest ise teada (meil on tema kaardil).');
    await load();
    onChanged?.();
  }

  async function toggleActive(ev) {
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.from('events')
      .update({ is_active: !ev.is_active })
      .eq('id', ev.id);
    setBusy(false);
    if (error) { setMsg('Ebaõnnestus: ' + error.message); return; }
    await load();
    onChanged?.();
  }

  async function changePlan(ev, plan) {
    const supabase = supabaseBrowser();
    const { error } = await supabase.from('events').update({ plan }).eq('id', ev.id);
    if (error) { setMsg('Ebaõnnestus: ' + error.message); return; }
    await load();
  }

  const orgById = Object.fromEntries(orgs.map((o) => [o.id, o]));
  const pending = orgs.filter((o) => o.status === 'ootel');

  return (
    <>
      <section className="admin-card">
        <h2>Taotlused ({pending.length})</h2>
        <p className="admin-hint">Kontrolli registrikood äriregistrist ja
          vajadusel helista kontaktile. Kinnitamine EI tee sündmust veel
          avalikuks — see on eraldi lüliti allpool, pärast arve maksmist.</p>
        {msg && <p className="admin-msg">{msg}</p>}
        {pending.length === 0 && <p className="admin-hint">Ootel taotlusi pole.</p>}
        {pending.map((o) => (
          <div key={o.id} className="admin-card admin-subcard">
            <div className="admin-row-title">{o.name}</div>
            <p className="admin-hint">
              Registrikood: <a className="info-card-link" target="_blank" rel="noreferrer"
                href={`https://ariregister.rik.ee/est/company_search_result?company_search=${encodeURIComponent(o.reg_code)}`}>
                {o.reg_code}</a>
              {' · '}{o.contact_name} · {o.contact_email}
              {o.contact_phone ? ` · ${o.contact_phone}` : ''}
              {o.website ? <> · <a className="info-card-link" href={o.website} target="_blank" rel="noreferrer">veeb</a></> : ''}
            </p>
            <p className="admin-hint">Sündmused: {events
              .filter((e) => e.organization_id === o.id)
              .map((e) => `${e.name} (${fmtDay(e.starts_on)}–${fmtDay(e.ends_on)})`)
              .join(', ') || '—'}</p>
            <label className="admin-label">Tagasilükkamise põhjus (kui lükkad tagasi)
              <input value={reason[o.id] || ''}
                onChange={(e) => setReason({ ...reason, [o.id]: e.target.value })} />
            </label>
            <div className="admin-actions">
              <button className="btn-primary" disabled={busy}
                onClick={() => setOrgStatus(o, 'kinnitatud')}>✓ Kinnita</button>
              <button className="btn-secondary" disabled={busy}
                onClick={() => setOrgStatus(o, 'tagasi_lykatud')}>✗ Lükka tagasi</button>
            </div>
          </div>
        ))}
      </section>

      <section className="admin-card">
        <h2>Sündmused ({events.length})</h2>
        <div className="admin-list">
          {events.map((ev) => {
            const org = orgById[ev.organization_id];
            const live = ev.is_public && ev.is_active;
            return (
              <div key={ev.id} className="admin-row">
                <div className="admin-row-main">
                  <div className="admin-row-title">
                    {ev.name}
                    <span className={`admin-badge ${live ? 'admin-badge-ok' : ''}`}>
                      {live ? 'elus' : org?.status === 'ootel' ? 'taotlus ootel'
                        : !ev.is_active ? 'välja lülitatud' : 'korraldajal peidus'}
                    </span>
                  </div>
                  <div className="admin-hint">
                    /{ev.slug} · {fmtDay(ev.starts_on)}–{fmtDay(ev.ends_on)}
                    {' · '}{org?.name || '?'}
                    {' · '}tellijaid: {subs[ev.id] ?? '…'}
                  </div>
                </div>
                <select className="admin-mini" value={ev.plan}
                  onChange={(e) => changePlan(ev, e.target.value)}>
                  <option value="proov">proov</option>
                  <option value="yks_syndmus">üks sündmus</option>
                  <option value="aastaringne">aastaringne</option>
                </select>
                <button className="admin-mini" disabled={busy}
                  onClick={() => toggleActive(ev)}>
                  {ev.is_active ? '⏸ Lülita välja' : '▶ Lülita sisse'}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
