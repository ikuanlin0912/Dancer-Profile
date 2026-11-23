const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');
const navLinks = [...document.querySelectorAll('[data-nav] a')];

const closeMenu = () => {
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', '開啟導覽選單');
  document.body.classList.remove('menu-open');
};

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  nav.classList.toggle('is-open', !isOpen);
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? '開啟導覽選單' : '關閉導覽選單');
  document.body.classList.toggle('menu-open', !isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}, { passive: true });

const sectionObserver = new IntersectionObserver((entries) => {
  const visible = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

  if (!visible) return;

  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.hash === `#${visible.target.id}`);
  });
}, {
  rootMargin: '-30% 0px -55%',
  threshold: [0, 0.15, 0.5],
});

document.querySelectorAll('[data-section]').forEach((section) => sectionObserver.observe(section));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealItems = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8%', threshold: 0.08 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const experienceToggle = document.querySelector('[data-experience-toggle]');

experienceToggle.addEventListener('click', () => {
  const isExpanded = experienceToggle.getAttribute('aria-expanded') === 'true';
  const nextExpanded = !isExpanded;
  experienceToggle.setAttribute('aria-expanded', String(nextExpanded));
  document.querySelector('.timeline').classList.toggle('is-expanded', nextExpanded);
  experienceToggle.querySelector('span').textContent = nextExpanded ? '收合完整經歷' : '查看完整經歷';

  document.querySelectorAll('.timeline-extra').forEach((item) => {
    item.style.display = nextExpanded ? '' : 'none';
    if (nextExpanded) item.classList.add('is-visible');
  });
});

document.querySelectorAll('.timeline-extra').forEach((item) => {
  item.style.display = 'none';
});

const setupLightbox = ({ dialog, openers, closeButton, getContent }) => {
  let lastTrigger = null;

  openers.forEach((opener) => {
    opener.addEventListener('click', () => {
      lastTrigger = opener;
      getContent?.(opener);
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => dialog.close();
  closeButton.addEventListener('click', close);

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    lastTrigger?.focus();
  });
};

const galleryDialog = document.querySelector('[data-lightbox]');
const galleryImage = document.querySelector('[data-lightbox-image]');
const galleryCaption = document.querySelector('[data-lightbox-caption]');

setupLightbox({
  dialog: galleryDialog,
  openers: document.querySelectorAll('[data-gallery]'),
  closeButton: document.querySelector('[data-lightbox-close]'),
  getContent: (opener) => {
    galleryImage.src = opener.dataset.full;
    galleryImage.alt = opener.dataset.alt;
    galleryCaption.textContent = opener.dataset.alt;
  },
});

setupLightbox({
  dialog: document.querySelector('[data-model-lightbox]'),
  openers: document.querySelectorAll('[data-model-card]'),
  closeButton: document.querySelector('[data-model-close]'),
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) closeMenu();
});
