import { getPdfJs, getSharedPdfWorker } from './pdfLoader.js';

/**
 * PDF Extractor using pdfjs-dist
 */
export async function extractFromPdf(file) {
  const pdfjs = await getPdfJs();
  const worker = getSharedPdfWorker(pdfjs);
  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjs.getDocument({ data: arrayBuffer, worker });
  const pdfDoc = await loadingTask.promise;

  let fullText = '';
  let photoDataUrl = null;

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);

    // 1. Extract text content
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map(item => item.str)
      .join(' ')
      .replace(/\s+/g, ' ');
    fullText += pageText + '\n\n';

    // 2. Extract potential profile image if not found yet
    if (!photoDataUrl) {
      try {
        const ops = await page.getOperatorList();
        const fns = ops.fnArray;
        const args = ops.argsArray;

        for (let i = 0; i < fns.length; i++) {
          if (fns[i] === pdfjs.OPS.paintImageXObject) {
            const imgName = args[i][0];
            let imgObj = null;

            try {
              if (page.objs.has(imgName)) {
                imgObj = page.objs.get(imgName);
              }
            } catch (e) {
              // Ignore missing obj
            }

            if (imgObj && imgObj.width > 60 && imgObj.height > 60) {
              const canvas = document.createElement('canvas');
              canvas.width = imgObj.width;
              canvas.height = imgObj.height;
              const ctx = canvas.getContext('2d');

              const imgData = ctx.createImageData(imgObj.width, imgObj.height);
              if (imgObj.data) {
                if (imgObj.data.length === imgObj.width * imgObj.height * 3) {
                  for (let p = 0, q = 0; p < imgObj.data.length; p += 3, q += 4) {
                    imgData.data[q] = imgObj.data[p];
                    imgData.data[q + 1] = imgObj.data[p + 1];
                    imgData.data[q + 2] = imgObj.data[p + 2];
                    imgData.data[q + 3] = 255;
                  }
                } else if (imgObj.data.length === imgObj.width * imgObj.height * 4) {
                  imgData.data.set(imgObj.data);
                }
                ctx.putImageData(imgData, 0, 0);
                photoDataUrl = canvas.toDataURL('image/png');
                break;
              }
            }
          }
        }
      } catch (imgErr) {
        console.warn('PDF image extraction notice:', imgErr);
      }
    }
  }

  return {
    text: fullText.trim(),
    photo: photoDataUrl,
    isJsonSchema: false
  };
}
