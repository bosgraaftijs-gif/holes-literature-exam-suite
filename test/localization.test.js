const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const studio = require('../server/studio');

const SAMPLE_HOLES_TEXT = `
# Camp Green Lake & Stanley Yelnats

Stanley Yelnats IV is an unjustly convicted teenager sent to Camp Green Lake in Texas.
Madame Zeroni placed a generational curse on Elya Yelnats in Latvia 110 years ago when he failed to carry her up the mountain.
Katherine Barlow was a sweet schoolteacher who turned into the ruthless outlaw Kissin' Kate Barlow after Trout Walker and the racist mob killed Sam the onion man.
Hector Zeroni, known as Zero, is Madame Zeroni's great-great-great-grandson. Stanley and Zero escape into the desert and survive on sweet onions on God's Thumb.
Yellow-spotted lizards are venomous desert creatures that avoid anyone who has consumed onion juice.
The Warden is Charles Walker's descendant who forces the boys to dig holes five feet deep and five feet wide in search of Kate Barlow's buried treasure.
`;

test('Localization: generateSummary outputs required English headers', () => {
  const summary = studio.generateSummary(SAMPLE_HOLES_TEXT, 'in-depth', 'en');
  assert.ok(summary.includes('## Key Concepts'), 'Must include ## Key Concepts');
  assert.ok(summary.includes('## Core Themes & Narrative Arcs'), 'Must include ## Core Themes & Narrative Arcs');
  assert.ok(summary.includes('## Literary Takeaways'), 'Must include ## Literary Takeaways');
  assert.ok(summary.includes('## Key Quotes & Insights'), 'Must include ## Key Quotes & Insights');
});

test('Localization: generateQuiz framing and explanations are in English', () => {
  const quiz = studio.generateQuiz(SAMPLE_HOLES_TEXT, 3, 'en');
  assert.ok(quiz.length > 0);
  for (const q of quiz) {
    assert.ok(
      q.explanation.includes('Correct because') || q.explanation.includes('In Holes'),
      `Explanation should be in English: ${q.explanation}`
    );
  }
});

test('Localization: generateFlashcards labels are Concept/Question/Quote and Definition/Literary Significance', () => {
  const cards = studio.generateFlashcards(SAMPLE_HOLES_TEXT, 'en');
  assert.ok(cards.length > 0);
  for (const card of cards) {
    assert.equal(card.frontLabel, 'Concept / Question / Quote');
    assert.equal(card.backLabel, 'Definition / Literary Significance');
  }
});

test('Localization: generateStudyGuide outputs required English headers and structure', () => {
  const guide = studio.generateStudyGuide(SAMPLE_HOLES_TEXT, 'Holes Literature Exam', 'en');
  assert.ok(guide.includes('# Study Guide: Holes Literature Exam'));
  assert.ok(guide.includes('## 1. Overview'));
  assert.ok(guide.includes('## 2. Key Terms & Character Glossary'));
  assert.ok(guide.includes('## 3. Core Discussion & Exam Questions'));
  assert.ok(guide.includes('## 4. Chapter Breakdown'));
});

test('Localization: generateFaq outputs English Q&A pairs', () => {
  const faqs = studio.generateFaq(SAMPLE_HOLES_TEXT, 'en');
  assert.ok(faqs.length >= 2);
  for (const faq of faqs) {
    assert.ok(faq.question.includes('?') && (faq.question.includes('What is') || faq.question.includes('Why') || faq.question.includes('How') || faq.question.includes('Who')));
    assert.ok(faq.answer.length > 10);
  }
});

test('Localization: generateAudioOverview uses Leo & Maya hosts and English dialogue', () => {
  const podcast = studio.generateAudioOverview(SAMPLE_HOLES_TEXT, 'Holes Analysis', 'en');
  assert.deepEqual(podcast.hosts, ['Leo', 'Maya']);
  const scriptText = podcast.script.map(s => s.text).join(' ');
  assert.ok(scriptText.includes('Stanley'));
  assert.ok(scriptText.includes('Zero') || scriptText.includes('curse') || scriptText.includes('onions'));
  assert.ok(podcast.script.some(s => s.speaker === 'Leo'));
  assert.ok(podcast.script.some(s => s.speaker === 'Maya'));
});

test('Localization: answerQuestionGrounded stop words, citation format, and fallback', () => {
  // Empty query fallback
  const emptyRes = studio.answerQuestionGrounded('', []);
  assert.equal(emptyRes.answer, 'No sources found for this query.');

  // Grounded search with English citations
  const doc = { name: 'Holes_Test.md', content: SAMPLE_HOLES_TEXT };
  const res = studio.answerQuestionGrounded('Who is Zero and Madame Zeroni?', [doc]);
  assert.ok(res.citations.length > 0);
  assert.ok(res.citations[0].format.startsWith('📌 Source [1]: Holes_Test.md (Paragraph ['));
  assert.ok(res.answer.startsWith('Based on the selected sources:'));
});

test('Localization: client/index.html matches all required English strings and branding', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'client', 'index.html'), 'utf-8');
  // Title & Header branding
  assert.ok(html.includes('Holes Study &amp; Exam Suite') || html.includes('Holes Exam Master'), 'Title must reflect Holes');
  assert.ok(html.includes('Holes') && html.includes('Louis Sachar'), 'Header brand must reference Holes and Louis Sachar');
  // Sidebar elements
  assert.ok(html.includes('Sources'), 'Sidebar must have Sources header');
  assert.ok(html.includes('Search') || html.includes('Filter'), 'Filter input must be present');
  // Studio navigation tabs
  assert.ok(html.includes('Summary') || html.includes('Study Hub'), 'Studio tabs must be present');
  // Ingestion Modal
  assert.ok(html.includes('Convert &amp; Ingest') || html.includes('Ingest'), 'Ingestion modal must be present');
  // Chat Panel
  assert.ok(html.includes('Chat'), 'Chat panel must be present');
  // Settings Modal
  assert.ok(html.includes('English (en)'), 'Settings default language must be English (en)');
});

test('Localization: client/app.js contains all required English UI strings and handlers', () => {
  const js = fs.readFileSync(path.join(__dirname, '..', 'client', 'app.js'), 'utf-8');
  assert.ok(js.includes("language: 'en'"));
  // Quiz runner strings
  assert.ok(js.includes('Question ${this.quiz.currentIndex + 1} of ${total}'));
  assert.ok(js.includes('Your Answer:'));
  assert.ok(js.includes('Correct! 🎉'));
  assert.ok(js.includes('Incorrect. ❌'));
  assert.ok(js.includes('Explanation:'));
  assert.ok(js.includes('Quiz Complete! Score: ${score} / ${total} (${pct}%)'));
  assert.ok(js.includes('Try Again'));
  // Flashcards runner strings
  assert.ok(js.includes('Card ${this.flashcards.currentIndex + 1} of ${total}'));
  assert.ok(js.includes('Click to flip card'));
  assert.ok(js.includes('Next Card'));
  assert.ok(js.includes('Previous Card'));
  assert.ok(js.includes('Mark as Mastered'));
  assert.ok(js.includes('Shuffle Cards'));
  // Podcast player strings
  assert.ok(js.includes('Playing Audio Deep Dive...'));
  assert.ok(js.includes('Paused'));
  assert.ok(js.includes('Host 1: Leo'));
  assert.ok(js.includes('Host 2: Maya'));
  // Chat citations accordion strings
  assert.ok(js.includes('▶ View consulted source excerpts (${citations.length})'));
  assert.ok(js.includes('▼ Hide source excerpts'));
});

test('Localization: settings.json default language is en', () => {
  const settings = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'settings.json'), 'utf-8'));
  assert.equal(settings.language, 'en');
});
