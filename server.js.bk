const express = require('express');
const app = express();
const path = require('path');

// 静的ファイルを提供（例: HTML, CSS, JS）
app.use(express.static('public'));

// ルートにアクセスしたときにindex.htmlを返す
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// サーバーを開始
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
