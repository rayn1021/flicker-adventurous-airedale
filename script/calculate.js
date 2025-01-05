document.getElementById("calculateButton").addEventListener("click", function() {
    // 入力項目の値を取得
    const  inType = document.querySelector('input[name="typeButton"]:checked').value;
    let   inEff = parseFloat(document.getElementById("eff").value);
    let   inBat = parseFloat(document.getElementById("bat").value);
    const inStraps = [
        document.getElementById("strap1").value,
        document.getElementById("strap2").value,
        document.getElementById("strap3").value
    ];
    const inGrade = [
        parseInt(document.getElementById("grade1").value) || 0,
        parseInt(document.getElementById("grade2").value) || 0,
        parseInt(document.getElementById("grade3").value) || 0
    ];
    const boost = [0, 1, 3, 6, 10];
    const rimuruLevel = [0.2, 0.3, 0.4, 0.5, 0.6];
    const shunaLevel = [0.8, 0.78, 0.76, 0.74, 0.72];
    const  inRimuru = parseFloat(document.getElementById("rimuru").value);
    const  inRent = parseFloat(document.getElementById("rentalDetail").value);
    

    if (!inputCheck(inEff, "効率") || !inputCheck(inBat, "バッテリー") || 
        !inputCheck(inRimuru, "リムル%") || !inputCheck(inRent, "レンタル")) {
        return;
    }

    // 入力が正しいか確認
    if (inType == '2' && inRent > 0) {
        alert("非ジェネシスでレンタルすることはできません。");
        return;
    }

    // ストラップ効果の適用
    var rimuruFlg = false;
    var shunaFlg = false;
    var rimuruBoost = 0;
    var shunaBoost = 1

    for (let i = 0; i < 3; i++) {
        const gradeBoost = boost[inGrade[i]] || 0;
        switch (inStraps[i]) {
            case "2": inEff += 5 + gradeBoost; break;
            case "3": inEff += 3 + gradeBoost; break;
            case "4": inBat += 5 + gradeBoost; break;
            case "5": inBat += 3 + gradeBoost; break;
            case "6": 
                rimuruFlg = true;
                rimuruBoost = rimuruLevel[inGrade[i]];
                break;
            case "7": 
                shunaFlg = true;
                shunaBoost = shunaLevel[inGrade[i]];
                break;
        }
    }
   
    // STP計算
    const rimuruMultiplier = 1 + (rimuruBoost * inRimuru / 100);
    const { maxStp, minStp, maxCatStp, minCatStp } = calculateStp(inEff, inType, rimuruMultiplier);
    const minTotalStp = roundToDecimal(minStp + minCatStp);
    const maxTotalStp = roundToDecimal(maxStp + maxCatStp);

    // バッテリー計算
    var bat = roundToDecimal((inEff - inBat) * 0.04);
 
    // コスト計算
    let cost = roundToDecimal(bat * shunaBoost);

    // レンタル関連処理
    const rentalSection = document.getElementById("rental");
    const labelMarginA = document.getElementById("labelMarginA");
    const valueMarginA = document.getElementById("marginA");
    const shareButton = document.getElementById("share-button");
    if (inRent > 0) {
        rentalSection.style.display = "block";
        labelMarginA.style.display = "block";
        valueMarginA.style.display = "block";
        shareButton.style.display = "block";


        const lenderSubscription = document.getElementById('LenderSubsc').checked ? 0.03 : 0.1;
        const renderSubscription = document.getElementById('renderSubsc').checked ? 0.03 : 0.1;

        const wkStpA = roundToDecimal(maxStp - (maxStp * inRent / 100));
        const marginA = roundToDecimal(wkStpA * lenderSubscription);
        const wkStpB = roundToDecimal(maxStp - wkStpA);
        const marginB = roundToDecimal(wkStpB * renderSubscription);

        document.getElementById("outputA1").value = wkStpA;
        document.getElementById("outputA2").value = 0;
        document.getElementById("outputA3").value = wkStpA;
        document.getElementById("marginA").value = marginA;
        document.getElementById("outputB").value = 0;
        document.getElementById("outputC").value = 0;
        document.getElementById("outputD").value = roundToDecimal(wkStpA - marginA);
        document.getElementById("outputA3-1").value = wkStpB;
        document.getElementById("outputB-1").value = bat;
        document.getElementById("outputC-1").value = cost;
        document.getElementById("marginB").value = marginB;
        document.getElementById("outputD-1").value = roundToDecimal(wkStpB - cost - marginB);

        outList(inEff, inBat, roundToDecimal(wkStpB - cost - marginB));
    } else {
        rentalSection.style.display = "none";
        labelMarginA.style.display = "none";
        valueMarginA.style.display = "none";
        shareButton.style.display = "none";

        if (inType === '1') {
            document.getElementById("outputA1").value = maxStp;
            document.getElementById("outputA2").value = maxCatStp;
            document.getElementById("outputA3").value = maxTotalStp;
            document.getElementById("outputD").value = roundToDecimal(maxTotalStp - cost);
            outList(inEff, inBat, roundToDecimal(maxTotalStp - cost));
        } else {
            document.getElementById("outputA1").value = `${minStp}～${maxStp}`;
            document.getElementById("outputA2").value = `${minCatStp}～${maxCatStp}`;
            document.getElementById("outputA3").value = `${minTotalStp}～${maxTotalStp}`;
            document.getElementById("outputD").value = `${roundToDecimal(minTotalStp - cost)}～${roundToDecimal(maxTotalStp - cost)}`;
            outList(inEff, inBat, `${roundToDecimal(minTotalStp - cost)}～${roundToDecimal(maxTotalStp - cost)}`);
        }

        document.getElementById("outputB").value = bat;
        document.getElementById("outputC").value = cost;
    }


});

function outList(inEff, inBat, maxStp){
    // カメラタイプの取得
    const selectedType = document.querySelector('input[name="typeButton"]:checked');
    const labelType = document.querySelector(`label[for="${selectedType.id}"]`).textContent;

    // カメラタイプの取得
    const selectedRare = document.querySelector('input[name="rareButton"]:checked');
    const labelRare = document.querySelector(`label[for="${selectedRare.id}"]`).textContent;

     // 実行結果の書き込み
    const tableBody = document.getElementById('resultTableBody');
    row = document.createElement('tr');
    row.innerHTML = 
        `<td>${labelType}</td>` +
        `<td>${labelRare}</td>` +
        `<td>${inEff}</td>` +
        `<td>${inBat}</td>` +
        `<td>${maxStp}</td>`;
    tableBody.appendChild(row);
}

/* 
 * 入力チェック
 */
function inputCheck(value, name) {
    if (isNaN(value)) {
        alert(`${name}に正しい数値を入力してください。`);
        return false;
    }
    return true;
};

/* 
 * STP計算
 */
 function calculateStp(eff, type, rimuruMultiplier = 1){
    const baseMultiplier = type === '2' ? { max: 0.1, min: 0.08 } : { max: 0.15, min: 0.15 };
    const categoryMultiplier = type === '2' ? { max: 0.05, min: 0.01 } : { max: 0, min: 0 };

    const maxStp = Math.floor(eff * baseMultiplier.max * rimuruMultiplier * 100) / 100;
    const minStp = Math.floor(eff * baseMultiplier.min * rimuruMultiplier * 100) / 100;
    const maxCatStp = Math.floor(eff * categoryMultiplier.max * rimuruMultiplier * 100) / 100;
    const minCatStp = Math.floor(eff * categoryMultiplier.min * rimuruMultiplier * 100) / 100;

    return { maxStp, minStp, maxCatStp, minCatStp };
};

  // 入力フィールドが変更されたとき、スライダーを更新
const effInput = document.getElementById("eff");
const effSlider = document.getElementById("eff-slider");
effInput.addEventListener("input", () => {
    let value = parseFloat(effInput.value) || 0; // 無効な入力を防ぐ
    value = Math.max(Math.min(value, effSlider.max), effSlider.min); // 範囲を制限
    effInput.value = value; // 修正した値を再設定
    effSlider.value = value;
});

// スライダーが変更されたとき、入力フィールドを更新
effSlider.addEventListener("input", () => {
    effInput.value = effSlider.value;
});

  // 入力フィールドが変更されたとき、スライダーを更新
const batInput = document.getElementById("bat");
const batSlider = document.getElementById("bat-slider");
batInput.addEventListener("input", () => {
    let value = parseFloat(batInput.value) || 0; // 無効な入力を防ぐ
    value = Math.max(Math.min(value, batSlider.max), batSlider.min); // 範囲を制限
    batInput.value = value; // 修正した値を再設定
    batSlider.value = value;
});

// スライダーが変更されたとき、入力フィールドを更新
batSlider.addEventListener("input", () => {
batInput.value = batSlider.value;
});

document.getElementById('eff-plus').addEventListener('click', function () {fluctuation("eff", 1);});
document.getElementById('eff-minus').addEventListener('click', function () {fluctuation("eff", -1);});
document.getElementById('bat-plus').addEventListener('click', function () {fluctuation("bat", 1);});
document.getElementById('bat-minus').addEventListener('click', function () {fluctuation("bat", -1);});


document.getElementById('share-button').addEventListener('click', function () {
    const url = encodeURIComponent(window.location.href); // 現在のページURL

    // 投稿文章作成
    // X投稿用の文章を作成
    var rental = document.getElementById("rentalDetail").value;
    var getSTP = document.getElementById("outputA3-1").value;
    var cost = document.getElementById("outputC-1").value;
    var margin = document.getElementById("marginB").value;
    var total = document.getElementById('outputD-1').value;
    var text = 
        `#SNPIT でカメラの借手を探しています。(貸手${rental}%)\n` +
        `壁撮り1枚当たり、「${total}STP」を想定しています。\n` +
        `■内訳\n` +
        `獲得STP：${getSTP}STP\n` +
        `回復コスト：${cost}\n`+
        `手数料：${margin}\n`+
        `※バッジなし、サブスク未加入の想定\n\n`;

    const xText = encodeURIComponent(text);

    const shareUrl = `https://twitter.com/intent/tweet?text=${xText}&url=${url}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
});

function fluctuation(target, val){
    var elmTarget = document.getElementById(target);
    var targetVal = parseInt(elmTarget.value);
    elmTarget.value = targetVal + val;

    // スライダーの設定
    var targetSlider = document.getElementById(target + "-slider");
    value = Math.max(Math.min(targetVal + val, targetSlider.max), targetSlider.min); // 範囲を制限
    elmTarget.value = targetVal + val; // 修正した値を再設定
    targetSlider.value = targetVal + val;
}

sliderList = 
    [[1, 110],
     [8, 178],
     [15, 215],
     [23, 313],
     [30, 380]
    ];

const radios = document.getElementsByName('rareButton');
for (const radio of radios) {
  radio.addEventListener('change', () => {
    if (radio.checked) {
        document.getElementById('eff-slider').min = sliderList[radio.value][0];
        document.getElementById('eff-slider').max = sliderList[radio.value][1];
        document.getElementById('bat-slider').min = sliderList[radio.value][0];
        document.getElementById('bat-slider').max = sliderList[radio.value][1];

        document.getElementById('eff-slider').value = sliderList[radio.value][0];
        document.getElementById('bat-slider').value = sliderList[radio.value][0];
        document.getElementById('eff').value = sliderList[radio.value][0];
        document.getElementById('bat').value = sliderList[radio.value][0];
    }
  });
}