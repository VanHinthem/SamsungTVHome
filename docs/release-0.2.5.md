# Originele appiconen — 0.2.5

De tv-runtime geeft lokale iconPath-waarden uit getAppsInfo voorrang boven de gebundelde witte logo's en initialen. Bestanden worden zonder kleurfilter weergegeven in Home, Alle apps en het appdetail. Ontbrekende of niet-leesbare bestanden behouden de terugval. Het scherm wordt na de eerste appinventarisatie bijgewerkt zonder opnieuw een appstart te zoeken. Netflix behoudt de bewezen native launch-ID, ook als de wrapper zijn icoon levert.

Iconen worden vanaf het toestel gelezen: geen geëxtraheerde afbeeldingen of apparaatpaden naar GitHub gekopieerd. Opgeslagen favorieten bevatten geen icoonpaden. Netwerk- en script-URL's worden niet als iconPath gebruikt.

Twaalf modeltests en 33 browserchecks met gesimuleerde tv-functies slagen. Daadwerkelijke leesbaarheid en de vergelijking met Samsung Smart Hub moeten nog op de tv worden bevestigd. iconPath kan het appicoon leveren, maar is geen garantie op precies dezelfde brede Smart Hub-afbeelding.

Bron: https://developer.samsung.com/smarttv/develop/api-references/tizen-web-device-api-references/application-api.html
