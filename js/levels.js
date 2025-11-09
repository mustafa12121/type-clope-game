import { druCanvas } from "./modules/functions.js";
/**
 * Levels Page Main Logic
 *
 * This file manages:
 * - Level cards rendering and updating
 * - User authentication and account management
 * - Progress visualization (canvas)
 * - UI event handling for sign out, delete, and info
 */

/**
 * DOM and game state variables
 *
 * - cardsContianer: Container for level cards
 * - level, speed, title: Current level info
 * - gameInfo: Array of all users and their progress
 * - cards: Array of card elements
 * - userObj: Current user object
 * - levelsObjs: Array of level objects for the user
 * - playerList: List of all players
 * - pass: Password input field
 * - password: Current password value
 * - showPass: Eye icon for password visibility
 * - subPass: Submit button for password
 */
let cardsContianer = document.querySelector(".cards"),
  level,
  isAdmin,
  gameInfo,
  cards,
  userObj,
  levelsObjs,
  playerList = JSON.parse(localStorage.getItem("playerList")),
  pass = document.getElementById("pass"),
  password = "",
  showPass = document.getElementById("eye"),
  subPass = document.querySelector(".leyout div input[type='submit']"),
  lang = localStorage.getItem("lang"),
  selectLang = document.querySelector("#lang");

let articalsPath;
if (lang === "english") {
  document.body.dir = "ltr";
  document.querySelector(".delet").style = "left:unset;right:50px;";
  selectLang.value = "english";
  articalsPath = "./articals/articals_en.json";
} else if (lang === "arabic") {
  document.body.dir = "rtl";
  document.querySelector(".delet").style = "left:50px;right:unset;";
  selectLang.value = "arabic";

  articalsPath = "./articals/articals_ar.json";
}

/**
 * Redirects to sign-in page if no current user is found, otherwise loads user object.
 */
if (!localStorage.getItem("corentPlayer")) {
  window.location.href = "/bags/sign.html";
} else {
  userObj = JSON.parse(localStorage.getItem("corentPlayer"));
  if (userObj.userName.toLocaleLowerCase() == "admin") isAdmin = true;
}

/**
 * Loads gameInfo from localStorage or initializes as empty array.
 */
if (localStorage.getItem("gameInfo")) {
  gameInfo = JSON.parse(localStorage.getItem("gameInfo"));
} else {
  gameInfo = [];
}

/**
 * Shows sign-out modal when sign-out button is clicked.
 */
document.querySelector(".sgin-out").addEventListener("click", () => {
  document.querySelector(".leyout").style.display = "flex";
});

/**
 * functionalty of the language button
 */
document.querySelector("#lang").addEventListener("change", () => {
  localStorage.setItem("lang", document.querySelector("#lang").value);
  location.reload();
});
/**
 * Fetches all levels from articals.json.
 * @returns {Promise<Array>} Array of level objects
 */
async function getlevels() {
  try {
    let alllevels = await fetch(articalsPath);
    return await alllevels.json();
  } catch {
    throw new Error("levels fill not found");
  }
}

// Load levels and initialize UI
getlevels().then((levelsList) => {
  levelsList.forEach((level) => {
    createLevelCard(level.title, level.ronde, level.requardSpeed);
  });

  document.querySelector("#name").textContent = userObj.userName;
  cards = Array.from(cardsContianer.children);
  updateInfo();
  startlesitning();
});

/**
 * Sign-out section logic
 *
 * - Handles password input, visibility toggle, and sign-out action.
 */
showPass.addEventListener("click", () => {
  changInput(showPass, pass);
});

document.forms[0].onsubmit = () => {
  return false;
};

pass.addEventListener("input", () => {
  password = pass.value;
  pass.style = "";
});

document.addEventListener("click", (e) => {
  if (e.target == document.querySelectorAll(".leyout")[0]) {
    document.querySelector(".leyout").style.display = "none";
  } else if (e.target == document.querySelectorAll(".leyout")[1]) {
    document.querySelectorAll(".leyout")[1].style.display = "none";
  }
});

subPass.onclick = () => {
  let player = JSON.parse(localStorage.getItem("corentPlayer"));
  if (password == player.password) {
    signOut();
  } else {
    pass.style.borderBottom = "1px solid red";
  }
};

/**
 * Account deletion section logic
 *
 * - Handles password input, visibility toggle, and delete action.
 */
document.querySelector(".delet").addEventListener("click", () => {
  document.querySelectorAll(".leyout")[1].style.display = "flex";
});

let secondIcon = document.querySelector("#eye2");
let secondInput = document.querySelector("#pass2");
let deletingBotton = document.querySelectorAll(
  ".leyout div input[type='submit']"
)[1];

secondInput.addEventListener("input", () => {
  password = secondInput.value;
  secondInput.style = "";
});
secondIcon.onclick = () => {
  changInput(secondIcon, secondInput);
};

document.forms[1].onsubmit = () => {
  return false;
};

deletingBotton.addEventListener("click", () => {
  let player = JSON.parse(localStorage.getItem("corentPlayer"));
  if (password == player.password) {
    console.log(player);
    deletAccount(player);
  } else {
    secondInput.style.borderBottom = "1px solid red";
  }
});

/**
 * Adds and initializes the progress canvas for speed and accuracy.
 */
let can = document.querySelectorAll("canvas");
druCanvas(0, can[0], 0);
druCanvas(0, can[1], 0);

// Functionality section
/**
 * Creates a level card and appends it to the cards container.
 *
 * @param {string} title - Level title
 * @param {number} ronde - Level number
 * @param {number} requardSpeed - Required WPM for the level
 */
function createLevelCard(title, ronde, requardSpeed) {
  let card = document.createElement("div");
  card.className = "card";
  let div = document.createElement("div");
  div.className = "level";
  let titleDiv = document.createElement("div");
  titleDiv.appendChild(document.createTextNode(title));
  div.appendChild(titleDiv);
  card.appendChild(div);
  let info = document.createElement("div");
  let infoInnerDiv = document.createElement("div");
  info.className = "info";
  //creating level info span
  let lvSpan = document.createElement("span");
  lvSpan.appendChild(document.createTextNode("lv"));
  let lvNumber = document.createElement("span");
  lvNumber.appendChild(document.createTextNode(ronde));
  lvSpan.appendChild(lvNumber);
  infoInnerDiv.appendChild(lvSpan);
  let last;
  if (lang === "arabic") last = userObj.lastlevel[1];
  else last = userObj.lastlevel[0];
  if (isAdmin) {
    card.classList.add("open");
  } else if (ronde > last) {
    card.classList.add("not-open");
  } else {
    card.classList.add("open");
    level = ronde;
  }

  let speedSpan = document.createElement("span");
  let speedNumber = document.createElement("span");
  speedNumber.appendChild(document.createTextNode(requardSpeed));
  speedSpan.appendChild(speedNumber);
  speedSpan.appendChild(document.createTextNode("WPM"));
  infoInnerDiv.appendChild(speedSpan);
  info.appendChild(infoInnerDiv);
  card.appendChild(info);
  //creating level stars icon
  let stars = document.createElement("div");
  for (let i = 0; i < 5; i++) {
    let star = document.createElement("i");
    star.classList.add("fa-regular");
    star.classList.add("fa-star");
    stars.appendChild(star);
  }
  stars.className = "stars";
  card.appendChild(stars);
  card.id = `lv${ronde}`;
  cardsContianer.appendChild(card);
}

/**
 * Updates the user's level info and cards display.
 *
 * - Finds the user's levels in gameInfo.
 * - Updates the cards and localStorage.
 */
function updateInfo() {
  let levelsInfoArray,
    oldUser = false;
  for (let i in gameInfo) {
    if (gameInfo[i].userName == userObj.userName) {
      try {
        if (lang === "arabic") levelsInfoArray = gameInfo[i].levels[1];
        else levelsInfoArray = gameInfo[i].levels[0];
      } catch {
        console.log("levels load faild");
      }

      oldUser = true;
    }
  }
  if (oldUser) {
    updateCards(levelsInfoArray);
  } else {
    gameInfo.push({
      userName: userObj.userName,
      levels: [[], []],
    });
  }
  updateLocal();
}

/**
 * Updates localStorage with the latest gameInfo and playerList.
 */
function updateLocal() {
  let gameInfoToLocal = JSON.stringify(gameInfo);
  localStorage.setItem("gameInfo", gameInfoToLocal);
  for (let i in playerList) {
    if (playerList[i].userName == userObj.userName) {
      playerList[i] = userObj;
    }
  }
  localStorage.setItem("playerList", JSON.stringify(playerList));
}

/**
 * Updates the stars display for each level card based on user progress.
 *
 * @param {Array} levelsObjsArray - Array of level objects for the user
 */
function updateCards(levelsObjsArray) {
  console.log(levelsObjsArray);
  for (let i = 0; i < levelsObjsArray.length; i++) {
    let level = levelsObjsArray[i];
    levelsObjs = levelsObjsArray;
    let cardStarDiv = document.querySelector(`#lv${level.levelNumber} .stars`);
    let stars = Array.from(cardStarDiv.children);
    let j = 0;
    let starInterval = setInterval(() => {
      stars[j].classList.add("fa-solid");
      stars[j].classList.remove("fa-regular");
      j++;
      if (j >= level.stars) {
        clearInterval(starInterval);
      }
    }, 100);
  }
}
/**
 * Adds event listeners to level cards for selection and navigation.
 *
 * - Double-click navigates to typing game for the level.
 * - Single-click shows level info.
 */
function startlesitning() {
  cards.forEach((card) => {
    let noumber = card.id.match(/\d+/g).join("");
    card.addEventListener("dblclick", () => {
      localStorage.setItem("courentLevel", +noumber);
      console.log(+noumber);
      localStorage.setItem("destenation", "type");
      location.href = "/bags/loading.html";
    });
    card.addEventListener("click", () => {
      showInfo(card);
    });
  });
}

/**
 * Toggles password input visibility.
 *
 * @param {HTMLElement} icon - Eye icon element
 * @param {HTMLInputElement} input - Password input element
 */
function changInput(icon, input) {
  if (icon.classList.contains("fa-eye")) {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.add("fa-eye");
    icon.classList.remove("fa-eye-slash");
  }
}

/**
 * Signs out the user and redirects to sign-in page.
 */
function signOut() {
  updateLocal();
  location.href = "/bags/sign.html";
}

/**
 * Deletes the user account and reloads the page.
 *
 * @param {Object} player - User object to delete
 */
function deletAccount(player) {
  playerList = deletPlayerInfo(player, playerList);
  gameInfo = deletPlayerInfo(player, gameInfo);
  localStorage.removeItem("corentPlayer");
  updateLocal();
  location.reload();
}

/**
 * Removes a user from a list by username.
 *
 * @param {Object} player - User object to remove
 * @param {Array} from - Array to remove user from
 * @returns {Array} Filtered array
 */
function deletPlayerInfo(player, from) {
  return from.filter((obj) => {
    return obj.userName !== player.userName;
  });
}
/**
 * Shows the selected level's information and updates the UI.
 *
 * @param {HTMLElement} card - Level card element
 */
//shoing the selected level information
function showInfo(card) {
  let starsList = document.querySelectorAll("#starsGain i"),
    selectedLevel,
    found = false,
    num = card.id.match(/\d+/g).join(""),
    canvass = document.querySelectorAll("canvas");

  for (let i in levelsObjs) {
    if (levelsObjs[i].levelNumber == num) {
      selectedLevel = levelsObjs[i];
      found = true;
    }
  }
  if (found) {
    //adding full stars
    let j = 0;
    starsList.forEach((star) => {
      star.classList.remove("fa-solid");
      star.classList.add("fa-regular");
    });
    let starsInterval = setInterval(() => {
      if (j < selectedLevel.stars) {
        starsList[j].classList.add("fa-solid");
        starsList[j].classList.remove("fa-regular");
      } else {
        starsList[j].classList.remove("fa-solid");
        starsList[j].classList.add("fa-regular");
      }
      j++;
      if (j >= 5) {
        clearInterval(starsInterval);
      }
    }, 100);
  } else {
    for (let j = 0; j < starsList.length; j++) {
      starsList[j].classList.remove("fa-solid");
      starsList[j].classList.add("fa-regular");
    }
  }
  //buting the bersints
  let speedSpan = document.querySelectorAll(".bers span")[0];
  let foltSpan = document.querySelectorAll(".bers span")[1];
  if (selectedLevel) {
    druCanvas(
      selectedLevel.percent,
      canvass[0],
      selectedLevel.heighestSpeed,
      speedSpan
    );
    druCanvas(
      selectedLevel.accuracy,
      canvass[1],
      selectedLevel.wrongLetters,
      foltSpan
    );
  } else {
    druCanvas(0, canvass[0], 0, speedSpan);
    druCanvas(0, canvass[1], 0, foltSpan);
  }
  //unselecting the cards
  Array.from(cardsContianer.children).forEach((ele) => {
    ele.classList.remove("selected");
  });
  card.classList.add("selected");
}

/**
 * Draws a circular progress bar on a canvas for speed or accuracy.
 *
 * @param {number} bers - Percent to fill (0-100)
 * @param {HTMLCanvasElement} canvas - Canvas element to draw on
 * @param {number} conter - Counter value to display
 * @param {HTMLElement} [span] - Optional span to update with counter
 */
