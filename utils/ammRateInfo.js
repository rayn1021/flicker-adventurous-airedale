import axios from 'axios';
import fs from 'fs';

// 保存先のファイルパス


// 仮想通貨価格を取得する関数
async function writeAmmRate(ammRate) {
    try {
        let FILE_PATH = `./amm_rates.json`;
        //console.log(response.data);

        let rates = ammRate;
        let timestamp = new Date().toISOString();
4
        // データにタイムスタンプを追加
        const dataToSave = {
            timestamp,
            rates
        };

        // データをJSONファイルに保存
        fs.writeFileSync(FILE_PATH, JSON.stringify(dataToSave, null, 2), 'utf-8');

        return rates;
    } catch (error) {
        console.error('レート取得中にエラーが発生しました:', error.message);
    }
}

async function readAmmRate() {
    const FILE_PATH = `./amm_rates.json`;

    try {
        if (fs.existsSync(FILE_PATH)) {
            const jsondata = fs.readFileSync(FILE_PATH, 'utf-8');
            const parsedData = JSON.parse(jsondata);

            if (!jsondata) {
                throw new Error("ファイルが空です。");
            }
            if (parsedData && parsedData.rates !== undefined) {
                return parsedData;
            } else {
                throw new Error("ファイル形式が不正です。");
            }
        } else {
            throw new Error("ファイルが存在しません。");
        }
    } catch (error) {
        console.error('データ読み取り中にエラーが発生しました:', error.message);
        return { rates: 0 }; // ← 最低限のデータを返すようにする！
    }
}

export { writeAmmRate, readAmmRate }; // 関数をexport
