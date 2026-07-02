// Мобильное меню
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    burger.classList.toggle('burger--open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
  });

  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      burger.classList.remove('burger--open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-open');
    });
  });
}

// Галерея
const galleryGrid = document.getElementById('galleryGrid');
const galleryCount = document.getElementById('galleryCount');
const filters = document.querySelectorAll('.gallery-filter');
let galleryItems = [];
let galleryPhotosClean = [];

if (galleryGrid && typeof galleryPhotos !== 'undefined') {
  galleryPhotosClean = galleryPhotos.filter(photo => photo && photo.src);
  galleryGrid.innerHTML = galleryPhotosClean
    .map(
      (photo, index) => `
        <a href="${photo.src}" class="gallery-item" data-category="${photo.category || 'all'}" data-caption="${photo.caption || ''}" data-index="${index}">
          <img src="${photo.src}" alt="${photo.caption || 'Работа визажиста'}" loading="lazy">
        </a>`
    )
    .join('');

  galleryItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));

  if (galleryCount) {
    galleryCount.textContent = `${galleryPhotosClean.length} работ`;
  }

  if (filters.length) {
    const hasCategories = galleryPhotosClean.some(photo => photo.category && photo.category !== 'all');
    if (!hasCategories) {
      filters.forEach(filter => {
        if (filter.dataset.filter !== 'all') filter.hidden = true;
      });
    }

    const hash = window.location.hash.replace('#', '');
    if (hash && document.querySelector(`.gallery-filter[data-filter="${hash}"]`)) {
      applyFilter(hash);
    }

    filters.forEach(filter => {
      filter.addEventListener('click', () => applyFilter(filter.dataset.filter));
    });
  }

  initLightbox(galleryItems);
}

function applyFilter(category) {
  filters.forEach(f => f.classList.toggle('gallery-filter--active', f.dataset.filter === category));

  galleryItems.forEach(item => {
    const itemCategory = item.dataset.category;
    const match = category === 'all' || itemCategory === category;
    item.classList.toggle('gallery-item--hidden', !match);
  });

  const visible = galleryItems.filter(item => !item.classList.contains('gallery-item--hidden')).length;
  if (galleryCount) {
    galleryCount.textContent = category === 'all'
      ? `${galleryPhotosClean.length} работ`
      : `${visible} работ · ${category}`;
  }
}

function initLightbox(items) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (!lightbox || !items.length) return;

  items.forEach(item => {
    item.addEventListener('click', e => {
      e.preventDefault();
      lightboxImg.src = item.href;
      lightboxImg.alt = item.dataset.caption || '';
      lightboxCaption.textContent = item.dataset.caption || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
}
