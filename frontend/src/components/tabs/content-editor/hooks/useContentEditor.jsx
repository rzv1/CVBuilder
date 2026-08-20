import { useState, useRef, useEffect, useCallback } from 'react';
import YAML from 'yaml';

export function useContentEditor({ cvData, setCvData, styleData, setStyleData, isDevMode }) {
  // Accordion state: default open section is 'personal'
  const [activeSection, setActiveSection] = useState('personal');

  // Dev View State
  const [activeDevFile, setActiveDevFile] = useState('content'); // 'content' | 'style'
  const [isSplitView, setIsSplitView] = useState(false);
  const [autoRun, setAutoRun] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [syntaxError, setSyntaxError] = useState(null);

  // Ref to prevent circular updates when typing directly in Monaco
  const isSelfEditingRef = useRef(false);

  // Dynamic YAML content synced with RAM state
  const [contentYaml, setContentYaml] = useState(() => {
    try {
      return cvData ? YAML.stringify(cvData) : '';
    } catch {
      return '';
    }
  });

  const [styleYaml, setStyleYaml] = useState(() => {
    try {
      return styleData ? YAML.stringify(styleData) : '';
    } catch {
      return '';
    }
  });

  // Sync external RAM state (cvData) -> YAML editor when cvData changes
  useEffect(() => {
    if (isSelfEditingRef.current) return;
    if (!cvData) return;
    try {
      setContentYaml(YAML.stringify(cvData));
    } catch (e) {
      console.error("Error stringifying cvData to YAML:", e);
    }
  }, [cvData]);

  // Sync external RAM state (styleData) -> YAML editor when styleData changes
  useEffect(() => {
    if (isSelfEditingRef.current) return;
    if (!styleData) return;
    try {
      setStyleYaml(YAML.stringify(styleData));
    } catch (e) {
      console.error("Error stringifying styleData to YAML:", e);
    }
  }, [styleData]);

  const debounceTimerRef = useRef(null);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Monaco Ultra-Minimalist Configuration with Quick Suggestions disabled for strings
  const monacoOptions = {
    automaticLayout: true,
    colorDecorators: true,
    quickSuggestions: {
      other: true,
      comments: false,
      strings: true
    },
    completion: true,
    suggestOnTriggerCharacters: true,
    suggest: {
      showWords: false
    },
    wordWrap: true,
    formatOnType: true,
    minimap: { enabled: false },
    glyphMargin: true,
    folding: true,
    lineNumbers: 'off',
    lineDecorationsWidth: 8,
    lineNumbersMinChars: 3,
    renderLineHighlight: 'all',
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
      useShadows: false,
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8
    },
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', monospace",
    fontSize: 13.5,
    lineHeight: 20,
    padding: { top: 12, bottom: 24 },
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    cursorSmoothCaretAnimation: 'on',
    mouseWheelZoom: true,
    scrollBeyondLastLine: false,
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    tabSize: 2
  };

  // Sync monaco-yaml error markers with React syntaxError state
  const checkMarkers = (editor, monaco) => {
    if (!editor || !monaco) return;
    const model = editor.getModel();
    if (!model) return;

    const markers = monaco.editor.getModelMarkers({ resource: model.uri });
    const errorMarker = markers.find(m => m.severity === monaco.MarkerSeverity.Error);

    if (errorMarker) {
      setSyntaxError({
        line: errorMarker.startLineNumber,
        column: errorMarker.startColumn,
        message: errorMarker.message
      });
    } else {
      setSyntaxError(null);
    }
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    const disposable = monaco.editor.onDidChangeMarkers(() => {
      checkMarkers(editor, monaco);
    });

    setTimeout(() => {
      checkMarkers(editor, monaco);
    }, 200);

    return () => {
      disposable.dispose();
    };
  };

  // Parse and sync YAML -> JSON RAM state
  const syncYamlToContentState = (yamlText) => {
    if (!yamlText) return;
    try {
      const parsed = YAML.parse(yamlText);
      if (parsed && typeof parsed === 'object') {
        isSelfEditingRef.current = true;
        setCvData(parsed);
        setSyntaxError(null);
        setTimeout(() => {
          isSelfEditingRef.current = false;
        }, 100);
      }
    } catch (err) {
      setSyntaxError({
        line: err.linePos?.[0]?.line || 1,
        column: err.linePos?.[0]?.col || 1,
        message: err.message || 'Eroare de sintaxă YAML'
      });
    }
  };

  const syncYamlToStyleState = (yamlText) => {
    if (!yamlText || !setStyleData) return;
    try {
      const parsed = YAML.parse(yamlText);
      if (parsed && typeof parsed === 'object') {
        isSelfEditingRef.current = true;
        setStyleData(parsed);
        setSyntaxError(null);
        setTimeout(() => {
          isSelfEditingRef.current = false;
        }, 100);
      }
    } catch (err) {
      setSyntaxError({
        line: err.linePos?.[0]?.line || 1,
        column: err.linePos?.[0]?.col || 1,
        message: err.message || 'Eroare de sintaxă YAML'
      });
    }
  };

  const handleRunCode = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setIsRunning(true);
    if (activeDevFile === 'content') {
      syncYamlToContentState(contentYaml);
    } else if (activeDevFile === 'style') {
      syncYamlToStyleState(styleYaml);
    }
    setTimeout(() => {
      setIsRunning(false);
      if (editorRef.current && monacoRef.current) {
        checkMarkers(editorRef.current, monacoRef.current);
      }
    }, 350);
  };

  const handleContentChange = (value) => {
    const newYaml = value || '';
    setContentYaml(newYaml);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (autoRun) {
      debounceTimerRef.current = setTimeout(() => {
        syncYamlToContentState(newYaml);
        if (editorRef.current && monacoRef.current) {
          checkMarkers(editorRef.current, monacoRef.current);
        }
      }, 500);
    }
  };

  const handleStyleChange = (value) => {
    const newYaml = value || '';
    setStyleYaml(newYaml);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (autoRun) {
      debounceTimerRef.current = setTimeout(() => {
        syncYamlToStyleState(newYaml);
        if (editorRef.current && monacoRef.current) {
          checkMarkers(editorRef.current, monacoRef.current);
        }
      }, 500);
    }
  };

  const handleBeforeMount = () => {};

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Drag & drop state for reordering items within sections
  const [draggedItem, setDraggedItem] = useState(null);

  const toggleSection = useCallback((sectionKey) => {
    setActiveSection(prev => prev === sectionKey ? null : sectionKey);
  }, []);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

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

  // Handlers for Personal Details
  const handlePersonalChange = (field, value) => {
    setCvData(prev => ({
      ...prev,
      personal: { ...prev.personal, [field]: value }
    }));
  };

  // Handlers for Work Experience
  const handleExpChange = (idx, field, value) => {
    setCvData(prev => {
      const newExp = [...prev.experience];
      newExp[idx] = { ...newExp[idx], [field]: value };
      return { ...prev, experience: newExp };
    });
  };

  const handleBulletChange = (expIdx, bulletIdx, value) => {
    setCvData(prev => {
      const newExp = [...prev.experience];
      const newBullets = [...newExp[expIdx].bullets];
      newBullets[bulletIdx] = value;
      newExp[expIdx] = { ...newExp[expIdx], bullets: newBullets };
      return { ...prev, experience: newExp };
    });
  };

  const addBulletPoint = (expIdx) => {
    setCvData(prev => {
      const newExp = [...prev.experience];
      newExp[expIdx].bullets.push("Accomplished [X] as measured by [Y], by doing [Z]");
      return { ...prev, experience: newExp };
    });
  };

  const removeBulletPoint = (expIdx, bulletIdx) => {
    setCvData(prev => {
      const newExp = [...prev.experience];
      newExp[expIdx].bullets = newExp[expIdx].bullets.filter((_, i) => i !== bulletIdx);
      return { ...prev, experience: newExp };
    });
  };

  const addExperience = () => {
    const newEntry = {
      id: `exp-${Date.now()}`,
      role: "Software Developer",
      company: "Company Name",
      location: "Remote",
      start: "2023",
      end: "Present",
      variant: "all",
      description: "Brief summary of role responsibilities.",
      bullets: ["Accelerated load times by 40% through code splitting and asset optimization."],
      skills: ["React", "JavaScript"]
    };
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, newEntry]
    }));
  };

  const deleteExperience = (idx) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx)
    }));
  };

  // Handlers for Education
  const handleEducationChange = (idx, field, value) => {
    setCvData(prev => {
      const list = [...(prev.education || [])];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, education: list };
    });
  };

  const addEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      degree: "B.Sc. Computer Science",
      institution: "University Name",
      location: "City, Country",
      start: "2019",
      end: "2023",
      description: "Graduated with Honors."
    };
    setCvData(prev => ({
      ...prev,
      education: [...(prev.education || []), newEdu]
    }));
  };

  const deleteEducation = (idx) => {
    setCvData(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== idx)
    }));
  };

  // Handlers for Skills
  const handleSkillGroupChange = (idx, field, value) => {
    setCvData(prev => {
      const list = [...(prev.skills || [])];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, skills: list };
    });
  };

  const handleSkillItemsChange = (idx, textValue) => {
    const itemsArray = textValue.split(',').map(s => s.trim()).filter(Boolean);
    setCvData(prev => {
      const list = [...(prev.skills || [])];
      list[idx] = { ...list[idx], items: itemsArray, rawInput: textValue };
      return { ...prev, skills: list };
    });
  };

  const addSkillGroup = () => {
    const newSkill = {
      id: `sk-${Date.now()}`,
      category: "Technical Skills",
      items: ["JavaScript", "React", "Node.js"]
    };
    setCvData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), newSkill]
    }));
  };

  const deleteSkillGroup = (idx) => {
    setCvData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== idx)
    }));
  };

  // Handlers for Languages
  const handleLanguageChange = (idx, field, value) => {
    setCvData(prev => {
      const list = [...(prev.languages || [])];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, languages: list };
    });
  };

  const addLanguage = () => {
    const newLang = {
      id: `lang-${Date.now()}`,
      name: "Spanish",
      level: "Professional Working"
    };
    setCvData(prev => ({
      ...prev,
      languages: [...(prev.languages || []), newLang]
    }));
  };

  const deleteLanguage = (idx) => {
    setCvData(prev => ({
      ...prev,
      languages: (prev.languages || []).filter((_, i) => i !== idx)
    }));
  };

  // Handlers for Awards
  const handleAwardChange = (idx, field, value) => {
    setCvData(prev => {
      const list = [...(prev.awards || [])];
      list[idx] = { ...list[idx], [field]: value };
      return { ...prev, awards: list };
    });
  };

  const addAward = () => {
    const newAward = {
      id: `aw-${Date.now()}`,
      title: "Excellence in Engineering",
      issuer: "Organization / Event",
      date: "2024",
      description: "Awarded for exceptional contribution to core platform services."
    };
    setCvData(prev => ({
      ...prev,
      awards: [...(prev.awards || []), newAward]
    }));
  };

  const deleteAward = (idx) => {
    setCvData(prev => ({
      ...prev,
      awards: (prev.awards || []).filter((_, i) => i !== idx)
    }));
  };

  // Handlers for Custom Sections (Max 3)
  const addCustomSection = () => {
    const currentCustomSecs = cvData.customSections || [];
    if (currentCustomSecs.length >= 3) return;

    const newSecNumber = currentCustomSecs.length + 1;
    const newSec = {
      id: `custom-sec-${Date.now()}`,
      title: `Custom Section ${newSecNumber} (e.g. Projects / Publications)`,
      items: [
        {
          id: `csi-${Date.now()}`,
          heading: "Project Name / Achievement",
          subheading: "Role / Category",
          start: "2024",
          end: "Present",
          detail: "Key highlights and accomplishments."
        }
      ]
    };
    setCvData(prev => ({
      ...prev,
      customSections: [...(prev.customSections || []), newSec]
    }));
    setActiveSection(`custom-${newSec.id}`);
  };

  const deleteCustomSection = (secIdx) => {
    setCvData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).filter((_, i) => i !== secIdx)
    }));
  };

  const addCustomSectionItem = (secIdx) => {
    const newItem = {
      id: `csi-${Date.now()}`,
      heading: "New Entry Title",
      subheading: "Role / Subtitle",
      start: "2024",
      end: "Present",
      detail: "Description and achievements."
    };
    setCvData(prev => {
      const secList = [...(prev.customSections || [])];
      secList[secIdx].items.push(newItem);
      return { ...prev, customSections: secList };
    });
  };

  const deleteCustomSectionItem = (secIdx, itemIdx) => {
    setCvData(prev => {
      const secList = [...(prev.customSections || [])];
      secList[secIdx].items = secList[secIdx].items.filter((_, i) => i !== itemIdx);
      return { ...prev, customSections: secList };
    });
  };

  const handleCustomItemChange = (secIdx, itemIdx, field, value) => {
    setCvData(prev => {
      const secList = [...(prev.customSections || [])];
      secList[secIdx].items[itemIdx] = {
        ...secList[secIdx].items[itemIdx],
        [field]: value
      };
      return { ...prev, customSections: secList };
    });
  };

  const customSectionsList = cvData.customSections || [];
  const isMaxCustomSectionsReached = customSectionsList.length >= 3;

  return {
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
  };
}
