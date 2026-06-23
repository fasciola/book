/*
  Quran quotation detection is deliberately conservative.
  It uses the reviewed Quran reference numbers in each translated source and
  local wording around the quotation. Hadith and Biblical quotations are not styled.
*/

const quranReferenceNumbers = {
  fr: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 19, 21, 23, 24, 25, 26, 29, 37, 38, 39, 40, 41, 42, 43, 44, 45, 48, 49, 51, 52, 53, 54, 55, 57, 59, 60, 61, 62, 63]),
  de: new Set([1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 19, 20, 22, 24, 25, 26, 27, 30, 40, 41, 42, 43, 44, 45, 46, 47, 48, 51, 52, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65]),
  zh: new Set([1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 16, 17, 19, 21, 22, 23, 24, 27, 37, 38, 39, 40, 41, 42, 43, 44, 45, 48, 49, 51, 52, 53, 54, 55, 56, 58, 59, 60, 61, 62]),
  nl: new Set([1, 3, 5, 6, 7, 8, 10, 11, 13, 16, 17, 19, 21, 22, 23, 24, 27, 37, 38, 39, 40, 41, 42, 43, 44, 45, 48, 49, 51, 52, 53, 54, 55, 56, 58, 59, 60, 61, 62]),
  sw: new Set([1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 18, 19, 21, 23, 24, 25, 26, 29, 39, 40, 41, 42, 43, 44, 45, 46, 47, 50, 51, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64]),
  ru: new Set()
};

const quranAttribution = {
  fr: /(?:dans\s+le\s+verset|le\s+verset\s+dit|le\s+tr[eè]s[-\s]haut\s+a\s+dit|dieu\s+(?:dit|a\s+dit)|dans\s+le\s+coran|le\s+coran\s+(?:dit|a\s+dit))/i,
  de: /(?:gott\s+(?:sagt|sagte)|allah\s+(?:sagt|sagte)|mit\s+den\s+worten\s+gottes|im\s+koran(?:\s+steht)?|der\s+koran\s+sagt|der\s+vers\s+besagt)/i,
  ru: /(?:\u043a\u043e\u0440\u0430\u043d|\u0441\u0443\u0440\u0430|\u0430\u044f\u0442|\u0430\u043b\u043b\u0430\u0445\s+(?:\u0441\u043a\u0430\u0437\u0430\u043b|\u0433\u043e\u0432\u043e\u0440\u0438\u0442))/i,
  zh: /(?:\u53e4\u5170\u7ecf|\u53e4\u862d\u7d93|\u771f\u4e3b\u8bf4|\u5b89\u62c9\u8bf4|\u5b89\u62c9\u5728)/i,
  nl: /(?:allah\s+zegt|in\s+de\s+koran|de\s+koran\s+zegt)/i,
  sw: /(?:mwenyezi\s+mungu\s+(?:anasema|alisema)|qur\S*\s+(?:inasema|ilisema)|aya\s+ifuatayo)/i
};

const hadithAttribution = {
  fr: /(?:hadith|messager|proph[eè]te|rapport[eé]\s+par)/i,
  de: /(?:hadith|prophet|gesandte|erz[aä]hlt)/i,
  ru: /(?:\u0445\u0430\u0434\u0438\u0441|\u043f\u0440\u043e\u0440\u043e\u043a|\u043f\u043e\u0441\u043b\u0430\u043d\u043d\u0438\u043a)/i,
  zh: /(?:\u5723\u8bad|\u4f7f\u8005|\u5148\u77e5)/i,
  nl: /(?:hadith|profeet|boodschapper)/i,
  sw: /(?:hadith|mtume|mjumbe)/i
};

const divineCue = {
  fr: /(?:dieu|seigneur|coran)/i,
  de: /(?:allah|gott|koran)/i,
  ru: /(?:\u0430\u043b\u043b\u0430\u0445|\u043a\u043e\u0440\u0430\u043d|\u0441\u0443\u0440\u0430)/i,
  zh: /(?:\u771f\u4e3b|\u5b89\u62c9|\u53e4\u5170|\u53e4\u862d)/i,
  nl: /(?:allah|god|koran)/i,
  sw: /(?:mwenyezi\s+mungu|qur\S*|mola)/i
};

const pairs = [
  { open: '<<', close: '>>' },
  { open: '{{', close: '}}' },
  { open: '«', close: '»' },
  { open: '„', close: '“' },
  { open: '“', close: '”' },
  { open: '‘', close: '’' },
  { open: '《', close: '》' },
  { open: '「', close: '」' },
  { open: '(', close: ')', nested: true }
];

function findClosing(text, start, pair) {
  if (!pair.nested) {
    const end = text.indexOf(pair.close, start + pair.open.length);
    return end === -1 ? -1 : end + pair.close.length;
  }

  let depth = 0;
  for (let index = start; index < text.length; index += 1) {
    if (text.startsWith(pair.open, index)) {
      depth += 1;
      index += pair.open.length - 1;
      continue;
    }
    if (text.startsWith(pair.close, index)) {
      depth -= 1;
      if (depth === 0) return index + pair.close.length;
    }
  }
  return -1;
}

function quoteCandidates(text) {
  const candidates = [];

  for (const pair of pairs) {
    let cursor = 0;
    while (cursor < text.length) {
      const start = text.indexOf(pair.open, cursor);
      if (start === -1) break;
      const end = findClosing(text, start, pair);
      if (end === -1) break;
      if (end - start >= 18) candidates.push({ start, end });
      cursor = end;
    }
  }

  candidates.sort((a, b) => a.start - b.start || b.end - a.end);
  return candidates.filter((candidate, index, all) => !all.slice(0, index).some(
    (outer) => candidate.start >= outer.start && candidate.end <= outer.end && (candidate.start !== outer.start || candidate.end !== outer.end)
  ));
}

function referenceNumbersAfter(text, end) {
  const tail = text.slice(end, end + 18);
  return new Set(Array.from(tail.matchAll(/(?<!\d)(\d{1,3})(?!\d)/g), (match) => Number(match[1])));
}

function isInsideFootnotes(paragraph) {
  return Boolean(paragraph.closest('li, ol, ul, .footnotes, .source-footnotes'));
}

function containsQuranAttribution(value, language) {
  return quranAttribution[language]?.test(value) || false;
}

function containsHadithAttribution(value, language) {
  return hadithAttribution[language]?.test(value) || false;
}

function shouldStyleQuote(text, candidate, language) {
  const before = text.slice(Math.max(0, candidate.start - 140), candidate.start);
  const after = text.slice(candidate.end, candidate.end + 100);
  const quote = text.slice(candidate.start, candidate.end);
  const referenceNumbers = referenceNumbersAfter(text, candidate.end);
  const reviewedReferences = quranReferenceNumbers[language] || new Set();
  const hasReviewedQuranReference = Array.from(referenceNumbers).some((number) => reviewedReferences.has(number));
  const hasAnyReference = referenceNumbers.size > 0;
  const attributedToQuran = containsQuranAttribution(before, language) || containsQuranAttribution(after, language);
  const attributedToHadith = containsHadithAttribution(before, language);

  if (attributedToHadith && !attributedToQuran) return false;

  // Russian translations commonly print the Quran citation after the quote.
  if (language === 'ru' && attributedToQuran) return true;

  // Chinese and Swahili sources contain inconsistent converted footnote numbering.
  // Their quotations must have both a reviewed reference and a local divine/Quran cue,
  // or an explicit Quran attribution.
  if (language === 'zh' || language === 'sw') {
    return attributedToQuran || (hasReviewedQuranReference && divineCue[language].test(`${before} ${quote}`));
  }

  if (hasAnyReference) return hasReviewedQuranReference;
  return attributedToQuran;
}

function textNodesOf(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);
  return nodes;
}

function pointAt(nodes, index) {
  let offset = 0;
  for (const node of nodes) {
    const next = offset + node.nodeValue.length;
    if (index <= next) return { node, offset: index - offset };
    offset = next;
  }
  const last = nodes[nodes.length - 1];
  return { node: last, offset: last ? last.nodeValue.length : 0 };
}

function hasContent(fragment) {
  return (fragment.textContent || '').replace(/\s+/g, '').length > 0;
}

function isolateVerse(paragraph, candidate) {
  const nodes = textNodesOf(paragraph);
  if (!nodes.length) return false;

  const start = pointAt(nodes, candidate.start);
  const end = pointAt(nodes, candidate.end);
  if (!start.node || !end.node) return false;

  const verseRange = document.createRange();
  verseRange.setStart(start.node, start.offset);
  verseRange.setEnd(end.node, end.offset);

  const beforeRange = document.createRange();
  beforeRange.setStart(paragraph, 0);
  beforeRange.setEnd(start.node, start.offset);

  const afterRange = document.createRange();
  afterRange.setStart(end.node, end.offset);
  afterRange.setEnd(paragraph, paragraph.childNodes.length);

  const beforeParagraph = paragraph.cloneNode(false);
  const verseParagraph = paragraph.cloneNode(false);
  const afterParagraph = paragraph.cloneNode(false);

  beforeParagraph.appendChild(beforeRange.cloneContents());
  verseParagraph.appendChild(verseRange.cloneContents());
  afterParagraph.appendChild(afterRange.cloneContents());

  const block = document.createElement('div');
  block.className = 'quran-verse quran-verse-translated';
  verseParagraph.classList.add('quran-verse-text');
  block.appendChild(verseParagraph);

  const insertion = document.createDocumentFragment();
  if (hasContent(beforeParagraph)) insertion.appendChild(beforeParagraph);
  insertion.appendChild(block);
  if (hasContent(afterParagraph)) insertion.appendChild(afterParagraph);
  paragraph.parentNode.replaceChild(insertion, paragraph);
  return true;
}

export function decorateQuranVerses(root, language) {
  let changed = true;

  while (changed) {
    changed = false;
    for (const paragraph of Array.from(root.querySelectorAll('p'))) {
      if (!paragraph.isConnected || paragraph.closest('.quran-verse') || isInsideFootnotes(paragraph)) continue;

      const text = paragraph.textContent || '';
      const candidate = quoteCandidates(text).find((item) => shouldStyleQuote(text, item, language));
      if (!candidate) continue;

      if (isolateVerse(paragraph, candidate)) {
        changed = true;
        break;
      }
    }
  }
}
