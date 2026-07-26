// 404 leht: tundmatu aadress, slug või id maandub siia.
import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="et">
      <body>
        <div className="notice" style={{ marginTop: 60 }}>
          <h2>Seda lehte ei leitud · Page not found</h2>
          <p>
            <Link href="/" style={{ color: 'var(--accent)', fontWeight: 700 }}>
              Tagasi kavva · Back to schedule →
            </Link>
          </p>
        </div>
      </body>
    </html>
  );
}
