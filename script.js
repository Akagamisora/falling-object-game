let count = 0;
let timeLeft = 10;
let isGameActive = false;
const timerDisplay = document.getElementById("timer");
const countDisplay = document.getElementById("count");
const resultDisplay = document.getElementById("result");
const rankingDisplay = document.getElementById("ranking");
const countdownDisplay = document.getElementById("countdown");
const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");

let objects = []; // 生成されたオブジェクトの位置を管理する配列
const objectWidth = 50;
const objectHeight = 50;

// タイマー関数
function startTimer() {
    const timer = setInterval(function () {
        timeLeft--;
        timerDisplay.textContent = "残り時間: " + timeLeft + "秒";

        // 10秒経過したらゲーム終了
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.removeEventListener("click", countClicks);
            resultDisplay.textContent = "結果: あなたのクリック回数は " + count + " 回です！";
            saveScore(count); // スコアを保存
            displayRanking();  // ランキング表示
            restartButton.style.display = "block"; // 再スタートボタンを表示
        }
    }, 1000);
}

// カウントダウン関数
function startCountdown(callback) {
    let countdown = 3;
    countdownDisplay.textContent = countdown;
    const countdownInterval = setInterval(function () {
        countdown--;
        if (countdown > 0) {
            countdownDisplay.textContent = countdown;
        } else if (countdown === 0) {
            countdownDisplay.textContent = "スタート！";
        } else {
            clearInterval(countdownInterval);
            countdownDisplay.textContent = "";
            callback();  // カウントダウン終了後にゲーム開始
        }
    }, 1000);
}

// クリックしたときの動作
function countClicks(e) {
    if (!isGameActive) return;
    count++;
    countDisplay.textContent = "クリック回数: " + count;
    createFallingObject(e.clientX); // オブジェクト生成
}

// ゲームを初期化
function initGame() {
    count = 0;
    timeLeft = 10;
    isGameActive = true;
    objects = []; // オブジェクトの位置情報を初期化
    countDisplay.textContent = "クリック回数: 0";
    timerDisplay.textContent = "残り時間: 10秒";
    resultDisplay.textContent = "";
    restartButton.style.display = "none";
    startTimer();
    document.addEventListener("click", countClicks);
}

// オブジェクトを生成して落下させる
function createFallingObject(xPosition) {
    const object = document.createElement("div");
    object.classList.add("object");

    // 初期位置は画面の上部（Y座標は0）
    const startYPosition = 0;

    // 横の中央に配置
    object.style.left = `${xPosition - objectWidth / 2}px`; // 横位置を調整
    object.style.top = `${startYPosition}px`; // 縦位置を調整

    document.body.appendChild(object);

    // オブジェクトをアニメーションさせる
    let fallInterval = setInterval(function () {
        let currentY = parseInt(object.style.top);

        // 次に移動する位置
        let nextY = currentY + 5; // 5pxずつ下に移動

        if (nextY + objectHeight >= window.innerHeight) {
            // 画面の底に達したら停止
            clearInterval(fallInterval);
            objects.push({ x: xPosition, y: window.innerHeight - objectHeight });
            object.style.top = `${window.innerHeight - objectHeight}px`; // 底に揃える
        } else {
            // オブジェクトを移動
            object.style.top = `${nextY}px`;
        }
    }, 10);
}

// ゲーム開始ボタン
startButton.addEventListener("click", function () {
    startButton.style.display = "none"; // 開始ボタンを非表示
    startCountdown(function () {
        initGame(); // カウントダウン終了後にゲーム開始
    });
});

// 再スタートボタン
restartButton.addEventListener("click", function () {
    restartButton.style.display = "none";
    clearFallingObjects(); // 画面上のオブジェクトをクリア
    startCountdown(function () {
        initGame();
    });
});

// スコアをローカルストレージに保存
function saveScore(score) {
    let scores = JSON.parse(localStorage.getItem("clickGameScores")) || [];
    scores.push(score);
    scores.sort((a, b) => b - a); // 降順にソート
    if (scores.length > 5) {
        scores = scores.slice(0, 5); // 上位5件のみ保持
    }
    localStorage.setItem("clickGameScores", JSON.stringify(scores));
}

// ランキングを表示
function displayRanking() {
    let scores = JSON.parse(localStorage.getItem("clickGameScores")) || [];
    let rankingHTML = "<strong>ランキング:</strong><br>";
    scores.forEach((score, index) => {
        rankingHTML += `${index + 1}位: ${score}回<br>`;
    });
    rankingDisplay.innerHTML = rankingHTML;
}

// ページロード時にランキングを表示
window.onload = function () {
    displayRanking();
};

// 画面上のオブジェクトをクリア
function clearFallingObjects() {
    const objectsOnScreen = document.querySelectorAll(".object");
    objectsOnScreen.forEach(object => object.remove());
    objects = []; // オブジェクトの位置情報をリセット
}