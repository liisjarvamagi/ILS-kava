-- ============================================================
-- I LAND SOUND KAVAÄPP — ANDMEMUDEL (Supabase / Postgres)
-- 3. faas: database designer
-- Käivita see Supabase SQL Editoris ühe korraga.
-- ============================================================

-- ------------------------------------------------------------
-- 1. ALAD / LAVAD
-- Iga füüsiline ala festivalil. Kaardikoordinaadid on protsendid
-- kaardipildi laiusest ja kõrgusest (0–100), et pilt võiks olla
-- mis tahes suuruses.
-- ------------------------------------------------------------
create table stages (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,          -- nt 'sunset', 'piidi'
  name_et     text not null,
  name_en     text not null,
  descr_et    text,
  descr_en    text,
  color       text not null default '#888888', -- ala värv kavas
  map_x       numeric(5,2),                  -- % kaardipildi laiusest
  map_y       numeric(5,2),                  -- % kaardipildi kõrgusest
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 2. ESINEJAD
-- Üks esineja = üks kirje, ükskõik mitmel laval ta esineb.
-- ------------------------------------------------------------
create table artists (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,          -- nt 'lee-burridge'
  name        text not null,
  country     text,                          -- nt 'UK', 'EE'
  bio_et      text,
  bio_en      text,
  image_url   text,
  links       jsonb not null default '{}'::jsonb, -- nt {"instagram": "...", "spotify": "..."}
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- 3. ESINEMISED
-- Üks kava-kirje: mis toimub, kus ja millal.
-- festival_day hoiab "festivalipäeva" (nt neljapäeva programm,
-- mis kestab reede kella 05-ni, kuulub neljapäeva alla).
-- start_at / end_at on täpsed ajad koos ajavööndiga.
-- ------------------------------------------------------------
create table performances (
  id            uuid primary key default gen_random_uuid(),
  stage_id      uuid not null references stages(id) on delete restrict,
  festival_day  date not null,
  start_at      timestamptz not null,
  end_at        timestamptz not null,
  title_et      text,   -- kui pole tavaline esineja, nt 'Teetseremoonia'
  title_en      text,
  descr_et      text,
  descr_en      text,
  is_background boolean not null default false, -- terve päeva taustaprogramm (nt Beauty Area)
  is_published  boolean not null default true,  -- mustand vs avalik
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint performance_time_ok check (end_at > start_at)
);

-- ------------------------------------------------------------
-- 4. ESINEMISE ESINEJAD (mitu-mitmele)
-- b2b setid = mitu esinejat ühel esinemisel.
-- Sama esineja võib olla mitmel esinemisel.
-- ------------------------------------------------------------
create table performance_artists (
  performance_id uuid not null references performances(id) on delete cascade,
  artist_id      uuid not null references artists(id) on delete cascade,
  sort_order     integer not null default 0,
  primary key (performance_id, artist_id)
);

-- ------------------------------------------------------------
-- 5. TAGID ja ESINEMISTE TAGID
-- nt 'LIVE', 'töötuba', 'joga'
-- ------------------------------------------------------------
create table tags (
  id       uuid primary key default gen_random_uuid(),
  slug     text not null unique,
  name_et  text not null,
  name_en  text not null
);

create table performance_tags (
  performance_id uuid not null references performances(id) on delete cascade,
  tag_id         uuid not null references tags(id) on delete cascade,
  primary key (performance_id, tag_id)
);

-- ------------------------------------------------------------
-- 6. KASUTAJAPROFIILID
-- Laiendab Supabase auth.users tabelit. Rida tekib automaatselt
-- registreerumisel (trigger allpool).
-- ------------------------------------------------------------
create table profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  locale            text not null default 'et' check (locale in ('et','en')),
  wants_daily_email boolean not null default false,
  created_at        timestamptz not null default now()
);

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ------------------------------------------------------------
-- 7. MINU KAVA
-- Kasutaja salvestatud esinemised. Seos kannab infot (millal lisati).
-- ------------------------------------------------------------
create table user_schedule (
  user_id        uuid not null references profiles(id) on delete cascade,
  performance_id uuid not null references performances(id) on delete cascade,
  created_at     timestamptz not null default now(),
  primary key (user_id, performance_id)
);

-- ------------------------------------------------------------
-- 8. ADMINID
-- Eraldi tabel, mida tavakasutaja muuta EI saa.
-- superadmin (Liis) annab ja võtab õigusi.
-- ------------------------------------------------------------
create table admins (
  user_id    uuid primary key references profiles(id) on delete cascade,
  role       text not null default 'admin' check (role in ('superadmin','admin')),
  granted_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create or replace function is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

create or replace function is_superadmin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from admins where user_id = auth.uid() and role = 'superadmin');
$$;

-- ------------------------------------------------------------
-- 9. MEILIMALLID
-- Admin muudab kirja sisu ja allkirja süsteemis, mitte koodis.
-- {{placeholderid}} asendatakse saatmisel.
-- ------------------------------------------------------------
create table email_templates (
  id         uuid primary key default gen_random_uuid(),
  key        text not null unique,  -- 'welcome', 'daily_schedule'
  subject_et text not null,
  subject_en text not null,
  body_et    text not null,
  body_en    text not null,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- INDEKSID — sagedaste päringute jaoks
-- ============================================================
create index idx_performances_day    on performances(festival_day);
create index idx_performances_stage  on performances(stage_id);
create index idx_performances_start  on performances(start_at);
create index idx_perf_artists_artist on performance_artists(artist_id);
create index idx_user_schedule_user  on user_schedule(user_id);
create index idx_user_schedule_perf  on user_schedule(performance_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- Reegel: avalik loeb kava, ainult admin kirjutab.
-- Kasutaja näeb ja muudab ainult enda andmeid.
-- ============================================================
alter table stages             enable row level security;
alter table artists            enable row level security;
alter table performances       enable row level security;
alter table performance_artists enable row level security;
alter table tags               enable row level security;
alter table performance_tags   enable row level security;
alter table profiles           enable row level security;
alter table user_schedule      enable row level security;
alter table admins             enable row level security;
alter table email_templates    enable row level security;

-- Avalik kava: kõik (ka sisselogimata) saavad lugeda
create policy "public read stages"       on stages       for select using (true);
create policy "public read artists"      on artists      for select using (true);
create policy "public read performances" on performances for select using (is_published = true or is_admin());
create policy "public read perf_artists" on performance_artists for select using (true);
create policy "public read tags"         on tags         for select using (true);
create policy "public read perf_tags"    on performance_tags for select using (true);

-- Kava andmeid kirjutab ainult admin
create policy "admin write stages"       on stages       for all using (is_admin()) with check (is_admin());
create policy "admin write artists"      on artists      for all using (is_admin()) with check (is_admin());
create policy "admin write performances" on performances for all using (is_admin()) with check (is_admin());
create policy "admin write perf_artists" on performance_artists for all using (is_admin()) with check (is_admin());
create policy "admin write tags"         on tags         for all using (is_admin()) with check (is_admin());
create policy "admin write perf_tags"    on performance_tags for all using (is_admin()) with check (is_admin());

-- Profiil: igaüks näeb ja muudab ainult enda oma
create policy "own profile read"   on profiles for select using (auth.uid() = id);
create policy "own profile update" on profiles for update using (auth.uid() = id);

-- Minu kava: ainult enda kirjed
create policy "own schedule read"   on user_schedule for select using (auth.uid() = user_id);
create policy "own schedule insert" on user_schedule for insert with check (auth.uid() = user_id);
create policy "own schedule delete" on user_schedule for delete using (auth.uid() = user_id);

-- Adminite tabel: adminid näevad, ainult superadmin muudab
create policy "admins read"  on admins for select using (is_admin());
create policy "superadmin manage" on admins for all using (is_superadmin()) with check (is_superadmin());

-- Meilimallid: admin loeb ja muudab
create policy "admin templates" on email_templates for all using (is_admin()) with check (is_admin());

-- ============================================================
-- MÄRKUS: hommikukirja saatja (Verceli cron) kasutab service_role
-- võtit serveris — see läheb RLS-ist mööda ja loeb wants_daily_email
-- kasutajad. See võti EI tohi kunagi sattuda kliendikoodi ega GitHubi.
-- ============================================================
