import os
import re

DOCS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'documents'))

def write_doc(filename_base, md_content):
    md_path = os.path.join(DOCS_DIR, f"{filename_base}.md")
    txt_path = os.path.join(DOCS_DIR, f"{filename_base}.txt")

    txt_content = re.sub(r'!\[.*?\]\(.*?\)', '', md_content)
    txt_content = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', txt_content)
    txt_content = re.sub(r'^#+\s+', '', txt_content, flags=re.MULTILINE)
    txt_content = txt_content.strip()

    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(md_content.strip() + '\n')
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write(txt_content + '\n')
    print(f"Successfully generated {filename_base}.md and {filename_base}.txt")

# ==============================================================================
# SlideShare Transcript & Analysis in English
# ==============================================================================
slideshare_doc = """# SlideShare Transcript & Literary Analysis: Holes Characters
**Source URL:** https://www.slideshare.net/slideshow/holes-characters/3473649#10  
**Original Slide Author:** ginageo65  
**Context:** Educational presentation analyzing the core characters of Louis Sachar's *Holes* for secondary school literature students and NotebookLM exam preparation.

---

## Slide 1: Title Slide
![Slide 1 - Holes Characters](assets/slide_1.jpg)

### Original Text:
> **Holes**  
> Characters from Holes

### Analysis & Context:
Opening title slide featuring atmospheric silhouettes of desert cacti against a glowing sunset and crescent moon, establishing the isolated, sun-drenched setting of Camp Green Lake.

---

## Slide 2: Stanley Yelnats
![Slide 2 - Stanley Yelnats](assets/slide_2.jpg)

### Original Text:
> **Stanley Yelnats**  
> - Stanley Yelnats is the protagonist (main character) of the story.  
> - He is a kind and gentle person but he always seems to be in the wrong place at the wrong time.  
> - He is accused of stealing the old sneakers of a famous baseball player and is sent to Camp Green Lake as punishment.  
> - At school, Stanley is bullied by Derrick Dunne, is teased for being overweight, and has no friends.  
> - Like other members of his family, Stanley remains hopeful and does not become easily depressed, even when conditions at Camp Green Lake give him reason to become so.  
> - Stanley displays loyalty and compassion towards Zero, who becomes his first-ever real friend. As the story progresses, Stanley grows in strength, both physically and mentally, and becomes an unlikely hero.

### Key Exam Insights:
- **Role:** Central Protagonist; unlikely hero undergoing a classic *bildungsroman*.
- **Character Traits:** Resilient, gentle, deeply loyal, and persevering despite chronic misfortune.
- **Conflict:** Socially isolated, bullied by Derrick Dunne, and falsely convicted of grand larceny.
- **Transformation:** Develops physical strength, endurance, and decisive moral courage through his friendship with Zero.

---

## Slide 3: Stanley's Father (Mr. Yelnats)
![Slide 3 - Stanley's Father](assets/slide_3.jpg)

### Original Text:
> **Stanley's Father**  
> - Mr Yelnats is an inventor - and not a very successful one (yet!). He believes that, for a successful invention, you need to have 'intelligence, perseverance, and just a little bit of luck' (p. 8).  
> - Stanley says his father is smart and has perseverance but no luck (because of his no-good-dirty-rotten-pig-stealing-great-great-grandfather, of course).  
> - Mr Yelnats is trying to discover a use for old sneakers. He is always very hopeful that the luck of the Yelnats family will change and so he remains positive and enthusiastic.

### Key Exam Insights:
- **Vocation:** Persistent inventor working to recycle old sneakers and cure foot odor.
- **Philosophy:** Values intelligence and perseverance, but recognizes his family's lack of luck due to the ancestral curse.
- **Climax:** Discovers the revolutionary foot spray "Sploosh" on the exact day the curse is lifted.

---

## Slide 4: Stanley's Mother (Mrs. Yelnats)
![Slide 4 - Stanley's Mother](assets/slide_4.jpg)

### Original Text:
> **Stanley's Mother**  
> - Mrs Yelnats seems to be very patient - it can't be easy living with an inventor - but she also has a good sense of humour.  
> - She is very worried about Stanley going to 'camp' so Stanley assures her in his letters that he is having fun.

### Key Exam Insights:
- **Character:** Warm, patient, and humorous despite living in a cramped, smelly apartment filled with boiling sneakers.
- **Relationship with Stanley:** Stanley writes cheerful letters home pretending he is swimming and playing sports at camp to spare her emotional distress.

---

## Slide 5: Elya Yelnats
![Slide 5 - Elya Yelnats](assets/slide_5.jpg)

### Original Text:
> **Elya Yelnats**  
> - Elya Yelnats is Stanley's great-great-grandfather. He was born in Latvia and, at the age of fifteen, fell in love with Myra Menke whose head was 'as empty as a flowerpot' (p. 29).  
> - Unlike the other boys his age, Elya is a romantic who prefers to listen to the stories of Madame Zeroni rather than play games. He seeks Madame Zeroni's advice on how to win the love of Myra Menke but, when Myra cannot make up her mind who to marry, Elya mutters, 'Marry Igor... You can keep my pig as a wedding present' (p. 35) and decides to travel to America.  
> - However, in doing so, he forgets his promise to Madame Zeroni and causes the Yelnats family curse. Elya marries Sarah Miller and they have a child, the first Stanley Yelnats.

### Key Exam Insights:
- **Origin:** Stanley's romantic Latvian ancestor.
- **Source of Curse:** Received a magical piglet ritual from Madame Zeroni but forgot his solemn vow to carry her up the mountain.
- **Resolution:** His failure is resolved 110 years later when Stanley IV carries Hector Zeroni up God's Thumb.

---

## Slide 6: Miss Katherine Barlow (Kissin' Kate Barlow)
![Slide 6 - Miss Katherine Barlow](assets/slide_6.jpg)

### Original Text:
> **Miss Katherine Barlow**  
> - When we first meet Miss Katherine she is a sweet, gentle schoolteacher who falls in love with Sam the Onion Man. It seems that she is the only person in Green Lake who is not a racist.  
> - Miss Katherine is caught kissing Sam and the town turns on them. After they murder the man she loves, Katherine turns into the notorious Kissing Kate Barlow, a highway robber who kisses the men she murders.  
> - Trout Walker confronts Kissing Kate Barlow many years later as he searches for the stolen treasure, but she dies after being bitten by a yellow-spotted lizard before he can discover where the loot is buried.

### Key Exam Insights:
- **Transformation:** From dedicated schoolteacher and spiced-peach maker to ruthless, gunslinging outlaw.
- **Motivated by Grief:** Driven by intense vengeance and heartbreak following Sam's racial murder.
- **Death:** Dies laughing from a yellow-spotted lizard bite, preserving the location of her buried loot.

---

## Slide 7: Sam the Onion Man
![Slide 7 - Sam the Onion Man](assets/slide_7.jpg)

### Original Text:
> **Sam the Onion Man**  
> - Sam's onions are famous in Green Lake because they have the power to heal and to protect against yellow-spotted lizards.  
> - Sam is a kind, gentle and very clever man. When there are problems in Green Lake he says, 'I can fix that'.  
> - He is murdered for kissing a white woman, Katherine Barlow, by the jealous Trout Walker.

### Key Exam Insights:
- **Vocation & Gifts:** Herbalist and builder with his donkey Mary Lou; his onions possess healing and lizard-repelling properties.
- **Signature Motto:** *"I can fix that."*
- **Tragic Fate:** Lynched on the lake due to racial bigotry, initiating the 110-year drought.

---

## Slide 8: Charles "Trout" Walker
![Slide 8 - Charles "Trout" Walker](assets/slide_8.jpg)

### Original Text:
> **Charles 'Trout' Walker**  
> - Trout Walker is a loud and stupid man who expects to get whatever he wants because his family is wealthy.  
> - Trout has a terrible foot odor which is caused by a foot fungus: 'His feet smelled like dead fish' (p. 102).  
> - When Miss Katherine refuses to take a ride in his boat, Trout becomes angry and, when he catches her with Sam, Trout leads the mob that hunts Sam down.  
> - After the lake dries up, Trout's family loses their wealth. He spends his life digging for Kate Barlow's buried treasure.

### Key Exam Insights:
- **Character:** Entitled, violent bully of Green Lake.
- **Affliction:** Incurable foot fungus giving his feet the odor of decomposing fish ("Trout").
- **Legacy of Greed:** Initiates the multi-generational obsession with Kate Barlow's treasure passed down to the Warden.

---

## Slide 9: Derrick Dunne
![Slide 9 - Derrick Dunne](assets/slide_9.jpg)

### Original Text:
> **Derrick Dunne**  
> - Derrick Dunne is a bully at Stanley's school who makes Stanley's life a misery.  
> - The teachers think that Derrick is harmless because he is much smaller than Stanley: 'None of the teachers believed that Derrick could bully Stanley, because Stanley was three times Derrick's size' (p. 23).  
> - Derrick's actions inadvertently lead to Stanley's alibi when he admits to dropping Stanley's sneakers into the toilet.

### Key Exam Insights:
- **Bully Archetype:** Shows how school authorities judge situations superficially based on physical size.
- **Poetic Justice:** His confession that he stole Stanley's notebook and threw his sneakers into a toilet establishes Stanley's legal alibi.

---

## Slide 10: Hector Zeroni ("Zero")
![Slide 10 - Hector Zeroni](assets/slide_10.jpg)

### Original Text:
> **Hector Zeroni (Zero)**  
> - Zero is an inmate at Camp Green Lake who is treated badly by the staff and other campers: 'He's not stupid... He's just got nobody in his head' (p. 19).  
> - Zero is illiterate and doesn't talk much, but he is very intelligent and can do maths in his head quickly.  
> - He is the fastest digger at the camp and makes an agreement with Stanley to dig part of his hole in exchange for reading lessons.  
> - Zero stole the sneakers that landed Stanley in Camp Green Lake. He ran away from camp after an altercation with Mr Pendanski.

### Key Exam Insights:
- **Identity:** Direct descendant of Madame Zeroni; real sneaker taker who acted out of basic survival necessity.
- **Hidden Gifts:** Phenomenal mental math skills and rapid literacy acquisition.
- **Brotherhood:** Forms a deep, transformative friendship with Stanley that breaks the ancestral curse.

---

## Slide 11: Madame Zeroni
![Slide 11 - Madame Zeroni](assets/slide_11.jpg)

### Original Text:
> **Madame Zeroni**  
> - Madame Zeroni is an old Egyptian woman who lives in Latvia and has no feet.  
> - She is a friend of Elya Yelnats and gives him a piglet to help him win the hand of Myra Menke.  
> - She tells Elya to carry the pig up a mountain every day so it can drink from the stream and get bigger, and warns him that he must carry her up the mountain too or his family will be cursed.  
> - Elya forgets his promise and the Yelnats family curse begins. Madame Zeroni is Hector Zeroni's great-great-great-grandmother.

### Key Exam Insights:
- **Heritage & Wisdom:** Ancient Egyptian seer in Latvia missing both feet.
- **The Curse & Lullaby:** Originator of the pig growth ritual, the binding curse, and the sacred lullaby.
- **Generational Closure:** Reconciled with the Yelnats family 110 years later through Hector and Stanley.

---

## Slide 12: The Warden (Louise Walker)
![Slide 12 - The Warden](assets/slide_12.jpg)

### Original Text:
> **The Warden**  
> - The Warden is the granddaughter of Trout Walker and the head of Camp Green Lake.  
> - She forces the boys to dig holes because she is looking for Kissing Kate Barlow's buried treasure.  
> - She is cruel and ruthless. She wears nail polish made with rattlesnake venom: 'It's only toxic while it's wet' (p. 90).  
> - She scratches Mr Sir with her nails when he bothers her with trivial matters.

### Key Exam Insights:
- **Villainy & Greed:** Explains her exploitation of juvenile labor to unearth family treasure.
- **Trademark Weapon:** Rattlesnake venom nail polish used to terrorize subordinates and inmates alike.
- **Defeat:** Discredited, arrested, and forced to sell the family land to the Girl Scouts.

---

## Slide 13: Dr. Pendanski ("Mom")
![Slide 13 - Mr. Pendanski](assets/slide_13.jpg)

### Original Text:
> **Mr Pendanski**  
> - Mr Pendanski is the counselor for Tent D. He pretends to be friendly and caring, asking the boys to call him 'Mom'.  
> - However, he is cruel to Zero, constantly belittling him: 'You might as well try to teach this shovel to read' (p. 137).  
> - When Zero runs away, Mr Pendanski deletes his records so that no one will know he was ever at Camp Green Lake.

### Key Exam Insights:
- **Deceptive Counselor:** Represents insidious institutional hypocrisy and bureaucratic malice.
- **Bullying of Zero:** Goads Zero until Zero retaliates with a shovel; Pendanski erases Hector's state files.

---

## Slide 14: Mr. Sir (Marion Sevillo)
![Slide 14 - Mr. Sir](assets/slide_14.jpg)

### Original Text:
> **Mr Sir**  
> - Mr Sir is the chief counselor at Camp Green Lake. He is bad-tempered and wears a cowboy hat.  
> - He has recently quit smoking and eats sunflower seeds instead: 'Whenever you see Mr Sir, he is chewing sunflower seeds and spitting the shells onto the ground' (p. 12).  
> - After the Warden scratches him, Mr Sir takes out his anger on Stanley by withholding water from him.

### Key Exam Insights:
- **Overt Brutality:** Strict, violent disciplinarian with a rattlesnake tattoo and aviator sunglasses.
- **Vindictiveness:** Retaliates against Stanley by pouring his water rations directly into the sand.

---

## Slide 15: Character Profile Guide
![Slide 15 - Character Profiles](assets/slide_15.jpg)

### Original Text:
> **Character Profile Guide**  
> - Review all character motivations, relationships, and symbolic connections.  
> - Notice how each character in the present day has an exact counterpart in the historical timelines.

---

## Slide 16: Setting and Themes
![Slide 16 - Desert Setting](assets/slide_16.jpg)

### Original Text:
> **Themes & Discussion Questions**  
> - How do fate and free will interact in the lives of Stanley and Zero?  
> - In what ways is Camp Green Lake a critique of the justice system?  
> - What role does loyalty and friendship play in breaking generational trauma?
"""

# ==============================================================================
# Complete Character Guide & Analysis in English
# ==============================================================================
char_doc = """# Holes (Louis Sachar) — Comprehensive Character and Literary Analysis Guide for NotebookLM
*An exhaustive, structured study compendium for secondary/high school literature exams, essay preparation, and interactive Q&A sessions on the characters of Louis Sachar's 'Holes'.*

---

## 1. Introduction and Structural Multi-Strand Overview

Louis Sachar's *Holes* (1998) is structured around three seamlessly intertwined timelines that converge in the present day of protagonist Stanley Yelnats IV:
1. **The Modern Timeline (Camp Green Lake, Texas)**: Stanley Yelnats is wrongfully convicted of stealing the sneakers of baseball superstar Clyde "Sweet Feet" Livingston and sent to a Texas juvenile labor camp. Here he meets Hector Zeroni ("Zero") and is forced to dig five-foot holes daily under the tyrannical rule of the Warden.
2. **The 19th Century in Latvia (The Curse of Elya Yelnats)**: Stanley's great-great-grandfather Elya courts Myra Menke, receives a piglet from Egyptian seer Madame Zeroni, but breaks his vow to carry her up the mountain, instigating a multi-generational family curse.
3. **Old Green Lake, Texas (circa 1888 — The Tragedy of Katherine & Sam)**: Green Lake is a flourishing paradise. Beloved schoolteacher Katherine Barlow falls in love with African-American herbalist Sam. Driven by racism, Trout Walker's mob murders Sam. Katherine transforms into the feared outlaw Kissin' Kate Barlow, robbing Stanley Yelnats I and burying her fortune in the dried lakebed.

---

## 2. Central Protagonists

### 2.1 Stanley Yelnats IV ("Caveman")
![Stanley Yelnats](assets/stanley_yelnats.jpg)

* **Full Legal Name:** Stanley Yelnats IV
* **Camp Nickname:** "Caveman" (awarded by Tent D after standing up to the Lump in the Wreck Room)
* **Family Role:** Son of an eccentric inventor; great-great-grandson of Elya Yelnats. His palindromic name mirrors the cyclical nature of fate.

#### Physical Description and Transformation
At the novel's exposition, Stanley is an overweight, insecure, socially isolated fourteen-year-old boy bullied at school by Derrick Dunne. By the end of his stay at Camp Green Lake, grueling physical labor has hardened his physique, giving him dense muscle, calloused hands, endurance, and deep moral self-confidence.

#### Narrative Role & Bildungsroman
Stanley is the dynamic viewpoint character experiencing a coming-of-age transformation. Wrongfully convicted for sneaker theft, he navigates the social hierarchy of Tent D, forms a literacy partnership with Zero, ventures into the desert to rescue Zero at God's Thumb, and unknowingly breaks the generational curse by carrying Hector Zeroni up the mountain.

#### Key Quotes & Literary Analysis
1. *"I am in the right place at the right time."* (Stanley realizes that his apparent misfortune placed him precisely where he needed to be to break the curse and achieve justice).
2. *"He didn't want to dig any more holes. But he knew that if he walked out into the desert, he'd die."* (Illustrates his early struggle for survival).
3. *"Zero wasn't a nobody. He was somebody."* (Stanley's moral awakening against institutional dehumanization).

---

### 2.2 Hector Zeroni ("Zero")
![Hector Zeroni](assets/hector_zeroni_zero.jpg)

* **Full Legal Name:** Hector Zeroni
* **Camp Nickname:** "Zero" (cruelly imposed by staff under the claim that his head is empty)
* **Family Role:** Great-great-grandson of Madame Zeroni; son of Mrs. Zeroni.

#### Physical Description and Background
Hector is the smallest camper in Tent D, featuring watchful dark eyes and a quiet, guarded demeanor. Homeless since early childhood after his mother disappeared, he never attended school and is functionally illiterate. However, he is exceptionally gifted in mental arithmetic and is the fastest digger in the camp.

#### Narrative Role & Rebellion
Zero is the real sneaker taker, having taken Clyde Livingston's shoes from a homeless shelter display out of sheer necessity. When Dr. Pendanski cruelly insults his intellect in Chapter 30, Zero strikes him with a shovel and flees into the desert. He survives on 110-year-old preserved spiced peaches ("Sploosh") under the wreck of the *Mary Lou*. When Stanley carries him up God's Thumb, Zero recovers on wild onions and water, confessing the sneaker theft. After unearthing the Yelnats suitcase, Zero uses his $1 million share to hire detectives and reunite with his mother.

---

## 3. The Inhabitants of Tent D (D-Tent Campers)

### 3.1 Rex Alvin Washburn ("X-Ray")
- **Role:** Undisputed alpha leader of Tent D.
- **Nickname Origin:** Pig Latin for Rex (Rex -> X-Ray).
- **Dynamic:** Despite his small stature and thick glasses, he controls the camp water queue and coerces Stanley into giving him the gold "KB" tube to earn a day off.

### 3.2 Theodore Johnson ("Armpit")
- **Role:** Physical muscle and enforcer of Tent D; earned his nickname after a scorpion bite.
- **Extended Fandom Lore:** Central protagonist of Louis Sachar's official sequel *Small Steps* (2006), working as a landscaper in Austin, Texas.

### 3.3 José ("Magnet")
- **Role:** Skilled pickpocket who steals Mr. Sir's sack of sunflower seeds; Stanley takes the blame to protect him.

### 3.4 Ricky ("Zigzag")
- **Role:** Volatile, paranoid camper with wild frizzy hair; attacks Stanley during the literacy dispute in Chapter 30.

### 3.5 Alan ("Squid")
- **Role:** Sarcastic bully who secretly weeps for his mother at night; asks Stanley to call his mother with a message of love upon release.

### 3.6 Brian ("Twitch")
- **Role:** Nervous car thief who replaces Zero; his babbling about clutches inadvertently teaches Stanley how to drive the water truck.

### 3.7 Lewis / Louis ("Barf Bag")
- **Role:** Stanley's predecessor in Tent D who deliberately stepped on a rattlesnake to escape the camp's forced labor.

---

## 4. Camp Staff and Administration

### 4.1 Louise Walker (The Warden)
- **Role:** Ruthless camp proprietor; granddaughter of Trout Walker.
- **Modus Operandi:** Forces boys to dig holes to find Kate Barlow's buried treasure; uses rattlesnake venom fingernail polish to terrorize staff and inmates.
- **Fate:** Exposed by attorney Carla Morengo, arrested, and forced to sell the family estate to the Girl Scouts.

### 4.2 Marion Sevillo ("Mr. Sir")
- **Role:** Chief counselor who wears a Stetson and constantly chews sunflower seeds after quitting smoking.
- **Vendetta:** After being scratched by the Warden's venomous polish, he takes revenge by pouring Stanley's water ration onto the sand.

### 4.3 Dr. Pendanski ("Mom")
- **Role:** Tent D counselor who feigns care while relentlessly bullying Zero and deleting his legal records to cover up his desert escape.

---

## 5. Historical Figures of 1888 Green Lake

### 5.1 Katherine Barlow ("Kissin' Kate Barlow")
- **Role:** Gentle 1888 schoolteacher famous for award-winning spiced peaches; transformed into a feared outlaw after Sam's lynching.
- **Trademark:** Kissed the men she robbed with bright red lipstick; robbed Stanley Yelnats I; died laughing from a yellow-spotted lizard bite.

### 5.2 Sam the Onion Man
- **Role:** African-American herbalist and onion vendor with his donkey Mary Lou; repeatedly declared *"I can fix that."*
- **Significance:** His medicinal sweet onions cured illness and repelled lizards; his racially motivated murder initiated the 110-year drought.

### 5.3 Charles "Trout" Walker
- **Role:** Arrogant, wealthy Green Lake landowner afflicted with fish-odor foot fungus ("Trout"). Led the racist mob that killed Sam, starting the family's obsessive treasure quest.

---

## 6. Latvian Ancestral Figures

### 6.1 Elya Yelnats
- **Role:** Stanley's 19th-century Latvian great-great-grandfather who sought Myra Menke's hand, received the piglet ritual from Madame Zeroni, but forgot his vow to carry her up the mountain, initiating the family curse.

### 6.2 Madame Zeroni
- **Role:** Wise, one-legged Egyptian elder residing in Latvia; great-great-grandmother of Hector Zeroni; placed the generational curse on Elya's lineage.

---

## 7. Comparative Character Matrix

| Character | Era | Key Symbol | Narrative Resolution |
|---|---|---|---|
| **Stanley Yelnats IV** | Modern Day | Shovel, Palindrome | Matures, breaks curse, receives $1 million |
| **Hector Zeroni** | Modern Day | Sploosh, Lullaby | Achieves literacy, reunited with mother |
| **Louise Walker** | Modern Day | Venom Polish | Arrested, Camp Green Lake closed |
| **Katherine Barlow** | 1888 Green Lake | Red Lipstick, Peaches | Dies laughing from lizard bite |
| **Sam the Onion Man** | 1888 Green Lake | Sweet Onions | Murdered on lake; legacy protects boys |
| **Charles Walker** | 1888 Green Lake | Rotting Fish Feet | Dies destitute digging in the drought |
| **Elya Yelnats** | 1850s Latvia | Piglet, Broken Oath | Died in America; curse lifted by Stanley IV |
| **Madame Zeroni** | 1850s Latvia | Mountain Stream | Reconciled through Hector and Stanley |
"""

if __name__ == '__main__':
    write_doc('slideshare_holes_characters_transcript', slideshare_doc)
    write_doc('holes_characters_complete_guide', char_doc)
