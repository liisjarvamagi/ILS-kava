'use client';
// Adminipaneeli süda: kontrollib ligipääsu (sessioon + admins tabel),
// laeb andmed ja näitab sakke. NB! See kontroll on kasutajamugavuse
// jaoks — päris kaitse on andmebaasis: RLS laseb kirjutada ainult
// adminitel, nii et võõras ei saa midagi muuta ka otse API-t torkides.
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '../../lib/supabaseClient';
import { loadAdminData } from './adminShared';
import { isDirty, clearDirty, DIRTY_MSG } from './dirty';
import AdminPerformances from './AdminPerformances';
import AdminPlanner from './AdminPlanner';
import AdminArtists from './AdminArtists';
import AdminStages from './AdminStages';
import AdminTags from './AdminTags';
import AdminInfo from './AdminInfo';
import AdminImport from './AdminImport';
import AdminEmails from './AdminEmails';
import AdminAdmins from './AdminAdmins';
import AdminEvent from './AdminEvent';

const TABS = [
  { key: 'planner', label: '📅 Planeerija' },
  { key: 'perfs', label: 'Esinemised' },
  { key: 'artists', label: 'Esinejad' },
  { key: 'stages', label: 'Alad' },
  { key: 'tags', label: 'Tagid' },
  { key: 'info', label: 'Oluline info' },
  { key: 'import', label: '⇪ Import' },
  { key: 'emails', label: 'Meilid' },
  { key: 'event', label: '🎪 Sündmus' },
  { key: 'admins', label: 'Adminid', superOnly: true }
];

export default function AdminApp() {
  const [state, setState] = useState('loading'); // loading | noenv | noauth | denied | ok
  const [role, setRole] = useState(null);
  const [tab, setTab] = useState('perfs');
  const [data, setData] = useState(null);

  async function refresh() {
    setData(await loadAdminData());
  }

  // Brauseri hoiatus enne lehelt lahkumist (sulgemine, värskendus,
  // teisele aadressile minek), kui vormis on salvestamata muudatusi
  useEffect(() => {
    function beforeUnload(e) {
      if (isDirty()) { e.preventDefault(); e.returnValue = ''; }
    }
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, []);

  // Saki vahetus salvestamata muudatustega küsib enne üle
  function switchTab(key) {
    if (key !== tab && isDirty() && !window.confirm(DIRTY_MSG)) return;
    clearDirty();
    setTab(key);
  }

  useEffect(() => {
    const supabase = supabaseBrowser();
    if (!supabase) { setState('noenv'); return; }
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setState('noauth'); return; }
      const { data: adminRow } = await supabase
        .from('admins')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle();
      if (!adminRow) { setState('denied'); return; }
      setRole(adminRow.role);
      setState('ok');
      await refresh();
    })();
  }, []);

  if (state === 'loading') return <div className="admin-note">Laen…</div>;
  if (state === 'noenv') {
    return <div className="admin-note">Andmebaas on seadistamata (.env.local puudub).</div>;
  }
  if (state === 'noauth') {
    return (
      <div className="admin-note">
        <p>Adminipaneel vajab sisselogimist.</p>
        <a className="btn-primary admin-note-btn" href="/et/profiil">Mine sisse logima</a>
      </div>
    );
  }
  if (state === 'denied') {
    return (
      <div className="admin-note">
        <p>Sul pole adminipaneelile ligipääsu. Kui peaks olema, palu
        superadminil end Adminid saki alt lisada.</p>
        <a className="btn-secondary admin-note-btn" href="/et">Tagasi äppi</a>
      </div>
    );
  }

  const visibleTabs = TABS.filter((t) => !t.superOnly || role === 'superadmin');

  return (
    <div className="admin">
      <header className="admin-header">
        <h1>I LAND SOUND · ADMIN</h1>
        <a href="/et" className="admin-exit">Ava äpp →</a>
      </header>

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

      {!data ? (
        <div className="admin-note">Laen andmeid…</div>
      ) : (
        <main className="admin-main">
          {tab === 'planner' && <AdminPlanner data={data} onChanged={refresh} />}
          {tab === 'perfs' && <AdminPerformances data={data} onChanged={refresh} />}
          {tab === 'artists' && <AdminArtists data={data} onChanged={refresh} />}
          {tab === 'stages' && <AdminStages data={data} onChanged={refresh} />}
          {tab === 'tags' && <AdminTags data={data} onChanged={refresh} />}
          {tab === 'info' && <AdminInfo data={data} onChanged={refresh} />}
          {tab === 'import' && <AdminImport data={data} onChanged={refresh} />}
          {tab === 'emails' && <AdminEmails />}
          {tab === 'event' && <AdminEvent data={data} onChanged={refresh} />}
          {tab === 'admins' && role === 'superadmin' && <AdminAdmins />}
        </main>
      )}
    </div>
  );
}
