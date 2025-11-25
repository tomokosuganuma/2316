const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'data.json');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get('/', (req, res) => {
  res.send(`
    <form action="/submit" method="post">
      <input name="userName" placeholder="名前">
      <input name="text" placeholder="メッセージ">
      <input type="submit" value="送信">
    </form>
  `);
});

function readDataFile() {
  let data = [];
  if (fs.existsSync(FILE_PATH)) {
    try {
      const raw = fs.readFileSync(FILE_PATH, 'utf8');
      const json = JSON.parse(raw);
      if (Array.isArray(json)) {
        data = json;
      }
    } catch (e) {
      console.error('JSON parse error:', e);
    }
  }
  return data;
}

function writeDataFile(data) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
}

app.post('/submit', (req, res) => {
  const { userName, text } = req.body;

  const now = new Date();
  const createdAt =
    now.getFullYear() +
    '/' +
    String(now.getMonth() + 1).padStart(2, '0') +
    '/' +
    String(now.getDate()).padStart(2, '0') +
    ' ' +
    String(now.getHours()).padStart(2, '0') +
    ':' +
    String(now.getMinutes()).padStart(2, '0') +
    ':' +
    String(now.getSeconds()).padStart(2, '0');

  const newItem = {
    emoji: '🐈',
    userName: userName || '名前',
    text: text || 'メッセージ',
    createdAt: createdAt,
  };

  let data = readDataFile();
  data.unshift(newItem);
  writeDataFile(data);

  res.json(data);
});

app.get('/tweets', (req, res) => {
  const data = readDataFile();
  res.json(data);
});

app.listen(3000, () => console.log('http://localhost:3000/'));
