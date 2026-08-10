export const BLOG_CATEGORIES = [
  { id: 'all', name: 'Toate Articolele', icon: 'BookOpen', count: 6 },
  { id: 'cv-preview', name: 'CV Preview', icon: 'Eye', count: 1 },
  { id: 'cv-as-code', name: 'CV-as-Code', icon: 'FileCode', count: 1 },
  { id: 'ai-agent', name: 'AI Agent', icon: 'Zap', count: 1 },
  { id: 'social', name: 'Social', icon: 'Users', count: 1 },
  { id: 'misc', name: 'Misc', icon: 'Sliders', count: 2 },
];

export const DOCS_SECTIONS = [
  { id: 'architecture', title: 'Modul de Funcționare (Arhitectură)', icon: 'Cpu' },
  { id: 'editor-syntax', title: 'Sintaxă Viitor Code Editor (DSL)', icon: 'Terminal' },
  { id: 'pdf-engine', title: 'Engine-ul de Export PDF', icon: 'Printer' },
  { id: 'ats-scoring', title: 'Algoritmul ATS & Prompting AI', icon: 'Target' }
];

export const BLOG_ARTICLES = [
  {
    id: 'cv-preview-engine',
    title: 'Cum funcționează Motorul de Previziune A4 Deterministică',
    category: 'cv-preview',
    categoryName: 'CV Preview',
    date: '10 Aug 2026',
    readTime: '6 min citire',
    author: 'Echipa CVBuilder Core',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    summary: 'Explicație tehnică despre simularea fizică a paginii A4 în browser, gestionarea dinamica a marginilor și calcularea deterministă a rupturilor de pagină fără alterarea stilului.',
    tags: ['CSS Layout', 'Paper Physics', 'Print Styles', 'React Engine'],
    content: `
# Arhitectura Motorului CV Preview A4

În CVBuilder AI Studio, principala provocare tehnică este garantarea potrivirii exacte a layout-ului din ecranul browser-ului cu documentul PDF fizic generat la printare (WSIWYG - *What You See Is What You Get*).

### 1. Raportul de Aspect A4 Fiziologic
Pentru a asigura precizia pixel-perfect, foaia din preview este restricționată la dimensiunea standard ISO 216:
- **Lățime fizică**: 210mm (~794px la 96 DPI)
- **Înălțime fizică**: 297mm (~1123px la 96 DPI)

\`\`\`css
/* Componenta A4 Preview Container */
.paper-a4 {
  width: 210mm;
  min-height: 297mm;
  background: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  margin: 0 auto;
  position: relative;
  page-break-after: always;
}
\`\`\`

### 2. Filtrarea Dinamică după Variantă (*Profile Tailoring*)
Aplicația permite comutarea instantanee între variante de profil (**Full Stack**, **Frontend**, **Backend**). Articolele din CV conțin atributul \`variantFilter: ['all', 'frontend']\`.

\`\`\`javascript
// Reacția motorului de filtrare
const filteredExperience = cvData.experience.filter(item => {
  if (activeVariant === 'all') return true;
  return item.variants?.includes(activeVariant);
});
\`\`\`

### 3. Evitarea Rupturilor Inestetice la Print
Prin utilizarea regulilor CSS modern **\`break-inside: avoid\`** și **\`page-break-inside: avoid\`**, ne asigurăm că blocurile de experiență sau educație nu sunt tăiate pe jumătate la tranziția dintre pagini.
    `
  },
  {
    id: 'cv-as-code-standard',
    title: 'CV-as-Code & Snapshot Versioning cu Git Submodules',
    category: 'cv-as-code',
    categoryName: 'CV-as-Code',
    date: '08 Aug 2026',
    readTime: '8 min citire',
    author: 'Radu - Lead Architect',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Radu',
    summary: 'Cum am transformat rezumatul dintr-un document PDF static într-un registru JSON Schema versionat cu Git commits, tag-uri semantice și diff vizual.',
    tags: ['JSON Resume', 'Git Versioning', 'Visual Diff', 'JSON Schema'],
    content: `
# Filozofia CV-as-Code

Odată ce tratăm CV-ul ca pe un artefact de cod sursă (*Code Base*), deblocăm avantaje uriașe:
- **Reproducibilitate**: Istoric exact de modificări cu commit hash (\`v2.4-prod (a8f3b1)\`).
- **Portabilitate**: Standardul universitar JSON Resume compatibil cu peste 500 de unelte.
- **Rollback instant**: Revenire la o versiune anterioară de CV în caz de refuz de la angajator.

### Structura JSON Schema
Codul din spatele stării aplicației respectă formatul:

\`\`\`json
{
  "basics": {
    "name": "Alexandru Popescu",
    "label": "Senior Full Stack Engineer",
    "email": "alex.popescu@dev.ro",
    "phone": "+40 722 123 456"
  },
  "work": [
    {
      "company": "TechCorp Solutions",
      "position": "Lead Software Architect",
      "startDate": "2023-01",
      "highlights": [
        "Migrat arhitectura monolitică spre micro-frontends",
        "Redus timpul de build cu 45% folosind Vite"
      ]
    }
  ]
}
\`\`\`

### Engine-ul de Visual Diff
Comparația dintre două versiuni de CV folosește un algoritm de diff pe obiecte JSON:
\`\`\`javascript
function computeVisualDiff(oldState, newState) {
  return {
    added: findNewKeys(oldState, newState),
    removed: findDeletedKeys(oldState, newState),
    modified: compareValues(oldState, newState)
  };
}
\`\`\`
    `
  },
  {
    id: 'ai-agent-ats-optimization',
    title: 'AI Agent & Algoritmul de Scor ATS (Applicant Tracking Systems)',
    category: 'ai-agent',
    categoryName: 'AI Agent',
    date: '05 Aug 2026',
    readTime: '7 min citire',
    author: 'Elena - AI Researcher',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    summary: 'Analiza semantică a descrierilor de job-uri (Job Descriptions) și optimizarea automată a cuvintelor cheie din CV folosind TF-IDF și LLM Prompting.',
    tags: ['AI Agent', 'ATS Optimizer', 'NLP', 'Semantic Score'],
    content: `
# Cum funcționează ATS & AI Optimizer-ul

Peste 85% din companiile Fortune 500 folosesc un sistem automat de filtrare (ATS - Applicant Tracking System) înainte ca un recrutor uman să citiți CV-ul.

### 1. Vectorizarea și Extragerea Cuvintelor Cheie
Agentul AI din CVBuilder analizează textul anunțului de angajare și calculează relevanța termenilor tehnici:

\`\`\`javascript
// Algoritmul de scor semantic ATS
export function calculateAtsMatchScore(cvText, jobDescription) {
  const jobKeywords = extractKeywords(jobDescription);
  const cvKeywords = extractKeywords(cvText);

  const matched = jobKeywords.filter(kw => cvKeywords.includes(kw));
  const score = Math.round((matched.length / jobKeywords.length) * 100);

  return { score, matchedKeywords: matched, missingKeywords: jobKeywords.filter(k => !matched.includes(k)) };
}
\`\`\`

### 2. Prompting Structurat pentru AI Improvement
La apăsarea butonului *"Optimize Bullet with AI"*, trimitem următorul prompt către LLM:

\`\`\`text
SYSTEM: Ești un expert HR & Tech Resume Writer.
USER: Rescrie următorul punct din CV pentru a fi mai concis și a include metrici de impact:
"Am ajutat la optimizarea bazei de date."

AI OUTPUT: "Optimizat interogările SQL complexe în PostgreSQL, reducând timpul mediu de răspuns de la 450ms la 80ms (82% îmbinare de performanță)."
\`\`\`
    `
  },
  {
    id: 'social-collaboration-analytics',
    title: 'Săli de Colaborare Real-Time & Privacy-First Analytics',
    category: 'social',
    categoryName: 'Social',
    date: '02 Aug 2026',
    readTime: '5 min citire',
    author: 'Mihai - Infrastructure',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mihai',
    summary: 'Arhitectura camerelor de peer-review în timp real și contorizarea accesărilor fără stocare de date cu caracter personal (GDPR Compliant).',
    tags: ['WebSockets', 'Collaboration', 'Analytics', 'GDPR Privacy'],
    content: `
# Colaborare Real-Time & Analytics Fără Cookie-uri

Modulul Social permite doi utilizatori (ex: un candidat și un mentor) să lucreze în paralel pe același CV și să vadă modificările live.

### 1. WebSockets & Avatar Stacking
Starea cursorilor și prezența colaboratorilor se transmite cu latență redusă (<50ms):

\`\`\`javascript
// Event-driven WebSocket dispatch
socket.on('user:join', (user) => {
  setCollaborators(prev => [...prev, user]);
  showToast(\`\${user.name} s-a alăturat sesiunii de review\`);
});
\`\`\`

### 2. Privacy-First View Tracker
Când partajezi CV-ul prin QR sau link public, înregistrăm statisticile de accesare cu protecție maximă a confidențialității:
- Anomimixare IP automat cu hash SHA-256.
- Fără stocare de cookie-uri terțe.
- Măsurare exactă a timpului petrecut de recrutor pe fiecare secțiune din CV.
    `
  },
  {
    id: 'misc-design-system',
    title: 'Sistemul de Design Glassmorphic Dark UI & CSS Custom Properties',
    category: 'misc',
    categoryName: 'Misc',
    date: '28 Iul 2026',
    readTime: '4 min citire',
    author: 'Echipa UI/UX',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design',
    summary: 'Construirea unei interfețe extrem de moderne folosind variabile CSS native, efecte de sticlă mată (backdrop-filter) și micro-animații fluide.',
    tags: ['Design System', 'Glassmorphism', 'CSS Variables', 'Aesthetics'],
    content: `
# Design System-ul CVBuilder AI Studio

Aplicația folosește o paletă cromatică curată pe fundal închis (\`#0b0f19\`), cu accente neon calde și efect de sticlă mată.

\`\`\`css
:root {
  --bg-dark: #0b0f19;
  --panel-bg: rgba(17, 24, 39, 0.75);
  --border-color: rgba(255, 255, 255, 0.08);
  --accent-primary: #3b82f6;
  --accent-purple: #8b5cf6;
  --accent-green: #10b981;
}

.glass-panel {
  background: var(--panel-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}
\`\`\`
    `
  },
  {
    id: 'misc-performance-state',
    title: 'Ghid de Performanță: Re-randări Zero în React & State Modular',
    category: 'misc',
    categoryName: 'Misc',
    date: '20 Iul 2026',
    readTime: '5 min citire',
    author: 'Radu - Lead Architect',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Radu',
    summary: 'Tehnici folosite pentru a menține aplicația la 60 FPS în timpul editării rapide a textului în panoul de control.',
    tags: ['React Perf', 'Debounce', 'Memoization', 'State Management'],
    content: `
# Optimizări de Performanță la Nivel de Cadru

Pentru a preveni întârzierile la tastare în editoarele de text cu previzualizare live:
1. **Debounce pe actualizarea stării de previzualizare** (150ms).
2. **React.memo** pe panoul A4 pentru a evita re-desenarea atunci când se schimbă tab-uri secundare.
3. **Immutability helpers** pentru update-uri rapide pe arce adânci în obiectul de CV.
    `
  }
];

export const DOCS_CONTENT = {
  architecture: {
    title: 'Modul de Funcționare al Aplicației',
    subtitle: 'Arhitectura de nivel înalt a CVBuilder AI Studio',
    content: `
# Arhitectura & Starea Aplicației

CVBuilder este conceput ca o aplicație **Single Page Application (SPA)** reactivă, construită modular pentru performanță maximă.

### Flow-ul de Date (Single Source of Truth)

1. **State-ul Central (\`cvData\`)**: Stochează toate informațiile rezumatului (Informații personale, Experiență, Educație, Abilități, Proiecte, Certificări).
2. **Selectorul de Variantă (\`activeVariant\`)**: Filtrează dinamic intările vizibile în ecranul de preview A4 în funcție de rolul țintă.
3. **Modulul de ATS & AI**: Analizează textul din starea curentă și oferă sugestii semantice în timp real.
4. **Export Engine**: Transformă ecranul de previzualizare direct în PDF deterministic utilizând capabilitățile native ale motorului de printare din browser (\`window.print()\`).

\`\`\`
+-------------------------------------------------------------------+
|                        CVBuilder App State                        |
|   +-------------------+    +-----------------+   +------------+   |
|   |  Content Editor   | -> |  cvData State   | ->| ATS Scorer |   |
|   +-------------------+    +-----------------+   +------------+   |
|                                     |                             |
|                                     v                             |
|                           +-------------------+                   |
|                           |  A4 Live Preview  |                   |
|                           +-------------------+                   |
|                                     |                             |
|                                     v                             |
|                           +-------------------+                   |
|                           | Deterministic PDF |                   |
|                           +-------------------+                   |
+-------------------------------------------------------------------+
\`\`\`
    `
  },

  'editor-syntax': {
    title: 'Sintaxă Viitor Code Editor (CV-DSL)',
    subtitle: 'Ghid complet pentru limbajul declarativ CV-as-Code inclus în versiunile viitoare',
    content: `
# Especificația Sintactică CV-DSL (Declarative Domain Specific Language)

Viitorul **Code Editor** va permite editarea CV-ului direct printr-un limbaj declarativ ultra-rapid, inspirat din YAML și Markdown.

### 1. Declarația de Profil & Header

\`\`\`yaml
@profile "Alexandru Popescu" {
  title: "Senior Full Stack Engineer"
  email: "alex.popescu@dev.ro"
  phone: "+40 722 123 456"
  location: "București, RO"
  links: [
    github: "github.com/alexpopescu",
    linkedin: "linkedin.com/in/alexpopescu"
  ]
}
\`\`\`

### 2. Definirea Secțiunilor cu Directiva \`@section\`

\`\`\`yaml
@section "Experiență Profesională" icon="briefcase" {

  @item company="TechCorp Solutions" role="Lead Architect" period="2023 - Prezent" {
    @variants ["all", "backend"]
    
    * Migrat arhitectura monolitică spre micro-servicii în Go și Node.js
    * Redus timpul de latență API de la 200ms la 35ms pentru 1M+ cereri zilnice
    * Coordonat o echipă de 8 ingineri seniori
  }

  @item company="WebCraft Studio" role="Frontend Specialist" period="2021 - 2023" {
    @variants ["all", "frontend"]
    
    * Devoltat interfețe reactive în React 18 și Tailwind CSS
    * Optimizat Core Web Vitals (LCP < 1.2s, CLS = 0)
  }
}
\`\`\`

### 3. Directiva de Tailoring Dinamic \`@variant\`
Puteți atașa tag-uri oricărui bloc pentru a-l include automat doar în anumite exporturi de CV:
- \`@variant("frontend")\` - Apare doar la generarea variantei de Frontend.
- \`@variant("backend")\` - Apare doar la generarea variantei de Backend.
- Implicite: Blocurile fără variant specificată apar în toate modelele.
    `
  },

  'pdf-engine': {
    title: 'Engine-ul de Export PDF',
    subtitle: 'Cum obținem export PDF Vectorial 100% Fidel',
    content: `
# Generarea PDF Fără Pierderi de Calitate

Spre deosebire de uneltele clasice care fac captura de ecran HTML (html2canvas) generând imagini pixelate, CVBuilder folosește **printare vectorială directă CSS Paged Media**.

### Proprietăți CSS pentru Print Vectorial

\`\`\`css
@media print {
  body {
    background: #ffffff !important;
    color: #000000 !important;
  }

  .app-header, .left-panel, .modal-backdrop {
    display: none !important;
  }

  .paper-a4 {
    box-shadow: none !important;
    margin: 0 !important;
    width: 100% !important;
  }
}
\`\`\`
    `
  },

  'ats-scoring': {
    title: 'Algoritmul ATS & Prompting AI',
    subtitle: 'Cum evaluează agentul compatibilitatea rezumatului',
    content: `
# Scoring ATS & Optimizare Inteligentă

Sistemul nostru calculează automat potrivirea cu descrierea job-ului utilizând două componente principale:

1. **TF-IDF Term Frequency**: Măsoară prezența termenilor critici menționați în fișa postului.
2. **Action-Verb Checker**: Verifică dacă fiecare punct de experiență începe cu un verb de acțiune puternic (*Dezvoltat*, *Optimizat*, *Conduit*, *Implementat*).
3. **Quantifiable Metrics Detector**: Identifică dacă există numere și procente care atestă rezultatele obținute (ex: \`35%\`, \`10k+\`, \`2.5s\`).
    `
  }
};
