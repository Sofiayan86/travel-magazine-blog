# Vercel 和 PlanetScale 部署指南

完整的逐步指南，幫助您將互動式旅行雜誌部落格部署到 Vercel 和 PlanetScale。

---

## 📋 目錄

1. [第 1 步：設置 PlanetScale 資料庫](#第-1-步設置-planetscale-資料庫)
2. [第 2 步：配置 Vercel](#第-2-步配置-vercel)
3. [第 3 步：部署應用](#第-3-步部署應用)
4. [第 4 步：測試應用](#第-4-步測試應用)
5. [常見問題](#常見問題)

---

## 第 1 步：設置 PlanetScale 資料庫

### 1.1 創建 PlanetScale 帳戶

1. 訪問 https://planetscale.com
2. 點擊 **Sign up**
3. 選擇 **Sign up with GitHub**
4. 授權 PlanetScale 訪問您的 GitHub 帳戶
5. 完成帳戶設置

### 1.2 創建資料庫

1. 登入 PlanetScale 後，點擊 **Create a new database**
2. 填寫資料庫信息：
   - **Database name:** `travel-magazine-blog`
   - **Region:** 選擇離您最近的地區（例如 Singapore 或 Tokyo）
   - **Plan:** 選擇 **Hobby**（免費）
3. 點擊 **Create database**
4. 等待資料庫創建完成（通常 1-2 分鐘）

### 1.3 獲取連接字符串

1. 資料庫創建完成後，點擊 **Connect**
2. 選擇 **Node.js** 作為連接方式
3. 複製顯示的連接字符串（格式如下）：
   ```
   mysql://[username]:[password]@[host]/travel_magazine_blog?sslaccept=strict
   ```
4. **保存此連接字符串**（後續會用到）

### 1.4 初始化資料庫

1. 在 PlanetScale 中，點擊 **Branches**
2. 選擇 **main** 分支
3. 點擊 **Promote to production**（將 main 分支提升為生產環境）

---

## 第 2 步：配置 Vercel

### 2.1 創建 Vercel 帳戶

1. 訪問 https://vercel.com
2. 點擊 **Sign up**
3. 選擇 **Continue with GitHub**
4. 授權 Vercel 訪問您的 GitHub 帳戶
5. 完成帳戶設置

### 2.2 導入 GitHub 倉庫

1. 登入 Vercel 後，點擊 **Add New...** → **Project**
2. 點擊 **Import Git Repository**
3. 搜索 `travel-magazine-blog` 倉庫
4. 點擊 **Import**

### 2.3 配置項目設置

在 Vercel 的項目導入頁面上：

1. **Framework Preset:** 選擇 **Other**（因為這是自定義全端應用）
2. **Root Directory:** 保持空白（預設）
3. **Build Command:** 保持預設
4. **Output Directory:** 保持預設

### 2.4 添加環境變數

在 **Environment Variables** 部分，添加以下變數：

| 變數名 | 值 | 說明 |
|-------|-----|------|
| `DATABASE_URL` | 從 PlanetScale 複製 | MySQL 連接字符串 |
| `JWT_SECRET` | 生成隨機字符串 | JWT 簽名密鑰 |
| `BUILT_IN_FORGE_API_KEY` | 您的 API Key | 文件存儲 API Key |
| `BUILT_IN_FORGE_API_URL` | https://api.manus.im | 文件存儲 API URL |
| `VITE_APP_TITLE` | Travel Magazine Blog | 網站標題 |
| `VITE_APP_LOGO` | /logo.png | Logo 路徑 |
| `OWNER_NAME` | Sofia Yan | 網站擁有者名稱 |
| `OWNER_OPEN_ID` | your-open-id | 擁有者 ID |

**如何生成 JWT_SECRET：**

在您的電腦上打開終端，執行：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

複製輸出的字符串，粘貼到 `JWT_SECRET` 欄位。

### 2.5 部署

1. 確認所有環境變數都已添加
2. 點擊 **Deploy**
3. 等待部署完成（通常 3-5 分鐘）

---

## 第 3 步：部署應用

### 3.1 監控部署進度

1. 在 Vercel 儀表板上，您可以看到部署進度
2. 部署完成後，您會看到一個 ✅ 標記
3. 點擊 **Visit** 按鈕查看您的應用

### 3.2 獲取應用 URL

部署完成後，Vercel 會為您分配一個公開 URL，格式如下：
```
https://travel-magazine-blog-[random].vercel.app
```

### 3.3 自定義域名（可選）

如果您想使用自定義域名：

1. 在 Vercel 項目設置中，點擊 **Domains**
2. 點擊 **Add Domain**
3. 輸入您的域名（例如 `blog.example.com`）
4. 按照說明更新您的 DNS 設置

---

## 第 4 步：測試應用

### 4.1 訪問應用

1. 訪問 Vercel 提供的 URL
2. 您應該看到旅行雜誌部落格首頁
3. 測試以下功能：
   - ✅ 首頁加載
   - ✅ 點擊「所有文章」
   - ✅ 點擊「地圖」
   - ✅ 點擊「關於我」

### 4.2 測試後台管理介面

1. 訪問 `/admin.html`
2. 輸入管理員密碼
3. 測試發布新文章的功能

### 4.3 測試資料庫連接

1. 發布一篇測試文章
2. 刷新首頁
3. 新文章應該出現在首頁

---

## 常見問題

### Q1：部署失敗，顯示「Build failed」

**解決方案：**
1. 檢查環境變數是否正確設置
2. 確保 `DATABASE_URL` 包含正確的連接字符串
3. 在 Vercel 儀表板中查看詳細的錯誤日誌

### Q2：資料庫連接錯誤

**解決方案：**
1. 確認 PlanetScale 資料庫已創建
2. 檢查連接字符串是否正確複製
3. 確保 PlanetScale 資料庫處於 **Active** 狀態

### Q3：應用很慢或無法加載

**解決方案：**
1. 檢查 Vercel 儀表板中的日誌
2. 確保所有環境變數都已設置
3. 等待 1-2 分鐘（首次冷啟動可能較慢）

### Q4：如何更新應用？

**解決方案：**
1. 在本地進行代碼修改
2. 推送到 GitHub：`git push origin main`
3. Vercel 會自動檢測到更改並重新部署
4. 部署通常需要 2-3 分鐘

### Q5：如何查看應用日誌？

**解決方案：**
1. 在 Vercel 項目頁面，點擊 **Deployments**
2. 選擇最新的部署
3. 點擊 **Logs** 查看詳細日誌

### Q6：PlanetScale 免費方案有什麼限制？

**限制：**
- 最多 1 個資料庫
- 最多 5GB 存儲
- 最多 1 百萬行讀取
- 最多 10 萬行寫入（每月）

對於個人部落格，這些限制足夠了。

---

## 🎉 部署完成！

恭喜！您的互動式旅行雜誌部落格現在已經在線上運行！

### 下一步：

1. **自定義網站內容**
   - 修改首頁文本
   - 上傳您的 Logo
   - 更新社群媒體連結

2. **發布您的第一篇文章**
   - 訪問 `/admin.html`
   - 登入管理員帳戶
   - 發布您的旅行故事

3. **設置自定義域名**
   - 購買域名（例如 GoDaddy、Namecheap）
   - 在 Vercel 中添加域名
   - 更新 DNS 設置

4. **監控應用**
   - 定期檢查 Vercel 儀表板
   - 監控資料庫使用情況
   - 查看訪問分析

---

## 📞 需要幫助？

如果您遇到任何問題，請：

1. 檢查 Vercel 儀表板中的錯誤日誌
2. 查看 PlanetScale 資料庫狀態
3. 確認所有環境變數都已正確設置

祝您使用愉快！✈️📸🌍

