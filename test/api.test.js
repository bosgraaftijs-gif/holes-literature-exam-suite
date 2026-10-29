const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { app } = require('../server/index');

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => {
    server.close(resolve);
  });
});

test('GET /api/documents returns list of documents', async () => {
  const res = await fetch(`${baseUrl}/api/documents`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data.documents));
  assert.ok(data.documents.length >= 1);
});

test('POST, GET, PUT, DELETE /api/documents lifecycle', async () => {
  const testTitle = `Test_Doc_${Date.now()}`;

  // 1. Create
  const createRes = await fetch(`${baseUrl}/api/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: testTitle,
      format: 'md',
      content: '# Initial Content\n\nInitial paragraph.'
    })
  });
  assert.equal(createRes.status, 200);
  const createData = await createRes.json();
  const filename = createData.name;
  assert.ok(filename.includes(testTitle));

  // 2. Read
  const readRes = await fetch(`${baseUrl}/api/documents/${encodeURIComponent(filename)}`);
  assert.equal(readRes.status, 200);
  const readData = await readRes.json();
  assert.ok(readData.content.includes('Initial paragraph.'));

  // 3. Update
  const updateRes = await fetch(`${baseUrl}/api/documents/${encodeURIComponent(filename)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: '# Updated Content\n\nUpdated paragraph.' })
  });
  assert.equal(updateRes.status, 200);

  // 4. Delete
  const delRes = await fetch(`${baseUrl}/api/documents/${encodeURIComponent(filename)}`, {
    method: 'DELETE'
  });
  assert.equal(delRes.status, 200);
});

test('POST /api/convert with direct text converts into markdown document', async () => {
  const pasteTitle = `Pasted_Doc_${Date.now()}`;
  const res = await fetch(`${baseUrl}/api/convert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: pasteTitle,
      text: 'Dit is een geconverteerde alinea met *nadruk*.',
      format: 'md'
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.convertedCount, 1);

  // Clean up
  const createdName = data.results[0].fileName;
  await fetch(`${baseUrl}/api/documents/${encodeURIComponent(createdName)}`, { method: 'DELETE' });
});

test('POST /api/studio/summary returns summary', async () => {
  const res = await fetch(`${baseUrl}/api/studio/summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mode: 'bullets' })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.summary.length > 20);
});

test('POST /api/studio/quiz returns interactive quiz questions', async () => {
  const res = await fetch(`${baseUrl}/api/studio/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count: 3 })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.questions.length > 0);
  assert.ok(data.questions[0].options.length >= 2);
});

test('POST /api/studio/chat returns grounded response with citations', async () => {
  const res = await fetch(`${baseUrl}/api/studio/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'Wat is machine learning?' })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.answer.length > 10);
  assert.ok(Array.isArray(data.citations));
});

test('GET /api/documents returns list of documents including Holes files', async () => {
  const res = await fetch(`${baseUrl}/api/documents`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(Array.isArray(data.documents));
  assert.ok(data.documents.length >= 1);

  const docNames = data.documents.map(d => d.name);
  assert.ok(docNames.includes('Holes_Full_Novel_Louis_Sachar.md'), 'Holes_Full_Novel_Louis_Sachar.md must be present in documents list');
  assert.ok(docNames.includes('Holes_Chapter_Summaries.md'), 'Holes_Chapter_Summaries.md must be present in documents list');
});

test('POST and GET /api/chat return grounded responses with citations', async () => {
  // 1. POST /api/chat
  const resPost = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'Waarom graven de jongens gaten op Camp Green Lake?' })
  });
  assert.equal(resPost.status, 200);
  const dataPost = await resPost.json();
  assert.ok(dataPost.answer.length > 10);
  assert.ok(Array.isArray(dataPost.citations));

  // 2. GET /api/chat
  const resGet = await fetch(`${baseUrl}/api/chat?query=Wat+is+Camp+Green+Lake%3F`);
  assert.equal(resGet.status, 200);
  const dataGet = await resGet.json();
  assert.ok(dataGet.answer.length > 10);
});

test('GET /api/studio/quiz and GET /api/studio/summary return valid responses', async () => {
  // GET /api/studio/quiz
  const quizRes = await fetch(`${baseUrl}/api/studio/quiz?count=3`);
  assert.equal(quizRes.status, 200);
  const quizData = await quizRes.json();
  assert.ok(quizData.questions.length >= 1);

  // GET /api/studio/summary
  const summaryRes = await fetch(`${baseUrl}/api/studio/summary?mode=bullets`);
  assert.equal(summaryRes.status, 200);
  const summaryData = await summaryRes.json();
  assert.ok(summaryData.summary.length > 20);
});

test('POST /api/studio/flashcards and /api/studio/study-guide return study material', async () => {
  const fcRes = await fetch(`${baseUrl}/api/studio/flashcards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ docNames: ['Holes_Chapter_Summaries.md'] })
  });
  assert.equal(fcRes.status, 200);
  const fcData = await fcRes.json();
  assert.ok(fcData.cards.length >= 1);

  const sgRes = await fetch(`${baseUrl}/api/studio/study-guide`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ docNames: ['Holes_Chapter_Summaries.md'] })
  });
  assert.equal(sgRes.status, 200);
  const sgData = await sgRes.json();
  assert.ok(sgData.studyGuide.includes('Studiegids'));
});

test('POST /api/studio/audio-overview returns podcast dialogue with Leo and Maya', async () => {
  const res = await fetch(`${baseUrl}/api/studio/audio-overview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ docNames: ['Holes_Chapter_Summaries.md'] })
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.podcast);
  assert.equal(data.podcast.hosts[0], 'Leo');
  assert.equal(data.podcast.hosts[1], 'Maya');
  assert.ok(data.podcast.script.length >= 5);

  const speakers = new Set(data.podcast.script.map(s => s.speaker));
  assert.ok(speakers.has('Leo'));
  assert.ok(speakers.has('Maya'));
});

test('GET /api/stats returns document count and supported formats', async () => {
  const res = await fetch(`${baseUrl}/api/stats`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.totalDocuments >= 1);
  assert.ok(data.supportedFormats.includes('PDF'));
  assert.ok(data.supportedFormats.includes('PNG'));
});

test('GET /api/studio/timeline returns triple-narrative structure and convergence nodes', async () => {
  const res = await fetch(`${baseUrl}/api/studio/timeline`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.events.length >= 10);
  assert.ok(data.storylines.length === 3);
  assert.ok(data.convergenceNodes.length >= 4);
});

test('GET /api/studio/motifs and /api/studio/motifs/:id return symbolism data with PEEL models', async () => {
  const listRes = await fetch(`${baseUrl}/api/studio/motifs`);
  assert.equal(listRes.status, 200);
  const listData = await listRes.json();
  assert.ok(listData.total >= 5);

  const singleRes = await fetch(`${baseUrl}/api/studio/motifs/onions`);
  assert.equal(singleRes.status, 200);
  const singleData = await singleRes.json();
  assert.equal(singleData.motif.id, 'onions');
  assert.ok(singleData.motif.peelModel.point.includes('onions'));
});

test('GET /api/studio/quotes returns curated iconic quotes with subtext', async () => {
  const res = await fetch(`${baseUrl}/api/studio/quotes`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.total, 10);
  assert.ok(data.quotes.some(q => q.quote.includes('I can fix that')));
  assert.ok(data.quotes.some(q => q.quote.includes('Zero wasn’t a nobody')));
});

test('GET /api/studio/essay-prompts returns GCSE/IB prompts with thesis builder', async () => {
  const res = await fetch(`${baseUrl}/api/studio/essay-prompts`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.total >= 5);
  const p1 = data.prompts[0];
  assert.ok(p1.thesisClauses.contention);
  assert.ok(p1.outline.length === 3);
});

test('GET /api/studio/characters returns family graph nodes and relationships', async () => {
  const res = await fetch(`${baseUrl}/api/studio/characters`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.graph.nodes.length >= 10);
  assert.ok(data.graph.edges.length >= 10);
  assert.ok(data.graph.nodes.some(n => n.name === 'Stanley Yelnats IV'));
  assert.ok(data.graph.nodes.some(n => n.name === 'Hector Zeroni ("Zero")'));
});
