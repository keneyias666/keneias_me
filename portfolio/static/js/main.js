/* Single-page portfolio interactions */
(function () {
  'use strict';

  const html = document.documentElement;
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleFloating = document.getElementById('themeToggleFloating');
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
    return localStorage.getItem(STORAGE_KEY) || 'dark';
  }

  function applyTheme(theme, animate) {
    if (animate) {
      body.classList.add('theme-transitioning');
      setTimeout(() => body.classList.remove('theme-transitioning'), 700);
    }
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    // Keep every switch in sync with the current theme.
    const isLight = theme === 'light';
    const switches = document.querySelectorAll('.ui-switch input[type="checkbox"]');
    switches.forEach((sw) => { sw.checked = isLight; });
  }

  body.classList.add('is-loading');
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    body.classList.add('reduce-motion');
  }
  applyTheme(getTheme(), false);

  // Wire every theme switch (nav + floating bottom-left). They are
  // checkboxes now, so we listen for 'change' and sync them.
  const themeSwitches = document.querySelectorAll('.ui-switch input[type="checkbox"]');
  themeSwitches.forEach((sw) => {
    sw.addEventListener('change', (e) => {
      // Checked = light, unchecked = dark (light is the "checked" state
      // because the sun is the "on" choice).
      const next = e.target.checked ? 'light' : 'dark';
      applyTheme(next, true);
      if (profileContainer) {
        profileContainer.classList.remove('is-swish');
        void profileContainer.offsetWidth;
        profileContainer.classList.add('is-swish');
        setTimeout(() => profileContainer.classList.remove('is-swish'), 700);
      }
    });
  });

  // ── Avatar parallax: the portrait follows the cursor with a small
  // offset and a smooth ease. Off on touch / reduced-motion.
  (function () {
    const profile = document.getElementById('profileContainer');
    if (!profile) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return; // touch devices

    let raf = 0;
    let tx = 0, ty = 0;        // target
    let cx = 0, cy = 0;        // current (eased)
    const MAX = 6;             // px max offset

    const onMove = (e) => {
      const rect = profile.getBoundingClientRect();
      const cx0 = rect.left + rect.width / 2;
      const cy0 = rect.top + rect.height / 2;
      const dx = (e.clientX - cx0) / (rect.width / 2);
      const dy = (e.clientY - cy0) / (rect.height / 2);
      tx = Math.max(-1, Math.min(1, dx)) * MAX * -1;
      ty = Math.max(-1, Math.min(1, dy)) * MAX * -1;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      profile.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    profile.addEventListener('pointerleave', onLeave);
  })();

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
    const fallback = document.getElementById('posterModalFallback');
    if (fallback) fallback.hidden = true;
    posterModalVideo.poster = '';
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

  // graceful fallback if a process video is missing or fails to load
  if (posterModalVideo) {
    posterModalVideo.addEventListener('error', () => {
      const trigger = document.querySelector('.poster-thumb-btn:focus') ||
        document.querySelector('.poster-thumb-btn');
      const stillSrc = trigger && trigger.getAttribute('data-poster-src');
      const fallback = document.getElementById('posterModalFallback');
      if (stillSrc) {
        posterModalVideo.poster = stillSrc;
        posterModalVideo.removeAttribute('src');
        posterModalVideo.load();
      }
      if (fallback) fallback.hidden = false;
    });
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

  // Chat controls. Only require the widget + fab + close to init — the
  // nav and mobile toggles are optional and added independently if present.
  if (chatWidget && chatFab && chatClose) {
    let chatOpen = false;
    let typewriterCancel = null; // set to a function to abort the running animation

    // ── Typewriter: types a structured welcome into the boot message
    // when the chat opens. Each line is typed character by character
    // with a small jitter. Honors prefers-reduced-motion (dumps final text).
    const reducedMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const BOOT_LINES = [
      {
        target: 'header',
        html: '<span class="terminal_user">[sys]</span><span class="terminal_bling"> assistant</span><span class="terminal_location"> ~ /chat</span>',
        delay: 120,
      },
      {
        target: 'body',
        text: "Hi there! I'm the portfolio assistant. Ask me anything — skills, projects, experience, contact.",
        delay: 80,
      },
      {
        target: 'prompt',
        html: '<span class="terminal_user">$</span><span class="terminal_bling"> type a question and press ↵</span>',
        delay: 80,
      },
    ];

    function typeLine(lineEl, content, isHTML, onDone) {
      lineEl.innerHTML = '';
      if (reducedMotion) {
        if (isHTML) lineEl.innerHTML = content;
        onDone && onDone();
        return;
      }

      // For HTML lines, parse them into plain-text tokens plus a parallel
      // array of segment descriptors so we can re-render the line with
      // spans as the visible text grows.
      let tokens = [];
      if (isHTML) {
        const tmp = document.createElement('div');
        tmp.innerHTML = content;
        const collect = (node, acc) => {
          node.childNodes.forEach((c) => {
            if (c.nodeType === Node.TEXT_NODE) {
              acc.push({ text: c.textContent, span: null });
            } else if (c.nodeType === Node.ELEMENT_NODE) {
              acc.push({ text: c.textContent, span: c.outerHTML });
            }
          });
        };
        collect(tmp, tokens);
      } else {
        tokens = [{ text: content, span: null }];
      }

      const fullText = tokens.map((t) => t.text).join('');
      let i = 0;
      const speed = () => 22 + Math.random() * 26; // 22-48 ms per char

      const tick = () => {
        if (typewriterCancel && typewriterCancel.cancelled) {
          lineEl.innerHTML = isHTML ? content : '';
          onDone && onDone();
          return;
        }
        if (i >= fullText.length) {
          lineEl.innerHTML = isHTML ? content : '';
          onDone && onDone();
          return;
        }
        i++;
        const visible = fullText.slice(0, i);
        if (isHTML) {
          let out = '';
          let remaining = visible.length;
          for (const t of tokens) {
            if (remaining <= 0) break;
            const take = Math.min(t.text.length, remaining);
            const piece = t.text.slice(0, take);
            remaining -= take;
            out += t.span ? t.span.replace(t.text, piece) : piece;
          }
          lineEl.innerHTML = out;
        } else {
          lineEl.textContent = visible;
        }
        setTimeout(tick, speed());
      };
      setTimeout(tick, speed());
    }

    function playBootSequence() {
      // Cancel any prior run
      if (typewriterCancel) typewriterCancel.cancelled = true;
      const cancel = { cancelled: false };
      typewriterCancel = cancel;

      const lines = [
        { el: document.querySelector('[data-type-line="header"]'), spec: BOOT_LINES[0] },
        { el: document.querySelector('[data-type-line="body"]'),   spec: BOOT_LINES[1] },
        { el: document.querySelector('[data-type-line="prompt"]'), spec: BOOT_LINES[2] },
      ];
      if (!lines.every((l) => l.el)) return;

      // Reset all lines before starting
      lines.forEach((l) => { l.el.innerHTML = ''; });
      chatMessages.scrollTop = 0;

      // Chain the three lines with a small inter-line pause
      const run = (i) => {
        if (i >= lines.length || cancel.cancelled) return;
        const { el, spec } = lines[i];
        setTimeout(() => {
          typeLine(el, spec.html || spec.text, !!spec.html, () => run(i + 1));
        }, spec.delay || 0);
      };
      run(0);
    }

    const openChat = () => {
      chatOpen = true;
      chatWidget.classList.add('is-open');
      chatWidget.setAttribute('aria-hidden', 'false');
      // Replay the typewriter welcome every time the chat opens.
      playBootSequence();
    };
    const closeChatWidget = () => {
      chatOpen = false;
      chatWidget.classList.remove('is-open');
      chatWidget.setAttribute('aria-hidden', 'true');
      if (typewriterCancel) typewriterCancel.cancelled = true;
    };
    chatFab.addEventListener('click', () => (chatOpen ? closeChatWidget() : openChat()));
    chatClose.addEventListener('click', closeChatWidget);

    // Escape closes the chat when it has focus or is open. Skip if the
    // user is typing in a real input/textarea elsewhere on the page.
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !chatOpen) return;
      const active = document.activeElement;
      const tag = active && active.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (active && active.isContentEditable)) {
        // If focus is on the chat input itself, Escape still closes the chat.
        if (active !== chatInput) return;
      }
      e.preventDefault();
      closeChatWidget();
      if (chatFab) chatFab.focus();
    });
    if (chatToggleNav) {
      chatToggleNav.addEventListener('click', () => (chatOpen ? closeChatWidget() : openChat()));
    }
    const chatToggleMobile = document.getElementById('chatToggleMobile');
    if (chatToggleMobile) {
      chatToggleMobile.addEventListener('click', () => {
        // Close the mobile drawer first, then open the chat after the slide-out.
        const drawer = document.getElementById('mobileMenuDrawer');
        const overlay = document.getElementById('mobileMenuOverlay');
        if (drawer) drawer.classList.remove('is-open');
        if (overlay) overlay.classList.remove('is-visible');
        setTimeout(() => openChat(), 200);
      });
    }

    if (chatInput && chatMessages) {
      // Terminal-style message rendering. User prompts render with
      // '> user ~ /chat' and a '>' glyph; bot replies render with
      // '[sys] assistant' tag and the body in 'bling' (neutral) color.
      const escape = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      const time = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const addUserMsg = (txt) => {
        const wrap = document.createElement('div');
        wrap.className = 'chat-message chat-message--user';
        wrap.innerHTML = `<p class="output_text"><span class="terminal_user">[${escape(time())}]</span><span class="terminal_bling"> user</span><span class="terminal_location"> ~ /chat</span><span class="terminal_bling"> $</span><span class="terminal_bling"> ${escape(txt)}</span></p>`;
        chatMessages.appendChild(wrap);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      };

      const addBotMsg = (txt) => {
        const wrap = document.createElement('div');
        wrap.className = 'chat-message chat-message--bot';
        wrap.innerHTML = `<p class="output_text"><span class="terminal_user">[${escape(time())}]</span><span class="terminal_user">[sys]</span><span class="terminal_bling"> assistant</span></p><p class="output_text terminal_bling" style="margin-top: 6px;">${escape(txt)}</p>`;
        chatMessages.appendChild(wrap);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      };

      const addTyping = () => {
        const wrap = document.createElement('div');
        wrap.className = 'chat-message chat-message--bot chat-typing';
        wrap.innerHTML = `<p class="output_text"><span class="terminal_user">[sys]</span><span class="terminal_bling"> assistant</span><span class="terminal_location"> ~ /chat</span><span class="terminal_bling"> thinking</span><span class="terminal_bling"> <span class="terminal-dots"><i>.</i><i>.</i><i>.</i></span></span></p>`;
        chatMessages.appendChild(wrap);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return wrap;
      };

      let busy = false;
      const send = async () => {
        const q = chatInput.value.trim();
        if (!q || busy) return;
        busy = true;
        chatInput.value = '';
        addUserMsg(q);
        const typingEl = addTyping();
        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: q }),
          });
          const data = await res.json();
          typingEl.remove();
          addBotMsg(data.answer || 'sorry, i could not process that.');
        } catch (_) {
          typingEl.remove();
          addBotMsg('⚠️  connection error. please try again.');
        } finally {
          busy = false;
          chatInput.focus();
        }
      };
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          send();
        }
      });
      // Click anywhere on the prompt to focus the input
      const prompt = document.querySelector('.terminal_input');
      if (prompt) {
        prompt.addEventListener('click', (e) => {
          if (e.target === prompt) chatInput.focus();
        });
      }

      // Track the blinking caret against the actual typed text width.
      // We create a hidden clone span with the same font + size as the
      // input, fill it with the current value, read its width, and
      // absolutely position the existing .terminal_cursor there.
      const cursor = document.querySelector('.terminal_prompt .terminal_cursor');
      if (cursor && chatInput) {
        const measure = document.createElement('span');
        measure.setAttribute('aria-hidden', 'true');
        measure.style.cssText = `
          position: absolute;
          visibility: hidden;
          white-space: pre;
          pointer-events: none;
          left: -9999px;
          top: 0;
        `;
        const inputStyle = getComputedStyle(chatInput);
        measure.style.font = inputStyle.font;
        measure.style.letterSpacing = inputStyle.letterSpacing;
        measure.style.fontFamily = inputStyle.fontFamily;
        measure.style.fontSize = inputStyle.fontSize;
        measure.style.fontWeight = inputStyle.fontWeight;
        document.body.appendChild(measure);

        const positionCaret = () => {
          const promptRect = prompt.getBoundingClientRect();
          const promptStyle = getComputedStyle(prompt);
          const padLeft = parseFloat(promptStyle.paddingLeft) || 0;
          // Find the $ prompt glyph so we can start the caret after it.
          const dollarEl = prompt.querySelector('.terminal_user');
          const dollarRect = dollarEl ? dollarEl.getBoundingClientRect() : null;
          // End of $ + 6px gap (the flex gap on .terminal_prompt).
          const startX = (dollarRect ? dollarRect.right - promptRect.left : 0) + 6;
          // Measure the typed text width.
          measure.textContent = chatInput.value || ' ';
          const textW = measure.offsetWidth;
          // Right-edge clamp: if the typed text overflows the visible
          // input, pin the caret to the right edge of the input.
          const inputRect = chatInput.getBoundingClientRect();
          const inputRight = inputRect.right - promptRect.left;
          const inputLeft = inputRect.left - promptRect.left;
          const visibleRight = inputRight - 4; // 4px breathing room
          let caretX = startX + textW;
          if (caretX > visibleRight) caretX = visibleRight;
          if (caretX < inputLeft) caretX = inputLeft;
          cursor.style.left = caretX + 'px';
        };

        chatInput.addEventListener('input', positionCaret);
        chatInput.addEventListener('keydown', positionCaret);
        chatInput.addEventListener('focus', positionCaret);
        chatInput.addEventListener('blur', () => {
          cursor.style.opacity = '0';
        });
        chatInput.addEventListener('focus', () => {
          cursor.style.opacity = '';
        });
        // Re-measure when fonts load or the prompt resizes.
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(positionCaret);
        }
        window.addEventListener('resize', positionCaret);
        // Initial position (handles the empty state + restored text).
        requestAnimationFrame(positionCaret);
      }
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
  let lastFocus = null;

  function focusableInLightbox() {
    return Array.from(
      lightbox.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('hidden') && el.offsetParent !== null);
  }

  function openLightbox(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    lastFocus = document.activeElement;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => closeBtn && closeBtn.focus());
  }
  function closeLightbox(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  // Use both pointerdown and click, with preventDefault on pointerdown, so
  // the click never propagates to anything that might think the button is
  // an anchor or might cause a navigation/scroll.
  card.addEventListener('pointerdown', (e) => e.preventDefault());
  card.addEventListener('click', openLightbox);

  // Capture-phase listener so we get the close before any ancestor that
  // might also handle the click.
  if (backdrop) {
    backdrop.addEventListener('click', closeLightbox, true);
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox, true);
  }
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      closeLightbox();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = focusableInLightbox();
    if (items.length === 0) return;
    const first = items[0];
    const last  = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
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

/* ── Design Reel Ambient ──────────────────────────────────────── */
/* The webm is a fixed, autoplaying, muted, looped backdrop behind the
   whole page. All the heavy lifting is in CSS. The only thing JS has to
   do is gently nudge playback on the first user interaction (some
   browsers block silent autoplay on first paint), and fall back to a
   first-frame poster on error. */
(function () {
  const reel = document.getElementById('reelAmbient');
  if (!reel) return;

  const tryPlay = () => {
    const p = reel.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  // First user interaction usually satisfies autoplay policies. After
  // any of these, we retry play once. After that, the video is in the
  // autoplay-allowed state and will keep looping on its own.
  const nudge = () => {
    tryPlay();
    document.removeEventListener('pointerdown', nudge);
    document.removeEventListener('keydown', nudge);
    document.removeEventListener('touchstart', nudge);
  };
  document.addEventListener('pointerdown', nudge, { once: true, passive: true });
  document.addEventListener('keydown', nudge, { once: true });
  document.addEventListener('touchstart', nudge, { once: true, passive: true });

  // If the source is missing or can't decode, hide the video and let
  // the page's solid background read as the design.
  reel.addEventListener('error', () => {
    reel.style.display = 'none';
  });
})();

