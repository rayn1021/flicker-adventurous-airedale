// 出力順序を定義
const order = [
    "Genesis",
    "Level",
    "Rarity",
    "Mint",
    "Initial Quality",
    "Current Quality",
    "Initial Efficiency",
    "Current Efficiency",
    "Initial Luck",
    "Current Luck",
    "Initial Battery",
    "Current Battery",
    "Battery Remaining",
    "Shots Since Last Recovery",
    "Condition",
    "Categories",
    "Minted By",
    "Total Shots"
  ];

document.getElementById("StartButton").addEventListener("click", async () => {
    const contractAddress = "0x8703e7509774A13f6C5516a6e60965B7eec68B5D"; // 必要に応じて変更
    const tokenId = document.getElementById('CONTRACT_ADDRESS').value; // 必要に応じて変更


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

        // 順序を適用して並び替えた属性データ
    const sortedAttributes = order.map(trait => {
        return metadata.attributes.find(attr => attr.trait_type === trait) || { trait_type: trait, value: "N/A" };
    });

      // 結果をHTMLに表示
      var tableBody = document.getElementById("resultTableBody");
      tableBody.innerHTML = "";
      sortedAttributes.forEach(attribute => {
        const row = document.createElement("tr");
        const traitCell = document.createElement("td");
        const valueCell = document.createElement("td");
        traitCell.textContent = attribute.trait_type;
        valueCell.textContent = attribute.value;
        valueCell.id = attribute.trait_type;
        row.appendChild(traitCell);
        row.appendChild(valueCell);
        tableBody.appendChild(row);
      });

    } catch (error) {
      console.error("エラー:", error);
      document.getElementById("json").textContent = `エラー: ${error.message}`;
    }

    // Xで共有ボタンを表示
    document.getElementById("share-button").style.display = "block";

    });

  document.getElementById('share-button').addEventListener('click', function () {
    const url = encodeURIComponent(window.location.href); // 現在のページURL

    // 投稿文章作成
    // X投稿用の文章を作成
    var genesis = document.getElementById("Genesis").innerHTML;
    if (genesis == "No"){
        genesis = "子カメラ"
    } else {
        genesis = "ジェネシスカメラ"
    }

    var text = 
        `カメラチェッカー結果！\n` +
        `・${genesis}\n` +
        `レアリティ：${document.getElementById("Rarity").innerHTML}\n` +
        `レベル：${document.getElementById("Level").innerHTML}\n` +
        `画質：${document.getElementById("Current Quality").innerHTML}(${document.getElementById("Initial Quality").innerHTML})\n` +
        `効率：${document.getElementById("Current Efficiency").innerHTML}(${document.getElementById("Initial Efficiency").innerHTML})\n` +
        `運：${document.getElementById("Current Luck").innerHTML}(${document.getElementById("Initial Luck").innerHTML})\n` +
        `電池：${document.getElementById("Current Battery").innerHTML}(${document.getElementById("Initial Battery").innerHTML})\n` +
        `カテゴリー：${document.getElementById("Categories").innerHTML}\n` +
        `撮影枚数：${document.getElementById("Total Shots").innerHTML}\n` +
        `#SNPIT\n`;

    const xText = encodeURIComponent(text);

    const shareUrl = `https://twitter.com/intent/tweet?text=${xText}&url=${url}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
});
