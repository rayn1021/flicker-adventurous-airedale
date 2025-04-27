var cCameraPrice = "";
var ucCameraPrice = "";
var cgCameraPrice = "";
var ucgCameraPrice = "";
var ammRate = "";
var snptJpy = "";
var stpJpy = "";
var usdJpy = "";
var polJpy = "";
var commission = 0.075;

var levelCostArr = 
    [[0.4, 0.8, 1.2, 1.6, 20, 2.4, 2.8, 3.2, 3.6, 40, 4.4, 4.8, 5.2, 5.6, 60, 6.4, 6.8, 7.2, 7.6, 80, 8.4, 8.8, 9.2, 9.6, 100, 10.4, 10.8, 11.2, 11.6, 120],
     [0.4, 0.8, 1.2, 1.6, 20, 2.4, 2.8, 3.2, 3.6, 40, 4.4, 4.8, 5.2, 5.6, 60, 6.4, 6.8, 7.2, 7.6, 80, 8.4, 8.8, 9.2, 9.6, 100, 10.4, 10.8, 11.2, 11.6, 120],
     [0.8, 1.6, 2.4, 3.2, 40, 4.8, 5.6, 6.4, 7.2, 80, 8.8, 9.6, 10.4, 11.2, 120, 12.8, 13.6, 14.4, 15.2, 160, 16.8, 17.6, 18.4, 19.2, 200, 20.8, 21.6, 22.4, 23.2, 240],
     [0.8, 1.6, 2.4, 3.2, 40, 4.8, 5.6, 6.4, 7.2, 80, 8.8, 9.6, 10.4, 11.2, 120, 12.8, 13.6, 14.4, 15.2, 160, 16.8, 17.6, 18.4, 19.2, 200, 20.8, 21.6, 22.4, 23.2, 240]];


window.addEventListener("load", async () => {
    const loadingOverlay = showLoading("フロア価格読み込み中．．．");
    try {
  
      // AMMレートを取得
      await getAmmRate();

      // レートの取得
      await getrates();
  
      //カメラ/ミンスクのフロア価格の取得
      await getFloorPrices();

      document.getElementById("eCameraPrice").value = cgCameraPrice;
      document.getElementById("qCameraPrice").value = cCameraPrice;
      document.getElementById("ammRate").value = ammRate;

      document.getElementById("rateUsdJPy").innerText = usdJpy;
      document.getElementById("ratePolJPy").innerText = polJpy;
      document.getElementById("rateStpJpy").innerText = stpJpy;
      document.getElementById("rateSnptJpy").innerText = snptJpy;

    } catch (error) {
        console.error(error);
    }

       // カメラタイプのラジオボタン全て取得
       document.querySelectorAll('input[name="eCameraTypeButton"]').forEach(function(radio) {
            radio.addEventListener('change', function() {
                setFloorPrice(this.value, "eCameraPrice");
            });
        });

       // カメラタイプのラジオボタン全て取得
       document.querySelectorAll('input[name="qCameraTypeButton"]').forEach(function(radio) {
        radio.addEventListener('change', function() {
            setFloorPrice(this.value, "qCameraPrice");
        });
    });

    hideLoading(loadingOverlay); 
});
  
function setFloorPrice(type, elmId){
    var elmTarget = document.getElementById(elmId);
    switch(type){
        case "0":
            elmTarget.value = cgCameraPrice;
            break;
        case "1":
            elmTarget.value = cCameraPrice;
            break;
        case "2":
            elmTarget.value = ucgCameraPrice;
            break;
        case "3":
            elmTarget.value = ucCameraPrice;
            break;
    }
    document.getElementById("eCameraCurrency").value='usd'
}

/*
 * レートの取得
 */
async function getrates(){
    const response = await fetch(`/api/readRates?target=jpy`);
    if (!response.ok) {
        alert('レートを取得できませんでした。');
        throw new Error(`サーバーエラー: ${response.statusText}`);
    }
    const data = await response.json();
    snptJpy = roundToDecimal(data.rates['snpit-token'].jpy, 2);
    usdJpy = roundToDecimal(data.rates['usd'].jpy, 2);
    polJpy = roundToDecimal(data.rates['matic-network'].jpy, 2);
    stpJpy = roundToDecimal(document.getElementById("ammRate").value * snptJpy, 4);
    rateTimestamp = formatDate(data.timestamp);
}

/*
* カメラ/ミンスクのフロア価格の取得
*/
async function getFloorPrices(){
  // カメラのフロア価格を取得
  const cameraResponse = await fetch(`/api/getFloorPrice?target=CAMERA`);
  if (!cameraResponse.ok) {
    alert('フロア価格を取得できませんでした。\n以下までご連絡ください。\n https://x.com/Rayn73747887');
    throw new Error(`サーバーエラー: ${response.statusText}`);
  }

  const cameraData = await cameraResponse.json();

  cCameraPrice = roundToDecimal(cameraData.floorPrices.COMMONNo, 2);
  ucCameraPrice = roundToDecimal(cameraData.floorPrices.UNCOMMONNo, 2);
  cgCameraPrice = roundToDecimal(cameraData.floorPrices.COMMONYes, 2);
  ucgCameraPrice = roundToDecimal(cameraData.floorPrices.UNCOMMONYes, 2);
}

async function getAmmRate(){
    const response = await fetch(`/api/getAmmRate`);
    if (!response.ok) {
        alert('レートを取得できませんでした。');
        throw new Error(`サーバーエラー: ${response.statusText}`);
    }
    const data = await response.json();
    ammRate = data.rates;
    document.getElementById("ammRate").value = roundToDecimal(ammRate, 2);
}

// 計算ボタン押下時
document.getElementById("StartButton").addEventListener("click", function() {
    let totalCost = 0;

    // 初期化
    document.getElementById("ePurchaseCost").innerText = "0USD";
    document.getElementById("ePurchaseCostJpy").innerText = "0円";
    document.getElementById("eLevelCost").innerText = "0STP";
    document.getElementById("eLevelCostJpy").innerText = "0円";
    document.getElementById("qPurchaseCost").innerText = "0USD";
    document.getElementById("qPurchaseCostJpy").innerText = "0円";
    document.getElementById("qLevelCost").innerText = "0STP";
    document.getElementById("qLevelCostJpy").innerText = "0円";
    document.getElementById("film").innerText = "";
    document.getElementById("effency").innerText = "0";
    document.getElementById("battery").innerText = "0";
    document.getElementById("incomeStp").innerText = "";
    document.getElementById("incomeJpy").innerText = "";
    document.getElementById("incomeStp1").innerText = "";
    document.getElementById("incomeJpy1").innerText = "";
    document.getElementById("incomeStp2").innerText = "";
    document.getElementById("incomeJpy2").innerText = "";
    document.getElementById("incomeStp3").innerText = "";
    document.getElementById("incomeJpy3").innerText = "";
    document.getElementById("incomeStp4").innerText = "";
    document.getElementById("incomeJpy4").innerText = "";
    document.getElementById("requiredDays").innerText = "X日";

    try{
        // E特化カメラ有の場合
        let eCameraUmu = document.querySelector('input[name="eCameraUmuButton"]:checked').value;
        let eCameraType = cameraType = document.querySelector('input[name="eCameraTypeButton"]:checked').value
        let cameraUnits = document.querySelector('input[name="unitsButton"]:checked').value;

        if (eCameraUmu == 1) {
            let cameraType = document.querySelector('input[name="eCameraTypeButton"]:checked').value;
            let cameraLevelFrom = document.getElementById("eCameraLevelFrom").value;
            let cameraLevelTo = document.getElementById("eCameraLevelTo").value;

            let CameraCost = document.getElementById("eCameraPrice").value * (1 + commission);
            let cameraCurrency = document.getElementById("eCameraCurrency").value;
            let CameraLevelCost = calcLevelCost(eCameraType, cameraLevelFrom, cameraLevelTo);
            
            document.getElementById("ePurchaseCost").innerText = formatNumber(CameraCost)  + cameraCurrency;
            document.getElementById("ePurchaseCostJpy").innerText = formatNumber(convertCurrency(cameraCurrency, "jpy", CameraCost))  + "円";
            document.getElementById("eLevelCost").innerText = formatNumber(CameraLevelCost) + "STP";
            document.getElementById("eLevelCostJpy").innerText = formatNumber(convertCurrency('stp', 'jpy', CameraLevelCost)) + "円";
            totalCost = totalCost + convertCurrency(cameraCurrency, "jpy", CameraCost) + convertCurrency('stp', 'jpy', CameraLevelCost);
        }

        // E特化カメラ有の場合
        let qCameraUmu = document.querySelector('input[name="qCameraUmuButton"]:checked').value;
        if (cameraUnits == "1"){
            qCameraUmu = 0
        }

        if (qCameraUmu == 1) {
            let cameraType = document.querySelector('input[name="qCameraTypeButton"]:checked').value;
            let cameraLevelFrom = document.getElementById("qCameraLevelFrom").value;
            let cameraLevelTo = document.getElementById("qCameraLevelTo").value;

            let CameraCost = document.getElementById("qCameraPrice").value * (1 + commission);
            let cameraCurrency = document.getElementById("qCameraCurrency").value;
            let CameraLevelCost = calcLevelCost(cameraType, cameraLevelFrom, cameraLevelTo);
            
            document.getElementById("qPurchaseCost").innerText = formatNumber(CameraCost)  + cameraCurrency;
            document.getElementById("qPurchaseCostJpy").innerText = formatNumber(convertCurrency(cameraCurrency, "jpy", CameraCost))  + "円";
            document.getElementById("qLevelCost").innerText = formatNumber(CameraLevelCost) + "STP";
            document.getElementById("qLevelCostJpy").innerText = formatNumber(convertCurrency('stp', 'jpy', CameraLevelCost)) + "円";
            totalCost = totalCost + convertCurrency(cameraCurrency, "jpy", CameraCost) + convertCurrency('stp', 'jpy', CameraLevelCost);
        }

        // その他数合わせカメラの計算
        let otherCameraUnits = cameraUnits - eCameraUmu - qCameraUmu;
        let oCameraCost = otherCameraUnits * cCameraPrice * (1 + commission);
        document.getElementById("oPurchaseCost").innerText = formatNumber(oCameraCost)  + "USD";
        document.getElementById("oPurchaseCostJpy").innerText = formatNumber(convertCurrency('usd', "jpy", oCameraCost))  + "円";
        totalCost = totalCost + convertCurrency('usd', "jpy", oCameraCost);

        // 合計金額の計算
        document.getElementById("totalCost").innerText = formatNumber(totalCost)  + "円";


        // 取得STPを計算
        //eCameraRare = document.querySelector('input[name="eCameraTypeButton"]:checked').value;
        eCameraLevelTo = document.getElementById("eCameraLevelTo").value;
        if (eCameraUmu == 0){
            // E特化カメラ無しの場合は、非ジェネシスコモンとする
            eCameraType = "1";
            eCameraRare = "0";
        } 

        let eff = 8 + (2 * (eCameraLevelTo - 1));
        let bat = 8;
        let gen = true;

        if (eCameraType == "1" || eCameraType == "3" ){
            gen = false;
        }

        if (eCameraType == "2" || eCameraType == "3"){
            eff = 16 + (4 * (eCameraLevelTo - 1));
            bat = 16;
        }

        let stp = calcStp(gen, eff, bat);
        let jpy = convertCurrency('stp', "jpy", stp)

        // フィルム枚数を判定
        let film = 0;
        switch(cameraUnits){
            case "1": 
                film = 2;
                break;
            case "3":
                film = 4;
                break;
            case "8":
                film = 8;
                break;
            case "15":
                film = 16;
                break;
        }

        // 計算結果の出力
        document.getElementById("film").innerText = film;
        document.getElementById("effency").innerText = eff;
        document.getElementById("battery").innerText = bat;
        document.getElementById("incomeStp").innerText = formatNumber(stp) + "STP";
        document.getElementById("incomeJpy").innerText = formatNumber(jpy)  + "円";
        
        document.getElementById("incomeStp1").innerText = formatNumber(stp * film * 1) + "STP";
        document.getElementById("incomeJpy1").innerText = formatNumber(jpy * film * 1)  + "円";
        document.getElementById("incomeStp2").innerText = formatNumber(stp * film * 7) + "STP";
        document.getElementById("incomeJpy2").innerText = formatNumber(jpy * film * 7)  + "円";
        document.getElementById("incomeStp3").innerText = formatNumber(stp * film * 30) + "STP";
        document.getElementById("incomeJpy3").innerText = formatNumber(jpy * film * 30)  + "円";
    
        requiredDays = totalCost / (jpy * film);
        document.getElementById("requiredDays").innerText = Math.ceil(requiredDays)  + "日";
        document.getElementById("incomeStp4").innerText = formatNumber(stp * film * Math.ceil(requiredDays)) + "STP";
        document.getElementById("incomeJpy4").innerText = formatNumber(jpy * film * Math.ceil(requiredDays))  + "円";

    } catch(err){
        alert("計算中にエラーが発生しました。");
        console.log(err);
    }

});

function calcLevelCost(type, levelFrom, levelTo){
    levelCost = 0;
    for (let i=levelFrom - 1; i < levelTo - 1; i++){
        levelCost += levelCostArr[type][i];
    }
    return levelCost;
}

document.getElementById("ammRate").addEventListener("change", function() {
    stpJpy = roundToDecimal(document.getElementById("ammRate").value * snptJpy, 4);
    document.getElementById("rateStpJpy").innerText = stpJpy;
});
