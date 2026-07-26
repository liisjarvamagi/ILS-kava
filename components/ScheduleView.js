'use client';
// Kavavaade Brella eeskujul: päevanupud kuupäevadega, filtrinupud,
// mis avavad altpoolt valikulehe (Alad, Tagid, Esinejad), vaate
// seaded (nimekiri ⇄ ajajoon, suurendus, tihedus) ja kava ise.
// Andmed tulevad serverist ühe korraga; kõik filtrid töötavad
// kliendipoolselt ilma uute päringuteta ja jäävad telefoni meelde.
// Festivali ajal avaneb tänane päev, muul ajal esimene.
import { useEffect, useMemo, useState } from 'react';
import { t } from '../lib/i18n';
import {
  perfTitle, fmtTime, festivalDays, dayParts, dayTitle,
  todayFestivalDay, perfTags, perfArtists
} from '../lib/schedule';
import { getMyIds } from '../lib/mySchedule';
import ActCard from './ActCard';
import Timeline from './Timeline';
import FilterSheet from './FilterSheet';
import SettingsSheet from './SettingsSheet';
import { IconSettings } from './Icons';

// Filtrid on sündmusepõhised (igal festivalil oma valikud),
// vaate-eelistused (nimekiri/ajajoon, suurus) on üleüldised.
function keysFor(eventSlug) {
  const e = eventSlug || 'ils';
  return {
    stages: `ils_stage_filter_v1:${e}`,
    tags: `ils_tag_filter_v1:${e}`,
    artists: `ils_artist_filter_v1:${e}`,
    view: 'ils_view_v1',
    scale: 'ils_scale_v1',
    density: 'ils_density_v1'
  };
}

function readJson(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null');
    return v ?? fallback;
  } catch { return fallback; }
}

export default function ScheduleView({ stages, performances, locale, base, eventSlug }) {
  const KEYS = useMemo(() => keysFor(eventSlug), [eventSlug]);
  const tr = t(locale);
  const days = useMemo(() => festivalDays(performances), [performances]);
  const [day, setDay] = useState(days[0]);
  const [selStages, setSelStages] = useState([]);
  const [selTags, setSelTags] = useState([]);
  const [selArtists, setSelArtists] = useState([]);
  const [view, setView] = useState('list');
  const [scale, setScale] = useState(100);
  const [density, setDensity] = useState('detailed');
  const [myIds, setMyIds] = useState([]);
  const [sheet, setSheet] = useState(null); // 'stages' | 'tags' | 'artists' | 'settings' | null

  // Salvestatud valikud ja tänane päev loetakse alles brauseris,
  // sest serveris localStorage'i pole ja kellaaeg oleks serveri oma.
  useEffect(() => {
    setSelStages(readJson(KEYS.stages, []));
    setSelTags(readJson(KEYS.tags, []));
    setSelArtists(readJson(KEYS.artists, []));
    const v = localStorage.getItem(KEYS.view);
    if (v === 'timeline') setView('timeline');
    const sc = Number(localStorage.getItem(KEYS.scale));
    if ([75, 100, 125, 150].includes(sc)) setScale(sc);
    const dn = localStorage.getItem(KEYS.density);
    if (dn === 'compact') setDensity(dn);
    setMyIds(getMyIds());
    const today = todayFestivalDay(days);
    if (today) setDay(today);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshMy = () => setMyIds(getMyIds());

  // Valikulehtede valikud kavast endast: näitame ainult seda,
  // mis andmetes päriselt olemas on.
  const tagOptions = useMemo(() => {
    const map = new Map();
    performances.forEach((p) => perfTags(p).forEach((tag) => map.set(tag.id, tag)));
    const name = (tag) => (locale === 'en' ? tag.name_en : tag.name_et);
    return [...map.values()]
      .map((tag) => ({ id: tag.id, label: name(tag) }))
      .sort((a, b) => a.label.localeCompare(b.label, locale));
  }, [performances, locale]);

  const artistOptions = useMemo(() => {
    const map = new Map();
    performances.forEach((p) => perfArtists(p).forEach((a) => map.set(a.id, a)));
    return [...map.values()]
      .map((a) => ({ id: a.id, label: a.name }))
      .sort((a, b) => a.label.localeCompare(b.label, locale));
  }, [performances, locale]);

  const stageOptions = stages.map((s) => ({
    id: s.id,
    label: locale === 'en' ? s.name_en : s.name_et,
    color: s.color
  }));

  function save(key, value, setter) {
    setter(value);
    localStorage.setItem(key, JSON.stringify(value));
  }
  function clearFilters() {
    save(KEYS.stages, [], setSelStages);
    save(KEYS.tags, [], setSelTags);
    save(KEYS.artists, [], setSelArtists);
  }
  function changeSettings(patch) {
    if (patch.view) { setView(patch.view); localStorage.setItem(KEYS.view, patch.view); }
    if (patch.scale) { setScale(patch.scale); localStorage.setItem(KEYS.scale, String(patch.scale)); }
    if (patch.density) { setDensity(patch.density); localStorage.setItem(KEYS.density, patch.density); }
  }

  const anyFilter = selStages.length + selTags.length + selArtists.length > 0;

  const matches = (p) => {
    if (selTags.length && !perfTags(p).some((tag) => selTags.includes(tag.id))) return false;
    if (selArtists.length && !perfArtists(p).some((a) => selArtists.includes(a.id))) return false;
    return true;
  };

  const dayPerfs = performances.filter((p) => p.festival_day === day && matches(p));
  const visibleStages = stages.filter((s) => {
    if (selStages.length && !selStages.includes(s.id)) return false;
    return dayPerfs.some((p) => p.stage_id === s.id);
  });
  const visiblePerfs = dayPerfs.filter((p) => visibleStages.some((s) => s.id === p.stage_id));

  // Punkt päevanupul: sel päeval on Sinu kavas midagi.
  const dayHasMine = (d) =>
    performances.some((p) => p.festival_day === d && myIds.includes(p.id));

  return (
    <>
      <div className="day-pills">
        {days.map((d) => {
          const parts = dayParts(d, locale);
          return (
            <button
              key={d}
              className={`day-pill ${d === day ? 'active' : ''}`}
              onClick={() => setDay(d)}
            >
              <span className="day-pill-week">{parts.week}</span>
              <span className="day-pill-day">{parts.day}</span>
              {dayHasMine(d) && <span className="day-pill-dot" />}
            </button>
          );
        })}
      </div>

      <div className="toolbar">
        <h2 className="toolbar-title">{dayTitle(day, locale)}</h2>
        <button
          className="icon-btn"
          aria-label={tr.settings_title}
          onClick={() => setSheet('settings')}
        >
          <IconSettings />
        </button>
      </div>

      <div className="filters">
        {anyFilter && (
          <button className="chip chip-clear" onClick={clearFilters}>
            ✕ {tr.filter_clear}
          </button>
        )}
        <button
          className={`chip ${selStages.length ? 'chip-on' : ''}`}
          onClick={() => setSheet('stages')}
        >
          {tr.filter_stages} ▾
          {selStages.length > 0 && <span className="chip-badge">{selStages.length}</span>}
        </button>
        {tagOptions.length > 0 && (
          <button
            className={`chip ${selTags.length ? 'chip-on' : ''}`}
            onClick={() => setSheet('tags')}
          >
            {tr.filter_tags} ▾
            {selTags.length > 0 && <span className="chip-badge">{selTags.length}</span>}
          </button>
        )}
        {artistOptions.length > 0 && (
          <button
            className={`chip ${selArtists.length ? 'chip-on' : ''}`}
            onClick={() => setSheet('artists')}
          >
            {tr.filter_artists} ▾
            {selArtists.length > 0 && <span className="chip-badge">{selArtists.length}</span>}
          </button>
        )}
      </div>

      {view === 'timeline' ? (
        <Timeline
          base={base}
          stages={visibleStages}
          perfs={visiblePerfs}
          locale={locale}
          scale={scale}
          density={density}
          onMyChange={refreshMy}
        />
      ) : (
        visibleStages.map((s) => {
          const acts = dayPerfs
            .filter((p) => p.stage_id === s.id)
            .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));
          return (
            <section key={s.id} className="stage-block">
              <div className="stage-header">
                <span className="stage-dot" style={{ background: s.color }} />
                <span className="stage-name">{locale === 'en' ? s.name_en : s.name_et}</span>
              </div>
              <div className="stage-slots">
                {acts.map((p) => (
                  <ActCard
                    base={base}
                    key={p.id}
                    perf={p}
                    title={perfTitle(p, locale)}
                    timeLabel={`${fmtTime(p.start_at)} – ${fmtTime(p.end_at)}${p.is_background ? ` · ${tr.background_all_day}` : ''}`}
                    color={s.color}
                    locale={locale}
                    onChange={refreshMy}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}

      {sheet === 'stages' && (
        <FilterSheet
          title={tr.filter_stages}
          options={stageOptions}
          selected={selStages}
          onApply={(ids) => save(KEYS.stages, ids, setSelStages)}
          onClose={() => setSheet(null)}
          locale={locale}
        />
      )}
      {sheet === 'tags' && (
        <FilterSheet
          title={tr.filter_tags}
          options={tagOptions}
          selected={selTags}
          onApply={(ids) => save(KEYS.tags, ids, setSelTags)}
          onClose={() => setSheet(null)}
          locale={locale}
        />
      )}
      {sheet === 'artists' && (
        <FilterSheet
          title={tr.filter_artists}
          options={artistOptions}
          selected={selArtists}
          onApply={(ids) => save(KEYS.artists, ids, setSelArtists)}
          onClose={() => setSheet(null)}
          locale={locale}
        />
      )}
      {sheet === 'settings' && (
        <SettingsSheet
          view={view}
          scale={scale}
          density={density}
          onChange={changeSettings}
          onClose={() => setSheet(null)}
          locale={locale}
        />
      )}
    </>
  );
}
