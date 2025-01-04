document.getElementById("StartButton").addEventListener("click", async function() {
	
    const raffleList = 
        [[0.04, 0.16, 0.28, 0.4, 0.52, 0.88, 1],
         [0.01, 0.04, 0.21, 0.56, 0.67, 0.78, 0.89, 1],
         ];
    
    const itemList = 
        [["ストラップ(ブラウン)", "ストラップ(イエロー)", "ストラップ(レッド)", "ストラップ(グリーン)", "ストラップ(パープル)", "効率ポーション", "スペアフィルム"],
         ["アンコミンスク", "コモンミンスク", "スペアフィルム", "効率ポーション", "ストラップ(イエロー)", "ストラップ(レッド)", "ストラップ(グリーン)", "ストラップ(パープル)"],
        ];
    
    const prizeList = 
        [[0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0],
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
        "</tr>";


    // 実行結果の書き込み(抽選結果)
    document.getElementById('resultTableBody').innerHTML="";
    const tableBody = document.getElementById('resultTableBody');
    for (let key in result) {
        row = document.createElement('tr');
        row.innerHTML = 
            "<td>" + key +"</td>" +
            "<td>" + result[key] + "個</td>";
        tableBody.appendChild(row);
    }

});

