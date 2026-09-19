import React, { useState, useCallback } from 'react';
import { extractFromFile } from '../../utils/fileExtractor.js';
import { parseCvWithAi } from '../ai/api/aiApi.js';
import {
  UseCvImportOptions,
  UseCvImportReturn,
  UseCvDragAndDropReturn,
  ImportStatus,
} from './CvImportModal.types';

export function useCvImport({
  currentUser,
  onImportCv,
  onClose,
  fileInputRef,
}: UseCvImportOptions): UseCvImportReturn {
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<ImportStatus>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [importStepMessage, setImportStepMessage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateAndSetFile = useCallback((file: File) => {
    setImportStatus(null);
    setErrorMessage('');
    const validExtensions = ['.pdf', '.json', '.doc', '.docx', '.txt'];
    const fileExt = '.' + (file.name.split('.').pop() || '').toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      setErrorMessage('Accepted formats: PDF, JSON, DOC, DOCX, TXT.');
      setSelectedFile(null);
      return;
    }
    if (file.size > 5242880) {
      setErrorMessage('File size must be less than 5MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        validateAndSetFile(file);
      }
    },
    [validateAndSetFile]
  );

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setImportStatus(null);
    setErrorMessage('');
    setImportStepMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [fileInputRef]);

  const handleImport = useCallback(async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setImportStatus(null);
    setErrorMessage('');
    setImportStepMessage('Extracting file data...');

    try {
      // Step 1: Extract text & potential photo from file
      const extracted = await extractFromFile(selectedFile);
      let finalCvData: any = null;

      if (extracted.isJsonSchema && extracted.cvData) {
        // Direct CV Schema or JSON Resume format
        finalCvData = extracted.cvData;
        if (extracted.photo && finalCvData.personal && !finalCvData.personal.avatar) {
          finalCvData.personal.avatar = extracted.photo;
        }
      } else {
        // Raw text extracted from PDF, DOCX, TXT, or generic JSON -> Call AI to parse into schema
        setImportStepMessage('Parsing CV with AI...');

        const parsedCv = await parseCvWithAi({
          text: extracted.text,
          currentUser,
        });

        finalCvData = parsedCv;

        // If a profile photo was extracted from the file, attach it to personal.avatar
        if (extracted.photo && finalCvData && finalCvData.personal) {
          if (!finalCvData.personal.avatar || finalCvData.personal.avatar.includes('unsplash')) {
            finalCvData.personal.avatar = extracted.photo;
          }
        }
      }

      setImportStepMessage('Updating CV interface...');
      if (onImportCv && finalCvData) {
        onImportCv(finalCvData);
      }

      setImportStatus('success');
      setTimeout(() => {
        setIsImporting(false);
        onClose();
        setSelectedFile(null);
        setImportStatus(null);
        setImportStepMessage('');
      }, 1500);
    } catch (err: any) {
      console.error('Import CV failure:', err);
      setIsImporting(false);
      setImportStatus('error');
      setErrorMessage(err?.message || 'An error occured during file import.');
    }
  }, [selectedFile, currentUser, onClose, onImportCv]);

  return {
    selectedFile,
    setSelectedFile,
    isImporting,
    importStatus,
    errorMessage,
    importStepMessage,
    validateAndSetFile,
    handleFileSelect,
    handleRemoveFile,
    handleImport,
  };
}

export function useCvDragAndDrop(
  onFileSelect: (file: File) => void
): UseCvDragAndDropReturn {
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const newFile = e.dataTransfer.files[0];
        onFileSelect(newFile);
      }
    },
    [onFileSelect]
  );

  return {
    isDragging,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
