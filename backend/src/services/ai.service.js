import fs from 'fs';
import { SCHEMA_PATH } from '../config/paths.js';
import { GEMINI_API_KEY } from '../config/env.js';
import { deductUserCredits, getUserById } from './users.service.js';

export async function processChatStream(reqBody, res) {
  const { messages = [], content = {}, style = {}, userId, userName } = reqBody;
  const userMessage = messages[messages.length - 1]?.content || messages[messages.length - 1]?.text || '';

  // Deduct AI credit if user is identified
  if (userId || userName) {
    try {
      const user = await getUserById(userId || userName);
      if (user) {
        await deductUserCredits(user.id, 1);
      }
    } catch (err) {
      console.warn('Chat user credit deduction notice:', err.message);
    }
  }

  let schemaContent = '';
  if (fs.existsSync(SCHEMA_PATH)) {
    schemaContent = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  }

  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  });

  if (GEMINI_API_KEY) {
    try {
      const { streamText } = await import('ai');
      const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
      const google = createGoogleGenerativeAI({ apiKey: GEMINI_API_KEY });

      const systemPrompt = `You are an expert AI Resume Assistant specializing in token-efficient smart file rewriting using JSON Patches (RFC 6902).

CONTEXT:
1. schema.json (rules of syntax and structure):
${schemaContent.slice(0, 3000)} ...

2. content.json (active CV content):
${JSON.stringify(content, null, 2)}

3. style.json (active CV styling):
${JSON.stringify(style, null, 2)}

INSTRUCTIONS:
- You must fulfill the user's request by modifying content or style.
- To maximize speed and minimize token consumption, NEVER output the full updated JSON file or re-write unchanged sections.
- Output ONLY:
  1. A concise, professional explanation in Romanian explaining what changes were made.
  2. A valid JSON array of RFC 6902 JSON Patches wrapped in a \`\`\`json patch code block.

FORMAT EXAMPLE:
Am optimizat bullet point-ul pentru ...

\`\`\`json patch
[
  { "target": "content", "op": "replace", "path": "/experience/0/bullets/0", "value": "..." },
  { "target": "content", "op": "add", "path": "/skills/1/items/-", "value": "Kubernetes" },
  { "target": "style", "op": "replace", "path": "/typography/sectionTitleSize", "value": "1.25rem" }
]
\`\`\`
`;

      const result = streamText({
        model: google('gemini-3.6-flash'),
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      });

      for await (const textPart of result.textStream) {
        res.write(textPart);
      }
      res.end();
    } catch (apiErr) {
      console.warn('Gemini API call warning, falling back to smart server simulation:', apiErr.message);
      res.write(apiErr.message);
      res.end();
    }
  } else {
    res.write('Eroare: Cheia API Gemini nu este configurată pe server.');
    res.end();
  }
}

export async function parseCvFromText({ text, userId, userName }) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new Error('Textul extras din CV este gol.');
  }

  // Deduct AI credit if user is identified
  if (userId || userName) {
    try {
      const user = await getUserById(userId || userName);
      if (user) {
        await deductUserCredits(user.id, 1);
      }
    } catch (err) {
      console.warn('Parse CV user credit deduction notice:', err.message);
    }
  }

  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY nu este setat pe server. Vă rugăm verificați fișierul .env.');
  }

  try {
    const { generateText } = await import('ai');
    const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
    const google = createGoogleGenerativeAI({ apiKey: GEMINI_API_KEY });

    const systemPrompt = `You are an expert AI CV/Resume Parser. Your task is to accurately extract all information from the raw CV text and map it into a valid JSON object strictly matching the schema below.

JSON SCHEMA STRUCTURE:
{
  "personal": {
    "name": "Full Name",
    "title": "Professional Title / Subtitle",
    "email": "Email Address",
    "phone": "Phone Number",
    "address": "Location / Address",
    "website": "Website URL",
    "github": "GitHub profile URL",
    "linkedin": "LinkedIn profile URL",
    "summary": "Professional Summary / About section"
  },
  "experience": [
    {
      "id": "exp-1",
      "role": "Job Title",
      "company": "Company Name",
      "location": "Location",
      "start": "Start Date / Year",
      "end": "End Date / Present",
      "description": "Overall role summary",
      "bullets": ["Achievement / Responsibility bullet 1", "Bullet 2"],
      "variants": ["all"]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "degree": "Degree / Qualification",
      "institution": "University / School Name",
      "location": "Location",
      "start": "Start Year",
      "end": "End Year",
      "description": "Details or honors",
      "variants": ["all"]
    }
  ],
  "skills": [
    {
      "id": "sk-1",
      "category": "Skill Category (e.g. Technical Skills, Languages, Soft Skills)",
      "items": ["Skill 1", "Skill 2"],
      "variants": ["all"]
    }
  ],
  "languages": [
    {
      "id": "lang-1",
      "name": "Language Name",
      "level": "Proficiency Level",
      "variants": ["all"]
    }
  ],
  "awards": [
    {
      "id": "aw-1",
      "title": "Award Title",
      "issuer": "Issuer Organization",
      "date": "Date / Year",
      "description": "Description",
      "variants": ["all"]
    }
  ],
  "customSections": [
    {
      "id": "sec-1",
      "title": "Custom Section Title (e.g. Projects, Certifications, Open Source)",
      "items": [
        {
          "id": "csi-1",
          "heading": "Title / Item Name",
          "subheading": "Subtitle / Role",
          "start": "Start Date",
          "end": "End Date",
          "detail": "Details / Description",
          "variants": ["all"]
        }
      ]
    }
  ]
}

STRICT REQUIREMENTS:
1. Every array item MUST have a unique "id" string (e.g. exp-1, exp-2, edu-1, sk-1, lang-1, aw-1, sec-1, csi-1).
2. Every item in experience, education, skills, languages, awards, customSections MUST include "variants": ["all"].
3. Translate or preserve text faithfully. Clean up linebreaks or layout artifacts from OCR / PDF extraction.
4. Output ONLY valid JSON enclosed within a \`\`\`json \`\`\` code block. Do NOT include any intro or conversational text.`;

    const { text: aiResponseText } = await generateText({
      model: google('gemini-3.6-flash'),
      system: systemPrompt,
      prompt: `TEXTUL BRUT AL CV-ULUI PENTRU PARSARE:\n\n${text.slice(0, 15000)}`
    });

    const jsonMatch = aiResponseText.match(/```json\s*([\s\S]*?)```/) || aiResponseText.match(/```\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : aiResponseText.trim();
    const parsedData = JSON.parse(jsonStr);
    return parsedData;

  } catch (err) {
    console.error('Error parsing CV with AI:', err);
    throw new Error(`Eroare la procesarea AI a CV-ului: ${err.message}`);
  }
}
