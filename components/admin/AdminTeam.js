'use client';
// Meeskond: selle sündmuse adminite haldus. Kõik käib turvaliste
// andmebaasifunktsioonide kaudu, mis kontrollivad ise, et küsija on
// SELLE sündmuse peakasutaja — teise sündmuse admin siia ei pääse.
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';

export default function AdminTeam({ data }) {
  const [rows, setRows] = useState(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [msg, setMsg] = useState(null);
  const eventId = data.eventId;
  const amMain = data.event.myRole === 'peakasutaja';

  async function load() {
    const supabase = supabaseBrowser();
    const { data: list, error } = await supabase.rpc('event_admin_list', { p_event: eventId });
    if (error) {
      setRows([]);
      setMsg(error.message.includes('does not exist')
        ? 'Meeskonna funktsioon puudub — käivita Supabase\'is 0013 SQL.'
        : 'Laadimine ebaõnnestus: ' + error.message);
      return;
    }
    setRows(list || []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [eventId]);

  async function add() {
    const supabase = supabaseBrowser();
    const { data: res, error } = await supabase.rpc('event_admin_add', {
      p_event: eventId, p_email: email.trim(), p_role: role
    });
    if (error) { setMsg('Ebaõnnestus: ' + error.message); return; }
    setMsg(res === 'Lisatud' ? 'Lisatud ✅' : res);
    if (res === 'Lisatud') setEmail('');
    await load();
  }

  async function remove(row) {
    if (!window.confirm(`Eemaldan admini ${row.email}?`)) return;
    const supabase = supabaseBrowser();
    const { error } = await supabase.rpc('event_admin_remove', {
      p_event: eventId, p_user: row.user_id
    });
    if (error) { setMsg('Ebaõnnestus: ' + error.message); return; }
    setMsg('Eemaldatud');
    await load();
  }

  return (
    <section className="admin-card">
      <h2>Meeskond {rows ? `(${rows.length})` : ''}</h2>
      <p className="admin-hint">Selle sündmuse adminid. Uus admin peab
        olema äppi vähemalt korra sisse loginud, alles siis saab teda
        e-posti järgi lisada. Admineid saab lisada ja eemaldada ainult
        peakasutaja; viimast peakasutajat eemaldada ei saa.</p>

      {amMain && (
        <div className="admin-grid">
          <label>E-post
            <input type="email" value={email} placeholder="nimi@näide.ee"
              onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>Roll
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">admin</option>
              <option value="peakasutaja">peakasutaja</option>
            </select>
          </label>
        </div>
      )}
      {msg && <p className="admin-msg">{msg}</p>}
      {amMain && (
        <div className="admin-actions">
          <button className="btn-primary" onClick={add} disabled={!email.trim()}>
            ＋ Lisa admin
          </button>
        </div>
      )}

      <div className="admin-list">
        {(rows || []).map((r) => (
          <div key={r.user_id} className="admin-row">
            <div className="admin-row-main">
              <div className="admin-row-title">
                {r.email}
                {r.role === 'peakasutaja' && <span className="admin-badge">peakasutaja</span>}
              </div>
            </div>
            {amMain && (
              <button className="admin-mini" onClick={() => remove(r)}>Eemalda</button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
