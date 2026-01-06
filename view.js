// View Service for handling all UI updates
const ViewService = {
  // High Scores Display (now uses global stats)
  async updateHighScoresDisplay(highScores, currentGrowerName) {
    try {
      // Fetch global arrays from PlayFab user data
      const potencyArr = await PlayFabService.getUserArray("potencyHistory");
      const yieldArr = await PlayFabService.getUserArray("yieldHistory");

      this.updatePotencyScoresFromArray(potencyArr, currentGrowerName);
      this.updateYieldScoresFromArray(yieldArr, currentGrowerName);
      this.updateAveragePotencyScoresFromArray(potencyArr, currentGrowerName);
    } catch (error) {
      // Set default empty displays when not logged in
      this.updatePotencyScoresFromArray([], currentGrowerName);
      this.updateYieldScoresFromArray([], currentGrowerName);
      this.updateAveragePotencyScoresFromArray([], currentGrowerName);
    }
  },

  updatePotencyScoresFromArray(potencyArr, currentGrowerName) {
    const potencyScores = document.getElementById("potencyScores");
    if (!potencyScores) {
      // Element doesn't exist, just return without error
      return;
    }
    if (!Array.isArray(potencyArr) || potencyArr.length === 0) {
      potencyScores.innerHTML = '<div class="score-entry">No data</div>';
      return;
    }
    // Show all scores in reverse chronological order (newest first)
    const lastScores = [...potencyArr].reverse();
    potencyScores.innerHTML = lastScores
      .map(
        (score, index) => `
             <div class="score-entry">${
               potencyArr.length - index
             }. you: ${score}%</div>
         `
      )
      .join("");
  },

  updateYieldScoresFromArray(yieldArr, currentGrowerName) {
    const yieldScores = document.getElementById("yieldScores");
    if (!yieldScores) {
      // Element doesn't exist, just return without error
      return;
    }
    if (!Array.isArray(yieldArr) || yieldArr.length === 0) {
      yieldScores.innerHTML = '<div class="score-entry">No data</div>';
      return;
    }
    // Show all scores in reverse chronological order (newest first)
    const lastScores = [...yieldArr].reverse();
    yieldScores.innerHTML = lastScores
      .map(
        (score, index) => `
             <div class="score-entry">${
               yieldArr.length - index
             }. you: ${score}g</div>
         `
      )
      .join("");

    // Update total personal yield
    const totalPersonalYield = document.getElementById("totalPersonalYield");
    if (totalPersonalYield) {
      const totalYield = yieldArr.reduce((sum, score) => sum + score, 0);
      totalPersonalYield.innerHTML = `<div class="score-entry">you: ${totalYield}g</div>`;
    }
  },

  updateAveragePotencyScoresFromArray(potencyArr, currentGrowerName) {
    const avgPotencyScores = document.getElementById("averagePotencyScores");
    if (!avgPotencyScores) {
      // Element doesn't exist, just return without error
      return;
    }
    if (!Array.isArray(potencyArr) || potencyArr.length === 0) {
      avgPotencyScores.innerHTML = '<div class="score-entry">No data</div>';
      return;
    }
    // Calculate average and count
    const sum = potencyArr.reduce((a, b) => a + b, 0);
    const count = potencyArr.length;
    const avg = Math.round(sum / count);
    avgPotencyScores.innerHTML = `<div class="score-entry">you: ${avg}% (${count} grows)</div>`;
  },

  // Plant Status Display
  updatePlantStatus(plant) {
    const statusDisplay = document.getElementById("plantStatus");
    if (!statusDisplay) return;

    const status = this.getPlantStatus(plant);
    statusDisplay.innerHTML = status
      .map(
        (item) => `
            <div class="status-item ${item.class}">
                <span class="status-label">${item.label}:</span>
                <span class="status-value">${item.value}</span>
            </div>
        `
      )
      .join("");
  },

  getPlantStatus(plant) {
    return [
      {
        label: "Health",
        value: `${plant.health}%`,
        class: this.getHealthClass(plant.health),
      },
      { label: "Growth", value: `${plant.growth}%`, class: "status-normal" },
      {
        label: "Stress",
        value: `${plant.stress}%`,
        class: this.getStressClass(plant.stress),
      },
    ];
  },

  getHealthClass(health) {
    if (health >= 80) return "status-good";
    if (health >= 50) return "status-warning";
    return "status-danger";
  },

  getStressClass(stress) {
    if (stress <= 20) return "status-good";
    if (stress <= 50) return "status-warning";
    return "status-danger";
  },

  // Resource Display
  updateResourceDisplay(resources) {
    this.updateElement("waterLevel", resources.water);
    this.updateElement("lightLevel", resources.light);
    this.updateElement("nutrientLevel", resources.nutrients);
    this.updateElement("stressLevel", resources.stress);
  },

  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
    }
  },

  // Global Leaderboards Display
  updateGlobalPotencyScores(leaderboard) {
    const potencyScores = document.getElementById("potencyScores");
    if (!potencyScores || !Array.isArray(leaderboard)) return;
    potencyScores.innerHTML = leaderboard
      .slice(0, 10)
      .map(
        (entry, index) => `
            <div class="score-entry">
                ${index + 1}. ${entry.DisplayName || entry.PlayFabId}: ${
          entry.StatValue
        }%
            </div>
        `
      )
      .join("");
  },

  updateGlobalYieldScores(leaderboard) {
    const yieldScores = document.getElementById("yieldScores");
    if (!yieldScores || !Array.isArray(leaderboard)) return;
    yieldScores.innerHTML = leaderboard
      .slice(0, 10)
      .map(
        (entry, index) => `
            <div class="score-entry">
                ${index + 1}. ${entry.DisplayName || entry.PlayFabId}: ${
          entry.StatValue
        }g
            </div>
        `
      )
      .join("");
  },

  // Global Leaderboards Panel Display
  updateGlobalPotencyPanel(leaderboard) {
    const panel = document.getElementById("globalPotencyLeaderboard");
    if (!panel || !Array.isArray(leaderboard)) return;
    const topEntries = leaderboard
      .slice(0, 10)
      .sort((a, b) => b.StatValue - a.StatValue);
    panel.innerHTML = topEntries
      .map(
        (entry, index) => `
            <div class="score-entry">
                <span style="color:#ffd700;">${
                  index + 1
                }.</span> <span style="color:#fff;">${
          entry.DisplayName || "Anonymous"
        }</span>: <span style="color:#ffd700;">${entry.StatValue}%</span>
            </div>
        `
      )
      .join("");
  },

  updateGlobalYieldPanel(totalYieldArr) {
    const panel = document.getElementById("globalYieldLeaderboard");
    if (!panel || !Array.isArray(totalYieldArr)) return;
    const topEntries = totalYieldArr
      .slice(0, 10)
      .sort((a, b) => b.totalYield - a.totalYield);
    panel.innerHTML = topEntries
      .map(
        (entry, index) => `
            <div class="score-entry">
                <span style="color:#ffd700;">${
                  index + 1
                }.</span> <span style="color:#fff;">${
          entry.DisplayName || "Anonymous"
        }</span>: <span style="color:#ffd700;">${entry.totalYield}g</span>
            </div>
        `
      )
      .join("");
  },

  updateGlobalAveragePotencyPanel(avgPotencyArr) {
    const panel = document.getElementById("globalAveragePotencyLeaderboard");
    if (!panel || !Array.isArray(avgPotencyArr)) return;
    const filtered = avgPotencyArr.filter((entry) => entry.count > 3);
    panel.innerHTML = filtered
      .slice(0, 10)
      .map(
        (entry, index) => `
            <div class="score-entry">
                <span style="color:#ffd700;">${
                  index + 1
                }.</span> <span style="color:#fff;">${
          entry.DisplayName || "Anonymous"
        }</span>: <span style="color:#ffd700;">${
          entry.avgPotency
        }%</span> <span style='color:#bfcfff;font-size:0.9em;'>(${
          entry.count
        } grows)</span>
            </div>
        `
      )
      .join("");
  },

  updateGlobalAverageYieldPanel(avgYieldArr) {
    const panel = document.getElementById("globalAverageYieldLeaderboard");
    if (!panel || !Array.isArray(avgYieldArr)) return;
    panel.innerHTML = avgYieldArr
      .slice(0, 5)
      .map(
        (entry, index) => `
            <div class="score-entry" style="color:#bfcfff;font-size:1.1em;">
                <span style="color:#ffd700;">${
                  index + 1
                }.</span> <span style="color:#fff;">${
          entry.DisplayName || "Anonymous"
        }</span>: <span style="color:#ffd700;">${
          entry.avgYield
        }g</span> <span style='color:#bfcfff;font-size:0.9em;'>(${
          entry.count
        } grows)</span>
            </div>
        `
      )
      .join("");
  },
};

// Export for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = ViewService;
}
