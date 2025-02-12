document.getElementById("calculateButton").addEventListener("click", function() {
	
    const list1 = 
        [[0.5, 0.2, 0.1, 0.03],
         [0.5, 0.2, 0.1, 0.03],
         [0.1, 0.03]];
    const list2 = [30, 40, 100];
    const list3 = [
        [0,0,0,0,0,0,0,0,1,1,1,1,2,2,3],
        [0,0,0,0,0,0,0,0,1,1,1,1,2,2,3],
        [0,0,1]
    ];
    
    
    // 入力項目の値を取得
    var inStrap = document.getElementById("STRAP").value;
    // var inStart = parseFloat(document.getElementById("GradeStart").value);
    // var inEnd = parseFloat(document.getElementById("GradeEnd").value);
    
    // // 入力が正しいか確認
    // if (isNaN(inStart)) {
    //     alert("グレード(開始)に正しい数値を入力してください。");
    //     return;
    // }

    // // 入力が正しいか確認
    // if (isNaN(inStart)) {
    //     alert("グレード(終了)に正しい数値を入力してください。");
    //     return;
    // }
    
    // if (inStart >= inEnd) {
    //     alert("グレード(終了)には、開始より大きい値を入力してください。");
    //     return;
    // }
    
    // if (inStrap == "2" && inEnd > 4) {
    //     alert("★2ストラップは、グレード4まで強化可能です。");
    //     return;
    // }
    
    // if (inStrap == "3" && inEnd > 4) {
    //     alert("★3ストラップは、グレード4まで強化可能です。");
    //     return;
    // }
    
    // if (inStrap == "4" && inEnd > 2) {
    //     alert("★4ストラップは、グレード2まで強化可能です。");
    //     return;
    // }
    
    
    // 出力エリアの取得
    document.getElementById('resultTableBody').innerHTML="";
    const tableBody = document.getElementById('resultTableBody');
    
    var nowGrade = 0;
    var endFlg = true;
    var totalCost = 0;
    var totalCount = 0;
    var count = 0;
    var cost = 0;

    successRateList = list1[inStrap - 2];
    gradeList = list3[inStrap - 2];
    costList = list2[inStrap - 2]

    while (endFlg) {
        successRate = successRateList[gradeList[nowGrade]];
        cost += costList;
        count++;

        
        if (Math.random() < successRate){
            
            totalCount += count;
            totalCost += cost;
            
            const row = document.createElement('tr');
            row.innerHTML = "<td>" + gradeList[nowGrade] + " → " + (gradeList[nowGrade] + 1) +"</td>" +
            "<td>" + count + "回</td>" +
            "<td>" + cost + "STP</td>"
            tableBody.appendChild(row);
            
            count = 0;
            cost = 0;
            nowGrade++;
        }
        
        if (nowGrade >= gradeList.length){
            endFlg = false;
        }
    }
        
    const row = document.createElement('tr');
    row.classList.add("trTotal");
    row.innerHTML = "<td>合計</td>" +
    "<td>" + totalCount + "回</td>" +
    "<td>" + totalCost + "STP</td>"
    tableBody.appendChild(row);

    document.getElementById("COUNT").value = count;
    document.getElementById("UseSTP").value = totalCost;
    

});

document.addEventListener("DOMContentLoaded", function() {
    const strapSelect = document.getElementById("STRAP");
    const tableRows = document.getElementsByName("list");

    function filterTable() {
        const selectedValue = strapSelect.value; // 選択されたストラップの値（レアリティ）
        
        tableRows.forEach(row => {
            const rarityCell = row.cells[0]; // レアリティ列のセル
            if (rarityCell) {
                const rarity = rarityCell.textContent.trim().replace("★", "");
                if (rarity === selectedValue) {
                    row.style.display = ""; // 表示
                } else {
                    row.style.display = "none"; // 非表示
                }
            }
        });
    }
    
    strapSelect.addEventListener("change", filterTable);
    filterTable(); // 初回実行
});
