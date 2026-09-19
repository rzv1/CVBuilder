import React from 'react';
import { Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ShareQrModalProps } from './ShareQrModal.types';
import { useShareQrModal } from './ShareQrModal.hooks';

export default function ShareQrModal({
  isOpen,
  onClose,
  hostedUrl,
  qrCodeUrl,
}: ShareQrModalProps): React.ReactNode {
  const { copied, activeUrl, activeQrUrl, handleCopy } = useShareQrModal({
    hostedUrl,
    qrCodeUrl,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Modal Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40 m-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Share2 className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-100">
                Hosted Dynamic CV & QR Code
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-1">
                Partajează CV-ul tău online prin link sau cod QR
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

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
        <DialogFooter className="p-4 bg-slate-950/40 border-t border-slate-800 m-0">
          <Button
            variant="default"
            size="sm"
            onClick={onClose}
            className="text-xs font-semibold px-4"
          >
            Închide
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
