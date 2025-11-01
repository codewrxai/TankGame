# Babylon.js UI System for The Survivor Tank

## Overview
This UI system replaces Unity's Canvas-based UI with Babylon.js AdvancedDynamicTexture and GUI controls. All UI elements are created programmatically using Babylon.js GUI API.

## Architecture

### GameUIManager.ts
Central manager that creates and controls all game UI elements using Babylon.js GUI.

#### UI Elements Created:

1. **HUD (Heads-Up Display)**
   - **Score Text**: Top-left corner showing current score
   - **Health Slider**: Bottom-left corner showing player health with color-coded feedback
     - Green: >50% health
     - Yellow: 25-50% health
     - Red: <25% health
   - **Damage Flash**: Full-screen red overlay that flashes when player takes damage

2. **Pause Menu**
   - **Pause Panel**: Semi-transparent centered panel
   - **Pause Text**: "PAUSED" title
   - **Resume Button**: Green button to resume game
   - **Quit Button**: Red button to quit/reload game
   - Triggered by ESC key

3. **Game Over Screen**
   - **Game Over Text**: Large red "GAME OVER" text centered on screen
   - Appears when player health reaches 0

## Setup Instructions

### 1. Add GameUIManager to Scene
Attach the `GameUIManager` component to an empty GameObject in your scene (e.g., "UIManager").

```typescript
// This should be attached to a game object in the scene
// The UIManager will automatically create all UI elements on awake
```

### 2. Updated Components

The following components have been updated to work with the new UI system:

#### ScoreManager.ts
- Now references `GameUIManager` instead of creating its own text
- Automatically updates score display through UI Manager

#### PauseManager.ts
- Now uses `GameUIManager` to toggle pause menu
- Removed Canvas dependency

#### PlayerHealth.ts
- Now uses `GameUIManager` for health bar and damage flash
- No longer needs direct references to UI elements
- Automatically updates health display through UI Manager

#### GameOverManager.ts
- Now uses `GameUIManager` to show game over screen
- Displays game over text through UI Manager

## API Reference

### GameUIManager Methods

```typescript
// Update score display
updateScore(score: number): void

// Update health bar (auto color-coded)
updateHealth(currentHealth: number, maxHealth: number = 100): void

// Flash damage effect
flashDamage(): void

// Toggle pause menu (also pauses render loop)
togglePause(): void

// Show game over screen
showGameOver(): void

// Get UI controls for direct access (if needed)
getScoreText(): BABYLON.GUI.TextBlock
getHealthSlider(): BABYLON.GUI.Slider
getDamageImage(): BABYLON.GUI.Image
getGameOverText(): BABYLON.GUI.TextBlock
```

## Usage Examples

### Update Score
```typescript
// In any script
let uiManager = TOOLKIT.SceneManager.SearchForScriptComponentByName(
  this.scene, 
  "PROJECT.GameUIManager"
) as PROJECT.GameUIManager;

uiManager.updateScore(100);
```

### Update Health
```typescript
// In PlayerHealth or similar
this.uiManager.updateHealth(this.currentHealth, this.startingHealth);
```

### Flash Damage
```typescript
// When player takes damage
this.uiManager.flashDamage();
```

### Toggle Pause
```typescript
// In PauseManager or on ESC key
this.uiManager.togglePause();
```

### Show Game Over
```typescript
// When player dies
this.uiManager.showGameOver();
```

## Customization

### Styling

All styling is done in the `GameUIManager.ts` file. You can customize:

- **Colors**: Change button backgrounds, text colors, health bar colors
- **Sizes**: Adjust width/height of UI elements
- **Positions**: Modify left/top/alignment properties
- **Fonts**: Change fontSize, fontWeight, fontFamily
- **Animations**: Add custom animations using Babylon.js animation system

### Example Customization
```typescript
// In createHUD() method, modify scoreText
this.scoreText.fontSize = 60; // Larger font
this.scoreText.color = "yellow"; // Different color
this.scoreText.fontFamily = "Arial"; // Different font

// In createPauseMenu(), modify buttons
this.resumeButton.cornerRadius = 20; // More rounded
this.resumeButton.background = "rgba(0, 100, 255, 0.8)"; // Blue instead of green
```

## Notes

- All UI is created in screen space (fullscreen AdvancedDynamicTexture)
- UI automatically handles resolution scaling
- Pause menu pauses the render loop when visible
- Damage flash automatically fades over time (controlled in `update()`)
- No Unity Canvas or UI components required
- All UI is resolution-independent

## Migration from Unity

| Unity Component | Babylon.js Equivalent |
|----------------|----------------------|
| Canvas | AdvancedDynamicTexture |
| Text | TextBlock |
| Slider | Slider |
| Image | Image / Rectangle |
| Button | Button |
| Panel | Rectangle |

## Babylon.js GUI Resources

- [Babylon.js GUI Documentation](https://doc.babylonjs.com/features/featuresDeepDive/gui)
- [GUI Examples](https://doc.babylonjs.com/features/featuresDeepDive/gui/gui)
- [Advanced Dynamic Texture](https://doc.babylonjs.com/features/featuresDeepDive/gui/gui#advanceddynamictexture)
