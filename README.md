# Interwoven Journeys — 互動式旅行雜誌部落格

Interwoven Journeys 是一個以高端旅行雜誌為靈感打造的個人網站。整個專案以原生 HTML、CSS、JavaScript 完成，透過 GitHub Pages 與 GitHub Actions 達成完全無伺服器的 Git-based CMS 體驗。

## 專案特色

- **雜誌式排版**：以非對稱網格、大量留白與優雅字體呈現旅行故事。
- **互動式地圖**：使用 Leaflet.js 與 leaflet-gpx 在文章內嵌 GPX 軌跡，並提供全域探索地圖瀏覽所有旅程。
- **Git-based CMS**：藉由 `admin.html` 透過 Personal Access Token 觸發 GitHub Actions，自動建立文章檔案並更新資料庫。
- **零伺服器負擔**：靜態網站部署於 GitHub Pages，所有內容更新皆透過 Git 儲存庫控管。

## 專案結構

```
.
├── index.html                 # 首頁：最新文章與探索地圖導覽
├── articles.html              # 文章總覽
├── post.html                  # 單篇文章模板 (透過 query string 指定 slug)
├── map.html                   # 全域互動地圖
├── about.html                 # 關於頁面
├── admin.html                 # GitHub Actions 觸發後台
├── posts-db.json              # 文章資料庫 (slug、日期、封面、位置、GPX)
├── posts/                     # 每篇文章的 HTML 內容片段
├── gpx/                       # 文章對應的 GPX 檔案
├── assets/
│   ├── css/                   # 全站樣式
│   ├── js/                    # 前端模組化腳本
│   └── images/                # SVG 圖像資產
└── .github/workflows/
    └── publish-post.yml       # workflow_dispatch 建立新文章
```

## 開發與測試

1. 在本地啟動靜態伺服器（可使用 `python -m http.server` 或任意工具）。
2. 瀏覽 `http://localhost:8000/index.html` 查看首頁。
3. 使用 `post.html?slug=<slug>` 觀看特定文章，若文章設定 GPX 檔案將自動渲染互動地圖。

## Git-based CMS 使用方式

1. 建立一組 **GitHub Personal Access Token**，並至少勾選 `repo` 與 `workflow` 權限。
2. 開啟 `admin.html`，輸入儲存庫名稱（例如 `username/travel-magazine-blog`）、workflow 路徑與 PAT。
3. 填寫文章資訊與 HTML 內容，提交後會呼叫 GitHub API 觸發 `publish-post.yml` workflow。
4. Workflow 會：
   - 建立 `posts/<slug>.html`。
   - 更新 `posts-db.json`，在 `posts` 陣列中新增條目。
   - 將變更提交回主要分支。

## 部署

1. 在 GitHub 儲存庫啟用 GitHub Pages，來源設定為 `main` 分支根目錄。
2. 每次 workflow 完成後，Pages 將自動提供最新內容。

## 授權

本專案採用 MIT License。
