-- 0009: hommikukirja kellaaeg on seadistatav.
-- Korraldaja paneb vaikimisi kellaaja (Meilid sakis), iga kasutaja
-- võib profiilis valida endale sobiva aja. Lisaks peame meeles,
-- mis päeval kasutaja viimati kirja sai — nii võib saatjat käivitada
-- kasvõi iga tund ja keegi ei saa sama päeva kirja kaks korda.

-- Korraldaja vaikimisi saatmistund (Tallinna aeg, täistund 0–23)
alter table email_templates
  add column if not exists send_hour int not null default 9
    check (send_hour between 0 and 23);

-- Kasutaja isiklik saatmistund; null = kasuta korraldaja vaikimisi aega
alter table profiles
  add column if not exists daily_email_hour int
    check (daily_email_hour between 0 and 23);

-- Mis päeva kiri on kasutajale juba saadetud (topeltsaatmise tõke)
alter table profiles
  add column if not exists last_daily_sent date;

-- RLS on juba paigas: kasutaja uuendab ainult enda profiili rida
-- ("own profile update"), saatja käib service võtmega serveris.
