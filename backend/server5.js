// server5.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// URLエンコードされたフォームデータを読み取る
app.use(express.urlencoded({ extended: true }));

// データ保存ファイル
const FILE_PATH = path.join(__dirname, "backend/data.json");

// 東京時間を返す関数
function getTokyoTime() {
  return new Date().toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo"
  });
}

// -----------------------------
// ① フォーム（ブラウザ確認用）
// -----------------------------
app.get('/', (req, res) => {
  res.send(`
    <h2>Tweet Submit Form</h2>
    <form action="/submit" method="post">
      <input name="userName" placeholder="名前"><br><br>
      <input name="emoji" placeholder="絵文字"><br><br>
      <input name="text" placeholder="メッセージ"><br><br>
      <input type="submit" value="送信">
    </form>
  `);
});

// -----------------------------
// ② POST: 送信されたツイート保存
// -----------------------------
app.post('/submit', (req, res) => {
  const { userName, text, emoji } = req.body;

  // 既存データを読み込み
  let data = [];
  if (fs.existsSync(FILE_PATH)) {
    try {
      const raw = fs.readFileSync(FILE_PATH, "utf8");
      data = JSON.parse(raw);
      if (!Array.isArray(data)) data = [];
    } catch (e) {
      data = [];
    }
  }

  // 新しいアイテム
  const newItem = {
    emoji: emoji ?? "🐈",
    userName: userName ?? "名前",
    text: text ?? "メッセージ",
    createdAt: getTokyoTime()
  };

  // 追加して保存
  data.push(newItem);
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));

  res.send("保存しました: " + JSON.stringify(newItem));
});

// -----------------------------
// ③ GET: 一覧取得（Flutter側が読む用）
// -----------------------------
app.get('/tweets', (req, res) => {
  let data = [];
  if (fs.existsSync(FILE_PATH)) {
    try {
      data = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
      if (!Array.isArray(data)) data = [];
    } catch (e) {
      data = [];
    }
  }
  res.json(data);
});

// -----------------------------
// 起動
// -----------------------------
app.listen(2316, () => console.log("http://localhost:2316/"));