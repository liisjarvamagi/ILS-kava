// Kava andmete lugemine. Iga leht kutsub seda serveris,
// tulemus cache'itakse (vt revalidate lehtedel), et andmebaasi
// ei koormataks festivali tipptunnil. Kõik vaated (kava, detailid,
// esineja ja ala lehed) töötavad sellesama ühe andmestiku peal,
// nii et andmebaasi läheb ainult üks päring.
import { getSupabase, supabaseAvailable } from './supabase';

export async function loadSchedule() {
  if (!supabaseAvailable()) return null;
  const supabase = getSupabase();

  const [stagesRes, perfRes, infoRes] = await Promise.all([
    supabase.from('stages')
      .select('id, slug, name_et, name_en, descr_et, descr_en, color, sort_order, lat, lng, map_x, map_y')
      .eq('is_active', true)
      .order('sort_order'),
    supabase.from('performances')
      .select(`
        id, stage_id, festival_day, start_at, end_at,
        title_et, title_en, descr_et, descr_en, is_background,
        performance_artists ( sort_order, artists ( id, slug, name, country, bio_et, bio_en, image_url, links, track_file_url, track_link, track_title ) ),
        performance_tags ( tags ( id, slug, name_et, name_en ) )
      `)
      .eq('is_published', true)
      .order('start_at'),
    supabase.from('event_info')
      .select('id, icon, title_et, title_en, body_et, body_en, sort_order')
      .eq('is_active', true)
      .order('sort_order')
  ]);

  if (stagesRes.error || perfRes.error) {
    console.error('Kava laadimine ebaõnnestus', stagesRes.error || perfRes.error);
    return null;
  }
  // Oluline info on valikuline: kui tabelit pole veel loodud
  // (migratsioon 0002 käivitamata), näitame lehte lihtsalt ilma.
  const info = infoRes.error ? [] : infoRes.data;
  return { stages: stagesRes.data, performances: perfRes.data, info };
}

// Kas alal on koht festivalikaardil (protsendid pildi suurusest).
export function stageMapPoint(stage) {
  const x = Number(stage?.map_x);
  const y = Number(stage?.map_y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

// Kas alal on päris GPS-koordinaadid kaardi ja juhiste jaoks.
export function stageCoords(stage) {
  const lat = Number(stage?.lat);
  const lng = Number(stage?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

// ── Turvaline parameetrikontroll ──
// Slug tohib sisaldada ainult väiketähti, numbreid ja sidekriipse;
// id peab olema UUID kujuga. Kõik muu saab 404, mitte päringut.
export function isValidSlug(slug) {
  return typeof slug === 'string' && /^[a-z0-9-]{1,64}$/.test(slug);
}
export function isValidId(id) {
  return typeof id === 'string' && /^[0-9a-f-]{8,40}$/i.test(id);
}

// ── Leidjad ühe cache'itud andmestiku pealt ──
export function findPerformance(data, id) {
  return data?.performances.find((p) => String(p.id) === id) || null;
}
export function findStage(data, slug) {
  return data?.stages.find((s) => s.slug === slug) || null;
}
// Esineja + kõik tema esinemised.
export function findArtist(data, slug) {
  if (!data) return null;
  let artist = null;
  const performances = [];
  for (const p of data.performances) {
    for (const pa of p.performance_artists || []) {
      if (pa.artists?.slug === slug) {
        artist = artist || pa.artists;
        performances.push(p);
      }
    }
  }
  return artist ? { artist, performances } : null;
}
export function perfArtists(perf) {
  return (perf.performance_artists || [])
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((pa) => pa.artists)
    .filter(Boolean);
}
export function perfTags(perf) {
  return (perf.performance_tags || []).map((pt) => pt.tags).filter(Boolean);
}

// Esinemise pealkiri: kas käsitsi pealkiri või esinejate nimed.
export function perfTitle(perf, locale) {
  const manual = locale === 'en' ? (perf.title_en || perf.title_et) : (perf.title_et || perf.title_en);
  if (manual) return manual;
  const names = perfArtists(perf).map((a) => a.name);
  return names.join(', ') || '—';
}

export function perfDescr(perf, locale) {
  return locale === 'en' ? (perf.descr_en || perf.descr_et) : (perf.descr_et || perf.descr_en);
}

export function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('et-EE', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Tallinn'
  });
}

// Festivalipäevad andmetest, õiges järjekorras.
export function festivalDays(performances) {
  return [...new Set(performances.map((p) => p.festival_day))].sort();
}

// Tänane festivalipäev, kui festival parasjagu käib. Kell 00.00–06.00
// kuulub öö veel eelmise õhtu programmi alla, sest keegi ei otsi kell
// kaks öösel "homset" kava. Kui tänast päeva kavas pole, tagastab null.
export function todayFestivalDay(days) {
  const shifted = new Date(Date.now() - 6 * 60 * 60 * 1000);
  // 'sv-SE' annab kuupäeva kujul AAAA-KK-PP, sama kuju mis andmebaasis
  const today = shifted.toLocaleDateString('sv-SE', { timeZone: 'Europe/Tallinn' });
  return days.includes(today) ? today : null;
}

export function dayLabel(dateStr, locale) {
  const d = new Date(dateStr + 'T12:00:00');
  const week = d.toLocaleDateString(locale === 'en' ? 'en-GB' : 'et-EE', {
    weekday: 'short', timeZone: 'Europe/Tallinn'
  });
  const dm = d.toLocaleDateString('et-EE', {
    day: '2-digit', month: '2-digit', timeZone: 'Europe/Tallinn'
  });
  return `${week} ${dm}`;
}

// Lühem silt päevanupule: "N" ja "16" eraldi ridadel nagu Brellas.
export function dayParts(dateStr, locale) {
  const d = new Date(dateStr + 'T12:00:00');
  const week = d.toLocaleDateString(locale === 'en' ? 'en-GB' : 'et-EE', {
    weekday: 'short', timeZone: 'Europe/Tallinn'
  });
  const day = d.toLocaleDateString('et-EE', { day: 'numeric', timeZone: 'Europe/Tallinn' });
  return { week, day };
}

// Pikk pealkiri filtririba kohale: "Neljapäev, 16. juuli"
export function dayTitle(dateStr, locale) {
  const d = new Date(dateStr + 'T12:00:00');
  const s = d.toLocaleDateString(locale === 'en' ? 'en-GB' : 'et-EE', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Tallinn'
  });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
