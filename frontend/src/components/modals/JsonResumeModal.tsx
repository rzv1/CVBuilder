import React from 'react';
import {
  FileCode,
  Check,
  Copy,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { JsonResumeModalProps } from './JsonResumeModal.types';
import { useJsonResumeModal } from './JsonResumeModal.hooks';

export default function JsonResumeModal({
  isOpen,
  onClose,
  jsonContent,
}: JsonResumeModalProps): React.ReactNode {
  const {
    jsonText,
    copied,
    validationResult,
    handleCopy,
    handleJsonChange,
  } = useJsonResumeModal({
    jsonContent,
    isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40 m-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <FileCode className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-100 flex items-center gap-2">
                JSON Resume Schema
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-1">
                Schema de nivel standard pentru interoperabilitate în CV-uri
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-800/60">
            <div className="flex items-center gap-2">
              {validationResult.isValid ? (
                <Badge variant="success" className="gap-1 px-2.5 py-1 text-xs">
                  <CheckCircle2 className="size-3.5" />
                  Valid JSON Resume Schema v1.0.0 (AJV)
                </Badge>
              ) : validationResult.syntaxError ? (
                <Badge variant="destructive" className="gap-1 px-2.5 py-1 text-xs">
                  <AlertCircle className="size-3.5" />
                  Sintaxă JSON Invalidă
                </Badge>
              ) : (
                <Badge variant="warning" className="gap-1 px-2.5 py-1 text-xs">
                  <AlertTriangle className="size-3.5" />
                  Neconform cu Schema JSON Resume ({validationResult.errors.length}{' '}
                  {validationResult.errors.length === 1 ? 'eroare' : 'erori'})
                </Badge>
              )}
            </div>
            <span className="text-[11px] text-slate-400">
              Schema:{' '}
              <code className="text-sky-400">
                https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json
              </code>
            </span>
          </div>

          {/* Error details if invalid */}
          {!validationResult.isValid && validationResult.errors.length > 0 && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs space-y-1 max-h-36 overflow-y-auto font-mono">
              <div className="font-semibold text-red-400 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                <AlertCircle className="size-3.5 shrink-0" /> Detalii Erori Validare Semantică AJV:
              </div>
              {validationResult.errors.map((err, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 border-t border-red-500/10 pt-1 first:border-0 first:pt-0"
                >
                  <span className="text-red-400 shrink-0 font-bold">• [{err.path}]:</span>
                  <span className="text-slate-300">{err.message}</span>
                </div>
              ))}
            </div>
          )}

          <Textarea
            rows={14}
            className="font-mono text-xs bg-slate-950 text-sky-300 border-slate-800 focus:border-sky-500/50 resize-y"
            value={jsonText}
            onChange={handleJsonChange}
            placeholder="Introduceți sau editați schema JSON..."
          />
        </div>

        {/* Modal Footer */}
        <DialogFooter className="flex items-center justify-between sm:justify-between p-4 bg-slate-950/40 border-t border-slate-800 m-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 text-xs font-semibold"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                Copiat!
              </>
            ) : (
              <>
                <Copy className="size-3.5 text-slate-400" />
                Copiază în Clipboard
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="text-xs font-semibold"
          >
            Închide
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
