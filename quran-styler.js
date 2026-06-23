const verseMarkers = {
  fr: /\b(?:verset|sourate|coran)\b/i,
  de: /\b(?:vers|sure|koran)\b/i,
  ru: /(?:\u0430\u044f\u0442|\u0441\u0443\u0440\u0430|\u043a\u043e\u0440\u0430\u043d)/i,
  zh: /(?:\u7ecf\u6587|\u7ae0\u8282|\u53e4\u5170\u7ecf|\u53e4\u862d\u7d93)/i,
  sw: /\b(?:aya|sura|qur'?an|qurani)\b/i,
  nl: /\b(?:vers|soera|koran)\b/i
};

const quotePairs = [
  ['«', '»'],
  ['„', '“'],
  ['“', '”'],
  ['‘', '’'],
  ['《', '》'],
  ['「', '」'],
  ['(', ')']
];

function getTextNodes(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node);
  return nodes;
}

function pointAt(nodes, index) {
  let offset = 0;
  for (const node of nodes) {
    const nextOffset = offset + node.nodeValue.length;
    if (index <= nextOffset) return { node, offset: index - offset };
    offset = nextOffset;
  }
  const lastNode = nodes[nodes.length - 1];
  return { node: lastNode, offset: lastNode ? lastNode.nodeValue.length : 0 };
}

function hasVisibleContent(fragment) {
  return (fragment.textContent || '').replace(/\s+/g, '').length > 0;
}

function findQuoteAfterMarker(text, language) {
  const marker = verseMarkers[language];
  if (!marker) return null;
  const match = marker.exec(text);
  if (!match) return null;

  const afterMarker = match.index + match[0].length;
  let best = null;

  for (const [open, close] of quotePairs) {
    const start = text.indexOf(open, afterMarker);
    if (start === -1) continue;
    const end = text.indexOf(close, start + open.length);
    if (end === -1 || end - start < 18) continue;
    if (!best || start < best.start) best = { start, end: end + close.length };
  }

  return best;
}

function buildVerseBlock(paragraph, start, end) {
  const textNodes = getTextNodes(paragraph);
  if (!textNodes.length) return null;

  const startPoint = pointAt(textNodes, start);
  const endPoint = pointAt(textNodes, end);
  if (!startPoint.node || !endPoint.node) return null;

  const verseRange = document.createRange();
  verseRange.setStart(startPoint.node, startPoint.offset);
  verseRange.setEnd(endPoint.node, endPoint.offset);

  const beforeRange = document.createRange();
  beforeRange.setStart(paragraph, 0);
  beforeRange.setEnd(startPoint.node, startPoint.offset);

  const afterRange = document.createRange();
  afterRange.setStart(endPoint.node, endPoint.offset);
  afterRange.setEnd(paragraph, paragraph.childNodes.length);

  const beforeContent = beforeRange.cloneContents();
  const verseContent = verseRange.cloneContents();
  const afterContent = afterRange.cloneContents();
  const parent = paragraph.parentNode;

  const beforeParagraph = paragraph.cloneNode(false);
  const afterParagraph = paragraph.cloneNode(false);
  beforeParagraph.appendChild(beforeContent);
  afterParagraph.appendChild(afterContent);

  const block = document.createElement('div');
  block.className = 'quran-verse quran-verse-translated';
  const verseParagraph = paragraph.cloneNode(false);
  verseParagraph.classList.add('quran-verse-text');
  verseParagraph.appendChild(verseContent);
  block.appendChild(verseParagraph);

  const insertion = document.createDocumentFragment();
  if (hasVisibleContent(beforeParagraph)) insertion.appendChild(beforeParagraph);
  insertion.appendChild(block);
  if (hasVisibleContent(afterParagraph)) insertion.appendChild(afterParagraph);

  parent.replaceChild(insertion, paragraph);
  return block;
}

export function decorateQuranVerses(root, language) {
  for (const paragraph of Array.from(root.querySelectorAll('p'))) {
    if (!paragraph.isConnected || paragraph.closest('.quran-verse')) continue;

    const text = paragraph.textContent || '';
    const quote = findQuoteAfterMarker(text, language);
    if (!quote) continue;

    buildVerseBlock(paragraph, quote.start, quote.end);
  }
}
