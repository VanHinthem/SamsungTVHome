# SamsungTVHome 0.2.0 — praktijktest

25 oktober 2026. Goedgekeurd ontwerp geïntegreerd. Zelfde app-ID en certificaat. Een privébron- en ondertekende pakketkopie van de eerdere werkende versie staat in .local/backups/before-photo-ui/. Geen on-boot-service, Home-wijziging of externe monitor gestart.

## Uitgevoerde controles

- Acht modeltests geslaagd: duplicaten en systeemapps filteren, ontbrekende apps, ongeldige voorkeuren, opgeslagen onbekende apps, bekende IDs, volgorde en HDMI.
- Achttien browserchecks met gesimuleerde tv-API's geslaagd: directe start van Netflix/Prime/YouTube zonder zoekstap, HDMI-selectie en native viewer, echte catalogusverwerking, favorieten toevoegen/ordenen/verbergen, Terug en focus, opslag, 15 foto's, annuleren van een lopende fotokeuze en lokale klok.
- Browserweergave visueel gecontroleerd op 1920×1080. CSS-grid en flex-gap zijn voor de runtime vervangen door flex en expliciete marges.
- Alle 44 overgenomen asset- en noticebestanden eerder gecontroleerd tegen de Git-bronhashes; bronstructuur en licenties behouden.
- Officiële Tizen-build en Samsung-ondertekening geslaagd.

## Nog op de fysieke tv bevestigen

- Foto, lettertype, klok en vijf tegels per rij correct zichtbaar.
- Pijltjes, OK en Terug in Home, Alle apps, details en alle instellingen.
- Netflix, Prime Video en YouTube openen; na terugkeer blijft navigatie bruikbaar.
- Alle apps toont gewenste consumentenapps zonder interne utilities.
- Favoriet toevoegen, verplaatsen en verbergen. Voorkeuren na sluiten en opnieuw openen behouden.
- Foto veranderen; Terug tijdens laden; verduistering en beweging.
- Alleen aangesloten HDMI-bronnen; directe bronwisseling zonder ongewenste Samsung-balk.
- Geen verandering aan Home-knop of opstartgedrag.

De SDK-melding dat een app gestart is, vervangt de fysieke bevestiging niet. Terug op Home sluit de app, zoals in de eerdere versie. Herstel vereist zo nodig het oude bronpakket met een hoger manifestversienummer en hetzelfde author-certificaat opnieuw te bouwen; geen uninstall nodig.
