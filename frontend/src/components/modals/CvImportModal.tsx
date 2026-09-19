import React, { useRef } from 'react';
import { UploadCloud, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CvImportModalProps } from './CvImportModal.types';
import { useCvImport, useCvDragAndDrop } from './CvImportModal.hooks';
import CvImportModalBody from './CvImportModal.body';

export default function CvImportModal({
  isOpen,
  onClose,
  onImportCv,
  currentUser,
}: CvImportModalProps): React.ReactNode {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    selectedFile,
    isImporting,
    importStatus,
    errorMessage,
    importStepMessage,
    validateAndSetFile,
    handleFileSelect,
    handleRemoveFile,
    handleImport,
  } = useCvImport({
    currentUser,
    onImportCv,
    onClose,
    fileInputRef,
  });

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } =
    useCvDragAndDrop(validateAndSetFile);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isImporting && onClose()}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        {/* Modal Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40 m-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <UploadCloud className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-100">
                Import CV
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-1">
                Click or Drag &amp; Drop
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="p-5">
          <CvImportModalBody
            selectedFile={selectedFile}
            isDragging={isDragging}
            isImporting={isImporting}
            importStepMessage={importStepMessage}
            importStatus={importStatus}
            errorMessage={errorMessage}
            fileInputRef={fileInputRef}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            handleFileSelect={handleFileSelect}
            handleRemoveFile={handleRemoveFile}
          />
        </div>

        {/* Modal Footer */}
        <DialogFooter className="p-4 bg-slate-950/40 border-t border-slate-800 m-0 flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isImporting}
            className="text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleImport}
            disabled={!selectedFile || isImporting || importStatus === 'success'}
            className="gap-1.5 text-xs font-semibold"
          >
            {isImporting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Check className="size-3.5" />
                Import CV
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
