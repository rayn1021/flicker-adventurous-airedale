import axios from 'axios';
import fs from 'fs';

// 保存先のファイルパス


// 仮想通貨価格を取得する関数
async function fetchCryptoRates(targetCurrencies = "jpy") {
    try {
        console.log(`fetchCryptoRates:${targetCurrencies}`);
        const FILE_PATH = `./crypto_rates_${targetCurrencies}.json`;
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: 'snpit-token,the-land-elf-crossing,usd,matic-network', // 仮想通貨ID
                vs_currencies: targetCurrencies    // 日本円
            }
        });
        //console.log(response.data);

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
fetchCryptoRates('usd');
fetchCryptoRates('jpy');