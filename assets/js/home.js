import { fetchPosts, createPostCard } from './data.js';

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('[data-post-grid]');
  if (!grid) return;

  try {
    const posts = await fetchPosts();
    posts
      .slice(0, 3)
      .forEach((post, index) => {
        const card = createPostCard(post);
        card.style.animationDelay = `${index * 0.1}s`;
        grid.appendChild(card);
      });
  } catch (error) {
    grid.innerHTML = '<p>目前無法載入文章，請稍後再試。</p>';
    console.error(error);
  }
});
