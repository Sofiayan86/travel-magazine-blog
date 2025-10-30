export async function fetchPosts() {
  const response = await fetch('posts-db.json', {
    headers: { 'Cache-Control': 'no-cache' }
  });
  if (!response.ok) {
    throw new Error('Unable to load posts database');
  }
  const data = await response.json();
  return data.posts;
}

export function formatDate(iso) {
  const date = new Date(iso);
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function createPostCard(post) {
  const article = document.createElement('article');
  article.className = 'post-card';

  const figure = document.createElement('figure');
  figure.className = 'post-card__image';
  figure.innerHTML = `<img src="${post.coverImage}" alt="${post.title}" loading="lazy" />`;

  const meta = document.createElement('div');
  meta.className = 'post-card__meta';
  meta.innerHTML = `
    <span class="post-card__date">${formatDate(post.date)}</span>
    <h3>${post.title}</h3>
    <p>${post.excerpt}</p>
  `;

  article.appendChild(figure);
  article.appendChild(meta);
  article.addEventListener('click', () => {
    window.location.href = `post.html?slug=${post.slug}`;
  });

  return article;
}
