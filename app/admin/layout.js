// Adminipaneeli raam. Admin on eestikeelne (kasutavad ainult
// korraldajad) ja ilma avaliku äpi alt-menüüta.
import '../globals.css';

export const metadata = {
  title: 'I Land Sound — Admin',
  robots: { index: false, follow: false } // otsimootoritele mitte
};

export default function AdminLayout({ children }) {
  return (
    <html lang="et">
      <body className="admin-body">{children}</body>
    </html>
  );
}
