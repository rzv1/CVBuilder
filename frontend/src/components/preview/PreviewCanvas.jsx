import React from 'react';
import PDFCanvasViewer from '../PDFCanvasViewer.jsx';

export default function PreviewCanvas({
  pdfInstance,
  currentPage,
  zoomLevel,
  setTotalPages,
  setCurrentPage
}) {
  return (
    <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/90 via-slate-900 to-slate-950">
      <div className="w-full h-full">
        <div className="flex justify-center items-center w-full relative">
          {!pdfInstance.url ? (
            <div className="flex items-center justify-center h-96 text-slate-400 text-sm font-semibold">
              Se generează PDF-ul Canvas...
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
                  Se actualizează...
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
