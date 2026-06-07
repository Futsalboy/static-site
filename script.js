// ── Nav scroll effect ──────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Hamburger menu ─────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Reveal on scroll ───────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay ?? (i * 80);
      setTimeout(() => el.classList.add('visible'), Number(delay));
      revealObserver.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.dataset.delay = i % 6 * 100;
  revealObserver.observe(el);
});

// ── Animated counters ──────────────────────────
function animateCount(el, target, duration = 1800) {
  const start = performance.now();
  const isLarge = target > 100;

  const tick = now => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(ease * target);
    el.textContent = isLarge ? current.toLocaleString('ja-JP') : current;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const numEl = el.querySelector('.stat__num');
    if (numEl) animateCount(numEl, Number(numEl.dataset.target));
    statsObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(el => statsObserver.observe(el));

// ── Mockup progress bar ────────────────────────
const progressFill  = document.getElementById('progressFill');
const progressValue = document.getElementById('progressValue');

if (progressFill) {
  let pct = 0;
  const target = 72;
  const step = () => {
    pct = Math.min(pct + 1, target);
    progressFill.style.width = pct + '%';
    progressValue.textContent = pct + '%';
    if (pct < target) setTimeout(step, 20);
  };
  setTimeout(step, 1200);
}

// ── CTA form ───────────────────────────────────
const ctaForm = document.getElementById('ctaForm');
const ctaNote = document.getElementById('ctaNote');

if (ctaForm) {
  ctaForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = ctaForm.querySelector('input').value.trim();
    if (!email) return;

    const btn = ctaForm.querySelector('button');
    btn.textContent = '送信中…';
    btn.disabled = true;

    setTimeout(() => {
      ctaNote.textContent = `✓ ${email} に招待メールを送りました！`;
      ctaForm.reset();
      btn.textContent = '無料で試す';
      btn.disabled = false;
    }, 1000);
  });
}

// ── Smooth scroll for anchor links ────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
