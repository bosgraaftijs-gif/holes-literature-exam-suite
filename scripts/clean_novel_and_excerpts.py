import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(ROOT, 'documents')
NOVEL_MD_PATH = os.path.join(DOCS_DIR, 'Holes_Full_Novel_Louis_Sachar.md')

with open(NOVEL_MD_PATH, 'r', encoding='utf-8') as f:
    full_text = f.read()

# 1. Segregate into Novel, Fuzzy Mud, and Small Steps
# End of novel is around line 4856: '#### **You’ll want to read more!**' or '#### **You\ufffdll want to read more!**'
split_match = re.search(r'(\n#### \*\*You[’\']ll want to read more!\*\*[\s\S]*)', full_text)
if not split_match:
    # Try with replacement or fallback
    split_match = re.search(r'(\n#### \*\*You.*?want to read more!\*\*[\s\S]*)', full_text)

assert split_match, "Could not find split point for back matter"

novel_raw = full_text[:split_match.start()]
back_matter = full_text[split_match.start():]

# Find Fuzzy Mud and Small Steps within back matter
# Fuzzy Mud starts around '## **Read an excerpt from FUZZY MUD**'
fuzzy_start = re.search(r'## \*\*Read an excerpt from FUZZY MUD\*\*', back_matter)
small_start = re.search(r'##? \*\*Read an excerpt from SMALL STEPS\*\*', back_matter)
if not small_start:
    small_start = re.search(r'\*\*Read an excerpt from SMALL STEPS\*\*', back_matter)

assert fuzzy_start and small_start, "Could not find Fuzzy Mud or Small Steps headers"

fuzzy_mud_text = back_matter[fuzzy_start.start():small_start.start()].strip()
small_steps_text = back_matter[small_start.start():].strip()

# Clean Fuzzy Mud and Small Steps
def clean_excerpt(text, title, cover_filename):
    text = re.sub(r'<!-- Start of picture text -->[\s\S]*?<!-- End of picture text -->', '', text)
    text = re.sub(r'<br\s*/?>', ' ', text)
    text = re.sub(r' +', ' ', text)
    md = f"# {title} — Excerpt\n**By Louis Sachar**\n\n![{title} Cover](assets/{cover_filename})\n\n---\n\n{text}\n"
    txt = re.sub(r'!\[.*?\]\(.*?\)', '', md)
    txt = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', txt)
    txt = re.sub(r'^#+\s*', '', txt, flags=re.MULTILINE).strip()
    return md, txt

fuzzy_md, fuzzy_txt = clean_excerpt(fuzzy_mud_text, "Fuzzy Mud", "fuzzy_mud_cover.jpg")
small_md, small_txt = clean_excerpt(small_steps_text, "Small Steps", "small_steps_cover.jpg")

with open(os.path.join(DOCS_DIR, 'Fuzzy_Mud_Excerpt.md'), 'w', encoding='utf-8') as f:
    f.write(fuzzy_md)
with open(os.path.join(DOCS_DIR, 'Fuzzy_Mud_Excerpt.txt'), 'w', encoding='utf-8') as f:
    f.write(fuzzy_txt)
with open(os.path.join(DOCS_DIR, 'Small_Steps_Excerpt.md'), 'w', encoding='utf-8') as f:
    f.write(small_md)
with open(os.path.join(DOCS_DIR, 'Small_Steps_Excerpt.txt'), 'w', encoding='utf-8') as f:
    f.write(small_txt)

print("Saved Fuzzy_Mud_Excerpt and Small_Steps_Excerpt (.md and .txt)")

# 2. Clean Novel text
novel = novel_raw

# Fix TOC in front matter if it mentions excerpts
novel = re.sub(r'_Excerpt from_ Fuzzy Mud _Excerpt from_ Small Steps _About the Author_', '', novel)

# Fix Zero's diagram in Chapter 42
zero_diag_pattern = re.compile(
    r'(Zero drew a diagram in the dirt\.)\s*<!-- Start of picture text -->\s*a\s*\|\s*><br><!-- End of picture text -->',
    re.IGNORECASE
)
if zero_diag_pattern.search(novel):
    novel = zero_diag_pattern.sub(
        r"\1\n\n![Zero's Navigation Diagram](assets/zero_diagram.svg)\n",
        novel
    )
else:
    # generic fallback for chapter 42 diagram
    novel = re.sub(
        r'<!-- Start of picture text -->\s*a\s*\|\s*><br><!-- End of picture text -->',
        "![Zero's Navigation Diagram](assets/zero_diagram.svg)",
        novel
    )

# Remove remaining picture comments & br tags
novel = re.sub(r'<!-- Start of picture text -->[\s\S]*?<!-- End of picture text -->', '', novel)
novel = re.sub(r'<br\s*/?>', ' ', novel)

# Fix the 4 stray headers
novel = re.sub(r'He threw Stanley to the\s*\n\s*#### ground\.', 'He threw Stanley to the ground.', novel)
novel = re.sub(r'that he had\s*\n\s*#### dug his first hole\.', 'that he had dug his first hole.', novel)
novel = re.sub(r'#### Stanley picked up his shovel\.', 'Stanley picked up his shovel.', novel)
novel = re.sub(r'He flung open the door to the truck and\s*\n\s*#### climbed quickly inside\.', 'He flung open the door to the truck and climbed quickly inside.', novel)

# Fix specific broken tokens
novel = re.sub(r'“Good\.\s*F\s*–\s*u\s*–\s*n\.”\s*“F-un\.”', '“Good. F – u – n.” “Fffun.”', novel)
novel = re.sub(r'X-\s*\n+\s*Ray', 'X-Ray', novel)
novel = re.sub(r'X-\s+Ray', 'X-Ray', novel)
novel = re.sub(r'Mar-ya Luh-oh-\s*\n+\s*oo', 'Mar-ya Luh-oh-oo', novel)

# Fix broken paragraph continuations:
# Where a paragraph ends with no terminal punctuation and the next line begins with a lowercase letter
def rejoin_broken_lines(text):
    paragraphs = re.split(r'\n\s*\n', text)
    cleaned = []
    for p in paragraphs:
        p_clean = p.strip()
        if not p_clean:
            continue
        if cleaned:
            prev = cleaned[-1]
            # Check if this paragraph is a continuation of the previous one
            # Continuation indicator: prev does not end with terminal punctuation and p_clean starts with lowercase or continuation word
            starts_lower = bool(re.match(r'^[a-zà-ÿ]', p_clean))
            prev_ends_incomplete = bool(re.search(r'[a-zA-Z0-9,;:\-\'\"\u201c\u2018]$', prev)) and not bool(re.search(r'[.!?][\"\u201d\u2019]?$', prev))
            
            # Avoid rejoining headers or list items or images
            is_special = p_clean.startswith('#') or p_clean.startswith('!') or p_clean.startswith('-') or p_clean.startswith('*') or prev.startswith('#')

            if starts_lower and not is_special:
                cleaned[-1] = prev + ' ' + p_clean
                continue
            elif prev_ends_incomplete and not is_special and (prev.endswith('-') or prev.endswith(',')):
                cleaned[-1] = prev + ' ' + p_clean
                continue

        cleaned.append(p_clean)
    return '\n\n'.join(cleaned)

novel_clean = rejoin_broken_lines(novel)

# Ensure proper trailing newline
novel_clean = novel_clean.strip() + '\n'

# Generate plain text version
txt_content = re.sub(r'!\[.*?\]\(.*?\)', '', novel_clean)
txt_content = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', txt_content)
txt_content = re.sub(r'^#+\s*', '', txt_content, flags=re.MULTILINE).strip() + '\n'

with open(NOVEL_MD_PATH, 'w', encoding='utf-8') as f:
    f.write(novel_clean)

with open(os.path.join(DOCS_DIR, 'Holes_Full_Novel_Louis_Sachar.txt'), 'w', encoding='utf-8') as f:
    f.write(txt_content)

print(f"Novel cleaned successfully!")
print(f"MD length: {len(novel_clean)} chars | TXT length: {len(txt_content)} chars")
