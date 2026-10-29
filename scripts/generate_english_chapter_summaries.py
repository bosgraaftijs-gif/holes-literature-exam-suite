import os
import re

DOCS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'documents'))

def generate_chapter_summaries():
    md_path = os.path.join(DOCS_DIR, "Holes_Chapter_Summaries.md")
    txt_path = os.path.join(DOCS_DIR, "Holes_Chapter_Summaries.txt")

    content = []
    
    # Header & Intro
    content.append("""# Holes (Louis Sachar) — Comprehensive Chapter-by-Chapter Study Guide (Studiegids) (Chapters 1 to 50)

Studiegids: The comprehensive secondary literature exam revision syllabus and chapter-by-chapter analytical guide for Louis Sachar's Holes.

This master study guide (studiegids) is specially authored for secondary and high school English literature examinations, revision sessions, and the NotebookLM knowledge suite. It provides an exhaustive, academic, chapter-by-chapter analysis of all 50 chapters of Louis Sachar's Newbery Medal-winning novel *Holes*, meticulously detailing plot developments, character transformations (*bildungsroman*), literary themes, symbolic motifs, and evidence-based exam practice questions with key quotes.


---

## Structure and Multi-Strand Narrative Overview

The novel *Holes* weaves three distinct historical narratives across more than a century:
1. **The Modern Narrative (Camp Green Lake, Texas)**: Fourteen-year-old Stanley Yelnats IV is wrongfully convicted of stealing the sneakers of baseball legend Clyde "Sweet Feet" Livingston and sent to a brutal juvenile detention facility where boys are forced to dig five-foot holes under the blazing sun to "build character."
2. **The Historical Green Lake Narrative (110 Years Ago, circa 1888)**: The story of the prosperous lake town of Green Lake, the tragic romance between schoolteacher Katherine Barlow and African-American onion seller Sam, Sam's racially motivated murder by Trout Walker's mob, the onset of the 110-year drought, and Katherine's descent into outlawry as *Kissin' Kate Barlow*.
3. **The Latvian Ancestral Narrative (Mid-19th Century)**: Stanley's great-great-grandfather Elya Yelnats, his foolish courtship of Myra Menke, his magical pact with Egyptian seer Madame Zeroni, and his failure to fulfill his vow to carry her up the mountain, instigating the multi-generational Yelnats family curse.

---

# PART ONE: YOU ARE ENTERING CAMP GREEN LAKE (Chapters 1 – 28)

---
""")

    # Chapters 1-10
    ch_data_1_10 = [
        (1, 
         "Introduction to Camp Green Lake: The Scorching Desert and Lethal Fauna",
         "The novel opens with a stark paradox: Camp Green Lake has neither a lake nor anything green. Once the largest lake in Texas, it dried up over a century ago. The temperature hovers around 95 degrees in the shade, though the only shade belongs to two ancient oak trees with a hammock reserved exclusively for the Warden. The desert teems with rattlesnakes, scorpions, and deadly yellow-spotted lizards.",
         "The opening establishes the hostile setting as an active antagonist. The Warden is introduced indirectly through her exclusive claim to shade and authority, establishing the absolute power hierarchy of the camp.",
         "Irony and paradox (the name Camp Green Lake); the hostility of the natural world; institutional cruelty; the yellow-spotted lizard as an omen of death.",
         [
             ("What is ironic about the name 'Camp Green Lake'?", "There is no lake and nothing green; it is a parched, desolate desert wasteland."),
             ("Why is a bite from a yellow-spotted lizard considered worse than a rattlesnake or scorpion sting?", "A scorpion or rattlesnake bite causes severe illness but is rarely fatal, whereas a yellow-spotted lizard bite is always slow, agonizing, and 100% fatal."),
             ("Who owns the only shade and hammock at Camp Green Lake?", "The Warden (Louise Walker); campers are strictly forbidden from entering her shade under threat of gunfire.")
         ]),
        (2,
         "The Choice: Juvenile Detention vs. Character Building",
         "The narrator explains the legal choice offered to juvenile delinquents: prison or Camp Green Lake. The judicial system operates under the theory that forcing 'bad boys' to dig holes under the hot sun builds character and transforms them into 'good boys.' Stanley Yelnats IV, an innocent, impoverished boy, chose the camp because his family had never had the money to send him to a real summer camp.",
         "Stanley's character is established as naive, gentle, and economically underprivileged. His choice reflects his complete lack of worldly cynicism.",
         "Class and poverty; the illusion of penal rehabilitation; institutional exploitation disguised as character formation.",
         [
             ("Why did Stanley Yelnats choose Camp Green Lake over regular juvenile prison?", "Because he came from a poor family and had never been able to afford going to a real summer camp."),
             ("What is the official judicial justification for compelling boys to dig holes daily?", "The belief that rigorous manual labor in the heat builds moral character ('building character').")
         ]),
        (3,
         "The Journey to Camp and the Family Curse",
         "Stanley endures an eight-hour bus ride in handcuffs across the barren Texas plains, accompanied only by a guard with a rifle and the driver. Stanley reflects on his home life in New York: being bullied by Derrick Dunne, his father's relentless attempts to invent a cure for foot odor and recycle old sneakers, and the family curse attributed to his 'no-good-dirty-rotten-pig-stealing-great-great-grandfather,' Elya Yelnats. He recalls the family lullaby: 'If only, if only, the woodpecker sighs...'",
         "Stanley's character exhibits quiet resilience and deep loyalty to his family. Despite chronic misfortune and bullying, he maintains hope rather than cynicism.",
         "The family curse; the palindromic nature of Stanley's name (S-T-A-N-L-E-Y / Y-E-L-N-A-T-S); the lullaby motif; resilience amid generational poverty.",
         [
             ("What is unique about Stanley Yelnats' name?", "It is an exact palindrome that reads identically forward and backward; every firstborn son in the family is named Stanley."),
             ("What invention was Stanley's father tirelessly attempting to develop?", "A method for recycling old sneakers and a permanent cure for foot odor."),
             ("Who does the Yelnats family playfully blame for all their misfortunes?", "Stanley's 'no-good-dirty-rotten-pig-stealing-great-great-grandfather', Elya Yelnats.")
         ]),
        (4,
         "Arrival at Camp and Orientation by Mr. Sir",
         "Stanley arrives at the compound and meets Mr. Sir, who wears a Stetson, aviator sunglasses, and a rattlesnake tattoo, constantly chewing sunflower seeds because he recently quit smoking. Mr. Sir issues Stanley two orange jumpsuits, an orange cap, a canteen, and a five-foot shovel. He informs Stanley that there are no fences or guard towers because the desert provides absolute containment: there is no water for a hundred miles.",
         "Mr. Sir embodies overt, aggressive penal authority. Stanley learns that survival requires absolute obedience.",
         "The desert as a natural prison; water as life and power; the loss of personal identity through uniform prison attire.",
         [
             ("What iconic catchphrase does Mr. Sir repeatedly tell the campers?", "'This ain't a Girl Scout camp!'"),
             ("Why are there no fences, walls, or barbed wire enclosing Camp Green Lake?", "Because the camp controls the only water supply for a hundred miles; escapees would die of thirst in the desert."),
             ("What substitute habit did Mr. Sir adopt after quitting smoking?", "Chewing and spitting sunflower seeds constantly.")
         ]),
        (5,
         "Tent D and the Hierarchy of Camp Nicknames",
         "Stanley is assigned to Tent D and introduced to counselor Mr. Pendanski, who insists the boys call him 'Mom.' Stanley meets his tentmates: Rex (X-Ray), Alan (Squid), Jose (Magnet), Theodore (Armpit), Ricky (Zigzag), and Hector (Zero). Stanley is assigned the cot vacated by Lewis ('Barf Bag'). Pendanski claims Zero has nothing inside his head.",
         "Introduces the micro-society of Tent D. The use of street nicknames represents a defense mechanism, allowing the boys to construct alternative identities within the penal system.",
         "Identity and nicknames; institutional prejudice against Zero; the superficial benevolence of Dr. Pendanski.",
         [
             ("What cot does Stanley inherit in Tent D and why was it vacant?", "Lewis's cot ('Barf Bag'), who had been sent to the hospital after deliberately getting bitten by a rattlesnake to escape the camp."),
             ("Why do the campers and staff call Hector Zeroni 'Zero'?", "Because the counselors claim his head is completely empty and that he is worth nothing."),
             ("What does Mr. Pendanski tell Stanley regarding the camp's purpose?", "He claims the camp is there to help the boys turn their lives around, though his actions later contradict this.")
         ]),
        (6,
         "The Stolen Sneakers: Flashback to the Trial",
         "Stanley takes his first cold four-minute shower and writes a reassuring letter to his mother. A flashback reveals how Stanley was arrested: while walking under a highway overpass, a pair of worn sneakers fell from the sky, striking him on the head. They belonged to famous baseball MVP Clyde 'Sweet Feet' Livingston, donated to a homeless shelter auction. Stanley took them, hoping they would help his father's research, but was arrested for grand larceny. The judge gave him the choice of jail or Camp Green Lake.",
         "Reinforces Stanley's innocence and filial devotion. Highlights the absurdity of his 'bad luck,' which later proves to be the hand of destiny.",
         "Wrongful justice; the role of chance versus fate; filial love; Clyde Livingston's sneakers as a catalytic motif.",
         [
             ("How did Clyde Livingston's sneakers end up in Stanley's possession?", "They fell from the sky off an overpass bridge and struck Stanley directly on the head as he walked beneath it."),
             ("Why did Stanley run home with the sneakers?", "He believed they were a miracle sent to assist his father's invention for recycling old shoes and curing foot odor."),
             ("Who was Clyde 'Sweet Feet' Livingston?", "A famous Major League Baseball outfielder celebrated for hitting grand slams, who suffered from severe foot odor.")
         ]),
        (7,
         "The First Hole and the Tale of Elya Yelnats",
         "Stanley digs his first hole at 5:30 AM. The dried clay is as hard as concrete, blistering his soft hands and straining his back. Interwoven is the story of Elya Yelnats in 19th-century Latvia: Elya loved the empty-headed Myra Menke and sought help from Egyptian seer Madame Zeroni. Madame Zeroni gave him a scrawny piglet to carry up the mountain daily to drink from a pure stream while singing a lullaby, making Elya strong and the pig heavy. Elya promised to carry Madame Zeroni up the mountain afterward, on penalty of a generational curse.",
         "Stanley experiences the brutal physical reality of penal labor. The narrative establishes parallel struggles between Stanley digging in Texas and Elya carrying the pig up the mountain in Latvia.",
         "Generational curses; physical labor as a crucible of transformation; the sacredness of solemn promises; parallel narratives.",
         [
             ("What were the exact dimensions required for every hole dug at Camp Green Lake?", "Five feet deep and five feet wide in every direction, measured by the length of the shovel."),
             ("What was the agreement between Elya Yelnats and Madame Zeroni?", "Madame Zeroni gave him a piglet to carry up the mountain daily; in return, Elya promised to carry her up the mountain to drink and hear the lullaby."),
             ("What fatal warning did Madame Zeroni give Elya if he failed to keep his promise?", "That he and all his descendants would be cursed with bad luck for all eternity.")
         ]),
        (8,
         "Anatomy and Behavior of the Yellow-Spotted Lizard",
         "A brief expository chapter detailing the terrifying biology of the yellow-spotted lizard. They have eleven yellow spots, black teeth, a milky-white tongue, and bright yellow eyes with red rims. They love to inhabit dark, freshly dug holes to escape the scorching heat. If you are close enough to count their spots, you are already dead.",
         "Expands the lethal threat landscape of the camp. The lizards serve as a literary Chekhov's gun, foreshadowing the climactic night in the pit.",
         "Lethal danger; natural predators; the symbolism of eleven yellow spots; nature as an unyielding force.",
         [
             ("How many yellow spots does a yellow-spotted lizard have?", "Exactly eleven yellow spots."),
             ("What food items do yellow-spotted lizards prefer to consume?", "They eat small insects, rodents, and especially sunflower seed shells discarded in the holes.")
         ]),
        (9,
         "The Wreck Room and the Birth of 'Caveman'",
         "Stanley finishes his first hole, leaving his shovel upright in the dirt. Exhausted, he visits the camp Wreck Room, where all the furniture is broken and the TV is shattered. When Stanley accidentally trips over an intimidating camper named the Lump, Stanley does not back down. X-Ray intervenes, complimenting Stanley's courage and declaring that his camp nickname is 'Caveman.' Stanley feels a surge of pride at finally having friends.",
         "Stanley experiences his first taste of peer acceptance and social identity. His transition into 'Caveman' represents the first stage of his *bildungsroman*.",
         "Social hierarchies; masculine posturing; the deep human need for belonging and companionship.",
         [
             ("Why did the boys in Tent D give Stanley the nickname 'Caveman'?", "Because he stood up to the Lump in the Wreck Room without backing down, earning the group's respect."),
             ("How did Stanley feel about receiving the nickname 'Caveman'?", "He felt proud and happy because it signaled that he was accepted as a member of the group.")
         ]),
        (10,
         "The Fish Fossil and the Inflexible Rules",
         "Stanley digs his second hole. His muscles ache intensely, but his hands begin to harden. He unearths a rock containing a pristine prehistoric fish fossil. Remembering that interesting finds earn a day off, he enthusiastically shows it to Mr. Pendanski. Pendanski dismisses the fossil with contempt: the Warden is not interested in geology or fossils.",
         "Demonstrates the rigid absurdity of the camp's regime. The rejection of the fossil confirms to the reader that the Warden is seeking something very specific, not scientific artifacts.",
         "Disillusionment; clues to the Warden's secret objective; the physical hardening of Stanley's body.",
         [
             ("What object did Stanley find while digging his second hole?", "A fossilized prehistoric fish embedded in a chunk of hard rock."),
             ("Why didn't Mr. Pendanski give Stanley the rest of the day off for the fossil?", "Because the Warden only cares about specific interesting artifacts, not fossils or rocks.")
         ])
    ]

    # Chapters 11-20
    ch_data_11_20 = [
        (11,
         "X-Ray's Demand and the Water Truck Hierarchy",
         "X-Ray approaches Stanley near the water truck. X-Ray explains that he has been at Camp Green Lake for nearly a year without finding anything, while Stanley has just arrived. X-Ray asks Stanley to promise to give him any future interesting finds so X-Ray can get a day off. Stanley agrees, realizing that maintaining good standing with the group's alpha leader is essential for survival.",
         "Explores the informal power dynamics within Tent D. Stanley demonstrates pragmatic social intelligence.",
         "Peer pressure; social survival; deferred gratification; informal justice versus formal authority.",
         [
             ("Why did X-Ray ask Stanley to surrender future discoveries to him?", "Because X-Ray had been at the camp for almost a year without a day off, and believed his seniority entitled him to the privilege."),
             ("Why did Stanley agree to give X-Ray any future finds?", "Because X-Ray was the influential leader of Tent D, and Stanley wanted to remain in his good graces.")
         ]),
        (12,
         "Group Therapy and Future Dreams",
         "Mr. Pendanski gathers Tent D for a counseling circle, asking each boy what career he wants to pursue after leaving Camp Green Lake. Magnet wants to train animals; Armpit wants to work in landscaping. When Pendanski asks Zero, Zero remains silent, staring coldly into space before whispering: 'I like to dig holes.'",
         "Highlights the contrast between Pendanski's superficial rehabilitation rhetoric and Zero's deep emotional trauma and protective withdrawal.",
         "Aspirations versus penal realities; Zero's defensive emotional walls; institutional neglect.",
         [
             ("What career did Magnet state he wanted to pursue during the group circle?", "He wanted to work as an animal trainer at a zoo."),
             ("What was Zero's chilling response when Mr. Pendanski asked him what he liked to do?", "'I like to dig holes.'")
         ]),
        (13,
         "Unearthing the Gold Tube with 'KB'",
         "While digging his third hole, Stanley unearths a small, heavy golden cylinder the size of a shotgun shell. Examining it closely, he sees an engraved heart containing the initials 'KB'. Recognizing its value, Stanley prepares to hide it, but remembers his promise to X-Ray. He shows it to X-Ray, who tells Stanley to wait until tomorrow morning to turn it in so he can get a full day off.",
         "The central turning point of Part I. The lipstick tube links the modern timeline to the historical 1888 timeline.",
         "The convergence of historical artifacts; dramatic irony; loyalty to promises.",
         [
             ("What letters were engraved inside the heart on the gold cylinder Stanley found?", "The initials 'KB'."),
             ("Why did X-Ray insist on waiting until the following morning to present the object to the counselors?", "So he could receive an entire full day off from digging rather than just a few remaining hours.")
         ]),
        (14,
         "X-Ray Claims the Prize",
         "The following morning, X-Ray stages the discovery of the gold tube in his own hole. Mr. Pendanski is thrilled and calls the Warden immediately on the radio. The Warden arrives rapidly in her red pickup truck, visibly electrified with excitement upon seeing the cylinder.",
         "The Warden's immediate appearance confirms the immense importance of the artifact. Dramatic irony is heightened because the Warden is now focusing her search in the wrong location.",
         "Dramatic irony; deception as survival; the Warden's obsessive greed.",
         [
             ("How did X-Ray stage finding the gold cylinder?", "He waited until the water truck arrived, then shouted that he had just uncovered something shiny in his dirt."),
             ("What reward did the Warden give X-Ray for the discovery?", "She gave him the rest of the day off, a ride back to camp in her truck, and double shower privileges.")
         ]),
        (15,
         "The Warden Takes Command",
         "The Warden is revealed in full: Louise Walker, a tall, freckled woman with dark hair and a cowboy hat. She commands the boys to dig in pairs around X-Ray's hole, carefully sifting every shovel of dirt. Stanley realizes that whatever the Warden is searching for, it was not in X-Ray's hole at all, but in his own hole dozens of yards away.",
         "The Warden transitions from an abstract figure into an active, authoritarian tyrant. Stanley begins to discern the true nature of the camp.",
         "Authoritarian control; dramatic irony; the futility of greed.",
         [
             ("What physical appearance did the Warden have upon arriving at the hole field?", "She was a tall woman with red hair, freckles, a wide-brimmed cowboy hat, and turquoise stones."),
             ("What did Stanley realize while watching the Warden direct the excavations?", "That the Warden was searching around the wrong hole because he had found the tube in his own hole.")
         ]),
        (16,
         "Sifting the Dirt and Zero's Observation",
         "The boys spend days digging and sifting through the soil surrounding X-Ray's hole. The Warden grows increasingly irritable as nothing else is found. Back in Tent D, Stanley writes another letter to his mother pretending he is having fun at camp. Zero stands silently behind him, watching Stanley write. When Stanley asks, Zero reveals that he does not know how to read or write.",
         "Zero's functional illiteracy is revealed, not as stupidity, but as an unmet educational need. Stanley's protective deception toward his mother highlights his empathy.",
         "Illiteracy and vulnerability; family loyalty; the Warden's mounting frustration.",
         [
             ("What did Stanley write to his mother in his letters home?", "He wrote cheerful lies claiming he was swimming in the lake and playing sports so she wouldn't worry."),
             ("What surprising admission did Zero make to Stanley while watching him write?", "Zero confessed that he didn't know how to read or write.")
         ]),
        (17,
         "Zigzag's Shovel Strike",
         "Tensions mount as the Warden drives the boys harder. While digging in close quarters, Zigzag's shovel strikes Stanley across the side of the head, cutting a deep gash near his ear. Mr. Sir casually patches Stanley's wound with dirty bandages, dismissing the injury. Later, Stanley realizes that the Warden has completely abandoned the pretense of character building.",
         "Physical violence escalates. Zigzag's unstable aggression foreshadows the major brawl in Chapter 30.",
         "Escalating violence; counselor indifference to inmate safety; the breakdown of order.",
         [
             ("How did Stanley get injured while digging around X-Ray's hole?", "Zigzag accidentally-on-purpose struck Stanley in the side of the head with the blade of his shovel."),
             ("How did Mr. Sir treat Stanley's head wound?", "He casually wiped the blood with a dirty rag and bandaged it, telling him to get back to digging.")
         ]),
        (18,
         "Zero's Request and Stanley's Refusal",
         "Stanley writes another letter to his mother. Zero approaches him and earnestly asks Stanley to teach him to read. Stanley initially refuses, explaining that he is too physically exhausted from digging all day to spend his free time teaching. Zero quietly walks away without arguing.",
         "Highlights Stanley's initial self-protective exhaustion and moral limitation. He is not yet ready to sacrifice his own comfort for another.",
         "Self-preservation versus empathy; the vulnerability of asking for help; missed moral opportunities.",
         [
             ("What did Zero ask Stanley to do for him in Tent D?", "He asked Stanley to teach him how to read and write."),
             ("Why did Stanley initially refuse Zero's request?", "Because Stanley was completely exhausted from digging holes all day and didn't have the energy.")
         ]),
        (19,
         "The Stolen Sunflower Seeds and Stanley's Sacrifice",
         "While Mr. Sir fills canteens at the water truck, Magnet stealthily snatches his burlap bag of sunflower seeds. When Magnet tosses the bag around the circle, it ruptures into Stanley's hole, spilling thousands of seeds into the dirt. Mr. Sir notices the missing sack and confronts the boys. Stanley steps forward and takes full blame, claiming he stole the sack himself.",
         "A crucial milestone in Stanley's moral evolution. By taking the blame, Stanley sacrifices himself to protect his tentmates, earning true respect.",
         "Solidarity; sacrificial guilt; institutional interrogation; honor among outcasts.",
         [
             ("Who actually stole Mr. Sir's sack of sunflower seeds?", "José ('Magnet'), who used his quick fingers to snatch it from the truck."),
             ("Why did Stanley take the blame for the stolen sunflower seeds?", "To protect Magnet and prevent the entire tent from being punished, showing solidarity with his peers.")
         ]),
        (20,
         "The Warden's Venomous Scratch",
         "Mr. Sir drags Stanley to the Warden's private cabin to report the theft. The Warden listens calmly, then paints her fingernails with dark red polish infused with fresh rattlesnake venom. She explains that the poison is only lethal while wet. Without warning, she strikes Mr. Sir across the face, raking her venomous claws down his cheek. Mr. Sir collapses in agonizing pain. The Warden turns to Stanley and cold-bloodedly tells him to return to digging.",
         "A chilling scene establishing the Warden's absolute sadism and dominance over her staff. It sets up Mr. Sir's personal vendetta against Stanley.",
         "Sadism; vanity and venom; the precariousness of power; the horror of institutional tyranny.",
         [
             ("What secret, lethal ingredient was in the Warden's dark red fingernail polish?", "Fresh, venomous rattlesnake poison."),
             ("How did the Warden punish Mr. Sir for wasting her time with the sunflower seeds?", "She raked her wet, venomous fingernails down his cheek, causing his face to swell in excruciating agony.")
         ])
    ]

    # Chapters 21-30
    ch_data_21_30 = [
        (21,
         "The Secret Digging Pact",
         "Stanley returns to his hole, traumatized by the violence in the Warden's office. To his astonishment, he finds that his hole is already completely dug. Zero reveals that he finished Stanley's hole as an expression of gratitude because Stanley didn't rat out Magnet. Stanley realizes the depth of Zero's loyalty.",
         "The turning point in Stanley and Zero's relationship. Zero's voluntary labor inspires Stanley to reconsider his earlier refusal.",
         "Reciprocity; loyalty; the foundation of authentic brotherhood.",
         [
             ("Why did Zero dig Stanley's hole while Stanley was in the Warden's office?", "Because Stanley didn't rat out Magnet for stealing the sunflower seeds, and Zero appreciated his loyalty."),
             ("How did Stanley feel when he saw that his hole had already been finished?", "He was astonished, deeply moved, and profoundly grateful to Zero.")
         ]),
        (22,
         "The Literacy Deal and Zero's Hidden Genius",
         "Stanley offers Zero a formal bargain: if Zero digs part of Stanley's hole for an hour each day, Stanley will spend that hour teaching Zero to read. During their first lesson, Stanley is stunned to discover that Zero is not slow at all; he has a brilliant mind for mental arithmetic, instantly calculating letter counts and mathematical sums. Stanley begins teaching him the alphabet.",
         "Subverts the institutional stigma placed on Zero. Demonstrates how societal labels blind authorities to human potential.",
         "Education as empowerment; hidden brilliance; subverting stereotypes; the literacy pact.",
         [
             ("What formal pact did Stanley and Zero agree upon?", "Zero would dig one hour of Stanley's hole each day, and Stanley would spend that hour teaching Zero to read."),
             ("What surprising cognitive talent did Zero demonstrate during their first reading lesson?", "He was an exceptional mental math prodigy who could calculate letter counts and complex numbers instantly.")
         ]),
        (23,
         "Flashback: Green Lake in 1888 and Katherine's Spiced Peaches",
         "The narrative shifts 110 years into the past to Green Lake, Texas. Green Lake is a flourishing, picturesque town surrounded by peach orchards. Katherine Barlow is the beloved schoolteacher who teaches both day school for children and night school for illiterate adults. She is famous for her award-winning canned spiced peaches, preserved with cinnamon and cloves. Arrogant, wealthy Charles 'Trout' Walker tries to court her, but she firmly rejects him.",
         "Introduces Katherine Barlow and the idyllic origins of Green Lake, creating a sharp contrast with the modern wasteland.",
         "The pastoral ideal; class arrogance (Trout Walker); Katherine's intelligence and independence.",
         [
             ("What culinary delicacy was Katherine Barlow famous for throughout Green Lake?", "Her canned spiced peaches, preserved using a secret family recipe with cinnamon and cloves."),
             ("Why did Katherine Barlow reject Charles 'Trout' Walker's courtship?", "Because he was arrogant, loud, entitled, and stupid, despite his family's vast wealth.")
         ]),
        (24,
         "Mr. Sir's Vendetta: The Poured Water",
         "In the modern timeline, Mr. Sir returns to duty with his face swollen into a grotesque, purple mass from the Warden's venom. Consumed by vindictive rage, he blames Stanley. When Stanley approaches the water truck, Mr. Sir fills Stanley's canteen, but then opens the nozzle and pours the entire water ration directly onto the parched sand, smiling maliciously.",
         "Demonstrates the unchecked, sadistic retaliation of penal authorities against powerless inmates.",
         "Thirst as torture; petty vengeance; the vulnerability of incarcerated youth.",
         [
             ("What did Mr. Sir's face look like after the Warden's venomous attack?", "It was swollen into a grotesque, bruised purple mass that made talking difficult."),
             ("How did Mr. Sir take revenge on Stanley at the water truck?", "He deliberately poured Stanley's water ration onto the sand in front of him, forcing him to endure dehydration.")
         ]),
        (25,
         "Flashback: Sam the Onion Man and 'I Can Fix That'",
         "In 1888, Katherine Barlow bonds with Sam the Onion Man, an African-American herbalist who sells sweet onions with his fifty-year-old donkey, Mary Lou. Sam's onions possess medicinal properties, curing everything from digestive illness to baldness. Sam repairs the leaking roof, windows, and doors of Katherine's schoolhouse (*'I can fix that'*). Their affection deepens into romantic love. One rainy afternoon, they share an innocent kiss near the school steps. Town gossip Hattie Parker witnesses the kiss and shrieks that God will punish them.",
         "Establishes Sam's moral purity, botanical wisdom, and the tragic interracial romance that will doom the town.",
         "Holistic healing; interracial love in the Jim Crow South; Sam's catchphrase ('I can fix that'); social bigotry.",
         [
             ("What reassuring phrase did Sam repeat whenever Katherine pointed out schoolhouse damage?", "'I can fix that.'"),
             ("How old was Sam's donkey Mary Lou, and why did she live so long?", "She was nearly fifty years old because she ate an exclusive diet of raw sweet onions."),
             ("Who witnessed Katherine and Sam kissing in the rain?", "Hattie Parker, who hissed that God would punish them.")
         ]),
        (26,
         "Flashback: The Lynching of Sam and the Birth of Kissin' Kate",
         "The town explodes with racist fury. A mob led by Trout Walker burns the schoolhouse to the ground. Katherine races to the town sheriff for help, but finds him drunkenly demanding a kiss in exchange for protection. Katherine flees to the lake, where Sam awaits in his rowboat *Mary Lou*. Trout intercepts them in his motorized boat, shooting Sam dead and slaughtering Mary Lou. Katherine is dragged ashore. Three days later, Katherine shoots the sheriff dead, applies bright red lipstick, and kisses his forehead, becoming the outlaw Kissin' Kate Barlow.",
         "The foundational trauma of Green Lake. Demonstrates how societal hatred destroys innocence and breeds vengeance.",
         "Racial violence; institutional corruption; the transformation from educator to outlaw; the origin of Kissin' Kate Barlow.",
         [
             ("Why did the Green Lake town mob burn down the schoolhouse?", "Out of racist hatred because Katherine, a white woman, kissed Sam, an African-American man."),
             ("How did Katherine Barlow execute her revenge on the corrupt town sheriff?", "She shot him dead in his office, applied bright red lipstick, and kissed his forehead.")
         ]),
        (27,
         "Tent D Jealousy and Stanley's Canteen Poison",
         "In the present day, Stanley continues teaching Zero to read while Zero digs part of his hole. The other boys in Tent D notice and become intensely resentful, viewing Stanley as an entitled freeloader. Mr. Sir continues to pour out Stanley's water, but one day takes Stanley's canteen behind the truck, fills it with a murky liquid, and returns it. Stanley is terrified to drink, fearing poison.",
         "Social harmony fractures within Tent D. The campers turn against Stanley, manipulated by counselors.",
         "Peer jealousy; fear of institutional poisoning; the psychological strain of ostracization.",
         [
             ("Why were the other boys in Tent D angry about Zero digging part of Stanley's hole?", "They believed Stanley was acting like an entitled boss who was taking advantage of Zero."),
             ("Why was Stanley terrified to drink from his canteen after Mr. Sir took it behind the truck?", "Because Mr. Sir disappeared behind the vehicle, making Stanley fear he had poisoned the water.")
         ]),
        (28,
         "Flashback: The Death of Kissin' Kate Barlow",
         "Twenty years after Sam's murder, the lake has completely dried up into a desert. A weary, aging Katherine Barlow returns to Green Lake and buries her plundered treasure in the sand. Trout Walker and his impoverished wife Linda Miller track her down, threatening her with shotguns to find the gold. Before they can torture her, a lethal yellow-spotted lizard bites Kate's bare foot. Kate laughs defiantly, telling them that they and their descendants can dig for a hundred years and never find it, dying with a smile.",
         "Closes the 1888 historical timeline. Explains why three generations of Walkers have been excavating the lakebed.",
         "Defiance in death; the curse on the Walker family; poetic justice; the yellow-spotted lizard as an instrument of fate.",
         [
             ("Who ambushed Katherine Barlow when she returned to Green Lake twenty years later?", "Charles 'Trout' Walker and his wife Linda Miller, who had lost their fortune in the drought."),
             ("What were Kissin' Kate Barlow's final words before she died of the lizard bite?", "'Start digging! You, and your children, and your children's children can dig for the next hundred years and you will never find it!'")
         ])
    ]

    # Chapters 29-40
    ch_data_29_40 = [
        (29,
         "Distant Lightning and God's Thumb",
         "A summer thunderstorm rumbles in the distant Texas mountains, though not a drop of rain reaches Camp Green Lake. In the flash of lightning against the horizon, Stanley glimpses an unusual rock formation on the mountain ridge: a solitary peak shaped like a giant fist with an upturned thumb. He remembers his father recounting how Stanley Yelnats I survived being stranded in the desert by finding refuge on 'God's Thumb.'",
         "The physical appearance of God's Thumb reintroduces the theme of ancestral sanctuary and providential guidance.",
         "Distant hope; geographical symbolism; ancestral memory; the promise of water.",
         [
             ("What geographical landmark did Stanley glimpse during the lightning flashes in the mountains?", "A mountain formation resembling a giant fist with an upturned thumb ('God's Thumb')."),
             ("What family legend was associated with 'God's Thumb'?", "Stanley Yelnats I claimed he survived after being robbed by Kate Barlow by finding refuge on 'God's Thumb.'")
         ]),
        (30,
         "The Tent D Brawl and Zero's Defiance",
         "Zigzag taunts Stanley over Zero digging his hole. Mr. Pendanski arrives, but instead of de-escalating, he eggs Zigzag on to fight Stanley. Zigzag attacks Stanley, beating him viciously. When Stanley is pinned, Zero intervenes, locking Zigzag in a ferocious chokehold. The Warden and counselors rush over. Pendanski cruelly insults Zero, sneering that a shovel has more intelligence than him. Zero refuses to dig another hole, strikes Pendanski with his shovel, and flees into the desert.",
         "The climax of Part II's camp phase. Zero reaches his breaking point, choosing freedom or death over continued dehumanization.",
         "The explosion of institutional tension; counselor sadism; Zero's heroic defiance; the breaking of the social contract.",
         [
             ("How did Mr. Pendanski handle the growing tension between Zigzag and Stanley?", "He maliciously encouraged Zigzag to attack Stanley, telling him to teach 'Caveman' a lesson."),
             ("Why did Zero hit Mr. Pendanski with his shovel and run into the desert?", "Because Pendanski publicly humiliated him, saying he was too stupid to learn and had nothing in his head.")
         ]),
        (31,
         "Erasing Hector Zeroni",
         "Stanley is tormented by guilt over Zero's flight. The Warden and counselors realize that if inspectors learn an inmate escaped into the desert, an investigation will occur. Because Zero was a homeless ward of the state with no family, the Warden orders Pendanski to destroy Hector's physical files and erase his computer records, wiping out his legal existence.",
         "Exposes the terrifying banality of bureaucratic evil. Human lives are treated as disposable records.",
         "Bureaucratic dehumanization; guilt and moral awakening; the disposable nature of marginalized youth.",
         [
             ("What horrifying administrative action did the Warden and counselors take regarding Zero?", "They completely erased Hector Zeroni's state computer records and shredded his files so nobody would know he existed."),
             ("Why was Stanley consumed by intense guilt after Zero's escape?", "Because he knew Zero ran away because he stood up for Stanley, and Stanley did nothing to help him.")
         ]),
        (32,
         "Twitch Arrives and Stanley Steals the Truck",
         "A jittery new camper named Brian ('Twitch') arrives to replace Zero. While Twitch babbles about car clutches and hotwiring, Mr. Sir arrives with the water truck. In an impulsive act of courage, Stanley leaps into the truck, puts it into gear, and steps on the accelerator to drive into the desert to rescue Zero. Inexperienced with manual driving, Stanley crashes the truck into a hole, climbs out, and flees on foot into the desert with an empty canteen.",
         "Stanley's definitive break with passivity. He abandons safety to rescue his friend, embracing his hero's journey.",
         "Impulsive heroism; the transition from victim to rescuer; the leap into the unknown.",
         [
             ("Why was the new camper Brian given the nickname 'Twitch'?", "Because he had nervous muscle spasms and twitching habits caused by his obsession with stealing cars."),
             ("What happened when Stanley attempted to drive the camp water truck into the desert?", "He didn't know how to steer out of a skid and crashed the truck nose-first into an excavated hole.")
         ]),
        (33,
         "The Desert Trek and the Sunflower Seed Miracle",
         "Stanley marches through the shimmering heat toward God's Thumb. He passes through endless abandoned hole fields. Stumbling into a pit, he discovers a swarm of yellow-spotted lizards and backs away carefully. Later, he finds an empty burlap sack buried in the sand containing a single forgotten sunflower seed, which he chews thoughtfully, savoring its moisture.",
         "The desert tests Stanley's physical and mental endurance. Small miracles sustain his resolve.",
         "Endurance; solitude; the harsh reality of the desert; small mercies.",
         [
             ("What dangerous wildlife did Stanley encounter in one of the abandoned holes during his desert trek?", "A family of deadly yellow-spotted lizards that stared at him with their yellow eyes."),
             ("What single item of food did Stanley discover in the sand that gave him hope?", "One single sunflower seed inside an old burlap sack, which he carefully cracked and ate.")
         ]),
        (34,
         "The Mirage and the Wreck of the *Mary Lou*",
         "Stanley continues toward the mountain. Through the heat mirages, he spots an unusual pool of water that evaporates as he approaches, but near it lies an overturned wooden boat half-buried in the sand. On the hull, he reads the faded name: *Mary Lou*. Kneeling beside the hull, a voice calls out to him from the dark shadows beneath.",
         "The physical convergence of the historical and modern timelines. Sam's rowboat becomes the instrument of salvation.",
         "Mirages versus reality; the sheltering legacy of Sam; providential reunions.",
         [
             ("What historical object did Stanley discover half-buried in the desert sands?", "The overturned wooden hull of Sam's rowboat, the *Mary Lou*."),
             ("Who was hiding in the shaded hollow beneath the hull of the boat?", "Hector Zeroni ('Zero').")
         ]),
        (35,
         "Reunion and 'Sploosh'",
         "Stanley crawls under the boat and finds Zero, severely dehydrated, filthy, and clutching his stomach in pain. Zero reveals that he survived by drinking 'Sploosh'—the contents of dozens of 110-year-old preserved peach jars preserved beneath the hull. Although the fermented concoction tastes sweet like canned peaches, the ancient bacteria have given Zero severe stomach cramps. Stanley persuades Zero that they must head for God's Thumb.",
         "The emotional reunion of the protagonists. Kate Barlow's spiced peaches physically sustain Zero in the wasteland.",
         "Brotherhood; survival food; the double meaning of 'Sploosh'; perseverance against despair.",
         [
             ("What was 'Sploosh' according to Zero?", "Canned, 110-year-old spiced peaches left behind under the boat, which had fermented into sweet brown nectar."),
             ("What physical ailment was Zero suffering from under the boat?", "Severe, agonizing stomach cramps caused by bacteria in the antique peach preserves.")
         ]),
        (36,
         "The Trek Toward God's Thumb",
         "Stanley and Zero set off toward Big Thumb mountain, carrying an empty sack with broken glass jars. As they walk, Stanley quizzes Zero on spelling and reading to keep his mind off the heat and cramps. They encounter a steep vertical cliff face that blocks their path. They help each other scale the rock wall using their hands and legs in cooperative unison.",
         "Illustrates mutual reliance and physical solidarity. Intellectual learning (spelling) distracts them from physical agony.",
         "Teamwork; mountain climbing as spiritual ascent; the power of shared education.",
         [
             ("How did Stanley help distract Zero from his intense stomach pains while walking?", "He quizzed him on reading, spelling simple words like C-A-T and H-A-T."),
             ("How did the boys scale the sheer rock cliff leading to the mountain?", "They worked as a team, with Stanley boosting Zero up and Zero pulling Stanley with his hands.")
         ]),
        (37,
         "Climbing into the Clouds and the Scent of Weeds",
         "As they climb higher, the desert landscape drops below them. The air grows cooler and thin clouds drift across the mountain peak. Zero's condition deteriorates rapidly: he stumbles, falls, and begins vomiting blood and bile. Stanley notices that the air smells different—sweet and earthy, like wet mud and crushed green weeds.",
         "The transition from barren desert to fertile high-altitude sanctuary. The sensory shift heralds the approaching oasis.",
         "Atmospheric shift; nature's resilience; proximity to water and life; physical collapse.",
         [
             ("What sensory change did Stanley notice as they climbed higher up the mountain?", "The air smelled humid, earthy, and green, like moist mud and growing vegetation."),
             ("What alarming physical symptom did Zero experience as they neared the summit?", "He collapsed, vomiting dark blood and stomach bile due to extreme dehydration and food poisoning.")
         ]),
        (38,
         "Carrying Zero up God's Thumb",
         "Zero collapses completely, unconscious and unable to stand. Refusing to leave his friend to die, Stanley heaves Hector onto his shoulders and begins carrying him up the near-vertical slope. His muscles scream in agony and his vision tunnels, but he forces one foot in front of the other. Near the summit, he falls into a patch of wet mud. Digging frantic fingers into the soil, he unearths water and a bulbous white root: a wild mountain onion.",
         "The absolute moral and thematic climax of the novel. Stanley fulfills the broken promise of Elya Yelnats.",
         "Self-sacrificial love; breaking the generational curse; the discovery of water and sustenance; moral triumph.",
         [
             ("What heroic action did Stanley perform when Zero collapsed completely near the top?", "He lifted Hector onto his shoulders and carried him up the steep mountain slope."),
             ("What miracle did Stanley discover when he collapsed into the mud at the top?", "A freshwater spring bubbling underground and wild mountain onions growing in the soil."),
             ("What ancient ancestral vow did Stanley unknowingly fulfill by carrying Zero?", "The vow made by Elya Yelnats to Madame Zeroni to carry her up the mountain to drink from the stream.")
         ]),
        (39,
         "The Healing Oasis of Onions and Water",
         "Stanley scoops water from the muddy hole and forces drops into Zero's mouth until Zero regains consciousness. Stanley peels the wild onion and feeds it to Zero, who chews it gratefully. The sweet onion juice restores their strength. Stanley washes Zero's face and wounds. That night, as Zero sleeps peacefully, Stanley sings the family lullaby: 'If only, if only, the woodpecker sighs...'",
         "The physical, emotional, and spiritual healing of both boys. The lullaby unites the two families across three generations.",
         "Holistic restoration; the sacredness of the lullaby; peace after ordeal.",
         [
             ("What food sustained Stanley and Zero atop God's Thumb for days?", "Raw, sweet wild mountain onions (*Allium*)."),
             ("What song did Stanley sing to Zero as he slept near the spring?", "The family lullaby: 'If only, if only, the woodpecker sighs...'")
         ]),
        (40,
         "Flashback: Sam Cures Mrs. Tennyson's Daughter",
         "A brief historical flashback to 1888 Green Lake. Mrs. Tennyson rushes to Sam the Onion Man because her young daughter, Becca, is dying of stomach sickness after eating bad meat. Sam feeds the child an onion tonic, and her fever breaks overnight. Mrs. Tennyson credits Sam's onions with saving her child's life.",
         "Reiterates the miraculous medicinal properties of sweet onions, providing scientific and historical grounding for Zero's recovery.",
         "Historical symmetry; onions as medicine; the enduring beneficence of Sam.",
         [
             ("Who did Sam the Onion Man cure of severe stomach sickness in 1888?", "Becca Tennyson, the young daughter of Mr. and Mrs. Tennyson."),
             ("What was the remedy Sam used to cure the dying child?", "A specialized herbal broth made from sweet mountain onions.")
         ])
    ]

    # Chapters 41-50
    ch_data_41_50 = [
        (41,
         "Zero's Confession: The Stolen Shoes",
         "Recovering on God's Thumb, Zero reveals his deepest secret to Stanley: it was *he* who stole Clyde Livingston's sneakers from the homeless shelter display. He explains that he was homeless, had no shoes, and simply needed footwear; he discarded them off the overpass when people began shouting. Stanley absorbs the confession and forgives Zero completely, realizing how fate intertwined their lives.",
         "The resolution of the central mystery. Stanley and Zero's mutual forgiveness transcends blame.",
         "Confession and absolution; the synchronicity of destiny; unconditional brotherhood.",
         [
             ("What major confession did Zero make to Stanley while resting on God's Thumb?", "Zero confessed that he was the one who stole Clyde Livingston's sneakers from the shelter."),
             ("How did Stanley react to Zero's confession?", "He did not get angry; he forgave Zero completely, understanding the tragic coincidence of fate.")
         ]),
        (42,
         "Formulating the Plan to Return",
         "Stanley realizes that the gold lipstick tube marked 'KB' means Kate Barlow's buried treasure chest must be located in his original hole back at Camp Green Lake. He proposes a daring plan: they will climb down the mountain, sneak back into the camp under cover of night, excavate the suitcase, steal food and water, and escape into the outside world.",
         "Stanley transitions from survival mode to strategic agency. He takes command of his future.",
         "Strategic agency; the quest for buried treasure; closing the circle.",
         [
             ("What realization did Stanley reach regarding the gold 'KB' lipstick tube?", "That the buried treasure of Kate Barlow must be hidden in the exact hole where he originally found the tube."),
             ("What bold plan did Stanley propose to Zero?", "To hike back to Camp Green Lake under cover of night, dig up the treasure chest, take water, and flee.")
         ]),
        (43,
         "The Night Trek Back to the Lakebed",
         "Packing their sack with wild mountain onions and an improvised water jar, Stanley and Zero descend the mountain. They navigate the dark desert, using the distant camp lights as a compass. They hide near the camp perimeter, waiting for the counselors and campers to fall into deep sleep before slipping onto the hole field.",
         "Suspenseful rising action. The boys return to the lion's den willingly, transformed by their ordeal.",
         "Stealth; courage; confronting the oppressor; the return of the hero.",
         [
             ("What provisions did the boys carry on their return trek to the camp?", "An improvised jar filled with spring water and a burlap sack filled with wild mountain onions."),
             ("How did they navigate their way across the featureless desert at night?", "They used the distant compound lights of Camp Green Lake as a navigational beacon.")
         ]),
        (44,
         "Excavating the Metal Suitcase",
         "Stanley locates his original excavation hole. Using their shovels in silent rhythm, Stanley and Zero dig into the dirt. A few feet down, Stanley's shovel strikes metal. Working with bare hands, they uncover a heavy metal suitcase. But just as they heave the chest toward the surface, a blinding spotlight illuminates the pit, accompanied by the clicking of shotguns.",
         "The thrilling discovery of the long-lost treasure, instantly interrupted by the ambush of the camp administration.",
         "Discovery; dramatic suspense; the confrontation with tyranny.",
         [
             ("What object did Stanley's shovel strike while excavating his original hole?", "A heavy metal suitcase with metal clasps and leather corners."),
             ("Who ambushed Stanley and Zero just as they lifted the suitcase out of the dirt?", "The Warden, Mr. Sir, and Mr. Pendanski, shining bright flashlights with guns drawn.")
         ]),
        (45,
         "Trapped in the Lizard Nest",
         "The Warden steps forward to seize the prize, but shrieks in horror and recoils: the excavated hollow is teeming with dozens of deadly yellow-spotted lizards. The reptiles swarm over the suitcase, crawl across Stanley's legs, and settle on Zero's chest and neck. The Warden orders the counselors to wait until the lizards deliver fatal bites so they can retrieve the treasure and claim the boys died of desert exposure.",
         "The highest point of tension in the novel. The boys' survival hangs by a thread as deadly predators envelop them.",
         "Mortal danger; poetic justice; the cruelty of the Warden waiting for their deaths; nature as guardian.",
         [
             ("Why did the Warden suddenly back away in terror from the hole?", "Because the pit was an active nesting den of deadly yellow-spotted lizards that swarmed over the suitcase and the boys."),
             ("What sinister strategy did the Warden propose to the counselors while watching the boys?", "To wait patiently until the lizards bit them to death, then bury their bodies and claim the treasure.")
         ]),
        (46,
         "The Silent Vigil in the Pit",
         "For hours through the freezing desert night, Stanley and Zero stand completely motionless. A large lizard perches directly on Zero's chest, flicking its milky-white tongue against his throat, while another sits on Stanley's knee. The boys barely breathe. As dawn breaks, camp counselors gather around the pit. The Warden begins fabricating her cover story for the state authorities.",
         "Exhibits extraordinary self-control and mutual emotional endurance. The lizards do not strike.",
         "Stillness as survival; institutional mendacity; the suspense of dawn.",
         [
             ("How did Stanley and Zero survive hours trapped with lethal reptiles?", "They remained completely motionless, controlling their breathing and heartbeat so as not to provoke the lizards."),
             ("What cover story did the Warden rehearse with Mr. Sir and Dr. Pendanski?", "She rehearsed claiming that Stanley had run away, hallucinated from dehydration, and fallen into a lizard pit.")
         ]),
        (47,
         "The Arrival of Ms. Morengo and the Inscription",
         "A luxury car arrives at the camp bearing Stanley's attorney, Ms. Carla Morengo, and the Texas Attorney General. Derrick Dunne confessed to school authorities that he stole Stanley's notebook and threw his sneakers into a toilet, clearing Stanley. As the morning sun warms the sand, the lizards crawl away into the shadows. Stanley and Zero climb out with the suitcase. The Warden claims the suitcase is her personal property, but Ms. Morengo points to the bold, engraved letters stamped into the metal: 'STANLEY YELNATS'.",
         "The legal and moral climax. Truth dismantles bureaucratic corruption. The palindromic name proves ownership.",
         "Vindication; legal restitution; poetic justice; the power of the name.",
         [
             ("Why did attorney Carla Morengo and the Attorney General arrive at Camp Green Lake?", "Because bully Derrick Dunne confessed to school authorities, establishing an airtight alibi that legally cleared Stanley."),
             ("What conclusive evidence proved that the Warden had no legal claim to the suitcase?", "The name **STANLEY YELNATS** was indelibly engraved on the metal lid of the suitcase.")
         ]),
        (48,
         "The Liberation of Zero and the Return of Rain",
         "The Warden attempts to detain Zero, but Ms. Morengo demands his state file. Because Pendanski previously deleted Hector's records, the camp has no legal paperwork proving who he is or why he is detained. Ms. Morengo takes Hector into her car alongside Stanley. As the car drives away from the compound, dark clouds roll in and rain pours over Green Lake for the first time in 110 years.",
         "The institutional system is defeated by its own corruption. The return of rain symbolizes environmental and cosmic restoration.",
         "Institutional defeat; liberation; the breaking of the drought; cosmic catharsis.",
         [
             ("Why was the state forced to release Hector Zeroni alongside Stanley?", "Because Mr. Pendanski had erased all of Hector's files; without legal documentation, his detention was completely illegal."),
             ("What miraculous environmental event occurred as Stanley and Zero drove away from Camp Green Lake?", "A torrential downpour of rain fell over Green Lake for the first time in one hundred and ten years.")
         ]),
        (49,
         "The Chemical Secret of Onion Blood",
         "The narrator steps forward to explain the scientific and ecological mystery: why didn't the yellow-spotted lizards bite Stanley and Zero? The lizards possess an intense, instinctual revulsion to onions. Having eaten wild mountain onions for days, the boys' bloodstream and sweat glands were saturated with onion sulfur, making their flesh repellent to the reptiles.",
         "Provides logical, grounded narrative closure for the miraculous survival, linking Sam's herbal wisdom to the climax.",
         "Ecological wisdom; the power of nature; Sam's posthumous protection.",
         [
             ("Why did the yellow-spotted lizards refuse to bite Stanley and Zero?", "Because the boys had eaten wild mountain onions for days, saturating their blood with onion sulfur, which lizards detest."),
             ("Who discovered this natural chemical defense over a century earlier?", "Sam the Onion Man, who used onions to protect himself and his donkey Mary Lou in the desert.")
         ]),
        (50,
         "Filling In the Holes: Wealth, Restitution, and Reunion",
         "The epilogue ties together all loose ends. Camp Green Lake is permanently closed and purchased by the Girl Scouts of America. Inside the suitcase, authorities discover jewels, negotiable bonds, and stock deeds from Stanley I; after taxes and legal fees, Stanley and Hector each receive nearly $1 million. Stanley buys his parents a home with a laboratory. Zero hires private investigators to locate his mother. Eighteen months later, at a Super Bowl party, Clyde Livingston stars in a commercial for 'Sploosh' foot spray. In the living room, Zero's mother strokes her son's hair, singing the complete Zeroni lullaby. All holes are filled.",
         "The final resolution of all plot strands and emotional trauma. The curse is dead, and generational love triumphs.",
         "Restitution; family reunion; poetic justice (Girl Scouts); filling in the holes; the completion of the lullaby.",
         [
             ("What ironic future awaited the land of Camp Green Lake after it was closed by the state?", "It was bought by the Girl Scouts of America to be converted into an official summer camp."),
             ("What was contained inside the suitcase of Stanley Yelnats I, and how much did the boys receive?", "Valuable stock certificates, bonds, and jewels; Stanley and Hector each received slightly less than one million dollars."),
             ("How was Hector Zeroni finally reunited with his mother?", "He used his share of the treasure money to hire a team of private investigators who successfully tracked her down."),
             ("What song does Hector's mother sing at the novel's conclusion?", "The complete, four-line ancestral lullaby of Madame Zeroni.")
         ])
    ]

    def render_chapters(ch_list):
        out = []
        for ch_num, title, conc, detailed, themes, qas in ch_list:
            out.append(f"### Chapter {ch_num}")
            out.append(f"- **Chapter Title & Concise Summary:** {title}. {conc}")
            out.append(f"- **Character Developments & Dynamics:** {detailed}")
            out.append(f"- **Themes & Motifs:** {themes}")
            out.append("- **High-Yield Exam Questions:**")
            for q, a in qas:
                out.append(f"  - *Question:* {q}  \n    *Answer:* {a}")
            out.append("\n---\n")
        return "\n".join(out)

    content.append(render_chapters(ch_data_1_10))
    content.append(render_chapters(ch_data_11_20))
    content.append(render_chapters(ch_data_21_30))
    content.append(render_chapters(ch_data_29_40))
    content.append(render_chapters(ch_data_41_50))

    # Comprehensive Study Module at the end
    content.append("""
# EXTENSIVE EXAM STUDY MODULE & MASTER NOTEBOOKLM QUIZ REPOSITORY

---

## 1. Character Matrix & Camp Green Lake Monikers

| True Legal Name | Camp Moniker | Role / Structural Significance in *Holes* |
| :--- | :--- | :--- |
| **Stanley Yelnats IV** | **Caveman** | Central protagonist; wrongfully convicted; undergoes an epic *bildungsroman*; breaks the generational curse. |
| **Hector Zeroni** | **Zero** | Direct descendant of Madame Zeroni; math prodigy; true sneaker taker; Stanley's devoted companion. |
| **Rex Alvin Washburn**| **X-Ray** | Near-sighted leader of Tent D; claims credit for the 'KB' tube; enforces camp pecking order. |
| **Alan** | **Squid** | Tough-talking camper who weeps secretly at night; asks Stanley to apologize to his mother upon release. |
| **Theodore Johnson** | **Armpit** | Muscle of Tent D; stung by scorpion; central protagonist of Louis Sachar's sequel *Small Steps*. |
| **José** | **Magnet** | Skilled pickpocket; steals Mr. Sir's sunflower seeds; demonstrates street loyalty. |
| **Ricky** | **Zigzag** | Unstable, violent camper with wild frizzy hair; attacks Stanley during the literacy dispute in Chapter 30. |
| **Lewis / Louis** | **Barf Bag** | Stanley's predecessor in Tent D; intentionally stepped on a rattlesnake to escape the camp. |
| **Brian** | **Twitch** | Jittery car thief who replaces Zero; inadvertently teaches Stanley how to drive the water truck. |
| **Louise Walker** | **The Warden** | Ruthless granddaughter of Trout Walker; uses rattlesnake venom polish; exploits boys to find Kate's treasure. |
| **Marion Sevillo** | **Mr. Sir** | Chief counselor; quits smoking and eats sunflower seeds; vindictively pours out Stanley's water. |
| **Dr. Pendanski** | **Mom** | Deceptive counselor who presents a friendly facade while relentlessly bullying Zero and deleting his files. |
| **Katherine Barlow** | **Kissin' Kate**| 1888 Green Lake schoolteacher who became a feared outlaw after Sam's murder; buried the Yelnats suitcase. |
| **Sam** | **The Onion Man**| African-American herbalist and builder; murdered by Trout Walker's mob; moral martyr of Green Lake. |
| **Charles Walker** | **Trout Walker**| Arrogant, wealthy Green Lake landowner afflicted with rotting-fish foot fungus; led the mob that killed Sam. |
| **Elya Yelnats** | **Ancestral Origin**| Stanley's Latvian great-great-grandfather who forgot his promise to Madame Zeroni, causing the family curse. |
| **Madame Zeroni** | **The Seer** | Wise, one-legged Egyptian elder residing in Latvia; formulated the piglet ritual; ancestor of Hector Zeroni. |
| **Clyde Livingston** | **Sweet Feet** | All-Star baseball player with foot odor issues; his donated shoes catalyzed the entire narrative. |
| **Ms. Carla Morengo** | **Defense Attorney**| Dedicated patent attorney who exposes Derrick Dunne's bullying confession and liberates Stanley and Zero. |

---

## 2. Chronological Timeline of the Three Intertwined Narratives

```
[Riga, Latvia — circa 1850s]
  Elya Yelnats falls in love with Myra Menke; seeks aid from Madame Zeroni.
  Elya carries the piglet up the mountain daily, singing the sacred lullaby.
  Elya rejects Myra, sails to America, and forgets his vow to carry Madame Zeroni.
  --> The multi-generational Yelnats family curse begins.
  Elya marries Sarah Miller in America; she translates the lullaby into English.

[Green Lake, Texas — 1888]
  Katherine Barlow teaches school and makes award-winning spiced peaches.
  Katherine and Sam the Onion Man fall in love; Sam repairs the schoolhouse ("I can fix that").
  Katherine and Sam kiss in the rain; town mob led by Trout Walker attacks.
  Sam is murdered on Green Lake; Mary Lou the donkey is killed.
  --> Not a single drop of rain falls on Green Lake for 110 years.
  Katherine shoots the sheriff, becomes Kissin' Kate Barlow, and robs Stanley Yelnats I.
  Kate buries the suitcase in the dried lakebed; dies laughing from a yellow-spotted lizard bite.

[Camp Green Lake, Texas — Modern Day]
  Hector Zeroni steals Clyde Livingston's sneakers from a shelter and tosses them off an overpass.
  The sneakers strike Stanley Yelnats IV; Stanley is wrongfully convicted of grand larceny.
  Stanley is sent to Camp Green Lake; excavates holes for the Warden (granddaughter of Trout Walker).
  Stanley finds the "KB" gold lipstick tube; forms a literacy partnership with Zero.
  Zero rebels against Pendanski's abuse and flees into the desert.
  Stanley steals the camp truck, searches for Zero, and finds him under the wreck of Mary Lou.
  Stanley carries Hector up God's Thumb, provides water, and sings the lullaby.
  --> The 110-year ancestral curse is officially broken!
  The boys survive on onions; return to camp and dig up the suitcase inscribed "STANLEY YELNATS".
  Lizards refuse to bite them due to onion blood; Ms. Morengo arrives and secures their freedom.
  --> Rain pours over Green Lake for the first time in 110 years; Camp Green Lake closes forever.
```

---

## 3. High-Yield Exam Quiz: 25 Core Q&A Pairs for Review

1. **Question:** Why was Stanley Yelnats IV sent to Camp Green Lake?  
   **Answer:** He was falsely convicted of stealing the sneakers of Major League Baseball star Clyde 'Sweet Feet' Livingston.
2. **Question:** What are the exact dimensions of every hole dug at Camp Green Lake?  
   **Answer:** Exactly five feet deep and five feet wide in every direction, measured by the length of the camper's shovel.
3. **Question:** Why are there no guard towers, fences, or barbed wire enclosing Camp Green Lake?  
   **Answer:** Because the camp holds the only water source for a hundred miles; runaway inmates would die of dehydration in the desert.
4. **Question:** Who owns the only shade and the hammock between the two oak trees at the camp?  
   **Answer:** The Warden (Louise Walker); campers are strictly forbidden from entering her shade.
5. **Question:** What dangerous ingredient is mixed into the Warden's dark red fingernail polish?  
   **Answer:** Fresh, lethal rattlesnake venom, which is toxic and corrosive while wet.
6. **Question:** Who was the real person who took Clyde Livingston's sneakers from the homeless shelter?  
   **Answer:** Hector Zeroni ('Zero').
7. **Question:** What letters were engraved inside the heart on the gold cylinder Stanley found in his hole?  
   **Answer:** The letters 'KB', representing the initials of Katherine Barlow (Kissin' Kate Barlow).
8. **Question:** Why was Charles Walker given the nickname 'Trout'?  
   **Answer:** Because he suffered from a chronic foot fungus condition that caused his feet to smell of rotting fish.
9. **Question:** What reassuring catchphrase did Sam the Onion Man repeat whenever Katherine needed repairs?  
   **Answer:** 'I can fix that.'
10. **Question:** What was the name of Sam's donkey and how old was she?  
    **Answer:** Mary Lou; she lived to be nearly fifty years old by eating an exclusive diet of raw sweet onions.
11. **Question:** Why did Trout Walker and the mob murder Sam the Onion Man?  
    **Answer:** Out of violent racist hatred after Sam, an African-American man, kissed Katherine Barlow, a white woman.
12. **Question:** What happened to the climate of Green Lake immediately following the murder of Sam?  
    **Answer:** Not a single drop of rain fell on Green Lake for one hundred and ten years.
13. **Question:** How did Katherine Barlow transform into the outlaw Kissin' Kate Barlow?  
    **Answer:** She shot the corrupt sheriff who refused to protect Sam and kissed his dead forehead with bright red lipstick.
14. **Question:** How did Kissin' Kate Barlow die when confronted by Trout and Linda Walker?  
    **Answer:** She was bitten by a lethal yellow-spotted lizard and died laughing, leaving her buried fortune hidden.
15. **Question:** What was the distinctive shape of the mountain where Stanley's great-grandfather survived?  
    **Answer:** An enormous stone fist with an upturned thumb, known as 'God's Thumb' (Big Thumb Mountain).
16. **Question:** Why did Zero hit Mr. Pendanski with his shovel and escape into the desert?  
    **Answer:** Because Pendanski publicly humiliated him, claiming he was stupid and that a shovel had more brain than he did.
17. **Question:** What did Zero drink to stay alive for days under the overturned rowboat in the desert?  
    **Answer:** 'Sploosh', which was Katherine Barlow's 110-year-old canned spiced peaches in glass jars.
18. **Question:** How was the century-old Yelnats family curse officially broken?  
    **Answer:** Stanley carried Hector Zeroni up the mountain, gave him water from the spring, and sang the ancestral lullaby.
19. **Question:** Why did the yellow-spotted lizards refuse to bite Stanley and Zero in the treasure pit?  
    **Answer:** Because the boys had eaten wild mountain onions for days, giving them 'onion blood', which lizards detest.
20. **Question:** What name was engraved on the exhumed metal suitcase that proved the Warden had no claim to it?  
    **Answer:** STANLEY YELNATS (the personal property of Stanley Yelnats I).
21. **Question:** Why was the state forced to release Hector Zeroni alongside Stanley?  
    **Answer:** Because Dr. Pendanski had erased all of Hector's files; without legal documentation, his detention was completely illegal.
22. **Question:** What happened to the weather over Green Lake as Stanley and Zero drove away?  
    **Answer:** A torrential rainstorm poured over Green Lake for the first time in 110 years.
23. **Question:** What invention by Stanley's father finally made the Yelnats family wealthy?  
    **Answer:** An eco-friendly foot-odor eliminating spray made from peach extracts and onion essences, branded as 'Sploosh.'
24. **Question:** What became of the Camp Green Lake property after it was shut down by state authorities?  
    **Answer:** It was bought by the Girl Scouts of America to be developed into an official summer camp.
25. **Question:** What did Hector Zeroni do with his share of the treasure money (nearly $1 million)?  
    **Answer:** He hired a team of private investigators who successfully tracked down and reunited him with his long-lost mother.

---
*End of Comprehensive Study Guide — Holes by Louis Sachar (Chapters 1 to 50)*
""")

    full_md = "\n".join(content)

    # Clean plain text version: remove markdown image links, format links cleanly, remove headers
    txt_content = re.sub(r'!\[.*?\]\(.*?\)', '', full_md)
    txt_content = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', txt_content)
    txt_content = re.sub(r'^#+\s+', '', txt_content, flags=re.MULTILINE)
    txt_content = txt_content.strip()

    with open(md_path, 'w', encoding='utf-8') as f:
        f.write(full_md.strip() + '\n')
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write(txt_content + '\n')
    print(f"Successfully generated Holes_Chapter_Summaries.md and Holes_Chapter_Summaries.txt")

if __name__ == '__main__':
    generate_chapter_summaries()
