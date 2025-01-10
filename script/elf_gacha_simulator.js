
document.getElementById("StartButton").addEventListener("click", async function() {
	
//    const raffleList = 
        // [[0.1,0.2,0.7,0.71395,0.72790, 0.99789, 0.99989, 0.99999, 1],
        //  [0.1,0.2,0.7,0.71395,0.72790, 0.97790, 0.99790, 0.9999,1],
        //  [0.3, 0.5, 0.55, 0.75, 0.95, 0.97, 1]];

    const raffleList = 
         [[7.5, 7.5, 50, 1.354, 1.354, 30, 2, 0.28, 0.012],
          [10, 10, 50, 1.395, 1.395, 25, 2, 0.2, 0.01],
          [30, 20, 5, 20, 20, 2, 3],
          [10, 10, 50, 1.395, 1.395, 26.999, 0.2, 0.01]];
 
    const itemList = 
        [["ブラック怪獣スーツ(欠片3)", "ブラック怪獣ヘッド(欠片3)", "ガチャチケット", "ブラック怪獣スーツ", "ブラック怪獣ヘッド", "銅の作物×6", "銅の作物×10", "銀の作物×1", "金の作物×1"],
         ["ブラック怪獣スーツ(欠片3)", "ブラック怪獣ヘッド(欠片3)", "ガチャチケット", "ブラック怪獣スーツ", "ブラック怪獣ヘッド", "銅の作物×6", "銅の作物×10", "銀の作物×1", "金の作物×1"],
         ["衣装(欠片1)", "衣装(欠片3)", "衣装(欠片10)", "レンタルチケット", "拡張素材(低位)", "衣装", "拡張素材(上位)"],
         ["ブラック怪獣スーツ(欠片3)", "ブラック怪獣ヘッド(欠片3)", "ガチャチケット", "ブラック怪獣スーツ", "ブラック怪獣ヘッド", "銅の作物×6", "銀の作物×1", "金の作物×1", "ダイヤモンドの作物×1"],
       ];
    
    const prizeList = 
        [[0, 0, 0, 0, 0, 600, 1000, 10000, 100000],
         [0, 0, 0, 0, 0, 600, 1000, 10000, 100000],
         [0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 600, 10000, 100000, 600000]
        ];

    const imageList = 
        [["001.png?v=1735924727347",
            "002.png?v=1735924776466",
            "003.png?v=1735924780977",
            "004.png?v=1735924784188",
            "005.png?v=1735924786400",
            "006.png?v=1735924788132",
            "007.png?v=1735924791333",
            "008.png?v=1735924791741",
            "009.png?v=1735924793899"],
           ["001.png?v=1735924727347",
            "002.png?v=1735924776466",
            "003.png?v=1735924780977",
            "004.png?v=1735924784188",
            "005.png?v=1735924786400",
            "006.png?v=1735924788132",
            "007.png?v=1735924791333",
            "008.png?v=1735924791741",
            "009.png?v=1735924793899"],
           ["999.png?v=1735924960465",
            "999.png?v=1735924960465",
            "999.png?v=1735924960465",
            "999.png?v=1735924960465",
            "999.png?v=1735924960465",
            "999.png?v=1735924960465",
            "999.png?v=1735924960465"],
           ["001.png?v=1735924727347",
            "002.png?v=1735924776466",
            "003.png?v=1735924780977",
            "004.png?v=1735924784188",
            "005.png?v=1735924786400",
            "006.png?v=1735924788132",
            "008.png?v=1735924791741",
            "009.png?v=1735924793899",
            "010.png?v=1735924795724"]
        ]   

    var bill = 300;
    
    // 抽選処理
    await raffle(raffleList, itemList, prizeList, imageList, bill, "1");

    // 実行結果の書き込み(収支計算)
    document.getElementById('priceResult').innerHTML="";
    const prizeTable = document.getElementById('priceResult');
    prizeTable.innerHTML = 
        "<tr>" +
            "<td style='background-color: #aaddaa; width:0px; white-space:nowrap; padding:5px 5px 5px 5px;'>支出</td>" +
            "<td style='padding:5px;' id='bill'>" + totalBill.toLocaleString() +"円</td>" +
            "<td style='background-color: #aaddaa; width:0px; white-space:nowrap; padding:5px 5px 5px 5px;;'>収入</td>" +
            "<td style='padding:5px;' id='prise'>" + totalPrize.toLocaleString() + "円</td>"+
            "<td style='background-color: #aaddaa; width:0px; white-space:nowrap; padding:5px 5px 5px 5px;;'>収支</td>" +
            "<td style='padding:5px ;' id='balance'>" + (totalPrize - totalBill).toLocaleString() + "円</td>" +
            "<td style='background-color: #aaddaa; width:0px; white-space:nowrap; padding:5px 5px 5px 5px;;'>回収率</td>" +
            "<td style='padding:5px ;' id='parcent'>" + (Math.floor(totalPrize / totalBill * 100)).toLocaleString() + "%</td>" +
        "</tr>";


    // 実行結果の書き込み(抽選結果)
    document.getElementById('resultTableBody').innerHTML="";
    const tableBody = document.getElementById('resultTableBody');
    for (let key in result) {
        row = document.createElement('tr');
        row.innerHTML = 
            "<td style='width: 0%;'><img border='0' src='https://cdn.glitch.global/7d43b8f5-2de2-444f-b615-ec73b3fc0e82/" + resultImage[key] + "' style='display:inline;margin:0px;padding:0px;border:none;width:32px'></td>" +
            "<td>" + key +"</td>" +
            "<td>" + result[key] + "個</td>";
        tableBody.appendChild(row);
    }

    document.getElementById("share-button").style.display = "block"

});


document.getElementById('share-button').addEventListener('click', function () {
    const url = encodeURIComponent(window.location.href); // 現在のページURL

    // 投稿文章作成
    // X投稿用の文章を作成
    var times = document.getElementById("TIMES").value;
    var prize = document.getElementById("prise").innerHTML;
    var balance = document.getElementById("balance").innerHTML;
    var parcent = document.getElementById("parcent").innerHTML;
    var type = document.getElementById('TYPE');
    var typeLabel = type.options[type.selectedIndex].label;
    var text = 
        `スタールーレットシミュレーション結果！\n` +
        `実行ガチャ：${typeLabel}` +
        `実行回数：${times.toLocaleString()}回\n` +
        `収入：${prize.toLocaleString()}\n` +
        `収支：${balance.toLocaleString()}\n`+
        `収益率：${parcent.toLocaleString()}\n`+
        `#エルフの森\n\n`;

    const xText = encodeURIComponent(text);

    const shareUrl = `https://twitter.com/intent/tweet?text=${xText}&url=${url}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
});
    
