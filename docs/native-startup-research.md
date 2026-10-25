# Onderzoek: vast startscherm zonder pc

Datum: 25 oktober 2026. Status: **geen gevalideerde native route voor dit toestel; niets geactiveerd**.

## Vraag en scope

SamsungTVHome automatisch op de tv zelf openen bij inschakelen, zonder draaiende pc. Alleen onderzoek is toegestaan; Home-toewijzing, opstartinstellingen en firmware blijven ongewijzigd.

## Bevindingen op het toestel

- Model: QE75Q7FNA; opgegeven firmware T-KTM2DEUC-1360.0.
- SDB bevestigt platform_version=4.0, product_version=4.0 en cpu_arch=armv7.
- intershell_support=disabled, sdbd_rootperm=disabled, rootonoff_support=disabled, appcmd_support=disabled.
- Een gewone shellquery naar identiteit en een query naar ontwikkelhulp werden beide afgesloten met "closed". Dit bewijst dat deze queries via deze route niet beschikbaar zijn, niet dat alle alternatieve toegang onmogelijk is.
- Na die queries bleef de tv normaal als verbonden apparaat zichtbaar; capability kon opnieuw gelezen worden.
- Geen helper geüpload, geen command-injectiontransport geprobeerd, geen native API aangeroepen, geen systeemwaarde geschreven, geen herstart uitgevoerd.
- Geen oorspronkelijke native Home-/startupwaarden opgeslagen: daar is nog geen gevalideerde uitleesroute voor. Aanwezigheid van een Samsung Home-app in een applijst is geen bewijs van zijn actuele systeemtoewijzing.

## Vergelijking met CleanFrame

| Vereiste | CleanFrame-bron | Onze tv |
| --- | --- | --- |
| Testtoestel | QA55LS03DAWXXY, firmware 2130.0, Tizen 9 | QE75Q7FNA, firmware 1360.0, Tizen 4.0 |
| Processor | 32-bit ARM | ARMv7 bevestigd; daarmee zijn bibliotheken nog niet compatibel |
| Managed helper | TargetFramework net6.0 | Samsung documenteert voor de generatie 2018 een oudere Tizen .NET-omgeving; .NET 6 niet bevestigd |
| Firmwarecontrole | Exacte referentiefirmware vereist | Komt niet overeen; originele helper weigert dit toestel |
| Native toegang | Tijdelijke SDK-context via ongedocumenteerd pakketnaamtransport | Niet geprobeerd; niet vastgesteld voor deze firmware |
| Bibliotheken en functies | libaul, libvconf, app-operation-tv en boot-eligibilityfunctie | Aanwezigheid, signatures en toegangsrechten niet vastgesteld |
| Herstel | Eigen oorspronkelijke waarden en native restore getest | Geen oorspronkelijke waarden of geteste herstelroute beschikbaar |

De bron gebruikt DllImport voor interne bibliotheken. Samsung staat het aanroepen van TizenFX-systeembibliotheken via DllImport niet toe binnen de gewone gepubliceerde .NET-app-route. Het SDK-contexttransport van CleanFrame is een afzonderlijke ongedocumenteerde route; dit is geen bewijs dat die op Tizen 4 werkt of niet werkt.

Een oudere helper bouwen kan in theorie een nieuw onderzoekstraject zijn, maar alleen opnieuw compileren of firmwarecontroles verwijderen lost onbekende ABI's, toegangsrechten en bootgeschiktheid niet op. De huidige bron wordt niet als toepasbare installer voor dit toestel aangeboden.

## Wat zonder pc wel en niet is onderbouwd

1. **Autorun Last App:** Samsung documenteert dit voor de modeljaren 2017–2021 onder Instellingen > Algemeen > Smart-functies. Ondersteuning verschilt per app/model. Beschikbaarheid en werking met onze app zijn nog niet fysiek gecontroleerd. Het hervat mogelijk Netflix als die het laatst gebruikt is; geen garantie op SamsungTVHome.
2. **Prelaunch:** op QTV uit 2018 kunnen apps links in Smart Hub vooraf op de achtergrond worden geladen. Dat maakt ze geen vast zichtbaar startscherm. Er is niets verplaatst of ingeschakeld.
3. **Native vast startscherm:** technische referenties bestaan voor andere, veel nieuwere firmware. Voor QE75Q7FNA / 1360.0 is in de geraadpleegde bronnen geen gevalideerde instructie gevonden. Dit betekent "niet vastgesteld", niet "onmogelijk".
4. **Extern altijd-aan-apparaat:** een NAS, Raspberry Pi of Home Assistant-host kan in principe de rol van een pc overnemen, maar blijft externe apparatuur. Daarvoor is hier geen integratie gemaakt of getest.

## Vervolg zonder activering

- Alleen de beschikbare Smart-functies en huidige standen visueel inventariseren, zonder iets om te zetten.
- Native onderzoek vereist eerst een onafhankelijke, uitsluitend lezende firmware-specifieke methode om bibliotheken, huidige Home-registratie, getypeerde opstartwaarden en app-bootgeschiktheid te verzamelen.
- Daarna een op Tizen 4 passende queryhelper en een exacte herstelroute voorbereiden; pas na controle daarvan kan een afzonderlijk voorstel voor wijziging worden beoordeeld.
- Geen blind gebruik van S90D/Frame-scripts, geen verwijderen van firmwareguards en geen directe databasewijzigingen.
- De bestaande pc-helper blijft uitgeschakeld; de geïnstalleerde tv-app is tijdens dit onderzoek niet bijgewerkt.

## Bronnen

- [CleanFrame native-home README](https://github.com/nthnclrk/CleanFrame/blob/main/scripts/native-home/README.md)
- [CleanFrame helperproject: net6.0](https://github.com/nthnclrk/CleanFrame/blob/main/scripts/native-home/Control.csproj)
- [CleanFrame firmwareguards en native API's](https://github.com/nthnclrk/CleanFrame/blob/main/scripts/native-home/Control.cs)
- [CleanFrame transport](https://github.com/nthnclrk/CleanFrame/blob/main/scripts/native-home/run.py)
- [Oorspronkelijk S90D-onderzoek op vaste bronrevisie](https://github.com/splitcipher/couchroot/blob/83906b468836869933012da03a4018fb339462b3/docs/devices/s90d/README.md)
- [Samsung platform- en .NET-specificaties](https://developer.samsung.com/smarttv/develop/specifications/general-specifications.html)
- [Samsung Tizen .NET FAQ: DllImport-beperkingen](https://developer.samsung.com/smarttv/develop/faq/tizen-net-tv.html)
- [Samsung: .NET op modellen vanaf 2018](https://developer.samsung.com/tizen/blog/en/2019/02/19/launch-your-tizen-net-application-on-samsung-smart-tv)
- [Samsung startschermopties per modeljaar](https://www.samsung.com/ae/support/tv-audio-video/use-autorun-start-screen-options-on-your-samsung-tv/)
- [Samsung prelaunching](https://developer.samsung.com/smarttv/develop/guides/fundamentals/prelaunching-applications.html)
