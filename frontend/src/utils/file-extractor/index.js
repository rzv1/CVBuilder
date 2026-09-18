import { extractFromTxt } from './txtExtractor.js';
import { extractFromJson } from './jsonExtractor.js';
import { extractFromPdf } from './pdfExtractor.js';
import { extractFromWord } from './wordExtractor.js';

export { getPdfJs } from './pdfLoader.js';
export { mapJsonResumeToAppSchema } from './jsonResumeMapper.js';
export { extractFromTxt } from './txtExtractor.js';
export { extractFromJson } from './jsonExtractor.js';
export { extractFromPdf } from './pdfExtractor.js';
export { extractFromWord } from './wordExtractor.js';

/**
 * Main dispatcher to extract plain text and profile photo Data URL from any supported file
 * @param {File} file 
 * @returns {Promise<{ text?: string, photo?: string, cvData?: object, isJsonSchema?: boolean }>}
 */
export async function extractFromFile(file) {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.txt')) {
    return extractFromTxt(file);
  }

  if (fileName.endsWith('.json')) {
    return extractFromJson(file);
  }

  if (fileName.endsWith('.pdf')) {
    return extractFromPdf(file);
  }

  if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return extractFromWord(file);
  }

  throw new Error(`Formatul fișierului '${file.name}' nu este suportat.`);
}
