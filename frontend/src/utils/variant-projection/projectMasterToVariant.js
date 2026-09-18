import { ARRAY_SECTIONS, itemBelongsToVariant } from './variantHelpers.js';

/**
 * Projects Master Content JSON into a clean, filtered RAM state for the active variant.
 * Metadata tags (`variants`) are kept clean so the UI feels like a standalone CV.
 */
export function projectMasterToVariant(masterContent, activeVariantId) {
  if (!masterContent) return {};

  const projected = {
    ...masterContent,
    personal: masterContent.personal ? { ...masterContent.personal } : {}
  };

  // Filter top-level array sections
  ARRAY_SECTIONS.forEach(sectionKey => {
    const items = masterContent[sectionKey] || [];
    projected[sectionKey] = items
      .filter(item => itemBelongsToVariant(item, activeVariantId))
      .map(item => {
        const { variant, variants, ...cleanItem } = item;
        return JSON.parse(JSON.stringify(cleanItem));
      });
  });

  // Filter customSections if present
  if (Array.isArray(masterContent.customSections)) {
    projected.customSections = masterContent.customSections.map(sec => {
      const secItems = sec.items || [];
      const filteredItems = secItems
        .filter(item => itemBelongsToVariant(item, activeVariantId))
        .map(item => {
          const { variant, variants, ...cleanItem } = item;
          return JSON.parse(JSON.stringify(cleanItem));
        });
      const { variant, variants, ...cleanSec } = sec;
      return {
        ...JSON.parse(JSON.stringify(cleanSec)),
        items: filteredItems
      };
    });
  }

  return projected;
}
