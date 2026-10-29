# Technisch Rapport: Webapplicatie Orchestratie & Stabiliteitsaudit (Revisie 2)
**Auteur**: Tech Web App Orchestrator  
**Doel**: Main Orchestrator / Lead Architect  
**Datum**: 29 oktober 2026  
**Status**: 🟢 Productieklaar, 100% Geverifieerd (38/38 geautomatiseerde tests geslaagd, live 200 OK health check)  
**Projectlocatie**: `c:\Users\tijsb\Documents\antigravity\bold-kepler`  
**Onderwerp**: Engels Literatuurtentamen — Roman *Holes* (Louis Sachar)

---

## 1. Executive Summary & Architectuuroverzicht

In opdracht van de Main Orchestrator is een grondige technische audit, revisie en verificatie uitgevoerd op de **Holes Exam Study Suite** webapplicatie, specifiek ingericht als geavanceerd studieplatform voor het **Engels Literatuurtentamen over de roman 'Holes'** van Louis Sachar.

De applicatie combineert een robuuste client-server architectuur met een modulaire Node.js backend en een responsieve Vanilla JS single-page frontend:
- **Server Core (`server/index.js`)**: Express REST API die documentbeheer, conversies, studio-functionaliteiten, statische assets en levenscyclusbeheer van de achtergrondprocessen aanstuurt.
- **Studio Engine (`server/studio.js`)**: Volledig offline NLP-gedreven analyse-engine voor samenvattingen, interactieve meerkeuzetoetsen (4 opties A/B/C/D), flitskaarten, studiegidsen, FAQ, podcast audio-overzichten (met presentatoren **Leo & Maya**) en grounded chat met letterlijke citaten en deduplicatie.
- **Conversie-engine (`server/converter.js`)**: Multiformaat document parser (PDF, DOCX, HTML, CSV, JSON, TXT, MD en beelden) met automatische extractie van ingebedde en base64-afbeeldingen naar `documents/assets/`.
- **Inbox Watcher (`server/watcher.js`)**: Real-time Chokidar bestandswatcher die bestanden in `inbox/` detecteert, omzet naar Markdown en archiveert in `inbox/processed/`.
- **Frontend Client (`client/index.html`, `client/app.js`, `client/style.css`)**: Responsieve SPA met 3-koloms layout, tab-navigatie (Viewer & Editor, Chat & Vragen, Studio Hub, Inname & Conversie), dynamische bronselectie, live background polling en interactieve *Holes* studiethema's.

---

## 2. Documentenverificatie & Bronnenstatus

Er is geverifieerd dat de backend en frontend direct alle beschikbare bronnen in `documents/` correct laden, catalogiseren en indexeren.

### Kernbevindingen:
- **Totaal aantal actieve documenten**: 50 documenten (Markdown `.md` en platte tekst `.txt` varianten).
- **Grote romans & studiegidsen geverifieerd**:
  1. `Holes_Full_Novel_Louis_Sachar.md` & `.txt` (306.473 bytes / ~60.000 woorden) — integrale roman van Louis Sachar.
  2. `Holes_Chapter_Summaries.md` & `.txt` (90.887 bytes / 13.919 woorden) — volledige analyse van alle 50 hoofdstukken met drie historische verhaallijnen, thema's en 106 expliciete Q&A quizparen.
  3. `09_Holes_Exam_QA_Quizzes_and_Flashcards.md` & `.txt` (7.544 bytes) — 10 geavanceerde 4-optie multiple-choice toetsvragen en een 15-delige personage-identificatie flashcard tabel.
  4. `01_Holes_Complete_Character_Guide_and_Lore.md` & `.txt` / `01_Holes_Complete_Karaktergids_en_Lore.md` & `.txt` (25.074 bytes)
  5. `02_Camp_Green_Lake_Setting_and_Geography.md` & `.txt` / `02_Camp_Green_Lake_en_Geografie.md` & `.txt` (12.993 bytes)
  6. `03_Complete_Plot_and_Triple_Narrative.md` & `.txt` / `03_Het_Volledige_Plot_en_Verhaallijnen.md` & `.txt` (18.439 bytes)
  7. `04_Important_Symbols_Objects_and_Lore.md` & `.txt` / `04_Belangrijke_Voorwerpen_Elementen_en_Lore.md` & `.txt` (11.256 bytes)
  8. `05_Themes_Literary_Analysis_and_Motifs.md` & `.txt` / `05_Thema_Analyse_en_Literaire_Motieven.md` & `.txt` (8.265 bytes)
  9. `06_Key_Scenes_and_Chapter_Breakdown.md` & `.txt` / `06_Hoofdstukkenoverzicht_en_Sleutelscenes.md` & `.txt` (8.386 bytes)
  10. `07_Book_vs_Movie_Differences_and_Trivia.md` & `.txt` / `07_Boek_vs_Film_Verschillen_en_Media_Trivia.md` & `.txt` (5.251 bytes)
  11. `08_Holes_Study_Guide_and_Exam_Prep.md` & `.txt` / `08_Holes_Compendium_en_Studiegids.md` & `.txt` (5.468 bytes)
  12. Gerelateerde excerpten van Louis Sachar: `Small_Steps_Excerpt.md` en `Fuzzy_Mud_Excerpt.md`.
  13. Ondersteunende naslagwerken over Kunstmatige Intelligentie, Software Architectuur en het Zonnestelsel.

---

## 3. End-to-End API Health Check & Endpoint Matrix

Alle door de Main Orchestrator gespecificeerde endpoints (`/api/documents`, `/api/studio/quiz`, `/api/studio/summary`, `/api/chat`) en aanverwante studio-routes zijn live getest en leveren **200 OK** responses met volledige foutafhandeling (400 Bad Request bij ontbrekende parameters).

| Endpoint | Methode | Doel / Payload | HTTP Status | Getest Resultaat |
| :--- | :--- | :--- | :--- | :--- |
| `/` | `GET` | Single Page Web Client (`index.html`) | **200 OK** | Laadt HTML interface, scripts en styles. |
| `/api/documents` | `GET` | Lijst van alle 50 documenten met metadata | **200 OK** | Retourneert array met `name`, `wordCount`, `modified`, `preview`. |
| `/api/documents/:file` | `GET` | Inhoud en inhoudsopgave van 1 document | **200 OK** | Markdown tekst, leestijd, headings voor TOC outline. |
| `/api/documents` | `POST` | Nieuw document aanmaken | **200 OK** | Veilig sanitizen van bestandsnaam, unieke padresolutie. |
| `/api/documents/:file` | `PUT` | Document bijwerken via in-place editor | **200 OK** | Overschrijft inhoud en herberekent statistieken. |
| `/api/documents/:file` | `DELETE`| Document verwijderen | **200 OK** | Verwijdert bestand netjes van schijf. |
| `/api/convert` | `POST` | Upload van binaire bestanden of geplakte tekst | **200 OK** | Converteert naar .md/.txt, bewaart afbeeldingen in `assets/`. |
| `/api/studio/summary` | `POST` / `GET` | Samenvatting (executive, bullets, in-depth, tldr) | **200 OK** | Ondersteunt JSON body en query parameters. |
| `/api/studio/quiz` | `POST` / `GET` | Interactieve 4-optie meerkeuzetoetsvragen | **200 OK** | Genereert 4 opties (A/B/C/D), score, toelichting en citaat. |
| `/api/chat` (alias) | `POST` / `GET` | Vraag beantwoorden op basis van bronnen | **200 OK** | Grounded Q&A met bronverwijzingen `[1]`, `[2]`, deduplicatie. |
| `/api/studio/chat` | `POST` / `GET` | Idem als `/api/chat` | **200 OK** | Identieke functionaliteit via beide endpoint routes. |
| `/api/studio/flashcards` | `POST` | Flitskaarten voor begrippen en personages | **200 OK** | Array van kaarten met `front`, `back`, `mastered`. |
| `/api/studio/study-guide` | `POST` | Volledige syllabus met zelftestvragen | **200 OK** | Gestructureerde Markdown studiegids met begrippenlijst. |
| `/api/studio/faq` | `POST` | Veelgestelde vragen en antwoorden | **200 OK** | Array van `question` en `answer` paren. |
| `/api/studio/audio-overview` | `POST` | 2-Host Podcast Deep Dive script (**Leo & Maya**) | **200 OK** | Dialoog tussen presentatoren Leo & Maya met audio player. |
| `/api/stats` | `GET` | Totaalstatistieken van kennisbank | **200 OK** | Woordtellingen (205.157 woorden), ondersteunde formaten. |

---

## 4. Opgeloste Tekortkomingen van de Vorige Iteratie

Tijdens onze onafhankelijke diepgaande audit zijn verscheidene ernstige functionele fouten in de vorige implementatie ontdekt en structureel opgelost:

### A. Quizgeneratie & Pre-authored Meerkeuzevragen (`extractMCQuestions`)
- **Probleem**: De vorige implementatie beweerde dat `extractQAPairs` de vragen uit `09_Holes_Exam_QA_Quizzes_and_Flashcards.md` kon parsen. In werkelijkheid faalde de regex volledig op dit formaat (met keuzes A, B, C, D en `Correct Antwoord:`). Hierdoor viel de engine terug op het extraheren van stopwoorden en structurele kopjes, wat leidde tot absurde quizvragen zoals: *Vraag: "Welk begrip past bij 'anagram van de stad Green Lake'?"* met foute antwoordopties `["Toelichting", "Het", "Flashcards", "Deel 1"]` en correct antwoord `"Het"`.
- **Oplossing**: De functie `extractMCQuestions()` is geïmplementeerd. Deze herkent blokken met vraagstellingen, de vier keuzes A), B), C), D), de juiste antwoordsleutel en de uitgebreide toelichting. Alle 10 authentieke toetsvragen worden nu vlekkeloos en met 100% integriteit ingeladen.

### B. Fatale Logische Fout in Waar/Niet Waar Vragen
- **Probleem**: De oude fallback code voor True/False vragen probeerde ontkenningen te maken via `sent.replace(/\b(is|wordt|heeft|zijn)\b/i, '$1 niet')`. Wanneer een zin deze werkwoorden niet bevatte (bijv. *"Stanley groef elke dag een gat"*), deed de replace niets, maar werd de stelling toch gemarkeerd als `Niet waar` (`correctIndex = 1`). Een gebruiker die het juiste antwoord "Waar" koos, kreeg ten onrechte de melding: *"Helaas, dat is niet juist. Volgens de brontekst geldt: Stanley groef elke dag een gat"*.
- **Oplossing**: Alle quizvragen zijn nu gestandaardiseerd als volwaardige 4-optie meerkeuzevragen (`type: 'multiple_choice'`). Zinnen worden gebruikt voor cloze/aanvultoetsen met vier afzonderlijke afleiders.

### C. Flashcard Tabelvernietiging in `cleanMarkdown` & Extractie
- **Probleem**: `cleanMarkdown` voerde `md.replace(/\|.*?\|/g, '')` uit. Dit verwijderde bij elke markdown tabelrij de volledige eerste kolom! Hierdoor werden de personages in de studietabel gewist en genereerde de flashcardgenerator kaarten met "Het", "Flashcards", "Deel 1" en "Toelichting".
- **Oplossing**: `cleanMarkdown` verwijdert nu uitsluitend de markdown scheidingsrijen (`|---|---|`) en converteert pipes naar spaties, waardoor tabeltekst behouden blijft. Daarnaast is `extractFlashcardTable()` toegevoegd om personagetabellen direct om te zetten in hoogwaardige flitskaarten (bijv. *Front: Charles "Trout" Walker* -> *Back: "Heeft voeten die ruiken naar dode vis..."*).

### D. Verminkte Zinsplitsing bij Afkortingen (`splitSentences`)
- **Probleem**: De regex `split(/(?<=[.!?])\s+(?=[A-Z0-9À-Ý])/)` splitste zinnen direct na titels zoals `Mr. Sir`, `Mr. Pendanski`, `Mevr. Bell`. Hierdoor werden namen in stukjes gehakt en werden zinnen korter dan 20 tekens weggefilterd, wat leidde tot lege samenvattingen en afgekapte citaten.
- **Oplossing**: Afkortingen met punten (`Mr.`, `Mrs.`, `Ms.`, `Dr.`, `Prof.`, `Mevr.`, `Dhr.`, `St.`, `bijv.`, `ca.`, `vs.`, `e.g.`, `i.e.`) worden tijdelijk gemaskeerd met een unieke sentinel alvorens te splitsen, waardoor zinnen intact blijven.

### E. Grounded Chat Verbeteringen & Deduplicatie
- **Probleem**: 
  1. De header van het chatantwoord bevatte een hardgecodeerde `[1]`: `"Op basis van de geselecteerde bronnen [1]:\n\n"`, wat in de frontend resulteerde in een dubbele en verwarrende bronknop in de koptekst.
  2. Omdat de map `documents/` zowel `.md` als `.txt` versies bevat, werden identieke alinea's tweemaal gerangschikt, resulterend in dubbele citaten en herhaalde antwoordzinnen.
- **Oplossing**: De koptekst is gecorrigeerd (`Op basis van de geselecteerde bronnen:\n\n`) en alinea-deduplicatie op basis van tekstvingerafdrukken is geïntroduceerd.

### F. Frontend DOM & String Escaping Fixes
- **Probleem**: 
  1. In `client/app.js` gebruikte de inhoudsopgave (`renderOutline`) een inline `onclick="app.scrollToHeading('${this.escapeHtml(h.text)}')"` attribuut. Koppen met apostroffen (zoals *Kissin' Kate Barlow* of *Stanley's avontuur*) crashten met JavaScript syntaxfouten.
  2. Knoppen voor het opslaan van samenvattingen en studiegidsen gebruikten `JSON.stringify` binnen inline HTML onclick-attributen, wat faalde zodra er aanhalingstekens in de tekst stonden.
  3. Snelle dubbelklikken op de quizknoppen konden de score meervoudig ophogen.
- **Oplossing**: De outline en delete-knoppen maken nu gebruik van `data-heading` / `data-name` attributen met modulaire event listeners. Samenvattingen en studiegidsen worden in geheugen opgeslagen (`this.lastSummary`, `this.lastStudyGuide`) en aangeroepen via veilige methoden (`saveLastSummaryAsNote()`, `saveLastStudyGuideAsNote()`). Er is een `answeredCurrent` guard ingebouwd tegen dubbelklikken in de quiz.

---

## 5. Verificatie & Testresultaten

Het volledige geautomatiseerde testpakket is uitgebreid en uitgevoerd:
```bash
cmd /c npm test
```
**Resultaat:**
- **38 tests geslaagd, 0 mislukt, 0 overgeslagen** (totale duur: ~4.3s).
- Geteste modules:
  - `test/api.test.js`: Alle REST endpoints, lifecycle van documenten, conversie, chat grounded responses, studio quiz, summary, flashcards, study-guide, audio-overview en documentaanwezigheid (Holes materialen).
  - `test/converter.test.js`: HTML naar Markdown, CSV/JSON tabelconversie, base64-afbeeldingsextractie, unieke padbepaling en bestandsnaamsanitisatie.
  - `test/studio.test.js`: Taaldetectie, zinsplitsing met persoonsafkortingen, tabelbehoud in `cleanMarkdown`, extractie van 4-optie meerkeuzevragen (`extractMCQuestions`), extractie van personagetabellen (`extractFlashcardTable`), grounded Q&A citaten en deduplicatie.
  - `test/watcher.test.js`: End-to-end bestandswatcher in `inbox/`, automatische conversie naar `documents/` en verplaatsing naar `processed/`.

---

## 6. Conclusie & Overdracht naar Main Orchestrator

De applicatie is stabiel, technisch gehard en biedt een hoogwaardige leeromgeving voor het Engels literatuurtentamen over *Holes*. Alle 50 documenten zijn direct doorzoekbaar en leveren accurate antwoorden, zelftests en flitskaarten zonder runtime-fouten.
