'use client';
// Adminite haldus (ainult superadmin). E-postid ja muudatused käivad
// turvaliste andmebaasifunktsioonide kaudu, mis kontrollivad ise,
// et küsija on superadmin.
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';

export default function AdminAdmins() {
  const [rows, setRows] = useState([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [msg, setMsg] = useState(null);

  async function load() {
    const supabase = supabaseBrowser();
    const { data, error } = await supabase.rpc('admin_list');
    if (!error && data) setRows(data);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    const supabase = supabaseBrowser();
    const { data, error } = await supabase.rpc('admin_add_by_email', {
      p_email: email, p_role: role
    });
    if (error) { setMsg('Ebaõnnestus: ' + error.message); return; }
    setMsg(data === 'OK' ? 'Lisatud ✅' : data);
    if (data === 'OK') setEmail('');
    await load();
  }

  async function remove(row) {
    if (!window.confirm(`Eemaldan admini ${row.email}?`)) return;
    const supabase = supabaseBrowser();
    const { data, error } = await supabase.rpc('admin_remove', { p_user_id: row.user_id });
    if (error) { setMsg('Ebaõnnestus: ' + error.message); return; }
    setMsg(data === 'OK' ? 'Eemaldatud' : data);
    await load();
  }

  return (
    <section className="admin-card">
      <h2>Adminid ({rows.length})</h2>
      <p className="admin-hint">Uus admin peab olema äppi vähemalt korra
        sisse loginud, alles siis saab teda e-posti järgi lisada.
        Superadmin saab lisaks hallata teisi admineid.</p>
      <div className="admin-grid">
        <label>E-post
          <input type="email" value={email} placeholder="nimi@näide.ee"
            onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>Roll
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">admin</option>
            <option value="superadmin">superadmin</option>
          </select>
        </label>
      </div>
      {msg && <p className="admin-msg">{msg}</p>}
      <div className="admin-actions">
        <button className="btn-primary" onClick={add}>Lisa admin</button>
      </div>
      <div className="admin-list">
        {rows.map((row) => (
          <div key={row.user_id} className="admin-row">
            <div className="admin-row-main">
              <div className="admin-row-title">
                {row.email}
                {row.role === 'superadmin' && <span className="admin-badge">superadmin</span>}
              </div>
            </div>
            <button className="admin-mini admin-mini-danger" onClick={() => remove(row)}>
              Eemalda
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
