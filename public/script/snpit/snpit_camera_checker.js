// ethers.jsをインポート
import { ethers } from "https://cdn.jsdelivr.net/npm/ethers/dist/ethers.esm.min.js";

//require('dotenv').config();
const INFURA_PROJECT_ID = `https://polygon-mainnet.infura.io/v3/97e2fae6d39e49d3ab5a0871a0133fe6`;

// ポリゴンのRPCエンドポイント（AlchemyやInfura、QuickNodeを利用）
const provider = new ethers.providers.JsonRpcProvider(INFURA_PROJECT_ID);

// ボタンクリック時の処理
document.getElementById("StartButton").addEventListener("click", async function () {
    // HTMLからコントラクトアドレスを取得
    //const contractAddress = document.getElementById("CONTRACT_ADDRESS").value;
    const contractAddress = "0x8703e7509774A13f6C5516a6e60965B7eec68B5D";

    // ABIを定義
    const contractABI = [
      "function tokenURI(uint256 tokenId) view returns (string)"
    ];
  
    // コントラクトインスタンスを作成
    const nftContract = new ethers.Contract(contractAddress, contractABI, provider);
  
    // 特定のトークンIDのメタデータを取得
    const tokenId = 2001020000026782; // 必要に応じて変更
    try {
      const tokenURI = await nftContract.tokenURI(tokenId);
  
      // IPFSのURIをHTTPのURLに変換
      const metadataURL = tokenURI.startsWith("ipfs://")
        ? tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
        : tokenURI;
  
      // メタデータを取得
      const response = await fetch(metadataURL);
      const metadata = await response.json();
  
      console.log("メタデータ:", metadata);
  
      // 結果をHTMLに表示
      document.getElementById("json").value = JSON.stringify(metadata, null, 2);
    } catch (error) {
      console.error("エラー:", error);
      document.getElementById("json").value = `エラー: ${error.message}`;
    }
  });