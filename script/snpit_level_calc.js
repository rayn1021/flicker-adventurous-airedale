const costList = 
    [
     [0.4, 0.8, 1.2, 1.6, 20, 2.4, 2.8, 3.2, 3.6, 40, 4.4, 4.8, 5.2, 5.6, 60, 6.4, 6.8, 7.2, 7.6, 80, 8.4, 8.8, 9.2, 9.6, 100, 10.4, 10.8, 11.2, 11.6, 120],
     [0.8, 1.6, 2.4, 3.2, 40, 4.8, 5.6, 6.4, 7.2, 80, 8.8, 9.6, 10.4, 11.2, 120, 12.8, 13.6, 14.4, 15.2, 160, 16.8, 17.6, 18.4, 19.2, 200, 20.8, 21.6, 22.4, 23.2, 240],
     [1.6, 3.2, 4.8, 6.4, 80, 9.6, 11.2, 12.8, 14.4, 160, 17.6, 19.2, 20.8, 22.4, 240, 25.6, 27.2, 28.8, 30.4, 320, 33.6, 35.2, 36.8, 38.4, 400, 41.6, 43.2, 44.8, 46.4, 480],
     [3.2, 6.4, 9.6, 12.8, 160, 19.2, 22.4, 25.6, 28.8, 320, 35.2, 38.4, 41.6, 44.8, 480, 51.2, 54.4, 57.6, 60.8, 640, 67.2, 70.4, 73.6, 76.8, 800, 83.2, 86.4, 89.6, 92.8, 960]
    ]
const timeList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];


document.getElementById("StartButton").addEventListener("click", function() {

    // 入力項目の値を取得
    const  inRare = document.querySelector('input[name="rareButton"]:checked').value;
    let   inStart = parseFloat(document.getElementById("START").value);
    let   inEnd = parseFloat(document.getElementById("END").value);

    // 入力が正しいか確認
    if (isNaN(inStart)) {
        inStart = 1;
    }

    if (isNaN(inEnd)) {
        inEnd = 31;
    }

    document.getElementById('levelResult').innerHTML = "";
    const tableBody = document.getElementById('levelResult');
    row = document.createElement('tr');

    let targetCostList = costList[inRare];
    let sumStp = 0;
    let sumTime = 0;
    for (let i = inStart; i < inEnd; i++) {
        // 最終結果の書き込み
        row = document.createElement('tr');
        row.innerHTML = 
            `<td>Lv${i} ～ Lv${i + 1}</td>` +
            `<td>${targetCostList[i - 1]} STP</td>` +
            `<td>${timeList[i - 1]} 時間</td>`;
        tableBody.appendChild(row);
        sumStp += targetCostList[i - 1];
        sumTime += timeList[i - 1];
   }

     // 最終結果の書き込み
    row = document.createElement('tr');
    row.innerHTML = 
        `<td>Lv${inStart} ～ Lv${inEnd}</td>` +
        `<td>${sumStp.toLocaleString()} STP</td>` +
        `<td>${sumTime.toLocaleString()} 時間</td>`;
    row.style.fontWeight = "bold";
    tableBody.appendChild(row);

});
