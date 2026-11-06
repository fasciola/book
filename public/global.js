/* Shared theme controls, navigation loader, and site logo */
(function () {
  'use strict';

  window.toggleMenu = function () {
    const links = document.getElementById('navLinks');
    if (links) links.classList.toggle('active');
  };

  window.toggleTheme = function () {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    applyTheme(dark ? 'light' : 'dark');
  };

  function applyTheme(theme) {
    const icons = document.querySelectorAll('#themeIcon');
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      icons.forEach((icon) => { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); });
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      icons.forEach((icon) => { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); });
    }
  }

  function addAsset(type, url, attribute) {
    if (document.querySelector(`[${attribute}]`)) return;
    const element = document.createElement(type);
    if (type === 'link') { element.rel = 'stylesheet'; element.href = url; }
    else element.src = url;
    element.setAttribute(attribute, 'true');
    document.head.appendChild(element);
  }

  function applySiteLogo() {
    if (!document.getElementById('shared-site-logo-style')) {
      const style = document.createElement('style');
      style.id = 'shared-site-logo-style';
      style.textContent = `
        nav .logo { display: inline-flex; align-items: center; min-width: 0; }
        nav .logo .site-logo-image { display: block; width: auto; height: 48px; max-width: min(300px, 46vw); object-fit: contain; }
        nav .logo.has-site-logo > :not(.site-logo-image) { display: none !important; }
        @media (max-width: 992px) {
          nav .logo .site-logo-image { height: 38px; max-width: min(240px, 56vw); }
        }
      `;
      document.head.appendChild(style);
    }

    document.querySelectorAll('nav .logo').forEach((logo) => {
      if (logo.querySelector('.site-logo-image')) return;

      const image = document.createElement('img');
      image.className = 'site-logo-image';
      image.src = '/logo.png';
      image.alt = 'Spare Some Minutes of Your Time';
      image.decoding = 'async';
      image.addEventListener('load', () => logo.classList.add('has-site-logo'), { once: true });
      image.addEventListener('error', () => image.remove(), { once: true });
      logo.prepend(image);
    });
  }

  /* Cut-out illustrations: hide any that have not been added yet, and let the rest drift on scroll */
  function initCutouts() {
    const cuts = [...document.querySelectorAll('.cut')];
    if (!cuts.length) return;
    cuts.forEach((img) => {
      const miss = () => img.classList.add('is-missing');
      img.addEventListener('error', miss, { once: true });
      if (img.complete && img.naturalWidth === 0) miss();
    });
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const moving = cuts.filter((c) => c.dataset.speed);
    if (!moving.length) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      moving.forEach((c) => {
        const host = c.parentElement.getBoundingClientRect();
        if (host.bottom < -200 || host.top > vh + 200) return;
        const centre = host.top + host.height / 2 - vh / 2;
        c.style.setProperty('--py', (centre * parseFloat(c.dataset.speed)).toFixed(1) + 'px');
      });
    };
    const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    update();
  }

  /* Inner pages: add page-specific cut-out art behind the first header (no per-page markup needed) */
  const PAGE_ART = {
    'about':     [['island-book', 'right', '8%', 190], ['f-leaf-gold', 'left', '14%', 90]],
    'author':    [['desk-window', 'right', '6%', 280], ['f-feather', 'left', '10%', 90]],
    'contact':   [['dove-letter', 'right', '6%', 280], ['f-leaf-gold', 'left', '12%', 90]],
    'chapters':  [['path-cliff', 'right', '2%', 150], ['f-lantern', 'left', '14%', 80]],
    'download':  [['books-cloud', 'right', '6%', 200], ['f-star', 'left', '12%', 90]],
    '_default':  [['dove-flight', 'right', '6%', 230], ['f-leaf-gold', 'left', '12%', 90]]
  };

  function initPageArt() {
    if (document.querySelector('.sky-hero, .portal-hero')) return;
    const host = document.querySelector('header.hero, main > header, .container > header');
    if (!host || host.querySelector('.page-art')) return;
    const page = (location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    const key = PAGE_ART[page] ? page : '_default';
    const art = document.createElement('div');
    art.className = 'page-art';
    art.setAttribute('aria-hidden', 'true');
    const items = [['sparkles', 'full', '0', 0]].concat(PAGE_ART[key]);
    items.forEach(([name, side, top, w], i) => {
      const img = document.createElement('img');
      img.alt = '';
      img.src = `/assets/cutouts/${name}.${name === 'sparkles' ? 'jpg' : 'png'}`;
      img.className = 'cut' + (name === 'sparkles' ? ' screen page-sparkles' : ' hide-sm' + (i === 1 ? ' float' : ''));
      if (name !== 'sparkles') {
        img.style.setProperty('--w', `clamp(${Math.round(w * .55)}px, ${Math.round(w / 12)}vw, ${w}px)`);
        img.style.setProperty('--y', top);
        img.style.insetInlineStart = side === 'right' ? 'auto' : '3%';
        img.style.insetInlineEnd = side === 'right' ? '3%' : 'auto';
        img.dataset.speed = side === 'right' ? '-0.08' : '0.1';
      }
      art.appendChild(img);
    });
    host.classList.add('has-art');
    host.prepend(art);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPageArt();
    initCutouts();
    applyTheme(localStorage.getItem('theme') === 'light' ? 'light' : 'dark');
    applySiteLogo();
    addAsset('link', 'mobile-navigation.css', 'data-mobile-navigation');
    addAsset('script', 'mobile-navigation.js', 'data-mobile-navigation-script');
    addAsset('script', 'reader-route-fix.js', 'data-reader-route-fix');
  });
})();
