const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
// Polyfills for serverless environments (e.g. Vercel)
if (typeof global.DOMMatrix === 'undefined') {
  global.DOMMatrix = class DOMMatrix {
    constructor() {
      this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
    }
  };
}
if (typeof global.ImageData === 'undefined') {
  global.ImageData = class ImageData {};
}
if (typeof global.Path2D === 'undefined') {
  global.Path2D = class Path2D {};
}

let PDFParseClass = null;
function getPDFParseClass() {
  if (!PDFParseClass) {
    try {
      const p = require('pdf-parse');
      PDFParseClass = p.PDFParse || p;
    } catch (e) {
      console.warn('PDFParse unavailable:', e.message);
    }
  }
  return PDFParseClass;
}

/**
 * Normalizes a filename to be safe for filesystem, preserving Dutch/accented characters gracefully
 */
function sanitizeFilename(filename) {
  const ext = path.extname(filename);
  let base = path.basename(filename, ext);
  // Replace illegal filesystem characters: \ / : * ? " < > |
  base = base.replace(/[\\/:*?"<>|]/g, '_').trim();
  if (!base) base = 'document_' + Date.now();
  return { base, ext };
}

/**
 * Ensures unique filename in directory
 */
function getUniquePath(dir, base, ext) {
  let candidate = path.join(dir, `${base}${ext}`);
  if (!fs.existsSync(candidate)) return { filePath: candidate, fileName: `${base}${ext}` };

  let count = 1;
  while (fs.existsSync(path.join(dir, `${base}_${count}${ext}`))) {
    count++;
  }
  const fileName = `${base}_${count}${ext}`;
  return { filePath: path.join(dir, fileName), fileName };
}

/**
 * Extracts and decodes base64 images from HTML, saving them to assetsDir
 */
function processHtmlImages(html, docBase, assetsDir) {
  const images = [];
  let imgIndex = 1;

  // Match <img> tags
  const imgRegex = /<img\s+([^>]*?)src=["'](data:image\/([a-zA-Z0-9+]+);base64,([a-zA-Z0-9+/=]+))["']([^>]*?)>/gi;

  const processedHtml = html.replace(imgRegex, (match, before, fullDataUri, imageType, b64Data, after) => {
    try {
      let ext = imageType.toLowerCase().replace('svg+xml', 'svg').replace('jpeg', 'jpg');
      if (!['png', 'jpg', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) ext = 'png';

      const imgBuffer = Buffer.from(b64Data, 'base64');
      const imgFileName = `${docBase}_img_${imgIndex}.${ext}`;
      const imgPath = path.join(assetsDir, imgFileName);

      fs.writeFileSync(imgPath, imgBuffer);
      images.push({
        fileName: imgFileName,
        relativePath: `assets/${imgFileName}`,
        size: imgBuffer.length
      });

      // Extract alt if present
      const altMatch = (before + ' ' + after).match(/alt=["']([^"']*)["']/i);
      const alt = altMatch ? altMatch[1] : `Afbeelding ${imgIndex}`;

      imgIndex++;
      return `\n\n![${alt}](assets/${imgFileName})\n\n`;
    } catch (err) {
      return match;
    }
  });

  return { html: processedHtml, images };
}

/**
 * Converts HTML string to clean Markdown
 */
function htmlToMarkdown(html) {
  let md = html;

  // Remove script and style tags
  md = md.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  md = md.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Extract <title> if present
  let title = '';
  const titleMatch = md.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch) title = titleMatch[1].trim();

  // Headings h1..h6
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n\n# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n\n## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n\n### $1\n\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n\n#### $1\n\n');
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '\n\n##### $1\n\n');
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '\n\n###### $1\n\n');

  // Bold & Italic
  md = md.replace(/<(?:b|strong)[^>]*>(.*?)<\/(?:b|strong)>/gi, '**$1**');
  md = md.replace(/<(?:i|em)[^>]*>(.*?)<\/(?:i|em)>/gi, '*$1*');

  // Code & Pre
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n\n```\n$1\n```\n\n');
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (m, c) => {
    return '\n\n' + c.trim().split('\n').map(l => '> ' + l.trim()).join('\n') + '\n\n';
  });

  // Links
  md = md.replace(/<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Unordered list items
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<\/?(?:ul|ol)[^>]*>/gi, '\n');

  // Paragraphs & line breaks
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n\n$1\n\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<hr\s*\/?>/gi, '\n\n---\n\n');

  // Simple HTML table conversion
  md = md.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (match, tableBody) => {
    const rows = [];
    const rowMatches = tableBody.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    for (const row of rowMatches) {
      const cells = [];
      const cellMatches = row.match(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi) || [];
      for (const cell of cellMatches) {
        cells.push(cell.replace(/<[^>]+>/g, '').trim());
      }
      if (cells.length > 0) rows.push(cells);
    }
    if (rows.length === 0) return '';

    let maxCols = Math.max(...rows.map(r => r.length));
    let tableMd = '\n\n| ' + rows[0].map(c => c || ' ').join(' | ') + ' |\n';
    tableMd += '| ' + Array(maxCols).fill('---').join(' | ') + ' |\n';
    for (let i = 1; i < rows.length; i++) {
      let r = rows[i];
      while (r.length < maxCols) r.push('');
      tableMd += '| ' + r.join(' | ') + ' |\n';
    }
    return tableMd + '\n\n';
  });

  // Strip remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Decode common HTML entities
  md = md
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Normalize multi-newlines and trim
  md = md.replace(/\n{3,}/g, '\n\n').trim();

  if (title && !md.startsWith('#')) {
    md = `# ${title}\n\n${md}`;
  }

  return md;
}

/**
 * Converts CSV/TSV text to clean Markdown table
 */
function csvToMarkdown(text, filename) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return '# Leeg CSV bestand\n';

  // Detect delimiter: comma, semicolon, tab
  const firstLine = lines[0];
  let delimiter = ',';
  if (firstLine.includes(';') && (firstLine.split(';').length > firstLine.split(',').length)) {
    delimiter = ';';
  } else if (firstLine.includes('\t') && (firstLine.split('\t').length > firstLine.split(',').length)) {
    delimiter = '\t';
  }

  const parseRow = (line) => {
    // Simple CSV row parser with quotes support
    const cells = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    cells.push(current.trim());
    return cells;
  };

  const rows = lines.map(parseRow);
  const colCount = Math.max(...rows.map(r => r.length));
  const title = path.basename(filename, path.extname(filename));

  let md = `# Gegevens: ${title}\n\n`;
  const header = rows[0];
  while (header.length < colCount) header.push(`Kolom ${header.length + 1}`);

  md += '| ' + header.map(h => h || '-').join(' | ') + ' |\n';
  md += '| ' + Array(colCount).fill('---').join(' | ') + ' |\n';

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    while (row.length < colCount) row.push('');
    md += '| ' + row.map(c => c || '-').join(' | ') + ' |\n';
  }

  md += `\n*Totaal rijen: ${rows.length - 1} | Kolommen: ${colCount}*\n`;
  return md;
}

/**
 * Converts JSON to structured Markdown
 */
function jsonToMarkdown(text, filename) {
  const title = path.basename(filename, path.extname(filename));
  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    return `# Fout bij parsen van JSON: ${title}\n\n\`\`\`json\n${text}\n\`\`\``;
  }

  let md = `# Gegevens: ${title}\n\n`;

  if (Array.isArray(data)) {
    md += `*Lijst met ${data.length} items*\n\n`;
    if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
      const keys = Array.from(new Set(data.flatMap(item => Object.keys(item))));
      md += '| ' + keys.join(' | ') + ' |\n';
      md += '| ' + Array(keys.length).fill('---').join(' | ') + ' |\n';
      for (const item of data) {
        const row = keys.map(k => {
          const val = item[k];
          if (val === undefined || val === null) return '-';
          if (typeof val === 'object') return JSON.stringify(val);
          return String(val).replace(/\|/g, '\\|');
        });
        md += '| ' + row.join(' | ') + ' |\n';
      }
    } else {
      for (const item of data) {
        md += `- ${typeof item === 'object' ? JSON.stringify(item) : item}\n`;
      }
    }
  } else if (typeof data === 'object' && data !== null) {
    for (const [key, value] of Object.entries(data)) {
      md += `### ${key}\n`;
      if (typeof value === 'object' && value !== null) {
        md += '```json\n' + JSON.stringify(value, null, 2) + '\n```\n\n';
      } else {
        md += `${value}\n\n`;
      }
    }
  } else {
    md += `${data}\n\n`;
  }

  return md;
}

/**
 * Plain text to Markdown with structure detection
 */
function plainTextToMarkdown(text, filename) {
  const lines = text.split(/\r?\n/);
  const baseName = path.basename(filename, path.extname(filename));

  let md = '';
  let inList = false;

  // Check if first line looks like a title
  const firstNonEmpty = lines.find(l => l.trim().length > 0);
  let titleAdded = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      md += '\n\n';
      inList = false;
      continue;
    }

    if (!titleAdded && trimmed === firstNonEmpty && trimmed.length < 80 && !trimmed.startsWith('#')) {
      md += `# ${trimmed}\n\n`;
      titleAdded = true;
      continue;
    }

    // Bullet points
    if (/^[\*\-\•]\s+/.test(trimmed)) {
      md += `- ${trimmed.replace(/^[\*\-\•]\s+/, '')}\n`;
      inList = true;
      continue;
    }

    // Numbered list
    if (/^\d+[\.\)]\s+/.test(trimmed)) {
      md += `${trimmed}\n`;
      inList = true;
      continue;
    }

    // Likely section heading (all uppercase or starts with Chapter/Hoofdstuk/etc.)
    if (/^(?:hoofdstuk|chapter|deel|sectie|section|\d+\.)/i.test(trimmed) && trimmed.length < 70) {
      md += `\n## ${trimmed}\n\n`;
      continue;
    }

    // Regular paragraph line
    md += `${trimmed} `;
  }

  if (!titleAdded) {
    md = `# ${baseName}\n\n` + md;
  }

  return md.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Standalone Image to Markdown document
 */
function imageToMarkdown(imageFileName, originalName, imageSize, assetsRelativePath) {
  const baseName = path.basename(originalName, path.extname(originalName));
  const ext = path.extname(imageFileName).replace('.', '').toUpperCase();
  const sizeKb = (imageSize / 1024).toFixed(1);
  const formattedDate = new Date().toLocaleString('nl-NL');

  return `# ${baseName}

![${baseName}](${assetsRelativePath})

---

### Afbeeldingsdetails
- **Bestandsnaam:** \`${imageFileName}\`
- **Originele naam:** \`${originalName}\`
- **Formaat:** \`${ext}\`
- **Grootte:** ${sizeKb} KB
- **Toegevoegd op:** ${formattedDate}

### Aantekeningen & Analyse
*Deze afbeelding is opgenomen in het project. Voeg hier je samenvatting, trefwoorden of context toe...*
`;
}

/**
 * Core Ingestion & Conversion Engine
 */
class DocumentConverter {
  constructor(options = {}) {
    this.rootDir = options.rootDir || path.resolve(__dirname, '..');
    this.documentsDir = options.documentsDir || path.join(this.rootDir, 'documents');
    this.assetsDir = options.assetsDir || path.join(this.documentsDir, 'assets');

    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.documentsDir)) {
      fs.mkdirSync(this.documentsDir, { recursive: true });
    }
    if (!fs.existsSync(this.assetsDir)) {
      fs.mkdirSync(this.assetsDir, { recursive: true });
    }
  }

  /**
   * Main conversion method for Buffers or in-memory content
   */
  async convertBuffer(buffer, originalFilename, options = {}) {
    this.ensureDirectories();

    const outputFormat = options.outputFormat || 'md'; // 'md' or 'txt'
    const targetExt = outputFormat === 'txt' ? '.txt' : '.md';
    const { base, ext: inputExtRaw } = sanitizeFilename(originalFilename);
    const inputExt = inputExtRaw.toLowerCase();

    let markdownContent = '';
    const imagesExtracted = [];

    // 1. Standalone image formats
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg'];
    if (imageExtensions.includes(inputExt)) {
      const { filePath: imgSavePath, fileName: imgSavedName } = getUniquePath(this.assetsDir, base, inputExt);
      fs.writeFileSync(imgSavePath, buffer);
      const relativePath = `assets/${imgSavedName}`;
      imagesExtracted.push({
        fileName: imgSavedName,
        relativePath,
        size: buffer.length
      });

      markdownContent = imageToMarkdown(imgSavedName, originalFilename, buffer.length, relativePath);
    }
    // 2. Word documents (.docx)
    else if (inputExt === '.docx') {
      let imgCounter = 1;
      const customImgHandler = mammoth.images.imgElement((element) => {
        return element.read().then((imgBuffer) => {
          let imgExt = '.png';
          if (element.contentType === 'image/jpeg') imgExt = '.jpg';
          if (element.contentType === 'image/gif') imgExt = '.gif';
          if (element.contentType === 'image/webp') imgExt = '.webp';
          if (element.contentType === 'image/svg+xml') imgExt = '.svg';

          const { filePath: imgSavePath, fileName: imgSavedName } = getUniquePath(
            this.assetsDir,
            `${base}_img_${imgCounter++}`,
            imgExt
          );
          fs.writeFileSync(imgSavePath, imgBuffer);
          const relPath = `assets/${imgSavedName}`;
          imagesExtracted.push({
            fileName: imgSavedName,
            relativePath: relPath,
            size: imgBuffer.length
          });
          return { src: relPath };
        });
      });

      const result = await mammoth.convertToMarkdown({ buffer }, { convertImage: customImgHandler });
      markdownContent = `# ${base}\n\n${result.value.trim()}`;
    }
    // 3. PDF documents (.pdf)
    else if (inputExt === '.pdf') {
      try {
        const PDFParser = getPDFParseClass();
        if (!PDFParser) throw new Error('PDFParser module not available');
        const parser = new PDFParser({ data: buffer });
        await parser.load();
        const pdfData = await parser.getText();
        await parser.destroy();

        const extractedText = (pdfData && pdfData.text) ? pdfData.text : '';
        markdownContent = plainTextToMarkdown(extractedText, originalFilename);
      } catch (pdfErr) {
        // Fallback simple string extraction for text in PDF
        const rawString = buffer.toString('utf-8');
        const textChunks = rawString.match(/\(([^)]+)\)\s*T[jJ]/g) || [];
        const fallbackText = textChunks.map(c => c.replace(/[()]/g, '').trim()).join(' ');
        if (fallbackText.length > 50) {
          markdownContent = plainTextToMarkdown(fallbackText, originalFilename);
        } else {
          markdownContent = `# ${base}\n\n*(PDF kon niet volledig gelezen worden: ${pdfErr.message})*\n`;
        }
      }
    }
    // 4. HTML (.html, .htm)
    else if (inputExt === '.html' || inputExt === '.htm') {
      const rawHtml = buffer.toString('utf-8');
      const { html: processedHtml, images } = processHtmlImages(rawHtml, base, this.assetsDir);
      imagesExtracted.push(...images);
      markdownContent = htmlToMarkdown(processedHtml);
    }
    // 5. CSV / TSV
    else if (inputExt === '.csv' || inputExt === '.tsv') {
      const text = buffer.toString('utf-8');
      markdownContent = csvToMarkdown(text, originalFilename);
    }
    // 6. JSON
    else if (inputExt === '.json') {
      const text = buffer.toString('utf-8');
      markdownContent = jsonToMarkdown(text, originalFilename);
    }
    // 7. Markdown (.md, .markdown)
    else if (inputExt === '.md' || inputExt === '.markdown') {
      markdownContent = buffer.toString('utf-8');
    }
    // 8. Plain Text (.txt, .log, others)
    else {
      const text = buffer.toString('utf-8');
      markdownContent = plainTextToMarkdown(text, originalFilename);
    }

    // Prepare final output string based on output format
    let finalContent = markdownContent;
    if (outputFormat === 'txt') {
      // Strip markdown formatting for pure txt if requested
      finalContent = markdownContent
        .replace(/!\[.*?\]\(.*?\)/g, '') // remove images
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links to text
        .replace(/#{1,6}\s+/g, '') // headers
        .replace(/[*_~`]/g, ''); // formatting characters
    }

    // Save to documents directory
    const { filePath: targetFilePath, fileName: targetFileName } = getUniquePath(this.documentsDir, base, targetExt);
    fs.writeFileSync(targetFilePath, finalContent, 'utf-8');

    const wordCount = finalContent.trim().split(/\s+/).filter(Boolean).length;
    const charCount = finalContent.length;

    return {
      success: true,
      originalFilename,
      fileName: targetFileName,
      filePath: targetFilePath,
      relativePath: path.relative(this.rootDir, targetFilePath).replace(/\\/g, '/'),
      format: outputFormat,
      extension: targetExt,
      wordCount,
      charCount,
      imagesExtracted
    };
  }

  /**
   * Converts a file from the filesystem
   */
  async convertFile(inputFilePath, options = {}) {
    const buffer = fs.readFileSync(inputFilePath);
    const originalFilename = path.basename(inputFilePath);
    return this.convertBuffer(buffer, originalFilename, options);
  }
}

module.exports = {
  DocumentConverter,
  sanitizeFilename,
  getUniquePath,
  htmlToMarkdown,
  csvToMarkdown,
  jsonToMarkdown,
  plainTextToMarkdown
};
