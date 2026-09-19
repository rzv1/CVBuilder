import React from 'react';
import {
  UploadCloud,
  FileText,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatFileSize, getFileExtensionBadge } from './CvImportModal.utils';
import { ImportStatus } from './CvImportModal.types';

export interface CvImportModalBodyProps {
  selectedFile: File | null;
  isDragging: boolean;
  isImporting: boolean;
  importStepMessage: string;
  importStatus: ImportStatus;
  errorMessage: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
}

export default function CvImportModalBody({
  selectedFile,
  isDragging,
  isImporting,
  importStepMessage,
  importStatus,
  errorMessage,
  fileInputRef,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileSelect,
  handleRemoveFile,
}: CvImportModalBodyProps): React.ReactNode {
  return (
    <div className="space-y-4">
      {/* File Drag & Drop Zone */}
      {!selectedFile ? (
        <Card
          variant={isDragging ? 'dropzoneActive' : 'dropzone'}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.json,.doc,.docx,.txt"
            className="hidden"
            id="file-upload"
          />

          <div className="text-center space-y-1">
            <p className="text-xs font-semibold text-slate-200">
              Browse
            </p>
            <p className="text-[11px] text-slate-500">
              Accepted types: PDF, Word (DOCX), JSON (JSON Resume), TXT
            </p>
          </div>
        </Card>
      ) : (
        /* Selected File Card */
        <Card variant="nested" className="flex items-center justify-between p-3.5 space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-200 truncate block">
                  {selectedFile.name}
                </span>
                {getFileExtensionBadge(selectedFile.name)}
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {formatFileSize(selectedFile.size)}
              </span>
            </div>
          </div>
          <Button
            variant="destructiveGhost"
            size="icon-xs"
            onClick={handleRemoveFile}
            disabled={isImporting}
            aria-label="Remove file"
          >
            <X className="size-3.5" />
          </Button>
        </Card>
      )}

      {/* Dynamic Progress / Step Feedback */}
      {isImporting && (
        <Alert variant="info">
          <Loader2 className="size-3.5 animate-spin shrink-0" />
          <AlertDescription>
            {importStepMessage || 'Processing file...'}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message Alert */}
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="size-4 shrink-0" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Success Message Alert */}
      {importStatus === 'success' && (
        <Alert variant="success">
          <CheckCircle2 className="size-4 shrink-0" />
          <AlertDescription>
            Data extracted successfully!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
