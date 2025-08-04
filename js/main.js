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
// Import modules
import { createKeyboard, listenKeyboard } from "./modules/keyboard.js";
import { renderArticle, listenTyping } from "./modules/typing.js";
let wordsContainer = document.querySelector(".words"),
  articalLetters,
  corentletter = 0,
  level = localStorage.getItem("courentLevel"),
  requardSpeed,
  seconds = 0,
  time,
  userObj = JSON.parse(localStorage.getItem("corentPlayer")),
  levelObj,
  gameInfo = JSON.parse(localStorage.getItem("gameInfo"));
let levelFond = false,
  iIndex;

/**
 * Find or create the current level object for the user.
 *
 * - Searches gameInfo for the current user and level.
 * - If not found, creates a new level object and adds it to the user.
 */
for (let i = 0; i < gameInfo.length; i++) {
  if (gameInfo[i].userName == userObj.userName) {
    for (let j = 0; j < gameInfo[i].levels.length; j++) {
      if (gameInfo[i].levels[j].levelNumber == +level + 1) {
        levelObj = gameInfo[i].levels[j];
        levelFond = true;
      }
    }
    iIndex = i;
  }
}
// If the level was not found, create a new one for the user
if (!levelFond) {
  levelObj = {
    levelNumber: +level + 1,
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
let keybord = createKeyboard(document.body); // You can change container as needed

// Render article letters
function includeArtical(artical) {
  // Clear previous content
  wordsContainer.innerHTML = "";
  articalLetters = renderArticle(wordsContainer, artical.articalText);
}

/**
 * Creates and inserts a special key into the keyboard.
 *
 * @param {string} innerValue - Display value for the key
 * @param {string} dataValue - Data-key attribute value
 * @param {string} targetDataValue - Key to insert before/after
 * @param {boolean} befor - If true, insert before; else, after
 */
function creatkey(innerValue, dataValue, targetDataValue, befor = true) {
  let key = document.createElement("span");
  key.append(innerValue);
  key.setAttribute("data-key", dataValue);
  key.classList.add("key-shadow-out");

  if (befor) {
    document.querySelector(`[data-key="${targetDataValue}"]`).before(key);
  } else {
    document.querySelector(`[data-key="${targetDataValue}"]`).after(key);
  }
}

/**
 * Renders the article text as individual letter spans in the words container.
 *
 * @param {Object} artical - The article object containing articalText
 */
function includeArtical(artical) {
  let letters = Array.from(artical.articalText);
  for (let i = 0; i < letters.length; i++) {
    let span = document.createElement("span");
    span.appendChild(document.createTextNode(letters[i]));
    span.setAttribute("data-key", letters[i]);
    if (letters[i] == " ") {
      span.classList.add("space");
    }
    wordsContainer.appendChild(span);
  }
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
let notShift = true;

/**
 * Listens for keyboard events and updates the on-screen keyboard UI.
 *
 * - Highlights the current key.
 * - Handles Shift key logic.
 */

function startlisnningKeybord() {
  listenKeyboard(keybord, articalLetters, () => corentletter);
}

/**
 * Animates a key to visually indicate a key press.
 *
 * @param {HTMLElement} ele - The key element to animate
 */
function blinck(ele) {
  if (ele.classList.contains("courent")) {
    ele.classList.remove("key-shadow-out");
    ele.classList.add("key-shadow-in");
    setTimeout(() => {
      ele.classList.add("key-shadow-out");
      ele.classList.remove("key-shadow-in");
    }, 50);
  }
}

/**
 * Highlights the current key and handles Shift key logic for the on-screen keyboard.
 *
 * @param {HTMLElement[]} keys - Array of key elements
 */
function shickKeys(keys) {
  keys.forEach((ele) => {
    if (ele.dataset.key == articalLetters[corentletter].dataset.key) {
      ele.classList.add("courent");
    } else if (
      ele.dataset.key !== "Shift" &&
      ele.dataset.key.toUpperCase() !== articalLetters[corentletter].dataset.key
    ) {
      blinck(ele);
      ele.classList.remove("courent");
    }
    if (
      ele.dataset.key.toUpperCase() ===
        articalLetters[corentletter].dataset.key &&
      ele.dataset.key.toUpperCase() !== ele.dataset.key
    ) {
      addShift(ele, keys);
      notShift = false;
    } else {
      // No shift needed
    }
  });
}

/**
 * Highlights the appropriate Shift key for uppercase or special characters.
 *
 * @param {HTMLElement} ele - The key element
 * @param {HTMLElement[]} keysArray - Array of key elements
 */
function addShift(ele, keysArray) {
  let rightShiftKeys = Array.from("qwertasdfgzxcvb~!@#$%");
  let shifts = keysArray.filter((val) => {
    return val.dataset.key == "Shift";
  });
  ele.classList.add("courent");
  if (rightShiftKeys.includes(`${ele.dataset.key}`)) {
    shifts[1].classList.add("courent");
  } else {
    shifts[0].classList.add("courent");
  }
}

/**
 * Removes highlight from all Shift keys.
 */
function removeShift() {
  document.querySelectorAll("[data-key='Shift']").forEach((ele) => {
    blinck(ele);
    ele.classList.remove("courent");
  });
}

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
