'use client';
// Esinejate leht nagu Brella/Lineup vaates: otsing, sortimine A–Z
// või päevade kaupa, südamega lemmikud ja Kõik ⇄ Minu lemmikud
// filter. Kõik töötab juba laetud kavaandmete peal, uusi päringuid
// ei tehta; lemmikud salvestuvad telefoni.
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { t } from '../lib/i18n';
import { perfArtists, festivalDays, dayTitle } from '../lib/schedule';
import { getFavArtists, toggleFavArtist } from '../lib/favArtists';
import { hasLocalSession } from '../lib/supabaseClient';
import SignInSheet from './SignInSheet';

// Esimesel lemmiku märkimisel kutsume sisse logima (nagu FEST äpis).
// "Äkki hiljem" järel enam ei tülita — valik jääb telefoni meelde.
const SIGNIN_SEEN_KEY = 'ils_signin_asked_v1';

function Heart({ on }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22"
      fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7.5-4.8-9.5-9C1 8.6 3 5.5 6.2 5.5c2 0 3.3 1 4.1 2.3.4.7 1 .7 1.4 0 .8-1.3 2.1-2.3 4.1-2.3 3.2 0 5.2 3.1 3.7 6.5-2 4.2-9.5 9-9.5 9z" />
    </svg>
  );
}

export default function ArtistDirectory({ data, locale, base }) {
  const tr = t(locale);
  const [query, setQuery] = useState('');
  const [byDay, setByDay] = useState(false);
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [favs, setFavs] = useState([]);
  const [pendingFav, setPendingFav] = useState(null); // esineja, kelle südant vajutati enne sisselogimiskutset

  useEffect(() => { setFavs(getFavArtists()); }, []);

  // Esinejad kavast, iga esineja küljes tema esinemispäevad ja
  // varaseim algusaeg (päevade kaupa sortimiseks).
  const artists = useMemo(() => {
    const map = new Map();
    for (const p of data.performances) {
      for (const a of perfArtists(p)) {
        if (!map.has(a.id)) map.set(a.id, { ...a, days: new Set(), firstStart: {} });
        const row = map.get(a.id);
        row.days.add(p.festival_day);
        const cur = row.firstStart[p.festival_day];
        if (!cur || new Date(p.start_at) < new Date(cur)) {
          row.firstStart[p.festival_day] = p.start_at;
        }
      }
    }
    return [...map.values()];
  }, [data]);

  function toggleFav(e, id) {
    e.preventDefault();
    // Esimesel korral näitame sisselogimiskutset; süda läheb kirja
    // alles pärast valikut ("Äkki hiljem" või sisselogimine).
    // Sisselogitud kasutajat ei tülitata.
    if (!favs.includes(id) && !hasLocalSession() && !localStorage.getItem(SIGNIN_SEEN_KEY)) {
      setPendingFav(id);
      return;
    }
    toggleFavArtist(id);
    setFavs(getFavArtists());
  }

  function signInLater() {
    localStorage.setItem(SIGNIN_SEEN_KEY, '1');
    if (pendingFav) {
      toggleFavArtist(pendingFav);
      setFavs(getFavArtists());
    }
    setPendingFav(null);
  }

  const q = query.trim().toLowerCase();
  const shown = artists.filter((a) => {
    if (q && !a.name.toLowerCase().includes(q)) return false;
    if (onlyFavs && !favs.includes(a.id)) return false;
    return true;
  });

  const row = (a) => (
    <Link key={a.id} href={`${base}/esineja/${a.slug}`} className="dir-row">
      {a.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.image_url} alt="" className="dir-photo" />
      ) : (
        <div className="dir-photo artist-photo-empty">🎵</div>
      )}
      <span className="dir-name">{a.name}</span>
      <button
        className={`dir-heart ${favs.includes(a.id) ? 'on' : ''}`}
        aria-label={favs.includes(a.id) ? tr.fav_remove : tr.fav_add}
        onClick={(e) => toggleFav(e, a.id)}
      >
        <Heart on={favs.includes(a.id)} />
      </button>
    </Link>
  );

  let body;
  if (shown.length === 0) {
    body = <div className="notice"><p>{tr.artists_empty}</p></div>;
  } else if (!byDay) {
    body = (
      <div className="dir-list">
        {shown.slice().sort((a, b) => a.name.localeCompare(b.name, locale)).map(row)}
      </div>
    );
  } else {
    const days = festivalDays(data.performances);
    body = days.map((d) => {
      const own = shown
        .filter((a) => a.days.has(d))
        .sort((a, b) => new Date(a.firstStart[d]) - new Date(b.firstStart[d]));
      if (!own.length) return null;
      return (
        <section key={d}>
          <div className="dir-day">{dayTitle(d, locale)}</div>
          <div className="dir-list">{own.map(row)}</div>
        </section>
      );
    });
  }

  return (
    <>
      <div className="dir-controls">
        <input
          className="sheet-search"
          type="search"
          placeholder={tr.artists_search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="dir-toggles">
          <div className="segmented">
            <button className={!byDay ? 'active' : ''} onClick={() => setByDay(false)}>
              {tr.sort_az}
            </button>
            <button className={byDay ? 'active' : ''} onClick={() => setByDay(true)}>
              {tr.sort_byday}
            </button>
          </div>
          <div className="segmented">
            <button className={!onlyFavs ? 'active' : ''} onClick={() => setOnlyFavs(false)}>
              {tr.fav_all}
            </button>
            <button className={onlyFavs ? 'active' : ''} onClick={() => setOnlyFavs(true)}>
              {tr.fav_mine}
            </button>
          </div>
        </div>
      </div>
      {body}

      {pendingFav && (
        <SignInSheet
          base={base}
          locale={locale}
          onLater={signInLater}
          onClose={() => setPendingFav(null)}
        />
      )}
    </>
  );
}
