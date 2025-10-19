// Login System
const loginSection = document.getElementById("loginSection");
const appSection = document.getElementById("appSection");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const emailInput = document.getElementById("email");
const userEmail = document.getElementById("userEmail");

loginBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  if (email) {
    localStorage.setItem("loggedInUser", email);
    showApp();
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  location.reload();
});

function showApp() {
  const email = localStorage.getItem("loggedInUser");
  if (email) {
    loginSection.style.display = "none";
    appSection.style.display = "block";
    userEmail.textContent = email;
    loadWardrobe();
    loadHistory();
  }
}
showApp();

// Wardrobe Section
const dressInput = document.getElementById("dressInput");
const addDressBtn = document.getElementById("addDressBtn");
const wardrobeList = document.getElementById("wardrobeList");

addDressBtn.addEventListener("click", () => {
  const dress = dressInput.value.trim();
  if (dress) {
    const wardrobe = getWardrobe();
    wardrobe.push(dress);
    saveWardrobe(wardrobe);
    dressInput.value = "";
    loadWardrobe();
  }
});

function getWardrobe() {
  return JSON.parse(localStorage.getItem("wardrobe") || "[]");
}
function saveWardrobe(data) {
  localStorage.setItem("wardrobe", JSON.stringify(data));
}
function loadWardrobe() {
  const wardrobe = getWardrobe();
  wardrobeList.innerHTML = "";
  wardrobe.forEach((dress, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${dress} <button onclick="deleteDress(${index})">❌</button>`;
    wardrobeList.appendChild(li);
  });
  loadCheckboxes();
}
function deleteDress(index) {
  const wardrobe = getWardrobe();
  wardrobe.splice(index, 1);
  saveWardrobe(wardrobe);
  loadWardrobe();
}

// What I Wore
const dateInput = document.getElementById("dateInput");
const checkboxContainer = document.getElementById("checkboxContainer");
const saveWornBtn = document.getElementById("saveWornBtn");
const historyList = document.getElementById("historyList");

function loadCheckboxes() {
  const wardrobe = getWardrobe();
  checkboxContainer.innerHTML = "";
  wardrobe.forEach(dress => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${dress}"> ${dress}`;
    checkboxContainer.appendChild(label);
  });
}

saveWornBtn.addEventListener("click", () => {
  const date = dateInput.value;
  if (!date) return alert("Select a date first!");

  const selected = Array.from(checkboxContainer.querySelectorAll("input:checked")).map(c => c.value);
  if (selected.length === 0) return alert("Select at least one dress!");

  const history = JSON.parse(localStorage.getItem("history") || "[]");
  history.push({ date, dresses: selected });
  localStorage.setItem("history", JSON.stringify(history));
  loadHistory();
});

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  historyList.innerHTML = "";
  history.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.date}: ${item.dresses.join(", ")} 
      <button onclick="deleteHistory(${index})">🗑️</button>`;
    historyList.appendChild(li);
  });
}
function deleteHistory(index) {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  history.splice(index, 1);
  localStorage.setItem("history", JSON.stringify(history));
  loadHistory();
}

// Tabs
const wardrobeTab = document.getElementById("wardrobeTab");
const wornTab = document.getElementById("wornTab");
const wardrobeSection = document.getElementById("wardrobeSection");
const wornSection = document.getElementById("wornSection");

wardrobeTab.addEventListener("click", () => {
  wardrobeSection.style.display = "block";
  wornSection.style.display = "none";
  wardrobeTab.classList.add("active");
  wornTab.classList.remove("active");
});

wornTab.addEventListener("click", () => {
  wardrobeSection.style.display = "none";
  wornSection.style.display = "block";
  wardrobeTab.classList.remove("active");
  wornTab.classList.add("active");
});

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}
