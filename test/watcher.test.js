const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { InboxWatcher } = require('../server/watcher');

const ROOT_DIR = path.resolve(__dirname, '..');
const TEST_INBOX = path.join(__dirname, 'temp_watcher_inbox');
const TEST_PROCESSED = path.join(TEST_INBOX, 'processed');
const TEST_DOCS = path.join(__dirname, 'temp_watcher_docs');
const TEST_ASSETS = path.join(TEST_DOCS, 'assets');

test('InboxWatcher detects new file in inbox, converts to documents/, and moves to processed/', async () => {
  fs.mkdirSync(TEST_INBOX, { recursive: true });
  fs.mkdirSync(TEST_DOCS, { recursive: true });

  const watcher = new InboxWatcher({
    rootDir: ROOT_DIR,
    inboxDir: TEST_INBOX
  });
  // Override paths for isolation
  watcher.processedDir = TEST_PROCESSED;
  watcher.converter.documentsDir = TEST_DOCS;
  watcher.converter.assetsDir = TEST_ASSETS;

  let convertedResult = null;
  const convertedPromise = new Promise((resolve) => {
    watcher.start((result) => {
      convertedResult = result;
      resolve(result);
    });
  });

  // Write test file to inbox
  const testFileName = `inbox_item_${Date.now()}.txt`;
  const testFilePath = path.join(TEST_INBOX, testFileName);
  fs.writeFileSync(testFilePath, '# Inbox Notitie Test\n\nDit bestand is automatisch geconverteerd.');

  // Wait for conversion (up to 4000ms)
  const result = await Promise.race([
    convertedPromise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout waiting for watcher')), 4000))
  ]);

  watcher.stop();

  assert.ok(result);
  assert.equal(result.success, true);
  assert.ok(fs.existsSync(result.filePath));
  const content = fs.readFileSync(result.filePath, 'utf-8');
  assert.ok(content.includes('Inbox Notitie Test'));

  // Clean up
  if (fs.existsSync(TEST_INBOX)) fs.rmSync(TEST_INBOX, { recursive: true, force: true });
  if (fs.existsSync(TEST_DOCS)) fs.rmSync(TEST_DOCS, { recursive: true, force: true });
});
