# I Land Sound kavaäpp — ehitusplaan (5. faas)

Põhimõte: üks tükk lõpuni, siis järgmine. Iga tüki lõpus on kontroll "valmis tähendab" ja turvakontroll. Iga prompti sees on sõnad "cyber security", sest see vähendab turvaaukude hulka märgatavalt.

Tööjärjekord Claude Code'iga: tee iga tüki jaoks uus vestlus, anna talle see projekt ja tüki prompt. Kui tükk on valmis ja testitud, push GitHubi ja vaata Verceli preview üle. Alles siis järgmine tükk.

---

## 0. tükk — devops: keskkonna seadistus (ilma koodita)

Tee need käsitsi ära, enne kui ühtegi rida koodi kirjutatakse.

```
[ ] Loo Supabase'is 2 tasuta projekti: ilandsound-dev ja ilandsound-prod
[ ] Käivita i-land-sound-andmemudel.sql mõlemas (SQL Editor)
[ ] Kontrolli Supabase'is: Authentication → Providers → luba Email ja Google
[ ] Loo GitHubi privaatne repo: ilandsound-kava
[ ] Ühenda repo Verceliga
[ ] Loo Resendi konto (tasuta, tasulise võtad festivalikuul)
[ ] Küsi I Land Soundi tiimilt: kaardipilt (kõrge resolutsiooniga) ja
    ligipääs domeeni DNS-ile (Resendi SPF/DKIM kirjed + äpi aadress)
```

Keskkonnamuutujad (.env.local, mis on .gitignore's; samad Verceli seadetes):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   ← saladus, mitte kunagi NEXT_PUBLIC
RESEND_API_KEY=              ← saladus
NEXT_PUBLIC_APP_URL=
CRON_SECRET=                 ← juhuslik pikk sõne, kaitseb croni käivitust
```

Reegel: local ja preview kasutavad dev-projekti, production prod-projekti.

---

## 1. tükk — avalik kava (äpi süda)

Kasutajalugu: külastajana tahan näha kogu kava päevade ja lavade kaupa.

**Prompt Claude Code'ile:**
> Ehita Next.js (App Router) + Supabase + next-intl projektile avalik kavavaade. Cyber security on prioriteet. Andmemudel on failis supabase/migrations. Nõuded: päevasakid (festival_day järgi), nimekirjavaade vaikimisi, ala kaupa grupeeritud, ala värv kaardil, kellaajad, esinejate nimed. Leht renderdatakse serveris ja cache'itakse ISR-iga (revalidate tag 'schedule'), et andmebaasi ei koormataks. Ainult anon-võti, mitte service role. Keeled ET ja EN next-intl kaudu, keelevahetus päises. Mobile-first, puuteala vähemalt 44px.

**Valmis tähendab:** kava on nähtav telefonis mõlemas keeles ilma sisselogimiseta; andmed tulevad Supabase'ist; Verceli preview töötab.

**Turvakontroll:** service role võtit pole kliendikoodis; .env.local pole GitHubis; RLS lubab anon-kasutajal ainult lugeda.

---

## 2. tükk — filtrid ja ajajoone vaade

**Prompt:**
> Lisa kavavaatele alade ja tagide filtrid (valikud salvestuvad localStorage'i) ning külgsuunas keritav ajajoone vaade lülitiga nimekiri ⇄ ajajoon. Cyber security: kogu filtreerimine käib kliendipoolselt juba laetud andmete peal, mitte uute päringutega.

**Valmis tähendab:** filtrid jäävad lehe uuendamisel meelde; ajajoon näitab kattuvaid esinemisi kõrvuti nagu Brellas.

---

## 3. tükk — esinemise detail, esineja leht, ala leht

**Prompt:**
> Lisa kolm vaadet: esinemise detail (aeg, ala, kirjeldus, esinejad), esineja leht (pilt, bio, kõik tema esinemised) ja ala leht (kirjeldus, kogu programm päevade kaupa). Slug-põhised URL-id. Cyber security: valideeri slug parameetrid, 404 tundmatule slugile, ära peegelda kasutaja sisendit HTML-i.

**Valmis tähendab:** igalt kavakirjelt pääseb detaili, esinejani ja alani; kõik kakskeelne.

---

## 4. tükk — minu kava ilma kontota

**Prompt:**
> Lisa "minu kava": järjehoidjanupp igal kavakirjel ja detailivaates, valikud localStorage'is, eraldi Minu kava leht ajajärjekorras, eemaldamine tagasivõetav (toast "Võta tagasi"). Alt-menüü 4 nupuga: Kava, Kaart, Minu kava, Profiil. Esimesel salvestusel üks kord soovitusriba sisselogimise kohta. Cyber security: localStorage sisaldab ainult performance ID-sid, mitte isikuandmeid.

**Valmis tähendab:** kava salvestub ja püsib telefonis nagu Su praeguses HTML-is, aga andmed tulevad andmebaasist.

---

## 5. tükk — sisselogimine ja kava kontosse tõstmine

**Prompt:**
> Lisa Supabase Auth: Google, e-post parooliga ja magic link. Profiilileht: keel, hommikukirja linnuke, väljalogimine. Sisselogimisel tõsta localStorage'i kava user_schedule tabelisse (upsert, duplikaate ei teki) ja näita kinnitust. Cyber security on kriitiline: RLS peab tagama, et kasutaja loeb ja kirjutab ainult enda kava; auth callback kaitstud; sessioon httpOnly küpsistes.

**Valmis tähendab:** logid sisse telefonis, avad arvutis, kava on olemas. Kaks eri kasutajat ei näe teineteise kava.

**Turvakontroll:** proovi teise kasutaja user_id-ga päringut anon-võtmega — peab ebaõnnestuma.

---

## 6. tükk — adminipaneel

**Prompt:**
> Ehita /admin ala, ligipääs ainult admins tabelis olijatele (serveripoolne kontroll middleware'is, mitte ainult nupu peitmine). Cyber security on kriitiline. Vasakmenüü: Esinemised, Esinejad, Alad, Tagid, Meilid, Adminid (viimane ainult superadminile). Esinemise vorm ühel ekraanil: ala, festivalipäev, ajad, esinejate mitmikvalik otsinguga (uue esineja loomine samast vormist), tagid märgistena, ET/EN pealkirjad. "Salvesta ja lisa uus". Kattuvuse hoiatus samal alal. Puuduva tõlke kollane märgis. Mustand/avaldatud lüliti. Iga muudatus kutsub revalidateTag('schedule'), et avalik kava kohe uueneks. Öise aja abitekst (00–06 kuulub eelmise õhtu alla). Adminite haldus superadminile e-posti järgi.

**Valmis tähendab:** lisad esinemise adminis ja see ilmub avalikus kavas kohe; tavakasutaja /admin peale ei pääse.

**Turvakontroll:** sisselogimata ja tavakasutaja saavad /admin päringutele 403/redirect; kirjutamine anon-võtmega ebaõnnestub.

---

## 7. tükk — kaart

**Prompt:**
> Lisa kaardivaade: festivali kaardipilt Leafletiga (CRS.Simple, image overlay), alade punktid stages tabeli map_x/map_y järgi, punkti klõps avab ala nime ja lingi programmi. "Näita mind" nupp kasutab brauseri geolokatsiooni; kaardipildi nurkade GPS-koordinaadid seadistatakse admini alade vormis. Cyber security: asukohta ei salvestata ega saadeta serverisse, see jääb ainult seadmesse; luba küsitakse alles nupuvajutusel. Adminis: ala koha määramine klõpsuga kaardipildil.

**Valmis tähendab:** kaart avaneb, alad on õigetes kohtades, "näita mind" töötab festivalialal.

---

## 8. tükk — hommikukiri

**Prompt:**
> Lisa hommikukirja süsteem: Verceli cron (kell 09.00 Europe/Tallinn) käivitab route handleri, mis on kaitstud CRON_SECRET päisega. Handler kasutab service role võtit AINULT serveris: leiab kasutajad, kel wants_daily_email=true ja tänases kavas kirjeid, ja saadab Resendiga kirja email_templates malli järgi kasutaja keeles ({{nimi}}, {{kava}} asendused, link oma kava lehele). Igas kirjas allkirjastatud loobumislink, mis lülitab linnukese välja ilma sisselogimiseta. Adminis meilimallide muutmine eelvaate ja testkirjaga. Cyber security: rate limit, loobumislingi token ühekordne ja aeguv, service role võti ei jõua kunagi kliendini.

**Valmis tähendab:** testkiri jõuab Su postkasti (mitte spämmi), loobumislink töötab, mall on adminis muudetav.

**Turvakontroll:** croni URL ilma CRON_SECRET-ita annab 401; loobumislink ei võimalda teiste kasutajate muutmist.

---

## Pärast 8. tükki

- Lae praeguse HTML-i andmed andmebaasi (teen Sulle selleks impordiskripti, kui sinna jõuad)
- 6. faas: tester käib kõik kasutajalood süsteemselt läbi
- Enne avalikustamist: iganädalane turvaaudit (Sul on selleks eraldi skill olemas)
- Domeen, Resendi DNS-kirjed ja tasuline pakett festivalikuul
