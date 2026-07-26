# I Land Sound 2026 — kavaäpp

Festivali kava, mille külastaja avab telefonis, filtreerib alade kaupa ja
paneb ühe puutega kokku oma isikliku kava. Paigutus ja loogika on tehtud
Brella äpi eeskujul, värvid on festivali omad. Ehitatud tükkide kaupa —
valmis on tükid 1–7 ja teise faasi täiendused (hommikukiri, targem
import, massimuudatused, kava planeerija). Ehitusjärjekord on failides
i-land-sound-ehitusplaan.md ja i-land-sound-tegevuskava-faas2.md.

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
  (Google Maps), kui alale on antud GPS-koordinaadid
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
  salvestus värskendab avalikku kava kohe; Import sakk laseb
  esinemised ja esinejate andmed sisse tuua tabelina (kleebi
  Excelist/Sheetsist või .csv fail, eelvaade veakontrolliga)
- Kaart (7. tükk): festivali, Orissaare, toiduala ja glämpingu
  kaardid vahelehtedena (pildid on äpi enda failid public/kaardid
  kaustas), festivalikaardil alade punktid — puude avab nime ja
  programmi lingi. Sündmuse ja ala lehel on Google'i kaardi asemel
  festivalikaardi väljavõte ala markeriga; Google Mapsi juhiste link
  jääb autoga tulijale alles. Ala kohta kaardil nihutad adminis
  (Alad → klõpsa kaardil). Kaardilehe pealkiri on "Kaart ja info" ja
  kaartide all on "Oluline info" kaardid (kohalejõudmine, parkimine,
  majutus, märkused) — sisu tuleb event_info tabelist ja on admini
  Oluline info sakis muudetav
- Hommikukiri (faas 2): igal festivalipäeval saadab äpp tellinud
  kasutajatele meili nende tänase kavaga. Kellaaja valib korraldaja
  Meilid sakis (vaikimisi 09.00) ja iga kasutaja võib profiilis
  endale teise aja valida (06.00–14.00). Sisu ja kujunduse muudad
  adminis Meilid sakis ({{nimi}}, {{kava}} ja {{loobu_link}}
  kohatäited), "Saada testkiri mulle" nupp näitab tulemust enne päris
  saatmist. Igas kirjas on loobumislink, mis töötab ilma sisselogimata.
  Sama päeva kirja ei saadeta kellelegi kaks korda, isegi kui saatja
  käivitub mitu korda
- Targem import (faas 2): kui tabelis on esineja nimi, mida süsteemis
  pole, aga on väga sarnane olemasolevaga (nt trükiviga), pakub
  eelvaade "Kasuta: …" nuppu. Kui duplikaat siiski tekkis, liidab
  Esinejad saki "Liida teise esinejaga" tööriist kaks profiili kokku:
  esinemised, lingid ja tühjad väljad liiguvad alles jäävasse
- Massimuudatused (faas 2): Esinemised sakis saab linnukestega valida
  mitu esinemist korraga ning nihutada aegu, tõsta teisele päevale või
  alale, avaldada/peita ja kustutada ühe liigutusega
- Mitme admini kaitse (faas 2): kõik salvestused käivad rea kaupa,
  nii et eri kirjete muutmine üksteist ei sega. Kui kaks adminit
  muudavad täpselt sama kirjet korraga, kontrollib salvestus rea
  viimase muutmise ajatemplit: hilisem salvestaja saab hoiatuse
  "keegi teine muutis seda vahepeal" ja midagi ei kirjutata üle.
  Kaitse katab esinemised (vorm ja planeerija), esinejad, alad,
  olulise info ja meilimalli. Massimuudatused töötavad värske
  nimekirja pealt ja jäävad kaitseta — need on nagunii mõeldud
  ühe inimese suureks korrastuseks
- Lahkumiskaitse adminis: kui vormis (esinemine, esineja, ala,
  oluline info, meilimall) on salvestamata muudatusi, küsib äpp enne
  saki vahetust, teise kirje avamist või lehelt lahkumist üle, kas
  tahad ilma salvestamata edasi minna. Salvestamine, "Tühista
  muutmine" ja kinnitatud lahkumine võtavad hoiatuse maha
- Tõlkenupp adminis: kakskeelsete väljade (esineja bio, esinemise ja
  ala kirjeldus, olulise info sisu, meilimalli sisu) all on nupp
  "Tõlgi eesti keelest" / "Tõlgi inglise keelest", mis laseb Claude'il
  teise keele teksti tõlkida ja täidab välja. Tõlge on mustand — saad
  seda enne salvestamist vabalt muuta. Vajab ANTHROPIC_API_KEY
  keskkonnamuutujat (console.anthropic.com → API Keys; lisa Vercelisse
  ja .env.local faili). Tõlkida saab ainult admin, nii et võti on
  võõraste eest kaitstud
- Kava planeerija (faas 2): kalendrivaade nagu Google Calendar — read
  on alad, aeg jookseb paremale. Plokki lohistad hiirega (aeg liigub
  5 min sammuga, teisele reale tõstes vahetub ala), paremast servast
  venitad pikkust, klõps plokil avab muutmise, klõps tühjal kohal loob
  uue esinemise. Kattuvus samal alal saab punase raami, mustandid on
  katkendjoonega. Iga muudatus salvestub kohe
- Keeled ET ja EN (/et ja /en); admin on eestikeelne

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
   - `supabase/migrations/0006_kaardipunktid.sql` (alade stardikohad
     festivalikaardil; täpsemaks nihutad adminis)
   - `supabase/migrations/0007_failide_hoidla.sql` (piltide ja lugude
     hoidla: admin laeb esineja fotod ja mp3-d üles otse admini
     vormist, vaadata saavad kõik, üles laadida ainult adminid)
   - `supabase/migrations/0008_hommikukiri.sql` (hommikukirja mall:
     admin saab kirja sisu Meilid sakis muuta)
   - `supabase/migrations/0009_kirja_kellaaeg.sql` (hommikukirja
     kellaaeg: korraldaja vaikimisi aeg + kasutaja isiklik valik
     profiilis + topeltsaatmise tõke)
   - `supabase/migrations/0010_muutmise_ajatempel.sql` (mitme admini
     kaitse: kui kaks adminit muudavad sama kirjet korraga, ei
     kirjutata kellegi tööd vaikselt üle, vaid hilisem salvestaja
     saab hoiatuse)
   - `supabase/seed.sql` (2026 päris kava: 17 ala, 171 esinemist)
   - `supabase/seed2_esinejad.sql` (teeb pealkirjadest 160 päris
     esinejat: muusikaaladel nimed, töötubadel juhendajad; TBA jms
     jäävad pealkirjadeks. Pildid, biod ja lood lisad adminipaneelis)
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

## Hommikukirja seadistus (faas 2)

Hommikukiri vajab kolme asja: meilisaatja konto, salajased võtmed ja
Verceli ajastuse. Ilma nendeta äpp töötab tavaliselt edasi, lihtsalt
kirju ei saadeta.

1. Loo tasuta konto resend.com lehel ja võta sealt API võti
   (API Keys → Create API Key). Tasuta paketiga saab saata 100 kirja
   päevas, alguseks piisab. Kui tahad saata oma domeeni aadressilt
   (nt kava@ilandsound.ee), kinnita Resendis ka domeen; muidu läheb
   kiri testiaadressilt onboarding@resend.dev
2. Lisa neli uut keskkonnamuutujat nii Vercelisse (Settings →
   Environment Variables) kui ka oma arvuti .env.local faili:
   - `SUPABASE_SERVICE_ROLE_KEY` — Supabase Dashboard → Settings →
     API Keys → service_role. NB! See võti annab täisligipääsu
     andmebaasile, seda ei tohi kunagi panna koodi ega GitHubi,
     ainult keskkonnamuutujatesse
   - `RESEND_API_KEY` — Resendi API võti
   - `CRON_SECRET` — mõtle ise välja pikk juhuslik jada (nt 40
     märki); see kaitseb saatmise aadressi võõraste eest ja
     allkirjastab loobumislingid
   - `EMAIL_FROM` — saatja, nt `I Land Sound <kava@ilandsound.ee>`
     (võib alguses ära jätta, siis kasutatakse Resendi testiaadressi)
3. Käivita Supabase'is `supabase/migrations/0008_hommikukiri.sql` ja
   `supabase/migrations/0009_kirja_kellaaeg.sql`
   (kui sa punktis "Käivitamine" neid juba ei teinud)
4. Lisa GitHubis saladus tunnikäivitaja jaoks: repo lehel Settings →
   Secrets and variables → Actions → New repository secret. Nimi
   `CRON_SECRET`, väärtus sama, mis Vercelis. Ilma selleta töötab
   ainult Verceli enda kord-päevas-käivitus kell 09.00 ja kasutajate
   valitud kellaajad ei rakendu
5. Pushi kood GitHubi. Ajastus käib kahte kanalit pidi: Vercel
   (vercel.json, üks kord päevas, varuvariant) ja GitHubi töövoog
   (.github/workflows/hommikukiri.yml, iga tund hommikust lõunani).
   Saatja ise otsustab, kellele on parasjagu aeg kiri saata, ja peab
   meeles, kes on tänase kirja juba saanud — seepärast võib teda
   julgelt mitu korda käivitada
6. Kontrolli adminis: Meilid sakk → "Saada testkiri mulle". Kiri
   tuleb Su enda aadressile ja näitab, milline hommikukiri välja näeb

Kasutaja tellib kirja profiililehel linnukesega "Saada mulle igal
festivalihommikul minu päeva kava" ja võib sealsamas valida endale
sobiva kellaaja. Kiri läheb ainult neile, kes on linnukese pannud,
ja ainult festivalipäevadel.

NB! Resendi tasuta konto saadab enne oma domeeni kinnitamist kirju
AINULT sellele e-posti aadressile, millega Resendi konto tehtud on.
Kui testkiri annab vea "You can only send testing emails to your own
email address", ongi see põhjus: kas kinnita Resendis oma domeen
(Domains → Add domain) või logi äppi sisse sama aadressiga, millega
tegid Resendi konto.

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

## Järgmised sammud

Faas 2 on valmis (hommikukiri, targem import, massimuudatused, kava
planeerija). Enne avalikustamist tasub teha testring päris andmetega
ja turvaaudit. Vana kava arhiveerimiseks vali Esinemised sakis vana
aasta esinemised linnukestega ja vajuta Peida — profiilid ja pildid
jäävad alles järgmiseks aastaks.
