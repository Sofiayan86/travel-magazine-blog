# Google Sheets + GitHub Pages 完全免費部署指南

使用 Google Sheets 作為內容管理系統，自動同步到 GitHub Pages 的完整指南。

---

## 📋 目錄

1. [第 1 步：創建 Google Sheets](#第-1-步創建-google-sheets)
2. [第 2 步：配置 Google Cloud](#第-2-步配置-google-cloud)
3. [第 3 步：設置自動同步](#第-3-步設置自動同步)
4. [第 4 步：部署到 GitHub Pages](#第-4-步部署到-github-pages)
5. [常見問題](#常見問題)

---

## 第 1 步：創建 Google Sheets

### 1.1 創建 Google Sheets 文檔

1. 訪問 https://sheets.google.com
2. 點擊 **+ 建立新試算表**
3. 命名為：`Travel Magazine Blog`
4. 點擊 **建立**

### 1.2 設置文章表格

**Sheet 1：Articles**

創建以下欄位（第一行）：

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| id | title | excerpt | content | category | author | coverImage | latitude | longitude | gpxFile |

**範例數據（第二行開始）：**

```
sample-1 | Discovering the Hidden Temples of Kyoto | A journey through Japan's ancient capital... | # Kyoto Temples\n\nContent here... | Japan | Sofia Yan | https://images.unsplash.com/... | 35.0116 | 135.7681 | https://drive.google.com/...
```

### 1.3 設置設置表格

**Sheet 2：Settings**

創建以下欄位：

| key | value |
|-----|-------|
| siteTitle | Journeys & Discoveries |
| siteDescription | A personal travel magazine celebrating the world's most beautiful places |
| ownerName | Sofia Yan |
| ownerEmail | sofia@example.com |
| socialLinks | {"instagram": "https://instagram.com/...", "twitter": "https://twitter.com/..."} |

### 1.4 分享 Google Sheets

1. 點擊右上角 **分享**
2. 點擊 **變更**
3. 選擇 **任何知道連結的人**
4. 權限選擇 **檢視者**
5. 複製分享連結

**分享連結格式：**
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
```

**提取 Sheet ID：**
- 從 URL 中複製 `YOUR_SHEET_ID`
- 例如：`1a2b3c4d5e6f7g8h9i0j`

---

## 第 2 步：配置 Google Cloud

### 2.1 創建 Google Cloud 項目

1. 訪問 https://console.cloud.google.com
2. 點擊左上角的項目選擇器
3. 點擊 **新建項目**
4. 輸入項目名稱：`Travel Magazine Blog`
5. 點擊 **建立**

### 2.2 啟用 Google Sheets API

1. 在搜索框中搜索 **Google Sheets API**
2. 點擊 **Google Sheets API**
3. 點擊 **啟用**

### 2.3 創建服務帳戶

1. 點擊左側菜單 **API 和服務** → **憑證**
2. 點擊 **建立憑證** → **服務帳戶**
3. 填寫服務帳戶詳細信息：
   - 服務帳戶名稱：`travel-blog-service`
   - 點擊 **建立並繼續**
4. 跳過可選步驟，點擊 **完成**

### 2.4 生成 API 密鑰

1. 點擊新建的服務帳戶
2. 點擊 **密鑰** 標籤
3. 點擊 **新增密鑰** → **建立新的 JSON 密鑰**
4. 自動下載 JSON 文件
5. **保存此文件**（後續會用到）

### 2.5 與 Google Sheets 共享

1. 打開下載的 JSON 文件
2. 複製 `client_email` 欄位的值
3. 回到您的 Google Sheets
4. 點擊 **分享**
5. 粘貼 `client_email` 並授予 **編輯者** 權限

---

## 第 3 步：設置自動同步

### 3.1 配置環境變數

在您的 GitHub 倉庫中：

1. 點擊 **Settings** → **Secrets and variables** → **Actions**
2. 點擊 **New repository secret**
3. 添加以下密鑰：

**GOOGLE_SHEETS_ID**
- 值：您的 Google Sheets ID

**GOOGLE_SERVICE_ACCOUNT_JSON**
- 值：下載的 JSON 文件的完整內容

### 3.2 創建 GitHub Actions 工作流程

在 `.github/workflows/` 目錄中創建 `sync-sheets.yml`：

```yaml
name: Sync Google Sheets to JSON

on:
  schedule:
    # 每天早上 8 點執行
    - cron: '0 8 * * *'
  workflow_dispatch:  # 允許手動觸發

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install googleapis
      
      - name: Sync Google Sheets
        env:
          GOOGLE_SHEETS_ID: ${{ secrets.GOOGLE_SHEETS_ID }}
          GOOGLE_SERVICE_ACCOUNT_JSON: ${{ secrets.GOOGLE_SERVICE_ACCOUNT_JSON }}
        run: node scripts/sync-sheets.js
      
      - name: Commit changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add client/public/posts-db.json
          git commit -m "Update articles from Google Sheets" || true
      
      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

### 3.3 創建同步腳本

創建 `scripts/sync-sheets.js`：

```javascript
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

async function syncGoogleSheets() {
  try {
    // 解析服務帳戶 JSON
    const serviceAccount = JSON.parse(
      process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    );

    // 創建認證
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccount,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 讀取 Articles Sheet
    const articlesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Articles!A:J',
    });

    const articlesData = articlesResponse.data.values;
    const headers = articlesData[0];
    const articles = [];

    // 轉換為 JSON
    for (let i = 1; i < articlesData.length; i++) {
      const row = articlesData[i];
      if (row[0]) { // 如果有 ID
        const article = {};
        headers.forEach((header, index) => {
          article[header] = row[index] || '';
        });
        articles.push(article);
      }
    }

    // 讀取 Settings Sheet
    const settingsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: 'Settings!A:B',
    });

    const settingsData = settingsResponse.data.values;
    const settings = {};

    for (let i = 1; i < settingsData.length; i++) {
      const [key, value] = settingsData[i];
      if (key) {
        settings[key] = value;
      }
    }

    // 保存為 JSON
    const output = {
      articles,
      settings,
      lastUpdated: new Date().toISOString(),
    };

    const outputPath = path.join(
      __dirname,
      '../client/public/posts-db.json'
    );

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log('✅ Google Sheets 同步成功！');

  } catch (error) {
    console.error('❌ 同步失敗：', error);
    process.exit(1);
  }
}

syncGoogleSheets();
```

---

## 第 4 步：部署到 GitHub Pages

### 4.1 配置 GitHub Pages

1. 進入倉庫 **Settings**
2. 點擊左側 **Pages**
3. **Source** 選擇 **Deploy from a branch**
4. **Branch** 選擇 **main**
5. **Folder** 選擇 **/ (root)**
6. 點擊 **Save**

### 4.2 構建和部署

1. 在本地運行：
   ```bash
   npm run build
   ```

2. 推送到 GitHub：
   ```bash
   git add -A
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. GitHub Pages 會自動部署
4. 訪問 `https://sofiayan86.github.io/travel-magazine-blog/`

---

## 工作流程

### 發布新文章

1. **打開 Google Sheets**
   - 訪問您的 Travel Magazine Blog Sheets

2. **添加新行**
   - 在 Articles 表格中添加新文章

3. **填寫信息**
   - id：唯一識別符（例如 `sample-2`）
   - title：文章標題
   - excerpt：文章摘要
   - content：文章內容（支援 Markdown）
   - category：國家名稱
   - author：作者名稱
   - coverImage：封面圖片 URL
   - latitude：緯度
   - longitude：經度
   - gpxFile：GPX 文件 URL

4. **自動同步**
   - GitHub Actions 每天早上 8 點自動同步
   - 或手動觸發工作流程

5. **查看結果**
   - 訪問您的網站
   - 新文章應該出現在首頁

---

## 常見問題

### Q1：如何手動觸發同步？

**A：** 
1. 進入倉庫 **Actions** 標籤
2. 選擇 **Sync Google Sheets to JSON**
3. 點擊 **Run workflow**
4. 選擇 **main** 分支
5. 點擊 **Run workflow**

### Q2：同步失敗怎麼辦？

**A：**
1. 檢查 Actions 日誌
2. 確認 Google Sheets ID 正確
3. 確認服務帳戶有權訪問 Sheets
4. 確認 JSON 密鑰格式正確

### Q3：如何編輯已發布的文章？

**A：**
1. 在 Google Sheets 中編輯
2. 手動觸發同步或等待每日自動同步
3. 網站會自動更新

### Q4：如何刪除文章？

**A：**
1. 在 Google Sheets 中刪除該行
2. 觸發同步
3. 文章會從網站上移除

### Q5：圖片應該存儲在哪裡？

**A：**
- **Google Drive**：免費但速度較慢
- **Imgur**：免費且速度快
- **Unsplash**：免費高質量圖片
- **您自己的伺服器**：需要付費

---

## 成本總結

| 項目 | 成本 |
|------|------|
| Google Sheets | 免費 |
| Google Cloud | 免費（每月 300 美元額度） |
| GitHub Pages | 免費 |
| 圖片存儲 | 免費（Google Drive 或 Imgur） |
| **總計** | **完全免費** |

---

## 下一步

1. ✅ 創建 Google Sheets
2. ✅ 配置 Google Cloud
3. ✅ 設置 GitHub Actions
4. ✅ 部署到 GitHub Pages
5. 🎉 開始發布文章！

祝您使用愉快！✈️📸🌍

