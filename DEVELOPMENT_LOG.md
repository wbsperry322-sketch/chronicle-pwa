# Chronicle PWA - Development Log

## Recent Changes

### Card Design Update (Latest)
- **Implemented Option 8**: Ornate burgundy cards with golden mandala corner decorations
- **Card Background**: Using `card2-border.jpg` with 100% stretch to show all corner flourishes
- **Card Dimensions**:
  - Game cards: min-width 160px, max-width 200px, min-height 90px, dynamic height
  - Timeline cards: min-width 140px, max-width 180px, min-height 80px, dynamic height
  - Padding allows text to wrap naturally
- **Text Colors**:
  - Event text: #f4e4c1 (light beige) with dark text shadow
  - Year text: #c4a44d (gold) with dark text shadow
  - Works well on dark burgundy background

### Features Added
- **Event Image Display**: Clicking a card shows the event's image in background at 20% opacity
- **Modal Integration**: Background image appears behind the event description modal
- **Portrait Mode Fixes**:
  - Turn banner fixed at top with pointer-events: none
  - Leave button positioned at left: 10px

### Files Modified
- `index.html`: Main game file with new card styles
- `card2-border.jpg`: Ornate border image with golden mandala corners
- `card-prototype.html`: Prototype file for testing 9+ card design options

### Key CSS Classes
- `.game-card`: Player's current card (bottom of screen)
- `.tl-card`: Timeline cards (cards that have been placed)
- `.card-event`: Event name styling
- `.card-year`: Year styling
- `#game-bg`: Background image container (20% opacity)

### Testing
- Local server running on port 8000
- Access at: http://localhost:8000/index.html
- Mobile testing via: http://[local-ip]:8000/index.html

## Automated Screenshot Testing
Created Python scripts using Playwright to:
- Capture screenshots of card designs
- Generate side-by-side comparisons
- Verify sizing matches original cards
