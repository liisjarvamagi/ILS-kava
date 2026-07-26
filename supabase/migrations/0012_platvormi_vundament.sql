-- ============================================================
-- 0012: PLATVORMI VUNDAMENT (tükk A)
-- Äpist saab mitme korraldaja platvorm. See migratsioon:
--   1) loob platvormi tabelid (korraldajad, sündmused, adminid,
--      kaardid, hommikukirja tellimused)
--   2) annab igale sisureale sündmuse (event_id)
--   3) kolib ILS-i olemasolevad andmed esimeseks sündmuseks
--   4) ehitab turvareeglid (RLS) ümber sündmusepõhiseks:
--      korraldaja näeb ja muudab AINULT oma sündmust
--
-- OLULINE ÜLEMINEKU KOHTA: vanad tabelid (admins, event_settings)
-- ja profiles vanad veerud jäävad esialgu alles, et praegu töötav
-- äpp edasi töötaks. Uued sisuread saavad event_id vaikimisi
-- väärtusena ILS-i sündmuse — nii töötavad ka vanad admini vormid.
-- Vana kraam koristatakse tükis B, kui kood on uuele üle läinud.
-- ============================================================

-- ------------------------------------------------------------
-- 1. UUED TABELID
-- ------------------------------------------------------------

create table organizations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  reg_code      text not null unique,
  contact_name  text not null,
  contact_email text not null,
  contact_phone text,
  website       text,
  status        text not null default 'ootel'
                  check (status in ('ootel','kinnitatud','tagasi_lykatud')),
  notes         text,
  created_by    uuid references auth.users(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table events (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete restrict,
  slug            text not null unique
                    check (slug ~ '^[a-z0-9][a-z0-9-]{1,60}$'
                      and slug not in ('admin','api','et','en','kava','kaart',
                        'esinejad','esineja','esinemine','ala','profiil',
                        'minu-kava','korraldajale','platvorm','www','app')),
  name            text not null,
  starts_on       date not null,
  ends_on         date not null,
  cover_image_url text,
  tickets_url     text,
  rules_url       text,
  is_public       boolean not null default false, -- korraldaja lüliti
  is_active       boolean not null default false, -- platvormi omaniku lüliti
  plan            text not null default 'proov'
                    check (plan in ('proov','yks_syndmus','aastaringne')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint event_ends_after_start check (ends_on >= starts_on)
);

create table event_admins (
  event_id   uuid not null references events(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  role       text not null default 'admin'
               check (role in ('peakasutaja','admin')),
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);
create index idx_event_admins_user on event_admins(user_id);

create table platform_admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table event_maps (
  id         uuid primary key default gen_random_uuid(),
  event_id   uuid not null references events(id) on delete cascade,
  title_et   text not null,
  title_en   text not null,
  image_url  text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_event_maps_event on event_maps(event_id);

create table event_email_prefs (
  user_id   uuid not null references auth.users(id) on delete cascade,
  event_id  uuid not null references events(id) on delete cascade,
  send_hour int check (send_hour between 0 and 23), -- null = sündmuse vaikimisi
  last_sent date,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);
create index idx_email_prefs_event on event_email_prefs(event_id);

-- Muutmise ajatempel ka uutele tabelitele (funktsioon on 0010-st)
create trigger trg_updated_at before update on organizations
  for each row execute function set_updated_at();
create trigger trg_updated_at before update on events
  for each row execute function set_updated_at();
create trigger trg_updated_at before update on event_maps
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- 2. ABIFUNKTSIOONID (turvareeglite selgroog)
-- ------------------------------------------------------------

create or replace function is_platform_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from platform_admins where user_id = auth.uid());
$$;

create or replace function is_event_admin(eid uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from event_admins
    where user_id = auth.uid() and event_id = eid
  ) or is_platform_admin();
$$;

-- Kas sündmus on avalikult elus (korraldaja JA platvormi omanik
-- on mõlemad "jah" öelnud)
create or replace function event_is_live(eid uuid)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from events
    where id = eid and is_public = true and is_active = true
  );
$$;

-- ÜLEMINEK: vana is_admin() tähendab nüüd "on mõne sündmuse admin
-- või platvormi omanik" — nii töötavad vanad reeglid ja vana kood
-- edasi, kuni tükk B koodi üle viib.
create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from event_admins where user_id = auth.uid())
      or is_platform_admin();
$$;

create or replace function is_superadmin()
returns boolean language sql stable security definer set search_path = public
as $$
  select is_platform_admin();
$$;

-- ------------------------------------------------------------
-- 3. SISUTABELID SAAVAD SÜNDMUSE KÜLGE
-- ------------------------------------------------------------

alter table stages          add column event_id uuid references events(id) on delete cascade;
alter table artists         add column event_id uuid references events(id) on delete cascade;
alter table tags            add column event_id uuid references events(id) on delete cascade;
alter table performances    add column event_id uuid references events(id) on delete cascade;
alter table event_info      add column event_id uuid references events(id) on delete cascade;
alter table email_templates add column event_id uuid references events(id) on delete cascade;

-- Ala punkt kuulub edaspidi konkreetsele kaardipildile
alter table stages add column map_id uuid references event_maps(id) on delete set null;

-- ------------------------------------------------------------
-- 4. ILS-i ANDMETE KOLIMINE ESIMESEKS SÜNDMUSEKS
-- ------------------------------------------------------------

do $$
declare
  v_org uuid;
  v_ev  uuid;
  v_map uuid;
  v_starts date := '2026-07-16';
  v_ends   date := '2026-07-19';
  v_cover  text := null;
  v_tickets text := null;
  v_rules  text := null;
  t record;
begin
  -- Kuupäevad ja lingid senisest event_settings tabelist, kui on
  begin
    select starts_on, ends_on, cover_image_url, tickets_url, rules_url
      into v_starts, v_ends, v_cover, v_tickets, v_rules
      from event_settings where id = 1;
  exception when undefined_table then
    null; -- pole hullu, kasutame vaikimisi väärtusi
  end;

  insert into organizations (name, reg_code, contact_name, contact_email, status, notes)
  values ('I Land Sound', 'ILS-ALGNE', 'Liis', 'liisingalt@gmail.com',
          'kinnitatud', 'Platvormi esimene sündmus, loodud migratsiooniga')
  returning id into v_org;

  insert into events (organization_id, slug, name, starts_on, ends_on,
                      cover_image_url, tickets_url, rules_url,
                      is_public, is_active, plan)
  values (v_org, 'ils-2026', 'I Land Sound 2026', v_starts, v_ends,
          v_cover, v_tickets, v_rules, true, true, 'proov')
  returning id into v_ev;

  -- Kogu sisu ILS-i sündmuse alla
  update stages          set event_id = v_ev where event_id is null;
  update artists         set event_id = v_ev where event_id is null;
  update tags            set event_id = v_ev where event_id is null;
  update performances    set event_id = v_ev where event_id is null;
  update event_info      set event_id = v_ev where event_id is null;
  update email_templates set event_id = v_ev where event_id is null;

  -- Kaardipildid (praegused äpi failid; korraldaja üleslaadimine
  -- tuleb tükis D, siis kolivad pildid Storage'i)
  insert into event_maps (event_id, title_et, title_en, image_url, sort_order)
  values (v_ev, 'Festival', 'Festival', '/kaardid/festival.png', 0)
  returning id into v_map;
  insert into event_maps (event_id, title_et, title_en, image_url, sort_order) values
    (v_ev, 'Orissaare', 'Orissaare', '/kaardid/orissaare.png', 1),
    (v_ev, 'Toiduala', 'Food area', '/kaardid/toiduala.png', 2),
    (v_ev, 'Glämping', 'Glamping', '/kaardid/glamping.png', 3);
  -- Alade punktid kehtivad festivalikaardil
  update stages set map_id = v_map where map_x is not null;

  -- Adminid: senised adminid → selle sündmuse adminid;
  -- superadmin → sündmuse peakasutaja JA platvormi omanik
  begin
    for t in select user_id, role from admins loop
      insert into event_admins (event_id, user_id, role)
      values (v_ev, t.user_id,
              case when t.role = 'superadmin' then 'peakasutaja' else 'admin' end)
      on conflict do nothing;
      if t.role = 'superadmin' then
        insert into platform_admins (user_id) values (t.user_id)
        on conflict do nothing;
      end if;
    end loop;
  exception when undefined_table then
    null;
  end;

  -- Hommikukirja tellijad → sündmusepõhine tellimus (keegi ei pea
  -- uuesti tellima)
  insert into event_email_prefs (user_id, event_id, send_hour, last_sent)
  select id, v_ev, daily_email_hour, last_daily_sent
    from profiles where wants_daily_email = true
  on conflict do nothing;

  -- ÜLEMINEK: uued sisuread saavad vaikimisi ILS-i sündmuse, et
  -- praegused admini vormid (mis event_id-st veel ei tea) töötaksid.
  -- Tükk B eemaldab vaikimisi väärtused.
  execute format('alter table stages          alter column event_id set default %L', v_ev);
  execute format('alter table artists         alter column event_id set default %L', v_ev);
  execute format('alter table tags            alter column event_id set default %L', v_ev);
  execute format('alter table performances    alter column event_id set default %L', v_ev);
  execute format('alter table event_info      alter column event_id set default %L', v_ev);
  execute format('alter table email_templates alter column event_id set default %L', v_ev);
end $$;

-- Nüüd, kus kõik read on sündmuse küljes, muutub see kohustuslikuks
alter table stages          alter column event_id set not null;
alter table artists         alter column event_id set not null;
alter table tags            alter column event_id set not null;
alter table performances    alter column event_id set not null;
alter table event_info      alter column event_id set not null;
alter table email_templates alter column event_id set not null;

create index idx_stages_event   on stages(event_id);
create index idx_artists_event  on artists(event_id);
create index idx_tags_event     on tags(event_id);
create index idx_perf_event_day on performances(event_id, festival_day);
create index idx_info_event     on event_info(event_id);
create index idx_tpl_event      on email_templates(event_id);

-- Aadressinimed on edaspidi unikaalsed SÜNDMUSE piires, mitte
-- üle platvormi — kahel festivalil võib olla oma "Emalava"
alter table stages          drop constraint if exists stages_slug_key;
alter table artists         drop constraint if exists artists_slug_key;
alter table tags            drop constraint if exists tags_slug_key;
alter table email_templates drop constraint if exists email_templates_key_key;
alter table stages          add constraint stages_event_slug_key  unique (event_id, slug);
alter table artists         add constraint artists_event_slug_key unique (event_id, slug);
alter table tags            add constraint tags_event_slug_key    unique (event_id, slug);
alter table email_templates add constraint tpl_event_key_key      unique (event_id, key);

-- ------------------------------------------------------------
-- 5. TERVIKLIKKUSE TRIGERID
-- ------------------------------------------------------------

-- Esinemise ala peab kuuluma samale sündmusele
create or replace function check_perf_stage_event()
returns trigger language plpgsql as $$
begin
  if (select event_id from stages where id = new.stage_id) <> new.event_id then
    raise exception 'Ala kuulub teisele sündmusele';
  end if;
  return new;
end $$;
create trigger trg_perf_stage_event before insert or update on performances
  for each row execute function check_perf_stage_event();

-- Esinemise esineja peab kuuluma samale sündmusele
create or replace function check_pa_same_event()
returns trigger language plpgsql as $$
begin
  if (select event_id from performances where id = new.performance_id)
     <> (select event_id from artists where id = new.artist_id) then
    raise exception 'Esineja kuulub teisele sündmusele';
  end if;
  return new;
end $$;
create trigger trg_pa_same_event before insert or update on performance_artists
  for each row execute function check_pa_same_event();

-- Platvormi otsuseid (is_active, plan) muudab AINULT platvormi
-- omanik — korraldaja ei saa end ise "makstuks" lülitada
create or replace function protect_platform_columns()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (new.is_active is distinct from old.is_active
      or new.plan is distinct from old.plan)
     and not is_platform_admin() then
    raise exception 'Neid seadeid muudab ainult platvormi omanik';
  end if;
  return new;
end $$;
create trigger trg_protect_platform before update on events
  for each row execute function protect_platform_columns();

-- ------------------------------------------------------------
-- 6. TURVAREEGLID (RLS) — sündmusepõhiseks
-- ------------------------------------------------------------

alter table organizations     enable row level security;
alter table events            enable row level security;
alter table event_admins      enable row level security;
alter table platform_admins   enable row level security;
alter table event_maps        enable row level security;
alter table event_email_prefs enable row level security;

-- Korraldaja näeb oma organisatsiooni; platvormi omanik kõiki
create policy "org read" on organizations for select using (
  is_platform_admin() or exists (
    select 1 from events e
    join event_admins ea on ea.event_id = e.id
    where e.organization_id = organizations.id and ea.user_id = auth.uid()
  )
);
create policy "org write platform" on organizations for all
  using (is_platform_admin()) with check (is_platform_admin());

-- Sündmus: elus sündmust näevad kõik, oma sündmust admin alati
create policy "event read" on events for select using (
  (is_public and is_active) or is_event_admin(id)
);
create policy "event update admin" on events for update
  using (is_event_admin(id)) with check (is_event_admin(id));
create policy "event all platform" on events for all
  using (is_platform_admin()) with check (is_platform_admin());

-- Adminite nimekirja näeb sama sündmuse admin; muutmine käib
-- AINULT funktsioonide kaudu (all-lõpus)
create policy "event_admins read" on event_admins for select
  using (is_event_admin(event_id));

create policy "platform_admins self" on platform_admins for select
  using (is_platform_admin());

create policy "maps read" on event_maps for select using (
  event_is_live(event_id) or is_event_admin(event_id)
);
create policy "maps write" on event_maps for all
  using (is_event_admin(event_id)) with check (is_event_admin(event_id));

-- Hommikukirja tellimus: igaüks ainult enda oma
create policy "email prefs own" on event_email_prefs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Sisutabelite vanad reeglid maha, sündmusepõhised asemele
drop policy if exists "public read stages"       on stages;
drop policy if exists "admin write stages"       on stages;
drop policy if exists "public read artists"      on artists;
drop policy if exists "admin write artists"      on artists;
drop policy if exists "public read tags"         on tags;
drop policy if exists "admin write tags"         on tags;
drop policy if exists "public read performances" on performances;
drop policy if exists "admin write performances" on performances;
drop policy if exists "public read perf_artists" on performance_artists;
drop policy if exists "admin write perf_artists" on performance_artists;
drop policy if exists "public read perf_tags"    on performance_tags;
drop policy if exists "admin write perf_tags"    on performance_tags;
drop policy if exists "public read event_info"   on event_info;
drop policy if exists "admin write event_info"   on event_info;
drop policy if exists "admin templates"       on email_templates;
drop policy if exists "admin read templates"  on email_templates;
drop policy if exists "admin write templates" on email_templates;

create policy "stages read" on stages for select using (
  event_is_live(event_id) or is_event_admin(event_id)
);
create policy "stages write" on stages for all
  using (is_event_admin(event_id)) with check (is_event_admin(event_id));

create policy "artists read" on artists for select using (
  event_is_live(event_id) or is_event_admin(event_id)
);
create policy "artists write" on artists for all
  using (is_event_admin(event_id)) with check (is_event_admin(event_id));

create policy "tags read" on tags for select using (
  event_is_live(event_id) or is_event_admin(event_id)
);
create policy "tags write" on tags for all
  using (is_event_admin(event_id)) with check (is_event_admin(event_id));

-- Esinemised: avalik näeb elus sündmuse avaldatud kava,
-- oma sündmuse admin näeb ka mustandeid
create policy "perfs read" on performances for select using (
  (event_is_live(event_id) and is_published = true)
  or is_event_admin(event_id)
);
create policy "perfs write" on performances for all
  using (is_event_admin(event_id)) with check (is_event_admin(event_id));

-- Seosed käivad emakirje õiguse kaudu: näed seost, kui näed
-- esinemist; muudad, kui oled esinemise sündmuse admin
create policy "pa read" on performance_artists for select using (
  exists (select 1 from performances p where p.id = performance_id)
);
create policy "pa write" on performance_artists for all
  using (exists (select 1 from performances p
                 where p.id = performance_id and is_event_admin(p.event_id)))
  with check (exists (select 1 from performances p
                 where p.id = performance_id and is_event_admin(p.event_id)));

create policy "pt read" on performance_tags for select using (
  exists (select 1 from performances p where p.id = performance_id)
);
create policy "pt write" on performance_tags for all
  using (exists (select 1 from performances p
                 where p.id = performance_id and is_event_admin(p.event_id)))
  with check (exists (select 1 from performances p
                 where p.id = performance_id and is_event_admin(p.event_id)));

create policy "info read" on event_info for select using (
  event_is_live(event_id) or is_event_admin(event_id)
);
create policy "info write" on event_info for all
  using (is_event_admin(event_id)) with check (is_event_admin(event_id));

-- Meilimallid on ainult oma sündmuse adminitele
create policy "tpl read" on email_templates for select
  using (is_event_admin(event_id));
create policy "tpl write" on email_templates for all
  using (is_event_admin(event_id)) with check (is_event_admin(event_id));

-- ------------------------------------------------------------
-- 7. FUNKTSIOONID: registreerimine, meeskond, tellijate arv
-- ------------------------------------------------------------

-- Korraldaja registreerib sündmuse. Piirmäär: max 3 ootel
-- taotlust kasutaja kohta (spämmitõke).
create or replace function register_event(
  p_org_name text, p_reg_code text, p_contact_name text,
  p_contact_phone text, p_website text,
  p_event_name text, p_slug text, p_starts date, p_ends date
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_org uuid; v_ev uuid; v_email text;
begin
  if auth.uid() is null then
    raise exception 'Sisselogimata';
  end if;
  select email into v_email from auth.users where id = auth.uid();
  if (select count(*) from organizations
      where created_by = auth.uid() and status = 'ootel') >= 3 then
    raise exception 'Sul on juba 3 ootel taotlust — oota enne uue esitamist vastust';
  end if;
  insert into organizations (name, reg_code, contact_name, contact_email,
                             contact_phone, website, status, created_by)
  values (p_org_name, p_reg_code, p_contact_name, v_email,
          p_contact_phone, p_website, 'ootel', auth.uid())
  returning id into v_org;
  insert into events (organization_id, slug, name, starts_on, ends_on)
  values (v_org, p_slug, p_event_name, p_starts, p_ends)
  returning id into v_ev;
  insert into event_admins (event_id, user_id, role)
  values (v_ev, auth.uid(), 'peakasutaja');
  return v_ev;
end $$;

-- Meeskonna haldus: ainult sama sündmuse peakasutaja
create or replace function event_admin_add(p_event uuid, p_email text, p_role text default 'admin')
returns text language plpgsql security definer set search_path = public as $$
declare v_uid uuid;
begin
  if not exists (select 1 from event_admins
                 where event_id = p_event and user_id = auth.uid()
                   and role = 'peakasutaja')
     and not is_platform_admin() then
    raise exception 'Ainult sündmuse peakasutaja saab admineid lisada';
  end if;
  if p_role not in ('peakasutaja','admin') then
    raise exception 'Tundmatu roll';
  end if;
  select id into v_uid from auth.users where lower(email) = lower(p_email);
  if v_uid is null then
    return 'Sellise e-postiga kasutajat pole — palu tal enne äppi sisse logida';
  end if;
  insert into event_admins (event_id, user_id, role)
  values (p_event, v_uid, p_role)
  on conflict (event_id, user_id) do update set role = excluded.role;
  return 'Lisatud';
end $$;

create or replace function event_admin_remove(p_event uuid, p_user uuid)
returns text language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from event_admins
                 where event_id = p_event and user_id = auth.uid()
                   and role = 'peakasutaja')
     and not is_platform_admin() then
    raise exception 'Ainult sündmuse peakasutaja saab admineid eemaldada';
  end if;
  if (select role from event_admins where event_id = p_event and user_id = p_user) = 'peakasutaja'
     and (select count(*) from event_admins
          where event_id = p_event and role = 'peakasutaja') = 1 then
    raise exception 'Viimast peakasutajat ei saa eemaldada';
  end if;
  delete from event_admins where event_id = p_event and user_id = p_user;
  return 'Eemaldatud';
end $$;

-- ------------------------------------------------------------
-- ÜLEMINEKUAJA TURVAPARANDUS: vanad tabelid (event_settings,
-- admins) jäävad alles kuni tükini B, aga nende vanad reeglid
-- kasutasid is_admin() funktsiooni, mis tähendab nüüd "ükskõik
-- millise sündmuse admin". Kitsendame need platvormi omanikule,
-- et võõras korraldaja ei saaks vanade tabelite kaudu ILS-i
-- andmeid muuta ega lugeda.
-- ------------------------------------------------------------
drop policy if exists "admin write event_settings" on event_settings;
create policy "admin write event_settings" on event_settings for all
  using (is_platform_admin()) with check (is_platform_admin());
drop policy if exists "admins read" on admins;
create policy "admins read" on admins for select
  using (is_platform_admin());

-- Tellijate ARV korraldajale (mitte kunagi meiliaadressid!)
create or replace function event_subscriber_count(p_event uuid)
returns integer language plpgsql security definer set search_path = public as $$
begin
  if not is_event_admin(p_event) then
    raise exception 'Pole selle sündmuse admin';
  end if;
  return (select count(*) from event_email_prefs where event_id = p_event);
end $$;
