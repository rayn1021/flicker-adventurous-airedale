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
var poljpy = "";
var rateTimestamp = ""

var minsc = 0;
var mintPrice = 0;
var mintPriceYen = 0;
var mintCost = 0;
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

  // 各カメラの排出率を計算
  calcRate(boxChance);

  // 期待値の算出
  calcExpected(1, doubleChance)
  calcExpected(2, 0);    // シングルミント時
  calcExpected(3, 100);    // ダブルミント時

  // 損益の算出
  calcIncome();

  // コストの設定
  document.getElementById("minsc").innerText = formatNumber(minsc);
  document.getElementById("mintPriceStp").innerText = `${mintPrice}STP`;
  document.getElementById("mintPriceYen").innerText = formatNumber(mintPriceYen);
  document.getElementById("totalPrice").innerText = formatNumber(mintCost);

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
        poljpy = roundToDecimal(data.rates['matic-network'].jpy, 2);
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

	
function calcExpected(branch, doubleChance){
	// 各カメラ毎の期待値を計算
	let commonExpected = (commonRate /10000) * commonCamera;
	let unCommonExpected = (unCommonRate /10000) * unCommonCamera;
	let rareExpected = (rareRate /10000) * rareCamera;
	let epicExpected = (epicRate /10000) * epicCamera;
	let totalExpected = commonExpected + unCommonExpected + rareExpected + epicExpected;

  // 合計の設定
  let doubleCalc = (1 + doubleChance / 100);		 // ダブルミント発生率
  document.getElementById("expectedValue" + branch).innerText = formatNumber(totalExpected * doubleCalc) + "円";
	document.getElementById("profitAndLoss" + branch).innerText = formatNumber((totalExpected * doubleCalc) - mintCost) + "円";
	document.getElementById("profitRatio" + branch).innerText = roundToDecimal((totalExpected * doubleCalc) / mintCost * 100, 2) + "%";

}

function calcIncome(){

  document.getElementById("levelCost").innerText = formatNumber(levelCost) + "円";
  document.getElementById("mintCost").innerText = formatNumber(mintPriceYen) + "円";
  document.getElementById("minscCost").innerText = formatNumber(minsc) + "円";
  document.getElementById("totalCost").innerText = formatNumber(levelCost + mintPriceYen + minsc) + "円";

  // 販売価格の設定
  let floorPrice = setFloorPrice(document.querySelector('input[name="floorButton"]:checked').value);
}

function setFloorPrice(val){
  let floorPrice = 0;

  switch(val){
    case "0":
      floorPrice = commonCamera;
      break;
    case "1":
      floorPrice = unCommonCamera;
      break;
    case "2":
      floorPrice = rareCamera;
      break;
    case "3":
      floorPrice = epicCamera;
      break;
  } 

  let income = floorPrice - mintCost;
  document.getElementById("currency").value = "0";
  document.getElementById("salePrice").value = floorPrice;
  document.getElementById("income").innerText = formatNumber(income) + "円";
  document.getElementById("incomeRate").innerText = formatNumber(income / mintCost)+ "%";

  return floorPrice;
}


/*
 * 販売価格変更時の処理
 */
function changeSalePrice(){
  let salePrice = changeCurrency();
  let income = salePrice - mintCost;
  document.getElementById("income").innerText = formatNumber(income) + "円";
  document.getElementById("incomeRate").innerText = formatNumber(income / mintCost)+ "%";
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
    salePrice = salePrice * usdjpy;
  } else if(currency == "2"){
    // SNPTの場合
    salePrice = salePrice * snptValue;
  } else if(currency == "3"){
    // POLの場合
    salePrice = salePrice * poljpy;
  }

  if (currency == "1"){   
    document.getElementById("currencyToJpy").innerHTML = "";
  } else {
    document.getElementById("currencyToJpy").innerHTML = " → " + formatNumber(salePrice) + "円";
  }
  return salePrice;
}
document.getElementById("currency").addEventListener("change", changeSalePrice);

