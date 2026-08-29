const 題目們 = document.querySelectorAll(".題目");
const 下一題按鈕 = document.querySelector("#下一題");
const 進度 = document.querySelector("#進度");
const 進度文字 = document.querySelector("#進度文字");
const 表單提醒 = document.querySelector("#表單提醒");
const 結果 = document.querySelector("#結果");
let 目前題數 = 0;

下一題按鈕.addEventListener("click", () => {
  const 目前題目 = 題目們[目前題數];
  const 選項 = 目前題目.querySelector("input:checked");

  if (!選項) {
    表單提醒.textContent = "請先選擇最符合你的狀態。";
    return;
  }

  表單提醒.textContent = "";

  if (目前題數 < 題目們.length - 1) {
    目前題目.classList.remove("顯示");
    目前題數 += 1;
    題目們[目前題數].classList.add("顯示");
    進度.style.width = `${((目前題數 + 1) / 題目們.length) * 100}%`;
    進度文字.textContent = `${目前題數 + 1} / ${題目們.length}`;
    if (目前題數 === 題目們.length - 1) 下一題按鈕.textContent = "查看我的結果 →";
    return;
  }

  顯示結果();
});

function 顯示結果() {
  const 選取值 = [...document.querySelectorAll(".題目 input:checked")];
  const 總分 = 選取值.reduce((加總, 選項) => 加總 + Number(選項.value), 0);
  const 百分比 = Math.round((總分 / 9) * 100);
  const 結果標題 = document.querySelector("#結果標題");
  const 結果建議 = document.querySelector("#結果建議");

  document.querySelector("#分數").textContent = `${百分比}%`;

  if (總分 <= 4) {
    結果標題.textContent = "探索起步期";
    結果建議.textContent = "先別急著海投。建議先盤點可轉移能力，選定一到兩種目標職缺，再開始補產業知識。";
  } else if (總分 <= 7) {
    結果標題.textContent = "聚焦準備期";
    結果建議.textContent = "方向已經出現，下一步是讓履歷與個案更精準對應職缺，並建立穩定的面試答題框架。";
  } else {
    結果標題.textContent = "上場衝刺期";
    結果建議.textContent = "你的基礎已經完整，適合開始精準投遞，透過模擬面試與逐題復盤，提高最後的錄取率。";
  }

  題目們[目前題數].classList.remove("顯示");
  結果.classList.add("顯示");
  進度.style.width = "100%";
  進度文字.textContent = "完成";
  下一題按鈕.textContent = "預約免費諮詢 →";
  下一題按鈕.onclick = () => document.querySelector("#聯絡").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll(".方案切換 button").forEach((按鈕) => {
  按鈕.addEventListener("click", () => {
    document.querySelectorAll(".方案切換 button").forEach((項目) => 項目.classList.remove("啟用"));
    按鈕.classList.add("啟用");
    const 使用分期 = 按鈕.dataset.price === "分期";

    document.querySelectorAll(".價格 strong").forEach((價格) => {
      價格.textContent = 使用分期 ? 價格.dataset.plan : 價格.dataset.once;
    });
  });
});

document.querySelectorAll(".步驟").forEach((步驟) => {
  const 啟用步驟 = () => {
    document.querySelectorAll(".步驟").forEach((項目) => 項目.classList.remove("啟用"));
    步驟.classList.add("啟用");
  };
  步驟.addEventListener("mouseenter", 啟用步驟);
  步驟.addEventListener("focus", 啟用步驟);
});
