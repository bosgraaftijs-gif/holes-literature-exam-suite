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
// DOCUMENT 6: Hoofdstukkenoverzicht en Sleutelscènes
// ==========================================
const doc6 = `# Holes – Compleet Hoofdstukkenoverzicht en Sleutelscènes

Louis Sachars meesterwerk *Holes* bestaat uit precies 50 hoofdstukken, opgedeeld in drie officiële delen. Deze gids biedt een gedetailleerde samenvatting en analyse van elk hoofdstuk en elke sleutelscène voor gebruik in de Holes Exam Study Suite kennisbank.

---

## Deel I: You Are Entering Camp Green Lake (Hoofdstuk 1 t/m 28)

### Hoofdstuk 1
- **Setting**: Introductie van Camp Green Lake. Er is geen meer en er is niets groen. De temperatuur stijgt 's zomers tot boven de 35 graden in de schaduw (die er vrijwel niet is).
- **De Enige Schaduw**: Twee grote eikenbomen bij het huis van The Warden, waarin een hangmat hangt. Kampeerders mogen er niet komen.
- **Fauna**: Rattenslangen, schorpioenen en vooral de dodelijke **gele vlekkenhagedis**.

### Hoofdstuk 2
- **Het Strafconcept**: De keuze voor jeugdige veroordeelden: gevangenis of Camp Green Lake.
- **Motto**: *\"Als je een slechte jongen elke dag een gat laat graven in de zon, wordt hij vanzelf een goede jongen.\"*

### Hoofdstuk 3
- **Stanley's Busrit**: Een rit van acht uur door verlaten Texaanse vlaktes in een bus zonder airconditioning, vergezeld door een gewapende bewaker en de chauffeur.
- **Familie-achtergrond**: Stanley's familie is arm en heeft chronisch pech. Ze geven altijd de schuld aan Stanley's betovergrootvader: de *no-good-dirty-rotten-pig-stealing-great-great-grandfather*.
- **Palindroom**: Stanley Yelnats' naam leest van links naar rechts en rechts naar links exact hetzelfde.

### Hoofdstuk 4
- **Aankomst en Mr. Sir**: Stanley meldt zich bij Mr. Sir, die een Stetson draagt en non-stop zonnebloempitten eet omdat hij gestopt is met roken.
- **De Regels van het Kamp**: Twee oranje overalls, een oranje petje, een veldfles en een schep. Mr. Sir vertelt dat er geen hekken nodig zijn omdat de woestijn iedereen doodt die probeert te ontsnappen.

### Hoofdstuk 5
- **Tent D**: Stanley ontmoet groepsleider Dr. Pendanski, die zichzelf \"Mom\" laat noemen.
- **Ontmoeting met de Jongens**: Stanley maakt kennis met Rex (X-Ray), Alan (Squid), Jose (Magnet), Theodore (Armpit), Ricky (Zigzag) en Hector (Zero). Zero praat niet.

### Hoofdstuk 6
- **De Valse Beschuldiging**: Flashback naar het incident in New York. Stanley werd geraakt door een paar vallende sneakers van honkballer Clyde \"Sweet Feet\" Livingston. Stanley dacht dat het een wonder was voor zijn vaders voetengeur-uitvinding, maar werd gearresteerd voor diefstal.

### Hoofdstuk 7
- **Het Eerste Gat**: Stanley begint om 5:30 uur met zijn eerste gat. De grond is keihard; zijn handen scheuren open en blaren barsten.
- **Flashback naar Letland**: Het verhaal van Elya Yelnats, Madame Zeroni, Myra Menke en Igor Barkov. Het pact met het biggetje en de berg.

### Hoofdstuk 8
- **Geelgevlekte Hagedissen**: Nadere uitleg over de anatomie van de gele vlekkenhagedis (11 vlekken, zwarte tanden, witte tong) en de fatale gevolgen van een beet.

### Hoofdstuk 9
- **The Wreck Room**: Stanley bezoekt de ontspanningsruimte vol kapot meubilair. Hij botst tegen de intimiderende \"Lump\", maar deinst niet terug. X-Ray noemt Stanley vanaf dat moment met respect **\"Caveman\"**.

### Hoofdstuk 10
- **Het Fossiel**: Stanley graaft zijn tweede gat en vindt een versteende prehistorische vis in een brok steen. Hij hoopt op een vrije dag, maar Dr. Pendanski wijst het fossiel af: The Warden zoekt niet naar stenen.

### Hoofdstuk 11
- **X-Ray's Gezag**: X-Ray vraagt Stanley om toekomstige vondsten aan hem af te staan. X-Ray zit al bijna een jaar in het kamp en vindt dat hij een vrije dag verdient. Stanley stemt in om zijn positie in de groep te waarborgen.

### Hoofdstuk 12
- **Kringgesprek met Pendanski**: Pendanski vraagt de jongens wat ze na hun vrijlating willen worden. Magnet wil dieren trainen; Zero zegt kil: *\"Ik hou van graven.\"*

### Hoofdstuk 13
- **De Vondst van het Lippenstiftbuisje**: Stanley vindt een gouden cilinder met de initialen **KB** en een gegraveerd hartje. Hij wil het direct inleveren, maar X-Ray dwingt hem te wachten tot de volgende ochtend.

### Hoofdstuk 14
- **X-Ray's Vrije Dag**: De volgende ochtend doet X-Ray alsof hij de buis zojuist in zijn eigen gat heeft gevonden. Mr. Pendanski roept direct The Warden op.

### Hoofdstuk 15
- **De Verschijning van The Warden**: The Warden (Louise Walker) arriveert in haar rode pick-up truck. Ze beloont X-Ray met een vrije dag en laat de jongens systematisch rond X-Ray's gat graven.

### Hoofdstuk 16 t/m 18
- **Het Doelloze Graven**: Dagenlang scheppen de jongens aarde op de verkeerde plek, omdat de buis in werkelijkheid tientallen meters verderop in Stanley's gat lag. Zero toont interesse in letters en vraagt Stanley om hem te leren lezen.

### Hoofdstuk 19 en 20
- **De Zonnebloempitten**: Magnet steelt Mr. Sir's zak pitten. De pitten vallen in Stanley's gat. Mr. Sir brengt Stanley naar The Warden.
- **De Nagellakscène**: The Warden lakt haar nagels met giftig ratelslangengif en haalt de wang van Mr. Sir open.

### Hoofdstuk 21 en 22
- **Het Geheim van Zero**: Stanley keert terug en ontdekt dat Zero zijn gat heeft afgemaakt! Stanley begint met het geven van leeslessen aan Zero. Zero rekent razendsnel uit het hoofd.

### Hoofdstuk 23 t/m 28
- **De Tragedie van Green Lake**: De complete geschiedenis van Katherine Barlow, Sam de Uienman, de moord op Sam, de 110-jarige droogte, en Katherine's transformatie tot Kissin' Kate Barlow. Haar dood door de hagedis nadat ze weigert de Walkers haar schat te wijzen.

---

## Deel II: The Last Hole (Hoofdstuk 29 t/m 49)

### Hoofdstuk 29
- **Onweer aan de Horizon**: Tijdens een zwoele nacht ziet Stanley bliksemschichten in de verte die het silhouet van een berg verlichten: **God's Thumb**.

### Hoofdstuk 30
- **De Vechtpartij en Zero's Vlucht**: Zigzag valt Stanley aan uit jaloezie over Zero's hulp bij het graven. Zero wurgt Zigzag bijna. Wanneer Pendanski Zero kleineert (*\"You might as well teach this shovel to read\"*), slaat Zero hem neer met de schep en rent de woestijn in.

### Hoofdstuk 31 en 32
- **Dossier Verwijderd**: The Warden en Pendanski wissen Zero's bestanden om zijn verdwijning te verdoezelen. Twitch arriveert als vervanger.

### Hoofdstuk 33 t/m 36
- **Stanley's Ontsnapping**: Stanley steelt de truck, crasht en vlucht te voet. Hij vindt de omgekeerde boot **Mary Lou** en treft Zero daaronder aan, levend op **Sploosh** (oude perziken).

### Hoofdstuk 37 t/m 40
- **De Beklimming van God's Thumb**: De jongens trekken naar de berg. Zero stort in door krampen. Stanley tilt Zero op zijn schouders en draagt hem de berg op. Ze vinden zoet water en een veld wilde uien. Stanley zingt het slaapliedje: **de vloek is opgeheven!**

### Hoofdstuk 41 en 42
- **De Bekentenis**: Zero biecht op dat hij de schoenen van Clyde Livingston had meegenomen en van het viaduct had gegooid. Ze overleven dagenlang op uien en water.

### Hoofdstuk 43 en 44
- **Het Plan en de Opgraving**: De jongens keren 's nachts terug naar het kamp om de kist op te graven in het gat waar Stanley het gouden kokertje vond. Ze vinden een zware metalen kist.

### Hoofdstuk 45 en 46
- **De Nacht met de Hagedissen**: The Warden en de staf omsingelen hen, maar de kuil krioelt van dodelijke gele vlekkenhagedissen. Urenlang staan de jongens doodstil terwijl de hagedissen op hen rusten. De hagedissen bijten niet vanwege het uienbloed.

### Hoofdstuk 47 en 48
- **Advocate Carla Morengo**: De advocate en de Procureur-Generaal arriveren. Ze hebben bewijs dat Stanley onschuldig is. The Warden probeert de kist af te pakken.

### Hoofdstuk 49
- **STANLEY YELNATS**: Op de kist staat de naam van Stanley's overgrootvader gegraveerd. Morengo eist ook Zero op omdat er geen dossier over hem bestaat. Terwijl ze vertrekken, valt de eerste regen sinds 110 jaar over Camp Green Lake.

---

## Deel III: Filling In the Holes (Hoofdstuk 50)

### Hoofdstuk 50
- **De Afwikkeling**:
  - Camp Green Lake wordt gesloten en verkocht; het wordt heropend als Girl Scout Camp.
  - De kist bevat effecten, obligaties en juwelen ter waarde van miljoenen. Stanley en Zero krijgen elk bijna $ 1 miljoen.
  - Stanley's vader lanceert met succes zijn voetenspray **Sploosh**, gepromoot door honkbalheld Clyde Livingston.
  - Zero huurt privédetectives in en wordt herenigd met zijn moeder.
  - Het boek sluit af met de zachte klanken van het slaapliedje, gezongen door Zero's moeder.
`;

writeDoc('06_Hoofdstukkenoverzicht_en_Sleutelscènes', doc6);

// ==========================================
// DOCUMENT 7: Boek vs Film en Media Trivia
// ==========================================
const doc7 = `# Holes – Boek vs. Film Verschillen, Productie en Media Trivia

In 2003 bracht Walt Disney Pictures de speelfilm *Holes* uit, geregisseerd door Andrew Davis. De film geldt als een van de meest getrouwe boekverfilmingen in de filmgeschiedenis, mede omdat auteur Louis Sachar zelf het filmscenario schreef. Toch zijn er fascinerende verschillen en boeiende productieverhalen.

---

## Inhoudsopgave
1. [De Belangrijkste Verschillen tussen Boek en Film](#de-belangrijkste-verschillen-tussen-boek-en-film)
   - [Stanley's Fysieke Verschijning en Gewicht](#stanleys-fysieke-verschijning-en-gewicht)
   - [Leeftijd en Achtergrond van de Personages](#leeftijd-en-achtergrond-van-de-personages)
   - [De Scène met de Vliegende Schoenen](#de-scène-met-de-vliegende-schoenen)
   - [De Dood van Kissin' Kate Barlow](#de-dood-van-kissin-kate-barlow)
2. [De Sterrencast en Personagevertolkingen](#de-sterrencast-en-personagevertolkingen)
3. [Trivia over de Dodelijke Hagedissen](#trivia-over-de-dodelijke-hagedissen)
4. [Muziek en de Soundtrack: Het Fenomeen \"Dig It\"](#muziek-en-de-soundtrack-het-fenomeen-dig-it)
5. [Het Holes Universum: Vervolgen en Spin-offs](#het-holes-universum-vervolgen-en-spin-offs)
   - [*Small Steps* (2006)](#small-steps-2006)
   - [*Stanley Yelnats' Survival Guide to Camp Green Lake* (2003)](#stanley-yelnats-survival-guide-to-camp-green-lake-2003)

---

## De Belangrijkste Verschillen tussen Boek en Film

| Element | In het Boek (1998) | In de Film (2003) |
|---|---|---|
| **Stanley's Postuur** | Zwaarlijvig/dik; valt drastisch af door maandenlang graven | Gespeeld door de slanke tiener Shia LaBeouf |
| **Stanley's Leeftijd** | Begint als 14-jarige; 15 aan het slot | Is 14 tot 16 jaar oud |
| **Mr. Pendanski's Titel** | Begeleider; heeft geen echte doktersgraad | Wordt expliciet aangesproken als *Dr.* Pendanski |
| **Mr. Sir's Echte Naam** | In het boek wordt zijn naam niet genoemd | Heet voluit *Marion Sevillo* |
| **Het Lied \"Dig It\"** | Komt niet voor in het boek | Speciaal geschreven rapnummer voor de D-Tent jongens |
| **De Vechtpartij met Zigzag** | Dr. Pendanski hits Zigzag direct op om Stanley te slaan | Zigzag provoceert Stanley over het graven van gaten |
| **Het Einde van The Warden** | Verliest haar landgoed en gaat failliet | Wordt direct in handboeien afgevoerd door de politie |

---

## De Sterrencast en Personagevertolkingen

- **Stanley Yelnats IV**: Shia LaBeouf (zijn grote doorbraak voor zijn latere Hollywoodcarrière).
- **The Warden (Louise Walker)**: Sigourney Weaver (briljant kille performance).
- **Marion Sevillo (Mr. Sir)**: Jon Voight (Oscarwinnaar die Mr. Sir een iconische mix van humor en dreiging gaf).
- **Dr. Pendanski**: Tim Blake Nelson (vertolkt de schijnheilige counselor).
- **Katherine \"Kissin' Kate\" Barlow**: Patricia Arquette.
- **Sam de Uienman**: Dulé Hill (bekend van *The West Wing* en *Psych*).
- **Madame Zeroni**: Eartha Kitt (legendarische zangeres en actrice; sprak de onvergetelijke waarschuwing uit).
- **Hector Zeroni (Zero)**: Khleo Thomas.
- **Charles \"Trout\" Walker**: Scott Plank.

---

## Trivia over de Dodelijke Hagedissen

In de werkelijkheid bestaan er geen \"Yellow-Spotted Lizards\" met 11 gele stippen en dodelijk gif in Texas.
- Voor de filmopnames gebruikten de filmmakers **echte baardagamen** (*Pogona vitticeps*), een volstrekt ongevaarlijke hagedissensoort afkomstig uit Australië.
- Er waren negen tamme baardagamen op de set aanwezig.
- Om ze het angstaanjagende uiterlijk te geven, beschilderden make-up artiesten de hagedissen met veilige, niet-giftige kinderverf.
- Voor de scènes waarin hagedissen werden beschoten of gevaarlijke stunts uitvoerden, gebruikte regisseur Andrew Davis levensechte poppen en baanbrekende CGI-computeranimaties.

---

## Muziek en de Soundtrack: Het Fenomeen \"Dig It\"

De titelsong van de film, **\"Dig It\"**, werd geschreven en gerapt door de jonge castleden zelf (Khleo Thomas, Shia LaBeouf, Brenden Jefferson en Byron Cotton):
> *\"Two suits, two tokens in hand,*  
> *Got no shoes on my feet, but I'm standing like a man.*  
> *Take a bad boy, make him dig a hole all day in the sun,*  
> *Turn him into a good boy before the day is done!*  
> *Dig it, oh-oh-oh, dig it!\"*

De videoclip werd een gigantische hit op Disney Channel en hielp de film aan een cultstatus onder een hele generatie jongeren.

---

## Het Holes Universum: Vervolgen en Spin-offs

### *Small Steps* (2006)
Louis Sachar schreef in 2006 de officiële vervolgroman **Small Steps**. In plaats van Stanley staat **Theodore \"Armpit\" Johnson** centraal. Drie jaar na zijn vrijlating uit Camp Green Lake woont Armpit in Austin, Texas. Hij probeert met kleine stapjes (*small steps*) een eerlijk leven op te bouwen als medewerker van een hoveniersbedrijf, maar raakt via ex-kampeerder X-Ray verzeild in een zwendel met doorverkochte concertkaartjes voor tienerpopster Kaira DeLeon.

### *Stanley Yelnats' Survival Guide to Camp Green Lake* (2003)
Een humoristisch handboek geschreven door Louis Sachar vanuit het perspectief van Stanley Yelnats IV. Het boekje geeft sarcastische tips aan nieuwe gevangenen over hoe je moet overleven onder Mr. Sir, hoe je blaren op je handen voorkomt, en hoe je schorpioenen uit je laarzen schudt.
`;

writeDoc('07_Boek_vs_Film_Verschillen_en_Media_Trivia', doc7);

// ==========================================
// DOCUMENT 8: Holes Compendium en Studiegids
// ==========================================
const doc8 = `# Holes – Allesomvattend Compendium, Begrippenlijst en Studiegids

Dit document is ontworpen als het ultieme naslagwerk en semantische indexeringsbestand voor de Holes Exam Study Suite. Het bevat beknopte definities, een chronologische tijdlijn, een begrippenlijst, flitskaart-paren en een interactieve zelftest met antwoorden.

---

## Chronologische Tijdlijn

- **~1850 (Riga, Letland)**: Elya Yelnats vergeet zijn belofte aan Madame Zeroni; de vloek daalt neer over de familie Yelnats.
- **1888 (Green Lake, Texas)**: Katherine Barlow en Sam de Uienman worden verliefd. Sam wordt gelyncht door Trout Walker. De regen stopt abrupt; de 110-jarige droogte vangt aan.
- **1888–1908**: Katherine zwerft rond als outlaw Kissin' Kate Barlow. Ze berooft Stanley Yelnats I en begraaft haar schatkist in de opgedroogde meerbodem.
- **1908**: Kate Barlow overlijdt aan de beet van een gele vlekkenhagedis in het bijzijn van Trout en Linda Walker. De Walkers beginnen te graven.
- **Midden 20e Eeuw**: De familie Walker richt Camp Green Lake op als jeugddetentiekamp om het graafwerk voort te zetten via gratis gevangenenarbeid.
- **Heden (Jaren '90 / 2000s)**:
  - Stanley Yelnats IV wordt gearresteerd na de diefstal van Clyde Livingstons schoenen door Zero.
  - Stanley arriveert in Camp Green Lake en vindt het lippenstiftbuisje met \"KB\".
  - Zero slaat Pendanski neer en vlucht; Stanley volgt hem.
  - Stanley draagt Zero God's Thumb op en zingt het lied; de vloek wordt na meer dan 110 jaar verbroken.
  - De kist \"STANLEY YELNATS\" wordt opgegraven; de eerste regen in 110 jaar valt over Camp Green Lake.

---

## Begrippenlijst en Woordenboek

- **Camp Green Lake**: Jeugddetentiekamp in Texas waar delinquenten gaten moeten graven als verkapte zoektocht naar een verborgen schat.
- **Caveman**: Kampbijnaam van Stanley Yelnats IV in Tent D.
- **God's Thumb**: Opvallende bergtop met een zoetwaterbron en wilde uien; reddingsplek voor Stanley I en Stanley IV.
- **Kissin' Kate Barlow**: Beruchte vrouwelijke outlaw die haar mannelijke slachtoffers na hun dood kuste met felrode lippenstift.
- **Mary Lou**: Zowel de 50-jarige ezel van Sam als zijn houten roeiboot op het meer.
- **Sploosh**: (1) De 110 jaar oude ingemaakte perziken van Kate Barlow onder de boot; (2) De revolutionaire voetengeurspray van Stanley Yelnats III.
- **Sweet Feet**: Bijnaam van top-honkballer Clyde Livingston.
- **Uienbloed**: De fysiologische toestand van iemand die veel uien heeft gegeten, waardoor gele vlekkenhagedissen weigeren te bijten.
- **Yellow-Spotted Lizard**: Uiterst giftige woestijnhagedis met precies 11 gele vlekken en een dodelijke beet zonder bekend tegengif.

---

## Flitskaarten (Flashcards) voor Zelfstudie

- **Vraag**: Waarom moet elke jongen in Camp Green Lake elke dag een gat van 5x5 voet graven?
  **Antwoord**: Officieel voor karaktervorming; in werkelijkheid zoekt The Warden naar de begraven schat van Kissin' Kate Barlow.

- **Vraag**: Hoe verbreekt Stanley Yelnats IV de familievloek van Madame Zeroni?
  **Antwoord**: Door haar nazaat Hector Zeroni (Zero) op zijn rug de berg God's Thumb op te dragen, hem te laten drinken uit de zoetwaterbron en het eeuwenoude slaapliedje voor hem te zingen.

- **Vraag**: Waarom overleven Stanley en Zero een hele nacht in een kuil vol dodelijke gele vlekkenhagedissen?
  **Antwoord**: Omdat ze dagenlang vrijwel uitsluitend wilde uien hadden gegeten op God's Thumb. De hagedissen walgen van uiengeur en uienbloed.

- **Vraag**: Welke inscriptie staat er op de opgegraven kist die bewijst dat The Warden er geen recht op heeft?
  **Antwoord**: De naam \"STANLEY YELNATS\" (eigendom van Stanley Yelnats I, die door Kate Barlow werd beroofd).

- **Vraag**: Wat is het geheim van The Warden's nagellak?
  **Antwoord**: Het bevat vers afgetapt ratelslangengif, waardoor het giftig en pijnlijk is zolang het nog nat is.

---

## Interactieve Quiz (10 Vragen met Antwoorden)

1. **Welk palindroom speelt een centrale rol in de familiegeschiedenis?**
   - *Antwoord*: Stanley Yelnats (voornaam en achternaam spiegelen elkaar exact).

2. **Wat zocht Katherine Barlow's aartsvijand Charles \"Trout\" Walker wanhopig zijn hele leven?**
   - *Antwoord*: Haar schatkist vol buit, begraven in de opgedroogde meerbodem.

3. **Wat was de reden dat Sam de Uienman werd vermoord?**
   - *Antwoord*: Hij had een romantische relatie met de witte dorpsonderwijzeres Katherine Barlow, wat in het 19e-eeuwse Texas streng verboden was.

4. **Hoeveel gele vlekken heeft een Yellow-Spotted Lizard precies?**
   - *Antwoord*: Precies 11 gele vlekken.

5. **Wat was de bijnaam van groepsleider Dr. Pendanski onder de jongens van Tent D?**
   - *Antwoord*: \"Mom\".

6. **Welk voorwerp gaf Stanley aan X-Ray om een vrije dag te verdienen?**
   - *Antwoord*: Een gouden lippenstifthuls met de initialen \"KB\" en een hartje.

7. **Wat is de dubbele betekenis van de naam \"Sploosh\"?**
   - *Antwoord*: Kate Barlow's 110 jaar oude perzikjam én de voetenspray van Stanley's vader.

8. **Waarom werd Hector Zeroni \"Zero\" genoemd?**
   - *Antwoord*: Omdat de kampleiding dacht dat hij dom en waardeloos was en dat er niets in zijn hoofd zat.

9. **Wat gebeurt er met het weer op de dag dat Stanley en Zero het kamp verlaten?**
   - *Antwoord*: Na precies 110 jaar van totale droogte valt er weer regen over Green Lake.

10. **Welk personage uit Tent D schittert in het officiële vervolgboek *Small Steps*?**
    - *Antwoord*: Theodore Johnson (\"Armpit\").
`;

writeDoc('08_Holes_Compendium_en_Studiegids', doc8);
