import { useState, useEffect, useCallback } from 'react';
import { validateJsonResume } from '../../utils/jsonResumeValidator.js';
import {
  JsonValidationResult,
  UseJsonResumeModalParams,
  UseJsonResumeModalReturn,
} from './JsonResumeModal.types';

export function useJsonResumeModal({
  jsonContent,
  isOpen,
}: UseJsonResumeModalParams): UseJsonResumeModalReturn {
  const [jsonText, setJsonText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<JsonValidationResult>({
    isValid: true,
    syntaxError: false,
    errors: [],
  });

  useEffect(() => {
    if (jsonContent !== undefined && jsonContent !== null) {
      const initialStr =
        typeof jsonContent === 'string'
          ? jsonContent
          : JSON.stringify(jsonContent, null, 2);
      setJsonText(initialStr);
      setValidationResult(validateJsonResume(initialStr));
    } else {
      setJsonText('');
      setValidationResult({
        isValid: false,
        syntaxError: true,
        errors: [{ path: '', message: 'Niciun conținut JSON furnizat' }],
      });
    }
  }, [jsonContent, isOpen]);

  const handleCopy = useCallback(() => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [jsonText]);

  const handleJsonChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const txt = e.target.value;
      setJsonText(txt);
      const res = validateJsonResume(txt);
      setValidationResult(res);
    },
    []
  );

  return {
    jsonText,
    copied,
    validationResult,
    handleCopy,
    handleJsonChange,
  };
}
