# I Land Sound kavaäpp — UX-plaan (4. faas)

## Rollid ja peamised toimingud

| Roll | Peamine toiming | Kus ja millal |
|---|---|---|
| Külastaja | vaatab kava ja lisab esinemisi enda kavva | telefonis, festivalil, kehva leviga |
| Sisseloginud külastaja | sama + kava säilib ja tuleb hommikukiri | telefonis |
| Admin | lisab ja muudab esinejaid, esinemisi, alasid, tage, meilimalle | arvutis, enne festivali ja festivali ajal |
| Superadmin (Liis) | sama + annab ja võtab admini õigusi | arvutis |

## Külastaja kasutajavoog (happy path)

1. Avab lehe → näeb kohe tänase (või esimese) päeva kava, ilma sisselogimiseta
2. Vahetab päeva ülariba sakkidest (N / R / L / P)
3. Filtreerib vajadusel: alad, tagid. Valikud jäävad telefoni meelde
4. Klõpsab esinemisel → avaneb detailivaade: aeg, ala, kirjeldus, esinejad
5. Klõpsab järjehoidja-ikooni → esinemine on "minu kavas". Sama ikoon on olemas ka otse kavavaates, ilma detaili avamata — üks klõps, nagu Brellas
6. Avab alt menüüst "Minu kava" → näeb ainult enda valikuid ajajärjekorras
7. Esimesel salvestusel kuvab äpp ühe korra sõbraliku riba: "Su kava on praegu ainult selles telefonis. Logi sisse, et see säiliks ja saaksid hommikuti oma kava meilile." Nupp + "hiljem" valik. Ei sega rohkem
8. Logib sisse (Google või e-post) → telefoni salvestatud kava tõstetakse automaatselt kontosse, midagi ei kao. Kinnitusteade: "Su kava on nüüd kontol"

## Ekraanide kaart

```
[Kava]  ← avaleht, alt-menüü 1. nupp
  ├── päeva sakid (N/R/L/P)
  ├── vaate lüliti: nimekiri ⇄ ajajoon
  ├── filtrid: alad, tagid (jäävad meelde)
  ├── [Esinemise detail]
  │     ├── + / − minu kavva
  │     ├── esinejad → [Esineja leht]
  │     └── ala → [Ala leht]
  ├── [Esineja leht]: pilt, bio, kõik tema esinemised (klõpsuga lisatavad)
  └── [Ala leht]: kirjeldus, koht kaardil, kogu ala programm päevade kaupa
[Kaart]  ← alt-menüü 2. nupp
  ├── festivali kaardipilt, alade punktid
  ├── punkti klõps → ala nimi + "vaata programmi" → [Ala leht]
  └── "näita mind" nupp → Sinu asukoht kaardil (küsib luba, jääb seadmesse)
[Minu kava]  ← alt-menüü 3. nupp
  ├── ainult enda valikud, ajajärjekorras, päevade kaupa
  ├── tühi olek: "Sul pole veel midagi kavas. Sirvi kava ja puuduta järjehoidjat"
  └── sisselogimata olekus meeldetuletusriba (mitte pealetükkiv)
[Profiil]  ← alt-menüü 4. nupp
  ├── sisselogimine / väljalogimine
  ├── keel: ET / EN
  └── linnuke: "Saada mulle igal hommikul minu päeva kava meilile"
```

Keelevahetus on ka avalehe päises (ET/EN), sest turist peab selle leidma esimese 5 sekundiga.

## Admini kasutajavoog (happy path)

Admin siseneb aadressil /admin (nähtav ainult admini rolliga, teised suunatakse avalehele).

1. Töölaud: kokkuvõte (esinemisi kokku, avaldamata mustandeid, viimati muudetud)
2. Vasakmenüü: Esinemised · Esinejad · Alad · Tagid · Meilid · Adminid (viimane ainult superadminile)
3. Kõige sagedasem töö — esinemise lisamine — on tehtud kiireks:
   - vorm ühel ekraanil: ala (rippmenüü), festivalipäev, algus- ja lõpuaeg, esinejad (otsing + mitmikvalik, uue esineja saab luua samast vormist lahkumata), tagid (klõpsatavad märgised), pealkiri ET/EN kui esinejat pole
   - salvestamisel jääb vorm lahti järgmise kirje jaoks ("salvesta ja lisa uus")
4. Esinemiste loend: filtreeritav päeva ja ala järgi, reas muudetav, mustand/avaldatud lüliti
5. Meilid: mallide loend → malli muutmine (teema ja sisu ET/EN, eelvaade, testkirja saatmine endale)
6. Adminid (superadmin): e-posti järgi lisamine, rolli valik, eemaldamine

## Kriitilised veavõimalused ja kuidas disain neid ennetab

1. **Külastaja kaotab kava telefoni vahetades** → sisselogimise soovitusriba esimesel salvestusel; sisselogimisel automaatne ühendamine
2. **Kehv levi festivalil** → viimati laetud kava jääb telefoni vahemällu ja on vaadatav ka ilma ühenduseta; muudatused sünkroniseeruvad ühenduse taastudes
3. **Admin paneb kaks esinemist samale lavale kattuvate aegadega** → vorm hoiatab kollaselt: "Sellel alal on samal ajal juba X". Ei blokeeri (vahel ongi taotluslik), aga admin näeb
4. **Admin unustab teise keele täitmata** → salvestamisel märgis "EN puudub"; loendis kollane täpp puuduva tõlke juures. Avaldada saab, aga puudujääk on nähtav
5. **Öised ajad lähevad valesse päeva** → vormis valib admin festivalipäeva eraldi; kell 00.00–06.00 aja puhul näitab vorm abiteksti "kuulub eelmise õhtu programmi alla"
6. **Kasutaja vajutab kogemata esinemise kavast välja** → toiming on kohe tagasi võetav ("Eemaldatud. Võta tagasi")
7. **Meilikirja loobumine** → igas kirjas loobumislink, mis lülitab linnukese välja ühe klõpsuga, ilma sisselogimiseta

## Vormid ja valideerimine

| Vorm | Kohustuslik | Reeglid |
|---|---|---|
| Sisselogimine e-postiga | e-post | magic link või parool ≥ 8 märki |
| Esinemine (admin) | ala, päev, algus, lõpp, vähemalt 1 esineja VÕI pealkiri | lõpp > algus; kattuvuse hoiatus |
| Esineja (admin) | nimi, slug (tekib automaatselt) | pilt valikuline, soovitatav |
| Ala (admin) | nimi ET+EN, värv | kaardikoha määramine klõpsuga kaardipildil |
| Meilimall (admin) | teema ja sisu ET+EN | eelvaade enne salvestamist |

## Mobiili erijuhud

- Külastaja pool on disainitud telefonile ees, arvuti on teisejärguline
- Alt-menüü 4 nupuga (Kava · Kaart · Minu kava · Profiil), pöidlaga ulatuv
- Ajajoone vaade keritav külgsuunas; nimekirjavaade on vaikimisi, sest see on telefonis loetavam
- Puuteala vähemalt 44 px; järjehoidja-ikoon kaardi paremas servas, kus pöial niikuinii on
- Admini pool on tehtud arvutile ees, aga töötab ka tahvlis (festivali ajal kiirmuudatused)
