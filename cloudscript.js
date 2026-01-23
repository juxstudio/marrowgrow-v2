// Enhanced submitScore handler - replaces your existing one
// Helper to group days into consistent weeks (Monday-based) so each weekend only counts once
function getUtcWeekIndex(date) {
  var day = (date.getUTCDay() + 6) % 7; // Monday = 0 ... Sunday = 6
  var monday = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - day)
  );
  return Math.floor(monday.getTime() / (7 * 24 * 60 * 60 * 1000));
}

handlers.submitScore = function (args, context) {
  try {
    var scoreType = args.scoreType;
    var scoreValue = args.scoreValue;

    if (!scoreType || scoreValue === undefined) {
      return { success: false, error: "Missing scoreType or scoreValue" };
    }

    // Load user data (yield history + player progress)
    var userDataResult = server.GetUserInternalData({
      PlayFabId: currentPlayerId,
      Keys: ["yieldHistory", "playerProgress", "lastLoginDate"],
    });

    // Validate passed game state
    var gameState;
    try {
      gameState = args.gameState;
      if (!gameState || typeof gameState !== "object") {
        return { success: false, error: "No valid game state provided" };
      }
    } catch (e) {
      return { success: false, error: "Invalid game state format: " + e };
    }

    // ANTI-CHEAT VALIDATION (your existing logic)
    if (scoreType === "TotalYield") {
      var yieldHistory = [];
      if (args.yieldHistory && Array.isArray(args.yieldHistory)) {
        yieldHistory = args.yieldHistory;
      } else if (userDataResult.Data && userDataResult.Data.yieldHistory) {
        try {
          yieldHistory = JSON.parse(userDataResult.Data.yieldHistory.Value);
          if (!Array.isArray(yieldHistory)) {
            yieldHistory = [];
          }
        } catch (e) {
          yieldHistory = [];
        }
      }

      var calculatedTotal = yieldHistory.reduce(function (sum, entry) {
        var num = Number(entry);
        return isNaN(num) ? sum : sum + num;
      }, 0);

      var tolerance = Math.max(1, calculatedTotal * 0.05);
      if (Math.abs(scoreValue - calculatedTotal) > tolerance) {
        return {
          success: false,
          error:
            "TotalYield mismatch - expected: " +
            calculatedTotal +
            ", got: " +
            scoreValue,
        };
      }
    } else {
      // Validate individual scores
      if (!gameState.frozenStats || !gameState.totalGrowthTime) {
        return {
          success: false,
          error:
            "Incomplete game state - missing frozenStats or totalGrowthTime",
        };
      }

      var growthTime = gameState.totalGrowthTime;
      if (growthTime < 144 || growthTime > 224) {
        return { success: false, error: "Invalid growth time: " + growthTime };
      }

      var expectedValue;
      if (scoreType === "yield") {
        expectedValue = gameState.frozenStats.weight || gameState.weight || 0;
      } else if (scoreType === "potency") {
        expectedValue = gameState.frozenStats.potency || gameState.potency || 0;
      } else {
        return { success: false, error: "Invalid scoreType: " + scoreType };
      }

      var tolerance = Math.max(1, expectedValue * 0.05);
      if (Math.abs(scoreValue - expectedValue) > tolerance) {
        return {
          success: false,
          error:
            "Score mismatch - expected: " +
            expectedValue +
            ", got: " +
            scoreValue,
        };
      }
    }

    // Load badge configuration
    var titleDataResult = server.GetTitleData({
      Keys: ["badgeDefinitions"],
    });

    if (!titleDataResult.Data || !titleDataResult.Data.badgeDefinitions) {
      return { success: false, error: "Badge definitions not found" };
    }

    var badgeConfig;
    try {
      badgeConfig = JSON.parse(titleDataResult.Data.badgeDefinitions);
    } catch (e) {
      return { success: false, error: "Invalid badge configuration: " + e };
    }

    // Initialize or load player progress with all tracking fields
    var playerProgress = {
      totalGrows: 0,
      badges: [],
      badgePopupsShown: [],
      grownStrains: [],
      currentTier: 1,
      consecutiveLogins: 0,
      lastLoginDate: null,
      weekendStreaks: 0,
      lastWeekendDate: null,
      lastWeekendIndex: null,
      slotsWins: 0,
      seedsUnlocked: 6,
      totalYield: 0,
      perfectGrows: 0,
      actOfGodSurvived: 0,
      fastestGrow: null,
      highestPotency: 0,
      highestWeight: 0,
      totalHarvests: 0,
      optimalFeedings: 0,
      highRiskSeeds: 0,
      perfectCombos: 0,
      yieldsOver100: 0,
      potencyOver95: 0,
    };

    if (userDataResult.Data && userDataResult.Data.playerProgress) {
      try {
        var savedProgress = JSON.parse(
          userDataResult.Data.playerProgress.Value
        );
        // Merge saved data with defaults to ensure all fields exist
        for (var key in savedProgress) {
          playerProgress[key] = savedProgress[key];
        }
      } catch (e) {
        // Keep default values if parsing fails
      }
    }

    // Track login streak (check if this is a new day login)
    var now = new Date();
    var today = now.toISOString().split("T")[0];
    var dayOfWeek = now.getUTCDay();

    if (
      playerProgress.lastLoginDate &&
      playerProgress.lastLoginDate !== today
    ) {
      var lastDate = new Date(playerProgress.lastLoginDate);
      var daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        playerProgress.consecutiveLogins++;
      } else if (daysDiff > 1) {
        playerProgress.consecutiveLogins = 1;
      }
    } else if (!playerProgress.lastLoginDate) {
      playerProgress.consecutiveLogins = 1;
    }
    playerProgress.lastLoginDate = today;

    // Track weekend streaks (count once per weekend, not per weekend day)
    if (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0) {
      var currentWeekIndex = getUtcWeekIndex(now);
      var lastWeekIndex = playerProgress.lastWeekendIndex;

      if (lastWeekIndex === undefined || lastWeekIndex === null) {
        playerProgress.weekendStreaks = 1;
      } else {
        var weeksDiff = currentWeekIndex - lastWeekIndex;
        if (weeksDiff === 0) {
          // Same weekend, do not increment
        } else if (weeksDiff === 1) {
          playerProgress.weekendStreaks++;
        } else if (weeksDiff > 1) {
          // Missed a weekend, reset streak
          playerProgress.weekendStreaks = 1;
        } else {
          // Time-travel or data reset, restart streak
          playerProgress.weekendStreaks = 1;
        }
      }

      playerProgress.lastWeekendIndex = currentWeekIndex;
      playerProgress.lastWeekendDate = today; // kept for backward compatibility
    }

    var newBadges = [];
    var oldTier = playerProgress.currentTier;
    var oldBadges = playerProgress.badges.slice();

    // Process game completion stats only for yield submissions
    if (scoreType === "yield") {
      playerProgress.totalGrows += 1;
      playerProgress.totalHarvests += 1;

      // Update yield tracking
      playerProgress.totalYield += scoreValue;

      // Track this strain as grown (for vault flower preview unlocking)
      if (gameState.seedType && playerProgress.grownStrains.indexOf(gameState.seedType) === -1) {
        playerProgress.grownStrains.push(gameState.seedType);
      }

      // Update highest records
      var potency = gameState.frozenStats ? gameState.frozenStats.potency : 0;
      var weight = gameState.frozenStats ? gameState.frozenStats.weight : 0;

      if (potency > playerProgress.highestPotency) {
        playerProgress.highestPotency = potency;
      }
      if (weight > playerProgress.highestWeight) {
        playerProgress.highestWeight = weight;
      }

      // Check for perfect grow (95%+ potency, 50g+ weight)
      if (potency >= 95 && weight >= 50) {
        playerProgress.perfectGrows++;
      }

      // Track potency over 95
      if (potency >= 95) {
        playerProgress.potencyOver95++;
      }

      // Track yields over 100g
      if (weight >= 100) {
        playerProgress.yieldsOver100++;
      }

      // Track fastest grow (store in milliseconds, prefer real elapsed if provided)
      var growDurationMs = null;
      if (args.gameState && args.gameState.actualDurationMs) {
        growDurationMs = args.gameState.actualDurationMs;
      } else if (
        args.gameState &&
        args.gameState.runStartedAt &&
        args.gameState.runFinishedAt
      ) {
        growDurationMs =
          args.gameState.runFinishedAt - args.gameState.runStartedAt;
      } else if (gameState.totalGrowthTime) {
        // Fallback: assume totalGrowthTime is in seconds and convert to ms
        growDurationMs = gameState.totalGrowthTime * 1000;
      }

      if (
        growDurationMs &&
        growDurationMs > 0 &&
        growDurationMs < 1000 * 60 * 60 * 24 // ignore extreme/invalid values
      ) {
        if (
          !playerProgress.fastestGrow ||
          growDurationMs < playerProgress.fastestGrow
        ) {
          playerProgress.fastestGrow = growDurationMs;
        }
      }

      // Check for special conditions from gameState
      if (args.growthConditions) {
        var conditions = args.growthConditions;

        // Track survival of "Act of God" events
        if (conditions.survivedActOfGod) {
          playerProgress.actOfGodSurvived++;
        }

        // Track optimal feeding usage
        if (conditions.usedOptimalFeeding) {
          playerProgress.optimalFeedings++;
        }

        // Track high-risk seed usage
        var highRiskSeeds = ["purplePlague", "goldenGoose", "crimsonCrush"];
        if (highRiskSeeds.indexOf(gameState.seedType) !== -1) {
          playerProgress.highRiskSeeds++;
        }

        // Track perfect combo usage
        if (conditions.isPerfectCombo) {
          playerProgress.perfectCombos++;
        }
      }

      // Track seeds unlocked (passed from client)
      if (
        args.seedsUnlocked &&
        args.seedsUnlocked > playerProgress.seedsUnlocked
      ) {
        playerProgress.seedsUnlocked = args.seedsUnlocked;
      }
    }

    // Check all badges for qualification
    for (var badgeId in badgeConfig.badges) {
      var badge = badgeConfig.badges[badgeId];

      // Skip if player already has this badge
      if (playerProgress.badges.indexOf(badgeId) !== -1) {
        continue;
      }

      var qualified = false;
      var requirement = badge.requirement;

      if (!requirement) continue;

      // Check requirement based on type
      switch (requirement.type) {
        case "totalGrows":
          qualified = playerProgress.totalGrows >= requirement.value;
          break;

        case "consecutiveLogins":
          qualified = playerProgress.consecutiveLogins >= requirement.value;
          break;

        case "slotsWins":
          qualified = playerProgress.slotsWins >= requirement.value;
          break;

        case "seedsUnlocked":
          qualified = playerProgress.seedsUnlocked >= requirement.value;
          break;

        case "totalYield":
          qualified = playerProgress.totalYield >= requirement.value;
          break;

        case "weekendStreaks":
          qualified = playerProgress.weekendStreaks >= requirement.value;
          break;

        case "perfectGrows":
          qualified = playerProgress.perfectGrows >= requirement.value;
          break;

        case "actOfGodSurvived":
          qualified = playerProgress.actOfGodSurvived >= requirement.value;
          break;

        case "fastestGrow":
          qualified =
            playerProgress.fastestGrow &&
            playerProgress.fastestGrow <= requirement.value;
          break;

        case "optimalFeedings":
          qualified = playerProgress.optimalFeedings >= requirement.value;
          break;

        case "highRiskSeeds":
          qualified = playerProgress.highRiskSeeds >= requirement.value;
          break;

        case "currentTier":
          qualified = playerProgress.currentTier >= requirement.value;
          break;

        case "perfectCombos":
          qualified = playerProgress.perfectCombos >= requirement.value;
          break;

        case "yieldsOver100":
          qualified = playerProgress.yieldsOver100 >= requirement.value;
          break;

        case "potencyOver95":
          qualified = playerProgress.potencyOver95 >= requirement.value;
          break;
      }

      if (qualified) {
        playerProgress.badges.push(badgeId);
        newBadges.push(badgeId);
      }
    }

    // Update tier based on badge count
    var badgeCount = playerProgress.badges.length;
    for (var tier in badgeConfig.tiers) {
      var tierData = badgeConfig.tiers[tier];
      if (tierData && badgeCount >= tierData.badgesRequired) {
        playerProgress.currentTier = parseInt(tier);
      }
    }

    // Save updated progress
    server.UpdateUserInternalData({
      PlayFabId: currentPlayerId,
      Data: {
        playerProgress: JSON.stringify(playerProgress),
      },
    });

    // Update leaderboard
    server.UpdatePlayerStatistics({
      PlayFabId: currentPlayerId,
      Statistics: [{ StatisticName: scoreType, Value: scoreValue }],
    });

    return {
      success: true,
      message: "Score validated and updated",
      newBadges: newBadges,
      newTier:
        playerProgress.currentTier !== oldTier
          ? playerProgress.currentTier
          : null,
      playerProgress: playerProgress,
    };
  } catch (e) {
    return { success: false, error: "Unhandled error: " + e };
  }
};

// Separate handler for slots wins (keep this separate since it's a mini-game)
handlers.recordSlotsWin = function (args, context) {
  var userDataResult = server.GetUserInternalData({
    PlayFabId: currentPlayerId,
    Keys: ["playerProgress"],
  });

  var playerProgress = {};
  if (userDataResult.Data && userDataResult.Data.playerProgress) {
    try {
      playerProgress = JSON.parse(userDataResult.Data.playerProgress.Value);
    } catch (e) { }
  }

  playerProgress.slotsWins = (playerProgress.slotsWins || 0) + 1;

  server.UpdateUserInternalData({
    PlayFabId: currentPlayerId,
    Data: {
      playerProgress: JSON.stringify(playerProgress),
    },
  });

  return { success: true, totalWins: playerProgress.slotsWins };
};
// Function to save player progress to Internal Data
handlers.savePlayerProgress = function (args, context) {
  try {
    var playerProgress = args.playerProgress;

    if (!playerProgress || typeof playerProgress !== "object") {
      return { success: false, error: "No player progress provided" };
    }

    // Ensure badgePopupsShown exists
    if (!playerProgress.badgePopupsShown) {
      playerProgress.badgePopupsShown = [];
    }

    server.UpdateUserInternalData({
      PlayFabId: currentPlayerId,
      Data: {
        playerProgress: JSON.stringify(playerProgress),
      },
    });

    return { success: true, message: "Player progress saved successfully" };
  } catch (e) {
    return { success: false, error: "Failed to save player progress: " + e };
  }
};

handlers.getPlayerProgress = function (args, context) {
  try {
    var userDataResult = server.GetUserInternalData({
      PlayFabId: currentPlayerId,
      Keys: ["playerProgress"],
    });

    var playerProgress = {
      totalGrows: 0,
      badges: [],
      badgePopupsShown: [],
      grownStrains: [],
      currentTier: 1,
    };

    if (userDataResult.Data && userDataResult.Data.playerProgress) {
      try {
        var savedProgress = JSON.parse(
          userDataResult.Data.playerProgress.Value
        );
        playerProgress = savedProgress;

        // Ensure badgePopupsShown exists for existing players
        if (!playerProgress.badgePopupsShown) {
          playerProgress.badgePopupsShown = [];
        }
        // Ensure grownStrains exists for existing players
        if (!playerProgress.grownStrains) {
          playerProgress.grownStrains = [];
        }
      } catch (e) {
        // Keep default values if parsing fails
      }
    }

    return { success: true, playerProgress: playerProgress };
  } catch (e) {
    return { success: false, error: "Failed to get player progress: " + e };
  }
};

handlers.cleanupUserData = function (args, context) {
  try {
    // Check if cleanup already done (one-time flag) - ATOMIC CHECK
    var userDataResult = server.GetUserInternalData({
      PlayFabId: currentPlayerId,
      Keys: ["cleanupDone"],
    });

    if (userDataResult.Data && userDataResult.Data.cleanupDone) {
      return { success: true, message: "Already cleaned" };
    }

    // IMMEDIATELY set the flag to prevent race conditions
    server.UpdateUserInternalData({
      PlayFabId: currentPlayerId,
      Data: {
        cleanupDone: {
          Value: "true",
        },
      },
    });

    var resetType = args.resetType || "all"; // Default to "all" for login cleanup

    // Get all user data
    var userDataResult = server.GetUserData({
      PlayFabId: currentPlayerId,
    });

    var cleanupActions = [];

    if (resetType === "badges" || resetType === "all") {
      // Reset badge-related data
      var playerProgress = {
        totalGrows: 0,
        badges: [],
        badgePopupsShown: [],
        currentTier: 1,
        consecutiveLogins: 0,
        lastLoginDate: null,
        weekendStreaks: 0,
        lastWeekendDate: null,
        lastWeekendIndex: null,
        slotsWins: 0,
        seedsUnlocked: 6, // Keep seed unlocks
        totalYield: 0,
        perfectGrows: 0,
        actOfGodSurvived: 0,
        fastestGrow: null,
        highestPotency: 0,
        highestWeight: 0,
        totalHarvests: 0,
        optimalFeedings: 0,
        highRiskSeeds: 0,
        perfectCombos: 0,
        yieldsOver100: 0,
        potencyOver95: 0,
      };

      server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {
          playerProgress: JSON.stringify(playerProgress),
        },
      });

      cleanupActions.push("Reset playerProgress badge data");
    }

    if (resetType === "all") {
      // Clear all game history from UserData
      var keysToRemove = [];

      if (userDataResult.Data) {
        for (var key in userDataResult.Data) {
          if (
            key === "potencyHistory" ||
            key === "yieldHistory" ||
            key === "gameState"
          ) {
            keysToRemove.push(key);
          }
        }
      }

      if (keysToRemove.length > 0) {
        server.UpdateUserData({
          PlayFabId: currentPlayerId,
          Data: {},
          KeysToRemove: keysToRemove,
        });
        cleanupActions.push(
          "Cleared potencyHistory and yieldHistory from UserData"
        );
      }

      // Clear InternalData keys
      server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {},
        KeysToRemove: [
          "yieldHistory",
          "playerProgress",
          "lastLoginDate",
          "gameState",
          "seedsUnlocked",
          "badgesEarned",
          "equipmentOwned",
          "currentLight",
          "manualLightSelection",
        ],
      });
      cleanupActions.push("Cleared InternalData keys");

      // Reset leaderboard statistics
      server.UpdatePlayerStatistics({
        PlayFabId: currentPlayerId,
        Statistics: [
          { StatisticName: "potency", Value: 0 },
          { StatisticName: "yield", Value: 0 },
          { StatisticName: "TotalYield", Value: 0 },
        ],
      });

      cleanupActions.push("Reset leaderboard statistics");
    }

    if (resetType === "corrupted" || resetType === "all") {
      // Remove corrupted keys
      var corruptedKeys = [];

      if (userDataResult.Data) {
        for (var key in userDataResult.Data) {
          if (key.includes("undefined") || key.includes("[object Object]")) {
            corruptedKeys.push(key);
          }
        }
      }

      if (corruptedKeys.length > 0) {
        server.UpdateUserData({
          PlayFabId: currentPlayerId,
          Data: {},
          KeysToRemove: corruptedKeys,
        });
        cleanupActions.push(
          "Removed " + corruptedKeys.length + " corrupted keys"
        );
      }
    }

    if (resetType === "legacy" || resetType === "all") {
      // Remove legacy gameState data
      var legacyKeys = [];

      if (userDataResult.Data) {
        for (var key in userDataResult.Data) {
          if (key === "gameState") {
            legacyKeys.push(key);
          }
        }
      }

      if (legacyKeys.length > 0) {
        server.UpdateUserData({
          PlayFabId: currentPlayerId,
          Data: {},
          KeysToRemove: legacyKeys,
        });
        cleanupActions.push("Removed legacy gameState data");
      }
    }

    cleanupActions.push("Set cleanup flag (prevented race condition)");

    return {
      success: true,
      resetType: resetType,
      actions: cleanupActions,
      message: "Data cleanup completed successfully",
    };
  } catch (e) {
    return { success: false, error: "Failed to cleanup user data: " + e };
  }
};
