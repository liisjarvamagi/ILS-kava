// Tabeliteksti parsimine impordi jaoks. Saab aru kolmest eraldajast:
// tabulaator (Excelist/Sheetsist kopeerimine), semikoolon (eesti
// Exceli CSV) ja koma (tavaline CSV). Jutumärkides väljad, ka
// mitmerealised, on toetatud. Puhas funktsioon ilma sõltuvusteta,
// et seda saaks eraldi testida.

export function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] || '';
  if (firstLine.includes('\t')) return '\t';
  const semis = (firstLine.match(/;/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  return semis >= commas ? ';' : ',';
}

// Tagastab { header: [veerunimed], rows: [[...], ...] }.
// Veerunimed viiakse väiketähtedele ja trimmitakse, tühjad read
// jäetakse vahele.
export function parseTable(text) {
  const delim = detectDelimiter(text);
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  const pushCell = () => { row.push(cell); cell = ''; };
  const pushRow = () => {
    if (row.length > 1 || (row.length === 1 && row[0].trim() !== '')) rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delim) {
      pushCell();
    } else if (ch === '\n') {
      pushCell(); pushRow();
    } else if (ch === '\r') {
      // ignoreeri, \n tuleb järgmisena
    } else {
      cell += ch;
    }
  }
  pushCell(); pushRow();

  if (!rows.length) return { header: [], rows: [] };
  const header = rows[0].map((h) => h.trim().toLowerCase());
  return { header, rows: rows.slice(1) };
}

// Rida objektiks veerunimede järgi: { paev: '...', ala: '...', ... }
export function rowToObject(header, row) {
  const obj = {};
  header.forEach((h, i) => { obj[h] = (row[i] ?? '').trim(); });
  return obj;
}

// jah/ei/true/1 → boolean
export function parseBool(value, fallback) {
  const v = (value || '').trim().toLowerCase();
  if (!v) return fallback;
  return ['jah', 'yes', 'true', '1', 'x'].includes(v);
}

// 'nimi1; nimi2' → ['nimi1', 'nimi2']
export function splitList(value) {
  return (value || '').split(';').map((s) => s.trim()).filter(Boolean);
}

// Kahe nime "kaugus" ehk mitu tähte tuleb muuta, et üks teiseks
// saada. Kasutame trükivigade püüdmiseks: kaugus 1–2 on tõenäoliselt
// sama nimi kirjaveaga.
export function editDistance(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase();
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > 2) return 99;
  const prev = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(
        prev[j] + 1,
        prev[j - 1] + 1,
        diag + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      diag = tmp;
    }
  }
  return prev[b.length];
}

// Leia nimekirjast kõige lähem sarnane nimi (kaugus max 2, ja nimi
// peab olema piisavalt pikk, et sarnasus midagi tähendaks).
export function closestName(name, candidates) {
  if (name.length < 4) return null;
  let best = null;
  for (const c of candidates) {
    const d = editDistance(name, c);
    if (d > 0 && d <= 2 && (!best || d < best.dist)) best = { name: c, dist: d };
  }
  return best;
}
