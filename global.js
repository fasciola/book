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

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(localStorage.getItem('theme') === 'light' ? 'light' : 'dark');
    applySiteLogo();
    addAsset('link', 'mobile-navigation.css', 'data-mobile-navigation');
    addAsset('script', 'mobile-navigation.js', 'data-mobile-navigation-script');
    addAsset('script', 'reader-route-fix.js', 'data-reader-route-fix');
  });
})();
