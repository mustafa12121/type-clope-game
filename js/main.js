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

async function getwords() {
  try {
    let jsonObj = await fetch("../../articals.json");
    let articalsObjArray = await jsonObj.json();
    return articalsObjArray[level];
  } catch {
    throw new Error("the articals fill not found");
  }
}

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

//showing and hiding the keyboard
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
//adding the keyboard keys

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
//watshing the artical letters and changing backgrounds
function startlisnningArtical() {
  let noClick = [
    "Meta",
    "Tab",
    "Shift",
    "Alt",
    "F12",
    "Control",
    "Delete",
    "CapsLock",
  ];
  onkeydown = (ev) => {
    if (!noClick.includes(ev.key)) {
      if (ev.key == "Backspace") {
        //previent running out of the array
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
        //game ending
        if (corentletter === articalLetters.length - 1) {
          endGame();
        } else corentletter++;
      } else {
        articalLetters[corentletter].classList.add("wrong");
        //game ending
        if (corentletter === articalLetters.length - 1) {
          endGame();
        } else corentletter++;
      }
    }
  };
}
let notShift = true;

function startlisnningKeybord() {
  let keys = Array.from(keybord.children);
  shickKeys(keys);

  document.addEventListener("keyup", () => {
    notShift = true;
    shickKeys(keys);
    if (notShift) {
      removeShift();
    }
  });
}

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
    }
  });
}

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

function removeShift() {
  document.querySelectorAll("[data-key='Shift']").forEach((ele) => {
    blinck(ele);
    ele.classList.remove("courent");
  });
}

function startContingSpeed() {
  time = setInterval(() => {
    seconds += 0.1;
  }, 100);
}

function endGame() {
  clearInterval(time);
  let wpm = Math.floor(
    (60 / seconds) * wordsContainer.textContent.split(" ").length
  );
  let wrong = articalLetters.filter((ele) => {
    return ele.classList.contains("wrong");
  }).length;
  let percent = 100;
  //conting the speed percent
  if (wpm >= requardSpeed) {
  } else if (wpm >= (requardSpeed / 5) * 4) {
    percent -= 10;
  } else if (wpm >= (requardSpeed / 5) * 3) {
    percent -= 20;
  } else if (wpm >= (requardSpeed / 5) * 2) {
    percent -= 30;
  } else if (wpm >= requardSpeed / 5) {
    percent -= 40;
  }
  //conting the wrongs percent
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
  //conting the stars from the percent

  if (levelObj.percent <= percent) {
    if (levelObj.stars < Math.trunc(percent / 20)) {
      levelObj.stars = Math.trunc(percent / 20);
    }
    levelObj.percent = percent;
    if (percent > 60) {
      if (userObj.lastlevel < +levelObj.levelNumber + 1) {
        userObj.lastlevel = +levelObj.levelNumber + 1;
      }
    }
    if (levelObj.heighestSpeed < wpm) {
      levelObj.heighestSpeed = wpm;
    }
    if (levelFond) {
      if (levelObj.wrongLetters > wrong) {
        levelObj.wrongLetters = wrong;
      }
    } else {
      levelObj.wrongLetters = wrong;
    }
  }

  localStorage.setItem("corentPlayer", JSON.stringify(userObj));
  localStorage.setItem("gameInfo", JSON.stringify(gameInfo));
  localStorage.setItem("destenation", "levels");
  location.href = "./loading.html";
}
