import React from 'react';
import { useCv, useUI } from '../../context/index.jsx';
import { useContentEditor } from './content-editor/hooks/useContentEditor.jsx';
import DevViewPanel from './content-editor/DevViewPanel.jsx';
import PersonalDetailsSection from './content-editor/PersonalDetailsSection.jsx';
import ExperienceSection from './content-editor/ExperienceSection.jsx';
import EducationSection from './content-editor/EducationSection.jsx';
import SkillsSection from './content-editor/SkillsSection.jsx';
import LanguagesSection from './content-editor/LanguagesSection.jsx';
import AwardsSection from './content-editor/AwardsSection.jsx';
import CustomSections from './content-editor/CustomSections.jsx';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '../ui/empty';
import { Button } from '../ui/button';
import { FileUp, FileText } from 'lucide-react';
import { Accordion } from '../ui/accordion';
import { DragDropProvider } from '@dnd-kit/react';

export default function ContentEditorTab(props) {
  const {
    activeSection,
    setActiveSection,
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
    handleDndDragEnd,
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

  const cvCtx = useCv();
  const uiCtx = useUI();
  const cvData = props.cvData ?? cvCtx.cvData;
  const setCvData = props.setCvData ?? cvCtx.handleUpdateCvData;
  const isDevMode = props.isDevMode ?? uiCtx.isDevMode;
  const onOpenImportModal = props.onOpenImportModal ?? (() => uiCtx.setIsImportModalOpen(true));

  if (!cvData || !cvData.personal) {
    return (
      <Empty className="my-6 border-slate-800 bg-slate-900/60 p-8 shadow-sm">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FileText className="size-6" />
          </EmptyMedia>
          <EmptyTitle className="text-base font-bold text-slate-100">
            Nu s-a putut încărca niciun CV
          </EmptyTitle>
          <EmptyDescription className="text-xs text-slate-400 max-w-md leading-relaxed">
            Nu au fost găsite date de CV în baza de date server. Vă rugăm să importați un fișier CV (PDF, Word, JSON sau TXT) pentru a începe editarea și previzualizarea.
          </EmptyDescription>
        </EmptyHeader>
        {onOpenImportModal && (
          <EmptyContent>
            <Button
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <FileUp className="size-4" />
              Importă un CV Acum
            </Button>
          </EmptyContent>
        )}
      </Empty>
    );
  }

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
    <DragDropProvider onDragEnd={handleDndDragEnd}>
      <Accordion
        multiple={false}
        value={activeSection ? [activeSection] : []}
        onValueChange={(details) => setActiveSection(details.value[0] || null)}
        className="flex flex-col w-full space-y-4"
      >
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
      </Accordion>
    </DragDropProvider>
  );
}
