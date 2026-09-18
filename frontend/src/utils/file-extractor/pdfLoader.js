let pdfjsPromise = null;

/**
 * Dynamic loader for pdfjs-dist with Vite worker / CDN fallback
 */
export async function getPdfJs() {
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
      const cdnUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs';
      const pdfjs = await import(/* @vite-ignore */ cdnUrl);
      pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
      return pdfjs;
    }
  })();
  return pdfjsPromise;
}
