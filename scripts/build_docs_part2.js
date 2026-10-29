const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.resolve(__dirname, '../documents');

function writeDoc(filenameBase, mdContent) {
  const mdPath = path.join(DOCS_DIR, `${filenameBase}.md`);
  const txtPath = path.join(DOCS_DIR, `${filenameBase}.txt`);
  
  const txtContent = mdContent
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/^#+\s+/gm, '')
    .trim();

  fs.writeFileSync(mdPath, mdContent, 'utf-8');
  fs.writeFileSync(txtPath, txtContent, 'utf-8');
  console.log(`Generated ${filenameBase}.md and .txt`);
}

// ==========================================
// DOCUMENT 2: Camp Green Lake en Geografie
// ==========================================
const doc2 = `# Camp Green Lake – Geschiedenis, Geografie, Regels en Woestijnfauna

Camp Green Lake is het centrale toneel van Louis Sachars *Holes*. Het is een plek vol paradoxen: er is geen meer, het is er allesbehalve groen, en het zogenaamde \"zomerkamp\" is in werkelijkheid een meedogenloos strafkamp. Dit document biedt een grondige geografische, historische en ecologische analyse van Camp Green Lake en de omliggende Texaanse woestijn.

---

## Inhoudsopgave
1. [De Geschiedenis van Green Lake, Texas](#de-geschiedenis-van-green-lake-texas)
   - [Het Bloeiende Meerstadje van de 19e Eeuw](#het-bloeiende-meerstadje-van-de-19e-eeuw)
   - [De Tragedie en de Droogte van 110 Jaar](#de-tragedie-en-de-droogte-van-110-jaar)
2. [Camp Green Lake als Jeugddetentiecentrum](#camp-green-lake-als-jeugddetentiecentrum)
   - [Doelstelling: Karaktervorming vs. Dwangarbeid](#doelstelling-karaktervorming-vs-dwangarbeid)
   - [De Meedogenloze Kampregels en het Graafregime](#de-meedogenloze-kampregels-en-het-graafregime)
   - [De Dagelijkse Routine](#de-dagelijkse-routine)
3. [Plattegrond en Belangrijke Locaties van het Kamp](#plattegrond-en-belangrijke-locaties-van-het-kamp)
   - [Tent D en de Kampeertenten](#tent-d-en-de-kampeertenten)
   - [The Wreck Room (De Ontspanningsruimte)](#the-wreck-room-de-ontspanningsruimte)
   - [Het Huis en Kantoor van The Warden](#het-huis-en-kantoor-van-the-warden)
   - [De Twee Eiken en de Schaduw](#de-twee-eiken-en-de-schaduw)
4. [Flora en Fauna van de Woestijn](#flora-en-fauna-van-de-woestijn)
   - [De Gele Gevlekte Hagedis (*Yellow-Spotted Lizard*)](#de-gele-gevlekte-hagedis-yellow-spotted-lizard)
   - [Ratelslangen en Schorpioenen](#ratelslangen-en-schorpioenen)
   - [Wilde Uien (*Allium*)](#wilde-uien-allium)
5. [Sleutellocaties in de Omliggende Woestijn](#sleutellocaties-in-de-omliggende-woestijn)
   - [Het Gatenveld (De Oude Meerbodem)](#het-gatenveld-de-oude-meerbodem)
   - [Het Wrak van Mary Lou](#het-wrak-van-mary-lou)
   - [God's Thumb (Big Thumb Mountain)](#gods-thumb-big-thumb-mountain)

---

## De Geschiedenis van Green Lake, Texas

![Camp Green Lake Meerbodem](assets/camp_green_lake_dry_lake.jpg)
*De uitgestrekte, uitgedroogde zoutvlakte van wat ooit het grootste zoetwatermeer van Texas was.*

### Het Bloeiende Meerstadje van de 19e Eeuw
In de late negentiende eeuw (circa 1880–1888) was Green Lake een welvarend, idyllisch stadje gelegen aan de oevers van het grootste natuurlijke zoetwatermeer van de staat Texas. Het water was kristalhelder en werd omzoomd door honderden bloeiende perzikboomgaarden. 

Elk voorjaar vulde de lucht zich met de geur van perzikbloesem en organiseerde het stadje een picknick waarbij de bewoners streden om wie de lekkerste gerechten maakte. Katherine Barlow won jaar na jaar de eerste prijs met haar befaamde gekruide perziken (*spiced peaches*), ingemaakt met kaneel en kruidnagel. De economie floreerde dankzij de visserij, perzikteelt en het handelsverkeer over het water. De rijke familie Walker bezat grote lappen grond en Charles \"Trout\" Walker pronkte met zijn nieuwe gemotoriseerde stoomboot.

### De Tragedie en de Droogte van 110 Jaar
Het noodlot van Green Lake werd bezegeld door rassenhaat en geweld. Toen dorpsonderwijzeres Katherine Barlow verliefd werd op Sam, een zwarte uienverkoper, werd hun relatie als taboe beschouwd door de witte dorpsgemeenschap. Na een intieme zoen tussen de twee zette Trout Walker de dorpsbewoners aan tot een lynchpartij. De school werd platgebrand en Sam werd op het meer in koelen bloede doodgeschoten in zijn roeiboot.

Vanaf die dag voltrok zich een ogenschijnlijk bovennatuurlijke straf: **er viel geen enkele druppel regen meer op Green Lake**. Gedurende precies honderdtien jaar bleef de hemel strakblauw en droog. Het gigantische meer verdampte geleidelijk totdat er slechts een kurkdroge, gebarsten zoutpan overbleef. De perzikbomen stierven af, de huizen vervielen tot ruïnes en de bewoners trokken weg. Het welvarende Green Lake veranderde in een spookstad midden in een meedogenloze woestijn.

---

## Camp Green Lake als Jeugddetentiecentrum

![Camp Green Lake Bord](assets/camp_green_lake_sign.png)
*Het officiële toegangsbord tot Camp Green Lake.*

### Doelstelling: Karaktervorming vs. Dwangarbeid
In de twintigste eeuw zag de familie Walker kans om munt te slaan uit de desolate woestenij. Louise Walker (The Warden) stichtte op het landgoed van haar voorouders een strafkamp voor minderjarige jongens die met Justitie in aanraking waren gekomen. 

Officieel presenteerde het kamp zich aan rechters en de buitenwereld als een progressief heropvoedingsprogramma:
> *\"Als je een slechte jongen elke dag een gat laat graven in de brandende zon, verandert hij vanzelf in een goede jongen. Dat noemt men karaktervorming.\"*

In werkelijkheid was deze \"karaktervorming\" een sinistere dekmantel. The Warden gaf niets om heropvoeding. Zij zocht wanhopig naar de verloren schat van Kissin' Kate Barlow, waarvan haar familie wist dat die ergens op de droge meerbodem begraven lag. Door tientallen jongens dag in dag uit systematisch gaten te laten graven, liet ze het zand omspitten zonder een cent aan arbeiders te hoeven betalen.

![Kampeerders aan het graven](assets/camp_green_lake_campers.jpg)
*Kampeerders zwoegen in de brandende hitte om hun dagelijkse gat te voltooien.*

### De Meedogenloze Kampregels en het Graafregime
Het leven in Camp Green Lake werd beheerst door ijzeren wetten:
1. **De Maat van het Gat**: Elke jongen moet elke dag één gat graven. Het gat moet precies zo diep zijn als de schep lang is (5 voet / 1,52 meter) en een diameter hebben van eveneens 5 voet in elke richting. De schep dient als meetlat.
2. **Geen Bewakers met Geweren Nodig**: Er staan geen hekken of prikkeldraad rond het kamp. Zoals Mr. Sir uitlegt: *\"We hebben geen hekken nodig. We hebben de enige waterbron binnen een straal van honderd mijl. Als je wilt ontsnappen, ga je gang. Binnen drie dagen ben je gierenvoer.\"*
3. **Beloning voor Vondsten**: Als een jongen iets \"interessants\" vindt tijdens het graven, moet hij dit onmiddellijk melden aan de leiding. Als The Warden de vondst goedkeurt, krijgt de vinder de rest van de dag vrij en een dubbele douchebeurt.
4. **Waterrantsoen**: De waterwagen komt een paar keer per dag langs. Wie te laat is of uit de gratie valt bij Mr. Sir, krijgt niets.

### De Dagelijkse Routine
- **04:30 AM**: De wekker gaat. De jongens moeten opstaan terwijl het nog aardedonker en koel is.
- **05:00 AM**: Ontbijt in de eetzaal (vaak flauwe pap of droge toast).
- **05:30 AM**: Vertrek naar het gatenveld met schep en watercantine. De jongens beginnen direct te hakken in de keiharde toplaag van de opgedroogde klei.
- **Ochtend**: Het graven is een race tegen de zon. Zodra de zon opkomt, stijgt de temperatuur snel tot boven de 40 graden Celsius in de schaduw (als er al schaduw zou zijn).
- **Middag**: De jongens die klaar zijn, steken hun schep rechtop in hun hoop aarde en lopen terug naar het kamp voor een douche van exact 4 minuten met koud water.

---

## Plattegrond en Belangrijke Locaties van het Kamp

### Tent D en de Kampeertenten
Het kamp telt zes grote legertenten, aangeduid met letters A t/m F. Elke tent huisvest circa zeven jongens onder leiding van een counselor. 
- **Tent D** is het verblijf van Stanley Yelnats IV, Zero, X-Ray, Armpit, Magnet, Zigzag en Squid.
- De tenten staan op houten vlonders en bevatten eenvoudige veldbedden met dunne matrassen. Binnen is het benauwd en stoffig; er is geen privacy.

### The Wreck Room (De Ontspanningsruimte)
De centrale verzamelruimte voor de jongens buiten werktijd. Het meubilair is zwaar beschadigd: de stoelen missen poten, de pooltafel heeft gescheurd laken en er staat een kapotte televisie waar nooit een beeld op verschijnt. De muren zijn volgekalkt met graffiti en namen van eerdere gevangenen.

### Het Huis en Kantoor van The Warden
Een houten landhuis met airconditioning, afgesloten van het gewone kampterrein. Hier woont Louise Walker in relatieve luxe. In haar kantoor bewaart ze haar persoonlijke documenten, de dossiers van de kampeerders, en haar collectie make-up en chemicaliën, waaronder haar flesje nagellak met ratelslangengif.

### De Twee Eiken en de Schaduw
Vlakbij het kantoor van The Warden staan twee grote, oude eikenbomen. Dit zijn de **enige bomen** en de **enige natuurlijke schaduwplek** op het hele kampterrein. Tussen de twee bomen hangt een hangmat.
- **Strikte Regel**: De hangmat en de schaduw onder de eiken zijn exclusief gereserveerd voor The Warden. Kampeerders mogen onder geen beding in de schaduw van de bomen komen; wie dit waagt, riskeert direct te worden beschoten door bewakers met jachtgeweren.

---

## Flora en Fauna van de Woestijn

![Gele Gevlekte Hagedis](assets/yellow_spotted_lizard.jpg)
*De Yellow-Spotted Lizard – het dodelijkste dier van Camp Green Lake.*

### De Gele Gevlekte Hagedis (*Yellow-Spotted Lizard*)
Het meest gevreesde wezen in de regio rond Green Lake is de gele vlekkenhagedis.

#### Biologische Kenmerken
- **Lengte**: Ongeveer 15 tot 25 centimeter lang.
- **Vlekken**: Precies **11 gele vlekken** op een groenachtig-geel lichaam. Het gezegde luidt: *\"Als je dichtbij genoeg bent om zijn 11 vlekken te tellen, ben je al dood.\"*
- **Kop en Bek**: Heldergele ogen met felrode oogranden, een melkwitte tong, en vlijmscherpe zwarte tanden.
- **Leefgebied**: Ze leven in diepe, donkere gaten onder de grond waar het koel is en jagen op zonnebloempitten, insecten en kleine knaagdieren. Ze houden van schaduw en nestelen zich daarom graag in pas gegraven gaten.

#### Het Dodelijkste Gif
De beet van een gele vlekkenhagedis is **100% fataal**. Er bestaat geen bekend tegengif. Het gif werkt langzaam maar veroorzaakt ondraaglijke pijn, hallucinaties en een zekere dood. 

#### De Grote Zwakte: Uienbloed
De hagedissen hebben een intense, instinctieve afkeer van **uien**. Wanneer een mens grote hoeveelheden uien eet, absorbeert het bloed de sterke zwavelverbindingen en geuren van de ui. De hagedissen weigeren iemand met \"uienbloed\" te bijten. Deze kennis redde in de 19e eeuw de uieneters van Sam, en redt later het leven van Stanley en Zero wanneer ze urenlang bedekt met tientallen hagedissen in een diep gat moeten staan.

---

### Ratelslangen en Schorpioenen
![Ratelslang](assets/rattlesnake.jpg)
*De prairie-ratelslang, veelvoorkomend in de gatenvelden rond het kamp.*

Naast de hagedissen krioelt de zoutvlakte van schorpioenen en ratelslangen. De kampleiding stelt de kampeerders gerust met een lugubere geruststelling:
> *\"Als je gebeten wordt door een schorpioen of ratelslang, ga je niet dood. Je zult een paar dagen doodziek in je bed liggen met koorts en pijn, maar je overleeft het. Maar als een gele vlekkenhagedis je bijt, hoef je niet eens meer naar het ziekenhuis te gaan.\"*

### Wilde Uien (*Allium*)
Op de afgelegen berg God's Thumb groeit een unieke soort zoete, wilde bergknoflook en uien. Deze planten danken hun bestaan aan de natuurlijke zoetwaterbron die bovenop de berg ontspringt. De uien zijn rijk aan vocht, suikers en vitaminen, en vormen de enige voedselbron voor Stanley en Zero tijdens hun overlevingstocht.

---

## Sleutellocaties in de Omliggende Woestijn

### Het Gatenveld (De Oude Meerbodem)
Zover het oog reikt is de opgedroogde meerbodem bezaaid met tienduizenden gaten. Vanuit de lucht ziet het landschap eruit als het oppervlak van de maan: een eindeloze vlakte vol kraters en zandhopen.

### Het Wrak van Mary Lou
![Boot Mary Lou](assets/mary_lou_boat.png)
*Het omgekeerde wrak van Sam's houten roeiboot Mary Lou op de droge meerbodem.*

Midden in de zoutwoestijn, kilometers verwijderd van het kamp, ligt het omgekeerde wrak van een houten roeiboot half begraven onder het zand. Op de boeg staat nog vaag de naam **Mary Lou** geschilderd.
- Onder de romp ontstaat een schaduwrijke holte waar Zero beschutting zoekt tegen de dodelijke middagzon.
- In de modder onder de boot vindt Zero kratten met 110 jaar oude glazen weckpotten gevuld met Katherine Barlow's perzikjam (\"Sploosh\"), die door de conserveermiddelen en suikers drinkbaar is gebleven en hem in leven houdt.

### God's Thumb (Big Thumb Mountain)
![God's Thumb](assets/gods_thumb.jpg)
*De markante rotsformatie 'God's Thumb' aan de horizon van Green Lake.*

Aan de uiterste rand van de vallei torent een eenzame bergtop boven het landschap uit. De top van de rotsformatie heeft de opvallende vorm van een gigantische opgestoken duim die naar de hemel wijst.
- **De Oorsprong van de Naam**: Stanley Yelnats I beweerde na zijn beroving door Kissin' Kate Barlow dat hij had overleefd door toevlucht te zoeken op \"God's Thumb\".
- **De Fysieke Realiteit**: Bovenop de berg bevindt zich een verborgen oase: een zuivere zoetwaterstroom die tussen de rotsen borrelt en een weelderige weide met wilde uien voedt (oorspronkelijk gecultiveerd door Sam de uienman). Het is de plek waar Stanley en Zero fysiek en spiritueel genezen en waar de vloek definitief wordt opgeheven.
`;

writeDoc('02_Camp_Green_Lake_en_Geografie', doc2);

// ==========================================
// DOCUMENT 3: Het Volledige Plot en Verhaallijnen
// ==========================================
const doc3 = `# Holes – Het Volledige Plot, Drie Verhaallijnen en de Cirkel van het Lot

Het verhaal van *Holes* is een meesterlijk vlechtwerk van drie verschillende historische tijdlijnen die zich over meer dan een eeuw uitstrekken. Wat aanvankelijk losse verhalen lijken over pech, folklore en een jeugdkamp, blijkt een nauwkeurig geconstrueerde cirkel van karma, gerechtigheid en verlossing. Dit document beschrijft alle drie de verhaallijnen en toont aan hoe ze samensmelten tot één samenhangend geheel.

---

## Inhoudsopgave
1. [De Drie Tijdlijnen in Vogelvlucht](#de-drie-tijdlijnen-in-vogelvlucht)
2. [Tijdlijn 1: Letland (Midden 19e Eeuw) – De Oorsprong van de Vloek](#tijdlijn-1-letland-midden-19e-eeuw--de-oorsprong-van-de-vloek)
   - [Elya Yelnats en Myra Menke](#elya-yelnats-en-myra-menke)
   - [Het Pact met Madame Zeroni](#het-pact-met-madame-zeroni)
   - [De Verbroken Belofte en de Vlucht naar Amerika](#de-verbroken-belofte-en-de-vlucht-naar-amerika)
3. [Tijdlijn 2: Green Lake, Texas (Eind 19e Eeuw) – De Tragedie van Kate Barlow](#tijdlijn-2-green-lake-texas-eind-19e-eeuw--de-tragedie-van-kate-barlow)
   - [De Verboden Liefde tussen Katherine en Sam](#de-verboden-liefde-tussen-katherine-en-sam)
   - [De Moord op Sam en het Begin van de 110-Jarige Droogte](#de-moord-op-sam-en-het-begin-van-de-110-jarige-droogte)
   - [De Wraak van Kissin' Kate Barlow](#de-wraak-van-kissin-kate-barlow)
   - [De Beroving van Stanley Yelnats I](#de-beroving-van-stanley-yelnats-i)
   - [De Confrontatie met de Walkers en de Dood door de Hagedis](#de-confrontatie-met-de-walkers-en-de-dood-door-de-hagedis)
4. [Tijdlijn 3: Het Heden bij Camp Green Lake](#tijdlijn-3-het-heden-bij-camp-green-lake)
   - [De Onterechte Veroordeling van Stanley Yelnats IV](#de-onterechte-veroordeling-van-stanley-yelnats-iv)
   - [Het Leven en Zwoegen in Tent D](#het-leven-en-zwoegen-in-tent-d)
   - [Vondsten in het Zand: Het Fossiel en het Lippenstiftbuisje (\"KB\")](#vondsten-in-het-zand-het-fossiel-en-het-lippenstiftbuisje-kb)
   - [De Vriendschap en het Pact tussen Stanley en Zero](#de-vriendschap-en-het-pact-tussen-stanley-en-zero)
   - [Escalatie, Geweld en de Vlucht van Zero](#escalatie-geweld-en-de-vlucht-van-zero)
   - [Stanley's Reddingsactie en de Tocht naar God's Thumb](#stanleys-reddingsactie-en-de-tocht-naar-gods-thumb)
   - [Het Verbreekt van de Vloek: Zero de Berg Op Dragen](#het-verbreekt-van-de-vloek-zero-de-berg-op-dragen)
   - [De Terugkeer naar het Kamp en de Opgraving van de Schatkist](#de-terugkeer-naar-het-kamp-en-de-opgraving-van-de-schatkist)
   - [De Nacht in de Kuil vol Dodelijke Hagedissen](#de-nacht-in-de-kuil-vol-dodelijke-hagedissen)
   - [Rechtvaardigheid, Vrijlating en Regen na 110 Jaar](#rechtvaardigheid-vrijlating-en-regen-na-110-jaar)
5. [De Cirkel van het Lot: Hoe Alles Samenkomt](#de-cirkel-van-het-lot-hoe-alles-samenkomt)

---

## De Drie Tijdlijnen in Vogelvlucht

| Tijdlijn | Periode & Locatie | Hoofdfiguren | Kerngebeurtenis |
|---|---|---|---|
| **Tijdlijn 1** | ~1850, Riga (Letland) | Elya Yelnats, Madame Zeroni | De verbroken belofte veroorzaakt de familievloek |
| **Tijdlijn 2** | ~1888, Green Lake (Texas) | Katherine Barlow, Sam, Trout Walker | Moord op Sam veroorzaakt de 110-jarige droogte; Kate begraaft schat |
| **Tijdlijn 3** | Heden, Camp Green Lake | Stanley Yelnats IV, Hector Zeroni | Stanley draagt Zero de berg op; vloek en droogte worden opgeheven |

---

## Tijdlijn 1: Letland (Midden 19e Eeuw) – De Oorsprong van de Vloek

![Madame Zeroni en Elya](assets/warning_elya_yelnats.png)
*Madame Zeroni waarschuwt Elya Yelnats voor de vloek.*

### Elya Yelnats en Myra Menke
Het verhaal begint in een klein boerendorpje nabij Riga in Letland. De vijftienjarige Elya Yelnats wordt hopeloos verliefd op de beeldschone Myra Menke. Myra is echter oppervlakkig en naïef: haar vader Morris Menke beschrijft haar hoofd als \"zo leeg als een bloempot\". Ook de oudere en welvarende varkensboer Igor Barkov wil met Myra trouwen en biedt haar vader zijn vetste varken aan. Elya heeft niets om te bieden.

### Het Pact met Madame Zeroni
In zijn wanhoop klopt Elya aan bij zijn oude vriendin Madame Zeroni, een wijze Egyptische vrouw die geen voeten meer heeft. Madame Zeroni raadt hem met klem af om met Myra te trouwen: Myra kan niet nadenken, kan niet koken en heeft geen praktisch verstand. Elya weigert te luisteren.

Madame Zeroni besluit hem toch te helpen, maar stelt een strikt ritueel voor:
1. Ze geeft Elya een klein, pasgeboren biggetje.
2. Elya moet het varkentje elke dag op zijn rug een steile berg op dragen naar een zuivere bergstroom.
3. Terwijl het biggetje drinkt, moet Elya een speciaal slaapliedje voor het dier zingen.
4. Elke dag wordt het varkentje zwaarder en groeit Elya's spierkracht evenredig mee.
5. **De Belofte**: Op de dag van Myra's vijftiende verjaardag moet Elya, na het tonen van zijn varken, terugkeren naar Madame Zeroni. Hij moet **haar** op zijn rug de berg op dragen naar de bron, zodat ook zij kan drinken en het lied kan horen.

Madame Zeroni spreekt een duistere waarschuwing uit:
> *\"Als je dit vergeet, zullen jij en al je nakomelingen tot in de eeuwigheid vervloekt zijn met pech en tegenspoed!\"*

### De Verbroken Belofte en de Vlucht naar Amerika
Op de beslissende dag wegen het varken van Elya en dat van Igor allebei precies vijftig stenen. Vader Menke kan niet kiezen. Myra stelt domweg voor dat ze een getal tussen één en tien raden. 

Gedesillusioneerd realiseert Elya zich dat Madame Zeroni gelijk had: Myra houdt van niemand. Hij zegt bitter: *\"Houd het varken maar als huwelijkscadeau voor Igor\"* en vertrekt. Met een gebroken hart monsterde hij direct aan op een Amerikaans vrachtschip om naar de Nieuwe Wereld te varen. 

Pas midden op de Atlantische Oceaan schiet het door zijn hoofd: **hij is Madame Zeroni vergeten de berg op te dragen**. Hij probeert zichzelf gerust te stellen met de gedachte dat het slechts een bijgeloof was, maar vanaf dat moment kleeft de pech aan zijn schoenen. In Amerika trouwt hij met de wijze Sarah Miller en sticht hij het geslacht Yelnats, maar elke generatie wordt achtervolgd door bizarre tegenslagen.

---

## Tijdlijn 2: Green Lake, Texas (Eind 19e Eeuw) – De Tragedie van Kate Barlow

![Kissin' Kate Barlow](assets/kissin_kate_barlow.jpg)
*Katherine Barlow voordat haar leven verwoest werd door de tragedie.*

### De Verboden Liefde tussen Katherine en Sam
Rond 1888 is Green Lake een bloeiende oase. Katherine Barlow is de alom gerespecteerde dorpsonderwijzeres. Ze is zachtaardig, leert zowel kinderen als volwassenen lezen, en bakt de lekkerste ingemaakte perziken van Texas. De rijkste man van de stad, Charles \"Trout\" Walker, probeert haar te veroveren, maar zij wijst hem publiekelijk af.

Katherine raakt bevriend met Sam de Uienman, die met zijn ezel Mary Lou dagelijks door het dorp trekt. Sam helpt haar met het herstellen van de lekkende school: hij vervangt het dak, repareert de ramen en lapt de vloer op. Bij elk probleem glimlacht hij en zegt: *\"I can fix that.\"* De vriendschap slaat om in diepe wederzijdse liefde. Op een regenachtige middag kussen ze elkaar bij het schoolplein.

### De Moord op Sam en het Begin van de 110-Jarige Droogte
Hattie Parker ziet de kus en roept verontwaardigd: *\"God zal jullie straffen!\"* In die tijd was een liefdesrelatie tussen een zwarte man en een witte vrouw bij wet verboden in Texas. Een woedende meute, aangevoerd door Trout Walker, stelt de school in brand en wil Sam lynchen.

Katherine zoekt wanhopig hulp bij de sheriff, maar treft hem dronken aan. De sheriff weigert in te grijpen en eist zelfs een kus van Katherine in ruil voor bescherming. Katherine vlucht naar het meer, waar Sam haar opwacht in zijn roeiboot Mary Lou. 

![Moord op Sam](assets/sam_shot.png)
*Trout Walker executeert Sam op het meer.*

Trout Walker achterhaalt de roeiboot met zijn snelle motorboot. Sam wordt op het water doodgeschoten en Mary Lou wordt geëxecuteerd. Katherine wordt gered tegen haar wil. Vanaf dat exacte moment houdt de regen op met vallen. De hemel sluit zich en Green Lake verandert in een dorre zoutvlakte.

### De Wraak van Kissin' Kate Barlow
Drie dagen na de moord stapt Katherine het kantoor van de sheriff binnen en schiet hem dood. Ze stift haar lippen met felle lippenstift en kust hem op zijn voorhoofd: de beruchte outlaw **Kissin' Kate Barlow** is geboren.

Twintig jaar lang trekt ze plunderend door het Zuidwesten. Ze overvalt banken, postkoetsen en treinen, en laat op elk mannelijk slachtoffer haar rode lipstickkus achter. 

![Schatkist Stanley I](assets/stanley_yelnats_i_robbed.png)
*Stanley Yelnats I wordt beroofd door Kissin' Kate Barlow.*

Een van haar slachtoffers is **Stanley Yelnats I** (de zoon van Elya). Hij heeft zojuist zijn fortuin op de New Yorkse beurs verzilverd en reist met een zware kist vol effecten en contanten naar Californië. Kate overvalt zijn koets, steelt de kist met de inscriptie *\"STANLEY YELNATS\"*, maar weigert hem te kussen of te doden: ze laat hem zonder water achter in de woestijn. Stanley I overleeft wonderbaarlijk door toevlucht te zoeken op \"God's Thumb\".

### De Confrontatie met de Walkers en de Dood door de Hagedis
Twintig jaar na de moord op Sam keert een vermoeide Katherine terug naar het verlaten, uitgedroogde Green Lake. Ze verbergt de gestolen kist diep in de opgedroogde meerbodem.

Trout Walker en zijn straatarme vrouw Linda Miller (een voormalig leerlingetje van Katherine) ontdekken haar aanwezigheid. Ze binden haar vast en eisen onder schot dat ze de vindplaats van haar buit aanwijst. Voordat ze haar kunnen martelen, wordt Katherine in haar blote voet gebeten door een dodelijke gele vlekkenhagedis. Terwijl het gif haar verlamt, lacht ze Trout en Linda triomfantelijk uit:
> *\"Start digging! You, and your children, and your children's children can dig for the next hundred years and you will never find it!\"*

Ze sterft met een glimlach op haar lippen. De Walkers beginnen verwoed te graven – een zinloze queeste die generaties zal duren.

---

## Tijdlijn 3: Het Heden bij Camp Green Lake

![Stanley Yelnats IV](assets/stanley_yelnats_iv.jpg)
*Stanley Yelnats IV arriveert in Camp Green Lake.*

### De Onterechte Veroordeling van Stanley Yelnats IV
In het heden wordt de veertienjarige Stanley Yelnats IV slachtoffer van de zoveelste bizarre samenloop van omstandigheden. Terwijl hij onder een snelwegviaduct loopt, vallen er plotseling een paar versleten sneakers op zijn hoofd. Het zijn de beroemde schoenen van Clyde \"Sweet Feet\" Livingston. Stanley denkt dat het een geluksdag is en rent naar huis om ze aan zijn vader te geven. De politie arresteert hem op heterdaad. Omdat zijn familie geen dure advocaat kan betalen, veroordeelt de rechter hem tot 18 maanden Camp Green Lake.

### Het Leven en Zwoegen in Tent D
In Camp Green Lake wordt Stanley ingedeeld in Tent D. Hij krijgt de bijnaam \"Caveman\". De fysieke ontberingen zijn immens: elke dag 5 voet diep en 5 voet breed graven in de brandende zon. 

Al snel doet Stanley twee opmerkelijke vondsten:
1. Een versteend fossiel van een vis (afgewezen door Mr. Pendanski omdat The Warden geen interesse heeft in fossielen).
2. Een klein gouden kokertje met een hartje en de letters **\"KB\"** erin gegraveerd (in werkelijkheid de lippenstifthuls van Kate Barlow). Op aandringen van groepsleider X-Ray staat Stanley de vondst aan hem af.

Wanneer X-Ray de buis inlevert, raakt The Warden geëxploiteerd van opwinding. Ze laat de jongens dagenlang rond X-Ray's gat graven, zonder te weten dat Stanley de buis tientallen meters verderop heeft gevonden.

### De Vriendschap en het Pact tussen Stanley en Zero
Stanley ontdekt dat Hector Zeroni (\"Zero\") niet kan lezen of schrijven. Zero stelt een ruil voor: als Stanley hem leert lezen, graaft Zero elke dag een deel van Stanley's gat. Het verbond werkt perfect: Zero blijkt uitzonderlijk snel te leren en Stanley houdt energie over.

De andere jongens in Tent D reageren echter jaloers en vijandig. Tijdens een groepsgesprek jut Dr. Pendanski Zigzag op om Stanley aan te vallen. Er ontstaat een brute vechtpartij. Wanneer Zero ingrijpt en Zigzag in een wurggreep neemt, trekken de kampleiders hun wapens. Pendanski vernedert Zero publiekelijk: *\"Zero is te dom om te leren. Je kunt net zo goed deze schep leren lezen.\"* 

Zero kan het niet langer verdragen, slaat Pendanski met zijn schep neer en verdwijnt de zinderende woestijn in.

![Ontsnapping Zero](assets/zero_hat.jpg)
*Zero dwaalt door de dodelijke zoutpan na zijn vlucht.*

### Stanley's Reddingsactie en de Tocht naar God's Thumb
The Warden en Pendanski besluiten de zaak in de doofpot te stoppen: ze wissen Zero's digitale en fysieke dossiers alsof hij nooit heeft bestaan. Stanley wordt verteerd door schuldgevoel. Enkele dagen later kaapt hij de truck van Mr. Sir, rijdt die prompt in een gat, en vlucht te voet de woestijn in om Zero te zoeken.

Kilometers diep in de woestijn stuit Stanley op het wrak van de boot **Mary Lou**. Eronder vindt hij Zero, verzwakt en lijdend aan maagkrampen door het eten van bedorven, 110 jaar oude perzikjam (\"Sploosh\"). 

Aan de horizon zien ze de markante piek van **God's Thumb**. Gedreven door pure overlevingsdrang trekken de jongens naar de berg.

![God's Thumb Beklimming](assets/gods_thumb.jpg)
*God's Thumb – de toevluchtsoord in de bergen.*

### Het Verbreekt van de Vloek: Zero de Berg Op Dragen
Vlak onder de top stort Zero in. Hij kan niet meer lopen, braakt bloed en raakt buiten bewustzijn. Stanley weigert zijn vriend achter te laten. Met bovenmenselijke kracht tilt hij de bewusteloze Hector op zijn schouders en draagt hem de steile rotswand op.

Bovenop de berg vindt Stanley een bron met ijskoud zoet water en een modderpoel vol wilde uien. Hij wast Zero, geeft hem te drinken en voedt hem met uien. 's Nachts, terwijl Zero slaapt, zingt Stanley het eeuwenoude slaapliedje: *\"If only, if only, the woodpecker sighs...\"*.

![Vloek Opgeheven](assets/breaking_the_curse.png)
*Stanley draagt Zero de berg op en verbreekt de vloek van Madame Zeroni.*

Zonder dat Stanley het beseft, heeft hij zojuist **de 110 jaar oude vloek van Madame Zeroni verbroken**: een Yelnats heeft een Zeroni op zijn rug een berg op gedragen, hem laten drinken uit de bron en het lied gezongen!

### De Terugkeer naar het Kamp en de Opgraving van de Schatkist
Tijdens hun herstel op de berg biecht Zero op dat **hij** degene was die Clyde Livingstons schoenen had gestolen uit het tehuis, omdat hij geen schoenen bezat. Stanley vergeeft hem direct.

Stanley beseft dat het lippenstiftbuisje \"KB\" betekent dat de schatkist van Kate Barlow in het gat moet liggen waar hij de buis vond. 's Nachts sluipen de jongens terug naar Camp Green Lake om de kist op te graven.

Ze vinden het gat en beginnen te graven. Na enkele uren stuit Stanley op metaal: een zware koffer. Maar net wanneer ze de kist willen optillen, schijnen er schijnwerpers in het gat. The Warden, Mr. Sir en Dr. Pendanski omsingelen hen.

### De Nacht in de Kuil vol Dodelijke Hagedissen
Wanneer The Warden de kist wil grijpen, deinst ze verschrikt achteruit: het gat blijkt het nest te zijn van tientallen dodelijke **gele vlekkenhagedissen**. Binnen enkele seconden kruipen de gifhagedissen over de kist, over Stanley's benen en nestelen ze zich zelfs op Zero's schouders en borst.

The Warden besluit te wachten tot de hagedissen de jongens bijten, zodat ze de kist alsnog kan claimen en hun lichamen kan dumpen. Urenlang staan Stanley en Zero doodstil in het donker, terwijl de hagedissen over hun gezichten kruipen. Wonder boven wonder bijten de dieren niet: het bloed en de adem van de jongens zijn zó doordrenkt met de geur van de wilde uien van God's Thumb, dat de hagedissen hen volstrekt met rust laten!

![Kist in het Gat](assets/walkers_digging.png)
*De kist van Stanley Yelnats I wordt opgegraven.*

### Rechtvaardigheid, Vrijlating en Regen na 110 Jaar
Bij zonsopgang arriveert er een auto bij het kamp. Het is Stanley's advocate **Carla Morengo**, vergezeld door de Procureur-Generaal van Texas. Derrick Dunne heeft op school bekend dat hij Stanley's schoenen in de wc had gegooid op het exacte tijdstip van de diefstal: Stanley is officieel onschuldig.

Wanneer de hagedissen met het feller wordende zonlicht terugkruipen in hun holen, stappen Stanley en Zero ongedeerd uit het gat met de kist. The Warden beweert dat de kist haar eigendom is, maar dan wijst advocate Morengo op de zijkant van de metalen koffer. Daar staat in grote, onmiskenbare letters gegraveerd:
**\"STANLEY YELNATS\"**

Omdat de kist toebehoorde aan Stanley Yelnats I, heeft The Warden geen enkele juridische claim. Wanneer The Warden probeert Zero in het kamp te houden, eist Morengo zijn dossier. Omdat Pendanski Zero's bestanden heeft gewist, kan de staat niet bewijzen wie Zero is of waarom hij vastzit: hij moet onmiddellijk worden vrijgelaten.

Terwijl Stanley en Zero in de auto stappen en het kamp achter zich laten, gebeurt er iets wat in 110 jaar niet is voorgekomen: **er vallen regendruppels uit de lucht**. Een stortbui wast de hitte en het stof van Green Lake weg. De vloek is definitief verbroken.

---

## De Cirkel van het Lot: Hoe Alles Samenkomt

| Element uit het Verleden | Echo in het Heden | Betekenis / Uitkomst |
|---|---|---|
| **Elya breekt belofte aan Madame Zeroni** | Stanley draagt Hector Zeroni God's Thumb op | Vloek wordt na 110 jaar opgeheven |
| **Het Letse slaapliedje van Madame Zeroni** | Stanley zingt het lied voor Zero op de berg | Spirituele verzoening tussen beide families |
| **Sam's uien redden mensen van hagedissen** | Uien op God's Thumb maken Stanley & Zero immuun | Redding in het hol van de gele vlekkenhagedissen |
| **Sam's roeiboot Mary Lou zinkt op het meer** | Mary Lou vormt Zero's schuilplaats in de woestijn | Zero overleeft de zinderende hitte onder het wrak |
| **Kate Barlow maakt gekruide perziken** | Zero drinkt de 110 jaar oude perziken (\"Sploosh\") | Voedselbron die Zero in leven houdt |
| **Kate Barlow berooft Stanley Yelnats I** | Stanley IV vindt de kist met de naam van zijn overgrootvader | Het familiekapitaal keert terug naar de Yelnatsen |
| **Trout Walker's stinkvoeten (\"Trout\")** | Stanley's vader vindt de voetenspray Sploosh uit | Financieel succes voor de familie Yelnats |
| **De droogte begint bij de dood van Sam** | De regen keert terug zodra de kist gevonden wordt | Kosmische balans en verlossing voor Green Lake |
`;

writeDoc('03_Het_Volledige_Plot_en_Verhaallijnen', doc3);
