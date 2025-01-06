function calc() {

    var elfRate = parseInt(document.getElementById("RATE").value);

    var valueRate = 12.5 / elfRate;
    var emissionRate = elfRate / 12.5;

    document.getElementById("bronzeWeek").innerHTML = roundToDecimal(70000 * emissionRate).toLocaleString() + "個 / 週";
    document.getElementById("bronzeDay").innerHTML = roundToDecimal(70000 * emissionRate / 7).toLocaleString() + "個 / 日";
    document.getElementById("silverWeek").innerHTML = roundToDecimal(700 * emissionRate).toLocaleString() + "個 / 週";
    document.getElementById("silverDay").innerHTML = roundToDecimal(700 * emissionRate / 7).toLocaleString() + "個 / 日";
    document.getElementById("goldWeek").innerHTML = roundToDecimal(70 * emissionRate).toLocaleString() + "個 / 週";
    document.getElementById("goldDay").innerHTML = roundToDecimal(70 * emissionRate / 7) + "個 / 日";
}

