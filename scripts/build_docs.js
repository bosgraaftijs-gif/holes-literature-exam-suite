const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.resolve(__dirname, '../documents');
if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

function writeDoc(filenameBase, mdContent) {
  const mdPath = path.join(DOCS_DIR, `${filenameBase}.md`);
  const txtPath = path.join(DOCS_DIR, `${filenameBase}.txt`);
  
  // Clean plain text version: remove markdown image links, format links cleanly
  const txtContent = mdContent
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/^#+\s+/gm, '')
    .trim();

  fs.writeFileSync(mdPath, mdContent, 'utf-8');
  fs.writeFileSync(txtPath, txtContent, 'utf-8');
  console.log(`Successfully generated ${filenameBase}.md and .txt`);
}

// ==========================================
// DOCUMENT 1: Complete Karaktergids en Lore
// ==========================================
const doc1 = `# Holes – Complete Karaktergids, Fandom Lore en Trivia

Welkom bij de meest diepgaande en complete karaktergids voor **Holes**, gebaseerd op het bekroonde boek van Louis Sachar en de Holes Fandom Wiki. Dit document brengt alle personages uit de drie met elkaar vervlochten tijdlijnen (het heden bij Camp Green Lake, de 19e-eeuwse geschiedenis van Green Lake, en het Letse verleden van de Yelnats-familie) tot in het kleinste detail in kaart voor de Holes Exam Study Suite kennisbank.

---

## Inhoudsopgave
1. [De Hoofdrolspelers](#de-hoofdrolspelers)
   - [Stanley Yelnats IV (\"Caveman\")](#stanley-yelnats-iv-caveman)
   - [Hector Zeroni (\"Zero\")](#hector-zeroni-zero)
2. [De Bewoners van Tent D (D-Tent)](#de-bewoners-van-tent-d-d-tent)
   - [Rex Alvin Washburn (\"X-Ray\")](#rex-alvin-washburn-x-ray)
   - [Theodore Johnson (\"Armpit\")](#theodore-johnson-armpit)
   - [José (\"Magnet\")](#josé-magnet)
   - [Ricky (\"Zigzag\")](#ricky-zigzag)
   - [Alan (\"Squid\")](#alan-squid)
   - [Brian (\"Twitch\")](#brian-twitch)
   - [Lewis / Louis (\"Barf Bag\")](#lewis--louis-barf-bag)
3. [De Kampstaf en de Walker-Dynastie](#de-kampstaf-en-de-walker-dynastie)
   - [The Warden (Louise Walker)](#the-warden-louise-walker)
   - [Marion Sevillo (\"Mr. Sir\")](#marion-sevillo-mr-sir)
   - [Dr. Pendanski (\"Mom\")](#dr-pendanski-mom)
4. [De Historische Figuren van 19e-eeuws Green Lake](#de-historische-figuren-van-19e-eeuws-green-lake)
   - [Katherine Barlow (\"Kissin' Kate Barlow\")](#katherine-barlow-kissin-kate-barlow)
   - [Sam de Uienman (\"Sam the Onion Man\")](#sam-de-uienman-sam-the-onion-man)
   - [Charles \"Trout\" Walker](#charles-trout-walker)
   - [Linda Miller Walker](#linda-miller-walker)
   - [De Sheriff van Green Lake](#de-sheriff-van-green-lake)
5. [De Letse Oorsprong en de Yelnats-Stamboom](#de-letse-oorsprong-en-de-yelnats-stamboom)
   - [Elya Yelnats](#elya-yelnats)
   - [Madame Zeroni](#madame-zeroni)
   - [Myra Menke, Morris Menke & Igor Barkov](#myra-menke-morris-menke--igor-barkov)
   - [Sarah Miller Yelnats](#sarah-miller-yelnats)
   - [Stanley Yelnats I, II en III](#stanley-yelnats-i-ii-en-iii)
   - [Tiffany Yelnats (Moeder)](#tiffany-yelnats-moeder)
6. [Overige Personages](#overige-personages)
   - [Clyde \"Sweet Feet\" Livingston](#clyde-sweet-feet-livingston)
   - [Carla Morengo (Stanley's Advocate)](#carla-morengo-stanleys-advocate)
   - [Derrick Dunne](#derrick-dunne)
   - [Historische Inwoners: Mr. & Mrs. Collingwood, Mr. & Mrs. Tennyson](#historische-inwoners)

---

## De Hoofdrolspelers

### Stanley Yelnats IV (\"Caveman\")
![Stanley Yelnats IV](assets/stanley_yelnats_iv.jpg)
*Stanley Yelnats IV, vertolkt door Shia LaBeouf in de speelfilm.*

- **Volledige naam**: Stanley Yelnats IV
- **Bijnaam**: Caveman (Grotman) – hem toegekend door Tent D nadat hij per ongeluk respect afdwong door de intimiderende jongen The Lump te confronteren.
- **Leeftijd**: 14 jaar bij aankomst in Camp Green Lake; 16 jaar aan het einde van het verhaal.
- **Status**: Levend. Volledig vrijgesproken van diefstal; multimiljonair na de vondst van de Yelnats-schatkist.
- **Familie**: Zoon van Stanley Yelnats III en Tiffany Yelnats; achter-achterkleinzoon van Elya Yelnats.
- **Palindroom**: Zijn voornaam en achternaam spiegelen elkaar exact: S-T-A-N-L-E-Y spelt achterstevoren Y-E-L-N-A-T-S.

#### Biografie en Karakterontwikkeling
Stanley Yelnats IV is een goedaardige, wat introverte tiener die zijn hele jeugd heeft moeten leven onder de schaduw van chronische pech. Zijn familie wijt al hun tegenslagen steevast aan Stanley's betovergrootvader: de *\"no-good-dirty-rotten-pig-stealing-great-great-grandfather\"* Elya Yelnats.

In de roman is Stanley aanvankelijk zwaarlijvig en wordt hij regelmatig gepest op school, met name door de veel kleinere pestkop Derrick Dunne. Zijn noodlot slaat toe wanneer hij onder een viaduct loopt en er plotseling een paar versleten sportschoenen uit de lucht valt en hem op zijn hoofd raakt. Het blijken de beroemde schoenen te zijn van All-Star honkballer Clyde \"Sweet Feet\" Livingston, gedoneerd voor een veiling ten bate van een daklozencentrum. Stanley rent dolblij naar huis om ze aan zijn vader te geven, die hopeloos experimenteert met het recyclen van oude sneakers en een remedie tegen zweetvoeten. De politie vat zijn geren op als vluchtgedrag en arresteert hem voor diefstal.

![Stanley in de rechtszaal](assets/stanley_courtroom.png)
*Stanley Yelnats IV hoort het vonnis aan in de rechtbank.*

De rechter stelt hem voor een ultimatum: 18 maanden jeugdgevangenis of heropvoeding in **Camp Green Lake**. Stanley, die uit een arm gezin komt en nog nooit naar een zomerkamp is geweest, kiest naïef voor Camp Green Lake.

Daar ontdekt hij dat Camp Green Lake geen meer, geen groen gras en geen plezier kent: het is een droge zoutpan waar jeugdige delinquenten elke dag een gat moeten graven van precies 5 voet diep en 5 voet breed (1,52 meter). Het doel van de staf is zogenaamd \"karaktervorming\", maar Stanley realiseert zich al snel dat The Warden naar iets specifieks zoekt.

Tijdens zijn verblijf ondergaat Stanley een diepe fysieke en psychologische transformatie. Zijn handen krijgen eelt, zijn lichaam wordt gespierd en getraind, en zijn zelfvertrouwen groeit. De echte kentering komt wanneer hij vriendschap sluit met **Hector Zeroni (Zero)**. Stanley ontdekt dat Zero analfabeet is maar een geniaal wiskundig brein heeft. Ze sluiten een pact: Zero graaft dagelijks een deel van Stanley's gat, en Stanley leert Zero lezen en schrijven.

Wanneer Zero wegrent na mishandeling door Dr. Pendanski, steelt Stanley een watertruck om hem te zoeken. Na het crashen van de truck trekt hij te voet de dodelijke woestijn in. Hij vindt Zero schuilend onder de boot **Mary Lou**. Samen beklimmen ze de berg **God's Thumb**. Wanneer Zero instort door uitdroging en vergiftiging van bedorven perziken (\"Sploosh\"), tilt Stanley Zero op zijn rug en draagt hem de steile berghelling op. Boven vinden ze water en een veld wilde uien.

Door een nazaat van Madame Zeroni de berg op te dragen en te verzorgen, verbreekt Stanley onbewust de eeuwenoude familievloek. Bij hun terugkeer naar het kamp graven ze de kist van zijn overgrootvader op, overleven ze een nacht temidden van dodelijke gele vlekkenhagedissen dankzij hun 'uienbloed', en worden ze vrijgelaten door advocaat Carla Morengo.

---

### Hector Zeroni (\"Zero\")
![Hector Zeroni (Zero)](assets/hector_zeroni_zero.png)
*Hector Zeroni (Zero), vertolkt door Khleo Thomas.*

- **Volledige naam**: Hector Zeroni
- **Bijnaam**: Zero (Nul) – door staf en kampeerders zo genoemd omdat ze aannemen dat zijn hoofd leeg is en hij waardeloos is.
- **Leeftijd**: Ongeveer 13–14 jaar.
- **Status**: Levend. Herenigd met zijn moeder; financieel onafhankelijk.
- **Familie**: Betovergrootzoon van Madame Zeroni; zoon van Mrs. Zeroni.
- **Acteur**: Khleo Thomas.

![Zero met hoed](assets/zero_hat.jpg)
*Zero in de brandende woestijnzon van Camp Green Lake.*

#### Biografie en Diepe Lore
Hector Zeroni is de eigenlijke katalysator van het hele verhaal. Hij is een dakloze weesjongen die al op zeer jonge leeftijd zijn moeder kwijtraakte nadat zij hem achterliet bij een speeltuin met de belofte snel terug te komen, maar nooit terugkeerde. Zero zwierf jarenlang rond op straat en sliep in steegjes.

Zero is de snelste en meest efficiënte graver van Tent D. Omdat hij weigert te praten tegen volwassenen en geen formele scholing heeft gehad, bestempelt kampbegeleider Dr. Pendanski hem als volstrekt dom. Stanley ontdekt echter dat Zero razendsnel kan hoofdrekenen: hij telt letters in woorden binnen seconden en lost complexe wiskundige vraagstukken moeiteloos uit zijn hoofd op.

Tijdens een intiem gesprek biecht Zero aan Stanley op dat **hij** degene was die de schoenen van Clyde Livingston uit het opvangtehuis had gepakt. Hij wist niet wie Clyde Livingston was; hij had gewoon schoenen nodig omdat zijn eigen schoenen kapot waren. Toen buiten mensen begonnen te schreeuwen over diefstal, raakte Hector in paniek en gooide hij de schoenen over de reling van een snelwegviaduct – waar ze seconden later op het hoofd van de voorbijlopende Stanley vielen!

Wanneer Mr. Pendanski Zero tot het uiterste tergt met de woorden *\"You might as well teach this shovel to read! D-I-G, what does that spell?\"*, knapt er iets in Hector. Hij slaat Pendanski met zijn schep bewusteloos en vlucht de zoutwoestijn in, vastbesloten om liever te sterven dan nog een gat te graven.

Zero overleeft dankzij de omgekeerde roeiboot *Mary Lou*, waaronder hij tientallen oude weckpotten vindt gevuld met **Sploosh** (de 110 jaar oude ingemaakte perziken van Kate Barlow). Dankzij Stanley's hulp bereiken ze God's Thumb. Aan het einde van het boek huurt Zero met zijn helft van de schat ($ 1 miljoen) privédetectives in. Tijdens een feest bij de familie Yelnats wordt Zero eindelijk herenigd met zijn moeder, die hem in tranen het slaapliedje toezingt dat Madame Zeroni ooit in Letland zong.

---

## De Bewoners van Tent D (D-Tent)

![Tent D](assets/d_tent.png)
*Tent D – Het verblijf van Stanley, Zero en de andere kampeerders.*

### Rex Alvin Washburn (\"X-Ray\")
![X-Ray](assets/x_ray_rex_washburn.jpg)
- **Rol**: De onbetwiste, informele leider van Tent D.
- **Uiterlijk**: Klein van stuk, donkere huid, draagt een dikke, stoffige bril.
- **Herkomst bijnaam**: Varkenslatijn (Pig Latin) voor zijn echte voornaam Rex (Rex -> X-Ray). Zelf beweert hij dat hij röntgenogen heeft waarmee hij door mensen heen kan kijken.
- **Dynamiek**: Ondanks zijn geringe fysieke kracht luistert iedereen naar X-Ray, zelfs zwaargewichten als Armpit. Hij hanteert een strikt hiërarchisch systeem bij de waterwagen en eist dat nieuwelingen interessante vondsten aan hem afstaan. Wanneer Stanley het gouden lippenstiftbuisje (\"KB\") vindt, dwingt X-Ray Stanley om het aan hem te geven, zodat X-Ray de vrije dag en een dubbele douchebeurt krijgt.

### Theodore Johnson (\"Armpit\")
![Armpit](assets/armpit_theodore_johnson.png)
- **Rol**: De fysieke spierbundel van Tent D.
- **Achtergrond**: Naar Camp Green Lake gestuurd nadat hij op 14-jarige leeftijd twee oudere jongens in elkaar sloeg bij een bioscoop die hem aanvielen.
- **Herkomst bijnaam**: Gekregen vanwege zijn intense zweetgeur onder de verzengende hitte van Texas.
- **Diepe Fandom Lore**: Armpit is de hoofdpersoon in Louis Sachars officiële vervolgroman **Small Steps** (2006). Na zijn vrijlating probeert hij een eerlijk leven op te bouwen als tuinman in Austin, Texas. Hij raakt bevriend met Ginny (een buurmeisje met cerebrale parese) en belandt in een gecompliceerde romance met tienerpopster Kaira DeLeon.

### José (\"Magnet\")
![Magnet](assets/magnet_jose.jpg)
- **Rol**: De behendige zakkenroller en dief.
- **Achtergrond**: Latijns-Amerikaanse jongen die naar het kamp werd gestuurd na het stelen van een rashond uit een dierenwinkel en het bezit van $ 5.000 aan gestolen waar uit een 7-Eleven.
- **Herkomst bijnaam**: Hij beweert dat zijn vingers magnetisch zijn: spullen blijven er vanzelf aan plakken.
- **Cruciale scène**: Magnet steelt de zak zonnebloempitten van Mr. Sir uit diens truck. De zak scheurt open en de pitten belanden in Stanley's gat, waarna Stanley de schuld op zich neemt om Magnet te sparen.

### Ricky (\"Zigzag\")
![Zigzag](assets/zigzag_ricky.jpg)
- **Rol**: De meest gewelddadige en mentaal instabiele kampeerder.
- **Uiterlijk**: Lang, hoekig, met wild rechtopstaand kroeshaar dat lijkt op een permanente elektrocutie. Zijn hoofd maakt tikkende, zigzaggende bewegingen.
- **Verjaardag**: 8 juli (bevestigd in hoofdstuk 30).
- **Delict**: Het in brand steken van piepschuim op het gazon van zijn middelbare school.
- **Confrontatie**: Zigzag raakt paranoïde en jaloers wanneer Zero Stanley helpt met graven. Aangespoord door Dr. Pendanski valt Zigzag Stanley woest aan en begint hem in elkaar te slaan. Pas wanneer Zero hem in een verwurging neemt, laat hij los.

### Alan (\"Squid\")
![Squid](assets/squid_alan.jpg)
- **Rol**: De sarcastische pestkop met een verborgen kwetsbaarheid.
- **Gedrag**: Doet zich stoer voor en lacht om andermans leed, maar Stanley betrapt hem 's nachts op zacht huilen in zijn bed. Squid beweert bits dat het door \"allergieën\" komt.
- **Ontroerend einde**: Wanneer Stanley wordt vrijgelaten, toont Squid zijn ware hart: hij vraagt Stanley discreet om zijn moeder te bellen en te zeggen dat Alan spijt heeft en van haar houdt.

### Brian (\"Twitch\")
![Twitch](assets/twitch_brian.png)
- **Rol**: De nerveuze nieuwkomer die Zero vervangt.
- **Achtergrond**: Ernstig verslaafd aan joyriding en autidiefstal. Zodra hij een auto ziet, beginnen zijn spieren ongecontroleerd te trillen (\"twitchen\").
- **Trivia**: Zijn technische uitleg over de versnellingspook en koppeling helpt Stanley (onbedoeld) om de truck van het kamp te starten.

### Lewis / Louis (\"Barf Bag\")
![Barf Bag](assets/barfbag_lewis.jpg)
- **Rol**: Stanley's voorganger in Tent D.
- **Trivia**: Kon het bewind van The Warden niet meer verdragen. Hij trok opzettelijk zijn sok en schoen uit en liet zich bijten door een ratelslang om naar het ziekenhuis te ontsnappen. Hierdoor kwam er een bed vrij voor Stanley.

---

## De Kampstaf en de Walker-Dynastie

### The Warden (Louise Walker)
![The Warden](assets/the_warden_louise_walker.jpg)
*The Warden (Louise Walker), vertolkt door Sigourney Weaver.*

- **Volledige naam**: Louise Walker
- **Rol**: Eigenares en directrice van Camp Green Lake.
- **Familielijn**: Kleindochter van Charles \"Trout\" Walker en Linda Miller Walker.
- **Actrice**: Sigourney Weaver.

![Warden nagellak](assets/warden_nail_polish.jpg)
*The Warden lakt haar nagels met ratelslangengif.*

#### Karakter en Motieven
The Warden is de kille, meedogenloze erfgename van de Walker-familie. Haar familie bezit het landgoed al sinds de 19e eeuw, toen Green Lake nog een weelderig meer was. Haar jeugd werd verpest door haar vader en grootvader Trout Walker, die haar als klein meisje dwongen om met pikhouwelen in de zon te graven naar de verloren schat van Kissin' Kate Barlow.

Als volwassene bedacht Louise een sluw systeem: ze veranderde het familiebezit in een heropvoedingskamp voor minderjarige criminelen, zodat ze over een onuitputtelijke bron van gratis dwangarbeiders beschikte om het hele meer systematisch om te spitten.

Haar handelsmerk is haar nagellak, gemengd met puur **ratelslangengif**. Als het nat is, is het gif extreem gevaarlijk; wanneer het opdroogt, is het giftig residu ingekapseld. In een memorabele scène haalt ze met haar natte nagels de wang van Mr. Sir open omdat hij haar lastigvalt met futiliteiten.

Aan het einde van het verhaal worden haar misdaden ontmaskerd door Stanley's advocate en de Procureur-Generaal. The Warden wordt gearresteerd, Camp Green Lake wordt gesloten en het terrein wordt verkocht om te worden omgebouwd tot een officieel Girl Scout Camp.

![Walkers graven gaten](assets/walkers_digging.png)
*Flashback: Drie generaties van de Walker-familie graven al meer dan een eeuw naar Kate Barlow's schat.*

---

### Marion Sevillo (\"Mr. Sir\")
![Mr. Sir](assets/mr_sir_marion_sevillo.jpg)
*Marion Sevillo (\"Mr. Sir\"), gespeeld door Jon Voight.*

- **Volledige naam**: Marion Sevillo
- **Rol**: Hoofdopzichter van Camp Green Lake.
- **Iconische uitspraak**: *\"This ain't a Girl Scout camp!\"*
- **Karakter**: Een humeurige, gewelddadige man met een Stetson en een tatoeage van een ratelslang. Omdat hij gestopt is met roken, eet hij non-stop zonnebloempitten en spuugt de schillen overal neer.
- **Wraak op Stanley**: Nadat The Warden hem verminkt met haar giftige nagellak, geeft Mr. Sir Stanley de schuld van de situatie. Als wraak weigert hij Stanley's watercantine te vullen en giet hij het water treiterend voor Stanley's ogen leeg in het zand.

---

### Dr. Pendanski (\"Mom\")
![Dr. Pendanski](assets/dr_pendanski.jpg)
*Dr. Pendanski (\"Mom\"), gespeeld door Tim Blake Nelson.*

- **Rol**: Kampcounselor voor Tent D.
- **Schijnheiligheid**: Noemt zichzelf \"Mom\" en beweert een vertrouwenspersoon voor de jongens te zijn. In werkelijkheid is hij koudbloedig en manipulatief. Hij kleineert Zero stelselmatig en vernietigt zonder gewetenswroeging Zero's officiële dossier wanneer de jongen verdwijnt, om een schandaal te voorkomen.

---

## De Historische Figuren van 19e-eeuws Green Lake

### Katherine Barlow (\"Kissin' Kate Barlow\")
![Kissin' Kate Barlow](assets/kissin_kate_barlow.jpg)
*Katherine Barlow, vertolkt door Patricia Arquette.*

- **Beroep**: Aanvankelijk de geliefde dorpsonderwijzeres van Green Lake; later de beruchte struikrover \"Kissin' Kate Barlow\".
- **Specialiteit**: Haar legendarische gekruide perziken, ingemaakt naar een geheim familierecept.

![Wanted poster Kate Barlow](assets/wanted_poster_kate_barlow.jpg)
*De gezochte misdadiger Kissin' Kate Barlow.*

#### Tragedie en Wrekerspad
Honderdtien jaar voor de gebeurtenissen in het kamp was Green Lake het grootste zoetwatermeer van Texas, omringd door perzikboomgaarden. Katherine Barlow was een beeldschone en intelligente vrouw die het hof werd gemaakt door de rijkste man van de streek, Charles \"Trout\" Walker. Katherine wees hem resoluut af omdat hij arrogant, wreed en dom was.

Katherine werd verliefd op **Sam**, de zwarte uienman die met zijn ezel Mary Lou uien verkocht en haar schoolgebouw repareerde. Hun vriendschap groeide uit tot een diepe liefde. Op een regenachtige middag kusten ze elkaar op straat. In het 19e-eeuwse zuiden van de VS was een interraciale romance een doodzonde. Het dorp, aangevuurd door de jaloerse Trout Walker, stak de school in brand.

Toen Katherine en Sam probeerden te vluchten over het meer in Sam's roeiboot, ramde Trout Walker hen met zijn gemotoriseerde boot. Sam werd doodgeschoten en zijn ezel Mary Lou werd afgeslacht. Vanaf die dag stopte de regen en begon de 110 jaar durende droogte.

Katherine zwoer wraak. Ze schoot de corrupte sheriff dood, stiftte haar lippen met felrode lippenstift en drukte een dodelijke kus op zijn voorhoofd: Kissin' Kate Barlow was geboren. Twintig jaar lang beroofde en vermoordde ze mannen door het hele Wilde Westen.

![Dood Kate Barlow](assets/kate_barlow_lizard_bite.png)
*Kate Barlow sterft lachend na een beet van een gele vlekkenhagedis.*

Toen ze als oude vrouw terugkeerde naar het uitgedroogde Green Lake, werd ze overvallen door Trout en Linda Walker. Voordat ze haar konden martelen om haar schat te vinden, werd Katherine gebeten door een gele vlekkenhagedis. Ze stierf lachend met de woorden dat de Walkers en hun nageslacht honderd jaar konden graven zonder haar buit ooit te vinden.

---

### Sam de Uienman (\"Sam the Onion Man\")
![Sam the Onion Man](assets/sam_box.png)
*Sam de Uienman, gespeeld door Dulé Hill.*

- **Beroep**: Uienteler en kruidengenezer.
- **Metgezellen**: Zijn trouwe ezel **Mary Lou** en zijn houten roeiboot.
- **Kennis**: Sam wist alles over de medicinale krachten van uien. Zijn mengsels genazen kwalen, stimuleerden haargroei en hielden dodelijke hagedissen op afstand.
- **Motto**: *\"I can fix that.\"* Telkens wanneer Katherine verdrietig was over een defect aan haar schooltje, repareerde Sam het met liefde en toewijding.

---

### Charles \"Trout\" Walker
![Charles Trout Walker](assets/charles_trout_walker.jpg)
*Charles \"Trout\" Walker, gespeeld door Scott Plank.*

- **Status**: Zoon van de rijkste familie van Green Lake.
- **Bijnaam**: \"Trout\" – omdat zijn voeten leden aan een chronische schimmelinfectie die stonk naar rottende vis.
- **Misdaad**: Moordenaar van Sam en aanstichter van de lynchpartij. Na de droogte raakten de Walkers al hun rijkdom kwijt en startte Trout de waanzinnige graafobsessie die drie generaties zou voortduren.

---

### Linda Miller Walker
![Linda Walker](assets/linda_walker_box.png)
- **Achtergrond**: Vroegere basisschoolleerlinge van Katherine Barlow.
- **Huwelijk**: Trouwde met Trout Walker om zijn vermeende rijkdom, maar belandde in bittere armoede toen de droogte het stadje verwoestte.
- **Grootmoeder van The Warden**: Gaf de haat en de zoektocht naar Kate's schat door aan haar nageslacht.

---

## De Letse Oorsprong en de Yelnats-Stamboom

![Elya Yelnats](assets/elya_yelnats.png)
*Elya Yelnats, gespeeld door Damien Luvara.*

### Elya Yelnats
- **Oorsprong**: Riga, Letland (midden 19e eeuw).
- **Rol in de sage**: De betovergrootvader die verantwoordelijk werd gehouden voor de Yelnats-vloek.
- **Geschiedenis**: Werd op 15-jarige leeftijd verliefd op de oppervlakkige Myra Menke. Om haar hand te winnen van varkenshouder Igor Barkov, sloot hij een pact met Madame Zeroni.

---

### Madame Zeroni
![Madame Zeroni](assets/madame_zeroni.webp)
*Madame Zeroni, vertolkt door Eartha Kitt.*

- **Oorsprong**: Egypte; woonachtig in Letland.
- **Eigenschappen**: Een oude, wijze vrouw die beide voeten miste en zich verplaatste in een karretje. Betovergrootmoeder van Hector Zeroni (Zero).
- **Het Varkenspact**: Ze schonk Elya een mager biggetje. Elya moest het varken elke dag de berg op dragen naar een zuivere bergstroom en een speciaal slaapliedje voor hem zingen. Op de trouwdag zou het varken zwaar en gezond zijn. Als tegenprestatie moest Elya **haar de berg op dragen**, zodat ze kon drinken uit de bron en het lied kon horen. Verbrak hij zijn eed, dan zou zijn familie vervloekt zijn voor alle generaties.

![Waarschuwing Madame Zeroni](assets/warning_elya_yelnats.png)
*Madame Zeroni spreekt de noodlottige waarschuwing uit.*

- **De Vloek**: Toen Myra te dom bleek om tussen Elya en Igor te kiezen, gaf Elya het varken weg en monsterde hij aan op een schip naar Amerika. Pas op volle zee besefte hij dat hij Madame Zeroni was vergeten te dragen. De vloek sloeg onmiddellijk toe.

---

### Sarah Miller Yelnats
- **Huwelijk**: Trouwde met Elya in Amerika.
- **Eigenschappen**: Slim, hardwerkend en liefdevol. Ze leerde Elya Engels en veranderde het Letse slaapliedje in het bekende Engelstalige vers: *\"If only, if only, the woodpecker sighs...\"*.

---

### Stanley Yelnats I, II en III
![Stanley Yelnats I beroofd](assets/stanley_yelnats_i_robbed.png)
*Stanley Yelnats I wordt in de woestijn overvallen door Kissin' Kate Barlow.*

- **Stanley Yelnats I**: Zoon van Elya. Verdiende een fortuin op de beurs in New York, maar werd op weg naar het westen beroofd door Kissin' Kate Barlow. Zij liet hem zonder water achter in de woestijn. Hij overleefde wonder boven wonder door te schuilen op **\"God's Thumb\"**.
- **Stanley Yelnats II**: Zoon van Stanley I. Had zijn hele leven te kampen met pech en financiële tegenspoed.
- **Stanley Yelnats III**: Vader van Stanley IV. Een briljante maar berooide uitvinder die probeert een spray tegen stinkvoeten te maken. Hij slaagt hier pas in op de exacte dag dat Stanley IV de vloek opheft op God's Thumb!

---

## Overige Personages

### Clyde \"Sweet Feet\" Livingston
- **Beroep**: Beroemd All-Star honkballer.
- **Verband**: Zijn schoenen werden gedoneerd aan het daklozencentrum en gestolen door Zero. Aan het einde van het boek treedt hij op in commercials voor **Sploosh**, de voetenspray van Stanley's vader.

### Carla Morengo
- **Beroep**: Stanley's advocate.
- **Heldendaad**: Ontdekt dat Stanley onschuldig is doordat pestkop Derrick Dunne bekent dat Stanley ten tijde van de diefstal op school werd gepest. Ze reist naar Camp Green Lake, eist Stanley's vrijlating en neemt ook Zero mee omdat zijn dossier spoorloos is verdwenen.

### Derrick Dunne
- **Rol**: De schoolpestkop die Stanley het leven zuur maakte, maar wiens getuigenis Stanley uiteindelijk vrijpleit.

---

## Karaktermatrix en Overzichtstabel
| Personage | Bijnaam / Alias | Tijdlijn | Rol in het Verhaal | Definitieve Uitkomst |
|---|---|---|---|---|
| **Stanley Yelnats IV** | Caveman | Heden | Hoofdrolspeler; verbreekt de vloek | Vrijgesproken; bezit $ 1 miljoen |
| **Hector Zeroni** | Zero | Heden | Dief van de schoenen; redt Stanley | Herenigd met moeder; rijk |
| **The Warden** | Louise Walker | Heden | Tirannieke eigenares Camp Green Lake | Gearresteerd; kamp gesloten |
| **Marion Sevillo** | Mr. Sir | Heden | Wrede kampopzichter | Gearresteerd door Texas Rangers |
| **Dr. Pendanski** | Mom | Heden | Manipulatieve groepsbegeleider | Ontslagen; verliest reputatie |
| **Rex Washburn** | X-Ray | Heden | Onofficiële leider van Tent D | Vrijgelaten na ontbinding kamp |
| **Theodore Johnson**| Armpit | Heden | Krachtpatser; held van *Small Steps*| Revalideert en werkt in Austin |
| **José** | Magnet | Heden | Zakkenroller en behendige dief | Vrijgelaten |
| **Ricky** | Zigzag | Heden | Paranoïde, gewelddadige kampeerder| Vrijgelaten |
| **Katherine Barlow** | Kissin' Kate | 19e Eeuw | Lerares veranderd in meedogenloze outlaw | Dood door gele vlekkenhagedis |
| **Sam** | The Onion Man | 19e Eeuw | Kruidendokter en uienteler | Vermoord door lynchmeute |
| **Charles Walker** | Trout | 19e Eeuw | Rijke moordenaar met stinkvoeten | Verarmd gestorven in droogte |
| **Elya Yelnats** | No-good-dirty... | Letland | Stamvader die de vloek veroorzaakte | Gestorven in Amerika |
| **Madame Zeroni** | - | Letland | Oude wijze vrouw; plaatste de vloek | Vloek na 110 jaar opgeheven |
`;

writeDoc('01_Holes_Complete_Karaktergids_en_Lore', doc1);
