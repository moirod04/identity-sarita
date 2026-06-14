// ===================== Menú móvil (hamburguesa) =====================
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  toggle.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
});
menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// ===================== Barra de progreso de scroll =====================
const progress = document.getElementById('scrollProgress');
function updateProgress() {
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
  progress.style.width = Math.min(100, scrolled * 100) + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ===================== Scroll-spy =====================
const sections = Array.from(document.querySelectorAll('main section[id], #inicio'));
const navLinks = new Map(
  Array.from(menu.querySelectorAll('a')).map((a) => [a.getAttribute('href').slice(1), a])
);
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((a) => a.classList.remove('is-active'));
        const active = navLinks.get(entry.target.id);
        if (active) active.classList.add('is-active');
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
);
sections.forEach((s) => spy.observe(s));

// ===================== Reveal en cascada =====================
const reveals = document.querySelectorAll('.reveal');
const CASCADE_STEP = 90;
function cascade(section) {
  const wrap = section.querySelector('.wrap') || section;
  const items = [];
  wrap.querySelectorAll(':scope > *').forEach((child) => {
    if (child.matches('.exp, .stats, .features')) {
      child.querySelectorAll(':scope > *').forEach((g) => items.push(g));
    } else {
      items.push(child);
    }
  });
  items.forEach((el, i) => { el.style.transitionDelay = i * CASCADE_STEP + 'ms'; });
}
const revealObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        cascade(entry.target);
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
reveals.forEach((el) => revealObserver.observe(el));

// ===================== Contadores animados (count-up) =====================
const counters = document.querySelectorAll('.stat__num');
const countObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      // Valor no numérico (ej. "B1"): se muestra estático, sin animar.
      if (Number.isNaN(target)) { obs.unobserve(el); return; }
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      let startTime = null;
      function step(ts) {
        if (startTime === null) startTime = ts;
        const p = Math.min((ts - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
counters.forEach((c) => countObserver.observe(c));

// ===================== Slider de reseñas =====================
(function initSlider() {
  const slider = document.getElementById('reviews');
  if (!slider) return;
  const track = slider.querySelector('.slider__track');
  const slides = Array.from(track.children);
  const dotsWrap = slider.querySelector('.slider__dots');
  let index = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider__dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', 'Reseña ' + (i + 1));
    dot.addEventListener('click', () => go(i, true));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function go(i, manual) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
    if (manual) restart();
  }
  function next() { go(index + 1); }
  function start() { timer = setInterval(next, 5000); }
  function restart() { clearInterval(timer); start(); }

  slider.querySelector('.slider__btn--next').addEventListener('click', () => go(index + 1, true));
  slider.querySelector('.slider__btn--prev').addEventListener('click', () => go(index - 1, true));
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', start);
  start();
})();

// ===================== Carrusel de galería =====================
let carouselDragged = false; // se comparte con el lightbox para no abrir al arrastrar
(function initCarousel() {
  const track = document.getElementById('galeriaTrack');
  if (!track) return;
  const prev = document.querySelector('.carousel__btn--prev');
  const next = document.querySelector('.carousel__btn--next');

  function step() {
    const card = track.querySelector('.photo');
    return card ? card.getBoundingClientRect().width + 20 : 320;
  }
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));

  // Arrastrar para deslizar (desktop)
  let down = false, startX = 0, startScroll = 0;
  track.addEventListener('pointerdown', (e) => {
    down = true; carouselDragged = false;
    startX = e.clientX; startScroll = track.scrollLeft;
    track.classList.add('is-grabbing');
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) carouselDragged = true;
    track.scrollLeft = startScroll - dx;
  });
  window.addEventListener('pointerup', () => {
    down = false; track.classList.remove('is-grabbing');
  });

  // Autoplay suave (se pausa al interactuar o al pasar el mouse)
  let auto = null;
  function play() {
    if (auto) return;
    auto = setInterval(() => {
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: step(), behavior: 'smooth' });
      }
    }, 3800);
  }
  function stop() { clearInterval(auto); auto = null; }
  track.addEventListener('pointerenter', stop);
  track.addEventListener('pointerleave', play);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) play();
})();

// ===================== Modal (imagen / video) =====================
(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  const lbImg = lightbox.querySelector('.lightbox__img');
  const lbVideo = lightbox.querySelector('.lightbox__video');
  const lbMissing = lightbox.querySelector('.lightbox__missing');
  const lbCap = lightbox.querySelector('.lightbox__cap');
  const closeBtn = lightbox.querySelector('.lightbox__close');

  function open() {
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function reset() {
    lbImg.style.display = 'none'; lbImg.src = '';
    lbVideo.style.display = 'none'; lbVideo.removeAttribute('src'); lbVideo.load();
    lbMissing.style.display = 'none';
    lbCap.textContent = '';
  }
  function showImage(src, alt, caption) {
    reset();
    lbImg.onerror = () => { lbImg.style.display = 'none'; lbMissing.style.display = 'block'; };
    lbImg.style.display = 'block'; lbImg.src = src; lbImg.alt = alt || '';
    lbCap.textContent = caption || '';
    open();
  }
  function showVideo(src, caption) {
    reset();
    lbVideo.style.display = 'block'; lbVideo.src = src; lbVideo.load();
    lbCap.textContent = caption || '';
    open();
    lbVideo.play().catch(() => {});
  }

  // Fotos de la galería de tutorías
  document.querySelectorAll('.photo img').forEach((img) => {
    img.addEventListener('click', () => {
      if (carouselDragged) return;                       // venía de un arrastre
      if (img.classList.contains('is-placeholder')) return; // aún sin foto real
      showImage(img.src, img.alt, '');
    });
  });

  // Botones de "Pruebas" (imagen o video) en el bloque destacado
  document.querySelectorAll('.proof[data-media]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.media;
      const src = btn.dataset.src;
      const cap = btn.dataset.caption || '';
      if (type === 'video') showVideo(src, cap);
      else showImage(src, btn.textContent.trim(), cap);
    });
  });

  function close() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lbVideo.pause();
    reset();
  }
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();

// ===================== Modal carrusel de "Trabajos" =====================
(function initWorks() {
  const modal = document.getElementById('worksModal');
  const openBtn = document.getElementById('openWorks');
  if (!modal || !openBtn) return;
  const track = modal.querySelector('.wcar__track');
  const slides = Array.from(track.children);
  const dotsWrap = modal.querySelector('.wcar__dots');
  const closeBtn = document.getElementById('worksClose');
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'wcar__dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', 'Trabajo ' + (i + 1));
    dot.addEventListener('click', () => go(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function go(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('is-active', di === index));
  }
  function open() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
  }
  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  openBtn.addEventListener('click', () => { go(0); open(); });
  modal.querySelector('.wcar__btn--next').addEventListener('click', () => go(index + 1));
  modal.querySelector('.wcar__btn--prev').addEventListener('click', () => go(index - 1));
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') go(index + 1);
    else if (e.key === 'ArrowLeft') go(index - 1);
  });
})();
