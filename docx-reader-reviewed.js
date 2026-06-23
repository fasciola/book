import * as mammothModule from 'mammoth/mammoth.browser';
import { decorateReviewedQuranVerses } from './quran-review.js';

const mammoth = mammothModule.default || mammothModule;
const config = window.BOOK_READER_CONFIG;
const books = import.meta.glob('./assets/books/*.docx.b64', { query: '?raw', import: 'default' });

function decode(text) {
  const raw = atob(text.replace(/\s+/g, ''));
  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) bytes[index] = raw.charCodeAt(index);
  return bytes.buffer;
}

function render(root, html) {
  const source = document.createElement('div');
  source.innerHTML = html;
  const fragment = document.createDocumentFragment();
  let card = document.createElement('div');
  card.className = 'book-card';
  let count = 0;

  for (const element of Array.from(source.children)) {
    const heading = /^H[1-3]$/.test(element.tagName);
    if (heading && card.childNodes.length) {
      fragment.appendChild(card);
      card = document.createElement('div');
      card.className = 'book-card';
      count = 0;
    }
    if (heading) element.classList.add('source-heading', 'source-heading-secondary');
    if (element.tagName === 'P') element.classList.add('source-paragraph');
    card.appendChild(element);
    count += 1;
    if (count >= 18) {
      fragment.appendChild(card);
      card = document.createElement('div');
      card.className = 'book-card';
      count = 0;
    }
  }

  if (card.childNodes.length) fragment.appendChild(card);
  root.replaceChildren(fragment);
  decorateReviewedQuranVerses(root, config.code);
}

async function start() {
  const root = document.getElementById('source-book');
  const status = document.getElementById('reader-status');
  try {
    const load = books[`./assets/books/book-${config.code}.docx.b64`];
    if (!load) throw new Error('Missing source document');
    const result = await mammoth.convertToHtml({ arrayBuffer: decode(await load()) });
    render(root, result.value);
    if (status) status.remove();
  } catch (error) {
    console.error(error);
    if (status) status.classList.add('reader-load-error');
    if (status) status.textContent = config.errorText || 'The text could not be loaded. Please refresh the page.';
  }
}

if (config) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
}
