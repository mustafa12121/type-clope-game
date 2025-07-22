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
/**
 * Adds the keyboard keys to the on-screen keyboard.
 *
 * - Creates key elements for each character.
 * - Adds special keys (Tab, Backspace, CapsLock, Shift, Enter, Space).
 */
let keybord = document.querySelector("#keybord");
let keys = Array.from("`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./");
for (let i = 0; i < keys.length; i++) {
  let span = document.createElement("span");
  span.appendChild(document.createTextNode(keys[i]));
  span.setAttribute("data-key", keys[i]);
  span.classList.add("key-shadow-out");
  if (keys[i] == "f" || keys[i] == "j") {
    let innerSpan = document.createElement("span");
    innerSpan.className = "home-row";
    span.appendChild(innerSpan);
  }
  keybord.appendChild(span);
}

creatkey("tap", "Tap", "q");
creatkey("Back", "Backspace", "=", false);
creatkey("capslock", "CapsLock", "a");
creatkey("shift", "Shift", "z");
creatkey("shift", "Shift", "/", false);
creatkey("Enter", "Enter", "'", false);
let space = document.createElement("div");
space.append("space");
space.setAttribute("data-key", " ");
space.classList.add("key-shadow-out");
keybord.appendChild(space);

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
  let noClick = [
    "Meta ",
    "Tab",
    "Shift",
    "Alt",
    "F12",
    "Control",
    "Delete",
    "CapsLock",
  ];
  onkeydown = (ev) => {
    // Prevent browser search bar on "/" key
    if (ev.key === "/") {
      ev.preventDefault();
    }
    if (!noClick.includes(ev.key)) {
      if (ev.key == "Backspace") {
        // Prevent running out of the array
        if (corentletter - 1 < 0) corentletter = 0;
        else corentletter--;
        if (articalLetters[corentletter].classList.contains("right")) {
          articalLetters[corentletter].classList.remove("right");
        } else {
          articalLetters[corentletter].classList.remove("wrong");
          articalLetters[corentletter].classList.remove("fixed");
          articalLetters[corentletter].classList.add("deleted");
        }
      } else if (ev.key == articalLetters[corentletter].dataset.key) {
        if (articalLetters[corentletter].classList.contains("deleted")) {
          articalLetters[corentletter].classList.add("fixed");
        } else {
          articalLetters[corentletter].classList.add("right");
        }
        // Game ending
        if (corentletter === articalLetters.length - 1) {
          endGame();
        } else corentletter++;
      } else {
        articalLetters[corentletter].classList.add("wrong");
        // Game ending
        if (corentletter === articalLetters.length - 1) {
          endGame();
        } else corentletter++;
      }
    }
  };
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
  let keys = Array.from(keybord.children);
  shickKeys(keys);

  document.addEventListener("keyup", (e) => {
    notShift = true;
    shickKeys(keys);
    if (notShift) {
      removeShift();
    }
  });
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
  let wpm = Math.floor(
    (seconds / 60) * (wordsContainer.textContent.length / 5)
  );

  // Count wrong letters
  let wrong = articalLetters.filter((ele) => {
    return ele.classList.contains("wrong");
  }).length;

  // Start with 100% performance
  let percent = 100;

  // Deduct percent based on speed
  if (wpm >= requardSpeed) {
    // Full percent if required speed is met
  } else if (wpm >= (requardSpeed / 5) * 4) {
    percent -= 10;
  } else if (wpm >= (requardSpeed / 5) * 3) {
    percent -= 20;
  } else if (wpm >= (requardSpeed / 5) * 2) {
    percent -= 30;
  } else if (wpm >= requardSpeed / 5) {
    percent -= 40;
  }

  // Deduct percent based on number of wrong letters
  if (wrong >= articalLetters.length) {
    percent -= 50;
  } else if (wrong >= Math.round(articalLetters.length / 5) * 4) {
    percent -= 40;
  } else if (wrong >= Math.round(articalLetters.length / 5) * 3) {
    percent -= 30;
  } else if (wrong >= Math.round(articalLetters.length / 5) * 2) {
    percent -= 20;
  } else if (wrong >= Math.round(articalLetters.length / 5)) {
    percent -= 10;
  }

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
