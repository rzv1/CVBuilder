import React from 'react';

export interface CvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportCv?: (data: any) => void;
  currentUser?: any;
}

export interface UseCvImportOptions {
  currentUser?: any;
  onImportCv?: (data: any) => void;
  onClose: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export type ImportStatus = 'success' | 'error' | null;

export interface UseCvImportReturn {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  isImporting: boolean;
  importStatus: ImportStatus;
  errorMessage: string;
  importStepMessage: string;
  validateAndSetFile: (file: File) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  handleImport: () => Promise<void>;
}

export interface UseCvDragAndDropReturn {
  isDragging: boolean;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}
