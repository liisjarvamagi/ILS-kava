-- 0010: üle kirjutamise kaitse mitme admini jaoks.
-- Igale kavatabeli reale pannakse viimase muutmise ajatempel, mida
-- andmebaas ise värskendab. Admini vorm jätab avamisel ajatempli
-- meelde ja salvestamisel kontrollib, kas rida on vahepeal muutunud.
-- Kui teine admin jõudis vahepeal sama rida muuta, ei kirjutata
-- tema tööd üle, vaid näidatakse hoiatust.

-- Ajatempli veerg
alter table performances    add column if not exists updated_at timestamptz not null default now();
alter table artists         add column if not exists updated_at timestamptz not null default now();
alter table stages          add column if not exists updated_at timestamptz not null default now();
alter table tags            add column if not exists updated_at timestamptz not null default now();
alter table event_info      add column if not exists updated_at timestamptz not null default now();
alter table email_templates add column if not exists updated_at timestamptz not null default now();

-- Andmebaas uuendab ajatemplit igal muutmisel ise — ükski vorm ega
-- skript ei saa seda kogemata vahele jätta.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  -- clock_timestamp() = tegelik hetk (now() oleks transaktsiooni
  -- algusaeg ja kaks kiiret muudatust võiksid saada sama templi)
  new.updated_at := clock_timestamp();
  return new;
end;
$$;

drop trigger if exists trg_updated_at on performances;
create trigger trg_updated_at before update on performances
  for each row execute function set_updated_at();

drop trigger if exists trg_updated_at on artists;
create trigger trg_updated_at before update on artists
  for each row execute function set_updated_at();

drop trigger if exists trg_updated_at on stages;
create trigger trg_updated_at before update on stages
  for each row execute function set_updated_at();

drop trigger if exists trg_updated_at on tags;
create trigger trg_updated_at before update on tags
  for each row execute function set_updated_at();

drop trigger if exists trg_updated_at on event_info;
create trigger trg_updated_at before update on event_info
  for each row execute function set_updated_at();

drop trigger if exists trg_updated_at on email_templates;
create trigger trg_updated_at before update on email_templates
  for each row execute function set_updated_at();
