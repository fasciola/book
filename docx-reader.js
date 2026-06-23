import * as mammothModule from 'mammoth/mammoth.browser';
import { decorateQuranVerses } from './quran-styler.js';

const mammoth = mammothModule.default || mammothModule;
const config = window.BOOK_READER_CONFIG;
const sourceFiles = import.meta.glob('./assets/books/*.docx.b64', {
  query: '?raw',
  import: 'default'
});

if (config) {
  const root = document.getElementById('source-book');
  const status = document.getElementById('reader-status');

  function decodeBase64(text) {
    const raw = atob(text.replace(/\s+/g, ''));
    const data = new Uint8Array(raw.length);
    for (let index = 0; index < raw.length; index += 1) data[index] = raw.charCodeAt(index);
    return data.buffer;
  }

  function display(html) {
    const source = document.createElement('div');
    source.innerHTML = html;

    const fragment = document.createDocumentFragment();
    let card = document.createElement('div');
    card.className = 'book-card';
    let paragraphCount = 0;

    for (const element of Array.from(source.children)) {
      const isHeading = /^H[1-3]$/.test(element.tagName);
      if (isHeading && card.childNodes.length) {
        fragment.appendChild(card);
        card = document.createElement('div');
        card.className = 'book-card';
        paragraphCount = 0;
      }

      if (isHeading) element.classList.add('source-heading', 'source-heading-secondary');
      if (element.tagName === 'P') element.classList.add('source-paragraph');
      card.appendChild(element);
      paragraphCount += 1;

      if (paragraphCount >= 18) {
        fragment.appendChild(card);
        card = document.createElement('div');
        card.className = 'book-card';
        paragraphCount = 0;
      }
    }

    if (card.childNodes.length) fragment.appendChild(card);
    root.replaceChildren(fragment);
    decorateQuranVerses(root, config.code);
  }

  async function start() {
    try {
      const sourcePath = `./assets/books/book-${config.code}.docx.b64`;
      const loadSource = sourceFiles[sourcePath];
      if (!loadSource) throw new Error(`Missing source file: ${sourcePath}`);

      const encodedDocument = await loadSource();
      const result = await mammoth.convertToHtml({ arrayBuffer: decodeBase64(encodedDocument) });
      display(result.value);
      if (status) status.remove();
    } catch (error) {
      console.error(error);
      if (status) {
        status.classList.add('reader-load-error');
        status.innerHTML = `<i class="fas fa-triangle-exclamation"></i><span>${config.errorText || 'The text could not be loaded. Please refresh the page.'}</span>`;
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}
