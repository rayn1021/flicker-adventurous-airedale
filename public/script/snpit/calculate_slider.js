// 入力フィールドが変更されたとき、スライダーを更新
const effInput = document.getElementById("eff");
const effSlider = document.getElementById("eff-slider");
effInput.addEventListener("input", () => {
    setEffSlider();
});

// スライダーが変更されたとき、入力フィールドを更新
effSlider.addEventListener("input", () => {
    effInput.value = effSlider.value;
});

  // 入力フィールドが変更されたとき、スライダーを更新
const batInput = document.getElementById("bat");
const batSlider = document.getElementById("bat-slider");
batInput.addEventListener("input", () => {
    setBatSlider();
});

// スライダーが変更されたとき、入力フィールドを更新
batSlider.addEventListener("input", () => {
    batInput.value = batSlider.value;
});

document.getElementById('eff-plus').addEventListener('click', function () {fluctuation("eff", 1);});
document.getElementById('eff-minus').addEventListener('click', function () {fluctuation("eff", -1);});
document.getElementById('bat-plus').addEventListener('click', function () {fluctuation("bat", 1);});
document.getElementById('bat-minus').addEventListener('click', function () {fluctuation("bat", -1);});

function fluctuation(target, val){
    var elmTarget = document.getElementById(target);
    var targetVal = parseInt(elmTarget.value);
    elmTarget.value = targetVal + val;

    // スライダーの設定
    var targetSlider = document.getElementById(target + "-slider");
    value = Math.max(Math.min(targetVal + val, targetSlider.max), targetSlider.min); // 範囲を制限
    elmTarget.value = targetVal + val; // 修正した値を再設定
    targetSlider.value = targetVal + val;
}

sliderList = 
    [[1, 110],
     [1, 178],
     [1, 215],
     [1, 313],
     [1, 380]
    ];

const radios = document.getElementsByName('rareButton');
for (const radio of radios) {
  radio.addEventListener('change', () => {
    if (radio.checked) {
        document.getElementById('eff-slider').min = sliderList[radio.value][0];
        document.getElementById('eff-slider').max = sliderList[radio.value][1];
        document.getElementById('bat-slider').min = sliderList[radio.value][0];
        document.getElementById('bat-slider').max = sliderList[radio.value][1];

        document.getElementById('eff-slider').value = sliderList[radio.value][0];
        document.getElementById('bat-slider').value = sliderList[radio.value][0];
        document.getElementById('eff').value = sliderList[radio.value][0];
        document.getElementById('bat').value = sliderList[radio.value][0];
    }
  });
}

function setEffSlider(){
    let value = parseFloat(effInput.value) || 0; // 無効な入力を防ぐ
    value = Math.max(Math.min(value, effSlider.max), effSlider.min); // 範囲を制限
    effInput.value = value; // 修正した値を再設定
    effSlider.value = value;
}

function setBatSlider(){
    let value = parseFloat(batInput.value) || 0; // 無効な入力を防ぐ
    value = Math.max(Math.min(value, batSlider.max), batSlider.min); // 範囲を制限
    batInput.value = value; // 修正した値を再設定
    batSlider.value = value;
}

function setSliderRange(){
    for (const radio of radios) {
        if (radio.checked) {
            document.getElementById('eff-slider').min = sliderList[radio.value][0];
            document.getElementById('eff-slider').max = sliderList[radio.value][1];
            document.getElementById('bat-slider').min = sliderList[radio.value][0];
            document.getElementById('bat-slider').max = sliderList[radio.value][1];
    
            document.getElementById('eff-slider').value = document.getElementById('eff').value
            document.getElementById('bat-slider').value = document.getElementById('bat').value
        }
    }
}
