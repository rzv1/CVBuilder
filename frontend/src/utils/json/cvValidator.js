/**
 * Client-Side CV Payload Integrity Validator
 * Ensures client does not send corrupted or malformed data to backend API.
 */
export function validateClientCvData(cvData) {
  if (!cvData || typeof cvData !== 'object') {
    return { isValid: false, error: 'Obiectul CV nu este valid.' };
  }

  if (cvData.personal && typeof cvData.personal !== 'object') {
    return { isValid: false, error: 'Secțiunea personală este malformată.' };
  }

  const arrayFields = ['experience', 'education', 'skills', 'languages', 'awards', 'customSections'];
  for (const field of arrayFields) {
    if (cvData[field] !== undefined && !Array.isArray(cvData[field])) {
      return { isValid: false, error: `Câmpul '${field}' trebuie să fie o listă.` };
    }
  }

  return { isValid: true, error: null };
}
