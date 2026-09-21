import React from 'react';
import { useAuth, useCv } from '../../context/index.jsx';
import PDFCanvasViewer from './PDFCanvasViewer.jsx';
import { FileText } from 'lucide-react';

export default function PreviewCanvas({
  pdfInstance,
  currentPage,
  zoomLevel,
  setTotalPages,
  setCurrentPage
}) {
  const { currentUser } = useAuth() || {};
  const { cvData } = useCv() || {};

  const hasData = Boolean(currentUser && cvData && cvData.personal);

  return (
    <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/90 via-slate-900 to-slate-950">
      <div className="w-full h-full">
        <div className="flex justify-center items-center w-full relative">
          {!hasData || !pdfInstance?.url ? (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400 text-sm font-semibold gap-2">
              <FileText className="size-8 text-slate-500 opacity-60" />
              <span>No data to display...</span>
            </div>
          ) : (
            <>
              <PDFCanvasViewer
                pdfUrl={pdfInstance.url}
                pageNumber={currentPage}
                zoomLevel={zoomLevel}
                onDocumentLoad={({ numPages }) => {
                  setTotalPages(numPages);
                  if (currentPage > numPages) {
                    setCurrentPage(numPages);
                  }
                }}
              />
              {pdfInstance.loading && (
                <div className="absolute top-4 right-4 bg-slate-900/90 text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-500/50 shadow-lg shadow-black/40 backdrop-blur-md pointer-events-none z-10 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-400 inline-block shadow-sm shadow-blue-400 animate-pulse" />
                  Updating...
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
