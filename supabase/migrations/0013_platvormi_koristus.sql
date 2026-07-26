-- ============================================================
-- 0013: PLATVORMI KORISTUS (tükk B2)
-- Kood on nüüd täielikult uuel mudelil (event_admins, events,
-- event_email_prefs). See migratsioon:
--   1) lisab meeskonna nimekirja funktsiooni (e-postidega)
--   2) uuendab registreerimist: uus sündmus saab kohe meilimalli
--   3) koristab vana: admins ja event_settings tabelid, profiles
--      vanad meiliveerud, vanad funktsioonid, event_id vaikimisi
--      väärtused (kood paneb nüüd sündmuse ise igale reale)
--
-- NB! Käivita see ALLES PÄRAST tükk B2 koodi üleslaadimist —
-- uus kood töötab ka ilma selleta, aga vana kood vajab vanu
-- tabeleid. Õige järjekord: git push → oota deploy ära → see SQL.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Meeskonna nimekiri e-postidega (ainult sama sündmuse admin)
-- ------------------------------------------------------------
create or replace function event_admin_list(p_event uuid)
returns table (user_id uuid, email text, role text)
language plpgsql security definer set search_path = public as $$
begin
  if not is_event_admin(p_event) then
    raise exception 'Pole selle sündmuse admin';
  end if;
  return query
    select ea.user_id, u.email::text, ea.role
    from event_admins ea
    join auth.users u on u.id = ea.user_id
    where ea.event_id = p_event
    order by ea.role, u.email;
end $$;

-- ------------------------------------------------------------
-- 2. Registreerimine annab uuele sündmusele kohe hommikukirja
--    malli (koopia platvormi vaikimisi tekstidest)
-- ------------------------------------------------------------
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
  -- hommikukirja mall: koopia esimesest olemasolevast (ILS-i omast),
  -- korraldaja kohendab sisu ise Meilid sakis
  insert into email_templates (event_id, key, subject_et, subject_en,
                               body_et, body_en, send_hour)
  select v_ev, key, subject_et, subject_en, body_et, body_en, send_hour
    from email_templates
    where key = 'daily_schedule'
    order by updated_at
    limit 1;
  return v_ev;
end $$;

-- ------------------------------------------------------------
-- 3. Koristus: vana maailm maha
-- ------------------------------------------------------------

-- Vaikimisi event_id maha — kood paneb nüüd sündmuse ise
alter table stages          alter column event_id drop default;
alter table artists         alter column event_id drop default;
alter table tags            alter column event_id drop default;
alter table performances    alter column event_id drop default;
alter table event_info      alter column event_id drop default;
alter table email_templates alter column event_id drop default;

-- Vanad admini funktsioonid (0005) ja tabel
drop function if exists admin_list();
drop function if exists admin_add_by_email(text, text);
drop function if exists admin_remove(uuid);
drop table if exists admins;

-- Vana sündmuse seadete tabel (sisu elab nüüd events tabelis)
drop table if exists event_settings;

-- Profiili vanad meiliveerud (tellimused elavad event_email_prefs
-- tabelis, kuhu nad 0012-s kolisid)
alter table profiles drop column if exists wants_daily_email;
alter table profiles drop column if exists daily_email_hour;
alter table profiles drop column if exists last_daily_sent;
