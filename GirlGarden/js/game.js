/**
* Names: Inshaal Siddiqui & Sophia Ansari
* Course: COMPSCI 1XD3
* Date Started: February 6, 2026
* File: game.js
* Description:
* JavaScript logic for the Girl Garden incremental game.
* Manages game state (model), upgrades, auto-click system,
* fruit growth mechanics, rewards system, and DOM updates (view).
*/
window.addEventListener("load", function () {




// ---------------- STATE ----------------
let seedsPlanted = 0;          
let fruitsOnTree = 0;
const clicksForOneFruit = 20;
const maxFruitsPerTree = 5;




let totalFruitsCollected = 0;   
let lifetimeFruitsCollected = 0;




let clickValue = 1;          




let autoClickInterval = null;
let selectedFruit = "strawberry.png";




let fruitsEarnedFromSeeds = 0;




let autoIntervalMs = null;
let clicksPerTickCurrent = 0;
let lastAutoTickTime = null;




// ---------------- UPGRADES ----------------
const upgrades = {
  autoclicker: { level: 0, price: 5 },
  farmers:     { level: 0, price: 10 },
  water:       { level: 0, price: 15 },
  gloves:      { level: 0, price: 20 },
  clover:      { level: 0, price: 50 }
};




// ---------------- BADGES ----------------
const rewards = [
  { key: "flower", threshold: 10,  msg: "Flower badge! 10 fruits collected 🌸" },
  { key: "bow",    threshold: 25,  msg: "Bow badge! 25 fruits collected 🎀" },
  { key: "crown",  threshold: 50,  msg: "Crown badge! 50 fruits collected 👑" },
  { key: "hearts", threshold: 100, msg: "Hearts badge! 100 fruits collected 💖" },
  { key: "trophy", threshold: 200, msg: "Trophy badge! 200 fruits collected 🏆" }
];




const badges = {
  flower: false,
  bow: false,
  crown: false,
  hearts: false,
  trophy: false
};




// ---------------- ELEMENTS ----------------
const seedButton = document.getElementById("seedButton");
const seedCountDisplay = document.getElementById("seedCount");
const basketCountDisplay = document.getElementById("basketCount");
const treeImagesDiv = document.getElementById("fruitsOnTree");
const farmerSprite = document.getElementById("farmerSprite");




const fruitButtons = document.querySelectorAll(".fruitPick");




const tooltip = document.getElementById("tooltip");
const toast = document.getElementById("toast");




const scoreFruits = document.getElementById("scoreFruits");
const scoreClickValue = document.getElementById("scoreClickValue");
const scoreUpgrades = document.getElementById("scoreUpgrades");
const scoreAutoClick = document.getElementById("scoreAutoClick");
const progressBar = document.getElementById("progressBar");




const helpButton = document.getElementById("helpButton");
const helpPanel = document.getElementById("helpPanel");




const badgeElements = {
  flower: document.getElementById("flowerBadge"),
  bow: document.getElementById("bowBadge"),
  crown: document.getElementById("crownBadge"),
  hearts: document.getElementById("heartsBadge"),
  trophy: document.getElementById("trophyBadge")
};




const upgradeButtons = {
  autoclicker: document.getElementById("buyAutoclicker"),
  farmers: document.getElementById("buyFarmers"),
  water: document.getElementById("buyWater"),
  gloves: document.getElementById("buyGloves"),
  clover: document.getElementById("buyCharm")
};




const upgradePriceEls = {
  autoclicker: document.getElementById("price-autoclicker"),
  farmers: document.getElementById("price-farmers"),
  water: document.getElementById("price-water"),
  gloves: document.getElementById("price-gloves"),
  clover: document.getElementById("price-clover")
};




// ---------------- HELP ----------------
helpButton.addEventListener("click", () => {
  helpPanel.classList.toggle("hidden");
});


/**
* Displays a temporary toast notification message.
* The message automatically disappears after a short delay.
*/
function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2500);
}




// ---------------- FRUIT PICKER ----------------
fruitButtons.forEach(button => {
  button.addEventListener("click", function () {
    selectedFruit = button.dataset.fruit;
    fruitButtons.forEach(b => b.classList.remove("selected"));
    button.classList.add("selected");
  });
});




// ---------------- CLICK LOGIC ----------------
seedButton.addEventListener("click", function () {
  doClick();
});


/**
* Performs one manual click action.
* Increases seeds planted, converts seeds into fruits when
* progress reaches 100%, checks for harvest, updates rewards,
* and re-renders the interface.
*/
function doClick() {
  seedsPlanted += clickValue;




  seedCountDisplay.textContent = Math.floor(seedsPlanted);




  spawnFruitsFromSeedProgress();




  if (fruitsOnTree >= maxFruitsPerTree) harvestTree();




  updateBadges();
  render();
}


/**
* Converts accumulated seed progress into fruits.
* When seed progress reaches or exceeds 100%, fruits are added
* to the tree and excess progress is preserved.
*/
function spawnFruitsFromSeedProgress() {
  const shouldHaveEarned = Math.floor(seedsPlanted / clicksForOneFruit);
  let fruitsToSpawn = shouldHaveEarned - fruitsEarnedFromSeeds;




  while (fruitsToSpawn > 0 && fruitsOnTree < maxFruitsPerTree) {
    growFruit();
    fruitsEarnedFromSeeds++;
    fruitsToSpawn--;
  }




  if (fruitsToSpawn > 0 && fruitsOnTree >= maxFruitsPerTree) {
  }
}




// ---------------- FRUIT FUNCTIONS ----------------
/**
* Increases the number of fruits currently growing on the tree.
*/
function growFruit() {
  if (fruitsOnTree >= maxFruitsPerTree) return;




  fruitsOnTree++;
  const fruitImg = document.createElement("img");
  fruitImg.src = "images/" + selectedFruit;
  fruitImg.classList.add("fruit");




  const x = randomBetween(15, 35);
  const y = randomBetween(15, 48);




  fruitImg.style.left = x + "%";
  fruitImg.style.top = y + "%";




  treeImagesDiv.appendChild(fruitImg);
}


/**
* Harvests all fruits currently on the tree.
* Adds harvested fruits to total and lifetime counters,
* then resets the tree fruit count to zero.
*/
function harvestTree() {
  totalFruitsCollected += fruitsOnTree;
  lifetimeFruitsCollected += fruitsOnTree;




  fruitsOnTree = 0;




  basketCountDisplay.textContent = Math.floor(totalFruitsCollected);
  treeImagesDiv.innerHTML = "";




  basketCountDisplay.style.transform = "scale(1.2)";
  setTimeout(() => { basketCountDisplay.style.transform = "scale(1)"; }, 150);




  spawnFruitsFromSeedProgress();
}




// ---------------- UPGRADES: TOOLTIP + BUY ----------------
Object.keys(upgradeButtons).forEach(key => {
  const btn = upgradeButtons[key];




  btn.addEventListener("mouseenter", () => {
    tooltip.style.display = "block";




    let desc = "";
    if (key === "autoclicker") {
      desc = "Auto-clicks seeds for you (faster with more levels).";
    } else if (key === "farmers") {
      desc = "Adds extra auto-clicks per tick (+2 per farmer level).";
    } else if (key === "water") {
      desc = "Increases Click Value by +0.2 per purchase.";
    } else if (key === "gloves") {
      desc = "Increases Click Value by +1 per purchase.";
    } else if (key === "clover") {
      desc = "Increases Click Value by +3 per purchase.";
    }




    tooltip.textContent = `${desc} Cost: ${upgrades[key].price} fruits`;
  });




  btn.addEventListener("mousemove", (e) => {
    tooltip.style.left = e.pageX + 15 + "px";
    tooltip.style.top = e.pageY + 15 + "px";
  });




  btn.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });




  btn.addEventListener("click", () => buyUpgrade(key));
});


/**
* Attempts to purchase a specified upgrade.
* Deducts fruits if affordable, increases upgrade level,
* adjusts price scaling, and updates game mechanics.
*/
function buyUpgrade(upgradeKey) {
  if (totalFruitsCollected < upgrades[upgradeKey].price) return;


  totalFruitsCollected -= upgrades[upgradeKey].price;
  basketCountDisplay.textContent = Math.floor(totalFruitsCollected);


  upgrades[upgradeKey].level++;


  switch (upgradeKey) {
    case "autoclicker":
      startOrSpeedAutoClicker();
      break;


    case "farmers":
      if (farmerSprite) farmerSprite.classList.remove("hidden");
      startOrSpeedAutoClicker();
      break;


    case "water":
      clickValue += 0.2;
      break;


    case "gloves":
      clickValue += 1;
      break;


    case "clover":
      clickValue += 3;
      break;
  }


  upgrades[upgradeKey].price = Math.ceil(upgrades[upgradeKey].price * 1.5);


  updateBadges();
  render();
}


/**
* Starts the auto-click system if not active,
* or increases its speed if already running.
* Ensures only one interval timer is active at a time.
*/
function startOrSpeedAutoClicker() {
  if (upgrades.autoclicker.level <= 0 && upgrades.farmers.level <= 0) {
    if (autoClickInterval) clearInterval(autoClickInterval);
    autoClickInterval = null;


    autoIntervalMs = null;
    clicksPerTickCurrent = 0;
    lastAutoTickTime = null;
    return;
  }


  if (autoClickInterval) clearInterval(autoClickInterval);


  const lvl = upgrades.autoclicker.level;
  autoIntervalMs = Math.max(500, 3000 - Math.max(0, (lvl - 1)) * 500);




  clicksPerTickCurrent = 1 + (upgrades.farmers.level * 2);


  lastAutoTickTime = Date.now();


  autoClickInterval = setInterval(() => {
    lastAutoTickTime = Date.now();
    for (let i = 0; i < clicksPerTickCurrent; i++) {
      doClick();
    }
  }, autoIntervalMs);
}


/**
* Recalculates click value and auto-click strength
* based on current upgrade levels.
*/
function updateUpgrades() {
 for (const key in upgrades) {
   const btn = upgradeButtons[key];


   let isUnlocked = true;


   if (key === "farmers") {
     isUnlocked = lifetimeFruitsCollected >= 10;
   }


   if (!isUnlocked) {
     btn.disabled = true;
     btn.classList.add("disabled");
   } else {
     const canAfford = totalFruitsCollected >= upgrades[key].price;


     btn.disabled = !canAfford;
     btn.classList.toggle("disabled", !canAfford);
   }


   if (upgradePriceEls[key]) {
     upgradePriceEls[key].textContent = upgrades[key].price;
   }
 }
}


// ---------------- BADGES ----------------
/**
* Checks if lifetime fruit milestones have been reached.
* Unlocks corresponding badge images and displays
* a temporary congratulatory toast message.
*/
function updateBadges() {
  rewards.forEach(r => {
    if (!badges[r.key] && lifetimeFruitsCollected >= r.threshold) {
      badges[r.key] = true;
      badgeElements[r.key].classList.remove("locked");
      showToast(r.msg);
    }
  });
}


// ---------------- SCOREBOARD ----------------
/**
* Updates all scoreboard-related DOM elements,
* including fruit count, click value, upgrades in play,
* auto-click status, and progress bar visualization.
*/
function updateScoreboard() {
  scoreFruits.textContent = Math.floor(lifetimeFruitsCollected);
  scoreClickValue.textContent = clickValue.toFixed(1);


  const upgradesInPlay =
    upgrades.autoclicker.level +
    upgrades.farmers.level +
    upgrades.water.level +
    upgrades.gloves.level +
    upgrades.clover.level;


  scoreUpgrades.textContent = upgradesInPlay;


  const progress = (seedsPlanted % clicksForOneFruit) / clicksForOneFruit;
  progressBar.style.width = (progress * 100) + "%";


  if (!autoClickInterval || !autoIntervalMs) {
    scoreAutoClick.textContent = "Off";
  } else {
    const now = Date.now();
    const elapsed = lastAutoTickTime ? (now - lastAutoTickTime) : 0;
    const remainingMs = Math.max(0, autoIntervalMs - elapsed);
    const remainingS = (remainingMs / 1000).toFixed(1);


    scoreAutoClick.textContent =
      `every ${(autoIntervalMs / 1000).toFixed(1)}s | next in ${remainingS}s`;
  }
}
/**
* Renders the current game state to the screen.
* Updates visual elements to match the internal model.
*/
function render() {
  updateUpgrades();
  updateScoreboard();
}


/**
* Generates a random number between a minimum and maximum value.
*/
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}


setInterval(() => {
  updateScoreboard();
}, 100);


render();
updateBadges();
});







