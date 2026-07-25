-- ============================================================
-- 0002: ALADE GPS-KOORDINAADID + FESTIVALI OLULINE INFO
-- Käivita Supabase SQL Editoris PÄRAST 0001 faili.
-- Annab esinemise ja ala lehtedele kaardi eelvaate ja juhiste
-- lingi ning "Oluline info" kaardid (kohalejõudmine, majutus jm).
-- ============================================================

-- GPS-koordinaadid ala kohta. Need on eraldi map_x/map_y veergudest:
-- map_x/map_y on protsendid festivali kaardipildil (7. tükk),
-- lat/lng on päris koordinaadid Google Mapsi juhiste jaoks.
alter table stages add column if not exists lat numeric(9,6);
alter table stages add column if not exists lng numeric(9,6);

-- Festivali üldine info, mida näidatakse esinemise lehe all
-- (nagu Brella "Important Information" kaardid). Admin saab
-- neid hiljem adminipaneelist muuta; seni saab muuta SQL-iga.
create table if not exists event_info (
  id         uuid primary key default gen_random_uuid(),
  icon       text not null default 'ℹ️',   -- emoji kaardi ees
  title_et   text not null,
  title_en   text not null,
  body_et    text not null,
  body_en    text not null,
  sort_order integer not null default 0,
  is_active  boolean not null default true
);

alter table event_info enable row level security;
create policy "public read event_info" on event_info
  for select using (is_active = true or is_admin());
create policy "admin write event_info" on event_info
  for all using (is_admin()) with check (is_admin());

-- Stardikirjed. NB! Need on NÄIDISTEKSTID — muuda sisu õigeks
-- enne avalikustamist (SQL Editoris update või hiljem adminis).
insert into event_info (icon, title_et, title_en, body_et, body_en, sort_order) values
('⛴️', 'Kohalejõudmine', 'Getting there',
 'Festival toimub Illiku laiul Orissaares, Saaremaal. Mandrilt tulles sõida Virtsu sadamasse ja võta praam Kuivastu suunas. Praamipiletid osta ette praamid.ee lehelt.',
 'The festival takes place on Illiku islet in Orissaare, Saaremaa. Coming from the mainland, drive to Virtsu harbour and take the ferry towards Kuivastu. Buy ferry tickets in advance at praamid.ee.',
 10),
('🚗', 'Auto ja parkimine', 'Car and parking',
 'Festivali parkla on Orissaares, festivalialale autoga ei pääse. Jälgi kohapeal viitasid ja parkimiskorraldajate juhiseid.',
 'The festival car park is in Orissaare; cars cannot enter the festival area. Follow the signs and parking staff on site.',
 20),
('🚌', 'Bussid', 'Buses',
 'Orissaarde sõidavad liinibussid Kuressaarest ja Kuivastust. Festivali eribusside info avaldatakse enne festivali.',
 'Regular buses run to Orissaare from Kuressaare and Kuivastu. Festival shuttle info is published before the festival.',
 30),
('🏕️', 'Majutus', 'Stay',
 'Festivali telkla on jalutuskäigu kaugusel. Orissaares ja lähiümbruses on ka kodumajutusi ja puhkemaju, broneeri varakult.',
 'The festival campsite is within walking distance. Orissaare and the surroundings also offer guesthouses and holiday homes; book early.',
 40),
('✅', 'Märkused', 'Notes',
 'Võta kaasa sularaha, soe kiht õhtuks ja veepudel. Ala kaart ja täpsemad juhised on äpi Kaardi vaates.',
 'Bring some cash, a warm layer for the evening and a water bottle. The area map and directions are in the Map view of the app.',
 50);

-- Näide, kuidas alale koordinaadid anda (eemalda kommentaar ja
-- pane õiged numbrid; koordinaadid saad Google Mapsist punkti
-- pikalt vajutades):
-- update stages set lat = 58.564400, lng = 23.086600 where slug = 'sunset';
