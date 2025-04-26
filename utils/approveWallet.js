import rarible from '@api/rarible';
import Web3 from "web3";
import axios from "axios";
import dotenv from 'dotenv';
import fetch from 'node-fetch';

import { Network, initializeAlchemy, getNftsForOwner } from "@alch/alchemy-sdk";

dotenv.config();

// InfuraのプロジェクトIDを設定
const API_KEY = process.env.RARIBLE_API_KEY;
const RARIBLE_API_URL = "https://api.rarible.org/v0.1/items/byOwner";
const approvedWallets = new Set(); // 承認済みウォレット管理
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_PROJECT_ID));

const BASE_URL = "https://api.rarible.org/v0.1/data/collections/";

// ウォレット承認API
export function verifyWallet(req, res) {
    const { walletAddress } = req.body;

    if (web3.utils.isAddress(walletAddress)) {
        approvedWallets.add(walletAddress);
        res.json({ success: true, message: "ウォレットが承認されました。" });
    } else {
        res.status(400).json({ success: false, message: "無効なウォレットアドレスです。" });
    }
}

// NFT一覧取得API
export async function getNFTs(req, res) {
    const walletAddress = req.params.walletAddress;
    console.log("getNFTs: Wallet Address => ", walletAddress);

    // 承認済みウォレットのチェック
    // if (!approvedWallets.has(walletAddress)) {
    //     return res.status(403).json({ success: false, message: "ウォレットが未承認です。" });
    // }

    try {

        const header = {
            "Accept": "application/json",
            "X-API-KEY": API_KEY,
            "Content-Type" : "application/json"
        };

        const response = await fetch(`${RARIBLE_API_URL}?owner=ETHEREUM:${walletAddress}`, {
                method: "GET",
                headers: header
            });

        if (!response.ok) {
            const errorText = await response.text();
            return {
                success: false,
                error: `HTTP error! Status: ${response.status}, Message: ${errorText}`
            };
        }   

        const data = await response.json();
        console.log("item:", data);


        // res.json({ success: true, nfts });
        res.json({
            success: true,
            nfts: data.items.map((item) => ({
                id: item.id,
                name: item.meta?.name || "名前なし",
                image: item.meta?.content ? item.meta.content.find((content) => content?.type?.startsWith("image"))?.url : "画像なし"
            })),
        });
    
    } catch (error) {
        console.error("Error Get NFTs:", error);
        res.status(500).json({ success: false, message: "NFT取得エラー", error: error.message });
    }
}
