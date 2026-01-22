# Marrow Grow - Cannabis Growing Simulation Game

A web-based cannabis growing simulation game with PlayFab integration for user authentication and data persistence.

## Project Overview

This project contains the complete Marrow Grow game, including both the original source code and the current implementation. The game simulates growing cannabis plants with various strains, soil types, and growth mechanics.

## File Structure & Code Descriptions

### Core Game Files

#### `newgame.html`

- **Main HTML file** for the current game implementation
- Contains the complete UI structure with loading screens, authentication panels, and game interface
- Includes responsive design elements and mobile optimization
- Links to `new.css` for styling and `newgame.js` for game logic

#### `newgame.js` (1,992 lines)

- **Current main game logic** - the active implementation
- Handles DOM initialization, PlayFab integration, and game state management
- Manages authentication flow, auto-login, and session persistence
- Contains the complete game loop and user interaction handling

#### `new.css`

- **Main stylesheet** for the current game implementation
- Provides responsive design, animations, and visual styling
- Includes mobile-optimized layouts and game-specific UI elements

### Original Source Files

#### `game.js` (3,508 lines)

- **Original game source code** from the previous Marrow Grow implementation
- Contains the complete game logic, mechanics, and systems
- **Note**: This file is NOT accompanied by its original HTML files
- Includes mobile detection, PlayFab integration, and comprehensive game features
- Contains seed management, growth mechanics, resource systems, and user interface logic

### Configuration & Services

#### `config.js`

- **Game configuration constants** and settings
- Defines seed lives, growth stages, resource limits, and strain types
- Contains soil types, event probabilities, and growth timers
- Centralized configuration for easy game balancing

#### `playfab-service.js` (767 lines)

- **PlayFab integration service** for backend functionality
- Handles user authentication (Google, Username/Password)
- Manages session persistence and user data storage
- Provides methods for saving/loading game progress, high scores, and user statistics
- Includes error handling and offline fallback mechanisms

#### `storage.js` (51 lines)

- **Local storage service** for handling localStorage operations
- Manages high scores, seed lockout timestamps, and local game data
- Provides fallback storage when PlayFab is unavailable
- Handles data serialization and retrieval

#### `view.js` (282 lines)

- **UI view service** for handling all user interface updates
- Manages high scores display, game state visualization, and user feedback
- Handles dynamic content updates and responsive UI changes
- Integrates with PlayFab for real-time data display

### Data Files

#### `missing-data.js` (763 lines)

- **Comprehensive game data structures** for the current implementation
- Contains 31 seed properties with unique stats, images, and descriptions
- Includes soil types, light sources, and defense mechanisms
- Defines growth stages, event types, and game mechanics data
- **Primary data source** for the current game

#### `missing-data-backup.js` (288 lines)

- **Backup/alternative data structures**
- Contains a smaller set of seed properties (31 seeds)
- Includes soil types, light sources, and basic game data
- **Secondary data source** - may be used for testing or as fallback

### Legacy/Archive Files

#### `src/` Directory

- Contains older versions of the main files
- `src/js/` - Legacy JavaScript files (bk.js, config.js, game.js, etc.)
- `src/css/` - Legacy stylesheet (style.css)
- These appear to be backup or development versions

### Assets

#### `img/` Directory

- **Game assets** including:
  - `icons/` - Social login icons (Apple, Discord, Google, Logout)
  - `logo/` - Game logo (mglogo.png)
  - `rive/` - Rive animation files (floweranimation2.riv)
  - `selections/` - Game selection images:
    - `defense/` - Defense mechanism images
    - `flower/` - Plant/flower images (31 varieties)
    - `light/` - Light source images
    - `seeds/` - Seed images (31 varieties)
    - Soil and background images
  - `stages/` - Growth stage images (bloom, harvest, sprout, veg, yield)

## Game Features

- **31 Unique Cannabis Strains** with different growth characteristics
- **Multiple Soil Types** affecting plant growth
- **Resource Management** (water, light, nutrients, stress)
- **Growth Stages** from germination to harvest
- **Social Authentication** via Google, Apple, and Discord
- **Cloud Save** through PlayFab integration
- **Mobile Responsive** design
- **High Score Tracking** and statistics
- **Seed Lockout System** for balanced gameplay

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PlayFab (authentication, data persistence)
- **Assets**: SVG icons, PNG images, Rive animations
- **Storage**: localStorage + PlayFab cloud storage
- **Authentication**: OAuth (Google)

## Getting Started

1. Open `newgame.html` in a web browser
2. The game will initialize and show authentication options
3. Sign in with Google, Apple, or Discord to save progress
4. Start growing your first cannabis plant!

## Development Notes

- The `game.js` file contains the original implementation but lacks accompanying HTML files
- The current active implementation uses `newgame.html`, `newgame.js`, and `new.css`
- Data structures are defined in `missing-data.js` and `missing-data-backup.js`
- PlayFab integration provides cloud save and user management

## Rive ViewModel Integration (Micro-Interaction Control)

This project uses **Rive animations with ViewModel data binding** to create smooth, progress-controlled animations. Instead of playing animations at a fixed speed, we bind ViewModel properties to control the exact frame position.

### How It Works

1. **Create a ViewModel in Rive Editor**: Define a number property (e.g., `maintimelineslide`) that ranges from 0-1
2. **Bind the property to timeline position**: In Rive, connect this property to drive the animation's timeline
3. **Set `autoBind: true`** in JavaScript to automatically expose the ViewModel
4. **Control animation frame** by setting the property value (0 = start, 1 = end)

### Implementation Pattern

```javascript
// 1. Load Rive with autoBind enabled
const riveInstance = new rive.Rive({
  buffer: buffer,                    // Fetch .riv file as ArrayBuffer
  canvas: canvas,
  autoplay: true,
  autoBind: true,                    // KEY: Enables ViewModel auto-binding
  artboard: 'mainartboard',          // Specify artboard name
  stateMachines: 'State Machine 2',  // Specify state machine name
  layout: new rive.Layout({
    fit: rive.Fit.Contain,
    alignment: rive.Alignment.Center
  }),
  onLoad: () => {
    // 2. Access the auto-bound ViewModel instance
    const vmi = riveInstance.viewModelInstance;
    
    if (vmi) {
      // 3. Get the number property accessor
      const timelineAccessor = vmi.number('maintimelineslide');
      
      if (timelineAccessor) {
        // 4. Set value to control animation position (0-1 range)
        timelineAccessor.value = 0.5;  // 50% through animation
      }
    }
  }
});
```

### Key Configuration Details

| Parameter | Value | Notes |
|-----------|-------|-------|
| `autoBind` | `true` | Required to expose `viewModelInstance` |
| `artboard` | Artboard name from Rive file | e.g., `'mainartboard'` |
| `stateMachines` | State machine name | e.g., `'State Machine 2'` |
| Property range | `0` to `1` | NOT 0-100 or 1-100 |

### In This Project

The plant growth animation (`floweranimationThis.riv`) has 32 keyframes controlled by `maintimelineslide`:

```javascript
// In updatePlantImage() - newgame.js
const progress = elapsed / plant.totalGrowthTime;  // 0 to 1
riveTimelineInput.value = progress;                // Directly sets animation position
```

### Rive Editor Setup

1. **Create a ViewModel** in the Rive editor (e.g., "View Model 2")
2. **Add a Number property** named `maintimelineslide`
3. **Create an Instance** of the ViewModel
4. **Bind the timeline** to this property using Rive's data binding features
5. The timeline will scrub from start (0) to end (1) based on the property value

### Debug Page

Use `rive-debug.html` to test ViewModel binding interactively with a slider before integrating into the main game.

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `viewModelInstance` is null | Ensure `autoBind: true` and correct artboard/stateMachine names |
| Animation plays automatically | Animation should play; value changes control position within it |
| Jumps to end on any change | Check value range - use 0-1, not 1-100 |
| No response to value changes | Verify the ViewModel property is correctly bound to the timeline in Rive |

