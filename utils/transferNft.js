import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

export default async function transferNftHandler(req, res) {
    try {
        const { wallet, signature } = req.body;
        const operatorWallet = process.env.ADMIN_WALLET;

        if (!wallet || !signature) {
            return res.status(400).json({ error: 'ウォレットアドレスと署名が必要です。' });
        }

        const expectedMessage = "NFT Transfer Request";
        const signerAddress = ethers.utils.verifyMessage(expectedMessage, signature);

        if (signerAddress.toLowerCase() !== wallet.toLowerCase()) {
            return res.status(403).json({ error: '署名検証に失敗しました。' });
        }

        if (!operatorWallet) {
            return res.status(500).json({ error: '運営ウォレットアドレスが設定されていません。' });
        }

        res.json({ success: true, toAddress: operatorWallet });
    } catch (error) {
        console.error('署名検証/運営アドレス取得エラー:', error);
        res.status(500).json({ error: 'サーバーエラー' });
    }
}

// import dotenv from 'dotenv';
// dotenv.config();

// export default async function transferNftHandler(req, res) {
//     try {
//         // 運営ウォレットアドレスを返す
//         const operatorWallet = process.env.ADMIN_WALLET;
//         if (!operatorWallet) {
//             return res.status(500).json({ error: '運営ウォレットアドレスが設定されていません。' });
//         }

//         res.json({ success: true, toAddress: operatorWallet });
//     } catch (error) {
//         console.error('運営ウォレットアドレス取得エラー:', error);
//         res.status(500).json({ error: 'アドレス取得エラー' });
//     }
// }
