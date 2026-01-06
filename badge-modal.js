// Badge Modal System - Separate file for badge functionality

// Global variable to store badge definitions
window.badgeDefinitions = null;

// Load badge definitions from PlayFab Title Data (PRIORITY SOURCE)
async function loadBadgeDefinitions() {
  console.log(
    "🔍 [DEBUG] loadBadgeDefinitions() called - prioritizing PlayFab Title Data"
  );

  // First, try to load from PlayFab Title Data
  try {
    console.log(
      "🔍 [DEBUG] Attempting to load badge definitions from PlayFab Title Data..."
    );
    const result = await new Promise((resolve, reject) => {
      PlayFab.ClientApi.GetTitleData(
        { Keys: ["badgeDefinitions"] },
        (result, error) => {
          if (error) {
            console.log("🔍 [DEBUG] PlayFab GetTitleData error:", error);
            reject(error);
            return;
          }
          console.log("🔍 [DEBUG] PlayFab GetTitleData result:", result);
          resolve(result);
        }
      );
    });

    if (
      result &&
      result.data &&
      result.data.Data &&
      result.data.Data.badgeDefinitions
    ) {
      console.log(
        "✅ [SUCCESS] Badge definitions loaded from PlayFab Title Data"
      );
      window.badgeDefinitions = JSON.parse(result.data.Data.badgeDefinitions);
      console.log(
        "🔍 [DEBUG] PlayFab badge definitions:",
        window.badgeDefinitions
      );
      return; // Success - exit early
    } else {
      console.warn(
        "⚠️ [WARNING] No badge definitions found in PlayFab Title Data"
      );
    }
  } catch (error) {
    console.error(
      "❌ [ERROR] Failed to load badge definitions from PlayFab:",
      error
    );
  }

  // Only use fallback if PlayFab completely fails
  console.warn("🔄 [FALLBACK] Using local badge definitions as backup");
  window.badgeDefinitions = getDefaultBadgeDefinitions();
  console.log(
    "🔍 [DEBUG] Fallback badge definitions set:",
    window.badgeDefinitions
  );
}

// Fallback badge definitions (in case PlayFab is unavailable)
// NOTE: These should match your badges.json file exactly
function getDefaultBadgeDefinitions() {
  return {
    badges: {
      firstHarvest: {
        name: "First Harvest",
        description: "Complete your first grow",
        requirement: {
          type: "totalGrows",
          value: 1,
        },
        icon: "first-harvest.png",
      },
      dailyGrinder: {
        name: "Daily Grinder",
        description: "Log in 5 consecutive days",
        requirement: {
          type: "consecutiveLogins",
          value: 5,
        },
        icon: "daily-grinder.png",
      },
      seedCollector: {
        name: "Seed Collector",
        description: "Unlock 10 seed varieties",
        requirement: {
          type: "seedsUnlocked",
          value: 10,
        },
        icon: "seed-collector.png",
      },
      slotMachineKing: {
        name: "Slot Machine King",
        description: "Win 10 times from daily slots",
        requirement: {
          type: "slotsWins",
          value: 10,
        },
        icon: "slot-king.png",
      },
      greenThumb: {
        name: "Green Thumb",
        description: "Complete 10 perfect grows (90%+ potency, 50g+ weight)",
        requirement: {
          type: "perfectGrows",
          value: 10,
        },
        icon: "green-thumb.png",
      },
      speedDemon: {
        name: "Speed Demon",
        description: "Complete a grow in under 2 minutes",
        requirement: {
          type: "fastestGrow",
          value: 120000,
        },
        icon: "speed-demon.png",
      },
      yieldTitan: {
        name: "Yield Titan",
        description: "Reach 1000g total lifetime yield",
        requirement: {
          type: "totalYield",
          value: 1000,
        },
        icon: "yield-titan.png",
      },
      dedicatedCultivator: {
        name: "Dedicated Cultivator",
        description: "Complete 50 total grows",
        requirement: {
          type: "totalGrows",
          value: 50,
        },
        icon: "dedicated-cultivator.png",
      },
      weekendWarrior: {
        name: "Weekend Warrior",
        description: "Play 4 weekends in a row",
        requirement: {
          type: "weekendStreaks",
          value: 4,
        },
        icon: "weekend-warrior.png",
      },
    },
    tiers: {
      1: {
        name: "Rookie Grower",
        badgesRequired: 0,
        description: "Starting your journey",
      },
      2: {
        name: "Experienced Grower",
        badgesRequired: 3,
        description: "Getting the hang of it",
      },
      3: {
        name: "Expert Cultivator",
        badgesRequired: 6,
        description: "Master of the craft",
      },
      4: {
        name: "Legendary Grower",
        badgesRequired: 9,
        description: "Elite status achieved",
      },
    },
  };
}

// Show badge modal instead of simple alert
function showBadgeModal(badgeId, badgeData = null) {
  const modal = document.getElementById("badgeModal");
  const iconElement = document.getElementById("badgeModalIcon");
  const nameElement = document.getElementById("badgeModalName");
  const descriptionElement = document.getElementById("badgeModalDescription");

  if (!modal) {
    console.error("Badge modal not found in DOM");
    // Fallback to simple alert
    alert(`Congratulations! You've earned a new badge: ${badgeId}`);
    return;
  }

  // Get badge data from definitions or use provided data
  let badge = badgeData;
  if (
    !badge &&
    window.badgeDefinitions &&
    window.badgeDefinitions.badges &&
    window.badgeDefinitions.badges[badgeId]
  ) {
    badge = window.badgeDefinitions.badges[badgeId];
  }

  // Set default values if badge not found
  if (!badge) {
    badge = {
      name: badgeId
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()),
      description: "Achievement unlocked!",
      icon: null,
    };
  }

  // Update modal content
  nameElement.textContent = badge.name;
  descriptionElement.textContent = badge.description;

  // Handle badge icon
  if (badge.icon) {
    iconElement.innerHTML = `<img src="img/badges/${badge.icon}" alt="${badge.name}">`;
  } else {
    // Use emoji fallback based on badge type
    const emoji = getBadgeEmoji(badgeId);
    iconElement.innerHTML = `<div class="placeholder">${emoji}</div>`;
  }

  // Show modal with animation
  modal.classList.add("show");

  // Play sound effect if available
  if (typeof playSoundEffect === "function") {
    playSoundEffect("sounds/badge-unlock.mp3");
  }

  console.log(`Badge unlocked: ${badge.name}`);
}

// Get appropriate emoji for badge type
function getBadgeEmoji(badgeId) {
  const emojiMap = {
    firstHarvest: "🌱",
    seedCollector: "🌰",
    dailyGrinder: "⏰",
    slotMachineKing: "🎰",
    dedicatedCultivator: "🏆",
    weekendWarrior: "⚔️",
    greenThumb: "👍",
    survivalist: "🛡️",
    speedDemon: "⚡",
    efficiencyExpert: "🎯",
    riskTaker: "🎲",
    tierExplorer: "🗺️",
    comboMaster: "💎",
    yieldTitan: "⚖️",
    potencyPurist: "🧪",
  };

  return emojiMap[badgeId] || "🏆";
}

// Close badge modal
function closeBadgeModal() {
  const modal = document.getElementById("badgeModal");
  if (modal) {
    modal.classList.remove("show");
  }
}

// Updated showBadgePopup function to use modal
function showBadgePopup(badgeId) {
  showBadgeModal(badgeId);
}

// Initialize badge modal system
function initializeBadgeModal() {
  // Load badge definitions from PlayFab
  loadBadgeDefinitions();

  // Set up modal event listeners
  const modal = document.getElementById("badgeModal");
  const closeBtn = document.getElementById("badgeModalClose");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeBadgeModal);
  }

  if (modal) {
    // Close on background click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeBadgeModal();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("show")) {
        closeBadgeModal();
      }
    });
  }
}

// Queue system for multiple badges
let badgeQueue = [];
let currentlyShowingBadge = false;

function queueBadge(badgeId, badgeData = null) {
  badgeQueue.push({ badgeId, badgeData });
  processeBadgeQueue();
}

function processeBadgeQueue() {
  if (currentlyShowingBadge || badgeQueue.length === 0) {
    return;
  }

  currentlyShowingBadge = true;
  const { badgeId, badgeData } = badgeQueue.shift();

  showBadgeModal(badgeId, badgeData);

  // Set up listener for when modal is closed
  const modal = document.getElementById("badgeModal");
  const handleTransitionEnd = () => {
    if (!modal.classList.contains("show")) {
      currentlyShowingBadge = false;
      modal.removeEventListener("transitionend", handleTransitionEnd);

      // Process next badge after a short delay
      setTimeout(() => {
        processeBadgeQueue();
      }, 500);
    }
  };

  modal.addEventListener("transitionend", handleTransitionEnd);
}

// Enhanced badge popup for multiple badges
function showMultipleBadges(badgeIds) {
  badgeIds.forEach((badgeId) => {
    queueBadge(badgeId);
  });
}

// Call this when the page loads
document.addEventListener("DOMContentLoaded", function () {
  // Initialize badge modal after a short delay to ensure DOM is ready
  setTimeout(initializeBadgeModal, 100);
});
