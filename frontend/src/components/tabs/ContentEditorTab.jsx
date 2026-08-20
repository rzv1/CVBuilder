import React from 'react';
import { useContentEditor } from './content-editor/hooks/useContentEditor.jsx';
import DevViewPanel from './content-editor/DevViewPanel.jsx';
import PersonalDetailsSection from './content-editor/PersonalDetailsSection.jsx';
import ExperienceSection from './content-editor/ExperienceSection.jsx';
import EducationSection from './content-editor/EducationSection.jsx';
import SkillsSection from './content-editor/SkillsSection.jsx';
import LanguagesSection from './content-editor/LanguagesSection.jsx';
import AwardsSection from './content-editor/AwardsSection.jsx';
import CustomSections from './content-editor/CustomSections.jsx';

export default function ContentEditorTab(props) {
  const {
    activeSection,
    toggleSection,
    activeDevFile,
    setActiveDevFile,
    isSplitView,
    setIsSplitView,
    autoRun,
    setAutoRun,
    isRunning,
    syntaxError,
    setSyntaxError,
    contentYaml,
    styleYaml,
    monacoOptions,
    handleEditorMount,
    handleContentChange,
    handleStyleChange,
    handleBeforeMount,
    handleRunCode,
    draggedItem,
    moveItem,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handlePersonalChange,
    handleExpChange,
    handleBulletChange,
    addBulletPoint,
    removeBulletPoint,
    addExperience,
    deleteExperience,
    handleEducationChange,
    addEducation,
    deleteEducation,
    handleSkillGroupChange,
    handleSkillItemsChange,
    addSkillGroup,
    deleteSkillGroup,
    handleLanguageChange,
    addLanguage,
    deleteLanguage,
    handleAwardChange,
    addAward,
    deleteAward,
    addCustomSection,
    deleteCustomSection,
    addCustomSectionItem,
    deleteCustomSectionItem,
    handleCustomItemChange,
    customSectionsList,
    isMaxCustomSectionsReached
  } = useContentEditor(props);

  const { cvData, setCvData, isDevMode } = props;

  if (isDevMode) {
    return (
      <DevViewPanel
        activeDevFile={activeDevFile}
        setActiveDevFile={setActiveDevFile}
        isSplitView={isSplitView}
        setIsSplitView={setIsSplitView}
        autoRun={autoRun}
        setAutoRun={setAutoRun}
        isRunning={isRunning}
        handleRunCode={handleRunCode}
        contentYaml={contentYaml}
        handleContentChange={handleContentChange}
        styleYaml={styleYaml}
        handleStyleChange={handleStyleChange}
        monacoOptions={monacoOptions}
        handleBeforeMount={handleBeforeMount}
        handleEditorMount={handleEditorMount}
        syntaxError={syntaxError}
        setSyntaxError={setSyntaxError}
      />
    );
  }

  return (
    <div className="flex flex-col w-full space-y-4">
      {/* 1. PERSONAL DETAILS */}
      <PersonalDetailsSection
        activeSection={activeSection}
        toggleSection={toggleSection}
        personalData={cvData.personal}
        handlePersonalChange={handlePersonalChange}
      />

      {/* 2. WORK EXPERIENCE */}
      <ExperienceSection
        activeSection={activeSection}
        toggleSection={toggleSection}
        experienceData={cvData.experience}
        addExperience={addExperience}
        deleteExperience={deleteExperience}
        handleExpChange={handleExpChange}
        handleBulletChange={handleBulletChange}
        addBulletPoint={addBulletPoint}
        removeBulletPoint={removeBulletPoint}
        draggedItem={draggedItem}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        moveItem={moveItem}
      />

      {/* 3. EDUCATION */}
      <EducationSection
        activeSection={activeSection}
        toggleSection={toggleSection}
        educationData={cvData.education}
        addEducation={addEducation}
        deleteEducation={deleteEducation}
        handleEducationChange={handleEducationChange}
        draggedItem={draggedItem}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        moveItem={moveItem}
      />

      {/* 4. SKILLS */}
      <SkillsSection
        activeSection={activeSection}
        toggleSection={toggleSection}
        skillsData={cvData.skills}
        addSkillGroup={addSkillGroup}
        deleteSkillGroup={deleteSkillGroup}
        handleSkillGroupChange={handleSkillGroupChange}
        handleSkillItemsChange={handleSkillItemsChange}
        draggedItem={draggedItem}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        moveItem={moveItem}
      />

      {/* 5. LANGUAGES */}
      <LanguagesSection
        activeSection={activeSection}
        toggleSection={toggleSection}
        languagesData={cvData.languages}
        addLanguage={addLanguage}
        deleteLanguage={deleteLanguage}
        handleLanguageChange={handleLanguageChange}
        draggedItem={draggedItem}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        moveItem={moveItem}
      />

      {/* 6. AWARDS */}
      <AwardsSection
        activeSection={activeSection}
        toggleSection={toggleSection}
        awardsData={cvData.awards}
        addAward={addAward}
        deleteAward={deleteAward}
        handleAwardChange={handleAwardChange}
        draggedItem={draggedItem}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        moveItem={moveItem}
      />

      {/* 7. DYNAMIC CUSTOM SECTIONS (MAX 3) */}
      <CustomSections
        activeSection={activeSection}
        toggleSection={toggleSection}
        customSectionsList={customSectionsList}
        isMaxCustomSectionsReached={isMaxCustomSectionsReached}
        addCustomSection={addCustomSection}
        deleteCustomSection={deleteCustomSection}
        addCustomSectionItem={addCustomSectionItem}
        deleteCustomSectionItem={deleteCustomSectionItem}
        handleCustomItemChange={handleCustomItemChange}
        setCvData={setCvData}
        draggedItem={draggedItem}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        moveItem={moveItem}
      />
    </div>
  );
}
