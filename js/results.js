import { druCanvas } from "./modules/functions.js";
let gameInfoRaw = localStorage.getItem("gameInfo"),
  levelRaw = localStorage.getItem("courentLevel"),
  lang = localStorage.getItem("lang"),
  playerRaw = localStorage.getItem("corentPlayer");

// Parse stored JSON safely
const gameInfo = gameInfoRaw ? JSON.parse(gameInfoRaw) : [];
const currentLevelNumber = Number(levelRaw) || 1;
const currentPlayer = playerRaw ? JSON.parse(playerRaw) : null;
let levelData = null;

// Find the right player in gameInfo and then the requested level
if (currentPlayer && Array.isArray(gameInfo)) {
  const userObj = gameInfo.find((u) => u.userName === currentPlayer.userName);
  if (userObj) {
    levelData =
      lang === "arabic"
        ? (userObj.levels[1] || []).find(
            (lvl) => lvl.levelNumber === currentLevelNumber
          ) || null
        : (userObj.levels[0] || []).find(
            (lvl) => lvl.levelNumber === currentLevelNumber
          ) || null;
  }
}

// levelData is now either the level object or null if not found

let canvas = document.querySelectorAll("canvas");
let speedSpan = document.querySelector(".speed span");
let wrongSpan = document.querySelector(".wrong span");
druCanvas(levelData.percent, canvas[0], levelData.heighestSpeed, speedSpan);
druCanvas(levelData.accuracy, canvas[1], levelData.wrongLetters, wrongSpan);
console.log(wrongSpan, levelData.wrongLetters);

//adding the next, reapet and go to main. buttons
let buttons = document.querySelectorAll("button");
buttons[0].onclick = () => {
  localStorage.setItem("destenation", "type");
  location.href = "/bags/loading.html";
};
buttons[1].onclick = () => {
  localStorage.setItem("courentLevel", +currentLevelNumber + 1);
  localStorage.setItem("destenation", "type");
  location.href = "/bags/loading.html";
};
buttons[2].onclick = () => {
  localStorage.setItem("destenation", "levels");
  location.href = "/bags/loading.html";
};
console.log("levelData:", levelData);
// --- IGNORE ---
