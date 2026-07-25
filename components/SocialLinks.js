// Esineja sotsiaalmeedia ja muusikaplatvormide ikoonirida nagu
// Brella "About" osas. Lingid tulevad artists.links väljalt
// (jsonb, nt {"instagram": "https://...", "spotify": "https://..."}).
// Näitame ainult https linke; tundmatu võti saab maakera ikooni.

const ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 8h2.5V4.5H14A4.5 4.5 0 0 0 9.5 9v2.5H7V15h2.5v5.5H13V15h2.5l.5-3.5h-3V9a1 1 0 0 1 1-1z" />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 10.2c2.8-.8 5.6-.5 8 .8M8.4 13c2.3-.6 4.5-.3 6.5.8M9 15.6c1.8-.4 3.4-.2 4.9.6" />
    </svg>
  ),
  soundcloud: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M4 15v2M6.5 13.5V17M9 12v5M11.5 10.5V17M14 9v8M16.5 9.5a4 4 0 1 1 1.5 7.7H14" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <rect x="3" y="6.5" width="18" height="11" rx="3" />
      <path d="M10.5 10l4 2-4 2z" fill="currentColor" stroke="none" />
    </svg>
  ),
  bandcamp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d="M4 16.5 9.5 7.5H20l-5.5 9z" />
    </svg>
  ),
  website: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.3 3.8 5.2 3.8 8.5s-1.3 6.2-3.8 8.5c-2.5-2.3-3.8-5.2-3.8-8.5s1.3-6.2 3.8-8.5z" />
    </svg>
  )
};

const ORDER = ['instagram', 'facebook', 'spotify', 'soundcloud', 'youtube', 'bandcamp', 'website'];

function isHttps(url) {
  try { return new URL(url).protocol === 'https:'; } catch { return false; }
}

export default function SocialLinks({ links }) {
  if (!links || typeof links !== 'object') return null;
  const keys = Object.keys(links).filter((k) => isHttps(links[k]));
  if (!keys.length) return null;
  keys.sort((a, b) => {
    const ia = ORDER.indexOf(a); const ib = ORDER.indexOf(b);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  return (
    <div className="social-row">
      {keys.map((k) => (
        <a
          key={k}
          className="social-icon"
          href={links[k]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={k}
        >
          {ICONS[k] || ICONS.website}
        </a>
      ))}
    </div>
  );
}
