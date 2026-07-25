-- ============================================================
-- 0004: LEMMIKESINEJAD KONTOSSE
-- Käivita Supabase SQL Editoris PÄRAST 0003 faili.
-- Sisselogitud kasutaja lemmikesinejad (südamed) salvestuvad
-- siia tabelisse ja liiguvad seadmete vahel kaasa, samamoodi
-- nagu "minu kava". RLS tagab, et igaüks näeb ja muudab AINULT
-- enda lemmikuid.
-- ============================================================

create table if not exists user_fav_artists (
  user_id    uuid not null references profiles(id) on delete cascade,
  artist_id  uuid not null references artists(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, artist_id)
);

create index if not exists idx_user_fav_artists_user on user_fav_artists(user_id);

alter table user_fav_artists enable row level security;
create policy "own favs read"   on user_fav_artists for select using (auth.uid() = user_id);
create policy "own favs insert" on user_fav_artists for insert with check (auth.uid() = user_id);
create policy "own favs delete" on user_fav_artists for delete using (auth.uid() = user_id);
