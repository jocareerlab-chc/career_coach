const 題目們 = document.querySelectorAll(".題目");
const 下一題按鈕 = document.querySelector("#下一題");
const 進度 = document.querySelector("#進度");
const 進度文字 = document.querySelector("#進度文字");
const 表單提醒 = document.querySelector("#表單提醒");
const 結果 = document.querySelector("#結果");
const 聯絡信箱 = document.querySelector("#聯絡信箱");
let 目前題數 = 0;

// 可發布金鑰本來就設計給瀏覽器使用，絕對不要在前端放入私密金鑰。
const SUPABASE網址 = "https://oapnqzhavpwudrpueewe.supabase.co";
const SUPABASE可發布金鑰 = "sb_publishable_IHkLX24qKXX-JT6wZegVsQ_60HEF8Bh";
const Supabase客戶端 = window.supabase.createClient(SUPABASE網址, SUPABASE可發布金鑰);

const 會員按鈕 = document.querySelector("#會員按鈕");
const 會員專區 = document.querySelector("#會員專區");
const 會員信箱 = document.querySelector("#會員信箱");
const 登入遮罩 = document.querySelector("#登入遮罩");
const 登入表單 = document.querySelector("#登入表單");
const 登入標題 = document.querySelector("#登入標題");
const 登入提醒 = document.querySelector("#登入提醒");
const 登入送出 = document.querySelector("#登入送出");
let 是註冊模式 = false;
let 已完成健檢 = false;

function 開啟登入視窗() {
  登入提醒.textContent = "";
  登入遮罩.hidden = false;
  document.querySelector("#登入信箱").focus();
}

function 關閉登入視窗() {
  登入遮罩.hidden = true;
}

function 更新會員畫面(工作階段) {
  const 使用者 = 工作階段?.user;
  會員按鈕.textContent = 使用者 ? "會員專區" : "登入";
  會員信箱.textContent = 使用者?.email || "會員";

  if (location.hash === "#會員專區") {
    會員專區.hidden = !使用者;
    if (!使用者) 開啟登入視窗();
  } else {
    會員專區.hidden = true;
  }
}

async function 檢查受保護路由() {
  const { data } = await Supabase客戶端.auth.getSession();
  更新會員畫面(data.session);
}

會員按鈕.addEventListener("click", async () => {
  const { data } = await Supabase客戶端.auth.getSession();
  if (data.session) {
    location.hash = "會員專區";
    更新會員畫面(data.session);
    會員專區.scrollIntoView({ behavior: "smooth" });
  } else {
    開啟登入視窗();
  }
});

document.querySelector("#關閉登入").addEventListener("click", 關閉登入視窗);
登入遮罩.addEventListener("click", (事件) => {
  if (事件.target === 登入遮罩) 關閉登入視窗();
});

document.querySelector("#切換模式").addEventListener("click", () => {
  是註冊模式 = !是註冊模式;
  登入標題.textContent = 是註冊模式 ? "建立你的帳號" : "登入你的帳號";
  登入送出.textContent = 是註冊模式 ? "註冊" : "登入";
  document.querySelector("#切換模式").textContent = 是註冊模式
    ? "已經有帳號？返回登入"
    : "還沒有帳號？立即註冊";
  登入提醒.textContent = "";
});

登入表單.addEventListener("submit", async (事件) => {
  事件.preventDefault();
  登入提醒.classList.remove("成功");
  登入提醒.textContent = "處理中，請稍候……";
  登入送出.disabled = true;

  const email = document.querySelector("#登入信箱").value.trim();
  const password = document.querySelector("#登入密碼").value;
  const 回應 = 是註冊模式
    ? await Supabase客戶端.auth.signUp({ email, password })
    : await Supabase客戶端.auth.signInWithPassword({ email, password });

  登入送出.disabled = false;
  if (回應.error) {
    登入提醒.textContent = 回應.error.message;
    return;
  }

  if (是註冊模式 && !回應.data.session) {
    登入提醒.classList.add("成功");
    登入提醒.textContent = "註冊成功，請到信箱完成驗證後再登入。";
    return;
  }

  關閉登入視窗();
  location.hash = "會員專區";
});

document.querySelector("#登出按鈕").addEventListener("click", async () => {
  await Supabase客戶端.auth.signOut();
  location.hash = "首頁";
});

window.addEventListener("hashchange", 檢查受保護路由);
Supabase客戶端.auth.onAuthStateChange((_事件, 工作階段) => 更新會員畫面(工作階段));
檢查受保護路由();

下一題按鈕.addEventListener("click", async () => {
  if (已完成健檢) {
    await 送出健檢結果();
    return;
  }

  if (!聯絡信箱.checkValidity()) {
    表單提醒.textContent = 聯絡信箱.value
      ? "請確認聯絡信箱格式是否正確。"
      : "請先留下你的聯絡信箱。";
    聯絡信箱.focus();
    return;
  }

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
  已完成健檢 = true;
  下一題按鈕.textContent = "送出健檢結果 →";
}

async function 送出健檢結果() {
  const 答案 = [...document.querySelectorAll(".題目 input:checked")]
    .map((選項) => Number(選項.value));

  下一題按鈕.disabled = true;
  下一題按鈕.textContent = "送出中…";
  表單提醒.classList.remove("成功");
  表單提醒.textContent = "";

  const { error } = await Supabase客戶端
    .from("career_assessment_leads")
    .insert({
      email: 聯絡信箱.value.trim().toLowerCase(),
      industry_familiarity: 答案[0],
      target_role_readiness: 答案[1],
      resume_alignment: 答案[2]
    });

  if (error) {
    表單提醒.textContent = "目前無法送出，請稍後再試一次。";
    下一題按鈕.disabled = false;
    下一題按鈕.textContent = "重新送出健檢結果 →";
    return;
  }

  表單提醒.classList.add("成功");
  表單提醒.textContent = "已成功送出，我們已收到你的健檢結果。";
  下一題按鈕.textContent = "已成功送出 ✓";
}

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
