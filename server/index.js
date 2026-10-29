const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { DocumentConverter, sanitizeFilename } = require('./converter');
const studio = require('./studio');
const { InboxWatcher } = require('./watcher');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, '..');
const DOCUMENTS_DIR = path.join(ROOT_DIR, 'documents');
const ASSETS_DIR = path.join(DOCUMENTS_DIR, 'assets');
const SETTINGS_FILE = path.join(ROOT_DIR, 'settings.json');

// Initialize converter
const converter = new DocumentConverter({ rootDir: ROOT_DIR });

// Ensure directories
if (!fs.existsSync(DOCUMENTS_DIR)) fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

// Setup Multer for in-memory file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Settings helper
function getSettings() {
  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    } catch (e) {
      // Return default
    }
  }
  return {
    language: 'en',
    aiProvider: 'local',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    autoWatchInbox: true
  };
}

function saveSettings(settings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static file routes
app.use('/assets', express.static(ASSETS_DIR));
app.use(express.static(path.join(ROOT_DIR, 'client')));

// Helper to load document text
function loadDocument(filename) {
  const safeName = path.basename(filename);
  const filePath = path.join(DOCUMENTS_DIR, safeName);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

// Helper to gather documents by names
function getMergedContent(docNames = []) {
  const files = fs.readdirSync(DOCUMENTS_DIR).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
  const targets = (docNames && docNames.length > 0)
    ? docNames.filter(name => files.includes(path.basename(name)))
    : files;

  const docs = [];
  for (const name of targets) {
    const content = loadDocument(name);
    if (content) {
      docs.push({ name, content });
    }
  }

  const combinedContent = docs.map(d => d.content).join('\n\n---\n\n');
  return { docs, combinedContent, count: docs.length };
}

/* ========================================================
   API ROUTES: DOCUMENTS
   ======================================================== */

// List all documents in documents/
app.get('/api/documents', (req, res) => {
  try {
    const files = fs.readdirSync(DOCUMENTS_DIR);
    const documents = [];

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (ext !== '.md' && ext !== '.txt') continue;

      const fullPath = path.join(DOCUMENTS_DIR, file);
      const stat = fs.statSync(fullPath);
      const content = fs.readFileSync(fullPath, 'utf-8');
      const words = content.trim().split(/\s+/).filter(Boolean).length;
      const preview = content.slice(0, 160).replace(/[#*`_]/g, '').trim();
      const hasImages = /assets\/|!\[.*?\]/i.test(content);

      documents.push({
        name: file,
        extension: ext,
        size: stat.size,
        modified: stat.mtime,
        wordCount: words,
        charCount: content.length,
        preview,
        hasImages
      });
    }

    // Sort by modified date (newest first)
    documents.sort((a, b) => new Date(b.modified) - new Date(a.modified));
    res.json({ documents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single document content and metadata
app.get('/api/documents/:filename', (req, res) => {
  try {
    const safeName = path.basename(req.params.filename);
    const filePath = path.join(DOCUMENTS_DIR, safeName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(words / 200));

    // Extract headings for Table of Contents
    const headingMatches = content.match(/^#{1,3}\s+(.+)$/gm) || [];
    const headings = headingMatches.map(h => {
      const level = h.match(/^#+/)[0].length;
      const text = h.replace(/^#+\s+/, '').trim();
      return { level, text };
    });

    res.json({
      name: safeName,
      content,
      wordCount: words,
      charCount: content.length,
      readingTimeMinutes: readingTime,
      headings
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new document
app.post('/api/documents', (req, res) => {
  try {
    const { title, content, format } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const ext = format === 'txt' ? '.txt' : '.md';
    const { base } = sanitizeFilename(title);
    const candidatePath = path.join(DOCUMENTS_DIR, `${base}${ext}`);

    let finalPath = candidatePath;
    let finalName = `${base}${ext}`;
    let counter = 1;
    while (fs.existsSync(finalPath)) {
      finalName = `${base}_${counter++}${ext}`;
      finalPath = path.join(DOCUMENTS_DIR, finalName);
    }

    const docContent = content || (ext === '.md' ? `# ${title}\n\n` : `${title}\n\n`);
    fs.writeFileSync(finalPath, docContent, 'utf-8');

    res.json({
      success: true,
      name: finalName,
      message: `Document ${finalName} successfully created.`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update existing document
app.put('/api/documents/:filename', (req, res) => {
  try {
    const safeName = path.basename(req.params.filename);
    const filePath = path.join(DOCUMENTS_DIR, safeName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const { content } = req.body;
    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is missing' });
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    res.json({ success: true, name: safeName, message: 'Document updated.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete document
app.delete('/api/documents/:filename', (req, res) => {
  try {
    const safeName = path.basename(req.params.filename);
    const filePath = path.join(DOCUMENTS_DIR, safeName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Document not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, message: `Document ${safeName} deleted.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========================================================
   API ROUTES: CONVERSION & INGESTION
   ======================================================== */

// Upload & convert one or more files to .md or .txt (with image extraction)
app.post('/api/convert', upload.array('files', 20), async (req, res) => {
  try {
    const outputFormat = req.body.format || 'md'; // 'md' or 'txt'
    const results = [];

    // 1. Files uploaded via Multer
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await converter.convertBuffer(file.buffer, file.originalname, { outputFormat });
        results.push(result);
      }
    }

    // 2. Direct pasted text conversion
    if (req.body.text) {
      const filename = req.body.filename || `note_${Date.now()}`;
      const buffer = Buffer.from(req.body.text, 'utf-8');
      const result = await converter.convertBuffer(buffer, filename, { outputFormat });
      results.push(result);
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'No files or text provided for conversion.' });
    }

    res.json({
      success: true,
      convertedCount: results.length,
      results
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========================================================
   API ROUTES: STUDY & EXAM HUB
   ======================================================== */

// Helper for effective studio language
const getEffectiveLang = (reqLang) => reqLang || getSettings().language || 'en';

// 1. Samenvatting (Summary)
const handleSummaryRequest = async (req, res) => {
  try {
    const mode = req.body?.mode || req.query?.mode || 'executive';
    const lang = getEffectiveLang(req.body?.lang || req.query?.lang);
    const rawDocs = req.body?.docNames || (req.query?.docNames ? (Array.isArray(req.query.docNames) ? req.query.docNames : req.query.docNames.split(',')) : undefined);
    const { combinedContent, docs } = getMergedContent(rawDocs);

    if (!combinedContent.trim()) {
      return res.status(400).json({ error: 'No source text available to summarize.' });
    }

    const summary = studio.generateSummary(combinedContent, mode, lang);
    res.json({
      mode,
      summary,
      sourcesUsed: docs.map(d => d.name)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
app.post('/api/studio/summary', handleSummaryRequest);
app.get('/api/studio/summary', handleSummaryRequest);

// 2. Interactieve Quiz
const handleQuizRequest = async (req, res) => {
  try {
    const count = req.body?.count || req.query?.count || 5;
    const lang = getEffectiveLang(req.body?.lang || req.query?.lang);
    const rawDocs = req.body?.docNames || (req.query?.docNames ? (Array.isArray(req.query.docNames) ? req.query.docNames : req.query.docNames.split(',')) : undefined);
    const { combinedContent, docs } = getMergedContent(rawDocs);

    if (!combinedContent.trim()) {
      return res.status(400).json({ error: 'No source text available for the quiz.' });
    }

    const questions = studio.generateQuiz(combinedContent, parseInt(count, 10) || 5, lang);
    res.json({
      totalQuestions: questions.length,
      questions,
      sourcesUsed: docs.map(d => d.name)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
app.post('/api/studio/quiz', handleQuizRequest);
app.get('/api/studio/quiz', handleQuizRequest);

// 3. Flitskaarten (Flashcards)
app.post('/api/studio/flashcards', async (req, res) => {
  try {
    const { docNames } = req.body;
    const lang = getEffectiveLang(req.body?.lang);
    const { combinedContent, docs } = getMergedContent(docNames);

    if (!combinedContent.trim()) {
      return res.status(400).json({ error: 'No source text available for flashcards.' });
    }

    const cards = studio.generateFlashcards(combinedContent, lang);
    res.json({
      totalCards: cards.length,
      cards,
      sourcesUsed: docs.map(d => d.name)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Studiegids (Study Guide)
app.post('/api/studio/study-guide', async (req, res) => {
  try {
    const { docNames } = req.body;
    const lang = getEffectiveLang(req.body?.lang);
    const { combinedContent, docs } = getMergedContent(docNames);

    if (!combinedContent.trim()) {
      return res.status(400).json({ error: 'No source text available for study guide.' });
    }

    const title = docs.length === 1 ? docs[0].name.replace(/\.[^.]+$/, '') : `${docs.length} Sources`;
    const studyGuideMd = studio.generateStudyGuide(combinedContent, title, lang);

    res.json({
      studyGuide: studyGuideMd,
      sourcesUsed: docs.map(d => d.name)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Veelgestelde Vragen (FAQ)
app.post('/api/studio/faq', async (req, res) => {
  try {
    const { docNames } = req.body;
    const lang = getEffectiveLang(req.body?.lang);
    const { combinedContent, docs } = getMergedContent(docNames);

    if (!combinedContent.trim()) {
      return res.status(400).json({ error: 'No source text available for FAQ.' });
    }

    const faqs = studio.generateFaq(combinedContent, lang);
    res.json({
      faqs,
      sourcesUsed: docs.map(d => d.name)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Audio Overzicht (Podcast Deep Dive script)
app.post('/api/studio/audio-overview', async (req, res) => {
  try {
    const { docNames, hosts } = req.body;
    const lang = getEffectiveLang(req.body?.lang);
    const { combinedContent, docs } = getMergedContent(docNames);

    if (!combinedContent.trim()) {
      return res.status(400).json({ error: 'No source text available for the audio overview.' });
    }

    const title = docs.length === 1 ? docs[0].name.replace(/\.[^.]+$/, '') : `${docs.length} Selected Sources`;
    const podcast = studio.generateAudioOverview(combinedContent, title, lang, hosts || ['Leo', 'Maya']);

    res.json({
      podcast,
      sourcesUsed: docs.map(d => d.name)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6b. Feature F1: Triple-Narrative Timeline Scrubber Events
app.get('/api/studio/timeline', (req, res) => {
  try {
    const data = studio.getTimelineData();
    res.json({
      title: "Holes Triple-Narrative Timeline",
      totalEvents: data.events.length,
      ...data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6c. Feature F2: Symbolism & Motif Tracker
app.get('/api/studio/motifs', (req, res) => {
  try {
    const motifs = studio.getMotifsData();
    res.json({ motifs, total: motifs.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/studio/motifs/:motifId', (req, res) => {
  try {
    const motif = studio.getMotifById(req.params.motifId);
    if (!motif) return res.status(404).json({ error: 'Motif not found' });
    res.json({ motif });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6d. Feature F3: Quote Identification & Analysis Challenge
app.get('/api/studio/quotes', (req, res) => {
  try {
    const quotes = studio.getIconicQuotesData();
    res.json({ quotes, total: quotes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6e. Feature F4: Essay Prompt & Thesis Generator
app.get('/api/studio/essay-prompts', (req, res) => {
  try {
    const prompts = studio.getEssayPromptsData();
    res.json({ prompts, total: prompts.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6f. Feature F8: Visual Character & Family Tree Graph
app.get('/api/studio/characters', (req, res) => {
  try {
    const graph = studio.getCharacterGraphData();
    res.json({ graph });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Grounded Chat & Citations
const handleChatRequest = async (req, res) => {
  try {
    const query = req.body?.query || req.query?.query || req.query?.q;
    const rawDocs = req.body?.docNames || (req.query?.docNames ? (Array.isArray(req.query.docNames) ? req.query.docNames : req.query.docNames.split(',')) : undefined);

    if (!query) {
      return res.status(400).json({ error: 'Question (query) is required.' });
    }

    const { docs } = getMergedContent(rawDocs);
    if (docs.length === 0) {
      return res.status(400).json({ error: 'No documents available or selected.' });
    }

    const result = studio.answerQuestionGrounded(query, docs);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
app.post('/api/studio/chat', handleChatRequest);
app.get('/api/studio/chat', handleChatRequest);
app.post('/api/chat', handleChatRequest);
app.get('/api/chat', handleChatRequest);

/* ========================================================
   API ROUTES: STATS & SETTINGS
   ======================================================== */

app.get('/api/stats', (req, res) => {
  try {
    const docFiles = fs.existsSync(DOCUMENTS_DIR)
      ? fs.readdirSync(DOCUMENTS_DIR).filter(f => f.endsWith('.md') || f.endsWith('.txt'))
      : [];

    let totalWords = 0;
    for (const f of docFiles) {
      const content = fs.readFileSync(path.join(DOCUMENTS_DIR, f), 'utf-8');
      totalWords += content.trim().split(/\s+/).filter(Boolean).length;
    }

    const assetFiles = fs.existsSync(ASSETS_DIR) ? fs.readdirSync(ASSETS_DIR) : [];

    res.json({
      totalDocuments: docFiles.length,
      totalWords,
      totalAssets: assetFiles.length,
      supportedFormats: ['PDF', 'DOCX', 'HTML', 'TXT', 'MD', 'CSV', 'JSON', 'PNG', 'JPG', 'WEBP', 'SVG']
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/settings', (req, res) => {
  res.json(getSettings());
});

app.post('/api/settings', (req, res) => {
  try {
    const current = getSettings();
    const updated = { ...current, ...req.body };
    saveSettings(updated);
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single page app fallback
app.use((req, res) => {
  const indexPath = path.join(ROOT_DIR, 'client', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Personal NotebookLM — Holes Study & Exam Suite server active. Loading frontend...');
  }
});

// Manage InboxWatcher lifecycle
let inboxWatcherInstance = null;

function startInboxWatcher() {
  if (!inboxWatcherInstance) {
    inboxWatcherInstance = new InboxWatcher({ rootDir: ROOT_DIR });
    inboxWatcherInstance.start();
  }
  return inboxWatcherInstance;
}

function stopInboxWatcher() {
  if (inboxWatcherInstance) {
    inboxWatcherInstance.stop();
    inboxWatcherInstance = null;
  }
}

// Start InboxWatcher if configured and running as main process
if (require.main === module) {
  const currentSettings = getSettings();
  if (currentSettings.autoWatchInbox !== false) {
    startInboxWatcher();
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🦎 Personal NotebookLM — Holes Study & Exam Suite running on http://localhost:${PORT}`);
    console.log(`📁 Documents directory: ${DOCUMENTS_DIR}`);
    console.log(`🖼️  Assets directory: ${ASSETS_DIR}`);
    console.log(`📥 Inbox watcher directory: ${path.join(ROOT_DIR, 'inbox')}`);
    console.log(`====================================================`);
  });
}

module.exports = {
  app,
  converter,
  startInboxWatcher,
  stopInboxWatcher,
  getInboxWatcher: () => inboxWatcherInstance
};
