===================================================================
INBOX MAP VOOR AUTOMATISCHE DOCUMENT- EN AFBEELDINGSCONVERSIE
===================================================================

Plaats hier je bestanden:
- PDF documenten (.pdf)
- Word documenten (.docx)
- HTML pagina's (.html, .htm)
- Tekstbestanden (.txt, .log)
- Gegevensbestanden (.csv, .json)
- Afbeeldingen (.png, .jpg, .jpeg, .gif, .webp, .svg)

Wat gebeurt er automatisch:
1. De Inbox Watcher zet elk bestand automatisch om naar een schoon
   .md (Markdown) of .txt bestand in de map `documents/`.
2. Alle eventuele afbeeldingen worden bewaard in `documents/assets/`
   en correct gekoppeld in de markdown notitie (`![afbeelding](assets/...)`).
3. Het originele bestand wordt verplaatst naar `inbox/processed/`.

Je kunt de conversie ook handmatig starten via:
- Dubbelklikken op `convert.bat`
- Of uitvoeren van `node scripts/convert.js` in de terminal.
- Of via de drag & drop upload in de webapplicatie (http://localhost:3000)!
===================================================================
