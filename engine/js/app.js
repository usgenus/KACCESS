/* ==========================================================================
   INTERACTIVE APP SCRIPTS & SCROLL REVEAL ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initForms();
  initModal();
  initCanvas();
  initScrollReveal();
  initHeroVideo();
});

// 1. Navigation & Mobile Drawer
function initNavbar() {
  const header = document.getElementById('site-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Drawer Toggle
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeMenuBtn && mobileMenu) {
    closeMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
}

// 2. Scroll-Triggered Animated Slide-In Engine
function initScrollReveal() {
  const revealTargets = document.querySelectorAll(`
    .spacex-section,
    .section-header-minimal,
    .hero-content,
    .hero-metrics-grid .metric-hud-box,
    .split-text-side,
    .split-media-side,
    .engine-card,
    .hybrid-card,
    .audience-item,
    .table-responsive-wrapper,
    .arch-card,
    .b2b-executive-visual-banner,
    .intake-point-card,
    .intake-interactive-app,
    .roadmap-node,
    .consultancy-box,
    .portfolio-hero,
    .portfolio-item-card,
    .compact-content-card,
    .team-member-card,
    .team-insight-card,
    .team-solution-banner,
    .team-advantage-card
  `);

  revealTargets.forEach((el, index) => {
    if (!el.classList.contains('reveal-init')) {
      el.classList.add('reveal-init');
      if (el.classList.contains('engine-card') || el.classList.contains('arch-card') || el.classList.contains('roadmap-node') || el.classList.contains('portfolio-item-card') || el.classList.contains('team-member-card') || el.classList.contains('compact-content-card') || el.classList.contains('team-insight-card') || el.classList.contains('team-advantage-card')) {
        const staggerIndex = (index % 4) + 1;
        el.classList.add(`delay-${staggerIndex}`);
      }
    }
  });

  const observerOptions = {
    threshold: 0.08,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealTargets.forEach(el => revealObserver.observe(el));
}

// 3. Metric Counter Animation (High-performance 60fps RAF batched loop)
function initCounters() {
  const counters = Array.from(document.querySelectorAll('.counter'));
  if (!counters.length) return;

  const counterData = counters.map(counter => ({
    el: counter,
    target: +counter.getAttribute('data-target') || 0,
    lastVal: -1
  }));

  let animated = false;

  function runCounterAnimation() {
    const duration = 1600; // ms
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Quintic ease-out for ultra smooth deceleration without sudden jumps
      const ease = 1 - Math.pow(1 - progress, 4);

      const allDone = progress >= 1;

      for (let i = 0; i < counterData.length; i++) {
        const item = counterData[i];
        const current = allDone ? item.target : Math.round(item.target * ease);
        if (current !== item.lastVal) {
          item.el.textContent = current.toLocaleString();
          item.lastVal = current;
        }
      }

      if (!allDone) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counterObserver.disconnect();
        runCounterAnimation();
      }
    });
  }, { threshold: 0.15 });

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    counterObserver.observe(heroSection);
  }
}

// 4. Forms Handler - Transmit directly to njaccessportal@gmail.com
function initForms() {
  const leadForm = document.getElementById('executive-lead-form');
  const intakeConf = document.getElementById('intake-confirmation');

  if (leadForm && intakeConf) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submit-intake-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'TRANSMITTING INQUIRY...';
      }

      const name = document.getElementById('lead-name')?.value || '';
      const org = document.getElementById('lead-org')?.value || '';
      const goal = document.getElementById('lead-goal')?.value || '';
      const demo = document.getElementById('lead-demo')?.value || '';
      const scope = document.getElementById('lead-scope')?.value || '';
      const email = document.getElementById('lead-email')?.value || '';

      const formData = new FormData(leadForm);
      formData.append('_subject', '[NJ Access Portal] Executive Inquiry: ' + name + ' (' + org + ')');
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');

      let sent = false;
      try {
        const response = await fetch('https://formsubmit.co/ajax/njaccessportal@gmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });
        const result = await response.json();
        if (result.success === 'true' || result.success === true) {
          sent = true;
        }
      } catch (err) {
        console.warn('FormSubmit AJAX status:', err);
      }

      const mailtoUrl = 'mailto:njaccessportal@gmail.com?subject=' + encodeURIComponent('[NJ Access Portal Inquiry] ' + name + ' (' + org + ')') + '&body=' + encodeURIComponent('Executive Name: ' + name + '\nOrganization: ' + org + '\nEmail: ' + email + '\nGoal: ' + goal + '\nDemographics: ' + demo + '\nScope: ' + scope);

      intakeConf.innerHTML = '✓ REQUEST TRANSMITTED // Inquiry queued for <strong>njaccessportal@gmail.com</strong>.<br><span style="font-size:0.8rem; color:#94a3b8; margin-top:0.4rem; display:inline-block;">Need immediate direct transmission? <a href="' + mailtoUrl + '" style="color:#38bdf8; text-decoration:underline; font-weight:700;">Click here to open email draft directly &rarr;</a></span>';
      intakeConf.classList.add('show');
      
      if (submitBtn) {
        submitBtn.textContent = 'REQUEST TRANSMITTED ✓';
        submitBtn.style.backgroundColor = '#059669';
        submitBtn.style.borderColor = '#059669';
      }
    });
  }
}

// 5. Consultation Modal Handler - Transmit directly to njaccessportal@gmail.com
function initModal() {
  const openBtn = document.getElementById('open-consult-modal-btn');
  const closeBtn = document.getElementById('close-modal-btn');
  const modal = document.getElementById('consultation-modal');
  const modalForm = document.getElementById('modal-scheduler-form');
  const modalConf = document.getElementById('modal-confirmation');

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  if (modalForm && modalConf) {
    modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const confirmBtn = document.getElementById('confirm-scheduler-btn');
      if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'TRANSMITTING RESERVATION...';
      }

      const name = document.getElementById('m-name')?.value || '';
      const title = document.getElementById('m-title')?.value || '';
      const email = document.getElementById('m-email')?.value || '';
      const org = document.getElementById('m-org')?.value || '';
      const timeframe = document.getElementById('m-timeframe')?.value || '';
      const notes = document.getElementById('m-notes')?.value || '';

      const formData = new FormData(modalForm);
      formData.append('_subject', '[NJ Access Portal] Consultation Reservation: ' + name + ' (' + title + ')');
      formData.append('_template', 'table');
      formData.append('_captcha', 'false');

      try {
        await fetch('https://formsubmit.co/ajax/njaccessportal@gmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json'
          },
          body: formData
        });
      } catch (err) {
        console.warn('Modal submit status:', err);
      }

      const mailtoUrl = 'mailto:njaccessportal@gmail.com?subject=' + encodeURIComponent('[NJ Access Portal Consultation] ' + name + ' (' + title + ')') + '&body=' + encodeURIComponent('Full Name: ' + name + '\nTitle: ' + title + '\nOrganization: ' + org + '\nEmail: ' + email + '\nTimeframe: ' + timeframe + '\nNotes: ' + notes);

      modalConf.innerHTML = '✓ RESERVATION DELIVERED // Transmission queued for <strong>njaccessportal@gmail.com</strong>.<br><span style="font-size:0.8rem; color:#94a3b8; margin-top:0.4rem; display:inline-block;">Need instant confirmation? <a href="' + mailtoUrl + '" style="color:#38bdf8; text-decoration:underline; font-weight:700;">Click to send direct email &rarr;</a></span>';
      modalConf.classList.add('show');
      if (confirmBtn) {
        confirmBtn.textContent = 'RESERVATION DELIVERED ✓';
        confirmBtn.style.backgroundColor = '#059669';
        confirmBtn.style.borderColor = '#059669';
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// 6. Subtle Ambient Particle Background
function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.2 + 0.05;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(2, 132, 199, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 40; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

// 8. Hero Background Video Autoplay Engine
function initHeroVideo() {
  const heroVideo = document.querySelector('.hero-bg-video');
  if (!heroVideo) return;

  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.playsInline = true;

  const attemptPlay = () => {
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback: start video on first user interaction if browser policy blocks autoplay
        const triggerPlay = () => {
          heroVideo.muted = true;
          heroVideo.play().catch(() => {});
          ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
            window.removeEventListener(evt, triggerPlay);
          });
        };
        ['click', 'touchstart', 'scroll', 'keydown'].forEach(evt => {
          window.addEventListener(evt, triggerPlay, { passive: true, once: true });
        });
      });
    }
  };

  attemptPlay();

  // Keep playing if tab becomes visible again
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && heroVideo.paused) {
      heroVideo.play().catch(() => {});
    }
  });
}
