import mammoth from 'mammoth';

/**
 * Word (.docx / .doc) Extractor using mammoth
 */
export async function extractFromWord(file) {
  const arrayBuffer = await file.arrayBuffer();

  // Extract raw text
  const textResult = await mammoth.extractRawText({ arrayBuffer });
  const text = textResult.value || '';

  // Extract embedded images
  let photoDataUrl = null;

  try {
    await mammoth.convertToHtml({ arrayBuffer }, {
      convertImage: mammoth.images.imgElement(function (element) {
        return element.read("base64").then(function (imageBuffer) {
          const src = "data:" + element.contentType + ";base64," + imageBuffer;
          if (!photoDataUrl) {
            photoDataUrl = src;
          }
          return { src: src };
        });
      })
    });
  } catch (err) {
    console.warn('Mammoth image extraction notice:', err);
  }

  return {
    text: text.trim(),
    photo: photoDataUrl,
    isJsonSchema: false
  };
}
