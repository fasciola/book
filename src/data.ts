export const SITE = {
  title: 'Spare Some Minutes of Your Time',
  author: 'Ahmed Attijani Ahmed Albadawi',
  email: 'ahmedtijany@hotmail.com',
  whatsapp: 'https://wa.me/249910438069',
};

export const NAV = [
  { to: '/', label: 'Home' },
  { to: '/languages', label: 'Languages' },
  { to: '/chapters', label: 'Chapters' },
  { to: '/about', label: 'About' },
  { to: '/author', label: 'Author' },
  { to: '/download', label: 'Download' },
  { to: '/contact', label: 'Contact' },
];

/** Legacy static reader pages (kept as real HTML files, so plain links, not router links). */
export const READ = { en: 'read.html', ar: 'read-ar.html' };

export interface Lang {
  code: string; glyph: string; name: string; blurb: string; cta: string; href: string; lang: string; rtl?: boolean;
}
export const LANGUAGES: Lang[] = [
  { code: 'ar', glyph: 'ع', name: 'اللغة العربية', blurb: 'اقرأ النسخة العربية الكاملة للكتاب.', cta: 'الدخول إلى النسخة العربية', href: 'index-ar.html', lang: 'ar', rtl: true },
  { code: 'en', glyph: 'A', name: 'English', blurb: 'Read the complete English edition.', cta: 'Read in English', href: 'read.html', lang: 'en' },
  { code: 'fr', glyph: 'É', name: 'Français', blurb: 'Lire l’édition française complète en ligne.', cta: 'Lire en ligne', href: 'index-fr.html', lang: 'fr' },
  { code: 'de', glyph: 'ß', name: 'Deutsch', blurb: 'Die vollständige deutsche Ausgabe online lesen.', cta: 'Online lesen', href: 'index-de.html', lang: 'de' },
  { code: 'ru', glyph: 'Я', name: 'Русский', blurb: 'Читайте полное русское издание онлайн.', cta: 'Читать онлайн', href: 'index-ru.html', lang: 'ru' },
  { code: 'zh', glyph: '中', name: '中文', blurb: '在线阅读完整中文版本。', cta: '在线阅读', href: 'index-zh.html', lang: 'zh' },
  { code: 'nl', glyph: 'N', name: 'Nederlands', blurb: 'Lees de volledige Nederlandse editie online.', cta: 'Online lezen', href: 'reader.html?lang=nl', lang: 'nl' },
  { code: 'sw', glyph: 'K', name: 'Kiswahili', blurb: 'Soma toleo kamili la Kiswahili mtandaoni.', cta: 'Soma mtandaoni', href: 'reader.html?lang=sw', lang: 'sw' },
];

/** Full audiobook recordings (audio-only .mp4, about an hour each). */
export const AUDIO = [
  { name: 'العربية', lang: 'ar', rtl: true, src: '/Arabic.mp4', read: 'index-ar.html', duration: 3456 },
  { name: 'Français', lang: 'fr', src: '/France.mp4', read: 'index-fr.html', duration: 3571 },
  { name: '中文', lang: 'zh', src: '/china.mp4', read: 'index-zh.html', duration: 3468 },
];

export const QUESTIONS = [
  { n: 'I', img: 'island-lamp', title: 'What is Truth?', text: 'Is there one universal truth? The author examines every path with intellectual honesty.' },
  { n: 'II', img: 'island-sapling', title: 'Where is Happiness?', text: 'Not fleeting pleasure, but deep contentment that survives loss and death.' },
  { n: 'III', img: 'island-harvest', title: 'One Humanity', text: 'Can divisions of religion and race be healed? The book argues Islam offers the foundation for true unity.' },
];

export const PARTS = [
  { n: 1, title: 'A Message to Truth-Seekers', ar: 'الجزء الأول: رسالة إلى الباحثين عن الحقيقة', min: '~12 min', text: "The author's personal awakening, reflections on human origins, shared value, technical progress, and the search for an absolute, unifying standard of inner peace." },
  { n: 2, title: 'The Truth I Have Found', ar: 'الجزء الثاني: الحقيقة التي وجدتها', min: '~8 min', text: 'Philosophical definitions of truth, human respect, core responsibilities, and avoiding environmental harm or societal class divisions.' },
  { n: 3, title: 'Where I Have Found It', ar: 'الجزء الثالث: الحقيقة وأين وجدتها؟', min: '~5 min', text: 'Continuity of scriptures, the role of divine messages as rectifiers, and finding the perfect, complete message of peace.' },
  { n: 4, title: 'Details of the Truth', ar: 'الجزء الرابع: تفاصيل الحقيقة التي وجدتها', min: '~45 min', text: 'The detailed specifications of the message: social pillars, family relationships, women’s rights, environmental stewardship, justice, and peace accords.' },
];

export const SECTIONS = [
  { label: 'Oneness of God', ar: 'التوحيد', hash: 'oneness' },
  { label: "Women's Rights", ar: 'حقوق المرأة', hash: 'women' },
  { label: 'Environment', ar: 'البيئة والكائنات', hash: 'environment' },
  { label: 'War & Peace', ar: 'السلم والحرب', hash: 'war' },
];

export const KEY_MESSAGES = [
  { title: 'Unity of God', hash: 'oneness', text: 'One Creator, without partner, without son, without image. This is not a mystery to be accepted beyond reason — it is the simplest, most elegant metaphysical proposition.' },
  { title: 'Justice & Equality', hash: 'human-origins', text: "All humans are equal before God. No race, tribe, or class holds privilege. The most noble in God's sight is the most righteous." },
  { title: 'No Compulsion in Religion', hash: 'part4', text: '“There is no compulsion in religion. The right course has become clear from the wrong.” Truth must be chosen freely. Faith imposed by force is not faith — it is fear.' },
  { title: 'Mercy over Punishment', hash: 'part4', text: "God's mercy precedes His wrath. Repentance is always open. Forgiveness is always near. No sin is too great for God's mercy, if the heart is sincere." },
  { title: "Human Dignity & Women's Rights", hash: 'women', text: 'Every human being is born with innate dignity. Honor the human being. No one may be degraded, enslaved, or exploited.' },
  { title: 'Environmental Care', hash: 'environment', text: 'The earth is a trust. Stewardship of nature is a sacred duty. Waste, pollution, and destruction of the environment are sins against the Creator.' },
];

export const DIFFERENT = [
  ['It is a personal letter, not a sermon.', 'The author writes as a brother, not as an authority. He confesses his doubts, his struggles, and his mistakes, and invites the reader to judge for themselves.'],
  ['It respects all scriptures.', 'The author does not insult the Torah or the Gospel. He honors them as divine revelations that have been partially preserved, and shows how the Quran confirms and completes them.'],
  ['It demands no compulsion.', 'The central argument is that truth must be chosen freely. “There is no compulsion in religion” is not a footnote — it is the foundation.'],
  ['It offers practical guidance.', 'The book explains prayer, fasting, charity, and pilgrimage in clear, accessible language, showing how each practice transforms the individual and society.'],
  ['It addresses every objection.', "Women's rights, slavery, war, the hijab — the author confronts the most difficult questions directly."],
];

export const DOWNLOADS = [
  { code: 'EN', name: 'English', file: 'book-en.pdf', cta: 'Download PDF' },
  { code: 'AR', name: 'العربية (Arabic)', file: 'book-ar.pdf', cta: 'تحميل الكتاب PDF', rtl: true },
  { code: 'ES', name: 'Español (Spanish)', file: 'book-es.pdf', cta: 'Descargar PDF' },
  { code: 'DE', name: 'Deutsch (German)', file: 'book-de.pdf', cta: 'Herunterladen PDF' },
  { code: 'ZH', name: '中文 (Chinese)', file: 'book-zh.pdf', cta: '下载 PDF 电子书' },
  { code: 'RU', name: 'Русский (Russian)', file: 'book-ru.pdf', cta: 'Скачать PDF' },
  { code: 'NL', name: 'Nederlands (Dutch)', file: 'book-nl.pdf', cta: 'Download PDF' },
];
