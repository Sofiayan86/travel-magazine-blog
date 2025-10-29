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
    if (!articlesData || articlesData.length === 0) {
      console.log('⚠️ Articles Sheet 為空');
      return;
    }

    const headers = articlesData[0];
    const articles = [];

    // 轉換為 JSON
    for (let i = 1; i < articlesData.length; i++) {
      const row = articlesData[i];
      if (row && row[0]) { // 如果有 ID
        const article = {};
        headers.forEach((header, index) => {
          article[header] = row[index] || '';
        });
        articles.push(article);
      }
    }

    // 讀取 Settings Sheet
    let settings = {
      siteTitle: 'Journeys & Discoveries',
      siteDescription: 'A personal travel magazine',
      ownerName: 'Sofia Yan',
    };

    try {
      const settingsResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        range: 'Settings!A:B',
      });

      const settingsData = settingsResponse.data.values;
      if (settingsData && settingsData.length > 0) {
        for (let i = 1; i < settingsData.length; i++) {
          const [key, value] = settingsData[i] || [];
          if (key && value) {
            settings[key] = value;
          }
        }
      }
    } catch (e) {
      console.log('⚠️ Settings Sheet 不存在，使用預設值');
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
    console.log(`📝 同步了 ${articles.length} 篇文章`);

  } catch (error) {
    console.error('❌ 同步失敗：', error.message);
    process.exit(1);
  }
}

syncGoogleSheets();

