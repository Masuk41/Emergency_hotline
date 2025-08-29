// Global variables
let heartCount = 0;
let coinCount = 100;
let copyCount = 0;
let callHistory = [];

// DOM elements
const heartCountElement = document.getElementById("heartCount");
const coinCountElement = document.getElementById("coinCount");
const copyCountElement = document.getElementById("copyCount");
const callHistoryElement = document.getElementById("callHistory");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  initializeEventListeners();
  updateDisplay();
  renderCallHistory();
});

// Initialize all event listeners
function initializeEventListeners() {
  // Heart button event listeners
  const heartButtons = document.querySelectorAll(".heart-btn");
  heartButtons.forEach((btn) => {
    btn.addEventListener("click", handleHeartClick);
  });

  // Copy button event listeners
  const copyButtons = document.querySelectorAll(".copy-btn");
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", handleCopyClick);
  });

  // Call button event listeners
  const callButtons = document.querySelectorAll(".call-btn");
  callButtons.forEach((btn) => {
    btn.addEventListener("click", handleCallClick);
  });

  // Clear history button
  clearHistoryBtn.addEventListener("click", clearCallHistory);
}

// Handle heart button clicks
function handleHeartClick(event) {
  event.preventDefault();
  heartCount++;
  updateDisplay();

  // Add animation effect
  const heartBtn = event.target;
  heartBtn.style.transform = "scale(1.3)";
  setTimeout(() => {
    heartBtn.style.transform = "scale(1)";
  }, 200);
}

// Handle copy button clicks
function handleCopyClick(event) {
  event.preventDefault();
  const button = event.target.closest(".copy-btn");
  const phoneNumber = button.getAttribute("data-number");

  // Copy to clipboard
  copyToClipboard(phoneNumber);

  // Increase copy count
  copyCount++;
  updateDisplay();

  // Show alert
  alert(`Number ${phoneNumber} has been copied to clipboard!`);
}

// Handle call button clicks
function handleCallClick(event) {
  event.preventDefault();
  const button = event.target.closest(".call-btn");
  const phoneNumber = button.getAttribute("data-number");
  const serviceName = button.getAttribute("data-service");

  // Check if user has enough coins
  if (coinCount < 20) {
    alert("Insufficient coins! You need at least 20 coins to make a call.");
    return;
  }

  // Deduct coins
  coinCount -= 20;
  updateDisplay();

  // Show alert
  alert(`Calling ${serviceName} at ${phoneNumber}`);

  // Add to call history
  addToCallHistory(serviceName, phoneNumber);
}

// Copy text to clipboard
async function copyToClipboard(text) {
  try {
    // Modern approach using Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }
  } catch (err) {
    console.error("Failed to copy text: ", err);
    // Fallback method
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
}

// Add service to call history
function addToCallHistory(serviceName, phoneNumber) {
  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const dateString = currentTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const historyItem = {
    serviceName: serviceName,
    phoneNumber: phoneNumber,
    time: timeString,
    date: dateString,
    timestamp: currentTime.getTime(),
  };

  // Add to beginning of array (most recent first)
  callHistory.unshift(historyItem);

  // Limit history to 10 items
  if (callHistory.length > 10) {
    callHistory = callHistory.slice(0, 10);
  }

  renderCallHistory();
}

// Render call history
function renderCallHistory() {
  callHistoryElement.innerHTML = "";

  if (callHistory.length === 0) {
    callHistoryElement.innerHTML =
      '<div class="empty-history">No call history yet</div>';
    return;
  }

  callHistory.forEach((item) => {
    const historyItemElement = document.createElement("div");
    historyItemElement.className = "history-item";

    historyItemElement.innerHTML = `
            <div class="history-service-name">${item.serviceName}</div>
            <div class="history-service-number">${item.phoneNumber}</div>
            <div class="history-time">${item.time} • ${item.date}</div>
        `;

    callHistoryElement.appendChild(historyItemElement);
  });
}

// Clear call history
function clearCallHistory() {
  if (callHistory.length === 0) {
    alert("Call history is already empty!");
    return;
  }

  if (confirm("Are you sure you want to clear all call history?")) {
    callHistory = [];
    renderCallHistory();
    alert("Call history cleared successfully!");
  }
}

// Update display elements
function updateDisplay() {
  heartCountElement.textContent = heartCount;
  coinCountElement.textContent = coinCount;
  copyCountElement.textContent = `${copyCount} Copy`;
}

// Utility function to format time
function formatTime(date) {
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Add smooth scroll behavior for better UX
document.documentElement.style.scrollBehavior = "smooth";

// Add loading animation for buttons
function addButtonLoadingState(button, duration = 1000) {
  const originalText = button.innerHTML;
  button.disabled = true;
  button.style.opacity = "0.7";

  setTimeout(() => {
    button.disabled = false;
    button.style.opacity = "1";
    button.innerHTML = originalText;
  }, duration);
}

// Enhanced error handling
window.addEventListener("error", function (e) {
  console.error("Application error:", e.error);
});

// Prevent form submission if any forms are added later
document.addEventListener("submit", function (e) {
  e.preventDefault();
});

// Add keyboard accessibility
document.addEventListener("keydown", function (e) {
  // ESC key to close any open modals/alerts (future enhancement)
  if (e.key === "Escape") {
    // Handle escape key if needed
  }
});

// Performance optimization: Debounce rapid clicks
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add visual feedback for interactions
function addRippleEffect(element, event) {
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement("span");
  ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${size}px;
    `;

  element.style.position = "relative";
  element.style.overflow = "hidden";
  element.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Add CSS for ripple animation
const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
