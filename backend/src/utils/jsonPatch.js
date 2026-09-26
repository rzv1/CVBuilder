/**
 * Robust RFC 6902 JSON Patch application for content.json and style.json.
 * 
 * @param {Object} content - Active CV content object
 * @param {Object} style - Active CV style object
 * @param {Array} patches - Array of RFC 6902 patch operations
 * @returns {Object} { newContent, newStyle }
 */
export function applySmartPatches(content, style, patches) {
  if (!Array.isArray(patches) || patches.length === 0) {
    return { newContent: content, newStyle: style };
  }

  let contentCopy = JSON.parse(JSON.stringify(content || {}));
  let styleCopy = JSON.parse(JSON.stringify(style || {}));

  patches.forEach(p => {
    if (!p.path) return;
    const isStyleTarget = p.target === 'style' || p.path.startsWith('/theme') || p.path.startsWith('/typography') || p.path.startsWith('/layout') || p.path.startsWith('/features');
    const targetObj = isStyleTarget ? styleCopy : contentCopy;

    const parts = p.path.split('/').filter(Boolean);
    if (parts.length === 0) return;

    let curr = targetObj;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];
      if (curr[part] === undefined || curr[part] === null) {
        curr[part] = (nextPart === '-' || !isNaN(nextPart)) ? [] : {};
      }
      curr = curr[part];
    }

    const lastKey = parts[parts.length - 1];
    const op = p.op || 'replace';

    if (op === 'replace' || op === 'add') {
      if (Array.isArray(curr) && lastKey === '-') {
        curr.push(p.value);
      } else if (Array.isArray(curr) && !isNaN(lastKey)) {
        curr[Number(lastKey)] = p.value;
      } else {
        curr[lastKey] = p.value;
      }
    } else if (op === 'remove') {
      if (Array.isArray(curr) && !isNaN(lastKey)) {
        curr.splice(Number(lastKey), 1);
      } else {
        delete curr[lastKey];
      }
    }
  });

  return {
    newContent: contentCopy,
    newStyle: styleCopy
  };
}