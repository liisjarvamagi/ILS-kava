'use client';
// Sisselogimise vaade Brella loogikaga: kõigepealt sisestad e-posti,
// konto olemasolu kontrollitakse järgmisel sammul; alternatiiv on
// Google. See on praegu valmis KUJUNDUS — päris sisselogimine
// ühendatakse ehitusplaani 5. tükis (Supabase Auth), siis hakkavad
// need nupud tööle. authReady tuleb serverist ja ütleb, kas
// andmebaas on juba seadistatud.
import { useState } from 'react';
import { t } from '../lib/i18n';

export default function SignIn({ locale, authReady }) {
  const tr = t(locale);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [showSoon, setShowSoon] = useState(false);

  function submitEmail(e) {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) { setError(tr.signin_invalid_email); return; }
    setError(null);
    // 5. tükk: siin kontrollitakse Supabase'ist konto olemasolu ja
    // saadetakse kas parooliväli või magic link. Praegu näitame teadet.
    setShowSoon(true);
  }

  function googleSignIn() {
    // 5. tükk: supabase.auth.signInWithOAuth({ provider: 'google' })
    setShowSoon(true);
  }

  return (
    <div className="signin">
      <h2 className="signin-title">{tr.signin_title}</h2>
      <p className="signin-intro">{tr.signin_intro}</p>

      <form onSubmit={submitEmail}>
        <label className="signin-label" htmlFor="signin-email">{tr.signin_email_label}</label>
        <input
          id="signin-email"
          className="signin-input"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={tr.signin_email_placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="signin-hint">{tr.signin_email_hint}</p>
        {error && <p className="signin-error" role="alert">{error}</p>}
        <button type="submit" className="btn-primary">{tr.signin_continue_email}</button>
      </form>

      <div className="signin-or">
        <span>{tr.signin_or}</span>
      </div>

      <button className="btn-secondary" onClick={googleSignIn}>
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.8 6.1C12.3 13.4 17.7 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/>
          <path fill="#FBBC05" d="M10.3 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.8l7.8-6.1z"/>
          <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.4-5.5l-7.5-5.8c-2.1 1.4-4.8 2.3-7.9 2.3-6.3 0-11.7-3.9-13.7-9.3l-7.8 6.1C6.5 42.6 14.6 48 24 48z"/>
        </svg>
        {tr.signin_continue_google}
      </button>

      <p className="signin-terms">{tr.signin_terms}</p>

      {showSoon && (
        <div className="notice signin-soon" role="status">
          <h2>{tr.signin_soon_title}</h2>
          <p>{tr.signin_soon_body}</p>
        </div>
      )}
    </div>
  );
}
