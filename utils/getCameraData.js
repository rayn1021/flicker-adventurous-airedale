// 必要なパッケージをインポート
//const { JsonRpcProvider, Contract } = require("ethers");
//const fetch = require("node-fetch");
//require("dotenv").config();
import { JsonRpcProvider, Contract } from 'ethers';
import fetch from 'node-fetch';  // ESモジュールとしてインポート
import dotenv from 'dotenv';

dotenv.config();

// InfuraのプロジェクトIDを設定
//const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;
if (!INFURA_PROJECT_ID) {
  throw new Error("INFURA_PROJECT_IDが設定されていません。");
}

// ポリゴンのRPCエンドポイント
const provider = new JsonRpcProvider(INFURA_PROJECT_ID);

// メイン処理を関数化
async function getCameraData(contractAddress, tokenId) {
  // コントラクトのABIを定義
  const contractABI = [
    "function tokenURI(uint256 tokenId) view returns (string)"
  ];

  // コントラクトインスタンスを作成
  const nftContract = new Contract(contractAddress, contractABI, provider);

  try {
    // 特定のトークンIDのメタデータURIを取得
    const tokenURI = await nftContract.tokenURI(tokenId);

    // IPFSのURIをHTTPのURLに変換
    const metadataURL = tokenURI.startsWith("ipfs://")
      ? tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
      : tokenURI;
      console.log("tokenURI:", tokenURI);

    // メタデータを取得
    const response = await fetch(metadataURL);
    const metadata = await response.json();

    console.log("メタデータ:", metadata);

    // 結果を返す
    return metadata;
  } catch (error) {
    console.error("エラー:", error);
    throw new Error(`エラー: ${error.message}`);
  }
}

// module.exports = { getCameraData };
export { getCameraData }; // 関数をexport