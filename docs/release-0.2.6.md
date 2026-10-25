# Samsung Smart Hub-afbeeldingen — 0.2.6

Fysieke feedback liet zien dat ApplicationInformation.iconPath oude Netflix-afbeeldingen en generieke Tizen-symbolen voor Prime Video en YouTube levert. Dat is niet hetzelfde beeld als Samsungs Smart Hub-balk.

Alleen-lezen vd_applist op het toestel leverde de store-ID's, Panel/250x250.png-paden en FirstScreen-mappen. De app probeert nu FirstScreen/250x250.png, daarna Panel/250x250.png, daarna all/304x304.png. Bij de drie bekende streamingapps wordt het generieke pakketicoon overgeslagen; het bestaande merklogo blijft de terugval. De geverifieerde native launch-ID's zijn niet veranderd.

De store-ID's verschillen op deze firmware van nieuwere voorbeelden: Netflix 11101200001 en Prime Video 3201512006785. Dit zijn publieke app-identiteiten, geen apparaat-ID's. De ruwe tv-inventaris blijft uitsluitend lokaal. Er zijn geen afbeeldingen uit de tv aan GitHub toegevoegd. SDB pull wordt door deze firmware geweigerd, dus een visuele vergelijking van de cachebestanden vooraf was niet mogelijk.

Validatie: vijftien modeltests en 33 browserchecks geslaagd. De browser simuleert de cachebestandstoegang; beschikbaarheid en het exacte beeld op de fysieke tv moeten nog door de gebruiker worden bevestigd. Geen Home-/opstartwijziging.

Technische referentie: https://github.com/helalaou/AeroTizen/blob/main/launcher/js/artwork.js
