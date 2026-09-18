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
    const variantItemMap = new Map(variantItems.map(item => [item.id, item]));

    const reconciledMaster = [];

    // Process existing Master items
    masterItems.forEach(mItem => {
      const belongs = itemBelongsToVariant(mItem, activeVariantId);

      if (belongs) {
        if (variantItemMap.has(mItem.id)) {
          // Item updated in active variant UI
          const vItem = variantItemMap.get(mItem.id);
          const currentVariants = getItemVariants(mItem);

          reconciledMaster.push({
            ...vItem,
            variants: currentVariants
          });
          variantItemMap.delete(mItem.id);
        } else {
          // Item deleted from active variant UI
          if (activeVariantId === 'all') {
            // Deleted globally
            return;
          }
          let currentVariants = getItemVariants(mItem);
          currentVariants = currentVariants.filter(v => v !== activeVariantId && v !== 'all');
          if (currentVariants.length > 0) {
            reconciledMaster.push({
              ...mItem,
              variants: currentVariants
            });
          }
        }
      } else {
        // Belongs to other variants -> preserve untouched
        reconciledMaster.push(mItem);
      }
    });

    // Add newly created items from active variant UI
    variantItemMap.forEach((vItem, vId) => {
      const newId = vId || `${sectionKey.slice(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      reconciledMaster.push({
        ...vItem,
        id: newId,
        variants: activeVariantId === 'all' ? ['all'] : [activeVariantId]
      });
    });

    updatedMaster[sectionKey] = reconciledMaster;
  });

  // 3. Reconcile customSections if present
  if (Array.isArray(variantContent.customSections)) {
    const masterCustomSections = updatedMaster.customSections || [];
    const variantCustomMap = new Map(variantContent.customSections.map(sec => [sec.id, sec]));

    updatedMaster.customSections = masterCustomSections.map(mSec => {
      if (!variantCustomMap.has(mSec.id)) return mSec;

      const vSec = variantCustomMap.get(mSec.id);
      const masterItems = mSec.items || [];
      const variantItems = vSec.items || [];
      const variantItemMap = new Map(variantItems.map(item => [item.id, item]));

      const reconciledItems = [];

      masterItems.forEach(mItem => {
        const belongs = itemBelongsToVariant(mItem, activeVariantId);
        if (belongs) {
          if (variantItemMap.has(mItem.id)) {
            const vItem = variantItemMap.get(mItem.id);
            const currentVariants = getItemVariants(mItem);
            reconciledItems.push({
              ...vItem,
              variants: currentVariants
            });
            variantItemMap.delete(mItem.id);
          } else {
            if (activeVariantId === 'all') return;
            let currentVariants = getItemVariants(mItem).filter(v => v !== activeVariantId && v !== 'all');
            if (currentVariants.length > 0) {
              reconciledItems.push({
                ...mItem,
                variants: currentVariants
              });
            }
          }
        } else {
          reconciledItems.push(mItem);
        }
      });

      variantItemMap.forEach((vItem, vId) => {
        const newId = vId || `csi-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        reconciledItems.push({
          ...vItem,
          id: newId,
          variants: activeVariantId === 'all' ? ['all'] : [activeVariantId]
        });
      });

      variantCustomMap.delete(mSec.id);
      return {
        ...vSec,
        items: reconciledItems
      };
    });

    // Brand new custom sections created in active variant
    variantCustomMap.forEach(vSec => {
      const newSecId = vSec.id || `sec-${Date.now()}`;
      const processedItems = (vSec.items || []).map(item => ({
        ...item,
        id: item.id || `csi-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        variants: activeVariantId === 'all' ? ['all'] : [activeVariantId]
      }));
      updatedMaster.customSections.push({
        ...vSec,
        id: newSecId,
        items: processedItems
      });
    });
  }

  return updatedMaster;
}
