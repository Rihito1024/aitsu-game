// ===== キャラ定義 =====
const CHARACTERS = {
  mario: "マリオ",
  luigi: "ルイージ",
  wario: "ワリオ",
  yoshi: "ヨッシー"
};

// ===== レベル定義 =====
const LEVELS = [
  {//チュートリアル１
    target: "mario",
    icons: [
      { id: "mario", x: 350, y: 250, size: 50 },
      { id: "luigi", x: 400, y: 250, size: 50 },
      { id: "wario", x: 450, y: 250, size: 50 },
      { id: "yoshi", x: 500, y: 250, size: 50 }
    ]
  },
    {//チュートリアル２
    target: "luigi",
    icons: [
      { id: "mario", x: 350, y: 350, size: 50 },
      { id: "luigi", x: 400, y: 350, size: 50 },
      { id: "wario", x: 450, y: 350, size: 50 },
      { id: "yoshi", x: 500, y: 350, size: 50 }
    ]
  },
  {//チュートリアル３
    target: "wario",
    icons: [
      { id: "mario", x: 350, y: 450, size: 50 },
      { id: "luigi", x: 400, y: 450, size: 50 },
      { id: "wario", x: 450, y: 450, size: 50 },
      { id: "yoshi", x: 500, y: 450, size: 50 }
    ]
  },
  {//チュートリアル４
    target: "yoshi",
    icons: [
      { id: "mario", x: 350, y: 250, size: 50 },
      { id: "luigi", x: 400, y: 250, size: 50 },
      { id: "wario", x: 450, y: 250, size: 50 },
      { id: "yoshi", x: 500, y: 250, size: 50 }
    ]
  },
  {//色
    target: "mario",
    icons: [
      { id: "mario", x: 350, y: 250, size: 50 },
      { id: "luigi", x: 400, y: 250, size: 50 },
      { id: "luigi", x: 450, y: 250, size: 50 },
      { id: "luigi", x: 500, y: 250, size: 50 }
    ]
  },
  {//サイズ
    target: "luigi",
    icons: [
      { id: "mario", x: 140, y: 220, size: 50 },
      { id: "luigi", x: 300, y: 190, size: 120 },
      { id: "wario", x: 460, y: 240, size: 50 },
      { id: "yoshi", x: 620, y: 200, size: 50 }
    ]
  },
  {//位置
    target: "yoshi",
    icons: [
      { id: "mario", x: 350, y: 250, size: 50 },
      { id: "luigi", x: 400, y: 250, size: 50 },
      { id: "wario", x: 450, y: 250, size: 50 },
      { id: "yoshi", x: 500, y: 50, size: 50 }
    ]
  }
];

// ===== 状態 =====
let levelIndex = 0;
let totalTime = 0;
let levelStartTime = 0;
let timer;
let results = [];

// ===== DOM =====
const game = document.getElementById("game");
const timeEl = document.getElementById("time");
const targetImgEl = document.getElementById("target-img");
const bgm = document.getElementById("bgm");
const ruleScreen = document.getElementById("rule-screen");
const startBtn = document.getElementById("start-btn");

// ===== スタート =====
startBtn.onclick = () => {
  ruleScreen.style.display = "none";
  bgm.volume = 0.4;
  bgm.play();
  startGame();
};

// ===== ゲーム開始 =====
function startGame() {
  levelIndex = 0;
  totalTime = 0;
  results = [];
  startTimer();
  startLevel();
}

// ===== レベル開始 =====
function startLevel() {
  game.innerHTML = "";

  const level = LEVELS[levelIndex];
  levelStartTime = totalTime;

  targetImgEl.src = `images/${level.target}.png`;

  level.icons.forEach(icon => createIcon(icon, level.target));
}

// ===== アイコン生成 =====
function createIcon(icon, targetId) {
  const img = document.createElement("img");
  img.src = `images/${icon.id}.png`;
  img.className = "char";

  img.style.width = icon.size + "px";
  img.style.left = icon.x + "px";
  img.style.top = icon.y + "px";

  img.onclick = () => {
    if (icon.id === targetId) {
      finishLevel();
    }
  };

  game.appendChild(img);
}

// ===== タイマー =====
function startTimer() {
  clearInterval(timer);
  totalTime = 0; // 念のため初期化
  timer = setInterval(() => {
    totalTime += 0.1; // 0.1秒ずつ加算
    timeEl.textContent = totalTime.toFixed(1); // 小数1桁で表示
  }, 100); // 100ms ごと
}


// ===== レベル終了 =====
function finishLevel() {
  const levelTime = totalTime - levelStartTime;

  results.push({
    level: levelIndex + 1,
    target: CHARACTERS[LEVELS[levelIndex].target],
    time: levelTime.toFixed(1) // 小数1桁で保存
  });

  levelIndex++;

  if (levelIndex >= LEVELS.length) {
    clearInterval(timer);
    showResults();
  } else {
    // 次のレベルまで3秒間ターゲット表示
    showNextTarget();
  }
}

// ===== 次のターゲット表示（WANTED枠風） =====
function showNextTarget() {
  const nextLevel = LEVELS[levelIndex];

  // game 内にオーバーレイ用 div を作る
  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.8)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "5"; // ヘッダーより上

  // WANTED枠風のボックス
  const box = document.createElement("div");
  box.style.width = "120px";
  box.style.height = "160px";
  box.style.background = "linear-gradient(#f6efd8, #e2d6ad)";
  box.style.border = "3px solid #222";
  box.style.display = "flex";
  box.style.flexDirection = "column";
  box.style.alignItems = "center";
  box.style.justifyContent = "space-between";
  box.style.padding = "6px";
  box.style.boxSizing = "border-box";
  box.style.textAlign = "center";

  const title = document.createElement("div");
  title.textContent = "NEXT TARGET";
  title.style.fontSize = "12px";
  title.style.fontWeight = "bold";
  title.style.borderBottom = "2px solid #222";
  title.style.width = "100%";
  title.style.color = "#000";  // ← ここを追加

  const img = document.createElement("img");
  img.src = `images/${nextLevel.target}.png`;
  img.style.width = "80px";
  img.style.height = "80px";
  img.style.imageRendering = "pixelated";
  img.style.marginTop = "12px";

  box.appendChild(title);
  box.appendChild(img);
  overlay.appendChild(box);
  game.appendChild(overlay);

  // 3秒後に次のレベル開始
  setTimeout(() => {
    game.removeChild(overlay);
    startLevel();
  }, 3000);
}

// ===== 結果表示 =====
function showResults() {
  game.innerHTML = `
    <div id="result-area" style="
      position: absolute;
      inset: 0;
      background: #000;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 3;
    ">
      <h2>RESULT</h2>
      <table id="result-table" style="color:#fff; border-collapse: collapse;">
        <tr><th style="padding:4px; border:1px solid #fff;">LEVEL</th><th style="padding:4px; border:1px solid #fff;">TIME(s)</th></tr>
        ${results.map(r =>
          `<tr><td style="padding:4px; border:1px solid #fff;">${r.level}</td><td style="padding:4px; border:1px solid #fff;">${r.time}</td></tr>`
        ).join("")}
      </table>
      <button onclick="copyResult()" style="margin-top:12px; padding:6px 12px;">コピー</button>
    </div>
  `;
}


// ===== コピー =====
function copyResult() {
  const rows = document.querySelectorAll("#result-table tr");
  let text = "";
  rows.forEach(r => {
    text += Array.from(r.children).map(td => td.innerText).join("\t") + "\n";
  });
  navigator.clipboard.writeText(text);
}
