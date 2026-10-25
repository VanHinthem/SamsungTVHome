# Herstelupdate 0.2.1

Aanleiding: fysieke foto's toonden verkeerd uitgelijnde logo's, samengeplakte teksten, een ontbrekende verdonkering en interne/dubbele apps in de catalogus.

- Logo's krijgen een expliciet gecentreerde positie en vaste afmetingen binnen hun tegel; geen afhankelijkheid van flex binnen buttons.
- De fotolaag strekt via top/bottom over het scherm, zonder procentuele hoogte op een parent met alleen min-height.
- Klok/datum, werkbalkiconen en HDMI-kop krijgen expliciete marges. Focusrand volgt de afgeronde tegel.
- E-manual, privacy-instellingen en teletextutilities worden gefilterd. Pathe/Pathé-dubbelen worden samengevoegd, met voorkeur voor het al bewaarde favorieten-ID.
- De bestaande foto, favorieten en native launch-ID's blijven behouden. Geen opstart- of Home-wijziging.

Validatie: negen modeltests en 22 browserchecks met gesimuleerde tv-API's geslaagd. Nieuwe checks dekken overlayhoogte, logocentrering, containment, tekstafstand en catalogusregressies. Tizen-build en ondertekening geslaagd. Uiteindelijke weergave op de fysieke tv nog door gebruiker te bevestigen.
