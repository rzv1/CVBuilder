import React from 'react';
import { 
  Share2, 
  FileCode, 
  UploadCloud, 
  Download, 
  BookOpen,
  User,
  Zap
} from 'lucide-react';
import { Button } from '@/frontend/components/ui/button';
import { Badge } from '@/frontend/components/ui/badge';

export default function HeaderActions({
  currentUser,
  userCredits,
  onOpenAuthModal,
  viewMode,
  onOpenBlog,
  onOpenImportModal,
  onOpenJsonModal,
  onOpenShareModal,
  onExportPdf,
  isExportingPdf
}) {
  return (
    <div className="flex items-center gap-2">
      {/* User Registration / Account Profile Button */}
      <Button 
        variant="outline" 
        size="sm" 
        className={`gap-1.5 h-8 text-xs font-semibold rounded-lg ${
          currentUser 
            ? 'bg-indigo-950/40 border-indigo-500/40 hover:bg-indigo-900/50' 
            : 'bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border-purple-500/50 hover:bg-purple-900/60'
        }`}
        onClick={onOpenAuthModal}
        title={currentUser ? `Autentificat ca ${currentUser.name} (${userCredits} credite AI)` : "Înregistrează-te pentru 100 credite AI gratuit"}
      >
        <User className={`size-3.5 ${currentUser ? 'text-indigo-400' : 'text-purple-300'}`} />
        {currentUser ? (
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-100 max-w-[110px] truncate">
              {currentUser.name}
            </span>
            <Badge variant="warning" className="text-[10px] py-0 px-1.5 gap-0.5 font-bold">
              <Zap className="size-2.5" /> {userCredits}
            </Badge>
          </div>
        ) : (
          <span className="text-indigo-200 font-semibold">Înregistrare</span>
        )}
      </Button>

      {/* Tech Blog & Docs Button */}
      <Button 
        variant="outline" 
        size="sm" 
        className={`gap-1.5 h-8 text-xs font-semibold rounded-lg bg-blue-950/30 border-blue-500/40 text-blue-300 hover:bg-blue-900/40 ${
          viewMode === 'blog' ? 'ring-1 ring-blue-400 bg-blue-900/50 text-white' : ''
        }`}
        onClick={onOpenBlog}
        title="Tech Blog & Documentație"
      >
        <BookOpen className="size-3.5 text-blue-400" />
        <span>Blog & Docs</span>
        <Badge variant="blue" className="text-[9px] py-0 px-1 font-bold">NEW</Badge>
      </Button>

      {/* Import CV Button */}
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-1.5 h-8 text-xs font-semibold rounded-lg bg-slate-800/80 border-slate-700/60 hover:bg-slate-700/80 text-slate-200 hover:text-white" 
        onClick={onOpenImportModal}
        title="Importă CV prin Drag & Drop sau Fișier din PC"
      >
        <UploadCloud className="size-3.5 text-indigo-400" />
        <span>Import CV</span>
      </Button>

      {/* JSON Resume Import/Export Button */}
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-1.5 h-8 text-xs font-semibold rounded-lg bg-slate-800/80 border-slate-700/60 hover:bg-slate-700/80 text-slate-200 hover:text-white" 
        onClick={onOpenJsonModal}
        title="JSON Resume Standard Import/Export"
      >
        <FileCode className="size-3.5 text-slate-400" />
        <span>JSON Resume</span>
      </Button>

      {/* Share & QR Button */}
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-1.5 h-8 text-xs font-semibold rounded-lg bg-slate-800/80 border-slate-700/60 hover:bg-slate-700/80 text-slate-200 hover:text-white" 
        onClick={onOpenShareModal}
        title="Hosted Dynamic CV & QR Code"
      >
        <Share2 className="size-3.5 text-slate-400" />
        <span>Share & QR</span>
      </Button>

      {/* Export PDF Button */}
      <Button 
        size="sm" 
        disabled={isExportingPdf}
        className="gap-1.5 h-8 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 disabled:opacity-60 border-0" 
        onClick={onExportPdf}
        title="Deterministic PDF Export via @react-pdf/renderer"
      >
        <Download className="size-3.5" />
        <span>{isExportingPdf ? 'Se generează...' : 'Export PDF'}</span>
      </Button>
    </div>
  );
}
