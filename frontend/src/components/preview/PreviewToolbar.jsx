import React from 'react';
import { Eye, ZoomIn, ZoomOut } from '../Icons.jsx';
import { Button } from '@/frontend/components/ui/button';

export default function PreviewToolbar({
  previewEngine,
  setPreviewEngine,
  layoutTemplate,
  setLayoutTemplate,
  currentPage,
  totalPages,
  handlePrevPage,
  handleNextPage,
  zoomLevel,
  handleZoomIn,
  handleZoomOut
}) {
  return (
    <div className="flex items-center justify-between px-5 py-2.5 bg-slate-900/90 border-b border-slate-800 shrink-0 flex-wrap gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
          <Eye className="size-4 text-blue-400" /> CV Preview
        </span>

        {/* Engine Switcher */}
        <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setPreviewEngine('react-pdf')}
            className={`h-6 text-[11px] font-bold rounded px-2.5 transition-colors ${
              previewEngine === 'react-pdf'
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-transparent'
            }`}
          >
            @react-pdf/renderer
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setPreviewEngine('html')}
            className={`h-6 text-[11px] font-bold rounded px-2.5 transition-colors ${
              previewEngine === 'html'
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-transparent'
            }`}
          >
            HTML Canvas
          </Button>
        </div>

        {/* Layout Template Selector */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 px-1.5 rounded-lg border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold pr-1">Layout:</span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setLayoutTemplate('classic')}
            className={`h-6 text-[11px] font-bold rounded px-2 transition-colors ${
              layoutTemplate === 'classic'
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-transparent'
            }`}
            title="Layout Clasic - O singură coloană"
          >
            📄 Clasic
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setLayoutTemplate('modern')}
            className={`h-6 text-[11px] font-bold rounded px-2 transition-colors ${
              layoutTemplate === 'modern'
                ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-transparent'
            }`}
            title="Layout Modern - 2 Coloane, Dark Header & QR Code"
          >
            🎨 Modern (QR & 2 Col)
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Page Navigation Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="h-5 w-5 p-0 text-slate-300 hover:text-white disabled:opacity-40"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            ◀
          </Button>

          <span className="text-xs font-bold text-slate-200 min-w-[42px] text-center">
            {currentPage} / {totalPages}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            className="h-5 w-5 p-0 text-slate-300 hover:text-white disabled:opacity-40"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            ▶
          </Button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
          <Button 
            variant="ghost" 
            size="icon-xs" 
            className="h-5 w-5 p-0 text-slate-400 hover:text-white"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut className="size-3.5" />
          </Button>
          <span className="text-xs font-bold text-slate-200 min-w-[38px] text-center">
            {zoomLevel}%
          </span>
          <Button 
            variant="ghost" 
            size="icon-xs" 
            className="h-5 w-5 p-0 text-slate-400 hover:text-white"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
