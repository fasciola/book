(() => {
  const breakpoint = 992;
  const getItems = () => ({ nav: document.querySelector('nav'), menu: document.querySelector('.menu-icon'), links: document.getElementById('navLinks') });

  const updateIcon = (menu, open) => {
    const icon = menu?.querySelector('i');
    if (!icon) return;
    icon.classList.toggle('fa-bars', !open);
    icon.classList.toggle('fa-xmark', open);
  };

  const setOpen = (open) => {
    const { menu, links } = getItems();
    if (!links) return;
    links.classList.toggle('active', open);
    menu?.setAttribute('aria-expanded', String(open));
    updateIcon(menu, open);
  };

  window.toggleMenu = () => {
    const { links } = getItems();
    if (links) setOpen(!links.classList.contains('active'));
  };

  const init = () => {
    const { nav, menu, links } = getItems();
    if (!nav || !menu || !links) return;

    menu.setAttribute('role', 'button');
    menu.setAttribute('tabindex', '0');
    menu.setAttribute('aria-controls', 'navLinks');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation menu');

    if (!menu.getAttribute('onclick')) menu.addEventListener('click', window.toggleMenu);
    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.toggleMenu();
      }
    });

    links.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('click', (event) => {
      if (window.innerWidth <= breakpoint && links.classList.contains('active') && !nav.contains(event.target)) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > breakpoint) setOpen(false);
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
