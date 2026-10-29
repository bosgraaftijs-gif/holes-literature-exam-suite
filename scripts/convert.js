#!/usr/bin/env node

/**
 * CLI Tool: Document & Image to Markdown/Text Converter
 * Usage:
 *   node scripts/convert.js [pad-naar-bestand-of-map] [--format=md|txt]
 * 
 * Zonder argumenten:
 *   Scant de map inbox/ en zet alle aanwezige bestanden om naar documents/
 *   en slaat afbeeldingen op in documents/assets/.
 */

const fs = require('fs');
const path = require('path');
const { DocumentConverter } = require('../server/converter');

const ROOT_DIR = path.resolve(__dirname, '..');
const INBOX_DIR = path.join(ROOT_DIR, 'inbox');
const PROCESSED_DIR = path.join(INBOX_DIR, 'processed');

// Parse CLI arguments
const args = process.argv.slice(2);
let targetPath = null;
let outputFormat = 'md';

for (const arg of args) {
  if (arg.startsWith('--format=')) {
    const fmt = arg.split('=')[1].toLowerCase();
    if (fmt === 'txt' || fmt === 'md') outputFormat = fmt;
  } else if (!arg.startsWith('--')) {
    targetPath = path.resolve(arg);
  }
}

const converter = new DocumentConverter({ rootDir: ROOT_DIR });

async function convertSingleFile(filePath) {
  try {
    const filename = path.basename(filePath);
    process.stdout.write(`⏳ Bezig met omzetten van: ${filename}... `);
    const result = await converter.convertFile(filePath, { outputFormat });
    console.log(`✅ Klaar!`);
    console.log(`   📄 Opgeslagen als: ${result.fileName} (${result.wordCount} woorden)`);
    if (result.imagesExtracted && result.imagesExtracted.length > 0) {
      console.log(`   🖼️  ${result.imagesExtracted.length} afbeelding(en) bewaard in documents/assets/`);
    }
    return result;
  } catch (err) {
    console.log(`❌ Fout: ${err.message}`);
    return null;
  }
}

async function run() {
  console.log('====================================================');
  console.log('   Holes Study & Exam Hub Document & Afbeelding Conversie Tool   ');
  console.log('====================================================');
  console.log(`🎯 Doelformaat: .${outputFormat}`);

  // Scenario 1: Target file or directory specified
  if (targetPath) {
    if (!fs.existsSync(targetPath)) {
      console.error(`❌ Pad niet gevonden: ${targetPath}`);
      process.exit(1);
    }

    const stat = fs.statSync(targetPath);
    if (stat.isFile()) {
      await convertSingleFile(targetPath);
    } else if (stat.isDirectory()) {
      console.log(`📂 Scannen van map: ${targetPath}`);
      const files = fs.readdirSync(targetPath);
      let count = 0;
      for (const file of files) {
        const full = path.join(targetPath, file);
        if (fs.statSync(full).isFile() && !file.startsWith('.')) {
          const res = await convertSingleFile(full);
          if (res) count++;
        }
      }
      console.log(`✨ ${count} bestand(en) succesvol omgezet.`);
    }
    return;
  }

  // Scenario 2: No argument specified -> process inbox/
  if (!fs.existsSync(INBOX_DIR)) {
    fs.mkdirSync(INBOX_DIR, { recursive: true });
  }
  if (!fs.existsSync(PROCESSED_DIR)) {
    fs.mkdirSync(PROCESSED_DIR, { recursive: true });
  }

  const files = fs.readdirSync(INBOX_DIR).filter(f => {
    if (f.startsWith('.') || f === 'processed' || f.toLowerCase() === 'readme.txt' || f.toLowerCase() === 'readme.md') {
      return false;
    }
    return fs.statSync(path.join(INBOX_DIR, f)).isFile();
  });

  if (files.length === 0) {
    console.log(`ℹ️  Geen bestanden gevonden in de inbox map: ${INBOX_DIR}`);
    console.log(`   Tip: Plaats bestanden (.pdf, .docx, .html, .png, .jpg, .csv, .json, .txt) in 'inbox/'`);
    console.log(`   of geef een specifiek pad mee: node scripts/convert.js <pad-naar-bestand>`);
    return;
  }

  console.log(`📥 ${files.length} bestand(en) gevonden in inbox/:`);
  let convertedCount = 0;

  for (const file of files) {
    const sourcePath = path.join(INBOX_DIR, file);
    const result = await convertSingleFile(sourcePath);
    if (result) {
      convertedCount++;
      // Move to processed
      const destPath = path.join(PROCESSED_DIR, `${Date.now()}_${file}`);
      fs.renameSync(sourcePath, destPath);
    }
  }

  console.log('----------------------------------------------------');
  console.log(`🎉 Conversie voltooid! ${convertedCount} bestand(en) overgezet naar documents/`);
  console.log('====================================================');
}

run();
