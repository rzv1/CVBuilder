import React, { useEffect, useRef, useState } from 'react';

// Helper for dynamic loading pdfjs-dist (local npm or ESM CDN fallback)
let pdfjsPromise = null;

function loadPdfJs() {
  if (pdfjsPromise) return pdfjsPromise;

  pdfjsPromise = (async () => {
    try {
      const pdfjs = await import('pdfjs-dist');
      try {
        const workerModule = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
        pdfjs.GlobalWorkerOptions.workerSrc = workerModule.default;
      } catch (wErr) {
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || '4.10.38'}/pdf.worker.min.mjs`;
      }
      return pdfjs;
    } catch (err) {
      // CDN Fallback if npm package is not installed
      const cdnUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';
      const pdfjs = await import(/* @vite-ignore */ cdnUrl);
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
      return pdfjs;
    }
  })();

  return pdfjsPromise;
}

export default function PDFCanvasViewer({
  pdfUrl,
  pageNumber = 1,
  zoomLevel = 100,
  onDocumentLoad
}) {
  const containerRef = useRef(null);
  const visibleCanvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pdfDocRef = useRef(null);
  const renderTaskRef = useRef(null);

  // Load PDF Document when pdfUrl changes
  useEffect(() => {
    if (!pdfUrl) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    loadPdfJs()
      .then((pdfjsLib) => {
        if (!isMounted) return;
        const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });

        return loadingTask.promise.then((pdfDoc) => {
          if (!isMounted) return;
          pdfDocRef.current = pdfDoc;
          setLoading(false);
          if (onDocumentLoad) {
            onDocumentLoad({ numPages: pdfDoc.numPages });
          }
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error loading PDF document:', err);
        setError('Eroare la încărcarea modulului PDF.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [pdfUrl, onDocumentLoad]);

  // Render Page to Canvas when pdfDoc, pageNumber or zoomLevel changes
  useEffect(() => {
    if (!pdfDocRef.current || loading) return;

    let isCancelled = false;

    const renderPage = async () => {
      try {
        const pageCount = pdfDocRef.current.numPages;
        const validPageNum = Math.min(Math.max(1, pageNumber), pageCount);
        const page = await pdfDocRef.current.getPage(validPageNum);

        if (isCancelled) return;

        // Calculate device pixel ratio for high DPI (Retina) crisp rendering
        const dpr = window.devicePixelRatio || 1;
        const baseScale = (zoomLevel / 100);
        const viewport = page.getViewport({ scale: baseScale * dpr });

        // Offscreen canvas for flicker-free double buffering
        const offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = viewport.width;
        offscreenCanvas.height = viewport.height;
        const offscreenContext = offscreenCanvas.getContext('2d');

        if (!offscreenContext) return;

        // Cancel existing render task if any
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch (e) {
            // Ignore cancel errors
          }
        }

        const renderContext = {
          canvasContext: offscreenContext,
          viewport: viewport
        };

        renderTaskRef.current = page.render(renderContext);
        await renderTaskRef.current.promise;

        if (isCancelled) return;

        // Copy rendered offscreen image to visible canvas atomically
        const visibleCanvas = visibleCanvasRef.current;
        if (visibleCanvas) {
          visibleCanvas.width = viewport.width;
          visibleCanvas.height = viewport.height;
          visibleCanvas.style.width = `${viewport.width / dpr}px`;
          visibleCanvas.style.height = `${viewport.height / dpr}px`;

          const visibleContext = visibleCanvas.getContext('2d');
          if (visibleContext) {
            visibleContext.drawImage(offscreenCanvas, 0, 0);
          }
        }
      } catch (err) {
        if (err && err.name !== 'RenderingCancelledException') {
          console.error('Error rendering PDF page to canvas:', err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (e) {
          // Ignore cancel error
        }
      }
    };
  }, [pdfUrl, pageNumber, zoomLevel, loading]);

  return (
    <div
      ref={containerRef}
      className="pdf-canvas-container"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        width: '100%'
      }}
    >
      {error ? (
        <div style={{ color: '#ef4444', fontSize: '0.85rem', padding: '1rem' }}>{error}</div>
      ) : (
        <canvas
          ref={visibleCanvasRef}
          className="pdf-canvas-page"
          style={{
            display: 'block',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 1px rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
            background: '#ffffff',
            transition: 'transform 0.2s ease, width 0.2s ease, height 0.2s ease'
          }}
        />
      )}
    </div>
  );
}
