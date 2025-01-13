const express = require('express');
const path = require('path');
const app = express();

// 静的ファイルを提供するディレクトリを設定
app.use(express.static(path.join(__dirname, 'public')));

// ルートエンドポイントでindex.htmlを提供
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// その他のリクエストに対して静的ファイルを提供
app.get('*', (req, res) => {
    let filePath = path.join(__dirname, 'public', req.url);
    res.sendFile(filePath);
});

// 404ページをカスタマイズ
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// サーバーを開始
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});