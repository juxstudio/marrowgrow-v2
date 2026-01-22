// Bug System - Space Invader style falling bugs
// Bugs spawn at top of plant panel, fall down, player clicks to swat

const BugSystem = {
    container: null,
    activeBugs: [],
    spawnInterval: null,
    isRunning: false,
    missedBugs: 0,

    // Bug emoji options
    bugEmojis: ['🐛', '🐜', '🪲', '🦗', '🕷️', '🐞'],

    // Configuration
    config: {
        spawnRate: 3000,      // ms between spawns
        fallDuration: 4000,   // ms to reach bottom
        damagePerMiss: 2,     // health % lost per missed bug
        maxBugsOnScreen: 5    // prevent overwhelming
    },

    init() {
        // Find or create bug container
        const plantPanel = document.querySelector('.plantVisualPanel');
        if (!plantPanel) {
            console.log('🐛 Bug System: Plant panel not found, waiting...');
            return false;
        }

        // Check if container already exists
        this.container = document.getElementById('bugContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'bugContainer';
            this.container.className = 'bugContainer';
            plantPanel.appendChild(this.container);
        }

        console.log('🐛 Bug System: Initialized');
        return true;
    },

    start() {
        if (this.isRunning) return;
        if (!this.init()) {
            // Retry after a delay if panel not ready
            setTimeout(() => this.start(), 1000);
            return;
        }

        this.isRunning = true;
        this.missedBugs = 0;
        this.clearAllBugs();

        // Start spawning bugs
        this.spawnInterval = setInterval(() => {
            if (this.activeBugs.length < this.config.maxBugsOnScreen) {
                this.spawnBug();
            }
        }, this.config.spawnRate);

        // Spawn first bug quickly
        setTimeout(() => this.spawnBug(), 500);

        console.log('🐛 Bug System: Started');
    },

    stop() {
        this.isRunning = false;
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
        this.clearAllBugs();
        console.log('🐛 Bug System: Stopped');
    },

    clearAllBugs() {
        this.activeBugs.forEach(bug => bug.element.remove());
        this.activeBugs = [];
    },

    spawnBug() {
        if (!this.container || !this.isRunning) return;

        const bug = document.createElement('div');
        bug.className = 'bug';

        // Random emoji
        const emoji = this.bugEmojis[Math.floor(Math.random() * this.bugEmojis.length)];
        bug.textContent = emoji;

        // Random X position (10% to 90% of container width)
        const xPercent = 10 + Math.random() * 80;
        bug.style.left = `${xPercent}%`;
        // Don't set top - let the CSS animation control vertical position

        // Random fall duration for variety
        const fallDuration = this.config.fallDuration + (Math.random() * 1000 - 500);
        bug.style.animationDuration = `${fallDuration}ms`;

        // Add falling class
        bug.classList.add('falling');

        // Track bug
        const bugData = {
            element: bug,
            id: Date.now() + Math.random(),
            startTime: Date.now()
        };
        this.activeBugs.push(bugData);

        // Click handler - swat the bug
        bug.addEventListener('click', (e) => {
            e.stopPropagation();
            this.swatBug(bugData, e);
        });

        // Remove when animation ends (bug reached bottom = missed)
        bug.addEventListener('animationend', () => {
            if (this.activeBugs.includes(bugData)) {
                this.bugMissed(bugData);
            }
        });

        this.container.appendChild(bug);
    },

    swatBug(bugData, event) {
        const bug = bugData.element;

        // Remove from active list
        this.activeBugs = this.activeBugs.filter(b => b.id !== bugData.id);

        // Stop falling animation
        bug.classList.remove('falling');
        bug.classList.add('squashed');

        // Show SWAT text
        this.showSwatText(event.clientX, event.clientY);

        // Remove after squash animation
        setTimeout(() => {
            bug.remove();
        }, 300);

        console.log('🐛 SWAT! Bug squashed');
    },

    showSwatText(x, y) {
        const swat = document.createElement('div');
        swat.className = 'swatText';
        swat.textContent = 'SWAT!';

        // Position at click location
        swat.style.left = `${x}px`;
        swat.style.top = `${y}px`;

        document.body.appendChild(swat);

        // Remove after animation
        setTimeout(() => {
            swat.remove();
        }, 600);
    },

    bugMissed(bugData) {
        const bug = bugData.element;

        // Remove from active list
        this.activeBugs = this.activeBugs.filter(b => b.id !== bugData.id);

        // Remove element
        bug.remove();

        // Increment missed counter
        this.missedBugs++;

        // Apply damage to plant
        this.applyDamage();

        console.log(`🐛 Bug missed! Total missed: ${this.missedBugs}`);
    },

    applyDamage() {
        // Reduce plant health - find the health value and update it
        const healthEl = document.getElementById('healthValue');
        if (healthEl) {
            let health = parseInt(healthEl.textContent) || 100;
            health = Math.max(0, health - this.config.damagePerMiss);
            healthEl.textContent = `${health}%`;

            // Flash red to indicate damage
            healthEl.style.color = '#ff4444';
            setTimeout(() => {
                healthEl.style.color = '';
            }, 300);
        }

        // Also update the stress bar
        const stressBar = document.getElementById('stressBar');
        if (stressBar) {
            let stress = parseInt(stressBar.style.width) || 0;
            stress = Math.min(100, stress + this.config.damagePerMiss);
            stressBar.style.width = `${stress}%`;
        }
    }
};

// Make globally available
window.BugSystem = BugSystem;

// Auto-initialize when DOM ready (but don't start yet)
document.addEventListener('DOMContentLoaded', () => {
    console.log('🐛 Bug System: Ready to initialize');
});
