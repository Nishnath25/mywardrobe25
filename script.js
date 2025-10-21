// ===== MyWardrobe App =====

// ----- Variables -----
let currentUser = null;
let usersData = {}; // { email: { items: [], history: [] } }
const container = document.querySelector(".container");

// ----- Load from localStorage -----
function loadData() {
  const storedUsers = localStorage.getItem("myWardrobeUsers");
  usersData = storedUsers ? JSON.parse(storedUsers) : {};
}

// ----- Save to localStorage -----
function saveData() {
  localStorage.setItem("myWardrobeUsers", JSON.stringify(usersData));
}

// ----- Login -----
function login() {
  const email = document.getElementById("email").value.trim();
  if (!email) {
    alert("Please enter your email.");
    return;
  }

  loadData();

  if (!usersData[email]) {
    usersData[email] = { items: [], history: [] };
  }

  currentUser = email;
  saveData();
  renderApp();
}

// ----- Logout -----
function logout() {
  currentUser = null;
  renderLogin();
}

// ----- Add Item -----
function addItem() {
  const item = itemInput.value.trim();
  if (item === "") return;

  usersData[currentUser].items.push(item);
  itemInput.value = "";
  saveData();
  renderItems();
  renderOutfitSelection();
}

// ----- Delete Item -----
function deleteItem(index) {
  usersData[currentUser].items.splice(index, 1);
  saveData();
  renderItems();
  renderOutfitSelection();
}

// ----- Save Outfit -----
function saveOutfit() {
  const selected = Array.from(document.querySelectorAll(".outfit-item input:checked"))
    .map((cb) => cb.value);
  if (selected.length === 0) {
    alert("Please select at least one item.");
    return;
  }

  const today = new Date().toLocaleDateString();
  usersData[currentUser].history.push({ date: today, items: selected });
  saveData();
  renderHistory();
}

// ----- Render Login Page -----
function renderLogin() {
  container.innerHTML = `
    <h1>👗 MyWardrobe</h1>
    <div class="section">
      <h2>Login</h2>
      <input type="email" id="email" placeholder="Enter your email" />
      <button onclick="login()">Login</button>
    </div>
  `;
}

// ----- Render Main App -----
function renderApp() {
  loadData();

  container.innerHTML = `
    <h1>👚 MyWardrobe</h1>
    <p>Logged in as <strong>${currentUser}</strong></p>
    <button onclick="logout()">Logout</button>

    <div class="section">
      <h2>Add Clothing Item</h2>
      <input type="text" id="itemInput" placeholder="e.g. Blue Shirt" />
      <button id="addBtn">Add</button>
      <ul id="itemList"></ul>
    </div>

    <div class="section">
      <h2>Record Today’s Outfit</h2>
      <div id="outfitSelection"></div>
      <button id="saveOutfitBtn">Save Outfit</button>
    </div>

    <div class="section">
      <h2>Outfit History</h2>
      <ul id="historyList"></ul>
    </div>
  `;

  // Reconnect DOM elements
  const addBtn = document.getElementById("addBtn");
  const saveOutfitBtn = document.getElementById("saveOutfitBtn");
  window.itemInput = document.getElementById("itemInput");
  window.itemList = document.getElementById("itemList");
  window.outfitSelection = document.getElementById("outfitSelection");
  window.historyList = document.getElementById("historyList");

  // Add event listeners
  addBtn.addEventListener("click", addItem);
  saveOutfitBtn.addEventListener("click", saveOutfit);

  renderItems();
  renderOutfitSelection();
  renderHistory();
}

// ----- Render Clothing List -----
function renderItems() {
  const items = usersData[currentUser]?.items || [];
  itemList.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = () => deleteItem(index);
    li.appendChild(delBtn);
    itemList.appendChild(li);
  });
}

// ----- Render Outfit Selection -----
function renderOutfitSelection() {
  const items = usersData[currentUser]?.items || [];
  outfitSelection.innerHTML = "";

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className = "outfit-item";
    div.innerHTML = `
      <label>
        <input type="checkbox" value="${item}"> ${item}
      </label>
    `;
    outfitSelection.appendChild(div);
  });
}

// ----- Render History -----
function renderHistory() {
  const history = usersData[currentUser]?.history || [];
  historyList.innerHTML = "";

  history.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.date}: ${entry.items.join(", ")}`;
    historyList.appendChild(li);
  });
}

// ----- Start App -----
loadData();
if (currentUser) renderApp();
else renderLogin();
