import { fetchPosts, createPostCard } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('[data-post-grid]');
  if (!grid) return;

  try {
    const posts = await fetchPosts();
    posts.forEach((post) => {
      grid.appendChild(createPostCard(post));
    });
  } catch (error) {
    grid.innerHTML = '<p>目前無法載入文章列表。</p>';
    console.error(error);
  }
});
