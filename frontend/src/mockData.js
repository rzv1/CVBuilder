
export const MOCK_ATS_JOB_DESCRIPTION = `
We are looking for a Senior Full Stack Engineer with strong expertise in React, TypeScript, Node.js, and Cloud Infrastructure (AWS / Docker). 
Key requirements:
- 5+ years experience building web applications using React, Next.js, and TypeScript.
- Hands-on experience with GraphQL, REST APIs, and microservices architecture.
- Demonstrated ability to optimize performance (Core Web Vitals, SSR, Bundle Size).
- Experience with Docker, Kubernetes, CI/CD automation, and Redis caching.
- Excellent communication skills, team leadership, and mentorship experience.
- Bonus points for Open Source contributions and CRDT / Real-time WebSocket experience.
`;

export const MOCK_GIT_COMMITS = [
  {
    id: "c-104",
    hash: "a7f3b91",
    author: "Alexandru Popescu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    timestamp: "10 mins ago",
    tag: "v1.4",
    message: "Updated lead experience bullets with Google XYZ metric formula",
    changes: { added: 3, deleted: 1 }
  },
  {
    id: "c-103",
    hash: "d4e21a8",
    author: "Alexandru Popescu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    timestamp: "2 hours ago",
    tag: "v1.3",
    message: "Added Open Source & Conference Talks modular sections",
    changes: { added: 8, deleted: 0 }
  },
  {
    id: "c-102",
    hash: "8c91b22",
    author: "Elena Ionescu (Reviewer)",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    timestamp: "1 day ago",
    tag: "v1.2",
    message: "Suggested refining Senior Frontend role summary for ATS optimization",
    changes: { added: 2, deleted: 2 }
  },
  {
    id: "c-101",
    hash: "1a00f45",
    author: "Alexandru Popescu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    timestamp: "3 days ago",
    tag: "v1.0",
    message: "Initial JSON Resume import & baseline setup",
    changes: { added: 24, deleted: 0 }
  }
];

export const MOCK_COLLABORATORS = [
  { id: "u-1", name: "Alexandru Popescu (You)", role: "Owner", color: "#3b82f6", active: true, status: "Editing Experience" },
  { id: "u-2", name: "Elena Ionescu", role: "Reviewer / HR", color: "#10b981", active: true, status: "Viewing ATS Score" },
  { id: "u-3", name: "Mihai TechLead", role: "Collaborator", color: "#f59e0b", active: false, status: "Offline" }
];

export const MOCK_COMMENTS = [
  {
    id: "cm-1",
    author: "Elena Ionescu",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    timestamp: "15 mins ago",
    section: "Work Experience - TechScale Solutions",
    text: "Great metric in bullet #1! Consider adding Kubernetes to your cloud skills tags as well since the job description emphasizes it.",
    resolved: false
  },
  {
    id: "cm-2",
    author: "Mihai TechLead",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mihai",
    timestamp: "1 hour ago",
    section: "Open Source Projects",
    text: "React-Fast-Grid stats look impressive. The link to your GitHub repo is clear.",
    resolved: true
  }
];

export const MOCK_ANALYTICS = {
  hostedUrl: "https://cvbuilder.live/alex-popescu",
  qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://cvbuilder.live/alex-popescu",
  stats: {
    totalViews: 342,
    pdfDownloads: 89,
    qrScans: 41,
    avgReadTime: "2m 14s"
  },
  recentViews: [
    { date: "Mon", views: 24, downloads: 6 },
    { date: "Tue", views: 45, downloads: 12 },
    { date: "Wed", views: 68, downloads: 18 },
    { date: "Thu", views: 52, downloads: 15 },
    { date: "Fri", views: 81, downloads: 22 },
    { date: "Sat", views: 39, downloads: 9 },
    { date: "Sun", views: 33, downloads: 7 }
  ],
  topReferrers: [
    { source: "LinkedIn Direct Link", count: 184, percentage: "53.8%" },
    { source: "GitHub Profile Readme", count: 92, percentage: "26.9%" },
    { source: "QR Code Scan (PDF Header)", count: 41, percentage: "12.0%" },
    { source: "Direct / Email Share", count: 25, percentage: "7.3%" }
  ]
};

export const SAMPLE_JSON_RESUME = {
  "$schema": "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
  "basics": {
    "name": "Alexandru Popescu",
    "label": "Senior Full Stack Engineer & Cloud Architect",
    "image": "",
    "email": "alex.popescu@techdev.io",
    "phone": "+40 722 123 456",
    "url": "https://alexpopescu.dev",
    "summary": "Senior Software Engineer with 7+ years of experience building high-scale distributed web applications and modern cloud architectures.",
    "location": {
      "city": "Bucharest",
      "countryCode": "RO"
    },
    "profiles": [
      { "network": "GitHub", "username": "alexp-dev", "url": "https://github.com/alexp-dev" },
      { "network": "LinkedIn", "username": "alex-popescu", "url": "https://linkedin.com/in/alex-popescu" }
    ]
  },
  "work": [
    {
      "name": "TechScale Solutions",
      "position": "Lead Full Stack Engineer",
      "startDate": "2022-01-01",
      "endDate": "2026-08-01",
      "summary": "Led core product development for real-time analytics platform handling 5M daily active users.",
      "highlights": [
        "Accelerated page load speed by 62% as measured by Lighthouse Core Web Vitals",
        "Increased system throughput by 45% (handling 12,000 req/sec)"
      ]
    }
  ],
  "education": [
    {
      "institution": "Politehnica University of Bucharest",
      "area": "Computer Science",
      "studyType": "Bachelor of Science",
      "startDate": "2014-10-01",
      "endDate": "2018-07-01"
    }
  ],
  "skills": [
    { "name": "Web Development", "keywords": ["React", "TypeScript", "Node.js", "Next.js", "GraphQL"] },
    { "name": "Cloud & Infrastructure", "keywords": ["AWS", "Docker", "Kubernetes", "Redis", "PostgreSQL"] }
  ]
};

export const INITIAL_AI_CHAT_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'Salut Alexandru! Sunt Asistentul tău AI dedicat optimizării CV-ului. Am analizat secțiunile din CV-ul tău curent și sunt pregătit să te ajut să obții maximum de vizibilitate în fața recrutatorilor.',
    timestamp: '10:42',
    actions: [
      { label: '🚀 Optimizare Rezumat', prompt: 'Cum pot optimiza rezumatul profesional pentru un rol de Lead Cloud Architect?' },
      { label: '📊 Adaugă Metrici de Impact', prompt: 'Sugerează metrici cu impact cuantificabil pentru experiența la TechScale Solutions.' }
    ]
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Cum pot îmbunătăți prima experiență profesională pentru a evidenția abilitățile de leadership și cloud?',
    timestamp: '10:43'
  },
  {
    id: 'msg-3',
    sender: 'ai',
    text: 'Recomand să adaugi un punct cheie axat pe arhitectură cloud și optimizarea costurilor. De exemplu:\n\n• *"Orchestrated migration of monolithic services to AWS ECS & Terraform, reducing infrastructure costs by 38% while boosting deployment frequency by 4x."*',
    timestamp: '10:44'
  }
];