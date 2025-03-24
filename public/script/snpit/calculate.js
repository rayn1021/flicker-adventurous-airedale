document.getElementById("calculateButton").addEventListener("click", function() {
    // 入力項目の値を取得
    const  inType = document.querySelector('input[name="typeButton"]:checked').value;
    const  inBadge = document.querySelector('input[name="badgeButton"]:checked').value;
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
    const  inBooster = parseFloat(document.getElementById("booster").value);

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

    // バッジの計算
    badgeList = [0, 4, 8, 12, 16];
    inEff = (inEff + badgeList[inBadge]);

    // ブースターポーションの計算
    inEff = inEff + (inBooster * 5)
   
    // STP計算
    const rimuruMultiplier = 1 + (rimuruBoost * inRimuru / 100);
    const { maxStp, minStp, maxCatStp, minCatStp } = calculateStp(inEff, inType, rimuruMultiplier);
    const minTotalStp = roundToDecimal(minStp + minCatStp);
    const maxTotalStp = roundToDecimal(maxStp + maxCatStp);

    // バッテリー計算
    var bat = roundToDecimal((inEff - inBat * 1.25) * 0.04);
    if ((inEff - inBat * 1.25) <= 0){
        bat = 0;
    }
 
    // コスト計算
    let cost = roundToDecimal(bat * shunaBoost);

    // レンタル関連処理
    const rentalSection = document.getElementById("rental");
    const labelMarginA = document.getElementById("labelMarginA");
    const valueMarginA = document.getElementById("marginA");
    const shareButton = document.getElementById("share-button");
    var getSTP = 0;
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
        getSTP = roundToDecimal(wkStpA - marginA);

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
            getSTP = roundToDecimal(maxTotalStp - cost);
        } else {
            document.getElementById("outputA1").value = `${minStp}～${maxStp}`;
            document.getElementById("outputA2").value = `${minCatStp}～${maxCatStp}`;
            document.getElementById("outputA3").value = `${minTotalStp}～${maxTotalStp}`;
            document.getElementById("outputD").value = `${roundToDecimal(minTotalStp - cost)}～${roundToDecimal(maxTotalStp - cost)}`;
            outList(inEff, inBat, `${roundToDecimal(minTotalStp - cost)}～${roundToDecimal(maxTotalStp - cost)}`);
            getSTP = roundToDecimal((minTotalStp + maxTotalStp) / 2 - cost);
        }

        document.getElementById("outputB").value = bat;
        document.getElementById("outputC").value = cost;
    }

    // メインバトル換算
    var sumSTP = 0;
    var battleResult = [0, 1, 3, 6, 18, 36, 72, 216, 432, 864, 2592, 5184];
    for (let i=0; i < battleResult.length; i++){
        if (getSTP <= sumSTP + battleResult[i]){
            let count1 = i - 1;
            let count2 =  (getSTP - sumSTP) / battleResult[i]
            document.getElementById("MainBattle").value = roundToDecimal(count1 + count2);
            break;
        }
        sumSTP += battleResult[i];
    }

    // 期間別収支計算
    calcPeriod(getSTP)

    // バッテリー消費
    outCostList();
});

function calcPeriod(getSTP){
    // 期間別収支計算
    document.getElementById("dayOf2shot").innerHTML = roundToDecimal(getSTP * 2).toLocaleString() + "STP";
    document.getElementById("dayOf4shot").innerHTML = roundToDecimal(getSTP * 4).toLocaleString() + "STP";
    document.getElementById("dayOf8shot").innerHTML = roundToDecimal(getSTP * 8).toLocaleString() + "STP";
    document.getElementById("dayOf16shot").innerHTML = roundToDecimal(getSTP * 16).toLocaleString() + "STP";
    document.getElementById("weekOf2shot").innerHTML = roundToDecimal(getSTP * 2 * 7).toLocaleString() + "STP";
    document.getElementById("weekOf4shot").innerHTML = roundToDecimal(getSTP * 4 * 7).toLocaleString() + "STP";
    document.getElementById("weekOf8shot").innerHTML = roundToDecimal(getSTP * 8 * 7).toLocaleString() + "STP";
    document.getElementById("weekOf16shot").innerHTML = roundToDecimal(getSTP * 16 * 7).toLocaleString() + "STP";
    document.getElementById("monthOf2shot").innerHTML = roundToDecimal(getSTP * 2 * 30).toLocaleString() + "STP";
    document.getElementById("monthOf4shot").innerHTML = roundToDecimal(getSTP * 4 * 30).toLocaleString() + "STP";
    document.getElementById("monthOf8shot").innerHTML = roundToDecimal(getSTP * 8 * 30).toLocaleString() + "STP";
    document.getElementById("monthOf16shot").innerHTML = roundToDecimal(getSTP * 16 * 30).toLocaleString() + "STP";
}

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

/* 
 * Xに投稿
 */
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

/* 
 * バッテリー消費出力
 */
function outCostList(){
    cost = document.getElementById('outputB').value;
    const tableBody = document.getElementById('costTableBody');
    let batValue = 100;
    let i = 1;

    while(tableBody.firstChild){
        tableBody.removeChild(tableBody.firstChild);
    }

    if (cost <= 0){
        return;
    }

    let bestCost = 1;
    let bestCostPos = 1;
    do {
        batValue -= cost;
        row = document.createElement('tr');
        row.id = 'batcost_' + i;
        row.innerHTML = `<td>${i}枚目</td><td>${Math.floor(batValue * 100) / 100}</td>`;
        tableBody.appendChild(row);

        if (bestCost >= batValue % 1) {
            bestCost = batValue % 1;
            bestCostPos = i;
        }

        i++;
    } while (batValue > 80);

    document.getElementById('batcost_' + bestCostPos).style.backgroundColor  = '#ffffcc';

}


/* 
 * カメラデータ取得
 */
/*
document.getElementById("getCameraDataButton").addEventListener("click", async () => {
    const input = document.getElementById('ID').value; // 必要に応じて変更
//    const fixedPrefix = "200102"; // 左側の固定値

    let fixedPrefix = "100101"; // 左側の固定値
    const fullLength = 16; // フルIDの桁数
    let tokenId;

    // ID情報を編集
    if (input.length === fullLength) {
        // 入力がフルIDの場合、そのまま利用
        tokenId = input;
    } else {
        // 後部IDの場合、固定値を追加し、0埋めしてフルIDを生成
        const uniqueCode = input.padStart(fullLength - fixedPrefix.length, '0'); // 必要な桁数分0埋め
        tokenId = fixedPrefix + uniqueCode;
    }

    try {
        await getMetadata(tokenId);
    } catch (error) {

        try {
            let fixedPrefix = "200102";
            const uniqueCode = input.padStart(fullLength - fixedPrefix.length, '0'); // 必要な桁数分0埋め
            tokenId = fixedPrefix + uniqueCode;
            getMetadata(tokenId);
        } catch(error){
            console.error("エラー:", error);
            document.getElementById("json").textContent = `エラー: ${error.message}`;
        }
    } 

});

async function getMetadata(tokenId){
    const contractAddress = "0x8703e7509774A13f6C5516a6e60965B7eec68B5D"; // 必要に応じて変更

    try {
        // サーバーAPIにリクエストを送信
        const response = await fetch(
            `/api/getCameraData?contractAddress=${contractAddress}&tokenId=${tokenId}`
        );
        if (!response.ok) {
            alert('対象のカメラを取得できませんでした。\nカメラIDを確認してください。');
            throw new Error(`サーバーエラー: ${response.statusText}`);
        }

        const metadata = await response.json();

        // 取得したjsonファイルより値を設定
        // タイプの設定
        if (metadata.attributes.find(attr => attr.trait_type === 'Genesis').value == 'Yes') {
            document.getElementById('TYPE1').checked = true;
        } else {
            document.getElementById('TYPE2').checked = true;
        }
        
        // レアリティの設定
        const rarity = metadata.attributes.find(attr => attr.trait_type === 'Rarity').value;
        if (rarity == 'COMMON') {
            document.getElementById('RARE1').checked = true;
        } else if(rarity == 'UNCOMMON'){
            document.getElementById('RARE2').checked = true;
        } else if(rarity == 'RARE'){
            document.getElementById('RARE3').checked = true;
        } else if(rarity == 'EPIC'){
            document.getElementById('RARE4').checked = true;
        } else if(rarity == 'LEGENDALY'){
            document.getElementById('RARE5').checked = true;
        }

        // 効率の設定
        document.getElementById('eff').value = metadata.attributes.find(attr => attr.trait_type === 'Current Efficiency').value;

        // 電池の設定
        document.getElementById('bat').value = metadata.attributes.find(attr => attr.trait_type === 'Current Battery').value;

        setSliderRange()

    } catch (e) {
        throw e
    }
}
*/
