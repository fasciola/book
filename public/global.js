/* Shared runtime for every static book page. */
(function () {
  'use strict';
  if (window.__bookSharedRuntimeLoaded) return;
  window.__bookSharedRuntimeLoaded = true;

  function addAsset(tag, url, marker) {
    if (document.querySelector('[' + marker + ']')) return;
    var node = document.createElement(tag);
    if (tag === 'link') {
      node.rel = 'stylesheet';
      node.href = url;
    } else {
      node.src = url;
      node.defer = true;
    }
    node.setAttribute(marker, 'true');
    document.head.appendChild(node);
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.querySelectorAll('#themeIcon').forEach(function (icon) {
      icon.classList.toggle('fa-sun', theme === 'dark');
      icon.classList.toggle('fa-moon', theme !== 'dark');
    });
  }

  window.toggleTheme = function () {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  };

  function addLogoStyles() {
    if (document.getElementById('book-logo-style')) return;
    var style = document.createElement('style');
    style.id = 'book-logo-style';
    style.textContent = 'nav .logo{display:inline-flex;align-items:center;min-width:0}nav .logo .site-logo-image{display:block;width:auto;height:48px;max-width:min(320px,46vw);object-fit:contain}nav .logo.has-site-logo>*:not(.site-logo-image){display:none!important}@media(max-width:992px){nav .logo .site-logo-image{height:38px;max-width:min(240px,56vw)}}';
    document.head.appendChild(style);
  }

  function addSiteLogo() {
    addLogoStyles();
    document.querySelectorAll('nav .logo').forEach(function (logo) {
      if (logo.querySelector('.site-logo-image')) return;
      var image = document.createElement('img');
      image.className = 'site-logo-image';
      image.src = '/logo.png';
      image.alt = 'Spare Some Minutes of Your Time';
      image.decoding = 'async';
      image.addEventListener('load', function () { logo.classList.add('has-site-logo'); }, { once: true });
      image.addEventListener('error', function () { image.remove(); }, { once: true });
      logo.prepend(image);
    });
  }

  function fixVideoPaths() {
    document.querySelectorAll('video source[src="back.mp4"]').forEach(function (source) {
      source.src = '/videos/back.mp4';
      if (source.parentElement) source.parentElement.load();
    });
  }

  function start() {
    setTheme(localStorage.getItem('theme') === 'light' ? 'light' : 'dark');
    addSiteLogo();
    fixVideoPaths();
    addAsset('link', '/mobile-navigation.css', 'data-book-mobile-css');
    addAsset('script', '/mobile-navigation.js', 'data-book-mobile-js');
    addAsset('script', '/reader-route-fix.js', 'data-book-reader-routes');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
