/* Shared theme controls and mobile navigation loader */
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

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(localStorage.getItem('theme') === 'light' ? 'light' : 'dark');
    addAsset('link', 'mobile-navigation.css', 'data-mobile-navigation');
    addAsset('script', 'mobile-navigation.js', 'data-mobile-navigation-script');
    addAsset('script', 'reader-route-fix.js', 'data-reader-route-fix');
  });
})();
