const cPrice= [100, 100, 200, 300, 400, 500, 600];
const uPrice = [500, 500, 1000, 1500, 2000, 2500, 3000];
const doubleMint = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 33, 33, 33, 33, 33];
const mintChance = 
  [[97, 3, 0, 0, 0],
   [25, 73, 2, 0, 0],
   [0,27, 71, 2, 0]];

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
  // 入力データを取得
  let camera1 = document.getElementById("camera1").value;
  let camera2 = document.getElementById("camera2").value;
  let mint1 = document.getElementById("mint1").value;
  let mint2 = document.getElementById("mint2").value;

  // [COMMON, UNCOMMON, RARE]
  let boxChance = [0, 0, 0];

  // ミント費用
  let minsc = 0;
  let mintPrice = 0;
  let mintPriceYen = 0;
  let mintCost = 0;

  // BOXの排出率を取得
  switch(true){
    case camera1 == 1 && camera2 == 1:
      // コモン × コモンの場合
      boxChance = [100, 0, 0];
      minsc = getMinscPrice(commonMintScroll, commonMintScroll);
      mintPrice = cPrice[mint1] + cPrice[mint2];
      break;
    case camera1 == 1 && camera2 == 2:
      // コモン × アンコモンの場合
      boxChance = [50, 49, 1];
      minsc = getMinscPrice(commonMintScroll, unCommonMintScroll);
      mintPrice = cPrice[mint1] + uPrice[mint2];
      break;
    case camera1 == 2 && camera2 == 1:
      // アンコモン × コモンの場合
      boxChance = [50, 49, 1];
      minsc = getMinscPrice(unCommonMintScroll, commonMintScroll);
      mintPrice = uPrice[mint1] + cPrice[mint2];
      break;
    case camera1 == 2 && camera2 == 2:
      // アンコモン × アンコモンの場合
      boxChance = [0, 98, 2];
      minsc = getMinscPrice(unCommonMintScroll, unCommonMintScroll);
      mintPrice = uPrice[mint1] + uPrice[mint2];
      break;
  } 

  // ミント費用を円に変換
  mintPriceYen = mintPrice * stpValue;
  mintCost = minsc + mintPriceYen;

  // ダブルミントの確率を計算
  let doubleChance = doubleMint[Number(mint1) + Number(mint2)] + document.getElementById("kuroko1").value * 2.5 + document.getElementById("kuroko2").value * 2.5;
  if (document.querySelector('input[name="genButton"]:checked').value == "1"){
    doubleChance += 5;
  }

  calcExpected(1, boxChance, doubleChance, mintCost);    // トータル
  calcExpected(2, boxChance, 0, mintCost);    // シングルミント時
  calcExpected(3, boxChance, 100, mintCost);    // ダブルミント時


  // コストの設定
  document.getElementById("minsc").value = formatNumber(minsc);
  document.getElementById("mintPriceStp").value = `${mintPrice}STP`;
  document.getElementById("mintPriceYen").value = formatNumber(mintPriceYen);
  document.getElementById("totalPrice").value = formatNumber(mintCost);

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



/*
 * AMM比率変更時
 */
function changeAmmRate(){
  wkAmmRate = document.getElementById("ammRate").value;
  if (!isNumeric(wkAmmRate)){
    wkAmmRate = ammRate;
  }

  document.getElementById("ammRate").value = wkAmmRate;
  document.getElementById("stpValue").value = Math.floor(document.getElementById("ammRate").value * snptValue * 10000) / 10000;
}
document.getElementById("ammRate").addEventListener("input", changeAmmRate);

/*
 * レアリティごとの排出率の計算
 */
function getPercent(boxChance, rarity) {
  let percent = boxChance[0] * mintChance[0][rarity]; 
  percent = percent + boxChance[1] * mintChance[1][rarity]; 
  percent = percent + boxChance[2] * mintChance[2][rarity]; 
  return percent;
}

/*
 * 手数料を加味したミンスクのコストを計算
 */
function getMinscPrice(minsc1, minsc2){
  if (document.querySelector('input[name="commision1"]:checked').value == "1"){
    // ミンスク1の手数料を加算
    minsc1 = minsc1 * 1.075;
  }

  if (document.querySelector('input[name="commision2"]:checked').value == "1"){
    // ミンスク2の手数料を加算
    minsc2 = minsc2 * 1.075;
  }

  return minsc1 + minsc2;
}

// 期待値の計算
function calcExpected(branch, boxChance, doubleChance, mintCost){
	// 各ボックスの取得確率を計算
	let commonPercent = getPercent(boxChance, 0);    // コモンカメラ
	let unCommonPercent = getPercent(boxChance, 1);  // アンコモンカメラ
	let rarePercent = getPercent(boxChance, 2);      // レアカメラ
	let epicPercent = getPercent(boxChance, 3);      // エピックカメラ
	let legendaryPercent = getPercent(boxChance, 4); // レジェンダリーカメラ
	let doubleCalc = (1 + doubleChance / 100);		 // ダブルミント発生率

	// 各カメラ毎の期待値を計算
	let commonExpected = (commonPercent /10000) * commonCamera;
	let unCommonExpected = (unCommonPercent /10000) * unCommonCamera;
	let rareExpected = (rarePercent /10000) * rareCamera;
	let epicExpected = (epicPercent /10000) * epicCamera;
	let totalExpected = commonExpected + unCommonExpected + rareExpected + epicExpected;

	// 排出率
	document.getElementById("result" + branch + "_1-2").innerText = (commonPercent /100) + "%";
	document.getElementById("result" + branch + "_2-2").innerText = (unCommonPercent /100) + "%";
	document.getElementById("result" + branch + "_3-2").innerText = (rarePercent /100) + "%";
	document.getElementById("result" + branch + "_4-2").innerText = (epicPercent /100) + "%";
	
	// 収支の設定
	document.getElementById("result" + branch + "_1-3").innerText = formatNumber(commonExpected * doubleCalc);
	document.getElementById("result" + branch + "_2-3").innerText = formatNumber(unCommonExpected * doubleCalc);
	document.getElementById("result" + branch + "_3-3").innerText = formatNumber(rareExpected * doubleCalc);
	document.getElementById("result" + branch + "_4-3").innerText = formatNumber(epicExpected * doubleCalc);
	
	// 合計の設定
	document.getElementById("expectedValue" + branch).value = formatNumber(totalExpected * doubleCalc);
	document.getElementById("profitAndLoss" + branch).value = formatNumber((totalExpected * doubleCalc) - mintCost);
	document.getElementById("profitRatio" + branch).value = roundToDecimal((totalExpected * doubleCalc) / mintCost * 100, 2) + "%";
}