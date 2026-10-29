/**
 * Holes Study & Exam Hub Studio Engine
 * Provides local NLP-driven generation + optional Gemini/OpenAI API integration for:
 * - Summaries (Samenvattingen: Executive, Bullets, In-depth, TL;DR)
 * - Interactive Quizzes (Quiz met 4-optie meerkeuzevragen, score & toelichting)
 * - Flashcards (Flitskaarten met voor/achterkant uit tabellen, begrippen & studiefeiten)
 * - Study Guides (Studiegids met begrippenlijst & zelftest)
 * - FAQ (Veelgestelde Vragen)
 * - Audio Overview (2-Host Podcast Deep Dive script met Leo & Maya)
 * - Grounded Q&A / Chat met exacte bronverwijzingen [1], [2]
 */

/**
 * Detect language of text: 'nl' or 'en'
 */
function detectLanguage(text) {
  if (!text) return 'en';
  const nlWords = ['de', 'het', 'een', 'van', 'en', 'voor', 'in', 'op', 'met', 'is', 'zijn', 'wordt', 'deze', 'dat', 'niet', 'over', 'door'];
  const enWords = ['the', 'is', 'and', 'of', 'in', 'to', 'for', 'with', 'on', 'that', 'this', 'are', 'not', 'from', 'by', 'as', 'be'];

  const tokens = text.toLowerCase().match(/[a-zà-ÿ]+/g) || [];
  let nlCount = 0;
  let enCount = 0;

  for (const token of tokens) {
    if (nlWords.includes(token)) nlCount++;
    if (enWords.includes(token)) enCount++;
  }

  return nlCount > enCount ? 'nl' : 'en';
}

/**
 * Clean markdown formatting to get plain text while preserving table and text content
 */
function cleanMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/!\[.*?\]\(.*?\)/g, '') // remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links to text
    .replace(/#{1,6}\s+/g, '') // headers
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/^\|?[\s\-:|]+\|?$/gm, '') // remove markdown table separator rows |---|---|
    .replace(/\|/g, ' ') // convert table pipes to whitespace, preserving table cells
    .replace(/[*_~>]/g, '') // emphasis & quotes
    .trim();
}

/**
 * Split text into meaningful sentences without breaking on common abbreviations
 */
function splitSentences(text) {
  if (!text) return [];
  const cleaned = cleanMarkdown(text);
  // Protect abbreviations like Mr., Mrs., Ms., Dr., Prof., Mevr., Dhr., St., bijv., ca., vs., e.g., i.e., no., nr.
  const protectedText = cleaned.replace(/\b(Mr|Mrs|Ms|Dr|Prof|Mevr|Dhr|St|bijv|ca|vs|e\.g|i\.e|no|nr)\./gi, '$1@@DOT@@');
  const rawSentences = protectedText.split(/(?<=[.!?])\s+(?=[A-Z0-9À-Ý])/);
  return rawSentences
    .map(s => s.replace(/@@DOT@@/g, '.').trim())
    .filter(s => s.length > 20 && !s.startsWith('#'));
}

/**
 * Structural keywords and stop terms that should never be identified as key concepts
 */
const STRUCTURAL_KEYWORDS = new Set([
  'de', 'het', 'een', 'van', 'en', 'voor', 'in', 'op', 'met', 'is', 'zijn', 'wordt', 'deze', 'dat', 'niet', 'over', 'door',
  'dit', 'wat', 'wie', 'hoe', 'waarom', 'welk', 'welke', 'wanneer', 'hier', 'daar', 'waar', 'hij', 'zij', 'wij', 'jullie',
  'vraag', 'antwoord', 'modelantwoord', 'toelichting', 'deel', 'hoofdstuk', 'chapter', 'section', 'part', 'bron', 'bronnen',
  'titel', 'datum', 'auteur', 'samenvatting', 'flashcards', 'notitie', 'opmerking', 'the', 'this', 'that', 'these', 'those',
  'and', 'or', 'for', 'with', 'from', 'about', 'what', 'who', 'how', 'why', 'which', 'when', 'answer', 'question', 'explanation',
  'summary', 'note', 'karakter', 'personage', 'personages', 'relevantie', 'functie', 'optie', 'opties', 'correct', 'juist',
  'juiste', 'stelling', 'onwaar', 'waar', 'true', 'false', 'inzicht', 'analyse', 'aanwijzing', 'profiel', 'waarde', 'omschrijving', 'kolom', 'begrip', 'definitie',
  'character', 'characters', 'symbol', 'symbols', 'object', 'objects', 'symbol / object', 'camp nickname', 'nickname', 'role', 'roles', 'item', 'items', 'term', 'terms', 'concept', 'concepts', 'literary term'
]);

function isMeaningfulConceptTerm(term) {
  if (!term || typeof term !== 'string') return false;
  const cleanTerm = term.replace(/^[*_#\s]+|[*_#\s:]+$/g, '').trim();
  if (cleanTerm.length < 3 || cleanTerm.length > 45) return false;
  const lower = cleanTerm.toLowerCase();
  if (STRUCTURAL_KEYWORDS.has(lower)) return false;
  // Disallow terms starting with structural words e.g. "Deel 1", "Hoofdstuk 3", "Vraag 5"
  if (/^(deel|hoofdstuk|chapter|part|section|vraag|question|stap|step)\s+\w+/i.test(cleanTerm)) return false;
  // Disallow single words that are pure punctuation or numbers
  if (/^[\d\W]+$/.test(cleanTerm)) return false;
  return true;
}

/**
 * Extract key concepts, definitions and significant terms from text
 */
function extractKeyConcepts(text, lang = 'nl') {
  if (!text) return [];
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const isNl = lang === 'nl';
  const sentences = splitSentences(normalized);
  const concepts = [];

  // 1. Definition patterns
  const defPatterns = isNl
    ? [
        /([A-ZÀ-Ý][\w\s-]{2,40}?)\s+(?:is\s+een|is\s+het|betekent|verwijst\s+naar|wordt\s+gedefinieerd\s+als)\s+([^.!?\n]{15,200})/gi,
        /(?:^|\n)\s*([A-ZÀ-Ý][\w\s-]{2,40}?):\s*([^.!?\n]{15,200})/g
      ]
    : [
        /([A-Z][\w\s-]{2,40}?)\s+(?:is\s+a|is\s+the|means|refers\s+to|is\s+defined\s+as)\s+([^.!?\n]{15,200})/gi,
        /(?:^|\n)\s*([A-Z][\w\s-]{2,40}?):\s*([^.!?\n]{15,200})/g
      ];

  for (const pat of defPatterns) {
    let match;
    while ((match = pat.exec(normalized)) !== null) {
      const rawTerm = match[1].trim();
      const rawExplanation = match[2].trim();
      if (isMeaningfulConceptTerm(rawTerm) && rawExplanation.length > 15) {
        const cleanTerm = rawTerm.replace(/^[*_#\s]+|[*_#\s:]+$/g, '').trim();
        if (!concepts.some(c => c.term.toLowerCase() === cleanTerm.toLowerCase())) {
          concepts.push({ term: cleanTerm, explanation: rawExplanation, type: 'definition' });
        }
      }
    }
  }

  // 2. Bold terms
  const boldMatches = normalized.match(/\*\*([^*]{3,40})\*\*/g) || [];
  for (const bm of boldMatches) {
    const rawTerm = bm.replace(/\*\*/g, '').trim();
    if (isMeaningfulConceptTerm(rawTerm)) {
      if (!concepts.some(c => c.term.toLowerCase() === rawTerm.toLowerCase())) {
        const foundSentence = sentences.find(s => s.includes(rawTerm));
        if (foundSentence) {
          concepts.push({
            term: rawTerm,
            explanation: foundSentence,
            type: 'keypoint'
          });
        }
      }
    }
  }

  // 3. Fallback: extract prominent capitalized phrases
  if (concepts.length < 5) {
    const capPhrases = normalized.match(/\b[A-ZÀ-Ý][a-zà-ÿ]+(?:\s+[A-ZÀ-Ý][a-zà-ÿ]+)?\b/g) || [];
    const freq = {};

    for (const phrase of capPhrases) {
      if (!isMeaningfulConceptTerm(phrase) || phrase.length < 4) continue;
      freq[phrase] = (freq[phrase] || 0) + 1;
    }

    const sortedPhrases = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    for (const [term] of sortedPhrases.slice(0, 10)) {
      if (!concepts.some(c => c.term.toLowerCase() === term.toLowerCase())) {
        const found = sentences.find(s => s.includes(term));
        if (found) {
          concepts.push({ term, explanation: found, type: 'term' });
        }
      }
    }
  }

  return concepts;
}

/**
 * Score sentences for extractive summarization
 */
function scoreSentences(sentences, lang = 'nl') {
  const wordFreq = {};
  const stopWords = new Set([
    'de', 'het', 'een', 'van', 'en', 'voor', 'in', 'op', 'met', 'is', 'zijn', 'wordt', 'deze', 'dat', 'niet',
    'the', 'is', 'and', 'of', 'in', 'to', 'for', 'with', 'on', 'that', 'this', 'are', 'not', 'from', 'by', 'as', 'be'
  ]);

  for (const s of sentences) {
    const words = s.toLowerCase().match(/[a-zà-ÿ0-9]+/g) || [];
    for (const w of words) {
      if (!stopWords.has(w) && w.length > 2) {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
      }
    }
  }

  return sentences.map((sentence, index) => {
    const words = sentence.toLowerCase().match(/[a-zà-ÿ0-9]+/g) || [];
    let score = 0;
    for (const w of words) {
      score += wordFreq[w] || 0;
    }

    // Positional weight: beginning of document has higher importance
    const positionWeight = 1 + (1 / (index + 1)) * 0.5;
    const lengthPenalty = sentence.length > 250 ? 0.8 : 1.0;
    const finalScore = (score / Math.sqrt(words.length + 1)) * positionWeight * lengthPenalty;

    return { sentence, score: finalScore, index };
  });
}

/**
 * Summary Generator
 */
function generateSummary(text, mode = 'executive', lang = null) {
  if (!text) return '';
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const effectiveLang = lang || detectLanguage(normalized);
  const isNl = effectiveLang === 'nl';
  const sentences = splitSentences(normalized);

  if (sentences.length === 0) {
    return isNl
      ? 'Geen voldoende tekst gevonden om een samenvatting te genereren.'
      : 'Not enough text content found to generate a summary.';
  }

  const scored = scoreSentences(sentences, effectiveLang);
  scored.sort((a, b) => b.score - a.score);

  if (mode === 'tldr') {
    // 1-2 most informative sentences
    const top = scored.slice(0, 2).sort((a, b) => a.index - b.index);
    return top.map(s => s.sentence).join(' ');
  }

  if (mode === 'bullets') {
    const count = Math.min(Math.max(4, Math.floor(sentences.length / 4)), 8);
    const top = scored.slice(0, count).sort((a, b) => a.index - b.index);
    const bullets = top.map(item => {
      // Pick leading 2-4 words for bold title
      const words = item.sentence.split(/\s+/);
      const lead = words.slice(0, 3).join(' ').replace(/[,;:]$/, '');
      const rest = words.slice(3).join(' ');
      return `- **${lead}**: ${rest}`;
    });
    return bullets.join('\n\n');
  }

  if (mode === 'in-depth' || mode === 'structured') {
    // Group into logical sections
    const topCount = Math.min(Math.max(6, Math.floor(sentences.length / 3)), 16);
    const top = scored.slice(0, topCount).sort((a, b) => a.index - b.index);

    if (isNl) {
      const partSize = Math.ceil(top.length / 3);
      const sec1 = top.slice(0, partSize).map(s => s.sentence).join(' ');
      const sec2 = top.slice(partSize, partSize * 2).map(s => s.sentence).join(' ');
      const sec3 = top.slice(partSize * 2).map(s => s.sentence).join(' ');
      return `### 1. Inleiding & Hoofddoel\n${sec1}\n\n### 2. Kernbevindingen & Analyse\n${sec2}\n\n### 3. Conclusie & Betekenis\n${sec3}`;
    } else {
      const concepts = extractKeyConcepts(normalized, effectiveLang);
      const partSize = Math.max(1, Math.ceil(top.length / 4));

      let sec1 = concepts.slice(0, 4).map(c => `- **${c.term}**: ${c.explanation}`).join('\n\n');
      if (!sec1) {
        sec1 = top.slice(0, partSize).map(s => s.sentence).join(' ');
      }

      const sec2 = top.slice(0, partSize * 2).map(s => s.sentence).join(' ');
      const sec3 = top.slice(partSize * 2, partSize * 3).map(s => s.sentence).join(' ');
      const sec4 = top.slice(partSize * 3).map(s => s.sentence).join(' ') || sec3;

      return `## Key Concepts\n${sec1}\n\n## Core Themes & Narrative Arcs\n${sec2}\n\n## Literary Takeaways\n${sec3}\n\n## Key Quotes & Insights\n${sec4}`;
    }
  }

  // Default: Executive Summary
  const count = Math.min(Math.max(3, Math.floor(sentences.length / 5)), 6);
  const top = scored.slice(0, count).sort((a, b) => a.index - b.index);
  return top.map(s => s.sentence).join(' ');
}

/**
 * Extract pre-formatted Multiple Choice question blocks (with A, B, C, D choices and correct answer)
 * e.g. from 09_Holes_Exam_QA_Quizzes_and_Flashcards.md
 */
function extractMCQuestions(text, lang = null) {
  if (!text) return [];
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const effectiveLang = lang || detectLanguage(normalized);
  const isNl = effectiveLang === 'nl';
  const questions = [];

  const blockRegex = /(?:###\s*)?(?:\*{0,2}(?:Vraag|Question)\s*(\d+)[\*:]*\s*\n)?\s*\*{0,2}([^\n]+?\?)\*{0,2}\s*\n\s*A\)\s*([^\n]+)\s*\n\s*B\)\s*([^\n]+)\s*\n\s*C\)\s*([^\n]+)\s*\n\s*D\)\s*([^\n]+)\s*\n[\s\S]*?(?:Correct(?:e)?\s*(?:Antwoord|Answer):\*{0,2}\s*([A-D]))(?:[\s\S]*?(?:Toelichting|Explanation):\*{0,2}\s*([^\n]+))?/gi;

  let match;
  while ((match = blockRegex.exec(normalized)) !== null) {
    const questionText = match[2].replace(/^\*\*|\*\*$/g, '').trim();
    const optA = match[3].replace(/^[A-D]\)\s*/, '').trim();
    const optB = match[4].replace(/^[A-D]\)\s*/, '').trim();
    const optC = match[5].replace(/^[A-D]\)\s*/, '').trim();
    const optD = match[6].replace(/^[A-D]\)\s*/, '').trim();
    const correctLetter = (match[7] || 'A').toUpperCase().trim();
    const rawExplanation = match[8] ? match[8].trim() : '';

    const letterToIndex = { A: 0, B: 1, C: 2, D: 3 };
    const correctIndex = letterToIndex[correctLetter] !== undefined ? letterToIndex[correctLetter] : 0;
    const options = [optA, optB, optC, optD];

    if (questionText.length > 10 && options.every(o => o.length > 1)) {
      const explanation = isNl
        ? (rawExplanation
            ? `Het juiste antwoord is ${correctLetter}) ${options[correctIndex]}. ${rawExplanation}`
            : `Het juiste antwoord is ${correctLetter}) ${options[correctIndex]}. Dit sluit direct aan bij de bestudeerde tekst.`)
        : (rawExplanation
            ? `Correct because ${correctLetter}) ${options[correctIndex]}. In Holes, ${rawExplanation}`
            : `Correct because ${correctLetter}) ${options[correctIndex]}. In Holes, chapter evidence directly confirms this.`);

      questions.push({
        type: 'multiple_choice',
        question: questionText,
        options,
        correctIndex,
        explanation,
        quote: options[correctIndex],
        difficulty: isNl ? 'Gemiddeld' : 'Medium'
      });
    }
  }

  return questions;
}

/**
 * Extract pre-formatted Q&A pairs if present in the text (e.g. from Holes_Chapter_Summaries.md)
 */
function extractQAPairs(text) {
  if (!text) return [];
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const pairs = [];

  // Pattern 1: Numbered or bulleted Q&A with flexible colon and asterisks placement
  const regex1 = /(?:^|\n)\s*(?:\d+[\.\)]\s*)?(?:[\*\-]\s*)?\*{0,2}\*?(?:Vraag|Question)\s*(?:[A-Z0-9]+)?[\*:]*\s*([^\n]+)\s*\n\s*(?:[\*\-]\s*)?\*{0,2}\*?(?:Modelantwoord|Model\s*Answer|Antwoord|Answer)[\*:]*\s*([^\n]+)/gi;

  // Pattern 2: Numbered bolded questions followed by Model Answer (e.g. Doc 08 format)
  const regex2 = /(?:^|\n)\s*\d+[\.\)]\s*\*\*([^*\n]+)\*\*\s*\n\s*(?:[\*\-]\s*)?\*{0,2}\*?(?:Model\s*Answer|Modelantwoord|Answer|Antwoord)[\*:]*\s*([^\n]+)/gi;

  let match;
  while ((match = regex1.exec(normalized)) !== null) {
    let q = match[1].replace(/^\*\*|\*\*$/g, '').replace(/^[*_]+|[*_]+$/g, '').trim();
    let a = match[2].replace(/^\*\*|\*\*$/g, '').replace(/^[*_]+|[*_]+$/g, '').trim();
    q = q.replace(/^["']|["']$/g, '').trim();
    a = a.replace(/^["']|["']$/g, '').trim();

    if (q.length > 10 && a.length > 3) {
      if (!pairs.some(p => p.question.toLowerCase() === q.toLowerCase())) {
        pairs.push({ question: q, answer: a });
      }
    }
  }

  while ((match = regex2.exec(normalized)) !== null) {
    let q = match[1].replace(/^\*\*|\*\*$/g, '').replace(/^[*_]+|[*_]+$/g, '').trim();
    let a = match[2].replace(/^\*\*|\*\*$/g, '').replace(/^[*_]+|[*_]+$/g, '').trim();
    q = q.replace(/^["']|["']$/g, '').trim();
    a = a.replace(/^["']|["']$/g, '').trim();

    if (q.length > 10 && a.length > 3) {
      if (!pairs.some(p => p.question.toLowerCase() === q.toLowerCase())) {
        pairs.push({ question: q, answer: a });
      }
    }
  }

  return pairs;
}

/**
 * Extract character identification / definition tables (e.g. Deel 2 of 09_Holes_Exam_QA_Quizzes_and_Flashcards.md)
 */
function extractFlashcardTable(text, lang = null) {
  if (!text) return [];
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const effectiveLang = lang || detectLanguage(normalized);
  const isNl = effectiveLang === 'nl';
  const cards = [];
  const lines = normalized.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) continue;
    if (/^\|[\s\-:|]+\|$/.test(trimmed)) continue; // skip separator row
    const lowerTrimmed = trimmed.toLowerCase();
    if (lowerTrimmed.includes('aanwijzing') || lowerTrimmed.includes('profiel') || lowerTrimmed.includes('relevantie') || lowerTrimmed.includes('definitie') || lowerTrimmed.includes('narrative profile') || lowerTrimmed.includes('clue') || lowerTrimmed.includes('significance') || lowerTrimmed.includes('literal function') || lowerTrimmed.includes('camp nickname')) continue;

    const cells = trimmed.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < 2) continue;

    // Check if one cell contains a bold term / character name
    let termCell = cells.find(c => /\*\*([^*]+)\*\*/.test(c));
    let term = '';
    let explanation = '';

    if (termCell) {
      const boldMatch = termCell.match(/\*\*([^*]+)\*\*/);
      term = boldMatch ? boldMatch[1].trim() : termCell.replace(/[*_`]/g, '').trim();
      const otherCells = cells.filter(c => c !== termCell).map(c => c.replace(/[*_`]/g, '').trim());
      explanation = otherCells.join(' — ');
    } else if (cells.length >= 2) {
      term = cells[0].replace(/[*_`]/g, '').trim();
      explanation = cells.slice(1).map(c => c.replace(/[*_`]/g, '').trim()).join(' — ');
    }

    if (isMeaningfulConceptTerm(term) && explanation.length > 10) {
      if (!cards.some(c => c.front.toLowerCase() === term.toLowerCase())) {
        cards.push({
          category: isNl ? 'Personage & Rol' : 'Character & Role',
          front: term,
          back: explanation,
          frontLabel: isNl ? 'Vraag / Begrip' : 'Concept / Question / Quote',
          backLabel: isNl ? 'Antwoord / Uitleg' : 'Definition / Literary Significance',
          mastered: false
        });
      }
    }
  }

  return cards;
}

/**
 * Interactive Quiz Generator
 * Produces structured 4-option multiple choice questions with feedback, score, and citations
 */
function generateQuiz(text, count = 5, lang = null) {
  if (!text) return [];
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const effectiveLang = lang || detectLanguage(normalized);
  const isNl = effectiveLang === 'nl';
  const sentences = splitSentences(normalized);
  const concepts = extractKeyConcepts(normalized, effectiveLang);

  const questions = [];
  const seenQuestions = new Set();

  // 1. Top priority: Pre-authored Multiple Choice questions (e.g. from 09_Holes_Exam_QA_Quizzes_and_Flashcards.md)
  const preAuthoredMC = extractMCQuestions(normalized, effectiveLang);
  if (preAuthoredMC.length > 0) {
    const shuffledMC = preAuthoredMC.slice().sort(() => Math.random() - 0.5);
    for (const mc of shuffledMC) {
      if (questions.length >= count) break;
      const qKey = mc.question.toLowerCase().trim();
      if (!seenQuestions.has(qKey)) {
        seenQuestions.add(qKey);
        questions.push({
          id: questions.length + 1,
          type: 'multiple_choice',
          question: mc.question,
          options: mc.options,
          correctIndex: mc.correctIndex,
          explanation: mc.explanation,
          quote: mc.quote,
          difficulty: mc.difficulty || (isNl ? 'Gemiddeld' : 'Medium')
        });
      }
    }
  }

  // 2. High priority: Pre-authored Q&A pairs (e.g. from Holes_Chapter_Summaries.md)
  const qaPairs = extractQAPairs(normalized);
  if (qaPairs.length > 0 && questions.length < count) {
    const shuffledPairs = qaPairs.slice().sort(() => Math.random() - 0.5);
    const allAnswers = qaPairs.map(p => p.answer);

    for (const pair of shuffledPairs) {
      if (questions.length >= count) break;
      const qKey = pair.question.toLowerCase().trim();
      if (seenQuestions.has(qKey)) continue;

      // Select 3 distinct distractors
      const candidateDistractors = Array.from(new Set(
        allAnswers.filter(ans => ans.toLowerCase().trim() !== pair.answer.toLowerCase().trim())
      )).sort(() => Math.random() - 0.5);

      const distractors = candidateDistractors.slice(0, 3);

      const fallbackDistractors = isNl
        ? [
            'Dit wordt niet ondersteund door de tekst van Camp Green Lake',
            'Geen van bovenstaande mogelijkheden',
            'Een secundaire maatregel van het jeugdgevangenissysteem',
            'Een eerdere gebeurtenis in Letland'
          ]
        : [
            'Not supported by the Camp Green Lake narrative',
            'None of the above options',
            'A secondary measure of the juvenile correctional system',
            'An earlier historical event in Latvia'
          ];

      for (const fb of fallbackDistractors) {
        if (distractors.length >= 3) break;
        if (!distractors.includes(fb) && fb.toLowerCase() !== pair.answer.toLowerCase()) {
          distractors.push(fb);
        }
      }

      // Shuffle options and record correct index
      const options = [pair.answer, ...distractors]
        .map(v => ({ v, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(item => item.v);

      const correctIndex = options.indexOf(pair.answer);
      seenQuestions.add(qKey);

      questions.push({
        id: questions.length + 1,
        type: 'multiple_choice',
        question: pair.question,
        options,
        correctIndex,
        explanation: isNl
          ? `Het juiste antwoord is: ${pair.answer}. Dit sluit direct aan bij de bestudeerde brontekst.`
          : `Correct because: ${pair.answer}. In Holes, chapter evidence directly confirms this.`,
        quote: pair.answer,
        difficulty: isNl ? 'Gemiddeld' : 'Medium'
      });
    }
  }

  // 3. Medium priority: Multiple choice questions based on key definitions and concepts
  if (concepts.length > 0 && questions.length < count) {
    const allConceptTerms = Array.from(new Set(concepts.map(c => c.term)));
    const shuffledConcepts = concepts.slice().sort(() => Math.random() - 0.5);

    for (const concept of shuffledConcepts) {
      if (questions.length >= count) break;
      const qKey = concept.term.toLowerCase().trim();
      if (seenQuestions.has(qKey)) continue;

      const candidateDistractors = allConceptTerms
        .filter(t => t.toLowerCase() !== concept.term.toLowerCase())
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const fallbackDistractors = isNl
        ? ['Secundair personage', 'Thematisch motief', 'Historische context', 'Literaire tegenstelling']
        : ['Secondary character', 'Thematic motif', 'Historical context', 'Literary foil'];

      for (const fb of fallbackDistractors) {
        if (candidateDistractors.length >= 3) break;
        if (!candidateDistractors.includes(fb) && fb.toLowerCase() !== concept.term.toLowerCase()) {
          candidateDistractors.push(fb);
        }
      }

      const options = [concept.term, ...candidateDistractors]
        .map(v => ({ v, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(item => item.v);

      const correctIndex = options.indexOf(concept.term);
      seenQuestions.add(qKey);

      const qPrompt = isNl
        ? `Welk begrip of personage past bij de volgende beschrijving: "${concept.explanation.slice(0, 160)}${concept.explanation.length > 160 ? '...' : ''}"?`
        : `Which concept or character matches the following description: "${concept.explanation.slice(0, 160)}${concept.explanation.length > 160 ? '...' : ''}"?`;

      questions.push({
        id: questions.length + 1,
        type: 'multiple_choice',
        question: qPrompt,
        options,
        correctIndex,
        explanation: isNl
          ? `Het juiste antwoord is **${concept.term}**. Dit sluit direct aan bij de beschrijving in de bronnen.`
          : `Correct because **${concept.term}** directly matches the description. In Holes, this key concept is central to the narrative.`,
        quote: concept.explanation.slice(0, 200),
        difficulty: isNl ? 'Gemiddeld' : 'Medium'
      });
    }
  }

  // 4. Fallback: Cloze / Fact completion questions based on key sentences
  if (questions.length < count && sentences.length > 0) {
    const candidateSentences = sentences
      .filter(s => s.length > 40 && s.length < 180 && !seenQuestions.has(s.toLowerCase()))
      .sort(() => Math.random() - 0.5);

    for (const sent of candidateSentences) {
      if (questions.length >= count) break;

      // Extract a prominent word or phrase to blank out
      const words = sent.split(/\s+/);
      if (words.length < 6) continue;

      const midIndex = Math.floor(words.length / 2);
      const targetPhrase = words.slice(midIndex, midIndex + 2).join(' ').replace(/[.,:;!?]$/, '');
      if (targetPhrase.length < 4) continue;

      const blanked = words.slice(0, midIndex).join(' ') + ' [ ... ] ' + words.slice(midIndex + 2).join(' ');

      const fallbackOptions = isNl
        ? ['een andere keuze', 'de Directrice', 'de woestijn van Texas', 'Camp Green Lake']
        : ['an alternative choice', 'the Warden', 'the Texas desert', 'Camp Green Lake'];

      const distractors = fallbackOptions
        .filter(opt => opt.toLowerCase() !== targetPhrase.toLowerCase())
        .slice(0, 3);

      const options = [targetPhrase, ...distractors]
        .map(v => ({ v, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(item => item.v);

      const correctIndex = options.indexOf(targetPhrase);
      seenQuestions.add(sent.toLowerCase());

      questions.push({
        id: questions.length + 1,
        type: 'multiple_choice',
        question: (isNl ? 'Vul de ontbrekende woorden aan volgens de tekst:\n\n"' : 'Fill in the missing words according to the text:\n\n"') + blanked + '"',
        options,
        correctIndex,
        explanation: isNl
          ? `Het juiste antwoord is: "${targetPhrase}". Volledige zin: "${sent}"`
          : `Correct because "${targetPhrase}". In Holes, the full text reads: "${sent}"`,
        quote: sent,
        difficulty: isNl ? 'Makkelijk' : 'Easy'
      });
    }
  }

  return questions.slice(0, count);
}

/**
 * Flashcards Generator
 * Produces front/back study cards from character tables, Q&A study facts, and key concepts
 */
function generateFlashcards(text, lang = null) {
  if (!text) return [];
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const effectiveLang = lang || detectLanguage(normalized);
  const isNl = effectiveLang === 'nl';
  const cards = [];
  const seenFronts = new Set();

  // 1. Top priority: Dedicated flashcard / character profile tables
  const tableCards = extractFlashcardTable(normalized, effectiveLang);
  for (const tc of tableCards) {
    const key = tc.front.toLowerCase().trim();
    if (!seenFronts.has(key)) {
      seenFronts.add(key);
      cards.push({
        id: cards.length + 1,
        category: tc.category || (isNl ? 'Personage & Rol' : 'Character & Role'),
        front: tc.front,
        back: tc.back,
        frontLabel: isNl ? 'Vraag / Begrip' : 'Concept / Question / Quote',
        backLabel: isNl ? 'Antwoord / Uitleg' : 'Definition / Literary Significance',
        mastered: false
      });
    }
  }

  // 2. High priority: Q&A study facts (Question on front, Answer on back)
  const qaPairs = extractQAPairs(normalized);
  for (const pair of qaPairs) {
    if (cards.length >= 25) break;
    const key = pair.question.toLowerCase().trim();
    if (!seenFronts.has(key)) {
      seenFronts.add(key);
      cards.push({
        id: cards.length + 1,
        category: isNl ? 'Studiefeit' : 'Study Fact',
        front: pair.question,
        back: pair.answer,
        frontLabel: isNl ? 'Vraag / Begrip' : 'Concept / Question / Quote',
        backLabel: isNl ? 'Antwoord / Uitleg' : 'Definition / Literary Significance',
        mastered: false
      });
    }
  }

  // 3. Medium priority: Extracted key concepts and definitions
  const concepts = extractKeyConcepts(normalized, effectiveLang);
  for (const c of concepts) {
    if (cards.length >= 30) break;
    const key = c.term.toLowerCase().trim();
    if (!seenFronts.has(key)) {
      seenFronts.add(key);
      cards.push({
        id: cards.length + 1,
        category: isNl ? 'Kernbegrip' : 'Core Concept',
        front: c.term,
        back: c.explanation,
        frontLabel: isNl ? 'Vraag / Begrip' : 'Concept / Question / Quote',
        backLabel: isNl ? 'Antwoord / Uitleg' : 'Definition / Literary Significance',
        mastered: false
      });
    }
  }

  // 4. Fallback: prompt questions from top scored sentences
  if (cards.length < 6) {
    const sentences = splitSentences(normalized);
    const scored = scoreSentences(sentences, effectiveLang).slice(0, 8);
    for (const item of scored) {
      if (cards.length >= 10) break;
      const words = item.sentence.split(/\s+/);
      const prompt = words.slice(0, 4).join(' ') + '...?';
      cards.push({
        id: cards.length + 1,
        category: isNl ? 'Inzicht' : 'Key Insight',
        front: prompt,
        back: item.sentence,
        frontLabel: isNl ? 'Vraag / Begrip' : 'Concept / Question / Quote',
        backLabel: isNl ? 'Antwoord / Uitleg' : 'Definition / Literary Significance',
        mastered: false
      });
    }
  }

  return cards;
}

/**
 * Study Guide Generator
 */
function generateStudyGuide(text, title = 'Study Guide', lang = null) {
  if (!text) return '';
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const effectiveLang = lang || detectLanguage(normalized);
  const isNl = effectiveLang === 'nl';
  const concepts = extractKeyConcepts(normalized, effectiveLang);
  const qaPairs = extractQAPairs(normalized);
  const summary = generateSummary(normalized, 'bullets', effectiveLang);

  const glossary = concepts.slice(0, 10).map(c => `**${c.term}**\n: ${c.explanation}`).join('\n\n');

  let studyQuestions = '';
  if (qaPairs.length > 0) {
    studyQuestions = qaPairs.slice(0, 6).map((pair, i) => {
      return isNl
        ? `${i + 1}. **${pair.question}**\n   *Antwoord:* ${pair.answer}`
        : `${i + 1}. **${pair.question}**\n   *Answer:* ${pair.answer}`;
    }).join('\n\n');
  } else {
    studyQuestions = concepts.slice(0, 5).map((c, i) => {
      return isNl
        ? `${i + 1}. **Hoe definieer je '${c.term}' en wat is de rol hiervan binnen het onderwerp?**\n   *Antwoord:* ${c.explanation}`
        : `${i + 1}. **How do you define '${c.term}' and what role does it play?**\n   *Answer:* ${c.explanation}`;
    }).join('\n\n');
  }

  if (isNl) {
    return `# Studiegids: ${title}

## 1. Overzicht & Belangrijkste Doelstellingen
De kernpunten uit de bestudeerde bronnen:

${summary}

---

## 2. Begrippenlijst & Terminologie
Essentiële definities en concepten die je moet beheersen:

${glossary || '*Geen specifieke termen geëxtraheerd.*'}

---

## 3. Belangrijke Vragen voor Zelfstudie & Toetsing
Test je kennis met deze vragen:

${studyQuestions || '*Geen zelfstudievragen beschikbaar.*'}

---

## 4. Tips voor Toepassing
- Lees de bronnen aandachtig door en probeer elk begrip in eigen woorden uit te leggen.
- Gebruik de ingebouwde quiz om je parate kennis te testen.
`;
  } else {
    // Extract chapter breakdown if chapters exist in text, or provide Holes chapter structure
    const chapterMatches = normalized.match(/(?:###?\s*(?:Chapter|Hoofdstuk)\s*\d+[^#\n]*)/gi) || [];
    let chapterBreakdown = '';
    if (chapterMatches.length > 0) {
      chapterBreakdown = chapterMatches.slice(0, 8).map(ch => `- **${ch.replace(/^#+\s*/, '')}**: Core plot developments, character decisions, and thematic motifs.`).join('\n\n');
    } else {
      chapterBreakdown = `- **Part One: You Are Entering Camp Green Lake (Chapters 1–28)**: Stanley Yelnats is unjustly convicted and sent to Camp Green Lake. He endures brutal physical labor, digs holes five feet deep and wide, and forms an alliance with Zero.\n\n- **Part Two: The History of Green Lake & The Curse (Chapters 29–49)**: The tragedy of Katherine Barlow and Sam 110 years earlier is revealed. Stanley and Zero escape into the desert, climb God's Thumb, survive on sweet onions, and Stanley fulfills the ancient promise to Madame Zeroni.\n\n- **Part Three: Filling in the Holes (Chapter 50)**: Stanley and Zero uncover the Yelnats suitcase, survive the yellow-spotted lizards, are exonerated, and the generational curse is broken.`;
    }

    return `# Study Guide: ${title}
*Comprehensive Literature Exam Syllabus & Studiegids*

## 1. Overview
Key literary takeaways and overarching themes from the analyzed sources:

${summary}

---

## 2. Key Terms & Character Glossary
Essential terms, characters, and literary motifs to master for the exam:

${glossary || '*No specific terms extracted.*'}

---

## 3. Core Discussion & Exam Questions
Test your critical analysis and analytical writing skills:

${studyQuestions || '*No study questions available.*'}

---

## 4. Chapter Breakdown
${chapterBreakdown}
`;
  }
}

/**
 * FAQ Generator
 */
function generateFaq(text, lang = null) {
  if (!text) return [];
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const effectiveLang = lang || detectLanguage(normalized);
  const isNl = effectiveLang === 'nl';
  const qaPairs = extractQAPairs(normalized);
  const concepts = extractKeyConcepts(normalized, effectiveLang);
  const sentences = splitSentences(normalized);

  const faqs = [];

  // 1. Pre-authored Q&A if present
  for (const pair of qaPairs.slice(0, 5)) {
    faqs.push({
      question: pair.question,
      answer: pair.answer
    });
  }

  // 2. Concepts as questions
  if (faqs.length < 5) {
    for (const c of concepts.slice(0, 5 - faqs.length)) {
      faqs.push({
        question: isNl ? `Wat is ${c.term} en waarom is het belangrijk?` : `What is ${c.term} and why is it important in Holes?`,
        answer: c.explanation
      });
    }
  }

  // 3. Conclusion question
  if (sentences.length > 3 && faqs.length < 6) {
    faqs.push({
      question: isNl ? 'Wat is de belangrijkste conclusie uit de tekst?' : 'What is the main literary takeaway from Louis Sachar\'s Holes?',
      answer: generateSummary(normalized, 'tldr', effectiveLang)
    });
  }

  return faqs;
}

/**
 * Audio Overview (2-Host Podcast Deep Dive) Generator
 * Simulates an engaging audio overview featuring two conversational hosts
 */
function generateAudioOverview(text, title = 'Document', lang = null, customHosts = null) {
  if (!text) text = '';
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const effectiveLang = lang || detectLanguage(normalized);
  const isNl = effectiveLang === 'nl';
  const concepts = extractKeyConcepts(normalized, effectiveLang);
  const summarySentences = splitSentences(normalized).slice(0, 6);

  const defaultHost1 = isNl ? 'Daan' : 'Leo';
  const defaultHost2 = isNl ? 'Sophie' : 'Maya';

  const host1 = (customHosts && customHosts[0]) || defaultHost1;
  const host2 = (customHosts && customHosts[1]) || defaultHost2;

  const script = [];

  if (isNl) {
    // 1. Intro
    script.push({
      speaker: host1,
      voice: 'male',
      text: `Welkom bij onze Deep Dive! Vandaag duiken we in een fascinerend onderwerp: ${title}. ${host2}, ik heb de aantekeningen doorgenomen en er zitten echt verrassende inzichten in.`
    });

    script.push({
      speaker: host2,
      voice: 'female',
      text: `Zeker weten, ${host1}. Wat me meteen opviel is hoe helder de kernboodschap naar voren komt. Laten we bij het begin beginnen.`
    });

    // 2. Core discussion based on sentences & concepts
    if (summarySentences.length > 0) {
      script.push({
        speaker: host1,
        voice: 'male',
        text: `Precies. Kijk naar dit punt: "${summarySentences[0]}". Dat legt eigenlijk meteen het fundament, toch?`
      });
    }

    if (concepts.length > 0) {
      const c1 = concepts[0];
      script.push({
        speaker: host2,
        voice: 'female',
        text: `Ja, en dat sluit naadloos aan bij wat de bronnen uitleggen over ${c1.term}. Namelijk: ${c1.explanation}. Dat is geen toeval.`
      });
    }

    if (concepts.length > 1) {
      const c2 = concepts[1];
      script.push({
        speaker: host1,
        voice: 'male',
        text: `Wauw, dat verklaart een hoop. Maar hoe zit het dan met ${c2.term}? Want dat leek me op het eerste gezicht best ingewikkeld.`
      });

      script.push({
        speaker: host2,
        voice: 'female',
        text: `Dat valt reuze mee als je de logica volgt: ${c2.explanation}. Zodra je die link ziet, valt de hele puzzel op zijn plek!`
      });
    }

    // 3. Outro
    script.push({
      speaker: host1,
      voice: 'male',
      text: `Prachtig samengevat. Als onze luisteraars één ding moeten onthouden van ${title}, dan is het wel hoe deze ideeën elkaar versterken.`
    });

    script.push({
      speaker: host2,
      voice: 'female',
      text: `Absoluut. Blijf nieuwsgierig, neem de tijd om de interactieve quiz te doen, en tot de volgende Deep Dive!`
    });
  } else {
    // 1. Intro (English - Leo & Maya)
    script.push({
      speaker: host1,
      voice: 'male',
      text: `Welcome to our Deep Dive study podcast! Today we are exploring Louis Sachar's classic novel Holes and dissecting its central themes for the English literature exam. ${host2}, examining these study materials reveals just how intricately crafted this novel really is.`
    });

    script.push({
      speaker: host2,
      voice: 'female',
      text: `Absolutely, ${host1}! What stands out immediately is how Louis Sachar weaves three distinct historical timelines across more than a century. On the surface, it's about Stanley Yelnats IV being unjustly sentenced to Camp Green Lake, but the narrative runs much deeper.`
    });

    // 2. Stanley's transformation
    script.push({
      speaker: host1,
      voice: 'male',
      text: `That transformation is central to any exam essay. When Stanley first arrives at Camp Green Lake, he is overweight, timid, and passively blames his bad luck on his 'no-good-dirty-rotten-pig-stealing-great-great-grandfather'. But the grueling discipline of digging five-foot holes in the Texas heat forces him to discover genuine resilience.`
    });

    script.push({
      speaker: host2,
      voice: 'female',
      text: `Exactly. And that physical stamina transforms into moral courage when he befriends Hector Zeroni—Zero. Even though the counselors and boys in Tent D dismiss Zero as having nothing inside his head, Stanley recognizes Zero's sharp math skills and agrees to teach him to read in exchange for digging help.`
    });

    if (summarySentences.length > 0) {
      script.push({
        speaker: host1,
        voice: 'male',
        text: `The source text puts it powerfully: "${summarySentences[0]}". That shows that their bond is built on mutual respect rather than exploitation.`
      });
    }

    // 3. Friendship, God's Thumb, and the Curse
    script.push({
      speaker: host2,
      voice: 'female',
      text: `And that friendship reaches its peak when Stanley risks his life in the desert to find Zero, carrying him up God's Thumb. Without knowing it, Stanley carrying Hector up the mountain and singing Madame Zeroni's lullaby fulfills the 110-year-old family promise made by Elya Yelnats, officially breaking the curse!`
    });

    if (concepts.length > 0) {
      const c1 = concepts[0];
      script.push({
        speaker: host1,
        voice: 'male',
        text: `And notice how Sachar connects this to ${c1.term}: ${c1.explanation}. Everything in the novel serves a narrative and symbolic purpose.`
      });
    }

    // 4. Motifs & Outro
    script.push({
      speaker: host2,
      voice: 'female',
      text: `Think about the recurring motifs: the sweet onions of Sam that keep them alive, the deadly yellow-spotted lizards who avoid onion juice, Stanley's palindromic name, and Kissin' Kate Barlow's buried treasure. Fate, justice, and friendship all converge when the Yelnats suitcase is finally unearthed.`
    });

    script.push({
      speaker: host1,
      voice: 'male',
      text: `Brilliantly analyzed, ${host2}. For students taking the exam, remember to focus on Stanley's moral growth, Sachar's motifs of water and destiny, and how loyalty triumphs over systemic cruelty.`
    });

    script.push({
      speaker: host2,
      voice: 'female',
      text: `Stay curious, review the key quotes in the Study Guide, and test yourself with the interactive quiz. See you on the next Deep Dive!`
    });
  }

  return {
    title: `${isNl ? 'Audio Overzicht' : 'Audio Overview'}: ${title}`,
    hosts: [host1, host2],
    language: effectiveLang,
    script
  };
}

/**
 * Grounded Q&A / Search Engine
 * Chunks documents, scores relevance, extracts exact citations, and generates response
 */
function answerQuestionGrounded(query, documents = []) {
  if (!query || documents.length === 0) {
    return {
      answer: 'No sources found for this query.',
      citations: []
    };
  }

  const queryTerms = query.toLowerCase().match(/[a-zà-ÿ0-9]+/g) || [];
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'for', 'of', 'with', 'as', 'by', 'that', 'this', 'it', 'from', 'what', 'how', 'why', 'who',
    'de', 'het', 'een', 'van', 'en', 'wat', 'hoe', 'wie', 'waar', 'waarom', 'are'
  ]);
  const meaningfulTerms = queryTerms.filter(t => !stopWords.has(t) && t.length > 2);

  // Chunk documents into paragraphs
  const rawChunks = [];
  for (const doc of documents) {
    const rawParagraphs = (doc.content || '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').split(/\n\s*\n/);
    for (let pIdx = 0; pIdx < rawParagraphs.length; pIdx++) {
      const p = cleanMarkdown(rawParagraphs[pIdx]).trim();
      if (p.length < 30) continue;

      const pLower = p.toLowerCase();
      let matchScore = 0;

      for (const term of meaningfulTerms) {
        if (pLower.includes(term)) {
          matchScore += 2;
          // Count word boundary matches
          const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const occurrences = (pLower.match(new RegExp(`\\b${escaped}\\b`, 'g')) || []).length;
          matchScore += occurrences * 1.5;
        }
      }

      // Check phrase match
      if (meaningfulTerms.length > 1) {
        const fullPhrase = meaningfulTerms.join(' ');
        if (pLower.includes(fullPhrase)) {
          matchScore += 5;
        }
      }

      if (matchScore > 0) {
        rawChunks.push({
          sourceName: doc.name,
          paragraphIndex: pIdx + 1,
          text: p,
          score: matchScore
        });
      }
    }
  }

  // Sort by score
  rawChunks.sort((a, b) => b.score - a.score);

  // Deduplicate chunks to prevent identical content between .md and .txt versions
  const seenSignatures = new Set();
  const topChunks = [];
  for (const chunk of rawChunks) {
    if (topChunks.length >= 4) break;
    // Create signature from first 60 characters of text
    const signature = chunk.text.slice(0, 60).toLowerCase().replace(/\s+/g, ' ');
    if (!seenSignatures.has(signature)) {
      seenSignatures.add(signature);
      topChunks.push(chunk);
    }
  }

  const lang = detectLanguage(query + ' ' + (documents[0]?.content || ''));
  const isNl = lang === 'nl';

  if (topChunks.length === 0) {
    return {
      answer: 'No sources found for this query.',
      citations: []
    };
  }

  // Build citations list
  const citations = topChunks.map((chunk, idx) => ({
    id: idx + 1,
    source: chunk.sourceName,
    paragraph: chunk.paragraphIndex,
    quote: chunk.text.slice(0, 240) + (chunk.text.length > 240 ? '...' : ''),
    format: `📌 Source [${idx + 1}]: ${chunk.sourceName} (Paragraph [${chunk.paragraphIndex}])`,
    label: `📌 Source ${idx + 1}: ${chunk.sourceName} (Paragraph ${chunk.paragraphIndex})`,
    score: chunk.score
  }));

  // Build clean grounded response without hardcoded [1] in header
  let synthesizedAnswer = '';
  if (isNl) {
    synthesizedAnswer = `Op basis van de geselecteerde bronnen:\n\n`;
    for (let i = 0; i < topChunks.length; i++) {
      const c = topChunks[i];
      const sents = splitSentences(c.text);
      const snippet = sents.slice(0, 2).join(' ') || c.text.slice(0, 150);
      synthesizedAnswer += `- ${snippet} [${i + 1}]\n`;
    }
  } else {
    synthesizedAnswer = `Based on the selected sources:\n\n`;
    for (let i = 0; i < topChunks.length; i++) {
      const c = topChunks[i];
      const sents = splitSentences(c.text);
      const snippet = sents.slice(0, 2).join(' ') || c.text.slice(0, 150);
      synthesizedAnswer += `- ${snippet} [${i + 1}]\n`;
    }
  }

  return {
    answer: synthesizedAnswer.trim(),
    citations
  };
}

/**
 * Optional Generative AI caller (Gemini) if API key is provided
 */
async function callGeminiIfKeyAvailable(prompt, apiKey) {
  if (!apiKey) return null;
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (err) {
    return null;
  }
}

/**
 * Feature F1: Triple-Narrative Timeline Events for Holes Literature Exam
 * Provides synchronized historical events across Era A (Latvia), Era B (Old Green Lake),
 * and Era C (Camp Green Lake), with GCSE/A-Level AO2 structure analysis and essay prompts.
 */
function getTimelineEvents() {
  return [
    {
      id: 'step1-era-a',
      stepIndex: 1,
      eraKey: 'era-a',
      eraName: 'Era A: Latvia (1880s)',
      chapter: 'Ch. 7',
      title: "Madame Zeroni's Pig Promise",
      characterAnchors: ['Elya Yelnats', 'Madame Zeroni', 'Myra Menke'],
      summary: 'In Latvia, 15-year-old Elya Yelnats falls in love with Myra Menke. Madame Zeroni gives him a runt piglet and instructs him to carry it up the mountain every day to drink from the stream while singing a special lullaby. In return, Elya must carry Madame Zeroni up the mountain before leaving for America.',
      themes: ['Generational Curse', 'Fate vs Free Will', 'Moral Debt'],
      convergenceId: 'pig-lullaby',
      quote: '"If you forget to come back for Madame Zeroni, you and your family will be cursed for always and eternity!"',
      ao2Analysis: "Establishes the novel's foundational folklore archetype. Sachar uses the broken promise to set up a 110-year multi-generational moral deficit rather than an inescapable supernatural doom.",
      essayTip: 'Emphasize that the curse is rooted in an unpaid debt of human gratitude and care, which prepares the reader for its moral redemption in Chapter 39.'
    },
    {
      id: 'step1-era-c',
      stepIndex: 1,
      eraKey: 'era-c',
      eraName: 'Era C: Camp Green Lake (1990s)',
      chapter: 'Ch. 1-3',
      title: "Stanley IV & The Great-Great-Grandfather's Curse",
      characterAnchors: ['Stanley Yelnats IV', 'Mr. Sir', 'Clyde Livingston'],
      summary: 'Stanley Yelnats IV is unjustly convicted of stealing baseball star Clyde Livingston\'s sneakers and sent to Camp Green Lake. His family blames their persistent bad luck on his "no-good-dirty-rotten-pig-stealing-great-great-grandfather".',
      themes: ['Generational Curse', 'Institutional Cruelty', 'Fate vs Free Will'],
      convergenceId: 'pig-lullaby',
      quote: '"Whenever anything went wrong for a Yelnats, they blamed Stanley\'s no-good-dirty-rotten-pig-stealing-great-great-grandfather."',
      ao2Analysis: 'Sachar uses dramatic irony: the reader and Stanley believe the curse is a comedic family superstition, but structural plotting reveals every piece of misfortune is actually steering Stanley towards cosmic reconciliation.',
      essayTip: 'Notice the ironic refrain of the family scapegoat motif. Show how Sachar subverts defeatism into agency.'
    },
    {
      id: 'step2-era-a',
      stepIndex: 2,
      eraKey: 'era-a',
      eraName: 'Era A: Latvia (1880s)',
      chapter: 'Ch. 7',
      title: "The Broken Oath & Emigration to America",
      characterAnchors: ['Elya Yelnats', 'Myra Menke', 'Sarah Miller'],
      summary: 'When Myra Menke cannot choose between Elya and Igor, Elya realizes her shallowness and walks away. Heartbroken and ashamed, he boards a ship to America without carrying Madame Zeroni up the mountain. In America, he marries Sarah Miller and translates the lullaby into English.',
      themes: ['Generational Curse', 'Regret & Memory'],
      convergenceId: 'lullaby-migration',
      quote: '"He remembered his promise to Madame Zeroni. He had forgotten to carry her up the mountain."',
      ao2Analysis: 'The transition across the Atlantic mirrors the migration of cultural folklore into American historical realism, setting up the parallel between Latvian mountains and Texan hills.',
      essayTip: 'Trace how Sarah Miller\'s lyrical translation preserves the melody while altering the words, symbolizing cultural adaptation.'
    },
    {
      id: 'step2-era-c',
      stepIndex: 2,
      eraKey: 'era-c',
      eraName: 'Era C: Camp Green Lake (1990s)',
      chapter: 'Ch. 4-6',
      title: "Tent D & The Discipline of Shovels",
      characterAnchors: ['Stanley Yelnats IV', 'Mr. Sir', 'Mr. Pendanski', 'X-Ray'],
      summary: 'Stanley is issued his orange jumpsuit and a five-foot shovel. Mr. Sir informs him he must dig one hole every day, five feet deep and five feet wide, under scorching Texas sun to "build character". He meets his Tent D bunkmates: X-Ray, Armpit, Squid, Zigzag, Magnet, and Zero.',
      themes: ['Institutional Cruelty', 'Injustice', 'Dehumanization'],
      convergenceId: 'digging-holes',
      quote: '"You take one shovel at a time, that\'s all. Nobody said it was going to be fun."',
      ao2Analysis: 'Sachar satirizes juvenile penal institutions by contrasting the euphemistic "character building" with grueling physical exploitation hiding an illicit treasure hunt.',
      essayTip: 'Examine the symbolism of the 5x5ft hole: physically isolating each boy in an identical grave-like pit to suppress solidarity.'
    },
    {
      id: 'step3-era-b',
      stepIndex: 3,
      eraKey: 'era-b',
      eraName: 'Era B: Old Green Lake (1888)',
      chapter: 'Ch. 23-25',
      title: "Katherine Barlow, Sam & The Green Lake Paradise",
      characterAnchors: ['Katherine Barlow', 'Sam the Onion Man', 'Mary Lou', 'Charles "Trout" Walker'],
      summary: '110 years earlier, Green Lake is a vibrant town nestled around a deep, clear peach-lined lake. Katherine Barlow is the beloved schoolteacher known for her award-winning spiced peaches. Sam, an African American onion seller, sells medicinal wild onions from his boat and donkey named Mary Lou. Rich, arrogant Trout Walker pursues Katherine but is refused.',
      themes: ['Class Entitlement', 'Nature & Healing', 'Racism & Social Hierarchy'],
      convergenceId: 'onions-peaches',
      quote: '"The secret is in the onions, Miss Katherine. God\'s own cure-all."',
      ao2Analysis: 'Pastoral idyllic exposition: Sachar contrasts the lush fertility of 1880s Green Lake with the desiccated wasteland of modern Camp Green Lake to emphasize environmental and moral drought.',
      essayTip: 'Analyze the peach and onion pairing: peaches represent sweet human artifice, while onions represent natural vitality and divine providence.'
    },
    {
      id: 'step4-era-b',
      stepIndex: 4,
      eraKey: 'era-b',
      eraName: 'Era B: Old Green Lake (1888)',
      chapter: 'Ch. 26',
      title: "The Lynch Mob, Sam's Murder & The 110-Year Drought",
      characterAnchors: ['Katherine Barlow', 'Sam the Onion Man', 'Trout Walker', 'Sheriff'],
      summary: 'Katherine and Sam share a romantic kiss in the rain outside the schoolhouse. Racist hysteria erupts in town. An angry mob led by Trout Walker burns down the schoolhouse. While fleeing across the lake in Sam\'s boat Mary Lou, Sam is shot and killed by Trout Walker. The drunk sheriff refuses to intervene. From that day onward, not a drop of rain falls on Green Lake for 110 years.',
      themes: ['Racism & Institutional Corruption', 'Retribution & Curse', 'Tragedy'],
      convergenceId: 'drought-curse',
      quote: '"You kissed the onion picker! That is against the law." / "God will punish you!"',
      ao2Analysis: "Biblical and ecological retribution: the landscape dries up as a physical manifestation of communal blood-guilt and racial injustice. The drought is nature's boycott of human cruelty.",
      essayTip: 'Discuss how Sachar connects institutionalized racism to environmental ruin, making Green Lake literally "die of thirst" when it murders love.'
    },
    {
      id: 'step5-era-b',
      stepIndex: 5,
      eraKey: 'era-b',
      eraName: 'Era B: Old Green Lake (1888-1890s)',
      chapter: 'Ch. 28, 31',
      title: "Kissin' Kate Barlow & The Robbery of Stanley I",
      characterAnchors: ['Kissin\' Kate Barlow', 'Stanley Yelnats I'],
      summary: 'Grief-stricken, Katherine shoots the sheriff, kisses him with red lipstick, and becomes the notorious outlaw "Kissin\' Kate Barlow". Over two decades she robs banks and stagecoaches across the West. She robs Stanley Yelnats I of his entire New York banking fortune, leaving him stranded in the desert without water.',
      themes: ['Revenge & Grief', 'Parallel Destinies'],
      convergenceId: 'the-suitcase',
      quote: '"She left him stranded in the middle of nowhere... He said he found refuge on God\'s Thumb."',
      ao2Analysis: 'Structural knotting: Kissin\' Kate connects the Yelnats family destiny with the Walker family destiny. Stanley I\'s loss creates the Yelnats family poverty that later forces Stanley IV to live in a cramped apartment.',
      essayTip: 'Notice the double irony: the very bandit who ruined Stanley\'s great-grandfather will ultimately provide the wealth that restores his family in Chapter 50.'
    },
    {
      id: 'step5-era-c',
      stepIndex: 5,
      eraKey: 'era-c',
      eraName: 'Era C: Camp Green Lake (1990s)',
      chapter: 'Ch. 13-16',
      title: "The KB Lipstick Tube & The Warden's Obsession",
      characterAnchors: ['Stanley Yelnats IV', 'The Warden (Louise Walker)', 'X-Ray'],
      summary: 'While digging his second hole, Stanley discovers a small gold tube engraved with the initials "KB" and an outline of a heart. X-Ray claims the find to get a day off. Warden Louise Walker recognizes the relic of Kate Barlow and orders the boys to dig double shifts, shifting their work to the wrong hole.',
      themes: ['Greed & Exploitation', 'Generational Obsession', 'Dramatic Irony'],
      convergenceId: 'the-gold-tube',
      quote: '"The Warden walked over to X-Ray\'s hole... \'You boys take your time, and be careful.\'"',
      ao2Analysis: 'Dramatic irony: the reader recognizes "KB" as Katherine Barlow long before the boys do. The Warden\'s digging regime exposes the true corrupt purpose of Camp Green Lake as an unauthorized family excavation.',
      essayTip: 'Highlight how Trout Walker\'s financial ruin passes down three generations to Louise Walker, mirroring the Yelnats generational timeline.'
    },
    {
      id: 'step6-era-c',
      stepIndex: 6,
      eraKey: 'era-c',
      eraName: 'Era C: Camp Green Lake (1990s)',
      chapter: 'Ch. 21-27',
      title: "The Literacy Bargain & The Bond Between Outcasts",
      characterAnchors: ['Stanley Yelnats IV', 'Hector Zeroni (Zero)'],
      summary: 'Stanley discovers that Zero cannot read. Zero strikes a deal: he will dig one hour of Stanley\'s hole each day in exchange for reading and writing lessons. The other boys resent the arrangement, leading to escalating racial and social friction in Tent D.',
      themes: ['Education & Literacy', 'Friendship & Solidarity', 'Overcoming Prejudice'],
      convergenceId: 'reading-solidarity',
      quote: '"I\'m not stupid," Zero said. "I know everybody thinks I am, but I\'m not. I just don\'t know things."',
      ao2Analysis: 'Sachar subverts social stratification: Zero, dismissed as a brainless non-person by the counselors, proves to possess rapid mathematical and intellectual aptitude once given access to literacy.',
      essayTip: 'Argue that literacy in Holes is an instrument of liberation. Teaching Zero to read directly counterbalances the educational deprivation enforced on Sam and Zero.'
    },
    {
      id: 'step7-era-b',
      stepIndex: 7,
      eraKey: 'era-b',
      eraName: 'Era B: Old Green Lake (1908)',
      chapter: 'Ch. 28',
      title: "Kate's Death & The Yellow-Spotted Lizard",
      characterAnchors: ['Kate Barlow', 'Trout Walker', 'Linda Miller'],
      summary: 'Twenty years after Sam\'s death, an aged Kate returns to the dry lakebed. Bankrupt Trout Walker and Linda Miller track her down and torture her to find where she buried her stolen loot. A lethal yellow-spotted lizard bites Kate\'s bare ankle; she dies laughing, taking the secret of the treasure to her grave.',
      themes: ['Poetic Justice', 'Karma', 'Nature as Judge'],
      convergenceId: 'lizards-treasure',
      quote: '"Start digging," Kate Barlow whispered, laughing her last breath. "The lizard\'s got my kiss now."',
      ao2Analysis: "Nature's poetic vengeance: the yellow-spotted lizards, creatures born of the drought caused by racism, become the lethal guardians of the buried truth, frustrating Walker greed for 90 years.",
      essayTip: 'Show how Kate\'s defiant death transforms the lizards from environmental hazards into instruments of cosmic justice.'
    },
    {
      id: 'step7-era-c',
      stepIndex: 7,
      eraKey: 'era-c',
      eraName: 'Era C: Camp Green Lake (1990s)',
      chapter: 'Ch. 29-32',
      title: "The Rebellion, The Shovel Strike & Zero's Escape",
      characterAnchors: ['Hector Zeroni (Zero)', 'Mr. Pendanski', 'The Warden', 'Stanley'],
      summary: 'During an inspection, Mr. Pendanski viciously humiliates Zero, claiming an animal has more brains. Zero violently hits Pendanski with his shovel and walks out into the blazing desert alone. The Warden orders his records destroyed to erase evidence of his existence.',
      themes: ['Institutional Dehumanization', 'Resistance', 'Cruelty'],
      convergenceId: 'escape-desert',
      quote: '"What are you going to dig with?" Mr. Pendanski called after him. Zero didn\'t answer. He just kept walking."',
      ao2Analysis: 'The climactic breakdown of institutional control: Zero chooses mortal desert dehydration over continued spiritual degradation at the hands of pseudo-civilized authority.',
      essayTip: 'Compare Zero\'s shovel strike with Kate Barlow\'s pistol shot: both represent the final breaking point of marginalized figures pushed beyond endurance.'
    },
    {
      id: 'step8-era-c',
      stepIndex: 8,
      eraKey: 'era-c',
      eraName: 'Era C: Camp Green Lake (1990s)',
      chapter: 'Ch. 35-36',
      title: "The Mary Lou Wreck & The Miracle of Sploosh",
      characterAnchors: ['Stanley Yelnats IV', 'Hector Zeroni (Zero)'],
      summary: 'Stanley steals the camp water truck to rescue Zero, crashes into a hole, and journeys on foot into the dry lakebed. He discovers the upside-down hull of Sam\'s old boat, the Mary Lou. Inside, Zero has survived for days drinking "Sploosh"—the 110-year-old fermented spiced peaches canned by Katherine Barlow.',
      themes: ['Survival & Providence', 'Historical Continuity', 'Friendship'],
      convergenceId: 'onions-peaches',
      quote: '"He saw a boat, upside down in the sand... On the side, faded letters spelled out M-A-R-Y L-O-U."',
      ao2Analysis: "Structural genius: the physical artifact of Sam's boat and Kate's canned peaches from 1888 directly saves the life of Madame Zeroni's descendant in 1990, proving no act of love is ever wasted in Sachar's universe.",
      essayTip: 'Analyze the symbolic resurrection of Mary Lou: Sam\'s love continues to protect innocent outcasts a century after his murder.'
    },
    {
      id: 'step9-era-a',
      stepIndex: 9,
      eraKey: 'era-a',
      eraName: 'Era A: Latvia (1880s)',
      chapter: 'Ch. 7',
      title: "The Pig on the Mountain",
      characterAnchors: ['Elya Yelnats', 'Madame Zeroni'],
      summary: 'In Latvia, Elya carries the piglet up the mountain every day, singing the song Madame Zeroni taught him: "If only, if only, the woodpecker sighs, the bark on the tree was as soft as the skies...". The pig grows immense and strong, as does Elya himself.',
      themes: ['Discipline', 'Strength through Struggle'],
      convergenceId: 'mountain-climb',
      quote: '"The pig grew fatter, and Elya grew stronger. Every day he carried it up the mountain to drink from the fresh spring."',
      ao2Analysis: 'Physical preparation as unconscious destiny: the repetitive daily toil carrying weight up a mountain parallels the grueling hole-digging at Camp Green Lake, which physically builds Stanley into someone capable of saving Zero.',
      essayTip: 'Show how Sachar reframes physical suffering: digging holes at Camp Green Lake unwittingly equips Stanley to carry Hector up God\'s Thumb.'
    },
    {
      id: 'step10-era-c',
      stepIndex: 10,
      eraKey: 'era-c',
      eraName: 'Era C: Camp Green Lake (1990s)',
      chapter: 'Ch. 37-39',
      title: "Carrying Zero up God's Thumb (The Curse Inverted)",
      characterAnchors: ['Stanley Yelnats IV', 'Hector Zeroni (Zero)'],
      summary: 'Zero is gravely ill from contaminated water. Reaching the cliffs of God\'s Thumb, Zero collapses. Stanley lifts Hector in his arms and carries him up the sheer rock face. At the summit, he discovers a fresh mountain spring and sweet wild onions. He feeds Hector, drinks the pure water, and sings the family lullaby, unconsciously fulfilling the promise Elya broke 110 years earlier.',
      themes: ['Redemption', 'Selfless Love', 'Breaking the Curse', 'Divine Providence'],
      convergenceId: 'mountain-climb',
      quote: '"He gathered his strength and lifted Zero... it was the hardest thing he had ever done, but he didn\'t drop him. He carried him all the way to the top."',
      ao2Analysis: 'The philosophical climax of the novel. The curse is broken not by magic or incantation, but by sacrificial love and moral restitution: a Yelnats carries a Zeroni up a mountain and sings him the song of comfort.',
      essayTip: 'This is the essential AO2 essay scene. Argue that Sachar defines true redemption as active, bodily solidarity that heals historical ancestral wounds.'
    },
    {
      id: 'step11-era-c',
      stepIndex: 11,
      eraKey: 'era-c',
      eraName: 'Era C: Camp Green Lake (1990s)',
      chapter: 'Ch. 42-45',
      title: "The Lizard Pit & The Buried Name",
      characterAnchors: ['Stanley Yelnats IV', 'Hector Zeroni', 'The Warden', 'Yellow-Spotted Lizards'],
      summary: 'Nourished by onions, the boys return to Camp Green Lake to excavate the hole where Stanley found the gold tube. They unearth a heavy metal suitcase. Suddenly, a swarm of lethal yellow-spotted lizards crawls over them. The Warden, Mr. Sir, and counselors watch, waiting for them to die. But the lizards do not bite because the boys\' bloodstream is saturated with Sam\'s wild sweet onions.',
      themes: ['Poetic Justice', 'Moral Integrity', 'Nature as Ally'],
      convergenceId: 'the-suitcase',
      quote: '"Lizards don\'t like onion blood." / In the morning light, the letters on the metal trunk were clear: S-T-A-N-L-E-Y Y-E-L-N-A-T-S.',
      ao2Analysis: 'Convergence of all three narrative threads: Sam\'s onions neutralize the deadly lizards, Kate Barlow\'s buried chest is revealed, and the inscription proves legal ownership belongs to Stanley\'s family rather than the Walkers.',
      essayTip: 'Analyze how Sachar uses the palindrome "STANLEY YELNATS" to symbolize cyclical return and total thematic closure.'
    },
    {
      id: 'step12-era-c',
      stepIndex: 12,
      eraKey: 'era-c',
      eraName: 'Era C: Camp Green Lake (1990s)',
      chapter: 'Ch. 46-50',
      title: "The Broken Curse, The Rains of Green Lake & The Reunion",
      characterAnchors: ['Stanley Yelnats IV', 'Hector Zeroni', 'Ms. Morengo', 'Stanley Yelnats III'],
      summary: 'Stanley\'s attorney Ms. Morengo frees Stanley and Hector. As they drive away, rain falls on Camp Green Lake for the first time in over a century. The trunk holds nearly a million dollars in bonds. Stanley\'s father invents "Sploosh"—a peach-scented foot spray endorsed by Clyde Livingston. Hector uses his wealth to hire private investigators to find his lost mother, and at the celebratory party, she sings the sweet lullaby to Hector.',
      themes: ['Reconciliation', 'Restorative Justice', 'Renewal'],
      convergenceId: 'pig-lullaby',
      quote: '"For the first time in over a hundred years, a drop of rain fell upon the dry lakebed of Green Lake... and then the skies opened."',
      ao2Analysis: 'Triumphant cosmic resolution: the environmental drought ends at the precise moment ancestral justice is served. The Yelnats and Zeroni lines achieve prosperity together, erasing the legacy of cruelty.',
      essayTip: 'Conclude exam essays by reflecting on Sachar\'s optimistic thesis: human justice, persistence, and genuine empathy have the power to overturn generational curses.'
    }
  ];
}

const holesData = require('./holesData');

function getTimelineData() {
  return {
    storylines: holesData.timelineStorylines,
    events: getTimelineEvents(),
    convergenceNodes: holesData.convergenceNodesData
  };
}

function getMotifsData() {
  return holesData.motifsData;
}

function getMotifById(id) {
  return holesData.motifsData.find(m => m.id === id) || null;
}

function getIconicQuotesData() {
  return holesData.iconicQuotesData;
}

function getEssayPromptsData() {
  return holesData.essayPromptsData;
}

function getCharacterGraphData() {
  return holesData.charactersGraphData;
}

module.exports = {
  detectLanguage,
  cleanMarkdown,
  splitSentences,
  isMeaningfulConceptTerm,
  extractKeyConcepts,
  extractMCQuestions,
  extractQAPairs,
  extractFlashcardTable,
  generateSummary,
  generateQuiz,
  generateFlashcards,
  generateStudyGuide,
  generateFaq,
  generateAudioOverview,
  answerQuestionGrounded,
  getTimelineEvents,
  getTimelineData,
  getMotifsData,
  getMotifById,
  getIconicQuotesData,
  getEssayPromptsData,
  getCharacterGraphData,
  callGeminiIfKeyAvailable
};
