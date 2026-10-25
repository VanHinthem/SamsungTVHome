# Ontwerp C — compact overzicht

Browserontwerp voor gezamenlijke beoordeling. De werkende app in ../app en de geïnstalleerde tv-versie blijven ongewijzigd.

Open index.html of serveer de projectmap lokaal. Dit voorbeeld bevat geen Tizen-aanroepen of opstartfuncties. Tijd/datum en HDMI 1/2 zijn voorbeeldgegevens, geen inventaris van aangesloten apparaten.

Kies Instellingen om één van de 15 CleanFrame-foto's te kiezen. Fotokeuze blijft alleen in de browser bewaard. Alle apps en app-/HDMI-knoppen tonen alleen voorbeeldgedrag.

Overgenomen publieke assets: 15 foto's met miniaturen, Manrope en vijf iconen. Herkomst en hashes staan in ASSET_IMPORT.json. Oorspronkelijke mapstructuur en licentieteksten zijn behouden onder assets/cleanframe. Copyright, fotocredits, OFL- en iconlicenties behouden bij publicatie. Geen commerciële Pangram-fonts gebruikt.

Ontwerpkeuzes om samen te bespreken:
- Tegelgrootte, fotoverdonkering, plaats van de rijen en klok.
- De titel Jouw avond is op verzoek weggelaten.
- Of HDMI alleen aangesloten bronnen toont, zoals de huidige app.
- Instellingen bevat nu Achtergrond, Uiterlijk en Apps op startscherm.

Ontwerpupdate: kleinere tegels, maximaal vijf per rij op tv-formaat. Extra apps komen op een volgende rij. De eerste rij bevat nog de drie gekozen apps.

## Alle apps en Instellingen

Uitgewerkt als interactieve browserontwerpen. Open index.html#apps of index.html#settings. Alle apps toont acht voorbeeldapps; de toekomstige tv-versie ontdekt de daadwerkelijke installaties. Aan-/uitzetten van favorieten, ordenen, foto, verduistering en beweging worden uitsluitend lokaal in de browser bewaard. Instellingen heeft Achtergrond, Uiterlijk en Apps op startscherm. Geen tv-aanroepen of autostartservice.

Browsercontrole: 13 interactiechecks geslaagd voor toevoegen, ordenen, verbergen, terugnavigatie, focusherstel, opslag, fotogalerij en foto laden. Vormgeving gecontroleerd op 1920×1080; tv-bediening en prestaties zijn nog niet getest. De voorbeeldklok en HDMI-status blijven voorbeeldgegevens.
