import { useEffect, useRef, useState } from 'react';
import { LANGUAGES } from '../data';

/** Always-visible language switcher in the top bar, so readers can jump to their edition from any page. */
export default function LangMenu() {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent | TouchEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', away);
    document.addEventListener('touchstart', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('touchstart', away); document.removeEventListener('keydown', esc); };
  }, [open]);

  return (
    <div className="lang-menu" ref={box}>
      <button className="lang-btn" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(!open)}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" /><path d="M2.5 12h19M12 2.5c2.700 2.600 4 5.800 4 9.500s-1.300 6.900-4 9.500c-2.700-2.600-4-5.800-4-9.500s1.300-6.900 4-9.500z" />
        </svg>
        <span>Language</span>
      </button>
      {open && (
        <ul className="lang-panel" role="menu">
          {LANGUAGES.map((l) => (
            <li key={l.code} role="none">
              <a role="menuitem" href={l.href} lang={l.lang} dir={l.rtl ? 'rtl' : undefined} onClick={() => setOpen(false)}>
                <b>{l.glyph}</b><span>{l.name}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
