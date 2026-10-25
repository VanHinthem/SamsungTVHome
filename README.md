# SamsungTVHome

Een rustig startscherm voor Samsung QE75Q7FNA (Tizen 4.0, firmware T-KTM2DEUC-1360.0).

## Versie 0.2.0

- Het gezamenlijk gekozen foto-ontwerp: kleine klok en datum, vijf apptegels per rij, HDMI apart.
- Netflix, Prime Video en YouTube openen direct via de op dit toestel vastgestelde app-ID's.
- Alle apps leest geïnstalleerde apps uit en filtert systeemonderdelen en dubbele Netflix/YouTube-vermeldingen. Filtering blijft op het toestel te controleren.
- Favorieten toevoegen, verbergen en ordenen. Verbergen verwijdert de app niet van de tv. Minimaal één en maximaal dertig favorieten.
- Vijftien lokale achtergrondfoto's, verduistering en beperkte beweging. Voorkeuren blijven lokaal bewaard.
- HDMI toont uitsluitend door de tv gerapporteerde aangesloten ingangen en opent de gekozen bron met de ingebouwde tv-viewer.
- Geen advertenties of externe downloads in het startscherm; advertenties binnen andere apps worden niet geblokkeerd.

## Bediening

Pijltjes verplaatsen de focus. OK opent of past een keuze toe. Terug sluit één paneel; op Home sluit Terug de app. Alle apps > kies een app > toevoegen/verwijderen. Instellingen > Apps op startscherm regelt de volgorde. Fotokeuze wordt pas toegepast nadat het bestand geladen en de voorkeur opgeslagen is; Terug annuleert een nog lopende fotokeuze.

## Bron en ontwerp

- app/ is de echte Tizen-app; app/config.xml bewaart identiteit STVHome001.Home, pakket STVHome001 en minimumversie 4.0.
- design/ is het afzonderlijke browserontwerp, met voorbeeldgegevens.
- tests/model.test.cjs test appdetectie, opgeslagen favorieten en HDMI-selectie. Uitvoeren: node --test tests/model.test.cjs.
- [Ontwerpinventaris](docs/design-inventory.md).
- [Assets, bronrevisie en licenties](app/ASSET_CREDITS.md). CleanFrame is de bron van publieke foto's, Manrope en iconen; Flix Home is een ontwerp- en gedragsreferentie. Geen commerciële Pangram-fonts gebruikt.

## Installatie en teststatus

Gebruik officiële Tizen-tools en eigen Samsung-certificaten. Werk de bestaande installatie bij met hetzelfde author-certificaat; uninstall verwijdert mogelijk voorkeuren. Certificaten en ondertekende pakketten blijven privé.

De werkende appstart en eerdere HDMI-versie zijn door de gebruiker bevestigd. Voor 0.2.0 zijn acht modeltests en achttien browserchecks met nagebootste tv-API's geslaagd, en de vormgeving is op 1920×1080 gecontroleerd. Dit bewijst geen correcte rendering of bediening op de fysieke tv; zie [praktijktests](docs/release-0.2.0.md).

## Automatisch starten blijft uit

Er is geen service of on-boot-registratie in de app. Home-toewijzing en tv-opstartinstellingen zijn niet gewijzigd. De aparte pc-helper staat uit en is niet ingepland.

- [Pc-opstarthelper en beperkingen](docs/startup.md)
- [Native onderzoek](docs/native-startup-research.md)
- [Uitgesteld onderzoek naar een tv-achtergrondservice](docs/tv-service-followup.md)

## Privégegevens

Geen certificaten, wachtwoorden, apparaat-ID's, netwerkinformatie of toestelgegevens in de publieke repository. Herstelkopieën en testprofielen blijven in de genegeerde .local/ map.
