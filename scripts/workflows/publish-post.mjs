import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.env.GITHUB_WORKSPACE || process.cwd();

function parseJSON(input) {
  try {
    return JSON.parse(input);
  } catch (error) {
    throw new Error(`無法解析 JSON：${error.message}`);
  }
}

async function updatePostsDb(meta) {
  const dbPath = path.join(root, 'posts-db.json');
  const raw = await readFile(dbPath, 'utf-8');
  const data = parseJSON(raw);
  if (!Array.isArray(data.posts)) {
    throw new Error('posts-db.json 缺少 posts 陣列');
  }
  const exists = data.posts.find((item) => item.slug === meta.slug);
  if (exists) {
    throw new Error(`Slug ${meta.slug} 已存在，無法覆寫`);
  }
  data.posts.unshift(meta);
  const formatted = JSON.stringify(data, null, 2);
  await writeFile(dbPath, `${formatted}\n`, 'utf-8');
}

async function createPostFile(slug, content) {
  const postPath = path.join(root, 'posts', `${slug}.html`);
  if (existsSync(postPath)) {
    throw new Error(`文章檔案已存在：${postPath}`);
  }
  await writeFile(postPath, `${content.trim()}\n`, 'utf-8');
}

function buildMeta(inputs) {
  const { title, slug, date, excerpt, coverImage, gpxFile, lat, lng } = inputs;
  const meta = {
    slug,
    title,
    excerpt,
    date,
    coverImage
  };

  if (gpxFile) {
    meta.gpxFile = gpxFile;
  }
  if (lat && lng) {
    meta.location = {
      lat: Number(lat),
      lng: Number(lng)
    };
  }
  return meta;
}

async function main() {
  const inputs = parseJSON(process.env.WORKFLOW_INPUTS || '{}');
  const content = inputs.content;
  if (!content) {
    throw new Error('缺少文章內容');
  }
  const meta = buildMeta(inputs);
  await createPostFile(meta.slug, content);
  await updatePostsDb(meta);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
