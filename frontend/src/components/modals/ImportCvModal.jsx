import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  X, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { Card } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { Badge } from '@/frontend/components/ui/badge';
import { extractFromFile } from '../../utils/fileExtractor.js';
import { parseCvWithAi } from '../ai/api/aiApi.js';

export default function ImportCvModal({ isOpen, onClose, onImportCv, currentUser }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importStepMessage, setImportStepMessage] = useState('');
  const [importStatus, setImportStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    setImportStatus(null);
    setErrorMessage('');
    const validExtensions = ['.pdf', '.json', '.doc', '.docx', '.txt'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(fileExt)) {
      setErrorMessage('Format invalid. Fișiere acceptate: PDF, JSON, DOC, DOCX, TXT.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImportStatus(null);
    setErrorMessage('');
    setImportStepMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' Bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileExtensionBadge = (filename) => {
    const ext = filename.split('.').pop().toUpperCase();
    if (ext === 'JSON') return <Badge variant="purple">{ext}</Badge>;
    if (ext === 'PDF') return <Badge variant="destructive">{ext}</Badge>;
    if (ext === 'DOC' || ext === 'DOCX') return <Badge variant="blue">{ext}</Badge>;
    return <Badge variant="secondary">{ext}</Badge>;
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    setImportStatus(null);
    setErrorMessage('');
    setImportStepMessage('Se extrag datele din fișier...');

    try {
      // Step 1: Extract text & potential photo from file
      const extracted = await extractFromFile(selectedFile);
      let finalCvData = null;

      if (extracted.isJsonSchema && extracted.cvData) {
        // Direct CV Schema or JSON Resume format
        finalCvData = extracted.cvData;
        if (extracted.photo && finalCvData.personal && !finalCvData.personal.avatar) {
          finalCvData.personal.avatar = extracted.photo;
        }
      } else {
        // Raw text extracted from PDF, DOCX, TXT, or generic JSON -> Call AI to parse into schema
        setImportStepMessage('Se analizează și se restructurează CV-ul folosind AI (Gemini)...');
        
        const parsedCv = await parseCvWithAi({
          text: extracted.text,
          currentUser
        });

        finalCvData = parsedCv;

        // If a profile photo was extracted from the file, attach it to personal.avatar
        if (extracted.photo && finalCvData && finalCvData.personal) {
          if (!finalCvData.personal.avatar || finalCvData.personal.avatar.includes('unsplash')) {
            finalCvData.personal.avatar = extracted.photo;
          }
        }
      }

      setImportStepMessage('Se populează interfața în memorie...');
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

    } catch (err) {
      console.error('Import CV failure:', err);
      setIsImporting(false);
      setImportStatus('error');
      setErrorMessage(err.message || 'A apărut o eroare la importul fișierului.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-lg bg-slate-900 border-slate-800 shadow-2xl p-0 overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <UploadCloud className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Importă CV-ul tău</h2>
              <p className="text-xs text-slate-400">Încarcă un fișier din PC sau prin Drag & Drop</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* File Drag & Drop Zone */}
          {!selectedFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                isDragging 
                  ? 'border-indigo-400 bg-indigo-950/40 ring-4 ring-indigo-500/20 scale-[0.99]' 
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950/90'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept=".pdf,.json,.doc,.docx,.txt" 
                className="hidden" 
              />
              <div className="p-3.5 rounded-full bg-slate-900 border border-slate-800 text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="size-7" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Trage și plasează fișierul aici sau <span className="text-indigo-400 underline underline-offset-2">răsfoiește</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Sunt suportate fișiere PDF, JSON, DOCX, DOC sau TXT (max. 10 MB)
              </p>
              
              {/* Allowed Formats Badges */}
              <div className="flex items-center gap-1.5 mt-4">
                <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-800">.PDF</Badge>
                <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-800">.JSON</Badge>
                <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-800">.DOCX</Badge>
                <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-800">.TXT</Badge>
              </div>
            </div>
          ) : (
            /* Selected File Details Card */
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 shrink-0">
                    <FileText className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {getFileExtensionBadge(selectedFile.name)}
                  <button 
                    onClick={handleRemoveFile} 
                    disabled={isImporting}
                    className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors disabled:opacity-50"
                    title="Șterge fișierul"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              {/* Status Feedback */}
              {isImporting && (
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 pt-2 border-t border-slate-800 animate-pulse">
                  <Loader2 className="size-3.5 animate-spin shrink-0" />
                  <span>{importStepMessage || 'Se procesează și se extrag datele din CV...'}</span>
                </div>
              )}

              {importStatus === 'success' && (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 pt-2 border-t border-slate-800">
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  <span>CV importat cu succes! Se aplică modificările...</span>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2 text-xs font-medium">
              <AlertCircle className="size-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 p-4 bg-slate-950/40 border-t border-slate-800">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            disabled={isImporting}
            className="text-xs font-semibold"
          >
            Anulează
          </Button>
          <Button 
            size="sm" 
            onClick={handleImport} 
            disabled={!selectedFile || isImporting || importStatus === 'success'}
            className="gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            {isImporting ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Se importă...
              </>
            ) : (
              <>
                <Check className="size-3.5" />
                Importă CV
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
