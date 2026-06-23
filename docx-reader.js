(() => {
  'use strict';
  const config = window.BOOK_READER_CONFIG;
  if (!config) return;
  const root = document.getElementById('source-book');
  const status = document.getElementById('reader-status');

  function addLibrary() {
    return new Promise((resolve, reject) => {
      if (window.mammoth) return resolve();
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mammoth@1.9.1/mammoth.browser.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function decodeBase64(text) {
    const raw = atob(text.replace(/\s+/g, ''));
    const data = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i += 1) data[i] = raw.charCodeAt(i);
    return data.buffer;
  }

  function display(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const fragment = document.createDocumentFragment();
    let card = document.createElement('div');
    card.className = 'book-card';
    let count = 0;
    for (const node of Array.from(temp.children)) {
      if (/^H[1-3]$/.test(node.tagName) && card.childNodes.length) {
        fragment.appendChild(card);
        card = document.createElement('div');
        card.className = 'book-card';
        count = 0;
      }
      if (/^H[1-3]$/.test(node.tagName)) node.classList.add('source-heading', 'source-heading-secondary');
      if (node.tagName === 'P') node.classList.add('source-paragraph');
      card.appendChild(node);
      count += 1;
      if (count === 18) {
        fragment.appendChild(card);
        card = document.createElement('div');
        card.className = 'book-card';
        count = 0;
      }
    }
    if (card.childNodes.length) fragment.appendChild(card);
    root.replaceChildren(fragment);
  }

  async function start() {
    try {
      await addLibrary();
      const response = await fetch(`assets/books/book-${config.code}.docx.b64`, { cache: 'force-cache' });
      if (!response.ok) throw new Error('Source document unavailable');
      const converted = await window.mammoth.convertToHtml({ arrayBuffer: decodeBase64(await response.text()) });
      display(converted.value);
      if (status) status.remove();
    } catch (error) {
      console.error(error);
      if (status) status.textContent = config.errorText || 'The text could not be loaded. Please refresh the page.';
    }
  }

  document.addEventListener('DOMContentLoaded', start);
})();
