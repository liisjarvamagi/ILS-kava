'use client';
// Adminipaneeli süda: kontrollib ligipääsu (sessioon + event_admins /
// platform_admins), laseb valida sündmuse (kui õigusi on mitmele) ja
// näitab sakke valitud sündmuse piires. NB! See kontroll on
// kasutajamugavuse jaoks — päris kaitse on andmebaasis: RLS laseb
// kirjutada ainult oma sündmuse ridu.
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import { loadAdminData, myAdminEvents, fmtDay } from './adminShared';
import { isDirty, clearDirty, DIRTY_MSG } from './dirty';
import AdminPerformances from './AdminPerformances';
import AdminPlanner from './AdminPlanner';
import AdminArtists from './AdminArtists';
import AdminStages from './AdminStages';
import AdminTags from './AdminTags';
import AdminInfo from './AdminInfo';
import AdminImport from './AdminImport';
import AdminEmails from './AdminEmails';
import AdminEvent from './AdminEvent';
import AdminTeam from './AdminTeam';
import AdminMaps from './AdminMaps';
import AdminPlatform from './AdminPlatform';

const TABS = [
  { key: 'planner', label: '📅 Planeerija' },
  { key: 'perfs', label: 'Esinemised' },
  { key: 'artists', label: 'Esinejad' },
  { key: 'stages', label: 'Alad' },
  { key: 'tags', label: 'Tagid' },
  { key: 'info', label: 'Oluline info' },
  { key: 'maps', label: 'Kaardid' },
  { key: 'import', label: '⇪ Import' },
  { key: 'emails', label: 'Meilid' },
  { key: 'event', label: '🎪 Sündmus' },
  { key: 'team', label: 'Meeskond' },
  { key: 'platform', label: '🌍 Platvorm', platformOnly: true }
];

const CHOSEN_KEY = 'ils_admin_event_v1';

export default function AdminApp() {
  const [state, setState] = useState('loading'); // loading | noenv | noauth | denied | ok
  const [me, setMe] = useState(null);      // { events, isPlatform }
  const [chosen, setChosen] = useState(null); // valitud sündmus
  const [tab, setTab] = useState('perfs');
  const [data, setData] = useState(null);

  async function refresh(ev = chosen) {
    if (!ev) return;
    const fresh = await myAdminEvents();
    setMe(fresh);
    const updated = fresh?.events.find((e) => e.id === ev.id) || ev;
    setChosen(updated);
    setData(await loadAdminData(updated));
  }

  useEffect(() => {
    const supabase = supabaseBrowser();
    if (!supabase) { setState('noenv'); return; }
    (async () => {
      const mine = await myAdminEvents();
      if (mine?.signedOut) { setState('noauth'); return; }
      if (!mine || (!mine.events.length && !mine.isPlatform)) { setState('denied'); return; }
      setMe(mine);
      setState('ok');
      // viimane valik jääb meelde; üks sündmus → vali automaatselt
      const savedId = localStorage.getItem(CHOSEN_KEY);
      const pick = mine.events.find((e) => e.id === savedId)
        || (mine.events.length === 1 ? mine.events[0] : null);
      if (pick) {
        setChosen(pick);
        setData(await loadAdminData(pick));
      } else if (!mine.events.length && mine.isPlatform) {
        setTab('platform');
      }
    })();
  }, []);

  // Salvestamata muudatused: hoiatus lehelt lahkumisel
  useEffect(() => {
    function beforeUnload(e) {
      if (isDirty()) { e.preventDefault(); e.returnValue = ''; }
    }
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, []);

  function switchTab(key) {
    if (key !== tab && isDirty() && !window.confirm(DIRTY_MSG)) return;
    clearDirty();
    setTab(key);
  }

  async function chooseEvent(e) {
    if (isDirty() && !window.confirm(DIRTY_MSG)) return;
    clearDirty();
    setChosen(e);
    setData(null);
    localStorage.setItem(CHOSEN_KEY, e.id);
    setData(await loadAdminData(e));
  }

  if (state === 'loading') return <div className="admin-note">Laen…</div>;
  if (state === 'noenv') {
    return <div className="admin-note">Andmebaas on seadistamata (.env.local puudub).</div>;
  }
  if (state === 'noauth') {
    return (
      <div className="admin-note">
        <p>Adminipaneel vajab sisselogimist.</p>
        <a className="btn-primary admin-note-btn" href="/ils-2026/et/profiil">Mine sisse logima</a>
      </div>
    );
  }
  if (state === 'denied') {
    return (
      <div className="admin-note">
        <p>Sul pole ühegi sündmuse adminiõigusi. Kui peaks olema, palu
        oma sündmuse peakasutajal end Meeskond saki alt lisada.</p>
        <a className="btn-secondary admin-note-btn" href="/">Tagasi äppi</a>
      </div>
    );
  }

  const visibleTabs = TABS.filter((t) =>
    (!t.platformOnly || me.isPlatform) &&
    (t.key === 'platform' || chosen) // sisusakid vajavad valitud sündmust
  );

  return (
    <div className="admin">
      <header className="admin-header">
        <h1>{chosen ? chosen.name.toUpperCase() : 'SÜNDMUSKAVA'} · ADMIN</h1>
        {chosen && <a href={`/${chosen.slug}/et`} className="admin-exit">Ava äpp →</a>}
      </header>

      {me.events.length > 1 && (
        <div className="admin-eventpick">
          <span className="admin-eventpick-label">Sündmus:</span>
          {me.events.map((e) => (
            <button key={e.id}
              className={`admin-chip ${chosen?.id === e.id ? 'on' : ''}`}
              onClick={() => chooseEvent(e)}>
              {e.name} ({fmtDay(e.starts_on)})
            </button>
          ))}
        </div>
      )}

      {!chosen && !me.events.length && me.isPlatform && (
        <div className="admin-note">Sul pole veel oma sündmust — platvormi
          vaates näed taotlusi ja kõiki sündmusi.</div>
      )}

      {me.events.length > 1 && !chosen && (
        <div className="admin-note">Vali ülevalt sündmus, mida hallata.</div>
      )}

      <nav className="admin-tabs">
        {visibleTabs.map((t) => (
          <button
            key={t.key}
            className={tab === t.key ? 'active' : ''}
            onClick={() => switchTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {chosen && data && data.stages.length === 0 && data.performances.length === 0 && tab !== 'platform' && (
        <div className="admin-note admin-quickstart">
          <strong>Kiirjuhend uuele sündmusele</strong>
          <ol>
            <li>Alad sakis loo oma alad (lava, töötubade telk vm) värvidega</li>
            <li>Kava saad sisse tuua tabelina (⇪ Import — kleebi Excelist)
              või sisestada käsitsi Esinemised sakis</li>
            <li>Kaardid sakis lae üles oma ala kaart ja klõpsi Alad sakis
              punktid peale</li>
            <li>🎪 Sündmus sakis lae kaanefoto, lisa piletite link ja pane
              sündmus avalikuks, kui kava on valmis</li>
          </ol>
        </div>
      )}

      {tab === 'platform' ? (
        <main className="admin-main">
          <AdminPlatform onChanged={() => refresh()} />
        </main>
      ) : !chosen ? null : !data ? (
        <div className="admin-note">Laen andmeid…</div>
      ) : (
        <main className="admin-main">
          {tab === 'planner' && <AdminPlanner data={data} onChanged={refresh} />}
          {tab === 'perfs' && <AdminPerformances data={data} onChanged={refresh} />}
          {tab === 'artists' && <AdminArtists data={data} onChanged={refresh} />}
          {tab === 'stages' && <AdminStages data={data} onChanged={refresh} />}
          {tab === 'tags' && <AdminTags data={data} onChanged={refresh} />}
          {tab === 'info' && <AdminInfo data={data} onChanged={refresh} />}
          {tab === 'maps' && <AdminMaps data={data} onChanged={refresh} />}
          {tab === 'import' && <AdminImport data={data} onChanged={refresh} />}
          {tab === 'emails' && <AdminEmails eventId={data.eventId} />}
          {tab === 'event' && <AdminEvent data={data} onChanged={refresh} />}
          {tab === 'team' && <AdminTeam data={data} />}
        </main>
      )}
    </div>
  );
}
