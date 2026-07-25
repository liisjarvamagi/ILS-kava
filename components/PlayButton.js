'use client';
// Play nupp esineja lehel + minimängija riba nagu FEST äpis.
// Kaks režiimi:
//   1) track_file_url (mp3 otselink) → lugu mängib kohe äpi sees ja
//      alla ilmub riba: esineja pilt, nimi, loo pealkiri, paus, stopp
//   2) track_link (Spotify/SoundCloud/YouTube) → avaneb platvormi
//      mängija äpi allservas
// Cyber security: lubame ainult https lingid ja ainult teadaolevad
// muusikaplatvormid; kõike muud lihtsalt ei mängita.
import { useEffect, useRef, useState } from 'react';
import { t } from '../lib/i18n';

function safeHttps(url) {
  try { return new URL(url).protocol === 'https:'; } catch { return false; }
}

// Platvormi lingist äpi-sisese mängija aadress.
function embedFor(link) {
  let u;
  try { u = new URL(link); } catch { return null; }
  if (u.protocol !== 'https:') return null;
  const host = u.hostname.replace(/^www\./, '');
  if (host === 'open.spotify.com') {
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length >= 2 && /^[A-Za-z0-9]+$/.test(parts[1])) {
      return { src: `https://open.spotify.com/embed/${parts[0]}/${parts[1]}`, h: 152 };
    }
  }
  if (host === 'soundcloud.com' || host === 'on.soundcloud.com') {
    return {
      src: 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(link) +
        '&color=%23e8c264&auto_play=true&show_teaser=false',
      h: 166
    };
  }
  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
    const id = u.searchParams.get('v');
    if (id && /^[\w-]{5,20}$/.test(id)) {
      return { src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`, h: 220 };
    }
  }
  if (host === 'youtu.be') {
    const id = u.pathname.slice(1);
    if (/^[\w-]{5,20}$/.test(id)) {
      return { src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`, h: 220 };
    }
  }
  return null;
}

function IconPlay({ size = 26 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5z" />
    </svg>
  );
}
function IconPause({ size = 26 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
function IconStop({ size = 20 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

export default function PlayButton({ fileUrl, link, name, imageUrl, trackTitle, locale }) {
  const tr = t(locale);
  const audioRef = useRef(null);
  const [started, setStarted] = useState(false); // minimängija riba nähtav
  const [playing, setPlaying] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);

  const file = fileUrl && safeHttps(fileUrl) ? fileUrl : null;
  const embed = !file && link ? embedFor(link) : null;

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  if (!file && !embed) return null;

  function togglePlay() {
    if (!file) { setShowEmbed(true); return; }
    if (!audioRef.current) {
      audioRef.current = new Audio(file);
      audioRef.current.addEventListener('ended', () => setPlaying(false));
      audioRef.current.addEventListener('error', () => setPlaying(false));
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => setPlaying(false));
      setStarted(true);
      setPlaying(true);
    }
  }

  function stop() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlaying(false);
    setStarted(false);
  }

  return (
    <>
      <button
        className="play-btn"
        aria-label={playing ? tr.pause_track : tr.play_track}
        onClick={togglePlay}
      >
        {playing ? <IconPause /> : <IconPlay />}
      </button>

      {started && file && (
        <div className="mini-player" role="region" aria-label={name}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="mini-player-photo" />
          ) : (
            <div className="mini-player-photo artist-photo-empty">🎵</div>
          )}
          <div className="mini-player-info">
            <div className="mini-player-name">{name}</div>
            <div className="mini-player-track">{trackTitle || tr.play_track}</div>
          </div>
          <button
            className="mini-player-btn"
            aria-label={playing ? tr.pause_track : tr.play_track}
            onClick={togglePlay}
          >
            {playing ? <IconPause size={20} /> : <IconPlay size={20} />}
          </button>
          <button className="mini-player-btn" aria-label={tr.listen_close} onClick={stop}>
            <IconStop />
          </button>
        </div>
      )}

      {showEmbed && embed && (
        <div className="player-sheet" role="dialog" aria-label={name}>
          <div className="player-sheet-top">
            <span className="player-sheet-name">{name}</span>
            <button className="player-close" onClick={() => setShowEmbed(false)}>
              ✕ {tr.listen_close}
            </button>
          </div>
          <iframe
            src={embed.src}
            style={{ height: embed.h }}
            className="player-embed"
            allow="autoplay; encrypted-media"
            loading="lazy"
            title={name}
          />
        </div>
      )}
    </>
  );
}
