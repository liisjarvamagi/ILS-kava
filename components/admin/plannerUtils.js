// Planeerija puhas ajaloogika, ilma ekraanita — nii saab seda
// eraldi testida ja lohistamise kood jääb lihtsamaks.

export const PX_PER_MIN = 1.6;   // 1 tund = 96 px
export const ROW_H = 60;         // ühe ala rea kõrgus px
export const SNAP_MIN = 5;       // lohistades ümardub aeg 5 min sammuga
export const MIN_DURATION = 15;  // lühim lubatud esinemine minutites

export function snap(minutes, step = SNAP_MIN) {
  return Math.round(minutes / step) * step;
}

// Päeva ajatelg: tund enne esimest ja tund pärast viimast esinemist.
// Tühi päev saab vaikimisi telje 12.00 → 02.00 (järgmisel ööl).
export function computeAxis(dayPerfs, festivalDay) {
  if (!dayPerfs.length) {
    const start = new Date(`${festivalDay}T12:00:00+03:00`).getTime();
    return { startMs: start, endMs: start + 14 * 3600000 };
  }
  const min = Math.min(...dayPerfs.map((p) => +new Date(p.start_at)));
  const max = Math.max(...dayPerfs.map((p) => +new Date(p.end_at)));
  return {
    startMs: Math.floor(min / 3600000) * 3600000 - 3600000,
    endMs: Math.ceil(max / 3600000) * 3600000 + 3600000
  };
}

export function msToX(ms, startMs) {
  return ((ms - startMs) / 60000) * PX_PER_MIN;
}

export function xToMinutes(x) {
  return x / PX_PER_MIN;
}

// Kas kaks ajavahemikku lõikuvad
export function intersects(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

// Leia esinemise kattuvused samal alal (draft = lohistatav plokk
// oma uute aegadega)
export function findClashes(draft, allPerfs) {
  return allPerfs.filter((p) =>
    p.id !== draft.id &&
    p.stage_id === draft.stage_id &&
    intersects(
      +new Date(draft.start_at), +new Date(draft.end_at),
      +new Date(p.start_at), +new Date(p.end_at)
    )
  );
}

// Lohistamise tulemus: esialgsed ajad + nihe minutites → uued ISO ajad
export function shiftTimes(startIso, endIso, deltaMin) {
  return {
    start_at: new Date(+new Date(startIso) + deltaMin * 60000).toISOString(),
    end_at: new Date(+new Date(endIso) + deltaMin * 60000).toISOString()
  };
}

// Venitamise tulemus: lõpp muutub, aga mitte alla miinimumi
export function resizeEnd(startIso, endIso, deltaMin) {
  const start = +new Date(startIso);
  let end = +new Date(endIso) + deltaMin * 60000;
  if (end - start < MIN_DURATION * 60000) end = start + MIN_DURATION * 60000;
  return { start_at: new Date(start).toISOString(), end_at: new Date(end).toISOString() };
}

export function fmtHM(ms) {
  return new Date(ms).toLocaleTimeString('et-EE', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Tallinn'
  });
}
