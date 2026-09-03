# Girl Garden

A cozy, pink and glassy incremental clicker game built with vanilla HTML, CSS, and JavaScript. Plant seeds, grow fruit, harvest your basket, buy upgrades, and unlock badges as you go.

**Authors:** Sophia Ansari & Group
**Date Started:** February 6, 2026

---

## About

Girl Garden is a browser-based idle/clicker game. Click the seed to plant seeds, which grow into fruit on your tree. Once your tree is full, it automatically harvests into your basket. Use collected fruit to buy upgrades that boost your click power and automate the process, and earn decorative badges as milestones are reached.

## How to Play

1. **Pick a fruit**: choose which fruit you'd like to grow from the fruit picker (strawberry, guava, raspberry, cherry, or grapefruit).
2. **Click the seed**: every **20 seed clicks** grows one fruit on the tree.
3. **Harvest**: once the tree holds **5 fruits**, it automatically harvests into your basket.
4. **Buy upgrades**: spend basket fruit on upgrades to boost your click value or automate the process. Prices increase 1.5x with each purchase.
5. **Earn badges**: unlock reward badges at 10, 25, 50, 100, and 200 lifetime fruits collected.

## Features

- Manual and auto-click system: click to plant seeds, or automate it with the Autoclicker and Farmers upgrades.
- 5 upgrade types:

  | Upgrade | Effect |
  |---|---|
  | Autoclicker | Automatically clicks seeds for you (faster with more levels) |
  | Farmers | Adds +2 extra auto-clicks per tick (unlocks at 10 lifetime fruits) |
  | Water | +0.2 Click Value per purchase |
  | Gloves | +1 Click Value per purchase |
  | Clover | +3 Click Value per purchase |

- Live scoreboard: tracks fruits collected, click value, upgrades owned, auto-click timing, and progress toward the next fruit.
- 5 collectible badges: Flower, Bow, Crown, Hearts, and Trophy, unlocked at fruit milestones with a toast notification.
- In-game help panel with instructions.
- Custom pink "glass" UI styling with a garden background.

## Project Structure

```
girl-garden/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # Game styling (glass UI, layout, badges, HUD)
├── js/
│   └── game.js          # Game logic (state, clicks, upgrades, badges, rendering)
└── images/              # Game art assets (see below)
```

## Image Assets Required

The game expects the following images inside an `images/` folder:

- `garden.png`: background
- `seed.png`: seed click button
- `basket.png`: basket icon
- `farmer_upgrade.png`: farmer sprite / farmers upgrade icon
- `click_upgrade.png`: autoclicker upgrade icon
- `water_upgrade.png`: water upgrade icon
- `glove_upgrade.png`: gloves upgrade icon
- `clove_upgrade.png`: clover upgrade icon
- `strawberry.png`, `guava.png`, `raspberry.png`, `cherry.png`, `grapefruit.png`: pickable fruits
- `flower.png`, `bow.png`, `crown.png`, `hearts.png`, `trophy.png`: badge icons

## Running the Game

No build tools or dependencies required.

1. Make sure your folder structure matches the layout above (`css/style.css`, `js/game.js`, `images/*`).
2. Open `index.html` in a web browser.
3. Start clicking.

## Built With

- HTML5
- CSS3 (glassmorphism-style UI)
- Vanilla JavaScript (no frameworks or libraries)
