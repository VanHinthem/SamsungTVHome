# Vervolgonderzoek: achtergrondservice op de tv

Vastgelegd op 25 oktober 2026. **Uitgesteld: eerst verder werken aan de app.**
Status: alleen brononderzoek; niets gebouwd, geïnstalleerd of geactiveerd voor deze route.

## Doel en afspraak

SamsungTVHome automatisch openen zonder een ingeschakelde pc. Onderzoek en voorbereiding zijn toegestaan; activering vereist later expliciete toestemming van de gebruiker. Ook de bestaande pc-helper blijft uitgeschakeld. Home-knop en tv-opstartinstellingen blijven ongewijzigd.

## Nieuwe aanwijzingen

- [Reddit: Flix Home op een tv uit 2018](https://www.reddit.com/r/Tizen/comments/1xdb8gn/i_vibe_coded_a_launcher_for_my_2018_samsung_tizen/).
- [Flix Home-documentatie](https://github.com/schadogamer127-sys/Flix-Home/blob/main/FlixHome%202/README.md): UE43NU7409, Tizen 4.0 / ARMv7, firmware T-KTM2DEUC-1360.0. Dezelfde firmwarestring als ons toestel, maar een ander model. Home-vervanging en betrouwbaar starten na cold boot/standby zijn expliciet niet geïmplementeerd.
- [AeroTizen-manifest](https://github.com/helalaou/AeroTizen/blob/main/launcher/config.xml): aparte webservice met on-boot=true en auto-restart=true.
- [AeroTizen-service](https://github.com/helalaou/AeroTizen/blob/main/launcher/service/index.js): gebruikt Node-achtige require('http'), bevraagt de lokale tv-API en opent de launcher. Dit is een andere route dan CleanFrames native Home-toewijzing.
- [AeroTizen README](https://github.com/helalaou/AeroTizen): geteste toestellen zijn nieuwer; geen bewijs voor QE75Q7FNA/Tizen 4.0. Home-terugkeer heeft beperkingen bij onder andere YouTube en Prime Video.
- [Tizen-webservices](https://github.com/Samsung/tizen-docs/blob/master/docs/application/web/guides/applications/service-app.md): services en certificaatvoorwaarden. Generieke Tizen-documentatie is geen garantie voor Samsung-consumentenfirmware.

## Nog vast te stellen

1. Ondersteunt deze firmware de benodigde webservice-runtime en Node-modules, of alleen een oudere servicevariant?
2. Kan een minimale service worden geïnstalleerd met ons publieke Samsung-certificaat? Welke certificaatvoorwaarden gelden specifiek voor on-boot?
3. Werkt een service naast de UI en streamingapps, en wordt die niet geschorst?
4. Zijn benodigde lokale status-API's betrouwbaar voor Netflix, YouTube, Prime Video en HDMI?
5. Werkt starten na cold boot én na standby afzonderlijk? Een achtergrondstart is geen bewijs van zichtbare appstart.
6. Hoe voorkomen we onbedoelde overname tijdens HDMI, casten, instellingen of afspelen?
7. Hoe stoppen/verwijderen we de service en keren we terug naar de huidige app zonder instellingenverlies?
8. Hoeveel CPU/geheugen gebruikt dit op de tv uit 2018?

## Voorstel voor later onderzoek

Eerst bron- en runtimecompatibiliteit vaststellen. Daarna eventueel een apart diagnostisch proefpakket ontwerpen: eigen identiteit, on-boot=false, auto-restart=false, geen launch van SamsungTVHome en geen Home-/startupwrites. Installatie van een service is geen puur alleen-lezen onderzoek en moet vooraf als concrete proef worden besproken. Pas na verificatie een uitgeschakelde integratie ontwerpen.

Geen AeroTizen-pakket installeren om alleen te kijken: het huidige manifest activeert on-boot en zou daarmee de afspraak schenden. Geen onbekende compatibiliteitsguards verwijderen.

## Huidige app als basis behouden

Werkende directe koppelingen: ingebouwde Netflix-startoptie, Prime Video en YouTube. HDMI toont aangesloten ingangen en draagt de gekozen bron over aan de native tv-viewer. App-ID STVHome001.Home en het bestaande author-certificaat behouden bij updates.

Zie ook [native onderzoek](native-startup-research.md) en [pc-route](startup.md).
