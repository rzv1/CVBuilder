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
    }
  }
}