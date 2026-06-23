(() => {
  'use strict';
  const config = window.BOOK_READER_CONFIG;
  if (!config) return;
  const root = document.getElementById('source-book');
  const status = document.getElementById('reader-status');
  const joinUrl = (part) => `assets/reader-content/${config.code}/${part}.txt`;

  async function bytesToText(bytes) {
    if ('DecompressionStream' in window) {
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
      return new Response(stream).text();
    }
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    if (!window.pako) throw new Error('Decompression is not available in this browser.');
    return new TextDecoder().decode(window.pako.ungzip(bytes));
  }

  async function loadBook() {
    try {
      const responses = await Promise.all(config.parts.map(async (part) => {
        const response = await fetch(joinUrl(part), { cache: 'force-cache' });
        if (!response.ok) throw new Error(`Could not load book content (${response.status}).`);
        return response.text();
      }));
      const encoded = responses.join('').trim();
      const raw = atob(encoded);
      const bytes = Uint8Array.from(raw, ch => ch.charCodeAt(0));
      const html = await bytesToText(bytes);
      root.innerHTML = html;
      if (status) status.remove();
    } catch (error) {
      console.error(error);
      if (status) {
        status.classList.add('reader-load-error');
        status.innerHTML = `<i class="fas fa-triangle-exclamation"></i><span>${config.errorText || 'The text could not be loaded. Please refresh the page.'}</span>`;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', loadBook);
})();
