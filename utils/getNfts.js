import { ethers } from 'ethers';
import fetch from 'node-fetch';
import fs from 'fs';
import path from "path";
import dotenv from 'dotenv';
dotenv.config();

//const provider = new JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);
const provider = new ethers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);

const contractsPath = path.resolve('./etc/contracts.json');
const contracts = JSON.parse(fs.readFileSync(contractsPath, 'utf-8'));

export default async function getNftsHandler(req, res) {
    const { wallet } = req.body;
    const results = [];

    console.log("wallet Address: " + wallet); 
    if (!wallet || !wallet.startsWith('0x')) {
        return res.status(400).json({ error: "Invalid wallet address." });
    }
    
    try {
        for (const address of contracts.erc721) {
            const abi = ["function balanceOf(address owner) view returns (uint256)", "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)"];
            //const contract = new Contract(address, abi, provider);
            const contract = new ethers.Contract(address, abi, provider);
            
            console.log(`Checking balance for wallet ${wallet} in ERC721 contract ${address}...`);
            const balance = await contract.balanceOf(wallet);
            console.log(`Balance of ${wallet} for ERC721 contract ${address}:`, balance.toString()); // バランスをログに出力

            const metadataContract = new ethers.Contract(address, [
                "function tokenURI(uint256 tokenId) view returns (string)"
            ], provider);
            
            for (let i = 0; i < balance; i++) {
                const tokenId = await contract.tokenOfOwnerByIndex(wallet, i);
                console.log(`Token ID at index ${i}: ${tokenId.toString()}`); // トークンIDをログに出力
                const metadata = await fetchTokenMetadata(metadataContract, tokenId);
                results.push({
                    type: 'ERC721',
                    contract: address,
                    tokenId: tokenId.toString(),
                    name: metadata.name || `Token #${tokenId}`,
                    image: metadata.image || ''
                });
            }
            
        }

        for (const address of contracts.erc1155) {
            const abi = ["function balanceOf(address account, uint256 id) view returns (uint256)"];
            const contract = new ethers.Contract(address, abi, provider);
            const metadataContract = new ethers.Contract(address, erc1155MetadataAbi, provider);
        
            for (let id = 1; id <= 10; id++) {
                const balance = await contract.balanceOf(wallet, id);
                console.log(`Balance of token ID ${id} for ERC1155 contract ${address}:`, balance.toString());
                if (balance > 0n) {
                    const metadata = await fetch1155TokenMetadata(metadataContract, id);
                    results.push({
                        type: 'ERC1155',
                        contract: address,
                        tokenId: id,
                        amount: balance.toString(),
                        name: metadata.name || `Token #${id}`,
                        image: metadata.image || ''
                    });
                }
            }
        }
        
        res.json(results);
    } catch (err) {
        console.error('NFT取得エラー:', err);
        res.status(500).json({ error: err.message });
    }
}

const erc721Abi = [
    "function tokenURI(uint256 tokenId) view returns (string)"
];

async function fetchTokenMetadata(contract, tokenId) {
    try {
        const tokenUri = await contract.tokenURI(tokenId);
        const url = tokenUri.replace(/^ipfs:\/\//, 'https://ipfs.io/ipfs/');
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(`メタデータ取得失敗: ${tokenId}`, error);
        return {};
    }
}

const erc1155MetadataAbi = [
    "function uri(uint256 id) view returns (string)"
];
async function fetch1155TokenMetadata(contract, tokenId) {
    try {
        // トークンのURIを取得
        let tokenUri = await contract.uri(tokenId);
        
        // URIがipfs://の場合、HTTP形式に変換
        if (tokenUri.startsWith('ipfs://')) {
            tokenUri = tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
        }

        console.log(`取得中: ${tokenUri}`);
        
        // メタデータURL内に {id} が含まれているかをチェック
        if (tokenUri.includes("{id}")) {
            // idを0埋め（必要な桁数に応じて）
            tokenUri = tokenUri.replace("{id}", tokenId); // {id} を埋め込む
        }

        const response = await fetch(tokenUri);
        if (!response.ok) {
            console.error(`メタデータURL無効: ${tokenUri}`);
            return {};
        }

        const metadata = await response.json();

        // 画像URLがipfs://の場合、HTTP形式に変換
        if (metadata.image && metadata.image.startsWith('ipfs://')) {
            metadata.image = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
        }

        
        return {
            name: metadata.name || `Token #${tokenId}`, // メタデータから名前を取得
            description: metadata.description || 'No description available', // 説明
            image: metadata.image || '', // 画像URL
            external_url: metadata.external_url || '', // 外部URL（あれば）
            attributes: metadata.attributes || [] // 属性情報（あれば）
        };
    } catch (error) {
        console.error(`ERC1155メタデータ取得失敗: ${tokenId}`, error);
        return {};
    }
}