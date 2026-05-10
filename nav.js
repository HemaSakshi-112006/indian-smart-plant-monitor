/* ═══════════════════════════════════════════════════════════
   VanaRaksha — nav.js
   Shared Side Navigation Logic · v1.0
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  function initNav() {
    const toggle  = document.getElementById('nav-toggle');
    const nav     = document.getElementById('side-nav');
    const overlay = document.getElementById('nav-overlay');

    if (!toggle || !nav || !overlay) return;

    function openNav() {
      nav.classList.add('open');
      overlay.classList.add('show');
      toggle.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      nav.classList.remove('open');
      overlay.classList.remove('show');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      nav.classList.contains('open') ? closeNav() : openNav();
    });

    overlay.addEventListener('click', closeNav);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    // Mark the active link based on current filename
    var currentPage = window.location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && currentPage === href) {
        link.classList.add('active');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }

})();
