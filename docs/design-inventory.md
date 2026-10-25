# Functie-inventaris en gezamenlijk ontwerp

Datum: 25 oktober 2026. Fase: inventarisatie en ontwerp; nog geen nieuwe UI bouwen of installeren. Onderzoek naar automatisch starten is apart uitgesteld. Niets activeren.

Bronnen zijn de huidige README, interaction-behaviour en relevante appbestanden. Dit is een broninventaris, geen bevestiging dat elke functie op onze tv werkt.

## Referenties

- Flix Home 0.6.1: UE43NU7409, Tizen 4.0, firmware T-KTM2DEUC-1360.0. Andere tv maar dezelfde firmwarestring als onze QE75Q7FNA.
- CleanFrame 0.6.1: LS03D / Tizen 9. Huidig manifest vereist 6.5. Bruikbaar als ontwerp- en gedragsreferentie, niet rechtstreeks compatibel.
- Bestaand SamsungTVHome behouden als werkende basis: directe Netflix-, Prime Video- en YouTube-start, HDMI-lijst en native viewer. Bestaande identiteit en author-certificaat behouden.

## Inventaris

| Onderdeel | Flix Home | CleanFrame |
| --- | --- | --- |
| Startscherm | Horizontale apptegels, werkbalk, aparte ingangenrij | Dock of verticale lijst |
| Appweergave | Merklogo's op tegels, naam, lokale focusgloed | Iconen, tekst of beide; labels bij focus |
| Klok | Grote vierkante pixelklok, seconden, optionele vouwanimatie | Kleine eenvoudige klok, 12 uur, geen seconden of datum |
| Achtergrond | Effen zwart of ivoor | Foto, licht of donker |
| Foto's | Geen fotogalerij in beschreven huidige ontwerp | 15 lokale wallpapers, tijdelijke preview, expliciet toepassen |
| Fotowissel | Niet aangetroffen | Vast, per nieuw laden, elke 5/15/60 minuten; pauze buiten zichtbaar Home |
| Licht/donker | Ja; directe schakelaar | Ja; via achtergrondgroep |
| Focus | Smalle merkkleurige gloed; aan/uit | Type of Glass; materialen Soft/Frost/Clear |
| Beweging beperken | Vouwklok of gereduceerd | Gereduceerde beweging met behoud van focusfeedback |
| Apps toevoegen | Alle apps naar favorieten | Gefilterde Alle apps naar Home |
| Volgorde | Links/rechts verplaatsen in bewerkmenu | Oppakken/verplaatsen/plaatsen; ongedane actie in sessie |
| Verbergen | Uit favorieten verwijderen; app blijft geïnstalleerd | Van Home verwijderen; recent verwijderd en undo; app blijft geïnstalleerd |
| Appcatalogus | Installaties filteren, merklogo of fallback | Gefilterde catalogus, vijf kolommen, lokale iconen en fallback |
| Favorietenlimiet | Geen expliciete limiet vastgesteld in geïnventariseerde delen | 1–9 apps |
| HDMI | Aparte rij, aangesloten/vrij-status, tv-tegel; fysiek schakelen nog onbevestigd | Geen beschreven algemene HDMI-kiezer; niet als aanwezige functie aannemen |
| Samsung Home | Expliciete terugvalroute | Expliciete actie; oorspronkelijke bestemming op referentie controleren |
| Tv-instellingen | Via Samsung Home, direct openen eerder niet zichtbaar | Directe interne bestemming, zichtbare werking nog te bevestigen |
| Instellingen | Compact menu, focus binnen paneel, licht/donker, animatie, gloed en bewerken | Gegroepeerd, tweedelig scherm met live Home-preview en expliciete keuzes |
| Typografie | Vaste vormgeving en pixelklok | Meerdere fonts; sommige commerciële fonts alleen privé beschikbaar |
| Opslaan | Favorieten en uiterlijk lokaal | Uiterlijk, volgorde, wallpaper, rotatie, recent verwijderde apps en laatste selectie lokaal |
| Afstandsbediening | Pijltjes/OK/Terug; lang OK voor bewerken | Pijltjes/OK/Terug, focusherstel, begrensde navigatie, panelen sluiten per niveau |
| Art Mode | Niet aangetroffen | Experimentele interne Samsung-aanroep voor The Frame; niet voor onze QLED aannemen |
| Home-knop | Niet geïmplementeerd | Apart native experiment; Home vanuit Netflix bevestigd op referentietoestel |
| Autostart | Niet geïmplementeerd | Apart native experiment; power-on-resultaat nog niet definitief bevestigd |
| Werking zonder pc | Ja na handmatig openen | Ja na openen; UI en assets lokaal |
| Ads/bloatware | Geen feeds/ads in eigen UI; verwijdert geen systeemapps | Rustige eigen UI; geen algemene systeemdebloatfunctie |

Alleen functies uit de genoemde versies inventariseren. Een logo of knop is geen bewijs van afspelen, bronwisseling of systeemintegratie.

## Voorlopig advies — nog geen geaccepteerde keuzes

Basis voor versie 1:
- Drie directe apptegels: Netflix, Prime Video, YouTube.
- Aparte HDMI-rij met beschikbare bronnen en duidelijke focus.
- Instellingen en Alle apps als kleine acties.
- Favorieten toevoegen, verbergen en ordenen; voorkeuren lokaal bewaren.
- Duidelijke remote-focus, OK opent, Terug sluit één niveau.
- Licht/donker en optioneel één stilstaande foto; geen zware effecten.
- 24-uursklok voor Nederlands gebruik als voorstel, ook al gebruikt CleanFrame 12 uur.

Later kiezen: grote pixelklok, datum, fotoverzameling/rotatie, extra fonts, undo-editor en meer focusmaterialen.

Buiten deze ontwerpronde: autostart, Home-routering, systeemapps verwijderen en Art Mode.

## Drie indelingen om samen uit te kiezen

A. Rustig dock — CleanFrame als visuele richting
Kleine klok linksboven; Alle apps en Instellingen rechtsboven; ruim beeldvlak met effen achtergrond of foto; drie apptegels onderin; compactere HDMI-rij daaronder.

B. Klok centraal — Flix Home als visuele richting
Grote klok bovenaan; drie apptegels midden; HDMI-ingangen eronder; kleine werkbalk. Functioneler en prominente tijdweergave.

C. Compact overzicht — combinatie
Kleine klok en acties bovenaan; apps centraal; duidelijk getitelde HDMI-rij eronder. Meer direct overzicht en minder leegte.

Nog niet gekozen: indeling, achtergrond, klokstijl, tegelformaat, logo/tekst, focus, overige functies. Eerst deze keuzes bespreken en dan een visueel browserontwerp maken. Geen tv-installatie tijdens de ontwerpfase.

## Bronnen

- [Flix Home README](https://github.com/schadogamer127-sys/Flix-Home/blob/main/FlixHome%202/README.md)
- [Flix Home UI en voorkeuren](https://github.com/schadogamer127-sys/Flix-Home/blob/main/FlixHome%202/app/js/main.js)
- [Flix Home ingangen](https://github.com/schadogamer127-sys/Flix-Home/blob/main/FlixHome%202/app/js/inputs.js)
- [CleanFrame README](https://github.com/nthnclrk/CleanFrame/blob/main/README.md)
- [CleanFrame interactie en functies](https://github.com/nthnclrk/CleanFrame/blob/main/docs/interaction-behaviour.md)
