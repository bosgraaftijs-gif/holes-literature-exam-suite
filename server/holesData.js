/**
 * Holes Exam Suite — Literature Lore & Data Engine
 * Aligned with UK GCSE (AQA, Edexcel), Cambridge IGCSE, and IB MYP Literature standards.
 * Centers on Louis Sachar's novel 'Holes' (1998).
 */

const timelineStorylines = [
  {
    id: 'era_a',
    title: 'Era A: 1880s Latvia',
    period: 'Circa 1880s',
    setting: 'Latvia (Russian Empire / Eastern Europe)',
    description: 'The ancestral origin of the Yelnats family misfortune: Elya Yelnats, Madame Zeroni, and the unfulfilled mountain promise.',
    color: '#8b5cf6'
  },
  {
    id: 'era_b',
    title: 'Era B: 1888–1890s Old Green Lake',
    period: '1888–1890s',
    setting: 'Green Lake, Texas (Vibrant lake town before the 110-year drought)',
    description: 'The tragic love of Miss Katherine Barlow and Sam the Onion Man, the town lynching, Katherine’s transformation into outlaw Kissin’ Kate, and the robbery of Stanley Yelnats I.',
    color: '#f59e0b'
  },
  {
    id: 'era_c',
    title: 'Era C: 1990s Modern Camp Green Lake',
    period: '1990s (110 years after drought)',
    setting: 'Camp Green Lake, Texas (Juvenile correctional facility on dried lakebed)',
    description: 'Stanley Yelnats IV (“Caveman”) is wrongfully sent to dig 5ft x 5ft holes, befriends Hector Zeroni (“Zero”), discovers the Mary Lou, ascends God’s Thumb to break the generational curse, and unearths the buried suitcase.',
    color: '#10b981'
  }
];

const timelineEvents = [
  {
    id: 'ev_a1',
    eraId: 'era_a',
    order: 1,
    chapter: 'Ch. 7',
    title: 'Elya Yelnats loves Myra Menke',
    summary: '15-year-old Elya is in love with empty-headed Myra Menke, competing against 50-year-old pig farmer Igor Barkov.',
    quote: 'Myra Menke was a beautiful girl, but her head was as empty as a flowerpot.',
    ao2Commentary: 'Establishes the theme of foolish romantic infatuation versus genuine moral depth.',
    convergenceNode: null
  },
  {
    id: 'ev_a2',
    eraId: 'era_a',
    order: 2,
    chapter: 'Ch. 7',
    title: 'Madame Zeroni’s Pig Promise & Mountain Ritual',
    summary: 'Madame Zeroni gives Elya a runt pig and instructs him to carry it up the mountain daily to drink from the sweet stream while singing the lullaby. In return, Elya swears to carry Madame Zeroni up the mountain.',
    quote: 'If you forget, you and your family will be cursed for always and eternity!',
    ao2Commentary: 'Structural catalyst for the entire novel. The ritual requires physical sacrifice, pure water, and song.',
    convergenceNode: 'gods_thumb'
  },
  {
    id: 'ev_a3',
    eraId: 'era_a',
    order: 3,
    chapter: 'Ch. 7',
    title: 'The Broken Oath & Emigration to America',
    summary: 'Disillusioned when Myra cannot choose between him and Igor, Elya boards a ship to America without carrying Madame Zeroni up the mountain, triggering the 110-year family curse.',
    quote: 'He remembered his promise to Madame Zeroni... he felt terrible about it.',
    ao2Commentary: 'The moral failing (breaking a sacred promise) introduces generational karma and guilt.',
    convergenceNode: 'lullaby'
  },
  {
    id: 'ev_a4',
    eraId: 'era_a',
    order: 4,
    chapter: 'Ch. 7',
    title: 'Sarah Miller & The American Lullaby',
    summary: 'In America, Elya marries hardworking Sarah Miller. She adapts Madame Zeroni’s song into an English lullaby, which is passed down through four generations of Yelnats boys.',
    quote: 'If only, if only, the woodpecker sighs, the bark on the tree was just a little bit softer...',
    ao2Commentary: 'Motif of cultural adaptation; the lullaby keeps the memory and regret alive across generations.',
    convergenceNode: 'lullaby'
  },
  {
    id: 'ev_b1',
    eraId: 'era_b',
    order: 5,
    chapter: 'Ch. 23–25',
    title: 'Katherine Barlow & Sam the Onion Man',
    summary: 'Green Lake is a thriving lakeside town famous for Katherine Barlow’s spiced peaches. Black onion seller Sam fixes the schoolhouse and exchanges sweet onions and poetry books with Katherine.',
    quote: 'The secret is in the onions, Miss Katherine.',
    ao2Commentary: 'Symbolizes racial harmony and natural innocence in an otherwise rigid, prejudiced society.',
    convergenceNode: 'onions'
  },
  {
    id: 'ev_b2',
    eraId: 'era_b',
    order: 6,
    chapter: 'Ch. 25–26',
    title: 'The Forbidden Kiss, Lynching & The 110-Year Drought',
    summary: 'Wealthy Trout Walker catches Katherine and Sam kissing. An enraged racist lynch mob burns the schoolhouse, shoots Sam on his boat Mary Lou, and kills his donkey. From that exact day, not a single drop of rain falls on Green Lake for 110 years.',
    quote: 'God will punish you! ... Not one drop of rain would fall upon Green Lake.',
    ao2Commentary: 'The drought is nature’s karmic punishment for human cruelty and racial violence. The lake dries up, mirroring the town’s withered morality.',
    convergenceNode: 'sploosh'
  },
  {
    id: 'ev_b3',
    eraId: 'era_b',
    order: 7,
    chapter: 'Ch. 28',
    title: 'Kissin’ Kate Robs Stanley Yelnats I',
    summary: 'Katherine becomes Texas’s most feared outlaw, leaving a red lipstick kiss on her victims. She robs Stanley Yelnats I of his Wall Street fortune in the desert and leaves him to die.',
    quote: 'He found refuge on God’s Thumb, after being stranded in the desert by Kissin’ Kate Barlow.',
    ao2Commentary: 'First direct intersection of the Yelnats and Barlow storylines; establishes God’s Thumb as a miraculous sanctuary.',
    convergenceNode: 'suitcase'
  },
  {
    id: 'ev_b4',
    eraId: 'era_b',
    order: 8,
    chapter: 'Ch. 28',
    title: 'Trout Walker Confrontation & Kate’s Death',
    summary: 'Twenty years later, a destitute Trout Walker and Linda Miller torture Kate to reveal where she buried the stolen loot. Kate is bitten by a yellow-spotted lizard, laughs defiantly, and dies telling them to start digging.',
    quote: 'Start digging... Nobody will ever find it.',
    ao2Commentary: 'Irony of futile greed: condemned generations of Walkers to dig endless holes in search of the treasure.',
    convergenceNode: 'lizards'
  },
  {
    id: 'ev_c1',
    eraId: 'era_c',
    order: 9,
    chapter: 'Ch. 1–9',
    title: 'Stanley IV Arrested & Arrives at Camp Green Lake',
    summary: 'Stanley Yelnats IV is wrongfully convicted of stealing Clyde Livingston’s donated sneakers (which Zero dropped from an overpass). He is sent to Camp Green Lake to dig 5ft x 5ft holes in the dry lakebed under Mr. Sir and Warden Louise Walker.',
    quote: 'You take a bad boy and make him dig a hole every day in the hot sun, it turns him into a good boy.',
    ao2Commentary: 'Institutional satire; the regime disguises the Warden’s private treasure hunt as moral discipline.',
    convergenceNode: 'suitcase'
  },
  {
    id: 'ev_c2',
    eraId: 'era_c',
    order: 10,
    chapter: 'Ch. 13–15',
    title: 'Discovery of the KB Lipstick Tube',
    summary: 'Stanley finds the gold lipstick tube engraved with "KB" (Katherine Barlow). X-Ray claims the find, prompting the Warden to intensify excavation around X-Ray’s hole, far from where Stanley actually found it.',
    quote: 'Stanley looked at the initials: KB. It was a tube of lipstick.',
    ao2Commentary: 'Dramatic irony: the Warden spends weeks digging in the wrong area because of inmate hierarchy and deceit.',
    convergenceNode: 'suitcase'
  },
  {
    id: 'ev_c3',
    eraId: 'era_c',
    order: 11,
    chapter: 'Ch. 30–36',
    title: 'Zero Flees & Stanley Finds the Mary Lou Wreck',
    summary: 'After Mr. Pendanski mocks Zero’s illiteracy, Zero smashes him with a shovel and flees into the desert. Stanley steals the water truck, crashes into a hole, and walks toward God’s Thumb, finding Zero surviving under Sam’s overturned boat eating "Sploosh".',
    quote: 'Zero wasn’t a nobody. He was somebody.',
    ao2Commentary: 'Pivotal moment of moral agency: Stanley chooses loyalty and active self-sacrifice over passive survival.',
    convergenceNode: 'sploosh'
  },
  {
    id: 'ev_c4',
    eraId: 'era_c',
    order: 12,
    chapter: 'Ch. 38–39',
    title: 'Ascending God’s Thumb & Breaking the Curse',
    summary: 'Stanley carries the fainting Hector Zeroni up the mountain, uncovers wild sweet onions and fresh water, and sings the family lullaby. Without knowing it, Stanley fulfills the 110-year-old promise Elya failed to keep to Madame Zeroni.',
    quote: 'He gathered his strength and lifted Zero... it was the hardest thing he had ever done.',
    ao2Commentary: 'The supreme structural climax: structural inversion of Elya’s broken vow, dissolving the curse through selfless love.',
    convergenceNode: 'gods_thumb'
  },
  {
    id: 'ev_c5',
    eraId: 'era_c',
    order: 13,
    chapter: 'Ch. 44–46',
    title: 'The Lizard Pit & The Name on the Suitcase',
    summary: 'The boys return to excavate Stanley’s original hole and uncover the buried metal suitcase. The Warden, Mr. Sir, and Dr. Pendanski trap them in the pit, but deadly yellow-spotted lizards refuse to bite because of their onion-saturated blood. Stanley’s attorney arrives and reads the name on the suitcase: "STANLEY YELNATS".',
    quote: 'Lizards don’t like onion blood.',
    ao2Commentary: 'Poetic justice and legal restoration: the suitcase rightfully belongs to Stanley, proving providence rewards moral integrity.',
    convergenceNode: 'lizards'
  },
  {
    id: 'ev_c6',
    eraId: 'era_c',
    order: 14,
    chapter: 'Ch. 49–50',
    title: 'Rain Returns & Sploosh Foot Spray Success',
    summary: 'Camp Green Lake is closed and turned into a Girl Scout camp. The first rain in 110 years drenches Green Lake. Stanley’s father perfects "Sploosh" (sweet peach-onion foot spray) and Zero hires private investigators to reunite with his mother.',
    quote: 'For the first time in over a hundred years, a drop of rain fell upon the empty lake.',
    ao2Commentary: 'The circular resolution harmonizes all three eras: the curse lifted, nature restored, and fractured families reunited.',
    convergenceNode: 'sploosh'
  }
];

const convergenceNodesData = [
  {
    id: 'gods_thumb',
    name: 'God’s Thumb (The Mountain Sanctuary)',
    icon: '⛰️',
    description: 'The monumental rock formation providing water, onions, and generational redemption.',
    eraALink: 'Elya Yelnats carries the piglet up the mountain in Latvia to drink the sweet stream (Ch. 7).',
    eraBLink: 'Stanley Yelnats I survives Kissin’ Kate Barlow’s desert robbery by finding refuge on "God’s Thumb" (Ch. 28).',
    eraCLink: 'Stanley IV carries Hector Zeroni up God’s Thumb, sustaining both on water and wild onions, breaking the curse (Ch. 38–39).'
  },
  {
    id: 'lullaby',
    name: 'The Pig Lullaby ("If Only, If Only")',
    icon: '🎶',
    description: 'The melancholic folk song passed down through generations, transformed from curse to blessing.',
    eraALink: 'Madame Zeroni teaches Elya the song to sing while carrying the piglet in Latvia (Ch. 7).',
    eraBLink: 'Sarah Miller translates the melody into English for Stanley Yelnats I in America (Ch. 7).',
    eraCLink: 'Stanley IV sings the lullaby to Zero atop God’s Thumb; Hector’s mother sings the final stanza at the reunion party (Ch. 39, 50).'
  },
  {
    id: 'sploosh',
    name: 'Sploosh & Spiced Peaches',
    icon: '🍑',
    description: 'The sweet culinary thread bridging 110 years of tragedy and industrial triumph.',
    eraALink: 'Represents the sweet abundance Elya sought in the New World.',
    eraBLink: 'Miss Katherine Barlow wins blue ribbons for her secret spiced peaches, Sam’s favorite delicacy (Ch. 23).',
    eraCLink: 'Zero survives in the desert on 110-year-old jars of spiced peaches ("Sploosh"); Stanley III invents Sploosh foot spray (Ch. 36, 50).'
  },
  {
    id: 'onions',
    name: 'Sam’s Wild Sweet Onions',
    icon: '🧅',
    description: 'The natural emblem of physical healing, spiritual resilience, and moral protection.',
    eraALink: 'The fertility of the soil Madame Zeroni revered in old European lore.',
    eraBLink: 'Sam sells wild onions from his secret patch as medicine for all town ailments (Ch. 25).',
    eraCLink: 'Stanley and Zero eat wild onions on God’s Thumb; onion sulfur in their blood repels lethal lizards (Ch. 38, 45).'
  },
  {
    id: 'suitcase',
    name: 'The Inscribed Metal Suitcase',
    icon: '💼',
    description: 'The literal treasure bearing the name STANLEY YELNATS, stolen by Kate and sought by Walkers.',
    eraALink: 'The fortune Elya’s descendants worked to build on Wall Street.',
    eraBLink: 'Kissin’ Kate Barlow robs Stanley I’s suitcase in the desert and buries it at Green Lake (Ch. 28).',
    eraCLink: 'The Warden spends decades digging up the desert to find it; Stanley IV lifts it from the lizard pit (Ch. 45–46).'
  },
  {
    id: 'lizards',
    name: 'Yellow-Spotted Lizards & Rattlesnake Venom',
    icon: '🦎',
    description: 'Nature’s lethal arbiters of karmic retribution and institutional poison.',
    eraALink: 'The deadly superstitions and oaths of Madame Zeroni.',
    eraBLink: 'A yellow-spotted lizard bites Kissin’ Kate Barlow as she mocks Trout Walker; she dies laughing (Ch. 28).',
    eraCLink: 'Lizards infest the treasure pit but spare the boys; Warden Louise Walker’s venomous nail polish punishes Mr. Sir (Ch. 20, 45).'
  }
];

const motifsData = [
  {
    id: 'onions',
    title: 'Wild Sweet Onions (Sam & God’s Thumb)',
    icon: '🧅',
    thematicSignificance: 'Emblem of physical rejuvenation, spiritual resilience, racial unity, and nature’s poetic justice.',
    appearances: [
      {
        era: 'Era B: Old Green Lake (1888)',
        chapter: 'Ch. 25',
        context: 'Sam sells sweet onions from his secret mountain oasis to cure every illness in town, from asthma to baldness.',
        quote: 'The secret is in the onions, Miss Katherine.',
        analysisAO2: 'Establishes the onion as an organic instrument of benevolence, starkly contrasting with the town’s spiritual sickness.'
      },
      {
        era: 'Era C: God’s Thumb (1990s)',
        chapter: 'Ch. 38',
        context: 'Stanley digs in the mud atop God’s Thumb and finds wild onions, feeding Zero and reviving him from dehydration.',
        quote: 'It tasted like water and sweet onion... the best thing he had ever eaten.',
        analysisAO2: 'The onion functions as a Eucharistic meal of resurrection and renewal atop the Edenic mountain.'
      },
      {
        era: 'Era C: The Lizard Pit (1990s)',
        chapter: 'Ch. 45',
        context: 'Lethal yellow-spotted lizards swarm over Stanley and Zero in the treasure pit but refuse to strike.',
        quote: 'Lizards don’t like onion blood.',
        analysisAO2: 'Transforms the humble vegetable into a shield of divine justice, neutralizing institutional malice.'
      }
    ],
    peelModel: {
      point: 'Louis Sachar employs the recurring motif of sweet onions to symbolize nature’s incorruptible protection over moral innocence.',
      evidence: 'This is vividly demonstrated in Chapter 45, where deadly yellow-spotted lizards refuse to bite Stanley and Zero because "lizards don’t like onion blood."',
      explanation: 'By consuming Sam’s wild onions on God’s Thumb, the boys absorb the benevolent spirit of the mountain, rendering them immune to lethal predators and the Warden’s cruelty.',
      link: 'Consequently, the onion serves as a triumphant motif of karmic restoration, proving that natural virtue outlasts systemic oppression.'
    }
  },
  {
    id: 'sploosh',
    title: 'Sploosh (Spiced Peaches & Foot Spray)',
    icon: '🍑',
    thematicSignificance: 'Symbol of sweetness preserved across a century of suffering; bridges Katherine Barlow’s love with Stanley III’s commercial redemption.',
    appearances: [
      {
        era: 'Era B: Old Green Lake (1888)',
        chapter: 'Ch. 23',
        context: 'Miss Katherine Barlow’s canned spiced peaches are famous throughout Texas, winning town prizes.',
        quote: 'She won a prize every year at the Fourth of July picnic for her spiced peaches.',
        analysisAO2: 'Represents innocent joy, warmth, and culinary craftsmanship prior to racial violence.'
      },
      {
        era: 'Era C: Under Mary Lou Wreck (1990s)',
        chapter: 'Ch. 35–36',
        context: 'Zero discovers surviving glass jars of 110-year-old spiced peaches under the boat wreck and names it "Sploosh".',
        quote: 'He called it Sploosh... It was bubbling, but sweet and cool.',
        analysisAO2: 'Demonstrates preservation across time; Katherine’s legacy literally keeps Hector Zeroni alive in the desert.'
      },
      {
        era: 'Era C: Modern Exoneration (1990s)',
        chapter: 'Ch. 50',
        context: 'Stanley Yelnats III successfully invents an odor-eliminating foot spray made from peaches and onions, marketing it as "Sploosh".',
        quote: 'Sploosh! Clyde Livingston smiled as he sprayed his feet.',
        analysisAO2: 'Brings the multi-generational journey to full harmonic resolution: financial salvation through historical remembrance.'
      }
    ],
    peelModel: {
      point: 'The motif of "Sploosh" operates as a structural bridge linking 19th-century love with 20th-century family redemption.',
      evidence: 'In Chapter 36, Zero survives near-starvation in the desert by consuming Katherine Barlow’s century-old canned peaches, proclaiming: "He called it Sploosh."',
      explanation: 'Sachar uses this sensory sweetness to demonstrate how Katherine’s memory and Sam’s boat remain agents of grace long after Green Lake’s destruction.',
      link: 'The eventual rebranding of the peach-onion foot spray as "Sploosh" closes the generational cycle, turning past grief into modern prosperity.'
    }
  },
  {
    id: 'shovels_holes',
    title: 'Shovels & Holes (Penal Labor vs. Truth)',
    icon: '⛏️',
    thematicSignificance: 'Critique of punitive discipline; symbol of systemic dehumanization, digging one’s grave versus uncovering buried truth.',
    appearances: [
      {
        era: 'Era C: Camp Green Lake (1990s)',
        chapter: 'Ch. 2',
        context: 'Mr. Sir explains that digging one five-foot-deep hole each day builds character in delinquent boys.',
        quote: 'You take a bad boy and make him dig a hole every day in the hot sun, it turns him into a good boy.',
        analysisAO2: 'Exposes authoritarian hypocrisy: brutal manual labor disguised as rehabilitative education.'
      },
      {
        era: 'Era B: Trout Walker’s Torment (1890s)',
        chapter: 'Ch. 28',
        context: 'Kate Barlow laughs at Trout Walker with her dying breath, condemning his lineage to dig in vain.',
        quote: 'Start digging... Nobody will ever find it.',
        analysisAO2: 'The hole becomes a symbol of futile greed and eternal condemnation for the Walker family.'
      },
      {
        era: 'Era C: The Climax (1990s)',
        chapter: 'Ch. 44',
        context: 'Stanley and Zero excavate the authentic hole together out of mutual trust, finding the rightful family suitcase.',
        quote: 'He dug his shovel into the side of the hole and hit something hard and metallic.',
        analysisAO2: 'Inverts the shovel from an instrument of enslavement into a tool of vindication and liberated identity.'
      }
    ],
    peelModel: {
      point: 'Sachar subverts the shovel and hole motif to critique punitive penal institutions that exploit juvenile labor under the guise of character reform.',
      evidence: 'While Mr. Sir claims digging "turns him into a good boy," Stanley soon discovers the boys are merely excavating the desert for the Warden’s private greed.',
      explanation: 'The monotonous, circular task mirrors the boys’ trapped social status, reducing young humans to instruments of physical exertion.',
      link: 'Only when Stanley and Zero dig cooperatively as equal brothers does the shovel transform from a weapon of subjugation into an instrument of liberation.'
    }
  },
  {
    id: 'lizards_venom',
    title: 'Yellow-Spotted Lizards & Rattlesnake Venom',
    icon: '🦎',
    thematicSignificance: 'Dual symbols of institutional cruelty (the Warden’s nail polish) versus nature’s impartial, deadly arbiters of karma.',
    appearances: [
      {
        era: 'Era C: Camp Green Lake (1990s)',
        chapter: 'Ch. 4',
        context: 'The reader is introduced to yellow-spotted lizards with eleven yellow spots and fatal venomous bites.',
        quote: 'If you get bitten by a yellow-spotted lizard, you might as well lie down in the shade, because you are going to die.',
        analysisAO2: 'Establishes the constant omnipresent threat of sudden mortality hanging over Camp Green Lake.'
      },
      {
        era: 'Era C: The Warden’s Cabin (1990s)',
        chapter: 'Ch. 20',
        context: 'Warden Louise Walker paints her fingernails with rattlesnake venom and claws Mr. Sir’s face as punishment.',
        quote: 'It’s only toxic while it’s wet... He screamed in agonizing pain.',
        analysisAO2: 'A visceral metaphor for the Warden’s venomous authority and sadistic psychological dominance.'
      },
      {
        era: 'Era C: The Treasure Pit (1990s)',
        chapter: 'Ch. 45',
        context: 'Lizards crawl over the boys but do not strike because of their onion-scented blood, thwarting the Warden.',
        quote: 'A lizard leaped off Stanley’s chest and onto the dirt.',
        analysisAO2: 'Nature proves impartial; the creatures that killed Kate Barlow become the protective guardians of Stanley and Zero.'
      }
    ],
    peelModel: {
      point: 'Sachar employs venom and deadly lizards to draw a stark parallel between human institutional cruelty and nature’s untamed justice.',
      evidence: 'In Chapter 20, the Warden violently asserts her authority by slashing Mr. Sir with nail polish laced with rattlesnake venom, whispering: "It’s only toxic while it’s wet."',
      explanation: 'Her sadistic application of venom mirrors the predatory nature of the camp, yet nature ultimately refuses to cooperate with her villainy.',
      link: 'When the deadly lizards spare Stanley and Zero in the climactic pit scene, Sachar signals that true natural venom strikes only against the corrupt.'
    }
  },
  {
    id: 'lullaby',
    title: 'The Pig Lullaby ("If Only, If Only")',
    icon: '🎶',
    thematicSignificance: 'Symbol of melancholic ancestral debt, longing for maternal comfort, and final generational reconciliation.',
    appearances: [
      {
        era: 'Era A: Latvia (1880s)',
        chapter: 'Ch. 7',
        context: 'Madame Zeroni teaches Elya the lullaby to sing to the pig as he ascends the mountain.',
        quote: 'If only, if only, the moon speaks to the stars...',
        analysisAO2: 'The sacred conditioning ritual that ties physical exertion and song to moral duty.'
      },
      {
        era: 'Era C: God’s Thumb (1990s)',
        chapter: 'Ch. 39',
        context: 'Stanley carries Zero up the mountain and sings Sarah Miller’s American version to soothe his delirious friend.',
        quote: 'He sang the song that had been in his family for generations.',
        analysisAO2: 'Fulfills the unpaid debt without conscious design, substituting genuine empathy for magical curse-breaking.'
      },
      {
        era: 'Era C: Final Reunion (1990s)',
        chapter: 'Ch. 50',
        context: 'Zero’s mother is reunited with her son and sings the gentle concluding stanza to Hector.',
        quote: 'If only, if only, the moon speaks to the stars... A mother holds her child in her arms.',
        analysisAO2: 'Transforms a century-long lament into a triumphant celebration of maternal love and restored family.'
      }
    ],
    peelModel: {
      point: 'The recurring folk lullaby acts as an emotional leitmotif tracing the Yelnats family’s trajectory from ancestral failure to spiritual redemption.',
      evidence: 'In Chapter 39, atop God’s Thumb, Stanley sings: "If only, if only, the woodpecker sighs..." while carrying Zero up the mountain stream.',
      explanation: 'Originally an expression of regret and unfulfilled destiny, the song becomes an act of brotherly devotion that completes Elya’s abandoned promise to Madame Zeroni.',
      link: 'When Hector’s mother sings the final stanza in Chapter 50, Sachar completes the musical motif, signaling the total healing of both lineages.'
    }
  }
];

const iconicQuotesData = [
  {
    id: 'q1',
    quote: 'I can fix that.',
    speaker: 'Sam the Onion Man',
    options: ['Mr. Sir', 'Sam the Onion Man', 'Stanley Yelnats IV', 'Dr. Pendanski'],
    correctIndex: 1,
    chapter: 'Ch. 24–25',
    context: 'Sam repairs the schoolhouse roof, windows, and chimney for Katherine Barlow in exchange for jars of spiced peaches.',
    subtextOptions: [
      'Sam was attempting to charge Katherine high repair fees.',
      'A phrase representing emotional healing, mutual respect, and racial solidarity before the tragic lynching.',
      'Sam was advertising his onion business to the town elders.',
      'Sam was expressing frustration with the decrepit schoolhouse.'
    ],
    correctSubtextIndex: 1,
    theme: 'Healing & Racial Solidarity',
    modelSentence: 'Through Sam’s gentle refrain "I can fix that," Sachar establishes craftsmanship and quiet benevolence as antidotes to institutional bigotry.'
  },
  {
    id: 'q2',
    quote: 'If only, if only, the woodpecker sighs, the bark on the tree was just a little bit softer...',
    speaker: 'Madame Zeroni / Sarah Miller / Stanley',
    options: ['The Warden (Louise Walker)', 'Clyde Livingston', 'Madame Zeroni / Sarah Miller / Stanley', 'X-Ray (Rex)'],
    correctIndex: 2,
    chapter: 'Ch. 7, 39, 50',
    context: 'The generational lullaby taught in Latvia, adapted in America, and sung atop God’s Thumb.',
    subtextOptions: [
      'A comedic nursery rhyme to pass the time while digging.',
      'A song about timber harvesting in 19th-century Latvia.',
      'An emotional leitmotif conveying melancholic regret, ancestral debt, and eventual homecoming.',
      'A coded message pointing to where Kate Barlow buried the suitcase.'
    ],
    correctSubtextIndex: 2,
    theme: 'Generational Fate & Redemption',
    modelSentence: 'Sachar deploys the lullaby as a poetic emblem of generational longing that evolves from an inescapable curse into a triumphant anthem of mutual rescue.'
  },
  {
    id: 'q3',
    quote: 'Zero wasn’t a nobody. He was somebody.',
    speaker: 'Stanley Yelnats IV ("Caveman")',
    options: ['Mr. Pendanski', 'Stanley Yelnats IV ("Caveman")', 'The Warden', 'Igor Barkov'],
    correctIndex: 1,
    chapter: 'Ch. 30',
    context: 'Stanley reflects after Hector Zeroni smashes Mr. Pendanski with a shovel and flees into the deadly desert.',
    subtextOptions: [
      'Stanley was feeling guilty because he lost his private math tutor.',
      'Stanley wanted to warn the Warden that Zero might attack the camp.',
      'Marks Stanley’s moral turning point: rejecting Camp Green Lake’s dehumanizing hierarchy to affirm Zero’s intrinsic human dignity.',
      'Stanley believed Zero had stolen the Warden’s hidden money.'
    ],
    correctSubtextIndex: 2,
    theme: 'Human Dignity & Moral Agency',
    modelSentence: 'Stanley’s internal epiphany that "Zero wasn’t a nobody. He was somebody" marks the decisive shift from passive victimhood to courageous moral agency.'
  },
  {
    id: 'q4',
    quote: 'You make the decision: Camp Green Lake, or jail?',
    speaker: 'The Judge',
    options: ['Mr. Sir', 'The Judge', 'Stanley’s Father', 'Sheriff of Green Lake'],
    correctIndex: 1,
    chapter: 'Ch. 3',
    context: 'The judge offers Stanley a choice of punishment after his wrongful conviction for stealing Clyde Livingston’s shoes.',
    subtextOptions: [
      'Highlights the judicial system’s incompetence and the bitter irony that Camp Green Lake is far more brutal than prison.',
      'Shows how compassionate the judge was toward impoverished children.',
      'Demonstrates that Stanley eagerly wanted an outdoor vacation.',
      'Indicates that Stanley’s family could afford expensive legal representation.'
    ],
    correctSubtextIndex: 0,
    theme: 'Flawed Justice & Social Class',
    modelSentence: 'The judge’s false dichotomy between "Camp Green Lake, or jail" exposes a punitive legal framework that criminalizes poverty while remaining blind to factual truth.'
  },
  {
    id: 'q5',
    quote: 'I’m not stupid, I know everybody thinks I am. I just don’t like answering their questions.',
    speaker: 'Hector Zeroni ("Zero")',
    options: ['Twitch', 'Magnet', 'Hector Zeroni ("Zero")', 'Stanley Yelnats I'],
    correctIndex: 2,
    chapter: 'Ch. 18',
    context: 'Zero opens up to Stanley about his refusal to communicate with camp counselors.',
    subtextOptions: [
      'Zero was planning to escape that evening.',
      'Zero was mocking Stanley’s inability to dig fast.',
      'Demonstrates silent resilience and self-preservation in the face of prejudice and intellectual condescension.',
      'Zero was confessing that he had never attended school.'
    ],
    correctSubtextIndex: 2,
    theme: 'Prejudice & Hidden Potential',
    modelSentence: 'Hector’s quiet assertion of self-worth deconstructs societal metrics of intelligence, revealing how institutional silence is often a deliberate shield against systemic contempt.'
  },
  {
    id: 'q6',
    quote: 'Excuse me? Did I ask you to come to my room?',
    speaker: 'The Warden (Louise Walker)',
    options: ['Madame Zeroni', 'The Warden (Louise Walker)', 'Linda Miller', 'Katherine Barlow'],
    correctIndex: 1,
    chapter: 'Ch. 20',
    context: 'The Warden intimidates Mr. Sir and Stanley when Mr. Sir brings Stanley to her cabin for allegedly stealing sunflower seeds.',
    subtextOptions: [
      'Illustrates cold, terrifying authoritarianism and erratic mood shifts that keep subordinates in constant fear.',
      'The Warden was busy painting her toenails.',
      'The Warden was worried Stanley would discover her secret map.',
      'The Warden did not like receiving visitors during the afternoon.'
    ],
    correctSubtextIndex: 0,
    theme: 'Authoritarian Power & Corruption',
    modelSentence: 'Sachar characterizes the Warden through icy, calculated interrogations, highlighting how corrupt power thrives on unpredictability and theatrical cruelty.'
  },
  {
    id: 'q7',
    quote: 'You take a bad boy and make him dig a hole every day in the hot sun, it turns him into a good boy.',
    speaker: 'Mr. Sir (Marion Sevillo)',
    options: ['Stanley’s Grandfather', 'Mr. Sir (Marion Sevillo)', 'Sheriff', 'Clyde Livingston'],
    correctIndex: 1,
    chapter: 'Ch. 2',
    context: 'Mr. Sir explains the camp’s official disciplinary philosophy upon Stanley’s arrival.',
    subtextOptions: [
      'A genuine educational methodology supported by modern psychology.',
      'Satirical exposure of punitive labor masking exploitation; digging holes builds nothing except the Warden’s fortune.',
      'Mr. Sir was trying to encourage Stanley to exercise and build muscles.',
      'A warning that inmates must dig at night to avoid heatstroke.'
    ],
    correctSubtextIndex: 1,
    theme: 'Exploitation & Institutional Hypocrisy',
    modelSentence: 'Mr. Sir’s authoritarian mantra satirizes the fallacy of punitive discipline, exposing how society sanctions the physical exploitation of vulnerable youth.'
  },
  {
    id: 'q8',
    quote: 'Start digging.',
    speaker: 'Kissin’ Kate Barlow',
    options: ['The Warden', 'Mr. Sir', 'Kissin’ Kate Barlow', 'Sam'],
    correctIndex: 2,
    chapter: 'Ch. 28',
    context: 'Katherine’s dying words to Trout Walker and Linda Miller as she is bitten by a yellow-spotted lizard in the desert.',
    subtextOptions: [
      'A complete reversal of power, consigning the greedy Walkers to generations of futile, maddening desert excavation.',
      'Kate was giving Trout directions to find the hidden gold.',
      'Kate was begging Trout to dig a grave for her body.',
      'Kate was warning them that a storm was approaching.'
    ],
    correctSubtextIndex: 0,
    theme: 'Poetic Justice & Futile Greed',
    modelSentence: 'Katherine’s defiant command to "Start digging" delivers a supreme stroke of poetic justice, condemning three generations of Walkers to fruitlessly turn over desert dust.'
  },
  {
    id: 'q9',
    quote: 'It has my name on it.',
    speaker: 'Stanley Yelnats IV',
    options: ['Hector Zeroni', 'Stanley Yelnats IV', 'Clyde Livingston', 'Elya Yelnats'],
    correctIndex: 1,
    chapter: 'Ch. 46',
    context: 'Stanley notices the engraved tarnished silver letters on the lock of the excavated suitcase.',
    subtextOptions: [
      'Stanley was trying to trick the Warden into surrendering the treasure.',
      'The climactic reclamation of family heritage and identity, turning 110 years of bad luck into poetic providence.',
      'Stanley had carved his own name on the box using a shovel.',
      'Stanley was reading the label on Clyde Livingston’s stolen gym bag.'
    ],
    correctSubtextIndex: 1,
    theme: 'Reclamation of Identity & Destiny',
    modelSentence: 'The realization that the suitcase bears Stanley’s own name transforms an apparent generational curse into an ordained moment of ancestral restoration.'
  },
  {
    id: 'q10',
    quote: 'The secret is in the onions, Miss Katherine.',
    speaker: 'Sam the Onion Man',
    options: ['Stanley Yelnats III', 'Sam the Onion Man', 'Dr. Pendanski', 'Igor Barkov'],
    correctIndex: 1,
    chapter: 'Ch. 25',
    context: 'Sam presents his sweet onions as a miracle tonic to Miss Katherine at the Green Lake schoolhouse.',
    subtextOptions: [
      'Sam was attempting to sell onions to make money for a new wagon.',
      'Foreshadows the miraculous nutritional and protective properties that will later save Stanley and Zero’s lives.',
      'Sam was teaching a biology lesson to the school children.',
      'A culinary recipe for making peach and onion stew.'
    ],
    correctSubtextIndex: 1,
    theme: 'Foreshadowing & Natural Medicine',
    modelSentence: 'Sam’s dialogue serves as masterclass foreshadowing; the humble onion, dismissed by the town, ultimately preserves both human life and moral truth across centuries.'
  }
];

const essayPromptsData = [
  {
    id: 'prompt_1',
    board: 'AQA / Edexcel GCSE',
    title: 'Fate vs. Free Will & Redemption',
    question: 'Analyze how Louis Sachar explores the tension between fate and moral agency in Stanley Yelnats’ path to redemption.',
    theme: 'Fate, Agency & Generational Karma',
    thesisClauses: {
      contention: 'Although Stanley initially resigns himself to being an unlucky victim of a generational curse,',
      methodology: 'Sachar employs intricate triple-narrative parallelism and the symbolic ascent of God’s Thumb to prove that',
      resolution: 'genuine redemption is achieved not through passive fate, but through active moral courage, loyalty, and self-sacrifice.'
    },
    outline: [
      {
        paragraph: 'Paragraph 1: Fatalism as a Psychological Shield',
        point: 'Stanley begins the novel relying on the "no-good-dirty-rotten-pig-stealing-great-great-grandfather" myth to excuse his misfortune.',
        evidence: 'In Chapter 3: "He seemed to be in the wrong place at the wrong time... it was all because of his no-good-dirty-rotten pig-stealing great-great-grandfather."',
        explanation: 'Sachar demonstrates how fatalism functions as an emotional crutch that fosters passivity and learned helplessness.',
        link: 'This establishes the thematic baseline that Stanley must overcome to develop true agency.'
      },
      {
        paragraph: 'Paragraph 2: The Choice of Altruistic Courage',
        point: 'Stanley’s desert rescue of Zero marks a deliberate break from passive fatalism into conscious moral sacrifice.',
        evidence: 'In Chapter 30: "Zero wasn’t a nobody. He was somebody." Stanley steals the water truck and marches into the uncharted desert.',
        explanation: 'Unlike Elya Yelnats, who fled his responsibilities in Latvia, Stanley willingly risks death to honor his bond with Zero.',
        link: 'Shows that destiny in *Holes* rewards individuals who choose selfless action over self-preservation.'
      },
      {
        paragraph: 'Paragraph 3: The Ascent of God’s Thumb & Inversion of the Curse',
        point: 'Carrying Hector up the mountain physically reverses Elya’s ancient broken promise to Madame Zeroni.',
        evidence: 'In Chapter 39: "He gathered his strength and lifted Zero... it was the hardest thing he had ever done."',
        explanation: 'Sachar structurally mirrors Elya carrying the pig up the mountain, demonstrating that breaking the curse demands physical endurance, love, and the repayment of moral debts.',
        link: 'Proves that human virtue and cosmic fate ultimately converge in poetic harmony.'
      }
    ]
  },
  {
    id: 'prompt_2',
    board: 'Cambridge IGCSE / Edexcel',
    title: 'Institutional Cruelty & Abuse of Power',
    question: 'How does Sachar present Camp Green Lake as a critique of institutional corruption and adult authority?',
    theme: 'Power, Corruption & Institutional Hypocrisy',
    thesisClauses: {
      contention: 'Through the bleak environment of Camp Green Lake,',
      methodology: 'Sachar utilizes biting satire, venomous symbolism, and systemic deceit to',
      resolution: 'expose how penal institutions exploit vulnerable youth and disguise greed under the sanctimonious rhetoric of character rehabilitation.'
    },
    outline: [
      {
        paragraph: 'Paragraph 1: The Rhetoric of False Discipline',
        point: 'Camp administrators disguise private economic exploitation as moral education.',
        evidence: 'Mr. Sir’s dogmatic claim: "You take a bad boy and make him dig a hole every day in the hot sun, it turns him into a good boy."',
        explanation: 'The endless digging does not rehabilitate; it physically breaks the boys while concealing the Warden’s private treasure hunt.',
        link: 'Highlights the fundamental dishonesty of penal institutions targeting disenfranchised youth.'
      },
      {
        paragraph: 'Paragraph 2: The Warden’s Sadistic Venom',
        point: 'The Warden’s venomous nail polish serves as an emblem of institutional cruelty.',
        evidence: 'In Chapter 20, the Warden claws Mr. Sir with rattlesnake venom: "It’s only toxic while it’s wet."',
        explanation: 'Her physical violence and intimidation demonstrate that authority in Camp Green Lake operates completely outside the boundaries of lawful justice.',
        link: 'Demonstrates how unchecked absolute power degrades both rulers and subjects.'
      },
      {
        paragraph: 'Paragraph 3: Bureaucratic Neglect & Dehumanization',
        point: 'Counselors reinforce dehumanization by erasing inmates’ authentic identities.',
        evidence: 'Replacing birth names with dehumanizing nicknames ("Caveman", "Zero") and Dr. Pendanski telling Hector: "You’d like to learn to read, wouldn’t you? But there’s nothing inside your head."',
        explanation: 'The staff actively suppress intellectual growth to prevent inmates from questioning their subjugation.',
        link: 'Underlines Sachar’s broader societal critique of a justice system designed to sustain marginalization.'
      }
    ]
  },
  {
    id: 'prompt_3',
    board: 'AQA / IB MYP',
    title: 'Friendship, Loyalty & Reclaiming Identity',
    question: 'Explore how the reciprocal friendship between Stanley and Hector Zeroni allows both boys to overcome societal labels and reclaim their identity.',
    theme: 'Friendship, Reciprocity & Identity',
    thesisClauses: {
      contention: 'In an environment engineered to alienate and dehumanize,',
      methodology: 'Sachar presents Stanley and Hector’s evolving partnership as a reciprocal alliance that',
      resolution: 'breaks the cycle of societal marginalization and allows both boys to reclaim their rightful names and intrinsic human dignity.'
    },
    outline: [
      {
        paragraph: 'Paragraph 1: The Pact of Reciprocity',
        point: 'The literacy-for-digging agreement establishes an equal partnership based on mutual respect.',
        evidence: 'Stanley teaches Zero to read the alphabet, while Zero digs part of Stanley’s hole each afternoon.',
        explanation: 'The transaction defies the camp’s dog-eat-dog social Darwinism, replacing exploitation with mutual aid.',
        link: 'Establishes friendship as the foundation for overcoming systemic oppression.'
      },
      {
        paragraph: 'Paragraph 2: The Shared Ascent and Moral Growth',
        point: 'Their shared survival on God’s Thumb cements their fraternal loyalty.',
        evidence: 'Zero confesses stealing Clyde Livingston’s shoes, while Stanley carries the unconscious Hector up the mountain without recrimination.',
        explanation: 'Forgiveness and unconditional support replace guilt and shame, creating an unbreakable bond.',
        link: 'Demonstrates that true friendship requires vulnerability, sacrifice, and shared suffering.'
      },
      {
        paragraph: 'Paragraph 3: Triumph in the Lizard Pit & Name Restoration',
        point: 'The climax in the lizard pit visually unites both boys against the corrupt adults.',
        evidence: 'Stanley and Zero hold the suitcase inscribed "STANLEY YELNATS" while lethal lizards crawl over both of them in silence.',
        explanation: 'The boys’ unity is protected by nature itself; Hector is the one who correctly reads the name on the suitcase, showcasing the triumph of his literacy.',
        link: 'Validates that their reciprocal loyalty achieves both spiritual freedom and social vindication.'
      }
    ]
  },
  {
    id: 'prompt_4',
    board: 'Cambridge IGCSE / Edexcel',
    title: 'Historical Injustice & Generational Echoes',
    question: 'Discuss how the tragic history of 19th-century Green Lake illuminates and explains the contemporary setting of Camp Green Lake.',
    theme: 'Racism, Historical Trauma & Karmic Drought',
    thesisClauses: {
      contention: 'The modern barren wasteland of Camp Green Lake is not an accident of geography,',
      methodology: 'but rather Sachar’s atmospheric physicalization of historical trauma, where',
      resolution: 'the racial lynching of Sam and the greed of the Walker dynasty cast a century-long moral shadow over the land until justice is restored.'
    },
    outline: [
      {
        paragraph: 'Paragraph 1: The Edenic Paradise Before the Fall',
        point: 'Green Lake was originally a thriving paradise sustained by mutual kindness.',
        evidence: 'Sam the Onion Man and Katherine Barlow’s spiced peaches symbolize agricultural abundance and racial harmony.',
        explanation: 'Sachar paints 1888 Green Lake as fertile to accentuate the catastrophic impact of racial hatred.',
        link: 'Sets up the historical sin that precipitates the ecological disaster.'
      },
      {
        paragraph: 'Paragraph 2: The Drought as Cosmic Moral Punishment',
        point: 'The 110-year drought is nature’s immediate reaction to Sam’s racist murder.',
        evidence: 'Chapter 26: "God will punish you! ... Not one drop of rain would fall upon Green Lake."',
        explanation: 'The dried lakebed physically embodies the community’s withered spiritual integrity and unrepented guilt.',
        link: 'Demonstrates how historical injustice permanently warps the environment.'
      },
      {
        paragraph: 'Paragraph 3: Generational Retribution & The Walker Dynasty',
        point: 'Warden Louise Walker inherits Trout Walker’s obsessive greed and spiritual ruin.',
        evidence: 'Trout’s demand for Katherine’s loot passes down to his granddaughter, who forces modern inmates to continue the futile search.',
        explanation: 'Greed becomes a multi-generational disease that blinds the family to human empathy.',
        link: 'Illustrates that unaddressed historical crimes trap descendants in repetitive cycles of destruction until truth prevails.'
      }
    ]
  },
  {
    id: 'prompt_5',
    board: 'AQA / IB MYP',
    title: 'Interlocking Narrative Structure & Dramatic Irony',
    question: 'How does Louis Sachar’s non-linear narrative and interlocking storylines enhance the reader’s understanding of justice in *Holes*?',
    theme: 'Narrative Structure, Foreshadowing & Poetic Justice',
    thesisClauses: {
      contention: 'By weaving three distinct historical epochs into a single seamless puzzle,',
      methodology: 'Sachar deploys structural parallelism and dramatic irony to demonstrate that',
      resolution: 'justice in human affairs operates across generational horizons, resolving cosmic imbalances through seemingly coincidental events.'
    },
    outline: [
      {
        paragraph: 'Paragraph 1: The Triple-Narrative Tapestry',
        point: 'The tripartite structure (1880s Latvia, 1890s Green Lake, 1990s Camp) mirrors puzzle pieces snapping into place.',
        evidence: 'Alternating between Stanley’s daily ordeal and historical vignettes of Elya Yelnats and Kissin’ Kate Barlow.',
        explanation: 'The reader perceives the connections between objects (the lipstick tube, the Mary Lou wreck) long before Stanley does.',
        link: 'Heightens dramatic irony and invests every physical artifact with profound narrative weight.'
      },
      {
        paragraph: 'Paragraph 2: Symmetrical Echoes and Inversions',
        point: 'Sachar builds tight symmetrical parallels between ancestor and descendant.',
        evidence: 'Elya abandoning Madame Zeroni on the Latvian mountain is structurally inverted when Stanley carries Hector up God’s Thumb.',
        explanation: 'The moral failure of the ancestor is redeemed by the selfless courage of the descendant in identical circumstances.',
        link: 'Reinforces the concept of moral symmetry as the architecture of Sachar’s fictional universe.'
      },
      {
        paragraph: 'Paragraph 3: The Climax of Harmonic Convergence',
        point: 'All three storylines converge in the final confrontation in the lizard pit.',
        evidence: 'The suitcase inscribed "STANLEY YELNATS", stolen by Kate Barlow 110 years earlier, is lifted from the pit by Elya’s and Madame Zeroni’s great-great-grandsons.',
        explanation: 'Every plot strand is resolved simultaneously: the curse is lifted, the treasure returned, and rain falls on the dry lake.',
        link: 'Affirms that true literary justice is structural, moral, and absolute.'
      }
    ]
  }
];

const charactersGraphData = {
  nodes: [
    // Yelnats Line
    {
      id: 'elya_yelnats',
      name: 'Elya Yelnats',
      family: 'Yelnats',
      era: '1880s Latvia',
      role: 'The "No-Good-Dirty-Rotten-Pig-Stealing-Great-Great-Grandfather"',
      realIdentity: 'Elya Yelnats (Latvian youth)',
      quote: 'He remembered his promise to Madame Zeroni... he felt terrible about it.',
      symbolicRole: 'Ancestral debt, thoughtless romantic folly, and the origin of generational guilt.',
      examPoints: 'His broken vow triggers the 110-year family curse; structurally inverted by Stanley IV.',
      color: '#8b5cf6'
    },
    {
      id: 'sarah_miller',
      name: 'Sarah Miller',
      family: 'Yelnats',
      era: 'Late 1800s USA',
      role: 'Wife of Elya Yelnats',
      realIdentity: 'Sarah Miller Yelnats',
      quote: 'She could milk a cow, chop firewood, and had a mind like a steel trap.',
      symbolicRole: 'Practical wisdom and cultural adaptation.',
      examPoints: 'Translates Madame Zeroni’s pig lullaby into the American nursery song.',
      color: '#8b5cf6'
    },
    {
      id: 'stanley_yelnats_i',
      name: 'Stanley Yelnats I',
      family: 'Yelnats',
      era: '1890s Green Lake',
      role: 'First Stanley Yelnats (Wall Street Banker)',
      realIdentity: 'Stanley Yelnats I',
      quote: 'He found refuge on God’s Thumb after being robbed in the desert.',
      symbolicRole: 'The victim of Kissin’ Kate Barlow; original owner of the metal treasure suitcase.',
      examPoints: 'Survives in the desert by finding God’s Thumb; establishes the family motif of perseverance.',
      color: '#8b5cf6'
    },
    {
      id: 'stanley_yelnats_iii',
      name: 'Stanley Yelnats III',
      family: 'Yelnats',
      era: '1990s Modern',
      role: 'Stanley’s Father (Inventor)',
      realIdentity: 'Stanley Yelnats III',
      quote: 'I invented a product that eliminates foot odor!',
      symbolicRole: 'Optimism against hopeless odds; generational resilience.',
      examPoints: 'Invents "Sploosh" peach-onion foot spray the exact day Stanley breaks the family curse.',
      color: '#8b5cf6'
    },
    {
      id: 'stanley_yelnats_iv',
      name: 'Stanley Yelnats IV',
      family: 'Yelnats',
      era: '1990s Modern',
      role: 'Protagonist ("Caveman")',
      realIdentity: 'Stanley Yelnats IV',
      quote: 'Zero wasn’t a nobody. He was somebody.',
      symbolicRole: 'Moral maturation, active courage, selflessness, and the redeemer of family karma.',
      examPoints: 'Carries Zero up God’s Thumb, breaking the 110-year curse; finds his namesake suitcase.',
      color: '#8b5cf6'
    },

    // Zeroni Line
    {
      id: 'madame_zeroni',
      name: 'Madame Zeroni',
      family: 'Zeroni',
      era: '1880s Latvia',
      role: 'Elderly Egyptian/Latvian Wise Woman',
      realIdentity: 'Madame Zeroni',
      quote: 'If you forget, you and your family will be cursed for always and eternity!',
      symbolicRole: 'Cosmic justice, ancestral obligation, and retribution.',
      examPoints: 'Gives Elya the piglet and lullaby; demands the ascent up the mountain stream.',
      color: '#ec4899'
    },
    {
      id: 'hector_zeroni',
      name: 'Hector Zeroni ("Zero")',
      family: 'Zeroni',
      era: '1990s Modern',
      role: 'Camp Inmate ("Zero")',
      realIdentity: 'Hector Zeroni (Great-great-grandson of Madame Zeroni)',
      quote: 'I’m not stupid... I just don’t like answering their questions.',
      symbolicRole: 'Marginalized youth neglected by society; moral anchor of loyalty and raw intellectual grit.',
      examPoints: 'Steals Clyde’s shoes unwittingly; survives on Sploosh; carried up God’s Thumb by Stanley.',
      color: '#ec4899'
    },
    {
      id: 'hectors_mother',
      name: 'Hector’s Mother',
      family: 'Zeroni',
      era: '1990s Modern',
      role: 'Hector’s Missing Mother',
      realIdentity: 'Madame Zeroni’s descendant',
      quote: 'If only, if only... A mother holds her child in her arms.',
      symbolicRole: 'The emotional resolution of generational separation.',
      examPoints: 'Reunited with Zero through private investigators hired with his share of the treasure.',
      color: '#ec4899'
    },

    // Walker Line
    {
      id: 'trout_walker',
      name: 'Charles "Trout" Walker',
      family: 'Walker',
      era: '1880s–1890s Green Lake',
      role: 'Wealthy Entitled Town Bully',
      realIdentity: 'Charles Walker',
      quote: 'Nobody says no to Charles Walker!',
      symbolicRole: 'Racial privilege, entitlement, unearned wealth, and violent retribution.',
      examPoints: 'Lynches Sam; tortures Kate Barlow for her treasure; grandfather of Warden Louise Walker.',
      color: '#eab308'
    },
    {
      id: 'linda_miller',
      name: 'Linda Miller Walker',
      family: 'Walker',
      era: '1890s Green Lake',
      role: 'Trout’s Greedy Wife (Former Student)',
      realIdentity: 'Linda Miller',
      quote: 'Where’s the money, Kate? Tell us where you buried it!',
      symbolicRole: 'Greed corrupting childhood innocence.',
      examPoints: 'Assists Trout in torturing Kate; mother/ancestor of the Warden.',
      color: '#eab308'
    },
    {
      id: 'warden_walker',
      name: 'Warden Louise Walker',
      family: 'Walker',
      era: '1990s Modern',
      role: 'Warden of Camp Green Lake',
      realIdentity: 'Louise Walker (Granddaughter of Trout Walker)',
      quote: 'Excuse me? Did I ask you to come to my room?',
      symbolicRole: 'Authoritarian corruption, hereditary greed, and institutional exploitation.',
      examPoints: 'Uses juvenile inmates to dig up the lakebed for Kate Barlow’s buried suitcase.',
      color: '#eab308'
    },

    // Old Green Lake Community
    {
      id: 'katherine_barlow',
      name: 'Katherine Barlow ("Kissin’ Kate")',
      family: 'Barlow',
      era: '1888–1890s Green Lake',
      role: 'Schoolteacher turned Outlaw',
      realIdentity: 'Katherine Barlow',
      quote: 'Start digging... Nobody will ever find it.',
      symbolicRole: 'Innocence transformed into vengeful rage by racist violence; tragic anti-heroine.',
      examPoints: 'Robs Stanley I’s suitcase; leaves lipstick kiss on victims; dies laughing from lizard bite.',
      color: '#ef4444'
    },
    {
      id: 'sam_onion_man',
      name: 'Sam the Onion Man',
      family: 'Green Lake',
      era: '1888 Green Lake',
      role: 'Black Onion Seller & Healer',
      realIdentity: 'Sam',
      quote: 'I can fix that.',
      symbolicRole: 'Natural virtue, spiritual healing, craftsmanship, and tragic martyrdom under racism.',
      examPoints: 'Murdered for kissing Katherine; his death triggers the 110-year drought curse.',
      color: '#06b6d4'
    },

    // Camp Green Lake Staff & Boys
    {
      id: 'mr_sir',
      name: 'Mr. Sir',
      family: 'Camp Staff',
      era: '1990s Modern',
      role: 'Enforcer & Guard',
      realIdentity: 'Marion Sevillo',
      quote: 'You take a bad boy and make him dig a hole every day... it turns him into a good boy.',
      symbolicRole: 'Petty authoritarianism, nicotine withdrawal cruelty, and penal brutality.',
      examPoints: 'Slashed by Warden’s venomous nails; punishes Stanley by depriving him of water.',
      color: '#64748b'
    },
    {
      id: 'dr_pendanski',
      name: 'Dr. Pendanski ("Mom")',
      family: 'Camp Staff',
      era: '1990s Modern',
      role: 'Counselor for Tent D',
      realIdentity: 'Mr. Pendanski',
      quote: 'What do you want to do with your life, Zero? There’s nothing inside your head.',
      symbolicRole: 'Insidious psychological cruelty disguised as pseudo-caring counseling.',
      examPoints: 'Cruelly belittles Hector Zeroni until Zero smashes him in the face with a shovel.',
      color: '#64748b'
    },
    {
      id: 'x_ray',
      name: 'X-Ray (Rex)',
      family: 'Tent D Inmates',
      era: '1990s Modern',
      role: 'Leader of Tent D',
      realIdentity: 'Rex Washburn',
      quote: 'I’ve been here a year. You’ve been here two days. I get the day off.',
      symbolicRole: 'Informal prison yard hierarchy and inmate survival politics.',
      examPoints: 'Takes credit for the KB lipstick tube found by Stanley; misdirects the Warden’s dig.',
      color: '#3b82f6'
    }
  ],
  edges: [
    { from: 'madame_zeroni', to: 'elya_yelnats', label: 'Pig Oath & Mountain Ritual' },
    { from: 'elya_yelnats', to: 'madame_zeroni', label: 'Broken Promise & Curse' },
    { from: 'elya_yelnats', to: 'sarah_miller', label: 'Marriage in USA' },
    { from: 'sarah_miller', to: 'stanley_yelnats_i', label: 'Mother & Lullaby' },
    { from: 'stanley_yelnats_i', to: 'stanley_yelnats_iii', label: 'Grandfather / Namesake' },
    { from: 'stanley_yelnats_iii', to: 'stanley_yelnats_iv', label: 'Father & Son ("Sploosh")' },

    { from: 'madame_zeroni', to: 'hector_zeroni', label: '4 Generations of Lineage' },
    { from: 'hectors_mother', to: 'hector_zeroni', label: 'Mother & Son Reunion' },

    { from: 'stanley_yelnats_iv', to: 'hector_zeroni', label: 'Mutual Rescue on God’s Thumb (Curse Broken)' },

    { from: 'sam_onion_man', to: 'katherine_barlow', label: 'Tragic Love & Peaches' },
    { from: 'trout_walker', to: 'sam_onion_man', label: 'Racist Lynching & Murder' },
    { from: 'katherine_barlow', to: 'stanley_yelnats_i', label: 'Robbed Metal Suitcase in Desert' },
    { from: 'trout_walker', to: 'linda_miller', label: 'Marriage & Desperate Greed' },
    { from: 'katherine_barlow', to: 'trout_walker', label: 'Condemned to "Start Digging"' },

    { from: 'trout_walker', to: 'warden_walker', label: 'Grandfather & Granddaughter' },
    { from: 'warden_walker', to: 'stanley_yelnats_iv', label: 'Exploits for Digging' },
    { from: 'warden_walker', to: 'mr_sir', label: 'Slashes with Rattlesnake Venom' },
    { from: 'dr_pendanski', to: 'hector_zeroni', label: 'Mocks Illiteracy (Hit with Shovel)' },
    { from: 'x_ray', to: 'stanley_yelnats_iv', label: 'Takes Credit for KB Lipstick Tube' }
  ]
};

module.exports = {
  timelineStorylines,
  timelineEvents,
  convergenceNodesData,
  motifsData,
  iconicQuotesData,
  essayPromptsData,
  charactersGraphData
};
