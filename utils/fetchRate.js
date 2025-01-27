import axios from 'axios';
import fs from 'fs';

// 保存先のファイルパス
const FILE_PATH = './crypto_rates.json';

// 仮想通貨価格を取得する関数
async function fetchCryptoRates() {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: 'snpit-token,the-land-elf-crossing', // 仮想通貨ID
                vs_currencies: 'jpy'    // 日本円
            }
        });
        console.log(response.data);

        const rates = response.data;
        const timestamp = new Date().toISOString();

        // データにタイムスタンプを追加
        const dataToSave = {
            timestamp,
            rates
        };

        // データをJSONファイルに保存
        fs.writeFileSync(FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');
        console.log('仮想通貨レートを保存しました:', dataToSave);
    } catch (error) {
        console.error('レート取得中にエラーが発生しました:', error.message);
    }
}

// 実行
fetchCryptoRates();