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

// Save spin results to localStorage
function saveSpinResults(reels, seedsWon) {
  const today = new Date().toISOString().slice(0, 10);
  const data = { date: today, reels, seedsWon };
  localStorage.setItem('dailySpinResult', JSON.stringify(data));
}

// Load spin results from localStorage (only if from today)
function loadSpinResults() {
  try {
    const data = JSON.parse(localStorage.getItem('dailySpinResult'));
    if (data && data.date === new Date().toISOString().slice(0, 10)) {
      return { reels: data.reels, seedsWon: data.seedsWon };
    }
  } catch (e) { }
  return null;
}

async function spinSlots() {
  const spinsToday = await getSlotsSpinsToday();
  if (spinsToday >= 1) return;

  const icons = ["🌱", "💰", "⚡", "🦄"];
  const container = document.getElementById("compactSlots");
  const slots = [
    document.getElementById("slot1"),
    document.getElementById("slot2"),
    document.getElementById("slot3")
  ];
  const resultEl = document.getElementById("compactSlotsResult");

  if (!slots[0] || !container) return;

  // Mark as spinning
  container.classList.add("spinning");
  resultEl.textContent = "";
  resultEl.classList.remove("win", "loss");

  // Determine final results
  let reels = [];
  for (let i = 0; i < 3; i++) {
    reels.push(icons[Math.floor(Math.random() * icons.length)]);
  }

  // Add spinning class to all slots
  slots.forEach(slot => {
    slot.classList.add("spinning");
    slot.classList.remove("winner");
  });

  // Animate random icons while spinning
  const spinInterval = setInterval(() => {
    slots.forEach(slot => {
      slot.textContent = icons[Math.floor(Math.random() * icons.length)];
    });
  }, 80);

  // Stop spinning after 1.5 seconds
  setTimeout(() => {
    clearInterval(spinInterval);

    // Stop each reel with staggered timing and bounce effect
    slots.forEach((slot, i) => {
      setTimeout(() => {
        slot.classList.remove("spinning");
        slot.classList.add("stopping");
        slot.textContent = reels[i];
        // Remove stopping class after animation completes
        setTimeout(() => slot.classList.remove("stopping"), 300);
      }, i * 300);
    });

    // After all reels stop, check for wins
    setTimeout(() => {
      let seedsWon = 0;
      if (reels[0] === reels[1] && reels[1] === reels[2]) {
        seedsWon = 3;
        slots.forEach(slot => slot.classList.add("winner"));
      } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
        seedsWon = 1;
        if (reels[0] === reels[1]) { slots[0].classList.add("winner"); slots[1].classList.add("winner"); }
        if (reels[1] === reels[2]) { slots[1].classList.add("winner"); slots[2].classList.add("winner"); }
        if (reels[0] === reels[2]) { slots[0].classList.add("winner"); slots[2].classList.add("winner"); }
      }

      // Show result below emojis
      if (seedsWon > 0) {
        resultEl.textContent = `+${seedsWon} Seed${seedsWon > 1 ? 's' : ''}!`;
        resultEl.classList.add("win");

        // Award seeds
        setLivesForPlayer(getLivesForPlayer() + seedsWon);
        saveHighScores();
        updateHighScoresDisplay();
        updateSeedsDisplayAfterSpin();
        if (typeof updateLivesDisplay === "function") updateLivesDisplay();

        (async () => {
          try {
            await PlayFabService.executeCloudScript("recordSlotsWin", {});
          } catch (error) {
            console.error("Failed to record slots win:", error);
          }
        })();
      } else {
        resultEl.textContent = "No match";
        resultEl.classList.add("loss");
      }

      // Mark spin as used
      container.classList.remove("spinning");
      container.classList.add("used");

      // Update button to grey/used state
      const dailySpinBtn = document.getElementById("dailySpinBtn");
      if (dailySpinBtn) {
        dailySpinBtn.textContent = "Spin Used";
        dailySpinBtn.classList.add("used");
      }

      // Save the spin data
      setSlotsSpinToday();
      saveSpinResults(reels, seedsWon);
      // Don't call updateCompactSlotsState() here - it causes race condition

    }, 1000); // Wait for all reels to stop (3 slots x 300ms stagger + buffer)
  }, 1500);
}

// Setup event listeners for daily spin functionality
function setupDailySpinEventListeners() {
  // Set up Daily Spin button click handler
  setupDailySpinButtonListener();
}

// Setup the Daily Spin button click listener
function setupDailySpinButtonListener() {
  // Prevent multiple event listeners
  if (window.dailySpinListenerSetup) {
    console.log("Daily spin listener already setup, skipping...");
    return;
  }

  window.dailySpinListenerSetup = true;

  // Use event delegation
  document.addEventListener("click", async function (event) {
    const btn = event.target.closest("#dailySpinBtn");
    if (btn) {
      console.log("Daily Spin button clicked");
      // If button is already used, ignore
      if (btn.classList.contains("used")) {
        return;
      }
      const canSpin = await canSpinSlotsToday();
      if (canSpin) {
        // Grey out the button
        btn.classList.add("used");
        btn.textContent = "Spinning...";

        // Start the spin animation (pill is already visible)
        spinSlots();
      }
    }
  });
}

// Update compact slots state based on usage
async function updateCompactSlotsState() {
  const container = document.getElementById("compactSlots");
  const dailySpinBtn = document.getElementById("dailySpinBtn");
  if (!container) return;

  const slots = [
    document.getElementById("slot1"),
    document.getElementById("slot2"),
    document.getElementById("slot3")
  ];
  const resultEl = document.getElementById("compactSlotsResult");
  const canSpin = await canSpinSlotsToday();

  if (!canSpin) {
    // Already spun today - grey out button, show results in slots
    if (dailySpinBtn) {
      dailySpinBtn.classList.add("used");
      dailySpinBtn.textContent = "Spin Used";
    }
    container.classList.add("used");

    const saved = loadSpinResults();
    if (saved && saved.reels) {
      slots.forEach((slot, i) => {
        if (slot && saved.reels[i]) {
          slot.textContent = saved.reels[i];
        }
      });
      if (resultEl) {
        if (saved.seedsWon > 0) {
          resultEl.textContent = `+${saved.seedsWon} Seed${saved.seedsWon > 1 ? 's' : ''}!`;
          resultEl.classList.add("win");
        } else {
          resultEl.textContent = "No match";
          resultEl.classList.add("loss");
        }
      }
    }
  } else {
    // Can spin - reset button and show question marks
    if (dailySpinBtn) {
      dailySpinBtn.classList.remove("used");
      dailySpinBtn.textContent = "Daily Spin";
    }
    container.classList.remove("used");

    slots.forEach((slot) => {
      if (slot) {
        slot.textContent = "?";
        slot.classList.remove("winner");
      }
    });
    if (resultEl) {
      resultEl.textContent = "";
      resultEl.classList.remove("win", "loss");
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
window.spinSlots = spinSlots;
window.setupDailySpinEventListeners = setupDailySpinEventListeners;
window.updateCompactSlotsState = updateCompactSlotsState;
