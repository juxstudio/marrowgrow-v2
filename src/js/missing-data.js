// Missing game data structures

// Seed properties: 31 seeds organized in 3 tiers with strategic "stinkers"
const seedProperties = {
  // TIER 1 (OK) - Basic seeds, some stinkers
  seed1: {
    name: "Crypt Cookies",
    waterDrain: 0.6,
    nutrientDrain: 0.5,
    image: "seeds/seed1.png",
    flowerImage: "flower/plant1.png",
    desc: "Balanced, classic strain.",
  },
  seed2: {
    name: "Slime 33",
    waterDrain: 0.5,
    nutrientDrain: 0.7,
    image: "seeds/seed2.png",
    flowerImage: "flower/plant2.png",
    desc: "Potent, nutrient-hungry.",
  },
  seed3: {
    name: "Jet Fuel",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed3.png",
    flowerImage: "flower/plant3.png",
    desc: "Resilient, fast finisher.",
  },
  seed4: {
    name: "Rotjaw",
    waterDrain: 0.9,
    nutrientDrain: 0.9,
    image: "seeds/seed4.png",
    flowerImage: "flower/plant4.png",
    desc: "TIER 1 STINKER: drains fast!",
  },
  seed5: {
    name: "Vader Breath",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed5.png",
    flowerImage: "flower/plant5.png",
    desc: "TIER 1 GEM: slow drain.",
  },
  seed6: {
    name: "Lazy Bones",
    waterDrain: 0.7,
    nutrientDrain: 0.6,
    image: "seeds/seed6.png",
    flowerImage: "flower/plant6.png",
    desc: "Mellow hybrid, mid stats.",
  },

  // TIER 2 (GOOD) - Better seeds, some stinkers
  seed7: {
    name: "Gloomberry",
    waterDrain: 0.4,
    nutrientDrain: 0.8,
    image: "seeds/seed7.png",
    flowerImage: "flower/plant7.png",
    desc: "Dark, juicy, needs lots of nutrients.",
  },
  seed8: {
    name: "Phantom Fruit",
    waterDrain: 0.5,
    nutrientDrain: 0.4,
    image: "seeds/seed8.png",
    flowerImage: "flower/plant8.png",
    desc: "Ethereal, light on resources.",
  },
  seed9: {
    name: "Diesel Drip",
    waterDrain: 0.8,
    nutrientDrain: 0.5,
    image: "seeds/seed9.png",
    flowerImage: "flower/plant9.png",
    desc: "Heavy drinker, mellow yield.",
  },
  seed10: {
    name: "Hotdog Water",
    waterDrain: 0.6,
    nutrientDrain: 0.8,
    image: "seeds/seed10.png",
    flowerImage: "flower/plant10.png",
    desc: "TIER 2 STINKER: foul but weirdly dank.",
  },
  seed11: {
    name: "Sundaez",
    waterDrain: 0.3,
    nutrientDrain: 0.6,
    image: "seeds/seed11.png",
    flowerImage: "flower/plant11.png",
    desc: "TIER 2 GEM: cool and refreshing.",
  },
  seed12: {
    name: "Skele OG",
    waterDrain: 0.7,
    nutrientDrain: 0.4,
    image: "seeds/seed12.png",
    flowerImage: "flower/plant12.png",
    desc: "PRIZE 1: Tough, dries out quickly.",
  },
  seed13: {
    name: "Marrow Melon",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "seeds/seed13.png",
    flowerImage: "flower/plant13.png",
    desc: "Juicy, balanced, easy to grow.",
  },
  seed14: {
    name: "Pineal Punch",
    waterDrain: 0.6,
    nutrientDrain: 0.3,
    image: "seeds/seed14.png",
    flowerImage: "flower/plant14.png",
    desc: "Hardy, low nutrient needs.",
  },
  seed15: {
    name: "Ghoul Gas",
    waterDrain: 0.8,
    nutrientDrain: 0.7,
    image: "seeds/seed15.png",
    flowerImage: "flower/plant15.png",
    desc: "TIER 2 STINKER: wild, gassy, unpredictable.",
  },
  seed16: {
    name: "Tomb Tangle",
    waterDrain: 0.4,
    nutrientDrain: 0.6,
    image: "seeds/seed16.png",
    flowerImage: "flower/plant16.png",
    desc: "Twisted, moderate needs.",
  },
  seed17: {
    name: "Wraithwreck",
    waterDrain: 0.5,
    nutrientDrain: 0.8,
    image: "seeds/seed17.png",
    flowerImage: "flower/plant17.png",
    desc: "Ghostly, nutrient-hungry.",
  },
  seed18: {
    name: "Grillz Glue",
    waterDrain: 0.7,
    nutrientDrain: 0.7,
    image: "seeds/seed18.png",
    flowerImage: "flower/plant18.png",
    desc: "PRIZE 2: Blinged out, sticky, hybrid king.",
  },

  // TIER 3 (BEST) - Premium seeds, some stinkers
  seed19: {
    name: "Grave Grape",
    waterDrain: 0.2,
    nutrientDrain: 0.3,
    image: "seeds/seed19.png",
    flowerImage: "flower/plant19.png",
    desc: "TIER 3 GEM: sweet, easy, low drain.",
  },
  seed20: {
    name: "Sour Spectre",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed20.png",
    flowerImage: "flower/plant20.png",
    desc: "Tart sativa, mid stats.",
  },
  seed21: {
    name: "Ghastleaf",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "seeds/seed21.png",
    flowerImage: "flower/plant21.png",
    desc: "Eerie, balanced needs.",
  },
  seed22: {
    name: "Eth Jack",
    waterDrain: 0.3,
    nutrientDrain: 0.6,
    image: "seeds/seed22.png",
    flowerImage: "flower/plant22.png",
    desc: "Energizing, classic haze.",
  },
  seed23: {
    name: "Pepe Zkittles",
    waterDrain: 0.6,
    nutrientDrain: 0.4,
    image: "seeds/seed23.png",
    flowerImage: "flower/plant23.png",
    desc: "Loud, sweet, dries out.",
  },
  seed24: {
    name: "Bitbudz",
    waterDrain: 0.2,
    nutrientDrain: 0.8,
    image: "seeds/seed24.png",
    flowerImage: "flower/plant24.png",
    desc: "TIER 3 STINKER: corn from the crypt.",
  },
  seed25: {
    name: "Wet Dream",
    waterDrain: 0.7,
    nutrientDrain: 0.2,
    image: "seeds/seed25.png",
    flowerImage: "flower/plant25.png",
    desc: "Fast finisher, dries quick.",
  },
  seed26: {
    name: "Phantom Pheno",
    waterDrain: 0.4,
    nutrientDrain: 0.5,
    image: "seeds/seed26.png",
    flowerImage: "flower/plant26.png",
    desc: "Rare, small but persistent.",
  },
  seed27: {
    name: "Hauntberry",
    waterDrain: 0.5,
    nutrientDrain: 0.3,
    image: "seeds/seed27.png",
    flowerImage: "flower/plant27.png",
    desc: "Sweet, but spooky.",
  },
  seed28: {
    name: "Panda Puff",
    waterDrain: 0.6,
    nutrientDrain: 0.6,
    image: "seeds/seed28.png",
    flowerImage: "flower/plant28.png",
    desc: "PRIZE 3 STINKER: Soft, frosty, zen vibes.",
  },
  seed29: {
    name: "Moonbat OG",
    waterDrain: 0.3,
    nutrientDrain: 0.4,
    image: "seeds/seed29.png",
    flowerImage: "flower/plant29.png",
    desc: "TIER 3 GEM: Light and breezy.",
  },
  seed30: {
    name: "Doom Daisy",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "seeds/seed30.png",
    flowerImage: "flower/plant30.png",
    desc: "Pretty, but deadly.",
  },
  seed31: {
    name: "Skele Skunk",
    waterDrain: 0.4,
    nutrientDrain: 0.6,
    image: "seeds/seed31.png",
    flowerImage: "flower/plant31.png",
    desc: "PRIZE 5: Pops up everywhere.",
  },
};

// Soil type definitions - now with names and images to match UI
const soilTypes = {
  ossuary: {
    name: "Bone Dust",
    waterDrain: 0.5,
    nutrientDrain: 0.6,
    image: "soil1.png",
  },
  graveblend: {
    name: "Magic Moss",
    waterDrain: 0.6,
    nutrientDrain: 0.4,
    image: "soil2.png",
  },
  marrowmoss: {
    name: "Eh.. Not sure",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "soil3.png",
  },
};

// 10 unique nutrient mixes
const nutrientMixes = {
  basic: {
    name: "Basic Mix",
    desc: "Standard, reliable feed.",
    potency: 1.0,
    yield: 1.0,
    nutrientFeed: 10,
  },
  growth: {
    name: "Growth Boost",
    desc: "Bigger yields, less potency.",
    potency: 0.9,
    yield: 1.2,
    nutrientFeed: 25,
  },
  potent: {
    name: "Potency Plus",
    desc: "More potent, less yield.",
    potency: 1.2,
    yield: 0.9,
    nutrientFeed: 15,
  },
  balanced: {
    name: "Balanced",
    desc: "Slight boost to both.",
    potency: 1.1,
    yield: 1.1,
    nutrientFeed: 18,
  },
  fungal: {
    name: "Fungal Fizz",
    desc: "Risk of mold, big yields!",
    potency: 0.8,
    yield: 1.3,
    nutrientFeed: 30,
  },
  bonebroth: {
    name: "Bone Broth",
    desc: "Super potent, stunts growth.",
    potency: 1.3,
    yield: 0.8,
    nutrientFeed: 12,
  },
  phantom: {
    name: "Phantom Dew",
    desc: "Ghostly, high yield, low flavor.",
    potency: 1.0,
    yield: 1.3,
    nutrientFeed: 22,
  },
  rotjuice: {
    name: "Rot Juice",
    desc: "Smells bad, drains everything.",
    potency: 0.7,
    yield: 0.7,
    nutrientFeed: 8,
  },
  cosmic: {
    name: "Cosmic",
    desc: "Unpredictable, sometimes amazing.",
    potency: 1.4,
    yield: 1.0,
    nutrientFeed: 20,
  },
  doomdust: {
    name: "Doom Dust",
    desc: "Dangerous, huge yields if you survive.",
    potency: 0.6,
    yield: 1.4,
    nutrientFeed: 28,
  },
};

// Fun, weird, and unique pest types
const pestTypes = [
  {
    name: "Space Slugs",
    damage: [4, 12],
    successRate: 0.5,
    message: "Space slugs are oozing over your plants!",
  },
  {
    name: "Brain Leeches",
    damage: [5, 15],
    successRate: 0.4,
    message: "Brain leeches are draining your plant's will to live!",
  },
  {
    name: "Crypt Mites",
    damage: [3, 10],
    successRate: 0.6,
    message: "Crypt mites are gnawing at your roots!",
  },
  {
    name: "Phantom Gnats",
    damage: [2, 8],
    successRate: 0.6,
    message: "Phantom gnats are haunting your soil!",
  },
  {
    name: "Mutant Aphids",
    damage: [6, 18],
    successRate: 0.35,
    message: "Mutant aphids are swarming your crop!",
  },
  {
    name: "Eyeball Spiders",
    damage: [5, 15],
    successRate: 0.3,
    message: "Eyeball spiders are staring at your leaves!",
  },
  {
    name: "Mini Martians",
    damage: [4, 14],
    successRate: 0.45,
    message: "Mini martians are abducting your nutrients!",
  },
  {
    name: "Fungal Gremlins",
    damage: [3, 12],
    successRate: 0.5,
    message: "Fungal gremlins are causing chaos in your soil!",
  },
];

// Fun, weird, and unique raider types
const raidTypes = [
  {
    name: "Crypt Bandits",
    damage: [10, 20],
    successRate: 0.3,
    message: "Crypt bandits are sneaking into your garden!",
  },
  {
    name: "Mutant Chickens",
    damage: [8, 18],
    successRate: 0.35,
    message: "Mutant chickens are pecking at your stash!",
  },
  {
    name: "Alien Harvesters",
    damage: [15, 25],
    successRate: 0.2,
    message: "Alien harvesters are beaming up your buds!",
  },
  {
    name: "Spectral Thieves",
    damage: [12, 22],
    successRate: 0.25,
    message: "Spectral thieves are phasing through your defenses!",
  },
  {
    name: "Corporate Thieves",
    damage: [20, 30],
    successRate: 0.25,
    message: "Corporate security forces are attempting to seize your crop!",
  },
  {
    name: "Mutant Horde",
    damage: [25, 35],
    successRate: 0.15,
    message: "A horde of mutants is descending on your grow site!",
  },
  {
    name: "Zombie Gardeners",
    damage: [10, 20],
    successRate: 0.3,
    message: "Zombie gardeners are pruning your plants... badly!",
  },
];

// Fun and funny acts of god
const actsOfGod = [
  // Water
  {
    type: "water",
    message: "Your mom's thirsty! There was a drought.",
    effect: (plant) => {
      plant.water = Math.max(10, plant.water - 30);
    },
  },
  {
    type: "water",
    message: "A pipe burst and flooded the street. Water supply is cut!",
    effect: (plant) => {
      plant.water = Math.max(10, plant.water - 30);
    },
  },
  {
    type: "water",
    message: "A rain of frogs absorbs all your water!",
    effect: (plant) => {
      plant.water = Math.max(10, plant.water - 30);
    },
  },
  // Light
  {
    type: "light",
    message: "A solar eclipse darkens the sky!",
    effect: (plant) => {
      plant.light = Math.max(10, plant.light - 30);
    },
  },
  {
    type: "light",
    message: "A dust storm blocks out the sun!",
    effect: (plant) => {
      plant.light = Math.max(10, plant.light - 30);
    },
  },
  {
    type: "light",
    message: "Cosmic rays mutate your crop!",
    effect: (plant) => {
      plant.light = Math.max(10, plant.light - 30);
    },
  },
  // Nutrients
  {
    type: "nutrients",
    message: "Hungry raccoons raided your compost pile!",
    effect: (plant) => {
      plant.nutrients = Math.max(10, plant.nutrients - 30);
    },
  },
  {
    type: "nutrients",
    message: "Toxic runoff ruined your fertilizer batch!",
    effect: (plant) => {
      plant.nutrients = Math.max(10, plant.nutrients - 30);
    },
  },
  {
    type: "nutrients",
    message: "A wormhole sucked up your nutrients!",
    effect: (plant) => {
      plant.nutrients = Math.max(10, plant.nutrients - 30);
    },
  },
  // Wild/funny
  {
    type: "wild",
    message: "A time traveler swapped your plant with a weaker version!",
    effect: (plant) => {
      plant.health = Math.max(10, plant.health - 30);
    },
  },
  {
    type: "wild",
    message: "A poltergeist rearranged your garden!",
    effect: (plant) => {
      plant.stress = Math.min(100, plant.stress + 30);
    },
  },
];

// Add a flag to track if an act of god has occurred
var actOfGodOccurred = false;
var actOfGodTimeout = null;

// Utility to pick 3 random seeds
function getRandomSeeds() {
  const keys = Object.keys(seedProperties);
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  return keys.slice(0, 3);
}

// Render 3 random seeds on the selection screen
function renderSeedOptions() {
  const chosenSeeds = getRandomSeeds();
  const seedOptionsDiv = document.querySelector(".seed-options");
  if (!seedOptionsDiv) return; // Exit if element doesn't exist

  seedOptionsDiv.innerHTML = "";
  chosenSeeds.forEach((key) => {
    const seed = seedProperties[key];
    const div = document.createElement("div");
    div.className = "seed-option";
    div.setAttribute("data-seed-type", key);
    div.innerHTML = `
          <img src="img/selections/${seed.image}" alt="${seed.name}" class="seed-img" />
          <div class="seed-name">${seed.name}</div>
      `;
    seedOptionsDiv.appendChild(div);
  });
  // Re-attach event listeners for new options
  document.querySelectorAll(".seed-option").forEach(function (option) {
    option.addEventListener("click", function () {
      document.querySelectorAll(".seed-option").forEach(function (opt) {
        opt.classList.remove("selected");
      });
      option.classList.add("selected");
      plant.seedType = option.getAttribute("data-seed-type");
      updateStartButton();
    });
  });
  attachSoilSelectionHandlers();
}

// Call renderSeedOptions on page load only if old UI exists
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".seed-options")) {
      renderSeedOptions();
    }
  });
} else {
  if (document.querySelector(".seed-options")) {
    renderSeedOptions();
  }
}

function attachSoilSelectionHandlers() {
  document.querySelectorAll(".soil-option").forEach(function (option) {
    option.addEventListener("click", function () {
      document.querySelectorAll(".soil-option").forEach(function (opt) {
        opt.classList.remove("selected");
      });
      option.classList.add("selected");
      plant.soilType = option.getAttribute("data-soil-type");
      updateStartButton();
    });
  });
}

// Set up soil selection only if old UI exists
if (document.querySelector(".soil-option")) {
  var soilOptions = document.querySelectorAll(".soil-option");
  soilOptions.forEach(function (option) {
    option.addEventListener("click", function () {
      // Remove selected class from all soil options
      soilOptions.forEach(function (opt) {
        opt.classList.remove("selected");
      });
      // Add selected class to clicked option
      option.classList.add("selected");
      // Store selected soil type
      plant.soilType = option.getAttribute("data-soil-type");
      updateStartButton();
    });
  });
}

// Update start button state
function updateStartButton() {
  const startButton = document.getElementById("startGameBtn");
  if (!startButton) return; // Exit if button doesn't exist
  startButton.disabled = !(
    plant.seedType &&
    plant.soilType &&
    plant.defenseType
  );
}

// Start the game
function startGame() {
  const selectionScreen = document.getElementById("selectionScreen");
  const gameSection = document.getElementById("gameSection");

  if (selectionScreen) selectionScreen.classList.add("hidden");
  if (gameSection) gameSection.classList.remove("hidden");

  var gameContainer = document.getElementById("gameContainer");
  if (gameContainer) gameContainer.classList.remove("hidden");

  // Show feeding schedule configuration
  if (typeof showFeedingScheduleConfig === "function") {
    showFeedingScheduleConfig();
  }
}

// Randomly trigger pest events during growth
function maybeTriggerEvent() {
  if (
    pestActive ||
    raiderActive ||
    nutrientActive ||
    plant.growthStage >= growthStages.length - 1
  )
    return;

  // Flowering stage: can trigger raiders or nutrient boost
  if (growthStages[plant.growthStage].name === "Flowering") {
    // 5% chance for raiders, 5% for nutrient boost (reduced from 15% and 10%)
    var rand = Math.random();
    if (rand < 0.05) {
      showNutrientEvent();
    } else if (rand < 0.1) {
      showRaiderEvent();
    }
  } else {
    // 5% chance for pests (reduced from 20%)
    if (Math.random() < 0.05) {
      showPestEvent();
    }
  }
}

function showPestEvent() {
  pestActive = true;
  const pestType = pestTypes[Math.floor(Math.random() * pestTypes.length)];
  addEventToLog(`${pestType.message}`, "warning");
  // If Grower defense, block pest penalty
  if (plant.defenseType === "grower") {
    setTimeout(function () {
      addEventToLog("Your Grower defended against the pests!", "info");
      pestActive = false;
    }, 2000);
    return;
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
  // If Hound defense, block raider penalty
  if (plant.defenseType === "hound") {
    setTimeout(function () {
      addEventToLog("Your Hound chased off the raiders!", "info");
      raiderActive = false;
    }, 2000);
    return;
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

function showNutrientEvent() {
  nutrientActive = true;
  addEventToLog("Nutrient boost available!", "info");

  // Random chance to get a nutrient boost
  const boostSuccess = Math.random() < 0.5; // 50% chance to get boost

  setTimeout(function () {
    if (boostSuccess) {
      const boostPercent = Math.floor(Math.random() * 10) + 5; // Random boost between 5-15%
      plant.potencyBoost *= 1 + boostPercent / 100;
      addEventToLog(
        `Nutrient boost applied! Potency increased by ${boostPercent}%.`,
        "info"
      );
    } else {
      addEventToLog("Nutrient boost opportunity missed.", "info");
    }
    nutrientActive = false;
  }, 5000);
}
