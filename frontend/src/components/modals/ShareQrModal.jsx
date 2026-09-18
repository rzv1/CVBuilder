import React, { useState } from 'react';
import { X, Share2, Copy, Check } from 'lucide-react';
import { Card } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';

export default function ShareQrModal({ 
  isOpen, 
  onClose, 
  hostedUrl = "https://cvbuilder.dev/cv/live-demo", 
  qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://cvbuilder.dev/cv/live-demo" 
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const activeUrl = hostedUrl || "https://cvbuilder.dev/cv/live-demo";
  const activeQrUrl = qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(activeUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl p-0 overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Share2 className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                Hosted Dynamic CV & QR Code
              </h2>
              <p className="text-xs text-slate-400">
                Partajează CV-ul tău online prin link sau cod QR
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
        <div className="p-5 text-center space-y-4">
          <div className="bg-white p-4 rounded-xl inline-block shadow-lg border border-slate-200">
            <img 
              src={activeQrUrl} 
              alt="CV QR Code" 
              className="size-40 object-contain mx-auto" 
            />
          </div>

          <p className="text-xs text-slate-400">
            Scanați codul pentru a vizualiza CV-ul live pe orice dispozitiv mobil
          </p>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold font-mono text-sky-400 truncate">
              {activeUrl}
            </span>
            <Button 
              variant="outline" 
              size="xs" 
              onClick={handleCopy}
              className="gap-1 text-xs shrink-0"
            >
              {copied ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  Copiat
                </>
              ) : (
                <>
                  <Copy className="size-3 text-slate-400" />
                  Copiază
                </>
              )}
            </Button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Acest cod QR este automat inclus în antetul superior din dreapta al documentelor PDF descărcate.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end p-4 bg-slate-950/40 border-t border-slate-800">
          <Button 
            variant="default" 
            size="sm" 
            onClick={onClose}
            className="text-xs font-semibold px-4"
          >
            Închide
          </Button>
        </div>
      </Card>
    </div>
  );
}
