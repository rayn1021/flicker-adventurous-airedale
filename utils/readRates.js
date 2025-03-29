import fs from 'fs'; // ファイル操作モジュール

// 保存先のファイルパス
// ファイルからデータを読み取る関数
async function readRates(targetCurrencies = "jpy") {
    const FILE_PATH = `./crypto_rates_${targetCurrencies}.json`;

    let rates = "";
    try {
        // ファイルが存在するか確認
        if (fs.existsSync(FILE_PATH)) {
            // ファイルを読み取る
            const data = fs.readFileSync(FILE_PATH, 'utf-8');

            // JSON文字列をオブジェクトに変換
            rates = JSON.parse(data);

            // データを表示
            console.log('保存された仮想通貨レート:');
            console.log(rates);
        } else {
            console.error('レートデータが見つかりません。ファイルを生成してください。');
        }
    } catch (error) {
        console.error('データ読み取り中にエラーが発生しました:', error.message);
    }

    return rates;
}

// 実行
//readCryptoRates();
// module.exports = { getCameraData };
export { readRates }; // 関数をexport