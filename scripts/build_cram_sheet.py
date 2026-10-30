# -*- coding: utf-8 -*-
"""
Generate ultra-compact, high-yield Holes Exam Cram Sheet (printable HTML + MD + TXT)
Optimized for 5-minute pre-exam revision and 2-3 page printing.
"""
import os
import re

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(ROOT_DIR, "documents")
CLIENT_DIR = os.path.join(ROOT_DIR, "client")

def get_cram_content_md():
    return """# ⚡ Holes Exam Cram Sheet — Louis Sachar (Last-Minute Revision)

> **Quick 5-Minute Exam Revision Guide**: High-yield character matrix (physical appearance & personality traits), 6-bullet master plot summary, and 3-bullet summaries for every 5 chapters. Designed for instant recall and crisp printing.

---

## 1. Quick-Scan Character Sheet (Appearance & Character Traits)

| Character & Nickname | Physical Appearance ("Uiterlijk") | Personality Traits ("Karakter") | Crucial Exam Role & Motif |
| :--- | :--- | :--- | :--- |
| **Stanley Yelnats IV**<br>*(Caveman)* | **Start**: Overweight, clumsy, awkward, sweating heavily.<br>**End**: Lean, muscular, hardened skin, heavy leather calluses on hands. | Polite, gentle, passive victim $\rightarrow$ brave, self-sacrificing, loyal hero (*Bildungsroman*). | **Central Protagonist**. Palindrome name. Breaks 110-yr curse by carrying Zero up God's Thumb; unearths the buried chest. Motif: *Shovel, Onions, Palindrome*. |
| **Hector Zeroni**<br>*(Zero)* | Small, skinny, wiry, dark guarded watchful eyes, oversized ragged jumpsuit. Lightning-fast digging hands. | Stoic, silent as defense, fierce personal dignity, math genius, deeply loyal. | **Deuteragonist**. Madame Zeroni's heir. Stole Clyde's shoes; strikes Pendanski with shovel; survives on Sploosh. Motif: *Sploosh, Lullaby*. |
| **The Warden**<br>*(Louise Walker)* | Tall, leathery sun-damaged skin, red hair, cowboy boots. **Rattlesnake venom nail polish** (dark red). | Cold, calculating, ruthless, obsessive, tyrannical. Rules through fear. | **Primary Antagonist**. Trout Walker's granddaughter. Uses camp as private strip-mine for Kate's loot. Motif: *Venom Nails ("toxic while wet")*. |
| **Mr. Sir**<br>*(Marion Sevillo)* | Stetson hat, aviator shades, rattlesnake tattoo. Face scarred with 3 purple venom gashes. Chews sunflower seeds. | Sadistic, short-tempered, petty, vindictive. Hates his feminine first name Marion. | **Chief Guard**. Weaponizes water (pours Stanley's canteen into sand). Catchphrase: *"This ain't a Girl Scout camp!"* Motif: *Aviators, Spilled Water*. |
| **Dr. Pendanski**<br>*(Mom)* | Neatly trimmed beard, curly hair, friendly smile, clean khaki uniform. Sunburns easily. | Hypocritical, sociopathic bully. Hides malice behind counseling veneer. | **Tent D Counselor**. Systematically dehumanizes Zero; deletes Zero's state computer records to cover up his death. Motif: *Deleted Files*. |
| **Rex Washburn**<br>*(X-Ray)* | Small, scrawny, thick Coke-bottle dirty glasses, very poor eyesight. | Manipulative, charismatic, politically cunning alpha peer leader. | **Tent D Leader**. Pig Latin name (Rex). Demands findings from campers; claims gold KB tube to get a day off. Motif: *Glasses, Seniority*. |
| **Katherine Barlow**<br>*(Kissin' Kate)* | **1888**: Radiant blonde beauty, dresses.<br>**Outlaw**: Leather duster, gun belt, boots, **bold red lipstick**. | Gentle, idealistic schoolteacher $\rightarrow$ ruthless, vengeful outlaw after Sam's lynching. | **Legendary Bandit**. Kills corrupt sheriff; robs Stanley I; buries loot; dies laughing from lizard bite mocking Trout. Motif: *Red Lipstick, Spiced Peaches*. |
| **Sam the Onion Man** | Lean, handsome African-American, gentle eyes, strong work-worn hands, denim overalls. | Wise, calm, skilled herbal healer, deeply loving. Loved poetry. | **Tragic Martyr**. Murdered by Trout's racist mob for kissing Kate; his murder causes the 110-year drought. Catchphrase: *"I can fix that."* Motif: *Mary Lou, Sweet Onions*. |
| **Charles "Trout" Walker** | Heavy-set, wealthy heir, slick hair, loud clothes. Feet smell like decaying fish (fungus). | Entitled, arrogant, racist, violent; cannot handle rejection. | **Historical Antagonist**. Warden's grandfather. Leads mob that burns school & shoots Sam. Destitute after drought. Motif: *Rotting Fish Odor, Motorboat*. |
| **Madame Zeroni** | Elderly Egyptian-Latvian mystic with missing legs, sitting in a wooden cart. | Wise, blunt, prophetic, morally strict. Warns against empty minds. | **Ancestral Prophetess**. Hector's ancestor. Gives Elya the piglet & lullaby; places generational curse when oath is broken. Motif: *Mountain Stream, Lullaby*. |
| **Elya Yelnats** | Broad, naive 15-year-old Latvian farm boy. Simple peasant clothes. | Romantic, well-meaning, impulsive, forgetful. Despises shallow minds. | **Stanley's Ancestor**. Breaks sacred mountain promise to Madame Zeroni; flees to America; originates family curse. Motif: *Runt Piglet, Broken Promise*. |

### Quick-Hit Tent D Campers
* **Theodore ("Armpit")**: Huge, towering physical enforcer; deep voice; warns Stanley never to use his real name.
* **José ("Magnet")**: Nimble fingers, skilled shoplifter; steals Mr. Sir's sunflower seeds (Stanley takes blame).
* **Ricky ("Zigzag")**: Frizzy hair sticking out wildly, unhinged, violent; brutally attacks Stanley out of jealousy.
* **Alan ("Squid")**: Tough-talking mocker who secretly cries on his cot at night (*"Tell my mom I'm sorry"*).

---

## 2. Complete Novel Summary in 6 Bullets (Master Plot Arc)

1. **The Setup & The Arrest**: Innocent Stanley Yelnats IV is convicted of stealing baseball MVP Clyde Livingston's sneakers (which fell from an overpass) and sent to Camp Green Lake—a dried-up Texas lakebed where boys must dig daily 5x5ft holes to "build character."
2. **The Secret Treasure Hunt**: Stanley finds a gold lipstick tube marked **"KB"** (Kissin' Kate Barlow). The Warden arrives and forces the boys to dig in concentrated grids, revealing the camp is an illegal search for Kate Barlow's buried 1888 loot.
3. **The Literacy Deal & Rebellion**: Stanley teaches Zero to read while Zero digs part of Stanley's hole. Tensions boil in Tent D; counselor Pendanski bullies Zero, telling him he has no brain; Zero strikes Pendanski across the face with a shovel and flees into the waterless desert.
4. **God's Thumb & Breaking the Curse**: Camp officials erase Zero's records. Stanley escapes to save him, finds Zero sheltering under Sam's boat *Mary Lou* eating 110-year-old spiced peaches (**Sploosh**). Stanley carries the collapsed Zero up **God's Thumb**, finds freshwater and wild onions, and sings the lullaby—**unknowingly fulfilling Elya's 110-year oath and breaking the curse!**
5. **The Final Dig & The Lizard Pit**: Zero confesses he stole Clyde's shoes. The boys sneak back to camp at night, unearth the buried metal suitcase, but are ambushed by the Warden, Mr. Sir, and Pendanski. A nest of deadly **yellow-spotted lizards** covers the boys, but the lizards refuse to bite because the boys have onion blood!
6. **Justice & Resolution**: Stanley's lawyer Ms. Morengo proves his alibi; the suitcase has **"STANLEY YELNATS"** etched on the lid (stolen from Stanley I); the camp is shut down; the 110-year drought ends as rain pours over Green Lake; both boys split \$1M; Stanley's dad invents "Sploosh" foot spray.

---

## 3. Grouped 5-Chapter Summaries (10 Quick Revision Blocks)

### 📌 Chapters 1 – 5: Arrival & The 5-Foot Shovel
* **Plot**: Stanley arrives at Camp Green Lake (scorching desert, no lake, 95°F heat, lethal yellow-spotted lizards). Meets Mr. Sir (*"This ain't a Girl Scout camp!"*) and counselor Dr. Pendanski ("Mom").
* **Key Event**: Stanley assigned to Tent D; given his 5-foot shovel; told he must dig a 5x5ft hole daily. Inherits Barf Bag's cot. Pendanski claims Zero has nothing inside his head.
* **Exam Quote**: *"There is no lake at Camp Green Lake."*

### 📌 Chapters 6 – 10: Sneakers & The Latvian Curse
* **Plot**: Flashback to trial: Clyde Livingston's sneakers fell from an overpass onto Stanley's head. Stanley digs his agonizing first hole (hands shredded with blisters).
* **Key Event**: Parallel flashback to 1880s Latvia: Elya Yelnats carries Madame Zeroni's piglet up the mountain to win Myra Menke, but forgets to carry Madame Zeroni, causing the family curse. Stanley stands up to a bully and is christened **"Caveman."**
* **Exam Quote**: *"If only, if only, the woodpecker sighs..."*

### 📌 Chapters 11 – 15: The KB Gold Tube & The Warden Appears
* **Plot**: X-Ray tells Stanley to give him anything interesting. Stanley finds a fish fossil (rejected by counselors).
* **Key Event**: Stanley finds a gold lipstick tube engraved with **"KB"** inside a heart. Gives it to X-Ray so X-Ray gets a rest day. The Warden (Louise Walker) arrives in her truck and immediately orders circular grid excavations.
* **Exam Fact**: Proves the camp is not for rehabilitation; the Warden is hunting Kate Barlow's treasure.

### 📌 Chapters 16 – 20: Rattlesnake Venom & Scarred Mr. Sir
* **Plot**: Warden grows frustrated finding nothing. Zero reveals he cannot read and asks Stanley for lessons (Stanley initially refuses).
* **Key Event**: Magnet steals Mr. Sir's sunflower seeds; bag spills in Stanley's hole; Stanley takes the blame. In the cabin, the Warden slashes Mr. Sir's face with her **rattlesnake venom nail polish** (*"It's only toxic while it's wet"*).
* **Exam Fact**: Exposes the camp's lawless, sadistic reality; Stanley realizes how dangerous the Warden is.

### 📌 Chapters 21 – 25: The Literacy Deal & Green Lake 1888
* **Plot**: Zero digs half of Stanley's hole out of gratitude. Stanley agrees to tutor Zero in reading; discovers Zero is a math genius. Mr. Sir takes revenge by pouring Stanley's water into the dirt.
* **Key Event**: Flashback to 1888: Green Lake is a flourishing paradise. Schoolteacher Katherine Barlow makes famous spiced peaches. Rejects wealthy Trout Walker and falls in love with Sam the Onion Man (*"I can fix that"*). They kiss in public.
* **Exam Fact**: Contrasts the healing racial harmony of Katherine & Sam with modern camp corruption.

### 📌 Chapters 26 – 30: Sam's Lynching & Zero's Shovel Strike
* **Plot**: Trout Walker leads a racist mob that burns the schoolhouse. Sheriff refuses to help. Sam is shot dead on the lake; his donkey Mary Lou is killed. **Rain stops falling (110-year drought begins)**.
* **Key Event**: Katherine becomes outlaw **Kissin' Kate Barlow**. 20 years later, Trout tortures her for gold; she dies laughing from a lizard bite. In modern camp, Tent D attacks Stanley out of jealousy; Pendanski spits on Zero and tells him to spell "dig"; **Zero hits Pendanski with a shovel and flees into the desert**.
* **Exam Quote**: *"You and your children can dig for a hundred years and you will never find it!"* — Kate Barlow

### 📌 Chapters 31 – 35: The Desert Trek & Finding Sploosh
* **Plot**: Warden and Pendanski erase Zero's computerized records to hide his death from state inspectors.
* **Key Event**: Stanley steals the water truck to save Zero, crashes it into a hole, and runs into the desert with an empty canteen. Finds Zero sheltering under the overturned *Mary Lou*, surviving on 110-year-old spiced peaches called **"Sploosh."**
* **Exam Fact**: Shows Stanley's complete transformation into an active, courageous hero.

### 📌 Chapters 36 – 40: Climbing God's Thumb & Breaking the Curse
* **Plot**: Zero has severe stomach cramps from old peaches. Boys hike toward the fist-shaped mountain: **"God's Thumb."**
* **Key Event**: Zero collapses vomiting blood. Stanley lifts Zero onto his shoulders and carries him up the sheer cliff face. At the summit, Stanley finds a freshwater spring and wild sweet onions. He feeds Zero and sings the lullaby.
* **Exam Turning Point**: **The curse is broken!** Stanley carried Madame Zeroni's heir up the mountain, gave him water, and sang the song.

### 📌 Chapters 41 – 45: Confession & The Lizard Pit Trap
* **Plot**: Zero confesses: he stole Clyde Livingston's sneakers from the shelter because he was homeless and needed shoes; threw them off the overpass when police came. Stanley forgives him completely.
* **Key Event**: Boys sneak back into camp at 2 AM to dig where the KB tube was found. Uncover a heavy metal suitcase. Suddenly, the Warden, Mr. Sir, and Pendanski surround them with flashlights, but deadly **yellow-spotted lizards** cover the boys. Lizards don't bite because of onion blood!
* **Exam Quote**: *"We just have to wait until the lizards finish with them."* — The Warden

### 📌 Chapters 46 – 50: Exoneration, The Buried Name & The Rain
* **Plot**: Dawn standoff: Stanley's lawyer Ms. Morengo and the Attorney General arrive with a court order (Derrick Dunne confessed, proving Stanley's alibi). Stanley climbs out of the pit unharmed.
* **Key Event**: The Warden tries to claim the suitcase, but Zero reads the inscription: **STANLEY YELNATS** (stolen from Stanley I in 1888). Because camp erased Zero's records, the state has no right to hold him; both boys leave free.
* **Resolution**: Rain falls on Green Lake for the first time in 110 years. Boys split \$1M (~$500k each). Stanley's dad invents peach-onion foot spray "Sploosh." Zero reunites with his mother, who sings the final lullaby verse.

---

### 💡 4 Exam Golden Rules to Remember:
1. **The Palindrome**: S-T-A-N-L-E-Y = Y-E-L-N-A-T-S. Represents cyclical fate, recurring history, and karmic closure.
2. **The Curse Formula**: Carried the piglet $\rightarrow$ Drink water $\rightarrow$ Sing song. Stanley does all 3 for Zero on God's Thumb!
3. **Lizard Protection**: Lizards hate onion blood. Eating Sam's onions saved Stanley and Zero's lives.
4. **Irony of "Building Character"**: The camp's slogan is a lie for forced labor, but ironically, Stanley *does* build genuine moral character by enduring it and saving Zero.
"""

def generate_compact_html(md_content):
    import html
    lines = md_content.split('\n')
    html_lines = []
    in_table = False
    
    for line in lines:
        stripped = line.strip()
        
        # Table handling
        if stripped.startswith('|') and stripped.endswith('|'):
            cells = [c.strip() for c in stripped.split('|')[1:-1]]
            if re.match(r'^[|\s:-]+$', stripped):
                continue
            if not in_table:
                html_lines.append('<div class="table-container"><table class="print-table">')
                html_lines.append('<thead><tr>' + ''.join(f'<th>{html.escape(c)}</th>' for c in cells) + '</tr></thead><tbody>')
                in_table = True
            else:
                html_lines.append('<tr>' + ''.join(f'<td>{c}</td>' for c in cells) + '</tr>')
            continue
        elif in_table:
            html_lines.append('</tbody></table></div>')
            in_table = False
            
        if stripped.startswith('# '):
            html_lines.append(f'<h1 class="doc-h1">{html.escape(stripped[2:])}</h1>')
        elif stripped.startswith('## '):
            html_lines.append(f'<h2 class="doc-h2">{html.escape(stripped[3:])}</h2>')
        elif stripped.startswith('### '):
            html_lines.append(f'<h3 class="doc-h3">{html.escape(stripped[4:])}</h3>')
        elif stripped.startswith('#### '):
            html_lines.append(f'<h4 class="doc-h4">{html.escape(stripped[5:])}</h4>')
        elif stripped.startswith('> '):
            html_lines.append(f'<div class="cram-callout">{html.escape(stripped[2:])}</div>')
        elif stripped.startswith('* ') or stripped.startswith('- '):
            item = stripped[2:]
            item = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', item)
            item = re.sub(r'\*(.*?)\*', r'<em>\1</em>', item)
            html_lines.append(f'<li class="cram-li">{item}</li>')
        elif stripped.startswith('---'):
            html_lines.append('<hr class="cram-hr"/>')
        elif stripped == '':
            continue
        else:
            text = stripped
            text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
            text = re.sub(r'\*(.*?)\*', r'<em>\1</em>', text)
            html_lines.append(f'<p class="cram-p">{text}</p>')
            
    if in_table:
        html_lines.append('</tbody></table></div>')
        
    body_html = '\n'.join(html_lines)
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>⚡ Holes Exam Cram Sheet — Louis Sachar (5-Min Revision)</title>
  <style>
    :root {{
      --primary: #0f172a;
      --accent: #b45309;
      --accent-bg: #fef3c7;
      --border: #cbd5e1;
      --text: #1e293b;
      --bg: #ffffff;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.45;
      color: var(--text);
      background-color: #f1f5f9;
      padding: 16px 0;
    }}
    .top-bar {{
      position: sticky;
      top: 0;
      z-index: 1000;
      background: #1e293b;
      color: #fff;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }}
    .top-bar h2 {{ font-size: 1rem; font-weight: 700; }}
    .btn {{
      padding: 6px 14px;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      text-decoration: none;
    }}
    .btn-print {{ background: #f59e0b; color: #0f172a; }}
    .btn-back {{ background: #334155; color: #fff; margin-right: 8px; }}
    .cram-container {{
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px;
      border-radius: 8px;
      border: 1px solid var(--border);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }}
    .doc-h1 {{
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--primary);
      border-bottom: 3px solid #f59e0b;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }}
    .doc-h2 {{
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin-top: 24px;
      margin-bottom: 10px;
      border-bottom: 2px solid var(--border);
      padding-bottom: 4px;
      page-break-after: avoid;
    }}
    .doc-h3 {{
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--accent);
      margin-top: 14px;
      margin-bottom: 4px;
      page-break-after: avoid;
    }}
    .doc-h4 {{
      font-size: 0.95rem;
      font-weight: 600;
      color: #334155;
      margin-top: 10px;
      margin-bottom: 4px;
    }}
    .cram-callout {{
      background: var(--accent-bg);
      border-left: 4px solid var(--accent);
      padding: 8px 12px;
      margin: 10px 0 16px 0;
      font-size: 0.9rem;
      color: #78350f;
      border-radius: 0 4px 4px 0;
    }}
    .cram-p {{ font-size: 0.9rem; margin-bottom: 6px; }}
    .cram-li {{ font-size: 0.88rem; margin-left: 20px; margin-bottom: 4px; }}
    .cram-hr {{ border: 0; height: 1px; background: var(--border); margin: 16px 0; }}
    .table-container {{ overflow-x: auto; margin: 12px 0 20px 0; }}
    .print-table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
      text-align: left;
    }}
    .print-table th {{
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      padding: 8px 10px;
      border: 1px solid var(--border);
    }}
    .print-table td {{
      padding: 6px 10px;
      border: 1px solid var(--border);
      vertical-align: top;
      color: #334155;
    }}
    .print-table tr:nth-child(even) {{ background: #f8fafc; }}
    @media print {{
      body {{ background: #fff !important; padding: 0 !important; font-size: 9pt; }}
      .top-bar {{ display: none !important; }}
      .cram-container {{ max-width: 100% !important; margin: 0 !important; padding: 0 !important; border: none !important; box-shadow: none !important; }}
      .doc-h1 {{ font-size: 15pt !important; }}
      .doc-h2 {{ font-size: 12pt !important; page-break-before: auto; margin-top: 14pt; }}
      .doc-h3 {{ font-size: 10pt !important; page-break-after: avoid; }}
      .print-table {{ font-size: 7.5pt !important; }}
      .cram-li, .cram-p {{ font-size: 8.5pt !important; }}
      @page {{ margin: 1cm; }}
    }}
  </style>
</head>
<body>
  <div class="top-bar">
    <h2>⚡ Holes Exam Cram Sheet (Louis Sachar)</h2>
    <div>
      <a href="index.html" class="btn btn-back">◀ Back to App</a>
      <button onclick="window.print()" class="btn btn-print">🖨️ Print / Save as PDF</button>
    </div>
  </div>
  <main class="cram-container">
    {body_html}
  </main>
</body>
</html>"""

def main():
    print("[1/3] Generating compact markdown...")
    md_text = get_cram_content_md()
    
    # Text version
    txt_text = re.sub(r'#+\s+', '', md_text)
    txt_text = re.sub(r'\*\*(.*?)\*\*', r'\1', txt_text)
    txt_text = re.sub(r'\*(.*?)\*', r'\1', txt_text)
    
    md_path = os.path.join(DOCS_DIR, "10_Printable_Character_Sheets_and_Master_Summaries.md")
    txt_path = os.path.join(DOCS_DIR, "10_Printable_Character_Sheets_and_Master_Summaries.txt")
    html_path = os.path.join(CLIENT_DIR, "printable_study_sheet.html")
    
    print("[2/3] Writing Markdown & TXT files...")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md_text)
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(txt_text)
        
    print("[3/3] Generating compact HTML...")
    html_content = generate_compact_html(md_text)
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    print(f"[DONE] Cram Sheet successfully built: {html_path} ({len(html_content)} bytes)")

if __name__ == "__main__":
    main()
