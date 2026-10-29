const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.resolve(__dirname, '../documents');
const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.md') || f.endsWith('.txt'));

console.log('Total files to check:', files.length);

let totalIssues = 0;

for (const file of files) {
  const filePath = path.join(DOCS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check 1: replacement character U+FFFD
  if (content.includes('\uFFFD')) {
    console.log(`[FFFD] ${file} contains replacement character U+FFFD`);
    totalIssues++;
  }

  // Check 2: UTF-8 double encoding mojibake (e.g. Ã©, Ã«, etc)
  const mojibakeMatches = content.match(/[\u00C0-\u00C3][\u0080-\u00BF]/g);
  if (mojibakeMatches) {
    console.log(`[MOJIBAKE] ${file} has UTF-8 double-encoding:`, mojibakeMatches.slice(0, 5));
    totalIssues++;
  }

  // Check 3: ? inside words like sc?ne, geïnteresseerd -> ge?nteresseerd, etc.
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    // Word character then '?' then word character
    const wordMatches = line.match(/[a-zA-Z0-9]\?[a-zA-Z0-9]/g);
    if (wordMatches) {
      console.log(`[QUESTION_IN_WORD] ${file}:${idx + 1}: ${line.trim()} -> matches:`, wordMatches);
      totalIssues++;
    }
    // Also check for standalone ? where punctuation shouldn't be or ¿
    if (line.includes('¿')) {
      console.log(`[INVERTED_QUESTION] ${file}:${idx + 1}: ${line.trim()}`);
      totalIssues++;
    }
  });

  // Check 4: asset links in md
  if (file.endsWith('.md')) {
    const assetMatches = content.match(/!\[.*?\]\((.*?)\)/g) || [];
    for (const match of assetMatches) {
      const linkMatch = match.match(/!\[.*?\]\((.*?)\)/);
      if (linkMatch && linkMatch[1]) {
        let link = linkMatch[1];
        // Strip query params or hash
        link = link.split('#')[0].split('?')[0];
        const assetPath = path.resolve(DOCS_DIR, link);
        if (!fs.existsSync(assetPath)) {
          console.log(`[MISSING_ASSET] in ${file}: ${link} -> ${assetPath}`);
          totalIssues++;
        }
      }
    }
  }
}

console.log('Verification finished. Total issues:', totalIssues);
