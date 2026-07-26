-- 0011: sündmuse üldised seaded — üks rida, mida admin muudab
-- Sündmus sakis: festivali kuupäevad (nende järgi tehakse vormidesse
-- päevade rippmenüü), kaanefoto ning piletite ja kodukorra lingid.
-- Lugeda võivad kõik (äpp vajab kuupäevi), kirjutada ainult admin.

create table if not exists event_settings (
  id               int primary key default 1 check (id = 1), -- alati täpselt üks rida
  starts_on        date not null default '2026-07-16',
  ends_on          date not null default '2026-07-19',
  cover_image_url  text,
  tickets_url      text,
  rules_url        text,
  updated_at       timestamptz not null default now(),
  constraint ends_after_start check (ends_on >= starts_on)
);

insert into event_settings (id) values (1)
on conflict (id) do nothing;

alter table event_settings enable row level security;

drop policy if exists "public read event_settings" on event_settings;
create policy "public read event_settings" on event_settings
  for select using (true);

drop policy if exists "admin write event_settings" on event_settings;
create policy "admin write event_settings" on event_settings
  for all using (is_admin()) with check (is_admin());

-- Üle kirjutamise kaitse ajatempel (sama trigerifunktsioon, mis 0010-s)
drop trigger if exists trg_updated_at on event_settings;
create trigger trg_updated_at before update on event_settings
  for each row execute function set_updated_at();
