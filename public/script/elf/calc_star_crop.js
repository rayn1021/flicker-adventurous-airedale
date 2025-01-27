function calc() {

    var elfRate = document.getElementById("RATE").value;

    var valueRate = 12.5 / elfRate;
    var emissionRate = elfRate / 12.5;

    document.getElementById("bronzeWeek").innerHTML = roundToDecimal(70000 * emissionRate).toLocaleString() + "個 / 週";
    document.getElementById("bronzeDay").innerHTML = roundToDecimal(70000 * emissionRate / 7).toLocaleString() + "個 / 日";
    document.getElementById("silverWeek").innerHTML = roundToDecimal(700 * emissionRate).toLocaleString() + "個 / 週";
    document.getElementById("silverDay").innerHTML = roundToDecimal(700 * emissionRate / 7).toLocaleString() + "個 / 日";
    document.getElementById("goldWeek").innerHTML = roundToDecimal(70 * emissionRate).toLocaleString() + "個 / 週";
    document.getElementById("goldDay").innerHTML = roundToDecimal(70 * emissionRate / 7) + "個 / 日";
}

window.addEventListener("load", async () => {
    try {
        const response = await fetch(`/api/readRates`);
        if (!response.ok) {
            alert('レートを取得できませんでした。');
            throw new Error(`サーバーエラー: ${response.statusText}`);
        }
        const data = await response.json();
        document.getElementById('RATE').value = data.rates['the-land-elf-crossing'].jpy;
    } catch (error) {
        console.error("エラー:", error);
        document.getElementById("RATE").textContent = `エラー: ${error.message}`;
    }

    calc();
});
