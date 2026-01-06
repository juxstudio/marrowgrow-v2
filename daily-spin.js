// Daily Spin System - Separate file for better performance and organization

// Daily Slots Mini-Game functions
async function canSpinSlotsToday() {
  if (!currentGrower) {
    console.log("❌ No current grower, cannot spin");
    return false;
  }
  const today = new Date().toISOString().slice(0, 10);
  console.log(
    `🔍 Checking if can spin today (${today}) for user: ${currentGrower}`
  );
  const { date, count } = await PlayFabService.getSlotsSpinData(currentGrower);
  console.log(`📊 Spin data: date=${date}, count=${count}`);
  const canSpin = date !== today || count < 1;
  console.log(`✅ Can spin: ${canSpin}`);
  return canSpin;
}

async function setSlotsSpinToday() {
  if (!currentGrower) return;
  const today = new Date().toISOString().slice(0, 10);
  const { date, count } = await PlayFabService.getSlotsSpinData(currentGrower);
  if (date !== today) {
    await PlayFabService.setSlotsSpinData(currentGrower, today, 1);
  } else {
    await PlayFabService.setSlotsSpinData(currentGrower, today, count + 1);
  }
}

async function getSlotsSpinsToday() {
  if (!currentGrower) return 0;
  const today = new Date().toISOString().slice(0, 10);
  const { date, count } = await PlayFabService.getSlotsSpinData(currentGrower);
  return date === today ? count : 0;
}

async function showSlotsModal() {
  console.log("🎰 Showing slots modal");
  const modal = document.getElementById("slotsModal");
  if (!modal) {
    console.log("❌ Slots modal not found in DOM");
    return;
  }
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  // Reset reels and message
  document.getElementById("slot1").textContent = "🌱";
  document.getElementById("slot2").textContent = "💰";
  document.getElementById("slot3").textContent = "⚡";
  const spinsToday = await getSlotsSpinsToday();
  console.log(`🎯 Spins today: ${spinsToday}`);
  document.getElementById("slotsResultMsg").textContent = `Spins left today: ${
    1 - spinsToday
  }`;
  document.getElementById("spinSlotsBtn").disabled = spinsToday >= 1;
  console.log("✅ Slots modal shown successfully");
}

function hideSlotsModal() {
  const modal = document.getElementById("slotsModal");
  if (!modal) return;
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

async function spinSlots() {
  const spinsToday = await getSlotsSpinsToday();
  if (spinsToday >= 1) return; // Prevent extra spins
  const icons = ["🌱", "💰", "⚡", "🦄"];
  let reels = [];
  for (let i = 0; i < 3; i++) {
    reels.push(icons[Math.floor(Math.random() * icons.length)]);
  }

  // Animate reels
  let spinCount = 0;
  const spinInterval = setInterval(() => {
    for (let i = 0; i < 3; i++) {
      document.getElementById(`slot${i + 1}`).textContent =
        icons[Math.floor(Math.random() * icons.length)];
    }
    spinCount++;
    if (spinCount >= 20) {
      clearInterval(spinInterval);
      // Set final results
      for (let i = 0; i < 3; i++) {
        document.getElementById(`slot${i + 1}`).textContent = reels[i];
      }

      // Check for matches
      let seedsWon = 0;
      if (reels[0] === reels[1] && reels[1] === reels[2]) {
        // Three of a kind
        seedsWon = 3;
        document.getElementById("slotsResultMsg").textContent =
          "🎉 TRIPLE MATCH! You won 3 seeds!";
      } else if (
        reels[0] === reels[1] ||
        reels[1] === reels[2] ||
        reels[0] === reels[2]
      ) {
        // Two of a kind
        seedsWon = 1;
        document.getElementById("slotsResultMsg").textContent =
          "🎯 DOUBLE MATCH! You won 1 seed!";
      } else {
        document.getElementById("slotsResultMsg").textContent =
          "Better luck tomorrow!";
      }

      if (seedsWon > 0) {
        setLivesForPlayer(getLivesForPlayer() + seedsWon);
        saveHighScores();
        updateHighScoresDisplay();
        // Update the seeds display to show the new count
        updateSeedsDisplayAfterSpin();

        // Force immediate UI update
        if (typeof updateLivesDisplay === "function") {
          updateLivesDisplay();
        }

        // Record slots win for badge tracking (async)
        (async () => {
          try {
            await PlayFabService.executeCloudScript("recordSlotsWin", {});
            console.log("🎰 Slots win recorded for badge tracking");
          } catch (error) {
            console.error("Failed to record slots win:", error);
          }
        })();
      }
      setSlotsSpinToday();
      document.getElementById("spinSlotsBtn").disabled = true;

      // Immediately update the daily spin button to show it's been used
      // This happens instantly while PlayFab processes in the background
      const dailySpinBtn = document.getElementById("dailySpinBtn");
      console.log("🎰 [DEBUG] Looking for dailySpinBtn:", dailySpinBtn);

      if (dailySpinBtn) {
        console.log("🎰 [DEBUG] Found dailySpinBtn, updating state...");
        dailySpinBtn.classList.add("used");
        dailySpinBtn.textContent = "Daily Spin (Used)";
        console.log("🎰 Daily spin button immediately marked as used");
        console.log("🎰 [DEBUG] Button text is now:", dailySpinBtn.textContent);
        console.log(
          "🎰 [DEBUG] Button classes:",
          dailySpinBtn.classList.toString()
        );
      } else {
        console.error("🎰 [ERROR] dailySpinBtn not found!");
      }

      setTimeout(() => {
        hideSlotsModal();

        // Try to update the button again after modal closes (fallback)
        const dailySpinBtnRetry = document.getElementById("dailySpinBtn");
        if (
          dailySpinBtnRetry &&
          !dailySpinBtnRetry.classList.contains("used")
        ) {
          console.log(
            "🎰 [DEBUG] Retry: Updating daily spin button after modal close"
          );
          dailySpinBtnRetry.classList.add("used");
          dailySpinBtnRetry.textContent = "Daily Spin (Used)";
        }
      }, 2500);
    }
  }, 80);
}

// Setup event listeners for daily spin functionality
function setupDailySpinEventListeners() {
  // Set up slots modal event listeners
  const spinBtn = document.getElementById("spinSlotsBtn");
  if (spinBtn) {
    spinBtn.onclick = spinSlots;
  }

  const continueBtn = document.getElementById("continueSlotsBtn");
  if (continueBtn) {
    continueBtn.onclick = function () {
      hideSlotsModal();
    };
  }

  // Set up daily spin button event listener (will be called when button is created)
  setupDailySpinButtonListener();
}

// Setup the daily spin button event listener
function setupDailySpinButtonListener() {
  // Prevent multiple event listeners
  if (window.dailySpinListenerSetup) {
    console.log("Daily spin listener already setup, skipping...");
    return;
  }

  window.dailySpinListenerSetup = true;

  // Use event delegation since the button is created dynamically
  document.addEventListener("click", async function (event) {
    if (event.target && event.target.id === "dailySpinBtn") {
      console.log("Daily spin button clicked");
      const canSpin = await canSpinSlotsToday();
      if (canSpin) {
        await showSlotsModal();
      } else {
        alert("You've already used your daily spin today!");
      }
    }
  });
}

// Update daily spin button state based on usage
async function updateDailySpinButtonState() {
  const dailySpinBtn = document.getElementById("dailySpinBtn");
  if (dailySpinBtn) {
    const canSpin = await canSpinSlotsToday();
    if (!canSpin) {
      dailySpinBtn.classList.add("used");
      dailySpinBtn.textContent = "Daily Spin (Used)";
    } else {
      dailySpinBtn.classList.remove("used");
      dailySpinBtn.textContent = "Daily Spin";
    }
  }
}

// Initialize daily spin system when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("🎰 Daily spin system initialized");
  setupDailySpinEventListeners();
});

// Make functions globally available
window.canSpinSlotsToday = canSpinSlotsToday;
window.setSlotsSpinToday = setSlotsSpinToday;
window.getSlotsSpinsToday = getSlotsSpinsToday;
window.showSlotsModal = showSlotsModal;
window.hideSlotsModal = hideSlotsModal;
window.spinSlots = spinSlots;
window.setupDailySpinEventListeners = setupDailySpinEventListeners;
window.setupDailySpinButtonListener = setupDailySpinButtonListener;
window.updateDailySpinButtonState = updateDailySpinButtonState;
