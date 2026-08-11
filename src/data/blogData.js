export const BLOG_CATEGORIES = [
  {
    "id": "all",
    "name": "Toate Articolele",
    "icon": "BookOpen",
    "count": 6
  },
  {
    "id": "cv-preview",
    "name": "CV Preview",
    "icon": "Eye",
    "count": 1
  },
  {
    "id": "cv-as-code",
    "name": "CV-as-Code",
    "icon": "FileCode",
    "count": 2
  },
  {
    "id": "ai-agent",
    "name": "AI Agent",
    "icon": "Zap",
    "count": 0
  },
  {
    "id": "social",
    "name": "Social",
    "icon": "Users",
    "count": 1
  },
  {
    "id": "misc",
    "name": "Misc",
    "icon": "Sliders",
    "count": 2
  }
];

export const DOCS_SECTIONS = [
  {
    "id": "architecture",
    "title": "Modul de Funcționare (Arhitectură)",
    "icon": "Cpu"
  },
  {
    "id": "editor-syntax",
    "title": "Sintaxă Viitor Code Editor (DSL)",
    "icon": "Terminal"
  },
  {
    "id": "pdf-engine",
    "title": "Engine-ul de Export PDF",
    "icon": "Printer"
  },
  {
    "id": "ats-scoring",
    "title": "Algoritmul ATS & Prompting AI",
    "icon": "Target"
  }
];

export const BLOG_ARTICLES = [
  {
    id: "cv-preview-engine",
    title: "Cum funcționează Motorul de Previziune A4 Deterministică",
    category: "cv-preview",
    categoryName: "CV Preview",
    date: "10 Aug 2026",
    readTime: "6 min citire",
    author: "Echipa CVBuilder Core",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    summary: "Explicație tehnică despre simularea fizică a paginii A4 în browser, gestionarea dinamica a marginilor și calcularea deterministă a rupturilor de pagină fără alterarea stilului.",
    tags: ["CSS Layout","Paper Physics","Print Styles","React Engine"],
    content: "\n# Arhitectura Motorului CV Preview A4\n\nÎn CVBuilder AI Studio, principala provocare tehnică este garantarea potrivirii exacte a layout-ului din ecranul browser-ului cu documentul PDF fizic generat la printare (WSIWYG - *What You See Is What You Get*).\n\n### 1. Raportul de Aspect A4 Fiziologic\nPentru a asigura precizia pixel-perfect, foaia din preview este restricționată la dimensiunea standard ISO 216:\n- **Lățime fizică**: 210mm (~794px la 96 DPI)\n- **Înălțime fizică**: 297mm (~1123px la 96 DPI)\n\n```css\n/* Componenta A4 Preview Container */\n.paper-a4 {\n  width: 210mm;\n  min-height: 297mm;\n  background: #ffffff;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);\n  margin: 0 auto;\n  position: relative;\n  page-break-after: always;\n}\n```\n\n### 2. Filtrarea Dinamică după Variantă (*Profile Tailoring*)\nAplicația permite comutarea instantanee între variante de profil (**Full Stack**, **Frontend**, **Backend**). Articolele din CV conțin atributul `variantFilter: ['all', 'frontend']`.\n\n```javascript\n// Reacția motorului de filtrare\nconst filteredExperience = cvData.experience.filter(item => {\n  if (activeVariant === 'all') return true;\n  return item.variants?.includes(activeVariant);\n});\n```\n\n### 3. Evitarea Rupturilor Inestetice la Print\nPrin utilizarea regulilor CSS modern **`break-inside: avoid`** și **`page-break-inside: avoid`**, ne asigurăm că blocurile de experiență sau educație nu sunt tăiate pe jumătate la tranziția dintre pagini.\n    "
  },
  {
    id: "monaco-editor-react-integration",
    title: "Monaco-editor react integration",
    category: "cv-as-code",
    categoryName: "CV-as-Code",
    date: "11 Aug 2026",
    readTime: "8 min citire",
    author: "Razvan R",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Radu",
    summary: "How to integrate microsoft vs code with React, with easy to customize interface and functionality.",
    tags: ["Monaco Editor","React"],
    content: "\n# Monaco Editor\n\nEditorul monaco poate fi integrat intr-o aplicatie React atat prin pachetul de baza monaco-editor care se gaseste la https://github.com/microsoft/monaco-editor sau printr-un pachet conceput special pentru a facilita integrarea cu framework-ul React care se adauga in folderul de node_modules prin comanda:\n```bash\nnpm install @monaco-editor/react@latest\n```\n\nFolosirea pachetului pentru React ofera avantaje si dezavantaje. \n### Avantajul major este componenta react <Editor/> out-of-the-box care gestioneaza integrarea cu DOM-ul paginii si este usor customizabila cu props declarative. Exemplu de cod:\n```javascript\nimport Editor from '@monaco-editor/react'; \n\n<Editor \n\theight=\"90vh\" \n\tdefaultLanguage=\"typescript\" \n\tdefaultValue=\"// code\" \n\tonChange={(val) => console.log(val)} \n\toptions={monacoOptions}\n/>\n```\nToate setarile editorului de prezentare si functionalitati se pot seta prin JSON object-ul monacoOptions. Toate cheile configurabile se pot gasi la sub interfata IStandaloneEditorConstructionOptions.\n```json\n// Exemplu cu cateva optiuni\nconst monacoOptions = {  \n  automaticLayout: true,  \n  quickSuggestions: {  \n    other: true,  \n    comments: false,  \n    strings: false  \n  },  \n  suggest: {  \n    showWords: false  \n  },  \n  formatOnType: true,  \n  minimap: { enabled: false },  \n  glyphMargin: true,  \n  lineNumbers: 'off',  \n  lineDecorationsWidth: 8,  \n  lineNumbersMinChars: 3,  \n  renderLineHighlight: 'all',  \n  scrollbar: {  \n    vertical: 'visible',  \n    horizontal: 'visible',  \n    useShadows: false,  \n    verticalScrollbarSize: 8,  \n    horizontalScrollbarSize: 8  \n  }\n```\n\nDezavantajul este lipsa posibilitatii de a configura background worker-ul editorului (parsare, autocomplete), in special pentru limbajul YAML care este folosit in cadrul acestei aplicatii. Pachetul incarca resursele Monaco asincron prin CDN. Putem forta utilizarea codului monaco-editor local si configura background workers folosind:\n```javascript\nimport \\* as monaco from 'monaco-editor';\nimport { loader } from '@monaco-editor/react';\n\nloader.config({ monaco });\n```\n\n### Parsare YAML\nPentru autocompletare si erori de sintaxa specifice YAML avem nevoie de un background worker specializat pe acest limbaj. Il instalam folosind:\n```bash\nnpm install monaco-yaml@latest\n```\nPentru a seta acest background worker la monaco-editor adaugam urmatorul cod:\n```javascript\nimport \\* as monaco from 'monaco-editor'\nimport EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'\nimport { configureMonacoYaml } from 'monaco-yaml'\nimport YamlWorker from 'monaco-yaml/yaml.worker?worker'\n\nglobalThis.MonacoEnvironment = {\n  getWorker(moduleId, label) {\n    switch (label) {\n      case 'editorWorkerService':\n        return new EditorWorker()\n      case 'yaml':\n        return new YamlWorker()\n      default:\n        throw new Error(`Unknown label ${label}`)\n    }\n  }\n}\n```\nAcesta este codul care functioneaza cu Vite, asa cum reiese din pagina de github a pachetului, insa in ultima versiune de monaco-editor workerii nu mai sunt exportati si orice incercare de acces la acea cale va da eroare **Failed to resolve import**. Pentru a rezolva asta am folosit o versiune mai veche de monaco-editor@0.34.1. O alternativa ar fi fost instalarea unui nou pachet helper numit vite-plugin-monaco-editor.\n    "
  },
  {
    id: "error-detection-auto-run",
    title: "Error detection & auto-run",
    category: "cv-as-code",
    categoryName: "CV-as-Code",
    date: "11 Aug 2026",
    readTime: "2 min citire",
    author: "Razvan R",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Radu",
    summary: "How to extract the error from Editor component and implement the auto-run on content change.",
    tags: ["monaco API","ref","timeout","debounce"],
    content: "Pentru a extrage erorile returnate de editor si a le afisa intr-o componenta din DOM avem nevoie de referinta la API-ul global monaco si la editorul injectat in DOM de unde putem extrage erorile. Pentru a obtine aceasta referinta folosim handle-ul onMount al componentei React si ii dam o functie custom:\n```javascript\nconst handleEditorMount = (editor, monaco) => {  \n  editorRef.current = editor;  \n  monacoRef.current = monaco;  \n  \n  const disposable = monaco.editor.onDidChangeMarkers(() => {  \n    checkMarkers(editor, monaco);  \n  });  \n  \n  setTimeout(() => {  \n    checkMarkers(editor, monaco);  \n  }, 200);  \n  \n  return () => {  \n    disposable.dispose();  \n  };  \n};\n```\nDin documentatia oficiala https://microsoft.github.io/monaco-editor/docs.html#functions/editor_editor_api.editor.getModelMarkers.html reiese ca putem folosi getModelMarkers cu modelul editorului (fisierul deschis / codul din editor) pentru a obtine toate marcajele, ulterior putand filtrare doar dupa erori:\n```javascript\nconst checkMarkers = (editor, monaco) => {  \n  if (!editor || !monaco) return;  \n  const model = editor.getModel();  \n  if (!model) return;  \n  \n  const markers = monaco.editor.getModelMarkers({ resource: model.uri });  \n  const errorMarker = markers.find(m => m.severity === monaco.MarkerSeverity.Error);  \n  \n  if (errorMarker) {  \n    setSyntaxError({  \n      line: errorMarker.startLineNumber,  \n      column: errorMarker.startColumn,  \n      message: errorMarker.message  \n    });  \n  } else {  \n    setSyntaxError(null);  \n  }  \n};\n```\n\n### Debounce pentru executia automata\nFolosim un timeout de 500ms care se activeaza proaspat la fiecare schimbare a continutul fisierului. Legam aceasta functie la handle-ul onChange folosind prop la componenta Editor.\n```javascript\nconst handleContentChange = (value) => {  \n  setContentYaml(value || '');  \n  \n  if (debounceTimerRef.current) {  \n    clearTimeout(debounceTimerRef.current);  \n  }  \n  \n  if (autoRun) {  \n    debounceTimerRef.current = setTimeout(() => {  \n      if (editorRef.current && monacoRef.current) {  \n        checkMarkers(editorRef.current, monacoRef.current);  \n      }  \n    }, 500);  \n  }  \n};\n```"
  },
  {
    id: "drag-drop",
    title: "Drag & Drop",
    category: "misc",
    categoryName: "Misc",
    date: "11 Aug 2026",
    readTime: "5 min citire",
    author: "Razvan R",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Radu",
    summary: "How to do drag & drop on react component.",
    tags: ["react","drag&drop"],
    content: "Pentru a implementa mecanismul de drag & drop am urmarit documentatia mdn de la link-ul https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API. Fiecare sectiune are mai multe iteme stocate intr-un array. Scopul implementarii drag and drop este modificarea ordinii elementelor in acea lista izolata a unei sectiuni. Pentru inceput avem nevoie de o functie care pur si simplu muta un element de la o pozitie la alta intr-un array. Exemplu in cod:\n```\nconst reorder = (list, startIndex, endIndex) => {\n\tconst result = Array.from(list);\n\tconst [removed] = result.splice(startIndex, 1);\n\tresult.splice(endIndex, 0, removed);\n\treturn result;\n}\n```\n\nPentru a implementa functionalitatea avem nevoie de handlere pentru toate cele 3 stari prin care trece un node: drag start, drag over si drop. Pentru functia de drag start este important sa adaugam prin API-ul dataTransfer date de identificare pentru elementul care este tras, astfel incat la drop sa putem accesa acele date si sa modificam ordinea array-ului. Efectul de drag este randat de browser si pentru asta este necesar sa punem in cod e.dataTransfer.dropEffect = 'move' si e.dataTransfer.effectAllowed = 'move'.\n```\nconst handleDragStart = (e, sectionKey, index, customSecIdx = null) => {  \n  setDraggedItem({ sectionKey, index, customSecIdx });  \n  e.dataTransfer.effectAllowed = 'move';  \n  e.dataTransfer.setData('text/plain', JSON.stringify({ sectionKey, index, customSecIdx }));  \n};\n```\n\n```\nconst handleDragOver = (e) => {  \n  e.preventDefault();  \n  e.dataTransfer.dropEffect = 'move';  \n};\n```\n\n```\nconst handleDrop = (e, targetSectionKey, targetIndex, targetCustomSecIdx = null) => {  \n  e.preventDefault();  \n  if (!draggedItem) return;  \n  \n  if (draggedItem.sectionKey === targetSectionKey && draggedItem.customSecIdx === targetCustomSecIdx) {  \n    const fromIdx = draggedItem.index;  \n    if (fromIdx !== targetIndex) {  \n      if (targetCustomSecIdx !== null) {  \n        setCvData(prev => {  \n          const secList = [...(prev.customSections || [])];  \n          const items = secList[targetCustomSecIdx].items || [];  \n          secList[targetCustomSecIdx].items = reorder(items, fromIdx, targetIndex);  \n          return { ...prev, customSections: secList };  \n        });  \n      } else {  \n        setCvData(prev => {  \n          const list = prev[targetSectionKey] || [];  \n          return { ...prev, [targetSectionKey]: reorder(list, fromIdx, targetIndex) };  \n        });  \n      }  \n    }  \n  }  \n  setDraggedItem(null);  \n};\n```\n\nExemplu de element React care poate fi drag & drop:\n```\n<div   \nkey={exp.id}   \n\t// is-dragging just for css styles\n  className={`item-card ${draggedItem?.sectionKey === 'experience' && draggedItem?.index === expIdx ? 'is-dragging' : ''}`}  \n  draggable={true}  \n  onDragStart={(e) => handleDragStart(e, 'experience', expIdx)}  \n  onDragOver={handleDragOver}  \n  onDrop={(e) => handleDrop(e, 'experience', expIdx)}  \n>"
  },
  {
    id: "react-friendly-state-update",
    title: "React friendly state update",
    category: "misc",
    categoryName: "Misc",
    date: "28 Iul 2026",
    readTime: "4 min citire",
    author: "Razvan R",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Radu",
    summary: "How to change the DOM content for react friendly rendering.",
    tags: ["react","useState"],
    content: "Modificarea unui singur field astfel incat randarea sa fie rapida si friendly cu modul de functionare React se face prin exemplul de cod de mai jos:\n```\nconst handleEducationChange = (idx, field, value) => {  \n  setCvData(prev => {  \n    const list = [...(prev.education || [])];  \n    list[idx] = { ...list[idx], [field]: value };  \n    return { ...prev, education: list };  \n  });  \n};\n```\n\nAdaugare unui nou item in lista:\n```\nconst addExperience = () => {  \n  const newEntry = {  \n\t// id-ul este important pentru randare corecta\n    id: `exp-${Date.now()}`,  \n    role: \"Software Developer\"\n  }; \n   \n  setCvData(prev => ({  \n    ...prev,  \n    experience: [...prev.experience, newEntry]  \n  }));  \n};\n```\n\nStergerea unui item din lista pentru re-randare:\n```\nconst deleteExperience = (idx) => {  \n  setCvData(prev => ({  \n    ...prev,  \n    experience: prev.experience.filter((_, i) => i !== idx)  \n  }));  \n};"
  },
  {
    id: "misc-performance-state",
    title: "Ghid de Performanță: Re-randări Zero în React & State Modular",
    category: "social",
    categoryName: "Social",
    date: "20 Iul 2026",
    readTime: "1 min citire",
    author: "Radu - Lead Architect",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Radu",
    summary: "Tehnici folosite pentru a menține aplicația la 60 FPS în timpul editării rapide a textului în panoul de control.",
    tags: ["React Perf","Debounce","Memoization","State Management"],
    content: "\n# Optimizări de Performanță la Nivel de Cadru\n\nPentru a preveni întârzierile la tastare în editoarele de text cu previzualizare live:\n1. **Debounce pe actualizarea stării de previzualizare** (150ms).\n2. **React.memo** pe panoul A4 pentru a evita re-desenarea atunci când se schimbă tab-uri secundare.\n3. **Immutability helpers** pentru update-uri rapide pe arce adânci în obiectul de CV.\n    "
  }
];

export const DOCS_CONTENT = {
  "architecture": {
    "title": "Modul de Funcționare al Aplicației",
    "subtitle": "Arhitectura de nivel înalt a CVBuilder AI Studio",
    "content": "\n# Arhitectura & Starea Aplicației\n\nCVBuilder este conceput ca o aplicație **Single Page Application (SPA)** reactivă, construită modular pentru performanță maximă.\n\n### Flow-ul de Date (Single Source of Truth)\n\n1. **State-ul Central (`cvData`)**: Stochează toate informațiile rezumatului (Informații personale, Experiență, Educație, Abilități, Proiecte, Certificări).\n2. **Selectorul de Variantă (`activeVariant`)**: Filtrează dinamic intările vizibile în ecranul de preview A4 în funcție de rolul țintă.\n3. **Modulul de ATS & AI**: Analizează textul din starea curentă și oferă sugestii semantice în timp real.\n4. **Export Engine**: Transformă ecranul de previzualizare direct în PDF deterministic utilizând capabilitățile native ale motorului de printare din browser (`window.print()`).\n\n```\n+-------------------------------------------------------------------+\n|                        CVBuilder App State                        |\n|   +-------------------+    +-----------------+   +------------+   |\n|   |  Content Editor   | -> |  cvData State   | ->| ATS Scorer |   |\n|   +-------------------+    +-----------------+   +------------+   |\n|                                     |                             |\n|                                     v                             |\n|                           +-------------------+                   |\n|                           |  A4 Live Preview  |                   |\n|                           +-------------------+                   |\n|                                     |                             |\n|                                     v                             |\n|                           +-------------------+                   |\n|                           | Deterministic PDF |                   |\n|                           +-------------------+                   |\n+-------------------------------------------------------------------+\n```\n    "
  },
  "editor-syntax": {
    "title": "Sintaxă Viitor Code Editor (CV-DSL)",
    "subtitle": "Ghid complet pentru limbajul declarativ CV-as-Code inclus în versiunile viitoare",
    "content": "\n# Especificația Sintactică CV-DSL (Declarative Domain Specific Language)\n\nViitorul **Code Editor** va permite editarea CV-ului direct printr-un limbaj declarativ ultra-rapid, inspirat din YAML și Markdown.\n\n### 1. Declarația de Profil & Header\n\n```yaml\n@profile \"Alexandru Popescu\" {\n  title: \"Senior Full Stack Engineer\"\n  email: \"alex.popescu@dev.ro\"\n  phone: \"+40 722 123 456\"\n  location: \"București, RO\"\n  links: [\n    github: \"github.com/alexpopescu\",\n    linkedin: \"linkedin.com/in/alexpopescu\"\n  ]\n}\n```\n\n### 2. Definirea Secțiunilor cu Directiva `@section`\n\n```yaml\n@section \"Experiență Profesională\" icon=\"briefcase\" {\n\n  @item company=\"TechCorp Solutions\" role=\"Lead Architect\" period=\"2023 - Prezent\" {\n    @variants [\"all\", \"backend\"]\n    \n    * Migrat arhitectura monolitică spre micro-servicii în Go și Node.js\n    * Redus timpul de latență API de la 200ms la 35ms pentru 1M+ cereri zilnice\n    * Coordonat o echipă de 8 ingineri seniori\n  }\n\n  @item company=\"WebCraft Studio\" role=\"Frontend Specialist\" period=\"2021 - 2023\" {\n    @variants [\"all\", \"frontend\"]\n    \n    * Devoltat interfețe reactive în React 18 și Tailwind CSS\n    * Optimizat Core Web Vitals (LCP < 1.2s, CLS = 0)\n  }\n}\n```\n\n### 3. Directiva de Tailoring Dinamic `@variant`\nPuteți atașa tag-uri oricărui bloc pentru a-l include automat doar în anumite exporturi de CV:\n- `@variant(\"frontend\")` - Apare doar la generarea variantei de Frontend.\n- `@variant(\"backend\")` - Apare doar la generarea variantei de Backend.\n- Implicite: Blocurile fără variant specificată apar în toate modelele.\n    "
  },
  "pdf-engine": {
    "title": "Engine-ul de Export PDF",
    "subtitle": "Cum obținem export PDF Vectorial 100% Fidel",
    "content": "\n# Generarea PDF Fără Pierderi de Calitate\n\nSpre deosebire de uneltele clasice care fac captura de ecran HTML (html2canvas) generând imagini pixelate, CVBuilder folosește **printare vectorială directă CSS Paged Media**.\n\n### Proprietăți CSS pentru Print Vectorial\n\n```css\n@media print {\n  body {\n    background: #ffffff !important;\n    color: #000000 !important;\n  }\n\n  .app-header, .left-panel, .modal-backdrop {\n    display: none !important;\n  }\n\n  .paper-a4 {\n    box-shadow: none !important;\n    margin: 0 !important;\n    width: 100% !important;\n  }\n}\n```\n    "
  },
  "ats-scoring": {
    "title": "Algoritmul ATS & Prompting AI",
    "subtitle": "Cum evaluează agentul compatibilitatea rezumatului",
    "content": "\n# Scoring ATS & Optimizare Inteligentă\n\nSistemul nostru calculează automat potrivirea cu descrierea job-ului utilizând două componente principale:\n\n1. **TF-IDF Term Frequency**: Măsoară prezența termenilor critici menționați în fișa postului.\n2. **Action-Verb Checker**: Verifică dacă fiecare punct de experiență începe cu un verb de acțiune puternic (*Dezvoltat*, *Optimizat*, *Conduit*, *Implementat*).\n3. **Quantifiable Metrics Detector**: Identifică dacă există numere și procente care atestă rezultatele obținute (ex: `35%`, `10k+`, `2.5s`).\n    "
  }
};
