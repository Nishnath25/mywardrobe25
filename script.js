let currentUser = null;
let users = JSON.parse(localStorage.getItem("users")) || {};

// ---------- Login ----------
function loginUser() {
  const email = document.getElementById("email").value.trim();
  if (!email) {
    alert("Please enter your email to continue.");
    return;
  }

  currentUser = email;
  if (!users[currentUser]) users[currentUser] = { items: [], outfits: [] };

  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", currentUser);
  renderMain();
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  renderLogin();
}

// ---------- Render Login ----------
function renderLogin() {
  document.body.innerHTML = `
    <div class="container">
      <h1>👗 MyWardrobe</h1>
      <div class="section">
        <input type="email" id="email" placeholder="Enter your email" required />
        <button id="loginBtn" type="button">Login</button>
      </div>
    </div>
  `;

  document.getElementById("loginBtn").addEventListener("click", loginUser);
  document.getElementById("email").addEventListener("keypress", (e) => {
    if (e.key === "Enter") loginUser();
  });
}

// ---------- Render Main App ----------
let lastSaveTime = 0;

function renderMain() {
  const userData = users[currentUser];

  document.body.innerHTML = `
    <div class="container">
      <div class="header" style="display:flex;justify-content:space-between;align-items:center;">
        <h1>👚 MyWardrobe</h1>
        <button id="logoutBtn" type="button" style="background:#dc3545;color:white;padding:8px;border-radius:6px;">Logout</button>
      </div>
      <p>Welcome, <strong>${currentUser}</strong></p>

      <div class="section">
        <h2>Your Dress Items</h2>
        <input type="text" id="itemInput" placeholder="Enter dress name" />
        <button id="addItemBtn" type="button">Add</button>
        <ul id="itemList"></ul>
      </div>

      <div class="section">
        <h2>Mark Outfit Worn</h2>
        <select id="outfitSelect">
          <option value="">-- Select Dress --</option>
        </select>
        <button id="saveOutfitBtn" type="button">Save Outfit</button>
      </div>

      <div class="section">
        <h2>Outfit History</h2>
        <ul id="historyList"></ul>
      </div>
    </div>
  `;

  document.getElementById("logoutBtn").addEventListener("click", logoutUser);
  document.getElementById("addItemBtn").addEventListener("click", addItem);
  document.getElementById("itemInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") addItem();
  });
  document.getElementById("saveOutfitBtn").addEventListener("click", saveOutfit);

  renderItems();
  populateSelect();
  renderHistory();
}

// ---------- Add / Delete Item ----------
function addItem() {
  const input = document.getElementById("itemInput");
  const name = input.value.trim();
  if (!name) {
    alert("Please enter a dress name!");
    return;
  }
  users[currentUser].items.push(name);
  localStorage.setItem("users", JSON.stringify(users));
  input.value = "";
  renderItems();
  populateSelect();
}

function renderItems() {
  const list = document.getElementById("itemList");
  const items = users[currentUser].items || [];
  list.innerHTML = "";
  items.forEach((it, idx) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.textContent = it;

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.addEventListener("click", () => {
      users[currentUser].items.splice(idx, 1);
      localStorage.setItem("users", JSON.stringify(users));
      renderItems();
      populateSelect();
    });

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

// ---------- Populate Select ----------
function populateSelect() {
  const select = document.getElementById("outfitSelect");
  const items = users[currentUser].items || [];
  select.innerHTML = `<option value="">-- Select Dress --</option>`;
  items.forEach((it) => {
    const opt = document.createElement("option");
    opt.value = it;
    opt.textContent = it;
    select.appendChild(opt);
  });
}

// ---------- Save Outfit ----------
function saveOutfit() {
  const now = Date.now();
  if (now - lastSaveTime < 500) return; // debounce
  lastSaveTime = now;

  const select = document.getElementById("outfitSelect");
  const chosen = select.value;
  if (!chosen) {
    alert("Please select a dress to save.");
    return;
  }

  const today = new Date().toLocaleDateString();
  users[currentUser].outfits.push({ item: chosen, date: today });
  localStorage.setItem("users", JSON.stringify(users));
  renderHistory();
}

// ---------- Render History ----------
function renderHistory() {
  const list = document.getElementById("historyList");
  const outfits = users[currentUser].outfits || [];
  list.innerHTML = "";
  outfits.forEach((entry, idx) => {
    const li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.textContent = `${entry.item} — ${entry.date}`;

    const del = document.createElement("button");
    del.textContent = "❌";
    del.addEventListener("click", () => {
      users[currentUser].outfits.splice(idx, 1);
      localStorage.setItem("users", JSON.stringify(users));
      renderHistory();
    });

    li.appendChild(del);
    list.appendChild(li);
  });
}

// ---------- Initialize ----------
(function init() {
  if (localStorage.getItem("users")) users = JSON.parse(localStorage.getItem("users"));
  const savedUser = localStorage.getItem("currentUser");
  if (savedUser && users[savedUser]) {
    currentUser = savedUser;
    renderMain();
  } else {
    renderLogin();
  }
})();

