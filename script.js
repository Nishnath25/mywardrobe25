// Global variables
let clothes = [];
let history = [];
let currentUser = localStorage.getItem("currentUser") || "";

// Element references
const itemInput = document.getElementById("itemInput");
const itemList = document.getElementById("itemList");
const outfitSelection = document.getElementById("outfitSelection");
const historyList = document.getElementById("historyList");

// Login elements (created dynamically)
const container = document.querySelector(".container");

// --- LOGIN HANDLING ---
function showLogin() {
  container.innerHTML = `
    <h1>👕 MyWardrobe Login</h1>
    <input type="email" id="emailInput" placeholder="Enter your email" />
    <button onclick="login()">Login</button>
  `;
}

function login() {
  const email = document.getElementById("emailInput").value.trim();
  if (email === "") return alert("Please enter a valid email!");
  currentUser = email;
  localStorage.setItem("currentUser", currentUser);
  renderApp();
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

// --- STORAGE HELPERS ---
function getStorageKey(key) {
  return `${key}_${currentUser}`;
}

function loadData() {
  if (!currentUser) return;
  clothes = JSON.parse(localStorage.getItem(getStorageKey("clothes"))) || [];
  history = JSON.parse(localStorage.getItem(getStorageKey("history"))) || [];
}

function saveData() {
  if (!currentUser) return;
  localStorage.setItem(getStorageKey("clothes"), JSON.stringify(clothes));
  localStorage.setItem(getStorageKey("history"), JSON.stringify(history));
}

// --- ITEM MANAGEMENT ---
function addItem() {
  const newItem = itemInput.value.trim();
  if (newItem === "") return;
  clothes.push(newItem);
  saveData();
  itemInput.value = "";
  renderItems();
}

function deleteItem(index) {
  clothes.splice(index, 1);
  saveData();
  renderItems();
}

// --- OUTFIT MANAGEMENT ---
function saveOutfit() {
  const selected = Array.from(document.querySelectorAll("#outfitSelection input:checked"))
    .map(i => i.value);
  if (selected.length === 0) return alert("Please select at least one item!");
  const date = new Date().toLocaleDateString();
  history.push({ date, outfit: selected });
  saveData();
  renderHistory();
}

// --- RENDERING FUNCTIONS ---
function renderItems() {
  itemList.innerHTML = "";
  outfitSelection.innerHTML = "";

  clothes.forEach((item, index) => {
    // List with delete button
    const li = document.createElement("li");
    li.textContent = item + " ";
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = () => deleteItem(index);
    li.appendChild(delBtn);
    itemList.appendChild(li);

    // Outfit checkbox
    const checkbox = document.createElement("div");
    checkbox.innerHTML = `<label><input type="checkbox" value="${item}"> ${item}</label>`;
    outfitSelection.appendChild(checkbox);
  });
}

function renderHistory() {
  historyList.innerHTML = "";
  history.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `${entry.date}: ${entry.outfit.join(", ")}`;
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.onclick = () => deleteHistory(index);
    li.appendChild(delBtn);
    historyList.appendChild(li);
  });
}

function deleteHistory(index) {
  history.splice(index, 1);
  saveData();
  renderHistory();
}

// --- APP RENDER ---
function renderApp() {
  loadData();

  container.innerHTML = `
    <h1>👚 MyWardrobe</h1>
    <p>Logged in as <strong>${currentUser}</strong></p>
    <button onclick="logout()">Logout</button>

    <div class="section">
      <h2>Add Clothing Item</h2>
      <input type="text" id="itemInput" placeholder="e.g. Blue Shirt" />
      <button onclick="addItem()">Add</button>
      <ul id="itemList"></ul>
    </div>

    <div class="section">
      <h2>Record Today’s Outfit</h2>
      <div id="outfitSelection"></div>
      <button onclick="saveOutfit()">Save Outfit</button>
    </div>

    <div class="section">
      <h2>Outfit History</h2>
      <ul id="historyList"></ul>
    </div>
  `;

  // Reconnect DOM references
  window.itemInput = document.getElementById("itemInput");
  window.itemList = document.getElementById("itemList");
  window.outfitSelection = document.getElementById("outfitSelection");
  window.historyList = document.getElementById("historyList");

  renderItems();
  renderHistory();
}

// --- INITIAL LOAD ---
if (currentUser) {
  renderApp();
} else {
  showLogin();
}

