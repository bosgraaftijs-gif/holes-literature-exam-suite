import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

SOURCE_PATH = r'c:\Users\tijsb\Downloads\D77290D63AB857DB03EA8A5C4EE9AA03.md'
TARGET_MD = r'c:\Users\tijsb\Documents\antigravity\bold-kepler\documents\Holes_Full_Novel_Louis_Sachar.md'
TARGET_TXT = r'c:\Users\tijsb\Documents\antigravity\bold-kepler\documents\Holes_Full_Novel_Louis_Sachar.txt'

with open(SOURCE_PATH, 'r', encoding='utf-8') as f:
    text = f.read()

u = '\ufffd'

# Exact mapping
REPLACEMENTS = {
    'Cli' + u: 'Cliff',
    'Di' + u + 'erent': 'Different',
    'E' + u: 'Eff',
    'F' + u + 'un': 'F-un',
    'Ja' + u + 'y': 'Jaffy',
    'O' + u: 'Off',
    'Re' + u + 'ecting': 'Reflecting',
    're' + u + 'ecting': 'reflecting',
    're' + u + 'ected': 'reflected',
    'a' + u + 'ict': 'afflict',
    'a' + u + 'ord': 'afford',
    'brie' + u + 'y': 'briefly',
    'certi' + u + 'cates': 'certificates',
    'cli' + u: 'cliff',
    'cli' + u + 's': 'cliffs',
    'con' + u + 'dential': 'confidential',
    'con' + u + 'ned': 'confined',
    'co' + u + 'ee': 'coffee',
    'de' + u + 'ance': 'defiance',
    'de' + u + 'nitely': 'definitely',
    'di' + u + 'cult': 'difficult',
    'di' + u + 'culty': 'difficulty',
    'di' + u + 'erence': 'difference',
    'di' + u + 'erent': 'different',
    'di' + u + 'erently': 'differently',
    'e' + u + 'ect': 'effect',
    'e' + u + 'ects': 'effects',
    'e' + u + 'ort': 'effort',
    'e' + u + 'orts': 'efforts',
    'forty' + u + 'fth': 'forty-fifth',
    'gira' + u + 'e': 'giraffe',
    'gru' + u: 'gruff',
    'handcu' + u: 'handcuff',
    'handcu' + u + 'ed': 'handcuffed',
    'handcu' + u + 's': 'handcuffs',
    'inde' + u + 'nitely': 'indefinitely',
    'justi' + u + 'cation': 'justification',
    'ninety-' + u + 've': 'ninety-five',
    'overstu' + u + 'ed': 'overstuffed',
    'o' + u: 'off',
    'o' + u + 'ce': 'office',
    'o' + u + 'cer': 'officer',
    'o' + u + 'cially': 'officially',
    'o' + u + 'ense': 'offense',
    'o' + u + 'er': 'offer',
    'o' + u + 'ered': 'offered',
    'o' + u + 'ering': 'offering',
    'pu' + u + 'y': 'puffy',
    're' + u + 'll': 'refill',
    'ri' + u + 'e': 'rifle',
    'self-con' + u + 'dence': 'self-confidence',
    'sheri' + u: 'sheriff',
    'sni' + u + 'ed': 'sniffed',
    'star-' + u + 'lled': 'star-filled',
    'sti' + u + 'ing': 'stifling',
    'stu' + u: 'stuff',
    'stu' + u + 'ed': 'stuffed',
    'stu' + u + 'ng': 'stuffing',
    'sun' + u + 'ower': 'sunflower',
    'su' + u + 'ering': 'suffering',
    'terri' + u + 'ed': 'terrified',
    'testi' + u + 'ed': 'testified',
    'understu' + u + 'ed': 'understuffed',
    u + 'aked': 'flaked',
    u + 'akes': 'flakes',
    u + 'ap': 'flap',
    u + 'ash': 'flash',
    u + 'ashed': 'flashed',
    u + 'ashing': 'flashing',
    u + 'ashlight': 'flashlight',
    u + 'ashlights': 'flashlights',
    u + 'at': 'flat',
    u + 'attened': 'flattened',
    u + 'avor': 'flavor',
    u + 'ction': 'fiction',
    u + 'ctitiously': 'fictitiously',
    u + 'dgeted': 'fidgeted',
    u + 'dgeting': 'fidgeting',
    u + 'ecks': 'flecks',
    u + 'eld': 'field',
    u + 'elds': 'fields',
    u + 'ery': 'fiery',
    u + 'esh': 'flesh',
    u + 'eshy': 'fleshy',
    u + 'fteen': 'fifteen',
    u + 'fteen-year-old': 'fifteen-year-old',
    u + 'fteenth': 'fifteenth',
    u + 'fth': 'fifth',
    u + 'fth-grade': 'fifth-grade',
    u + 'fty': 'fifty',
    u + 'fty-foot': 'fifty-foot',
    u + 'fty-four': 'fifty-four',
    u + 'fty-seven': 'fifty-seven',
    u + 'fty-two': 'fifty-two',
    u + 'ght': 'fight',
    u + 'gure': 'figure',
    u + 'gured': 'figured',
    u + 'ies': 'flies',
    u + 'ight': 'flight',
    u + 'inch': 'flinch',
    u + 'le': 'file',
    u + 'les': 'files',
    u + 'ling': 'filing',
    u + 'll': 'fill',
    u + 'lled': 'filled',
    u + 'lling': 'filling',
    u + 'lter': 'filter',
    u + 'nal': 'final',
    u + 'nally': 'finally',
    u + 'nd': 'find',
    u + 'nds': 'finds',
    u + 'ne': 'fine',
    u + 'nest': 'finest',
    u + 'nger': 'finger',
    u + 'ngernails': 'fingernails',
    u + 'ngers': 'fingers',
    u + 'nish': 'finish',
    u + 'nished': 'finished',
    u + 'oated': 'floated',
    u + 'oor': 'floor',
    u + 'op': 'flop',
    u + 'owed': 'flowed',
    u + 'ower': 'flower',
    u + 'owered': 'flowered',
    u + 'owerpot': 'flowerpot',
    u + 'owers': 'flowers',
    u + 're': 'fire',
    u + 'red': 'fired',
    u + 'replace': 'fireplace',
    u + 'rm': 'firm',
    u + 'rmly': 'firmly',
    u + 'rst': 'first',
    u + 'sh': 'fish',
    u + 'shing': 'fishing',
    u + 'shy': 'fishy',
    u + 'st': 'fist',
    u + 'sts': 'fists',
    u + 't': 'fit',
    u + 'ung': 'flung',
    u + 'urry': 'flurry',
    u + 'ushed': 'flushed',
    u + 'uttering': 'fluttering',
    u + 'u' + u + 'ng': 'fluffing',
    u + 've': 'five',
    u + 've-foot': 'five-foot',
    u + 'x': 'fix',
    u + 'xed': 'fixed',
    u + 'xings': 'fixings',
    u + 'y': 'fly',
    u + 'ying': 'flying'
}

# Apply dictionary replacements
cleaned = text
for bad, good in sorted(REPLACEMENTS.items(), key=lambda x: -len(x[0])):
    cleaned = cleaned.replace(bad, good)

# Check if any uFFFD remains
remaining_u = cleaned.count(u)
print(f'Remaining uFFFD after dictionary: {remaining_u}')
if remaining_u > 0:
    for m in re.finditer(u, cleaned):
        pos = m.start()
        print('Remaining:', repr(cleaned[pos-15:pos+15]))

# Clean formatting: remove erroneous list dashes from dialogue and paragraphs
cleaned_lines = []
in_main_story = False

for line in cleaned.split('\n'):
    s = line.strip()
    
    # Clean leading list bullet if it's normal dialogue or narrative
    if re.match(r'^[-*•]\s+', s):
        # Remove bullet
        s = re.sub(r'^[-*•]\s+', '', s).strip()
    
    # Clean chapter numbers like # **1** to ## Chapter 1
    m_chap = re.match(r'^#\s+\*\*(\d+)\*\*', s)
    if m_chap:
        num = m_chap.group(1)
        s = f'## Chapter {num}'
    
    cleaned_lines.append(s)

cleaned_text = '\n'.join(cleaned_lines)
# Normalize multiple blank lines to double newlines
cleaned_text = re.sub(r'\n{3,}', '\n\n', cleaned_text)

# Add Book Header and Cover Link
header = """# Holes
**By Louis Sachar**
*Winner of the Newbery Medal and the National Book Award*

![Holes Cover Art](assets/holes_book_cover.jpg)

---

"""

full_markdown = header + cleaned_text

# Write Markdown
with open(TARGET_MD, 'w', encoding='utf-8') as f:
    f.write(full_markdown)

# Write Plain Text (strip markdown symbols for pure text readers)
plain_text = re.sub(r'#+\s*', '', cleaned_text)
plain_text = re.sub(r'\*+([^*]+)\*+', r'\1', plain_text)
plain_text = re.sub(r'_+([^_]+)_+', r'\1', plain_text)
plain_text = re.sub(r'!\[.*?\]\(.*?\)', '', plain_text)

with open(TARGET_TXT, 'w', encoding='utf-8') as f:
    f.write(f"HOLES by Louis Sachar\n\n{plain_text}")

print(f"Successfully generated {TARGET_MD} ({os.path.getsize(TARGET_MD)} bytes)")
print(f"Successfully generated {TARGET_TXT} ({os.path.getsize(TARGET_TXT)} bytes)")
