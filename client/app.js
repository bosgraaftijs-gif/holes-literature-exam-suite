/**
 * Holes Study & Exam Hub Frontend Client Application
 * Handles document browsing, markdown rendering, grounded chat with citations,
 * interactive quiz runner, 3D flashcards, study guides, 2-host audio podcast synthesis,
 * file ingestion & image extraction.
 */

class HolesStudyApp {
  constructor() {
    this.documents = [];
    this.selectedDocNames = new Set();
    this.activeDoc = null;
    this.isEditing = false;
    this.currentTab = 'tab-studio';
    this.currentStudioSubtab = 'studio-timeline';

    // Quiz state
    this.quiz = {
      questions: [],
      currentIndex: 0,
      score: 0,
      userAnswers: [],
      isFinished: false
    };

    // Flashcards state
    this.flashcards = {
      cards: [],
      currentIndex: 0,
      isFlipped: false
    };

    // Podcast state
    this.podcast = {
      title: '',
      hosts: [],
      script: [],
      currentLineIndex: -1,
      isPlaying: false,
      speechRate: 1.0
    };

    // Feature F1: Triple-Timeline Scrubber State
    this.timeline = {
      events: [],
      currentStep: 1,
      totalSteps: 12,
      activeTheme: 'all',
      selectedEventId: null,
      isPlaying: false,
      playTimer: null
    };

    // Feature F6: Camp Green Lake Focus Timer State
    this.focusTimer = {
      timeLeft: 25 * 60,
      totalTime: 25 * 60,
      isRunning: false,
      mode: 'digging',
      holesDug: 0,
      timerId: null
    };

    // Feature F2: Motifs State
    this.motifs = [];
    this.activeMotifId = 'onions';

    // Feature F3: Quote Challenge State
    this.quoteChallenge = {
      quotes: [],
      currentIndex: 0,
      score: 0,
      streak: 0,
      step1Answered: false,
      step2Answered: false
    };

    // Feature F4: Essay Prompts State
    this.essayPrompts = [];
    this.activePromptId = 'prompt_1';

    // Feature F8: Character Tree State
    this.characterGraph = null;
    this.activeCharacter = null;
    this.characterFilterEra = 'all';

    this.settings = {
      language: 'en',
      aiProvider: 'local',
      geminiApiKey: '',
      autoWatchInbox: true
    };

    this.init();
  }

  async init() {
    this.initTheme();
    this.initFocusTimer();
    this.bindEvents();
    await this.loadSettings();
    await this.loadDocuments();

    // Auto-select first document if available
    if (this.documents.length > 0) {
      this.openDocument(this.documents[0].name);
    }

    // Load initial Study & Exam Hub data
    this.loadTimelineData();

    // Start background polling to automatically discover inbox conversions
    this.startDocumentPolling();
  }

  startDocumentPolling() {
    if (this._pollingInterval) clearInterval(this._pollingInterval);
    this._pollingInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) return;
        const stats = await res.json();
        if (this._lastTotalDocs !== undefined && stats.totalDocuments !== this._lastTotalDocs) {
          const wasIncrease = stats.totalDocuments > this._lastTotalDocs;
          this._lastTotalDocs = stats.totalDocuments;
          await this.loadDocuments();
          if (wasIncrease) {
            this.showToast('New source detected and automatically loaded!', 'info');
          }
        } else {
          this._lastTotalDocs = stats.totalDocuments;
        }
      } catch (e) {
        // Silent catch for background polling
      }
    }, 3000);
  }

  /* ==========================================================
     THEME & SETTINGS
     ========================================================== */

  initTheme() {
    const savedTheme = localStorage.getItem('holes_study_theme') || localStorage.getItem('notebooklm_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('holes_study_theme', target);
    this.showToast(`Theme switched to ${target === 'dark' ? 'Dark' : 'Light'}`);
  }

  async loadSettings() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        this.settings = await res.json();
        const langEl = document.getElementById('setting-language');
        const modeEl = document.getElementById('setting-ai-mode');
        const keyEl = document.getElementById('setting-gemini-key');
        const watchEl = document.getElementById('setting-watch-inbox');

        if (langEl) langEl.value = this.settings.language || 'en';
        if (modeEl) modeEl.value = this.settings.aiProvider || 'local';
        if (keyEl) keyEl.value = this.settings.geminiApiKey || '';
        if (watchEl) watchEl.checked = this.settings.autoWatchInbox !== false;

        this.updateLanguageUI();
      }
    } catch (e) {
      console.warn('Could not load settings:', e);
    }
  }

  async toggleLanguage() {
    const nextLang = (this.settings.language === 'nl') ? 'en' : 'nl';
    this.settings.language = nextLang;
    const langSelect = document.getElementById('setting-language');
    if (langSelect) langSelect.value = nextLang;
    this.updateLanguageUI();
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.settings)
      });
      this.showToast(nextLang === 'nl' ? 'Nederlandse Modus geactiveerd 🇳🇱' : 'Switched to English mode 🇬🇧', 'success');
    } catch (e) {
      // silent
    }
  }

  updateLanguageUI() {
    const isNl = this.settings.language === 'nl';
    const flagEl = document.getElementById('lang-flag');
    const labelEl = document.getElementById('lang-label');
    if (flagEl) flagEl.textContent = isNl ? '🇳🇱' : '🇬🇧';
    if (labelEl) labelEl.textContent = isNl ? 'NL' : 'EN';
  }

  async saveSettings() {
    const language = document.getElementById('setting-language').value;
    const aiProvider = document.getElementById('setting-ai-mode').value;
    const geminiApiKey = document.getElementById('setting-gemini-key').value;
    const autoWatchInbox = document.getElementById('setting-watch-inbox').checked;

    const payload = { language, aiProvider, geminiApiKey, autoWatchInbox };
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        this.settings = payload;
        this.updateLanguageUI();
        this.closeSettingsModal();
        this.showToast(payload.language === 'nl' ? 'Instellingen opgeslagen (Nederlandse Modus actief).' : 'Settings saved successfully.', 'success');
      }
    } catch (e) {
      this.showToast('Failed to save settings.', 'error');
    }
  }

  /* ==========================================================
     DOCUMENT MANAGEMENT
     ========================================================== */

  async loadDocuments() {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      this.documents = data.documents || [];
      this._lastTotalDocs = this.documents.length;

      // Retain existing selections, add newly discovered files
      if (!this.selectedDocNames || this.selectedDocNames.size === 0) {
        this.selectedDocNames = new Set(this.documents.map(d => d.name));
      } else {
        for (const doc of this.documents) {
          if (!this._knownDocNames || !this._knownDocNames.has(doc.name)) {
            this.selectedDocNames.add(doc.name);
          }
        }
      }
      this._knownDocNames = new Set(this.documents.map(d => d.name));

      this.renderSidebarSources();
      this.updateSelectionBadges();
    } catch (err) {
      this.showToast('Error loading documents: ' + err.message, 'error');
    }
  }

  renderSidebarSources(filterQuery = '') {
    const listEl = document.getElementById('sources-list');
    const badgeEl = document.getElementById('source-count-badge');
    if (badgeEl) badgeEl.textContent = this.documents.length;
    const headerBadgeEl = document.getElementById('source-count-header-badge');
    if (headerBadgeEl) headerBadgeEl.textContent = this.documents.length;

    let filtered = this.documents;
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      filtered = this.documents.filter(d => d.name.toLowerCase().includes(q) || d.preview.toLowerCase().includes(q));
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="sources-empty-state">
          <span class="empty-icon">📂</span>
          <p>${this.documents.length === 0 ? 'No sources in this project yet.' : 'No matching documents found.'}</p>
          <small>Drop files into 'inbox/' or click 'Import Material' in the header.</small>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(doc => {
      const isActive = this.activeDoc && this.activeDoc.name === doc.name;
      const isChecked = this.selectedDocNames.has(doc.name);
      const isTxt = doc.extension === '.txt';
      const formattedDate = new Date(doc.modified).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });

      return `
        <div class="source-item ${isActive ? 'active' : ''}" data-name="${this.escapeHtml(doc.name)}">
          <div class="source-item-header">
            <input type="checkbox" class="source-select-chk" data-name="${this.escapeHtml(doc.name)}" ${isChecked ? 'checked' : ''}>
            <div class="source-title-group" onclick="app.openDocument('${this.escapeHtml(doc.name)}', true)">
              <div class="source-title-row">
                <span class="file-type-badge ${isTxt ? 'txt' : 'md'}">${isTxt ? 'TXT' : 'MD'}</span>
                <span class="file-type-badge" style="background:${/Karaktergids|Geografie|Volledige_Plot|Verhaallijnen|Voorwerpen|Thema_Analyse|Motieven|Hoofdstuk|Verschillen|Samenvatting|Studiegids|Compendium/i.test(doc.name) ? 'rgba(249,115,22,0.2); color:#f97316;' : 'rgba(99,102,241,0.2); color:#818cf8;'}">${/Karaktergids|Geografie|Volledige_Plot|Verhaallijnen|Voorwerpen|Thema_Analyse|Motieven|Hoofdstuk|Verschillen|Samenvatting|Studiegids|Compendium/i.test(doc.name) ? 'NL' : 'EN'}</span>
                ${doc.hasImages ? '<span class="file-img-indicator" title="Contains images">🖼️</span>' : ''}
                <span class="source-name" title="${this.escapeHtml(doc.name)}">${this.escapeHtml(doc.name)}</span>
              </div>
              <p class="source-preview">${this.escapeHtml(doc.preview || 'No preview available...')}</p>
            </div>
          </div>
          <div class="source-meta">
            <span>${doc.wordCount} words • ${formattedDate}</span>
            <button class="source-delete-btn" data-name="${this.escapeHtml(doc.name)}" title="Delete document">🗑️</button>
          </div>
        </div>
      `;
    }).join('');

    // Attach delete listeners
    listEl.querySelectorAll('.source-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const name = btn.getAttribute('data-name');
        if (name) this.deleteDocument(name);
      });
    });

    // Attach checkbox listeners
    listEl.querySelectorAll('.source-select-chk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const name = e.target.getAttribute('data-name');
        if (e.target.checked) {
          this.selectedDocNames.add(name);
        } else {
          this.selectedDocNames.delete(name);
        }
        this.updateSelectionBadges();
      });
    });
  }

  updateSelectionBadges() {
    const total = this.documents.length;
    const selected = this.selectedDocNames.size;
    const chkAll = document.getElementById('checkbox-select-all');
    if (chkAll) {
      chkAll.checked = selected === total && total > 0;
      chkAll.indeterminate = selected > 0 && selected < total;
    }

    const headerBadge = document.getElementById('source-count-header-badge');
    if (headerBadge) {
      headerBadge.textContent = total;
    }

    const chatIndicator = document.getElementById('chat-sources-indicator');
    if (chatIndicator) {
      chatIndicator.textContent = `${selected} of ${total} study sources active for grounded analysis.`;
    }
  }

  toggleSourcesSidebar(shouldCollapse = null) {
    const sidebar = document.getElementById('sidebar-sources') || document.querySelector('.sidebar-sources');
    const toggleBtn = document.getElementById('btn-toggle-sources');
    if (!sidebar) return;

    const isCurrentlyCollapsed = sidebar.classList.contains('collapsed');
    const willCollapse = shouldCollapse !== null ? shouldCollapse : !isCurrentlyCollapsed;
    sidebar.classList.toggle('collapsed', willCollapse);
    if (toggleBtn) {
      toggleBtn.classList.toggle('active', !willCollapse);
    }
  }

  toggleSelectAllSources(checked) {
    if (checked) {
      this.selectedDocNames = new Set(this.documents.map(d => d.name));
    } else {
      this.selectedDocNames.clear();
    }
    this.renderSidebarSources();
    this.updateSelectionBadges();
  }

  async openDocument(filename, forceSwitchTab = false) {
    try {
      const res = await fetch(`/api/documents/${encodeURIComponent(filename)}`);
      if (!res.ok) throw new Error('Failed to load document');
      this.activeDoc = await res.json();

      // Update UI title and meta
      document.getElementById('active-doc-title').textContent = this.activeDoc.name;
      const metaTags = document.getElementById('doc-meta-tags');
      const actions = document.getElementById('viewer-actions');
      metaTags.style.display = 'flex';
      actions.style.display = 'flex';

      const ext = this.activeDoc.name.endsWith('.txt') ? 'TXT' : 'MD';
      document.getElementById('meta-format').textContent = ext;
      document.getElementById('meta-words').textContent = `${this.activeDoc.wordCount} words`;
      document.getElementById('meta-reading').textContent = `${this.activeDoc.readingTimeMinutes} min read`;

      // Render Markdown / Text content
      this.renderActiveDocument();

      // Render Table of Contents outline
      this.renderOutline(this.activeDoc.headings);

      // Re-highlight sidebar item
      document.querySelectorAll('.source-item').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-name') === this.activeDoc.name);
      });

      // Switch to viewer tab if requested or from convert tab
      if (forceSwitchTab || this.currentTab === 'tab-convert') {
        this.showTab('tab-viewer');
      }
      if (forceSwitchTab && window.innerWidth <= 768) {
        this.toggleSourcesSidebar(true);
      }
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  renderActiveDocument() {
    const viewerEl = document.getElementById('markdown-viewer');
    const editorPane = document.getElementById('markdown-editor-pane');
    const textarea = document.getElementById('markdown-editor-textarea');

    if (this.isEditing) {
      viewerEl.style.display = 'none';
      editorPane.style.display = 'flex';
      textarea.value = this.activeDoc.content;
      textarea.focus();
    } else {
      viewerEl.style.display = 'block';
      editorPane.style.display = 'none';

      if (window.marked) {
        viewerEl.innerHTML = marked.parse(this.activeDoc.content);
      } else {
        viewerEl.innerHTML = `<pre>${this.escapeHtml(this.activeDoc.content)}</pre>`;
      }
    }
  }

  renderOutline(headings = []) {
    const outlineEl = document.getElementById('doc-outline');
    const linksEl = document.getElementById('outline-links');

    if (!headings || headings.length === 0) {
      outlineEl.style.display = 'none';
      return;
    }

    outlineEl.style.display = 'block';
    linksEl.innerHTML = headings.map(h => {
      return `<a class="outline-link level-${h.level}" href="javascript:void(0)" data-heading="${this.escapeHtml(h.text)}">${this.escapeHtml(h.text)}</a>`;
    }).join('');

    linksEl.querySelectorAll('.outline-link').forEach(link => {
      link.addEventListener('click', () => {
        const heading = link.getAttribute('data-heading');
        if (heading) this.scrollToHeading(heading);
      });
    });
  }

  scrollToHeading(headingText) {
    const viewer = document.getElementById('markdown-viewer');
    const elements = viewer.querySelectorAll('h1, h2, h3, h4');
    for (const el of elements) {
      if (el.textContent.trim().toLowerCase() === headingText.trim().toLowerCase()) {
        el.scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  }

  toggleEditMode(forceState = null) {
    if (!this.activeDoc) return;
    this.isEditing = forceState !== null ? forceState : !this.isEditing;
    const editBtn = document.getElementById('btn-toggle-edit');
    if (this.isEditing) {
      editBtn.textContent = '👁️ View Mode';
    } else {
      editBtn.textContent = '✏️ Edit';
    }
    this.renderActiveDocument();
  }

  async saveActiveDocumentEdit() {
    if (!this.activeDoc) return;
    const newContent = document.getElementById('markdown-editor-textarea').value;

    try {
      const res = await fetch(`/api/documents/${encodeURIComponent(this.activeDoc.name)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent })
      });

      if (!res.ok) throw new Error('Failed to save document');
      this.activeDoc.content = newContent;
      this.toggleEditMode(false);
      await this.loadDocuments();
      await this.openDocument(this.activeDoc.name);
      this.showToast('Changes saved successfully.', 'success');
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  async deleteDocument(filename) {
    if (!confirm(`Are you sure you want to delete '${filename}'?`)) return;

    try {
      const res = await fetch(`/api/documents/${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Delete failed');

      this.selectedDocNames.delete(filename);
      if (this.activeDoc && this.activeDoc.name === filename) {
        this.activeDoc = null;
        document.getElementById('active-doc-title').textContent = 'Select a document';
        document.getElementById('doc-meta-tags').style.display = 'none';
        document.getElementById('viewer-actions').style.display = 'none';
        document.getElementById('markdown-viewer').innerHTML = `
          <div class="empty-doc-placeholder">
            <span class="placeholder-icon">📖</span>
            <h3>No document opened</h3>
          </div>
        `;
      }
      await this.loadDocuments();
      this.showToast(`Document ${filename} deleted.`, 'success');
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  copyActiveMarkdown() {
    if (!this.activeDoc) return;
    navigator.clipboard.writeText(this.activeDoc.content);
    this.showToast('Markdown copied to clipboard!', 'success');
  }

  downloadActiveDoc() {
    if (!this.activeDoc) return;
    const blob = new Blob([this.activeDoc.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.activeDoc.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ==========================================================
     GROUNDED CHAT & CITATIONS
     ========================================================== */

  async sendChatMessage(queryText = null) {
    const inputEl = document.getElementById('chat-input');
    const query = queryText || inputEl.value.trim();
    if (!query) return;

    if (!queryText) inputEl.value = '';

    // Add user message to UI
    this.appendChatBubble('user', query);

    // Show loading assistant bubble
    const loadingBubble = this.appendChatBubble('assistant', '<em>Searching across your sources...</em>');

    try {
      const targetDocs = Array.from(this.selectedDocNames);
      const res = await fetch('/api/studio/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          docNames: targetDocs
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Chat request failed');
      }

      const data = await res.json();
      this.updateAssistantBubbleWithCitations(loadingBubble, data.answer, data.citations);
    } catch (err) {
      loadingBubble.querySelector('.bubble-content').innerHTML = `<p class="text-danger">⚠️ ${this.escapeHtml(err.message)}</p>`;
    }
  }

  appendChatBubble(role, htmlOrText) {
    const container = document.getElementById('chat-messages');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'bubble-avatar';
    avatar.textContent = role === 'user' ? '👤' : '📖';

    const content = document.createElement('div');
    content.className = 'bubble-content';
    if (typeof htmlOrText === 'string') {
      content.innerHTML = htmlOrText;
    } else {
      content.appendChild(htmlOrText);
    }

    bubble.appendChild(avatar);
    bubble.appendChild(content);
    container.appendChild(bubble);

    // Scroll down
    container.scrollTop = container.scrollHeight;
    return bubble;
  }

  updateAssistantBubbleWithCitations(bubble, answer, citations = []) {
    const contentEl = bubble.querySelector('.bubble-content');
    
    // Replace [1], [2] with clickable pills
    let formattedAnswer = window.marked ? marked.parse(answer) : `<p>${answer}</p>`;
    formattedAnswer = formattedAnswer.replace(/\[(\d+)\]/g, (m, id) => {
      return `<button class="citation-pill" onclick="app.highlightCitation(${id})">[Source ${id}]</button>`;
    });

    let html = formattedAnswer;

    if (citations && citations.length > 0) {
      html += `
        <div class="citations-accordion">
          <button class="citations-toggle" onclick="this.nextElementSibling.classList.toggle('open'); this.textContent = this.nextElementSibling.classList.contains('open') ? '▼ Hide source excerpts' : '▶ View consulted source excerpts (${citations.length})';">
            ▶ View consulted source excerpts (${citations.length})
          </button>
          <div class="citations-list" style="display:none;">
            ${citations.map(c => `
              <div class="citation-item" id="citation-card-${c.id}">
                <div class="citation-source-name">📌 Source ${c.id}: ${this.escapeHtml(c.source)} (Paragraph ${c.paragraph})</div>
                <div class="citation-quote">"${this.escapeHtml(c.quote)}"</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    contentEl.innerHTML = html;
    
    // Hook accordion toggle
    const toggleBtn = contentEl.querySelector('.citations-toggle');
    const listEl = contentEl.querySelector('.citations-list');
    if (toggleBtn && listEl) {
      toggleBtn.onclick = () => {
        const isHidden = listEl.style.display === 'none';
        listEl.style.display = isHidden ? 'flex' : 'none';
        toggleBtn.textContent = isHidden ? `▼ Hide source excerpts` : `▶ View consulted source excerpts (${citations.length})`;
      };
    }
  }

  highlightCitation(id) {
    const card = document.getElementById(`citation-card-${id}`);
    if (card) {
      card.parentElement.style.display = 'flex';
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      card.style.outline = '2px solid var(--accent-primary)';
      setTimeout(() => { card.style.outline = 'none'; }, 2000);
    }
  }

  clearChat() {
    const container = document.getElementById('chat-messages');
    container.innerHTML = `
      <div class="chat-bubble assistant initial-message">
        <div class="bubble-avatar">📖</div>
        <div class="bubble-content">
          <p>Chat history cleared. Ask any question about Holes or your sources!</p>
        </div>
      </div>
    `;
    this.showToast('Chat cleared.');
  }

  /* ==========================================================
     STUDY & EXAM HUB: SUMMARY
     ========================================================== */

  async generateSummary(overrideDocNames = null) {
    const mode = document.getElementById('summary-mode-select').value;
    const card = document.getElementById('summary-result-card');
    card.innerHTML = `<div class="card-empty-placeholder"><span class="icon">⏳</span><p>Generating ${mode} summary...</p></div>`;

    try {
      const docNames = overrideDocNames || Array.from(this.selectedDocNames);
      const res = await fetch('/api/studio/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docNames, mode })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate summary');
      }

      const data = await res.json();
      this.lastSummary = data.summary;
      const renderedHtml = window.marked ? marked.parse(data.summary) : `<pre>${this.escapeHtml(data.summary)}</pre>`;

      card.innerHTML = `
        <div class="markdown-body">
          ${renderedHtml}
        </div>
        <div style="margin-top: 20px; display: flex; gap: 8px; justify-content: flex-end;">
          <button class="btn btn-secondary btn-sm" onclick="app.copyLastSummary()">📋 Copy</button>
          <button class="btn btn-primary btn-sm" onclick="app.saveLastSummaryAsNote()">💾 Save as Note</button>
        </div>
      `;
    } catch (err) {
      card.innerHTML = `<div class="card-empty-placeholder text-danger"><p>⚠️ ${this.escapeHtml(err.message)}</p></div>`;
    }
  }

  copyLastSummary() {
    if (!this.lastSummary) return;
    navigator.clipboard.writeText(this.lastSummary);
    this.showToast('Summary copied to clipboard!', 'success');
  }

  saveLastSummaryAsNote() {
    if (!this.lastSummary) return;
    this.saveAsNote(`Summary_${Date.now()}`, this.lastSummary);
  }

  /* ==========================================================
     STUDY & EXAM HUB: INTERACTIVE QUIZ
     ========================================================== */

  async generateQuiz(overrideDocNames = null) {
    const count = document.getElementById('quiz-count-select').value;
    const container = document.getElementById('quiz-runner-container');
    container.innerHTML = `<div class="card-empty-placeholder"><span class="icon">⏳</span><p>Compiling your interactive quiz...</p></div>`;

    try {
      const docNames = overrideDocNames || Array.from(this.selectedDocNames);
      const res = await fetch('/api/studio/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docNames, count })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate quiz');
      }

      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error('Could not generate questions from the selected sources.');
      }

      this.quiz = {
        questions: data.questions,
        currentIndex: 0,
        score: 0,
        userAnswers: [],
        isFinished: false
      };

      this.renderQuizQuestion();
    } catch (err) {
      container.innerHTML = `<div class="card-empty-placeholder text-danger"><p>⚠️ ${this.escapeHtml(err.message)}</p></div>`;
    }
  }

  renderQuizQuestion() {
    this.quiz.answeredCurrent = false;
    const container = document.getElementById('quiz-runner-container');
    const q = this.quiz.questions[this.quiz.currentIndex];
    const total = this.quiz.questions.length;
    const progressPct = ((this.quiz.currentIndex) / total) * 100;

    const letters = ['A', 'B', 'C', 'D'];

    container.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-progress-bar-bg">
          <div class="quiz-progress-bar-fill" style="width: ${progressPct}%;"></div>
        </div>

        <div class="quiz-header-meta">
          <span>Question ${this.quiz.currentIndex + 1} of ${total}</span>
          <span>Current Score: ${this.quiz.score} / ${this.quiz.currentIndex}</span>
        </div>

        <h3 class="quiz-question-text">${this.escapeHtml(q.question)}</h3>

        <div class="quiz-options-list" id="quiz-options-container">
          ${q.options.map((opt, idx) => `
            <button class="quiz-option-btn" onclick="app.answerQuizQuestion(${idx})">
              <span class="option-letter">${letters[idx] || idx + 1}</span>
              <span class="option-text">${this.escapeHtml(opt)}</span>
            </button>
          `).join('')}
        </div>

        <div id="quiz-feedback-slot"></div>
      </div>
    `;
  }

  answerQuizQuestion(selectedIdx) {
    if (this.quiz.answeredCurrent) return;
    this.quiz.answeredCurrent = true;

    const q = this.quiz.questions[this.quiz.currentIndex];
    const isCorrect = selectedIdx === q.correctIndex;

    if (isCorrect) this.quiz.score++;
    this.quiz.userAnswers.push({ questionId: q.id, selectedIdx, isCorrect });

    // Highlight buttons
    const buttons = document.querySelectorAll('.quiz-option-btn');
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('incorrect');
      }
    });

    const letters = ['A', 'B', 'C', 'D'];

    // Show feedback
    const feedbackSlot = document.getElementById('quiz-feedback-slot');
    feedbackSlot.innerHTML = `
      <div class="quiz-feedback-box">
        <div style="font-size: 13px; font-weight: 600; color: var(--text-muted); margin-bottom: 4px;">Your Answer: Option ${letters[selectedIdx] || selectedIdx + 1}</div>
        <h4 style="color: ${isCorrect ? 'var(--accent-success)' : 'var(--accent-danger)'};">
          ${isCorrect ? 'Correct! 🎉' : 'Incorrect. ❌'}
        </h4>
        <p><strong>Explanation:</strong> ${this.escapeHtml(q.explanation)}</p>
        ${q.quote ? `<p style="margin-top: 8px; font-style: italic; color: var(--text-dim);">📖 Novel excerpt: "${this.escapeHtml(q.quote)}"</p>` : ''}
      </div>

      <button class="btn btn-primary quiz-next-btn" onclick="app.nextQuizQuestion()">
        ${this.quiz.currentIndex + 1 < this.quiz.questions.length ? 'Next Question ➔' : 'View Final Results 🏁'}
      </button>
    `;
  }

  nextQuizQuestion() {
    this.quiz.currentIndex++;
    if (this.quiz.currentIndex < this.quiz.questions.length) {
      this.renderQuizQuestion();
    } else {
      this.renderQuizResults();
    }
  }

  renderQuizResults() {
    const total = this.quiz.questions.length;
    const score = this.quiz.score;
    const pct = Math.round((score / total) * 100);

    let feedbackMessage = 'Well done!';
    if (pct === 100) feedbackMessage = '🌟 Perfect score! Outstanding mastery of the novel and literary themes.';
    else if (pct >= 80) feedbackMessage = '👏 Excellent result! Very strong understanding of core concepts.';
    else if (pct >= 60) feedbackMessage = '👍 Good effort! Review the missed questions in the study guide.';
    else feedbackMessage = '📚 Keep practicing! Consult the study guide and chapter notes and try again.';

    const container = document.getElementById('quiz-runner-container');
    container.innerHTML = `
      <div class="quiz-results-card">
        <h2>Quiz Complete! Score: ${score} / ${total} (${pct}%)</h2>
        <div class="quiz-score-badge">${score} / ${total}</div>
        <p style="font-size: 18px; font-weight: 600; color: var(--text-main); margin-bottom: 8px;">Score: ${score} / ${total} (${pct}%)</p>
        <p style="color: var(--text-muted); margin-bottom: 24px;">${feedbackMessage}</p>

        <div style="display: flex; gap: 12px; justify-content: center;">
          <button class="btn btn-accent" onclick="app.generateQuiz()">🔄 Try Again</button>
          <button class="btn btn-secondary" onclick="app.exportQuizAsMarkdown()">💾 Export Quiz as Markdown</button>
        </div>
      </div>
    `;
  }

  exportQuizAsMarkdown() {
    let md = `# Interactive Quiz Results\n\n`;
    md += `**Score:** ${this.quiz.score} / ${this.quiz.questions.length}\n\n---\n\n`;
    this.quiz.questions.forEach((q, i) => {
      md += `### Question ${i + 1}: ${q.question}\n\n`;
      q.options.forEach((opt, idx) => {
        const isRight = idx === q.correctIndex ? ' [CORRECT]' : '';
        md += `- ${opt}${isRight}\n`;
      });
      md += `\n*Explanation:* ${q.explanation}\n\n`;
    });

    this.saveAsNote(`Quiz_Results_${Date.now()}`, md);
  }

  /* ==========================================================
     STUDY & EXAM HUB: FLASHCARDS
     ========================================================== */

  async generateFlashcards() {
    const wrapper = document.getElementById('flashcards-wrapper');
    wrapper.innerHTML = `<div class="card-empty-placeholder"><span class="icon">⏳</span><p>Generating study flashcards...</p></div>`;

    try {
      const docNames = Array.from(this.selectedDocNames);
      const res = await fetch('/api/studio/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docNames })
      });

      if (!res.ok) throw new Error('Failed to load flashcards');
      const data = await res.json();
      if (!data.cards || data.cards.length === 0) throw new Error('No concepts found in selected sources.');

      this.flashcards = {
        cards: data.cards,
        currentIndex: 0,
        isFlipped: false
      };

      this.renderFlashcard();
    } catch (err) {
      wrapper.innerHTML = `<div class="card-empty-placeholder text-danger"><p>⚠️ ${this.escapeHtml(err.message)}</p></div>`;
    }
  }

  getSm2CardData(cardKey) {
    try {
      const raw = localStorage.getItem('holes_study_sm2_cards') || localStorage.getItem('notebooklm_sm2_cards') || '{}';
      const store = JSON.parse(raw);
      return store[cardKey] || null;
    } catch (e) {
      return null;
    }
  }

  saveSm2CardData(cardKey, data) {
    try {
      const raw = localStorage.getItem('holes_study_sm2_cards') || localStorage.getItem('notebooklm_sm2_cards') || '{}';
      const store = JSON.parse(raw);
      store[cardKey] = data;
      localStorage.setItem('holes_study_sm2_cards', JSON.stringify(store));
    } catch (e) {}
  }

  rateFlashcardSM2(qualityScore) {
    const card = this.flashcards.cards[this.flashcards.currentIndex];
    if (!card) return;

    let { easeFactor = 2.5, interval = 0, repetitions = 0 } = this.getSm2CardData(card.front) || {};

    const qMap = { 1: 1, 2: 3, 3: 4, 4: 5 };
    const q = qMap[qualityScore] || 3;

    easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;

    if (q < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      repetitions += 1;
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = qualityScore === 4 ? 6 : (qualityScore === 3 ? 4 : 2);
      } else {
        interval = Math.round(interval * easeFactor);
      }
    }

    const nextReviewDate = new Date(Date.now() + interval * 24 * 60 * 60 * 1000).toISOString();
    this.saveSm2CardData(card.front, { easeFactor, interval, repetitions, nextReviewDate, lastRated: Date.now() });

    this.showToast(`SM-2 review scheduled in ${interval} day(s)! (EF: ${easeFactor.toFixed(2)})`, 'success');
    this.nextFlashcard();
  }

  renderFlashcard() {
    const wrapper = document.getElementById('flashcards-wrapper');
    const counterBadge = document.getElementById('flashcard-counter');
    const total = this.flashcards.cards.length;

    if (this.flashcards.isCompleted) {
      if (counterBadge) counterBadge.textContent = `${total} / ${total} cards reviewed`;
      wrapper.innerHTML = `
        <div class="card-empty-placeholder" style="padding: 36px 20px; text-align: center;">
          <span class="icon" style="font-size: 48px;">🎉</span>
          <h3 style="margin: 12px 0 8px; color: var(--text-main);">Flashcard Review Complete!</h3>
          <p style="color: var(--text-muted); max-width: 480px; margin: 0 auto 20px; font-size: 14px;">
            You have reviewed all ${total} flashcards in this deck. Spaced repetition (SM-2) intervals and next review dates have been saved.
          </p>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="app.restartFlashcards()">🔁 Review Again</button>
            <button class="btn btn-secondary btn-sm" onclick="app.shuffleFlashcards()">🔀 Shuffle &amp; Review</button>
            <button class="btn btn-accent btn-sm" onclick="app.showStudioSubtab('studio-quiz')">🎯 Test with Practice Quiz</button>
          </div>
        </div>
      `;
      return;
    }

    const card = this.flashcards.cards[this.flashcards.currentIndex];

    const sm2Data = this.getSm2CardData(card.front) || { easeFactor: 2.5, interval: 0, repetitions: 0 };
    counterBadge.textContent = `Card ${this.flashcards.currentIndex + 1} of ${total} (Interval: ${sm2Data.interval}d | EF: ${sm2Data.easeFactor.toFixed(2)})`;

    const sideText = this.flashcards.isFlipped ? card.back : card.front;
    const sideLabel = this.flashcards.isFlipped ? (card.backLabel || 'Definition / Literary Significance') : (card.frontLabel || 'Concept / Question / Quote');

    let controlsHtml = '';
    if (!this.flashcards.isFlipped) {
      controlsHtml = `
        <div class="flashcard-controls">
          <button class="btn btn-secondary btn-sm" onclick="app.prevFlashcard()" ${this.flashcards.currentIndex === 0 ? 'disabled' : ''}>⬅ Previous Card</button>
          <button class="btn btn-primary btn-sm" onclick="app.flipFlashcard()">🔄 Click to flip card (Space)</button>
          <button class="btn btn-secondary btn-sm" onclick="app.nextFlashcard()">${this.flashcards.currentIndex + 1 >= total ? 'Finish Review 🏁' : 'Next Card ➡'}</button>
          <button class="btn btn-secondary btn-sm" onclick="app.shuffleFlashcards()">🔀 Shuffle Cards</button>
          <button class="btn btn-secondary btn-sm" onclick="app.markFlashcardMastered(true)">✅ Mark as Mastered</button>
        </div>
      `;
    } else {
      controlsHtml = `
        <div class="sm2-rating-bar">
          <button class="btn-sm2 btn-sm2-1" onclick="app.rateFlashcardSM2(1)" title="Repeat today (< 1 day)">1. 🔴 Forgot</button>
          <button class="btn-sm2 btn-sm2-2" onclick="app.rateFlashcardSM2(2)" title="Hard, review in 2 days">2. 🟠 Hard (2d)</button>
          <button class="btn-sm2 btn-sm2-3" onclick="app.rateFlashcardSM2(3)" title="Good recall, review in 6 days">3. 🟢 Good (6d)</button>
          <button class="btn-sm2 btn-sm2-4" onclick="app.rateFlashcardSM2(4)" title="Easy mastery, review in 14 days">4. 🔵 Easy (14d)</button>
        </div>
        <div class="flashcard-controls" style="margin-top: 10px;">
          <button class="btn btn-secondary btn-sm" onclick="app.prevFlashcard()" ${this.flashcards.currentIndex === 0 ? 'disabled' : ''}>⬅ Previous Card</button>
          <button class="btn btn-secondary btn-sm" onclick="app.flipFlashcard()">🔄 Flip Back</button>
          <button class="btn btn-primary btn-sm" onclick="app.nextFlashcard()">${this.flashcards.currentIndex + 1 >= total ? 'Finish Review 🏁' : 'Next Card ➡'}</button>
          <button class="btn btn-secondary btn-sm" onclick="app.markFlashcardMastered(true)">✅ Mark as Mastered</button>
        </div>
      `;
    }

    wrapper.innerHTML = `
      <div class="flashcard" onclick="app.flipFlashcard()">
        <span class="flashcard-tag">${this.escapeHtml(card.category || 'Literary Term')}</span>
        <span class="flashcard-side-label">${sideLabel}</span>
        <div class="flashcard-main-text">${this.escapeHtml(sideText)}</div>
        <span class="flashcard-hint">Click to flip card (or press Space) 🔄</span>
      </div>
      ${controlsHtml}
    `;
  }

  flipFlashcard() {
    this.flashcards.isFlipped = !this.flashcards.isFlipped;
    this.renderFlashcard();
  }

  prevFlashcard() {
    if (this.flashcards.currentIndex > 0) {
      this.flashcards.currentIndex--;
      this.flashcards.isFlipped = false;
      this.flashcards.isCompleted = false;
      this.renderFlashcard();
    }
  }

  nextFlashcard() {
    if (this.flashcards.currentIndex + 1 < this.flashcards.cards.length) {
      this.flashcards.currentIndex++;
      this.flashcards.isFlipped = false;
      this.renderFlashcard();
    } else {
      this.flashcards.isCompleted = true;
      this.renderFlashcard();
    }
  }

  restartFlashcards() {
    this.flashcards.currentIndex = 0;
    this.flashcards.isFlipped = false;
    this.flashcards.isCompleted = false;
    this.renderFlashcard();
  }

  shuffleFlashcards() {
    if (!this.flashcards?.cards || this.flashcards.cards.length <= 1) return;
    for (let i = this.flashcards.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.flashcards.cards[i], this.flashcards.cards[j]] = [this.flashcards.cards[j], this.flashcards.cards[i]];
    }
    this.flashcards.currentIndex = 0;
    this.flashcards.isFlipped = false;
    this.flashcards.isCompleted = false;
    this.renderFlashcard();
    this.showToast('Flashcards shuffled! 🔀', 'info');
  }

  markFlashcardMastered(mastered) {
    const card = this.flashcards.cards[this.flashcards.currentIndex];
    if (card) {
      card.mastered = mastered;
    }
    this.showToast(mastered ? 'Marked as mastered!' : 'Marked for review.');
    this.nextFlashcard();
  }

  /* ==========================================================
     STUDY & EXAM HUB: STUDY GUIDE & FAQ
     ========================================================== */

  async generateStudyGuide() {
    const card = document.getElementById('study-guide-card');
    card.innerHTML = `<div class="card-empty-placeholder"><span class="icon">⏳</span><p>Generating comprehensive study guide...</p></div>`;

    try {
      const docNames = Array.from(this.selectedDocNames);
      const res = await fetch('/api/studio/study-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docNames })
      });

      if (!res.ok) throw new Error('Failed to generate study guide');
      const data = await res.json();
      this.lastStudyGuide = data.studyGuide;

      const renderedHtml = window.marked ? marked.parse(data.studyGuide) : `<pre>${this.escapeHtml(data.studyGuide)}</pre>`;
      card.innerHTML = `
        <div class="markdown-body">
          ${renderedHtml}
        </div>
        <div style="margin-top: 20px; display: flex; gap: 8px; justify-content: flex-end;">
          <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText(app.lastStudyGuide); app.showToast('Study guide copied to clipboard!');">📋 Copy</button>
          <button class="btn btn-primary btn-sm" onclick="app.saveLastStudyGuideAsNote()">💾 Save as Note</button>
        </div>
      `;
    } catch (err) {
      card.innerHTML = `<div class="card-empty-placeholder text-danger"><p>⚠️ ${this.escapeHtml(err.message)}</p></div>`;
    }
  }

  saveLastStudyGuideAsNote() {
    if (!this.lastStudyGuide) return;
    this.saveAsNote(`Study_Guide_${Date.now()}`, this.lastStudyGuide);
  }

  async generateFaq() {
    const container = document.getElementById('faq-container');
    container.innerHTML = `<div class="card-empty-placeholder"><span class="icon">⏳</span><p>Generating frequently asked questions...</p></div>`;

    try {
      const docNames = Array.from(this.selectedDocNames);
      const res = await fetch('/api/studio/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docNames })
      });

      if (!res.ok) throw new Error('Failed to generate FAQ');
      const data = await res.json();

      container.innerHTML = data.faqs.map(faq => `
        <div class="faq-item">
          <button class="faq-question-btn" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
            <span>❓ ${this.escapeHtml(faq.question)}</span>
            <span>↕</span>
          </button>
          <div class="faq-answer" style="display: block;">
            ${this.escapeHtml(faq.answer)}
          </div>
        </div>
      `).join('');
    } catch (err) {
      container.innerHTML = `<div class="card-empty-placeholder text-danger"><p>⚠️ ${this.escapeHtml(err.message)}</p></div>`;
    }
  }

  /* ==========================================================
     STUDY & EXAM HUB: AUDIO PODCAST OVERVIEW (DEEP DIVE)
     ========================================================== */

  async generatePodcast() {
    const container = document.getElementById('podcast-container');
    container.innerHTML = `<div class="card-empty-placeholder"><span class="icon">⏳</span><p>Generating podcast dialogue...</p></div>`;

    try {
      const docNames = Array.from(this.selectedDocNames);
      const res = await fetch('/api/studio/audio-overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docNames, hosts: ['Leo', 'Maya'] })
      });

      if (!res.ok) throw new Error('Failed to generate podcast dialogue');
      const data = await res.json();

      this.podcast = {
        title: data.podcast.title,
        hosts: data.podcast.hosts,
        script: data.podcast.script,
        currentLineIndex: -1,
        isPlaying: false,
        speechRate: 1.0
      };

      this.renderPodcastPlayer();
    } catch (err) {
      container.innerHTML = `<div class="card-empty-placeholder text-danger"><p>⚠️ ${this.escapeHtml(err.message)}</p></div>`;
    }
  }

  renderPodcastPlayer() {
    const container = document.getElementById('podcast-container');
    const [h1, h2] = this.podcast.hosts;

    container.innerHTML = `
      <div class="podcast-player-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h3 style="margin: 0; text-align: center; flex: 1;">🎙️ ${this.escapeHtml(this.podcast.title)}</h3>
          <span class="badge" id="podcast-status-badge">Paused</span>
        </div>
        
        <div class="podcast-hosts-row">
          <div class="host-avatar-box" id="avatar-host-0">
            <div class="host-avatar">👨‍💼</div>
            <span class="host-name">${this.escapeHtml(h1)}</span>
            <span class="host-role">Host 1: Leo</span>
          </div>

          <div class="host-avatar-box" id="avatar-host-1">
            <div class="host-avatar">👩‍💼</div>
            <span class="host-name">${this.escapeHtml(h2)}</span>
            <span class="host-role">Host 2: Maya</span>
          </div>
        </div>

        <div class="player-controls-bar">
          <button class="btn btn-primary" id="btn-podcast-play" onclick="app.togglePodcastPlayback()">
            ▶ Play Audio Deep Dive
          </button>
          <button class="btn btn-secondary" onclick="app.stopPodcastPlayback()">⏹ Stop</button>
          <span id="podcast-status-text" style="font-size: 13px; font-weight: 600; color: var(--text-muted); margin-left: 8px;">Paused</span>
          <select id="podcast-speed-select" onchange="app.setPodcastSpeed(this.value)" style="background: var(--bg-app); border: 1px solid var(--border-color); color: var(--text-main); padding: 4px 8px; border-radius: 4px;">
            <option value="1.0" selected>1.0x Speed</option>
            <option value="1.25">1.25x Speed</option>
            <option value="1.5">1.5x Speed</option>
          </select>
        </div>
      </div>

      <div class="podcast-transcript" id="podcast-transcript-box">
        ${this.podcast.script.map((line, idx) => `
          <div class="transcript-line" id="transcript-line-${idx}">
            <div class="transcript-speaker">${this.escapeHtml(line.speaker)}:</div>
            <div class="transcript-text">${this.escapeHtml(line.text)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  togglePodcastPlayback() {
    if (this.podcast.isPlaying) {
      this.pausePodcastPlayback();
    } else {
      this.startPodcastPlayback();
    }
  }

  startPodcastPlayback() {
    if (!('speechSynthesis' in window)) {
      this.showToast('Web Speech API is unfortunately not supported by this browser.', 'error');
      return;
    }

    this.podcast.isPlaying = true;
    const playBtn = document.getElementById('btn-podcast-play');
    if (playBtn) playBtn.textContent = '⏸ Pause';
    const statusBadge = document.getElementById('podcast-status-badge');
    if (statusBadge) statusBadge.textContent = 'Playing Audio Deep Dive...';
    const statusText = document.getElementById('podcast-status-text');
    if (statusText) statusText.textContent = 'Playing Audio Deep Dive...';

    if (this.podcast.currentLineIndex === -1 || this.podcast.currentLineIndex >= this.podcast.script.length) {
      this.podcast.currentLineIndex = 0;
    }

    this.playNextPodcastLine();
  }

  pausePodcastPlayback() {
    this.podcast.isPlaying = false;
    window.speechSynthesis.cancel();
    const playBtn = document.getElementById('btn-podcast-play');
    if (playBtn) playBtn.textContent = '▶ Play Audio Deep Dive';
    const statusBadge = document.getElementById('podcast-status-badge');
    if (statusBadge) statusBadge.textContent = 'Paused';
    const statusText = document.getElementById('podcast-status-text');
    if (statusText) statusText.textContent = 'Paused';
    this.updateHostAvatars(-1);
  }

  stopPodcastPlayback() {
    this.podcast.isPlaying = false;
    this.podcast.currentLineIndex = -1;
    window.speechSynthesis.cancel();
    const playBtn = document.getElementById('btn-podcast-play');
    if (playBtn) playBtn.textContent = '▶ Play Audio Deep Dive';
    const statusBadge = document.getElementById('podcast-status-badge');
    if (statusBadge) statusBadge.textContent = 'Paused';
    const statusText = document.getElementById('podcast-status-text');
    if (statusText) statusText.textContent = 'Paused';
    this.updateHostAvatars(-1);

    document.querySelectorAll('.transcript-line').forEach(el => el.classList.remove('speaking'));
  }

  setPodcastSpeed(val) {
    this.podcast.speechRate = parseFloat(val) || 1.0;
  }

  playNextPodcastLine() {
    if (!this.podcast.isPlaying) return;
    if (this.podcast.currentLineIndex >= this.podcast.script.length) {
      this.stopPodcastPlayback();
      this.showToast('Audio deep dive complete! 🎧', 'success');
      return;
    }

    const line = this.podcast.script[this.podcast.currentLineIndex];
    const isHost1 = line.speaker === this.podcast.hosts[0];
    this.updateHostAvatars(isHost1 ? 0 : 1);

    // Highlight transcript line
    document.querySelectorAll('.transcript-line').forEach((el, idx) => {
      const active = idx === this.podcast.currentLineIndex;
      el.classList.toggle('speaking', active);
      if (active) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    const utterance = new SpeechSynthesisUtterance(line.text);
    utterance.lang = this.settings.language === 'en' ? 'en-US' : 'nl-NL';
    utterance.rate = this.podcast.speechRate;

    // Distinguish hosts by pitch
    utterance.pitch = isHost1 ? 0.9 : 1.2;

    utterance.onend = () => {
      if (this.podcast.isPlaying) {
        this.podcast.currentLineIndex++;
        this.playNextPodcastLine();
      }
    };

    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      if (this.podcast.isPlaying) {
        this.podcast.currentLineIndex++;
        this.playNextPodcastLine();
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  updateHostAvatars(speakingHostIdx) {
    const a0 = document.getElementById('avatar-host-0');
    const a1 = document.getElementById('avatar-host-1');
    if (!a0 || !a1) return;

    a0.querySelector('.host-avatar').classList.toggle('speaking', speakingHostIdx === 0);
    a1.querySelector('.host-avatar').classList.toggle('speaking', speakingHostIdx === 1);
  }

  /* ==========================================================
     INGESTION & CONVERSION HUB
     ========================================================== */

  async uploadFiles(fileList) {
    if (!fileList || fileList.length === 0) return;

    const format = document.querySelector('input[name="convert-target-format"]:checked')?.value || 'md';
    const formData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formData.append('files', fileList[i]);
    }
    formData.append('format', format);

    this.showToast(`Converting ${fileList.length} file(s)...`);

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Conversion failed');
      }

      const data = await res.json();
      this.showToast(`🎉 ${data.convertedCount} file(s) successfully converted to .${format}!`, 'success');

      // Update conversion feed UI
      this.renderConversionResults(data.results);

      // Reload sources and open the first converted doc
      await this.loadDocuments();
      if (data.results && data.results[0]) {
        this.openDocument(data.results[0].fileName);
      }
    } catch (err) {
      this.showToast('Conversion error: ' + err.message, 'error');
    }
  }

  async convertPastedText() {
    const titleInput = document.getElementById('paste-title');
    const contentInput = document.getElementById('paste-content');
    const title = titleInput.value.trim() || `Note_${Date.now()}`;
    const text = contentInput.value.trim();

    if (!text) {
      this.showToast('Please enter or paste text first.', 'error');
      return;
    }

    const format = document.querySelector('input[name="convert-target-format"]:checked')?.value || 'md';

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: title, text, format })
      });

      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();

      titleInput.value = '';
      contentInput.value = '';
      this.showToast(`Note saved as .${format}!`, 'success');

      await this.loadDocuments();
      if (data.results && data.results[0]) {
        this.openDocument(data.results[0].fileName);
      }
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  renderConversionResults(results = []) {
    const feedSection = document.getElementById('conversion-feed-section');
    const listEl = document.getElementById('conversion-list');
    feedSection.style.display = 'block';

    const itemsHtml = results.map(r => `
      <div class="conversion-item">
        <div>
          <strong>${this.escapeHtml(r.fileName)}</strong>
          <div style="font-size: 11px; color: var(--text-muted);">
            Original: ${this.escapeHtml(r.originalFilename)} • ${r.wordCount} words
            ${r.imagesExtracted && r.imagesExtracted.length > 0 ? ` • 🖼️ ${r.imagesExtracted.length} image(s) saved in assets/` : ''}
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="app.openDocument('${this.escapeHtml(r.fileName)}')">View ➔</button>
      </div>
    `).join('');

    listEl.innerHTML = itemsHtml + listEl.innerHTML;
  }

  async saveAsNote(title, content) {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, format: 'md' })
      });

      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      this.showToast(`Saved as '${data.name}'!`, 'success');
      await this.loadDocuments();
      this.openDocument(data.name);
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  /* ==========================================================
     FEATURE F1: TRIPLE-TIMELINE SCRUBBER
     ========================================================== */

  async loadTimelineData() {
    try {
      const res = await fetch('/api/studio/timeline');
      if (!res.ok) throw new Error('Could not fetch timeline data');
      const data = await res.json();
      this.timeline.events = data.events || [];
      this.timeline.totalSteps = Math.max(...this.timeline.events.map(e => e.stepIndex || 1), 12);
      this.timeline.currentStep = 1;
      if (this.timeline.events.length > 0 && !this.timeline.selectedEventId) {
        this.timeline.selectedEventId = this.timeline.events[0].id;
      }

      this.renderScrubberTicks();
      this.renderTimelineTracks();
      this.renderTimelineCommentary();
    } catch (err) {
      console.error('Error loading timeline:', err);
      this.showToast('Error loading timeline: ' + err.message, 'error');
    }
  }

  renderScrubberTicks() {
    const ticksContainer = document.getElementById('scrubber-ticks');
    if (!ticksContainer) return;

    let html = '';
    for (let i = 1; i <= this.timeline.totalSteps; i++) {
      html += `<span class="scrubber-tick ${i === this.timeline.currentStep ? 'active' : ''}" onclick="app.setScrubberStep(${i})">Step ${i}</span>`;
    }
    ticksContainer.innerHTML = html;
  }

  renderTimelineTracks() {
    const eraAContainer = document.getElementById('era-a-cards');
    const eraBContainer = document.getElementById('era-b-cards');
    const eraCContainer = document.getElementById('era-c-cards');
    if (!eraAContainer || !eraBContainer || !eraCContainer) return;

    const currentStep = this.timeline.currentStep;
    const filter = this.timeline.activeTheme;

    const renderCard = (ev) => {
      const isActive = ev.stepIndex === currentStep;
      const isSelected = ev.id === this.timeline.selectedEventId;
      const matchesFilter = filter === 'all' || (ev.themes && ev.themes.includes(filter));
      const dimmedClass = matchesFilter ? '' : 'dimmed';

      return `
        <div class="timeline-card ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''} ${dimmedClass}"
             onclick="app.selectTimelineEvent('${ev.id}')">
          <div class="card-top-meta">
            <span class="card-chapter-badge">${this.escapeHtml(ev.chapter)}</span>
            <span class="card-step-badge">Step ${ev.stepIndex}</span>
          </div>
          <div class="card-event-title">${this.escapeHtml(ev.title)}</div>
          <div class="card-summary-snippet">${this.escapeHtml(ev.summary.slice(0, 110))}...</div>
          <div class="card-anchors">
            ${(ev.characterAnchors || []).map(a => `<span class="anchor-chip">👤 ${this.escapeHtml(a)}</span>`).join('')}
          </div>
        </div>
      `;
    };

    eraAContainer.innerHTML = this.timeline.events.filter(e => e.eraKey === 'era-a').map(renderCard).join('') || '<p class="text-muted" style="font-size:12px;">No events in this step.</p>';
    eraBContainer.innerHTML = this.timeline.events.filter(e => e.eraKey === 'era-b').map(renderCard).join('') || '<p class="text-muted" style="font-size:12px;">No events in this step.</p>';
    eraCContainer.innerHTML = this.timeline.events.filter(e => e.eraKey === 'era-c').map(renderCard).join('') || '<p class="text-muted" style="font-size:12px;">No events in this step.</p>';

    // Update active badge
    const badge = document.getElementById('scrubber-step-display');
    const activeEventsInStep = this.timeline.events.filter(e => e.stepIndex === currentStep);
    const stepTitle = activeEventsInStep.length > 0 ? activeEventsInStep[0].title : `Step ${currentStep}`;
    if (badge) {
      badge.textContent = `Step ${currentStep} of ${this.timeline.totalSteps} — ${stepTitle}`;
    }

    // Update slider value
    const slider = document.getElementById('timeline-scrubber-slider');
    if (slider && parseInt(slider.value) !== currentStep) {
      slider.value = currentStep;
    }

    this.renderScrubberTicks();
  }

  selectTimelineEvent(id) {
    const ev = this.timeline.events.find(e => e.id === id);
    if (!ev) return;

    this.timeline.selectedEventId = id;
    if (ev.stepIndex !== this.timeline.currentStep) {
      this.timeline.currentStep = ev.stepIndex;
    }
    this.renderTimelineTracks();
    this.renderTimelineCommentary();
  }

  setScrubberStep(step) {
    if (step < 1) step = 1;
    if (step > this.timeline.totalSteps) step = this.timeline.totalSteps;
    this.timeline.currentStep = step;

    // Auto-select first event in this step
    const eventsInStep = this.timeline.events.filter(e => e.stepIndex === step);
    if (eventsInStep.length > 0) {
      this.timeline.selectedEventId = eventsInStep[0].id;
    }

    this.renderTimelineTracks();
    this.renderTimelineCommentary();
  }

  stepScrubber(delta) {
    this.setScrubberStep(this.timeline.currentStep + delta);
  }

  toggleScrubberPlay() {
    const playBtn = document.getElementById('btn-scrubber-play');
    if (this.timeline.isPlaying) {
      this.stopScrubberPlay();
    } else {
      this.timeline.isPlaying = true;
      if (playBtn) playBtn.textContent = '⏸ Pause Auto-Play';
      this.timeline.playTimer = setInterval(() => {
        let nextStep = this.timeline.currentStep + 1;
        if (nextStep > this.timeline.totalSteps) nextStep = 1;
        this.setScrubberStep(nextStep);
      }, 3500);
    }
  }

  stopScrubberPlay() {
    this.timeline.isPlaying = false;
    if (this.timeline.playTimer) {
      clearInterval(this.timeline.playTimer);
      this.timeline.playTimer = null;
    }
    const playBtn = document.getElementById('btn-scrubber-play');
    if (playBtn) playBtn.textContent = '▶ Auto-Play Timeline';
  }

  filterTimelineByTheme(theme) {
    this.timeline.activeTheme = theme;
    document.querySelectorAll('#timeline-theme-filters .btn-filter').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });
    this.renderTimelineTracks();
  }

  renderTimelineCommentary() {
    const container = document.getElementById('timeline-commentary-pane');
    if (!container) return;

    const ev = this.timeline.events.find(e => e.id === this.timeline.selectedEventId) || this.timeline.events[0];
    if (!ev) {
      container.innerHTML = '<p class="text-muted">Select an event from the timeline tracks above.</p>';
      return;
    }

    container.innerHTML = `
      <div class="commentary-header">
        <div class="commentary-title-group">
          <span class="commentary-era-tag">${this.escapeHtml(ev.eraName)} • ${this.escapeHtml(ev.chapter)}</span>
          <h4>${this.escapeHtml(ev.title)}</h4>
        </div>
        <div class="commentary-actions">
          <button class="btn btn-secondary btn-sm" onclick="app.copyTimelineCitation('${ev.id}')">📋 Copy Essay Citation</button>
          <button class="btn btn-primary btn-sm" onclick="app.saveTimelineAsEssayPlan('${ev.id}')">📝 Save to Notes</button>
        </div>
      </div>

      <p style="font-size: 14px; line-height: 1.6; margin-bottom: 14px; color: var(--text-main);">
        ${this.escapeHtml(ev.summary)}
      </p>

      ${ev.quote ? `
        <div class="commentary-quote-box">
          ${this.escapeHtml(ev.quote)}
        </div>
      ` : ''}

      <div class="commentary-body-grid">
        <div class="commentary-section">
          <h5>🔍 GCSE AO2: Structure, Form & Parallelism</h5>
          <p>${this.escapeHtml(ev.ao2Analysis)}</p>
        </div>
        <div class="commentary-section">
          <h5>✍️ Exam Essay Guidance & Critical Tip</h5>
          <p>${this.escapeHtml(ev.essayTip)}</p>
        </div>
      </div>

      <div class="commentary-themes-row">
        <span style="font-size: 11px; font-weight: 700; color: var(--text-dim); text-transform: uppercase;">Themes:</span>
        ${(ev.themes || []).map(t => `<span class="theme-tag-pill">🏷️ ${this.escapeHtml(t)}</span>`).join('')}
      </div>
    `;
  }

  copyTimelineCitation(id) {
    const ev = this.timeline.events.find(e => e.id === id);
    if (!ev) return;
    const text = `"${ev.quote}" (${ev.chapter}) — Analysis: ${ev.ao2Analysis}`;
    navigator.clipboard.writeText(text);
    this.showToast('Essay citation copied to clipboard!', 'success');
  }

  saveTimelineAsEssayPlan(id) {
    const ev = this.timeline.events.find(e => e.id === id);
    if (!ev) return;
    const md = `# Essay Analysis: ${ev.title}\n\n` +
      `**Era & Chapter:** ${ev.eraName} (${ev.chapter})\n` +
      `**Characters:** ${(ev.characterAnchors || []).join(', ')}\n\n` +
      `### Plot Summary\n${ev.summary}\n\n` +
      `### Key Textual Quote\n> ${ev.quote}\n\n` +
      `### GCSE/A-Level AO2 Structural Analysis\n${ev.ao2Analysis}\n\n` +
      `### Exam Strategy\n${ev.essayTip}\n\n` +
      `---\n*Exported from Camp Green Lake Holes Study & Exam Hub*`;
    this.saveAsNote(`Essay_Note_${ev.title.replace(/\\s+/g, '_')}`, md);
  }

  /* ==========================================================
     UI HELPERS & MODALS
     ========================================================== */

  showTab(tabId) {
    if (tabId === 'tab-convert') {
      this.openConvertModal();
      return;
    }
    if (tabId !== 'tab-studio' && this.timeline?.isPlaying) {
      this.stopScrubberPlay();
    }
    this.currentTab = tabId;
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.tab-panel').forEach(panel => {
      if (panel.id !== 'tab-convert') {
        panel.classList.toggle('active', panel.id === tabId);
      }
    });
  }

  showStudioSubtab(subtabId) {
    if (subtabId === 'studio-chat') {
      this.showTab('tab-chat');
      return;
    }
    if (subtabId !== 'studio-timeline' && this.timeline?.isPlaying) {
      this.stopScrubberPlay();
    }
    this.currentStudioSubtab = subtabId;
    document.querySelectorAll('.subtab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-subtab') === subtabId);
    });
    document.querySelectorAll('.studio-content-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === subtabId);
    });
    if (subtabId === 'studio-timeline' && this.timeline.events.length === 0) {
      this.loadTimelineData();
    }
    if (subtabId === 'studio-motifs' && this.motifs.length === 0) {
      this.loadMotifsData();
    }
    if (subtabId === 'studio-quotes' && this.quoteChallenge.quotes.length === 0) {
      this.loadQuoteChallengeData();
    }
    if (subtabId === 'studio-essay' && this.essayPrompts.length === 0) {
      this.loadEssayPromptsData();
    }
    if (subtabId === 'studio-characters' && (!this.characterGraph || this.characterGraph.nodes.length === 0)) {
      this.loadCharacterGraphData();
    }
  }


  /* ==========================================================
     FEATURE F6: FOCUS TIMER ("DIG A HOLE")
     ========================================================== */
  initFocusTimer() {
    this.focusTimer = {
      timeLeft: 25 * 60,
      totalTime: 25 * 60,
      isRunning: false,
      mode: 'digging',
      holesDug: parseInt(localStorage.getItem('holes_study_dug_counter') || localStorage.getItem('notebooklm_holes_dug') || '0', 10),
      timerId: null,
      targetEndTime: null
    };
    this.updateFocusTimerDisplay();

    if (!this._visibilityListenerBound) {
      this._visibilityListenerBound = true;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.focusTimer.isRunning && this.focusTimer.targetEndTime) {
          const remaining = Math.max(0, Math.round((this.focusTimer.targetEndTime - Date.now()) / 1000));
          this.focusTimer.timeLeft = remaining;
          this.updateFocusTimerDisplay();
          if (remaining <= 0) {
            this.completeFocusSession();
          }
        }
      });
    }
  }

  openFocusTimerModal() {
    document.getElementById('modal-focus-timer').style.display = 'flex';
  }

  closeFocusTimerModal() {
    document.getElementById('modal-focus-timer').style.display = 'none';
  }

  startFocusTimer() {
    if (this.focusTimer.isRunning) return;
    this.focusTimer.isRunning = true;
    const startBtn = document.getElementById('btn-focus-start');
    const pauseBtn = document.getElementById('btn-focus-pause');
    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'inline-block';

    this.focusTimer.targetEndTime = Date.now() + this.focusTimer.timeLeft * 1000;

    this.focusTimer.timerId = setInterval(() => {
      const remaining = Math.max(0, Math.round((this.focusTimer.targetEndTime - Date.now()) / 1000));
      this.focusTimer.timeLeft = remaining;
      this.updateFocusTimerDisplay();
      if (remaining <= 0) {
        this.completeFocusSession();
      }
    }, 500);
  }

  pauseFocusTimer() {
    this.focusTimer.isRunning = false;
    if (this.focusTimer.timerId) {
      clearInterval(this.focusTimer.timerId);
      this.focusTimer.timerId = null;
    }
    if (this.focusTimer.targetEndTime) {
      this.focusTimer.timeLeft = Math.max(0, Math.round((this.focusTimer.targetEndTime - Date.now()) / 1000));
      this.focusTimer.targetEndTime = null;
    }
    const startBtn = document.getElementById('btn-focus-start');
    const pauseBtn = document.getElementById('btn-focus-pause');
    if (startBtn) startBtn.style.display = 'inline-block';
    if (pauseBtn) pauseBtn.style.display = 'none';
  }

  resetFocusTimer(totalMinutes = 25, mode = 'digging') {
    this.pauseFocusTimer();
    this.focusTimer.mode = mode;
    this.focusTimer.totalTime = totalMinutes * 60;
    this.focusTimer.timeLeft = totalMinutes * 60;
    this.focusTimer.targetEndTime = null;
    this.updateFocusTimerDisplay();
  }

  startWaterBreak() {
    this.resetFocusTimer(5, 'water');
    this.startFocusTimer();
    this.showToast('Water break with Mr. Sir started (5 minutes)! Drink some water.', 'info');
  }

  completeFocusSession() {
    this.pauseFocusTimer();
    if (this.focusTimer.mode === 'digging') {
      this.focusTimer.holesDug++;
      localStorage.setItem('holes_study_dug_counter', this.focusTimer.holesDug.toString());
      this.showToast('🕳️ Congratulations! You dug a 5ft x 5ft hole!', 'success');
      this.resetFocusTimer(5, 'water');
      this.startFocusTimer();
    } else {
      this.showToast('💧 Water break over! Time to dig the next hole.', 'info');
      this.resetFocusTimer(25, 'digging');
    }
  }

  updateFocusTimerDisplay() {
    const mins = Math.floor(this.focusTimer.timeLeft / 60);
    const secs = this.focusTimer.timeLeft % 60;
    const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const countdownEl = document.getElementById('focus-timer-countdown');
    if (countdownEl) countdownEl.textContent = formattedTime;

    const badgeEl = document.getElementById('focus-timer-mode-badge');
    const headerBtn = document.getElementById('btn-focus-timer');
    if (headerBtn) {
      headerBtn.innerHTML = `<span>⛏️</span> ${formattedTime} (🕳️ ${this.focusTimer.holesDug})`;
    }

    if (badgeEl) {
      if (this.focusTimer.mode === 'digging') {
        badgeEl.textContent = `DIGGING HOLE #${this.focusTimer.holesDug + 1} (TENT D)`;
        badgeEl.style.color = 'var(--accent-primary)';
      } else {
        badgeEl.textContent = `💧 WATER BREAK WITH MR. SIR`;
        badgeEl.style.color = '#06b6d4';
      }
    }

    const progressFraction = 1 - (this.focusTimer.timeLeft / this.focusTimer.totalTime);
    const currentDepth = (progressFraction * 5.0).toFixed(1);
    const depthFill = document.getElementById('focus-depth-fill');
    const depthLabel = document.getElementById('focus-shovel-depth-label');
    if (depthFill) depthFill.style.width = `${Math.round(progressFraction * 100)}%`;
    if (depthLabel) depthLabel.textContent = `${currentDepth} ft / 5.0 ft`;

    const holesEl = document.getElementById('focus-holes-count');
    if (holesEl) holesEl.textContent = this.focusTimer.holesDug;
  }

  /* ==========================================================
     FEATURE F2: SYMBOLISM & MOTIF TRACKER
     ========================================================== */
  async loadMotifsData() {
    const wrapper = document.getElementById('motif-detail-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = `<div class="card-empty-placeholder"><span class="icon">⏳</span><p>Loading symbolism & motifs matrix...</p></div>`;

    try {
      const res = await fetch('/api/studio/motifs');
      if (!res.ok) throw new Error('Could not load symbolism motifs');
      const data = await res.json();
      this.motifs = data.motifs;
      this.activeMotifId = this.motifs[0]?.id || 'onions';
      this.renderActiveMotif();
    } catch (err) {
      wrapper.innerHTML = `<div class="card-empty-placeholder text-danger"><p>⚠️ ${this.escapeHtml(err.message)}</p></div>`;
    }
  }

  selectMotif(motifId) {
    this.activeMotifId = motifId;
    document.querySelectorAll('#motif-pills-container .btn-filter').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-motif') === motifId);
    });
    this.renderActiveMotif();
  }

  renderActiveMotif() {
    const wrapper = document.getElementById('motif-detail-wrapper');
    if (!wrapper || !this.motifs) return;
    const motif = this.motifs.find(m => m.id === this.activeMotifId) || this.motifs[0];
    if (!motif) return;

    wrapper.innerHTML = `
      <div class="motif-card">
        <div class="motif-header-row">
          <span class="motif-header-icon">${motif.icon}</span>
          <div>
            <h3 class="motif-header-title">${this.escapeHtml(motif.title)}</h3>
            <span style="font-size: 11px; font-weight: 700; color: var(--accent-primary); text-transform: uppercase;">Central Exam Symbolism</span>
          </div>
        </div>

        <p class="motif-significance-text">${this.escapeHtml(motif.thematicSignificance)}</p>

        <h4 style="font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 12px;">Chronological Citation & Evidence Matrix:</h4>
        <div class="motif-appearances-grid">
          ${motif.appearances.map(app => `
            <div class="appearance-card">
              <span class="era-badge">${this.escapeHtml(app.era)} • ${this.escapeHtml(app.chapter)}</span>
              <p style="font-size: 12px; margin: 0; color: var(--text-main);">${this.escapeHtml(app.context)}</p>
              <div class="appearance-quote">"${this.escapeHtml(app.quote)}"</div>
              <div class="appearance-ao2"><strong>GCSE AO2:</strong> ${this.escapeHtml(app.analysisAO2)}</div>
            </div>
          `).join('')}
        </div>

        <div class="peel-builder-box">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
            <h4 style="margin:0;">📝 GCSE/A-Level Model PEEL Paragraph Builder</h4>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-secondary btn-sm" onclick="app.copyPeelParagraph('${motif.id}')">📋 Copy Paragraph</button>
              <button class="btn btn-primary btn-sm" onclick="app.savePeelParagraphAsNote('${motif.id}')">💾 Save as Note</button>
            </div>
          </div>
          <div class="peel-clause"><strong>[P] Point:</strong> ${this.escapeHtml(motif.peelModel.point)}</div>
          <div class="peel-clause"><strong>[E] Evidence:</strong> ${this.escapeHtml(motif.peelModel.evidence)}</div>
          <div class="peel-clause"><strong>[E] Explanation (AO2):</strong> ${this.escapeHtml(motif.peelModel.explanation)}</div>
          <div class="peel-clause"><strong>[L] Link to Question:</strong> ${this.escapeHtml(motif.peelModel.link)}</div>
        </div>
      </div>
    `;
  }

  copyPeelParagraph(motifId) {
    const motif = this.motifs?.find(m => m.id === motifId);
    if (!motif) return;
    const p = motif.peelModel;
    const text = `${p.point} ${p.evidence} ${p.explanation} ${p.link}`;
    navigator.clipboard.writeText(text);
    this.showToast('PEEL essay paragraph copied to clipboard!', 'success');
  }

  savePeelParagraphAsNote(motifId) {
    const motif = this.motifs?.find(m => m.id === motifId);
    if (!motif) return;
    const p = motif.peelModel;
    const md = `# Symbolism Analysis: ${motif.title}\n\n` +
      `**Thematic Value:** ${motif.thematicSignificance}\n\n` +
      `### PEEL Essay Paragraph\n` +
      `- **Point:** ${p.point}\n` +
      `- **Evidence:** ${p.evidence}\n` +
      `- **Explanation:** ${p.explanation}\n` +
      `- **Link:** ${p.link}\n\n` +
      `### Full Combined Text\n> ${p.point} ${p.evidence} ${p.explanation} ${p.link}\n\n` +
      `---\n*Exported from Camp Green Lake Holes Study & Exam Hub*`;
    this.saveAsNote(`PEEL_${motif.id}`, md);
  }

  /* ==========================================================
     FEATURE F3: QUOTE IDENTIFICATION & ANALYSIS CHALLENGE
     ========================================================== */
  async loadQuoteChallengeData() {
    const wrapper = document.getElementById('quote-challenge-wrapper');
    if (!wrapper) return;
    wrapper.innerHTML = `<div class="card-empty-placeholder"><span class="icon">⏳</span><p>Loading iconic quotations bank...</p></div>`;

    try {
      const res = await fetch('/api/studio/quotes');
      if (!res.ok) throw new Error('Could not load quotes bank');
      const data = await res.json();
      this.quoteChallenge = {
        quotes: data.quotes,
        currentIndex: 0,
        score: 0,
        streak: 0,
        step1Answered: false,
        step2Answered: false
      };
      this.renderQuoteChallenge();
    } catch (err) {
      wrapper.innerHTML = `<div class="card-empty-placeholder text-danger"><p>⚠️ ${this.escapeHtml(err.message)}</p></div>`;
    }
  }

  renderQuoteChallenge() {
    const wrapper = document.getElementById('quote-challenge-wrapper');
    if (!wrapper || !this.quoteChallenge?.quotes) return;
    const total = this.quoteChallenge.quotes.length;

    const scoreBadge = document.getElementById('quote-score-badge');
    const streakBadge = document.getElementById('quote-streak-badge');
    if (scoreBadge) scoreBadge.textContent = `Score: ${this.quoteChallenge.score} pts`;
    if (streakBadge) streakBadge.textContent = `Streak: 🔥 ${this.quoteChallenge.streak}`;

    if (this.quoteChallenge.isCompleted) {
      const maxStreak = this.quoteChallenge.maxStreak || this.quoteChallenge.streak;
      const score = this.quoteChallenge.score;
      let tier = '📖 Tier 3: Good Foundation — Keep Reviewing!';
      if (score >= 1200) {
        tier = '⭐ Tier 1: Camp Green Lake Master Scholar (Top Band / Grade 9 / A*)';
      } else if (score >= 800) {
        tier = '👍 Tier 2: Strong Literary Analyst (Grade 7-8 / A)';
      }

      wrapper.innerHTML = `
        <div class="quote-hero-card" style="text-align: center; padding: 36px 20px;">
          <span class="badge" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-success); font-size: 13px; font-weight: 700;">🏆 Challenge Complete!</span>
          <h2 style="font-size: 24px; margin: 16px 0 8px; color: var(--text-main);">Iconic Quote Mastery Finished!</h2>
          <div style="font-size: 40px; font-weight: 800; color: var(--accent-primary); margin: 8px 0;">
            ${score} <span style="font-size: 18px; font-weight: 600; color: var(--text-muted);">points</span>
          </div>
          <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 16px; font-size: 14px;">
            Best Streak: <strong>🔥 ${maxStreak}</strong> consecutive correct answers across all ${total} canonical quotations.
          </p>
          <div style="background: var(--bg-app); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 12px; max-width: 500px; margin: 0 auto 24px;">
            <strong style="color: var(--accent-primary);">${tier}</strong>
          </div>
          <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="app.restartQuoteChallenge()">🔁 Retake Challenge</button>
            <button class="btn btn-accent" onclick="app.showStudioSubtab('studio-essay')">📝 Practice Essay with Quotes</button>
          </div>
        </div>
      `;
      return;
    }

    const q = this.quoteChallenge.quotes[this.quoteChallenge.currentIndex];

    wrapper.innerHTML = `
      <div class="quote-hero-card">
        <span class="quote-chapter-badge">Quote ${this.quoteChallenge.currentIndex + 1} of ${total} • ${this.escapeHtml(q.chapter)}</span>
        <div class="quote-text-banner">"${this.escapeHtml(q.quote)}"</div>
        <span style="font-size: 12px; color: var(--text-dim);">Central Theme: <strong>${this.escapeHtml(q.theme)}</strong></span>
      </div>

      <div class="quote-steps-container">
        <!-- Step 1: Speaker & Context -->
        <div class="quote-step-box" id="quote-step1-box">
          <h4>Step 1: Who said this and what is the dramatic context?</h4>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;"><em>Context clue: ${this.escapeHtml(q.context)}</em></p>
          <div class="quote-options-grid">
            ${q.options.map((opt, idx) => `
              <button class="quote-opt-btn" onclick="app.answerQuoteSpeaker(${idx})">
                <strong>${String.fromCharCode(65 + idx)}.</strong> ${this.escapeHtml(opt)}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Step 2: Subtext & AO2 Analysis -->
        <div class="quote-step-box" id="quote-step2-box" style="display:none;">
          <h4>Step 2: Critical Literary Subtext (Select the highest-level analysis):</h4>
          <div class="quote-options-grid" style="grid-template-columns: 1fr;">
            ${q.subtextOptions.map((sub, idx) => `
              <button class="quote-opt-btn" onclick="app.answerQuoteSubtext(${idx})">
                <strong>${String.fromCharCode(65 + idx)}.</strong> ${this.escapeHtml(sub)}
              </button>
            `).join('')}
          </div>
        </div>

        <div id="quote-feedback-slot"></div>
      </div>
    `;
  }

  answerQuoteSpeaker(selectedIdx) {
    if (this.quoteChallenge.step1Answered) return;
    this.quoteChallenge.step1Answered = true;

    const q = this.quoteChallenge.quotes[this.quoteChallenge.currentIndex];
    const isCorrect = selectedIdx === q.correctIndex;

    const btns = document.querySelectorAll('#quote-step1-box .quote-opt-btn');
    btns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctIndex) btn.classList.add('correct');
      else if (idx === selectedIdx) btn.classList.add('incorrect');
    });

    if (isCorrect) {
      this.quoteChallenge.score += 50;
      this.quoteChallenge.streak++;
      this.quoteChallenge.maxStreak = Math.max(this.quoteChallenge.maxStreak || 0, this.quoteChallenge.streak);
      this.showToast('Correct speaker! Now analyze the subtext.', 'success');
    } else {
      this.quoteChallenge.streak = 0;
      this.showToast(`Incorrect speaker. It was spoken by ${q.speaker}.`, 'error');
    }

    const scoreBadge = document.getElementById('quote-score-badge');
    const streakBadge = document.getElementById('quote-streak-badge');
    if (scoreBadge) scoreBadge.textContent = `Score: ${this.quoteChallenge.score} pts`;
    if (streakBadge) streakBadge.textContent = `Streak: 🔥 ${this.quoteChallenge.streak}`;

    document.getElementById('quote-step2-box').style.display = 'block';
  }

  answerQuoteSubtext(selectedIdx) {
    if (this.quoteChallenge.step2Answered) return;
    this.quoteChallenge.step2Answered = true;

    const q = this.quoteChallenge.quotes[this.quoteChallenge.currentIndex];
    const isCorrect = selectedIdx === q.correctSubtextIndex;

    const btns = document.querySelectorAll('#quote-step2-box .quote-opt-btn');
    btns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctSubtextIndex) btn.classList.add('correct');
      else if (idx === selectedIdx) btn.classList.add('incorrect');
    });

    if (isCorrect) {
      this.quoteChallenge.score += 100;
      this.quoteChallenge.streak++;
      this.quoteChallenge.maxStreak = Math.max(this.quoteChallenge.maxStreak || 0, this.quoteChallenge.streak);
      this.showToast('Outstanding literary insight! +100 pts', 'success');
    } else {
      this.quoteChallenge.streak = 0;
      this.showToast('Subtext selection missed the critical nuance.', 'error');
    }

    const scoreBadge = document.getElementById('quote-score-badge');
    const streakBadge = document.getElementById('quote-streak-badge');
    if (scoreBadge) scoreBadge.textContent = `Score: ${this.quoteChallenge.score} pts`;
    if (streakBadge) streakBadge.textContent = `Streak: 🔥 ${this.quoteChallenge.streak}`;

    const isLast = this.quoteChallenge.currentIndex + 1 >= this.quoteChallenge.quotes.length;
    const nextBtnLabel = isLast ? 'Finish & View Results 🏆' : 'Next Quote ➔';

    const slot = document.getElementById('quote-feedback-slot');
    slot.innerHTML = `
      <div class="quote-model-box">
        <h5 style="margin: 0 0 6px; color: var(--accent-success); font-size: 14px;">🎯 Model Sentence for Literature Essays:</h5>
        <p style="margin: 0; font-size: 13px; font-weight: 500;">"${this.escapeHtml(q.modelSentence)}"</p>
      </div>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
        <button class="btn btn-accent" onclick="app.loadNextQuote()">${nextBtnLabel}</button>
      </div>
    `;
  }

  loadNextQuote() {
    if (!this.quoteChallenge?.quotes) return;
    if (this.quoteChallenge.currentIndex + 1 >= this.quoteChallenge.quotes.length) {
      this.quoteChallenge.isCompleted = true;
    } else {
      this.quoteChallenge.currentIndex++;
      this.quoteChallenge.step1Answered = false;
      this.quoteChallenge.step2Answered = false;
    }
    this.renderQuoteChallenge();
  }

  restartQuoteChallenge() {
    this.quoteChallenge.currentIndex = 0;
    this.quoteChallenge.score = 0;
    this.quoteChallenge.streak = 0;
    this.quoteChallenge.maxStreak = 0;
    this.quoteChallenge.isCompleted = false;
    this.quoteChallenge.step1Answered = false;
    this.quoteChallenge.step2Answered = false;
    this.renderQuoteChallenge();
  }

  /* ==========================================================
     FEATURE F4: ESSAY PROMPT & THESIS GENERATOR
     ========================================================== */
  async loadEssayPromptsData() {
    const wrapper = document.getElementById('essay-builder-wrapper');
    const select = document.getElementById('essay-prompt-select');
    if (!wrapper || !select) return;
    wrapper.innerHTML = `<div class="card-empty-placeholder"><span class="icon">⏳</span><p>Loading standardized exam prompts...</p></div>`;

    try {
      const res = await fetch('/api/studio/essay-prompts');
      if (!res.ok) throw new Error('Could not load essay prompts');
      const data = await res.json();
      this.essayPrompts = data.prompts;
      this.activePromptId = this.essayPrompts[0]?.id || 'prompt_1';

      select.innerHTML = this.essayPrompts.map(p => `
        <option value="${p.id}">${this.escapeHtml(p.board)}: ${this.escapeHtml(p.title)}</option>
      `).join('');

      select.onchange = (e) => this.selectEssayPrompt(e.target.value);
      this.renderEssayPrompt();
    } catch (err) {
      wrapper.innerHTML = `<div class="card-empty-placeholder text-danger"><p>⚠️ ${this.escapeHtml(err.message)}</p></div>`;
    }
  }

  selectEssayPrompt(promptId) {
    this.activePromptId = promptId;
    this.renderEssayPrompt();
  }

  renderEssayPrompt() {
    const wrapper = document.getElementById('essay-builder-wrapper');
    if (!wrapper || !this.essayPrompts) return;
    const prompt = this.essayPrompts.find(p => p.id === this.activePromptId) || this.essayPrompts[0];
    if (!prompt) return;

    const fullThesis = `"${prompt.thesisClauses.contention} ${prompt.thesisClauses.methodology} ${prompt.thesisClauses.resolution}"`;

    wrapper.innerHTML = `
      <div class="thesis-builder-card">
        <span class="badge" style="background: rgba(99, 102, 241, 0.15); color: var(--accent-primary);">${this.escapeHtml(prompt.board)} • ${this.escapeHtml(prompt.theme)}</span>
        <h3 style="font-size: 18px; font-weight: 700; color: var(--text-main); margin: 8px 0 16px;">${this.escapeHtml(prompt.question)}</h3>

        <h4 style="font-size: 14px; font-weight: 700; color: var(--accent-primary); margin-bottom: 12px;">Stage 1: 3-Clause Argumentative Thesis Builder</h4>
        <div class="thesis-clause-row">
          <div class="thesis-clause-label">Clause 1 (Contention / Stance):</div>
          <div style="font-size: 13px; color: var(--text-main);">${this.escapeHtml(prompt.thesisClauses.contention)}</div>
        </div>
        <div class="thesis-clause-row">
          <div class="thesis-clause-label">Clause 2 (Literary Methodology / AO2 Techniques):</div>
          <div style="font-size: 13px; color: var(--text-main);">${this.escapeHtml(prompt.thesisClauses.methodology)}</div>
        </div>
        <div class="thesis-clause-row">
          <div class="thesis-clause-label">Clause 3 (Thematic Resolution / Moral Outcome):</div>
          <div style="font-size: 13px; color: var(--text-main);">${this.escapeHtml(prompt.thesisClauses.resolution)}</div>
        </div>

        <div class="thesis-output-box">
          <strong>Synthesized Thesis Statement:</strong><br>
          ${this.escapeHtml(fullThesis)}
        </div>
      </div>

      <h4 style="font-size: 15px; font-weight: 700; color: var(--text-main); margin: 8px 0;">Stage 2: Scaffolded PEEL / TEEL Paragraph Outline</h4>
      <div class="essay-paragraphs-grid">
        ${prompt.outline.map((p, idx) => `
          <div class="essay-para-card">
            <h4>${this.escapeHtml(p.paragraph)}</h4>
            <div class="para-element"><strong>[P] Point:</strong> ${this.escapeHtml(p.point)}</div>
            <div class="para-element"><strong>[E] Textual Evidence:</strong> ${this.escapeHtml(p.evidence)}</div>
            <div class="para-element"><strong>[E] Critical Analysis (AO2):</strong> ${this.escapeHtml(p.explanation)}</div>
            <div class="para-element"><strong>[L] Link to Thesis:</strong> ${this.escapeHtml(p.link)}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  copyEssayPlan() {
    const prompt = this.essayPrompts?.find(p => p.id === this.activePromptId);
    if (!prompt) return;
    let text = `EXAM QUESTION: ${prompt.question}\n\nTHESIS STATEMENT:\n"${prompt.thesisClauses.contention} ${prompt.thesisClauses.methodology} ${prompt.thesisClauses.resolution}"\n\n`;
    prompt.outline.forEach(p => {
      text += `${p.paragraph}\n- Point: ${p.point}\n- Evidence: ${p.evidence}\n- Analysis: ${p.explanation}\n- Link: ${p.link}\n\n`;
    });
    navigator.clipboard.writeText(text);
    this.showToast('Essay plan copied to clipboard!', 'success');
  }

  saveEssayPlanAsNote() {
    const prompt = this.essayPrompts?.find(p => p.id === this.activePromptId);
    if (!prompt) return;
    let md = `# Essay Plan: ${prompt.title}\n\n` +
      `**Exam Board:** ${prompt.board}\n` +
      `**Question:** ${prompt.question}\n\n` +
      `### Master Thesis Statement\n> "${prompt.thesisClauses.contention} ${prompt.thesisClauses.methodology} ${prompt.thesisClauses.resolution}"\n\n` +
      `### PEEL Essay Paragraph Outlines\n\n`;
    prompt.outline.forEach(p => {
      md += `#### ${p.paragraph}\n` +
        `- **Point:** ${p.point}\n` +
        `- **Evidence:** ${p.evidence}\n` +
        `- **Analysis (AO2):** ${p.explanation}\n` +
        `- **Link:** ${p.link}\n\n`;
    });
    md += `---\n*Exported from Camp Green Lake Holes Study & Exam Hub*`;
    this.saveAsNote(`Essay_Plan_${prompt.id}`, md);
  }

  /* ==========================================================
     FEATURE F8: CHARACTER & FAMILY TREE GRAPH
     ========================================================== */
  async loadCharacterGraphData() {
    const canvas = document.getElementById('character-svg-canvas');
    if (!canvas) return;
    canvas.innerHTML = `<div class="card-empty-placeholder"><span class="icon">⏳</span><p>Building character topological graph...</p></div>`;

    try {
      const res = await fetch('/api/studio/characters');
      if (!res.ok) throw new Error('Could not load character graph');
      const data = await res.json();
      this.characterGraph = data.graph;
      this.activeCharacter = this.characterGraph.nodes.find(n => n.id === 'stanley_yelnats_iv') || this.characterGraph.nodes[0];
      this.renderCharacterSvg();
      this.renderCharacterProfile(this.activeCharacter);
    } catch (err) {
      canvas.innerHTML = `<div class="card-empty-placeholder text-danger"><p>⚠️ ${this.escapeHtml(err.message)}</p></div>`;
    }
  }

  getCharacterShortName(name) {
    if (name.includes('Stanley Yelnats IV')) return 'Stanley IV';
    if (name.includes('Stanley Yelnats III')) return 'Stanley III';
    if (name.includes('Stanley Yelnats I')) return 'Stanley I';
    if (name.includes('Elya Yelnats')) return 'Elya';
    if (name.includes('Madame Zeroni')) return 'Mme Zeroni';
    if (name.includes('Hector Zeroni')) return 'Zero';
    if (name.includes('Hector') && (name.includes('Mother') || name.includes('’s') || name.includes('\'s'))) return "Zero's Mom";
    if (name.includes('Katherine Barlow')) return 'Kate Barlow';
    if (name.includes('Sam')) return 'Sam (Onion)';
    if (name.includes('Trout')) return 'Trout';
    if (name.includes('Linda Miller')) return 'Linda';
    if (name.includes('Warden')) return 'Warden';
    if (name.includes('Mr. Sir')) return 'Mr. Sir';
    if (name.includes('Pendanski')) return 'Pendanski';
    if (name.includes('Sarah Miller')) return 'Sarah M.';
    if (name.includes('X-Ray')) return 'X-Ray';
    return name.split(' ')[0];
  }

  renderCharacterSvg() {
    const container = document.getElementById('character-svg-canvas');
    if (!container || !this.characterGraph) return;

    const positions = {
      'madame_zeroni': { x: 80, y: 80 },
      'elya_yelnats': { x: 260, y: 80 },
      'sarah_miller': { x: 440, y: 80 },
      'stanley_yelnats_i': { x: 440, y: 220 },
      'stanley_yelnats_iii': { x: 440, y: 350 },
      'stanley_yelnats_iv': { x: 260, y: 440 },
      'hector_zeroni': { x: 80, y: 440 },
      'hectors_mother': { x: 80, y: 300 },
      'sam_onion_man': { x: 620, y: 150 },
      'katherine_barlow': { x: 620, y: 270 },
      'trout_walker': { x: 780, y: 150 },
      'linda_miller': { x: 780, y: 270 },
      'warden_walker': { x: 780, y: 440 },
      'mr_sir': { x: 620, y: 440 },
      'dr_pendanski': { x: 620, y: 520 },
      'x_ray': { x: 260, y: 520 }
    };

    const filter = this.characterFilterEra || 'all';
    const nodes = this.characterGraph.nodes.filter(n => {
      if (filter === 'all') return true;
      if (filter === 'Yelnats') return n.family === 'Yelnats';
      if (filter === 'Zeroni') return n.family === 'Zeroni';
      if (filter === 'Walker') return n.family === 'Walker';
      if (filter === 'Camp Staff') return n.family === 'Camp Staff' || n.family === 'Tent D Inmates';
      return true;
    });

    const visibleNodeIds = new Set(nodes.map(n => n.id));
    const activeNodeId = this.activeCharacter?.id;

    let svg = `<svg viewBox="0 0 900 580" style="width:100%; height:520px; font-family:system-ui,sans-serif;">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
        </marker>
      </defs>`;

    this.characterGraph.edges.forEach(e => {
      const p1 = positions[e.from];
      const p2 = positions[e.to];
      if (p1 && p2 && visibleNodeIds.has(e.from) && visibleNodeIds.has(e.to)) {
        const isConnected = e.from === activeNodeId || e.to === activeNodeId;
        const strokeColor = isConnected ? '#6366f1' : 'rgba(148, 163, 184, 0.25)';
        const strokeWidth = isConnected ? 2.5 : 1.2;
        svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" marker-end="url(#arrow)">
          <title>${this.escapeHtml(e.label)}</title>
        </line>`;
      }
    });

    nodes.forEach(n => {
      const p = positions[n.id] || { x: 100, y: 100 };
      const isActive = n.id === activeNodeId;
      const r = isActive ? 26 : 22;
      const stroke = isActive ? '#ffffff' : n.color || '#6366f1';
      const strokeWidth = isActive ? 3 : 2;

      svg += `
        <g style="cursor:pointer;" onclick="app.selectCharacter('${n.id}')">
          <title>${this.escapeHtml(n.name)} (${this.escapeHtml(n.role)}) — Click to view lore profile</title>
          <circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${n.color || '#6366f1'}" fill-opacity="${isActive ? '0.95' : '0.75'}" stroke="${stroke}" stroke-width="${strokeWidth}" />
          <text x="${p.x}" y="${p.y + 4}" text-anchor="middle" fill="#ffffff" font-size="10.5" font-weight="700">${this.escapeHtml(this.getCharacterShortName(n.name))}</text>
          <text x="${p.x}" y="${p.y + 36}" text-anchor="middle" fill="var(--text-main)" font-size="10" font-weight="600">${this.escapeHtml(n.era.split(' ')[0])}</text>
        </g>
      `;
    });

    svg += `</svg>`;
    container.innerHTML = svg;
  }

  selectCharacter(charId) {
    const char = this.characterGraph.nodes.find(n => n.id === charId);
    if (!char) return;
    this.activeCharacter = char;
    this.renderCharacterSvg();
    this.renderCharacterProfile(char);
  }

  filterCharacters(era) {
    this.characterFilterEra = era;
    document.querySelectorAll('#character-era-filters .btn-filter').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-era') === era);
    });

    if (this.characterGraph) {
      const filter = era;
      const nodes = this.characterGraph.nodes.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'Yelnats') return n.family === 'Yelnats';
        if (filter === 'Zeroni') return n.family === 'Zeroni';
        if (filter === 'Walker') return n.family === 'Walker';
        if (filter === 'Camp Staff') return n.family === 'Camp Staff' || n.family === 'Tent D Inmates';
        return true;
      });

      if (nodes.length > 0 && (!this.activeCharacter || !nodes.find(n => n.id === this.activeCharacter.id))) {
        this.activeCharacter = nodes[0];
        this.renderCharacterProfile(this.activeCharacter);
      }
    }

    this.renderCharacterSvg();
  }

  renderCharacterProfile(c) {
    const pane = document.getElementById('character-profile-pane');
    if (!pane || !c) return;

    const relatedEdges = (this.characterGraph?.edges || []).filter(e => e.from === c.id || e.to === c.id);
    const relationsHtml = relatedEdges.length > 0 ? `
      <div class="profile-detail-item">
        <label>Generational &amp; Narrative Connections:</label>
        <div style="display:flex; flex-direction:column; gap:6px; margin-top:6px;">
          ${relatedEdges.map(e => {
            const isFrom = e.from === c.id;
            const otherId = isFrom ? e.to : e.from;
            const otherNode = this.characterGraph.nodes.find(n => n.id === otherId);
            const otherName = otherNode ? otherNode.name : otherId;
            const arrow = isFrom ? '➔' : '⬅';
            return `<div style="font-size:12px; background:var(--bg-app); border:1px solid var(--border-color); border-radius:6px; padding:6px 10px;">
              <span style="color:var(--accent-primary); font-weight:700;">${arrow} ${this.escapeHtml(otherName)}</span>: 
              <span style="color:var(--text-main);">${this.escapeHtml(e.label)}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
    ` : '';

    pane.innerHTML = `
      <div class="profile-card-header">
        <div>
          <h3>${this.escapeHtml(c.name)}</h3>
          <span style="font-size: 12px; color: var(--accent-primary); font-weight: 600;">${this.escapeHtml(c.role)}</span>
        </div>
        <span class="profile-family-badge" style="background: ${c.color || '#6366f1'}20; color: ${c.color || '#6366f1'};">${this.escapeHtml(c.family)}</span>
      </div>

      <div class="profile-detail-item">
        <label>Era & Setting:</label>
        <div>${this.escapeHtml(c.era)}</div>
      </div>

      <div class="profile-detail-item">
        <label>Identity / Lore Anchor:</label>
        <div>${this.escapeHtml(c.realIdentity)}</div>
      </div>

      <div class="profile-detail-item">
        <label>Key Textual Citation:</label>
        <blockquote style="margin: 4px 0; font-style: italic; border-left: 3px solid ${c.color || '#6366f1'}; padding-left: 10px; color: var(--text-main);">
          "${this.escapeHtml(c.quote)}"
        </blockquote>
      </div>

      <div class="profile-detail-item">
        <label>Symbolic Role & Metaphor:</label>
        <div>${this.escapeHtml(c.symbolicRole)}</div>
      </div>

      <div class="profile-detail-item">
        <label>Exam Focus & Assessment Value:</label>
        <div style="color: var(--text-muted);">${this.escapeHtml(c.examPoints)}</div>
      </div>

      ${relationsHtml}
    `;
  }

  openSettingsModal() {
    document.getElementById('modal-settings').style.display = 'flex';
  }

  closeSettingsModal() {
    document.getElementById('modal-settings').style.display = 'none';
  }

  openConvertModal() {
    const modal = document.getElementById('modal-convert');
    if (modal) modal.style.display = 'flex';
  }

  closeConvertModal() {
    const modal = document.getElementById('modal-convert');
    if (modal) modal.style.display = 'none';
  }

  openNewNoteModal() {
    document.getElementById('modal-new-note').style.display = 'flex';
    document.getElementById('new-note-title').focus();
  }

  closeNewNoteModal() {
    document.getElementById('modal-new-note').style.display = 'none';
  }

  async confirmCreateNote() {
    const title = document.getElementById('new-note-title').value.trim();
    const format = document.getElementById('new-note-format').value;
    const content = document.getElementById('new-note-initial-content').value;

    if (!title) {
      this.showToast('Please enter a title.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, format, content })
      });

      if (!res.ok) throw new Error('Failed to create note');
      const data = await res.json();
      this.closeNewNoteModal();
      this.showToast('New note created successfully!', 'success');
      await this.loadDocuments();
      this.openDocument(data.name);
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================
     EVENT BINDINGS
     ========================================================== */

  bindEvents() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showTab(btn.getAttribute('data-tab')));
    });

    document.querySelectorAll('.subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.showStudioSubtab(btn.getAttribute('data-subtab')));
    });

    // Theme toggle
    document.getElementById('btn-theme-toggle').addEventListener('click', () => this.toggleTheme());

    // Settings & Language Toggle
    document.getElementById('btn-settings-toggle').addEventListener('click', () => this.openSettingsModal());
    document.getElementById('btn-save-settings').addEventListener('click', () => this.saveSettings());
    const btnLangToggle = document.getElementById('btn-lang-toggle');
    if (btnLangToggle) {
      btnLangToggle.addEventListener('click', () => this.toggleLanguage());
    }

    // New note
    document.getElementById('btn-new-note').addEventListener('click', () => this.openNewNoteModal());
    document.getElementById('btn-confirm-create-note').addEventListener('click', () => this.confirmCreateNote());

    // Sidebar Sources Toggle & Close
    const btnToggleSources = document.getElementById('btn-toggle-sources');
    if (btnToggleSources) {
      btnToggleSources.addEventListener('click', () => this.toggleSourcesSidebar());
    }
    const btnCloseSidebar = document.getElementById('btn-close-sidebar');
    if (btnCloseSidebar) {
      btnCloseSidebar.addEventListener('click', () => this.toggleSourcesSidebar(true));
    }

    // Header upload jump
    const btnHeaderUpload = document.getElementById('btn-header-upload');
    if (btnHeaderUpload) {
      btnHeaderUpload.addEventListener('click', () => this.openConvertModal());
    }

    // Select all checkbox
    const chkAll = document.getElementById('checkbox-select-all');
    if (chkAll) {
      chkAll.addEventListener('change', (e) => this.toggleSelectAllSources(e.target.checked));
    }

    // Sources filter input
    const filterInput = document.getElementById('sources-filter-input');
    if (filterInput) {
      filterInput.addEventListener('input', (e) => this.renderSidebarSources(e.target.value));
    }

    // Global search
    const globalSearch = document.getElementById('global-search');
    const clearSearch = document.getElementById('btn-clear-search');
    if (globalSearch && clearSearch) {
      globalSearch.addEventListener('input', (e) => {
        clearSearch.style.display = e.target.value ? 'block' : 'none';
        this.renderSidebarSources(e.target.value);
      });
      clearSearch.addEventListener('click', () => {
        globalSearch.value = '';
        clearSearch.style.display = 'none';
        this.renderSidebarSources('');
      });
    }

    // Viewer Actions
    document.getElementById('btn-toggle-edit').addEventListener('click', () => this.toggleEditMode());
    document.getElementById('btn-save-edit').addEventListener('click', () => this.saveActiveDocumentEdit());
    document.getElementById('btn-cancel-edit').addEventListener('click', () => this.toggleEditMode(false));
    document.getElementById('btn-copy-markdown').addEventListener('click', () => this.copyActiveMarkdown());
    document.getElementById('btn-download-doc').addEventListener('click', () => this.downloadActiveDoc());
    document.getElementById('btn-quick-summary').addEventListener('click', () => {
      this.showTab('tab-studio');
      this.showStudioSubtab('studio-summary');
      this.generateSummary(this.activeDoc ? [this.activeDoc.name] : null);
    });
    document.getElementById('btn-quick-quiz').addEventListener('click', () => {
      this.showTab('tab-studio');
      this.showStudioSubtab('studio-quiz');
      this.generateQuiz(this.activeDoc ? [this.activeDoc.name] : null);
    });

    // Chat
    document.getElementById('chat-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.sendChatMessage();
    });
    document.getElementById('btn-clear-chat').addEventListener('click', () => this.clearChat());

    // Prompt chips
    document.querySelectorAll('.prompt-chips .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        this.sendChatMessage(prompt);
      });
    });

    // Studio action buttons
    document.getElementById('btn-generate-summary').addEventListener('click', () => this.generateSummary());
    document.getElementById('btn-generate-quiz').addEventListener('click', () => this.generateQuiz());
    document.getElementById('btn-generate-flashcards').addEventListener('click', () => this.generateFlashcards());
    document.getElementById('btn-generate-guide').addEventListener('click', () => this.generateStudyGuide());
    document.getElementById('btn-generate-podcast').addEventListener('click', () => this.generatePodcast());
    document.getElementById('btn-generate-faq').addEventListener('click', () => this.generateFaq());

    // Feature F1: Timeline scrubber controls
    const timelineSlider = document.getElementById('timeline-scrubber-slider');
    if (timelineSlider) {
      timelineSlider.addEventListener('input', (e) => this.setScrubberStep(parseInt(e.target.value)));
    }
    document.getElementById('btn-scrubber-prev')?.addEventListener('click', () => this.stepScrubber(-1));
    document.getElementById('btn-scrubber-next')?.addEventListener('click', () => this.stepScrubber(1));
    document.getElementById('btn-scrubber-play')?.addEventListener('click', () => this.toggleScrubberPlay());
    document.querySelectorAll('#timeline-theme-filters .btn-filter').forEach(btn => {
      btn.addEventListener('click', () => this.filterTimelineByTheme(btn.getAttribute('data-theme')));
    });

    // Feature F2: Motif selection pills
    document.querySelectorAll('#motif-pills-container .btn-filter').forEach(btn => {
      btn.addEventListener('click', () => this.selectMotif(btn.getAttribute('data-motif')));
    });

    // Feature F8: Character era filters
    document.querySelectorAll('#character-era-filters .btn-filter').forEach(btn => {
      btn.addEventListener('click', () => this.filterCharacters(btn.getAttribute('data-era')));
    });

    // Feature F6: Focus timer controls
    document.getElementById('btn-focus-timer')?.addEventListener('click', () => this.openFocusTimerModal());
    document.getElementById('btn-focus-start')?.addEventListener('click', () => this.startFocusTimer());
    document.getElementById('btn-focus-pause')?.addEventListener('click', () => this.pauseFocusTimer());
    document.getElementById('btn-focus-water')?.addEventListener('click', () => this.startWaterBreak());
    document.getElementById('btn-focus-reset')?.addEventListener('click', () => this.resetFocusTimer(25, 'digging'));

    // Conversion & File Uploads
    const fileInput = document.getElementById('file-input-element');
    const browseBtn = document.getElementById('btn-browse-files');
    if (browseBtn && fileInput) {
      browseBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => this.uploadFiles(e.target.files));
    }

    document.getElementById('btn-convert-pasted').addEventListener('click', () => this.convertPastedText());

    // Main dropzone drag events
    const dropzone = document.getElementById('main-dropzone');
    if (dropzone) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-over');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-over'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        this.uploadFiles(e.dataTransfer.files);
      });
    }

    // Sidebar quick drop
    const sidebarDrop = document.getElementById('sidebar-quick-drop');
    if (sidebarDrop) {
      sidebarDrop.addEventListener('dragover', (e) => {
        e.preventDefault();
        sidebarDrop.classList.add('drag-over');
      });
      sidebarDrop.addEventListener('dragleave', () => sidebarDrop.classList.remove('drag-over'));
      sidebarDrop.addEventListener('drop', (e) => {
        e.preventDefault();
        sidebarDrop.classList.remove('drag-over');
        this.uploadFiles(e.dataTransfer.files);
      });
      sidebarDrop.addEventListener('click', () => fileInput.click());
    }

    // Keyboard shortcuts: Space flips flashcard, Arrow keys navigate
    window.addEventListener('keydown', (e) => {
      if (this.currentTab === 'tab-studio' && this.currentStudioSubtab === 'studio-flashcards') {
        if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.flipFlashcard();
        } else if (e.code === 'ArrowRight') {
          this.nextFlashcard();
        } else if (e.code === 'ArrowLeft') {
          this.prevFlashcard();
        }
      }
    });
  }
}

// Global App Instance & Aliases
window.HolesStudyApp = HolesStudyApp;
window.NotebookApp = HolesStudyApp;
let app;
window.addEventListener('DOMContentLoaded', () => {
  app = new HolesStudyApp();
});
