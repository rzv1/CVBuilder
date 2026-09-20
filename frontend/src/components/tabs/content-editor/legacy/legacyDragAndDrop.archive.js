/**
 * ARCHIVE: Legacy HTML5 Drag & Drop Implementation
 * 
 * This file archives the previous native HTML5 Drag and Drop logic used in the
 * Content Editor sections (Experience, Education, Skills, Languages, Awards, Custom Sections).
 * Preserved as reference / archive as requested.
 * 
 * Previous mechanism used:
 * - HTML Drag and Drop API (draggable={true}, onDragStart, onDragOver, onDrop)
 * - dataTransfer API with JSON serialized payload { sectionKey, index, customSecIdx }
 * - draggedItem state tracking the active drag source
 */

import { useState } from 'react';

/**
 * Array reordering helper function
 * Splices item from startIndex and inserts at endIndex
 */
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

/**
 * Legacy hook representing the previous native HTML5 Drag & Drop handlers
 */
export function useLegacyDragAndDrop({ setCvData }) {
  const [draggedItem, setDraggedItem] = useState(null);

  const moveItem = (sectionKey, index, direction, customSecIdx = null) => {
    const targetIdx = index + direction;
    if (customSecIdx !== null) {
      setCvData(prev => {
        const secList = [...(prev.customSections || [])];
        const items = secList[customSecIdx].items || [];
        if (targetIdx < 0 || targetIdx >= items.length) return prev;
        secList[customSecIdx].items = reorder(items, index, targetIdx);
        return { ...prev, customSections: secList };
      });
    } else {
      setCvData(prev => {
        const list = prev[sectionKey] || [];
        if (targetIdx < 0 || targetIdx >= list.length) return prev;
        return { ...prev, [sectionKey]: reorder(list, index, targetIdx) };
      });
    }
  };

  const handleDragStart = (e, sectionKey, index, customSecIdx = null) => {
    setDraggedItem({ sectionKey, index, customSecIdx });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ sectionKey, index, customSecIdx }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetSectionKey, targetIndex, targetCustomSecIdx = null) => {
    e.preventDefault();
    if (!draggedItem) return;

    if (draggedItem.sectionKey === targetSectionKey && draggedItem.customSecIdx === targetCustomSecIdx) {
      const fromIdx = draggedItem.index;
      if (fromIdx !== targetIndex) {
        if (targetCustomSecIdx !== null) {
          setCvData(prev => {
            const secList = [...(prev.customSections || [])];
            const items = secList[targetCustomSecIdx].items || [];
            secList[targetCustomSecIdx].items = reorder(items, fromIdx, targetIndex);
            return { ...prev, customSections: secList };
          });
        } else {
          setCvData(prev => {
            const list = prev[targetSectionKey] || [];
            return { ...prev, [targetSectionKey]: reorder(list, fromIdx, targetIndex) };
          });
        }
      }
    }
    setDraggedItem(null);
  };

  return {
    draggedItem,
    setDraggedItem,
    moveItem,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
}

/**
 * Example JSX from legacy implementation:
 * 
 * <div
 *   key={exp.id}
 *   className={`item-card ${draggedItem?.sectionKey === 'experience' && draggedItem?.index === expIdx ? 'is-dragging' : ''}`}
 *   draggable={true}
 *   onDragStart={(e) => handleDragStart(e, 'experience', expIdx)}
 *   onDragOver={handleDragOver}
 *   onDrop={(e) => handleDrop(e, 'experience', expIdx)}
 * >
 *   <span className="cursor-grab" title="Drag to reorder">
 *     <GripVertical className="size-4" />
 *   </span>
 *   ...
 * </div>
 */
