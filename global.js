/* ============================================
   SPARE SOME MINUTES OF YOUR TIME
   Global JS Helper Actions
   ============================================ */

(function() {
  'use strict';

  // Toggle mobile navigation menu
  window.toggleMenu = function() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
      navLinks.classList.toggle('active');
    }
  };

  // Toggle Dark/Light themes
  window.toggleTheme = function() {
    const doc = document.documentElement;
    const isDark = doc.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    
    applyTheme(nextTheme);
  };

  // Internal application of theme state selection
  function applyTheme(theme) {
    const doc = document.documentElement;
    const icons = document.querySelectorAll('#themeIcon');
    
    if (theme === 'dark') {
      doc.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      icons.forEach(icon => {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
      });
    } else {
      doc.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      icons.forEach(icon => {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
      });
    }
  }

  // Pre-load correct saved theme on document initialization
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    
    // Default to the majestic Sophisticated Dark brand theme
    if (savedTheme === 'light') {
      applyTheme('light');
    } else {
      applyTheme('dark');
    }
  }

  // Bind key actions on DOM Load
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();

    // Close mobile menu on clicking any links or pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const navLinks = document.getElementById('navLinks');
        if (navLinks && navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }
      }
    });
  });

})();
