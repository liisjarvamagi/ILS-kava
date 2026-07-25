# I Land Sound 2026 — kavaäpp

Festivali kava, mille külastaja avab telefonis, filtreerib alade kaupa ja
paneb ühe puutega kokku oma isikliku kava. Paigutus ja loogika on tehtud
Brella äpi eeskujul, värvid on festivali omad. Ehitatud tükkide kaupa —
praegu on valmis tükid 1, 2, 3 ja 4 ning sisselogimise kujundus.
Ehitusjärjekord on failis i-land-sound-ehitusplaan.md.

## Mis on valmis

- Avalik kava: päevanupud kuupäevadega, päeva pealkiri, alade kaupa
  grupeeritud nimekiri, ala värvid
- Festivali ajal avaneb kava tänase päevaga (öö kuni 06.00 kuulub
  eelmise õhtu alla), muul ajal esimese päevaga
- Ajajoone vaade: kleepuv ala nimi, tunnijooned, kattuvad esinemised
  üksteise all; plokk avab detaillehe, järjehoidja on plokil olemas
- Vaate seaded: nimekiri ⇄ ajajoon, suurendus (75–150%), tihedus
- Filtrid Brella moodi: Alad, Tagid, Esinejad avanevad altpoolt
  (otsing, linnukesed, Rakenda), loendurid nuppudel, Tühjenda filtrid;
  valikud jäävad telefoni meelde
- Detaillehed: esinemine (aeg, ala, kirjeldus "Loe edasi" nupuga,
  tagid, esinejad), esineja (pilt, bio, esinemised), ala (kirjeldus,
  programm päevade kaupa); vale aadress annab 404
- Esinemise ja ala lehel on kaardi eelvaade ja "Ava juhised" nupp
  (Google Maps), kui alale on antud GPS-koordinaadid, ning "Oluline
  info" kaardid (kohalejõudmine, parkimine, majutus, märkused) —
  sisu tuleb event_info tabelist ja näidistekstid tuleb üle vaadata
- Minu kava: järjehoidjaga lisamine, eemaldamine tagasivõtmisega,
  punkt päevanupul, "Laadi kalendrisse (.ics)" nupp
- Esinejate leht (alt-menüü 5. nupp): otsing, sortimine A–Z või
  päevade kaupa, südamega lemmikud ja Kõik ⇄ Minu lemmikud filter
- Esineja lehel suur pilt, play nupp (mp3 fail mängib kohe, Spotify/
  SoundCloudi/YouTube'i link avab äpi sees mängija), sotsiaalmeedia
  ikoonid ja bio; faili mängimisel ilmub alla minimängija riba
  (pilt, nimi, loo pealkiri, paus, stopp)
- Esimesel lemmiku märkimisel avaneb sisselogimiskutse (Google,
  e-post, "Äkki hiljem") — päris sisselogimine ühendatakse 5. tükis
- Sisselogimine (5. tükk): Google või link meilile (parooli pole),
  profiililehel e-post, hommikukirja linnuke ja väljalogimine;
  sisselogimisel liidetakse telefoni kava kontoga (user_schedule),
  duplikaate ei teki ja RLS tagab, et igaüks näeb ainult enda kava
- Adminipaneel /admin (6. tükk): esinemiste vorm (ala, päev, ajad,
  esinejad otsinguga, tagid, mustand/avaldatud, kattuvuse hoiatus,
  tõlkemärgis), esinejate, alade, tagide ja olulise info haldus,
  adminite haldus e-posti järgi (superadmin). Ligipääs ainult admins
  tabelis olijatele; kirjutamise kaitseb andmebaasis RLS ja iga
  salvestus värskendab avalikku kava kohe
- Keeled ET ja EN (/et ja /en); admin on eestikeelne
- Kaart on kohatäide — tuleb 7. tükis

## Käivitamine oma arvutis

1. Ava see kaust VS Code'is
2. Terminalis: `npm install`
3. Kopeeri `.env.example` → `.env.local` ja täida Supabase väärtused
   (Supabase Dashboard → Settings → API)
4. Supabase SQL Editoris käivita järjekorras:
   - `supabase/migrations/0001_algne_skeem.sql`
   - `supabase/migrations/0002_asukohad_ja_oluline_info.sql`
     (alade GPS-koordinaadid + "Oluline info" kaardid; näidistekstid
     muuda õigeks)
   - `supabase/migrations/0003_esineja_lood.sql` (esinejate lood:
     mp3 faili või Spotify/SoundCloudi/YouTube'i lingi veerud)
   - `supabase/migrations/0004_lemmikesinejad.sql` (lemmikesinejad
     kontosse: südamed liiguvad seadmete vahel kaasa)
   - `supabase/migrations/0005_admini_funktsioonid.sql` (adminipaneeli
     funktsioonid; faili lõpus on juhis ESIMESE superadmini
     määramiseks — tee see kohe ära)
   - `supabase/seed.sql` (2026 päris kava: 17 ala, 171 esinemist)
   - `supabase/seed2_esinejad.sql` (teeb pealkirjadest 160 päris
     esinejat: muusikaaladel nimed, töötubadel juhendajad; TBA jms
     jäävad pealkirjadeks. Pildid, biod ja lood lisad Table Editoris
     artists tabelisse, kuni adminipaneel valmib)
5. `npm run dev` → ava http://localhost:3000

## Sisselogimise seadistus Supabase'is (5. tükk)

1. Authentication → URL Configuration: Site URL pane oma Verceli
   aadress (nt https://ils-kava.vercel.app) ja Redirect URLs alla
   lisa `http://localhost:3000/**` ja `https://ils-kava.vercel.app/**`
2. Link meilile töötab kohe (Email provider on vaikimisi sees).
   NB! Supabase'i sisseehitatud meilisaatja on piiratud mahuga —
   testimiseks piisab, päris kasutajate jaoks ühendame 8. tükis
   Resendi SMTP.
3. Google (valikuline, meililink töötab ka ilma): Authentication →
   Providers → Google. Vaja on Google Cloud OAuth klienti
   (console.cloud.google.com → Credentials → OAuth client ID,
   redirect aadressiks Supabase'i näidatud .../auth/v1/callback).
   Client ID ja Secret kleebi Supabase'i Google provideri alla.

## GitHubi ja Vercelisse

1. Loo GitHubis privaatne repo `ilandsound-kava`
2. Selles kaustas: `git init && git add . && git commit -m "Tükid 1-4: avalik kava, filtrid, minu kava"`
3. `git remote add origin <repo aadress>` ja `git push -u origin main`
4. Vercelis: Import project → vali repo → lisa keskkonnamuutujad
   (samad, mis .env.local) → Deploy

## Turvamärkused

- `.env.local` ei lähe kunagi GitHubi (.gitignore hoolitseb)
- Äpp kasutab ainult avalikku anon-võtit; kirjutamist kaitseb
  andmebaasis Row Level Security
- Telefoni salvestub ainult esinemiste ID-de loend, mitte isikuandmed

## Järgmised tükid

Vaata i-land-sound-ehitusplaan.md — järgmisena tükk 7 (kaart) ja
tükk 8 (hommikukiri).
