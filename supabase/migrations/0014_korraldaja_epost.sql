-- 0014: korraldaja taotlusvorm küsib kontakt-eposti eraldi.
-- Seni võeti meil automaatselt sisselogimise kontolt; nüüd saab
-- taotleja selle ise kirjutada (ette täidetakse konto meiliga).
-- Vana funktsioon kustutatakse, sest parameetrite nimekiri muutub —
-- uuel on p_contact_email vaikimisi tühi, nii et ka ilma selleta
-- kutsumine töötab edasi (siis võetakse konto meil).

drop function if exists register_event(
  text, text, text, text, text, text, text, date, date);

create or replace function register_event(
  p_org_name text, p_reg_code text, p_contact_name text,
  p_contact_phone text, p_website text,
  p_event_name text, p_slug text, p_starts date, p_ends date,
  p_contact_email text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_org uuid; v_ev uuid; v_email text;
begin
  if auth.uid() is null then
    raise exception 'Sisselogimata';
  end if;
  -- kontaktmeil: vormist antu, muidu konto oma
  v_email := nullif(trim(coalesce(p_contact_email, '')), '');
  if v_email is null then
    select email into v_email from auth.users where id = auth.uid();
  elsif v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'contact_email: vigane e-posti aadress';
  end if;
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
