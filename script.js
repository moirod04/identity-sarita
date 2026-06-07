// Menú móvil (hamburguesa)
const toggle = document.querySelector('.nav__toggle');
const menu = document.getElementById('menu');

toggle.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  toggle.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
});

// Cerrar el menú móvil al hacer clic en un enlace
menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// Scroll-spy: resalta el enlace de la sección visible
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

// Reveal on scroll — efecto cascada (los elementos caen escalonados)
const reveals = document.querySelectorAll('.reveal');
const CASCADE_STEP = 90; // ms entre cada elemento

function cascade(section) {
  const wrap = section.querySelector('.wrap') || section;
  const items = [];
  wrap.querySelectorAll(':scope > *').forEach((child) => {
    // En las grillas, escalonamos cada tarjeta/ítem por separado
    if (child.matches('.cards, .plan, .goals')) {
      child.querySelectorAll(':scope > *').forEach((g) => items.push(g));
    } else {
      items.push(child);
    }
  });
  items.forEach((el, i) => {
    el.style.transitionDelay = i * CASCADE_STEP + 'ms';
  });
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
