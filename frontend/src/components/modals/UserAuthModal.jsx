import React, { useState, useEffect } from 'react';
import { X, User, Zap, LogOut, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '@/frontend/components/ui/card';
import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';

export default function UserAuthModal({ isOpen, onClose, currentUser, onUserAuth }) {
  const [nameInput, setNameInput] = useState(currentUser?.name || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNameInput(currentUser?.name || '');
    setErrorMsg('');
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = nameInput.trim();
    if (!name) {
      setErrorMsg('Vă rugăm să introduceți numele dumneavoastră.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      const data = await res.json();
      if (data.success && data.user) {
        onUserAuth(data.user);
        onClose();
      } else {
        setErrorMsg(data.error || 'Eroare la înregistrare/autentificare.');
      }
    } catch (err) {
      setErrorMsg('Nu s-a putut conecta la server. Verificați conexiunea.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    onUserAuth(null);
    setNameInput('');
    onClose();
  };

  const initialLetter = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl p-0 overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 shrink-0">
              <User className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {currentUser ? 'Profil Utilizator CVBuilder' : 'Autentificare / Înregistrare'}
              </h3>
              <p className="text-xs text-slate-400">
                {currentUser ? 'Gestionează-ți contul și creditele AI' : 'Conectează-te pentru a primi 100 credite AI cadou'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="Închide"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Guest Welcome Banner */}
          {!currentUser && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
              <div className="size-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                <Zap className="size-5 fill-amber-400" />
              </div>
              <div className="text-xs text-amber-100/90 leading-relaxed">
                <strong className="block text-amber-400 font-bold text-xs mb-0.5">
                  ⚡ Bonus Gratuit: 100 Credite AI
                </strong>
                La prima înregistrare cu numele tău, primești automat 100 de credite pentru asistentul Gemini.
              </div>
            </div>
          )}

          {/* Logged in User Profile Card */}
          {currentUser && (
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md shadow-indigo-500/30 shrink-0">
                  {initialLetter}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-100">
                    {currentUser.name}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium mt-0.5">
                    <CheckCircle2 className="size-3" /> Cont Activ înregistrat
                  </div>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/25 px-3 py-1.5 rounded-lg text-right">
                <div className="text-[10px] font-bold text-amber-300/80 uppercase tracking-wider">
                  Sold Credite
                </div>
                <div className="text-sm font-black text-amber-400 flex items-center justify-end gap-1">
                  <Zap className="size-3.5 fill-amber-400" /> {currentUser.credits ?? 0}
                </div>
              </div>
            </div>
          )}

          {/* Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              {currentUser ? 'Modifică numele contului:' : 'Introduceți numele dumneavoastră:'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
              <Input 
                type="text" 
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="ex: Alex Popescu"
                required
                autoFocus
                className="pl-9 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500 font-medium text-sm"
              />
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-2 text-xs font-medium">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            {currentUser ? (
              <Button 
                type="button" 
                variant="destructive" 
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 text-xs font-semibold"
              >
                <LogOut className="size-3.5" /> Deconectare
              </Button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={onClose}
                className="text-xs font-semibold"
              >
                Anulează
              </Button>
              <Button 
                type="submit" 
                size="sm"
                disabled={isLoading}
                className="gap-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Se procesează...
                  </>
                ) : (
                  currentUser ? 'Actualizează Cont' : 'Înregistrare / Autentificare'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
