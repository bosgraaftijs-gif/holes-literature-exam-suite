const test = require('node:test');
const assert = require('node:assert/strict');
const studio = require('../server/studio');

const SAMPLE_NL_TEXT = `
# Fotosynthese bij Planten

Fotosynthese is een biologisch proces waarbij planten met behulp van zonlicht koolstofdioxide en water omzetten in glucose en zuurstof.

Chlorofyl is het groene pigment in bladgroenkorrels dat lichtenergie absorbeert.

De lichtreactie vindt plaats in de thylakoidmembranen en produceert ATP en NADPH.

De Calvincyclus vindt plaats in het stroma van de chloroplast en gebruikt ATP om koolstofdioxide te fixeren in suikers.
`;

const SAMPLE_EN_TEXT = `
# Quantum Computing Overview

Quantum computing is a multidisciplinary field comprising aspects of computer science, physics, and mathematics.

Superposition is the ability of a quantum system to be in multiple states at the same time until it is measured.

Quantum entanglement is a physical phenomenon that occurs when a group of particles interact in ways such that the quantum state of each particle cannot be described independently.
`;

test('detectLanguage detects Dutch and English accurately', () => {
  assert.equal(studio.detectLanguage(SAMPLE_NL_TEXT), 'nl');
  assert.equal(studio.detectLanguage(SAMPLE_EN_TEXT), 'en');
});

test('extractKeyConcepts extracts definitions from Dutch text', () => {
  const concepts = studio.extractKeyConcepts(SAMPLE_NL_TEXT, 'nl');
  assert.ok(concepts.length >= 2);
  const terms = concepts.map(c => c.term.toLowerCase());
  assert.ok(terms.some(t => t.includes('fotosynthese')));
  assert.ok(terms.some(t => t.includes('chlorofyl')));
});

test('generateSummary generates bullets mode with bold headers', () => {
  const summary = studio.generateSummary(SAMPLE_NL_TEXT, 'bullets', 'nl');
  assert.ok(summary.includes('- **'));
  assert.ok(summary.includes('fotosynthese') || summary.includes('Chlorofyl'));
});

test('generateSummary supports in-depth structured mode', () => {
  const summary = studio.generateSummary(SAMPLE_NL_TEXT, 'in-depth', 'nl');
  assert.ok(summary.includes('### 1. Inleiding'));
  assert.ok(summary.includes('### 2. Kernbevindingen'));
});

test('generateSummary supports tldr mode', () => {
  const summary = studio.generateSummary(SAMPLE_NL_TEXT, 'tldr', 'nl');
  assert.ok(summary.length > 20);
  assert.ok(!summary.includes('###'));
});

test('generateQuiz produces structured questions with valid correct answers', () => {
  const questions = studio.generateQuiz(SAMPLE_NL_TEXT, 3, 'nl');
  assert.equal(questions.length, 3);

  for (const q of questions) {
    assert.ok(q.id > 0);
    assert.ok(q.question.length > 10);
    assert.ok(Array.isArray(q.options));
    assert.ok(q.options.length >= 2);
    assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length);
    assert.ok(q.explanation.length > 10);
    assert.ok(q.quote.length > 10);
  }
});

test('generateFlashcards creates front/back study cards', () => {
  const cards = studio.generateFlashcards(SAMPLE_NL_TEXT, 'nl');
  assert.ok(cards.length >= 3);

  for (const card of cards) {
    assert.ok(card.front.length > 0);
    assert.ok(card.back.length > 0);
    assert.equal(card.mastered, false);
  }
});

test('generateStudyGuide formats syllabus with glossary and questions', () => {
  const guide = studio.generateStudyGuide(SAMPLE_NL_TEXT, 'Fotosynthese', 'nl');
  assert.ok(guide.includes('# Studiegids: Fotosynthese'));
  assert.ok(guide.includes('## 1. Overzicht'));
  assert.ok(guide.includes('## 2. Begrippenlijst'));
  assert.ok(guide.includes('## 3. Belangrijke Vragen'));
});

test('generateFaq generates grounded question and answer pairs', () => {
  const faqs = studio.generateFaq(SAMPLE_NL_TEXT, 'nl');
  assert.ok(faqs.length >= 2);
  assert.ok(faqs[0].question.includes('?'));
  assert.ok(faqs[0].answer.length > 10);
});

test('generateAudioOverview creates 2-host podcast dialogue script', () => {
  const podcast = studio.generateAudioOverview(SAMPLE_NL_TEXT, 'Fotosynthese Les', 'nl');
  assert.equal(podcast.hosts.length, 2);
  assert.equal(podcast.hosts[0], 'Daan');
  assert.equal(podcast.hosts[1], 'Sophie');
  assert.ok(podcast.script.length >= 5);

  const speakers = new Set(podcast.script.map(s => s.speaker));
  assert.ok(speakers.has('Daan'));
  assert.ok(speakers.has('Sophie'));
});

test('answerQuestionGrounded returns citations with source attributions', () => {
  const docs = [
    { name: 'biologie.md', content: SAMPLE_NL_TEXT },
    { name: 'natuurkunde.md', content: SAMPLE_EN_TEXT }
  ];

  const result = studio.answerQuestionGrounded('Wat doet chlorofyl?', docs);
  assert.ok(result.answer.length > 10);
  assert.ok(result.citations.length > 0);
  assert.equal(result.citations[0].source, 'biologie.md');
  assert.ok(result.citations[0].quote.toLowerCase().includes('chlorofyl'));
});

test('splitSentences preserves abbreviations with periods (Mr., Mrs., Mevr.)', () => {
  const text = 'Stanley ontmoet Mr. Sir en Mr. Pendanski bij tent D. Daarna sprak hij mevr. Bell over wiskunde.';
  const sents = studio.splitSentences(text);
  assert.equal(sents.length, 2);
  assert.ok(sents[0].includes('Mr. Sir'));
  assert.ok(sents[0].includes('Mr. Pendanski'));
  assert.ok(sents[1].includes('mevr. Bell'));
});

test('cleanMarkdown preserves markdown table contents without destroying first column', () => {
  const table = '| Naam | Rol |\n| :--- | :--- |\n| Stanley | Protagonist |\n| Zero | Vriend |';
  const cleaned = studio.cleanMarkdown(table);
  assert.ok(cleaned.includes('Stanley'));
  assert.ok(cleaned.includes('Protagonist'));
  assert.ok(cleaned.includes('Zero'));
  assert.ok(cleaned.includes('Vriend'));
});

test('extractMCQuestions parses pre-authored 4-option multiple choice questions', () => {
  const fs = require('fs');
  const path = require('path');
  const dataset = fs.readFileSync(path.join(__dirname, '..', 'documents', '09_Holes_Exam_QA_Quizzes_and_Flashcards.md'), 'utf-8');
  const mcQuestions = studio.extractMCQuestions(dataset);

  assert.ok(mcQuestions.length >= 5);
  for (const q of mcQuestions) {
    assert.equal(q.type, 'multiple_choice');
    assert.ok(q.question.length > 10);
    assert.equal(q.options.length, 4);
    assert.ok(q.correctIndex >= 0 && q.correctIndex <= 3);
    assert.ok(q.explanation.length > 15);
  }
});

test('extractFlashcardTable extracts character profiles without header contamination', () => {
  const fs = require('fs');
  const path = require('path');
  const dataset = fs.readFileSync(path.join(__dirname, '..', 'documents', '09_Holes_Exam_QA_Quizzes_and_Flashcards.md'), 'utf-8');
  const cards = studio.extractFlashcardTable(dataset);

  assert.ok(cards.length >= 10);
  const fronts = cards.map(c => c.front.toLowerCase());
  assert.ok(fronts.some(f => f.includes('trout')));
  assert.ok(fronts.some(f => f.includes('zeroni')));
  assert.ok(fronts.some(f => f.includes('sam')));
  assert.ok(!fronts.includes('aanwijzing / profiel'));
  assert.ok(!fronts.includes('clue / narrative profile'));
  assert.ok(!fronts.includes('het'));
});

test('generateQuiz on Holes_Chapter_Summaries produces grounded multiple choice questions without garbage terms', () => {
  const fs = require('fs');
  const path = require('path');
  const summaries = fs.readFileSync(path.join(__dirname, '..', 'documents', 'Holes_Chapter_Summaries.md'), 'utf-8');
  const quiz = studio.generateQuiz(summaries, 5);

  assert.equal(quiz.length, 5);
  for (const q of quiz) {
    assert.equal(q.type, 'multiple_choice');
    assert.equal(q.options.length, 4);
    assert.ok(q.correctIndex >= 0 && q.correctIndex < 4);
    assert.ok(q.explanation.length > 10);
    assert.ok(q.quote.length > 5);
  }
});

test('answerQuestionGrounded deduplicates identical content from .md and .txt pairs', () => {
  const docMd = { name: '01_Holes.md', content: 'Stanley Yelnats is de hoofdpersoon van Holes. Hij graaft gaten in Camp Green Lake.' };
  const docTxt = { name: '01_Holes.txt', content: 'Stanley Yelnats is de hoofdpersoon van Holes. Hij graaft gaten in Camp Green Lake.' };

  const res = studio.answerQuestionGrounded('Wie is Stanley Yelnats?', [docMd, docTxt]);
  assert.equal(res.citations.length, 1);
  assert.ok(!res.answer.startsWith('Op basis van de geselecteerde bronnen [1]:'));
  assert.ok(res.answer.startsWith('Op basis van de geselecteerde bronnen:'));
});

test('getTimelineEvents returns synchronized events across 3 eras with AO2 exam commentary', () => {
  const events = studio.getTimelineEvents();
  assert.ok(Array.isArray(events));
  assert.ok(events.length >= 12);
  
  const eras = new Set(events.map(e => e.eraKey));
  assert.ok(eras.has('era-a'), 'Should include Era A (Latvia)');
  assert.ok(eras.has('era-b'), 'Should include Era B (Old Green Lake)');
  assert.ok(eras.has('era-c'), 'Should include Era C (Camp Green Lake)');

  const step1Events = events.filter(e => e.stepIndex === 1);
  assert.ok(step1Events.length >= 2, 'Step 1 should synchronize at least 2 eras');

  events.forEach(ev => {
    assert.ok(ev.chapter, 'Every event must have chapter attribution');
    assert.ok(ev.ao2Analysis, 'Every event must have GCSE AO2 structural analysis');
    assert.ok(ev.quote, 'Every event must feature an authentic textual quote');
    assert.ok(ev.essayTip, 'Every event must provide exam guidance');
  });
});

test('getMotifsData returns 5 exam motifs with verified PEEL models', () => {
  const motifs = studio.getMotifsData();
  assert.equal(motifs.length, 5);
  const ids = motifs.map(m => m.id);
  assert.ok(ids.includes('onions'));
  assert.ok(ids.includes('sploosh'));
  assert.ok(ids.includes('shovels_holes'));
  assert.ok(ids.includes('lizards_venom'));
  assert.ok(ids.includes('lullaby'));

  const onions = studio.getMotifById('onions');
  assert.ok(onions);
  assert.ok(onions.appearances.length >= 3);
  assert.ok(onions.peelModel.point);
  assert.ok(onions.peelModel.evidence);
  assert.ok(onions.peelModel.explanation);
  assert.ok(onions.peelModel.link);
});

test('getIconicQuotesData returns 10 curated quotes with options and subtext', () => {
  const quotes = studio.getIconicQuotesData();
  assert.equal(quotes.length, 10);
  quotes.forEach(q => {
    assert.ok(q.quote);
    assert.ok(q.speaker);
    assert.equal(q.options.length, 4);
    assert.ok(q.correctIndex >= 0 && q.correctIndex <= 3);
    assert.equal(q.subtextOptions.length, 4);
    assert.ok(q.correctSubtextIndex >= 0 && q.correctSubtextIndex <= 3);
    assert.ok(q.modelSentence);
  });
});

test('getEssayPromptsData returns 5 exam prompts with 3-clause thesis and PEEL outline', () => {
  const prompts = studio.getEssayPromptsData();
  assert.equal(prompts.length, 5);
  prompts.forEach(p => {
    assert.ok(p.question);
    assert.ok(p.thesisClauses.contention);
    assert.ok(p.thesisClauses.methodology);
    assert.ok(p.thesisClauses.resolution);
    assert.equal(p.outline.length, 3);
  });
});

test('getCharacterGraphData returns topological nodes and relationships', () => {
  const graph = studio.getCharacterGraphData();
  assert.ok(graph.nodes.length >= 12);
  assert.ok(graph.edges.length >= 10);

  const families = new Set(graph.nodes.map(n => n.family));
  assert.ok(families.has('Yelnats'));
  assert.ok(families.has('Zeroni'));
  assert.ok(families.has('Walker'));

  // Referential integrity: every edge points to real nodes
  const nodeIds = new Set(graph.nodes.map(n => n.id));
  graph.edges.forEach(e => {
    assert.ok(nodeIds.has(e.from), `Edge from ${e.from} must exist in graph nodes`);
    assert.ok(nodeIds.has(e.to), `Edge to ${e.to} must exist in graph nodes`);
    assert.ok(e.label && e.label.length > 2, `Edge must have descriptive label`);
  });
});

test('convergenceNodes and timeline events maintain strict referential integrity', () => {
  const holesData = require('../server/holesData');
  const cNodeIds = new Set(holesData.convergenceNodesData.map(c => c.id));
  assert.equal(holesData.convergenceNodesData.length, 6);

  holesData.timelineEvents.forEach(ev => {
    if (ev.convergenceNode) {
      assert.ok(cNodeIds.has(ev.convergenceNode), `Event ${ev.id} convergenceNode '${ev.convergenceNode}' must be valid`);
    }
  });
});


