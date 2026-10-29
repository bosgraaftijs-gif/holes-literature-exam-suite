import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(ROOT, 'documents')

# 1. Fix Mojibake mapping
MOJIBAKE_MAP = {
    'be?nvloeden': 'beïnvloeden',
    'parano?de': 'paranoïde',
    'fa?ade': 'façade',
    'getatoe?erde': 'getatoeëerde',
    'carri?re': 'carrière',
    'cre?ert': 'creëert',
    'hi?rarchie': 'hiërarchie',
    'Jos?': 'José',
    'ge?lektrocuteerd': 'geëlektrocuteerd',
    'Californi?': 'Californië',
    'offici?le': 'officiële',
    '??n': 'één',
    'Stanley?s': "Stanley's",
    'don?t': "don't",
    'can?t': "can't",
    'I?m': "I'm",
    'it?s': "it's",
    'Zero?s': "Zero's",
    'Sam?s': "Sam's",
    'Kate?s': "Kate's",
    'Walker?s': "Walker's",
    'Madame Zeroni?s': "Madame Zeroni's",
    'lizard?s': "lizard's",
    'who?s': "who's",
    'that?s': "that's",
    'there?s': "there's",
    'what?s': "what's",
    'he?d': "he'd",
    'she?d': "she'd",
    'didn?t': "didn't",
    'wasn?t': "wasn't",
    'couldn?t': "couldn't",
    'wouldn?t': "wouldn't",
    'You?ll': "You'll",
    'you?ll': "you'll",
    'You?re': "You're",
    'you?re': "you're",
    'It?s': "It's"
}

# 2. Fix Image links to use real character portraits
PORTRAIT_REPLACEMENTS = {
    'assets/the_warden.jpg': 'assets/the_warden_louise_walker.jpg',
    'assets/mr_sir.jpg': 'assets/mr_sir_marion_sevillo.jpg',
    'assets/charles_trout_walker.jpg': 'assets/charles_trout_walker.jpg',
    'assets/trout_walker.jpg': 'assets/charles_trout_walker.jpg',
    'assets/kate_barlow.jpg': 'assets/kissin_kate_barlow.jpg',
    'assets/madame_zeroni.jpg': 'assets/madame_zeroni.webp',
    'assets/mr_pendanski.jpg': 'assets/dr_pendanski.jpg',
    'assets/linda_miller_young.jpg': 'assets/linda_walker_box.png',
    'assets/stanley_yelnats.jpg': 'assets/stanley_character_box.png',
    'assets/hector_zeroni_zero.jpg': 'assets/hector_zeroni_zero.png',
    'assets/sam_the_onion_man.jpg': 'assets/sam_box.png'
}

files_to_clean = [
    'holes_characters_complete_guide.md',
    'holes_characters_complete_guide.txt',
    'slideshare_holes_characters_transcript.md',
    'slideshare_holes_characters_transcript.txt',
    'notebooklm_qa_quiz_dataset.md',
    'notebooklm_qa_quiz_dataset.txt'
]

for filename in files_to_clean:
    filepath = os.path.join(DOCS_DIR, filename)
    if not os.path.exists(filepath):
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace mojibake words
    for bad, good in MOJIBAKE_MAP.items():
        content = content.replace(bad, good)

    # Replace em-dashes where appropriate: ' ? ' -> ' — '
    content = re.sub(r' \? ', ' — ', content)

    # Replace portrait links
    for old_img, new_img in PORTRAIT_REPLACEMENTS.items():
        content = content.replace(old_img, new_img)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Fixed encoding and portraits in: {filename}")

# Also ensure Lewis / Barf Bag is mentioned in Tent D in holes_characters_complete_guide.md
guide_md_path = os.path.join(DOCS_DIR, 'holes_characters_complete_guide.md')
if os.path.exists(guide_md_path):
    with open(guide_md_path, 'r', encoding='utf-8') as f:
        guide_text = f.read()
    
    if 'Lewis' not in guide_text and 'Barf Bag' not in guide_text:
        barf_bag_section = """
### 2.19 Lewis ("Barf Bag")
![Lewis Barf Bag](assets/barfbag_lewis.jpg)
* **Volledige naam:** Lewis ("Barf Bag")
* **Kamprol:** Voormalig bewoner van Bed 4 in Tent D (het bed waar Stanley IV in slaapt).
* **Betekenis:** Liet zich opzettelijk in zijn blote voet bijten door een ratelslang om aan de gruwelijke werkomstandigheden van Camp Green Lake te ontsnappen en naar het ziekenhuis gebracht te worden. Zijn vertrek creëerde de lege plek waardoor Stanley in Tent D geplaatst werd.
"""
        guide_text = guide_text.replace('## 3. ', barf_bag_section + '\n## 3. ')
        with open(guide_md_path, 'w', encoding='utf-8') as f:
            f.write(guide_text)
        
        # update txt too
        txt_content = re.sub(r'!\[.*?\]\(.*?\)', '', guide_text)
        txt_content = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', txt_content)
        txt_content = re.sub(r'^#+\s*', '', txt_content, flags=re.MULTILINE).strip() + '\n'
        with open(os.path.join(DOCS_DIR, 'holes_characters_complete_guide.txt'), 'w', encoding='utf-8') as f:
            f.write(txt_content)
        print("Added Barf Bag to holes_characters_complete_guide (.md and .txt)")

print("All characters and encoding cleaned up successfully!")
