# 🚀 快速參考指南

**常見任務的快速步驟**

---

## 📝 發布新文章

### 步驟：

1. 訪問：`https://your-username.github.io/travel-magazine-blog/admin.html`
2. 輸入管理員密碼登入
3. 填寫文章信息：
   - 標題
   - 國家
   - 摘要
   - 內容（使用 Bold/Italic/Link 工具）
   - 發布日期
   - 位置（緯度、經度）
   - 封面圖片 URL
4. 點擊 **Publish Article**
5. 等待 2-5 分鐘，GitHub Actions 自動部署
6. 刷新網站查看新文章

---

## 🗺️ 獲取文章位置坐標

### 使用 Google Maps：

1. 訪問 https://www.google.com/maps
2. 搜索地點名稱
3. 右鍵點擊地圖上的位置
4. 點擊顯示的坐標
5. 複製坐標
6. 分別填入 Latitude 和 Longitude

**示例：**
- 京都：35.0116, 135.7681
- 瑞士：46.8182, 8.2275
- 巴塞隆納：41.3851, 2.1734

---

## 🖼️ 添加封面圖片

### 方式 1：使用免費圖片網站

**推薦網站：**
- Unsplash：https://unsplash.com
- Pexels：https://www.pexels.com
- Pixabay：https://pixabay.com

**步驟：**
1. 搜索相關主題
2. 點擊圖片
3. 複製圖片 URL
4. 粘貼到 **Cover Image URL** 欄位

### 方式 2：使用您自己的圖片

1. 上傳圖片到圖片託管服務（如 Imgur、Cloudinary）
2. 複製圖片 URL
3. 粘貼到表單

---

## 🗺️ 添加 GPX 軌跡

### 步驟：

1. 準備您的 `.gpx` 文件
2. 將文件放在 `client/public/gpx/` 文件夾中
3. 在發布文章時，填寫：
   ```
   /gpx/your-file-name.gpx
   ```
4. 文章頁面會自動顯示互動式地圖

### 獲取 GPX 文件：

- **Strava**：匯出您的活動為 GPX
- **AllTrails**：下載軌跡 GPX
- **GPS 設備**：從手錶或 GPS 設備匯出
- **在線工具**：使用 GPXStudio 創建

---

## 🔐 修改管理員密碼

### 步驟：

1. 訪問 admin.html
2. 登入
3. 向下滾動到 **Security Settings**
4. 填寫：
   - 當前密碼
   - 新密碼（至少 6 字符）
   - 確認新密碼
5. 點擊 **Update Password**
6. 下次登入時使用新密碼

---

## 📱 本地測試

### 啟動開發伺服器：

```bash
npm run dev
```

訪問：`http://localhost:3000/`

### 停止伺服器：

按 `Ctrl+C`

---

## 📤 上傳更改到 GitHub

### 如果您修改了代碼：

```bash
git add .
git commit -m "描述您的更改"
git push
```

GitHub Actions 會自動部署。

---

## 🔧 常見快速修復

### 網站沒有更新？

1. 按 `Ctrl+F5` 強制刷新瀏覽器
2. 檢查 GitHub Actions 是否完成
3. 等待 5 分鐘後再試

### 文章沒有出現在地圖上？

確保填寫了：
- ✅ Latitude（緯度）
- ✅ Longitude（經度）

### 圖片沒有顯示？

- 檢查 URL 是否正確
- 確保 URL 以 `https://` 開頭
- 試試另一個圖片 URL

### 後台管理無法訪問？

- 檢查 URL 是否正確
- 清除瀏覽器 Cookie
- 嘗試使用隱私/無痕模式

---

## 📊 文章數據格式

### posts-db.json 中的文章結構：

```json
{
  "id": "article-id",
  "title": "文章標題",
  "excerpt": "文章摘要",
  "content": "文章內容（Markdown 格式）",
  "coverImage": "https://...",
  "publishDate": "2024-10-22",
  "author": "Sofia Yan",
  "category": "Japan",
  "location": {
    "lat": 35.0116,
    "lng": 135.7681
  },
  "gpxFile": "/gpx/route.gpx"
}
```

---

## 🌐 自定義域名

### 添加自定義域名：

1. 進入 GitHub 倉庫 Settings
2. 進入 Pages
3. 在 Custom domain 中輸入您的域名
4. 按照 GitHub 指示配置 DNS

---

## 📞 常用連結

| 功能 | 連結 |
|------|------|
| 網站首頁 | `https://your-username.github.io/travel-magazine-blog/` |
| 後台管理 | `https://your-username.github.io/travel-magazine-blog/admin.html` |
| GitHub 倉庫 | `https://github.com/your-username/travel-magazine-blog` |
| GitHub Actions | `https://github.com/your-username/travel-magazine-blog/actions` |
| 本地開發 | `http://localhost:3000/` |

---

## 💡 提示

- 定期備份您的倉庫
- 使用有意義的文章 ID（例如 `kyoto-temples`）
- 保持圖片大小 < 1MB
- 定期更新 Personal Access Token
- 在發布前檢查文章預覽

---

**需要詳細指南？查看 DEPLOYMENT_GUIDE_SIMPLE.md**

