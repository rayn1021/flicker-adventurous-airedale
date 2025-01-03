document.getElementById("StartButton").addEventListener("click", function() {
	
    const list1 = 
        [[0.1,0.2,0.7,0.71395,0.72790, 0.99789, 0.99989, 0.99999, 1],
         [0.1,0.2,0.7,0.71395,0.72790, 0.97790, 0.99790, 0.9999,1],
         [0.3, 0.5, 0.55, 0.75, 0.95, 0.97, 1]];
    
    const list2 = 
        [["ブラック怪獣スーツ(欠片3)", "ブラック怪獣ヘッド(欠片3)", "ガチャチケット", "ブラック怪獣スーツ", "ブラック怪獣ヘッド", "銅の作物×6", "銀の作物×1", "金の作物×1", "ダイヤモンドの作物×1"],
         ["ブラック怪獣スーツ(欠片3)", "ブラック怪獣ヘッド(欠片3)", "ガチャチケット", "ブラック怪獣スーツ", "ブラック怪獣ヘッド", "銅の作物×6", "銅の作物×10", "銀の作物×1", "金の作物×1"],
         ["衣装(欠片1)", "衣装(欠片3)", "衣装(欠片10)", "レンタルチケット", "拡張素材(低位)", "衣装", "拡張素材(上位)"]
        ];
    
    const list3 = 
        [["001.png","002.png","003.png","004.png","005.png","006.png","008.png","009.png","010.png"],
         ["001.png","002.png","003.png","004.png","005.png","006.png","007.png","008.png","009.png"],
         ["999.png", "999.png", "999.png", "999.png", "999.png", "999.png", "999.png"]
        ]   
  



    // 入力項目の値を取得
    var times = parseFloat(document.getElementById("TIMES").value);
    var type = parseFloat(document.getElementById("TYPE").value);
    let list1Val = list1[type];
    let list2Val = list2[type];
    let list3Val = list3[type];

    // 結果の作成
    var result = {};
    var resultImage = {};
    for (let i = 0; i < list2Val.length; i++) {
        result[list2Val[i]] = 0;
        resultImage[list2Val[i]] = list3Val[i];
    };

    // 出力用の連想配列を定義

    for (i = 0; i < times; i++) {
        let ransu = Math.random();
        let itemName = "";
        let itemCount = "";

        let j = 0;
        var endFlg = true;
        while (endFlg) {
            if (list1Val[j] >= ransu) {
                // キーの存在チェック
                count = result[list2Val[j]];
                result[list2Val[j]] = count + 1;
                endFlg=false;
            }
            j++;
        }
    }
    
    // 実行結果の書き込み
    document.getElementById('resultTableBody').innerHTML="";
    const tableBody = document.getElementById('resultTableBody');
    for (let key in result) {
        const row = document.createElement('tr');
        row.innerHTML = 
            "<td style='width: 0%;'><img border='0' src='image/" + resultImage[key] + "' style='display:inline;margin:0px;padding:0px;border:none;width:32px'></td>" +
            "<td>" + key +"</td>" +
            "<td>" + result[key] + "個</td>";
        tableBody.appendChild(row);
    }
});