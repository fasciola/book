import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { NAV, READ, SITE } from '../data';

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); window.scrollTo({ top: 0 }); }, [pathname]);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <>
      <header className={`nav ${solid || open ? 'solid' : ''}`}>
        <Link to="/" className="brand" aria-label={SITE.title}>
          <img src="/logo.png" alt="" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <span>Spare Some Minutes</span>
        </Link>
        <nav className={`links ${open ? 'open' : ''}`} aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>{n.label}</NavLink>
          ))}
          <a href={READ.ar} lang="ar" dir="rtl" className="ar-link">الكتاب</a>
          <a href={READ.en} className="cta-link">Read</a>
        </nav>
        <button className="burger" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
      </header>

      <main><Outlet /></main>

      <footer className="foot">
        <div className="foot-inner">
          <p className="foot-brand">{SITE.title}</p>
          <p>
            {NAV.slice(1).map((n, i) => (
              <span key={n.to}>{i > 0 && ' · '}<Link to={n.to}>{n.label}</Link></span>
            ))}
          </p>
          <p className="muted">© 2026 {SITE.author}. The text may be shared freely and unchanged.</p>
        </div>
      </footer>

      <a href={SITE.whatsapp} className="wa" target="_blank" rel="noopener noreferrer" aria-label="Chat with the author on WhatsApp">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.600 15.100L2 22l5-1.300A10 10 0 1 0 12 2zm0 18.200c-1.600 0-3.100-.4-4.400-1.200l-.3-.2-3 .8.8-2.900-.2-.3A8.200 8.200 0 1 1 12 20.200zm4.500-6.100c-.2-.1-1.500-.7-1.700-.8s-.4-.1-.6.100-.7.800-.8 1-.3.200-.6.100a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.200-.4.700-1.300.1-.2 0-.3 0-.4l-.8-1.800c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.300 3 3 0 0 0-.9 2.200c0 1.300 1 2.600 1.100 2.800s1.900 2.900 4.500 4c1.700.7 2.300.7 3.100.6.500-.1 1.500-.6 1.800-1.300s.2-1.200.2-1.300-.2-.2-.5-.3z"/></svg>
      </a>
    </>
  );
}
