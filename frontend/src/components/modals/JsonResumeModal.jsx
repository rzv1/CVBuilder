import React, { useState, useEffect } from 'react';
import { X, FileCode, Check, Copy, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { Badge } from '@/frontend/components/ui/badge';
import { Textarea } from '@/frontend/components/ui/textarea';
import { validateJsonResume } from '../../utils/jsonResumeValidator.js';

export default function JsonResumeModal({ isOpen, onClose, jsonContent }) {
  const [jsonText, setJsonText] = useState('');
  const [copied, setCopied] = useState(false);
  const [validationResult, setValidationResult] = useState({ isValid: true, syntaxError: false, errors: [] });

  useEffect(() => {
    if (jsonContent !== undefined && jsonContent !== null) {
      const initialStr = typeof jsonContent === 'string'
        ? jsonContent
        : JSON.stringify(jsonContent, null, 2);
      setJsonText(initialStr);
      setValidationResult(validateJsonResume(initialStr));
    } else {
      setJsonText('');
      setValidationResult({ isValid: false, syntaxError: true, errors: [{ path: '', message: 'Niciun conținut JSON furnizat' }] });
    }
  }, [jsonContent, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJsonChange = (e) => {
    const txt = e.target.value;
    setJsonText(txt);
    const res = validateJsonResume(txt);
    setValidationResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-3xl bg-slate-900 border-slate-800 shadow-2xl p-0 overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <FileCode className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                JSON Resume Schema
              </h2>
              <p className="text-xs text-slate-400">
                Schema de nivel standard pentru interoperabilitate în CV-uri
              </p>
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
                  Neconform cu Schema JSON Resume ({validationResult.errors.length} {validationResult.errors.length === 1 ? 'eroare' : 'erori'})
                </Badge>
              )}
            </div>
            <span className="text-[11px] text-slate-400">
              Schema: <code className="text-sky-400">https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json</code>
            </span>
          </div>

          {/* Error details if invalid */}
          {!validationResult.isValid && validationResult.errors.length > 0 && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs space-y-1 max-h-36 overflow-y-auto font-mono">
              <div className="font-semibold text-red-400 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                <AlertCircle className="size-3.5 shrink-0" /> Detalii Erori Validare Semantică AJV:
              </div>
              {validationResult.errors.map((err, idx) => (
                <div key={idx} className="flex items-start gap-2 border-t border-red-500/10 pt-1 first:border-0 first:pt-0">
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
        <div className="flex items-center justify-between p-4 bg-slate-950/40 border-t border-slate-800">
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
        </div>
      </Card>
    </div>
  );
}
