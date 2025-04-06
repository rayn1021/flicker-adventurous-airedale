const cPrice= [100, 100, 200, 300, 400, 500, 600];
const uPrice = [500, 500, 1000, 1500, 2000, 2500, 3000];
const doubleMint = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 33, 33, 33, 33, 33];
const mintChance = 
  [[97, 3, 0, 0, 0],
   [25, 73, 2, 0, 0],
   [0,27, 71, 2, 0]];
const levelUpCost = [0,156,312,624,1248,2466];

var cCameraPrice = "";
var ucCameraPrice = "";
var rCameraPrice = "";
var eCameraPrice = "";
var cMinscPrice = "";
var ucMinscPrice = "";
var ammRate = "";
var snptJpy = "";
var stmJpy = "";
var usdJpy = "";
var polJpy = "";
var rateTimestamp = ""

var minscCost = 0;
var mintCost = 0;
var mintCostYen = 0;
var totalMintCost = 0;
var levelCost = 0;

var commonRate = 0;    // コモンカメラ
var unCommonRate = 0;  // アンコモンカメラ
var rareRate = 0;      // レアカメラ
var epicRate = 0;      // エピックカメラ
var legendaryRate = 0; // レジェンダリーカメラ

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

    document.getElementById("commonCamera").value = formatNumber(cCameraPrice);
    document.getElementById("unCommonCamera").value = formatNumber(ucCameraPrice);
    document.getElementById("rareCamera").value = formatNumber(rCameraPrice);
    document.getElementById("commonMintScroll").value = formatNumber(cMinscPrice);
    document.getElementById("unCommonMintScroll").value = formatNumber(ucMinscPrice);
    document.getElementById("ammRate").value = ammRate;
    document.getElementById('snptValue').value = formatNumber(snptJpy);

    stmJpy = roundToDecimal(document.getElementById("ammRate").value * snptJpy, 4);
    document.getElementById("stpValue").value = formatNumber(stmJpy);
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

  // BOXの排出率を取得
  switch(true){
    case camera1 == 1 && camera2 == 1:
      // コモン × コモンの場合
      boxChance = [100, 0, 0];
      minscCost = getMinscPrice(cMinscPrice, cMinscPrice);
      mintCost = cPrice[mint1] + cPrice[mint2];
      break;
    case camera1 == 1 && camera2 == 2:
      // コモン × アンコモンの場合
      boxChance = [50, 49, 1];
      minscCost = getMinscPrice(cMinscPrice, ucMinscPrice);
      mintCost = cPrice[mint1] + uPrice[mint2];
      break;
    case camera1 == 2 && camera2 == 1:
      // アンコモン × コモンの場合
      boxChance = [50, 49, 1];
      minscCost = getMinscPrice(ucMinscPrice, cMinscPrice);
      mintCost = uPrice[mint1] + cPrice[mint2];
      break;
    case camera1 == 2 && camera2 == 2:
      // アンコモン × アンコモンの場合
      boxChance = [0, 98, 2];
      minscCost = getMinscPrice(ucMinscPrice, ucMinscPrice);
      mintCost = uPrice[mint1] + uPrice[mint2];
      break;
  } 

  // ミント費用を円に変換
  mintCostYen = mintCost * stmJpy;
  levelCost = calcLevelCost(camera1, camera2);
  totalMintCost = minscCost + mintCostYen + levelCost;

  // ダブルミントの確率を計算
  let doubleChance = doubleMint[Number(mint1) + Number(mint2)] + document.getElementById("kuroko1").value * 2.5 + document.getElementById("kuroko2").value * 2.5;
  if (document.querySelector('input[name="genButton"]:checked').value == "1"){
    doubleChance += 5;
  }

  // 各カメラの排出率を計算
  calcRate(boxChance);

  // 期待値の算出
  calcExpected(1, doubleChance)
  calcExpected(2, 0);    // シングルミント時
  calcExpected(3, 100);    // ダブルミント時

  // 損益の算出
  calcIncome();

  // コストの設定
  document.getElementById("minsc").innerText = formatNumber(minscCost);
  document.getElementById("mintCostStp").innerText = `${mintCost}STP`;
  document.getElementById("mintCostYen").innerText = formatNumber(mintCostYen);
  document.getElementById("totalMintCost").innerText = formatNumber(totalMintCost);
  document.getElementById("doubleChance").value = `${doubleChance}%`;

});

/*
 * レートの取得
 */
async function getrates(){
      if (document.getElementById("snptValue").value == ""){
        const response = await fetch(`/api/readRates?target=jpy`);
        if (!response.ok) {
            alert('レートを取得できませんでした。');
            throw new Error(`サーバーエラー: ${response.statusText}`);
        }
        const data = await response.json();
        snptJpy = roundToDecimal(data.rates['snpit-token'].jpy, 2);
        usdJpy = roundToDecimal(data.rates['usd'].jpy, 2);
        polJpy = roundToDecimal(data.rates['matic-network'].jpy, 2);
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

    cCameraPrice = roundToDecimal(cameraData.floorPrices.COMMONNo * usdJpy, 2);
    ucCameraPrice = roundToDecimal(cameraData.floorPrices.UNCOMMONNo * usdJpy, 2);
    rCameraPrice = roundToDecimal(cameraData.floorPrices.RARENo * usdJpy, 2);
    eCameraPrice = roundToDecimal(cameraData.floorPrices.EPICNo * usdJpy, 2);
    cMinscPrice = roundToDecimal(minscData.floorPrices.COMMON * usdJpy, 2);
    ucMinscPrice = roundToDecimal(minscData.floorPrices.UNCOMMON * usdJpy, 2);

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
  document.getElementById("stpValue").value = Math.floor(document.getElementById("ammRate").value * snptJpy * 10000) / 10000;
}
document.getElementById("ammRate").addEventListener("input", changeAmmRate);

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

/*
 * レベルアップコストの計算
 */
function calcLevelCost(camera1, camera2){
  let levelCost1 = 0;
  let levelCost2 = 0;
  if (document.querySelector('input[name="cameraLevel1"]:checked').value == "1"){
    levelCost1 += levelUpCost[camera1] * stmJpy;
  }
  if (document.querySelector('input[name="cameraLevel2"]:checked').value == "1"){
    levelCost2 += levelUpCost[camera2] * stmJpy;
  }

  return levelCost1 + levelCost2;
}

// 期待値の計算
function calcRate(boxChance){
	// 各ボックスの取得確率を計算
	commonRate = getPercent(boxChance, 0);    // コモンカメラ
	unCommonRate = getPercent(boxChance, 1);  // アンコモンカメラ
	rareRate = getPercent(boxChance, 2);      // レアカメラ
	epicRate = getPercent(boxChance, 3);      // エピックカメラ
	legendaryRate = getPercent(boxChance, 4); // レジェンダリーカメラ

	// 排出率
	document.getElementById("dropRate1").innerText = (commonRate /100) + "%";
	document.getElementById("dropRate2").innerText = (unCommonRate /100) + "%";
	document.getElementById("dropRate3").innerText = (rareRate /100) + "%";
	document.getElementById("dropRate4").innerText = (epicRate /100) + "%";
}

/*
 * レアリティごとの排出率の計算
 */
function getPercent(boxChance, rarity) {
  let percent = boxChance[0] * mintChance[0][rarity]; 
  percent = percent + boxChance[1] * mintChance[1][rarity]; 
  percent = percent + boxChance[2] * mintChance[2][rarity]; 
  return percent;
}


function calcExpected(branch, doubleChance){
	// 各カメラ毎の期待値を計算
	let commonExpected = (commonRate /10000) * cCameraPrice;
	let unCommonExpected = (unCommonRate /10000) * ucCameraPrice;
	let rareExpected = (rareRate /10000) * rCameraPrice;
	let epicExpected = (epicRate /10000) * eCameraPrice;
	let totalExpected = commonExpected + unCommonExpected + rareExpected + epicExpected;

  // 合計の設定
  let doubleCalc = (1 + doubleChance / 100);		 // ダブルミント発生率
  document.getElementById("expectedValue" + branch).innerText = formatNumber(totalExpected * doubleCalc) + "円";
	document.getElementById("profitAndLoss" + branch).innerText = formatNumber((totalExpected * doubleCalc) - totalMintCost) + "円";
	document.getElementById("profitRatio" + branch).innerText = roundToDecimal((totalExpected * doubleCalc) / totalMintCost * 100, 2) + "%";

}

function calcIncome(){

  document.getElementById("levelCost").innerText = formatNumber(levelCost) + "円";
  document.getElementById("mintCost").innerText = formatNumber(mintCostYen) + "円";
  document.getElementById("minscCost").innerText = formatNumber(minscCost) + "円";
  document.getElementById("totalCost").innerText = formatNumber(levelCost + mintCostYen + minscCost) + "円";

  // 販売価格の設定
  let floorPrice = setFloorPrice(document.querySelector('input[name="floorButton"]:checked').value);
}

function setFloorPrice(val){
  let floorPrice = 0;

  switch(val){
    case "0":
      floorPrice = cCameraPrice;
      break;
    case "1":
      floorPrice = ucCameraPrice;
      break;
    case "2":
      floorPrice = rCameraPrice;
      break;
    case "3":
      floorPrice = eCameraPrice;
      break;
  } 

  let income = floorPrice - totalMintCost;
  document.getElementById("currency").value = "0";
  document.getElementById("salePrice").value = floorPrice;
  document.getElementById("income").innerText = formatNumber(income) + "円";
  document.getElementById("incomeRate").innerText = formatNumber(floorPrice / totalMintCost * 100)+ "%";

  return floorPrice;
}


/*
 * 販売価格変更時の処理
 */
function changeSalePrice(){
  let salePrice = changeCurrency();
  let income = salePrice - totalMintCost;
  document.getElementById("income").innerText = formatNumber(income) + "円";
  document.getElementById("incomeRate").innerText = formatNumber(salePrice / totalMintCost)+ "%";
}
document.getElementById("salePrice").addEventListener("change", changeSalePrice);

/*
 * 販売通貨変更時の処理
 */
function changeCurrency(){
  let currency = document.getElementById("currency").value
  let salePrice = document.getElementById("salePrice").value
  if (currency == "1"){   
    // USDの場合
    salePrice = salePrice * usdJpy;
  } else if(currency == "2"){
    // SNPTの場合
    salePrice = salePrice * snptJpy;
  } else if(currency == "3"){
    // POLの場合
    salePrice = salePrice * polJpy;
  }

  if (currency == "0"){   
    document.getElementById("currencyToJpy").innerHTML = "";
  } else {
    document.getElementById("currencyToJpy").innerHTML = " → " + formatNumber(salePrice) + "円";
  }
  return salePrice;
}
document.getElementById("currency").addEventListener("change", changeSalePrice);

