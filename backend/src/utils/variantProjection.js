import { ARRAY_SECTIONS, getItemVariants, itemBelongsToVariant } from './variantHelpers.js';

/**
 * Reconciles edits made in RAM on the active variant back into the Master Content structure.
 * Items belonging to other variants are preserved untouched on disk.
 */
export function mergeVariantToMaster(masterContent, variantContent, activeVariantId) {
  if (!masterContent) return variantContent;

  const updatedMaster = JSON.parse(JSON.stringify(masterContent));

  // 1. Personal section is universal / global across variants
  if (variantContent.personal) {
    updatedMaster.personal = { ...variantContent.personal };
  }

  // 2. Reconcile standard array sections
  ARRAY_SECTIONS.forEach(sectionKey => {
    const masterItems = updatedMaster[sectionKey] || [];
    const variantItems = variantContent[sectionKey] || [];
    const masterItemMap = new Map(masterItems.map(item => [item.id, item]));

    const reconciledMaster = [];
    const processedMasterIds = new Set();

    // 1. Emit items in the exact order of the active variant UI
    variantItems.forEach((vItem, idx) => {
      const vId = vItem.id || `${sectionKey.slice(0, 3)}-${Date.now()}-${idx}`;
      const mItem = masterItemMap.get(vId);
      const currentVariants = mItem ? getItemVariants(mItem) : (activeVariantId === 'all' ? ['all'] : [activeVariantId]);

      reconciledMaster.push({
        ...vItem,
        id: vId,
        variants: currentVariants
      });
      processedMasterIds.add(vId);
    });

    // 2. Preserve master items belonging to other variants or handle variant-scoped deletion
    masterItems.forEach(mItem => {
      if (processedMasterIds.has(mItem.id)) return;

      const belongs = itemBelongsToVariant(mItem, activeVariantId);
      if (belongs) {
        // Item was deleted in active variant UI
        if (activeVariantId === 'all') {
          // Deleted globally
          return;
        }
        let currentVariants = getItemVariants(mItem).filter(v => v !== activeVariantId && v !== 'all');
        if (currentVariants.length > 0) {
          reconciledMaster.push({
            ...mItem,
            variants: currentVariants
          });
        }
      } else {
        // Belongs to other variants -> preserve untouched
        reconciledMaster.push(mItem);
      }
    });

    updatedMaster[sectionKey] = reconciledMaster;
  });

  // 3. Reconcile customSections if present
  if (Array.isArray(variantContent.customSections)) {
    const masterCustomSections = updatedMaster.customSections || [];
    const variantCustomMap = new Map(variantContent.customSections.map(sec => [sec.id, sec]));

    updatedMaster.customSections = variantContent.customSections.map((vSec, secIdx) => {
      const vSecId = vSec.id || `sec-${Date.now()}-${secIdx}`;
      const mSec = masterCustomSections.find(s => s.id === vSecId);
      const masterItems = mSec?.items || [];
      const masterItemMap = new Map(masterItems.map(item => [item.id, item]));
      const variantItems = vSec.items || [];

      const reconciledItems = [];
      const processedItemIds = new Set();

      // Emit items in exact order of active variant
      variantItems.forEach((vItem, itemIdx) => {
        const vItemId = vItem.id || `csi-${Date.now()}-${itemIdx}`;
        const mItem = masterItemMap.get(vItemId);
        const currentVariants = mItem ? getItemVariants(mItem) : (activeVariantId === 'all' ? ['all'] : [activeVariantId]);

        reconciledItems.push({
          ...vItem,
          id: vItemId,
          variants: currentVariants
        });
        processedItemIds.add(vItemId);
      });

      // Preserve items from other variants
      masterItems.forEach(mItem => {
        if (processedItemIds.has(mItem.id)) return;
        const belongs = itemBelongsToVariant(mItem, activeVariantId);
        if (belongs) {
          if (activeVariantId === 'all') return;
          let currentVariants = getItemVariants(mItem).filter(v => v !== activeVariantId && v !== 'all');
          if (currentVariants.length > 0) {
            reconciledItems.push({
              ...mItem,
              variants: currentVariants
            });
          }
        } else {
          reconciledItems.push(mItem);
        }
      });

      return {
        ...vSec,
        id: vSecId,
        items: reconciledItems
      };
    });
  }

  return updatedMaster;
}

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
