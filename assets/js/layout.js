const NAV_ITEMS = [
  { href: 'index.html', label: '首頁', id: 'home' },
  { href: 'articles.html', label: '所有文章', id: 'articles' },
  { href: 'about.html', label: '關於我', id: 'about' },
  { href: 'map.html', label: '地圖', id: 'map' }
];

const SOCIAL_LINKS = [
  { href: 'https://www.instagram.com/', label: 'Instagram', icon: 'IG' },
  { href: 'https://www.facebook.com/', label: 'Facebook', icon: 'FB' },
  { href: 'https://twitter.com/', label: 'Twitter', icon: 'TW' },
  { href: 'https://github.com/', label: 'GitHub', icon: 'GH' }
];

function buildHeader(header) {
  const active = header.dataset.active;
  const wrapper = document.createElement('div');
  wrapper.className = 'site-header__inner';

  const logo = document.createElement('div');
  logo.className = 'site-logo';
  logo.innerHTML = '<a href="index.html">Interwoven Journeys</a>';

  const nav = document.createElement('nav');
  nav.className = 'nav-links';
  NAV_ITEMS.forEach((item) => {
    const link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.label;
    if (active && active === item.id) {
      link.classList.add('is-active');
    }
    nav.appendChild(link);
  });

  wrapper.appendChild(logo);
  wrapper.appendChild(nav);
  header.appendChild(wrapper);
}

function buildFooter(footer) {
  const wrapper = document.createElement('div');
  wrapper.className = 'site-footer__inner';

  const brand = document.createElement('div');
  brand.className = 'site-footer__brand';
  brand.innerHTML = `
    <h2>Interwoven Journeys</h2>
    <p>一個結合圖文、地圖與軌跡的旅行雜誌部落格，透過 Git-based CMS 完全掌握內容與資料。</p>
  `;

  const socials = document.createElement('div');
  socials.innerHTML = '<h3 class="eyebrow">Connect</h3>';
  const list = document.createElement('div');
  list.className = 'social-links';
  SOCIAL_LINKS.forEach((item) => {
    const link = document.createElement('a');
    link.href = item.href;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('aria-label', item.label);
    link.textContent = item.icon;
    list.appendChild(link);
  });
  socials.appendChild(list);

  const meta = document.createElement('div');
  meta.className = 'footer-meta';
  meta.innerHTML = `© ${new Date().getFullYear()} Interwoven Journeys · Crafted with HTML, CSS &amp; GitHub Actions.`;

  wrapper.appendChild(brand);
  wrapper.appendChild(socials);
  wrapper.appendChild(meta);
  footer.appendChild(wrapper);
}

const header = document.querySelector('.site-header');
if (header) {
  buildHeader(header);
}

const footer = document.querySelector('.site-footer');
if (footer) {
  buildFooter(footer);
}
