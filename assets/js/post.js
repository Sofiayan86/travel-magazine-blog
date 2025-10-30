import { fetchPosts, formatDate } from './data.js';

function getSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

document.addEventListener('DOMContentLoaded', async () => {
  const slug = getSlug();
  const postContainer = document.querySelector('[data-post]');
  const heroImage = document.querySelector('[data-hero-image]');
  const heroTitle = document.querySelector('[data-post-title]');
  const heroDate = document.querySelector('[data-post-date]');
  const contentSection = document.querySelector('[data-post-content]');
  const mapSection = document.querySelector('[data-post-map]');
  const stats = document.querySelector('[data-gpx-stats]');

  if (!slug || !postContainer) {
    if (contentSection) {
      contentSection.innerHTML = '<p>找不到指定的文章。</p>';
    }
    return;
  }

  try {
    const posts = await fetchPosts();
    const post = posts.find((item) => item.slug === slug);
    if (!post) {
      contentSection.innerHTML = '<p>文章不存在或已被移除。</p>';
      return;
    }

    document.title = `${post.title} — Interwoven Journeys`;
    heroImage.style.background = `url('${post.coverImage}') center/cover no-repeat`;
    heroTitle.textContent = post.title;
    heroDate.textContent = formatDate(post.date);

    const response = await fetch(`posts/${post.slug}.html`);
    if (!response.ok) throw new Error('無法載入文章內容');
    const html = await response.text();
    contentSection.innerHTML = html;

    if (post.gpxFile && typeof L !== 'undefined' && typeof L.GPX !== 'undefined') {
      mapSection.hidden = false;
      const map = L.map('gpx-map', {
        scrollWheelZoom: false
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const gpx = new L.GPX(post.gpxFile, {
        async: true,
        marker_options: {
          startIconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          endIconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
        }
      })
        .on('loaded', (event) => {
          const gpxLayer = event.target;
          map.fitBounds(gpxLayer.getBounds(), { padding: [20, 20] });
          if (!stats) return;
          const distance = gpxLayer.get_distance();
          const gain = gpxLayer.get_elevation_gain();
          const loss = gpxLayer.get_elevation_loss();
          const max = gpxLayer.get_elevation_max();

          stats.querySelector('[data-distance]').textContent = `${(distance / 1000).toFixed(2)} km`;
          stats.querySelector('[data-gain]').textContent = `${Math.round(gain)} m`;
          stats.querySelector('[data-loss]').textContent = `${Math.round(loss)} m`;
          stats.querySelector('[data-max]').textContent = `${Math.round(max)} m`;
        })
        .on('error', (error) => {
          console.error('GPX load error', error);
          mapSection.hidden = true;
        });

      gpx.addTo(map);
    }
  } catch (error) {
    console.error(error);
    contentSection.innerHTML = '<p>載入文章時發生問題，請稍後再試。</p>';
  }
});
