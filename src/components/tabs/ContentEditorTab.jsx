import React, { useState, useRef, useEffect } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
//import { configureMonacoYaml } from "monaco-yaml";
//import mySchema from '../../../schema.json';
import EditorWorker from '../../editor.worker?worker';
import YamlWorker from '../../yaml.worker?worker';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'yaml') {
      return new YamlWorker();
    }
    return new EditorWorker();
  }
};

// Configure Monaco YAML support globally on the monaco instance
// configureMonacoYaml(monaco, {
//   enableSchemaRequest: false,
//   validate: true,
//   format: true,
//   hover: true,
//   completion: true,
//   schemas: [
//     {
//       uri: 'https://raw.githubusercontent.com/cvbuilder-ai/cvbuilder-ai-studio/main/src/schemas/content.yaml',
//       fileMatch: ['*'],
//       schema: mySchema
//     }
//   ]
// });

// Use local bundled Monaco instance rather than downloading from CDN
loader.config({ monaco });

import {
  User,
  Briefcase,
  GraduationCap,
  Globe2,
  Award,
  Wrench,
  Plus,
  Trash2,
  GripVertical,
  Tag,
  FolderPlus,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Columns,
  Play,
  FileText,
  Sliders,
  CheckCircle2
} from '../Icons';

export default function ContentEditorTab({ cvData, setCvData, isDevMode }) {
  // Accordion state: default open section is 'personal'
  const [activeSection, setActiveSection] = useState('personal');

  // Dev View State
  const [activeDevFile, setActiveDevFile] = useState('content'); // 'content' | 'style'
  const [isSplitView, setIsSplitView] = useState(false);
  const [autoRun, setAutoRun] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [syntaxError, setSyntaxError] = useState(null);

  // Pre-populated clean YAML sample data
  const [contentYaml, setContentYaml] = useState(`# ==========================================
# CVBuilder AI Studio - Content Schema (YAML)
# ==========================================
personal:
  name: "Alexandru Popescu"
  title: "Senior Full-Stack Engineer & Cloud Architect"
  email: "alexandru.popescu@devstudio.io"
  phone: "+40 722 123 456"
  location: "Bucharest, Romania"
  github: "github.com/alexpopescu"
  linkedin: "linkedin.com/in/alexpopescu"
  summary: >
    Passionate Full-Stack Engineer with 8+ years of expertise crafting high-throughput 
    distributed microservices and high-performance React user interfaces. Specialized in 
    Node.js, TypeScript, Go, Docker, Kubernetes, and reactive frontend architectures.

experience:
  - id: "exp-1"
    role: "Lead Full Stack Architect"
    company: "TechScale Global"
    location: "Bucharest / Remote"
    period: "2022 - Present"
    variants: ["all", "frontend", "backend"]
    bullets:
      - "Architected real-time event streaming engine handling 1.2M events/min using Kafka & Node.js"
      - "Reduced Web Vitals LCP by 45% across core customer portals using React SSR and Next.js"
      - "Mentored 14 cross-functional engineers and led migration to micro-frontend architecture"

  - id: "exp-2"
    role: "Senior Frontend Developer"
    company: "CloudNative Labs"
    location: "Cluj-Napoca, Romania"
    period: "2019 - 2022"
    variants: ["all", "frontend"]
    bullets:
      - "Built modern design system used by 4 enterprise products with 100% WCAG AA compliance"
      - "Optimized WebGL graph visualization engine rendering 50,000 nodes at 60 FPS"

skills:
  frontend: ["React.js", "TypeScript", "Next.js", "TailwindCSS", "Redux Toolkit", "WebGL"]
  backend: ["Node.js", "Go", "GraphQL", "PostgreSQL", "Redis", "Kafka", "Docker", "Kubernetes"]
  tools: ["Git", "CI/CD GitHub Actions", "AWS", "Terraform", "Jest", "Playwright"]
`);

  const [styleYaml, setStyleYaml] = useState(`# ==========================================
# CVBuilder AI Studio - Theme & Layout Config
# ==========================================
theme:
  mode: "dark"
  primaryColor: "#3b82f6"
  accentColor: "#a855f7"
  neutralColor: "#0f172a"
  fontFamily: "Inter, system-ui, sans-serif"

layout:
  pageSize: "A4"
  margins:
    top: "16mm"
    right: "18mm"
    bottom: "16mm"
    left: "18mm"
  columns: 2
  sidebarWidth: "32%"

typography:
  headerSize: "24pt"
  sectionTitleSize: "13pt"
  bodySize: "9.5pt"
  lineHeight: 1.45

features:
  showQrCode: true
  enableAtsScoring: true
  compactMode: false
`);

  const debounceTimerRef = useRef(null);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  // Monaco Ultra-Minimalist Configuration with Quick Suggestions disabled for strings
  const monacoOptions = {
    automaticLayout: true,
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

  // Sync monaco-yaml error markers with React syntaxError state for bottom status bar display
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

  const handleRunCode = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      checkMarkers(editorRef.current, monacoRef.current);
    }, 350);
  };

  // Debounced auto-run mechanism (runs 500ms after last consecutive key press)
  const handleContentChange = (value) => {
    setContentYaml(value || '');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (autoRun) {
      debounceTimerRef.current = setTimeout(() => {
        if (editorRef.current && monacoRef.current) {
          checkMarkers(editorRef.current, monacoRef.current);
        }
      }, 500);
    }
  };

  const handleStyleChange = (value) => {
    setStyleYaml(value || '');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (autoRun) {
      debounceTimerRef.current = setTimeout(() => {
        if (editorRef.current && monacoRef.current) {
          checkMarkers(editorRef.current, monacoRef.current);
        }
      }, 500);
    }
  };

  const handleBeforeMount = () => {
    // Monaco YAML is configured globally at module initialization
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Drag & drop state for reordering items within sections
  const [draggedItem, setDraggedItem] = useState(null); // { sectionKey, index, customSecIdx }

  // Toggle active accordion section
  const toggleSection = (sectionKey) => {
    setActiveSection(prev => prev === sectionKey ? null : sectionKey);
  };

  // Generic helper for reordering array items
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Move item up/down manually
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

  // Drag and Drop handlers
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

  if (isDevMode) {
    return (
      <div className="dev-view-container">
        {/* Dev View Top Control Toolbar */}
        <div className="dev-toolbar">
          {/* Left Side: File Tabs Selector */}
          <div className="dev-file-tabs">
            <button
              className={`dev-file-tab ${activeDevFile === 'content' && !isSplitView ? 'active' : ''} ${isSplitView ? 'split-active' : ''}`}
              onClick={() => setActiveDevFile('content')}
            >
              <FileText size={14} style={{ color: '#60a5fa' }} />
              <span>content.yaml</span>
            </button>

            <button
              className={`dev-file-tab ${activeDevFile === 'style' && !isSplitView ? 'active' : ''} ${isSplitView ? 'split-active' : ''}`}
              onClick={() => setActiveDevFile('style')}
            >
              <Sliders size={14} style={{ color: '#c084fc' }} />
              <span>style.yaml</span>
            </button>
          </div>

          {/* Center/Right Controls: Split View, Auto-Run, Run Button */}
          <div className="dev-toolbar-actions">
            {/* Split View Toggle */}
            <button
              className={`dev-action-btn ${isSplitView ? 'active' : ''}`}
              onClick={() => setIsSplitView(prev => !prev)}
              title="Split view side-by-side"
            >
              <Columns size={14} />
              <span>Split View</span>
            </button>

            {/* Auto-Run Toggle Switch */}
            <div className="auto-run-switch" title="Auto-run pe fiecare modificare">
              <span className="switch-label">Auto-Run</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={autoRun}
                  onChange={(e) => setAutoRun(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>

            {/* Run Code Button */}
            <button
              className={`dev-run-btn ${isRunning ? 'running' : ''}`}
              onClick={handleRunCode}
              disabled={isRunning}
              title="Rulează codul manual (Ctrl+Enter)"
            >
              <Play size={13} fill="currentColor" />
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>
          </div>
        </div>

        {/* Editor Body Area: Single View vs Split View */}
        <div className={`dev-editor-workspace ${isSplitView ? 'split-layout' : 'single-layout'}`}>
          {(isSplitView || activeDevFile === 'content') && (
            <div className="monaco-panel content-panel">
              <div className="panel-header">
                <span className="panel-title">
                  <FileText size={13} style={{ color: '#60a5fa' }} /> content.yaml
                </span>
                <span className="panel-tag">Read/Write</span>
              </div>
              <div className="monaco-editor-wrapper">
                <Editor
                  height="100%"
                  language="yaml"
                  path="content.yaml"
                  beforeMount={handleBeforeMount}
                  onMount={handleEditorMount}
                  theme="vs-dark"
                  value={contentYaml}
                  onChange={handleContentChange}
                  options={monacoOptions}
                />
              </div>
            </div>
          )}

          {(isSplitView || activeDevFile === 'style') && (
            <div className="monaco-panel style-panel">
              <div className="panel-header">
                <span className="panel-title">
                  <Sliders size={13} style={{ color: '#c084fc' }} /> style.yaml
                </span>
                <span className="panel-tag purple">Read/Write</span>
              </div>
              <div className="monaco-editor-wrapper">
                <Editor
                  height="100%"
                  language="yaml"
                  path="style.yaml"
                  beforeMount={handleBeforeMount}
                  onMount={handleEditorMount}
                  theme="vs-dark"
                  value={styleYaml}
                  onChange={handleStyleChange}
                  options={monacoOptions}
                />
              </div>
            </div>
          )}
        </div>

        {/* Bottom Status & Syntax Error Zone */}
        <div className={`dev-status-bar ${syntaxError ? 'status-error' : 'status-valid'}`}>
          {syntaxError ? (
            <div className="error-banner">
              <div className="error-left">
                <AlertCircle size={15} className="error-icon" />
                <span className="error-tag">SYNTAX ERROR</span>
                <span className="error-location">Line {syntaxError.line}:{syntaxError.column}</span>
                <span className="error-msg">{syntaxError.message}</span>
              </div>
              <button className="error-fix-btn" onClick={() => setSyntaxError(null)}>
                Quick Fix / Clear
              </button>
            </div>
          ) : (
            <div className="valid-banner">
              <div className="valid-left">
                <CheckCircle2 size={14} className="valid-icon" />
                <span className="valid-text">Syntax Valid</span>
                <span className="valid-sub">0 errors • Live YAML Schema Verified</span>
              </div>
              <div className="valid-right">
                <span className="mode-badge">{autoRun ? '⚡ Auto-Sync Active' : '⏸ Manual Run Mode'}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="content-editor">

      {/* 1. PERSONAL DETAILS */}
      <div className="accordion-section">
        <button
          className={`accordion-header ${activeSection === 'personal' ? 'active' : ''}`}
          onClick={() => toggleSection('personal')}
        >
          <div className="accordion-header-left">
            <User size={18} className="accordion-icon-personal" />
            <span className="accordion-title">Personal Details</span>
          </div>
          <div className="accordion-header-right">
            {activeSection === 'personal' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {activeSection === 'personal' && (
          <div className="accordion-body">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Alexandru Popescu"
                value={cvData.personal?.name || ''}
                onChange={(e) => handlePersonalChange('name', e.target.value)}
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Professional Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={cvData.personal?.title || ''}
                  onChange={(e) => handlePersonalChange('title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="e.g. alex@techdev.io"
                  value={cvData.personal?.email || ''}
                  onChange={(e) => handlePersonalChange('email', e.target.value)}
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. +40 722 123 456"
                  value={cvData.personal?.phone || ''}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Bucharest, Romania"
                  value={cvData.personal?.address || ''}
                  onChange={(e) => handlePersonalChange('address', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Professional Summary</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Write a concise overview of your technical experience, domain expertise, and core strengths..."
                value={cvData.personal?.summary || ''}
                onChange={(e) => handlePersonalChange('summary', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* 2. WORK EXPERIENCE */}
      <div className="accordion-section">
        <button
          className={`accordion-header ${activeSection === 'experience' ? 'active' : ''}`}
          onClick={() => toggleSection('experience')}
        >
          <div className="accordion-header-left">
            <Briefcase size={18} className="accordion-icon-experience" />
            <span className="accordion-title">Work Experience</span>
            <span className="section-badge">{(cvData.experience || []).length} items</span>
          </div>
          <div className="accordion-header-right">
            {activeSection === 'experience' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {activeSection === 'experience' && (
          <div className="accordion-body">
            <div className="section-toolbar">
              <span className="section-hint">Drag handle to reorder experience entries</span>
              <button className="action-btn action-btn-primary" onClick={addExperience}>
                <Plus size={14} /> Add Experience
              </button>
            </div>

            {(cvData.experience || []).map((exp, expIdx) => (
              <div
                key={exp.id}
                className={`item-card ${draggedItem?.sectionKey === 'experience' && draggedItem?.index === expIdx ? 'is-dragging' : ''}`}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, 'experience', expIdx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'experience', expIdx)}
              >
                <div className="item-card-header">
                  <div className="item-card-title-group">
                    <span className="drag-handle" title="Drag to reorder"><GripVertical size={16} /></span>
                    <div className="reorder-controls">
                      <button
                        disabled={expIdx === 0}
                        onClick={() => moveItem('experience', expIdx, -1)}
                        title="Move Up"
                        className="btn-icon"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        disabled={expIdx === cvData.experience.length - 1}
                        onClick={() => moveItem('experience', expIdx, 1)}
                        title="Move Down"
                        className="btn-icon"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                    <strong>{exp.role || 'New Role'} @ {exp.company || 'Company'}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${exp.variant === 'frontend' ? 'badge-blue' : exp.variant === 'backend' ? 'badge-purple' : 'badge-green'}`}>
                      <Tag size={10} /> {(exp.variant || 'all').toUpperCase()}
                    </span>
                    <button
                      onClick={() => deleteExperience(expIdx)}
                      className="btn-delete"
                      title="Delete Experience"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Job Title / Role</label>
                    <input type="text" className="input-field" value={exp.role || ''} onChange={(e) => handleExpChange(expIdx, 'role', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Company / Organization</label>
                    <input type="text" className="input-field" value={exp.company || ''} onChange={(e) => handleExpChange(expIdx, 'company', e.target.value)} />
                  </div>
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="text" className="input-field" placeholder="e.g. 2022" value={exp.start || ''} onChange={(e) => handleExpChange(expIdx, 'start', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input type="text" className="input-field" placeholder="e.g. Present" value={exp.end || ''} onChange={(e) => handleExpChange(expIdx, 'end', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Target Profile Variant</label>
                    <select
                      className="input-field"
                      value={exp.variant || 'all'}
                      onChange={(e) => handleExpChange(expIdx, 'variant', e.target.value)}
                    >
                      <option value="all">All Variants</option>
                      <option value="frontend">Frontend Only</option>
                      <option value="backend">Backend Only</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Role Summary</label>
                  <input type="text" className="input-field" placeholder="Brief summary of primary responsibilities..." value={exp.description || ''} onChange={(e) => handleExpChange(expIdx, 'description', e.target.value)} />
                </div>

                {/* Bullet Points */}
                <div className="form-group">
                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Quantifiable Bullet Achievements</span>
                  </label>

                  {(exp.bullets || []).map((bullet, bIdx) => {

                    return (
                      <div key={bIdx} style={{ marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                          <textarea
                            className="input-field"
                            rows={2}
                            value={bullet}
                            onChange={(e) => handleBulletChange(expIdx, bIdx, e.target.value)}
                          />

                          <button
                            className="btn-delete"
                            style={{ marginTop: '0.4rem' }}
                            onClick={() => removeBulletPoint(expIdx, bIdx)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                      </div>
                    );
                  })}

                  <button className="action-btn" style={{ width: '100%', justifyContent: 'center', fontSize: '0.75rem', marginTop: '0.4rem' }} onClick={() => addBulletPoint(expIdx)}>
                    <Plus size={14} /> Add Bullet Point
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. EDUCATION */}
      <div className="accordion-section">
        <button
          className={`accordion-header ${activeSection === 'education' ? 'active' : ''}`}
          onClick={() => toggleSection('education')}
        >
          <div className="accordion-header-left">
            <GraduationCap size={18} className="accordion-icon-education" />
            <span className="accordion-title">Education</span>
            <span className="section-badge">{(cvData.education || []).length} items</span>
          </div>
          <div className="accordion-header-right">
            {activeSection === 'education' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {activeSection === 'education' && (
          <div className="accordion-body">
            <div className="section-toolbar">
              <span className="section-hint">Drag handle to reorder education entries</span>
              <button className="action-btn action-btn-primary" onClick={addEducation}>
                <Plus size={14} /> Add Education
              </button>
            </div>

            {(cvData.education || []).map((edu, eduIdx) => (
              <div
                key={edu.id}
                className={`item-card ${draggedItem?.sectionKey === 'education' && draggedItem?.index === eduIdx ? 'is-dragging' : ''}`}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, 'education', eduIdx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'education', eduIdx)}
              >
                <div className="item-card-header">
                  <div className="item-card-title-group">
                    <span className="drag-handle" title="Drag to reorder"><GripVertical size={16} /></span>
                    <div className="reorder-controls">
                      <button disabled={eduIdx === 0} onClick={() => moveItem('education', eduIdx, -1)} className="btn-icon">
                        <ArrowUp size={12} />
                      </button>
                      <button disabled={eduIdx === (cvData.education || []).length - 1} onClick={() => moveItem('education', eduIdx, 1)} className="btn-icon">
                        <ArrowDown size={12} />
                      </button>
                    </div>
                    <strong>{edu.degree || 'Degree'} @ {edu.institution || 'University'}</strong>
                  </div>
                  <button onClick={() => deleteEducation(eduIdx)} className="btn-delete" title="Delete Education">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="form-group">
                  <label>Degree / Qualification</label>
                  <input type="text" className="input-field" value={edu.degree || ''} onChange={(e) => handleEducationChange(eduIdx, 'degree', e.target.value)} />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Institution / University</label>
                    <input type="text" className="input-field" value={edu.institution || ''} onChange={(e) => handleEducationChange(eduIdx, 'institution', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input type="text" className="input-field" placeholder="e.g. Bucharest, RO" value={edu.location || ''} onChange={(e) => handleEducationChange(eduIdx, 'location', e.target.value)} />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input type="text" className="input-field" placeholder="e.g. 2014" value={edu.start || ''} onChange={(e) => handleEducationChange(eduIdx, 'start', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input type="text" className="input-field" placeholder="e.g. 2018" value={edu.end || ''} onChange={(e) => handleEducationChange(eduIdx, 'end', e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description & Achievements</label>
                  <textarea className="input-field" rows={2} placeholder="e.g. Graduated with Honors, Thesis topic..." value={edu.description || ''} onChange={(e) => handleEducationChange(eduIdx, 'description', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. SKILLS */}
      <div className="accordion-section">
        <button
          className={`accordion-header ${activeSection === 'skills' ? 'active' : ''}`}
          onClick={() => toggleSection('skills')}
        >
          <div className="accordion-header-left">
            <Wrench size={18} className="accordion-icon-skills" />
            <span className="accordion-title">Skills & Competencies</span>
            <span className="section-badge">{(cvData.skills || []).length} categories</span>
          </div>
          <div className="accordion-header-right">
            {activeSection === 'skills' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {activeSection === 'skills' && (
          <div className="accordion-body">
            <div className="section-toolbar">
              <span className="section-hint">Drag handle to reorder skill categories</span>
              <button className="action-btn action-btn-primary" onClick={addSkillGroup}>
                <Plus size={14} /> Add Skill Category
              </button>
            </div>

            {(cvData.skills || []).map((skillGroup, skIdx) => (
              <div
                key={skillGroup.id}
                className={`item-card ${draggedItem?.sectionKey === 'skills' && draggedItem?.index === skIdx ? 'is-dragging' : ''}`}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, 'skills', skIdx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'skills', skIdx)}
              >
                <div className="item-card-header">
                  <div className="item-card-title-group">
                    <span className="drag-handle" title="Drag to reorder"><GripVertical size={16} /></span>
                    <div className="reorder-controls">
                      <button disabled={skIdx === 0} onClick={() => moveItem('skills', skIdx, -1)} className="btn-icon">
                        <ArrowUp size={12} />
                      </button>
                      <button disabled={skIdx === (cvData.skills || []).length - 1} onClick={() => moveItem('skills', skIdx, 1)} className="btn-icon">
                        <ArrowDown size={12} />
                      </button>
                    </div>
                    <strong>{skillGroup.category || 'Category Name'}</strong>
                  </div>
                  <button onClick={() => deleteSkillGroup(skIdx)} className="btn-delete" title="Delete Category">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="form-group">
                  <label>Skill Category Title</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Frontend Development, Databases, Cloud"
                    value={skillGroup.category || ''}
                    onChange={(e) => handleSkillGroupChange(skIdx, 'category', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Skills List (comma-separated)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. React, TypeScript, Next.js, Redux"
                    value={skillGroup.rawInput !== undefined ? skillGroup.rawInput : (skillGroup.items || []).join(', ')}
                    onChange={(e) => handleSkillItemsChange(skIdx, e.target.value)}
                  />
                </div>

                <div className="skills-badge-list">
                  {(skillGroup.items || []).map((item, i) => (
                    <span key={i} className="cv-tag" style={{ background: '#334155', color: '#60a5fa' }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. LANGUAGES */}
      <div className="accordion-section">
        <button
          className={`accordion-header ${activeSection === 'languages' ? 'active' : ''}`}
          onClick={() => toggleSection('languages')}
        >
          <div className="accordion-header-left">
            <Globe2 size={18} className="accordion-icon-languages" />
            <span className="accordion-title">Languages</span>
            <span className="section-badge">{(cvData.languages || []).length} items</span>
          </div>
          <div className="accordion-header-right">
            {activeSection === 'languages' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {activeSection === 'languages' && (
          <div className="accordion-body">
            <div className="section-toolbar">
              <span className="section-hint">Drag handle to reorder language entries</span>
              <button className="action-btn action-btn-primary" onClick={addLanguage}>
                <Plus size={14} /> Add Language
              </button>
            </div>

            {(cvData.languages || []).map((lang, langIdx) => (
              <div
                key={lang.id}
                className={`item-card ${draggedItem?.sectionKey === 'languages' && draggedItem?.index === langIdx ? 'is-dragging' : ''}`}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, 'languages', langIdx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'languages', langIdx)}
              >
                <div className="item-card-header">
                  <div className="item-card-title-group">
                    <span className="drag-handle" title="Drag to reorder"><GripVertical size={16} /></span>
                    <div className="reorder-controls">
                      <button disabled={langIdx === 0} onClick={() => moveItem('languages', langIdx, -1)} className="btn-icon">
                        <ArrowUp size={12} />
                      </button>
                      <button disabled={langIdx === (cvData.languages || []).length - 1} onClick={() => moveItem('languages', langIdx, 1)} className="btn-icon">
                        <ArrowDown size={12} />
                      </button>
                    </div>
                    <strong>{lang.name || 'Language'} — {lang.level || 'Proficiency'}</strong>
                  </div>
                  <button onClick={() => deleteLanguage(langIdx)} className="btn-delete" title="Delete Language">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Language Name</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. English, French"
                      value={lang.name || ''}
                      onChange={(e) => handleLanguageChange(langIdx, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Proficiency Level</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Native / Full Professional / C2"
                      value={lang.level || ''}
                      onChange={(e) => handleLanguageChange(langIdx, 'level', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. AWARDS */}
      <div className="accordion-section">
        <button
          className={`accordion-header ${activeSection === 'awards' ? 'active' : ''}`}
          onClick={() => toggleSection('awards')}
        >
          <div className="accordion-header-left">
            <Award size={18} className="accordion-icon-awards" />
            <span className="accordion-title">Honors & Awards</span>
            <span className="section-badge">{(cvData.awards || []).length} items</span>
          </div>
          <div className="accordion-header-right">
            {activeSection === 'awards' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </button>

        {activeSection === 'awards' && (
          <div className="accordion-body">
            <div className="section-toolbar">
              <span className="section-hint">Drag handle to reorder award entries</span>
              <button className="action-btn action-btn-primary" onClick={addAward}>
                <Plus size={14} /> Add Award
              </button>
            </div>

            {(cvData.awards || []).map((award, awdIdx) => (
              <div
                key={award.id}
                className={`item-card ${draggedItem?.sectionKey === 'awards' && draggedItem?.index === awdIdx ? 'is-dragging' : ''}`}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, 'awards', awdIdx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'awards', awdIdx)}
              >
                <div className="item-card-header">
                  <div className="item-card-title-group">
                    <span className="drag-handle" title="Drag to reorder"><GripVertical size={16} /></span>
                    <div className="reorder-controls">
                      <button disabled={awdIdx === 0} onClick={() => moveItem('awards', awdIdx, -1)} className="btn-icon">
                        <ArrowUp size={12} />
                      </button>
                      <button disabled={awdIdx === (cvData.awards || []).length - 1} onClick={() => moveItem('awards', awdIdx, 1)} className="btn-icon">
                        <ArrowDown size={12} />
                      </button>
                    </div>
                    <strong>{award.title || 'Award Title'}</strong>
                  </div>
                  <button onClick={() => deleteAward(awdIdx)} className="btn-delete" title="Delete Award">
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="form-group">
                  <label>Award Title</label>
                  <input type="text" className="input-field" value={award.title || ''} onChange={(e) => handleAwardChange(awdIdx, 'title', e.target.value)} />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Issuer / Organization</label>
                    <input type="text" className="input-field" placeholder="e.g. AWS, Tech Summit" value={award.issuer || ''} onChange={(e) => handleAwardChange(awdIdx, 'issuer', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Date Received</label>
                    <input type="text" className="input-field" placeholder="e.g. 2023" value={award.date || ''} onChange={(e) => handleAwardChange(awdIdx, 'date', e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Award Description</label>
                  <textarea className="input-field" rows={2} placeholder="Brief summary of why award was conferred..." value={award.description || ''} onChange={(e) => handleAwardChange(awdIdx, 'description', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7. DYNAMIC CUSTOM SECTIONS (MAX 3) */}
      {customSectionsList.map((sec, secIdx) => {
        const customSecKey = `custom-${sec.id}`;
        return (
          <div key={sec.id} className="accordion-section custom-accordion">
            <button
              className={`accordion-header ${activeSection === customSecKey ? 'active' : ''}`}
              onClick={() => toggleSection(customSecKey)}
            >
              <div className="accordion-header-left">
                <FolderPlus size={18} className="accordion-icon-custom" />
                <span className="accordion-title">{sec.title || `Custom Section ${secIdx + 1}`}</span>
                <span className="section-badge">{(sec.items || []).length} items</span>
              </div>
              <div className="accordion-header-right">
                <button
                  className="btn-delete"
                  style={{ marginRight: '0.5rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCustomSection(secIdx);
                  }}
                  title="Delete Custom Section"
                >
                  <Trash2 size={14} />
                </button>
                {activeSection === customSecKey ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {activeSection === customSecKey && (
              <div className="accordion-body">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Section Title (as shown in CV)</label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ fontWeight: 700, color: '#c084fc' }}
                    value={sec.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCvData(prev => {
                        const secList = [...prev.customSections];
                        secList[secIdx].title = val;
                        return { ...prev, customSections: secList };
                      });
                    }}
                  />
                </div>

                <div className="section-toolbar">
                  <span className="section-hint">Drag handle to reorder custom section items</span>
                  <button className="action-btn action-btn-primary" onClick={() => addCustomSectionItem(secIdx)}>
                    <Plus size={14} /> Add Item
                  </button>
                </div>

                {(sec.items || []).map((item, itemIdx) => (
                  <div
                    key={item.id}
                    className={`item-card ${draggedItem?.sectionKey === 'custom' && draggedItem?.customSecIdx === secIdx && draggedItem?.index === itemIdx ? 'is-dragging' : ''}`}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, 'custom', itemIdx, secIdx)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'custom', itemIdx, secIdx)}
                  >
                    <div className="item-card-header">
                      <div className="item-card-title-group">
                        <span className="drag-handle" title="Drag to reorder"><GripVertical size={16} /></span>
                        <div className="reorder-controls">
                          <button disabled={itemIdx === 0} onClick={() => moveItem('custom', itemIdx, -1, secIdx)} className="btn-icon">
                            <ArrowUp size={12} />
                          </button>
                          <button disabled={itemIdx === (sec.items || []).length - 1} onClick={() => moveItem('custom', itemIdx, 1, secIdx)} className="btn-icon">
                            <ArrowDown size={12} />
                          </button>
                        </div>
                        <strong>{item.heading || 'Item Heading'}</strong>
                      </div>
                      <button onClick={() => deleteCustomSectionItem(secIdx, itemIdx)} className="btn-delete" title="Delete Item">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Heading / Title</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. React-Fast-Grid / Open Source Project"
                          value={item.heading || ''}
                          onChange={(e) => handleCustomItemChange(secIdx, itemIdx, 'heading', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Subheading / Role</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Lead Developer / Keynote Speaker"
                          value={item.subheading || ''}
                          onChange={(e) => handleCustomItemChange(secIdx, itemIdx, 'subheading', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Start Date</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. 2023 / Jan 2024"
                          value={item.start || ''}
                          onChange={(e) => handleCustomItemChange(secIdx, itemIdx, 'start', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date</label>
                        <input
                          type="text"
                          className="input-field"
                          placeholder="e.g. Present / Dec 2024"
                          value={item.end || ''}
                          onChange={(e) => handleCustomItemChange(secIdx, itemIdx, 'end', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description / Details</label>
                      <textarea
                        className="input-field"
                        rows={2}
                        placeholder="Detail key accomplishments, technologies used, or impact..."
                        value={item.detail || ''}
                        onChange={(e) => handleCustomItemChange(secIdx, itemIdx, 'detail', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* BOTTOM ANCHORED "NEW SECTION" BUTTON */}
      <div className="new-section-bottom-container">
        <button
          className={`btn-add-section-bottom ${isMaxCustomSectionsReached ? 'disabled' : ''}`}
          onClick={addCustomSection}
          disabled={isMaxCustomSectionsReached}
        >
          <FolderPlus size={18} />
          {isMaxCustomSectionsReached
            ? "Maximum 3 Custom Sections Reached"
            : `Add Custom Section (${customSectionsList.length}/3)`}
        </button>
        {isMaxCustomSectionsReached && (
          <span className="max-cap-note">
            You can have a maximum of 3 custom sections alongside Experience, Education, Skills, Languages, and Awards.
          </span>
        )}
      </div>

    </div>
  );
}
