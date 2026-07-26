'use client';
// Sündmuse registreerimise taotlus kahes sammus: korraldaja andmed,
// siis sündmus. Kõik läheb andmebaasi turvalise funktsiooni kaudu
// (register_event), mis kontrollib sisselogimist ja piirab taotluste
// arvu. Sündmus tekib olekus "ootel" — admin on kohe lahti, avalikuks
// läheb pärast platvormi omaniku kinnitust ja arvet.
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../lib/supabaseClient';
import { slugify } from './admin/adminShared';
import SignIn from './SignIn';

const RESERVED = ['admin', 'api', 'et', 'en', 'kava', 'kaart', 'esinejad',
  'esineja', 'esinemine', 'ala', 'profiil', 'minu-kava', 'korraldajale',
  'platvorm', 'www', 'app'];

export default function OrganizerApply({ authReady }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [done, setDone] = useState(null); // valmis: sündmuse slug
  const [f, setF] = useState({
    org_name: '', reg_code: '', contact_name: '', phone: '', website: '',
    event_name: '', slug: '', starts_on: '', ends_on: ''
  });

  useEffect(() => {
    if (!authReady) { setChecking(false); return; }
    const supabase = supabaseBrowser();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [authReady]);

  function set(patch) { setF((x) => ({ ...x, ...patch })); }

  function step1Ok() {
    if (f.org_name.trim().length < 3) return 'Kirjuta MTÜ või OÜ ametlik nimi.';
    if (!/^\d{8}$/.test(f.reg_code.trim())) return 'Registrikood on 8 numbrit — leiad selle äriregistrist.';
    if (f.contact_name.trim().length < 2) return 'Kontaktisiku nimi on puudu.';
    return null;
  }
  function step2Ok() {
    if (f.event_name.trim().length < 3) return 'Sündmuse nimi on puudu.';
    const slug = f.slug.trim();
    if (!/^[a-z0-9][a-z0-9-]{1,60}$/.test(slug)) {
      return 'Aadress tohib sisaldada ainult väiketähti, numbreid ja sidekriipse, nt viljandi-folk-2027.';
    }
    if (RESERVED.includes(slug)) return 'See aadress on süsteemi jaoks kinni — vali teine.';
    if (!f.starts_on || !f.ends_on) return 'Mõlemad kuupäevad on vaja.';
    if (f.ends_on < f.starts_on) return 'Lõpp ei saa olla enne algust.';
    return null;
  }

  async function submit() {
    const err = step2Ok();
    if (err) { setMsg(err); return; }
    setBusy(true); setMsg(null);
    const supabase = supabaseBrowser();
    const { data, error } = await supabase.rpc('register_event', {
      p_org_name: f.org_name.trim(),
      p_reg_code: f.reg_code.trim(),
      p_contact_name: f.contact_name.trim(),
      p_contact_phone: f.phone.trim() || null,
      p_website: f.website.trim() || null,
      p_event_name: f.event_name.trim(),
      p_slug: f.slug.trim(),
      p_starts: f.starts_on,
      p_ends: f.ends_on
    });
    setBusy(false);
    if (error) {
      const m = error.message || '';
      if (m.includes('reg_code')) setMsg('Selle registrikoodiga korraldaja on juba platvormil. Kui see on Sinu organisatsioon, palu selle peakasutajal Sind Meeskond sakis adminiks lisada.');
      else if (m.includes('slug')) setMsg('See aadress on juba võetud või ei sobi — proovi teist, nt lisa aastaarv.');
      else setMsg('Saatmine ebaõnnestus: ' + m);
      return;
    }
    setDone(f.slug.trim());
  }

  if (checking) return null;
  if (!authReady) {
    return <div className="notice"><p>Süsteem on seadistamata.</p></div>;
  }

  if (!user) {
    return (
      <div className="apply-card">
        <h2 className="signin-title">Alusta sisselogimisega</h2>
        <p className="discover-intro">Taotluse esitamiseks logi sisse —
          sama kontoga hakkad hiljem oma sündmust haldama.</p>
        <SignIn locale="et" redirectPath="/korraldajale" authReady={authReady} />
      </div>
    );
  }

  if (done) {
    return (
      <div className="apply-card">
        <h2 className="signin-title">Taotlus on teel ✅</h2>
        <p className="discover-intro">Kolm asja, mida teada:</p>
        <ol className="apply-list">
          <li>Taotlus on platvormi omaniku juures ülevaatamisel —
            tavaliselt paar tööpäeva. Vastus tuleb meilile
            ({user.email}).</li>
          <li>Sa võid kava JUBA PRAEGU sisestama hakata: adminipaneel
            on Sulle lahti. Avalikuks läheb sündmus pärast kinnitust
            ja arvet.</li>
          <li>Sündmuse aadress saab olema /{done}</li>
        </ol>
        <a href="/admin" className="btn-primary admin-note-btn">Ava adminipaneel →</a>
      </div>
    );
  }

  return (
    <div className="apply-card">
      <div className="apply-steps">
        <span className={step === 1 ? 'on' : ''}>1. Korraldaja</span>
        <span className={step === 2 ? 'on' : ''}>2. Sündmus</span>
      </div>

      {step === 1 && (
        <>
          <label className="apply-field">MTÜ või OÜ ametlik nimi
            <input value={f.org_name} onChange={(e) => set({ org_name: e.target.value })} />
            <small>Kontrollime äriregistrist, et taotleb päris korraldaja.</small>
          </label>
          <label className="apply-field">Registrikood
            <input inputMode="numeric" value={f.reg_code}
              onChange={(e) => set({ reg_code: e.target.value })} />
          </label>
          <label className="apply-field">Kontaktisik
            <input value={f.contact_name} onChange={(e) => set({ contact_name: e.target.value })} />
          </label>
          <label className="apply-field">Telefon (valikuline)
            <input inputMode="tel" value={f.phone} onChange={(e) => set({ phone: e.target.value })} />
          </label>
          <label className="apply-field">Sündmuse veebileht või FB-leht (valikuline)
            <input value={f.website} onChange={(e) => set({ website: e.target.value })} />
          </label>
          {msg && <p className="admin-msg">{msg}</p>}
          <button className="btn-primary apply-btn" onClick={() => {
            const err = step1Ok();
            if (err) { setMsg(err); return; }
            setMsg(null); setStep(2);
          }}>Edasi →</button>
        </>
      )}

      {step === 2 && (
        <>
          <label className="apply-field">Sündmuse nimi
            <input value={f.event_name}
              onChange={(e) => {
                const name = e.target.value;
                set({ event_name: name, slug: f.slug || slugify(name) });
              }} />
          </label>
          <label className="apply-field">Aadress äpis
            <input value={f.slug}
              onChange={(e) => set({ slug: e.target.value.toLowerCase() })} />
            <small>Sündmuse leht saab olema /{f.slug || 'sinu-syndmus'} —
              soovitame lisada aastaarvu, nt viljandi-folk-2027.</small>
          </label>
          <label className="apply-field">Algus
            <input type="date" value={f.starts_on}
              onChange={(e) => set({ starts_on: e.target.value })} />
          </label>
          <label className="apply-field">Lõpp (viimane päev)
            <input type="date" value={f.ends_on}
              onChange={(e) => set({ ends_on: e.target.value })} />
          </label>
          <p className="apply-consent">Taotlust saates kinnitad, et
            esindad seda organisatsiooni ja nõustud{' '}
            <a href="/tingimused" target="_blank" className="info-card-link">tingimustega</a>.</p>
          {msg && <p className="admin-msg">{msg}</p>}
          <div className="apply-actions">
            <button className="btn-secondary apply-btn" onClick={() => { setMsg(null); setStep(1); }}>← Tagasi</button>
            <button className="btn-primary apply-btn" disabled={busy} onClick={submit}>
              {busy ? '…' : 'Saada taotlus'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
