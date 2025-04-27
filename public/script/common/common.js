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

    return `${formatted}`;
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


  function convertCurrency(inCurrency, outCurrency, price){
        
    let rtnPrice = 0;
    inCurrency = inCurrency.toLowerCase();
    outCurrency = outCurrency.toLowerCase();

    if (inCurrency == outCurrency){
        return price;
    }

    switch(true){
        case inCurrency == "jpy" && outCurrency == "pol":
            rtnPrice = price / polJpy;
            break;
        case inCurrency == "pol" && outCurrency == "jpy":
            rtnPrice = price * polJpy;
            break;
        case inCurrency == "jpy" && outCurrency == "snpt":
            rtnPrice = price / snptJpy;
            break;
        case inCurrency == "snpt" && outCurrency == "jpy":
            rtnPrice = price * snptJpy;
            break;
        case inCurrency == "jpy" && outCurrency == "usd":
            rtnPrice = price / usdJpy;
            break;
        case inCurrency == "usd" && outCurrency == "jpy":
            rtnPrice = price * usdJpy;
            break;
        case inCurrency == "jpy" && outCurrency == "usdt":
            rtnPrice = price / usdJpy;
            break;
        case inCurrency == "usdt" && outCurrency == "jpy":
            rtnPrice = price * usdJpy;
            break;
            case inCurrency == "jpy" && outCurrency == "stp":
            document.getElementById("ammRate").value * snptJpy
            rtnPrice = price / (document.getElementById("ammRate").value * snptJpy);
            break;
        case inCurrency == "stp" && outCurrency == "jpy":
            rtnPrice = price * document.getElementById("ammRate").value * snptJpy;
            break;
        default:
            return 'err';

    }

    return rtnPrice;
}


function calcStp(gen, eff, bat){

    let income = 0;
    let rate = 0.09 + 0.03;
    if (gen){
        rate = 0.15;
    }

    income = (eff * rate) - ((eff - bat * 1.25) * 0.04 );
    return income; 

}

function allowEmptyNumberInput(input){
    try{
        // 例えば、フォーカスが外れたときに値が空ならそのまま空に保つ
        var inElm = document.getElementById(input);
        inElm.addEventListener("blur", () => {
            if (inElm.value === "") {
                inElm.value = ""; // 明示的に空に設定（再描画防止）
            }
        });
    } catch(error){
        
    }
}
