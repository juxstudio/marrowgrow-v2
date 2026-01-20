const TEST_MODE = true;

// Global event state variables (used by missing-data.js event functions)
let pestActive = false;
let raiderActive = false;
let nutrientActive = false;

// Cache for high scores to avoid multiple PlayFab calls
let highScoresCache = null;
let lastHighScoresFetch = 0;
const HIGH_SCORES_CACHE_DURATION = 10000; // 10 seconds

// Cache for seed lockout timestamp to avoid PlayFab calls during countdown
let seedLockoutTimestampCache = null;
let lastLockoutFetch = 0;
const LOCKOUT_CACHE_DURATION = 30000; // 30 seconds

// Helper function to clear all caches
function clearAllCaches() {
  console.log("🧹 [CACHE] Clearing all caches");
  highScoresCache = null;
  lastHighScoresFetch = 0;
  seedLockoutTimestampCache = null;
  lastLockoutFetch = 0;
  syncQueue = [];
  isSyncing = false;
}

// ========================================
// HIDDEN HOTSPOT UI SYSTEM
// ========================================

// Toggle modal visibility for a component
function toggleModal(componentId, expand) {
  const hotspot = document.getElementById(`${componentId}Hotspot`);
  const modal = document.getElementById(`${componentId}Modal`);

  if (!hotspot || !modal) {
    console.warn(`[HOTSPOT] Missing elements for ${componentId}`);
    return;
  }

  if (expand) {
    hotspot.classList.add('hidden');
    modal.classList.add('expanded');
    console.log(`[HOTSPOT] Expanded ${componentId} modal`);
  } else {
    hotspot.classList.remove('hidden');
    modal.classList.remove('expanded');
    console.log(`[HOTSPOT] Collapsed ${componentId} modal`);
  }
}

// Initialize hotspot handlers for all components
function initializeHotspotUI() {
  console.log('[HOTSPOT] Initializing hidden hotspot UI system...');

  // Selection component (Grow Lab - Tank)
  const selectionHotspot = document.getElementById('selectionHotspot');
  const minimizeSelectionBtn = document.getElementById('minimizeSelectionBtn');

  if (selectionHotspot) {
    selectionHotspot.addEventListener('click', () => toggleModal('selection', true));
  }
  if (minimizeSelectionBtn) {
    minimizeSelectionBtn.addEventListener('click', () => toggleModal('selection', false));
  }

  // Vault component (Door)
  const vaultHotspot = document.getElementById('vaultHotspot');
  const minimizeVaultBtn = document.getElementById('minimizeVaultBtn');

  if (vaultHotspot) {
    vaultHotspot.addEventListener('click', () => toggleModal('vault', true));
  }
  if (minimizeVaultBtn) {
    minimizeVaultBtn.addEventListener('click', () => toggleModal('vault', false));
  }

  // Leaderboard component (Screen)
  const leaderboardHotspot = document.getElementById('leaderboardHotspot');
  const minimizeLeaderboardBtn = document.getElementById('minimizeLeaderboardBtn');

  if (leaderboardHotspot) {
    leaderboardHotspot.addEventListener('click', () => toggleModal('leaderboard', true));
  }
  if (minimizeLeaderboardBtn) {
    minimizeLeaderboardBtn.addEventListener('click', () => toggleModal('leaderboard', false));
  }

  console.log('[HOTSPOT] Hotspot UI initialized successfully');

  // Initialize room navigation overlays
  initializeRoomNavigation();
}

// Initialize room navigation overlay handlers
function initializeRoomNavigation() {
  console.log('[NAV] Initializing room navigation overlays...');

  // Selection (Grow Lab) - left goes to Vault, right goes to Leaderboard
  const selectionNavLeft = document.getElementById('selectionNavLeft');
  const selectionNavRight = document.getElementById('selectionNavRight');

  if (selectionNavLeft) {
    selectionNavLeft.addEventListener('click', () => {
      console.log('[NAV] Navigating from Selection to Vault');
      showComponent('vault');
    });
  }
  if (selectionNavRight) {
    selectionNavRight.addEventListener('click', () => {
      console.log('[NAV] Navigating from Selection to Leaderboard');
      showComponent('leaderboard');
    });
  }

  // Vault - right goes to Grow Lab (Selection)
  const vaultNavRight = document.getElementById('vaultNavRight');

  if (vaultNavRight) {
    vaultNavRight.addEventListener('click', () => {
      console.log('[NAV] Navigating from Vault to Selection');
      showComponent('selection');
    });
  }

  // Leaderboard - left goes to Grow Lab (Selection)
  const leaderboardNavLeft = document.getElementById('leaderboardNavLeft');

  if (leaderboardNavLeft) {
    leaderboardNavLeft.addEventListener('click', () => {
      console.log('[NAV] Navigating from Leaderboard to Selection');
      showComponent('selection');
    });
  }

  console.log('[NAV] Room navigation initialized successfully');
}


// Function to handle light equipment changes - defined early to prevent reference errors
async function equipLight(lightKey) {
  if (!lightSources[lightKey]) {
    console.warn("Cannot equip", lightKey, ": light not defined");
    return;
  }

  // If appears locked, re-check unlocks from real TotalYield first
  if (!lightSources[lightKey].unlocked) {
    await checkAndUnlockLights();
  }
  if (!lightSources[lightKey].unlocked) {
    console.warn(`Cannot equip ${lightKey}: not unlocked`);
    return;
  }

  currentLight = lightKey;
  manualLightSelection = true;
  try {
    localStorage.setItem("currentLight", lightKey);
    localStorage.setItem("manualLightSelection", "true");
  } catch (e) { }

  updateLightSources();
  updateSelectionIcons();
  if (typeof populateVaultEquips === "function") populateVaultEquips();

  const detailView = document.getElementById("detailView");
  if (detailView && typeof showEquipDetails === "function") {
    showEquipDetails(lightKey, detailView);
  }

  console.log(`Equipped light: ${lightSources[lightKey].name}`);
  if (typeof addEventToLog === "function") {
    addEventToLog(`Equipped ${lightSources[lightKey].name}!`, "info");
  }
}

// Make sure the function is globally accessible
window.equipLight = equipLight;

// SPA Component Manager
function showComponent(componentName) {
  console.log(`🔄 [DEBUG] Showing component: ${componentName}`);

  // Reset state when returning to selection screen
  if (componentName === "selection") {
    resetGameState();
  }

  // Enable navigation buttons for all components except game simulation
  if (componentName !== "game") {
    enableNavigationButtons();
  }

  // Hide all components
  document.querySelectorAll(".component").forEach((component) => {
    component.classList.remove("active");
  });

  // Show target component
  const targetComponent = document.getElementById(componentName + "-component");
  if (targetComponent) {
    targetComponent.classList.add("active");
    console.log(`✅ Switched to ${componentName} component`);

    // Change background image based on component
    changeBackgroundForComponent(componentName);

    // Test: Verify only one component is active
    const activeComponents = document.querySelectorAll(".component.active");
    if (activeComponents.length !== 1) {
      console.warn(`⚠️ Multiple components active: ${activeComponents.length}`);
    }
  } else {
    console.error(`❌ Component ${componentName}-component not found`);
  }

  // Re-initialize selection screen if needed
  if (componentName === "selection") {
    initializeSelectionScreen();
  }

  // Initialize vault tabs and content when showing vault
  if (componentName === "vault") {
    initializeVaultTabs();
    populateVaultSeeds();
    populateVaultBadges();
    populateVaultEquips();
  }

  // Initialize leaderboard when showing leaderboard
  if (componentName === "leaderboard") {
    loadLeaderboardData();
  }

  // Update header title based on component
  updateHeaderTitle(componentName);

  // Always refresh lives UI when switching components
  refreshLivesUI();
}

// Update header title based on active component
function updateHeaderTitle(componentName) {
  const titleElement = document.getElementById('growlabLink');
  if (!titleElement) return;

  const titles = {
    'selection': 'GROWLAB',
    'feeding': 'GROWLAB',
    'game': 'GROWLAB',
    'harvest': 'GROWLAB',
    'vault': 'VAULT',
    'leaderboard': 'LEADERBOARD'
  };

  titleElement.textContent = titles[componentName] || 'GROWLAB';
  console.log(`[NAV] Header title updated to: ${titleElement.textContent}`);
}

// Function to change background image based on active component
function changeBackgroundForComponent(componentName) {
  const body = document.body;
  const loadingScreen = document.getElementById("loadingScreen");

  // Define background images for each component
  const backgroundImages = {
    vault: "/img/selections/vault.png",
    leaderboard: "/img/selections/leaderboard.png",
    selection: "/img/selections/bg.png",
    feeding: "/img/selections/bg.png",
    game: "/img/selections/bg.png",
    harvest: "/img/selections/bg.png",
  };

  const backgroundImage =
    backgroundImages[componentName] || "/img/selections/bg.png";

  // Update body background
  body.style.backgroundImage = `url("${backgroundImage}")`;

  // Update loading screen background to match
  if (loadingScreen) {
    loadingScreen.style.backgroundImage = `url("${backgroundImage}")`;
  }

  console.log(`🎨 Background changed to: ${backgroundImage}`);
}

// Test function for component switching
function testComponentSwitching() {
  console.log("🧪 Testing component switching...");

  const components = [
    "selection",
    "feeding",
    "game",
    "harvest",
    "vault",
    "leaderboard",
  ];

  components.forEach((component, index) => {
    setTimeout(() => {
      console.log(`Testing ${component}...`);
      showComponent(component);
    }, index * 500);
  });

  // Return to selection after testing
  setTimeout(() => {
    showComponent("selection");
    console.log("✅ Component switching test complete");
  }, components.length * 500 + 500);
}

document.addEventListener("DOMContentLoaded", async function () {
  console.log("DOM loaded, initializing...");

  // Show loading screen (already visible by default)
  const loadingScreen = document.getElementById("loadingScreen");
  const authPanel = document.querySelector(".authPanel");
  const mainGameScreen = document.getElementById("mainGameScreen");

  try {
    // Wait for PlayFab to be available
    await waitForPlayFab();

    console.log("Initializing PlayFab...");
    PlayFabService.initialize();
    console.log("PlayFab initialized successfully");

    // Try auto-login
    const autoLoggedIn = await checkAutoLogin();

    if (autoLoggedIn) {
      console.log("Auto-login successful, showing game");
      // Hide loading, show game
      loadingScreen.style.display = "none";
      mainGameScreen.style.display = "flex";

      // Initialize hidden hotspot UI system
      initializeHotspotUI();
    } else {
      console.log("No valid session, showing auth panel");
      // Hide loading, show auth
      loadingScreen.style.display = "none";
      authPanel.style.display = "block";

      // Show dev login button in development mode
      if (typeof ENVIRONMENT !== 'undefined' && ENVIRONMENT === 'development') {
        const devBtn = document.getElementById('devLoginBtn');
        if (devBtn) {
          devBtn.style.display = 'block';
          console.log("🔧 [DEV] Dev login button enabled");
        }
      }
    }
  } catch (error) {
    console.error("Initialization failed:", error);
    // On error, show auth panel
    loadingScreen.style.display = "none";
    authPanel.style.display = "block";

    // Also show dev button on error in dev mode
    if (typeof ENVIRONMENT !== 'undefined' && ENVIRONMENT === 'development') {
      const devBtn = document.getElementById('devLoginBtn');
      if (devBtn) {
        devBtn.style.display = 'block';
      }
    }
  }
});

// Helper function to wait for PlayFab to be ready
function waitForPlayFab() {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait

    const check = () => {
      if (
        typeof PlayFab !== "undefined" &&
        typeof PlayFabService !== "undefined"
      ) {
        resolve();
      } else if (attempts >= maxAttempts) {
        reject(new Error("PlayFab failed to load"));
      } else {
        attempts++;
        setTimeout(check, 100);
      }
    };

    check();
  });
}

let googleTokenClient;

// ========================================
// FEEDING SCHEDULE GLOBAL STATE
// ========================================

// Google Authentication Functions
function initializeGoogleClient() {
  // Check if Google SDK is loaded
  if (typeof google === "undefined") {
    console.log("Google SDK not loaded yet, retrying in 500ms...");
    setTimeout(initializeGoogleClient, 500);
    return;
  }

  // Check if the specific Google accounts API is available
  if (!google.accounts || !google.accounts.oauth2) {
    console.log("Google OAuth2 API not ready yet, retrying in 500ms...");
    setTimeout(initializeGoogleClient, 500);
    return;
  }

  console.log("Initializing Google token client...");
  try {
    googleTokenClient = google.accounts.oauth2.initTokenClient({
      client_id:
        "225844190403-6mfn5gaqs9fcpu0err4kk1g335170g6t.apps.googleusercontent.com", // Your Client ID
      scope: "https://www.googleapis.com/auth/userinfo.profile",
      callback: (tokenResponse) => {
        // This callback function is triggered after the user signs in
        // and grants permission.
        if (tokenResponse && tokenResponse.access_token) {
          loginToPlayFabWithGoogle(tokenResponse.access_token);
        }
      },
    });
    console.log("Google token client initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Google token client:", error);
    // Retry after a delay
    setTimeout(initializeGoogleClient, 1000);
  }
}

// Google Client will be initialized by initClient() in HTML after SDK loads

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

// Game state variables
let currentGrower = null;
let highScores = {
  potency: [],
  yield: [],
  potencyHistory: {},
  totalYield: {},
  seedBank: {},
  seedLives: {},
};

// Placeholder functions that need to be implemented or imported
function updateUserDisplay(userName) {
  // This function should update the UI to show the current user
  console.log("User display updated:", userName);
}

async function loadHighScores(forceRefresh = false) {
  const now = Date.now();

  // Return cached data if still valid and not forcing refresh
  if (
    !forceRefresh &&
    highScoresCache &&
    now - lastHighScoresFetch < HIGH_SCORES_CACHE_DURATION
  ) {
    console.log("🔍 [CACHE] Using cached high scores");
    highScores = highScoresCache;
    updateHighScoresDisplay();
    updatePersistentSeedCount();
    return;
  }

  try {
    console.log("🔍 [CACHE] Fetching fresh high scores from PlayFab");
    highScores = await PlayFabService.loadHighScores();
    if (!highScores.potency) highScores.potency = [];
    if (!highScores.yield) highScores.yield = [];
    if (!highScores.potencyHistory) highScores.potencyHistory = {};
    if (!highScores.totalYield) highScores.totalYield = {};
    if (!highScores.seedBank) highScores.seedBank = {};
    if (!highScores.seedLives) highScores.seedLives = {};

    // Update cache
    highScoresCache = { ...highScores };
    lastHighScoresFetch = now;

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

function loadAndDisplayGlobalLeaderboardsPanel() {
  // This function should load and display global leaderboards
  return Promise.resolve();
}

function setLivesForPlayer(val) {
  if (!highScores.seedLives) highScores.seedLives = {};
  highScores.seedLives[currentGrower] = val;

  // Update cache immediately
  if (highScoresCache) {
    highScoresCache.seedLives = { ...highScores.seedLives };
  }

  // Update UI immediately
  updatePersistentSeedCount();
  updateLivesDisplay();

  // Background sync (non-blocking)
  saveHighScores(false);
}

// Background sync queue for high scores
let syncQueue = [];
let isSyncing = false;

// Fix the saveHighScores function with background sync
async function saveHighScores(immediate = false) {
  if (immediate) {
    // Force immediate sync for critical operations
    try {
      console.log("🔍 [SYNC] Immediate sync to PlayFab");
      await PlayFabService.saveHighScores(highScores);
      // Update cache after successful sync
      highScoresCache = { ...highScores };
      lastHighScoresFetch = Date.now();
    } catch (error) {
      console.error("Failed to save high scores:", error);
      throw error; // Re-throw for critical operations
    }
  } else {
    // Background sync for non-critical updates
    console.log("🔍 [SYNC] Queuing background sync");
    syncQueue.push({ ...highScores });
    processSyncQueue();
  }
}

// Process sync queue in background
async function processSyncQueue() {
  if (isSyncing || syncQueue.length === 0) return;

  isSyncing = true;
  const dataToSync = syncQueue.shift();

  try {
    console.log("🔍 [SYNC] Background sync to PlayFab");
    await PlayFabService.saveHighScores(dataToSync);
    // Update cache after successful sync
    highScoresCache = { ...dataToSync };
    lastHighScoresFetch = Date.now();
  } catch (error) {
    console.warn("Background sync failed, will retry:", error);
    // Re-queue for retry
    syncQueue.unshift(dataToSync);
  } finally {
    isSyncing = false;
    // Process next item in queue
    if (syncQueue.length > 0) {
      setTimeout(processSyncQueue, 1000);
    }
  }
}

function updatePersistentSeedCount() {
  // This function should update the seed count display
  console.log("Seed count updated");
}

function checkSeedLockoutUI() {
  // This function should check and update the seed lockout UI
  console.log("Seed lockout UI checked");
}

function updateHighScoresDisplay() {
  // This function should update the high scores display
  console.log("High scores display updated");
}

// Daily spin functions moved to daily-spin.js for better performance

async function getSeedLockoutTimestamp(forceRefresh = false) {
  if (!currentGrower) return 0;

  const now = Date.now();

  // Return cached data if still valid and not forcing refresh
  if (
    !forceRefresh &&
    seedLockoutTimestampCache !== null &&
    now - lastLockoutFetch < LOCKOUT_CACHE_DURATION
  ) {
    console.log("🔍 [CACHE] Using cached lockout timestamp");
    return seedLockoutTimestampCache;
  }

  try {
    console.log("🔍 [CACHE] Fetching fresh lockout timestamp from PlayFab");
    const timestamp = await PlayFabService.getSeedLockoutTimestamp(
      currentGrower
    );

    // Update cache
    seedLockoutTimestampCache = timestamp;
    lastLockoutFetch = now;

    return timestamp;
  } catch (error) {
    console.error("Failed to get lockout timestamp:", error);
    return 0;
  }
}

async function clearSeedLockoutTimestamp() {
  if (currentGrower) {
    await PlayFabService.clearSeedLockoutTimestamp(currentGrower);
    // Clear cache after successful clear
    seedLockoutTimestampCache = null;
    lastLockoutFetch = 0;
  }
}

async function getPlayerTotalYield() {
  // 1) Prefer authoritative PlayFab stat if available
  if (typeof PlayFabService?.getPlayerLeaderboardEntry === "function") {
    try {
      const entry = await PlayFabService.getPlayerLeaderboardEntry(
        "TotalYield"
      );
      if (entry && typeof entry.StatValue === "number") return entry.StatValue;
    } catch (e) {
      console.warn("getPlayerTotalYield: PlayFab stat lookup failed:", e);
    }
  }
  // 2) Fallback to local cache
  try {
    if (highScores?.totalYield && currentGrower in highScores.totalYield) {
      const v = Number(highScores.totalYield[currentGrower]);
      if (!Number.isNaN(v)) return v;
    }
  } catch (e) {
    console.warn("getPlayerTotalYield: local fallback failed:", e);
  }
  return 0;
}

// Add this function to check if seeds should be replenished
async function checkAndReplenishSeeds() {
  if (!currentGrower) return;

  const lives = getLivesForPlayer();

  // If player has seeds, no need to check
  if (lives > 0) return;

  // Check lockout timestamp
  const lastLock = await getSeedLockoutTimestamp();
  if (!lastLock) {
    // No lockout recorded, give initial seeds
    setLivesForPlayer(GAME_CONFIG.SEED_LIVES_START || 3);
    await saveHighScores();
    return;
  }

  const now = Date.now();
  const lockoutMs = (GAME_CONFIG.SEED_LOCKOUT_HOURS || 6) * 60 * 60 * 1000;

  if (now - lastLock >= lockoutMs) {
    // Lockout period passed, replenish seeds
    setLivesForPlayer(GAME_CONFIG.SEED_LIVES_START || 3);
    await clearSeedLockoutTimestamp();
    await saveHighScores();

    // Update display
    const livesDisplay = document.querySelector(".livesDisplay .livesHeader");
    if (livesDisplay) {
      livesDisplay.textContent = `Seeds ${(GAME_CONFIG.SEED_LIVES_START || 3)
        .toString()
        .padStart(2, "0")}`;
    }
  }
}

function showLoginForm() {
  document.getElementById("authPanelButtons").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
  document.getElementsByClassName("textGrow")[0].textContent = "Ol' Grower?";
}

function showAuthButtons() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("usernamePickerForm").style.display = "none";
  document.getElementById("authPanelButtons").style.display = "flex";
  document.getElementsByClassName("textGrow")[0].textContent = "New Grower?";
}

function validateLoginForm() {
  const username = document
    .querySelector('#loginForm input[type="text"]')
    .value.trim();
  const password = document
    .querySelector('#loginForm input[type="password"]')
    .value.trim();
  const loginBtn = document.getElementById("loginBtn");

  if (username && password) {
    loginBtn.classList.add("valid");
  } else {
    loginBtn.classList.remove("valid");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const username = document
    .querySelector('#loginForm input[type="text"]')
    .value.trim();
  const password = document
    .querySelector('#loginForm input[type="password"]')
    .value.trim();

  if (username && password) {
    // Add rate limiting check
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

    // Prevent multiple simultaneous logins
    if (loginAttempts.isLoggingIn) {
      return;
    }

    const loginBtn = document.getElementById("loginBtn");
    loginBtn.disabled = true;
    loginAttempts.isLoggingIn = true;
    loginBtn.textContent = "Logging in...";

    // Attempt login for existing users
    console.log("Starting PlayFab login for user:", username);
    PlayFabService.login(username, password)
      .then(async (result) => {
        console.log("PlayFab login successful, result:", result);
        console.log("Setting display name for user:", username);
        await PlayFabService.setDisplayName(username);
        console.log("Display name set successfully");
        currentGrower = username;
        console.log("Saving session for user:", username);
        PlayFabService.saveSession(username, result.SessionTicket); // Save session after successful login
        console.log(
          "Session saved, checking if it was stored:",
          PlayFabService.getSession()
        );

        document.getElementById("loadingScreen").style.display = "none";
        document.querySelector(".authPanel").style.display = "none";
        document.getElementById("mainGameScreen").style.display = "flex";

        await renderSeedSelectionInterface();
      })
      .catch((error) => {
        console.error("Login error details:", error);
        if (error && error.code === 409) {
          alert(
            "Please wait, your previous request is still processing. Try again in a few seconds."
          );
        } else if (error && error.message === "Invalid password") {
          alert("Invalid username or password");
        } else {
          // If user doesn't exist, suggest they use Google login
          alert(
            "User not found. New users must use Google login to create an account."
          );
        }

        // Increment failed attempts
        loginAttempts.count++;
        loginAttempts.lastAttempt = now;
      })
      .finally(() => {
        // Reset button state
        loginBtn.disabled = false;
        loginAttempts.isLoggingIn = false;
        loginBtn.textContent = "Sign In";
      });
  }
}

function loginToPlayFabWithGoogle(accessToken) {
  console.log("Attempting PlayFab login with Google Access Token...");

  PlayFab.ClientApi.LoginWithGoogleAccount(
    {
      CreateAccount: true,
      AccessToken: accessToken,
      InfoRequestParameters: {
        GetPlayerProfile: true,
      },
    },
    onGoogleLoginSuccess,
    onLoginError
  );
}

function handleGoogleResponse(response) {
  console.log("Google auth response:", response);

  PlayFabService.ClientApi.LoginWithGoogleAccount(
    {
      CreateAccount: true,
      AccessToken: response.credential,
    },
    onGoogleLoginSuccess,
    onLoginError
  );
}

async function onGoogleLoginSuccess(result) {
  console.log("PlayFab Google login successful:", result);

  // Check if user already has a display name
  if (
    result.data.InfoResultPayload &&
    result.data.InfoResultPayload.PlayerProfile &&
    result.data.InfoResultPayload.PlayerProfile.DisplayName
  ) {
    // Existing user - go straight to game
    currentGrower = result.data.InfoResultPayload.PlayerProfile.DisplayName;
    // Save session with the session ticket from the result
    PlayFabService.saveSession(currentGrower, result.data.SessionTicket);
    await showGROWLABInterface();
  } else {
    // New user - show username picker
    window.tempPlayFabSession = result.data;
    showUsernamePicker();
  }
}

function onLoginError(error) {
  console.error("Login failed:", error);
  alert("Login failed: " + error.message);
}

// Dev Login Handler - Creates or logs into a test account for development
async function handleDevLogin() {
  console.log("🔧 [DEV] Starting dev login...");

  // Generate a unique dev username based on device/browser
  const devUsername = "DevTester_" + Math.random().toString(36).substring(2, 8);
  const devPassword = "devtest123";
  const devSecurityQuestion = "Test Question";
  const devSecurityAnswer = "test";

  const loginBtn = document.getElementById("devLoginBtn");
  if (loginBtn) {
    loginBtn.disabled = true;
    loginBtn.textContent = "🔧 Logging in...";
  }

  try {
    // Try to register first (in case it's a new device)
    try {
      await PlayFabService.register(devUsername, devPassword, devSecurityQuestion, devSecurityAnswer);
      console.log("🔧 [DEV] Created new dev account:", devUsername);
    } catch (regError) {
      // If registration fails, account might exist - try login
      console.log("🔧 [DEV] Registration failed (might already exist):", regError);
    }

    // Now login
    const result = await PlayFabService.login(devUsername, devPassword);
    console.log("🔧 [DEV] Login successful:", result);

    await PlayFabService.setDisplayName(devUsername);
    currentGrower = devUsername;
    PlayFabService.saveSession(devUsername, result.SessionTicket);

    // Transition to game - same as regular sign-in flow
    document.getElementById("loadingScreen").style.display = "none";
    document.querySelector(".authPanel").style.display = "none";
    document.getElementById("mainGameScreen").style.display = "flex";

    // Initialize hotspot UI first  
    initializeHotspotUI();

    // Then render the seed selection interface
    await renderSeedSelectionInterface();
    console.log("🔧 [DEV] Dev login complete!");

  } catch (error) {
    console.error("🔧 [DEV] Dev login failed:", error);
    alert("Dev login failed: " + (error.message || error));
  } finally {
    if (loginBtn) {
      loginBtn.disabled = false;
      loginBtn.textContent = "🔧 Dev Login (Test Account)";
    }
  }
}

// Make dev login globally accessible
window.handleDevLogin = handleDevLogin;


// Username Picker Functions
function showUsernamePicker() {
  document.getElementById("authPanelButtons").style.display = "none";
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("usernamePickerForm").style.display = "block";
  document.getElementsByClassName("textGrow")[0].textContent = "Pick Your Name";
}

function validateUsernameForm() {
  const username = document.getElementById("pickerUsernameInput").value.trim();
  const confirmBtn = document.getElementById("usernamePickerBtn");

  if (username.length >= 3) {
    confirmBtn.classList.add("valid");
  } else {
    confirmBtn.classList.remove("valid");
  }
}

function handleUsernamePicker(event) {
  event.preventDefault();
  const username = document.getElementById("pickerUsernameInput").value.trim();

  if (username.length < 3) {
    alert("Username must be at least 3 characters long");
    return;
  }

  const confirmBtn = document.getElementById("usernamePickerBtn");
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Checking...";

  // Check if display name is available
  PlayFabService.checkDisplayNameExists(username)
    .then((exists) => {
      if (exists) {
        alert("Username already taken. Please choose a different one.");
        confirmBtn.disabled = false;
        confirmBtn.textContent = "Confirm Name";
        return;
      }

      // Username is available, set it
      confirmBtn.textContent = "Setting name...";
      return PlayFabService.setDisplayName(username);
    })
    .then(async (result) => {
      if (result) {
        console.log("Username set successfully, showing GROWLAB interface...");
        currentGrower = username;
        PlayFabService.saveSession(username, result.SessionTicket);
        // Show GROWLAB interface
        await showGROWLABInterface();
      } else {
        console.warn("No result from setDisplayName");
      }
    })
    .catch((error) => {
      console.error("Failed to set username:", error);
      alert("Failed to set username. Please try again.");
    })
    .finally(() => {
      confirmBtn.disabled = false;
      confirmBtn.textContent = "Confirm Name";
    });
}

// Add this function to check for existing session on page load
async function checkAutoLogin() {
  console.log("Checking for existing session...");

  const sessionUser = PlayFabService.getSession();
  if (!sessionUser) {
    console.log("No session found");
    return false;
  }

  console.log("Found session for:", sessionUser);

  try {
    // Try to login with the stored session (this validates the session)
    const result = await PlayFabService.autoLogin();

    // autoLogin now returns the username directly or null
    if (result) {
      console.log("Auto-login successful for user:", result);
      currentGrower = result;

      // Load player data
      try {
        await loadHighScores();
      } catch (error) {
        console.warn("Failed to load high scores during auto-login:", error);
      }

      // Hide auth panel and show game
      const authPanel = document.querySelector(".authPanel");
      if (authPanel) {
        authPanel.style.display = "none";
      }

      const mainGameScreen = document.getElementById("mainGameScreen");
      if (mainGameScreen) {
        mainGameScreen.style.display = "flex";
      }

      // Setup the interface
      setupGROWLABInterface();

      // Start background music automatically
      if (isSoundEnabled) {
        playGameSound();
      }

      // Set initial background for selection component
      changeBackgroundForComponent("selection");

      await renderSeedSelectionInterface();

      return true;
    } else {
      console.log("Auto-login failed, clearing session");
      PlayFabService.clearSession();
      clearAllCaches();
      return false;
    }
  } catch (error) {
    console.warn("Auto-login error:", error);
    // Clear invalid session
    PlayFabService.clearSession();
    clearAllCaches();
    return false;
  }
}

// Simple function to show GROWLAB interface after login
async function showGROWLABInterface() {
  console.log("Showing GROWLAB interface...");

  // Hide auth panel
  const authPanel = document.querySelector(".authPanel");
  if (authPanel) {
    authPanel.style.display = "none";
    console.log("Auth panel hidden");
  } else {
    console.warn("Auth panel not found");
  }

  // Header buttons are now static and directly navigate to sections

  document.getElementById("loadingScreen").style.display = "none";
  // Show GROWLAB interface
  const mainGameScreen = document.getElementById("mainGameScreen");
  if (mainGameScreen) {
    console.log("Found mainGameScreen element, showing it...");
    mainGameScreen.style.display = "flex"; // Use flex instead of block to match CSS
    console.log("GROWLAB interface is now visible");

    //Update Game Header

    updateGameHeader();
    // Setup the interface
    setupGROWLABInterface();

    // Start background music automatically
    if (isSoundEnabled) {
      playGameSound();
    }

    // Set initial background for selection component
    changeBackgroundForComponent("selection");

    // Render the seed selection interface
    await renderSeedSelectionInterface();

    // Check badges once on login to catch up any missed popups
    await safeCheckAndAwardBadges();
  } else {
    console.error("mainGameScreen element not found!");
  }
}
function updateGameHeader() {
  // No need to update the header - keep it as is
  // Just update the help button to be a logout button
  const LogoutBtn = document.getElementById("logoutBtn");
  if (LogoutBtn) {
    LogoutBtn.innerHTML = "LOG OUT";
    LogoutBtn.title = "Logout";

    // Ensure button is visible and clickable
    LogoutBtn.style.display = "flex";
    LogoutBtn.style.visibility = "visible";
    LogoutBtn.style.pointerEvents = "auto";

    // Remove any existing event listeners and add the logout handler
    LogoutBtn.removeEventListener("click", handleLogout);
    LogoutBtn.addEventListener("click", handleLogout);
    LogoutBtn.setAttribute("data-listener-attached", "true");

    console.log("Logout button event listener attached and styled");
    console.log("Logout button position:", LogoutBtn.getBoundingClientRect());
  } else {
    console.error("Logout button not found!");
  }
}

// Initialize when DOM loads
document.addEventListener("DOMContentLoaded", () => {
  // Google client will be initialized by initClient() in HTML after SDK loads
  console.log("DOM loaded, waiting for Google SDK initialization...");

  // Ensure logout button gets event listener (fallback)
  setTimeout(() => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn && !logoutBtn.hasAttribute("data-listener-attached")) {
      logoutBtn.addEventListener("click", handleLogout);
      logoutBtn.setAttribute("data-listener-attached", "true");
      console.log("Fallback logout button event listener attached");
    }
  }, 1000);
});

// Handle Google login button click
function handleGoogleLogin() {
  if (googleTokenClient) {
    // This will open the Google sign-in pop-up
    googleTokenClient.requestAccessToken();
  } else {
    alert("Google authentication is not available. Please try again later.");
  }
}

// Simple GROWLAB interface setup
function setupGROWLABInterface() {
  console.log("Setting up GROWLAB interface...");

  // Add basic event handlers for buttons
  const vaultBtn = document.getElementById("vaultBtn");
  if (vaultBtn) {
    vaultBtn.addEventListener("click", () => {
      console.log("Vault button clicked");
      showVaultInterface();
    });
  }

  const leaderboardBtn = document.getElementById("leaderboardBtn");
  if (leaderboardBtn) {
    leaderboardBtn.addEventListener("click", () => {
      console.log("Leaderboard button clicked");
      showLeaderboard();
    });
  }


  // Header title is now non-interactive (just displays current section name)

  // Help button is now the logout button, handled in updateGameHeader

  // Daily spin event listeners are now handled in daily-spin.js
}

// Daily spin setup functions moved to daily-spin.js

// Update seeds display after winning from spin
function updateSeedsDisplayAfterSpin() {
  const livesHeader = document.getElementById("livesHeader");
  if (livesHeader) {
    const currentLives = getLivesForPlayer();
    livesHeader.textContent = `SEEDS: ${currentLives
      .toString()
      .padStart(2, "0")}`;
    livesHeader.style.color = "#00cc33"; // Reset color
  }

  // Force update all related UI elements
  updateBeginButton();
  updateFeedingStartButton();
}

// Handle logout
function handleLogout() {
  console.log("Logout button clicked - logging out...");

  try {
    // Reset background to main background image
    changeBackgroundForComponent("selection");

    // Clear the session
    PlayFabService.clearSession();

    // Reset game state
    currentGrower = null;

    // Clear any running seed timer
    if (window.seedTimer) {
      clearInterval(window.seedTimer);
      window.seedTimer = null;
    }

    // Clear all caches on logout
    clearAllCaches();

    highScores = {
      potency: [],
      yield: [],
      potencyHistory: {},
      totalYield: {},
      seedBank: {},
      seedLives: {},
    };

    // Hide game screen and show auth panel
    const mainGameScreen = document.getElementById("mainGameScreen");
    const authPanel = document.querySelector(".authPanel");

    if (mainGameScreen) {
      mainGameScreen.style.display = "none";
      console.log("Main game screen hidden");
    } else {
      console.error("Main game screen not found!");
    }

    if (authPanel) {
      authPanel.style.display = "block";
      console.log("Auth panel shown");
    } else {
      console.error("Auth panel not found!");
    }

    // Reset auth panel to initial state
    showAuthButtons();

    console.log("Logout complete");
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

// Render seed selection interface in gameContent
async function renderSeedSelectionInterface() {
  // Prevent multiple simultaneous initializations
  if (window.isInitializingInterface) {
    console.log("Interface initialization already in progress, skipping...");
    return;
  }

  window.isInitializingInterface = true;

  try {
    // Switch to selection component
    showComponent("selection");

    // Reset plant state for new game
    resetPlantState();

    // Initialize unlocked seeds BEFORE rendering
    await initializeUnlockedSeeds();

    // Update the game header to include logout button
    updateGameHeader();

    // Then populate grids
    await populateSeedGrid(); // Now async
    populateSoilGrid();
    populateDefenseGrid();
    updateSeedsDisplay();

    // Set up event listeners after grids are populated
    setupSelectionEventListeners();

    // Set initial button state
    updateBeginButton();
  } finally {
    // Always clear the flag
    window.isInitializingInterface = false;
  }
}
// Populate seed grid with random seeds
async function populateSeedGrid() {
  const seedGrid = document.getElementById("seedGrid");
  if (!seedGrid) return;

  // Prevent multiple simultaneous seed grid population
  if (window.isPopulatingSeeds) {
    console.log("Seed grid population already in progress, skipping...");
    return;
  }

  window.isPopulatingSeeds = true;

  try {
    // Initialize unlocked seeds first
    await initializeUnlockedSeeds();

    // Get only unlocked seed keys
    const unlockedKeys = Object.keys(seedProperties).filter(
      (key) => unlockedSeeds[key]
    );

    // If somehow no seeds are unlocked, fallback to first 6
    if (unlockedKeys.length === 0) {
      console.warn("No unlocked seeds found, using first 6");
      for (let i = 0; i < 6; i++) {
        const key = Object.keys(seedProperties)[i];
        if (key) unlockedKeys.push(key);
      }
    }

    // Pick 3 random seeds from unlocked ones
    const randomSeeds = [];
    const availableKeys = [...unlockedKeys]; // Clone array to avoid modifying original

    for (let i = 0; i < Math.min(3, availableKeys.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableKeys.length);
      const seedKey = availableKeys.splice(randomIndex, 1)[0]; // Remove selected to avoid duplicates
      randomSeeds.push({ key: seedKey, ...seedProperties[seedKey] });
    }

    seedGrid.innerHTML = randomSeeds
      .map(
        (seed) => `
      <div class="gridItem seed-item" data-seed-key="${seed.key}">
        <img src="img/selections/${seed.image}" alt="${seed.name}" title="${seed.name}">
        <div class="item-name">${seed.name}</div>
      </div>
    `
      )
      .join("");

    // Add seed click handlers right here
    document.querySelectorAll(".seed-item").forEach((item) => {
      item.addEventListener("click", () => {
        document
          .querySelectorAll(".seed-item")
          .forEach((i) => i.classList.remove("selected"));
        item.classList.add("selected");
        // Activate the Seed header
        const seedHeader = document.querySelector("#seedGrid")?.closest(".gridColumn")?.querySelector(".gridHeader");
        if (seedHeader) seedHeader.classList.add("active");
        updateBeginButton();
      });
    });
  } finally {
    // Always clear the flag
    window.isPopulatingSeeds = false;
  }
}

// Populate soil grid
function populateSoilGrid() {
  const soilGrid = document.getElementById("soilGrid");
  if (!soilGrid) return;

  soilGrid.innerHTML = Object.entries(soilTypes)
    .map(
      ([key, soil]) => `
    <div class="gridItem soil-item" data-soil-key="${key}">
      <img src="img/selections/${soil.image}" alt="${soil.name}" title="${soil.name}">
      <div class="item-name">${soil.name}</div>
    </div>
  `
    )
    .join("");
}

// Populate defense grid
function populateDefenseGrid() {
  const defenseGrid = document.getElementById("defenseGrid");
  if (!defenseGrid) return;

  // Simple defense options matching what game.js expects
  const defenseOptions = [
    { key: "grower", name: "Grower", image: "defense/grower.png" },
    { key: "hound", name: "Hound", image: "defense/hound.png" },
    { key: "vault", name: "Vault", image: "defense/vault.png" },
  ];

  defenseGrid.innerHTML = defenseOptions
    .map(
      (defense) => `
        <div class="gridItem defense-item" data-defense-key="${defense.key}">
          <img src="img/selections/${defense.image}" alt="${defense.name}">
      <div class="item-name">${defense.name}</div>
    </div>
  `
    )
    .join("");
}

// Comprehensive lives display update function
function updateLivesDisplay() {
  const livesHeader = document.getElementById("livesHeader");
  const dailySpinBtn = document.getElementById("dailySpinBtn");
  const beginBtn = document.getElementById("beginRitualBtn");
  const startBtn = document.getElementById("startGrowingBtn");

  if (!livesHeader) return;

  const lives = getLivesForPlayer();
  console.log(`🔍 [DEBUG] updateLivesDisplay: Current lives: ${lives}`);

  if (lives > 0) {
    // Update seeds count
    livesHeader.textContent = `SEEDS: ${lives.toString().padStart(2, "0")}`;
    livesHeader.style.color = "#00cc33";

    // Show daily spin button if available
    if (dailySpinBtn) {
      dailySpinBtn.style.display = "block";
    }

    // Update all buttons that depend on lives
    updateBeginButton();
    updateFeedingStartButton();

    // Clear any existing timer
    if (window.seedTimer) {
      clearInterval(window.seedTimer);
      window.seedTimer = null;
    }
  } else {
    // Show lockout state
    livesHeader.textContent = "SEEDS: 00";
    livesHeader.style.color = "#ff6b6b";

    // Disable buttons that require lives
    if (beginBtn) {
      beginBtn.disabled = true;
      beginBtn.textContent = "No Seeds Available";
    }
    if (startBtn) {
      startBtn.disabled = true;
      startBtn.textContent = "No Seeds Available";
    }
  }

  // Update daily spin button state
  if (typeof updateDailySpinButtonState === "function") {
    updateDailySpinButtonState();
  }
}

// Update seeds display - now just updates content instead of creating elements
async function updateSeedsDisplay() {
  console.log("🔍 [DEBUG] updateSeedsDisplay() called");

  const livesHeader = document.getElementById("livesHeader");
  const dailySpinBtn = document.getElementById("dailySpinBtn");
  const beginBtn = document.getElementById("beginRitualBtn");

  if (!livesHeader || !dailySpinBtn) {
    console.log("🔍 [DEBUG] Seeds display elements not found");
    return;
  }

  // Load and check seed status
  await loadHighScores();
  await checkAndReplenishSeeds();

  const lives = getLivesForPlayer();
  console.log(`🔍 [DEBUG] Current lives: ${lives}`);

  if (lives > 0) {
    // Update seeds count
    livesHeader.textContent = `SEEDS: ${lives.toString().padStart(2, "0")}`;
    livesHeader.classList.remove('timer-mode');
    livesHeader.style.color = "#00cc33"; // Reset color

    // Show daily spin button
    dailySpinBtn.style.display = "block";

    // Update begin button state (will check if all items are selected)
    updateBeginButton();

    // Clear any existing timer
    if (window.seedTimer) {
      clearInterval(window.seedTimer);
      window.seedTimer = null;
    }
  } else {
    // Show lockout timer
    const timeLeft = await getSeedLockoutTimeLeft();
    const hours = Math.floor(timeLeft / 3600000);
    const minutes = Math.floor((timeLeft % 3600000) / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    livesHeader.textContent = `Return in ${hours}h ${minutes}m ${seconds}s`;
    livesHeader.classList.add('timer-mode');
    livesHeader.style.color = "#ff6b6b";

    // Check if user can still use daily spin (don't hide it automatically)
    const canSpin = await canSpinSlotsToday();
    if (canSpin) {
      // Show daily spin button if user hasn't used it today
      dailySpinBtn.style.display = "block";
      console.log(
        "🔍 [DEBUG] Showing daily spin button - user hasn't used it today"
      );
    } else {
      // Hide daily spin button only if user has already used it
      dailySpinBtn.style.display = "none";
      console.log(
        "🔍 [DEBUG] Hiding daily spin button - user already used it today"
      );
    }

    // Disable begin button
    if (beginBtn) {
      beginBtn.disabled = true;
      beginBtn.textContent = "No Seeds Available";
    }

    // Set up timer to update every second
    if (window.seedTimer) {
      clearInterval(window.seedTimer);
    }

    window.seedTimer = setInterval(() => {
      // Use cached version for countdown (no PlayFab calls)
      const timeLeft = getSeedLockoutTimeLeftCached();
      const hours = Math.floor(timeLeft / 3600000);
      const minutes = Math.floor((timeLeft % 3600000) / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);

      if (livesHeader) {
        livesHeader.textContent = `Return in ${hours}h ${minutes}m ${seconds}s`;
      }

      // Check if time is up and seeds should be replenished
      if (timeLeft <= 0) {
        // Refresh the seed status (this will make a PlayFab call)
        checkAndReplenishSeeds().then(async () => {
          const newLives = getLivesForPlayer();
          if (newLives > 0) {
            // Seeds replenished, update display
            livesHeader.textContent = `Seeds ${newLives
              .toString()
              .padStart(2, "0")}`;
            livesHeader.style.color = "#ffffff";

            // Check if user can still use daily spin
            const canSpin = await canSpinSlotsToday();
            if (canSpin) {
              dailySpinBtn.style.display = "block";
              console.log(
                "🔍 [DEBUG] Timer: Showing daily spin button - user hasn't used it today"
              );
            } else {
              dailySpinBtn.style.display = "none";
              console.log(
                "🔍 [DEBUG] Timer: Hiding daily spin button - user already used it today"
              );
            }

            // Update begin button state (will check if all items are selected)
            updateBeginButton();

            // Clear the timer
            clearInterval(window.seedTimer);
            window.seedTimer = null;
          }
        });
      }
    }, 1000);
  }

  // Update daily spin button state
  updateDailySpinButtonState();
  console.log("🔍 [DEBUG] Seeds display update completed");
}

// Save player progress to PlayFab
async function savePlayerProgress(playerProgress) {
  try {
    await new Promise((resolve, reject) => {
      PlayFab.ClientApi.ExecuteCloudScript(
        {
          FunctionName: "savePlayerProgress",
          FunctionParameter: {
            playerProgress: playerProgress,
          },
        },
        (result, error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      );
    });
    console.log("🔍 [DEBUG] Player progress saved successfully");
  } catch (error) {
    console.error("Failed to save player progress:", error);
  }
}

// Helper function to get time left (optimized with caching)
async function getSeedLockoutTimeLeft() {
  const lastLock = await getSeedLockoutTimestamp();
  if (!lastLock) return 0;

  const now = Date.now();
  const lockoutMs = (GAME_CONFIG.SEED_LOCKOUT_HOURS || 6) * 60 * 60 * 1000;
  const msLeft = lockoutMs - (now - lastLock);

  return msLeft > 0 ? msLeft : 0;
}

// Optimized version that uses cached timestamp for countdown
function getSeedLockoutTimeLeftCached() {
  if (!seedLockoutTimestampCache) return 0;

  const now = Date.now();
  const lockoutMs = (GAME_CONFIG.SEED_LOCKOUT_HOURS || 6) * 60 * 60 * 1000;
  const msLeft = lockoutMs - (now - seedLockoutTimestampCache);

  return msLeft > 0 ? msLeft : 0;
}

function getLivesForPlayer() {
  if (!currentGrower || !highScores.seedLives) return 0;

  // Initialize with 3 seeds if new player
  if (typeof highScores.seedLives[currentGrower] === "undefined") {
    highScores.seedLives[currentGrower] = GAME_CONFIG.SEED_LIVES_START || 3;
  }

  return highScores.seedLives[currentGrower] || 0;
}

// Validate cache before critical operations
async function validateCacheBeforeCriticalOperation() {
  const now = Date.now();
  const cacheAge = now - lastHighScoresFetch;

  // If cache is older than 30 seconds, refresh for critical operations
  if (cacheAge > 30000) {
    console.log("🔍 [CACHE] Refreshing stale cache for critical operation");
    await loadHighScores(true); // Force refresh
  }
}

// Add the missing setSeedLockoutTimestamp function
async function setSeedLockoutTimestamp() {
  if (currentGrower) {
    await PlayFabService.setSeedLockoutTimestamp(currentGrower);
  }
}
// Setup event listeners for selection
function setupSelectionEventListeners() {
  // Set up soil and defense item click handlers (these need to be set up every time)
  setupSoilSelectionHandlers();
  setupDefenseSelectionHandlers();

  // Set up Begin Ritual button handler (only once)
  setupBeginRitualButton();
}

function setupSoilSelectionHandlers() {
  // Soil selection
  document.querySelectorAll(".soil-item").forEach((item) => {
    item.addEventListener("click", () => {
      document
        .querySelectorAll(".soil-item")
        .forEach((i) => i.classList.remove("selected"));
      item.classList.add("selected");
      // Activate the Soil header
      const soilHeader = document.querySelector("#soilGrid")?.closest(".gridColumn")?.querySelector(".gridHeader");
      if (soilHeader) soilHeader.classList.add("active");
      updateBeginButton();
    });
  });
}

function setupDefenseSelectionHandlers() {
  // Defense selection
  document.querySelectorAll(".defense-item").forEach((item) => {
    item.addEventListener("click", () => {
      document
        .querySelectorAll(".defense-item")
        .forEach((i) => i.classList.remove("selected"));
      item.classList.add("selected");
      // Activate the Defence header
      const defenseHeader = document.querySelector("#defenseGrid")?.closest(".gridColumn")?.querySelector(".gridHeader");
      if (defenseHeader) defenseHeader.classList.add("active");
      updateBeginButton();
    });
  });
}

function setupBeginRitualButton() {
  // Prevent multiple event listener setup FOR BUTTON ONLY
  if (window.beginRitualButtonSetup) {
    console.log("Begin Ritual button already setup, skipping...");
    return;
  }

  window.beginRitualButtonSetup = true;

  // Begin ritual button
  const beginBtn = document.getElementById("beginRitualBtn");
  if (beginBtn) {
    beginBtn.addEventListener("click", async () => {
      const selectedSeedEl = document.querySelector(".seed-item.selected");
      const selectedSoilEl = document.querySelector(".soil-item.selected");
      const selectedDefenseEl = document.querySelector(
        ".defense-item.selected"
      );

      if (selectedSeedEl && selectedSoilEl && selectedDefenseEl) {
        const selectedSeed = selectedSeedEl.dataset.seedKey;
        const selectedSoil = selectedSoilEl.dataset.soilKey;
        const selectedDefense = selectedDefenseEl.dataset.defenseKey;

        // Check if player has seeds - validate cache first
        await validateCacheBeforeCriticalOperation();
        const lives = getLivesForPlayer();
        console.log(`🔍 [DEBUG] Begin ritual - checking lives: ${lives}`);

        if (lives <= 0) {
          alert("Out of seeds! Come back later for more.");
          // Force UI update to reflect current state
          updateLivesDisplay();
          return;
        }

        console.log("Starting ritual with:", {
          selectedSeed,
          selectedSoil,
          selectedDefense,
        });

        window.gameSelections = {
          seed: selectedSeed,
          soil: selectedSoil,
          defense: selectedDefense,
        };

        showFeedingScheduleInterface();
      }
    });
  }
}
function showFeedingScheduleInterface() {
  // Switch to feeding component
  showComponent("feeding");

  // Initialize the feeding schedule
  initializeFeedingSchedule();
}

function initializeFeedingSchedule() {
  console.log("🔄 [DEBUG] Initializing feeding schedule (fresh start)");

  // ALWAYS reset feeding schedule to defaults when entering this screen
  plant.feedingSchedule = {
    sprout: { waterTimes: 0, nutrientMix: Object.keys(nutrientMixes)[0] },
    vegetative: { waterTimes: 0, nutrientMix: Object.keys(nutrientMixes)[0] },
    flowering: { waterTimes: 0, nutrientMix: Object.keys(nutrientMixes)[0] },
  };

  // Clear any existing selections on the UI
  document.querySelectorAll(".nutrientOption").forEach((option) => {
    option.classList.remove("selected");
  });

  // Reset water counts to 0
  const stages = ["sprout", "vegetative", "flowering"];
  stages.forEach((stage) => {
    const waterDisplay = document.getElementById(`${stage}Water`);
    if (waterDisplay) {
      waterDisplay.textContent = "0";
    }
  });

  // Populate nutrient selectors for each stage
  populateNutrientSelectors();

  // Sync UI with the reset state
  syncFeedingUI();

  // Setup controls
  setupWaterControls();
  setupNutrientControls();
  setupFeedingButtons();

  // Initialize button state (should be disabled since no water is set)
  updateFeedingStartButton();

  console.log(
    "🔄 [DEBUG] Feeding schedule reset to defaults:",
    plant.feedingSchedule
  );
}

// Function to sync the feeding UI with the current plant.feedingSchedule state
function syncFeedingUI() {
  const stages = ["sprout", "vegetative", "flowering"];

  stages.forEach((stage) => {
    // Update water count displays
    const waterDisplay = document.getElementById(`${stage}Water`);
    if (waterDisplay && plant.feedingSchedule[stage]) {
      waterDisplay.textContent = plant.feedingSchedule[stage].waterTimes;
    }

    // Update nutrient selector selections
    const nutrientSelector = document.getElementById(`${stage}Nutrients`);
    if (nutrientSelector && plant.feedingSchedule[stage].nutrientMix) {
      // Remove all selected classes first
      nutrientSelector.querySelectorAll(".nutrientOption").forEach((opt) => {
        opt.classList.remove("selected");
      });

      // Add selected class to the current nutrient mix
      const selectedOption = nutrientSelector.querySelector(
        `[data-mix="${plant.feedingSchedule[stage].nutrientMix}"]`
      );
      if (selectedOption) {
        selectedOption.classList.add("selected");
      }
    }
  });
}

function populateNutrientSelectors() {
  const stages = ["sprout", "vegetative", "flowering"];
  const nutrientKeys = Object.keys(nutrientMixes);

  stages.forEach((stage) => {
    const selector = document.getElementById(`${stage}Nutrients`);
    if (!selector) return;

    // Show all nutrient mixes, not just first 3
    selector.innerHTML = nutrientKeys
      .map(
        (key) => `
          <div class="nutrientOption" 
               data-stage="${stage}" 
               data-mix="${key}">
            <div class="nutrientName">${nutrientMixes[key].name}</div>
          </div>
        `
      )
      .join("");

    // Check if there's overflow and add fade effect
    setTimeout(() => {
      if (selector.scrollHeight > selector.clientHeight) {
        selector.classList.add("has-overflow");
      } else {
        selector.classList.remove("has-overflow");
      }
    }, 100);
  });
}
function setupWaterControls() {
  document.querySelectorAll(".waterBtn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const stage = btn.dataset.stage;
      const type = btn.classList.contains("plus") ? "plus" : "minus";

      if (type === "plus") {
        plant.feedingSchedule[stage].waterTimes = Math.min(
          12,
          plant.feedingSchedule[stage].waterTimes + 1
        );
      } else {
        plant.feedingSchedule[stage].waterTimes = Math.max(
          0,
          plant.feedingSchedule[stage].waterTimes - 1
        );
      }

      document.getElementById(`${stage}Water`).textContent =
        plant.feedingSchedule[stage].waterTimes;
      updateFeedingStartButton();
    });
  });
}

function setupNutrientControls() {
  document.querySelectorAll(".nutrientOption").forEach((option) => {
    option.addEventListener("click", () => {
      const stage = option.dataset.stage;
      const mix = option.dataset.mix;

      // Remove selected from siblings
      document
        .querySelectorAll(`[data-stage="${stage}"].nutrientOption`)
        .forEach((opt) => opt.classList.remove("selected"));

      // Select this option
      option.classList.add("selected");
      plant.feedingSchedule[stage].nutrientMix = mix;

      updateFeedingStartButton();
    });
  });
}

function setupFeedingButtons() {
  // Prevent multiple event listener setup
  if (window.feedingButtonsSetup) {
    console.log("Feeding buttons already setup, skipping...");
    return;
  }

  window.feedingButtonsSetup = true;

  // Random button
  document.getElementById("randomFeedsBtn")?.addEventListener("click", () => {
    console.log(
      "Random button clicked, current state before:",
      plant.feedingSchedule
    );

    const stages = ["sprout", "vegetative", "flowering"];

    stages.forEach((stage) => {
      // Random water times
      plant.feedingSchedule[stage].waterTimes = Math.floor(Math.random() * 13);
      document.getElementById(`${stage}Water`).textContent =
        plant.feedingSchedule[stage].waterTimes;

      // Random nutrient mix from available options
      const availableOptions = document.querySelectorAll(
        `[data-stage="${stage}"].nutrientOption`
      );
      if (availableOptions.length > 0) {
        // Pick random from actually rendered options
        const randomIndex = Math.floor(Math.random() * availableOptions.length);
        const randomOption = availableOptions[randomIndex];
        const randomMix = randomOption.dataset.mix;

        // Update state
        plant.feedingSchedule[stage].nutrientMix = randomMix;

        // Update UI - remove all selected, add to random one
        availableOptions.forEach((opt) => opt.classList.remove("selected"));
        randomOption.classList.add("selected");
      }
    });

    console.log(
      "Random button clicked, current state after:",
      plant.feedingSchedule
    );

    // Important: trigger the validation after making changes
    updateFeedingStartButton();
  });

  // Start growing button
  const startBtn = document.getElementById("startGrowingBtn");
  if (!startBtn) return;

  // ✅ If the button already has a click listener, remove it first
  if (startBtn._attachedHandler) {
    startBtn.removeEventListener("click", startBtn._attachedHandler);
    console.log("🧹 Old Start Growing handler removed");
  }

  // Then define and attach a new one
  const newHandler = async () => {
    await validateCacheBeforeCriticalOperation();
    const lives = getLivesForPlayer();
    console.log(`🌱 Lives before grow: ${lives}`);

    if (lives <= 0) {
      alert("Out of seeds! Come back later for more.");
      updateLivesDisplay();
      return;
    }

    setLivesForPlayer(lives - 1);
    await saveHighScores();
    if (lives - 1 === 0) await setSeedLockoutTimestamp();

    window.gameSetup = {
      selections: window.gameSelections,
      schedule: plant.feedingSchedule,
    };
    addEventToLog("Starting this game...", "info");
    startGameSimulation();
  };

  startBtn.addEventListener("click", newHandler);
  startBtn._attachedHandler = newHandler; // 🔒 remember it for next cleanup
  console.log("✅ Start Growing handler attached cleanly");

  // Back to selection button
  document
    .getElementById("backToSelectionBtn")
    ?.addEventListener("click", async () => {
      console.log(
        "🔄 [DEBUG] Back to selection from feeding - resetting state"
      );
      resetGameState(); // Reset everything
      showComponent("selection");
    });
}

function updateFeedingStartButton() {
  const startBtn = document.getElementById("startGrowingBtn");
  if (!startBtn) return;

  console.log(
    "updateFeedingStartButton called, current state:",
    plant.feedingSchedule
  );

  // Check if at least one stage has water times set
  const hasWater = Object.values(plant.feedingSchedule).some(
    (stage) => stage.waterTimes > 0
  );

  console.log("Has water:", hasWater);

  if (hasWater) {
    startBtn.disabled = false;
    startBtn.innerHTML = "Start Growing";
    console.log("Button enabled");
  } else {
    startBtn.disabled = true;
    startBtn.textContent = "Set Schedule";
    console.log("Button disabled");
  }
}

// Update begin button state
function updateBeginButton() {
  const beginBtn = document.getElementById("beginRitualBtn");
  if (!beginBtn) return;

  const hasSeed = document.querySelector(".seed-item.selected");
  const hasSoil = document.querySelector(".soil-item.selected");
  const hasDefense = document.querySelector(".defense-item.selected");
  const hasSeedsAvailable = getLivesForPlayer() > 0;

  if (hasSeed && hasSoil && hasDefense && hasSeedsAvailable) {
    beginBtn.disabled = false;
    beginBtn.textContent = "Begin Ritual";
  } else if (!hasSeedsAvailable) {
    beginBtn.disabled = true;
    beginBtn.textContent = "No Seeds Available";
  } else {
    beginBtn.disabled = true;
    beginBtn.textContent = "Select All ";
  }
}

// Force refresh all lives-related UI when switching components
function refreshLivesUI() {
  console.log("🔍 [DEBUG] Refreshing lives UI");
  updateLivesDisplay();
  updateBeginButton();
  updateFeedingStartButton();
}

// Debug function to test GROWLAB interface display
function testGROWLABInterface() {
  console.log("Testing GROWLAB interface display...");

  // Check if elements exist
  const authPanel = document.querySelector(".authPanel");
  const mainGameScreen = document.getElementById("mainGameScreen");

  console.log("Auth panel found:", !!authPanel);
  console.log("Main game screen found:", !!mainGameScreen);

  if (mainGameScreen) {
    console.log(
      "Main game screen current display:",
      mainGameScreen.style.display
    );
    console.log(
      "Main game screen computed display:",
      window.getComputedStyle(mainGameScreen).display
    );

    // Try to show it
    mainGameScreen.style.display = "flex";
    console.log(
      "Set display to flex, new display:",
      mainGameScreen.style.display
    );
  }

  // Also try to hide auth panel
  if (authPanel) {
    authPanel.style.display = "none";
    console.log("Auth panel hidden");
  }
}

// Game state variables for simulation
// Game state variables - matching original structure
let plant = {
  seedType: null,
  soilType: null,
  health: 100,
  water: 100,
  light: 100,
  nutrients: 100,
  stress: 0,
  growthStage: 0,
  stageTime: 0,
  totalGrowthTime: 0,
  harvestTimer: null,
  harvestTimeLeft: 24 * 60 * 60,
  potency: 100,
  weight: 0,
  healthSum: 0,
  healthTicks: 0,
  optimalLight: 100,
  pestPenalty: 1,
  raiderPenalty: 1,
  lightEfficiencySum: 0,
  lightEfficiencyTicks: 0,
  potencyBoost: 1,
  feedingSchedule: {
    sprout: { waterTimes: 0, nutrientMix: null },
    vegetative: { waterTimes: 0, nutrientMix: null },
    flowering: { waterTimes: 0, nutrientMix: null },
  },
  scoresRecorded: false,
  defenseType: null,
  deathTicks: 0,
};

let gameTimer = null;
let currentLight = "candle";
let manualLightSelection = false; // Track if user manually selected a light

// Light sources configuration
let lightSources = {
  candle: { name: "Candle Light", unlocked: true, yieldBonus: 1.0 },
  desk: { name: "Desk Lamp", unlocked: false, yieldBonus: 1.1 },
  grow: { name: "Grow Light", unlocked: true, yieldBonus: 1.2 },
  plasma: { name: "Plasma Lamp", unlocked: false, yieldBonus: 1.35 },
  quantum: { name: "Quantum Board", unlocked: false, yieldBonus: 1.5 },
};

// Events array for logging
let events = [];

// Seed unlock system
let unlockedSeeds = {};

// Tracks which seed types the player has successfully grown (for revealing flower images)
let grownSeeds = {};
const seedUnlockThresholds = [
  0, // 1st seed - always unlocked
  0, // 2nd seed - always unlocked
  0, // 3rd seed - always unlocked
  0, // 4th seed - always unlocked
  0, // 5th seed - always unlocked
  0, // 6th seed - always unlocked
  100, // 7th seed
  200, // 8th seed
  300, // 9th seed
  400, // 10th seed
  500, // 11th seed
  600, // 12th seed
  700, // 13th seed
  800, // 14th seed
  900, // 15th seed
  1000, // 16th seed
  1100, // 17th seed
  1200, // 18th seed
  1300, // 19th seed
  1400, // 20th seed
  1500, // 21st seed
  1600, // 22nd seed
  1700, // 23rd seed
  1800, // 24th seed
  1900, // 25th seed
  2000, // 26th seed
  2100, // 27th seed
  2200, // 28th seed
  2300, // 29th seed
  2400, // 30th seed
  2500, // 31st seed
  2600, // 32nd seed
  2700, // 33rd seed
  2800, // 34th seed
  2900, // 35th seed
  3000, // 36th seed
  3100, // 37th seed
  3200, // 38th seed
  3300, // 39th seed
  3400, // 40th seed
  3500, // 41st seed
  3600, // 42nd seed
  3700, // 43rd seed
  3800, // 44th seed
  3900, // 45th seed
  4000, // 46th seed
  4100, // 47th seed
  4200, // 48th seed
  4300, // 49th seed
  4400, // 50th seed
  4500, // 51st seed
  4600, // 52nd seed
  4700, // 53rd seed
  4800, // 54th seed
  4900, // 55th seed
  5000, // 56th seed
  5100, // 57th seed
  5200, // 58th seed
  5300, // 59th seed
  5400, // 60th seed
  5500, // 61st seed
  5600, // 62nd seed
  5700, // 63rd seed
  5800, // 64th seed
  5900, // 65th seed
  6000, // 66th seed
  6100, // 67th seed
  6200, // 68th seed
  6300, // 69th seed
];

// Initialize unlocked seeds - first 6 always unlocked
async function initializeUnlockedSeeds() {
  try {
    // Get player's total yield from PlayFab
    const playerStats = await PlayFabService.getPlayerLeaderboardEntry(
      "TotalYield"
    );
    const totalYield = playerStats ? playerStats.StatValue : 0;

    // Reset unlocked seeds
    unlockedSeeds = {};

    // Check each seed against thresholds
    const allSeeds = Object.keys(seedProperties);
    allSeeds.forEach((seedKey, index) => {
      const threshold = seedUnlockThresholds[index] || 0;
      if (totalYield >= threshold) {
        unlockedSeeds[seedKey] = true;
      }
    });

    // Ensure first 6 seeds are always unlocked (as per your thresholds)
    for (let i = 0; i < 6; i++) {
      const key = allSeeds[i];
      if (key) {
        unlockedSeeds[key] = true;
      }
    }

    console.log(
      `Unlocked ${Object.keys(unlockedSeeds).length
      } seeds for total yield: ${totalYield}g`
    );
  } catch (error) {
    console.warn("Failed to load unlock data, using defaults:", error);
    // Fallback: unlock first 6 seeds
    const allSeeds = Object.keys(seedProperties);
    for (let i = 0; i < 6; i++) {
      if (allSeeds[i]) {
        unlockedSeeds[allSeeds[i]] = true;
      }
    }
  }
}

// Check and unlock seeds based on total yield
function checkAndUnlockSeeds() {
  // For now, just ensure first 6 are unlocked
  // In a full implementation, this would check against total yield from PlayFab
  initializeUnlockedSeeds();
}

// Initialize grown seeds from PlayFab - tracks which seeds player has successfully harvested
// Uses playerProgress.grownStrains from Internal Data (set by cloud script)
async function initializeGrownSeeds() {
  try {
    // Get player progress from cloud script which contains grownStrains
    const result = await new Promise((resolve, reject) => {
      PlayFab.ClientApi.ExecuteCloudScript(
        { FunctionName: "getPlayerProgress", FunctionParameter: {} },
        (result, error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result.data);
        }
      );
    });

    if (result?.FunctionResult?.success && result?.FunctionResult?.playerProgress?.grownStrains) {
      // Convert array to object for consistent lookup
      const grownArray = result.FunctionResult.playerProgress.grownStrains;
      grownSeeds = {};
      grownArray.forEach(seedKey => {
        grownSeeds[seedKey] = true;
      });
      console.log(`🌸 Loaded ${grownArray.length} grown seeds from playerProgress.grownStrains`);
    } else {
      grownSeeds = {};
      console.log('🌱 No grown strains found in playerProgress');
    }
  } catch (error) {
    console.warn('Failed to load grown seeds from playerProgress:', error);
    grownSeeds = {};
  }
}

// Record a seed as successfully grown
// Note: The actual saving happens in the cloud script's submitScore handler
// This function just updates the local cache
async function recordGrownSeed(seedKey) {
  if (!seedKey || grownSeeds[seedKey]) {
    return; // Already recorded or no seed key
  }

  grownSeeds[seedKey] = true;
  console.log(`🌸 Recorded ${seedKey} as successfully grown (saved by cloud script)`);
  // Note: Don't need to save here - the cloud script's submitScore handler 
  // already adds seedType to playerProgress.grownStrains when yield is submitted
}

// ========================================
// NAVIGATION BUTTON CONTROL FUNCTIONS
// ========================================

function disableNavigationButtons() {
  console.log("🔒 Disabling navigation buttons during game simulation");

  const vaultBtn = document.getElementById("vaultBtn");
  const leaderboardBtn = document.getElementById("leaderboardBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (vaultBtn) {
    vaultBtn.disabled = true;
    vaultBtn.style.opacity = "0.5";
    vaultBtn.style.pointerEvents = "none";
    vaultBtn.title = "Disabled during game simulation";
  }

  if (leaderboardBtn) {
    leaderboardBtn.disabled = true;
    leaderboardBtn.style.opacity = "0.5";
    leaderboardBtn.style.pointerEvents = "none";
    leaderboardBtn.title = "Disabled during game simulation";
  }

  if (logoutBtn) {
    logoutBtn.disabled = true;
    logoutBtn.style.opacity = "0.5";
    logoutBtn.style.pointerEvents = "none";
    logoutBtn.title = "Disabled during game simulation";
  }
}

function enableNavigationButtons() {
  console.log("🔓 Re-enabling navigation buttons");

  const vaultBtn = document.getElementById("vaultBtn");
  const leaderboardBtn = document.getElementById("leaderboardBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (vaultBtn) {
    vaultBtn.disabled = false;
    vaultBtn.style.opacity = "1";
    vaultBtn.style.pointerEvents = "auto";
    vaultBtn.title = "Vault";
  }

  if (leaderboardBtn) {
    leaderboardBtn.disabled = false;
    leaderboardBtn.style.opacity = "1";
    leaderboardBtn.style.pointerEvents = "auto";
    leaderboardBtn.title = "Leaderboard";
  }

  if (logoutBtn) {
    logoutBtn.disabled = false;
    logoutBtn.style.opacity = "1";
    logoutBtn.style.pointerEvents = "auto";
    logoutBtn.title = "Logout";
  }
}

// ========================================
// GAME STATE RESET FUNCTIONS
// ========================================

// Complete reset function - call this when starting a new grow
function resetGameState() {
  console.log("🔄 [DEBUG] Resetting game state for new grow");

  // Clear all previous selections
  resetSelectionScreen();

  // Reset plant state completely
  resetPlantState();

  // Clear global game selections
  resetGlobalSelections();

  // Reset UI states
  resetUIState();

  // Reset event listener setup flags to allow re-setup
  window.beginRitualButtonSetup = false;
  window.feedingButtonsSetup = false;

  console.log("🔄 [DEBUG] Game state reset complete");
}

// Reset selection screen - clear all selected items
function resetSelectionScreen() {
  console.log("🔄 [DEBUG] Clearing selection screen");

  // Clear seed selections
  document.querySelectorAll(".seed-item").forEach((item) => {
    item.classList.remove("selected");
  });

  // Clear soil selections
  document.querySelectorAll(".soil-item").forEach((item) => {
    item.classList.remove("selected");
  });

  // Clear defense selections
  document.querySelectorAll(".defense-item").forEach((item) => {
    item.classList.remove("selected");
  });

  // Clear light selections
  document.querySelectorAll(".light-item").forEach((item) => {
    item.classList.remove("selected");
  });

  // Clear feeding schedule selections
  document.querySelectorAll(".nutrientOption").forEach((option) => {
    option.classList.remove("selected");
  });

  // Reset grid headers to inactive state
  document.querySelectorAll(".gridHeader").forEach((header) => {
    header.classList.remove("active");
  });

  // Reset water counts to 0
  const stages = ["sprout", "vegetative", "flowering"];
  stages.forEach((stage) => {
    const waterDisplay = document.getElementById(`${stage}Water`);
    if (waterDisplay) {
      waterDisplay.textContent = "0";
    }
  });

  console.log("🔄 [DEBUG] Selection screen cleared");
}

// Reset plant state to defaults
function resetPlantState() {
  console.log("🔄 [DEBUG] Resetting plant state");

  // Reset plant object to initial state
  Object.assign(plant, {
    seedType: null,
    soilType: null,
    defenseType: null,
    health: 100,
    water: 100,
    light: 100,
    nutrients: 100,
    stress: 0,
    growthStage: 0,
    stageTime: 0,
    totalGrowthTime: 0,
    harvestTimer: null,
    harvestTimeLeft: 24 * 60 * 60,
    potency: 100,
    weight: 0,
    healthSum: 0,
    healthTicks: 0,
    optimalLight: 100,
    pestPenalty: 1,
    raiderPenalty: 1,
    lightEfficiencySum: 0,
    lightEfficiencyTicks: 0,
    potencyBoost: 1,
    feedingSchedule: {
      sprout: { waterTimes: 0, nutrientMix: null },
      vegetative: { waterTimes: 0, nutrientMix: null },
      flowering: { waterTimes: 0, nutrientMix: null },
    },
    scoresRecorded: false,
    lastWaterTime: 0,
    lastFeedTime: 0,
    overWatered: false,
    overFed: false,
    overWateredTime: 0,
    overFedTime: 0,
    frozenStats: undefined,
    // Clear any nutrient application flags
    sproutNutrientApplied: false,
    vegetativeNutrientApplied: false,
    floweringNutrientApplied: false,
    deathTicks: 0,
  });

  // ✅ Always clear events when resetting
  events = [];
  const eventsList = document.querySelector(".eventsList");
  if (eventsList) {
    eventsList.innerHTML = "";
  }

  // Clear any running timers
  if (plant.growthTimer) {
    clearInterval(plant.growthTimer);
    plant.growthTimer = null;
  }

  if (plant.harvestTimer) {
    clearInterval(plant.harvestTimer);
    plant.harvestTimer = null;
  }

  // Reset persistent submission flag for new game
  window.gameScoresSubmitted = false;

  // Reset act of god state
  if (typeof actOfGodOccurred !== "undefined") {
    actOfGodOccurred = false;
  }
  if (typeof actOfGodTimeout !== "undefined" && actOfGodTimeout) {
    clearTimeout(actOfGodTimeout);
    actOfGodTimeout = null;
  }

  console.log("🔄 [DEBUG] Plant state reset complete");
}

// Reset global game selections
function resetGlobalSelections() {
  console.log("🔄 [DEBUG] Clearing global selections");

  // Clear window.gameSelections
  window.gameSelections = {
    seed: null,
    soil: null,
    defense: null,
  };

  // Clear window.gameSetup
  window.gameSetup = {
    selections: {
      seed: null,
      soil: null,
      defense: null,
    },
    schedule: {
      sprout: { waterTimes: 0, nutrientMix: null },
      vegetative: { waterTimes: 0, nutrientMix: null },
      flowering: { waterTimes: 0, nutrientMix: null },
    },
  };

  console.log("🔄 [DEBUG] Global selections cleared");
}

// Reset UI state
function resetUIState() {
  console.log("🔄 [DEBUG] Resetting UI state");

  // Reset begin button
  const beginBtn = document.getElementById("beginRitualBtn");
  if (beginBtn) {
    beginBtn.disabled = true;
    beginBtn.textContent = "Select All";
  }

  // Reset start growing button
  const startBtn = document.getElementById("startGrowingBtn");
  if (startBtn) {
    startBtn.disabled = true;
    startBtn.textContent = "Set Schedule";
  }

  // Clear any detail views
  const detailView = document.querySelector(".itemDetailView");
  if (detailView) {
    detailView.innerHTML =
      '<div class="emptyDetail"><p>Select an item to view details</p></div>';
  }

  // Clear selection icons if they exist
  const icons = ["seedIcon", "soilIcon", "defenseIcon", "lightIcon"];
  icons.forEach((iconId) => {
    const icon = document.getElementById(iconId);
    if (icon) {
      icon.innerHTML = "";
    }
  });

  console.log("🔄 [DEBUG] UI state reset");
}

// Initialize selection screen properly
function initializeSelectionScreen() {
  console.log("🔄 [DEBUG] Initializing selection screen");

  // Make sure all selection handlers are set up
  setupSelectionEventListeners();

  // Update button states
  updateBeginButton();

  // Refresh any dynamic content
  if (typeof checkAndUnlockSeeds === "function") {
    checkAndUnlockSeeds();
  }

  if (typeof checkAndUnlockLights === "function") {
    checkAndUnlockLights();
  }
}

// Debugging function to check current state
function debugCurrentState() {
  console.log("🔍 [DEBUG] Current game state:", {
    plantSeedType: plant.seedType,
    plantSoilType: plant.soilType,
    plantDefenseType: plant.defenseType,
    gameSelections: window.gameSelections,
    feedingSchedule: plant.feedingSchedule,
    selectedSeeds: document.querySelectorAll(".seed-item.selected").length,
    selectedSoils: document.querySelectorAll(".soil-item.selected").length,
    selectedDefenses: document.querySelectorAll(".defense-item.selected")
      .length,
  });
}

// ========================================
// LIGHT SYSTEM AND ACTS OF GOD
// ========================================

// Light system state (some variables may already exist in missing-data.js)
let lightIsOn = true;
let lightOffStartTime = null;
let lightOffHealthDrainRate = 0;

// Light unlock thresholds (from original)
const lightUnlockThresholds = [
  { key: "desk", threshold: 420 },
  { key: "grow", threshold: 900 },
  { key: "plasma", threshold: 1500 },
  { key: "quantum", threshold: 2100 },
];

// Acts of God are already defined in missing-data.js - using existing declaration

// Schedule act of god once per game at random time
// Note: actOfGodOccurred and actOfGodTimeout are defined in missing-data.js
function scheduleActOfGod() {
  if (typeof actOfGodOccurred !== "undefined" && actOfGodOccurred) return;
  if (typeof actOfGodTimeout !== "undefined" && actOfGodTimeout) return;

  // Pick random time between 20% and 80% of total growth time
  const min = Math.floor(plant.totalGrowthTime * 0.2);
  const max = Math.floor(plant.totalGrowthTime * 0.8);
  const triggerAt = Math.floor(Math.random() * (max - min)) + min;

  // Use the existing timeout variable from missing-data.js
  if (typeof actOfGodTimeout !== "undefined") {
    actOfGodTimeout = setTimeout(() => {
      if (typeof actOfGodOccurred !== "undefined" && !actOfGodOccurred) {
        const godEvent =
          actsOfGod[Math.floor(Math.random() * actsOfGod.length)];

        // 30% chance to deflect
        if (Math.random() < 0.3) {
          addEventToLog(
            "The act of god was deflected by darker powers. Your plant is unharmed.",
            "info"
          );
        } else {
          godEvent.effect(plant);
          addEventToLog(`Act of God: ${godEvent.message}`, "error");
        }
        actOfGodOccurred = true;
      }
    }, triggerAt * 500); // Convert to milliseconds (500ms per tick)
  }
}

// Light failure system
function maybeTriggerLightFailure() {
  if (lightIsOn && Math.random() < 0.05) {
    // 0.5% chance per tick
    turnOffLights();
  }
}

function turnOffLights() {
  if (!lightIsOn) return;

  lightIsOn = false;
  lightOffStartTime = Date.now();
  plant.health = Math.floor(Math.random() * 41) + 30; // Set health to 30-70
  lightOffHealthDrainRate = 0.05;

  addEventToLog("Lights have gone out! Fix them quickly!", "warning");
  updatePlantStatus();
  updateResourceBars();
}

function fixLights() {
  if (!lightIsOn) {
    lightIsOn = true;
    lightOffStartTime = null;
    lightOffHealthDrainRate = 0;
    addEventToLog("Lights are back on!", "info");
    updatePlantStatus();
    updateResourceBars();
  }
}

// Helper function to get the best unlocked light
function getBestUnlockedLight() {
  const lightKeys = ["quantum", "plasma", "grow", "desk", "candle"];
  for (let i = 0; i < lightKeys.length; i++) {
    if (lightSources[lightKeys[i]] && lightSources[lightKeys[i]].unlocked) {
      return lightKeys[i];
    }
  }
  return "candle";
}

// Check and unlock lights based on total yield
async function checkAndUnlockLights() {
  const totalYield = await getPlayerTotalYield();
  let unlockedAny = false;

  lightUnlockThresholds.forEach(({ key, threshold }) => {
    if (!lightSources[key].unlocked && totalYield >= threshold) {
      lightSources[key].unlocked = true;
      addEventToLog(
        `Unlocked ${lightSources[key].name} for reaching ${threshold}g total yield!`,
        "info"
      );
      unlockedAny = true;
    }
  });

  if (unlockedAny) {
    updateLightSources();
    // Only auto-select if user hasn't manually selected a light
    if (!manualLightSelection) {
      const bestLight = getBestUnlockedLight();
      if (bestLight !== currentLight) {
        currentLight = bestLight;
        updateSelectionIcons();
        console.log(`Auto-selected best light: ${bestLight}`);
      }
    }
  }
}

// Growth stages matching your original game
const growthStages = [
  {
    name: "Sprout",
    time: 32,
    frames: 2,
    imagePrefix: "bloom",
    frameOffset: 0,
  },
  {
    name: "Vegetative",
    time: 48,
    frames: 2,
    imagePrefix: "bloom",
    frameOffset: 2,
  },
  {
    name: "Flowering",
    time: 64,
    frames: 4,
    imagePrefix: "bloom",
    frameOffset: 4,
  },
  { name: "Harvest", time: 0, image: "harvest.png" },
];

function initializeGameSimulation() {
  console.log("Initializing game simulation...");
  console.log("Game setup:", window.gameSetup);

  if (!window.gameSetup) {
    console.error("No game setup found!");
    return;
  }

  // Reset light state
  lightIsOn = true;
  lightOffStartTime = null;
  lightOffHealthDrainRate = 0;

  // Note: actOfGodOccurred and actOfGodTimeout are managed by missing-data.js

  // Initialize plant state with selections
  const { selections, schedule } = window.gameSetup;

  plant.seedType = selections.seed;
  plant.soilType = selections.soil;
  plant.defenseType = selections.defense;
  plant.feedingSchedule = schedule;

  // Calculate total growth time
  plant.totalGrowthTime = growthStages
    .slice(0, -1)
    .reduce((sum, stage) => sum + stage.time, 0);

  // Set initial optimal light
  plant.optimalLight = Math.floor(Math.random() * 61) + 30;

  // Initialize UI with current state
  updateSelectionIcons();
  updatePlantStatus();
  updateResourceBars();
  updateLightSources();
  checkAndUnlockLights();
  checkAndUnlockSeeds(); // Initialize unlocked seeds
  addEventToLog("Game started! Your plant begins to grow...", "info");

  // Schedule act of god
  scheduleActOfGod();

  // Start the game loop
  startGameLoop();
}

function updateSelectionIcons() {
  // Update seed icon
  const seedIcon = document.getElementById("seedIcon");
  if (seedIcon && plant.seedType && seedProperties[plant.seedType]) {
    seedIcon.innerHTML = `<img src="img/selections/${seedProperties[plant.seedType].image
      }" alt="Seed">`;
  }

  // Update soil icon
  const soilIcon = document.getElementById("soilIcon");
  if (soilIcon && plant.soilType) {
    const soilImages = {
      ossuary: "soil1.png",
      graveblend: "soil2.png",
      marrowmoss: "soil3.png",
    };
    soilIcon.innerHTML = `<img src="img/selections/${soilImages[plant.soilType]
      }" alt="Soil">`;
  }

  // Update defense icon
  const defenseIcon = document.getElementById("defenseIcon");
  if (defenseIcon && plant.defenseType) {
    defenseIcon.innerHTML = `<img src="img/selections/defense/${plant.defenseType}.png" alt="Defense">`;
  }

  // Update light icon
  const lightIcon = document.getElementById("lightIcon");
  if (lightIcon) {
    const lightIndex =
      { candle: 1, desk: 2, grow: 3, plasma: 4, quantum: 5 }[currentLight] || 1;
    lightIcon.innerHTML = `<img src="img/selections/light/light${lightIndex}.png" alt="Light">`;
  }
}

function updatePlantStatus() {
  // Update strain name
  const strainName = document.getElementById("strainName");
  if (strainName && plant.seedType && seedProperties[plant.seedType]) {
    strainName.textContent = seedProperties[plant.seedType].name;
  }

  // Update stage
  const currentStage = document.getElementById("currentStage");
  if (currentStage) {
    const stageNames = { 0: "SPROUT", 1: "VEG", 2: "FLOWER", 3: "HARVEST" };
    currentStage.textContent = stageNames[plant.growthStage] || "SPROUT";
  }

  // Update health
  const healthValue = document.getElementById("healthValue");
  if (healthValue) {
    healthValue.textContent = `${Math.round(plant.health)}%`;
  }

  // Update plant image
  updatePlantImage();
}

function updatePlantImage() {
  const plantContainer = document.querySelector(".plantImageContainer");
  const plantImage = document.getElementById("plantStageImage");
  if (!plantImage || !plantContainer) return;

  const stage = growthStages[plant.growthStage];
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

  plantImage.src = imagePath + `?v=${Date.now()}`;

  // Add light overlay when lights are off
  let existingOverlay = plantContainer.querySelector(".light-overlay");
  if (!lightIsOn) {
    if (!existingOverlay) {
      existingOverlay = document.createElement("div");
      existingOverlay.className = "light-overlay";
      existingOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 1000;
        color: white;
        font-family: 'Press Start 2P', monospace;
        text-align: center;
        font-size: 0.8em;
      `;
      existingOverlay.innerHTML = "Lights Out!<br>Click to Fix";
      existingOverlay.onclick = fixLights;
      plantContainer.appendChild(existingOverlay);
    }
  } else if (existingOverlay) {
    existingOverlay.remove();
  }
}

function updateResourceBars() {
  // Calculate growth progress
  let elapsed = 0;
  for (let i = 0; i < plant.growthStage; i++) {
    elapsed += growthStages[i].time;
  }
  elapsed += plant.stageTime;
  const growthPercent = Math.min(100, (elapsed / plant.totalGrowthTime) * 100);

  // Update all bars
  updateBar("growthBar", growthPercent);
  updateBar("waterBar", plant.water);
  updateBar("lightBar", plant.light);
  updateBar("nutrientBar", plant.nutrients);
  updateBar("stressBar", plant.stress);
}

function updateBar(barId, percentage) {
  const bar = document.getElementById(barId);
  if (bar) {
    bar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
  }
}

function updateLightSources() {
  const lightSourcesElement = document.querySelector(".lightSources");
  if (!lightSourcesElement) return;

  // Hide light buttons during gameplay - only show in vault/equipment section
  lightSourcesElement.style.display = "none";
}

function addEventToLog(message, type = "info") {
  events.unshift({ message, type, time: Date.now() });

  // Keep only last 10 events
  if (events.length > 10) {
    events = events.slice(0, 10);
  }

  updateEventsList();
}

// showPestEvent() is now handled by missing-data.js with the advanced mini-game

function showRaiderEvent() {
  raiderActive = true;
  addEventToLog("Crypt bandits are sneaking into your garden!", "warning");

  // Defense check
  if (plant.defenseType === "hound") {
    setTimeout(() => {
      addEventToLog("Your Hound chased off the raiders!", "info");
      raiderActive = false;
    }, 2000);
    return;
  }

  // Apply damage after delay
  setTimeout(() => {
    const damagePercent = Math.floor(Math.random() * 10) + 5;
    plant.raiderPenalty *= 1 - damagePercent / 100;
    addEventToLog(`Raiders reduced yield by ${damagePercent}%.`, "error");
    raiderActive = false;
  }, 5000);
}

function showNutrientEvent() {
  nutrientActive = true;
  addEventToLog("Nutrient boost available!", "info");

  setTimeout(() => {
    const boostPercent = Math.floor(Math.random() * 10) + 5;
    plant.potencyBoost *= 1 + boostPercent / 100;
    addEventToLog(
      `Nutrient boost applied! Potency increased by ${boostPercent}%.`,
      "info"
    );
    nutrientActive = false;
  }, 3000);
}

function updateEventsList() {
  const eventsList = document.querySelector(".eventsList");
  if (!eventsList) return;

  eventsList.innerHTML = events
    .map(
      (event) => `<div class="eventItem ${event.type}">${event.message}</div>`
    )
    .join("");
}

let feedingTick = 0; // Local feeding tick counter like in backup.js

function startGameLoop() {
  console.log("Game loop starting with schedule:", plant.feedingSchedule);
  if (gameTimer) {
    clearInterval(gameTimer);
  }

  console.log("Starting game loop...");

  let feedingTick = 0; // Local feeding tick counter like in backup.js
  // Right after feedingTick++

  gameTimer = setInterval(() => {
    feedingTick++; // Increment feeding counter separately

    // Apply feeding schedule first (like in backup.js)
    const stageKey =
      ["sprout", "vegetative", "flowering"][plant.growthStage] || "flowering";
    const schedule = plant.feedingSchedule[stageKey];

    let feedInterval = 0;
    if (schedule && schedule.waterTimes > 0) {
      feedInterval = Math.max(
        1,
        Math.floor(growthStages[plant.growthStage].time / schedule.waterTimes)
      );
    }

    // Use feedingTick instead of plant.stageTime (like in backup.js)
    if (
      schedule &&
      schedule.waterTimes > 0 &&
      feedingTick % feedInterval === 0
    ) {
      let nuteAmount = 15;
      if (schedule.nutrientMix && nutrientMixes[schedule.nutrientMix]) {
        nuteAmount = nutrientMixes[schedule.nutrientMix].nutrientFeed;
      }

      plant.water = Math.min(100, plant.water + 20);
      console.log(`FEEDING: Adding ${nuteAmount} nutrients and 20 water`);

      // Apply nutrient mix bonuses (simplified)
      if (schedule.nutrientMix && !plant[stageKey + "NutrientApplied"]) {
        plant.potencyBoost *= nutrientMixes[schedule.nutrientMix].potency;
        plant[stageKey + "NutrientApplied"] = true;
      }

      plant.nutrients = Math.min(100, plant.nutrients + nuteAmount);
    }

    updatePlantResources();
    updatePlantStatus();
    updateResourceBars();

    // Add the health/efficiency tracking that was missing
    plant.healthSum += plant.health;
    plant.healthTicks++;

    // Calculate light efficiency for final scoring
    const maxDiff = 100;
    const diff = Math.abs(plant.light - plant.optimalLight);
    const efficiency = Math.max(0, 1 - diff / maxDiff);
    plant.lightEfficiencySum += efficiency;
    plant.lightEfficiencyTicks++;

    // Check for stage advancement
    if (plant.stageTime >= growthStages[plant.growthStage].time) {
      advanceGrowthStage();
    }

    plant.stageTime++;

    // Random events (very low chance for demo)
    maybeTriggerEvent();
  }, 500); // 1 second intervals for demo (original was 500ms)
}

function updatePlantResources() {
  // Natural resource drain
  if (plant.soilType && soilTypes[plant.soilType]) {
    const soil = soilTypes[plant.soilType];
    plant.water = Math.max(0, plant.water - soil.waterDrain);
    plant.nutrients = Math.max(0, plant.nutrients - 0.5);
  }

  // Light failure health drain
  if (!lightIsOn) {
    const timeOff = (Date.now() - lightOffStartTime) / 1000; // seconds
    lightOffHealthDrainRate = Math.min(1.0, 0.1 + timeOff / 300); // Increase over time
    plant.health = Math.max(0, plant.health - lightOffHealthDrainRate);
    plant.stress = Math.min(100, plant.stress + 0.5);

    // Update light value based on time off
    plant.light = Math.max(0, 100 - timeOff * 2); // Decrease by 2% per second
  } else {
    plant.light = 100;
  }

  // Check for random light failure
  maybeTriggerLightFailure();

  // Update stress based on conditions
  updatePlantStress();

  // Update health based on stress and resources
  updatePlantHealth();
}

function updatePlantStress() {
  // Light stress
  const lightDiff = Math.abs(plant.light - plant.optimalLight);
  if (lightDiff > 35) {
    plant.stress = Math.min(100, plant.stress + 0.5);
  } else {
    plant.stress = Math.max(0, plant.stress - 1);
  }

  // Resource stress
  if (plant.water <= 0 || plant.nutrients <= 0) {
    plant.stress = Math.min(100, plant.stress + 1);
  } else if (plant.water < 30 || plant.nutrients < 30) {
    plant.stress = Math.min(100, plant.stress + 0.5);
  } else if (plant.water > 95 || plant.nutrients > 95) {
    plant.stress = Math.min(100, plant.stress + 0.5);
  } else {
    plant.stress = Math.max(0, plant.stress - 0.5);
  }
}

function updatePlantHealth() {
  let healthPenalty = 0;
  if (plant.water < 30 || plant.water > 95) healthPenalty += 0.5;
  if (plant.nutrients < 30 || plant.nutrients > 95) healthPenalty += 0.5;
  if (plant.stress > 80) healthPenalty += 0.5;

  plant.health = Math.max(0, Math.min(100, plant.health - healthPenalty));

  // Death tick system - gives 3 chances
  if (plant.health <= 0) {
    plant.deathTicks = (plant.deathTicks || 0) + 1;
    if (plant.deathTicks >= 3) {
      gameOver();
    }
  } else {
    plant.deathTicks = 0;
  }
}

function advanceGrowthStage() {
  if (plant.growthStage < growthStages.length - 1) {
    plant.growthStage++;
    plant.stageTime = 0;
    feedingTick = 0;

    // Reset nutrient application for new stage
    const stageKey =
      ["sprout", "vegetative", "flowering"][plant.growthStage] || "flowering";
    plant[stageKey + "NutrientApplied"] = false;

    // Update optimal light for new stage
    if (plant.growthStage < growthStages.length - 1) {
      plant.optimalLight = Math.floor(Math.random() * 61) + 30;
    }

    addEventToLog(
      `Entered ${growthStages[plant.growthStage].name} stage!`,
      "info"
    );
    updatePlantImage();
  } else {
    // Game complete
    clearInterval(gameTimer);

    // Calculate final values BEFORE freezing
    let avgHealth =
      plant.healthTicks > 0 ? plant.healthSum / plant.healthTicks / 100 : 1;
    let avgLightEfficiency =
      plant.lightEfficiencyTicks > 0
        ? plant.lightEfficiencySum / plant.lightEfficiencyTicks
        : 1;

    // Calculate using the same formula as game.js
    let basePotency = 15 + Math.random() * 10;
    let finalPotencyRaw =
      basePotency * plant.potencyBoost * plant.pestPenalty * avgLightEfficiency;
    let finalPotency = Math.round(finalPotencyRaw);
    finalPotency = Math.max(0, Math.min(70, finalPotency)); // Cap at 70

    let baseYield = 1 + Math.random() * 99;
    let lightBonus = lightSources[currentLight]?.yieldBonus || 1.0;
    let finalWeightRaw =
      baseYield *
      avgHealth *
      plant.raiderPenalty *
      lightBonus *
      avgLightEfficiency;
    let finalWeight = Math.round(finalWeightRaw);
    finalWeight = Math.max(1, Math.min(100, finalWeight));

    // Freeze with calculated values
    plant.frozenStats = {
      healthSum: plant.healthSum,
      healthTicks: plant.healthTicks,
      lightEfficiencySum: plant.lightEfficiencySum,
      lightEfficiencyTicks: plant.lightEfficiencyTicks,
      pestPenalty: plant.pestPenalty,
      raiderPenalty: plant.raiderPenalty,
      potencyBoost: plant.potencyBoost,
      weight: finalWeight, // Use calculated value
      potency: finalPotency, // Use calculated value
    };

    addEventToLog("Plant is ready for harvest!", "info");

    // Note: Badge checking moved to after score submission to ensure totalGrows is updated

    showHarvestScreen();
  }
}

function gameOver() {
  clearInterval(gameTimer);
  addEventToLog("Your plant has died from neglect!", "error");

  setTimeout(async () => {
    alert("Game Over! Your plant died. Starting over...");
    // Reset game state to clear event listener flags
    resetGameState();
    await renderSeedSelectionInterface();
  }, 2000);
}

// Add score submission to harvest screen
async function submitScores(potency, weight) {
  if (!currentGrower) return;

  // Double-check against persistent flag to prevent re-submissions
  if (window.gameScoresSubmitted) {
    console.log("Scores already submitted (persistent flag), skipping");
    return;
  }

  // Use parameters if frozenStats is missing (fallback)
  const finalPotency = plant.frozenStats ? plant.frozenStats.potency : potency;
  const finalWeight = plant.frozenStats ? plant.frozenStats.weight : weight;

  if (!finalPotency || !finalWeight) {
    console.error("Cannot submit scores: missing potency or weight data");
    return;
  }

  try {
    // Prepare enhanced data for cloudscript
    const growthConditions = {
      survivedActOfGod: plant.survivedActOfGod || false,
      usedOptimalFeeding: plant.usedOptimalFeeding || false,
      isPerfectCombo: plant.isPerfectCombo || false,
    };

    // Get current seeds unlocked count
    const seedsUnlocked = getUnlockedSeedsCount();

    // Submit exact frozen numbers as integers - single source of truth
    console.log("Submitting scores:", {
      potency: Math.round(finalPotency),
      weight: Math.round(finalWeight),
      growthConditions: growthConditions,
      seedsUnlocked: seedsUnlocked,
    });

    // Submit potency first with individual error handling
    try {
      // Track all potency scores for this grower in PlayFab user data
      await PlayFabService.appendToUserArray(
        "potencyHistory",
        Math.round(finalPotency)
      );
      // Update leaderboard via Cloud Script validation with enhanced data
      await PlayFabService.executeCloudScript("submitScore", {
        scoreType: "potency",
        scoreValue: Math.round(finalPotency),
        gameState: plant,
        growthConditions: growthConditions,
        seedsUnlocked: seedsUnlocked,
      });
      console.log("Potency score submitted successfully");
    } catch (potencyError) {
      console.error("Failed to submit potency score:", potencyError);
      // Don't return here - try yield submission too
    }

    // Submit yield with individual error handling and badge support
    try {
      // Track all yield scores for this grower in PlayFab user data
      await PlayFabService.appendToUserArray(
        "yieldHistory",
        Math.round(finalWeight)
      );
      // After calling appendToUserArray
      const currentYieldHistory = await PlayFabService.getUserArray(
        "yieldHistory"
      );
      // Update leaderboard via Cloud Script validation with enhanced data
      const result = await PlayFabService.executeCloudScript("submitScore", {
        scoreType: "yield",
        scoreValue: Math.round(finalWeight),
        gameState: plant,
        yieldHistory: currentYieldHistory,
        growthConditions: growthConditions,
        seedsUnlocked: seedsUnlocked,
      });
      console.log("Yield score submitted successfully");

      // Handle new badges if any were earned
      if (result && result.newBadges && result.newBadges.length > 0) {
        console.log("🏆 [DEBUG] Backend awarded badges:", result.newBadges);

        // Show popups for newly awarded badges immediately
        result.newBadges.forEach((badgeId, index) => {
          setTimeout(() => {
            console.log(
              `🏆 [DEBUG] Showing popup for backend-awarded badge: ${badgeId}`
            );
            if (typeof showBadgeModal === "function") {
              showBadgeModal(badgeId);
            } else {
              alert(`🏆 Badge Unlocked: ${badgeId}`);
            }
          }, index * 2000); // 2 second delay between badges
        });
      }

      // Handle tier progression
      if (result && result.newTier) {
        console.log("🎖️ New tier achieved:", result.newTier);
        showTierProgressionModal(result.newTier);
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
        gameState: plant,
        yieldHistory: yieldArr,
        growthConditions: growthConditions,
        seedsUnlocked: seedsUnlocked,
      });
    } catch (yieldError) {
      console.error("Failed to submit yield score:", yieldError);
    }

    // Record this seed as successfully grown (for revealing flower images in vault)
    const seedKey = plant.seedType || window.gameSelections?.seed;
    if (seedKey) {
      await recordGrownSeed(seedKey);
    }

    // Update local high scores
    await loadHighScores();
  } catch (error) {
    console.error("Failed to submit scores:", error);
  }
}

// Badge popup function - now uses the modal system from badge-modal.js
function showBadgePopup(badgeId) {
  // The showBadgePopup function is now handled by badge-modal.js
  // This function will be overridden by the one in badge-modal.js
  if (typeof showBadgeModal === "function") {
    showBadgeModal(badgeId);
  } else {
    // Fallback to alert if modal system isn't loaded yet
    alert(`Congratulations! You've earned a new badge: ${badgeId}`);
  }
}

function marrowCorpSeedTheft() {
  // Only trigger if not protected by Vault
  if (plant.defenseType === "vault") {
    console.log("Vault protection active - no seed theft");
    return;
  }

  // Only steal seeds if player has more than 1 seed (don't steal the last one)
  const currentLives = getLivesForPlayer();
  console.log(`Checking seed theft: current lives = ${currentLives}`);

  if (Math.random() < 0.25 && currentLives > 1) {
    console.log("MarrowCorp seed theft triggered!");
    setLivesForPlayer(currentLives - 1);
    saveHighScores();
    updatePersistentSeedCount();
    // Show message to player
    setTimeout(function () {
      alert("MarrowCorp agents have stolen 1 of your seeds!");
    }, 500);
  } else {
    console.log("Seed theft avoided (lucky or protected)");
  }
}

async function showHarvestScreen() {
  // Switch to harvest component
  showComponent("harvest");

  // Re-enable navigation buttons when harvest screen appears
  enableNavigationButtons();

  // Ensure currentGrower is set from session if lost
  if (!currentGrower) {
    currentGrower = PlayFabService.getSession();
  }

  // Use frozenStats as single source of truth - no fallbacks unless missing
  if (!plant.frozenStats) {
    console.error("frozenStats missing - this should not happen!");
    return;
  }

  let finalPotency = plant.frozenStats.potency;
  let finalWeight = plant.frozenStats.weight;

  // Get strain info
  const strainName =
    plant.seedType && seedProperties[plant.seedType]
      ? seedProperties[plant.seedType].name
      : "Unknown Strain";

  // Get the correct flower image
  const flowerImage =
    plant.seedType && seedProperties[plant.seedType]?.flowerImage
      ? `img/selections/${seedProperties[plant.seedType].flowerImage}`
      : "img/stages/harvest.png";

  // Update the harvest component with actual data
  document.getElementById("harvestPlantImage").src = flowerImage;
  document.getElementById("harvestPlantImage").alt = `${strainName} Flower`;
  document.getElementById("finalPotency").textContent = `${finalPotency}%`;
  document.getElementById("finalWeight").textContent = `${finalWeight}g`;

  // Update grower name and strain name
  const growerName = currentGrower || PlayFabService.getSession() || "Unknown";
  document.getElementById("harvestGrowerName").textContent = growerName;
  document.getElementById("harvestStrainName").textContent = strainName;

  // Add event listeners for the buttons
  document
    .getElementById("newGameHarvestBtn")
    ?.addEventListener("click", async () => {
      console.log("🔄 [DEBUG] New Game button clicked - resetting state");
      resetGameState(); // Reset everything before going back
      showComponent("selection");
    });

  document.getElementById("lookForSeedsBtn")?.addEventListener("click", () => {
    const lookBtn = document.getElementById("lookForSeedsBtn");
    const msgDiv = document.getElementById("lookForSeedsMsg");

    // Disable button after one use
    lookBtn.disabled = true;

    if (Math.random() < 0.2) {
      // 20% chance to find a seed
      setLivesForPlayer(getLivesForPlayer() + 1);
      saveHighScores();
      updatePersistentSeedCount();
      msgDiv.innerHTML =
        "<span style='color:#ffd700;'>You found a seed!</span> (+1 Seed)";
    } else {
      msgDiv.innerHTML =
        "<span style='color:#bfcfff;'>No seeds found this time.</span>";
    }
  });

  // Replace the copyImageBtn event listener in showHarvestScreen function
  document
    .getElementById("copyImageBtn")
    ?.addEventListener("click", async () => {
      const harvestLayout = document.querySelector(".harvestLayout");
      if (!harvestLayout || !window.html2canvas) {
        alert("Screenshot functionality not available");
        return;
      }

      try {
        // Hide the buttons temporarily for cleaner screenshot
        const buttons = harvestLayout.querySelectorAll(".beginRitualBtn");
        buttons.forEach((btn) => (btn.style.display = "none"));

        // Capture the harvest layout
        const canvas = await window.html2canvas(harvestLayout, {
          backgroundColor: "#000",
          scale: 2, // Higher quality
          logging: false,
        });

        // Restore buttons
        buttons.forEach((btn) => (btn.style.display = ""));

        // Convert to blob and copy to clipboard
        canvas.toBlob(async (blob) => {
          try {
            await navigator.clipboard.write([
              new window.ClipboardItem({ "image/png": blob }),
            ]);
            alert("Harvest screenshot copied to clipboard!");
          } catch (err) {
            // Fallback: download the image
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `harvest_${Date.now()}.png`;
            a.click();
            URL.revokeObjectURL(url);
          }
        }, "image/png");
      } catch (error) {
        console.error("Screenshot failed:", error);
        alert("Failed to capture screenshot");
      }
    });

  // Submit scores to PlayFab leaderboards - prevent re-submissions
  if (!plant.scoresRecorded) {
    console.log("Submitting scores for the first time");
    await submitScores(finalPotency, finalWeight);
    plant.scoresRecorded = true;

    // Record this seed as successfully grown to show flower art in vault
    if (plant.seedType) {
      console.log(`🌸 Recording ${plant.seedType} as successfully grown`);
      await recordGrownSeed(plant.seedType);
    }

    // Also store in a more persistent way to prevent re-submissions
    // even if plant object gets recreated
    window.gameScoresSubmitted = true;

    // Note: totalGrows is automatically incremented by the cloud script during score submission

    // Check for newly earned badges AFTER score submission
    // Wait a moment for cloud script to update totalGrows
    console.log("🏆 [DEBUG] Waiting for cloud script to update totalGrows...");
    setTimeout(async () => {
      console.log("🏆 [DEBUG] Checking for badges after score submission...");
      await safeCheckAndAwardBadges();
    }, 2000); // Wait 2 seconds for cloud script to complete

    marrowCorpSeedTheft();
  } else {
    console.log("Scores already submitted, skipping");
  }

  // Add test button to page for debugging
  document.addEventListener("DOMContentLoaded", () => {
    // Google client will be initialized by initClient() in HTML after SDK loads
    console.log("DOM loaded, waiting for Google SDK initialization...");

    // Add a test button for debugging
    const testBtn = document.createElement("button");
    testBtn.textContent = "Test GROWLAB";
    testBtn.style.cssText =
      "position: fixed; top: 10px; left: 10px; z-index: 9999; padding: 10px; background: red; color: white; border: none; cursor: pointer;";
    testBtn.onclick = testGROWLABInterface;
    document.body.appendChild(testBtn);

    // Add component switching test to window
    window.testComponentSwitching = testComponentSwitching;
    console.log(
      "🧪 Component switching test available: window.testComponentSwitching()"
    );
  });
}

function startGameSimulation() {
  // Switch to game component
  showComponent("game");

  // Disable navigation buttons during game simulation
  disableNavigationButtons();

  // Initialize the game with actual data
  initializeGameSimulation();
}

// Load leaderboard data and display it
async function loadLeaderboardData() {
  try {
    // Load both leaderboards
    const [potencyData, yieldData] = await Promise.all([
      PlayFabService.getLeaderboard("potency", 100),
      PlayFabService.getLeaderboard("TotalYield", 100),
    ]);

    // Process and display potency leaderboard
    displayLeaderboardSection(
      potencyData,
      "potencyBoard",
      "potencyCurrentUser",
      "%",
      currentGrower
    );

    // Process and display yield leaderboard
    displayLeaderboardSection(
      yieldData,
      "yieldBoard",
      "yieldCurrentUser",
      "g",
      currentGrower
    );
  } catch (error) {
    console.error("Failed to load leaderboard:", error);
    document.getElementById("potencyBoard").innerHTML =
      '<div class="noDataMessage">Failed to load data</div>';
    document.getElementById("yieldBoard").innerHTML =
      '<div class="noDataMessage">Failed to load data</div>';
  }

  // Back button
  document
    .getElementById("backFromLeaderboard")
    ?.addEventListener("click", async () => {
      showComponent("selection");
    });
}

// Add this function to handle leaderboard button click
async function showLeaderboard() {
  // Switch to leaderboard component
  showComponent("leaderboard");

  // Load leaderboard data
  try {
    // Load both leaderboards
    const [potencyData, yieldData] = await Promise.all([
      PlayFabService.getLeaderboard("potency", 100),
      PlayFabService.getLeaderboard("TotalYield", 100),
    ]);

    // Process and display potency leaderboard
    displayLeaderboardSection(
      potencyData,
      "potencyBoard",
      "potencyCurrentUser",
      "%",
      currentGrower
    );

    // Process and display yield leaderboard
    displayLeaderboardSection(
      yieldData,
      "yieldBoard",
      "yieldCurrentUser",
      "g",
      currentGrower
    );
  } catch (error) {
    console.error("Failed to load leaderboard:", error);
    document.getElementById("potencyBoard").innerHTML =
      '<div class="noDataMessage">Failed to load data</div>';
    document.getElementById("yieldBoard").innerHTML =
      '<div class="noDataMessage">Failed to load data</div>';
  }

  // Back button
  document
    .getElementById("backFromLeaderboard")
    ?.addEventListener("click", async () => {
      showComponent("selection");
    });
}

function displayLeaderboardSection(
  data,
  boardId,
  currentUserId,
  unit,
  currentUsername
) {
  const board = document.getElementById(boardId);
  const currentUserSection = document.getElementById(currentUserId);

  if (!data || data.length === 0) {
    board.innerHTML = '<div class="noDataMessage">No data available</div>';
    return;
  }

  // Find current user in the data
  let currentUserEntry = null;
  let currentUserRank = null;

  data.forEach((entry, index) => {
    if (
      entry.DisplayName === currentUsername ||
      entry.PlayFabId === currentUsername
    ) {
      currentUserEntry = entry;
      currentUserRank = index + 1;
    }
  });

  // Display current user at top if they have a score
  if (currentUserEntry) {
    currentUserSection.style.display = "block";
    currentUserSection.innerHTML = `
      <div class="leaderboardEntry">
        <span class="rank">#${currentUserRank}</span>
        <span class="name">${currentUserEntry.DisplayName}</span>
        <span class="score">${currentUserEntry.StatValue}${unit}</span>
      </div>
    `;
  }

  // Display the rest of the leaderboard (excluding current user from main list)
  board.innerHTML = data
    .map((entry, i) => {
      const isCurrentUser =
        entry.DisplayName === currentUsername ||
        entry.PlayFabId === currentUsername;

      // Skip current user in main list since they're shown at top
      if (isCurrentUser) return "";

      return `
        <div class="leaderboardEntry">
          <span class="rank">#${i + 1}</span>
          <span class="name">${entry.DisplayName || "Anonymous"}</span>
          <span class="score">${entry.StatValue}${unit}</span>
        </div>
      `;
    })
    .filter((html) => html !== "") // Remove empty strings
    .join("");

  // If no entries after filtering, show message
  if (board.innerHTML === "") {
    board.innerHTML = '<div class="noDataMessage">No other players yet</div>';
  }
}

// Leaderboard button handler is now managed by updateHeaderButtons()

// Removed dynamic header system - buttons now directly navigate to sections

// Add this function to newgame.js to handle the Vault button click
function showVaultInterface() {
  // Switch to vault component
  showComponent("vault");

  // Initialize vault tabs and content
  initializeVaultTabs();

  // Populate initial content
  populateVaultSeeds();
  populateVaultBadges();
  populateVaultEquips();
}

function initializeVaultTabs() {
  const tabs = document.querySelectorAll(".vaultTab");
  const contents = document.querySelectorAll(".tabContent");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Remove active from all tabs and contents
      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => c.classList.remove("active"));

      // Add active to clicked tab and corresponding content
      tab.classList.add("active");
      const targetContent = document.getElementById(
        `${tab.dataset.tab}Content`
      );
      if (targetContent) {
        targetContent.classList.add("active");
      }

      // Clear detail view when switching tabs
      clearDetailView();
    });
  });
}

function clearDetailView() {
  const detailView = document.getElementById("detailView");
  if (detailView) {
    detailView.innerHTML = `
      <div class="emptyDetail">
        <p>Select an item to view details</p>
    </div>
  `;
  }
}

// Function to populate the vault with unlocked seeds
async function populateVaultSeeds() {
  const seedGrid = document.getElementById("vaultSeedGrid");
  if (!seedGrid) return;

  await initializeUnlockedSeeds();
  await initializeGrownSeeds();

  let totalYield = 0;
  try {
    const playerStats = await PlayFabService.getPlayerLeaderboardEntry(
      "TotalYield"
    );
    totalYield = playerStats ? playerStats.StatValue : 0;
  } catch (error) {
    console.warn("Could not fetch total yield");
  }

  const allSeeds = Object.keys(seedProperties);

  seedGrid.innerHTML = `
    <div class="itemGrid">
      ${allSeeds
      .map((seedKey, index) => {
        const seed = seedProperties[seedKey];
        const isUnlocked = unlockedSeeds[seedKey] || false;
        const isGrown = grownSeeds[seedKey] || false;
        const threshold = seedUnlockThresholds[index] || 0;

        if (isUnlocked) {
          if (isGrown) {
            // Seed has been grown - show seed image revealed (no mystery overlay)
            return `
              <div class="vaultItem unlocked grown" data-item-type="seed" data-item-key="${seedKey}" title="${seed.name}">
                <img src="img/selections/${seed.image}" alt="${seed.name}">
              </div>
            `;
          } else {
            // Seed unlocked but NOT grown yet - show seed with mystery overlay
            return `
              <div class="vaultItem unlocked mystery" data-item-type="seed" data-item-key="${seedKey}" title="${seed.name} - Grow to reveal!">
                <img src="img/selections/${seed.image}" alt="${seed.name}">
                <div class="mysteryOverlay">?</div>
              </div>
            `;
          }
        } else {
          return `
            <div class="vaultItem locked" title="Unlocks at ${threshold}g total yield">
              <div class="lockedIcon">?</div>
              <div class="unlockRequirement">${threshold}g</div>
            </div>
          `;
        }
      })
      .join("")}
    </div>
  `;

  // Add click handlers for unlocked seeds
  addVaultItemHandlers("seed");
}

// ========================================
// HELPER FUNCTIONS FOR ENHANCED BADGE TRACKING
// ========================================

// Get count of unlocked seeds
function getUnlockedSeedsCount() {
  // This should return the actual count of unlocked seeds
  // For now, return a default value - you may need to implement this based on your seed system
  return 6; // Default starting seeds
}

// Data cleanup function for soft reset
async function cleanupUserData(resetType = "all") {
  try {
    console.log(`🧹 Starting data cleanup with reset type: ${resetType}`);

    const result = await PlayFabService.executeCloudScript("cleanupUserData", {
      resetType: resetType,
    });

    if (result.success) {
      console.log("✅ Data cleanup completed:", result.actions);
      alert(
        `Data cleanup completed successfully!\n\nActions taken:\n${result.actions.join(
          "\n"
        )}`
      );

      // Reload the page to refresh all data
      if (resetType === "all" || resetType === "badges") {
        location.reload();
      }
    } else {
      console.error("❌ Data cleanup failed:", result.error);
      alert(`Data cleanup failed: ${result.error}`);
    }
  } catch (error) {
    console.error("❌ Error during data cleanup:", error);
    alert(`Error during data cleanup: ${error.message}`);
  }
}

// Show tier progression modal
function showTierProgressionModal(newTier) {
  console.log(`🎖️ Tier progression to tier ${newTier}`);
  // You can implement a tier progression modal here
  // For now, just show an alert
  alert(`Congratulations! You've reached Tier ${newTier}!`);
}

// ========================================
// FIXED BADGE CHECKING FUNCTION
// ========================================

// Replace your existing checkAndAwardBadges function with this corrected version:
async function checkAndAwardBadges() {
  try {
    console.log("🏆 [DEBUG] Starting badge check...");

    // Ensure badge definitions are loaded
    if (!window.badgeDefinitions) {
      console.log("🏆 [DEBUG] Loading badge definitions...");
      await loadBadgeDefinitions();
    }

    console.log(
      "🏆 [DEBUG] Badge definitions loaded:",
      window.badgeDefinitions
    );

    // Get player progress from PlayFab Internal Data
    console.log("🏆 [DEBUG] Getting player progress from PlayFab...");
    const playerProgressData = await new Promise((resolve, reject) => {
      PlayFab.ClientApi.ExecuteCloudScript(
        { FunctionName: "getPlayerProgress", FunctionParameter: {} },
        (result, error) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result.data);
        }
      );
    });

    let playerProgress = {
      totalGrows: 0,
      badges: [],
      badgePopupsShown: [],
      currentTier: 1,
      totalYield: 0,
    };

    if (playerProgressData && playerProgressData.playerProgress) {
      playerProgress = playerProgressData.playerProgress;
      // Ensure badgePopupsShown exists (for existing players)
      if (!playerProgress.badgePopupsShown) {
        playerProgress.badgePopupsShown = [];
      }
    }

    console.log("🏆 [DEBUG] Player progress:", playerProgress);

    // Get current total yield for badge checking
    const currentTotalYield = await getPlayerTotalYield();
    playerProgress.totalYield = currentTotalYield;

    const newlyAwardedBadges = [];
    const badgesToShowPopup = []; // Badges that need popups (newly awarded OR previously unlocked but not shown)

    if (window.badgeDefinitions && window.badgeDefinitions.badges) {
      console.log(
        "🏆 [DEBUG] Checking badges:",
        Object.keys(window.badgeDefinitions.badges)
      );

      Object.keys(window.badgeDefinitions.badges).forEach((badgeId) => {
        const badge = window.badgeDefinitions.badges[badgeId];
        console.log(`🏆 [DEBUG] Checking badge ${badgeId}:`, badge);

        if (!badge.requirement) {
          console.log(
            `🏆 [DEBUG] Badge ${badgeId} has no requirement, skipping`
          );
          return;
        }

        // Check initial state
        const wasUnlocked = playerProgress.badges.includes(badgeId);
        const popupAlreadyShown =
          playerProgress.badgePopupsShown.includes(badgeId);
        const meetsRequirement = checkBadgeRequirement(
          badge.requirement,
          playerProgress
        );

        console.log(
          `🏆 [DEBUG] Badge ${badgeId}: wasUnlocked=${wasUnlocked}, popupAlreadyShown=${popupAlreadyShown}, meetsRequirement=${meetsRequirement}`
        );

        // Award badge if requirement is met and not already unlocked
        if (meetsRequirement && !wasUnlocked) {
          console.log(`🏆 [DEBUG] Awarding badge: ${badgeId}`);
          playerProgress.badges.push(badgeId);
          newlyAwardedBadges.push(badgeId);
        }

        // *** KEY FIX: Check current unlock status AFTER potential awarding ***
        const isNowUnlocked = playerProgress.badges.includes(badgeId);

        // Show popup if badge is unlocked (either newly awarded or previously) but popup hasn't been shown
        // TEMPORARY: Ignore popup already shown flag for testing
        if (isNowUnlocked) {
          console.log(
            `🎉 [DEBUG] Badge popup needed for: ${badgeId} (ignoring popup already shown flag)`
          );
          badgesToShowPopup.push(badgeId);
          // Mark popup as shown
          if (!playerProgress.badgePopupsShown.includes(badgeId)) {
            playerProgress.badgePopupsShown.push(badgeId);
          }
        }
      });

      // Save updated player progress if any changes were made
      if (newlyAwardedBadges.length > 0 || badgesToShowPopup.length > 0) {
        console.log(
          `🏆 [DEBUG] Saving player progress: ${newlyAwardedBadges.length} new badges, ${badgesToShowPopup.length} popups to show`
        );
        await savePlayerProgress(playerProgress);

        // Show popups for badges that need them
        if (badgesToShowPopup.length > 0) {
          console.log(
            `🎉 [DEBUG] Showing popups for ${badgesToShowPopup.length} badges:`,
            badgesToShowPopup
          );

          // Test if modal elements exist
          const modal = document.getElementById("badgeModal");
          console.log("🎉 [DEBUG] Badge modal element:", modal);

          if (typeof showMultipleBadges === "function") {
            console.log("🎉 [DEBUG] Using showMultipleBadges function");
            showMultipleBadges(badgesToShowPopup);
          } else if (typeof showBadgeModal === "function") {
            console.log("🎉 [DEBUG] Using showBadgeModal function (fallback)");
            // Fallback: show badges one by one
            badgesToShowPopup.forEach((badgeId, index) => {
              setTimeout(() => {
                console.log(
                  `🎉 [DEBUG] Showing badge ${badgeId} via showBadgeModal`
                );
                showBadgeModal(badgeId);
              }, index * 2000); // 2 second delay between badges
            });
          } else {
            console.log("🎉 [DEBUG] Using alert fallback");
            // Final fallback: use alerts
            badgesToShowPopup.forEach((badgeId, index) => {
              setTimeout(() => {
                alert(`🏆 Badge Unlocked: ${badgeId}`);
              }, index * 1000);
            });
          }
        } else {
          console.log("🎉 [DEBUG] No badges need popups");
        }
      }
    }
  } catch (error) {
    console.error("Failed to check and award badges:", error);
  }
}

// ========================================
// ADDITIONAL SAFETY: PREVENT MULTIPLE CALLS
// ========================================

// Add this flag to prevent multiple simultaneous badge checks
let badgeCheckInProgress = false;

// Wrapper function to prevent race conditions
async function safeCheckAndAwardBadges() {
  if (badgeCheckInProgress) {
    console.log("🏆 [DEBUG] Badge check already in progress, skipping");
    return;
  }

  badgeCheckInProgress = true;
  try {
    await checkAndAwardBadges();
  } finally {
    badgeCheckInProgress = false;
  }
}

// ========================================
// DEBUGGING HELPER
// ========================================

// Add this function to help debug badge popup issues
function debugBadgeState(badgeId) {
  console.log(`🔍 [DEBUG] Badge ${badgeId} state:`, {
    isUnlocked: window.playerProgress?.badges?.includes(badgeId),
    popupShown: window.playerProgress?.badgePopupsShown?.includes(badgeId),
    meetsRequirement: checkBadgeRequirement(
      window.badgeDefinitions?.badges?.[badgeId]?.requirement,
      window.playerProgress
    ),
  });
}

// Test function to manually trigger a badge popup
function testBadgePopup() {
  console.log("🏆 [DEBUG] Testing badge popup system...");

  // Test if modal exists
  const modal = document.getElementById("badgeModal");
  console.log("🏆 [DEBUG] Modal element:", modal);

  // Test if functions exist
  console.log("🏆 [DEBUG] showBadgeModal function:", typeof showBadgeModal);
  console.log(
    "🏆 [DEBUG] showMultipleBadges function:",
    typeof showMultipleBadges
  );

  // Try to show a test badge
  if (typeof showBadgeModal === "function") {
    console.log("🏆 [DEBUG] Calling showBadgeModal with 'firstHarvest'");
    showBadgeModal("firstHarvest");
  } else {
    console.log("🏆 [DEBUG] showBadgeModal not available, trying alert");
    alert("🏆 Test Badge Unlocked: firstHarvest");
  }
}

// Make test function globally available
window.testBadgePopup = testBadgePopup;

// Function to reset badge popup tracking (for testing)
async function resetBadgePopups() {
  console.log("🏆 [DEBUG] Resetting badge popup tracking...");
  try {
    await PlayFabService.executeCloudScript("resetBadgePopups", {});
    console.log(
      "🏆 [DEBUG] Badge popup tracking reset - you should see badges again on next harvest"
    );
  } catch (error) {
    console.error("🏆 [ERROR] Failed to reset badge popups:", error);
  }
}

// Make reset function globally available
window.resetBadgePopups = resetBadgePopups;

// Updated populateVaultBadges function in newgame.js
async function populateVaultBadges() {
  const badgeGrid = document.getElementById("vaultBadgeGrid");
  if (!badgeGrid) return;

  try {
    console.log("🏆 [DEBUG] Starting populateVaultBadges...");

    // DON'T call checkAndAwardBadges here - only check it on specific triggers
    // like game completion, login, or manual refresh

    console.log(
      "🏆 [DEBUG] Current window.badgeDefinitions:",
      window.badgeDefinitions
    );

    // Ensure badge definitions are loaded
    if (!window.badgeDefinitions) {
      console.log(
        "🏆 [DEBUG] Badge definitions not loaded, calling loadBadgeDefinitions()..."
      );
      try {
        await loadBadgeDefinitions();
        console.log(
          "🏆 [DEBUG] After loadBadgeDefinitions(), window.badgeDefinitions:",
          window.badgeDefinitions
        );
      } catch (error) {
        console.error("🏆 [DEBUG] Failed to load badge definitions:", error);
        window.badgeDefinitions = getDefaultBadgeDefinitions();
        console.log("🏆 [DEBUG] Using fallback badge definitions");
      }
    } else {
      console.log("🏆 [DEBUG] Badge definitions already loaded");
    }

    // Get player progress (READ-ONLY - don't award new badges here)
    const playerProgressData = await new Promise((resolve, reject) => {
      PlayFab.ClientApi.ExecuteCloudScript(
        { FunctionName: "getPlayerProgress", FunctionParameter: {} },
        (result, error) => {
          if (error) {
            console.error("🏆 [DEBUG] ExecuteCloudScript error:", error);
            reject(error);
            return;
          }
          console.log("🏆 [DEBUG] ExecuteCloudScript result:", result);

          if (
            result?.data?.FunctionResult?.success &&
            result?.data?.FunctionResult?.playerProgress
          ) {
            console.log(
              "🏆 [DEBUG] Found playerProgress in Internal Data:",
              result.data.FunctionResult.playerProgress
            );
            resolve(JSON.stringify(result.data.FunctionResult.playerProgress));
          } else {
            console.log(
              "🏆 [DEBUG] No playerProgress found in Internal Data:",
              result?.data?.FunctionResult
            );
            resolve(null);
          }
        }
      );
    });

    let playerProgress = {
      totalGrows: 0,
      badges: [],
      badgePopupsShown: [], // Include this in default
      currentTier: 1,
      totalYield: 0,
    };

    if (playerProgressData) {
      try {
        playerProgress = JSON.parse(playerProgressData);
        console.log("🏆 [DEBUG] Parsed player progress:", playerProgress);

        // Ensure badgePopupsShown exists for existing players
        if (!playerProgress.badgePopupsShown) {
          playerProgress.badgePopupsShown = [];
        }
      } catch (e) {
        console.warn("Could not parse player progress:", e);
      }
    } else {
      console.log(
        "🏆 [DEBUG] No player progress data found, using defaults:",
        playerProgress
      );
    }

    // Get current total yield for display purposes
    try {
      const currentTotalYield = await getPlayerTotalYield();
      playerProgress.totalYield = currentTotalYield;
      console.log(
        `🏆 [DEBUG] Current total yield for badges: ${currentTotalYield}g`
      );
    } catch (e) {
      console.warn("Could not get current total yield:", e);
    }

    // Use badge definitions from PlayFab Title Data only
    const availableBadges = [];
    console.log(
      "🏆 [DEBUG] Badge definitions available:",
      window.badgeDefinitions ? "Yes" : "No"
    );

    if (!window.badgeDefinitions || !window.badgeDefinitions.badges) {
      console.log("🏆 [DEBUG] No badge definitions found, using fallback");
      window.badgeDefinitions = getDefaultBadgeDefinitions();
    }

    if (window.badgeDefinitions && window.badgeDefinitions.badges) {
      console.log(
        "🏆 [DEBUG] Loading badges from PlayFab title data:",
        Object.keys(window.badgeDefinitions.badges)
      );

      Object.keys(window.badgeDefinitions.badges).forEach((badgeId) => {
        const badge = window.badgeDefinitions.badges[badgeId];
        console.log(`🏆 [DEBUG] Processing badge ${badgeId}:`, badge);

        if (!badge.requirement) {
          console.log(
            `🏆 [DEBUG] Badge ${badgeId} has no requirement, skipping`
          );
          return;
        }

        const isUnlocked = playerProgress.badges.includes(badgeId);
        const meetsRequirement = checkBadgeRequirement(
          badge.requirement,
          playerProgress
        );

        console.log(
          `🏆 [DEBUG] Badge ${badgeId}: unlocked=${isUnlocked}, meetsRequirement=${meetsRequirement}`
        );

        availableBadges.push({
          id: badgeId,
          name: badge.name,
          description: badge.description,
          requirement: badge.requirement,
          icon: badge.icon || "default-badge.png",
        });
      });
    } else {
      console.log(
        "🏆 [DEBUG] No badge definitions found in PlayFab Title Data"
      );
      badgeGrid.innerHTML =
        '<div class="noDataMessage">No badges available</div>';
      return;
    }

    console.log(
      `🏆 [DEBUG] Displaying ${availableBadges.length} badges in vault:`,
      availableBadges.map((b) => b.name)
    );

    // Generate HTML for badges (same as before)
    badgeGrid.innerHTML = `
      <div class="itemGrid">
        ${availableBadges
        .map((badge) => {
          const isUnlocked = playerProgress.badges.includes(badge.id);
          const hasRequirement = checkBadgeRequirement(
            badge.requirement,
            playerProgress
          );
          console.log(
            `🏆 [DEBUG] Badge ${badge.id}: unlocked=${isUnlocked}, hasRequirement=${hasRequirement}, name="${badge.name}"`
          );

          if (isUnlocked) {
            return `
              <div class="vaultItem unlocked" data-item-type="badge" data-item-key="${badge.id}" title="${badge.name}">
                <img src="img/badges/${badge.icon}" alt="${badge.name}">
                <div class="badgeEarned">✓</div>
              </div>
            `;
          } else if (hasRequirement) {
            return `
              <div class="vaultItem ready" data-item-type="badge" data-item-key="${badge.id}" title="Badge ready to claim!">
                <div class="lockedIcon">?</div>
                <div class="badgeReady">!</div>
              </div>
            `;
          } else {
            return `
              <div class="vaultItem locked" data-item-type="badge" data-item-key="${badge.id
              }" title="${badge.name} - Requires ${getRequirementText(
                badge.requirement
              )}">
                <div class="lockedIcon">?</div>
              </div>
            `;
          }
        })
        .join("")}
      </div>
    `;

    addVaultItemHandlers("badge", availableBadges, playerProgress);
  } catch (error) {
    console.error("Failed to load badges:", error);
    badgeGrid.innerHTML =
      '<div class="noDataMessage">Failed to load badges</div>';
  }
}

// Helper function to check badge requirements
function checkBadgeRequirement(requirement, playerProgress) {
  if (!requirement) return false;

  switch (requirement.type) {
    case "totalGrows":
      return playerProgress.totalGrows >= requirement.value;
    case "consecutiveLogins":
      return (playerProgress.consecutiveLogins || 0) >= requirement.value;
    case "slotsWins":
      return (playerProgress.slotsWins || 0) >= requirement.value;
    case "seedsUnlocked":
      return (playerProgress.seedsUnlocked || 0) >= requirement.value;
    case "totalYield":
      return (playerProgress.totalYield || 0) >= requirement.value;
    case "weekendStreaks":
      return (playerProgress.weekendStreaks || 0) >= requirement.value;
    case "perfectGrows":
      return (playerProgress.perfectGrows || 0) >= requirement.value;
    case "actOfGodSurvived":
      return (playerProgress.actOfGodSurvived || 0) >= requirement.value;
    case "fastestGrow":
      return (playerProgress.fastestGrow || Infinity) <= requirement.value;
    case "efficientDays":
      return (playerProgress.efficientDays || 0) >= requirement.value;
    case "hardestCombo":
      return (playerProgress.hardestCombo || 0) >= requirement.value;
    case "tiersExplored":
      return (playerProgress.tiersExplored || 0) >= requirement.value;
    case "combosUsed":
      return (playerProgress.combosUsed || 0) >= requirement.value;
    case "averagePotency":
      // For average potency, we need both the average and minimum grows
      const avgPotency = playerProgress.averagePotency || 0;
      const minGrows = requirement.minGrows || 1;
      return (
        avgPotency >= requirement.value && playerProgress.totalGrows >= minGrows
      );
    // Add more requirement types as needed
    default:
      console.log(`🔍 [DEBUG] Unknown requirement type: ${requirement.type}`);
      return false;
  }
}

// Helper function to get progress text for display
function getProgressText(requirement, playerProgress) {
  if (!requirement || !playerProgress) return "Progress: Unknown";

  const currentValue = getCurrentProgressValue(
    requirement.type,
    playerProgress
  );
  const targetValue = requirement.value;
  const unit = getRequirementUnit(requirement.type);

  return `Progress: ${currentValue} / ${targetValue} ${unit}`;
}

// Helper function to get current progress value based on requirement type
function getCurrentProgressValue(requirementType, playerProgress) {
  switch (requirementType) {
    case "totalGrows":
      return playerProgress.totalGrows || 0;
    case "totalYield":
      return Math.round(playerProgress.totalYield || 0);
    case "consecutiveLogins":
      return playerProgress.consecutiveLogins || 0;
    case "slotsWins":
      return playerProgress.slotsWins || 0;
    case "seedsUnlocked":
      return playerProgress.seedsUnlocked || 0;
    case "weekendStreaks":
      return playerProgress.weekendStreaks || 0;
    case "perfectGrows":
      return playerProgress.perfectGrows || 0;
    case "actOfGodSurvived":
      return playerProgress.actOfGodSurvived || 0;
    case "fastestGrow":
      return Math.round((playerProgress.fastestGrow || Infinity) / 1000); // Convert to seconds
    case "efficientDays":
      return playerProgress.efficientDays || 0;
    case "hardestCombo":
      return playerProgress.hardestCombo || 0;
    case "tiersExplored":
      return playerProgress.tiersExplored || 0;
    case "combosUsed":
      return playerProgress.combosUsed || 0;
    case "averagePotency":
      return Math.round(playerProgress.averagePotency || 0);
    default:
      return 0;
  }
}

// Helper function to get the correct unit for each requirement type
function getRequirementUnit(requirementType) {
  switch (requirementType) {
    case "totalGrows":
      return "grows";
    case "totalYield":
      return "g";
    case "consecutiveLogins":
      return "days";
    case "slotsWins":
      return "wins";
    case "seedsUnlocked":
      return "seeds";
    case "weekendStreaks":
      return "weeks";
    case "perfectGrows":
      return "grows";
    case "actOfGodSurvived":
      return "events";
    case "fastestGrow":
      return "seconds";
    case "efficientDays":
      return "days";
    case "hardestCombo":
      return "combos";
    case "tiersExplored":
      return "tiers";
    case "combosUsed":
      return "combos";
    case "averagePotency":
      return "%";
    default:
      return "units";
  }
}

// Helper function to get requirement text for display
function getRequirementText(requirement) {
  console.log("🔍 [DEBUG] getRequirementText called with:", requirement);
  if (!requirement) {
    console.log("🔍 [DEBUG] No requirement provided, returning 'Unknown'");
    return "Unknown";
  }

  console.log(
    `🔍 [DEBUG] Requirement type: ${requirement.type}, value: ${requirement.value}`
  );

  switch (requirement.type) {
    case "totalGrows":
      return `${requirement.value} grows`;
    case "consecutiveLogins":
      return `${requirement.value} days`;
    case "slotsWins":
      return `${requirement.value} wins`;
    case "seedsUnlocked":
      return `${requirement.value} seeds`;
    case "totalYield":
      return `${requirement.value}g yield`;
    case "weekendStreaks":
      return `${requirement.value} weekends`;
    case "perfectGrows":
      return `${requirement.value} perfect grows`;
    case "actOfGodSurvived":
      return `${requirement.value} acts survived`;
    case "fastestGrow":
      return `under ${Math.floor(requirement.value / 60000)} minutes`;
    case "efficientDays":
      return `${requirement.value} efficient days`;
    case "hardestCombo":
      return `${requirement.value} hardest combo`;
    case "tiersExplored":
      return `${requirement.value} tiers`;
    case "combosUsed":
      return `${requirement.value} combos`;
    case "averagePotency":
      return `${requirement.value}% avg potency`;
    default:
      console.log(
        `🔍 [DEBUG] Unknown requirement type: ${requirement.type}, returning value: ${requirement.value}`
      );
      return requirement.value;
  }
}

// New function to populate equipment (light sources)
async function populateVaultEquips() {
  const equipGrid = document.getElementById("vaultEquipGrid");
  if (!equipGrid) return;

  // Get player's total yield for unlock checks
  let totalYield = 0;
  try {
    const playerStats = await PlayFabService.getPlayerLeaderboardEntry(
      "TotalYield"
    );
    totalYield = playerStats ? playerStats.StatValue : 0;
  } catch (error) {
    console.warn("Could not fetch total yield for equips");
  }

  equipGrid.innerHTML = `
      <div class="itemGrid">
        ${Object.entries(lightSources)
      .map(([key, light]) => {
        const threshold =
          lightUnlockThresholds.find((t) => t.key === key)?.threshold || 0;
        const isUnlocked = totalYield >= threshold || key === "candle"; // Candle always unlocked
        const isCurrent = currentLight === key;

        if (isUnlocked) {
          return `
              <div class="vaultItem unlocked ${isCurrent ? "equipped" : ""}" 
                   data-item-type="equip" data-item-key="${key}" title="${light.name
            }">
                <img src="img/selections/light/light${getLightImageIndex(
              key
            )}.png" alt="${light.name}">
                <div class="itemName">${light.name}</div>
                ${isCurrent ? '<div class="equippedBadge">EQUIPPED</div>' : ""}
              </div>
            `;
        } else {
          return `
              <div class="vaultItem locked" title="Unlocks at ${threshold}g total yield">
                <div class="lockedIcon">?</div>
                <div class="unlockRequirement">${threshold}g</div>
                <div class="itemName">${light.name}</div>
              </div>
            `;
        }
      })
      .join("")}
      </div>
    `;

  addVaultItemHandlers("equip");
}

// Helper function to get light image index
function getLightImageIndex(lightKey) {
  const indices = { candle: 1, desk: 2, grow: 3, plasma: 4, quantum: 5 };
  return indices[lightKey] || 1;
}

// Generic function to add click handlers to vault items
function addVaultItemHandlers(
  itemType,
  additionalData = null,
  playerProgress = null
) {
  // For badges, allow clicking on all states (locked, ready, unlocked)
  // For other items, only allow unlocked/ready
  const selector =
    itemType === "badge"
      ? `[data-item-type="${itemType}"]`
      : `[data-item-type="${itemType}"].unlocked, [data-item-type="${itemType}"].ready`;

  document.querySelectorAll(selector).forEach((item) => {
    item.addEventListener("click", () => {
      // Remove selection from all items of this type
      document
        .querySelectorAll(`[data-item-type="${itemType}"]`)
        .forEach((i) => i.classList.remove("selected"));

      // Select this item
      item.classList.add("selected");

      // Show details
      showItemDetails(
        itemType,
        item.dataset.itemKey,
        additionalData,
        playerProgress
      );

      // Special handling for equipment - equip the item
      if (itemType === "equip") {
        equipLight(item.dataset.itemKey);
      }
    });
  });
}

// Function to show item details in the right panel
function showItemDetails(
  itemType,
  itemKey,
  additionalData = null,
  playerProgress = null
) {
  const detailView = document.getElementById("detailView");
  if (!detailView) return;

  switch (itemType) {
    case "seed":
      showSeedDetails(itemKey, detailView);
      break;
    case "badge":
      showBadgeDetails(itemKey, detailView, additionalData, playerProgress);
      break;
    case "equip":
      showEquipDetails(itemKey, detailView);
      break;
  }
}

// Function to show seed/plant details
function showSeedDetails(seedKey, detailView) {
  const seed = seedProperties[seedKey];
  if (!seed) return;

  // Check if this seed has been successfully grown
  const isGrown = grownSeeds[seedKey] || false;

  if (isGrown) {
    // Show the plant/flower image - player has grown this seed
    detailView.innerHTML = `
      <div class="itemDetail">
        <div class="detailImage">
          <img src="img/selections/${seed.flowerImage || seed.image}" alt="${seed.name} Plant">
        </div>
        <div class="detailInfo">
          <h3>${seed.name}</h3>
        </div>
      </div>
    `;
  } else {
    // Seed not yet grown - show mystery overlay
    detailView.innerHTML = `
      <div class="itemDetail">
        <div class="detailImage mystery">
          <div class="mysteryPlant">
            <div class="mysteryIcon">?</div>
            <div class="mysteryText">Grow this seed to reveal!</div>
          </div>
        </div>
        <div class="detailInfo">
          <h3>${seed.name}</h3>
        </div>
      </div>
    `;
  }
}

function showBadgeDetails(
  badgeId,
  detailView,
  availableBadges,
  playerProgress
) {
  const badge = availableBadges?.find((b) => b.id === badgeId);
  if (!badge) return;

  const isUnlocked = playerProgress?.badges.includes(badgeId);
  const hasRequirement = playerProgress?.totalGrows >= badge.requirement.value;

  detailView.innerHTML = `
    <div class="itemDetail badge-detail">
      <div class="detailImage">
        ${isUnlocked
      ? `<img src="img/badges/${badge.icon}" alt="${badge.name}">`
      : `<div class="lockedIcon" style="font-size: 4em; color: #666; text-align: center; line-height: 1;">?</div>`
    }
      </div>
      <div class="detailInfo">
        <h3>${badge.name}</h3>
        <p class="description">${badge.description}</p>
        <div class="badgeStatus">
          ${isUnlocked
      ? '<div class="statusBadge earned">EARNED</div>'
      : hasRequirement
        ? '<div class="statusBadge ready">READY TO CLAIM</div>'
        : `<div class="statusBadge locked">Requires ${getRequirementText(
          badge.requirement
        )}</div>`
    }
        </div>
        ${!isUnlocked
      ? `
        <div class="progressInfo">
          <span>${getProgressText(badge.requirement, playerProgress)}</span>
        </div>
        `
      : ""
    }
      </div>
    </div>
  `;
}

function showEquipDetails(equipKey, detailView) {
  const equipment = lightSources[equipKey];
  if (!equipment) return;

  const threshold =
    lightUnlockThresholds.find((t) => t.key === equipKey)?.threshold || 0;
  const isCurrent = currentLight === equipKey;

  detailView.innerHTML = `
    <div class="itemDetail">
      <div class="detailImage">
        <img src="img/selections/light/light${getLightImageIndex(
    equipKey
  )}.png" alt="${equipment.name}">
      </div>
      <div class="detailInfo">
        <h3>${equipment.name}</h3>
        <div class="statsList">
          <div class="statRow">
            <span class="statLabel">Yield Bonus:</span>
            <span class="statValue">${(
      (equipment.yieldBonus - 1) *
      100
    ).toFixed(0)}%</span>
          </div>
          ${threshold > 0
      ? `
          <div class="statRow">
            <span class="statLabel">Unlock Requirement:</span>
            <span class="statValue">${threshold}g total yield</span>
          </div>
          `
      : ""
    }
        </div>
        ${!isCurrent
      ? `
        <div class="equipActions">
          <button class="equipBtn" data-equip-key="${equipKey}">EQUIP</button>
        </div>
        `
      : `
        <div class="equippedStatus">
          <span class="statusBadge equipped">EQUIPPED</span>
        </div>
        `
    }
      </div>
    </div>
  `;

  // Add event listener for equip button
  const equipBtn = detailView.querySelector(".equipBtn");
  if (equipBtn) {
    equipBtn.addEventListener("click", () => {
      const equipKey = equipBtn.dataset.equipKey;
      if (equipKey) {
        equipLight(equipKey);
      }
    });
  }
}

// Sound system
let gameAudio = null;
let isSoundEnabled = true;
let audioLoaded = false;
let audioLoading = false;

// Setup sound toggle functionality
function setupSoundToggle() {
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  const soundIcon = document.getElementById("soundIcon");

  if (!soundToggleBtn || !soundIcon) return;

  // Load saved sound preference
  const savedSoundState = localStorage.getItem("gameSoundEnabled");
  if (savedSoundState !== null) {
    isSoundEnabled = savedSoundState === "true";
  }

  // Update UI based on current state
  updateSoundUI();

  // Add click event listener
  soundToggleBtn.addEventListener("click", () => {
    isSoundEnabled = !isSoundEnabled;
    localStorage.setItem("gameSoundEnabled", isSoundEnabled.toString());
    updateSoundUI();

    if (isSoundEnabled) {
      // Only load audio when user first enables sound
      if (!audioLoaded && !audioLoading) {
        loadGameAudio();
      }
      playGameSound();
    } else {
      stopGameSound();
    }
  });
}

// Update sound UI based on current state
function updateSoundUI() {
  const soundToggleBtn = document.getElementById("soundToggleBtn");
  const soundIcon = document.getElementById("soundIcon");

  if (!soundToggleBtn || !soundIcon) return;

  if (isSoundEnabled) {
    soundToggleBtn.classList.remove("muted");
    soundIcon.textContent = "SFX";
    soundIcon.title = "Sound On";
  } else {
    soundToggleBtn.classList.add("muted");
    soundIcon.textContent = "OFF";
    soundIcon.title = "Sound Off";
  }
}

// Load game audio (lazy loading)
function loadGameAudio() {
  if (audioLoaded || gameAudio || audioLoading) return;

  audioLoading = true;
  console.log("Loading game audio...");

  gameAudio = new Audio();

  // Use your Opus file with fallbacks based on connection speed
  const audioFormats = getOptimalAudioFormat();

  // Try to load the best supported format
  loadAudioWithFallback(gameAudio, audioFormats);

  gameAudio.loop = true;
  gameAudio.volume = 0.3; // Adjust volume as needed

  // Mark as loaded when ready
  gameAudio.addEventListener("canplaythrough", function () {
    audioLoaded = true;
    audioLoading = false;
    console.log("Game audio loaded successfully");
  });

  // Preload the audio
  gameAudio.load();
}

// Play game sound with lazy loading
function playGameSound() {
  if (!isSoundEnabled) return;

  // Ensure audio is loaded
  if (!audioLoaded && !gameAudio) {
    loadGameAudio();
  }

  // Play the sound
  if (gameAudio) {
    gameAudio.play().catch((error) => {
      console.log("Could not play sound:", error);
    });
  }
}

// Helper function to load audio with format fallbacks
function loadAudioWithFallback(audioElement, formats) {
  let currentFormatIndex = 0;

  function tryNextFormat() {
    if (currentFormatIndex >= formats.length) {
      console.error("All audio formats failed to load");
      return;
    }

    const currentFormat = formats[currentFormatIndex];
    console.log(`Trying to load audio format: ${currentFormat}`);

    audioElement.src = currentFormat;

    // Handle successful load
    audioElement.addEventListener(
      "canplaythrough",
      function onCanPlay() {
        console.log(`Successfully loaded audio: ${currentFormat}`);
        audioElement.removeEventListener("canplaythrough", onCanPlay);
      },
      { once: true }
    );

    // Handle load error and try next format
    audioElement.addEventListener(
      "error",
      function onError() {
        console.log(`Failed to load ${currentFormat}, trying next format...`);
        audioElement.removeEventListener("error", onError);
        currentFormatIndex++;
        tryNextFormat();
      },
      { once: true }
    );

    // Start loading
    audioElement.load();
  }

  tryNextFormat();
}

// Stop game sound (pause without resetting position)
function stopGameSound() {
  if (gameAudio) {
    gameAudio.pause();
    // Don't reset currentTime - keep the position for seamless resume
  }
}

// Reset game sound (restart from beginning) - for when you actually want to restart
function resetGameSound() {
  if (gameAudio) {
    gameAudio.pause();
    gameAudio.currentTime = 0;
  }
}

// Function to play sound effects (for button clicks, etc.)
function playSoundEffect(soundFile) {
  if (!isSoundEnabled) return;

  const audio = new Audio(soundFile);
  audio.volume = 0.5;
  audio.play().catch((error) => {
    console.log("Could not play sound effect:", error);
  });
}

// Get optimal audio format for desktop browsers
function getOptimalAudioFormat() {
  // For desktop, prioritize Opus for best compression, with fallbacks
  console.log("Desktop game detected, using Opus with fallbacks");
  return [
    "src/sound/bg-sound.opus", // Primary: Opus for best compression
    "src/sound/bg-sound.ogg", // Fallback: OGG Vorbis
    "src/sound/bg-sound.mp3", // Fallback: MP3 for universal support
  ];
}

// Initialize sound system when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Wait a bit for all elements to be ready
  setTimeout(() => {
    setupSoundToggle();

    // Initialize badge modal system
    if (typeof initializeBadgeModal === "function") {
      initializeBadgeModal();
      console.log("🏆 Badge modal system initialized");
    } else {
      console.warn(
        "🏆 Badge modal system not found - badge popups may not work"
      );
    }

    // Restore saved light selection
    const savedLight = localStorage.getItem("currentLight");
    const wasManualSelection =
      localStorage.getItem("manualLightSelection") === "true";

    if (
      savedLight &&
      lightSources[savedLight] &&
      lightSources[savedLight].unlocked
    ) {
      currentLight = savedLight;
      manualLightSelection = wasManualSelection;
      console.log(
        `Restored light selection: ${savedLight} (manual: ${wasManualSelection})`
      );
    }
  }, 100);
});
