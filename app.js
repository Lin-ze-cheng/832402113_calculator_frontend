"use strict";

const API_BASE = window.CALCULATOR_API_BASE || "http://127.0.0.1:8000";

const expressionInput = document.querySelector("#expression");
const resultOutput = document.querySelector("#result");
const message = document.querySelector("#message");
const keypad = document.querySelector(".keypad");
const historyList = document.querySelector("#history-list");
const historyTemplate = document.querySelector("#history-item-template");
const clearHistoryButton = document.querySelector("#clear-history");
const apiStatus = document.querySelector("#api-status");

let calculationInProgress = false;

function showMessage(text = "") {
  message.textContent = text;
}

function setApiStatus(online, text) {
  apiStatus.classList.toggle("online", online);
  apiStatus.classList.toggle("offline", !online);
  apiStatus.querySelector("span:last-child").textContent = text;
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error("后端返回了无法识别的数据");
  }

  if (!response.ok || body.success === false) {
    throw new Error(body.message || "请求失败，请稍后重试");
  }
  return body;
}

function appendToExpression(value) {
  const start = expressionInput.selectionStart ?? expressionInput.value.length;
  const end = expressionInput.selectionEnd ?? expressionInput.value.length;
  expressionInput.value =
    expressionInput.value.slice(0, start) + value + expressionInput.value.slice(end);
  const nextPosition = start + value.length;
  expressionInput.focus();
  expressionInput.setSelectionRange(nextPosition, nextPosition);
  showMessage();
}

function clearCalculator() {
  expressionInput.value = "";
  resultOutput.textContent = "—";
  showMessage();
  expressionInput.focus();
}

function backspace() {
  const start = expressionInput.selectionStart ?? expressionInput.value.length;
  const end = expressionInput.selectionEnd ?? expressionInput.value.length;

  if (start !== end) {
    expressionInput.value = expressionInput.value.slice(0, start) + expressionInput.value.slice(end);
    expressionInput.setSelectionRange(start, start);
  } else if (start > 0) {
    expressionInput.value =
      expressionInput.value.slice(0, start - 1) + expressionInput.value.slice(end);
    expressionInput.setSelectionRange(start - 1, start - 1);
  }
  expressionInput.focus();
}

async function calculate() {
  const expression = expressionInput.value.trim();
  if (!expression) {
    showMessage("请先输入数学表达式");
    expressionInput.focus();
    return;
  }
  if (calculationInProgress) return;

  calculationInProgress = true;
  showMessage("正在由后端计算…");

  try {
    const body = await apiRequest("/api/calculate", {
      method: "POST",
      body: JSON.stringify({ expression }),
    });
    resultOutput.textContent = String(body.result);
    showMessage();
    setApiStatus(true, "后端已连接");
    await loadHistory();
  } catch (error) {
    resultOutput.textContent = "错误";
    showMessage(error.message);
    if (error instanceof TypeError) {
      setApiStatus(false, "后端未连接");
    }
  } finally {
    calculationInProgress = false;
  }
}

function renderHistory(items) {
  historyList.replaceChildren();
  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "还没有计算记录。完成一次计算后，记录会保存在后端数据库中。";
    historyList.append(empty);
    return;
  }

  for (const item of items) {
    const fragment = historyTemplate.content.cloneNode(true);
    fragment.querySelector(".history-expression").textContent = item.expression;
    fragment.querySelector(".history-result").textContent = `= ${item.result}`;

    const time = fragment.querySelector(".history-time");
    const parsedTime = new Date(item.created_at);
    time.dateTime = item.created_at;
    time.textContent = Number.isNaN(parsedTime.getTime())
      ? item.created_at
      : parsedTime.toLocaleString("zh-CN", { hour12: false });

    fragment.querySelector(".delete-button").addEventListener("click", () => deleteHistory(item.id));
    historyList.append(fragment);
  }
}

async function loadHistory() {
  try {
    const body = await apiRequest("/api/history");
    renderHistory(body.items);
    setApiStatus(true, "后端已连接");
  } catch (error) {
    historyList.innerHTML = `<p class="empty-state">无法读取历史记录，请确认后端已经启动。</p>`;
    setApiStatus(false, "后端未连接");
  }
}

async function deleteHistory(recordId) {
  try {
    await apiRequest(`/api/history/${recordId}`, { method: "DELETE" });
    await loadHistory();
  } catch (error) {
    showMessage(error.message);
  }
}

async function clearAllHistory() {
  const confirmed = window.confirm("确定要删除数据库中的全部计算历史吗？此操作无法撤销。");
  if (!confirmed) return;

  try {
    await apiRequest("/api/history", { method: "DELETE" });
    await loadHistory();
  } catch (error) {
    showMessage(error.message);
  }
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.value) appendToExpression(button.dataset.value);
  if (button.dataset.action === "clear") clearCalculator();
  if (button.dataset.action === "backspace") backspace();
  if (button.dataset.action === "calculate") calculate();
});

expressionInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    calculate();
  } else if (event.key === "Escape") {
    event.preventDefault();
    clearCalculator();
  }
});

expressionInput.addEventListener("input", () => showMessage());
clearHistoryButton.addEventListener("click", clearAllHistory);

loadHistory();
