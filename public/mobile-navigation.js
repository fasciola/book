(function () {
  'use strict';
  if (window.__mobileMenuReady) return;
  window.__mobileMenuReady = true;

  var media = window.matchMedia('(max-width: 992px)');
  var items = [];

  function topFor(nav) {
    document.documentElement.style.setProperty('--book-mobile-menu-top', Math.round(nav.getBoundingClientRect().bottom) + 'px');
  }

  function closeAll() {
    items.forEach(function (item) { item.set(false); });
  }

  function init(nav, index) {
    var links = nav.querySelector('.nav-links');
    if (!links) return;
    var menu = nav.querySelector('.menu-icon');
    if (!menu) return;

    if (!links.id) links.id = 'book-nav-links-' + index;
    menu.removeAttribute('onclick');
    menu.setAttribute('role', 'button');
    menu.setAttribute('tabindex', '0');
    menu.setAttribute('aria-controls', links.id);

    var item = {
      set: function (open) {
        open = Boolean(open) && media.matches;
        if (open) {
          items.forEach(function (other) { if (other !== item) other.set(false); });
          topFor(nav);
        }
        nav.classList.toggle('menu-is-open', open);
        links.classList.toggle('active', open);
        menu.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
        var icon = menu.querySelector('i');
        if (icon) {
          icon.classList.toggle('fa-bars', !open);
          icon.classList.toggle('fa-xmark', open);
        }
      },
      open: function () { return nav.classList.contains('menu-is-open'); },
      nav: nav
    };
    items.push(item);

    function toggle(event) {
      if (event) { event.preventDefault(); event.stopPropagation(); }
      item.set(!item.open());
    }

    menu.addEventListener('click', toggle);
    menu.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') toggle(event);
    });
    links.addEventListener('click', function (event) {
      if (event.target.closest('a')) item.set(false);
    });
  }

  function start() {
    document.querySelectorAll('nav').forEach(init);
    window.toggleMenu = function () { if (items[0]) items[0].set(!items[0].open()); };

    document.addEventListener('pointerdown', function (event) {
      items.forEach(function (item) {
        if (item.open() && !item.nav.contains(event.target)) item.set(false);
      });
    }, true);
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeAll(); });
    window.addEventListener('resize', function () {
      if (!media.matches) closeAll();
      items.forEach(function (item) { topFor(item.nav); });
    });
    window.addEventListener('scroll', function () {
      items.forEach(function (item) { if (item.open()) topFor(item.nav); });
    }, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
