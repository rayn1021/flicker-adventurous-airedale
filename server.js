// const express = require('express');
// const path = require('path');
// const { getCameraData } = require("./utils/getCameraData");  // カメラチェッカー
import express from 'express'; // ESモジュールでインポート
import path from 'path'; // ESモジュールでインポート
import { fileURLToPath } from 'url'
import { getCameraData } from './utils/getCameraData.js'; // 関数をインポート
import { readRates } from './utils/readRates.js';         // 関数をインポート
import { getFloorPrice } from './utils/getFloorPrice.js';         // 関数をインポート

const app = express();

// __dirnameを使用するための代替方法
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 静的ファイルを提供するディレクトリを設定
app.use(express.static(path.join(__dirname, 'public')));

// 「カメラデータの取得」のAPIエンドポイントを作成
app.get("/api/getCameraData", async (req, res) => {
    const { contractAddress, tokenId } = req.query;
  
    if (!contractAddress || !tokenId) {
      return res.status(400).json({ error: "contractAddressとtokenIdが必要です。" });
    }
  
    try {
      const metadata = await getCameraData(contractAddress, tokenId);
      res.json(metadata);
    } catch (error) {
        // エラーをコンソールに出力
        console.error("エラーが発生しました:", error.message, error.stack);

        // エラー詳細をレスポンスとして返す (開発用)
        res.status(500).json({ error: error.message, stack: error.stack });    
    }
  });

// 「レートの取得」のAPIエンドポイントを作成
app.get("/api/readRates", async (req, res) => {
  try {
    const { target } = req.query;
    console.log(`readRates running:${target}`);
    const rates = await readRates(target);
    res.json(rates);
  } catch (error) {
      // エラーをコンソールに出力
      console.error("エラーが発生しました:", error.message, error.stack);

      // エラー詳細をレスポンスとして返す (開発用)
      res.status(500).json({ error: error.message, stack: error.stack });    
  }
});

// 「フロア価格取得」のAPIエンドポイントを作成
app.get("/api/getFloorPrice", async (req, res) => {
  const { target } = req.query;

  let collectionAddress = "";
  if (target == 'CAMERA'){
    collectionAddress="0x8703e7509774a13f6c5516a6e60965b7eec68b5d";
  }
  if (target == 'MintScroll'){
    collectionAddress="0xA8CC4E745a5E6F178511935A713aA17b1A5144c0";
  }
  let blockchain = "POLYGON"

  try {
    const floorPrice = await getFloorPrice(collectionAddress, blockchain);
    res.json(floorPrice);
  } catch (error) {
      // エラーをコンソールに出力
      console.error("エラーが発生しました:", error.message, error.stack);

      // エラー詳細をレスポンスとして返す (開発用)
      res.status(500).json({ error: error.message, stack: error.stack });    
  }
});

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

