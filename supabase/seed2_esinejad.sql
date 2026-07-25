-- ============================================================
-- SEED 2: ESINEJAD PEALKIRJADEST
-- Käivita Supabase SQL Editoris PÄRAST seed.sql faili, ÜKS kord.
-- (Teist korda käivitamine ei tee kahju, aga pole vajalik.)
--
-- Mida see teeb:
--  * muusikaaladel saavad pealkirja nimed päris esinejateks ja
--    pealkiri tühjendatakse (äpp näitab nimesid esinejate kaudu);
--    riigikood nime lõpust (nt 'TODD UK') läheb country väljale
--  * töötubadel jääb pealkirjaks töötoa nimi ('Töötuba · Juhendaja')
--    ja juhendajatest saavad esinejad
--  * TBA, üllatusesinejad jms jäävad pealkirjadeks, esinejat ei teki
--  * pilte, biosid ja lugusid siin ei teki — need lisad Table
--    Editoris (artists: image_url, bio_et, bio_en, links,
--    track_link, track_file_url, track_title) või tulevases adminis
-- ============================================================

-- 1. Esinejad
insert into artists (slug, name, country) values ('a-m-poogen-live', 'A.M.Poogen LIVE', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('adel-force', 'Adel Force', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('ajukaja', 'Ajukaja', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('akie-doi', 'Akie Doi', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('alan-schacher', 'Alan Schacher', 'AUS') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('aleks-valdna', 'Aleks Valdna', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('alo', 'Alo', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('alo-indrek-vosu', 'Alo-Indrek Võsu', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('alvar', 'Alvar', 'FI') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('amit-kothari', 'Amit Kothari', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('andres-alev', 'Andres Alev', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('anete-juurik', 'Anete Juurik', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('annemai', 'Annemai', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('arto-b2b-klmn', 'Arto b2b klmn', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('avis-animi-choir', 'Avis Animi choir', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('b2b2b2b', 'B2B2B2B', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('b2b2b2b2b', 'B2B2B2B2B', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('britiimpeerium', 'britiimpeerium', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('daniil', 'Daniil', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('david-hornung', 'David Hornung', 'DE') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('deep-andi', 'Deep Ändi', 'FI') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('denis-vinogradov', 'Denis Vinogradov', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('dima-b2b-raz', 'Dima b2b Raz', 'RO') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('dj-quest', 'DJ Quest', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('dj-wuf', 'DJ WUF', 'FI') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('dr-philgood', 'Dr.PhilGood', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('e-lina', 'E.lina', 'UA') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('ehte', 'EHTE', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('eliisabet-valmas', 'Eliisabet Valmas', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('ellen-vene', 'Ellen Vene', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('erki-veiko', 'Erki Veiko', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('firejose', 'Firejose', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('funkomatik', 'Funkomatik', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('gert-reinberg', 'Gert Reinberg', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('gina-bergmann', 'Gina Bergmann', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('glenwashere', 'Glenwashere', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('gloria-soobik', 'Gloria Soobik', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('gojnea76', 'Gojnea76', 'RO') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('grete', 'Grete', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('haigla-pidu', 'Haigla Pidu', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('hanneloore', 'Hanneloore', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('hurmet-ilus', 'Hurmet Ilus', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('icahera', 'Icahera', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('ileevi-b2b-anette', 'ileevi b2b Anette', 'FI') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('illich-mujica', 'Illich Mujica', 'US') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('indrek-alev', 'Indrek Alev', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('ivo-naries', 'Ivo Naries', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('jaan-b2b-tanel', 'Jaan b2b Tanel', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('janno-kekkonen', 'Janno Kekkonen', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('jesse-g', 'Jesse G', 'DE') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('jimmi-king', 'Jimmi King', 'UK') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('jo-l', 'Jo-L', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('johannes-ahun', 'Johannes Ahun', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('johannes-hoimoja', 'Johannes Hõimoja', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('joni-dj-b2b-denzel', 'Joni DJ b2b Denzel', 'FI') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('jorma-ois', 'Jorma Õis', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('joshua-stephenz-fieldz', 'Joshua Stephenz Fieldz', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('jozels', 'Jozels', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('juhan-mikkor', 'Juhan Mikkor', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('juli-lee', 'Juli Lee', 'CH') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('kadri-maasikmets', 'Kadri Maasikmets', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('kask', 'KASK', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('kasper-g', 'Kasper G', 'FI') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('ken-kuusk', 'Ken Kuusk', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('killing-sinatra', 'Killing Sinatra', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('klap', 'KLAP', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('kristi-kalluste', 'Kristi Kalluste', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('kristin-lants', 'Kristin Lants', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('kristjan-uder', 'Kristjan Uder', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('kurly-beats', 'Kurly Beats', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('l-a-o-s', 'L.A.O.S', 'FI') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('l-eazy', 'L.Eazy', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('l-lukyann', 'L.Lukyann', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('l-lukyann-b2b-icahera', 'L.Lukyann b2b Icahera', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('laiva-maikule', 'Laiva Maikule', 'LV') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('lee-burridge', 'Lee Burridge', 'UK') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('lempi', 'Lempi', 'FI') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('lempi-b2b-rony-rex', 'Lempi b2b Rony Rex', 'FI') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('liina-suur', 'Liina Suur', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('lill', 'lill', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('low-keys', 'Low-keys', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('madis-ligema', 'Madis Ligema', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('majestim', 'Majestim', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('majestim-b2b-yohan', 'Majestim b2b Yohan', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('maria-naur', 'Maria Naur', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('maris-pihlap', 'Maris Pihlap', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('mark-kadek', 'Mark Kadek', 'LV') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('mava', 'Mava', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('meelis-vili', 'Meelis Vili', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('mhkl', 'MHKL', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('micaxan', 'Micaxan', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('milpak', 'Milpak', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('mira-vana', 'Mira Vana', 'DE') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('miroloja', 'Miroloja', 'FR') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('nct', 'NCT', 'FI') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('nico-stojan', 'Nico Stojan', 'DE') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('nikolajev', 'Nikolajev', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('noa', 'noa', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('noro', 'NORO', 'AM') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('obadu', 'Obadu', 'HU') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('olivar', 'Olivar', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('onnea-vaan', 'Onnea Vaan', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('oopus', 'OOPUS', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('ott-kelpman', 'Ott Kelpman', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('paap', 'Paap', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('pandhora', 'PANDHORA', 'FR') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('paul-oja', 'Paul Oja', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('paula', 'Paula', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('peeter-ehala', 'Peeter Ehala', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('plastik-kiimask-mrt', 'Plastik (kiimask, mrt)', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('qba', 'Qba', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('quinbii', 'QUINBII', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('rando-sulg', 'Rando Sulg', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('raul-ojamaa', 'Raul Ojamaa', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('rauno-vaher-co', 'Rauno Vaher & co', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('renno-paat', 'Renno Paat', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('reqteq', 'REQTEQ', 'AM') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('riho-luhter', 'Riho Luhter', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('risto-tatarmae', 'Risto Tatarmäe', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('roma-vjazemski', 'Roma Vjazemski', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('rony-rex', 'Rony Rex', 'FI') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('rosy', 'Rosy', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('rutmilised-live', 'Rütmilised LIVE', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('s-ren', 'SØREN', 'UA') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('sander-molder', 'Sander Mölder', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('sassbass', 'SASSBASS', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('sayako-shiratori', 'Sayako Shiratori', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('seira', 'SeiRa', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('sergey-onischenko', 'Sergey Onischenko', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('silat-beksi', 'Silat Beksi', 'UA') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('silica', 'Silica', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('silver', 'Silver', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('sophie-dragunevits', 'Sophie Dragunevits', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('sound-in-noise', 'Sound In Noise', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('soundy', 'Soundy', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('spontaanika', 'Spontaanika', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('stenisluv', 'Stenisluv', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('susanna-raiend', 'Susanna Raiend', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('taavet', 'Taavet', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('taavi-mikomagi', 'Taavi Mikomägi', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('talia-dorr', 'Talia Dorr', 'DE') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('teresa', 'Teresa', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('the-whole-gang', 'The whole gang', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('thing', 'THING', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('to-sha', 'To-Sha', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('todd', 'TODD', 'UK') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('tomoki-tamura', 'Tomoki Tamura', 'JP') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('tonis-hiiesalu', 'Tõnis Hiiesalu', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('tonu-tubli-trio', 'Tõnu Tubli Trio', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('triinu-johve', 'Triinu Jõhve', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('uku-legal', 'Uku Legal', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('ullar-siir', 'Üllar Siir', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('ursula-maria-probst', 'Ursula Maria Probst', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('vasall-club', 'Vasall Club', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('veikko-kasak', 'Veikko Kasak', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('vladimir-pavluk', 'Vladimir Pavluk', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('white-rabbit', 'White Rabbit', 'FI') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('will-b2b-loukii', 'Will b2b Löukii', null) on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('yalta', 'Yalta', 'LV') on conflict (slug) do nothing;
insert into artists (slug, name, country) values ('yohan', 'Yohan', null) on conflict (slug) do nothing;

-- 2. Seosed esinemistega + pealkirjade korrastus
with p as (select id from performances where start_at = '2026-07-16T18:00:00+03:00' and title_et = 'Glenwashere'
  and stage_id = (select id from stages where slug = 'emalava'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'glenwashere'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T18:00:00+03:00' and title_et = 'Glenwashere'
  and stage_id = (select id from stages where slug = 'emalava');

with p as (select id from performances where start_at = '2026-07-16T18:00:00+03:00' and title_et = 'Madis Ligema, Ott Kelpman, Onnea Vaan, Tõnis Hiiesalu'
  and stage_id = (select id from stages where slug = 'foodstep'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'madis-ligema'), 0 from p
union all
select p.id, (select id from artists where slug = 'ott-kelpman'), 10 from p
union all
select p.id, (select id from artists where slug = 'onnea-vaan'), 20 from p
union all
select p.id, (select id from artists where slug = 'tonis-hiiesalu'), 30 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T18:00:00+03:00' and title_et = 'Madis Ligema, Ott Kelpman, Onnea Vaan, Tõnis Hiiesalu'
  and stage_id = (select id from stages where slug = 'foodstep');

with p as (select id from performances where start_at = '2026-07-16T18:00:00+03:00' and title_et = 'QUINBII'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'quinbii'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T18:00:00+03:00' and title_et = 'QUINBII'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-16T18:00:00+03:00' and title_et = 'Alo-Indrek Võsu'
  and stage_id = (select id from stages where slug = 'terrace'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'alo-indrek-vosu'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T18:00:00+03:00' and title_et = 'Alo-Indrek Võsu'
  and stage_id = (select id from stages where slug = 'terrace');

with p as (select id from performances where start_at = '2026-07-16T19:00:00+03:00' and title_et = 'Yalta LV'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'yalta'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T19:00:00+03:00' and title_et = 'Yalta LV'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-16T20:00:00+03:00' and title_et = 'lill'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'lill'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T20:00:00+03:00' and title_et = 'lill'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-16T20:00:00+03:00' and title_et = 'Rosy'
  and stage_id = (select id from stages where slug = 'emalava'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'rosy'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T20:00:00+03:00' and title_et = 'Rosy'
  and stage_id = (select id from stages where slug = 'emalava');

with p as (select id from performances where start_at = '2026-07-16T20:00:00+03:00' and title_et = 'Johannes Ahun'
  and stage_id = (select id from stages where slug = 'forest'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'johannes-ahun'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T20:00:00+03:00' and title_et = 'Johannes Ahun'
  and stage_id = (select id from stages where slug = 'forest');

with p as (select id from performances where start_at = '2026-07-16T20:00:00+03:00' and title_et = 'Juli Lee CH'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'juli-lee'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T20:00:00+03:00' and title_et = 'Juli Lee CH'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-16T20:00:00+03:00' and title_et = 'TODD UK'
  and stage_id = (select id from stages where slug = 'terrace'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'todd'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T20:00:00+03:00' and title_et = 'TODD UK'
  and stage_id = (select id from stages where slug = 'terrace');

with p as (select id from performances where start_at = '2026-07-16T20:30:00+03:00' and title_et = 'Mark Kadek LV'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'mark-kadek'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T20:30:00+03:00' and title_et = 'Mark Kadek LV'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-16T21:30:00+03:00' and title_et = 'Rütmilised LIVE'
  and stage_id = (select id from stages where slug = 'forest'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'rutmilised-live'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T21:30:00+03:00' and title_et = 'Rütmilised LIVE'
  and stage_id = (select id from stages where slug = 'forest');

with p as (select id from performances where start_at = '2026-07-16T22:00:00+03:00' and title_et = 'Funkomatik'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'funkomatik'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T22:00:00+03:00' and title_et = 'Funkomatik'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-16T22:00:00+03:00' and title_et = 'L.Lukyann'
  and stage_id = (select id from stages where slug = 'emalava'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'l-lukyann'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T22:00:00+03:00' and title_et = 'L.Lukyann'
  and stage_id = (select id from stages where slug = 'emalava');

with p as (select id from performances where start_at = '2026-07-16T22:00:00+03:00' and title_et = 'noa'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'noa'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T22:00:00+03:00' and title_et = 'noa'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-16T22:00:00+03:00' and title_et = 'Avis Animi choir'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'avis-animi-choir'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T22:00:00+03:00' and title_et = 'Avis Animi choir'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-16T22:00:00+03:00' and title_et = 'Miroloja FR'
  and stage_id = (select id from stages where slug = 'terrace'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'miroloja'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T22:00:00+03:00' and title_et = 'Miroloja FR'
  and stage_id = (select id from stages where slug = 'terrace');

with p as (select id from performances where start_at = '2026-07-16T23:00:00+03:00' and title_et = 'A.M.Poogen LIVE'
  and stage_id = (select id from stages where slug = 'forest'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'a-m-poogen-live'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T23:00:00+03:00' and title_et = 'A.M.Poogen LIVE'
  and stage_id = (select id from stages where slug = 'forest');

with p as (select id from performances where start_at = '2026-07-16T23:00:00+03:00' and title_et = 'Laiva Maikule LV'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'laiva-maikule'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T23:00:00+03:00' and title_et = 'Laiva Maikule LV'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-16T23:00:00+03:00' and title_et = 'Lee Burridge UK'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'lee-burridge'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-16T23:00:00+03:00' and title_et = 'Lee Burridge UK'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-17T00:00:00+03:00' and title_et = 'KLAP'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'klap'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T00:00:00+03:00' and title_et = 'KLAP'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-17T00:00:00+03:00' and title_et = 'Riho Luhter'
  and stage_id = (select id from stages where slug = 'forest'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'riho-luhter'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T00:00:00+03:00' and title_et = 'Riho Luhter'
  and stage_id = (select id from stages where slug = 'forest');

with p as (select id from performances where start_at = '2026-07-17T00:00:00+03:00' and title_et = 'David Hornung DE'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'david-hornung'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T00:00:00+03:00' and title_et = 'David Hornung DE'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-17T01:00:00+03:00' and title_et = 'Illich Mujica US'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'illich-mujica'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T01:00:00+03:00' and title_et = 'Illich Mujica US'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-17T02:30:00+03:00' and title_et = 'Jesse G DE'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'jesse-g'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T02:30:00+03:00' and title_et = 'Jesse G DE'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-17T03:00:00+03:00' and title_et = 'Talia Dorr DE'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'talia-dorr'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T03:00:00+03:00' and title_et = 'Talia Dorr DE'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-17T11:15:00+03:00' and title_et = 'Morning yoga · Gina Bergmann'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'gina-bergmann'), 0 from p
on conflict do nothing;
update performances set title_et = 'Morning yoga', title_en = 'Morning yoga'
  where start_at = '2026-07-17T11:15:00+03:00' and title_et = 'Morning yoga · Gina Bergmann'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-17T11:30:00+03:00' and title_et = 'Happy yoga & live singing bowls · Daniil & Amit Kothari'
  and stage_id = (select id from stages where slug = 'lounge'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'daniil'), 0 from p
union all
select p.id, (select id from artists where slug = 'amit-kothari'), 10 from p
on conflict do nothing;
update performances set title_et = 'Happy yoga & live singing bowls', title_en = 'Happy yoga & live singing bowls'
  where start_at = '2026-07-17T11:30:00+03:00' and title_et = 'Happy yoga & live singing bowls · Daniil & Amit Kothari'
  and stage_id = (select id from stages where slug = 'lounge');

with p as (select id from performances where start_at = '2026-07-17T12:00:00+03:00' and title_et = 'Üllar Siir, Andres Alev, Renno Paat, Indrek Alev'
  and stage_id = (select id from stages where slug = 'foodstep'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'ullar-siir'), 0 from p
union all
select p.id, (select id from artists where slug = 'andres-alev'), 10 from p
union all
select p.id, (select id from artists where slug = 'renno-paat'), 20 from p
union all
select p.id, (select id from artists where slug = 'indrek-alev'), 30 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T12:00:00+03:00' and title_et = 'Üllar Siir, Andres Alev, Renno Paat, Indrek Alev'
  and stage_id = (select id from stages where slug = 'foodstep');

with p as (select id from performances where start_at = '2026-07-17T12:00:00+03:00' and title_et = 'Herbal smudge stick workshop · Gloria Soobik, Kristin Lants, Liina Suur'
  and stage_id = (select id from stages where slug = 'forest-day'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'gloria-soobik'), 0 from p
union all
select p.id, (select id from artists where slug = 'kristin-lants'), 10 from p
union all
select p.id, (select id from artists where slug = 'liina-suur'), 20 from p
on conflict do nothing;
update performances set title_et = 'Herbal smudge stick workshop', title_en = 'Herbal smudge stick workshop'
  where start_at = '2026-07-17T12:00:00+03:00' and title_et = 'Herbal smudge stick workshop · Gloria Soobik, Kristin Lants, Liina Suur'
  and stage_id = (select id from stages where slug = 'forest-day');

with p as (select id from performances where start_at = '2026-07-17T12:00:00+03:00' and title_et = 'Spontaanika'
  and stage_id = (select id from stages where slug = 'terrace'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'spontaanika'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T12:00:00+03:00' and title_et = 'Spontaanika'
  and stage_id = (select id from stages where slug = 'terrace');

with p as (select id from performances where start_at = '2026-07-17T12:30:00+03:00' and title_et = 'Qigong, breathwork, gong · Juhan Mikkor × Denis Vinogradov'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'juhan-mikkor'), 0 from p
union all
select p.id, (select id from artists where slug = 'denis-vinogradov'), 10 from p
on conflict do nothing;
update performances set title_et = 'Qigong, breathwork, gong', title_en = 'Qigong, breathwork, gong'
  where start_at = '2026-07-17T12:30:00+03:00' and title_et = 'Qigong, breathwork, gong · Juhan Mikkor × Denis Vinogradov'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-17T12:45:00+03:00' and title_et = 'Energy by Eli · Eliisabet Valmas'
  and stage_id = (select id from stages where slug = 'lounge'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'eliisabet-valmas'), 0 from p
on conflict do nothing;
update performances set title_et = 'Energy by Eli', title_en = 'Energy by Eli'
  where start_at = '2026-07-17T12:45:00+03:00' and title_et = 'Energy by Eli · Eliisabet Valmas'
  and stage_id = (select id from stages where slug = 'lounge');

with p as (select id from performances where start_at = '2026-07-17T14:00:00+03:00' and title_et = 'Gong sound therapy · Denis Vinogradov'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'denis-vinogradov'), 0 from p
on conflict do nothing;
update performances set title_et = 'Gong sound therapy', title_en = 'Gong sound therapy'
  where start_at = '2026-07-17T14:00:00+03:00' and title_et = 'Gong sound therapy · Denis Vinogradov'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-17T14:00:00+03:00' and title_et = 'Forest flow · Kristi Kalluste, Liina Suur'
  and stage_id = (select id from stages where slug = 'forest-day'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'kristi-kalluste'), 0 from p
union all
select p.id, (select id from artists where slug = 'liina-suur'), 10 from p
on conflict do nothing;
update performances set title_et = 'Forest flow', title_en = 'Forest flow'
  where start_at = '2026-07-17T14:00:00+03:00' and title_et = 'Forest flow · Kristi Kalluste, Liina Suur'
  and stage_id = (select id from stages where slug = 'forest-day');

with p as (select id from performances where start_at = '2026-07-17T14:00:00+03:00' and title_et = 'Sound Bowls Workshop · Amit Kothari'
  and stage_id = (select id from stages where slug = 'lounge'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'amit-kothari'), 0 from p
on conflict do nothing;
update performances set title_et = 'Sound Bowls Workshop', title_en = 'Sound Bowls Workshop'
  where start_at = '2026-07-17T14:00:00+03:00' and title_et = 'Sound Bowls Workshop · Amit Kothari'
  and stage_id = (select id from stages where slug = 'lounge');

with p as (select id from performances where start_at = '2026-07-17T14:00:00+03:00' and title_et = 'Runic Journey · Kadri Maasikmets'
  and stage_id = (select id from stages where slug = 'sauna'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'kadri-maasikmets'), 0 from p
on conflict do nothing;
update performances set title_et = 'Runic Journey', title_en = 'Runic Journey'
  where start_at = '2026-07-17T14:00:00+03:00' and title_et = 'Runic Journey · Kadri Maasikmets'
  and stage_id = (select id from stages where slug = 'sauna');

with p as (select id from performances where start_at = '2026-07-17T15:00:00+03:00' and title_et = 'Killing Sinatra'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'killing-sinatra'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T15:00:00+03:00' and title_et = 'Killing Sinatra'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-17T15:00:00+03:00' and title_et = 'Maris Pihlap'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'maris-pihlap'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T15:00:00+03:00' and title_et = 'Maris Pihlap'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-17T15:15:00+03:00' and title_et = 'Vaiblab · Erki Veiko & Taavi Mikomägi'
  and stage_id = (select id from stages where slug = 'sauna'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'erki-veiko'), 0 from p
union all
select p.id, (select id from artists where slug = 'taavi-mikomagi'), 10 from p
on conflict do nothing;
update performances set title_et = 'Vaiblab', title_en = 'Vaiblab'
  where start_at = '2026-07-17T15:15:00+03:00' and title_et = 'Vaiblab · Erki Veiko & Taavi Mikomägi'
  and stage_id = (select id from stages where slug = 'sauna');

with p as (select id from performances where start_at = '2026-07-17T15:00:00+03:00' and title_et = 'Bound to Play · Sayako Shiratori, SeiRa, Akie Doi'
  and stage_id = (select id from stages where slug = 'village'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'sayako-shiratori'), 0 from p
union all
select p.id, (select id from artists where slug = 'seira'), 10 from p
union all
select p.id, (select id from artists where slug = 'akie-doi'), 20 from p
on conflict do nothing;
update performances set title_et = 'Bound to Play', title_en = 'Bound to Play'
  where start_at = '2026-07-17T15:00:00+03:00' and title_et = 'Bound to Play · Sayako Shiratori, SeiRa, Akie Doi'
  and stage_id = (select id from stages where slug = 'village');

with p as (select id from performances where start_at = '2026-07-17T15:30:00+03:00' and title_et = 'Partner yoga & Thai massaaž · Triinu Jõhve × Risto Tatarmäe'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'triinu-johve'), 0 from p
union all
select p.id, (select id from artists where slug = 'risto-tatarmae'), 10 from p
on conflict do nothing;
update performances set title_et = 'Partner yoga & Thai massaaž', title_en = 'Partner yoga & Thai massaaž'
  where start_at = '2026-07-17T15:30:00+03:00' and title_et = 'Partner yoga & Thai massaaž · Triinu Jõhve × Risto Tatarmäe'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-17T16:00:00+03:00' and title_et = 'L.Lukyann b2b Icahera'
  and stage_id = (select id from stages where slug = 'emalava'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'l-lukyann-b2b-icahera'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T16:00:00+03:00' and title_et = 'L.Lukyann b2b Icahera'
  and stage_id = (select id from stages where slug = 'emalava');

with p as (select id from performances where start_at = '2026-07-17T16:00:00+03:00' and title_et = 'Majestim'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'majestim'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T16:00:00+03:00' and title_et = 'Majestim'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-17T16:00:00+03:00' and title_et = 'Low-keys'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'low-keys'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T16:00:00+03:00' and title_et = 'Low-keys'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-17T16:00:00+03:00' and title_et = 'Body Matter · Alan Schacher (AUS)'
  and stage_id = (select id from stages where slug = 'village'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'alan-schacher'), 0 from p
on conflict do nothing;
update performances set title_et = 'Body Matter', title_en = 'Body Matter'
  where start_at = '2026-07-17T16:00:00+03:00' and title_et = 'Body Matter · Alan Schacher (AUS)'
  and stage_id = (select id from stages where slug = 'village');

with p as (select id from performances where start_at = '2026-07-17T16:30:00+03:00' and title_et = 'Firejose'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'firejose'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T16:30:00+03:00' and title_et = 'Firejose'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-17T17:00:00+03:00' and title_et = 'Yohan'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'yohan'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T17:00:00+03:00' and title_et = 'Yohan'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-17T17:00:00+03:00' and title_et = 'Mava'
  and stage_id = (select id from stages where slug = 'terrace'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'mava'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T17:00:00+03:00' and title_et = 'Mava'
  and stage_id = (select id from stages where slug = 'terrace');

with p as (select id from performances where start_at = '2026-07-17T17:00:00+03:00' and title_et = 'Make Like a Tree Sound Workshop · Sergey Onischenko'
  and stage_id = (select id from stages where slug = 'village'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'sergey-onischenko'), 0 from p
on conflict do nothing;
update performances set title_et = 'Make Like a Tree Sound Workshop', title_en = 'Make Like a Tree Sound Workshop'
  where start_at = '2026-07-17T17:00:00+03:00' and title_et = 'Make Like a Tree Sound Workshop · Sergey Onischenko'
  and stage_id = (select id from stages where slug = 'village');

with p as (select id from performances where start_at = '2026-07-17T18:00:00+03:00' and title_et = 'Icahera'
  and stage_id = (select id from stages where slug = 'emalava'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'icahera'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T18:00:00+03:00' and title_et = 'Icahera'
  and stage_id = (select id from stages where slug = 'emalava');

with p as (select id from performances where start_at = '2026-07-17T18:00:00+03:00' and title_et = 'Qba'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'qba'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T18:00:00+03:00' and title_et = 'Qba'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-17T18:00:00+03:00' and title_et = 'Soundy'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'soundy'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T18:00:00+03:00' and title_et = 'Soundy'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-17T18:00:00+03:00' and title_et = 'Jorma Õis & Uku Legal'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'jorma-ois'), 0 from p
union all
select p.id, (select id from artists where slug = 'uku-legal'), 10 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T18:00:00+03:00' and title_et = 'Jorma Õis & Uku Legal'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-17T19:00:00+03:00' and title_et = 'L.Eazy'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'l-eazy'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T19:00:00+03:00' and title_et = 'L.Eazy'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-17T19:00:00+03:00' and title_et = 'Sauna whacking · Silver'
  and stage_id = (select id from stages where slug = 'sauna'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'silver'), 0 from p
on conflict do nothing;
update performances set title_et = 'Sauna whacking', title_en = 'Sauna whacking'
  where start_at = '2026-07-17T19:00:00+03:00' and title_et = 'Sauna whacking · Silver'
  and stage_id = (select id from stages where slug = 'sauna');

with p as (select id from performances where start_at = '2026-07-17T19:00:00+03:00' and title_et = 'Sauna whacking · Alo'
  and stage_id = (select id from stages where slug = 'sauna'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'alo'), 0 from p
on conflict do nothing;
update performances set title_et = 'Sauna whacking', title_en = 'Sauna whacking'
  where start_at = '2026-07-17T19:00:00+03:00' and title_et = 'Sauna whacking · Alo'
  and stage_id = (select id from stages where slug = 'sauna');

with p as (select id from performances where start_at = '2026-07-17T19:30:00+03:00' and title_et = 'Raul Ojamaa × Maris Pihlap'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'raul-ojamaa'), 0 from p
union all
select p.id, (select id from artists where slug = 'maris-pihlap'), 10 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T19:30:00+03:00' and title_et = 'Raul Ojamaa × Maris Pihlap'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-17T20:00:00+03:00' and title_et = 'B2B2B2B2B'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'b2b2b2b2b'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T20:00:00+03:00' and title_et = 'B2B2B2B2B'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-17T20:00:00+03:00' and title_et = 'Susanna Raiend'
  and stage_id = (select id from stages where slug = 'emalava'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'susanna-raiend'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T20:00:00+03:00' and title_et = 'Susanna Raiend'
  and stage_id = (select id from stages where slug = 'emalava');

with p as (select id from performances where start_at = '2026-07-17T20:00:00+03:00' and title_et = 'Tõnu Tubli Trio'
  and stage_id = (select id from stages where slug = 'forest'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'tonu-tubli-trio'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T20:00:00+03:00' and title_et = 'Tõnu Tubli Trio'
  and stage_id = (select id from stages where slug = 'forest');

with p as (select id from performances where start_at = '2026-07-17T20:00:00+03:00' and title_et = 'To-Sha'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'to-sha'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T20:00:00+03:00' and title_et = 'To-Sha'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-17T20:00:00+03:00' and title_et = 'Annemai'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'annemai'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T20:00:00+03:00' and title_et = 'Annemai'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-17T20:00:00+03:00' and title_et = 'Gojnea76 RO'
  and stage_id = (select id from stages where slug = 'terrace'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'gojnea76'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T20:00:00+03:00' and title_et = 'Gojnea76 RO'
  and stage_id = (select id from stages where slug = 'terrace');

with p as (select id from performances where start_at = '2026-07-17T20:00:00+03:00' and title_et = 'Sauna orchestra · Rauno Vaher & co'
  and stage_id = (select id from stages where slug = 'sauna'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'rauno-vaher-co'), 0 from p
on conflict do nothing;
update performances set title_et = 'Sauna orchestra', title_en = 'Sauna orchestra'
  where start_at = '2026-07-17T20:00:00+03:00' and title_et = 'Sauna orchestra · Rauno Vaher & co'
  and stage_id = (select id from stages where slug = 'sauna');

with p as (select id from performances where start_at = '2026-07-17T21:00:00+03:00' and title_et = 'Killing Sinatra'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'killing-sinatra'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T21:00:00+03:00' and title_et = 'Killing Sinatra'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-17T21:30:00+03:00' and title_et = 'Obadu HU'
  and stage_id = (select id from stages where slug = 'forest'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'obadu'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T21:30:00+03:00' and title_et = 'Obadu HU'
  and stage_id = (select id from stages where slug = 'forest');

with p as (select id from performances where start_at = '2026-07-17T22:00:00+03:00' and title_et = 'Silica'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'silica'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T22:00:00+03:00' and title_et = 'Silica'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-17T22:00:00+03:00' and title_et = 'Ajukaja'
  and stage_id = (select id from stages where slug = 'emalava'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'ajukaja'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T22:00:00+03:00' and title_et = 'Ajukaja'
  and stage_id = (select id from stages where slug = 'emalava');

with p as (select id from performances where start_at = '2026-07-17T22:00:00+03:00' and title_et = 'Majestim b2b Yohan'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'majestim-b2b-yohan'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T22:00:00+03:00' and title_et = 'Majestim b2b Yohan'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-17T22:00:00+03:00' and title_et = 'Meelis Vili'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'meelis-vili'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T22:00:00+03:00' and title_et = 'Meelis Vili'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-17T22:00:00+03:00' and title_et = 'Rando Sulg'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'rando-sulg'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T22:00:00+03:00' and title_et = 'Rando Sulg'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-17T23:00:00+03:00' and title_et = 'SØREN UA'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 's-ren'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T23:00:00+03:00' and title_et = 'SØREN UA'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-17T23:00:00+03:00' and title_et = 'Ken Kuusk'
  and stage_id = (select id from stages where slug = 'forest'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'ken-kuusk'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-17T23:00:00+03:00' and title_et = 'Ken Kuusk'
  and stage_id = (select id from stages where slug = 'forest');

with p as (select id from performances where start_at = '2026-07-18T00:00:00+03:00' and title_et = 'EHTE'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'ehte'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T00:00:00+03:00' and title_et = 'EHTE'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-18T01:00:00+03:00' and title_et = 'Haigla Pidu'
  and stage_id = (select id from stages where slug = 'emalava'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'haigla-pidu'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T01:00:00+03:00' and title_et = 'Haigla Pidu'
  and stage_id = (select id from stages where slug = 'emalava');

with p as (select id from performances where start_at = '2026-07-18T00:00:00+03:00' and title_et = 'Qba & L.Eazy & To-Sha'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'qba'), 0 from p
union all
select p.id, (select id from artists where slug = 'l-eazy'), 10 from p
union all
select p.id, (select id from artists where slug = 'to-sha'), 20 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T00:00:00+03:00' and title_et = 'Qba & L.Eazy & To-Sha'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-18T00:00:00+03:00' and title_et = 'Nico Stojan DE'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'nico-stojan'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T00:00:00+03:00' and title_et = 'Nico Stojan DE'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-18T00:00:00+03:00' and title_et = 'Tomoki Tamura JP'
  and stage_id = (select id from stages where slug = 'terrace'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'tomoki-tamura'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T00:00:00+03:00' and title_et = 'Tomoki Tamura JP'
  and stage_id = (select id from stages where slug = 'terrace');

with p as (select id from performances where start_at = '2026-07-18T01:00:00+03:00' and title_et = 'Dr.PhilGood'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'dr-philgood'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T01:00:00+03:00' and title_et = 'Dr.PhilGood'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-18T01:00:00+03:00' and title_et = 'White Rabbit FI'
  and stage_id = (select id from stages where slug = 'forest'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'white-rabbit'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T01:00:00+03:00' and title_et = 'White Rabbit FI'
  and stage_id = (select id from stages where slug = 'forest');

with p as (select id from performances where start_at = '2026-07-18T01:00:00+03:00' and title_et = 'Micaxan'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'micaxan'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T01:00:00+03:00' and title_et = 'Micaxan'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-18T02:00:00+03:00' and title_et = 'Kasper G FI'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'kasper-g'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T02:00:00+03:00' and title_et = 'Kasper G FI'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-18T02:00:00+03:00' and title_et = 'Hurmet Ilus & Janno Kekkonen'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'hurmet-ilus'), 0 from p
union all
select p.id, (select id from artists where slug = 'janno-kekkonen'), 10 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T02:00:00+03:00' and title_et = 'Hurmet Ilus & Janno Kekkonen'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-18T03:00:00+03:00' and title_et = 'Jimmi King UK'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'jimmi-king'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T03:00:00+03:00' and title_et = 'Jimmi King UK'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-18T03:00:00+03:00' and title_et = 'Jaan b2b Tanel'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'jaan-b2b-tanel'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T03:00:00+03:00' and title_et = 'Jaan b2b Tanel'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-18T04:00:00+03:00' and title_et = 'Alvar FI'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'alvar'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T04:00:00+03:00' and title_et = 'Alvar FI'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-18T05:00:00+03:00' and title_et = 'B2B2B2B2B'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'b2b2b2b2b'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T05:00:00+03:00' and title_et = 'B2B2B2B2B'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-18T11:15:00+03:00' and title_et = 'Sun Salutation & Tai Chi · Maria Naur'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'maria-naur'), 0 from p
on conflict do nothing;
update performances set title_et = 'Sun Salutation & Tai Chi', title_en = 'Sun Salutation & Tai Chi'
  where start_at = '2026-07-18T11:15:00+03:00' and title_et = 'Sun Salutation & Tai Chi · Maria Naur'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-18T11:30:00+03:00' and title_et = 'Morning yoga · Gina Bergmann'
  and stage_id = (select id from stages where slug = 'lounge'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'gina-bergmann'), 0 from p
on conflict do nothing;
update performances set title_et = 'Morning yoga', title_en = 'Morning yoga'
  where start_at = '2026-07-18T11:30:00+03:00' and title_et = 'Morning yoga · Gina Bergmann'
  and stage_id = (select id from stages where slug = 'lounge');

with p as (select id from performances where start_at = '2026-07-18T11:30:00+03:00' and title_et = 'Saunachill · Hanneloore'
  and stage_id = (select id from stages where slug = 'sauna'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'hanneloore'), 0 from p
on conflict do nothing;
update performances set title_et = 'Saunachill', title_en = 'Saunachill'
  where start_at = '2026-07-18T11:30:00+03:00' and title_et = 'Saunachill · Hanneloore'
  and stage_id = (select id from stages where slug = 'sauna');

with p as (select id from performances where start_at = '2026-07-18T12:00:00+03:00' and title_et = 'DJ Quest, Paul Oja'
  and stage_id = (select id from stages where slug = 'foodstep'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'dj-quest'), 0 from p
union all
select p.id, (select id from artists where slug = 'paul-oja'), 10 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T12:00:00+03:00' and title_et = 'DJ Quest, Paul Oja'
  and stage_id = (select id from stages where slug = 'foodstep');

with p as (select id from performances where start_at = '2026-07-18T12:00:00+03:00' and title_et = 'Herbal smudge stick workshop · Gloria Soobik, Kristin Lants, Liina Suur'
  and stage_id = (select id from stages where slug = 'forest-day'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'gloria-soobik'), 0 from p
union all
select p.id, (select id from artists where slug = 'kristin-lants'), 10 from p
union all
select p.id, (select id from artists where slug = 'liina-suur'), 20 from p
on conflict do nothing;
update performances set title_et = 'Herbal smudge stick workshop', title_en = 'Herbal smudge stick workshop'
  where start_at = '2026-07-18T12:00:00+03:00' and title_et = 'Herbal smudge stick workshop · Gloria Soobik, Kristin Lants, Liina Suur'
  and stage_id = (select id from stages where slug = 'forest-day');

with p as (select id from performances where start_at = '2026-07-18T12:00:00+03:00' and title_et = 'Dima b2b Raz RO'
  and stage_id = (select id from stages where slug = 'terrace'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'dima-b2b-raz'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T12:00:00+03:00' and title_et = 'Dima b2b Raz RO'
  and stage_id = (select id from stages where slug = 'terrace');

with p as (select id from performances where start_at = '2026-07-18T12:30:00+03:00' and title_et = 'Sound Journey · Amit Kothari'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'amit-kothari'), 0 from p
on conflict do nothing;
update performances set title_et = 'Sound Journey', title_en = 'Sound Journey'
  where start_at = '2026-07-18T12:30:00+03:00' and title_et = 'Sound Journey · Amit Kothari'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-18T12:45:00+03:00' and title_et = 'Meditation journey · Anete Juurik'
  and stage_id = (select id from stages where slug = 'lounge'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'anete-juurik'), 0 from p
on conflict do nothing;
update performances set title_et = 'Meditation journey', title_en = 'Meditation journey'
  where start_at = '2026-07-18T12:45:00+03:00' and title_et = 'Meditation journey · Anete Juurik'
  and stage_id = (select id from stages where slug = 'lounge');

with p as (select id from performances where start_at = '2026-07-18T13:00:00+03:00' and title_et = 'Teetseremoonia · Sophie Dragunevits, Liina Suur'
  and stage_id = (select id from stages where slug = 'forest-day'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'sophie-dragunevits'), 0 from p
union all
select p.id, (select id from artists where slug = 'liina-suur'), 10 from p
on conflict do nothing;
update performances set title_et = 'Teetseremoonia', title_en = 'Teetseremoonia'
  where start_at = '2026-07-18T13:00:00+03:00' and title_et = 'Teetseremoonia · Sophie Dragunevits, Liina Suur'
  and stage_id = (select id from stages where slug = 'forest-day');

with p as (select id from performances where start_at = '2026-07-18T13:00:00+03:00' and title_et = 'Hydrosol · Silver'
  and stage_id = (select id from stages where slug = 'sauna'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'silver'), 0 from p
on conflict do nothing;
update performances set title_et = 'Hydrosol', title_en = 'Hydrosol'
  where start_at = '2026-07-18T13:00:00+03:00' and title_et = 'Hydrosol · Silver'
  and stage_id = (select id from stages where slug = 'sauna');

with p as (select id from performances where start_at = '2026-07-18T13:15:00+03:00' and title_et = 'A moment for yourself · Teresa & Grete'
  and stage_id = (select id from stages where slug = 'sauna'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'teresa'), 0 from p
union all
select p.id, (select id from artists where slug = 'grete'), 10 from p
on conflict do nothing;
update performances set title_et = 'A moment for yourself', title_en = 'A moment for yourself'
  where start_at = '2026-07-18T13:15:00+03:00' and title_et = 'A moment for yourself · Teresa & Grete'
  and stage_id = (select id from stages where slug = 'sauna');

with p as (select id from performances where start_at = '2026-07-18T13:45:00+03:00' and title_et = 'fluidUS · Gert Reinberg'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'gert-reinberg'), 0 from p
on conflict do nothing;
update performances set title_et = 'fluidUS', title_en = 'fluidUS'
  where start_at = '2026-07-18T13:45:00+03:00' and title_et = 'fluidUS · Gert Reinberg'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-18T14:00:00+03:00' and title_et = '5 Tibetan rites & yoga nidra · Juhan Mikkor'
  and stage_id = (select id from stages where slug = 'lounge'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'juhan-mikkor'), 0 from p
on conflict do nothing;
update performances set title_et = '5 Tibetan rites & yoga nidra', title_en = '5 Tibetan rites & yoga nidra'
  where start_at = '2026-07-18T14:00:00+03:00' and title_et = '5 Tibetan rites & yoga nidra · Juhan Mikkor'
  and stage_id = (select id from stages where slug = 'lounge');

with p as (select id from performances where start_at = '2026-07-18T14:30:00+03:00' and title_et = 'Runic Journey · Kadri Maasikmets & Hanneloore'
  and stage_id = (select id from stages where slug = 'sauna'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'kadri-maasikmets'), 0 from p
union all
select p.id, (select id from artists where slug = 'hanneloore'), 10 from p
on conflict do nothing;
update performances set title_et = 'Runic Journey', title_en = 'Runic Journey'
  where start_at = '2026-07-18T14:30:00+03:00' and title_et = 'Runic Journey · Kadri Maasikmets & Hanneloore'
  and stage_id = (select id from stages where slug = 'sauna');

with p as (select id from performances where start_at = '2026-07-18T15:00:00+03:00' and title_et = 'Stenisluv'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'stenisluv'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T15:00:00+03:00' and title_et = 'Stenisluv'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-18T15:30:00+03:00' and title_et = 'Blindfold dance · Denis Vinogradov'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'denis-vinogradov'), 0 from p
on conflict do nothing;
update performances set title_et = 'Blindfold dance', title_en = 'Blindfold dance'
  where start_at = '2026-07-18T15:30:00+03:00' and title_et = 'Blindfold dance · Denis Vinogradov'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-18T16:00:00+03:00' and title_et = 'Roma Vjazemski'
  and stage_id = (select id from stages where slug = 'emalava'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'roma-vjazemski'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T16:00:00+03:00' and title_et = 'Roma Vjazemski'
  and stage_id = (select id from stages where slug = 'emalava');

with p as (select id from performances where start_at = '2026-07-18T16:00:00+03:00' and title_et = 'Arto b2b klmn'
  and stage_id = (select id from stages where slug = 'terrace'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'arto-b2b-klmn'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T16:00:00+03:00' and title_et = 'Arto b2b klmn'
  and stage_id = (select id from stages where slug = 'terrace');

with p as (select id from performances where start_at = '2026-07-18T16:30:00+03:00' and title_et = 'britiimpeerium'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'britiimpeerium'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T16:30:00+03:00' and title_et = 'britiimpeerium'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-18T17:15:00+03:00' and title_et = 'Sauna orchestra · Rauno Vaher & co'
  and stage_id = (select id from stages where slug = 'sauna'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'rauno-vaher-co'), 0 from p
on conflict do nothing;
update performances set title_et = 'Sauna orchestra', title_en = 'Sauna orchestra'
  where start_at = '2026-07-18T17:15:00+03:00' and title_et = 'Sauna orchestra · Rauno Vaher & co'
  and stage_id = (select id from stages where slug = 'sauna');

with p as (select id from performances where start_at = '2026-07-18T18:00:00+03:00' and title_et = 'Ellen Vene'
  and stage_id = (select id from stages where slug = 'emalava'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'ellen-vene'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T18:00:00+03:00' and title_et = 'Ellen Vene'
  and stage_id = (select id from stages where slug = 'emalava');

with p as (select id from performances where start_at = '2026-07-18T18:00:00+03:00' and title_et = 'SASSBASS'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'sassbass'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T18:00:00+03:00' and title_et = 'SASSBASS'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-18T18:00:00+03:00' and title_et = 'Johannes Hõimoja'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'johannes-hoimoja'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T18:00:00+03:00' and title_et = 'Johannes Hõimoja'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-18T19:00:00+03:00' and title_et = 'Sauna for friends · Silver'
  and stage_id = (select id from stages where slug = 'sauna'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'silver'), 0 from p
on conflict do nothing;
update performances set title_et = 'Sauna for friends', title_en = 'Sauna for friends'
  where start_at = '2026-07-18T19:00:00+03:00' and title_et = 'Sauna for friends · Silver'
  and stage_id = (select id from stages where slug = 'sauna');

with p as (select id from performances where start_at = '2026-07-18T19:30:00+03:00' and title_et = 'Olivar'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'olivar'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T19:30:00+03:00' and title_et = 'Olivar'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-18T19:30:00+03:00' and title_et = 'B2B2B2B'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'b2b2b2b'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T19:30:00+03:00' and title_et = 'B2B2B2B'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-18T20:00:00+03:00' and title_et = 'KASK'
  and stage_id = (select id from stages where slug = 'emalava'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'kask'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T20:00:00+03:00' and title_et = 'KASK'
  and stage_id = (select id from stages where slug = 'emalava');

with p as (select id from performances where start_at = '2026-07-18T20:00:00+03:00' and title_et = 'NORO AM'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'noro'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T20:00:00+03:00' and title_et = 'NORO AM'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-18T20:00:00+03:00' and title_et = 'Silat Beksi UA'
  and stage_id = (select id from stages where slug = 'terrace'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'silat-beksi'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T20:00:00+03:00' and title_et = 'Silat Beksi UA'
  and stage_id = (select id from stages where slug = 'terrace');

with p as (select id from performances where start_at = '2026-07-18T20:30:00+03:00' and title_et = 'Veikko Kasak'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'veikko-kasak'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T20:30:00+03:00' and title_et = 'Veikko Kasak'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-18T20:30:00+03:00' and title_et = 'Jo-L'
  and stage_id = (select id from stages where slug = 'forest'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'jo-l'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T20:30:00+03:00' and title_et = 'Jo-L'
  and stage_id = (select id from stages where slug = 'forest');

with p as (select id from performances where start_at = '2026-07-18T20:30:00+03:00' and title_et = 'THING'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'thing'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T20:30:00+03:00' and title_et = 'THING'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-18T21:00:00+03:00' and title_et = 'DJ WUF FI'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'dj-wuf'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T21:00:00+03:00' and title_et = 'DJ WUF FI'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-18T21:30:00+03:00' and title_et = 'Sound In Noise'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'sound-in-noise'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T21:30:00+03:00' and title_et = 'Sound In Noise'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-18T22:00:00+03:00' and title_et = 'Nikolajev'
  and stage_id = (select id from stages where slug = 'emalava'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'nikolajev'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T22:00:00+03:00' and title_et = 'Nikolajev'
  and stage_id = (select id from stages where slug = 'emalava');

with p as (select id from performances where start_at = '2026-07-18T22:00:00+03:00' and title_et = 'PANDHORA FR'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'pandhora'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T22:00:00+03:00' and title_et = 'PANDHORA FR'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-18T22:30:00+03:00' and title_et = 'Jozels'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'jozels'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T22:30:00+03:00' and title_et = 'Jozels'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-18T22:30:00+03:00' and title_et = 'L.A.O.S FI'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'l-a-o-s'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-18T22:30:00+03:00' and title_et = 'L.A.O.S FI'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-19T00:15:00+03:00' and title_et = 'MHKL'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'mhkl'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T00:15:00+03:00' and title_et = 'MHKL'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-19T00:15:00+03:00' and title_et = 'Joni DJ b2b Denzel FI'
  and stage_id = (select id from stages where slug = 'emalava'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'joni-dj-b2b-denzel'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T00:15:00+03:00' and title_et = 'Joni DJ b2b Denzel FI'
  and stage_id = (select id from stages where slug = 'emalava');

with p as (select id from performances where start_at = '2026-07-19T00:15:00+03:00' and title_et = 'OOPUS'
  and stage_id = (select id from stages where slug = 'forest'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'oopus'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T00:15:00+03:00' and title_et = 'OOPUS'
  and stage_id = (select id from stages where slug = 'forest');

with p as (select id from performances where start_at = '2026-07-19T00:15:00+03:00' and title_et = 'NCT FI'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'nct'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T00:15:00+03:00' and title_et = 'NCT FI'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-19T00:15:00+03:00' and title_et = 'ileevi b2b Anette FI'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'ileevi-b2b-anette'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T00:15:00+03:00' and title_et = 'ileevi b2b Anette FI'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-19T00:15:00+03:00' and title_et = 'REQTEQ AM'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'reqteq'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T00:15:00+03:00' and title_et = 'REQTEQ AM'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-19T00:15:00+03:00' and title_et = 'E.lina UA'
  and stage_id = (select id from stages where slug = 'terrace'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'e-lina'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T00:15:00+03:00' and title_et = 'E.lina UA'
  and stage_id = (select id from stages where slug = 'terrace');

with p as (select id from performances where start_at = '2026-07-19T01:30:00+03:00' and title_et = 'Paula'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'paula'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T01:30:00+03:00' and title_et = 'Paula'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-19T01:30:00+03:00' and title_et = 'Adel Force'
  and stage_id = (select id from stages where slug = 'forest'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'adel-force'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T01:30:00+03:00' and title_et = 'Adel Force'
  and stage_id = (select id from stages where slug = 'forest');

with p as (select id from performances where start_at = '2026-07-19T02:00:00+03:00' and title_et = 'Vasall Club'
  and stage_id = (select id from stages where slug = 'emalava'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'vasall-club'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T02:00:00+03:00' and title_et = 'Vasall Club'
  and stage_id = (select id from stages where slug = 'emalava');

with p as (select id from performances where start_at = '2026-07-19T02:00:00+03:00' and title_et = 'Deep Ändi FI'
  and stage_id = (select id from stages where slug = 'pier'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'deep-andi'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T02:00:00+03:00' and title_et = 'Deep Ändi FI'
  and stage_id = (select id from stages where slug = 'pier');

with p as (select id from performances where start_at = '2026-07-19T02:00:00+03:00' and title_et = 'Rony Rex FI'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'rony-rex'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T02:00:00+03:00' and title_et = 'Rony Rex FI'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-19T02:00:00+03:00' and title_et = 'Ivo Naries'
  and stage_id = (select id from stages where slug = 'sunset'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'ivo-naries'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T02:00:00+03:00' and title_et = 'Ivo Naries'
  and stage_id = (select id from stages where slug = 'sunset');

with p as (select id from performances where start_at = '2026-07-19T03:00:00+03:00' and title_et = 'Paap & Taavet'
  and stage_id = (select id from stages where slug = 'dome'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'paap'), 0 from p
union all
select p.id, (select id from artists where slug = 'taavet'), 10 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T03:00:00+03:00' and title_et = 'Paap & Taavet'
  and stage_id = (select id from stages where slug = 'dome');

with p as (select id from performances where start_at = '2026-07-19T03:00:00+03:00' and title_et = 'Lempi b2b Rony Rex FI'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'lempi-b2b-rony-rex'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T03:00:00+03:00' and title_et = 'Lempi b2b Rony Rex FI'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-19T04:00:00+03:00' and title_et = 'Lempi FI'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'lempi'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T04:00:00+03:00' and title_et = 'Lempi FI'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-19T05:00:00+03:00' and title_et = 'B2B2B2B'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'b2b2b2b'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T05:00:00+03:00' and title_et = 'B2B2B2B'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-18T12:00:00+03:00' and title_et = 'Wake, Tube, SUP, Kayak · Aleks Valdna'
  and stage_id = (select id from stages where slug = 'port'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'aleks-valdna'), 0 from p
on conflict do nothing;
update performances set title_et = 'Wake, Tube, SUP, Kayak', title_en = 'Wake, Tube, SUP, Kayak'
  where start_at = '2026-07-18T12:00:00+03:00' and title_et = 'Wake, Tube, SUP, Kayak · Aleks Valdna'
  and stage_id = (select id from stages where slug = 'port');

with p as (select id from performances where start_at = '2026-07-18T15:00:00+03:00' and title_et = 'The Sound of Your Eyes · Ursula Maria Probst'
  and stage_id = (select id from stages where slug = 'village'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'ursula-maria-probst'), 0 from p
on conflict do nothing;
update performances set title_et = 'The Sound of Your Eyes', title_en = 'The Sound of Your Eyes'
  where start_at = '2026-07-18T15:00:00+03:00' and title_et = 'The Sound of Your Eyes · Ursula Maria Probst'
  and stage_id = (select id from stages where slug = 'village');

with p as (select id from performances where start_at = '2026-07-18T16:00:00+03:00' and title_et = 'Sound workshop · Vladimir Pavluk'
  and stage_id = (select id from stages where slug = 'village'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'vladimir-pavluk'), 0 from p
on conflict do nothing;
update performances set title_et = 'Sound workshop', title_en = 'Sound workshop'
  where start_at = '2026-07-18T16:00:00+03:00' and title_et = 'Sound workshop · Vladimir Pavluk'
  and stage_id = (select id from stages where slug = 'village');

with p as (select id from performances where start_at = '2026-07-19T12:00:00+03:00' and title_et = 'Will b2b Löukii'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'will-b2b-loukii'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T12:00:00+03:00' and title_et = 'Will b2b Löukii'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-19T12:00:00+03:00' and title_et = 'TIKS DJs — Peeter Ehala, Sander Mölder, Joshua Stephenz Fieldz'
  and stage_id = (select id from stages where slug = 'terrass'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'peeter-ehala'), 0 from p
union all
select p.id, (select id from artists where slug = 'sander-molder'), 10 from p
union all
select p.id, (select id from artists where slug = 'joshua-stephenz-fieldz'), 20 from p
on conflict do nothing;
update performances set title_et = 'TIKS DJs', title_en = 'TIKS DJs'
  where start_at = '2026-07-19T12:00:00+03:00' and title_et = 'TIKS DJs — Peeter Ehala, Sander Mölder, Joshua Stephenz Fieldz'
  and stage_id = (select id from stages where slug = 'terrass');

with p as (select id from performances where start_at = '2026-07-19T12:30:00+03:00' and title_et = 'A Farewell steam & chill · Rauno Vaher & co'
  and stage_id = (select id from stages where slug = 'sauna'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'rauno-vaher-co'), 0 from p
on conflict do nothing;
update performances set title_et = 'A Farewell steam & chill', title_en = 'A Farewell steam & chill'
  where start_at = '2026-07-19T12:30:00+03:00' and title_et = 'A Farewell steam & chill · Rauno Vaher & co'
  and stage_id = (select id from stages where slug = 'sauna');

with p as (select id from performances where start_at = '2026-07-19T13:00:00+03:00' and title_et = 'Sunday recovery yoga · Kristjan Uder'
  and stage_id = (select id from stages where slug = 'lounge'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'kristjan-uder'), 0 from p
on conflict do nothing;
update performances set title_et = 'Sunday recovery yoga', title_en = 'Sunday recovery yoga'
  where start_at = '2026-07-19T13:00:00+03:00' and title_et = 'Sunday recovery yoga · Kristjan Uder'
  and stage_id = (select id from stages where slug = 'lounge');

with p as (select id from performances where start_at = '2026-07-19T15:00:00+03:00' and title_et = 'The Big Bang · The whole gang'
  and stage_id = (select id from stages where slug = 'sauna'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'the-whole-gang'), 0 from p
on conflict do nothing;
update performances set title_et = 'The Big Bang', title_en = 'The Big Bang'
  where start_at = '2026-07-19T15:00:00+03:00' and title_et = 'The Big Bang · The whole gang'
  and stage_id = (select id from stages where slug = 'sauna');

with p as (select id from performances where start_at = '2026-07-19T15:30:00+03:00' and title_et = 'Milpak'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'milpak'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T15:30:00+03:00' and title_et = 'Milpak'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-19T17:00:00+03:00' and title_et = 'Kurly Beats'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'kurly-beats'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T17:00:00+03:00' and title_et = 'Kurly Beats'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-19T19:00:00+03:00' and title_et = 'Mira Vana DE'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'mira-vana'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-19T19:00:00+03:00' and title_et = 'Mira Vana DE'
  and stage_id = (select id from stages where slug = 'piidi');

with p as (select id from performances where start_at = '2026-07-20T00:00:00+03:00' and title_et = 'Plastik (kiimask, mrt)'
  and stage_id = (select id from stages where slug = 'piidi'))
insert into performance_artists (performance_id, artist_id, sort_order)
select p.id, (select id from artists where slug = 'plastik-kiimask-mrt'), 0 from p
on conflict do nothing;
update performances set title_et = null, title_en = null
  where start_at = '2026-07-20T00:00:00+03:00' and title_et = 'Plastik (kiimask, mrt)'
  and stage_id = (select id from stages where slug = 'piidi');
