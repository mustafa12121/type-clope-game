/**
 * Typing Game Main Logic
 *
 * This file contains the main logic for the typing game, including:
 * - Level and user management
 * - Article loading and rendering
 * - Keyboard UI and event handling
 * - Game progress tracking and scoring
 */

/**
 * DOM and game state variables
 *
 * - wordsContainer: Container for article letters
 * - articalLetters: Array of letter elements for the current article
 * - corentletter: Index of the current letter being typed
 * - level: Current level number from localStorage
 * - requardSpeed: Required WPM for the current level
 * - seconds: Timer for tracking typing duration
 * - time: Interval timer reference
 * - userObj: Current user object from localStorage
 * - levelObj: Current level object for the user
 * - gameInfo: Array of all users and their progress
 * - levelFond: Flag indicating if the level was found for the user
 * - iIndex: Index of the current user in gameInfo
 */
import { createKeyboard, listenKeyboard } from "./modules/keyboard.js";
import { renderArticle, listenTyping } from "./modules/typing.js";
const wordsContainer = document.querySelector(".words");
let articalLetters = [];
let corentletter = 0;
const level = localStorage.getItem("courentLevel");
let requardSpeed = 0;
let seconds = 0;
let time;
let userObj = JSON.parse(localStorage.getItem("corentPlayer"));
let levelObj;
let gameInfo = JSON.parse(localStorage.getItem("gameInfo"));
let levelFond = false;
let iIndex;

/**
 * Find or create the current level object for the user.
 *
 * - Searches gameInfo for the current user and level.
 * - If not found, creates a new level object and adds it to the user.
 */
for (let i = 0; i < gameInfo.length; i++) {
  if (gameInfo[i].userName == userObj.userName) {
    for (let j = 0; j < gameInfo[i].levels.length; j++) {
      if (gameInfo[i].levels[j].levelNumber == +level) {
        levelObj = gameInfo[i].levels[j];
        levelFond = true;
      }
    }
    iIndex = i;
  }
}
if (!levelFond) {
  levelObj = {
    levelNumber: +level,
    stars: 0,
    percent: 0,
    heighestSpeed: 0,
    wrongLetters: 0,
  };
  gameInfo[iIndex].levels.push(levelObj);
}

/**
 * Fetches the article for the current level from articals.json.
 * @returns {Promise<Object>} The article object for the current level.
 */
async function getwords() {
  try {
    let jsonObj = await fetch("/articals.json");
    let articalsObjArray = await jsonObj.json();
    return articalsObjArray[level];
  } catch {
    throw new Error("the articals fill not found");
  }
}

// Load the article and initialize the game state for the current level
getwords().then((artical) => {
  includeArtical(artical);
  articalLetters = Array.from(wordsContainer.children);
  corentletter = 0;
  requardSpeed = artical.requardSpeed;
  document.querySelector(".title").innerHTML = artical.title;
  startlisnningArtical();
  startlisnningKeybord();
  startContingSpeed();
});

/**
 * Keyboard show/hide toggle logic
 *
 * - Toggles the visibility of the on-screen keyboard when the switch is clicked.
 */
let keyboradSuitch = document.querySelector("#keyOnOff");
keyboradSuitch.onclick = function () {
  if (this.classList.contains("icon-on")) {
    this.classList.remove("icon-on");
    this.classList.add("icon-off");
    keybord.style = "display:none";
  } else if (this.classList.contains("icon-off")) {
    this.classList.remove("icon-off");
    this.classList.add("icon-on");
    keybord.style = "display:flex";
  }
};

// Create and attach keyboard
const keybord = createKeyboard(document.body);

// Render article letters
function includeArtical(artical) {
  wordsContainer.innerHTML = "";
  articalLetters = renderArticle(wordsContainer, artical.articalText);
}
/**
 * Listens for keyboard events and updates the article letter states.
 *
 * - Handles typing, backspace, and wrong key logic.
 * - Prevents browser search bar on "/" key.
 * - Calls endGame() when the last letter is reached.
 */

function startlisnningArtical() {
  listenTyping(
    articalLetters,
    () => corentletter,
    (val) => (corentletter = val),
    endGame
  );
}

/**
 * Tracks whether the Shift key is currently active.
 */
function startlisnningKeybord() {
  listenKeyboard(keybord, articalLetters, () => corentletter);
}

// Removed unused/repeated keyboard helper functions (blinck, shickKeys, addShift, removeShift)

/**
 * Starts the timer for tracking typing speed.
 */
function startContingSpeed() {
  time = setInterval(() => {
    seconds += 0.1;
  }, 100);
}

/**
 * Ends the typing game, calculates performance, updates user progress, and redirects to the loading screen.
 *
 * - Stops the timer.
 * - Calculates Words Per Minute (WPM) using the standard formula: (characters / 5) / (minutes).
 * - Counts the number of wrong letters.
 * - Calculates the performance percent based on speed and accuracy.
 * - Updates stars, percent, highest speed, and wrong letters for the current level.
 * - Saves progress to localStorage and redirects to the next screen.
 */
function endGame() {
  // Stop the timer
  clearInterval(time);

  // Calculate WPM: (characters / 5) / (minutes)
  let wpm = Math.floor(wordsContainer.textContent.length / 5 / (seconds / 60));

  // Count wrong letters
  let wrong = articalLetters.filter((ele) => {
    return ele.classList.contains("wrong");
  }).length;

  // Weighted formula for percent: 60% accuracy, 40% speed
  let accuracy =
    ((articalLetters.length - wrong) / articalLetters.length) * 100;
  let speedScore = Math.min((wpm / requardSpeed) * 100, 100);
  let percent = Math.round(accuracy * 0.6 + speedScore * 0.4);

  // Bonus for perfect play will be used latter on
  // if (wrong === 0 && wpm >= requardSpeed) {
  //   percent += 5;
  // }

  // Cap percent between 0 and 100
  // percent = Math.max(0, Math.min(percent, 100));
  // will be used latter on for badge and rewared messages

  // Update level stats if performance improved
  if (levelObj.percent <= percent) {
    // Update stars based on percent (1 star per 20%)
    if (levelObj.stars < Math.trunc(percent / 20)) {
      levelObj.stars = Math.trunc(percent / 20);
    }
    levelObj.percent = percent;

    // Unlock next level if percent > 60
    if (percent > 60) {
      if (userObj.lastlevel < +levelObj.levelNumber + 1) {
        userObj.lastlevel = +levelObj.levelNumber + 1;
      }
    }

    // Update highest speed if new WPM is greater
    if (levelObj.heighestSpeed < wpm) {
      levelObj.heighestSpeed = wpm;
    }

    // Update wrong letters (lowest value)
    if (levelFond) {
      if (levelObj.wrongLetters > wrong) {
        levelObj.wrongLetters = wrong;
      }
    } else {
      levelObj.wrongLetters = wrong;
    }
  }

  // Save progress to localStorage
  localStorage.setItem("corentPlayer", JSON.stringify(userObj));
  localStorage.setItem("gameInfo", JSON.stringify(gameInfo));
  localStorage.setItem("destenation", "levels");

  // Redirect to loading screen
  location.href = "/bags/loading.html";
}
