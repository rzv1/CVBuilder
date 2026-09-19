/**
 * Client-Side CV Payload Integrity Validator
 * Ensures client does not send corrupted or malformed data to backend API.
 */
export function validateClientCvData(cvData) {
  if (!cvData || typeof cvData !== 'object') {
    return { isValid: false, error: 'CV object invalid.' };
  }

  if (cvData.personal && typeof cvData.personal !== 'object') {
    return { isValid: false, error: 'Personal section invalid.' };
  }

  const arrayFields = ['experience', 'education', 'skills', 'languages', 'awards', 'customSections'];
  for (const field of arrayFields) {
    if (cvData[field] !== undefined && !Array.isArray(cvData[field])) {
      return { isValid: false, error: `Field '${field}' invalid.` };
    }
  }

  return { isValid: true, error: null };
}
