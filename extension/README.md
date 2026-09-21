# CVBuilder - Job Description Extractor (Chrome Extension)

Extensie Chrome (Manifest V3) proiectată pentru a extrage automat job-urile de pe orice pagină web și a le salva persistent în baza de date CVBuilder pentru utilizatorul activ.

---

## 🚀 Instalare Rapidă în Browser

1. Deschideți un browser bazat pe Chromium (**Google Chrome**, **Brave**, **Microsoft Edge**, **Arc**, etc.).
2. Accesați pagina de extensii:
   - Chrome: `chrome://extensions`
   - Brave: `brave://extensions`
   - Edge: `edge://extensions`
3. Activați comutatorul **"Developer mode"** (Mod dezvoltator) din colțul din dreapta-sus.
4. Apăsați pe butonul **"Load unpacked"** (Încarcă extensie despachetată).
5. Selectați folderul `extension/` din rădăcina proiectului `CVBuilder` (`/Users/rzv/remote/CVBuilder/extension`).

Extensia este acum instalată și gata de utilizare!

---

## 🎯 Cum funcționează

1. **Deschideți orice anunț de job** pe platforme populare sau site-uri de cariere:
   - **LinkedIn Jobs** (`linkedin.com/jobs/...`)
   - **Indeed** (`indeed.com/...`)
   - **Greenhouse** (`boards.greenhouse.io/...`)
   - **Lever** (`jobs.lever.co/...`)
   - Orice site de cariere de companie ce folosește **Schema.org JSON-LD** (`JobPosting`) sau markup semantic HTML5.
2. **Apăsați pe iconița extensiei CVBuilder** din bara browserului:
   - Extensia detectează automat dacă aveți deschisă aplicația SPA (**CVBuilder** la `localhost:5173`) și identifică utilizatorul autentificat.
   - Extrage în timp real titlul jobului, compania, locația, descrierea completă și link-ul sursă.
3. **Apăsați pe „Extrage și Salvează Job-ul”**:
   - Job-ul este trimis direct prin REST API (`POST http://localhost:3001/api/target-jobs` sau `3000`) către serverul backend și salvat persistent în SQLite (`TargetJob` asociat utilizatorului).
   - Dacă tab-ul CVBuilder este deschis în browser, un eveniment `postMessage` (`CVBUILDER_JOB_IMPORTED`) este emis automat, determinând tab-ul **ATS Optimizer** să reîncarce instantaneu lista de job-uri și să selecteze noul job importat.

---

## 📁 Structura Fișierelor Extensiei

- `manifest.json`: Configurația Manifest V3 a extensiei cu permisiuni de scripting și acces rețea.
- `extractJob.js`: Motorul modular de extracție inteligentă (JSON-LD Schema.org + fallback selectors specializate).
- `popup.html`: Interfața vizuală modernă (dark theme, preview card, status utilizator, buton de acțiune).
- `popup.js`: Logica de detectare a utilizatorului SPA, execuție script de extracție, transmitere POST backend și notificare SPA.
- `content.js`: Script de conținut pentru comunicare opțională cu pagina web.
