document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  let currentUser = null;

  function renderLogin() {
    container.innerHTML = `
      <h1>MyWardrobe 👗</h1>
      <div class="section">
        <input type="email" id="emailInput" placeholder="Enter your email" />
        <button id="loginBtn">Login</button>
      </div>
    `;
    document.getElementById("loginBtn").addEventListener("click", loginUser);
  }

  function loginUser() {
    const email = document.getElementById("emailInput").value.trim();
    if (email === "") {
      alert("Please enter your email!");
      return;
    }
    currentUser = email;
    localStorage.setItem("currentUser", email);
    renderMain();
  }

  function logoutUser() {
    localStorage.removeItem("currentUser");
    currentUser = null;
    renderLogin();
  }

  function renderMain() {
    const userItems = JSON.parse(localStorage.getItem(`${currentUser}_items`)) || [];
    const outfitHistory = JSON.parse(localStorage.getItem(`${currentUser}_history`)) || [];

    container.innerHTML = `
      <h1>👕 MyWardrobe</h1>
      <div class="section">
        <h3>Add New Dress Item</h3>
        <input type="text" id="itemInput" placeholder="e.g., Blue Jeans" />
        <button id="addItemBtn">Add</button>
        <ul id="itemList"></ul>
      </div>

      <div class="section">
        <h3>Select Today's Outfit</h3>
        <div id="selectionList"></div>
        <button id="saveOutfitBtn">Save Outfit</button>
      </div>

      <div class="section">
        <h3>Outfit History</h3>
        <ul id="historyList"></ul>
      </div>

      <div class="section">
        <button id="logoutBtn" style="background:red;">Logout</button>
      </div>
    `;

    document.getElementById("addItemBtn").addEventListener("click", addItem);
    document.getElementById("saveOutfitBtn").addEventListener("click", saveOutfit);
    document.getElementById("logoutBtn").addEventListener("click", logoutUser);

    renderItems();
    renderHistory();
  }

  function addItem() {
    const itemInput = document.getElementById("itemInput");
    const itemName = itemInput.value.trim();

    if (itemName === "") {
      alert("Please enter a valid dress item!");
      return;
    }

    const userItems = JSON.parse(localStorage.getItem(`${currentUser}_items`)) || [];
    userItems.push(itemName);
    localStorage.setItem(`${currentUser}_items`, JSON.stringify(userItems));

    itemInput.value = "";
    renderItems();
  }

  function renderItems() {
    const itemList = document.getElementById("itemList");
    const selectionList = document.getElementById("selectionList");
    const userItems = JSON.parse(localStorage.getItem(`${currentUser}_items`)) || [];

    itemList.innerHTML = "";
    selectionList.innerHTML = "";

    userItems.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = item;

      const delBtn = document.createElement("button");
      delBtn.textContent = "❌";
      delBtn.addEventListener("click", () => {
        userItems.splice(index, 1);
        localStorage.setItem(`${currentUser}_items`, JSON.stringify(userItems));
        renderItems();
      });

      li.appendChild(delBtn);
      itemList.appendChild(li);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = item;
      checkbox.id = `item_${index}`;

      const label = document.createElement("label");
      label.htmlFor = checkbox.id;
      label.textContent = item;

      const div = document.createElement("div");
      div.classList.add("outfit-item");
      div.appendChild(checkbox);
      div.appendChild(label);

      selectionList.appendChild(div);
    });
  }

  function saveOutfit() {
    const checkboxes = document.querySelectorAll("#selectionList input[type='checkbox']");
    const selectedItems = [];
    checkboxes.forEach((cb) => {
      if (cb.checked) selectedItems.push(cb.value);
    });

    if (selectedItems.length === 0) {
      alert("Please select at least one item!");
      return;
    }

    const outfitHistory = JSON.parse(localStorage.getItem(`${currentUser}_history`)) || [];
    const today = new Date().toLocaleDateString();

    outfitHistory.push({ date: today, items: selectedItems });
    localStorage.setItem(`${currentUser}_history`, JSON.stringify(outfitHistory));

    renderHistory();
  }

  function renderHistory() {
    const historyList = document.getElementById("historyList");
    const outfitHistory = JSON.parse(localStorage.getItem(`${currentUser}_history`)) || [];

    historyList.innerHTML = "";
    outfitHistory.forEach((entry) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${entry.date}:</strong> ${entry.items.join(", ")}`;
      historyList.appendChild(li);
    });
  }

  const savedUser = localStorage.getItem("currentUser");
  if (savedUser) {
    currentUser = savedUser;
    renderMain();
  } else {
    renderLogin();
  }
});
