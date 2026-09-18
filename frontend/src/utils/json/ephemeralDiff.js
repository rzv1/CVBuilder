import { generateJsonPatch, getValueByPath } from './patchGenerator.js';

/**
 * Constructs an ephemeral JSON representation of the CV content decorated with `_diff` attributes.
 * The `_diff` attribute on objects and fields pinpoints exact locations of AI modifications,
 * specifying `isModified`, `before`, `after`, `op`, and `path`.
 * 
 * @param {Object} beforeContent - CV content before AI changes
 * @param {Object} afterContent - CV content after AI changes
 * @param {Array} [patches] - Optional array of RFC 6902 JSON patches
 * @returns {Object} Ephemeral CV content with `_diff` attributes embedded
 */
export function createEphemeralJsonWithDiff(beforeContent, afterContent, patches) {
  if (!afterContent) return afterContent;

  const safePatches = (Array.isArray(patches) && patches.length > 0)
    ? patches
    : generateJsonPatch(beforeContent || {}, afterContent);

  const ephemeral = JSON.parse(JSON.stringify(afterContent));

  // Attach top-level _diff metadata
  ephemeral._diff = {
    isEphemeral: true,
    timestamp: new Date().toISOString(),
    patchCount: safePatches.length,
    patches: safePatches
  };

  safePatches.forEach(p => {
    if (!p.path) return;
    const parts = p.path.split('/').filter(Boolean);
    if (parts.length === 0) return;

    const beforeVal = getValueByPath(beforeContent, p.path);
    const afterVal = getValueByPath(afterContent, p.path) ?? p.value;
    const diffInfo = {
      isModified: true,
      op: p.op || 'replace',
      path: p.path,
      before: beforeVal !== undefined ? beforeVal : null,
      after: afterVal !== undefined ? afterVal : null
    };

    const section = parts[0];

    if (section === 'personal') {
      if (!ephemeral.personal) ephemeral.personal = {};
      if (!ephemeral.personal._diff) ephemeral.personal._diff = {};
      const field = parts[1] || 'summary';
      ephemeral.personal._diff[field] = diffInfo;
    } else if (section === 'experience' && !isNaN(parts[1])) {
      const expIndex = Number(parts[1]);
      if (ephemeral.experience && ephemeral.experience[expIndex]) {
        const expItem = ephemeral.experience[expIndex];
        if (!expItem._diff) expItem._diff = {};

        if (parts[2] === 'bullets' && !isNaN(parts[3])) {
          const bulletIndex = Number(parts[3]);
          if (!expItem._diff.bullets) expItem._diff.bullets = {};
          expItem._diff.bullets[bulletIndex] = diffInfo;
        } else if (parts[2]) {
          const field = parts[2];
          expItem._diff[field] = diffInfo;
        } else {
          expItem._diff.item = diffInfo;
        }
      }
    } else if (section === 'skills' && !isNaN(parts[1])) {
      const sIndex = Number(parts[1]);
      if (ephemeral.skills && ephemeral.skills[sIndex]) {
        const skillGroup = ephemeral.skills[sIndex];
        if (!skillGroup._diff) skillGroup._diff = {};
        if (parts[2] === 'items' && !isNaN(parts[3])) {
          const itemIdx = Number(parts[3]);
          if (!skillGroup._diff.items) skillGroup._diff.items = {};
          skillGroup._diff.items[itemIdx] = diffInfo;
        } else if (parts[2]) {
          skillGroup._diff[parts[2]] = diffInfo;
        } else {
          skillGroup._diff.group = diffInfo;
        }
      }
    } else if (['education', 'languages', 'awards', 'customSections'].includes(section) && !isNaN(parts[1])) {
      const idx = Number(parts[1]);
      if (ephemeral[section] && ephemeral[section][idx]) {
        const item = ephemeral[section][idx];
        if (!item._diff) item._diff = {};
        if (parts[2]) {
          item._diff[parts[2]] = diffInfo;
        } else {
          item._diff.item = diffInfo;
        }
      }
    }
  });

  return ephemeral;
}
