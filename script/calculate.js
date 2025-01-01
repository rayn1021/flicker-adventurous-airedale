document.getElementById("calculateButton").addEventListener("click", function() {
    // 入力項目の値を取得
    var inType = document.getElementById("TYPE").value;
    var inEff = parseFloat(document.getElementById("eff").value);
    var inBat = parseFloat(document.getElementById("bat").value);
    var inStrap1 = document.getElementById("strap1").value;
    var inStrap2 = document.getElementById("strap2").value;
    var inStrap3 = document.getElementById("strap3").value;
    var inRimuru = parseFloat(document.getElementById("rimuru").value);
    var inRent = parseFloat(document.getElementById("rentalDetail").value);
    
    // 入力が正しいか確認
    if (isNaN(inEff)) {
        alert("効率に正しい数値を入力してください。");
        return;
    }

    // 入力が正しいか確認
    if (isNaN(inBat)) {
        alert("バッテリーに正しい数値を入力してください。");
        return;
    }

    // 入力が正しいか確認
    if (isNaN(inRimuru)) {
        alert("リムル%に正しい数値を入力してください。");
        return;
    }

    // 入力が正しいか確認
    if (isNaN(inRent)) {
        alert("レンタルに正しい数値を入力してください。");
        return;
    }

    // 入力が正しいか確認
    if (inType == '2' && inRent > 0) {
        alert("非ジェネシスでレンタルすることはできません。");
        return;
    }

    var rimuruFlg = false;
    var shunaFlg = false;

    switch (inStrap1) {
        case "1":
            break;
        case "2":
            inEff += 5;
            break;
        case "3":
            inEff += 3;
            break;
        case "4":
            inBat += 5;
            break;
        case "5":
            inBat += 3;
            break;
        case "6":
            rimuruFlg = true;
            break;
        case "7":
            shunaFlg = true;
            break;
    }

    switch (inStrap2) {
        case "1":
            break;
        case "2":
            inEff += 5;
            break;
        case "3":
            inEff += 3;
            break;
        case "4":
            inBat += 5;
            break;
        case "5":
            inBat += 3;
            break;
        case "6":
            rimuruFlg = true;
            break;
        case "7":
            shunaFlg = true;
            break;
    }

    switch (inStrap3) {
        case "1":
            break;
        case "2":
            inEff += 5;
            break;
        case "3":
            inEff += 3;
            break;
        case "4":
            inBat += 5;
            break;
        case "5":
            inBat += 3;
            break;
        case "6":
            rimuruFlg = true;
            break;
        case "7":
            shunaFlg = true;
            break;
    }
    
    /*
    var magnification = 0.15;
    if(inType == '2'){
        magnification = 0.0925;
    }

    var stp = inEff * magnification;
    if (rimuruFlg == true){
        stp = stp + stp * 0.2 * inRimuru / 100;
    }
    document.getElementById("outputA").value = stp;
    */
    
    var maxStp = inEff * 0.15;
    var minStp = inEff * 0.15;
    var maxCatStp = 0;
    var minCatStp = 0;
    if (inType == '2') {
        maxStp = inEff * 0.1;
        minStp = inEff * 0.08;
        maxCatStp = inEff * 0.05;
        minCatStp = inEff * 0.01;
    }
    
    if (rimuruFlg == true){
        maxStp = maxStp + maxStp * 0.2 * inRimuru / 100;
        minStp = minStp + minStp * 0.2 * inRimuru / 100;
        maxCatStp = maxCatStp + maxCatStp * 0.2 * inRimuru / 100;
        minCatStp = minCatStp + minCatStp * 0.2 * inRimuru / 100;
    }
    
    maxStp = Math.floor(maxStp * 100) / 100;
    minStp = Math.floor(minStp * 100) / 100;
    maxCatStp = Math.floor(maxCatStp * 100) / 100;
    minCatStp = Math.floor(minCatStp * 100) / 100;
    
    var minTotalStp = Math.floor((minStp + minCatStp) * 100) / 100;
    var maxTotalStp = Math.floor((maxStp + maxCatStp) * 100) / 100;
    
    
    var bat = (inEff - inBat) * 0.04;
    bat = Math.floor(bat * 100) / 100;
    
    var cost = bat;
    if (shunaFlg == true){
        cost = cost * 0.8;
    }
    cost = Math.floor(cost * 100) / 100

    if(inRent > 0){
        document.getElementById("rental").style.display="block";
        document.getElementById("marginA").style.display="block";
        document.getElementById("labelMarginA").style.display="block";
        
        var marginA = 0.1;
        var marginB = 0.1;
        
        if (document.getElementById('LenderSubsc').checked) {
            marginA = 0.03;
        } 
        
        if (document.getElementById('renderSubsc').checked) {
            marginB = 0.03;
        } 
        
        //金額の計算
        var wkStpA = Math.floor((maxStp - (maxStp * inRent / 100)) * 100) / 100;	// 貸手ベース
        var marginA = Math.floor(wkStpA * marginA * 100) / 100;	// 貸手手数料
        var wkStpB = Math.floor((maxStp - wkStpA) * 100) / 100;	// 貸手ベース
        var marginB = Math.floor(wkStpB * marginB * 100) / 100;	// 貸手手数料

        document.getElementById("outputA1").value = wkStpA;
        document.getElementById("outputA2").value = 0;
        document.getElementById("outputA3").value = wkStpA;
        document.getElementById("outputB").value = 0;
        document.getElementById("outputC").value = 0;
        document.getElementById("marginA").value = marginA;
        document.getElementById("outputD").value = Math.floor((wkStpA - marginA) * 100) / 100;

        document.getElementById("outputA3-1").value = wkStpB;
        document.getElementById("outputB-1").value = Math.floor(bat * 100) / 100;
        document.getElementById("outputC-1").value = Math.floor(cost * 100) / 100;
        document.getElementById("marginB").value = marginB;
        document.getElementById("outputD-1").value = Math.floor((wkStpB - cost - marginB) * 100) / 100;
    } else {
        document.getElementById("rental").style.display="none";
        document.getElementById("marginA").style.display="none";
        document.getElementById("labelMarginA").style.display="none";

        if (inType == '1') {
            document.getElementById("outputA1").value = Math.floor(maxStp * 100) / 100;
            document.getElementById("outputA2").value = Math.floor(maxCatStp * 100) / 100;
            document.getElementById("outputA3").value = Math.floor(maxTotalStp * 100) / 100;
        } else {
            document.getElementById("outputA1").value = minStp + "～" + maxStp;
            document.getElementById("outputA2").value = minCatStp + "～" + maxCatStp;
            document.getElementById("outputA3").value = minTotalStp + "～" + maxTotalStp;
        }

        document.getElementById("outputB").value = bat;
        document.getElementById("outputC").value = cost;
        document.getElementById("outputD").value = Math.floor((maxTotalStp - cost) * 100) / 100;
    }
});
