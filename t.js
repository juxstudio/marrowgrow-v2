// Updated vault interface in newgame.js

function showVaultInterface() {
  const gameContent = document.querySelector(".gameContent");
  if (!gameContent) return;

  gameContent.innerHTML = `
      <div class="vaultLayout">
        <!-- Vault Header -->
        <div class="vaultHeader">
          <h2 class="vaultTitle">VAULT</h2>
          
          <!-- Tab Navigation -->
          <div class="vaultTabs">
            <button class="vaultTab active" data-tab="seeds">SEEDS</button>
            <button class="vaultTab" data-tab="badges">BADGES</button>
            <button class="vaultTab" data-tab="equips">EQUIPS</button>
          </div>
        </div>
        
        <!-- Main Content Area -->
        <div class="vaultContent">
          <!-- Left side - Grid/Collection -->
          <div class="vaultGrid">
            <div class="vaultGridContainer">
              <!-- Seeds Tab Content -->
              <div class="tabContent active" id="seedsContent">
                <div class="gridScroll" id="vaultSeedGrid">
                  <!-- Seeds will populate here -->
                </div>
              </div>
              
              <!-- Badges Tab Content -->
              <div class="tabContent" id="badgesContent">
                <div class="gridScroll" id="vaultBadgeGrid">
                  <!-- Badges will populate here -->
                </div>
              </div>
              
              <!-- Equips Tab Content -->
              <div class="tabContent" id="equipsContent">
                <div class="gridScroll" id="vaultEquipGrid">
                  <!-- Equipment will populate here -->
                </div>
              </div>
            </div>
          </div>
          
          <!-- Right side - Detail View -->
          <div class="vaultDetail">
            <div class="detailView" id="detailView">
              <div class="emptyDetail">
                <p>Select an item to view details</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Back Button -->
        <div class="vaultFooter">
          <button class="beginRitualBtn secondary" id="backFromVault">Back to Game</button>
        </div>
      </div>
    `;

  // Initialize vault tabs and content
  initializeVaultTabs();

  // Populate initial content
  populateVaultSeeds();
  populateVaultBadges();
  populateVaultEquips();

  // Back button handler
  document
    .getElementById("backFromVault")
    ?.addEventListener("click", async () => {
      await renderSeedSelectionInterface();
    });
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

// Updated seed population for new structure
async function populateVaultSeeds() {
  const seedGrid = document.getElementById("vaultSeedGrid");
  if (!seedGrid) return;

  await initializeUnlockedSeeds();

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
            const threshold = seedUnlockThresholds[index] || 0;

            if (isUnlocked) {
              return `
              <div class="vaultItem unlocked" data-item-type="seed" data-item-key="${seedKey}" title="${seed.name}">
                <img src="img/selections/${seed.image}" alt="${seed.name}">
                <div class="itemName">${seed.name}</div>
              </div>
            `;
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

// New function to populate badges
async function populateVaultBadges() {
  const badgeGrid = document.getElementById("vaultBadgeGrid");
  if (!badgeGrid) return;

  try {
    // Get player progress from PlayFab
    const userDataResult = await PlayFabService.getUserData(["playerProgress"]);
    let playerProgress = { totalGrows: 0, badges: [], currentTier: 1 };

    if (userDataResult && userDataResult.playerProgress) {
      try {
        playerProgress = JSON.parse(userDataResult.playerProgress.Value);
      } catch (e) {
        console.warn("Could not parse player progress");
      }
    }

    // Define available badges (this could come from PlayFab title data)
    const availableBadges = [
      {
        id: "firstGrow",
        name: "First Grow",
        description: "Complete your first grow cycle",
        requirement: { type: "totalGrows", value: 1 },
        icon: "badge1.png",
      },
      {
        id: "veteran",
        name: "Veteran Grower",
        description: "Complete 10 grow cycles",
        requirement: { type: "totalGrows", value: 10 },
        icon: "badge2.png",
      },
      {
        id: "master",
        name: "Master Grower",
        description: "Complete 25 grow cycles",
        requirement: { type: "totalGrows", value: 25 },
        icon: "badge3.png",
      },
      {
        id: "legend",
        name: "Legendary Grower",
        description: "Complete 50 grow cycles",
        requirement: { type: "totalGrows", value: 50 },
        icon: "badge4.png",
      },
    ];

    badgeGrid.innerHTML = `
        <div class="itemGrid">
          ${availableBadges
            .map((badge) => {
              const isUnlocked = playerProgress.badges.includes(badge.id);
              const hasRequirement =
                playerProgress.totalGrows >= badge.requirement.value;

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
                <div class="vaultItem locked" data-item-type="badge" data-item-key="${
                  badge.id
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
                   data-item-type="equip" data-item-key="${key}" title="${
                light.name
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

function showSeedDetails(seedKey, detailView) {
  const seed = seedProperties[seedKey];
  if (!seed) return;

  detailView.innerHTML = `
      <div class="itemDetail">
        <div class="detailImage">
          <img src="img/selections/${seed.flowerImage}" alt="${
    seed.name
  } Plant">
        </div>
        <div class="detailInfo">
          <h3>${seed.name}</h3>
          <p class="description">${seed.desc}</p>
          <div class="statsList">
            <div class="statRow">
              <span class="statLabel">Water Drain:</span>
              <span class="statValue">${(seed.waterDrain * 100).toFixed(
                0
              )}%</span>
            </div>
            <div class="statRow">
              <span class="statLabel">Nutrient Drain:</span>
              <span class="statValue">${(seed.nutrientDrain * 100).toFixed(
                0
              )}%</span>
            </div>
          </div>
        </div>
      </div>
    `;
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
      <div class="itemDetail">
        <div class="detailImage">
          ${
            isUnlocked
              ? `<img src="img/badges/${badge.icon}" alt="${badge.name}">`
              : `<div class="lockedIcon" style="font-size: 4em; color: #666; text-align: center; line-height: 1;">?</div>`
          }
        </div>
        <div class="detailInfo">
          <h3>${badge.name}</h3>
          <p class="description">${badge.description}</p>
          <div class="badgeStatus">
            ${
              isUnlocked
                ? '<div class="statusBadge earned">EARNED</div>'
                : hasRequirement
                ? '<div class="statusBadge ready">READY TO CLAIM</div>'
                : `<div class="statusBadge locked">Requires ${getRequirementText(
                    badge.requirement
                  )}</div>`
            }
          </div>
          ${
            !isUnlocked
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

// Helper function to get requirement text for display
function getRequirementText(requirement) {
  if (!requirement) return "Unknown";

  const value = requirement.value;
  const unit = getRequirementUnit(requirement.type);

  return `${value} ${unit}`;
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
            ${
              threshold > 0
                ? `
            <div class="statRow">
              <span class="statLabel">Unlock Requirement:</span>
              <span class="statValue">${threshold}g total yield</span>
            </div>
            `
                : ""
            }
          </div>
          ${
            !isCurrent
              ? `
          <div class="equipActions">
            <button class="equipBtn" onclick="equipLight('${equipKey}')">EQUIP</button>
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
}

// Function to equip a light source
function equipLight(lightKey) {
  if (lightSources[lightKey]?.unlocked !== false) {
    currentLight = lightKey;

    // Refresh the equips grid to update equipped status
    populateVaultEquips();

    // Update the detail view
    showEquipDetails(lightKey, document.getElementById("detailView"));

    // If in game simulation, update the light icon
    updateSelectionIcons();

    console.log(`Equipped light: ${lightKey}`);
  }
}
