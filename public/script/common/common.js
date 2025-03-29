/* 
 * 小数点以下2桁に丸める関数
 */
function roundToDecimal(value, decimals = 2) {
    const factor = Math.pow(10, decimals);

    if (isNaN(Math.round(value * factor) / factor)){
        return 0;
    } else {
        return Math.round(value * factor) / factor;
    }
}

function isNumeric(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}

function formatNumber(value) {
    const formatted =  new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);

    return `${formatted}円`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    }).replace(/\//g, '/').replace(',', '');
}

function showLoading(messageText) {
    // オーバーレイを作成
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "9999"; // 他の要素の上に表示
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
  
    // 「実行中」のメッセージを作成
    const message = document.createElement("div");
    message.textContent = messageText;
    message.style.backgroundColor = "white";
    message.style.padding = "20px 40px";
    message.style.borderRadius = "10px";
    message.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    message.style.fontSize = "18px";
    message.style.fontWeight = "bold";
  
    // 要素をオーバーレイに追加
    overlay.appendChild(message);
  
    // ドキュメントにオーバーレイを追加
    document.body.appendChild(overlay);
  
    // 戻り値としてオーバーレイ要素を返す（後で削除するため）
    return overlay;
  }
  
  function hideLoading(overlay) {
    // オーバーレイを削除
    if (overlay) {
      document.body.removeChild(overlay);
    }
  }