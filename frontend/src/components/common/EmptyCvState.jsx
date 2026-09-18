import React from 'react';
import { FileUp, Sparkles, AlertCircle } from 'lucide-react';

export default function EmptyCvState({ onOpenImportModal }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl my-6 space-y-4 shadow-xl">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
        <AlertCircle size={28} />
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-lg font-extrabold text-slate-100">
          Nu s-a putut încărca niciun CV
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Nu au fost găsite date de CV în baza de date server. Vă rugăm să importați un fișier CV (PDF, Word, JSON sau TXT) pentru a începe editarea și previzualizarea.
        </p>
      </div>

      {onOpenImportModal && (
        <button
          onClick={onOpenImportModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95 cursor-pointer mt-2"
        >
          <FileUp size={16} />
          Importă un CV Acum
        </button>
      )}
    </div>
  );
}
