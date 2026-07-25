-- ============================================================
-- 0005: ADMINIPANEELI FUNKTSIOONID
-- Käivita Supabase SQL Editoris PÄRAST 0004 faili.
--
-- Kolm turvalist funktsiooni adminipaneelile. Kõik kontrollivad
-- ise, KES küsib: tavakasutaja saab ainult vea, ükskõik mida ta
-- proovib. E-postid tulevad auth.users tabelist, mida tavapäringuga
-- lugeda ei saa — sellepärast käivad need security definer
-- funktsiooni kaudu, mis lubab ainult admineid.
-- ============================================================

-- Adminite nimekiri koos e-postidega (näevad ainult adminid)
create or replace function admin_list()
returns table (user_id uuid, email text, role text, created_at timestamptz)
language sql
security definer set search_path = public
as $$
  select a.user_id, u.email::text, a.role, a.created_at
  from admins a
  join auth.users u on u.id = a.user_id
  where is_admin()
  order by a.created_at;
$$;

-- Admini lisamine e-posti järgi (ainult superadmin).
-- Inimene peab olema äppi vähemalt korra sisse loginud.
create or replace function admin_add_by_email(p_email text, p_role text default 'admin')
returns text
language plpgsql
security definer set search_path = public
as $$
declare
  v_user uuid;
begin
  if not is_superadmin() then
    raise exception 'Ainult superadmin saab admineid lisada';
  end if;
  if p_role not in ('admin', 'superadmin') then
    raise exception 'Tundmatu roll';
  end if;
  select id into v_user from auth.users where lower(email) = lower(trim(p_email)) limit 1;
  if v_user is null then
    return 'EI LEIDNUD: selle e-postiga kasutajat pole. Ta peab enne äppi sisse logima.';
  end if;
  insert into admins (user_id, role, granted_by)
  values (v_user, p_role, auth.uid())
  on conflict (user_id) do update set role = excluded.role;
  return 'OK';
end;
$$;

-- Admini eemaldamine (ainult superadmin; iseennast eemaldada ei saa)
create or replace function admin_remove(p_user_id uuid)
returns text
language plpgsql
security definer set search_path = public
as $$
begin
  if not is_superadmin() then
    raise exception 'Ainult superadmin saab admineid eemaldada';
  end if;
  if p_user_id = auth.uid() then
    return 'EI SAA: iseennast ei saa eemaldada';
  end if;
  delete from admins where user_id = p_user_id;
  return 'OK';
end;
$$;

-- ------------------------------------------------------------
-- ESIMESE SUPERADMINI MÄÄRAMINE (tee üks kord käsitsi):
-- eemalda järgmiselt realt kommentaar, pane OMA e-post (see, millega
-- äppi sisse logisid) ja käivita. Pärast seda haldad admineid
-- adminipaneelist.
--
-- insert into admins (user_id, role)
--   select id, 'superadmin' from auth.users
--   where lower(email) = lower('sinu@epost.ee')
--   on conflict (user_id) do update set role = 'superadmin';
-- ------------------------------------------------------------
