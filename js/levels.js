let cardsContianer = document.querySelector(".cards"),
  level,
  speed,
  title,
  gameInfo,
  cards,
  userObj,
  levelsObjs;
(playerList = JSON.parse(localStorage.getItem("playerList"))),
  (pass = document.getElementById("pass")),
  (password = ""),
  (showPass = document.getElementById("eye"));
subPass = document.querySelector(".leyout div input[type='submit']");

if (!localStorage.getItem("corentPlayer")) {
  window.location.href = "./bags/html/sign.html";
} else {
  userObj = JSON.parse(localStorage.getItem("corentPlayer"));
}

if (localStorage.getItem("gameInfo")) {
  gameInfo = JSON.parse(localStorage.getItem("gameInfo"));
} else {
  gameInfo = [];
}

document.querySelector(".sgin-out").addEventListener("click", () => {
  document.querySelector(".leyout").style.display = "flex";
});

async function getlevels() {
  try {
    let alllevels = await fetch("articals.json");
    return await alllevels.json();
  } catch {
    throw new Error("levels fill not found");
  }
}

getlevels().then((levelsList) => {
  levelsList.forEach((level) => {
    createLevelCard(level.title, level.ronde, level.requardSpeed);
  });

  document.querySelector("#name").innerHTML = userObj.userName;
  cards = Array.from(cardsContianer.children);
  updateInfo();
  startlesitning();
});

//signout section
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

//deleting section
document.querySelector(".delet").addEventListener("click", () => {
  document.querySelectorAll(".leyout")[1].style.display = "flex";
});

let secondIcon = document.querySelectorAll(".leyout i")[1];
let secondInput = document.querySelectorAll(".leyout input:nth-child(2)")[1];
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

//adding the canvas
let can = document.querySelectorAll("canvas");
druCanvas(0, can[0], 0);
druCanvas(0, can[1], 0);
//fuctionalty section
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

  if (ronde > userObj.lastlevel) {
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
  //creating level spars icon
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

function updateInfo() {
  let levelsInfoArray,
    oldUser = false;
  for (let i in gameInfo) {
    if (gameInfo[i].userName == userObj.userName) {
      levelsInfoArray = gameInfo[i].levels;
      oldUser = true;
    }
  }
  if (oldUser) {
    updateCards(levelsInfoArray);
  } else {
    gameInfo.push({
      userName: userObj.userName,
      levels: [],
    });
  }
  updateLocal();
}

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

function updateCards(levelsObjsArray) {
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
function startlesitning() {
  cards.forEach((card) => {
    let noumber = card.id.match(/\d+/g).join("");
    card.addEventListener("dblclick", () => {
      localStorage.setItem("courentLevel", +noumber - 1);
      localStorage.setItem("destenation", "type");
      location.href = "./bags/html/loading.html";
    });
    card.addEventListener("click", () => {
      showInfo(card);
    });
  });
}

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

function signOut() {
  updateLocal();
  location.href = "./bags/html/sign.html";
}

function deletAccount(player) {
  playerList = deletPlayerInfo(player, playerList);
  gameInfo = deletPlayerInfo(player, gameInfo);
  localStorage.removeItem("corentPlayer");
  updateLocal();
  location.reload();
}

function deletPlayerInfo(player, from) {
  return from.filter((obj) => {
    return obj.userName !== player.userName;
  });
}
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
      selectedLevel.percent,
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

function druCanvas(bers, canvas, conter, span) {
  let newCanvas = document.createElement("canvas");
  newCanvas.setAttribute("width", canvas.width);
  newCanvas.setAttribute("height", canvas.width);
  canvas.parentElement.appendChild(newCanvas);
  canvas.remove();
  let conte = newCanvas.getContext("2d");
  let [centerX, centerY] = [
    newCanvas.clientWidth / 2,
    newCanvas.clientHeight / 2,
  ];
  let fullCiercel = 2 * Math.PI;
  conte.lineWidth = 15;
  conte.beginPath();
  conte.strokeStyle = "#ccc";
  conte.arc(centerX, centerY, centerX - 20, 0, fullCiercel);
  conte.stroke();
  let i = 0,
    br = 0,
    cont = 0;
  let druer = setInterval(() => {
    //changing the contur numbers
    span ? (cont > conter ? "" : (span.innerHTML = `${cont}`) && cont++) : "";
    //chosing the color
    if (i > 0.7) {
      conte.strokeStyle = "green";
    } else if (i >= 0.5) conte.strokeStyle = "#f3f34c";
    else if (i < 0.5) conte.strokeStyle = "red";
    //end chosing the color
    conte.beginPath();
    i = parseFloat(i.toFixed(3));
    conte.arc(centerX, centerY, centerX - 20, 0, i * fullCiercel);
    if (i >= bers / 100) {
      clearInterval(druer);
    }
    i += 0.01;
    br += 0.01;
    conte.stroke();
  }, 20);
}
