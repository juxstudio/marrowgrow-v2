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
