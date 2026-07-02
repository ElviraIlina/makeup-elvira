// Подстановка текстов и ссылок из site-content.js
(function () {
  if (typeof siteContent === 'undefined') return;

  function get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], siteContent);
  }

  document.querySelectorAll('[data-site]').forEach(el => {
    const value = get(el.dataset.site);
    if (value != null) el.textContent = value;
  });

  document.querySelectorAll('[data-site-href]').forEach(el => {
    const value = get(el.dataset.siteHref);
    if (value != null) el.href = value;
  });

  document.querySelectorAll('[data-site-attr]').forEach(el => {
    const [path, attr] = el.dataset.siteAttr.split('|');
    const value = get(path);
    if (value != null) el.setAttribute(attr, value);
  });

  document.querySelectorAll('[data-site-alt]').forEach(el => {
    const value = get(el.dataset.siteAlt);
    if (value != null) el.alt = value;
  });

  const title = document.querySelector('[data-site-title]');
  if (title && siteContent.home) {
    const line1 = siteContent.home.titleLine1 || '';
    const line2 = siteContent.home.titleLine2 || '';
    title.innerHTML = `${line1}<br><span>${line2}</span>`;
  }

  const portfolioList = document.querySelector('[data-portfolio-categories]');
  if (portfolioList && Array.isArray(siteContent.portfolioCategories)) {
    portfolioList.innerHTML = siteContent.portfolioCategories
      .map(
        cat => `
          <li>
            <a href="gallery.html#${cat.id}" class="portfolio-cat">
              <strong>${cat.label}</strong><span>${cat.desc}</span>
            </a>
          </li>`
      )
      .join('');
  }
})();
