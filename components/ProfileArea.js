'use client';
// Profiililehe aju: kui kasutaja pole sisse logitud, näitab
// sisselogimisvaadet; kui on, siis profiili (e-post, hommikukirja
// linnuke, väljalogimine). Sisselogimise järel liidetakse telefoni
// kava kontoga ja näidatakse kinnitust. Kõik kasutaja andmed käivad
// läbi RLS-i: igaüks näeb ja muudab ainult enda ridu.
import { useEffect, useState } from 'react';
import { t } from '../lib/i18n';
import { supabaseBrowser } from '../lib/supabaseClient';
import { mergeScheduleWithAccount } from '../lib/mySchedule';
import SignIn from './SignIn';

export default function ProfileArea({ locale, authReady }) {
  const tr = t(locale);
  const [checking, setChecking] = useState(authReady); // sessiooni kontroll käib
  const [user, setUser] = useState(null);
  const [wantsEmail, setWantsEmail] = useState(false);
  const [savedCount, setSavedCount] = useState(null);

  useEffect(() => {
    if (!authReady) return;
    const supabase = supabaseBrowser();
    if (!supabase) { setChecking(false); return; }

    let unsub = () => {};

    async function init(session) {
      setUser(session?.user ?? null);
      setChecking(false);
      if (session?.user) {
        // kava kontosse + kontost telefoni (duplikaate ei teki)
        const count = await mergeScheduleWithAccount();
        if (count !== null) setSavedCount(count);
        // hommikukirja eelistus profiilist
        const { data } = await supabase.from('profiles')
          .select('wants_daily_email')
          .eq('id', session.user.id)
          .single();
        if (data) setWantsEmail(Boolean(data.wants_daily_email));
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => init(session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      init(session);
    });
    unsub = () => sub.subscription.unsubscribe();
    return () => unsub();
  }, [authReady]);

  async function toggleDailyEmail() {
    const supabase = supabaseBrowser();
    if (!supabase || !user) return;
    const next = !wantsEmail;
    setWantsEmail(next); // kohe nähtav, andmebaas järgi
    const { error } = await supabase.from('profiles')
      .update({ wants_daily_email: next })
      .eq('id', user.id);
    if (error) setWantsEmail(!next); // ei õnnestunud → võta tagasi
  }

  async function signOut() {
    const supabase = supabaseBrowser();
    await supabase?.auth.signOut();
    setUser(null);
    setSavedCount(null);
  }

  if (checking) return null;

  if (!user) return <SignIn locale={locale} authReady={authReady} />;

  return (
    <div className="signin">
      <h2 className="signin-title">{tr.profile_hello}</h2>
      <p className="signin-intro">{tr.profile_signed_in_as} <strong>{user.email}</strong></p>

      {savedCount !== null && (
        <div className="notice profile-synced" role="status">
          <p>✅ {tr.profile_synced_1} {savedCount} {tr.profile_synced_2}</p>
        </div>
      )}

      <button
        className={`profile-toggle ${wantsEmail ? 'on' : ''}`}
        onClick={toggleDailyEmail}
        role="switch"
        aria-checked={wantsEmail}
      >
        <span className="profile-toggle-text">
          <span className="profile-toggle-title">{tr.profile_daily_email}</span>
          <span className="profile-toggle-hint">{tr.profile_daily_email_hint}</span>
        </span>
        <span className="switch" aria-hidden><span className="switch-dot" /></span>
      </button>

      <button className="btn-secondary profile-signout" onClick={signOut}>
        {tr.profile_signout}
      </button>
    </div>
  );
}
