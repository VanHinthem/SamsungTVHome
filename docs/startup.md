# Automatisch starten — voorbereid, niet geactiveerd

Onderzoek: 25 oktober 2026. Toestel QE75Q7FNA, firmware T-KTM2DEUC-1360.0. SDB-capability bevestigt Tizen 4.0 en ARMv7. De enige tv-opdracht voor dit onderzoek was het uitlezen van capabilities. Er is geen opstartinstelling of Home-toewijzing gewijzigd.

## Mogelijkheden

| Route | Betekenis | Status |
| --- | --- | --- |
| Autorun Last App | Samsung hervat mogelijk de laatste app. Niet altijd SamsungTVHome nadat Netflix is gebruikt. | Beschikbaarheid en gedrag op dit toestel nog te testen; niets omgezet. |
| Prelaunch | Samsung kan apps op de linkerkant van de balk vooraf laden op QTV-modellen uit 2018. | Achtergrondladen, geen vast startscherm. Niet ingesteld. |
| CleanFrame native Home | Ongedocumenteerde systeemwijziging via tijdelijke native helper, getest op een andere tv met Tizen 9 en .NET 6. | Compatibiliteit met Tizen 4.0 niet vastgesteld. Geen helper overgenomen of uitgevoerd. |
| Pc-helper | Pc ziet de ontwikkelpoort terugkomen en geeft een gewone app-startopdracht. | Implementatie en gesimuleerde tests aanwezig; uitgeschakeld, niet gestart of ingepland. |

## Voorbereide pc-helper

startup/wake_launcher.py gebruikt alleen Python-standaardbibliotheken en de bestaande officiële Tizen CLI. Hij installeert niets op de tv en verandert geen native instellingen.

- Voorbeeldconfiguratie heeft enabled=false.
- Zonder --run kan geen app worden gestart.
- --status leest alleen een configuratiebestand.
- --dry-run observeert uitsluitend bereikbaarheid, ook als enabled=true.
- --run met enabled=false stopt voordat een netwerkverbinding wordt gemaakt.
- Een tv die bij het starten al bereikbaar is wordt niet overgenomen.
- Eerst minstens zes mislukte metingen, daarna drie succesvolle metingen en twintig seconden wachttijd.
- Eén startpoging per waargenomen uit/aan-overgang; bij een mislukte opdracht stopt het proces.
- Geen Windows-taak, service of Codex-automatisering aangemaakt.

Dit detecteert netwerkbereikbaarheid, geen echte stroomstatus. Als de ontwikkelpoort tijdens standby bereikbaar blijft, wordt inschakelen niet gezien. Een langere netwerkstoring kan op inschakelen lijken en later een ongewenste start veroorzaken. De pc moet aanblijven, de ontwikkelverbinding moet beschikbaar zijn en de CLI moet zonder interactieve vragen werken. Het kan tientallen seconden duren. Dit is geen zelfstandige tv-oplossing en wijzigt de Home-knop niet.

## Controle zonder activeren

Vanuit de projectmap:

    python startup/wake_launcher.py --config startup/config.example.json --status
    python -m unittest discover -s startup -p "test_*.py"

Een eigen configuratie hoort in .local/startup.json, buiten Git. Er is lokaal al een uitgeschakelde configuratie voorbereid; geen wachtwoorden, DUIDs of certificaatinhoud worden gebruikt.

## Later, alleen na expliciete toestemming

Eerst uitsluitend in proefmodus een normale uit/aan-cyclus observeren, zonder app-start. Controleer ook standby en een netwerkonderbreking. Pas wanneer dat gedrag bruikbaar blijkt: actieve start expliciet toestaan, één uit/aan-cyclus testen en het zichtbare resultaat bevestigen. Een geplande taak blijft een afzonderlijke keuze; die bestaat nu niet.

Terugdraaien van de pc-route: stop het helperproces en zet enabled=false. Er zijn geen tv-opstartwaarden om te herstellen. Mocht later een geplande taak worden toegevoegd, moet die ook worden uitgezet.

Native Home vereist een apart compatibiliteitsonderzoek, oorspronkelijke typed systeemwaarden en een geteste herstelroute vóór enige wijziging. Deze repository bevat bewust geen onbewezen native apply-opdracht voor jouw firmware.

## Bronnen

- [CleanFrame: native Home en herstel, stages 7–8](https://github.com/nthnclrk/CleanFrame/blob/main/docs/agent-tv-setup-guide.md)
- [Samsung: prelaunching op 2016–2018](https://developer.samsung.com/smarttv/develop/guides/fundamentals/prelaunching-applications.html)
- [Samsung: Smart Hub en Autorun Last App](https://www.samsung.com/ae/support/tv-audio-video/how-to-activate-or-deactivate-the-smart-hub/)
- [Samsung: officiële CLI voor app-start](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/command-line-interface.html)
