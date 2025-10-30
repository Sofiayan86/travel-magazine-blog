import { fetchPosts } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
  const mapElement = document.getElementById('global-map');
  if (!mapElement || typeof L === 'undefined') return;

  const map = L.map(mapElement, {
    scrollWheelZoom: false
  }).setView([23.6978, 120.9605], 3);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  try {
    const posts = await fetchPosts();
    const bounds = [];

    posts
      .filter((post) => post.location && post.location.lat && post.location.lng)
      .forEach((post) => {
        const { lat, lng } = post.location;
        const marker = L.marker([lat, lng]).addTo(map);
        bounds.push([lat, lng]);
        const popupContent = `
          <div class="map-popup">
            <div class="map-popup__image">
              <img src="${post.coverImage}" alt="${post.title}" />
            </div>
            <div>
              <p class="map-popup__title">${post.title}</p>
              <a class="map-popup__link" href="post.html?slug=${post.slug}">閱讀文章</a>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);
      });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  } catch (error) {
    console.error('Failed to load posts for map', error);
  }
});
