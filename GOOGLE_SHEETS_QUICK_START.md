# Google Sheets 快速開始指南

5 分鐘快速設置 Google Sheets + GitHub Pages 部署。

---

## ⚡ 5 分鐘快速設置

### 步驟 1：創建 Google Sheets（2 分鐘）

1. 訪問 https://sheets.google.com
2. 點擊 **+ 建立新試算表**
3. 命名為 `Travel Magazine Blog`
4. 創建兩個 Sheet：
   - **Sheet 1：Articles**
   - **Sheet 2：Settings**

### 步驟 2：設置 Articles Sheet（1 分鐘）

在第一行添加欄位：
```
id | title | excerpt | content | category | author | coverImage | latitude | longitude | gpxFile
```

### 步驟 3：分享 Google Sheets（1 分鐘）

1. 點擊 **分享**
2. 選擇 **任何知道連結的人**
3. 複製 Sheet ID（從 URL 中提取）

### 步驟 4：配置 GitHub（1 分鐘）

1. 進入倉庫 **Settings** → **Secrets and variables** → **Actions**
2. 添加 `GOOGLE_SHEETS_ID` 密鑰

---

## 📝 Google Sheets 欄位說明

| 欄位 | 說明 | 範例 |
|------|------|------|
| **id** | 文章唯一識別符 | `sample-1` |
| **title** | 文章標題 | `Discovering Kyoto` |
| **excerpt** | 文章摘要 | `A journey through Japan's ancient capital...` |
| **content** | 文章內容（支援 Markdown） | `# Heading\n\nContent...` |
| **category** | 國家名稱 | `Japan` |
| **author** | 作者名稱 | `Sofia Yan` |
| **coverImage** | 封面圖片 URL | `https://images.unsplash.com/...` |
| **latitude** | 緯度 | `35.0116` |
| **longitude** | 經度 | `135.7681` |
| **gpxFile** | GPX 軌跡 URL | `https://drive.google.com/...` |

---

## 🖼️ 圖片存儲選項

### 選項 1：Google Drive（推薦）
1. 上傳圖片到 Google Drive
2. 右鍵 → **分享**
3. 設為 **任何知道連結的人可查看**
4. 複製分享連結

### 選項 2：Imgur（快速）
1. 訪問 https://imgur.com
2. 上傳圖片
3. 複製圖片 URL

### 選項 3：Unsplash（高質量）
1. 訪問 https://unsplash.com
2. 搜索圖片
3. 複製圖片 URL

---

## 🔄 自動同步設置

### 配置 GitHub Actions

1. 進入倉庫 **Settings** → **Secrets and variables** → **Actions**
2. 添加以下密鑰：

**GOOGLE_SHEETS_ID**
- 值：您的 Google Sheets ID

**GOOGLE_SERVICE_ACCOUNT_JSON**
- 值：Google Cloud 服務帳戶 JSON（見詳細指南）

### 手動觸發同步

1. 進入 **Actions** 標籤
2. 選擇 **Sync Google Sheets to JSON**
3. 點擊 **Run workflow**

---

## 📱 發布新文章流程

1. **打開 Google Sheets**
   - 訪問 Travel Magazine Blog Sheets

2. **添加新行**
   - 在 Articles 表格中添加新文章

3. **填寫信息**
   - 填寫所有欄位

4. **保存**
   - Google Sheets 自動保存

5. **同步**
   - 手動觸發或等待每日自動同步

6. **查看結果**
   - 訪問您的網站
   - 新文章應該出現在首頁

---

## ✅ 檢查清單

- [ ] 創建 Google Sheets 文檔
- [ ] 設置 Articles Sheet（添加欄位）
- [ ] 設置 Settings Sheet
- [ ] 分享 Google Sheets（任何知道連結的人）
- [ ] 複製 Google Sheets ID
- [ ] 配置 GitHub 密鑰
- [ ] 配置 Google Cloud（詳細指南）
- [ ] 設置 GitHub Actions
- [ ] 部署到 GitHub Pages
- [ ] 發布第一篇文章

---

## 🎯 常見任務

### 如何編輯文章？
1. 在 Google Sheets 中編輯
2. 觸發同步
3. 網站自動更新

### 如何刪除文章？
1. 在 Google Sheets 中刪除該行
2. 觸發同步
3. 文章從網站移除

### 如何添加新文章？
1. 在 Google Sheets 中添加新行
2. 填寫所有欄位
3. 觸發同步
4. 文章出現在網站上

### 如何修改網站設置？
1. 編輯 Settings Sheet
2. 觸發同步
3. 設置自動更新

---

## 💡 提示

- **自動同步**：每天早上 8 點 UTC（台灣時間下午 4 點）
- **手動同步**：進入 Actions → 點擊 Run workflow
- **Markdown 支援**：content 欄位支援 Markdown 格式
- **圖片優化**：使用 < 1MB 的圖片以加快加載速度

---

## 📚 詳細指南

完整的設置指南請查看：
- **GOOGLE_SHEETS_SETUP.md** - 完整的逐步指南
- **README.md** - 項目概述

---

祝您使用愉快！✈️📸🌍

