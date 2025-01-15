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
    var sleepTime = 3000;

    // 抽選中の画像を表示
    //dialog.show();

     // 実行中ウィンドウを表示
    const loadingOverlay = showLoading();

    // 抽選処理
    for (let i = 0; i < times; i++) {
        let ransu = Math.random();
        let itemName = "";
        let itemCount = "";

        let j = 0;
        let border = 0
        var endFlg = true;
        
        while (endFlg) {
            border += raffle[j] / 100
            if (border >= ransu) {
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
     //dialog.close();

     // 実行中ウィンドウを非表示
     await sleep(sleepTime);
     hideLoading(loadingOverlay); 

}


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showLoading() {
    // オーバーレイを作成
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "9999"; // 他の要素の上に表示
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
  
    // 「実行中」のメッセージを作成
    const message = document.createElement("div");
    message.textContent = "抽選中...";
    message.style.backgroundColor = "white";
    message.style.padding = "20px 40px";
    message.style.borderRadius = "10px";
    message.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    message.style.fontSize = "18px";
    message.style.fontWeight = "bold";
  
    // 要素をオーバーレイに追加
    overlay.appendChild(message);
  
    // ドキュメントにオーバーレイを追加
    document.body.appendChild(overlay);
  
    // 戻り値としてオーバーレイ要素を返す（後で削除するため）
    return overlay;
  }
  
  function hideLoading(overlay) {
    // オーバーレイを削除
    if (overlay) {
      document.body.removeChild(overlay);
    }
  }