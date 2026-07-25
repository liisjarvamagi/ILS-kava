'use client';
// Kalendrifaili (.ics) koostamine Sinu valikutest. Fail tehakse
// telefonis kohapeal ja avaneb kalendriäpis; serverisse ei saadeta
// midagi. Ajad on UTC kujul, kalender näitab neid õiges vööndis.

function icsTime(iso) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function esc(s) {
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

// events: [{ id, start_at, end_at, title, location }]
export function downloadIcs(events, filename = 'i-land-sound-minu-kava.ics') {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//I Land Sound//Kava//ET',
    'CALSCALE:GREGORIAN'
  ];
  for (const ev of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:ils-${ev.id}@ilandsound`,
      `DTSTART:${icsTime(ev.start_at)}`,
      `DTEND:${icsTime(ev.end_at)}`,
      `SUMMARY:${esc(ev.title)}`
    );
    if (ev.location) lines.push(`LOCATION:${esc(ev.location)}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
