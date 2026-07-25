-- ============================================================
-- 0003: ESINEJATE LOOD (play nupp esineja lehel)
-- Käivita Supabase SQL Editoris PÄRAST 0002 faili.
--
-- Kaks võimalust loo lisamiseks, mõlemad on valikulised:
--   track_file_url  → mp3/audio faili OTSELINK (nt Supabase Storage).
--                     Play nupp mängib kohe äpi sees, oma kujundusega.
--   track_link      → Spotify, SoundCloudi või YouTube'i loo link.
--                     Play nupp avab äpi sees platvormi mängija.
-- Kui täidetud on mõlemad, mängib fail. Kui kumbagi pole, play
-- nuppu ei näidata.
-- ============================================================

alter table artists add column if not exists track_file_url text;
alter table artists add column if not exists track_link text;
alter table artists add column if not exists track_title text; -- loo pealkiri minimängija ribal, nt 'Set Fire To The Rain'

-- ------------------------------------------------------------
-- Kui tahad faile kasutada: loo avalik Storage bucket "lood".
-- 1) Supabase Dashboard → Storage → New bucket → nimi: lood,
--    linnuke "Public bucket" (failid on kuulamiseks avalikud).
-- 2) Lae mp3 üles ja kopeeri faili avalik URL siia veergu:
--    update artists set track_file_url = 'https://...supabase.co/storage/v1/object/public/lood/artist.mp3'
--    where slug = 'artisti-slug';
--
-- Lingiga lisamine (faili pole vaja):
--    update artists set track_link = 'https://open.spotify.com/track/...'
--    where slug = 'artisti-slug';
-- Sobivad: open.spotify.com, soundcloud.com, youtube.com / youtu.be
-- ------------------------------------------------------------
