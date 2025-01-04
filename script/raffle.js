var totalPrize = 0;
var totalBill = 0;
var result = {};
var resultImage = {};

async function raffle(raffleList, itemList, prizeList, imageList, bill, gachaKbn){
    // 入力項目の値を取得
    var times = parseFloat(document.getElementById("TIMES").value);
    var type = parseFloat(document.getElementById("TYPE").value);
    var raffleImg = document.getElementById("raffleImage");
    var effectFlg = document.getElementById("EffectFlg").checked;

    // 入力から配列を決定
    let raffle = raffleList[type];
    let item = itemList[type];
    let img = imageList[type];
    let prize = prizeList[type];

    // 作業エリアの定義
    totalPrize = 0;
    totalBill = bill * times;

    for (let i = 0; i < item.length; i++) {
        result[item[i]] = 0;
        resultImage[item[i]] = img[i];
    };

    // sleep時間の算出
    var sleepTime = 5000 / times;

    // 抽選中の画像を表示
    dialog.show();

    // 抽選処理
    for (i = 0; i < times; i++) {
        let ransu = Math.random();
        let itemName = "";
        let itemCount = "";

        let j = 0;
        var endFlg = true;
        while (endFlg) {
            if (raffle[j] >= ransu) {
                // 抽選会数の加算
                count = result[item[j]];
                result[item[j]] = count + 1;

                // 獲得金額の加算
                totalPrize = totalPrize + prize[j];

                
                endFlg=false;
                if (effectFlg){
                    raffleImg.src = "https://cdn.glitch.global/7d43b8f5-2de2-444f-b615-ec73b3fc0e82/" + img[j];
                    await sleep(sleepTime);
                }
            }
            j++;
        }
    }
        
     // 抽選中の画像を非表示
     dialog.close();

}


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}