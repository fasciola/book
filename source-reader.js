/* Loads language-edition PDFs and original DOCX files from base64 source assets. */
(function () {
  'use strict';

  const config = window.BOOK_READER_CONFIG;
  if (!config) return;

  const readerFrame = document.getElementById('bookReader');
  const downloadLink = document.getElementById('downloadSource');
  const status = document.getElementById('readerStatus');
  const basePath = `assets/books/book-${config.code}`;

  function base64ToBlob(base64, mimeType) {
    const cleanBase64 = base64.replace(/\s/g, '');
    const binary = atob(cleanBase64);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return new Blob([bytes], { type: mimeType });
  }

  async function getAsset(extension) {
    const response = await fetch(`${basePath}.${extension}.b64`, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`Could not load ${extension} source.`);
    return response.text();
  }

  async function loadPdf() {
    try {
      if (status) status.textContent = config.loadingText || 'Loading the book…';
      const base64 = await getAsset('pdf');
      const pdfBlob = base64ToBlob(base64, 'application/pdf');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      if (readerFrame) readerFrame.src = pdfUrl;
      if (status) status.textContent = '';
    } catch (error) {
      console.error(error);
      if (status) status.textContent = config.errorText || 'The reader could not load. Please use the original document download.';
    }
  }

  if (downloadLink) {
    downloadLink.addEventListener('click', async function (event) {
      event.preventDefault();
      const previousText = downloadLink.innerHTML;
      try {
        downloadLink.setAttribute('aria-busy', 'true');
        const base64 = await getAsset('docx');
        const documentBlob = base64ToBlob(base64, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        const documentUrl = URL.createObjectURL(documentBlob);
        const tempLink = document.createElement('a');
        tempLink.href = documentUrl;
        tempLink.download = `book-${config.code}-original.docx`;
        document.body.appendChild(tempLink);
        tempLink.click();
        tempLink.remove();
        window.setTimeout(() => URL.revokeObjectURL(documentUrl), 2000);
      } catch (error) {
        console.error(error);
        alert(config.downloadErrorText || 'The original document could not be downloaded. Please try again.');
      } finally {
        downloadLink.removeAttribute('aria-busy');
        downloadLink.innerHTML = previousText;
      }
    });
  }

  loadPdf();
})();
