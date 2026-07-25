// Keele-kiht: /et/... ja /en/... Tundmatu keel annab 404.
import { notFound } from 'next/navigation';
import { locales } from '../../lib/i18n';
import BottomNav from '../../components/BottomNav';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({ children, params }) {
  if (!locales.includes(params.locale)) notFound();
  return (
    <html lang={params.locale}>
      <body>
        {children}
        <BottomNav locale={params.locale} />
      </body>
    </html>
  );
}
