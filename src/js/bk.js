// Plant Class
class Plant {
  constructor() {
    // Initialize all the properties that were in the original plant object
    this.seedType = null;
    this.soilType = null;
    this.health = 100;
    this.water = 100;
    this.light = 100;
    this.nutrients = 100;
    this.stress = 0;
    this.growthStage = 0;
    this.growthTimer = null;
    this.stageTime = 0;
    this.totalGrowthTime = 0;
    this.harvestTimer = null;
    this.harvestTimeLeft = 24 * 60 * 60;
    this.potency = 100;
    this.weight = 0;
    this.healthSum = 0;
    this.healthTicks = 0;
    this.optimalLight = 100;
    this.pestPenalty = 1;
    this.raiderPenalty = 1;
    this.lightEfficiencySum = 0;
    this.lightEfficiencyTicks = 0;
    this.potencyBoost = 1;
    this.feedingSchedule = {
      sprout: { waterTimes: 0, nutrientMix: null },
      vegetative: { waterTimes: 0, nutrientMix: null },
      flowering: { waterTimes: 0, nutrientMix: null },
    };
    this.scoresRecorded = false;
    this.defenseType = null;
    this.frozenStats = undefined;

    // Additional properties found in the reset
    this.lastWaterTime = 0;
    this.lastFeedTime = 0;
    this.overWatered = false;
    this.overFed = false;
    this.overWateredTime = 0;
    this.overFedTime = 0;
    this.deathTicks = 0;

    // Stage-specific nutrient application flags
    this.sproutNutrientApplied = false;
    this.vegetativeNutrientApplied = false;
    this.floweringNutrientApplied = false;
  }

  reset() {
    this.seedType = null;
    this.soilType = null;
    this.health = 100;
    this.water = 100;
    this.light = Math.floor(Math.random() * 101);
    this.nutrients = 100;
    this.stress = 0;
    this.growthStage = 0;
    this.growthTimer = null;
    this.stageTime = 0;
    this.totalGrowthTime = 0;
    this.harvestTimer = null;
    this.harvestTimeLeft = 24 * 60 * 60;
    this.potency = 100;
    this.weight = 0;
    this.healthSum = 0;
    this.healthTicks = 0;
    this.optimalLight = 100;
    this.pestPenalty = 1;
    this.raiderPenalty = 1;
    this.lightEfficiencySum = 0;
    this.lightEfficiencyTicks = 0;
    this.potencyBoost = 1;
    this.feedingSchedule = {
      sprout: { waterTimes: 0, nutrientMix: null },
      vegetative: { waterTimes: 0, nutrientMix: null },
      flowering: { waterTimes: 0, nutrientMix: null },
    };
    this.lastWaterTime = 0;
    this.lastFeedTime = 0;
    this.overWatered = false;
    this.overFed = false;
    this.overWateredTime = 0;
    this.overFedTime = 0;
    this.scoresRecorded = false;
    this.frozenStats = undefined;
    this.defenseType = null;
    this.deathTicks = 0;
    this.sproutNutrientApplied = false;
    this.vegetativeNutrientApplied = false;
    this.floweringNutrientApplied = false;
  }
}

// Player Class - Wraps player/grower management
class Player {
  constructor() {
    this.name = null;
    this.highScores = {
      potency: [],
      yield: [],
      potencyHistory: {},
      totalYield: {},
      seedBank: {},
      seedLives: {},
    };
    this.totalYield = 0; // Synced value from leaderboard
  }

  // Initialize with a grower name
  setName(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  // Load player data from PlayFab
  async loadData() {
    if (!this.name) {
      throw new Error("Player name must be set before loading data");
    }

    try {
      this.highScores = await PlayFabService.loadHighScores();

      // Ensure all required properties exist
      if (!this.highScores.potency) this.highScores.potency = [];
      if (!this.highScores.yield) this.highScores.yield = [];
      if (!this.highScores.potencyHistory) this.highScores.potencyHistory = {};
      if (!this.highScores.totalYield) this.highScores.totalYield = {};
      if (!this.highScores.seedBank) this.highScores.seedBank = {};
      if (!this.highScores.seedLives) this.highScores.seedLives = {};

      // Load synced total yield from leaderboard
      const playerStats = await PlayFabService.getPlayerLeaderboardEntry(
        "TotalYield"
      );
      this.totalYield = playerStats ? playerStats.StatValue : 0;
    } catch (error) {
      // Handle authentication errors gracefully
      if (
        error &&
        (error.error === "NotAuthenticated" || error.errorCode === 1001)
      ) {
        console.warn("User not authenticated, using default scores");
      } else {
        console.error("Failed to load player data:", error);
      }
      // Keep default empty scores on error
    }
  }

  // Save player data to PlayFab
  async saveData() {
    try {
      await PlayFabService.saveHighScores(this.highScores);
    } catch (error) {
      if (
        error &&
        (error.error === "NotAuthenticated" || error.errorCode === 1001)
      ) {
        console.warn("User not authenticated, skipping save");
      } else {
        console.error("Failed to save player data:", error);
      }
    }
  }

  // Seed lives management
  getLives() {
    if (!this.name || !this.highScores.seedLives) return 0;
    return this.highScores.seedLives[this.name] || 0;
  }

  setLives(count) {
    if (!this.name) return;
    if (!this.highScores.seedLives) this.highScores.seedLives = {};
    this.highScores.seedLives[this.name] = count;
  }

  // Initialize lives for new player
  initializeLives(startingLives = GAME_CONFIG.SEED_LIVES_START) {
    if (!this.name) return;

    if (
      typeof this.highScores.seedLives[this.name] !== "number" ||
      this.highScores.seedLives[this.name] < 1
    ) {
      this.setLives(startingLives);
    }
  }

  // Add score and sync with PlayFab leaderboard
  async addScore(type, score, plantData) {
    if (!this.name) return;

    try {
      if (type === "potency") {
        await PlayFabService.appendToUserArray("potencyHistory", score);
        await PlayFabService.executeCloudScript("submitScore", {
          scoreType: "potency",
          scoreValue: score,
          gameState: plantData,
        });
      }

      if (type === "yield") {
        await PlayFabService.appendToUserArray("yieldHistory", score);
        const currentYieldHistory = await PlayFabService.getUserArray(
          "yieldHistory"
        );

        const result = await PlayFabService.executeCloudScript("submitScore", {
          scoreType: "yield",
          scoreValue: score,
          gameState: plantData,
          yieldHistory: currentYieldHistory,
        });

        // Handle new badges
        if (result.newBadges && result.newBadges.length > 0) {
          result.newBadges.forEach((badgeId) => {
            showBadgePopup(badgeId);
          });
        }

        // Update total yield leaderboard
        const totalYield = currentYieldHistory.reduce(
          (sum, s) => sum + (typeof s === "number" ? s : 0),
          0
        );
        await PlayFabService.executeCloudScript("submitScore", {
          scoreType: "TotalYield",
          scoreValue: totalYield,
          gameState: plantData,
          yieldHistory: currentYieldHistory,
        });

        // Update our synced total yield
        this.totalYield = totalYield;
      }

      await this.saveData();
    } catch (error) {
      console.error(
        "Cloud Script validation failed:",
        JSON.stringify(error, null, 2)
      );
      await this.saveData(); // Save locally even if PlayFab fails
    }
  }

  // Get total yield (for unlock calculations)
  getTotalYield() {
    return this.totalYield;
  }

  // Check if player is authenticated/logged in
  isLoggedIn() {
    return this.name !== null;
  }

  // Clear player data (for logout)
  clear() {
    this.name = null;
    this.highScores = {
      potency: [],
      yield: [],
      potencyHistory: {},
      totalYield: {},
      seedBank: {},
      seedLives: {},
    };
    this.totalYield = 0;
  }
}

// Initialize PlayFab
PlayFabService.initialize();

// --- Mobile Detection ---
function isMobileDevice() {
  // Enhanced mobile user agent detection
  const mobileUserAgents =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|FxiOS|EdgiOS/i;

  // More comprehensive touch detection
  const hasTouchScreen =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0 ||
    (window.DocumentTouch && document instanceof DocumentTouch);

  // Enhanced screen size detection for mobile
  const screenWidth = Math.max(
    window.innerWidth,
    window.outerWidth,
    screen.width
  );
  const screenHeight = Math.max(
    window.innerHeight,
    window.outerHeight,
    screen.height
  );
  const isSmallScreen = screenWidth <= 768 || screenHeight <= 600;

  // Check for mobile-specific features
  const isMobileUA = mobileUserAgents.test(navigator.userAgent);
  const isStandalone = window.navigator.standalone === true;

  // Check for mobile device indicators
  const isMobileDevice = /Mobi|Android/i.test(navigator.userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);

  // Enhanced detection: mobile if ANY of these conditions are true
  const isMobile =
    isMobileUA ||
    isMobileDevice ||
    isTablet ||
    isStandalone ||
    (hasTouchScreen && isSmallScreen) ||
    (hasTouchScreen && screenWidth < 1024); // Catch tablets too

  return isMobile;
}

function handleMobileOverlay() {
  const overlay = document.getElementById("mobile-overlay");
  const mainContainer = document.querySelector(".main-container");

  if (isMobileDevice()) {
    if (overlay) {
      overlay.classList.remove("hidden");
      overlay.style.display = "flex"; // Force display
    }
    if (mainContainer) {
      mainContainer.style.display = "none";
    }

    // Add continuous monitoring to prevent bypass
    startMobileProtection();
  } else {
    if (overlay) {
      overlay.classList.add("hidden");
      overlay.style.display = "none";
    }
    if (mainContainer) {
      mainContainer.style.display = ""; // Reset to default
    }

    // Stop monitoring on desktop
    stopMobileProtection();
  }
}

// Mobile protection system
let mobileProtectionInterval = null;

function startMobileProtection() {
  // Clear any existing interval
  if (mobileProtectionInterval) {
    clearInterval(mobileProtectionInterval);
  }

  // Check every 100ms to ensure mobile overlay stays active
  mobileProtectionInterval = setInterval(() => {
    if (isMobileDevice()) {
      const overlay = document.getElementById("mobile-overlay");
      const mainContainer = document.querySelector(".main-container");

      // Force overlay to stay visible
      if (
        overlay &&
        (overlay.style.display === "none" ||
          overlay.classList.contains("hidden"))
      ) {
        overlay.style.display = "flex";
        overlay.classList.remove("hidden");
      }

      // Force main container to stay hidden
      if (mainContainer && mainContainer.style.display !== "none") {
        mainContainer.style.display = "none";
      }

      // If overlay element is deleted, recreate it
      if (!overlay) {
        recreateMobileOverlay();
      }

      // Additional protection: hide all game content elements
      hideAllGameContent();
    }
  }, 100);
}

function stopMobileProtection() {
  if (mobileProtectionInterval) {
    clearInterval(mobileProtectionInterval);
    mobileProtectionInterval = null;
  }
}

function recreateMobileOverlay() {
  // Remove any existing overlay first
  const existingOverlay = document.getElementById("mobile-overlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }

  // Create new overlay
  const overlay = document.createElement("div");
  overlay.id = "mobile-overlay";
  overlay.innerHTML = `
    <div class="mobile-overlay-message">
      <h2>Desktop Only</h2>
      <p>This game is optimized for desktop computers. Please use a larger screen to play.</p>
    </div>
  `;

  document.body.appendChild(overlay);
}

function hideAllGameContent() {
  // List of all game content elements that should be hidden on mobile
  const gameElements = [
    ".main-container",
    ".game-container",
    ".selection-screen",
    ".plant-hud",
    ".high-scores-hud",
    "#gameContainer",
    ".main-game-area",
    ".game-layout",
  ];

  gameElements.forEach((selector) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      if (element.style.display !== "none") {
        element.style.display = "none";
      }
    });
  });
}

// Run mobile check on load and on resize for dynamic adjustments
document.addEventListener("DOMContentLoaded", handleMobileOverlay);
window.addEventListener("resize", handleMobileOverlay);

// Additional protection against developer tools manipulation
document.addEventListener("DOMContentLoaded", () => {
  // Prevent right-click context menu on mobile
  document.addEventListener("contextmenu", (e) => {
    if (isMobileDevice()) {
      e.preventDefault();
      return false;
    }
  });

  // Monitor for DOM changes that might hide the overlay
  const observer = new MutationObserver((mutations) => {
    if (isMobileDevice()) {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          const overlay = document.getElementById("mobile-overlay");
          if (
            overlay &&
            (overlay.style.display === "none" ||
              overlay.classList.contains("hidden"))
          ) {
            overlay.style.display = "flex";
            overlay.classList.remove("hidden");
          }
        }
      });
    }
  });

  // Start observing the document
  observer.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
  });
});

// Manual test functions for debugging (remove in production)
function testMobileOverlay() {
  const overlay = document.getElementById("mobile-overlay");
  const mainContainer = document.querySelector(".main-container");

  if (overlay) {
    overlay.classList.remove("hidden");
    overlay.style.display = "flex";
  }
  if (mainContainer) {
    mainContainer.style.display = "none";
  }
}

function hideMobileOverlay() {
  const overlay = document.getElementById("mobile-overlay");
  const mainContainer = document.querySelector(".main-container");

  if (overlay) {
    overlay.classList.add("hidden");
    overlay.style.display = "none";
  }
  if (mainContainer) {
    mainContainer.style.display = "";
  }
}

// Add test functions to window for console access
window.testMobileOverlay = testMobileOverlay;
window.hideMobileOverlay = hideMobileOverlay;
window.checkMobileDetection = isMobileDevice;

// High score management
let currentGrower = new Player();
console.log("Player object initialized:", currentGrower);
let currentPlayerTotalYield = 0; // New variable for synced total yield
let highScores = {
  potency: [],
  yield: [],
  potencyHistory: {},
  totalYield: {},
  seedBank: {},
  seedLives: {},
};

// Load high scores from PlayFab
async function loadHighScores() {
  try {
    highScores = await PlayFabService.loadHighScores();
    if (!highScores.potency) highScores.potency = [];
    if (!highScores.yield) highScores.yield = [];
    if (!highScores.potencyHistory) highScores.potencyHistory = {};
    if (!highScores.totalYield) highScores.totalYield = {};
    if (!highScores.seedBank) highScores.seedBank = {};
    if (!highScores.seedLives) highScores.seedLives = {};
    updateHighScoresDisplay();
    updatePersistentSeedCount();
  } catch (error) {
    // If it's an authentication error, just log a warning and use default scores
    if (
      error &&
      (error.error === "NotAuthenticated" || error.errorCode === 1001)
    ) {
      console.warn("User not authenticated, using default high scores");
    } else {
      console.error("Failed to load high scores:", error);
    }
    // Fallback to empty scores
    highScores = {
      potency: [],
      yield: [],
      potencyHistory: {},
      totalYield: {},
      seedBank: {},
      seedLives: {},
    };
    updateHighScoresDisplay();
    updatePersistentSeedCount();
  }
}

// Save high scores to PlayFab
async function saveHighScores() {
  try {
    await PlayFabService.saveHighScores(highScores);
  } catch (error) {
    // If it's an authentication error, just log a warning instead of error
    if (
      error &&
      (error.error === "NotAuthenticated" || error.errorCode === 1001)
    ) {
      // User not authenticated, skipping PlayFab save
    } else {
      // Failed to save high scores
    }
  }
}

// Update high scores display
function updateHighScoresDisplay() {
  ViewService.updateHighScoresDisplay(highScores, currentGrower);
  updateSeedBankSelectionDisplay();
}

function showBadgePopup(badgeId) {
  alert(`Congratulations! You've earned a new badge: ${badgeId}`);
}

// Add a new score
async function addScore(type, score, plantData) {
  if (!currentGrower) return;

  try {
    if (type === "potency") {
      // Track all potency scores for this grower in PlayFab user data
      await PlayFabService.appendToUserArray("potencyHistory", score);
      // Update leaderboard via Cloud Script validation
      await PlayFabService.executeCloudScript("submitScore", {
        scoreType: "potency",
        scoreValue: score,
        gameState: plantData, // Include the plant data directly
      });
    }
    if (type === "yield") {
      // Track all yield scores for this grower in PlayFab user data
      await PlayFabService.appendToUserArray("yieldHistory", score);
      // After calling appendToUserArray
      const currentYieldHistory = await PlayFabService.getUserArray(
        "yieldHistory"
      );
      // Update leaderboard via Cloud Script validation
      const result = await PlayFabService.executeCloudScript("submitScore", {
        scoreType: "yield",
        scoreValue: score,
        gameState: plantData, // Include the plant data directly
        yieldHistory: currentYieldHistory, // Include this
      });

      if (result.newBadges && result.newBadges.length > 0) {
        result.newBadges.forEach((badgeId) => {
          showBadgePopup(badgeId); // You need to create this function
        });
      }

      // Calculate total yield and update dedicated leaderboard
      const yieldArr = await PlayFabService.getUserArray("yieldHistory");
      const totalYield = yieldArr.reduce(
        (sum, s) => sum + (typeof s === "number" ? s : 0),
        0
      );
      await PlayFabService.executeCloudScript("submitScore", {
        scoreType: "TotalYield",
        scoreValue: totalYield,
        gameState: plantData, // Include the plant data directly
        yieldHistory: yieldArr, // Pass the calculated array
      });
    }
    await saveHighScores();
  } catch (error) {
    console.error(
      "Cloud Script validation failed:",
      JSON.stringify(error, null, 2)
    );
    // Continue with local save even if PlayFab fails
    await saveHighScores();
  }
  updateHighScoresDisplay();
  await loadAndDisplayGlobalLeaderboardsPanel();
}

// --- Seed Lives System ---
// getLivesForPlayer function removed - now using currentGrower.getLives()

// setLivesForPlayer function removed - now using currentGrower.setLives(val); currentGrower.saveData();

// --- Seed Lockout (now async, uses PlayFab) ---
async function setSeedLockoutTimestamp() {
  if (currentGrower)
    await PlayFabService.setSeedLockoutTimestamp(currentGrower.getName());
}

async function getSeedLockoutTimestamp() {
  if (currentGrower)
    return await PlayFabService.getSeedLockoutTimestamp(
      currentGrower.getName()
    );
  return 0;
}

async function clearSeedLockoutTimestamp() {
  if (currentGrower.getName())
    await PlayFabService.clearSeedLockoutTimestamp(currentGrower.getName());
}

// Updated canStartGame to async
async function canStartGame() {
  // If player has any lives, can play
  if (currentGrower.getLives() > 0) return true;
  // If not, check lockout
  const lastLock = await getSeedLockoutTimestamp();
  if (!lastLock) return false;
  const now = Date.now();
  if (now - lastLock >= GAME_CONFIG.SEED_LOCKOUT_HOURS * 60 * 60 * 1000) {
    // 24 hours passed, reset lives
    currentGrower.setLives(GAME_CONFIG.SEED_LIVES_START);
    currentGrower.saveData();
    await clearSeedLockoutTimestamp();
    return true;
  }
  return false;
}

// Updated getSeedLockoutTimeLeft to async
async function getSeedLockoutTimeLeft() {
  const lastLock = await getSeedLockoutTimestamp();
  if (!lastLock) return 0;
  const now = Date.now();
  const msLeft =
    GAME_CONFIG.SEED_LOCKOUT_HOURS * 60 * 60 * 1000 - (now - lastLock);
  return msLeft > 0 ? msLeft : 0;
}

// Update checkSeedLockoutUI to use async canStartGame/getSeedLockoutTimeLeft
async function checkSeedLockoutUI() {
  const startButton = document.getElementById("startGameBtn");
  const lockoutMsgId = "seedLockoutMsg";
  let lockoutMsg = document.getElementById(lockoutMsgId);
  if (!(await canStartGame())) {
    // Show lockout message
    if (!lockoutMsg) {
      lockoutMsg = document.createElement("div");
      lockoutMsg.id = lockoutMsgId;
      lockoutMsg.style.color = "#ffd700";
      lockoutMsg.style.fontFamily = '"Press Start 2P", monospace';
      lockoutMsg.style.fontSize = "1em";
      lockoutMsg.style.margin = "18px 0 0 0";
      lockoutMsg.style.textAlign = "center";
      document.getElementById("selectionScreen").appendChild(lockoutMsg);
    }
    const msLeft = await getSeedLockoutTimeLeft();
    const hours = Math.floor(msLeft / 3600000);
    const minutes = Math.floor((msLeft % 3600000) / 60000);
    const seconds = Math.floor((msLeft % 60000) / 1000);
    lockoutMsg.textContent = `Out of seeds! Come back in ${hours}h ${minutes}m ${seconds}s for more.`;
    startButton.disabled = true;
    // Update countdown every second
    if (!lockoutMsg._interval) {
      lockoutMsg._interval = setInterval(async () => {
        if (await canStartGame()) {
          clearInterval(lockoutMsg._interval);
          lockoutMsg.remove();
          updateStartButton();
        } else {
          const msLeft = await getSeedLockoutTimeLeft();
          const hours = Math.floor(msLeft / 3600000);
          const minutes = Math.floor((msLeft % 3600000) / 60000);
          const seconds = Math.floor((msLeft % 60000) / 1000);
          lockoutMsg.textContent = `Out of seeds! Come back in ${hours}h ${minutes}m ${seconds}s for more.`;
        }
      }, 1000);
    }
  } else {
    // Remove lockout message if present
    if (lockoutMsg) {
      if (lockoutMsg._interval) clearInterval(lockoutMsg._interval);
      lockoutMsg.remove();
    }
    updateStartButton();
  }
}

// Add rate limiting for login attempts
const loginAttempts = {
  count: 0,
  lastAttempt: 0,
  maxAttempts: 5,
  lockoutDuration: 300000, // 5 minutes in milliseconds
  isLoggingIn: false, // Add flag to prevent multiple simultaneous logins
  reset() {
    this.count = 0;
    this.lastAttempt = 0;
    this.isLoggingIn = false;
  },
};

// Initialize password reset functionality
function initializePasswordReset() {
  const nameInputScreen = document.getElementById("nameInputScreen");
  const resetPasswordScreen = document.getElementById("resetPasswordScreen");
  const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
  const backToLoginBtn = document.getElementById("backToLoginBtn");
  const resetNameInput = document.getElementById("resetNameInput");
  const securityQuestionDisplay = document.getElementById(
    "securityQuestionDisplay"
  );
  const resetSecurityAnswerInput = document.getElementById(
    "resetSecurityAnswerInput"
  );
  const resetNewPasswordInput = document.getElementById(
    "resetNewPasswordInput"
  );
  const resetConfirmPasswordInput = document.getElementById(
    "resetConfirmPasswordInput"
  );
  const resetPasswordBtn = document.getElementById("resetPasswordBtn");

  // Populate security questions dropdown
  const securityQuestionSelect = document.getElementById(
    "securityQuestionSelect"
  );
  PlayFabService.securityQuestions.forEach((question) => {
    const option = document.createElement("option");
    option.value = question;
    option.textContent = question;
    securityQuestionSelect.appendChild(option);
  });

  // Show reset password screen
  forgotPasswordBtn.addEventListener("click", () => {
    nameInputScreen.classList.add("hidden");
    resetPasswordScreen.classList.remove("hidden");
  });

  // Back to login
  backToLoginBtn.addEventListener("click", () => {
    resetPasswordScreen.classList.add("hidden");
    nameInputScreen.classList.remove("hidden");
    // Reset all fields
    resetNameInput.value = "";
    securityQuestionDisplay.textContent = "";
    resetSecurityAnswerInput.value = "";
    resetNewPasswordInput.value = "";
    resetConfirmPasswordInput.value = "";
    securityQuestionDisplay.classList.add("hidden");
    resetSecurityAnswerInput.classList.add("hidden");
    resetNewPasswordInput.classList.add("hidden");
    resetConfirmPasswordInput.classList.add("hidden");
  });

  // Handle reset password flow
  resetNameInput.addEventListener("blur", async () => {
    const name = resetNameInput.value.trim();
    if (name) {
      try {
        const question = await PlayFabService.getSecurityQuestion(name);
        securityQuestionDisplay.textContent = question;
        securityQuestionDisplay.classList.remove("hidden");
        resetSecurityAnswerInput.classList.remove("hidden");
        // Show new password fields after question is loaded
        resetNewPasswordInput.classList.remove("hidden");
        resetConfirmPasswordInput.classList.remove("hidden");
      } catch (error) {
        alert(error.message);
      }
    }
  });

  resetPasswordBtn.addEventListener("click", async () => {
    const name = resetNameInput.value.trim();
    const securityAnswer = resetSecurityAnswerInput.value.trim();
    const newPassword = resetNewPasswordInput.value.trim();
    const confirmPassword = resetConfirmPasswordInput.value.trim();

    if (
      !name ||
      securityQuestionDisplay.classList.contains("hidden") ||
      resetSecurityAnswerInput.classList.contains("hidden") ||
      resetNewPasswordInput.classList.contains("hidden") ||
      resetConfirmPasswordInput.classList.contains("hidden") ||
      !securityAnswer ||
      !newPassword ||
      !confirmPassword
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    resetPasswordBtn.disabled = true;
    try {
      await PlayFabService.resetPassword(name, securityAnswer, newPassword);
      alert("Password reset successful!");
      backToLoginBtn.click();
    } catch (error) {
      if (error && error.code === 409) {
        alert(
          "Please wait, your previous request is still processing. Try again in a few seconds."
        );
      } else {
        alert(error.message || "Failed to reset password. Please try again.");
      }
    } finally {
      resetPasswordBtn.disabled = false;
    }
  });
}

// Update the registration process in initializeNameInput
async function initializeNameInput() {
  const nameInput = document.getElementById("growerNameInput");
  const passwordInput = document.getElementById("growerPasswordInput");
  const confirmPasswordInput = document.getElementById(
    "growerConfirmPasswordInput"
  );
  const securityQuestionSelect = document.getElementById(
    "securityQuestionSelect"
  );
  const securityAnswerInput = document.getElementById("securityAnswerInput");
  const confirmBtn = document.getElementById("confirmNameBtn");
  const toggleRegisterBtn = document.getElementById("toggleRegisterBtn");
  const nameInputScreen = document.getElementById("nameInputScreen");
  const selectionScreen = document.getElementById("selectionScreen");

  const updateButtonState = () => {
    const name = nameInput.value.trim();
    const password = passwordInput.value.trim();
    if (name && password) {
      confirmBtn.classList.add("enabled");
    } else {
      confirmBtn.classList.remove("enabled");
    }
  };

  nameInput.addEventListener("input", updateButtonState);
  passwordInput.addEventListener("input", updateButtonState);

  let isRegistering = false;

  toggleRegisterBtn.addEventListener("click", () => {
    isRegistering = !isRegistering;
    if (isRegistering) {
      confirmPasswordInput.classList.remove("hidden");
      securityQuestionSelect.classList.remove("hidden");
      securityAnswerInput.classList.remove("hidden");
    } else {
      confirmPasswordInput.classList.add("hidden");
      securityQuestionSelect.classList.add("hidden");
      securityAnswerInput.classList.add("hidden");
    }
    confirmBtn.textContent = isRegistering ? "Register" : "Login";
    toggleRegisterBtn.textContent = isRegistering
      ? "Back to Login"
      : "New Grower";
  });

  confirmBtn.addEventListener("click", async () => {
    const name = nameInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const securityQuestion = securityQuestionSelect.value;
    const securityAnswer = securityAnswerInput.value.trim();

    if (!name || !password) {
      alert("Please enter both name and password");
      return;
    }

    if (loginAttempts.isLoggingIn) {
      confirmBtn.textContent = "Login";
      confirmBtn.classList.add("loading-dots");
      return;
    }

    const now = Date.now();
    if (loginAttempts.count >= loginAttempts.maxAttempts) {
      const timeLeft = Math.ceil(
        (loginAttempts.lockoutDuration - (now - loginAttempts.lastAttempt)) /
          1000
      );
      if (timeLeft > 0) {
        alert(
          `Too many failed attempts. Please try again in ${timeLeft} seconds.`
        );
        return;
      } else {
        loginAttempts.reset();
      }
    }

    confirmBtn.disabled = true;
    loginAttempts.isLoggingIn = true;
    confirmBtn.textContent = "Login";
    confirmBtn.classList.add("loading-dots");

    if (isRegistering) {
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        confirmBtn.disabled = false;
        loginAttempts.isLoggingIn = false;
        confirmBtn.textContent = "Login";
        confirmBtn.classList.remove("loading-dots");
        return;
      }
      if (!securityQuestion || !securityAnswer) {
        alert("Please select a security question and provide an answer");
        confirmBtn.disabled = false;
        loginAttempts.isLoggingIn = false;
        confirmBtn.textContent = "Login";
        confirmBtn.classList.remove("loading-dots");
        return;
      }
      try {
        const exists = await PlayFabService.checkUserExists(name);
        if (exists) {
          alert("Username already taken");
          confirmBtn.disabled = false;
          loginAttempts.isLoggingIn = false;
          confirmBtn.textContent = "Login";
          confirmBtn.classList.remove("loading-dots");
          return;
        }
        await PlayFabService.register(
          name,
          password,
          securityQuestion,
          securityAnswer
        );
        loginAttempts.reset();
      } catch (error) {
        if (error && error.code === 409) {
          alert(
            "Please wait, your previous request is still processing. Try again in a few seconds."
          );
        } else {
          alert(error.message || "Failed to register. Please try again.");
        }
        confirmBtn.disabled = false;
        loginAttempts.isLoggingIn = false;
        confirmBtn.textContent = "Login";
        confirmBtn.classList.remove("loading-dots");
        return;
      }
    } else {
      try {
        await PlayFabService.login(name, password);
        loginAttempts.reset();
      } catch (error) {
        if (error && error.code === 409) {
          alert(
            "Please wait, your previous request is still processing. Try again in a few seconds."
          );
        } else if (error && error.message === "Invalid password") {
          alert("Invalid username or password");
        } else {
          alert(error.message || "Login failed. Please try again.");
        }
        loginAttempts.count++;
        loginAttempts.lastAttempt = now;
        confirmBtn.disabled = false;
        loginAttempts.isLoggingIn = false;
        confirmBtn.textContent = "Login";
        confirmBtn.classList.remove("loading-dots");
        return;
      }
    }

    try {
      await PlayFabService.setDisplayName(name);
      currentGrower.setName(name);
      PlayFabService.saveSession(name); // Save session after successful login
      document.getElementById("growerName").textContent = `Grower: ${name}`;
      updateUserDisplay(name); // Update user display in leaderboard

      await loadHighScores();
      await loadAndDisplayGlobalLeaderboardsPanel();

      if (!highScores.seedLives) highScores.seedLives = {};
      if (
        typeof highScores.seedLives[currentGrower] !== "number" ||
        highScores.seedLives[currentGrower] < 1
      ) {
        const lastLock = await getSeedLockoutTimestamp();
        const now = Date.now();
        if (
          !lastLock &&
          (!highScores.seedLives[currentGrower] ||
            highScores.seedLives[currentGrower] < 1)
        ) {
          currentGrower.setLives(GAME_CONFIG.SEED_LIVES_START);
          currentGrower.saveData();
          await saveHighScores();
        } else if (
          lastLock &&
          now - lastLock >= GAME_CONFIG.SEED_LOCKOUT_HOURS * 60 * 60 * 1000
        ) {
          currentGrower.setLives(GAME_CONFIG.SEED_LIVES_START);
          currentGrower.saveData();
          await clearSeedLockoutTimestamp();
          await saveHighScores();
        }
      }

      nameInputScreen.classList.add("hidden");
      selectionScreen.classList.remove("hidden");
      checkSeedLockoutUI();
      updateHighScoresDisplay();

      setTimeout(async function () {
        if (await canSpinSlotsToday()) showSlotsModal();
      }, 400);
    } catch (error) {
      alert("Failed to initialize player. Please try again.");
    } finally {
      confirmBtn.disabled = false;
      loginAttempts.isLoggingIn = false;
      confirmBtn.textContent = "Login";
      confirmBtn.classList.remove("loading-dots");
    }
  });

  nameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      confirmBtn.click();
    }
  });
}

initializeNameInput();
initializePasswordReset();

var startButton = document.getElementById("startGameBtn");
startButton.addEventListener("click", async function () {
  if (plant.seedType && plant.soilType) {
    if (currentGrower.getLives() > 0) {
      currentGrower.setLives(currentGrower.getLives() - 1);
      await currentGrower.saveData();
      updatePersistentSeedCount();
      checkSeedLockoutUI();
      startGame();
      if (currentGrower.getLives() === 0) {
        setSeedLockoutTimestamp();
      }
    } else {
      checkSeedLockoutUI();
    }
  }
});

// Game state
var plant = new Plant();

var growthStages = [
  {
    name: "Sprout",
    time: Math.round(40 * 0.8),
    frames: 2,
    imagePrefix: "bloom",
    frameOffset: 0,
  },
  {
    name: "Vegetative",
    time: Math.round(60 * 0.8),
    frames: 2,
    imagePrefix: "bloom",
    frameOffset: 2,
  },
  {
    name: "Flowering",
    time: Math.round(80 * 0.8),
    frames: 4,
    imagePrefix: "bloom",
    frameOffset: 4,
  },
  { name: "Harvest", time: 0, image: "harvest.png" },
];

var pestActive = false;
var raiderActive = false;
var nutrientActive = false;
let growthTimerInterval = 500;

function startGrowthTimer() {
  if (plant.growthTimer) {
    clearInterval(plant.growthTimer);
  }
  let feedingTick = 0;
  plant.growthTimer = setInterval(function () {
    if (plant.seedType && plant.soilType) {
      const soil = soilTypes[plant.soilType];
      const waterDrain = soil.waterDrain;
      const nutrientDrain = 0.5;
      plant.water = Math.max(0, plant.water - waterDrain);
      plant.nutrients = Math.max(0, plant.nutrients - nutrientDrain);
    }

    feedingTick++;
    const stageKey =
      ["sprout", "vegetative", "flowering"][plant.growthStage] || "flowering";
    const schedule = plant.feedingSchedule[stageKey];
    if (schedule && schedule.waterTimes > 0) {
      const feedInterval = Math.max(
        1,
        Math.floor(growthStages[plant.growthStage].time / schedule.waterTimes)
      );
      if (feedingTick % feedInterval === 0) {
        plant.water = Math.min(100, plant.water + 20);
        let nuteAmount = 15;
        if (schedule.nutrientMix && nutrientMixes[schedule.nutrientMix]) {
          nuteAmount = nutrientMixes[schedule.nutrientMix].nutrientFeed;
        }
        plant.nutrients = Math.min(100, plant.nutrients + nuteAmount);
        if (schedule.nutrientMix && nutrientMixes[schedule.nutrientMix]) {
          if (!plant[stageKey + "NutrientApplied"]) {
            plant.potencyBoost *= nutrientMixes[schedule.nutrientMix].potency;
            plant.weight *= nutrientMixes[schedule.nutrientMix].yield;
            plant[stageKey + "NutrientApplied"] = true;
          }
        }
      }
    }

    updatePlantStatus();
    plant.healthSum += plant.health;
    plant.healthTicks++;

    var maxDiff = 100;
    var diff = Math.abs(plant.light - plant.optimalLight);
    var efficiency = Math.max(0, 1 - diff / maxDiff);
    plant.lightEfficiencySum += efficiency;
    plant.lightEfficiencyTicks++;

    maybeTriggerEvent();

    if (plant.stageTime >= growthStages[plant.growthStage].time) {
      plant[stageKey + "NutrientApplied"] = false;
      feedingTick = 0;
      advanceGrowthStage();
    }
    plant.stageTime++;
    updatePlantDisplay();
  }, growthTimerInterval);
  console.log("GROWTH TIMER STARTED, interval:", growthTimerInterval);
}

function advanceGrowthStage() {
  if (plant.growthStage < growthStages.length - 1) {
    plant.growthStage++;
    plant.stageTime = 0;
    if (plant.growthStage < growthStages.length - 1) {
      plant.optimalLight = Math.floor(Math.random() * 61) + 30;
    }
    updatePlantDisplay();
  } else {
    clearInterval(plant.growthTimer);
    plant.frozenStats = {
      healthSum: plant.healthSum,
      healthTicks: plant.healthTicks,
      lightEfficiencySum: plant.lightEfficiencySum,
      lightEfficiencyTicks: plant.lightEfficiencyTicks,
      pestPenalty: plant.pestPenalty,
      raiderPenalty: plant.raiderPenalty,
      potencyBoost: plant.potencyBoost,
      weight: plant.weight,
      potency: plant.potency,
    };
    plant.scoresRecorded = false;
    autoHarvestPlant();
  }
}

function autoHarvestPlant() {
  let stats = plant.frozenStats || plant;
  let avgHealth =
    stats.healthTicks > 0 ? stats.healthSum / stats.healthTicks / 100 : 1;
  let avgLightEfficiency =
    stats.lightEfficiencyTicks > 0
      ? stats.lightEfficiencySum / stats.lightEfficiencyTicks
      : 1;

  let basePotency = 15 + Math.random() * 10;

  let finalPotencyRaw =
    basePotency * stats.potencyBoost * stats.pestPenalty * avgLightEfficiency;
  console.log("Potency calc:", {
    basePotency,
    potencyBoost: stats.potencyBoost,
    pestPenalty: stats.pestPenalty,
    avgLightEfficiency,
  });
  let baseYield = 1 + Math.random() * 99;
  let lightBonus = lightSources[currentLight]?.yieldBonus || 1.0;
  let finalWeightRaw =
    baseYield *
    avgHealth *
    stats.raiderPenalty *
    lightBonus *
    avgLightEfficiency;

  let finalPotency = Math.round(finalPotencyRaw);
  let finalWeight = Math.round(finalWeightRaw);

  finalPotency = Math.max(0, Math.min(70, finalPotency));
  finalWeight = Math.max(1, Math.min(100, finalWeight));

  // Update frozenStats with the calculated final values before passing to Cloud Script
  if (plant.frozenStats) {
    plant.frozenStats.weight = finalWeight;
    plant.frozenStats.potency = finalPotency;
  }

  if (
    !plant.scoresRecorded &&
    finalPotency !== null &&
    finalWeight !== null &&
    plant.frozenStats
  ) {
    console.log("Final scores:", {
      potency: finalPotency,
      yield: finalWeight,
      frozenStats: plant.frozenStats,
    });
    addScore("potency", finalPotency, plant);
    addScore("yield", finalWeight, plant);
    checkAndUnlockLights();
    plant.scoresRecorded = true;
  }
  showHarvestResults(finalPotency, finalWeight);
}
function updatePlantStatus() {
  const lightDiff = Math.abs(plant.light - plant.optimalLight);

  if (lightDiff > 35) {
    plant.stress = Math.min(100, plant.stress + 0.5);
  } else {
    plant.stress = Math.max(0, plant.stress - 1);
  }

  if (plant.water <= 0 || plant.nutrients <= 0) {
    plant.stress = Math.min(100, plant.stress + 1);
  } else if (plant.water < 30 || plant.nutrients < 30) {
    plant.stress = Math.min(100, plant.stress + 0.5);
  } else if (plant.water > 95 || plant.nutrients > 95) {
    plant.stress = Math.min(100, plant.stress + 0.5);
  } else {
    plant.stress = Math.max(0, plant.stress - 0.5);
  }

  let healthPenalty = 0;
  if (plant.water < 30 || plant.water > 95) healthPenalty = 0.5;
  if (plant.nutrients < 30 || plant.nutrients > 95) healthPenalty = 0.5;
  if (lightDiff > 35) healthPenalty = 0.5;
  if (plant.stress > 80) healthPenalty = 0.5;

  plant.health -= healthPenalty;
  plant.health = Math.max(0, Math.min(100, plant.health));

  if (plant.health <= 0) {
    plant.deathTicks = (plant.deathTicks || 0) + 1;
    if (plant.deathTicks >= 3) {
      gameOver();
      return;
    }
  } else {
    plant.deathTicks = 0;
  }

  ViewService.updatePlantStatus(plant);
}

function updateResourceDisplay() {
  ViewService.updateResourceDisplay({
    water: plant.water,
    light: plant.light,
    nutrients: plant.nutrients,
    stress: plant.stress,
  });
}

function updatePlantDisplay() {
  const seedNames = {};
  Object.keys(seedProperties).forEach((key) => {
    seedNames[key] = seedProperties[key].name;
  });
  var topStatusHud = document.getElementById("topStatusHud");
  if (topStatusHud && plant.seedType) {
    // New: Side-by-side columns for strain, stage, health, with labels above
    const strainName = seedNames[plant.seedType] || plant.seedType;
    // Map stage names to short forms
    const stageMap = {
      Sprout: "SPROUT",
      Vegetative: "VEG",
      Flowering: "FLOWER",
      Harvest: "HARVEST",
    };
    const stageName =
      stageMap[growthStages[plant.growthStage].name] ||
      growthStages[plant.growthStage].name.toUpperCase();
    const healthVal = Math.round(plant.health);
    topStatusHud.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: stretch; width: 100%;">
        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: flex-end; gap: 32px; font-size: 0.7em; font-family: 'Press Start 2P', monospace; color: #bfcfff; opacity: 0.7; letter-spacing: 1px; text-align: center;">
          <div style='flex:1; min-width: 0; text-align: left;'>STRAIN</div>
          <div style='flex:1; min-width: 0; text-align: center;'>STAGE</div>
          <div style='flex:1; min-width: 0; text-align: right;'>HEALTH</div>
        </div>
        <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: flex-start; gap: 32px; font-size: 0.6em; font-family: 'Press Start 2P', monospace; color: #bfcfff; text-align: center; margin-top: 4px;">
          <div style='flex:1; min-width: 0; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'>${strainName}</div>
          <div style='flex:1; min-width: 0; text-align: center;'>${stageName}</div>
          <div style='flex:1; min-width: 0; text-align: right;'>${healthVal}%</div>
        </div>
      </div>
    `;
  }

  var plantStageImage = document.getElementById("plantStageImage");
  if (plantStageImage) {
    const stage = growthStages[plant.growthStage];
    const cacheBuster = `?v=${new Date().getTime()}`;
    let imagePath;

    if (stage.frames && stage.imagePrefix) {
      const progress = plant.stageTime / stage.time;
      const currentFrameInStage = Math.min(
        stage.frames - 1,
        Math.floor(progress * stage.frames)
      );
      const frameNumber = (stage.frameOffset || 0) + currentFrameInStage + 1;
      imagePath = `img/stages/${stage.imagePrefix}${frameNumber}.png`;
    } else {
      imagePath = `img/stages/${stage.image}`;
    }

    plantStageImage.src = imagePath + cacheBuster;
  }

  const seedSquare = document.getElementById("seedSquare");
  const soilSquare = document.getElementById("soilSquare");
  const defenseSquare = document.getElementById("defenseSquare");
  const lightSquare = document.getElementById("lightSquare");

  if (seedSquare) {
    if (plant.seedType && seedProperties[plant.seedType]) {
      seedSquare.innerHTML = `<img src="img/selections/${
        seedProperties[plant.seedType].image
      }" alt="${seedProperties[plant.seedType].name}" />`;
    } else {
      seedSquare.innerHTML = "";
    }
  }
  if (soilSquare) {
    if (plant.soilType && soilTypes[plant.soilType]) {
      let soilImg = `soil1.png`;
      if (plant.soilType === "graveblend") soilImg = "soil2.png";
      if (plant.soilType === "marrowmoss") soilImg = "soil3.png";
      soilSquare.innerHTML = `<img src="img/selections/${soilImg}" alt="Soil" />`;
    } else {
      soilSquare.innerHTML = "";
    }
  }
  if (defenseSquare) {
    if (plant.defenseType) {
      let defenseImg = `defense/${plant.defenseType}.png`;
      defenseSquare.innerHTML = `<img src="img/selections/${defenseImg}" alt="Defense" />`;
    } else {
      defenseSquare.innerHTML = "";
    }
  }
  // Light square: show current unlocked light image (not selectable)
  if (lightSquare) {
    // Map currentLight to image index (1-5)
    const lightKeyToIndex = {
      candle: 1,
      desk: 2,
      grow: 3,
      plasma: 4,
      quantum: 5,
    };
    const idx = lightKeyToIndex[currentLight] || 1;
    const lightImg = `light/light${idx}.png`;
    lightSquare.innerHTML = `<img src="img/selections/${lightImg}" alt="Light" />`;
  }

  const waterLevel = document.getElementById("waterLevel");
  const lightLevel = document.getElementById("lightLevel");
  const nutrientLevel = document.getElementById("nutrientLevel");
  const stressLevel = document.getElementById("stressLevel");

  if (waterLevel) {
    waterLevel.style.width = plant.water + "%";
  }
  if (lightLevel) {
    var maxDiff = 100;
    var diff = Math.abs(plant.light - plant.optimalLight);
    var efficiency = Math.max(0, 100 - (diff / maxDiff) * 100);
    lightLevel.style.width = efficiency + "%";
  }
  if (nutrientLevel) {
    nutrientLevel.style.width = plant.nutrients + "%";
  }
  if (stressLevel) {
    stressLevel.style.width = plant.stress + "%";
    function lerpColor(a, b, t) {
      const ah = a.match(/\w\w/g).map((x) => parseInt(x, 16));
      const bh = b.match(/\w\w/g).map((x) => parseInt(x, 16));
      const rh = ah.map((v, i) => Math.round(v + (bh[i] - v) * t));
      return `#${rh.map((x) => x.toString(16).padStart(2, "0")).join("")}`;
    }
    const base = "23232b";
    const red = "ff1744";
    const t = Math.max(0, Math.min(1, plant.stress / 100));
    const color = lerpColor(base, red, t);
    stressLevel.style.setProperty("--stress-color", color);
  }

  // Update growth progress bar
  var elapsed = 0;
  for (var i = 0; i < plant.growthStage; i++) {
    elapsed += growthStages[i].time;
  }
  elapsed += plant.stageTime;
  var percent = Math.min(
    100,
    Math.round((elapsed / plant.totalGrowthTime) * 100)
  );
  document.getElementById("growthProgress").style.width = percent + "%";

  // Render light source selection and purchase UI
  renderLightSourceUI();
}

// Add new harvest-related functions
function showHarvestWindow() {
  document.getElementById("harvestWindow").classList.remove("hidden");
  startHarvestTimer();
  // Calculate final scores for display only
  let stats = plant.frozenStats || plant;
  let avgHealth =
    stats.healthTicks > 0 ? stats.healthSum / stats.healthTicks / 100 : 1;
  let finalPotencyRaw = stats.potency * stats.potencyBoost * stats.pestPenalty;
  let lightBonus = lightSources[currentLight]?.yieldBonus || 1.0;
  let finalWeightRaw =
    stats.weight * avgHealth * stats.raiderPenalty * lightBonus;
  let finalPotency = Math.round(finalPotencyRaw * 0.66);
  let finalWeight = Math.round(finalWeightRaw);
  finalPotency = Math.max(0, Math.min(100, finalPotency));
  finalWeight = Math.max(0, Math.min(stats.weight * lightBonus, finalWeight));
  document.getElementById("currentPotency").textContent = finalPotency;
  document.getElementById("currentWeight").textContent = finalWeight;
  renderLightSourceUI();
}

function startHarvestTimer() {
  if (plant.harvestTimer) {
    clearInterval(plant.harvestTimer);
  }

  plant.harvestTimer = setInterval(function () {
    plant.harvestTimeLeft--;

    // Calculate potency and weight loss
    const hoursPassed = (24 * 60 * 60 - plant.harvestTimeLeft) / 3600;
    plant.potency = Math.max(0, 100 - hoursPassed * 2); // 2% loss per hour
    plant.weight = Math.max(0, 100 - hoursPassed * 1.5); // 1.5% loss per hour

    // Update display
    updateHarvestDisplay();

    if (plant.harvestTimeLeft <= 0) {
      clearInterval(plant.harvestTimer);
      // Auto-harvest when timer reaches 0
      harvestPlant();
    }
  }, 1000);
}

function updateHarvestDisplay() {
  const hours = Math.floor(plant.harvestTimeLeft / 3600);
  const minutes = Math.floor((plant.harvestTimeLeft % 3600) / 60);
  const seconds = plant.harvestTimeLeft % 60;
  document.getElementById("harvestCountdown").textContent = `${String(
    hours
  ).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  // Use frozen stats if available
  let stats = plant.frozenStats || plant;
  // Calculate average health
  let avgHealth = 1;
  if (stats.healthTicks > 0) {
    avgHealth = stats.healthSum / stats.healthTicks / 100;
  }
  // Potency is not affected by light anymore
  const currentPotencyRaw = Math.round(
    stats.potency * stats.potencyBoost * stats.pestPenalty
  );
  // Yield is affected by light
  let lightBonus = lightSources[currentLight]?.yieldBonus || 1.0;
  const currentWeight = Math.round(
    stats.weight * avgHealth * stats.raiderPenalty * lightBonus
  );
  // Scale potency so perfect play is 66%
  const currentPotency = Math.round(currentPotencyRaw * 0.66);
  document.getElementById("currentPotency").textContent = currentPotency;
  document.getElementById("currentWeight").textContent = currentWeight;
}

function harvestPlant() {
  // Only allow harvesting if the plant is mature (harvest window is open)
  const harvestWindow = document.getElementById("harvestWindow");
  if (!harvestWindow || harvestWindow.classList.contains("hidden")) return;
  clearInterval(plant.harvestTimer);
  harvestWindow.classList.add("hidden");

  // Use current values for potency and weight (after countdown/penalties)
  let finalPotency = plant.potency;
  let finalWeight = plant.weight;

  // If null, fallback to frozenStats (for legacy/edge cases)
  if (finalPotency == null && plant.frozenStats) {
    finalPotency = plant.frozenStats.potency;
  }
  if (finalWeight == null && plant.frozenStats) {
    finalWeight = plant.frozenStats.weight;
  }

  // Clamp and validate
  finalPotency = Math.max(0, Math.min(100, Math.round(finalPotency)));
  finalWeight = Math.max(0, Math.min(100, Math.round(finalWeight)));

  // Only record if values are valid and plant is mature
  if (
    !plant.scoresRecorded &&
    finalPotency !== null &&
    finalWeight !== null &&
    plant.frozenStats
  ) {
    addScore("potency", finalPotency, plant);
    addScore("yield", finalWeight, plant);
    plant.scoresRecorded = true;
  }
  showHarvestResults(finalPotency, finalWeight);
}

function showHarvestResults(finalPotency, finalWeight) {
  const resultsDiv = document.getElementById("harvestResults");
  if (!resultsDiv) return;
  document.getElementById("finalStrainName").textContent =
    seedProperties[plant.seedType].name;
  document.getElementById("finalWeight").textContent = `${finalWeight}g`;
  document.getElementById("finalPotency").textContent = `${finalPotency}%`;
  let finalPlantImage = document.getElementById("finalPlantImage");
  // Always show yield results
  if (finalPlantImage) {
    const flowerImg =
      seedProperties[plant.seedType]?.flowerImage || "stages/yield.png";
    finalPlantImage.src = `img/selections/${flowerImg}`;
    finalPlantImage.alt = seedProperties[plant.seedType]?.name + " Flower";
    finalPlantImage.style.width = "200px";
    finalPlantImage.style.height = "400px";
    finalPlantImage.style.objectFit = "cover";
    finalPlantImage.style.borderRadius = "8px";
    finalPlantImage.style.border = "2px solid #bfcfff";
    finalPlantImage.style.boxShadow = "0 0 15px rgba(255, 107, 107, 0.3)";
    finalPlantImage.style.display = "block";
    finalPlantImage.style.margin = "1.5rem auto";
  }
  // Always record scores
  if (
    !plant.scoresRecorded &&
    finalPotency !== null &&
    finalWeight !== null &&
    plant.frozenStats
  ) {
    addScore("potency", finalPotency, plant);
    addScore("yield", finalWeight, plant);
    plant.scoresRecorded = true;
  }
  updateHighScoresDisplay();
  resultsDiv.classList.remove("hidden");
  updateSeedBankSelectionDisplay();

  // Add copy image button logic
  const copyBtn = document.getElementById("copy-image-btn");
  const copyStatus = document.getElementById("copy-status");
  if (copyBtn && copyStatus) {
    copyBtn.onclick = async function () {
      const resultsContent = resultsDiv.querySelector(".results-content");
      if (!resultsContent) return;

      // Hide unwanted elements
      const copyBtnDiv = copyBtn.parentElement;
      const lookForSeedsBtn = document.getElementById("lookForSeedsBtn");
      const newGameBtn = document.getElementById("newGameBtn");

      // Store original display values
      const originalCopyBtnDisplay = copyBtnDiv.style.display;
      const originalLookForSeedsDisplay = lookForSeedsBtn
        ? lookForSeedsBtn.style.display
        : null;
      const originalNewGameDisplay = newGameBtn
        ? newGameBtn.style.display
        : null;

      copyBtnDiv.style.display = "none";
      if (lookForSeedsBtn) lookForSeedsBtn.style.display = "none";
      if (newGameBtn) newGameBtn.style.display = "none";

      // Capture with black background
      window
        .html2canvas(resultsContent, { backgroundColor: "#000" })
        .then((canvas) => {
          // Restore elements
          copyBtnDiv.style.display = originalCopyBtnDisplay;
          if (lookForSeedsBtn)
            lookForSeedsBtn.style.display = originalLookForSeedsDisplay;
          if (newGameBtn) newGameBtn.style.display = originalNewGameDisplay;

          canvas.toBlob(async function (blob) {
            try {
              await navigator.clipboard.write([
                new window.ClipboardItem({ "image/png": blob }),
              ]);
              copyStatus.style.display = "inline";
              setTimeout(() => {
                copyStatus.style.display = "none";
              }, 2000);
            } catch (err) {
              alert(
                "Copy failed. Try a supported browser or take a screenshot."
              );
            }
          }, "image/png");
        });
    };
  }
  document.getElementById("finalGrowerName").textContent =
    currentGrower.getName() || "";
}

// Add event listener for harvest button
document.addEventListener("DOMContentLoaded", function () {
  const harvestBtn = document.getElementById("harvestBtn");
  if (harvestBtn) {
    harvestBtn.addEventListener("click", harvestPlant);
  }
  const resetBtn = document.getElementById("resetHighScoresBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to reset all high scores?")) {
        localStorage.removeItem("marrowGrowHighScores");
        location.reload();
      }
    });
  }
  const newGameBtn = document.getElementById("newGameBtn");
  if (newGameBtn) {
    newGameBtn.addEventListener("click", function () {
      // Reset plant state (but not high scores)
      plant.reset();
      // Hide harvest results
      const resultsDiv = document.getElementById("harvestResults");
      if (resultsDiv) resultsDiv.classList.add("hidden");
      // Show selection screen
      document.getElementById("selectionScreen").classList.remove("hidden");
      document.getElementById("gameSection").classList.add("hidden");
      // Re-render seed options for new game
      if (typeof renderSeedOptions === "function") renderSeedOptions();
    });
  }
  const toolsTabLabel = document.getElementById("toolsTabLabel");
  const toolsTab = document.getElementById("toolsTab");
  if (toolsTabLabel && toolsTab) {
    toolsTabLabel.addEventListener("click", function () {
      toolsTab.classList.toggle("open");
    });
  }
});

// Modify showGameComplete to use new harvest system
function showGameComplete() {
  showHarvestWindow();
}

// Replace showFeedingScheduleConfig with a full-page feeder UI
function showFeedingScheduleConfig() {
  // Remove any existing config
  const oldConfig = document.getElementById("feedingScheduleConfig");
  if (oldConfig) oldConfig.remove();
  // Hide other sections
  document.getElementById("selectionScreen").classList.add("hidden");
  document.getElementById("gameSection").classList.add("hidden");
  // Create full-page config
  const configDiv = document.createElement("div");
  configDiv.id = "feedingScheduleConfig";
  configDiv.className = "feeding-schedule-config-fullpage";
  configDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #1a1a24 0%, #23141c 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        z-index: 1000;
    `;

  configDiv.innerHTML = `
    <div class="feeding-schedule-center" style="width: 100vw; display: flex; flex-direction: column; align-items: center;">
      <div class="feeding-header" style="text-align: center; margin-bottom: 18px; width: 100%; display: flex; flex-direction: column; align-items: center;">
          <h2 style="color: #e0e0e0; font-family: 'Press Start 2P', monospace; font-size: 1.3em; margin-bottom: 4px; text-shadow: 0 0 10px rgba(224, 224, 224, 0.3);">
              Feeding Schedule
          </h2>
          <p style="color: #bfcfff; font-family: monospace; font-size: 1em; opacity: 0.8; max-width: 600px;">
              Select the amount of water and nutrient type for each growing phase. Your plant needs the right amount of water and good food for each stage. Choose wisely
          </p>
      </div>
      <form id="scheduleForm" style="display: flex; gap: 18px; align-items: stretch; justify-content: center; max-width: 900px; margin: 0 auto;">
          ${["Sprout", "Vegetative", "Flowering"]
            .map(
              (stage) => `
          <div class="stage-schedule-block" style="background: rgba(35, 35, 43, 0.6); backdrop-filter: blur(10px); border: 2px solid rgba(224, 224, 224, 0.1); border-radius: 15px; padding: 14px; min-width: 210px; display: flex; flex-direction: column; gap: 10px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);">
              <div style="text-align: center;">
                  <h3 style="color: #ffd700; font-family: 'Press Start 2P', monospace; font-size: 1em; margin-bottom: 4px;">${stage} Stage</h3>
              </div>
              <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin: 8px 0;">
                  <button type="button" class="water-btn minus-btn" data-stage="${stage.toLowerCase()}" data-type="minus" style="font-size: 1em; width: 36px; height: 36px; padding: 0;">-</button>
                  <div class="water-display">
                      <span id="${stage.toLowerCase()}WaterCircle" style="font-size: 1.1em; min-width: 28px; display: inline-block; text-align: center;">0</span>
                  </div>
                  <button type="button" class="water-btn plus-btn" data-stage="${stage.toLowerCase()}" data-type="plus" style="font-size: 1em; width: 36px; height: 36px; padding: 0;">+</button>
              </div>
              <div class="nutrient-scroll-wheel" id="${stage.toLowerCase()}NutrientWheel"></div>
          </div>
          `
            )
            .join("")}
      </form>
      <div class="feeding-buttons-row" style="display: flex; justify-content: center; gap: 18px; margin-top: 12px;">
          <button id="randomFeedsBtn" type="button" style="background: linear-gradient(135deg, #4a4a55 0%, #34343f 100%); color: #e0e0e0; border: none; border-radius: 15px; padding: 0; font-family: 'Press Start 2P', monospace; font-size: 1.1em; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); width: 180px; height: 44px; display: flex; align-items: center; justify-content: center;">Random</button>
          <button id="saveScheduleBtn" type="button" style="background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%); color: #ffffff; border: none; border-radius: 15px; padding: 0; font-family: 'Press Start 2P', monospace; font-size: 1.1em; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); width: 180px; height: 44px; display: flex; align-items: center; justify-content: center;">Start Growing</button>
      </div>
    </div>
`;
  document.body.appendChild(configDiv);

  // State for water times and nutrient mix
  const mixKeys = Object.keys(nutrientMixes);
  const scheduleState = {
    sprout: { waterTimes: 0, nutrientMix: mixKeys[0] },
    vegetative: { waterTimes: 0, nutrientMix: mixKeys[0] },
    flowering: { waterTimes: 0, nutrientMix: mixKeys[0] },
  };

  // Render scroll wheels with improved styling
  function renderScrollWheel(stage) {
    const wheel = document.getElementById(stage + "NutrientWheel");
    wheel.innerHTML = "";
    const selected = scheduleState[stage].nutrientMix;
    const selIdx = mixKeys.indexOf(selected);
    let indices = [];
    for (let i = -1; i <= 1; i++) {
      indices.push((selIdx + i + mixKeys.length) % mixKeys.length);
    }

    // Add scroll arrows
    wheel.insertAdjacentHTML(
      "afterbegin",
      `
        <div style="height: 32px; display: flex; align-items: center; justify-content: center;">
          <button type="button" class="scroll-arrow up" data-stage="${stage}" style="height: 28px; width: 100%; display: flex; align-items: center; justify-content: center;">▲</button>
        </div>
      `
    );

    indices.forEach((idx, i) => {
      const key = mixKeys[idx];
      const mix = nutrientMixes[key];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nutrient-option" + (i === 1 ? " selected" : "");
      btn.setAttribute("data-stage", stage);
      btn.setAttribute("data-mix", key);
      // Use .mix-title and .mix-desc for text
      if (i === 1) {
        btn.style.height = "60px";
        btn.style.overflow = "hidden";
        btn.style.display = "flex";
        btn.style.flexDirection = "column";
        btn.style.justifyContent = "center";
        btn.innerHTML = `
          <div class="mix-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${mix.name}</div>
          <div class="mix-desc" style="line-height: 1.1em; max-height: 2.2em; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; white-space: normal;">${mix.desc}</div>
        `;
      } else {
        btn.innerHTML = `
          <div class="mix-title">${mix.name}</div>
        `;
      }
      btn.addEventListener("click", function () {
        scheduleState[stage].nutrientMix = key;
        renderScrollWheel(stage);
      });
      wheel.appendChild(btn);
    });

    wheel.insertAdjacentHTML(
      "beforeend",
      `
        <div style="height: 32px; display: flex; align-items: center; justify-content: center;">
          <button type="button" class="scroll-arrow down" data-stage="${stage}" style="height: 28px; width: 100%; display: flex; align-items: center; justify-content: center;">▼</button>
        </div>
      `
    );

    // Add click handlers for arrows
    wheel.querySelector(".scroll-arrow.up").onclick = function () {
      let idx = mixKeys.indexOf(scheduleState[stage].nutrientMix);
      idx = (idx - 1 + mixKeys.length) % mixKeys.length;
      scheduleState[stage].nutrientMix = mixKeys[idx];
      renderScrollWheel(stage);
    };
    wheel.querySelector(".scroll-arrow.down").onclick = function () {
      let idx = mixKeys.indexOf(scheduleState[stage].nutrientMix);
      idx = (idx + 1) % mixKeys.length;
      scheduleState[stage].nutrientMix = mixKeys[idx];
      renderScrollWheel(stage);
    };
  }

  // Initialize wheels
  ["sprout", "vegetative", "flowering"].forEach((stage) =>
    renderScrollWheel(stage)
  );

  // Update UI
  function updateCircles() {
    ["sprout", "vegetative", "flowering"].forEach((stage) => {
      document.getElementById(stage + "WaterCircle").textContent =
        scheduleState[stage].waterTimes;
    });
  }
  updateCircles();

  // Event handlers remain the same
  document.querySelectorAll(".water-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const stage = btn.getAttribute("data-stage");
      const type = btn.getAttribute("data-type");
      if (type === "plus") {
        scheduleState[stage].waterTimes = Math.min(
          12,
          scheduleState[stage].waterTimes + 1
        );
      } else {
        scheduleState[stage].waterTimes = Math.max(
          0,
          scheduleState[stage].waterTimes - 1
        );
      }
      updateCircles();
    });
  });

  document
    .getElementById("randomFeedsBtn")
    .addEventListener("click", function () {
      ["sprout", "vegetative", "flowering"].forEach((stage) => {
        scheduleState[stage].waterTimes = Math.floor(Math.random() * 13); // 0-12
        const randMix = mixKeys[Math.floor(Math.random() * mixKeys.length)];
        scheduleState[stage].nutrientMix = randMix;
        updateCircles();
        renderScrollWheel(stage);
      });
    });

  document
    .getElementById("saveScheduleBtn")
    .addEventListener("click", function () {
      plant.feedingSchedule = {
        sprout: {
          waterTimes: scheduleState.sprout.waterTimes,
          nutrientMix: scheduleState.sprout.nutrientMix,
        },
        vegetative: {
          waterTimes: scheduleState.vegetative.waterTimes,
          nutrientMix: scheduleState.vegetative.nutrientMix,
        },
        flowering: {
          waterTimes: scheduleState.flowering.waterTimes,
          nutrientMix: scheduleState.flowering.nutrientMix,
        },
      };
      plant.lastWaterTime = Date.now();
      plant.lastFeedTime = Date.now();
      configDiv.remove();
      document.getElementById("gameSection").classList.remove("hidden");
      initializeGame();
    });
}

// New function to initialize the game after schedule is set
function initializeGame() {
  // Calculate total growth time
  var totalGrowthTime = 0;
  for (var i = 0; i < growthStages.length - 1; i++) {
    totalGrowthTime += growthStages[i].time;
  }
  plant.totalGrowthTime = totalGrowthTime;
  plant.healthSum = 0;
  plant.healthTicks = 0;
  plant.lightEfficiencySum = 0;
  plant.lightEfficiencyTicks = 0;
  plant.potencyBoost = 1;
  // Set initial optimal light
  plant.optimalLight = Math.floor(Math.random() * 61) + 30;
  // Set initial values to 80% instead of 50%
  plant.light = 80;
  plant.water = 80;
  plant.nutrients = 80;

  // Update game container with notification section
  var gameContainer = document.getElementById("gameContainer");
  gameContainer.innerHTML = `
        <div id="topStatusHud" class="top-status-hud" style="text-align: center; margin-bottom: 18px;">
        </div>
        <div class="growth-progress-section">
            <span class="growth-progress-label">Growth</span>
            <div class="bar" style="height: 24px;"><div id="growthProgress" class="level" style="width: 0%; height: 24px;"></div></div>
        </div>
        <div class="resource-bars">
            <div class="resource condensed">
                <span class="resource-label">Water</span>
                <div class="bar" style="height: 24px;"><div id="waterLevel" class="level" style="width: 100%; height: 24px;"></div></div>
            </div>
            <div class="resource condensed">
                <span class="resource-label">Light</span>
                <div class="bar" style="height: 24px;"><div id="lightLevel" class="level" style="width: 100%; height: 24px;"></div></div>
            </div>
            <div class="resource condensed">
                <span class="resource-label">Nutes</span>
                <div class="bar" style="height: 24px;"><div id="nutrientLevel" class="level" style="width: 100%; height: 24px;"></div></div>
            </div>
            <div class="resource condensed">
                <span class="resource-label">Stress</span>
                <div class="bar" style="height: 24px;"><div id="stressLevel" class="level" style="width: 0%; height: 24px;"></div></div>
            </div>
        </div>
        <div class="game-controls" style="display: flex; flex-direction: column; align-items: center; gap: 18px; margin-top: 18px;">
        </div>
        <div id="notificationSection" class="notification-section" style="max-width: 600px; width: 100%; margin: 0 auto; padding: 10px 10px 0px 10px; box-sizing: border-box; height: 180px;">
            <h3 style="margin-bottom: 6px;">Events</h3>
            <div id="eventLog" class="event-log" style="max-height: 180px; overflow-y: auto;"></div>
        </div>
    `;
  // Initialize game state
  plant.growthStage = 0;
  plant.stageTime = 0;
  // Run one tick to initialize averages
  updatePlantStatus();
  updatePlantDisplay();
  plant.healthSum += plant.health;
  plant.healthTicks++;
  var maxDiff = 100;
  var diff = Math.abs(plant.light - plant.optimalLight);
  var efficiency = Math.max(0, 1 - diff / maxDiff);
  plant.lightEfficiencySum += efficiency;
  plant.lightEfficiencyTicks++;
  // Now start the timer
  startGrowthTimer(); // Ensure timer starts every game
  scheduleActOfGod();
  console.log("NEW GAME STARTED: Growth timer started.");
  feedingTick = 0;
  plant.sproutNutrientApplied = false;
  plant.vegetativeNutrientApplied = false;
  plant.floweringNutrientApplied = false;
  renderLightSourceUI();
  checkAndUnlockLights();
  // Update #seedSoilDisplay to have 4 squares
  const seedSoilDisplay = document.getElementById("seedSoilDisplay");
  if (seedSoilDisplay) {
    seedSoilDisplay.innerHTML = `
      <div id="seedSquare" class="seed-soil-square"></div>
      <div id="soilSquare" class="seed-soil-square"></div>
      <div id="defenseSquare" class="seed-soil-square"></div>
      <div id="lightSquare" class="seed-soil-square"></div>
    `;
  }
}

// Schedule act of god once per game at a random time during growth
function scheduleActOfGod() {
  if (actOfGodOccurred || actOfGodTimeout) return;
  // Pick a random time between 20% and 80% of total growth time
  var min = Math.floor(plant.totalGrowthTime * 0.2);
  var max = Math.floor(plant.totalGrowthTime * 0.8);
  var triggerAt = Math.floor(Math.random() * (max - min)) + min;
  actOfGodTimeout = setTimeout(function () {
    if (!actOfGodOccurred) {
      const godEvent = actsOfGod[Math.floor(Math.random() * actsOfGod.length)];
      // 30% chance to deflect
      if (Math.random() < 0.3) {
        addEventToLog(
          "The act of god was deflected by darker powers. Your plant is unharmed.",
          "actofgod"
        );
      } else {
        godEvent.effect(plant);
        addEventToLog(`Act of God: ${godEvent.message}`, "actofgod");
      }
      actOfGodOccurred = true;
    }
  }, triggerAt * 1000); // plant.stageTime is in seconds
}

// Add new function to manage event log
function addEventToLog(message, type = "info") {
  const eventLog = document.getElementById("eventLog");
  if (!eventLog) return;

  const eventElement = document.createElement("div");
  eventElement.className = `event-item ${type}`;
  eventElement.textContent = message;
  // No timestamp
  eventLog.insertBefore(eventElement, eventLog.firstChild);
  while (eventLog.children.length > 10) {
    eventLog.removeChild(eventLog.lastChild);
  }
}

// Add a game over function
function gameOver() {
  clearInterval(plant.growthTimer);
  clearInterval(plant.harvestTimer);
  document.getElementById("gameSection").classList.add("hidden");

  // Show a simple game over screen
  let overDiv = document.getElementById("gameOverScreen");
  if (!overDiv) {
    overDiv = document.createElement("div");
    overDiv.id = "gameOverScreen";
    overDiv.style =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;background:#23141c;z-index:2000;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;";
    overDiv.innerHTML = `
            <h1 style='color:#ff1744;font-family:"Press Start 2P",monospace;font-size:2.5em;margin-bottom:32px;'>Game Over</h1>
            <p style='font-size:1.3em;font-family:"Press Start 2P",monospace;margin-bottom:32px;'>Your plant died from neglect.<br>No harvest for you.</p>
            <button onclick='location.reload()' style='font-size:1.2em;padding:18px 48px;background:#bfcfff;color:#23141c;border:none;border-radius:8px;font-family:"Press Start 2P",monospace;cursor:pointer;'>Try Again</button>
        `;
    document.body.appendChild(overDiv);
  } else {
    overDiv.classList.remove("hidden");
  }

  // Reset current grower
  currentGrower = new Player();
  document.getElementById("growerName").textContent = "";
  updateUserDisplay(null); // Clear user display
}

function updateUserDisplay(userName) {
  const userDisplay = document.getElementById("currentUserDisplay");
  const logoutBtn = document.getElementById("logoutBtn");

  if (userName) {
    userDisplay.textContent = `User: ${userName}`;
    logoutBtn.style.display = "block";
  } else {
    userDisplay.textContent = "";
    logoutBtn.style.display = "none";
  }
}

function logout() {
  PlayFabService.logout();
  // Clean logout without the "Your plant died" message
  clearInterval(plant.growthTimer);
  clearInterval(plant.harvestTimer);
  currentGrower = new Player();
  document.getElementById("growerName").textContent = "";
  updateUserDisplay(null);
  document.getElementById("gameSection").classList.add("hidden");
  document.getElementById("nameInputScreen").classList.remove("hidden");
  resetSelectionScreen();
}

// Auto-login on page load
async function checkAutoLogin() {
  const loadingScreen = document.getElementById("loadingScreen");
  const nameInputScreen = document.getElementById("nameInputScreen");

  // Show loading screen if there might be a session
  const potentialSession = PlayFabService.getSession();
  if (potentialSession) {
    loadingScreen.classList.remove("hidden");
    nameInputScreen.classList.add("hidden");
  }

  try {
    const sessionUser = await PlayFabService.autoLogin();
    if (sessionUser) {
      currentGrower.setName(sessionUser);
      document.getElementById(
        "growerName"
      ).textContent = `Grower: ${sessionUser}`;
      updateUserDisplay(sessionUser);

      // Debug logs to verify Player object
      console.log("currentGrower is:", currentGrower);
      console.log("currentGrower.getName() is:", currentGrower.getName());
      console.log("currentGrower.getLives() is:", currentGrower.getLives());
      console.log("sessionUser is:", sessionUser);
      console.log("typeof sessionUser:", typeof sessionUser);

      await currentGrower.loadData();

      // Debug logs after loading data
      console.log("After loadData():");
      console.log("currentGrower.getLives():", currentGrower.getLives());
      console.log("currentGrower.getName():", currentGrower.getName());

      highScores = currentGrower.highScores;
      updateHighScoresDisplay();
      await loadAndDisplayGlobalLeaderboardsPanel();

      // Check seed lives and lockout status
      if (currentGrower.getLives() < 1) {
        const lastLock = await getSeedLockoutTimestamp();
        const now = Date.now();
        if (!lastLock) {
          currentGrower.setLives(GAME_CONFIG.SEED_LIVES_START);
          await currentGrower.saveData();
        } else if (
          now - lastLock >=
          GAME_CONFIG.SEED_LOCKOUT_HOURS * 60 * 60 * 1000
        ) {
          currentGrower.setLives(GAME_CONFIG.SEED_LIVES_START);
          await clearSeedLockoutTimestamp();
          await currentGrower.saveData();
        }
      }

      // Debug logs
      console.log("After seed lives check:");
      console.log("currentGrower.getLives():", currentGrower.getLives());
      console.log("highScores.seedLives:", highScores.seedLives);

      updatePersistentSeedCount();
      console.log("Called updatePersistentSeedCount()");

      // Hide loading screen and show game section
      loadingScreen.classList.add("hidden");
      document.getElementById("selectionScreen").classList.remove("hidden");
      checkSeedLockoutUI();
      updateHighScoresDisplay();

      // Check for daily slots
      setTimeout(async function () {
        if (await canSpinSlotsToday()) showSlotsModal();
      }, 1000);
    } else {
      // No session, show login screen
      loadingScreen.classList.add("hidden");
      nameInputScreen.classList.remove("hidden");
    }
  } catch (error) {
    console.warn("Auto-login failed:", error);
    // Hide loading screen and show login on error
    loadingScreen.classList.add("hidden");
    nameInputScreen.classList.remove("hidden");
  }
}

// --- Seed Bank Logic ---
if (!highScores.seedBank) highScores.seedBank = {};

function addSeedToBank(seedType) {
  if (!currentGrower) return;
  if (!highScores.seedBank[currentGrower])
    highScores.seedBank[currentGrower] = {};
  if (!highScores.seedBank[currentGrower][seedType])
    highScores.seedBank[currentGrower][seedType] = 0;
  highScores.seedBank[currentGrower][seedType] += 1;
  saveHighScores();
}

function getSeedBank(seedType) {
  console.log("getSeedBank called. highScores:", highScores);
  if (
    !highScores ||
    typeof highScores !== "object" ||
    !highScores.seedBank ||
    !currentGrower ||
    !highScores.seedBank[currentGrower]
  )
    return 0;
  return highScores.seedBank[currentGrower][seedType] || 0;
}

// Ensure initialization on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initializeNameInput();
    checkAutoLogin(); // Check for existing session - this will load high scores after auth

    // Add logout button event listener
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }
  });
} else {
  initializeNameInput();
  checkAutoLogin(); // Check for existing session - this will load high scores after auth

  // Add logout button event listener
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}

function updateSeedBankSelectionDisplay() {
  const el = document.getElementById("seedBankSelectionDisplay");
  if (el) {
    let strain = plant.seedType || Object.keys(seedProperties)[0];
    let multText = getStrainMultiplierText(strain);
    if (currentGrower && currentGrower.isLoggedIn()) {
      el.innerHTML = `Seeds: <span style='color:#fff;'>${currentGrower.getLives()}</span> <span style='color:#ffd700;font-size:0.9em;'>${multText}</span>`;
    } else {
      el.innerHTML = `Seeds: <span style='color:#fff;'>0</span> <span style='color:#ffd700;font-size:0.9em;'>${multText}</span>`;
    }
  }
}
// Call this in relevant places:
// After updateHighScoresDisplay, after setLivesForPlayer, after name input, after starting a game, after receiving a seed
const oldUpdateHighScoresDisplay = updateHighScoresDisplay;
updateHighScoresDisplay = function () {
  oldUpdateHighScoresDisplay.apply(this, arguments);
  updateSeedBankSelectionDisplay();
};
// Also call after name input confirm
// In initializeNameInput, after checkSeedLockoutUI();
// ...
// In showHarvestResults, after setLivesForPlayer and updateHighScoresDisplay, call updateSeedBankSelectionDisplay();
// ...

// --- Seed Selection Lives Logic ---
let lastSelectedSeed = null;

function handleSeedSelection(option) {
  if (currentGrower.getLives() <= 0) {
    // Prevent selection if no seeds left
    return;
  }
  // Mark this as the new selected
  lastSelectedSeed = option;
  // Usual selection logic
  document.querySelectorAll(".seed-option").forEach(function (opt) {
    opt.classList.remove("selected");
  });
  option.classList.add("selected");
  plant.seedType = option.getAttribute("data-seed-type");
  updateStartButton();
}

// Attach this handler to seed options after rendering
function attachSeedSelectionHandlers() {
  document.querySelectorAll(".seed-option").forEach(function (option) {
    option.addEventListener("click", function () {
      handleSeedSelection(option);
    });
  });
}

// After rendering seed options, call attachSeedSelectionHandlers()
const oldRenderSeedOptions = renderSeedOptions;
renderSeedOptions = function () {
  oldRenderSeedOptions.apply(this, arguments);
  attachSeedSelectionHandlers();
};

// On name input confirm, reset lives to 3 if new player or after lockout
// (already handled in initializeNameInput)
// On start button click, do NOT decrement lives again (already decremented on selection)
// ... existing code ...

// --- Strain Multiplier System ---
function getStrainCount(strain) {}

function incrementStrainCount(strain) {}

function getStrainMultiplier(strain) {}

function getStrainMultiplierText(strain) {}

// ... existing code ...

// Patch updateHighScoresDisplay and updateSeedBankSelectionDisplay to show multiplier
const oldUpdateSeedBankSelectionDisplay = updateSeedBankSelectionDisplay;
updateSeedBankSelectionDisplay = function () {
  const el = document.getElementById("seedBankSelectionDisplay");
  if (el) {
    let strain = plant.seedType || Object.keys(seedProperties)[0];
    let multText = getStrainMultiplierText(strain);
    if (currentGrower && currentGrower.isLoggedIn()) {
      el.innerHTML = `Seeds: <span style='color:#fff;'>${currentGrower.getLives()}</span> <span style='color:#ffd700;font-size:0.9em;'>${multText}</span>`;
    } else {
      el.innerHTML = `Seeds: <span style='color:#fff;'>0</span> <span style='color:#ffd700;font-size:0.9em;'>${multText}</span>`;
    }
  }
};
const oldUpdateHighScoresDisplay2 = updateHighScoresDisplay;
updateHighScoresDisplay = function () {
  oldUpdateHighScoresDisplay2.apply(this, arguments);
  // Also update multiplier in high scores column
  const seedBankScores = document.getElementById("seedBankScores");
  if (seedBankScores) {
    let strain = plant.seedType || Object.keys(seedProperties)[0];
    let multText = getStrainMultiplierText(strain);
    let base = seedBankScores.innerHTML.match(
      /Seeds: <span style='color:#fff;'>\d+<\/span>/
    );
    if (base) {
      seedBankScores.innerHTML = `${base[0]} <span style='color:#ffd700;font-size:0.9em;'>${multText}</span>`;
    }
  }
  oldUpdateSeedBankSelectionDisplay();
};
// Apply multiplier to final potency in showHarvestResults
const oldShowHarvestResults = showHarvestResults;
showHarvestResults = function (finalPotency, finalWeight) {
  oldShowHarvestResults(finalPotency, finalWeight);
};
// ... existing code ...

// --- Seed Streak Bonus ---
function getConsecutiveSeedHarvests() {}

function setConsecutiveSeedHarvests(val) {}

// --- Double Seed Bonus on Same Strain ---
// REMOVED: Double seed multiplier functionality

// ... existing code ...

// ... existing code ...
function resetSelectionScreen() {
  // Refund a life if a seed was selected but the game was not started
  if (typeof lastSelectedSeed !== "undefined" && lastSelectedSeed) {
    // Only refund if the player actually lost a life for this selection
    if (plant.seedType) {
      currentGrower.setLives(currentGrower.getLives() + 1);
      currentGrower.saveData();
      updateHighScoresDisplay();
    }
  }
  // Unselect all seed and soil options
  document
    .querySelectorAll(".seed-option")
    .forEach((opt) => opt.classList.remove("selected"));
  document
    .querySelectorAll(".soil-option")
    .forEach((opt) => opt.classList.remove("selected"));
  // Reset plant state
  plant.seedType = null;
  plant.soilType = null;
  // Disable start button
  const startButton = document.getElementById("startGameBtn");
  if (startButton) startButton.disabled = true;
  // Reset lastSelectedSeed for lives logic
  if (typeof lastSelectedSeed !== "undefined") lastSelectedSeed = null;
}
// Call resetSelectionScreen whenever the selection screen is shown for a new game
// After a game ends and before showing the selection screen
const oldNewGameBtnHandler = document.addEventListener;
document.addEventListener = function (type, handler, ...args) {
  if (type === "DOMContentLoaded") {
    handler = function (e) {
      // Patch new game button
      const newGameBtn = document.getElementById("newGameBtn");
      if (newGameBtn) {
        newGameBtn.addEventListener("click", function () {
          resetSelectionScreen();
        });
      }
      return arguments.callee.orig.apply(this, arguments);
    };
    handler.orig = arguments[1];
  }
  return oldNewGameBtnHandler.apply(this, [type, handler, ...args]);
};
// Also call resetSelectionScreen in initializeNameInput after showing the selection screen
// ... existing code ...

// Patch showHarvestResults to support Look for Seeds button
const oldShowHarvestResultsLookForSeeds = showHarvestResults;
showHarvestResults = function (finalPotency, finalWeight) {
  oldShowHarvestResultsLookForSeeds.apply(this, arguments);
  // After showing results, set up Look for Seeds logic
  const lookBtn = document.getElementById("lookForSeedsBtn");
  const newGameBtn = document.getElementById("newGameBtn");
  const msgDiv = document.getElementById("lookForSeedsMsg");
  const finalPlantImage = document.getElementById("finalPlantImage");
  // --- FLEX CONTAINER LOGIC ---
  let flexContainer = document.getElementById("harvestImageFlex");
  if (!flexContainer) {
    flexContainer = document.createElement("div");
    flexContainer.id = "harvestImageFlex";
    flexContainer.style.display = "flex";
    flexContainer.style.flexDirection = "row";
    flexContainer.style.justifyContent = "center";
    flexContainer.style.alignItems = "center";
    flexContainer.style.margin = "0 0 0 0";
    // Insert before the lookForSeedsMsg
    const parent = finalPlantImage.parentNode;
    parent.insertBefore(flexContainer, finalPlantImage);
  }
  // Remove any children from flexContainer
  while (flexContainer.firstChild)
    flexContainer.removeChild(flexContainer.firstChild);
  // Remove the original finalPlantImage from DOM if present
  if (finalPlantImage.parentNode === flexContainer) {
    flexContainer.removeChild(finalPlantImage);
  }
  // Always add the correct flower image to the flex container
  flexContainer.appendChild(finalPlantImage);

  // --- Look for Seeds logic ---
  if (lookBtn) {
    lookBtn.disabled = false;
    // Remove any previous message
    if (msgDiv) msgDiv.textContent = "";
    // Remove previous handler if any
    if (lookBtn._handler)
      lookBtn.removeEventListener("click", lookBtn._handler);
    lookBtn._handler = function () {
      lookBtn.disabled = true;
      if (Math.random() < 0.2) {
        currentGrower.setLives(currentGrower.getLives() + 1);
        currentGrower.saveData();
        saveHighScores();
        updateHighScoresDisplay();
        if (msgDiv)
          msgDiv.innerHTML =
            "<span style='color:#ffd700;'>You found a seed!</span> (+1 Seed)";
      } else {
        if (msgDiv)
          msgDiv.innerHTML =
            "<span style='color:#bfcfff;'>No seeds found this time.</span>";
      }
    };
    lookBtn.addEventListener("click", lookBtn._handler);
  }
  // Enable Start New Game button
  if (newGameBtn) newGameBtn.disabled = false;
};
// ... existing code ...

// Add defense selection logic
plant.defenseType = null;

// Attach defense selection handlers
var defenseOptions = document.querySelectorAll(".defense-option");
defenseOptions.forEach(function (option) {
  option.addEventListener("click", function () {
    // Remove selected class from all defense options
    defenseOptions.forEach(function (opt) {
      opt.classList.remove("selected");
    });
    // Add selected class to clicked option
    option.classList.add("selected");
    // Store selected defense type
    plant.defenseType = option.getAttribute("data-defense-type");
    updateStartButton();
  });
});

// Update start button state to require defense selection
function updateStartButton() {
  startButton.disabled = !(
    plant.seedType &&
    plant.soilType &&
    plant.defenseType
  );
}

// --- Defense Effects ---
// Patch pest and raider event logic to check defense
function showPestEvent() {
  pestActive = true;
  const pestType = pestTypes[Math.floor(Math.random() * pestTypes.length)];
  addEventToLog(`${pestType.message}`, "warning");
  // If Grower defense, 60% chance to block pest penalty
  if (plant.defenseType === "grower") {
    if (Math.random() < 0.6) {
      // 60% success rate
      setTimeout(function () {
        addEventToLog("Your Grower defended against the pests!", "info");
        pestActive = false;
      }, 2000);
      return; // Stop further execution if successful
    } else {
      addEventToLog("Your Grower failed to stop the pests!", "warning");
    }
  }
  // Random chance to successfully defend against pests
  const defenseSuccess = Math.random() < pestType.successRate;
  setTimeout(function () {
    if (defenseSuccess) {
      addEventToLog(`${pestType.name} were successfully repelled!`, "info");
    } else {
      const damagePercent = Math.floor(Math.random() * 10) + 5; // Reduced damage range (5-15%)
      plant.pestPenalty *= 1 - damagePercent / 100;
      addEventToLog(
        `${pestType.name} reduced potency by ${damagePercent}%.`,
        "error"
      );
    }
    pestActive = false;
  }, 5000);
}

function showRaiderEvent() {
  raiderActive = true;
  const raidType = raidTypes[Math.floor(Math.random() * raidTypes.length)];
  addEventToLog(`${raidType.message}`, "warning");
  // If Hound defense, 25% chance to block raider penalty
  if (plant.defenseType === "hound") {
    if (Math.random() < 0.25) {
      // 25% success rate
      setTimeout(function () {
        addEventToLog("Your Hound chased off the raiders!", "info");
        raiderActive = false;
      }, 2000);
      return; // Stop further execution if successful
    } else {
      addEventToLog("Your Hound failed to stop the raiders!", "warning");
    }
  }
  // Random chance to successfully defend against raiders
  const defenseSuccess = Math.random() < raidType.successRate;
  setTimeout(function () {
    if (defenseSuccess) {
      addEventToLog(`${raidType.name} were successfully repelled!`, "info");
    } else {
      const damagePercent = Math.floor(Math.random() * 10) + 5; // Reduced damage range (5-15%)
      plant.raiderPenalty *= 1 - damagePercent / 100;
      addEventToLog(
        `${raidType.name} reduced yield by ${damagePercent}%.`,
        "error"
      );
    }
    raiderActive = false;
  }, 5000);
}

// --- MarrowCorp Seed Theft ---
function marrowCorpSeedTheft() {
  // Only trigger if not protected by Vault
  if (plant.defenseType === "vault") return;
  if (Math.random() < 0.25 && currentGrower.getLives() > 0) {
    currentGrower.setLives(currentGrower.getLives() - 1);
    currentGrower.saveData();
    saveHighScores();
    updateHighScoresDisplay();
    // Show message to player
    setTimeout(function () {
      alert("MarrowCorp agents have stolen 1 of your seeds!");
    }, 500);
  }
}
// Call marrowCorpSeedTheft after each grow (after showHarvestResults)
const oldShowHarvestResults_MarrowCorp = showHarvestResults;
showHarvestResults = function (finalPotency, finalWeight) {
  oldShowHarvestResults_MarrowCorp.apply(this, arguments);
  marrowCorpSeedTheft();
};
// ... existing code ...

// --- Daily Slots Mini-Game (now uses PlayFab, 1 spin per day) ---
async function canSpinSlotsToday() {
  if (!currentGrower) return false;
  const today = new Date().toISOString().slice(0, 10);
  const { date, count } = await PlayFabService.getSlotsSpinData(currentGrower);
  return date !== today || count < 1;
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
  const modal = document.getElementById("slotsModal");
  if (!modal) return;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  // Reset reels and message
  document.getElementById("slot1").textContent = "🌱";
  document.getElementById("slot2").textContent = "💀";
  document.getElementById("slot3").textContent = "⭐";
  const spinsToday = await getSlotsSpinsToday();
  document.getElementById("slotsResultMsg").textContent = `Spins left today: ${
    1 - spinsToday
  }`;
  document.getElementById("spinSlotsBtn").disabled = spinsToday >= 1;
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
  const icons = ["🌱", "💀", "⭐", "🦴"];
  let reels = [];
  for (let i = 0; i < 3; i++) {
    reels.push(icons[Math.floor(Math.random() * icons.length)]);
  }
  // Animate reels
  let steps = 10;
  let interval = setInterval(() => {
    for (let i = 0; i < 3; i++) {
      document.getElementById("slot" + (i + 1)).textContent =
        icons[Math.floor(Math.random() * icons.length)];
    }
    steps--;
    if (steps <= 0) {
      clearInterval(interval);
      // Show final result
      for (let i = 0; i < 3; i++) {
        document.getElementById("slot" + (i + 1)).textContent = reels[i];
      }
      let msg = "";
      let seedsWon = 0;
      if (reels[0] === "🌱" && reels[1] === "🌱" && reels[2] === "🌱") {
        msg = "JACKPOT! +3 Seeds!";
        seedsWon = 3;
      } else if (reels.filter((x) => x === "🌱").length === 2) {
        msg = "+1 Seed!";
        seedsWon = 1;
      } else if (reels[0] === "⭐" && reels[1] === "⭐" && reels[2] === "⭐") {
        msg = "Lucky Stars! +2 Seeds!";
        seedsWon = 2;
      } else {
        msg = "Try again tomorrow!";
      }
      document.getElementById("slotsResultMsg").textContent = msg;
      if (seedsWon > 0) {
        currentGrower.setLives(currentGrower.getLives() + seedsWon);
        currentGrower.saveData();
        saveHighScores();
        updateHighScoresDisplay();
      }
      setSlotsSpinToday();
      document.getElementById("spinSlotsBtn").disabled = true;
      setTimeout(hideSlotsModal, 2500);
    }
  }, 80);
}
document.addEventListener("DOMContentLoaded", function () {
  const spinBtn = document.getElementById("spinSlotsBtn");
  if (spinBtn) spinBtn.onclick = spinSlots;
  const continueBtn = document.getElementById("continueSlotsBtn");
  if (continueBtn)
    continueBtn.onclick = function () {
      hideSlotsModal();
      // Show the selection screen after closing slots modal
      const selectionScreen = document.getElementById("selectionScreen");
      if (selectionScreen) selectionScreen.classList.remove("hidden");
    };
});
// ... existing code ...

// --- Seed Breeding Logic ---
function canBreedStrain() {
  return currentGrower.getLives() >= 2;
}
function showBreedButtonAfterHarvest() {
  const btn = document.getElementById("breedStrainBtn");
  if (!btn) return;
  if (canBreedStrain()) {
    btn.style.display = "";
  } else {
    btn.style.display = "none";
  }
}
function showBreedModal() {
  const modal = document.getElementById("breedModal");
  if (!modal) return;
  document.getElementById("newStrainNameInput").value = "";
  document.getElementById("breedMsg").textContent = "";
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function hideBreedModal() {
  const modal = document.getElementById("breedModal");
  if (!modal) return;
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}
function createCustomStrain(strainName, parentKey) {
  // Use a unique key for the new strain
  let customKey = "customstrain_" + Date.now();
  // Inherit stats from parentKey (default to marrowmint)
  const parent = seedProperties[parentKey] || seedProperties["marrowmint"];
  seedProperties[customKey] = {
    name: strainName,
    waterDrain: parent.waterDrain,
    nutrientDrain: parent.nutrientDrain,
    image: "seed7.png",
    desc: `Custom strain bred by ${currentGrower}`,
    owner: currentGrower,
  };
  // Save to localStorage for global pool
  let customStrains = JSON.parse(localStorage.getItem("customStrains") || "{}");
  customStrains[customKey] = seedProperties[customKey];
  localStorage.setItem("customStrains", JSON.stringify(customStrains));
  return customKey;
}
function loadCustomStrains() {
  let customStrains = JSON.parse(localStorage.getItem("customStrains") || "{}");
  for (let key in customStrains) {
    if (customStrains[key].owner === currentGrower) {
      seedProperties[key] = customStrains[key];
    } else {
      // Remove from seedProperties if not owned by this user
      if (seedProperties[key]) delete seedProperties[key];
    }
  }
}
// Patch seed selection to include custom strains
if (typeof window.oldRenderSeedOptions === "undefined") {
  window.oldRenderSeedOptions = renderSeedOptions;
  renderSeedOptions = function () {
    loadCustomStrains();
    window.oldRenderSeedOptions.apply(this, arguments);
  };
}
// Show/hide breed button after harvest
if (typeof window.oldShowHarvestResults === "undefined") {
  window.oldShowHarvestResults = showHarvestResults;
  showHarvestResults = function (finalPotency, finalWeight) {
    window.oldShowHarvestResults.apply(this, arguments);
    showBreedButtonAfterHarvest();
  };
}
document.addEventListener("DOMContentLoaded", function () {
  const breedBtn = document.getElementById("breedStrainBtn");
  const confirmBtn = document.getElementById("confirmBreedBtn");
  const cancelBtn = document.getElementById("cancelBreedBtn");
  if (breedBtn) breedBtn.onclick = showBreedModal;
  if (cancelBtn) cancelBtn.onclick = hideBreedModal;
  if (confirmBtn)
    confirmBtn.onclick = function () {
      const nameInput = document.getElementById("newStrainNameInput");
      const msgDiv = document.getElementById("breedMsg");
      let strainName = nameInput.value.trim();
      if (!strainName || strainName.length < 3) {
        msgDiv.textContent = "Name must be at least 3 characters.";
        return;
      }
      // Check for duplicate name
      for (let key in seedProperties) {
        if (
          seedProperties[key].name.toLowerCase() === strainName.toLowerCase()
        ) {
          msgDiv.textContent = "That name is already taken.";
          return;
        }
      }
      // Deduct 2 seeds
      if (currentGrower.getLives() < 2) {
        msgDiv.textContent = "Not enough seeds!";
        return;
      }
      currentGrower.setLives(currentGrower.getLives() - 2);
      currentGrower.saveData();
      saveHighScores();
      updateHighScoresDisplay();
      // Inherit stats from last grown strain (or marrowmint)
      let parentKey = plant.seedType || "marrowmint";
      let newKey = createCustomStrain(strainName, parentKey);
      msgDiv.textContent = `Strain "${strainName}" created!`;
      setTimeout(() => {
        hideBreedModal();
        // Optionally, refresh seed selection UI
        if (typeof renderSeedOptions === "function") renderSeedOptions();
      }, 1200);
    };
});
// ... existing code ...

// Light source configuration
const lightSources = {
  candle: { name: "Candle Light", price: 0, yieldBonus: 1.0 },
  desk: { name: "Desk Lamp", price: 100, yieldBonus: 1.1 },
  grow: { name: "Grow Light", price: 500, yieldBonus: 1.2 },
  plasma: { name: "Plasma Lamp", price: 2500, yieldBonus: 1.35 },
  quantum: { name: "Quantum Board", price: 5000, yieldBonus: 1.5 },
};

// Player state for owned lights
let ownedLights = { candle: true };
let currentLight = "candle"; // Default starting light

// Render light source selection and purchase UI
function renderLightSourceUI() {
  const containerId = "lightSourceContainer";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.display = "flex";
    container.style.flexDirection = "row";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.gap = "8px";
    container.style.margin = "10px 0";
    container.style.flexWrap = "nowrap";
    // Insert above resource bars or at top of game controls
    const gameControls = document.querySelector(".game-controls");
    if (gameControls) {
      gameControls.parentNode.insertBefore(container, gameControls);
    } else {
      document.body.appendChild(container);
    }
  }
  container.innerHTML = "";
  // Show all four unlockable lights plus candle
  const lightKeys = ["candle", "desk", "grow", "plasma", "quantum"];
  lightKeys.forEach((key) => {
    const light = lightSources[key];
    const btn = document.createElement("button");
    btn.style.minWidth = "90px";
    btn.style.maxWidth = "120px";
    btn.style.padding = "6px 4px";
    btn.style.margin = "0 2px";
    btn.style.fontFamily = '"Press Start 2P", monospace';
    btn.style.fontSize = "0.7em"; // Smaller font size for all text
    btn.style.borderRadius = "6px";
    btn.style.border = "1.5px solid #bfcfff";
    btn.style.background = ownedLights[key] ? "#2ecc71" : "#23232b";
    btn.style.color = "#fff";
    btn.style.cursor = "default";
    btn.style.boxShadow = "none";
    btn.style.display = "flex";
    btn.style.flexDirection = "column";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.height = "54px";
    btn.style.lineHeight = "1.1";
    let unlockInfo = "";
    const unlockObj = lightUnlockThresholds.find((l) => l.key === key);
    if (!ownedLights[key] && unlockObj) {
      unlockInfo = `<div style='font-size:0.75em;color:#bfcfff;opacity:0.85;margin-top:4px;'>${unlockObj.threshold}g</div>`;
    }
    btn.innerHTML = `<div style='font-weight:bold;font-size:0.8em;'>${
      light.name
    }</div>${!ownedLights[key] ? unlockInfo : ""}`;
    if (!ownedLights[key]) {
      btn.disabled = true;
      btn.style.opacity = 0.5;
    }
    container.appendChild(btn);
  });
}

// Always use the best unlocked light automatically
function getBestUnlockedLight() {
  // Use the highest unlocked from the five options
  const lightKeys = ["quantum", "plasma", "grow", "desk", "candle"];
  for (let i = 0; i < lightKeys.length; i++) {
    if (ownedLights[lightKeys[i]]) return lightKeys[i];
  }
  return "candle";
}

// Patch updatePlantDisplay to always use the best unlocked light
const oldUpdatePlantDisplayWithBestLight = updatePlantDisplay;
updatePlantDisplay = function () {
  currentLight = getBestUnlockedLight();
  oldUpdatePlantDisplayWithBestLight.apply(this, arguments);
  checkAndUnlockLights();
};

// Patch updatePlantDisplay to call renderLightSourceUI
const oldUpdatePlantDisplay = updatePlantDisplay;
updatePlantDisplay = function () {
  oldUpdatePlantDisplay.apply(this, arguments);
  renderLightSourceUI();
};

// ... existing code ...
// Light ON/OFF state and health drain logic
let lightIsOn = true;
let lightOffStartTime = null;
let lightOffHealthDrainRate = 0;

// Add random light failure trigger
function maybeTriggerLightFailure() {
  if (lightIsOn && Math.random() < 0.05) {
    // Increased from 0.01 to 0.05 (5% chance per tick)
    turnOffLights();
  }
}

function turnOffLights() {
  if (!lightIsOn) return;
  lightIsOn = false;
  lightOffStartTime = Date.now();
  // Set initial health to random value between 30-70
  plant.health = Math.floor(Math.random() * 41) + 30;
  // Initial drain rate - much slower now
  lightOffHealthDrainRate = 0.05; // Reduced from 0.1 to 0.05
  addEventToLog("Lights have gone out! Fix them quickly!", "warning");
  updatePlantDisplay();
}

function fixLights() {
  if (!lightIsOn) {
    lightIsOn = true;
    lightOffStartTime = null;
    lightOffHealthDrainRate = 0;
    addEventToLog("Lights are back on!", "info");
    updatePlantDisplay();
  }
}

// Patch updatePlantDisplay to show light status and Fix Lights button
const oldUpdatePlantDisplayWithLightStatus = updatePlantDisplay;
updatePlantDisplay = function () {
  oldUpdatePlantDisplayWithLightStatus.apply(this, arguments);
  // Remove old overlay if it exists
  let oldOverlay = document.getElementById("lightOverlay");
  if (oldOverlay && oldOverlay.parentNode) {
    oldOverlay.parentNode.removeChild(oldOverlay);
  }
  // Find the plant image section container
  let plantImageSection = document.querySelector(".plant-image-section");
  if (!plantImageSection) return;
  // Ensure the container is position: relative
  plantImageSection.style.position = "relative";
  // Create the overlay
  let overlay = document.createElement("div");
  overlay.id = "lightOverlay";
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.cursor = "pointer";
  overlay.style.zIndex = "1000";
  overlay.style.display = lightIsOn ? "none" : "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.transition = "opacity 0.3s ease";
  overlay.onclick = fixLights;
  overlay.innerHTML =
    "<div style=\"color: white; font-family: 'Press Start 2P', monospace; text-align: center; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); font-size: 0.9em;\">Lights Out!<br>Click to Fix</div>";
  plantImageSection.appendChild(overlay);
  // (rest of updatePlantDisplay unchanged)
  // Update light bar based on light state
  const lightLevel = document.getElementById("lightLevel");
  if (lightLevel) {
    lightLevel.style.transition = "width 0.1s linear";
    if (!lightIsOn) {
      // When lights are off, gradually decrease the light bar
      const timeOff = (Date.now() - lightOffStartTime) / 1000; // seconds
      const lightValue = Math.max(0, 100 - timeOff * 2); // Decrease by 2% per second
      lightLevel.style.width = lightValue + "%";
      // Also update plant.light to match
      plant.light = lightValue;
    } else {
      // When lights are on, show full light
      lightLevel.style.width = "100%";
      plant.light = 100;
    }
  }
  // Update stress bar
  const stressLevel = document.getElementById("stressLevel");
  if (stressLevel) {
    stressLevel.style.transition = "width 0.1s linear";
    stressLevel.style.width = plant.stress + "%";
    // Animate color from grey to red as stress increases
    function lerpColor(a, b, t) {
      const ah = a.match(/\w\w/g).map((x) => parseInt(x, 16));
      const bh = b.match(/\w\w/g).map((x) => parseInt(x, 16));
      const rh = ah.map((v, i) => Math.round(v + (bh[i] - v) * t));
      return `#${rh.map((x) => x.toString(16).padStart(2, "0")).join("")}`;
    }
    const base = "23232b";
    const red = "ff1744";
    const t = Math.max(0, Math.min(1, plant.stress / 100));
    const color = lerpColor(base, red, t);
    stressLevel.style.setProperty("--stress-color", color);
  }
};

// ... existing code ...

// Patch startGrowthTimer to handle light-off health drain
const oldStartGrowthTimerWithLight = startGrowthTimer;
startGrowthTimer = function () {
  if (plant.growthTimer) {
    clearInterval(plant.growthTimer);
  }
  feedingTick = 0;
  plant.growthTimer = setInterval(function () {
    // Drain water and nutrients each tick
    if (plant.seedType && plant.soilType) {
      const soil = soilTypes[plant.soilType];
      const stageTicks = growthStages[plant.growthStage].time;
      const waterDrain = soil.waterDrain;
      const nutrientDrain = 0.5;
      plant.water = Math.max(0, plant.water - waterDrain);
      plant.nutrients = Math.max(0, plant.nutrients - nutrientDrain);
    }
    // Feeding logic (unchanged)
    feedingTick++;
    const stageKey =
      ["sprout", "vegetative", "flowering"][plant.growthStage] || "flowering";
    const schedule = plant.feedingSchedule[stageKey];
    if (schedule && schedule.waterTimes > 0) {
      const feedInterval = Math.max(
        1,
        Math.floor(growthStages[plant.growthStage].time / schedule.waterTimes)
      );
      if (feedingTick % feedInterval === 0) {
        plant.water = Math.min(100, plant.water + 20);
        let nuteAmount = 15;
        if (schedule.nutrientMix && nutrientMixes[schedule.nutrientMix]) {
          nuteAmount = nutrientMixes[schedule.nutrientMix].nutrientFeed;
        }
        plant.nutrients = Math.min(100, plant.nutrients + nuteAmount);
        if (schedule.nutrientMix && nutrientMixes[schedule.nutrientMix]) {
          if (!plant[stageKey + "NutrientApplied"]) {
            plant.potencyBoost *= nutrientMixes[schedule.nutrientMix].potency;
            plant.weight *= nutrientMixes[schedule.nutrientMix].yield;
            plant[stageKey + "NutrientApplied"] = true;
          }
        }
      }
    }
    // --- LIGHT OFF HEALTH DRAIN ---
    if (!lightIsOn) {
      // Increase drain rate over time, but much more gradually
      const timeOff = (Date.now() - lightOffStartTime) / 1000; // seconds
      lightOffHealthDrainRate = Math.min(1.0, 0.1 + timeOff / 300); // Max 1.0x drain rate after 5 minutes
      plant.health = Math.max(0, plant.health - lightOffHealthDrainRate);
      // Increase stress more gradually when lights are off
      plant.stress = Math.min(100, plant.stress + 0.5); // Reduced from 1 to 0.5
      // Update light value based on time off
      plant.light = Math.max(0, 100 - timeOff * 2); // Decrease by 2% per second
    } else {
      plant.light = 100;
    }
    // Check for random light failure
    maybeTriggerLightFailure();
    // Update plant health based on resources (unchanged)
    updatePlantStatus();
    plant.healthSum += plant.health;
    plant.healthTicks++;
    // Calculate light efficiency based on light failure system
    if (!lightIsOn) {
      // When lights are off, calculate efficiency based on how much light is left
      const timeOff = (Date.now() - lightOffStartTime) / 1000; // seconds
      const lightValue = Math.max(0, 100 - timeOff * 2); // Decrease by 2% per second
      const efficiency = lightValue / 100; // Efficiency is the percentage of light remaining
      plant.lightEfficiencySum += efficiency;
    } else {
      // When lights are on, perfect efficiency
      plant.lightEfficiencySum += 1.0;
    }
    plant.lightEfficiencyTicks++;
    maybeTriggerEvent();
    if (plant.stageTime >= growthStages[plant.growthStage].time) {
      plant[stageKey + "NutrientApplied"] = false;
      feedingTick = 0;
      advanceGrowthStage();
    }
    plant.stageTime++;
    updatePlantDisplay();
  }, growthTimerInterval);
  console.log("GROWTH TIMER STARTED, interval:", growthTimerInterval);
};

// ... existing code ...

// --- Light Unlock Thresholds ---
const lightUnlockThresholds = [
  { key: "desk", threshold: 420 },
  { key: "grow", threshold: 900 },
  { key: "plasma", threshold: 1500 },
  { key: "quantum", threshold: 2100 },
];

function checkAndUnlockLights() {
  const totalYield = currentPlayerTotalYield; // Use the new, synced value
  let unlockedAny = false;
  lightUnlockThresholds.forEach(({ key, threshold }) => {
    if (!ownedLights[key] && totalYield >= threshold) {
      ownedLights[key] = true;
      addEventToLog(
        `Unlocked ${lightSources[key].name} for reaching ${threshold}g total yield!`,
        "info"
      );
      unlockedAny = true;
    }
  });
  // If any new light was unlocked, select the highest unlocked light
  if (unlockedAny) {
    // Get all unlocked lights in order of threshold
    let unlockedKeys = lightUnlockThresholds
      .filter(({ key }) => ownedLights[key])
      .map(({ key }) => key);
    if (unlockedKeys.length > 0) {
      currentLight = unlockedKeys[unlockedKeys.length - 1];
      renderLightSourceUI();
    }
  }
}

// Patch updatePlantDisplay to check for light unlocks
const oldUpdatePlantDisplayWithUnlock = updatePlantDisplay;
updatePlantDisplay = function () {
  oldUpdatePlantDisplayWithUnlock.apply(this, arguments);
  checkAndUnlockLights();
};

const oldInitializeGameWithUnlock = initializeGame;
initializeGame = function () {
  oldInitializeGameWithUnlock.apply(this, arguments);
  checkAndUnlockLights();
};

// Helper to load and display global leaderboards
async function loadAndDisplayGlobalLeaderboards() {
  try {
    const potencyLeaderboard = await PlayFabService.getLeaderboard("potency");
    const yieldLeaderboard = await PlayFabService.getLeaderboard("yield");
    ViewService.updateGlobalPotencyScores(potencyLeaderboard);
    ViewService.updateGlobalYieldScores(yieldLeaderboard);
  } catch (e) {
    console.error("Failed to load global leaderboards:", e);
  }
}

// Helper to load and display global leaderboards in the right panel
async function loadAndDisplayGlobalLeaderboardsPanel() {
  try {
    const potencyLeaderboard = await PlayFabService.getLeaderboard(
      "potency",
      100
    );
    const yieldLeaderboard = await PlayFabService.getLeaderboard("yield", 100);
    ViewService.updateGlobalPotencyPanel(potencyLeaderboard); // Highest Potency (top single scores)

    // New: Fetch the dedicated TotalYield leaderboard
    const totalYieldLeaderboard = await PlayFabService.getLeaderboard(
      "TotalYield",
      10
    );
    const totalYieldArr = totalYieldLeaderboard.map((entry) => ({
      PlayFabId: entry.PlayFabId,
      DisplayName: entry.DisplayName || "Anonymous",
      totalYield: entry.StatValue,
    }));
    ViewService.updateGlobalYieldPanel(totalYieldArr);

    // Average Potency: average all potency scores per player
    const potencyMap = {};
    potencyLeaderboard.forEach((entry) => {
      if (!potencyMap[entry.PlayFabId]) {
        potencyMap[entry.PlayFabId] = {
          sum: 0,
          count: 0,
          DisplayName: entry.DisplayName,
        };
      }
      potencyMap[entry.PlayFabId].sum += entry.StatValue;
      potencyMap[entry.PlayFabId].count += 1;
    });
    const avgPotencyArr = Object.entries(potencyMap)
      .map(([PlayFabId, obj]) => ({
        PlayFabId,
        DisplayName: obj.DisplayName,
        avgPotency: Math.round(obj.sum / obj.count),
        count: obj.count,
      }))
      .sort((a, b) => b.avgPotency - a.avgPotency);
    ViewService.updateGlobalAveragePotencyPanel(avgPotencyArr);
  } catch (e) {
    console.error("Failed to load global leaderboards:", e);
  }
}

// Add leaderboard panel toggle logic
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    // ... existing code ...
    const leaderboardTabLabel = document.getElementById("leaderboardTabLabel");
    const leaderboardTab = document.getElementById("leaderboardTab");
    if (leaderboardTabLabel && leaderboardTab) {
      leaderboardTabLabel.addEventListener("click", function () {
        leaderboardTab.classList.toggle("open");
      });
    }
  });
} else {
  // ... existing code ...
  const leaderboardTabLabel = document.getElementById("leaderboardTabLabel");
  const leaderboardTab = document.getElementById("leaderboardTab");
  if (leaderboardTabLabel && leaderboardTab) {
    leaderboardTabLabel.addEventListener("click", function () {
      leaderboardTab.classList.toggle("open");
    });
  }
}

// --- Seed Unlock System ---
const seedUnlockThresholds = [
  ...Array(6).fill(0), // First 6 seeds unlocked at 0 yield
  150, // 7th seed unlocks at 150g
  250, // 8th seed
  350, // 9th seed
  450, // 10th seed
  550, // 11th seed
  650, // 12th seed - PRIZE 1: Skullberry
  750, // 13th seed
  850, // 14th seed
  950, // 15th seed
  1050, // 16th seed
  1150, // 17th seed
  1250, // 18th seed - PRIZE 2: Necroblossom
  1350, // 19th seed
  1450, // 20th seed
  1550, // 21st seed
  1650, // 22nd seed
  1750, // 23rd seed
  1850, // 24th seed - PRIZE 3: Spectral Sage
  1950, // 25th seed
  2050, // 26th seed
  2150, // 27th seed
  2250, // 28th seed
  2350, // 29th seed
  2450, // 30th seed - PRIZE 4: Crypt Corn
  2550, // 31st seed - PRIZE 5: Phantom Poppy
  2650, // 32nd seed
  2750, // 33rd seed
  2850, // 34th seed
  2950, // 35th seed
  3050, // 36th seed
  3150, // 37th seed
  3250, // 38th seed
  3350, // 39th seed
  3450, // 40th seed
  3550, // 41st seed
  3650, // 42nd seed
  3750, // 43rd seed
  3850, // 44th seed
  3950, // 45th seed
  4050, // 46th seed
  4150, // 47th seed
  4250, // 48th seed
  4350, // 49th seed
  4450, // 50th seed
  4550, // 51st seed
  4650, // 52nd seed
  4750, // 53rd seed
  4850, // 54th seed
  4950, // 55th seed
  5050, // 56th seed
  5150, // 57th seed
  5250, // 58th seed
  5350, // 59th seed
  5450, // 60th seed
  5550, // 61st seed
  5650, // 62nd seed
  5750, // 63rd seed
  5850, // 64th seed
  5950, // 65th seed
  6050, // 66th seed
  6150, // 67th seed
  6250, // 68th seed
  6350, // 69th seed
];
let unlockedSeeds = {};
function checkAndUnlockSeeds() {
  const totalYield = currentPlayerTotalYield; // Use the new, synced value
  let changed = false;

  console.log("checkAndUnlockSeeds debug:");
  console.log("totalYield:", totalYield);
  console.log("unlockedSeeds before:", unlockedSeeds);

  Object.keys(seedProperties).forEach((key, idx) => {
    const threshold = seedUnlockThresholds[idx] ?? Infinity; // Default to Infinity if threshold missing
    if (!unlockedSeeds[key] && totalYield >= threshold) {
      unlockedSeeds[key] = true;
      changed = true;
      console.log(
        `Unlocked seed: ${seedProperties[key].name} (${key}) at ${totalYield}g total yield`
      );
    }
  });

  // Ensure first 6 seeds are always unlocked (they have 0 threshold)
  for (let i = 0; i < 6; i++) {
    const key = Object.keys(seedProperties)[i];
    if (key && !unlockedSeeds[key]) {
      unlockedSeeds[key] = true;
      changed = true;
      console.log(
        `Auto-unlocked first 6 seed: ${seedProperties[key].name} (${key})`
      );
    }
  }

  console.log("unlockedSeeds after:", unlockedSeeds);
  console.log(
    "Total unlocked:",
    Object.keys(unlockedSeeds).filter((k) => unlockedSeeds[k]).length
  );

  if (changed) {
    console.log("Seed unlocks changed, calling renderSeedOptions()");
    renderSeedOptions();
  }
}
function renderSeedUnlocksModal() {
  const modal = document.getElementById("seedUnlocksModal");
  const grid = document.getElementById("seedUnlocksGrid");
  grid.innerHTML = "";

  // Find the next unlock threshold
  const totalYield = highScores.totalYield[currentGrower] || 0;
  let nextUnlockThreshold = null;
  Object.keys(seedProperties).forEach((key, idx) => {
    const threshold = seedUnlockThresholds[idx] ?? Infinity;
    if (
      !unlockedSeeds[key] &&
      threshold !== Infinity &&
      (nextUnlockThreshold === null || threshold < nextUnlockThreshold)
    ) {
      nextUnlockThreshold = threshold;
    }
  });

  // Create the grid for seeds
  const seedGrid = document.createElement("div");
  seedGrid.style.display = "grid";
  seedGrid.style.gridTemplateColumns = "repeat(8, 53px)";
  seedGrid.style.gap = "12px";

  Object.keys(seedProperties).forEach((key, idx) => {
    const seed = seedProperties[key];
    const unlocked = unlockedSeeds[key];
    const threshold = seedUnlockThresholds[idx] ?? Infinity;

    const seedContainer = document.createElement("div");
    seedContainer.style.position = "relative";
    seedContainer.style.width = "53px";
    seedContainer.style.height = "53px";
    seedContainer.style.borderRadius = "8px";
    seedContainer.style.overflow = "hidden";

    if (unlocked) {
      // Show actual seed image for unlocked seeds
      const img = document.createElement("img");
      img.src = `img/selections/${seed.image}`;
      img.alt = seed.name;
      img.title = seed.name;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.borderRadius = "8px";
      seedContainer.appendChild(img);
    } else {
      // Show question mark for locked seeds
      seedContainer.style.background = "#18141a";
      seedContainer.style.display = "flex";
      seedContainer.style.alignItems = "center";
      seedContainer.style.justifyContent = "center";

      const questionMark = document.createElement("div");
      questionMark.textContent = "?";
      questionMark.style.color = "#333";
      questionMark.style.fontFamily = "'Press Start 2P', monospace";
      questionMark.style.fontSize = "1.5em";
      questionMark.style.textShadow = "none";
      seedContainer.appendChild(questionMark);

      // Add yield requirement for the next unlockable seed
      if (threshold === nextUnlockThreshold) {
        const yieldText = document.createElement("div");
        yieldText.style.position = "absolute";
        yieldText.style.top = "50%";
        yieldText.style.left = "50%";
        yieldText.style.transform = "translate(-50%, -50%)";
        yieldText.style.color = "#ffd700";
        yieldText.style.fontFamily = "'Press Start 2P', monospace";
        yieldText.style.fontSize = "0.7em";
        yieldText.style.textShadow = "1px 1px 2px #000";
        yieldText.style.pointerEvents = "none";
        yieldText.textContent = threshold + "g";
        seedContainer.appendChild(yieldText);
      }
    }

    seedGrid.appendChild(seedContainer);
  });

  grid.appendChild(seedGrid);
  modal.classList.remove("hidden");
}
document.addEventListener("DOMContentLoaded", function () {
  const showBtn = document.getElementById("showSeedUnlocksBtn");
  if (showBtn) showBtn.onclick = renderSeedUnlocksModal;
  const closeBtn = document.getElementById("closeSeedUnlocksBtn");
  if (closeBtn)
    closeBtn.onclick = () => {
      document.getElementById("seedUnlocksModal").classList.add("hidden");
    };
});
// Patch renderSeedOptions to only show unlocked seeds
const oldGetRandomSeeds = getRandomSeeds;
getRandomSeeds = function () {
  const keys = Object.keys(seedProperties).filter((k) => unlockedSeeds[k]);

  console.log("getRandomSeeds debug:");
  console.log("unlockedSeeds:", unlockedSeeds);
  console.log("filtered keys:", keys);
  console.log("keys.length:", keys.length);

  // Fallback: if no seeds are unlocked yet, use the first 3 seeds (which should always be unlocked)
  if (keys.length === 0) {
    console.log("No seeds unlocked, using fallback of first 3 seeds");
    return Object.keys(seedProperties).slice(0, 3);
  }

  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  const result = keys.slice(0, 3);
  console.log("Returning seeds:", result);
  return result;
};
// After yield is added, checkAndUnlockSeeds
const oldAddScore = addScore;
addScore = async function (type, score) {
  await oldAddScore.apply(this, arguments);
  if (type === "yield") checkAndUnlockSeeds();
};
// On login, unlock seeds based on current yield
const oldLoadHighScores = loadHighScores;
loadHighScores = async function () {
  await oldLoadHighScores.apply(this, arguments);

  // Fetch the synced total yield from the leaderboard
  const playerStats = await PlayFabService.getPlayerLeaderboardEntry(
    "TotalYield"
  );
  currentPlayerTotalYield = playerStats ? playerStats.StatValue : 0;

  checkAndUnlockSeeds();
  testSeedUnlocks(); // Test the unlock system
};
// ... existing code ...

// Add this function to update the persistent seed count display
function updatePersistentSeedCount() {
  const el = document.getElementById("persistentSeedCount");
  if (el && currentGrower && currentGrower.isLoggedIn()) {
    el.innerHTML = `Seeds: <span style='color:#fff;'>${currentGrower.getLives()}</span>`;
  } else if (el) {
    el.innerHTML = `Seeds: <span style='color:#fff;'>0</span>`;
  }
}

// Update this display after loading high scores, changing lives, or logging in
// In loadHighScores, after updateHighScoresDisplay():
// ...
updateHighScoresDisplay();
+updatePersistentSeedCount();
// ...
// setLivesForPlayer function removed - now using currentGrower.setLives(val); currentGrower.saveData();
// ...
// In the login flow, after setting grower name and loading high scores, also call updatePersistentSeedCount if not already covered.
// ... existing code ...

function createUnlockButton(unlockObj) {
  const button = document.createElement("button");
  button.style.minWidth = "90px";
  button.style.maxWidth = "120px";
  button.style.padding = "6px 4px";
  button.style.margin = "0px 2px";
  button.style.fontFamily = '"Press Start 2P", monospace';
  button.style.fontSize = "0.65em";
  button.style.borderRadius = "6px";
  button.style.border = "1.5px solid #bfcfff";
  button.style.background = unlockObj.unlocked ? "#2ecc71" : "#23232b";
  button.style.color = "#ffffff";
  button.style.cursor = "default";
  button.style.boxShadow = "none";
  button.style.display = "flex";
  button.style.flexDirection = "column";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.height = "54px";
  button.style.lineHeight = "1.1";

  let unlockInfo = "";
  if (!unlockObj.unlocked) {
    button.disabled = true;
    button.style.opacity = "0.5";
    unlockInfo = `<div style='font-size:0.7em;color:#bfcfff;opacity:0.7;'>${unlockObj.threshold}g</div>`;
  }

  button.innerHTML = `
        <div style='font-weight:bold;'>${unlockObj.name}</div>
        ${unlockInfo}
    `;

  return button;
}

// ... existing code ...

function renderUnlocksSection() {
  const container = document.getElementById("toolsTabContent");
  if (!container) return;

  container.innerHTML = "";

  const unlockables = [
    { name: "Candle Light", image: "img/path/to/candle.png", unlockValue: 100 },
    { name: "Desk Lamp", image: "img/path/to/desk.png", unlockValue: 500 },
    { name: "Grow Light", image: "img/path/to/grow.png", unlockValue: 1000 },
    { name: "Plasma Lamp", image: "img/path/to/plasma.png", unlockValue: 2000 },
    {
      name: "Quantum Board",
      image: "img/path/to/quantum.png",
      unlockValue: 5000,
    },
  ];

  const totalYield = highScores.totalYield[currentGrower] || 0;
  let nextUnlockFound = false;

  unlockables.forEach((item) => {
    const unlocked = totalYield >= item.unlockValue;
    const isNextUnlock = !unlocked && !nextUnlockFound;
    if (isNextUnlock) nextUnlockFound = true;

    const button = createUnlockButton(
      item.name,
      item.image,
      unlocked,
      item.unlockValue,
      isNextUnlock
    );
    container.appendChild(button);
  });
}

// ... existing code ...

function renderLightSourceButtons() {
  const container = document.getElementById("lightSourceContainer");
  if (!container) return;

  container.style.display = "flex";
  container.style.flexFlow = "row";
  container.style.justifyContent = "center";
  container.style.alignItems = "center";
  container.style.gap = "8px";
  container.style.margin = "10px 0px";
  container.innerHTML = "";

  const sources = [
    { name: "Candle Light", unlockValue: 100 },
    { name: "Desk Lamp", unlockValue: 420 },
    { name: "Grow Light", unlockValue: 900 },
    { name: "Plasma Lamp", unlockValue: 1500 },
    { name: "Quantum Board", unlockValue: 2100 },
  ];

  const totalYield = currentPlayerTotalYield; // Use the new, synced value

  sources.forEach((source) => {
    const isUnlocked = totalYield >= source.unlockValue;
    const button = document.createElement("button");

    button.style.minWidth = "90px";
    button.style.maxWidth = "120px";
    button.style.padding = "6px 4px";
    button.style.margin = "0px 2px";
    button.style.fontFamily = '"Press Start 2P", monospace';
    button.style.fontSize = "0.7em"; // Smaller font size for all text
    button.style.borderRadius = "6px";
    button.style.border = "1.5px solid #bfcfff";
    button.style.background = isUnlocked ? "#2ecc71" : "#23232b";
    button.style.color = "#ffffff";
    button.style.cursor = "default";
    button.style.boxShadow = "none";
    button.style.display = "flex";
    button.style.flexDirection = "column";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.height = "54px";
    button.style.lineHeight = "1.1";

    if (!isUnlocked) {
      button.disabled = true;
      button.style.opacity = "0.5";
    }

    const nameDiv = document.createElement("div");
    nameDiv.style.fontWeight = "bold";
    nameDiv.style.fontSize = "0.8em";
    nameDiv.textContent = source.name;
    button.appendChild(nameDiv);

    if (!isUnlocked) {
      const unlockDiv = document.createElement("div");
      unlockDiv.style.fontSize = "0.75em";
      unlockDiv.style.color = "#bfcfff";
      unlockDiv.style.opacity = "0.85";
      unlockDiv.style.marginTop = "4px";
      unlockDiv.textContent = source.unlockValue + "g";
      button.appendChild(unlockDiv);
    }

    container.appendChild(button);
  });
}

// ... existing code ...

// Test function to verify seed unlock system
function testSeedUnlocks() {
  // console.log("=== Testing Seed Unlock System ===");
  // console.log(
  //   "Current total yield:",
  //   highScores.totalYield[currentGrower] || 0
  // );
  // console.log("Seed unlock thresholds:", seedUnlockThresholds);
  // console.log("Total seeds available:", Object.keys(seedProperties).length);
  // console.log(
  //   "Currently unlocked seeds:",
  //   Object.keys(unlockedSeeds).filter((k) => unlockedSeeds[k])
  // );
  // console.log(
  //   "Unlocked seed names:",
  //   Object.keys(unlockedSeeds)
  //     .filter((k) => unlockedSeeds[k])
  //     .map((k) => seedProperties[k].name)
  // );
  // console.log(
  //   "Next unlock threshold:",
  //   seedUnlockThresholds[
  //     Object.keys(unlockedSeeds).filter((k) => unlockedSeeds[k]).length
  //   ]
  // );
  // console.log("=== End Test ===");
}

// Add test function to window for easy access
window.testSeedUnlocks = testSeedUnlocks;
