/* 
 * 小数点以下2桁に丸める関数
 */
function roundToDecimal(value, decimals = 2) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}