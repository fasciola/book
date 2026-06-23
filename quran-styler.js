const verseMarkers = {
  fr: /\b(?:coran|sourate|verset)\b/i,
  de: /\b(?:koran|sure|vers)\b/i,
  ru: /(?:\u041a\u043e\u0440\u0430\u043d|\u0421\u0443\u0440\u0430|\u0430\u044f\u0442)/i,
  zh: /(?:\u53e4\u5170\u7ecf|\u53e4\u862d\u7d93|\u771f\u4e3b)/i,
  sw: /\b(?:qur'?an|qurani|sura|aya)\b/i,
  nl: /\b(?:koran|soera|vers)\b/i
};

const quotationMarks = /(?:[\u00ab\u00bb\u201c\u201d\u201e\u201f\u300a\u300b\u300c\u300d\uFD3E\uFD3F]|<<|>>|\([^)]{24,}\)|\uff08[^\uff09]{24,}\uff09)/;

function matchesVerse(element, language) {
  const text = (element.textContent || '').replace(/\s+/g, ' ').trim();
  const marker = verseMarkers[language] || /quran/i;
  return text.length >= 18 && marker.test(text) && quotationMarks.test(text);
}

function matchesCitation(element, language) {
  const text = (element.textContent || '').replace(/\s+/g, ' ').trim();
  const marker = verseMarkers[language] || /quran/i;
  return text.length > 0 && text.length < 140 && marker.test(text);
}

function createVerseBlock(paragraph) {
  const block = document.createElement('div');
  block.className = 'quran-verse quran-verse-translated';
  paragraph.parentNode.insertBefore(block, paragraph);
  block.appendChild(paragraph);
  paragraph.classList.add('quran-verse-text');
  return block;
}

export function decorateQuranVerses(root, language) {
  const paragraphs = Array.from(root.querySelectorAll('p'));

  for (const paragraph of paragraphs) {
    if (!paragraph.isConnected || paragraph.closest('.quran-verse')) continue;
    if (!matchesVerse(paragraph, language)) continue;

    const block = createVerseBlock(paragraph);
    const next = block.nextElementSibling;

    if (next && next.tagName === 'P' && matchesCitation(next, language)) {
      next.classList.remove('source-paragraph');
      next.classList.add('citation');
      block.appendChild(next);
    }
  }

  for (const paragraph of Array.from(root.querySelectorAll('p'))) {
    if (!paragraph.isConnected || paragraph.closest('.quran-verse')) continue;
    if (!matchesCitation(paragraph, language)) continue;

    const block = createVerseBlock(paragraph);
    paragraph.classList.remove('source-paragraph');
    paragraph.classList.add('citation');
    block.classList.add('quran-citation-only');
  }
}
