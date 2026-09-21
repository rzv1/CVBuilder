import React, { useState, useCallback } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { Accordion } from '../../ui/accordion';
import { useCv } from '../../../context/index.jsx';

import PersonalDetailsSection from './PersonalDetailsSection.jsx';
import ExperienceSection from './ExperienceSection.jsx';
import EducationSection from './EducationSection.jsx';
import SkillsSection from './SkillsSection.jsx';
import LanguagesSection from './LanguagesSection.jsx';
import AwardsSection from './AwardsSection.jsx';
import CustomSections from './CustomSections.jsx';

export default function SectionsView() {
  const { handleUpdateCvData } = useCv();
  const [activeSection, setActiveSection] = useState('personal');

  // Array reordering helper
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Modern @dnd-kit Drag & Drop End Handler
  const handleDndDragEnd = useCallback((event) => {
    if (event.canceled) return;
    const { source, target } = event.operation;
    if (!source || !target || source.id === target.id) return;

    const sourceData = source.data;
    const targetData = target.data;

    // 1. Custom Sections reordering
    if (sourceData?.customSecIdx !== undefined && sourceData?.customSecIdx !== null) {
      const secIdx = sourceData.customSecIdx;
      if (targetData?.customSecIdx !== secIdx) return; // Disallow cross-section drops

      handleUpdateCvData(prev => {
        const secList = [...(prev?.customSections || [])];
        const items = secList[secIdx]?.items || [];
        const fromIdx = items.findIndex((item, idx) => (item.id || `custom-${secIdx}-${idx}`) === source.id);
        const toIdx = items.findIndex((item, idx) => (item.id || `custom-${secIdx}-${idx}`) === target.id);
        if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return prev;

        secList[secIdx] = {
          ...secList[secIdx],
          items: reorder(items, fromIdx, toIdx)
        };
        return { ...prev, customSections: secList };
      });
      return;
    }

    // 2. Standard sections reordering (experience, education, skills, languages, awards)
    const sectionKey = sourceData?.sectionKey || source.group;
    const targetSectionKey = targetData?.sectionKey || target.group;

    if (!sectionKey || sectionKey !== targetSectionKey) return;

    handleUpdateCvData(prev => {
      const list = prev?.[sectionKey] || [];
      const fromIdx = list.findIndex((item, idx) => (item.id || `${sectionKey}-${idx}`) === source.id);
      const toIdx = list.findIndex((item, idx) => (item.id || `${sectionKey}-${idx}`) === target.id);
      if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return prev;

      return {
        ...prev,
        [sectionKey]: reorder(list, fromIdx, toIdx)
      };
    });
  }, [handleUpdateCvData]);

  return (
    <DragDropProvider onDragEnd={handleDndDragEnd}>
      <Accordion
        multiple={false}
        value={activeSection ? [activeSection] : []}
        onValueChange={(details) => setActiveSection(details.value[0] || null)}
        className="flex flex-col w-full space-y-4"
      >
        <PersonalDetailsSection />
        <ExperienceSection />
        <EducationSection />
        <SkillsSection />
        <LanguagesSection />
        <AwardsSection />
        <CustomSections />
      </Accordion>
    </DragDropProvider>
  );
}
