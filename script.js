/* ==========================================================================
   PORTFOLIO SCRIPT
   Handles: mobile navigation, sticky header state, scrollspy, scroll-reveal
   animations, animated skill meters, back-to-top control, and a client-side
   contact form with validation and a simulated submit flow.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initStickyHeader();
  initSmoothScrollLinks();
  initScrollSpy();
  initRevealOnScroll();
  initBackToTop();
  initContactForm();
  initFooterYear();
});

/* ---------- Mobile hamburger navigation ---------- */
function initMobileNav() {
  const hamburger = document.getElementById('hamburgerBtn');
  const nav = document.getElementById('primaryNav');

  if (!hamburger || !nav) return;

  const closeMenu = () => {
    hamburger.classList.remove('is-open');
    nav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const openMenu = () => {
    hamburger.classList.add('is-open');
    nav.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close the menu whenever a nav link is clicked (mobile)
  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close the menu on Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  // Close the menu if the viewport is resized back to desktop width
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && nav.classList.contains('is-open')) {
      closeMenu();
    }
  });
}

/* ---------- Sticky header shadow/background state ---------- */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const updateHeaderState = () => {
    if (window.scrollY > 12) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

/* ---------- Smooth scroll for in-page anchor links ---------- */
function initSmoothScrollLinks() {
  const header = document.getElementById('siteHeader');
  const headerOffset = header ? header.offsetHeight : 0;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();

      const targetPosition =
        targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset + 1;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      // Keep the URL hash in sync without jumping
      history.pushState(null, '', targetId);
    });
  });
}

/* ---------- Scrollspy: highlight the active nav link ---------- */
function initScrollSpy() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  const linkForSection = (id) =>
    document.querySelector(`.nav__link[href="#${id}"]`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkForSection(entry.target.id);
        if (!link) return;

        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    },
    {
      rootMargin: '-45% 0px -50% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Scroll-reveal for sections + animated skill meters ---------- */
function initRevealOnScroll() {
  const revealEls = document.querySelectorAll('.reveal');
  const skillFills = document.querySelectorAll('.skill-meter__fill');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));

    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const fillEl = entry.target;
            const level = fillEl.getAttribute('data-level') || '0';
            // Delay slightly so the reveal transition and fill feel sequenced
            requestAnimationFrame(() => {
              fillEl.style.width = `${level}%`;
            });
            observer.unobserve(fillEl);
          }
        });
      },
      { threshold: 0.4 }
    );

    skillFills.forEach((el) => skillObserver.observe(el));
  } else {
    // Fallback: reveal everything immediately if IntersectionObserver is unsupported
    revealEls.forEach((el) => el.classList.add('is-visible'));
    skillFills.forEach((el) => {
      el.style.width = `${el.getAttribute('data-level') || '0'}%`;
    });
  }
}

/* ---------- Back-to-top button ---------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Contact form: validation + simulated submit ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (!form || !statusEl || !submitBtn) return;

  const fields = {
    name: {
      el: form.querySelector('#name'),
      validate: (value) => value.trim().length >= 2,
      message: 'Please enter your name (at least 2 characters).',
    },
    email: {
      el: form.querySelector('#email'),
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
      message: 'Please enter a valid email address.',
    },
    subject: {
      el: form.querySelector('#subject'),
      validate: (value) => value.trim().length >= 3,
      message: 'Please enter a subject (at least 3 characters).',
    },
    message: {
      el: form.querySelector('#message'),
      validate: (value) => value.trim().length >= 10,
      message: 'Please enter a message (at least 10 characters).',
    },
  };

  const setFieldError = (key, message) => {
    const field = fields[key];
    const row = field.el.closest('.form-row');
    const errorEl = form.querySelector(`[data-error-for="${key}"]`);

    if (message) {
      row.classList.add('has-error');
      if (errorEl) errorEl.textContent = message;
    } else {
      row.classList.remove('has-error');
      if (errorEl) errorEl.textContent = '';
    }
  };

  const validateField = (key) => {
    const field = fields[key];
    const isValid = field.validate(field.el.value);
    setFieldError(key, isValid ? '' : field.message);
    return isValid;
  };

  // Validate on blur for immediate, non-annoying feedback
  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      const row = fields[key].el.closest('.form-row');
      if (row.classList.contains('has-error')) {
        validateField(key);
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const allValid = Object.keys(fields)
      .map((key) => validateField(key))
      .every(Boolean);

    if (!allValid) {
      statusEl.textContent = 'Please correct the highlighted fields above.';
      statusEl.className = 'form-status is-error';
      return;
    }

    // Simulate an async submission. Replace this block with a real request,
    // e.g. fetch('/api/contact', { method: 'POST', body: new FormData(form) })
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn__label').textContent = 'Sending...';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    setTimeout(() => {
      statusEl.textContent = 'Message sent — thank you! I\u2019ll get back to you soon.';
      statusEl.className = 'form-status is-success';
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn__label').textContent = 'Send Message';
      form.reset();
      Object.keys(fields).forEach((key) => setFieldError(key, ''));
    }, 1100);
  });
}

/* ---------- Footer current year ---------- */
function initFooterYear() {
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
