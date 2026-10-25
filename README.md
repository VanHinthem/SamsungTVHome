# SamsungTVHome

Een rustig startscherm met Netflix, Prime Video, YouTube en HDMI.

Doeltoestel: Samsung QE75Q7FNA, firmware T-KTM2DEUC-1360.0 (door gebruiker opgegeven). Doelplatform Tizen 4.0. Geïnstalleerd op het toestel. YouTube, Prime Video en de ingebouwde Netflix-startoptie zijn door de gebruiker bevestigd. De nieuwste HDMI-overdracht is verbeterd volgens de gebruiker; verdere praktijktests blijven relevant.

## Voorbeeld

Open app/index.html in een browser. Gebruik pijltjestoetsen en Enter; Escape gaat terug. HDMI toont voorbeeldingangen. Er zijn geen externe downloads nodig.

## Op de tv

Netflix, Prime Video en YouTube starten direct via de op dit toestel vastgestelde app-ID’s. HDMI vraagt de aangesloten ingangen op, selecteert de gekozen bron en opent de ingebouwde tv-weergave. Terug op het startscherm sluit de app.

Installatie vereist Samsung Developer Mode, Tizen Studio met TV-tools, eigen Samsung-certificaten en een ondertekend .wgt-pakket. Gebruik een eigen app-identiteit voordat je een definitieve installatie maakt. De meegeleverde identiteit is een ontwikkelvoorbeeld.

Test eerst installatie, pijltjes/OK/Terug, elke streamingapp, terugkeer vanuit een app, HDMI-beeld/geluid en terugkeer uit HDMI. Compatibiliteit en machtigingen moeten op de echte tv worden bevestigd.

Deze versie verwijdert geen systeemapps, wijzigt geen firmware, blokkeert geen advertenties binnen streamingapps en verandert de Home-knop of het opstartgedrag niet. Die mogelijkheden worden afzonderlijk onderzocht na de basistest.

## Referentie en bronnen

Geïnspireerd door het rustige startscherm en de gefaseerde installatie van [CleanFrame](https://github.com/nthnclrk/CleanFrame). Deze eerste versie is zelfstandig geschreven en neemt geen CleanFrame-code, foto's, fonts of logo's over. CleanFrame vereist momenteel Tizen 6.5; dit project gebruikt een kleinere basis gericht op Tizen 4.0.

- [Samsung modelgroepen](https://developer.samsung.com/smarttv/develop/specifications/tv-model-groups.html)
- [Application API](https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/application-api.html)
- [TVWindow API](https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/tvwindow-api.html)
- [Certificaten](https://developer.samsung.com/smarttv/develop/getting-started/setting-up-sdk/creating-certificates.html)

Appnamen zijn merken van hun respectieve eigenaren. Geen affiliatie met Samsung of streamingdiensten.

## Privégegevens

Bewaar certificaten, sleutels, apparaat-ID's, netwerkinformatie en foto's van toestelgegevens buiten de publieke repository.

## Automatisch starten

Een aparte pc-helper is voorbereid, **standaard uitgeschakeld**. Hij is niet gestart, niet ingepland en niet op de tv geïnstalleerd. De Home-knop en tv-opstartinstellingen zijn niet gewijzigd. Zie [onderzoek, beperkingen en tests](docs/startup.md).

Vervolgonderzoek zonder pc: [achtergrondservice op de tv](docs/tv-service-followup.md). Dit onderzoek is uitgesteld terwijl we de app verbeteren; activering blijft apart toegestaan te worden.
