import { mapJsonResumeToAppSchema } from './jsonResumeMapper.js';

/**
 * JSON Extractor (App CV Schema or JSON Resume format)
 */
export async function extractFromJson(file) {
  const rawText = await file.text();
  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (err) {
    throw new Error('Invalid JSON syntax.');
  }

  // Case 1: Already App CV format (has personal section)
  if (parsed && typeof parsed === 'object' && parsed.personal) {
    const photo = parsed.personal.avatar || parsed.personal.photo || parsed.personal.picture || null;
    return {
      cvData: parsed,
      photo,
      isJsonSchema: true
    };
  }

  // Case 2: Standard JSON Resume format (has basics section)
  if (parsed && typeof parsed === 'object' && parsed.basics) {
    const photo = parsed.basics.picture || parsed.basics.image || parsed.basics.avatar || null;
    const mapped = mapJsonResumeToAppSchema(parsed);
    return {
      cvData: mapped,
      photo,
      isJsonSchema: true
    };
  }

  // Case 3: Generic JSON (stringify and send to AI)
  return {
    text: JSON.stringify(parsed, null, 2),
    photo: null,
    isJsonSchema: false
  };
}
