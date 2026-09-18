/**
 * Backend CV Payload Integrity Validator
 * Prevents corrupted, null, or malformed data from being saved into Prisma DB.
 */
export function validateCvPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { isValid: false, error: 'Payload-ul este gol sau nu este un obiect JSON valid.' };
  }

  const { content, style, variantContent, patches } = payload;

  // 1. If RFC 6902 patches payload
  if (Array.isArray(patches)) {
    for (let i = 0; i < patches.length; i++) {
      const p = patches[i];
      if (!p || typeof p !== 'object') {
        return { isValid: false, error: `Patch-ul de la indexul ${i} nu este un obiect valid.` };
      }
      if (!p.path || typeof p.path !== 'string') {
        return { isValid: false, error: `Patch-ul de la indexul ${i} nu conține un 'path' valid.` };
      }
    }
  }

  // 2. Validate CV Content structure if full content or variantContent is provided
  const targetContent = content || variantContent;
  if (targetContent) {
    if (typeof targetContent !== 'object') {
      return { isValid: false, error: 'Câmpul content/variantContent trebuie să fie un obiect.' };
    }

    if (targetContent.personal && typeof targetContent.personal !== 'object') {
      return { isValid: false, error: 'Secțiunea personală din CV trebuie să fie un obiect.' };
    }

    const arraySections = ['experience', 'education', 'skills', 'languages', 'awards', 'customSections'];
    for (const key of arraySections) {
      if (targetContent[key] !== undefined && !Array.isArray(targetContent[key])) {
        return { isValid: false, error: `Secțiunea '${key}' trebuie să fie o listă (array).` };
      }
    }
  }

  // 3. Validate CV Style structure if provided
  if (style) {
    if (typeof style !== 'object') {
      return { isValid: false, error: 'Câmpul style trebuie să fie un obiect.' };
    }
  }

  return { isValid: true, error: null };
}
