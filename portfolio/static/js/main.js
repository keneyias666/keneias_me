/* Single-page portfolio interactions */
(function () {
  'use strict';

  const html = document.documentElement;
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const leafTransition = document.getElementById('leafTransition');
  const profileContainer = document.querySelector('.profile-container');
  const posterModal = document.getElementById('posterModal');
  const posterModalVideo = document.getElementById('posterModalVideo');
  const posterModalVideoSource = document.getElementById('posterModalVideoSource');
  const posterModalTitle = document.getElementById('posterModalTitle');
  const posterModalClose = document.getElementById('posterModalClose');
  const chatWidget = document.getElementById('chatWidget');
  const chatFab = document.getElementById('chatFab');
  const chatClose = document.getElementById('chatClose');
  const chatToggleNav = document.getElementById('chatToggleNav');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const STORAGE_KEY = 'portfolio-theme';

  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) || 'light';
  }

  function applyTheme(theme, animate) {
    if (animate) {
      body.classList.add('theme-transitioning');
      setTimeout(() => body.classList.remove('theme-transitioning'), 700);
    }
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  body.classList.add('is-loading');
  applyTheme(getTheme(), false);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
      if (profileContainer) {
        profileContainer.classList.remove('is-swish');
        void profileContainer.offsetWidth;
        profileContainer.classList.add('is-swish');
        setTimeout(() => profileContainer.classList.remove('is-swish'), 700);
      }
    });
  }

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  if (finePointer && cursorDot && cursorRing) {
    cursorDot.classList.add('is-visible');
    cursorRing.classList.add('is-visible');
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });
    (function animateRing() {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    })();
    document.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hovering'));
    });
  }

  function spawnEmojiBurst(x, y, emoji, color) {
    if (!leafTransition) return;
    for (let i = 0; i < 12; i++) {
      const el = document.createElement('span');
      el.className = 'leaf-emoji';
      el.textContent = emoji || '🍁';
      const size = 12 + Math.random() * 14;
      const dx = (Math.random() > 0.5 ? 1 : -1) * (18 + Math.random() * 90);
      const dy = -24 - Math.random() * 100;
      const rot = (Math.random() > 0.5 ? 1 : -1) * (90 + Math.random() * 260);
      const dur = 650 + Math.random() * 650;
      el.style.setProperty('--leaf-size', `${size}px`);
      el.style.setProperty('--leaf-dx', `${dx}px`);
      el.style.setProperty('--leaf-dy', `${dy}px`);
      el.style.setProperty('--leaf-rot', `${rot}deg`);
      el.style.setProperty('--leaf-dur', `${dur}ms`);
      if (color) el.style.color = color;
      el.style.left = `${x + (Math.random() * 22 - 11)}px`;
      el.style.top = `${y + (Math.random() * 14 - 7)}px`;
      leafTransition.appendChild(el);
      setTimeout(() => el.remove(), dur + 120);
    }
  }

  document.querySelectorAll('.emoji-burst-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const rect = btn.getBoundingClientRect();
      spawnEmojiBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, '☁️', '#7aa2ac');
    });
  });

  // smooth scroll nav + click animation
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      spawnEmojiBurst(e.clientX || 0, e.clientY || 0, '☁️', '');
      target.scrollIntoView({ behavior: 'smooth' });
      try { history.pushState(null, '', href); } catch (_) {}
    });
  });

  // process video modal
  function openPosterModal(videoSrc, title) {
    if (!posterModal || !posterModalVideo || !posterModalVideoSource || !posterModalTitle) return;
    posterModalVideoSource.src = videoSrc || '/static/videos/artwork-process.mp4';
    posterModalVideo.load();
    posterModalVideo.currentTime = 0;
    posterModalTitle.textContent = title || 'Poster';
    posterModal.classList.add('is-open');
    posterModal.setAttribute('aria-hidden', 'false');
    const playPromise = posterModalVideo.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  }
  function closePosterModal() {
    if (!posterModal) return;
    if (posterModalVideo) {
      posterModalVideo.pause();
      posterModalVideo.currentTime = 0;
    }
    posterModal.classList.remove('is-open');
    posterModal.setAttribute('aria-hidden', 'true');
  }
  document.querySelectorAll('.poster-thumb-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-process-video');
      const title = btn.getAttribute('data-poster-title');
      openPosterModal(src, `${title || 'Artwork'} Process`);
    });
  });
  if (posterModalClose) posterModalClose.addEventListener('click', closePosterModal);
  if (posterModal) posterModal.addEventListener('click', (e) => { if (e.target === posterModal) closePosterModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePosterModal(); });

  // simple chat controls (if widget exists)
  if (chatWidget && chatFab && chatClose && chatToggleNav) {
    let chatOpen = false;
    const openChat = () => {
      chatOpen = true;
      chatWidget.classList.add('is-open');
      chatWidget.setAttribute('aria-hidden', 'false');
    };
    const closeChatWidget = () => {
      chatOpen = false;
      chatWidget.classList.remove('is-open');
      chatWidget.setAttribute('aria-hidden', 'true');
    };
    chatFab.addEventListener('click', () => (chatOpen ? closeChatWidget() : openChat()));
    chatClose.addEventListener('click', closeChatWidget);
    chatToggleNav.addEventListener('click', () => (chatOpen ? closeChatWidget() : openChat()));

    if (chatSend && chatInput && chatMessages) {
      const time = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const addMsg = (txt, role) => {
        const wrap = document.createElement('div');
        wrap.className = `chat-message chat-message--${role}`;
        wrap.innerHTML = `<div class="chat-bubble"></div><span class="chat-timestamp">${time()}</span>`;
        wrap.querySelector('.chat-bubble').textContent = txt;
        chatMessages.appendChild(wrap);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      };
      let busy = false;
      const send = async () => {
        const q = chatInput.value.trim();
        if (!q || busy) return;
        busy = true;
        chatSend.disabled = true;
        chatInput.value = '';
        addMsg(q, 'user');
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: q }),
          });
          const data = await res.json();
          addMsg(data.answer || 'Sorry, I could not process that.', 'bot');
        } catch (_) {
          addMsg('⚠️ Connection error. Please try again.', 'bot');
        } finally {
          busy = false;
          chatSend.disabled = false;
        }
      };
      chatSend.addEventListener('click', send);
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          send();
        }
      });
    }
  }

  // reveal-on-scroll
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.section-header, .skill-card, .project-row, .info-card, .feature-card, .chat-cta-card, .contact-link').forEach((el) => {
    if (!el.classList.contains('reveal-item')) el.classList.add('reveal-scroll');
  });
  document.querySelectorAll('.reveal-scroll').forEach((el) => revealObserver.observe(el));

  // active nav section highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach((l) => {
        l.style.color = l.getAttribute('href') === `#${id}` ? 'var(--text-primary)' : 'var(--text-secondary)';
      });
    });
  }, { threshold: 0.4 });
  sections.forEach((s) => sectionObserver.observe(s));

  window.addEventListener('load', () => {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
      window.scrollTo(0, 0);
    }
    body.style.opacity = '1';
    requestAnimationFrame(() => body.classList.remove('is-loading'));
  });

  // ── Skills Tab Switching ─────────────────────────────────────
  const skillsTabs = document.querySelectorAll('.skills-tab');
  const skillsPanels = document.querySelectorAll('.skills-panel');
  skillsTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillsTabs.forEach((t) => t.classList.remove('is-active'));
      skillsPanels.forEach((p) => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      const panel = document.getElementById('tab-' + tab.dataset.tab);
      if (panel) {
        panel.classList.add('is-active');
        // re-trigger bar animations
        panel.querySelectorAll('.sk-bar').forEach((bar) => {
          bar.style.animation = 'none';
          void bar.offsetWidth;
          bar.style.animation = '';
        });
      }
    });
  });
})();

/* ── Resume Lightbox ─────────────────────────────────────────── */
(function () {
  const card     = document.getElementById('resumeCard');
  const lightbox = document.getElementById('resumeLightbox');
  if (!card || !lightbox) return;

  const backdrop = lightbox.querySelector('.resume-lightbox-backdrop');
  const closeBtn = document.getElementById('resumeLightboxClose');

  function openLightbox() {
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  card.addEventListener('click', openLightbox);
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(); }
  });
  backdrop  && backdrop.addEventListener('click', closeLightbox);
  closeBtn  && closeBtn.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
})();

/* ── Mobile Menu ───────────────────────────────────────────────── */
(function () {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const chatToggleMobile = document.getElementById('chatToggleMobile');

  function openMobileMenu() {
    if (mobileMenuDrawer) mobileMenuDrawer.classList.add('is-open');
    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.add('is-visible');
      mobileMenuOverlay.style.display = 'block';
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileMenuDrawer) mobileMenuDrawer.classList.remove('is-open');
    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.remove('is-visible');
      setTimeout(() => {
        if (mobileMenuOverlay && !mobileMenuOverlay.classList.contains('is-visible')) {
          mobileMenuOverlay.style.display = 'none';
        }
      }, 300);
    }
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (mobileMenuDrawer && mobileMenuDrawer.classList.contains('is-open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Also toggle mobile chat button
  if (chatToggleMobile && document.getElementById('chatWidget')) {
    chatToggleMobile.addEventListener('click', () => {
      closeMobileMenu();
      setTimeout(() => {
        document.getElementById('chatWidget').classList.add('is-open');
      }, 350);
    });
  }
})();
