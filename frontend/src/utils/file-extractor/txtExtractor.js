/**
 * TXT Extractor
 * Reads plain text from .txt files
 */
export async function extractFromTxt(file) {
  const text = await file.text();
  return {
    text: text.trim(),
    photo: null,
    isJsonSchema: false
  };
}
