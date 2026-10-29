const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.resolve(__dirname, '../documents');
const ASSETS_DIR = path.join(DOCS_DIR, 'assets');

const REQUIRED_DUTCH_DOCS = [
  '01_Holes_Complete_Karaktergids_en_Lore',
  '02_Camp_Green_Lake_en_Geografie',
  '03_Het_Volledige_Plot_en_Verhaallijnen',
  '04_Belangrijke_Voorwerpen_Elementen_en_Lore',
  '05_Thema_Analyse_en_Literaire_Motieven',
  '06_Belangrijke_Scenes_en_Hoofdstuk_Gids',
  '07_Boek_vs_Film_Verschillen_en_Trivia',
  '08_Holes_Grote_Samenvatting_en_Studiegids'
];

test('Dutch Content Suite: All 8 required files exist in both .md and .txt formats', () => {
  for (const baseName of REQUIRED_DUTCH_DOCS) {
    const mdPath = path.join(DOCS_DIR, `${baseName}.md`);
    const txtPath = path.join(DOCS_DIR, `${baseName}.txt`);

    assert.ok(fs.existsSync(mdPath), `Missing Markdown file: ${baseName}.md`);
    assert.ok(fs.existsSync(txtPath), `Missing Plaintext file: ${baseName}.txt`);

    const mdStat = fs.statSync(mdPath);
    const txtStat = fs.statSync(txtPath);

    assert.ok(mdStat.size > 5000, `${baseName}.md should be comprehensive (>5000 bytes), got ${mdStat.size}`);
    assert.ok(txtStat.size > 4000, `${baseName}.txt should be comprehensive (>4000 bytes), got ${txtStat.size}`);
  }
});

test('Dutch Content Suite: Strict UTF-8 verification (no replacement chars or mojibake)', () => {
  const mojibakePattern = /[\u00C0-\u00C3][\u0080-\u00BF]/;

  for (const baseName of REQUIRED_DUTCH_DOCS) {
    const mdContent = fs.readFileSync(path.join(DOCS_DIR, `${baseName}.md`), 'utf-8');
    const txtContent = fs.readFileSync(path.join(DOCS_DIR, `${baseName}.txt`), 'utf-8');

    assert.ok(!mdContent.includes('\uFFFD'), `Found replacement char in ${baseName}.md`);
    assert.ok(!txtContent.includes('\uFFFD'), `Found replacement char in ${baseName}.txt`);

    assert.ok(!mojibakePattern.test(mdContent), `Found potential mojibake sequence in ${baseName}.md`);
    assert.ok(!mojibakePattern.test(txtContent), `Found potential mojibake sequence in ${baseName}.txt`);
  }
});

test('Dutch Content Suite: All asset image links in Markdown exist in documents/assets', () => {
  const imgRegex = /!\[.*?\]\((assets\/[^)]+)\)/g;

  for (const baseName of REQUIRED_DUTCH_DOCS) {
    const mdContent = fs.readFileSync(path.join(DOCS_DIR, `${baseName}.md`), 'utf-8');
    let match;
    while ((match = imgRegex.exec(mdContent)) !== null) {
      const imgPath = path.join(DOCS_DIR, match[1]);
      assert.ok(fs.existsSync(imgPath), `Referenced asset does not exist: ${match[1]} in ${baseName}.md`);
    }
  }
});
