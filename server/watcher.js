const fs = require('fs');
const path = require('path');
let chokidar = null;
try {
  chokidar = require('chokidar');
} catch (e) {
  // In serverless environments (e.g. Vercel) or pure ESM runtimes, chokidar may fail to require
}
const { DocumentConverter } = require('./converter');

class InboxWatcher {
  constructor(options = {}) {
    this.rootDir = options.rootDir || path.resolve(__dirname, '..');
    this.inboxDir = options.inboxDir || path.join(this.rootDir, 'inbox');
    this.processedDir = path.join(this.inboxDir, 'processed');
    this.converter = new DocumentConverter({ rootDir: this.rootDir });
    this.watcher = null;
    this.isProcessing = new Set();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.inboxDir)) {
      fs.mkdirSync(this.inboxDir, { recursive: true });
    }
    if (!fs.existsSync(this.processedDir)) {
      fs.mkdirSync(this.processedDir, { recursive: true });
    }
  }

  start(onConverted = null) {
    this.ensureDirectories();

    if (!chokidar) {
      console.log(`[InboxWatcher] Watcher not active in this environment.`);
      return;
    }

    console.log(`[InboxWatcher] Active - Watching folder: ${this.inboxDir}`);
    console.log(`[InboxWatcher] Drop files (.pdf, .docx, .html, .png, .jpg, .csv, .json, .txt) here to convert to .md / .txt.`);

    this.watcher = chokidar.watch(this.inboxDir, {
      ignored: [
        /(^|[\/\\])\../, // ignore dotfiles
        /[\\/]processed([\\/]|$)/, // ignore processed folder cross-platform
        /README\.(txt|md)$/i // ignore readme
      ],
      persistent: true,
      depth: 0,
      ignoreInitial: false,
      awaitWriteFinish: {
        stabilityThreshold: 1000,
        pollInterval: 200
      }
    });

    this.watcher.on('add', async (filePath) => {
      const fileName = path.basename(filePath);
      if (this.isProcessing.has(filePath)) return;

      // Skip directories or non-existent paths
      if (!fs.existsSync(filePath)) return;
      try {
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) return;
      } catch (e) {
        return;
      }

      this.isProcessing.add(filePath);

      try {
        console.log(`[InboxWatcher] New file detected: ${fileName}`);
        const result = await this.converter.convertFile(filePath);
        console.log(`[InboxWatcher] Successfully converted to: ${result.fileName} (${result.wordCount} words)`);

        // Move to processed
        const dest = path.join(this.processedDir, `${Date.now()}_${fileName}`);
        fs.renameSync(filePath, dest);

        if (typeof onConverted === 'function') {
          onConverted(result);
        }
      } catch (err) {
        console.error(`[InboxWatcher] Error processing ${fileName}:`, err.message);
      } finally {
        this.isProcessing.delete(filePath);
      }
    });

    return this.watcher;
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
      console.log('[InboxWatcher] Stopped.');
    }
  }
}

// Standalone execution support
if (require.main === module) {
  const watcher = new InboxWatcher();
  watcher.start();
}

module.exports = { InboxWatcher };
