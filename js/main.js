/* ============================================
   main.js — Interactivity & Behavior
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. NAVBAR: SCROLL SHADOW ──────────────────────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });


  // ── 2. MOBILE MENU TOGGLE ────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.textContent = isOpen ? '✕' : '☰';
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.textContent = '☰';
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }


  // ── 3. SCROLL REVEAL ANIMATION ──────────────────────────
  const revealTargets = document.querySelectorAll(
    '.service-card, .step, .testimonial-card, .why-item, .stat'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Set initial hidden state, then observe
  revealTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
    revealObserver.observe(el);
  });

  // Add revealed class styles via JS (avoids CSS dependency)
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      .revealed {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    </style>
  `);


  // ── 4. ACTIVE NAV LINK ON SCROLL ─────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // Style active nav link
  document.head.insertAdjacentHTML('beforeend', `
    <style>
      .nav-links a.active {
        color: var(--white) !important;
      }
    </style>
  `);


  // ── 5. SMOOTH MARQUEE PAUSE ON HOVER ─────────────────────
  const marqueeInner = document.querySelector('.marquee-inner');
  const marqueeBar   = document.querySelector('.marquee-bar');

  if (marqueeBar && marqueeInner) {
    marqueeBar.addEventListener('mouseenter', () => {
      marqueeInner.style.animationPlayState = 'paused';
    });
    marqueeBar.addEventListener('mouseleave', () => {
      marqueeInner.style.animationPlayState = 'running';
    });
  }


  // ── 6. HERO STATS COUNTER ANIMATION ─────────────────────
  const statNums = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const rawText = el.textContent;
      const numMatch = rawText.match(/[\d,]+/);
      if (!numMatch) return;

      const target = parseInt(numMatch[0].replace(',', ''));
      const suffix = rawText.replace(/[\d,]+/, '').trim();
      const duration = 1200;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        el.textContent = current.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

});
