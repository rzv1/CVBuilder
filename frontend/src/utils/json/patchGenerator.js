/**
 * Generates RFC 6902 JSON Patches between two JSON objects (oldObj -> newObj).
 * Used for ultra lightweight bandwidth synchronization between frontend and backend.
 */
export function generateJsonPatch(oldObj, newObj, prefix = '') {
  const patches = [];

  function diff(oldVal, newVal, currentPath) {
    if (oldVal === newVal) return;

    if (oldVal === undefined || oldVal === null) {
      if (newVal !== undefined && newVal !== null) {
        patches.push({ op: 'add', path: currentPath, value: newVal });
      }
      return;
    }

    if (newVal === undefined || newVal === null) {
      patches.push({ op: 'remove', path: currentPath });
      return;
    }

    const oldType = typeof oldVal;
    const newType = typeof newVal;

    if (oldType !== newType || oldType !== 'object') {
      patches.push({ op: 'replace', path: currentPath, value: newVal });
      return;
    }

    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      const maxLen = Math.max(oldVal.length, newVal.length);
      for (let i = 0; i < maxLen; i++) {
        const itemPath = `${currentPath}/${i}`;
        if (i >= oldVal.length) {
          patches.push({ op: 'add', path: `${currentPath}/-`, value: newVal[i] });
        } else if (i >= newVal.length) {
          patches.push({ op: 'remove', path: itemPath });
        } else {
          diff(oldVal[i], newVal[i], itemPath);
        }
      }
      return;
    }

    const allKeys = new Set([...Object.keys(oldVal), ...Object.keys(newVal)]);
    allKeys.forEach(key => {
      const keyPath = `${currentPath}/${key}`;
      if (!(key in newVal)) {
        patches.push({ op: 'remove', path: keyPath });
      } else if (!(key in oldVal)) {
        patches.push({ op: 'add', path: keyPath, value: newVal[key] });
      } else {
        diff(oldVal[key], newVal[key], keyPath);
      }
    });
  }

  diff(oldObj, newObj, prefix);
  return patches;
}

/**
 * Helper to safely extract value at a JSON pointer path (e.g. "/personal/summary", "/experience/0/bullets/1").
 */
export function getValueByPath(obj, pathStr) {
  if (!obj || !pathStr) return undefined;
  const parts = pathStr.split('/').filter(Boolean);
  let curr = obj;
  for (const p of parts) {
    if (curr === undefined || curr === null) return undefined;
    curr = curr[p];
  }
  return curr;
}
