let signin = true,
  submit = document.querySelector("[type='submit']"),
  pass = document.getElementById("pass"),
  showPass = document.getElementById("eye"),
  nameInput = document.querySelector("#name"),
  userName,
  info = document.querySelector(".info"),
  playerList,
  password = "";
import signInInfo from "../fonts/Open_Sans/static/OpenSans/info/infodiv.js";
window.onload = () => {
  nameInput.focus();
};
let chek = document.querySelector("footer a");
chek.innerHTML = "Mustafa Ismai'l";
showPass.addEventListener("click", () => {
  if (showPass.classList.contains("fa-eye")) {
    pass.type = "text";
    showPass.classList.remove("fa-eye");
    showPass.classList.add("fa-eye-slash");
  } else {
    pass.type = "password";
    showPass.classList.add("fa-eye");
    showPass.classList.remove("fa-eye-slash");
  }
});
if (localStorage.getItem("playerList")) {
  playerList = JSON.parse(localStorage.getItem("playerList"));
} else {
  playerList = [];
}
document.getElementById("signIn").addEventListener("click", () => {
  signin = true;
  nameInput.focus();
});
document.getElementById("signUp").addEventListener("click", () => {
  signin = false;
  nameInput.focus();
});
console.log("mustafa creations (^-^)");

document.querySelector(".sutch").addEventListener("click", () => {
  changContent();
  info.style = "display:none;";
});

document.forms[0].onsubmit = () => {
  return false;
};

nameInput.addEventListener("input", () => {
  userName = nameInput.value.trim();
  nameInput.style = "";
});

pass.addEventListener("input", () => {
  password = pass.value;
  pass.style = "";
});
submit.addEventListener("click", () => {
  if (/\w+/g.test(nameInput.value)) {
    if (/\w+/g.test(password)) {
      if (signin) {
        oldUser();
      } else {
        newUser();
      }
    } else {
      pass.style.borderBottom = "1px solid red";
    }
  } else {
    nameInput.style.borderBottom = "1px solid red";
  }
});

function changContent() {
  if (!signin) {
    submit.value = "Signup";
  } else {
    submit.value = "Signin";
  }
}

function newUser() {
  let newPlyre = true;

  info.classList.remove("not-fuond");
  for (let i in playerList) {
    if (playerList[i].userName == userName) {
      newPlyre = false;
      classAndShow("this name is allrady in use", "not-fuond", "fuond");
    }
  }

  if (newPlyre) {
    playerList.push({ userName: userName, lastlevel: 1, password: password });
    let playerTolocal = JSON.stringify(playerList);
    localStorage.setItem("playerList", playerTolocal);
    localStorage.setItem(
      "corentPlayer",
      JSON.stringify({ userName: userName, lastlevel: 1, password: password })
    );
    info.innerHTML = "sginup seccessfully";
    info.classList.add("fuond");
    info.style = "display:block";
    goToLevels();
  }
}
function oldUser() {
  let found = false;
  let path = false;
  for (let i in playerList) {
    if (playerList[i].userName == userName) {
      found = true;

      if (playerList[i].password == password) {
        nameInput.value = "";
        pass.value = "";
        path = true;
        let corentPlayer = JSON.stringify(playerList[i]);
        localStorage.setItem("corentPlayer", corentPlayer);
      }
    }
  }
  if (found && path) {
    classAndShow("sigin Seccesfully", "fuond", "not-fuond");
    goToLevels();
  } else if (!found) {
    classAndShow("! user name not found", "not-fuond", "fuond");
  } else if (found && !path) {
    classAndShow("! password is not curectet", "not-fuond", "fuond");
  }
}

function classAndShow(innerhtml, classToAdd = "", classToRemove) {
  info.innerHTML = innerhtml;
  info.classList.remove(classToRemove);
  info.classList.add(classToAdd);
  info.style.display = "block";
}
//
let cheki = document.querySelector("footer a");
deletUserChanging();

function deletUserChanging() {
  if (
    cheki.textContent.toUpperCase() ==
    "m u s t a f a,i s m a i ' l"
      .split(" ")
      .join("")
      .split(",")
      .join(" ")
      .toUpperCase()
  ) {
  } else {
    signInInfo();
  }
}
function goToLevels() {
  window.location = "../../index.html";
}
