-- ============================================================
-- 0007: PILTIDE JA LUGUDE HOIDLA (Supabase Storage)
-- Käivita Supabase SQL Editoris PÄRAST 0006 faili.
--
-- Loob kaks avalikku bucketit:
--   pildid — esinejate fotod (admin laeb üles admini vormist)
--   lood   — esinejate mp3 failid play nupu jaoks
-- Turvareeglid: kõik saavad faile VAADATA (need ongi avalikud
-- pildid ja lood), aga üles laadida, muuta ja kustutada saavad
-- AINULT adminid.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('pildid', 'pildid', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('lood', 'lood', true)
on conflict (id) do nothing;

create policy "public read meedia" on storage.objects
  for select using (bucket_id in ('pildid', 'lood'));

create policy "admin insert meedia" on storage.objects
  for insert with check (bucket_id in ('pildid', 'lood') and public.is_admin());

create policy "admin update meedia" on storage.objects
  for update using (bucket_id in ('pildid', 'lood') and public.is_admin());

create policy "admin delete meedia" on storage.objects
  for delete using (bucket_id in ('pildid', 'lood') and public.is_admin());
