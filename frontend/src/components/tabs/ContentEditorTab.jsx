import React from 'react';
import { useCv, useUI, useAuth } from '../../context/index.jsx';
import DevViewPanel from './content-editor/DevViewPanel.jsx';
import SectionsView from './content-editor/SectionsView.jsx';
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '../ui/empty';
import { Button } from '../ui/button';
import { FileUp, FileText, Lock } from 'lucide-react';
import mockContent from '../../data/content/content.json';
import mockStyle from '../../data/style/style.json';

export default function ContentEditorTab(props = {}) {
  const cvCtx = useCv();
  const uiCtx = useUI();
  const authCtx = useAuth();

  const currentUser = props.currentUser ?? authCtx.currentUser;
  const cvData = props.cvData ?? cvCtx.cvData;
  const isDevMode = props.isDevMode ?? uiCtx.isDevMode;
  const onOpenImportModal = props.onOpenImportModal ?? (() => uiCtx.setIsImportModalOpen(true));

  const handleLoadMock = (e) => {
    e?.preventDefault();
    cvCtx.handleUpdateCvData(mockContent);
    cvCtx.handleUpdateStyleData(mockStyle);
  };

  if (!currentUser) {
    return (
      <Empty className="my-6 border-slate-800 bg-slate-900/60 p-8 shadow-sm">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Lock className="size-6" />
          </EmptyMedia>
          <EmptyTitle className="text-base font-bold text-slate-100">
            Autentificare necesară
          </EmptyTitle>
          <EmptyDescription className="text-xs text-slate-400 max-w-md leading-relaxed">
            Pentru a accesa și edita conținutul CV-ului dumneavoastră, este nevoie să vă autentificați în cont.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex flex-col items-center gap-2">
          <Button
            onClick={() => authCtx.openAuthModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
          >
            <Lock className="size-4" />
            Conectare / Autentificare
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  if (!cvData || !cvData.personal) {
    return (
      <Empty className="my-6 border-slate-800 bg-slate-900/60 p-8 shadow-sm">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FileText className="size-6" />
          </EmptyMedia>
          <EmptyTitle className="text-base font-bold text-slate-100">
            Nu s-a putut încărca niciun CV
          </EmptyTitle>
          <EmptyDescription className="text-xs text-slate-400 max-w-md leading-relaxed">
            Nu au fost găsite date de CV în baza de date server. Vă rugăm să importați un fișier CV (PDF, Word, JSON sau TXT) pentru a începe editarea și previzualizarea.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex flex-col items-center gap-2">
          {onOpenImportModal && (
            <Button
              onClick={onOpenImportModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <FileUp className="size-4" />
              Importă un CV Acum
            </Button>
          )}
          <button
            type="button"
            onClick={handleLoadMock}
            className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-4 cursor-pointer font-medium transition-colors"
          >
            Încarcă un exemplu de CV (Mock Demo)
          </button>
        </EmptyContent>
      </Empty>
    );
  }

  if (isDevMode) {
    return <DevViewPanel />;
  }

  return <SectionsView />;
}
