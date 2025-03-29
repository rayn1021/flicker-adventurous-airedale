var commonCamera = "";
var unCommonCamera = "";
var rareCamera = "";
var epicCamera = "";
var commonMintScroll = "";
var unCommonMintScroll = "";
var ammRate = "";
var snptValue = "";
var stpValue = "";
var usdjpy = "";
var rateTimestamp = ""

window.addEventListener("load", async () => {
  const loadingOverlay = showLoading("フロア価格読み込み中．．．");
  try {
    // レートの取得
    await getrates();

    //カメラ/ミンスクのフロア価格の取得
    await getFloorPrices();

    // AMM比率を取得
    ammRate = document.getElementById("ammRate").value;
    if (!isNumeric(ammRate)){
     ammRate = 2.6
    }

    document.getElementById("commonCamera").value = formatNumber(commonCamera);
    document.getElementById("unCommonCamera").value = formatNumber(unCommonCamera);
    document.getElementById("rareCamera").value = formatNumber(rareCamera);
    document.getElementById("commonMintScroll").value = formatNumber(commonMintScroll);
    document.getElementById("unCommonMintScroll").value = formatNumber(unCommonMintScroll);
    document.getElementById("ammRate").value = ammRate;
    document.getElementById('snptValue').value = formatNumber(snptValue);

    stpValue = roundToDecimal(document.getElementById("ammRate").value * snptValue, 4);
    document.getElementById("stpValue").value = formatNumber(stpValue);
    document.getElementById("rateTime").innerText = "(" + rateTimestamp + "時点)";

 } catch (error) {
   console.error("エラー:", error);
   document.getElementById("json").textContent = `エラー: ${error.message}`;
 }
 hideLoading(loadingOverlay); 
});

// 計算ボタン押下時
document.getElementById("StartButton").addEventListener("click", function() {
  const cPrice= [100, 100, 200, 300, 400, 500, 600];
  const uPrice = [500, 500, 1000, 1500, 2000, 2500, 3000];
  const doubleMint = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 33, 33, 33, 33, 33];
  const mintChance = 
    [[97, 3, 0, 0, 0],
     [25, 73, 2, 0, 0],
     [0,27, 71, 2, 0]];

  // 入力データを取得
  let camera1 = document.getElementById("camera1").value;
  let camera2 = document.getElementById("camera2").value;
  let mint1 = document.getElementById("mint1").value;
  let mint2 = document.getElementById("mint2").value;

  // [COMMON, UNCOMMON, RARE]
  let boxChance = [0, 0, 0];

  // ミント費用
  let minsc1 = 0;
  let minsc2 = 0;
  let mintPrice = 0;

  // BOXの排出率を取得
  switch(true){
    case camera1 == 1 && camera2 == 1:
      // コモン × コモンの場合
      boxChance = [100, 0, 0];
      minsc = commonMintScroll + commonMintScroll;
      mintPrice = cPrice[mint1] + cPrice[mint2];
      break;
    case camera1 == 1 && camera2 == 2:
      // コモン × アンコモンの場合
      boxChance = [50, 49, 1];
      minsc = commonMintScroll + unCommonMintScroll;
      mintPrice = cPrice[mint1] + uPrice[mint2];
      break;
    case camera1 == 2 && camera2 == 1:
      // アンコモン × コモンの場合
      boxChance = [50, 49, 1];
      minsc = unCommonMintScroll + commonMintScroll;
      mintPrice = uPrice[mint1] + cPrice[mint2];
      break;
    case camera1 == 2 && camera2 == 2:
      // アンコモン × アンコモンの場合
      boxChance = [0, 98, 2];
      minsc = unCommonMintScroll + unCommonMintScroll;
      mintPrice = uPrice[mint1] + uPrice[mint2];
      break;
  } 

  // ダブルミントの確率を計算
  let doubleChance = doubleMint[Number(mint1) + Number(mint2)] + document.getElementById("kuroko1").value * 2.5 + document.getElementById("kuroko2").value * 2.5;
  if (document.querySelector('input[name="genButton"]:checked').value == "1"){
    doubleChance += 5;
  }

  // シングルミント時の確率を計算
  // コモンカメラ
  let commonPercent = boxChance[0] * mintChance[0][0]; 
  commonPercent = commonPercent + boxChance[1] * mintChance[1][0]; 
  commonPercent = commonPercent + boxChance[2] * mintChance[2][0]; 

  // アンコモンカメラ
  let unCommonPercent = boxChance[0] * mintChance[0][1];
  unCommonPercent = unCommonPercent + boxChance[1] * mintChance[1][1];
  unCommonPercent = unCommonPercent + boxChance[2] * mintChance[2][1];

  // レアカメラ
  let rarePercent = boxChance[0] * mintChance[0][2]; 
  rarePercent = rarePercent + boxChance[1] * mintChance[1][2]; 
  rarePercent = rarePercent + boxChance[2] * mintChance[2][2]; 

  // エピックカメラ
  let epicPercent = boxChance[0] * mintChance[0][3]; 
  epicPercent = epicPercent + boxChance[1] * mintChance[1][3]; 
  epicPercent = epicPercent + boxChance[2] * mintChance[2][3]; 

  // レジェンダリーカメラ
  let legendaryPercent = boxChance[0] * mintChance[0][4]; 
  legendaryPercent = legendaryPercent + boxChance[1] * mintChance[1][4]; 
  legendaryPercent = legendaryPercent + boxChance[2] * mintChance[1][4]; 


  let commonExpected = (commonPercent /10000) * commonCamera;
  let unCommonExpected = (unCommonPercent /10000) * unCommonCamera;
  let rareExpected = (rarePercent /10000) * rareCamera;
  let epicExpected = (epicPercent /10000) * epicCamera;
  let totalExpected = commonExpected + unCommonExpected + rareExpected + epicExpected;

  // 確率の設定
  document.getElementById("result1_1-2").innerText = (commonPercent /100) + "%";
  document.getElementById("result1_2-2").innerText = (unCommonPercent /100) + "%";
  document.getElementById("result1_3-2").innerText = (rarePercent /100) + "%";
  document.getElementById("result1_4-2").innerText = (epicPercent /100) + "%";
  document.getElementById("result2_1-2").innerText = (commonPercent /100) + "%";
  document.getElementById("result2_2-2").innerText = (unCommonPercent /100) + "%";
  document.getElementById("result2_3-2").innerText = (rarePercent /100) + "%";
  document.getElementById("result2_4-2").innerText = (epicPercent /100) + "%";
  document.getElementById("result3_1-2").innerText = (commonPercent /100) + "%";
  document.getElementById("result3_2-2").innerText = (unCommonPercent /100) + "%";
  document.getElementById("result3_3-2").innerText = (rarePercent /100) + "%";
  document.getElementById("result3_4-2").innerText = (epicPercent /100) + "%";

  // 期待値の設定
  document.getElementById("result1_1-3").innerText = formatNumber(commonExpected);
  document.getElementById("result1_2-3").innerText = formatNumber(unCommonExpected);
  document.getElementById("result1_3-3").innerText = formatNumber(rareExpected);
  document.getElementById("result1_4-3").innerText = formatNumber(epicExpected);
  document.getElementById("result2_1-3").innerText = formatNumber(commonExpected * 2);
  document.getElementById("result2_2-3").innerText = formatNumber(unCommonExpected * 2);
  document.getElementById("result2_3-3").innerText = formatNumber(rareExpected * 2);
  document.getElementById("result2_4-3").innerText = formatNumber(epicExpected * 2);
  document.getElementById("result3_1-3").innerText = formatNumber(commonExpected * (1 + doubleChance / 100));
  document.getElementById("result3_2-3").innerText = formatNumber(unCommonExpected * (1 + doubleChance / 100));
  document.getElementById("result3_3-3").innerText = formatNumber(rareExpected * (1 + doubleChance / 100));
  document.getElementById("result3_4-3").innerText = formatNumber(epicExpected * (1 + doubleChance / 100));
  
  // 合計の設定
  document.getElementById("expectedValue1").value = formatNumber(totalExpected);
  document.getElementById("profitAndLoss1").value = formatNumber(totalExpected - (minsc + mintPrice));
  document.getElementById("profitRatio1").value = roundToDecimal(totalExpected / (minsc + mintPrice) * 100, 2) + "%";
  document.getElementById("expectedValue2").value = formatNumber(totalExpected * 2);
  document.getElementById("profitAndLoss2").value = formatNumber((totalExpected * 2) - (minsc + mintPrice));
  document.getElementById("profitRatio2").value = roundToDecimal((totalExpected * 2) / (minsc + mintPrice) * 100, 2) + "%";
  document.getElementById("expectedValue3").value = formatNumber(totalExpected * (1 + doubleChance / 100));
  document.getElementById("profitAndLoss3").value = formatNumber((totalExpected * (1 + doubleChance / 100)) - (minsc + mintPrice));
  document.getElementById("profitRatio3").value = roundToDecimal((totalExpected * (1 + doubleChance / 100)) / (minsc + mintPrice) * 100, 2) + "%";

  // コストの設定
  document.getElementById("minsc").value = formatNumber(minsc);
  document.getElementById("mintPriceStp").value = `${mintPrice}STP`;
  document.getElementById("mintPriceYen").value = formatNumber(mintPrice * stpValue);
  document.getElementById("totalPrice").value = formatNumber(minsc + mintPrice);

  document.getElementById("doubleChance").value = `${doubleChance}%`;


});

/*
 * レートの取得の取得
 */
async function getrates(){
      if (document.getElementById("snptValue").value == ""){
        const response = await fetch(`/api/readRates?target=jpy`);
        if (!response.ok) {
            alert('レートを取得できませんでした。');
            throw new Error(`サーバーエラー: ${response.statusText}`);
        }
        const data = await response.json();
        snptValue = roundToDecimal(data.rates['snpit-token'].jpy, 2);
        usdjpy = roundToDecimal(data.rates['usd'].jpy, 2);
        rateTimestamp = formatDate(data.timestamp);
      }

}
/*
 * カメラ/ミンスクのフロア価格の取得
 */
async function getFloorPrices(){
  if (document.getElementById("commonCamera").value == "" || document.getElementById("unCommonCamera").value == "" || 
      document.getElementById("commonMintScroll").value == "" || document.getElementById("unCommonMintScroll").value == "" || 
      document.getElementById("rareCamera").value == ""){

    // カメラのフロア価格を取得
    const cameraResponse = await fetch(`/api/getFloorPrice?target=CAMERA`);
    if (!cameraResponse.ok) {
      alert('フロア価格を取得できませんでした。\n以下までご連絡ください。\n https://x.com/Rayn73747887');
      throw new Error(`サーバーエラー: ${response.statusText}`);
    }

    // ミンスクのフロア価格を取得
    const minscResponse = await fetch(`/api/getFloorPrice?target=MintScroll`      );
    if (!minscResponse.ok) {
      alert('フロア価格を取得できませんでした。\n以下までご連絡ください。\n https://x.com/Rayn73747887');
      throw new Error(`サーバーエラー: ${response.statusText}`);
    }

    const cameraData = await cameraResponse.json();
    const minscData = await minscResponse.json();

    commonCamera = roundToDecimal(cameraData.floorPrices.COMMONNo * usdjpy, 2);
    unCommonCamera = roundToDecimal(cameraData.floorPrices.UNCOMMONNo * usdjpy, 2);
    rareCamera = roundToDecimal(cameraData.floorPrices.RARENo * usdjpy, 2);
    epicCamera = roundToDecimal(cameraData.floorPrices.EPICNo * usdjpy, 2);
    commonMintScroll = roundToDecimal(minscData.floorPrices.COMMON * usdjpy, 2);
    unCommonMintScroll = roundToDecimal(minscData.floorPrices.UNCOMMON * usdjpy, 2);

  }
}



function changeAmmRate(){
  wkAmmRate = document.getElementById("ammRate").value;
  if (!isNumeric(wkAmmRate)){
    wkAmmRate = ammRate;
  }

  document.getElementById("ammRate").value = wkAmmRate;
  document.getElementById("stpValue").value = Math.floor(document.getElementById("ammRate").value * snptValue * 10000) / 10000;
}

document.getElementById("ammRate").addEventListener("input", changeAmmRate);
