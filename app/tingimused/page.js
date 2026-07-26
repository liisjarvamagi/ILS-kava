// Kasutustingimused ja privaatsus ühel lehel, lihtsas keeles.
// NB! Enne esimest võõrast klienti tasub tekst juristil üle lasta
// vaadata — see on aus lähtepunkt, mitte õigusbüroo toode.
export const metadata = { title: 'Tingimused ja privaatsus – Sündmuskava' };

export default function TermsPage() {
  return (
    <html lang="et">
      <body>
        <header className="header">
          <div className="header-top">
            <h1>TINGIMUSED JA PRIVAATSUS</h1>
          </div>
        </header>
        <main className="discover terms">
          <h2>Mis see teenus on</h2>
          <p>Sündmuskava on platvorm, kus sündmuste korraldajad
          avaldavad oma kava ja külastajad panevad kokku isikliku
          ajakava. Teenust haldab platvormi omanik (kontakt allpool).</p>

          <h2>Külastaja andmed</h2>
          <p>Ilma kontota kasutades salvestuvad Sinu valikud (kava,
          lemmikud, filtrid) ainult Sinu enda seadmesse — meieni need
          ei jõua. Kontoga (Google või meililink) hoiame Sinu e-posti
          aadressi, keele-eelistust, kava valikuid ja hommikukirja
          tellimusi, et need töötaksid kõigis Su seadmetes. Paroole me
          ei hoia, sest paroole ei ole.</p>
          <p>Hommikukirja saadame ainult siis, kui oled selle ise
          sündmuse kaupa sisse lülitanud, ja igas kirjas on
          loobumislink. Sinu e-posti aadressi ei näe ükski korraldaja
          ega keegi kolmas — korraldaja näeb ainult tellijate arvu.
          Konto kustutamiseks kirjuta allolevale kontaktile ja kõik
          Sinu andmed eemaldatakse.</p>

          <h2>Korraldaja andmed ja kohustused</h2>
          <p>Korraldaja kohta hoiame organisatsiooni nime,
          registrikoodi ja kontaktandmeid taotluse kontrolliks ning
          arvete jaoks. Korraldaja vastutab enda avaldatud sisu eest
          (kava, pildid, tekstid, lood) ja kinnitab, et tal on õigus
          seda avaldada. Platvormi omanik võib sündmuse välja lülitada,
          kui sisu rikub seadust või tingimusi või kui arve on maksmata
          — andmeid seejuures ei kustutata.</p>
          <p>Külastajate andmete suhtes on platvormi omanik vastutav
          töötleja. Korraldaja külastajate isikuandmetele ligi ei
          pääse, seega eraldi volitatud töötleja lepingut igapäevaseks
          kasutuseks vaja ei ole; kui korraldaja soovib, sõlmitakse
          see kirjalikult.</p>

          <h2>Tehniline pool</h2>
          <p>Andmeid hoitakse Euroopa Liidus (Supabase) ja teenust
          jooksutab Vercel. Meilid saadab Resend. Teenus töötab
          "nagu on" põhimõttel — anname endast parima, et kava oleks
          festivali ajal alati kättesaadav, aga sajaprotsendilist
          garantiid ükski teenus lubada ei saa.</p>

          <h2>Kontakt</h2>
          <p>Küsimused, andmete kustutamine, lepingud:
          liisingalt@gmail.com</p>
        </main>
      </body>
    </html>
  );
}
