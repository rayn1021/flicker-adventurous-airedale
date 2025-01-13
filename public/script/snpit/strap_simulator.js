document.getElementById("calculateButton").addEventListener("click", function() {
	
    const list1 = 
        [[0.5, 0.2, 0.1, 0.03],
         [0.5, 0.2, 0.1, 0.03],
         [0.1, 0.03]];
    const list2 = [30, 40, 100];
    
    
    // 入力項目の値を取得
    var inStrap = document.getElementById("STRAP").value;
    var inStart = parseFloat(document.getElementById("GradeStart").value);
    var inEnd = parseFloat(document.getElementById("GradeEnd").value);
    
    // 入力が正しいか確認
    if (isNaN(inStart)) {
        alert("グレード(開始)に正しい数値を入力してください。");
        return;
    }

    // 入力が正しいか確認
    if (isNaN(inStart)) {
        alert("グレード(終了)に正しい数値を入力してください。");
        return;
    }
    
    if (inStart >= inEnd) {
        alert("グレード(終了)には、開始より大きい値を入力してください。");
        return;
    }
    
    if (inStrap == "2" && inEnd > 4) {
        alert("★2ストラップは、グレード4まで強化可能です。");
        return;
    }
    
    if (inStrap == "3" && inEnd > 4) {
        alert("★3ストラップは、グレード4まで強化可能です。");
        return;
    }
    
    if (inStrap == "4" && inEnd > 2) {
        alert("★4ストラップは、グレード2まで強化可能です。");
        return;
    }
    
    
    // 出力エリアの取得
    document.getElementById('resultTableBody').innerHTML="";
    const tableBody = document.getElementById('resultTableBody');
    
    var nowGrade = inStart;
    var endFlg = true;
    var totalCost = 0;
    var totalCount = 0;
    var count = 0;
    var cost = 0;
    while (endFlg) {
        successRate = list1[inStrap - 2][nowGrade];
        cost += list2[inStrap - 2];
        count++;

        
        if (Math.random() < successRate){
            
            totalCount += count;
            totalCost += cost;
            
            const row = document.createElement('tr');
            row.innerHTML = "<td>" + nowGrade + " → " + (nowGrade + 1) +"</td>" +
            "<td>" + count + "回</td>" +
            "<td>" + cost + "STP</td>"
            tableBody.appendChild(row);
            
            count = 0;
            cost = 0;
            nowGrade++;
        }
        
        if (nowGrade == inEnd){
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