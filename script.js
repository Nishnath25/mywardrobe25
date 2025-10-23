// ===============================
// MyWardrobe - Final JS Version
// ===============================

// Global variables
let currentUser = null;
let users = JSON.parse(localStorage.getItem("users")) || {};

// ---------- Login System ----------
function loginUser() {
  const email = document.getElementById("email").value.trim();
  if (!email) {
    alert("Please enter your email to continue.");
    return;
  }

  currentUser = email;

  // If new user, create data structure
  if (!users[currentUser]) {
    users[currentUser] = {
      items: [],
      outfits: []
    };
  }

  localStorage.setItem("users", JSON.stringify(users));
  renderMain();
}

function logoutUser() {
  currentUser = null;
  renderLogin();
}

// ---------- Render Login Page ----------
function renderLogin() {
  document.body.innerHTML = `
    <div class="container">
      <h1>👗 MyWardrobe</h1>
      <input type="email" id="email" placeholder="Enter your email" required>
      <button id="loginBtn">Login</button>
    </div>
  `;

  document.getElementById("loginBtn").addEventListener("click", loginUser);
  document.getElementById("email").addEventListener("keypress", (e) => {
    if (e.key === "Enter") loginUser();
  });
}

// ---------- Render Main App ----------
function renderMain() {
  const userData = users[currentUser];

  document.body.innerHTML = `
    <div class="container">
      <div class="header">
        <h1>👗 MyWardrobe</h1>
        <button id="logoutBtn">Logout</button>
      </div>

      <h3>Welcome, ${currentUser}</h3>

      <div class="section">
        <h2>Your Dress Items</h2>
        <input type="text" id="itemInput" placeholder="Enter dress name">
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

  // Re-render items, outfits, and events
  displayItems();
  displayHistory();
  populateSelect();

  // Event listeners (Desktop + Mobile)
  const addBtn = document.getElementById("addItemBtn");
  addBtn.addEventListener("click", addItem);
  addBtn.addEventListener("touchstart", addItem);

  document.getElementById("itemInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  });

  const saveBtn = document.getElementById("saveOutfitBtn");
  saveBtn.addEventListener("click", saveOutfit);
  saveBtn.addEventListener("touchstart", saveOutfit);

  document.getElementById("logoutBtn").addEventListener("click", logoutUser);
}

// ---------- Add Item ----------
function addItem() {
  const itemInput = document.getElementById("itemInput");
  const itemName = itemInput.value.trim();

  if (itemName === "") {
    alert("Please enter a dress name!");
    return;
  }

  const userData = users[currentUser];
  userData.items.push(itemName);
  itemInput.value = "";

  localStorage.setItem("users", JSON.stringify(users));
  displayItems();
  populateSelect();
}

// ---------- Display Dress Items ----------
function displayItems() {
  const itemList = document.getElementById("itemList");
  const userData = users[currentUser];
  itemList.innerHTML = "";

  userData.items.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.classList.add("delete-btn");
    delBtn.addEventListener("click", () => deleteItem(index));
    delBtn.addEventListener("touchstart", () => deleteItem(index));

    li.appendChild(delBtn);
    itemList.appendChild(li);
  });
}

// ---------- Delete Dress ----------
function deleteItem(index) {
  const userData = users[currentUser];
  userData.items.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  displayItems();
  populateSelect();
}

// ---------- Save Outfit ----------
function saveOutfit() {
  const outfitSelect = document.getElementById("outfitSelect");
  const selectedItem = outfitSelect.value;

  if (selectedItem === "") {
    alert("Please select a dress to save!");
    return;
  }

  const userData = users[currentUser];
  const date = new Date().toLocaleDateString();

  userData.outfits.push({ item: selectedItem, date });
  localStorage.setItem("users", JSON.stringify(users));
  displayHistory();
}

// ---------- Display Outfit History ----------
function displayHistory() {
  const historyList = document.getElementById("historyList");
  const userData = users[currentUser];
  historyList.innerHTML = "";

  userData.outfits.forEach((outfit, index) => {
    const li = document.createElement("li");
    li.textContent = `${outfit.item} - ${outfit.date}`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.classList.add("delete-btn");
    delBtn.addEventListener("click", () => deleteOutfit(index));
    delBtn.addEventListener("touchstart", () => deleteOutfit(index));

    li.appendChild(delBtn);
    historyList.appendChild(li);
  });
}

// ---------- Delete Outfit ----------
function deleteOutfit(index) {
  const userData = users[currentUser];
  userData.outfits.splice(index, 1);
  localStorage.setItem("users", JSON.stringify(users));
  displayHistory();
}

// ---------- Populate Outfit Select ----------
function populateSelect() {
  const outfitSelect = document.getElementById("outfitSelect");
  const userData = users[currentUser];

  outfitSelect.innerHTML = `<option value="">-- Select Dress --</option>`;
  userData.items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item;
    option.textContent = item;
    outfitSelect.appendChild(option);
  });
}

// ---------- Start App ----------
if (currentUser) {
  renderMain();
} else {
  renderLogin();
}

  
