# 🤖 GitHub Actions 自動部署完整指南

**給完全不懂程式碼的人的簡單指南**

---

## 📋 什麼是 GitHub Actions？

GitHub Actions 是 GitHub 提供的自動化工具，它可以：

✅ 自動編譯和測試您的代碼
✅ 自動將網站部署到 GitHub Pages
✅ 自動更新文章數據庫
✅ 24/7 自動運行，無需您手動操作

**簡單來說：** 您只需要上傳代碼，GitHub 會自動為您部署網站！

---

## 🎯 您的部落格有兩個自動化工作流程

### **工作流程 1：自動部署（Deploy）**

**觸發條件：** 當您推送代碼到 GitHub 時

**自動執行的步驟：**
1. 檢出您的代碼
2. 安裝 Node.js 環境
3. 安裝項目依賴
4. 編譯您的網站
5. 上傳到 GitHub Pages
6. 網站自動更新！

**耗時：** 2-5 分鐘

### **工作流程 2：發布文章（Publish Article）**

**觸發條件：** 當您在後台管理介面發布文章時

**自動執行的步驟：**
1. 接收您的文章數據
2. 更新文章數據庫（posts-db.json）
3. 提交更改到 GitHub
4. 觸發自動部署工作流程
5. 網站自動更新，新文章出現！

**耗時：** 2-5 分鐘

---

## 🚀 設置步驟

### **步驟 1：確保工作流程文件存在**

工作流程文件已經包含在您下載的 ZIP 文件中：

```
.github/
└── workflows/
    ├── deploy.yml          ✅ 自動部署配置
    └── publish-article.yml ✅ 發布文章配置
```

**您無需修改這些文件！** 它們已經正確配置。

### **步驟 2：上傳代碼到 GitHub**

按照 DEPLOYMENT_GUIDE_SIMPLE.md 的「第四步」上傳代碼：

```bash
git init
git add .
git commit -m "Initial commit: Travel magazine blog"
git remote add origin https://github.com/YOUR_USERNAME/travel-magazine-blog.git
git branch -M main
git push -u origin main
```

### **步驟 3：啟用 GitHub Pages**

1. 進入 GitHub 倉庫
2. 點擊 **Settings**（設置）
3. 在左側邊欄選擇 **Pages**
4. 在 **Source** 下拉菜單中選擇 **GitHub Actions**
5. 頁面會自動重新加載

### **步驟 4：檢查工作流程運行**

1. 進入您的 GitHub 倉庫
2. 點擊頂部的 **Actions**（操作）標籤
3. 您應該看到一個正在運行的工作流程（名稱：「Deploy to GitHub Pages」）
4. 等待它完成（通常 2-5 分鐘）
5. 完成後，您會看到一個綠色的 ✅ 標記

### **步驟 5：訪問您的網站**

1. 回到 **Settings** → **Pages**
2. 您應該看到類似的訊息：
   ```
   Your site is published at https://your-username.github.io/travel-magazine-blog/
   ```
3. 點擊這個連結訪問您的網站！ 🎉

---

## 📊 工作流程詳細說明

### **自動部署工作流程（deploy.yml）**

```
┌─────────────────────────────────────┐
│ 您推送代碼到 GitHub                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ GitHub Actions 自動啟動              │
│ 1. 檢出代碼                          │
│ 2. 安裝 Node.js                      │
│ 3. 安裝依賴                          │
│ 4. 編譯網站                          │
│ 5. 上傳到 GitHub Pages               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 網站自動更新！                        │
│ 訪問 https://your-username.github... │
└─────────────────────────────────────┘
```

**觸發方式：**
- ✅ 推送代碼到 main 分支
- ✅ 手動觸發（在 Actions 標籤中點擊「Run workflow」）

**配置文件位置：** `.github/workflows/deploy.yml`

### **發布文章工作流程（publish-article.yml）**

```
┌─────────────────────────────────────┐
│ 您在後台管理介面發布文章              │
│ 點擊「Publish Article」按鈕           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 文章數據發送到 GitHub Actions         │
│ 1. 解析文章數據                      │
│ 2. 更新 posts-db.json                │
│ 3. 提交到 GitHub                     │
│ 4. 觸發自動部署                      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 自動部署工作流程啟動                  │
│ （同上面的流程）                      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 網站更新，新文章出現！                │
└─────────────────────────────────────┘
```

**觸發方式：**
- ✅ 在後台管理介面（admin.html）發布文章
- ✅ 手動觸發（在 Actions 標籤中點擊「Run workflow」）

**配置文件位置：** `.github/workflows/publish-article.yml`

---

## 🔍 監控工作流程執行

### **查看工作流程狀態**

1. 進入您的 GitHub 倉庫
2. 點擊 **Actions** 標籤
3. 您會看到所有工作流程的列表

### **工作流程狀態說明**

| 狀態 | 圖標 | 含義 |
|------|------|------|
| 進行中 | 🟡 | 工作流程正在運行 |
| 成功 | ✅ | 工作流程完成，網站已更新 |
| 失敗 | ❌ | 工作流程出錯，需要檢查 |
| 已取消 | ⏹️ | 工作流程被手動取消 |

### **查看詳細日誌**

1. 點擊任何工作流程
2. 點擊 **build** 或 **deploy** 步驟
3. 您會看到詳細的執行日誌
4. 如果出錯，日誌會顯示錯誤信息

---

## ⚙️ 常見設置問題

### **Q1：工作流程沒有自動運行？**

**A：** 檢查以下幾點：

1. ✅ 確保代碼已推送到 **main** 分支
2. ✅ 確保 `.github/workflows/` 文件夾存在
3. ✅ 確保 GitHub Pages 已啟用（Settings → Pages → Source: GitHub Actions）
4. ✅ 刷新 Actions 標籤頁面

### **Q2：工作流程失敗（❌）怎麼辦？**

**A：** 查看錯誤日誌：

1. 點擊失敗的工作流程
2. 點擊 **build** 步驟
3. 查看紅色的錯誤信息
4. 常見錯誤：
   - **依賴安裝失敗** → 重新推送代碼
   - **編譯失敗** → 檢查代碼是否有語法錯誤
   - **部署失敗** → 檢查 GitHub Pages 設置

### **Q3：網站沒有更新？**

**A：** 可能的原因：

1. ⏳ 工作流程還在運行 → 等待 2-5 分鐘
2. 🔄 瀏覽器緩存 → 按 `Ctrl+F5` 強制刷新
3. ❌ 工作流程失敗 → 查看 Actions 標籤中的錯誤
4. 🌐 DNS 緩存 → 等待 15-30 分鐘

### **Q4：如何手動觸發工作流程？**

**A：** 如果您想立即部署而不推送代碼：

1. 進入 GitHub 倉庫
2. 點擊 **Actions** 標籤
3. 在左側選擇 **Deploy to GitHub Pages**
4. 點擊 **Run workflow** 按鈕
5. 選擇 **main** 分支
6. 點擊 **Run workflow**
7. 工作流程會立即開始運行

---

## 🔐 安全性考慮

### **GitHub Actions 的權限**

您的工作流程有以下權限：

- ✅ **read contents** - 讀取您的代碼
- ✅ **write pages** - 寫入 GitHub Pages
- ✅ **write id-token** - 用於身份驗證

**這些權限是安全的，只用於部署您的網站。**

### **個人訪問令牌（Personal Access Token）**

在後台管理介面中，您需要輸入 Personal Access Token：

- ✅ Token 只在您的電腦上存儲
- ✅ Token 不會上傳到 GitHub
- ✅ Token 用於發布文章時更新數據庫
- ⚠️ 定期檢查 Token 的有效期

---

## 📈 工作流程性能

### **典型的執行時間**

| 步驟 | 耗時 |
|------|------|
| 檢出代碼 | 10-20 秒 |
| 安裝環境 | 30-60 秒 |
| 安裝依賴 | 30-60 秒 |
| 編譯網站 | 30-60 秒 |
| 上傳和部署 | 30-60 秒 |
| **總耗時** | **2-5 分鐘** |

### **優化建議**

- 📦 保持依賴最新（定期更新 package.json）
- 🖼️ 優化圖片大小（< 1MB）
- 📝 避免過大的文章內容
- 🗺️ 限制 GPX 文件大小

---

## 🎯 最佳實踐

### **定期推送代碼**

```bash
# 本地修改後
git add .
git commit -m "描述您的更改"
git push
```

### **發布文章時**

1. 在後台管理介面填寫完整信息
2. 點擊 **Publish Article**
3. 等待 2-5 分鐘
4. 刷新網站查看新文章

### **定期檢查工作流程**

1. 每週檢查一次 Actions 標籤
2. 確保沒有失敗的工作流程
3. 查看部署日誌

### **備份您的倉庫**

```bash
# 定期備份
git clone --mirror https://github.com/your-username/travel-magazine-blog.git
```

---

## 🆘 故障排除

### **工作流程日誌中的常見錯誤**

**錯誤 1：「npm ERR! code ERESOLVE」**
- 原因：依賴版本衝突
- 解決：刪除 node_modules 和 package-lock.json，重新推送

**錯誤 2：「Error: ENOENT: no such file or directory」**
- 原因：文件不存在
- 解決：檢查文件路徑是否正確

**錯誤 3：「Permission denied」**
- 原因：權限不足
- 解決：檢查 GitHub Pages 設置

**錯誤 4：「Deployment failed」**
- 原因：部署配置錯誤
- 解決：檢查 Settings → Pages 的配置

---

## 📞 需要幫助？

如果工作流程出現問題：

1. 查看本指南的「故障排除」部分
2. 檢查 GitHub Actions 的詳細日誌
3. 查看 GitHub 倉庫的 README.md 文件
4. 在 GitHub Issues 中提出問題

---

## ✅ 檢查清單

部署前，確保您已完成以下步驟：

- [ ] 代碼已推送到 GitHub
- [ ] `.github/workflows/` 文件夾存在
- [ ] GitHub Pages 已啟用（Source: GitHub Actions）
- [ ] 第一次部署已完成（看到綠色 ✅）
- [ ] 網站可以訪問（https://your-username.github.io/travel-magazine-blog/）
- [ ] 後台管理介面可以訪問
- [ ] Personal Access Token 已生成並保存
- [ ] 已發布至少一篇測試文章

---

**最後更新：2025 年 10 月 25 日**

祝您的自動部署順利運行！🚀

