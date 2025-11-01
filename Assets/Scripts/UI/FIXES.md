# UI Fixes Applied

## Issues Fixed

### 1. ❌ Score Error: `Cannot read properties of undefined (reading 'score')`

**Problem:** 
- `EnemyHealth.ts` was trying to access `(window as any).ScoreManager.score`
- This was undefined because ScoreManager is in the PROJECT namespace

**Solution:**
- Changed to `PROJECT.ScoreManager.score` (line 69 in EnemyHealth.ts)

**File Changed:** `Assets/Scripts/Enemy/EnemyHealth.ts`

```typescript
// BEFORE (Wrong)
(window as any).ScoreManager.score += this.scoreValue;

// AFTER (Correct)
PROJECT.ScoreManager.score += this.scoreValue;
```

---

### 2. ❌ UI Elements Centered Instead of At Screen Edges

**Problem:** 
- Score and Health bar were appearing in the center of the screen
- Using `left` and `top` properties doesn't work correctly with alignment

**Solution:**
- Changed to use `paddingLeft`, `paddingTop`, `paddingBottom` instead of `left`/`top`
- Used `StackPanel` for pause menu to properly stack buttons vertically

**Files Changed:** `Assets/Scripts/UI/GameUIManager.ts`

#### Changes Made:

**Score Text (Top-Left):**
```typescript
// BEFORE
this.scoreText.left = "20px";
this.scoreText.top = "20px";

// AFTER
this.scoreText.paddingLeft = "20px";
this.scoreText.paddingTop = "20px";
```

**Health Slider (Bottom-Left):**
```typescript
// BEFORE
this.healthBackground.left = "20px";
this.healthBackground.top = "-20px";

// AFTER
this.healthBackground.paddingLeft = "20px";
this.healthBackground.paddingBottom = "20px";
```

**Pause Menu (Center):**
- Added `StackPanel` for proper vertical button layout
- Buttons now stack properly with spacing

---

## UI Layout

```
┌─────────────────────────────────────────────┐
│ SCORE: 0                                    │ ← Top-Left
│                                             │
│                                             │
│              [GAME VIEW]                    │
│                                             │
│                                             │
│ [████████░░] Health                         │ ← Bottom-Left
└─────────────────────────────────────────────┘

When ESC pressed:
┌─────────────────────────────────────────────┐
│                                             │
│            ┌─────────────┐                  │
│            │   PAUSED    │                  │ ← Centered
│            │             │                  │
│            │  [RESUME]   │                  │
│            │             │                  │
│            │   [QUIT]    │                  │
│            └─────────────┘                  │
│                                             │
└─────────────────────────────────────────────┘

When Player Dies:
┌─────────────────────────────────────────────┐
│                                             │
│                                             │
│           GAME OVER                         │ ← Centered
│                                             │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Testing

### Test Score Update:
1. Kill an enemy
2. Score should increment by enemy's `scoreValue`
3. No console errors should appear

### Test UI Positioning:
1. **Score**: Should be in top-left corner
2. **Health**: Should be in bottom-left corner
3. **Pause Menu**: Press ESC - should appear centered
4. **Game Over**: When health reaches 0 - should appear centered

---

## Key Babylon.js GUI Tips

### Positioning Controls:

| Property | Usage |
|----------|-------|
| `left`, `top`, `right`, `bottom` | Pixel offsets (can cause centering issues) |
| `paddingLeft`, `paddingTop`, etc. | Padding from edges (better with alignment) |
| `horizontalAlignment` | Set anchor point (LEFT, CENTER, RIGHT) |
| `verticalAlignment` | Set anchor point (TOP, CENTER, BOTTOM) |

### Best Practices:
1. ✅ Use `padding` with alignment for edge-positioned elements
2. ✅ Use `StackPanel` for vertical/horizontal layouts
3. ✅ Use namespace-qualified references (`PROJECT.ClassName`)
4. ❌ Avoid `(window as any)` for accessing game objects

---

## Additional Notes

- All UI uses Babylon.js `AdvancedDynamicTexture` (fullscreen)
- UI is resolution-independent
- Colors change based on health percentage (green → yellow → red)
- Pause menu has hover effects on buttons
