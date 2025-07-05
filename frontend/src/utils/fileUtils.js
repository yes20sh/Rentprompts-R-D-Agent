import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?worker';

// Set the worker using Vite-compatible method
pdfjsLib.GlobalWorkerOptions.workerPort = new pdfjsWorker();

/**
 * Extract text from a PDF file using PDF.js
 */
export async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }

  return text.trim();
}

/**
 * Extract text from a DOCX file using Mammoth.js
 */
import mammoth from 'mammoth/mammoth.browser';

export async function extractTextFromDocx(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}
