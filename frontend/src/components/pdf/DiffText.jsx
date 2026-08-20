import React from 'react';
import { Text } from '@react-pdf/renderer';

export const defaultDiffStyles = {
  diffBoxBefore: { backgroundColor: '#fef2f2', borderColor: '#ef4444', borderWidth: 0.8, borderRadius: 3, paddingHorizontal: 3, paddingVertical: 1 },
  diffBoxAfter: { backgroundColor: '#f0fdf4', borderColor: '#22c55e', borderWidth: 0.8, borderRadius: 3, paddingHorizontal: 3, paddingVertical: 1 },
  diffTextBefore: { color: '#991b1b' },
  diffTextAfter: { color: '#166534' }
};

/**
 * Reusable wrapper component for @react-pdf/renderer Text boxes.
 * Checks the node's `_diff` attribute to determine whether a modification occurred.
 * Automatically displays the diffBoxBefore or diffBoxAfter highlight when modified,
 * or renders normal Text when unchanged.
 */
export default function DiffText({
  diff,
  proposalViewMode = 'after',
  style,
  customStyles,
  children,
  ...props
}) {
  const isModified = Boolean(diff?.isModified);

  if (!isModified) {
    return <Text style={style} {...props}>{children}</Text>;
  }

  if (diff?.op === 'add' && proposalViewMode === 'before') {
    return null;
  }
  if (diff?.op === 'remove' && proposalViewMode === 'after') {
    return null;
  }

  const displayText = proposalViewMode === 'before'
    ? (diff?.before !== null && diff?.before !== undefined ? diff.before : children)
    : (diff?.after !== null && diff?.after !== undefined ? diff.after : children);

  if (displayText === null || displayText === undefined) return null;

  const currentDiffStyles = customStyles || defaultDiffStyles;
  const diffBoxStyle = proposalViewMode === 'before' ? (currentDiffStyles.diffBoxBefore || defaultDiffStyles.diffBoxBefore) : (currentDiffStyles.diffBoxAfter || defaultDiffStyles.diffBoxAfter);
  const diffTextStyle = proposalViewMode === 'before' ? (currentDiffStyles.diffTextBefore || defaultDiffStyles.diffTextBefore) : (currentDiffStyles.diffTextAfter || defaultDiffStyles.diffTextAfter);

  return (
    <Text style={[style, diffTextStyle, diffBoxStyle]} {...props}>
      {displayText}
    </Text>
  );
}
