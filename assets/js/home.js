import { fetchPosts, createPostCard } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('[data-post-grid]');
  let posts = [];

  try {
    posts = await fetchPosts();
    if (grid) {
      if (posts.length === 0) {
        grid.innerHTML = '<p>目前尚未發佈文章，敬請期待。</p>';
      } else {
        posts.slice(0, 3).forEach((post, index) => {
          const card = createPostCard(post);
          card.style.animationDelay = `${index * 0.1}s`;
          grid.appendChild(card);
        });
      }
    }
  } catch (error) {
    if (grid) {
      grid.innerHTML = '<p>目前無法載入文章，請稍後再試。</p>';
    }
    console.error(error);
    initHeroMap();
    return;
  }

  initHeroMap(posts);
});

function initHeroMap(posts = []) {
  const mapElement = document.getElementById('hero-map');
  if (!mapElement || typeof L === 'undefined') return;

  const map = L.map(mapElement, {
    scrollWheelZoom: false,
    dragging: true,
    zoomControl: window.innerWidth > 768
  }).setView([23.6978, 120.9605], 3);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  const bounds = [];

  posts
    .filter((post) => post.location && post.location.lat && post.location.lng)
    .forEach((post) => {
      const { lat, lng } = post.location;
      const marker = L.marker([lat, lng]).addTo(map);
      bounds.push([lat, lng]);
      marker.bindPopup(
        `<p class="map-popup__title">${post.title}</p><a class="map-popup__link" href="post.html?slug=${post.slug}">閱讀文章</a>`
      );
    });

  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [30, 30] });
  }
}
