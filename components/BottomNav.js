'use client';
// Alt-menüü: Kava · Esinejad · Kaart · Minu kava · Profiil.
// Pöidlaga ulatuv, aktiivne leht märgitud.
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { t } from '../lib/i18n';
import { IconSchedule, IconArtists, IconMap, IconBookmarkNav, IconProfile } from './Icons';

export default function BottomNav({ locale, base }) {
  const path = usePathname();
  const tr = t(locale);
  const items = [
    { href: base, label: tr.nav_schedule, icon: <IconSchedule />, exact: true },
    {
      href: `${base}/esinejad`,
      label: tr.nav_artists,
      icon: <IconArtists />,
      // ka üksiku esineja leht kuulub selle saki alla
      also: [`${base}/esineja/`]
    },
    { href: `${base}/kaart`, label: tr.nav_map, icon: <IconMap /> },
    { href: `${base}/minu-kava`, label: tr.nav_mine, icon: <IconBookmarkNav /> },
    { href: `${base}/profiil`, label: tr.nav_profile, icon: <IconProfile /> }
  ];
  return (
    <nav className="bottom-nav">
      {items.map((it) => {
        const active = it.exact
          ? path === it.href
          : path.startsWith(it.href) || (it.also || []).some((p) => path.startsWith(p));
        return (
          <Link key={it.href} href={it.href} className={active ? 'active' : ''}>
            {it.icon}
            <span>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
