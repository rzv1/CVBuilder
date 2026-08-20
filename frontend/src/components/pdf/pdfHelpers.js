export const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80";

export const isItemInVariant = (item, activeVariant) => {
  if (!activeVariant || activeVariant === 'all') return true;
  if (!item.variant && (!item.variants || item.variants.length === 0)) return true;
  const vars = item.variants || (item.variant ? [item.variant] : ['all']);
  return vars.includes('all') || vars.includes(activeVariant);
};
