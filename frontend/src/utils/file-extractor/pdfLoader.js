let pdfjsPromise = null;
let pdfjsInstance = null;
let sharedPdfWorker = null;
export let pdfJs = null;

/**
 * Dynamic loader for pdfjs-dist with Vite worker / CDN fallback.
 * Loads the library once and caches the reference.
 */
export async function getPdfJs() {
  if (pdfjsInstance) return pdfjsInstance;
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
      try {
        sharedPdfWorker = new pdfjs.PDFWorker({ name: 'cv-shared-worker' });
      } catch (workerInitErr) {
        console.warn('Failed to initialize shared PDFWorker:', workerInitErr);
      }
      pdfjsInstance = pdfjs;
      pdfJs = pdfjs;
      return pdfjs;
    } catch (err) {
      const cdnUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';
      const pdfjs = await import(/* @vite-ignore */ cdnUrl);
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
      try {
        sharedPdfWorker = new pdfjs.PDFWorker({ name: 'cv-shared-worker' });
      } catch (workerInitErr) {
        console.warn('Failed to initialize shared PDFWorker:', workerInitErr);
      }
      pdfjsInstance = pdfjs;
      pdfJs = pdfjs;
      return pdfjs;
    }
  })();

  return pdfjsPromise;
}

/**
 * Returns a persistent shared PDFWorker instance so the worker thread
 * and its script are never recreated on document updates.
 */
export function getSharedPdfWorker(pdfjs = pdfjsInstance) {
  if ((!sharedPdfWorker || sharedPdfWorker.destroyed) && pdfjs?.PDFWorker) {
    sharedPdfWorker = new pdfjs.PDFWorker({ name: 'cv-shared-worker' });
  }
  return sharedPdfWorker;
}

// Preload the JS library once after the application is completely loaded
if (typeof window !== 'undefined') {
  const triggerPreload = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        getPdfJs().catch((err) => console.warn('Background PDF.js preload failed:', err));
      });
    } else {
      setTimeout(() => {
        getPdfJs().catch((err) => console.warn('Background PDF.js preload failed:', err));
      }, 200);
    }
  };

  if (document.readyState === 'complete') {
    triggerPreload();
  } else {
    window.addEventListener('load', triggerPreload, { once: true });
  }
}