// Service data
const services = [
  {
    id: 1,
    name: "National Emergency Number",
    nameEn: "National Emergency",
    number: "999",
    category: "All",
    icon: "fas fa-ambulance",
    color: "#ef4444",
  },
  {
    id: 2,
    name: "Police Helpline Number",
    nameEn: "Police",
    number: "999",
    category: "Police",
    icon: "fas fa-shield-alt",
    color: "#3b82f6",
  },
  {
    id: 3,
    name: "Ambulance Service",
    nameEn: "Ambulance",
    number: "1994-999999",
    category: "Health",
    icon: "fas fa-ambulance",
    color: "#ef4444",
  },
  {
    id: 4,
    name: "Women & Child Helpline",
    nameEn: "Women & Child Helpline",
    number: "109",
    category: "Help",
    icon: "fas fa-female",
    color: "#ec4899",
  },
  {
    id: 5,
    name: "Electricity Helpline",
    nameEn: "Electricity Outage",
    number: "16216",
    category: "Electricity",
    icon: "fas fa-bolt",
    color: "#f59e0b",
  },
  {
    id: 6,
    name: "Brac Helpline",
    nameEn: "Brac",
    number: "16445",
    category: "NGO",
    icon: "fas fa-hands-helping",
    color: "#10b981",
  },
  {
    id: 7,
    name: "Fire Service Number",
    nameEn: "Fire Service",
    number: "999",
    category: "Fire",
    icon: "fas fa-fire",
    color: "#f97316",
  },
  {
    id: 8,
    name: "Anti-Corruption Helpline",
    nameEn: "Anti-Corruption",
    number: "106",
    category: "Govt.",
    icon: "fas fa-gavel",
    color: "#6366f1",
  },
  {
    id: 9,
    name: "Bangladesh Railway Helpline",
    nameEn: "Bangladesh Railway",
    number: "163",
    category: "Travel",
    icon: "fas fa-train",
    color: "#14b8a6",
  },
];

// State variables
let heartCount = 0;
let coinCount = 100;
let copyCount = 0;
let callHistory = [];

// DOM Elements
const cardsContainer = document.getElementById("cards-container");
const historyList = document.getElementById("history-list");
const heartCountElement = document.getElementById("heart-count");
const coinCountElement = document.getElementById("coin-count");
const copyCountElement = document.getElementById("copy-count");
const clearHistoryButton = document.getElementById("clear-history");
const alertElement = document.getElementById("alert");
const alertMessage = document.getElementById("alert-message");

// Initialize the page
function init() {
  renderCards();
  updateCounts();
  loadCallHistory();
}

// Render service cards
function renderCards() {
  cardsContainer.innerHTML = "";

  services.forEach((service) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header">
        <div class="card-icon" style="background-color: ${service.color};">
          <i class="${service.icon}"></i>
        </div>
        <div>
          <h3 class="card-title">${service.name}</h3>
          <p class="card-subtitle">${service.nameEn}</p>
        </div>
      </div>
      <div class="card-body">
        <div class="card-number">${service.number}</div>
        <span class="card-category">${service.category}</span>
      </div>
      <div class="card-footer">
        <div class="heart-icon" data-id="${service.id}">
          <i class="far fa-heart"></i>
        </div>
        <div class="card-actions">
          <button class="btn btn-copy" data-number="${service.number}" data-name="${service.name}">
            <i class="far fa-copy"></i> Copy
          </button>
          <button class="btn btn-call" data-number="${service.number}" data-name="${service.name}">
            <i class="fas fa-phone"></i> Call
          </button>
        </div>
      </div>
    `;
    cardsContainer.appendChild(card);
  });

  // Event listeners
  document.querySelectorAll(".heart-icon").forEach((icon) => {
    icon.addEventListener("click", handleHeartClick);
  });
  document.querySelectorAll(".btn-copy").forEach((btn) => {
    btn.addEventListener("click", handleCopyClick);
  });
  document.querySelectorAll(".btn-call").forEach((btn) => {
    btn.addEventListener("click", handleCallClick);
  });
}

// Update navbar counts
function updateCounts() {
  heartCountElement.textContent = heartCount;
  coinCountElement.textContent = coinCount;
  copyCountElement.textContent = copyCount;
}

// Handle heart icon
function handleHeartClick(e) {
  const heartIcon = e.currentTarget;
  const icon = heartIcon.querySelector("i");

  if (icon.classList.contains("far")) {
    icon.classList.remove("far");
    icon.classList.add("fas", "active");
    heartCount++;
  } else {
    icon.classList.remove("fas", "active");
    icon.classList.add("far");
    if (heartCount > 0) heartCount--;
  }
  updateCounts();
}

// Handle copy button
function handleCopyClick(e) {
  const number = e.currentTarget.dataset.number;
  navigator.clipboard
    .writeText(number)
    .then(() => {
      showAlert(`Copied: ${number}`);
      copyCount++;
      updateCounts();
    })
    .catch(() => {
      showAlert("Failed to copy number", true);
    });
}

// Handle call button
function handleCallClick(e) {
  const number = e.currentTarget.dataset.number;
  const name = e.currentTarget.dataset.name;

  if (coinCount < 20) {
    showAlert(
      "Not enough coins. You need at least 20 coins to make a call.",
      true
    );
    return;
  }

  coinCount -= 20;
  updateCounts();
  showAlert(`Calling ${name}: ${number}`);
  addToCallHistory(name, number);
}

// Add to call history
function addToCallHistory(name, number) {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  const dateString = now.toLocaleDateString();

  callHistory.push({ name, number, time: `${dateString} ${timeString}` });
  saveCallHistory();
  renderCallHistory();
}

//
