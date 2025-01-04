document.getElementById("StartButton").addEventListener("click", async function() {
	
    const raffleList = 
        [[0.1,0.2,0.7,0.71395,0.72790, 0.99789, 0.99989, 0.99999, 1],
         [0.1,0.2,0.7,0.71395,0.72790, 0.97790, 0.99790, 0.9999,1],
         [0.3, 0.5, 0.55, 0.75, 0.95, 0.97, 1]];
    
    const itemList = 
        [["ブラック怪獣スーツ(欠片3)", "ブラック怪獣ヘッド(欠片3)", "ガチャチケット", "ブラック怪獣スーツ", "ブラック怪獣ヘッド", "銅の作物×6", "銀の作物×1", "金の作物×1", "ダイヤモンドの作物×1"],
         ["ブラック怪獣スーツ(欠片3)", "ブラック怪獣ヘッド(欠片3)", "ガチャチケット", "ブラック怪獣スーツ", "ブラック怪獣ヘッド", "銅の作物×6", "銅の作物×10", "銀の作物×1", "金の作物×1"],
         ["衣装(欠片1)", "衣装(欠片3)", "衣装(欠片10)", "レンタルチケット", "拡張素材(低位)", "衣装", "拡張素材(上位)"]
        ];
    
    const prizeList = 
        [[0, 0, 0, 0, 0, 600, 10000, 100000, 600000],
         [0, 0, 0, 0, 0, 600, 1000, 10000, 100000],
         [0, 0, 0, 0, 0, 0, 0]
        ];

    const imageList = 
        [["001.png?v=1735924727347",
            "002.png?v=1735924776466",
            "003.png?v=1735924780977",
            "004.png?v=1735924784188",
            "005.png?v=1735924786400",
            "006.png?v=1735924788132",
            "008.png?v=1735924791741",
            "009.png?v=1735924793899",
            "010.png?v=1735924795724"],
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
            "999.png?v=1735924960465"]
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
            "<td style='padding:5px;'>" + totalBill.toLocaleString() +"円</td>" +
            "<td style='background-color: #aaddaa; width:0px; white-space:nowrap; padding:5px 5px 5px 5px;;'>収入</td>" +
            "<td style='padding:5px;'>" + totalPrize.toLocaleString() + "円</td>"+
            "<td style='background-color: #aaddaa; width:0px; white-space:nowrap; padding:5px 5px 5px 5px;;'>収支</td>" +
            "<td style='padding:5px ;'>" + (totalPrize - totalBill).toLocaleString() + "円</td>" +
            "<td style='background-color: #aaddaa; width:0px; white-space:nowrap; padding:5px 5px 5px 5px;;'>回収率</td>" +
            "<td style='padding:5px ;'>" + (Math.floor(totalPrize / totalBill * 100)).toLocaleString() + "%</td>" +
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

});

