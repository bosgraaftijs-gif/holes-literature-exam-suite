const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const {
  DocumentConverter,
  sanitizeFilename,
  getUniquePath,
  htmlToMarkdown,
  csvToMarkdown,
  jsonToMarkdown,
  plainTextToMarkdown
} = require('../server/converter');

const TEST_DIR = path.join(__dirname, 'temp_converter_test');
const TEST_DOCS = path.join(TEST_DIR, 'documents');
const TEST_ASSETS = path.join(TEST_DOCS, 'assets');

test.beforeEach(() => {
  fs.mkdirSync(TEST_ASSETS, { recursive: true });
});

test.afterEach(() => {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

test('sanitizeFilename removes illegal characters and retains basename', () => {
  const result = sanitizeFilename('Mijn:Document*Test?.md');
  assert.equal(result.base, 'Mijn_Document_Test_');
  assert.equal(result.ext, '.md');
});

test('getUniquePath avoids overwriting existing files', () => {
  fs.writeFileSync(path.join(TEST_DOCS, 'test.md'), 'existing');
  const unique = getUniquePath(TEST_DOCS, 'test', '.md');
  assert.equal(unique.fileName, 'test_1.md');
});

test('htmlToMarkdown converts tags, links, and tables accurately', () => {
  const html = `
    <h1>Titel van Document</h1>
    <p>Dit is een <strong>belangrijke</strong> paragraaf met een <a href="https://example.com">link</a>.</p>
    <table>
      <tr><th>Kop 1</th><th>Kop 2</th></tr>
      <tr><td>Data 1</td><td>Data 2</td></tr>
    </table>
  `;
  const md = htmlToMarkdown(html);
  assert.ok(md.includes('# Titel van Document'));
  assert.ok(md.includes('**belangrijke**'));
  assert.ok(md.includes('[link](https://example.com)'));
  assert.ok(md.includes('| Kop 1 | Kop 2 |'));
  assert.ok(md.includes('| Data 1 | Data 2 |'));
});

test('htmlToMarkdown extracts base64 images to assets and rewrites src', () => {
  const converter = new DocumentConverter({ rootDir: TEST_DIR, documentsDir: TEST_DOCS, assetsDir: TEST_ASSETS });
  // 1x1 transparent PNG base64
  const b64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const html = `<h2>Met Plaatje</h2><p><img src="data:image/png;base64,${b64Png}" alt="Pixel"></p>`;

  const buffer = Buffer.from(html, 'utf-8');
  return converter.convertBuffer(buffer, 'pagina_met_plaatje.html').then(result => {
    assert.equal(result.success, true);
    assert.equal(result.imagesExtracted.length, 1);
    assert.ok(fs.existsSync(path.join(TEST_ASSETS, result.imagesExtracted[0].fileName)));

    const savedContent = fs.readFileSync(result.filePath, 'utf-8');
    assert.ok(savedContent.includes('![Pixel](assets/'));
  });
});

test('csvToMarkdown parses CSV data into a Markdown table', () => {
  const csv = 'Naam,Leeftijd,Rol\nAlice,28,Onderzoeker\nBob,34,Ingenieur';
  const md = csvToMarkdown(csv, 'team.csv');
  assert.ok(md.includes('| Naam | Leeftijd | Rol |'));
  assert.ok(md.includes('| Alice | 28 | Onderzoeker |'));
  assert.ok(md.includes('| Bob | 34 | Ingenieur |'));
});

test('jsonToMarkdown converts array of objects into Markdown table', () => {
  const json = JSON.stringify([
    { id: 1, planeet: 'Mercurius', diameter: '4879 km' },
    { id: 2, planeet: 'Venus', diameter: '12104 km' }
  ]);
  const md = jsonToMarkdown(json, 'planeten.json');
  assert.ok(md.includes('| id | planeet | diameter |'));
  assert.ok(md.includes('| 1 | Mercurius | 4879 km |'));
});

test('DocumentConverter handles standalone image and creates companion note', async () => {
  const converter = new DocumentConverter({ rootDir: TEST_DIR, documentsDir: TEST_DOCS, assetsDir: TEST_ASSETS });
  const fakePngBuffer = Buffer.from('fake-png-binary-data');

  const result = await converter.convertBuffer(fakePngBuffer, 'schema_foto.png');
  assert.equal(result.success, true);
  assert.equal(result.imagesExtracted.length, 1);
  assert.ok(fs.existsSync(path.join(TEST_ASSETS, result.imagesExtracted[0].fileName)));

  const companionMd = fs.readFileSync(result.filePath, 'utf-8');
  assert.ok(companionMd.includes('# schema_foto'));
  assert.ok(companionMd.includes('![schema_foto](assets/'));
  assert.ok(companionMd.includes('Afbeeldingsdetails'));
});

test('DocumentConverter handles plain text and outputs structured Markdown', async () => {
  const converter = new DocumentConverter({ rootDir: TEST_DIR, documentsDir: TEST_DOCS, assetsDir: TEST_ASSETS });
  const rawText = `Notitie Titel\n\nDit is de eerste alinea.\n\n- Eerste punt\n- Tweede punt`;
  const result = await converter.convertBuffer(Buffer.from(rawText), 'aantekeningen.txt', { outputFormat: 'md' });

  assert.equal(result.success, true);
  assert.equal(result.extension, '.md');
  const content = fs.readFileSync(result.filePath, 'utf-8');
  assert.ok(content.includes('# Notitie Titel'));
  assert.ok(content.includes('- Eerste punt'));
});
