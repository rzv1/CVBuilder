import { useState, useRef, useEffect } from 'react';
import YAML from 'yaml';
import { useCv } from '../../../../context/index.jsx';

export function useDevView() {
  const { cvData, handleUpdateCvData, styleData, handleUpdateStyleData } = useCv();

  const [activeDevFile, setActiveDevFile] = useState('content'); // 'content' | 'style'
  const [isSplitView, setIsSplitView] = useState(false);
  const [autoRun, setAutoRun] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [syntaxError, setSyntaxError] = useState(null);

  const isSelfEditingRef = useRef(false);
  const debounceTimerRef = useRef(null);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);

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

  // Sync external RAM state (cvData) -> YAML editor
  useEffect(() => {
    if (isSelfEditingRef.current) return;
    if (!cvData) return;
    try {
      setContentYaml(YAML.stringify(cvData));
    } catch (e) {
      console.error('Error stringifying cvData to YAML:', e);
    }
  }, [cvData]);

  // Sync external RAM state (styleData) -> YAML editor
  useEffect(() => {
    if (isSelfEditingRef.current) return;
    if (!styleData) return;
    try {
      setStyleYaml(YAML.stringify(styleData));
    } catch (e) {
      console.error('Error stringifying styleData to YAML:', e);
    }
  }, [styleData]);

  const monacoOptions = {
    automaticLayout: true,
    colorDecorators: true,
    quickSuggestions: {
      other: true,
      comments: false,
      strings: true,
    },
    completion: true,
    suggestOnTriggerCharacters: true,
    suggest: {
      showWords: false,
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
      horizontalScrollbarSize: 8,
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
    tabSize: 2,
  };

  const checkMarkers = (editor, monaco) => {
    if (!editor || !monaco) return;
    const model = editor.getModel();
    if (!model) return;

    const markers = monaco.editor.getModelMarkers({ resource: model.uri });
    const errorMarker = markers.find((m) => m.severity === monaco.MarkerSeverity.Error);

    if (errorMarker) {
      setSyntaxError({
        line: errorMarker.startLineNumber,
        column: errorMarker.startColumn,
        message: errorMarker.message,
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

  const syncYamlToContentState = (yamlText) => {
    if (!yamlText) return;
    try {
      const parsed = YAML.parse(yamlText);
      if (parsed && typeof parsed === 'object') {
        isSelfEditingRef.current = true;
        handleUpdateCvData(parsed);
        setSyntaxError(null);
        setTimeout(() => {
          isSelfEditingRef.current = false;
        }, 100);
      }
    } catch (err) {
      setSyntaxError({
        line: err.linePos?.[0]?.line || 1,
        column: err.linePos?.[0]?.col || 1,
        message: err.message || 'Eroare de sintaxă YAML',
      });
    }
  };

  const syncYamlToStyleState = (yamlText) => {
    if (!yamlText) return;
    try {
      const parsed = YAML.parse(yamlText);
      if (parsed && typeof parsed === 'object') {
        isSelfEditingRef.current = true;
        handleUpdateStyleData(parsed);
        setSyntaxError(null);
        setTimeout(() => {
          isSelfEditingRef.current = false;
        }, 100);
      }
    } catch (err) {
      setSyntaxError({
        line: err.linePos?.[0]?.line || 1,
        column: err.linePos?.[0]?.col || 1,
        message: err.message || 'Eroare de sintaxă YAML',
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

  return {
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
  };
}
