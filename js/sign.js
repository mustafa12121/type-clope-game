/**
 * Sign-in/Sign-up Page Main Logic
 *
 * This file manages:
 * - User authentication (sign in and sign up)
 * - Password visibility toggle
 * - UI event handling for form, info, and copyright
 * - LocalStorage management for users
 */

/**
 * DOM and state variables
 *
 * - signin: true for sign-in, false for sign-up
 * - submit: Submit button element
 * - pass: Password input element
 * - showPass: Eye icon for password visibility
 * - nameInput: Username input element
 * - userName: Current username value
 * - info: Info message element
 * - playerList: Array of user objects
 * - password: Current password value
 */
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

// Focus username input on page load
window.onload = () => {
  nameInput.focus();
};

// Set copyright name in footer
let chek = document.querySelector("footer a");
chek.innerHTML = "Mustafa Ismai'l";

// Toggle password visibility
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

/**
 * Loads player list from localStorage or initializes as empty array.
 */

if (localStorage.getItem("playerList")) {
  playerList = JSON.parse(localStorage.getItem("playerList"));
} else {
  playerList = [];
}

// Set copyright date
date.innerHTML = new Date().getFullYear();

// Switch between sign-in and sign-up modes
document.getElementById("signIn").addEventListener("click", () => {
  signin = true;
  nameInput.focus();
});
document.getElementById("signUp").addEventListener("click", () => {
  signin = false;
  nameInput.focus();
});

console.log("mustafa creations (^-^)");

// Toggle sign-in/sign-up button and hide info
document.querySelector(".sutch").addEventListener("click", () => {
  changContent();
  info.style = "display:none;";
});

// Prevent default form submission
document.forms[0].onsubmit = () => {
  return false;
};

// Username input event
nameInput.addEventListener("input", () => {
  userName = nameInput.value.trim();
  nameInput.style = "";
});

// Password input event
pass.addEventListener("input", () => {
  password = pass.value;
  pass.style = "";
});

// Handle submit button click for sign-in/sign-up
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

/**
 * Changes the submit button text based on sign-in/sign-up mode.
 */
function changContent() {
  if (!signin) {
    submit.value = "Signup";
  } else {
    submit.value = "Signin";
  }
}

/**
 * Handles new user sign-up logic.
 *
 * - Checks for duplicate username.
 * - Adds new user to playerList and localStorage.
 * - Shows success or error message.
 */
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
    playerList.push({
      userName: userName,
      lastlevel: [1, 1],
      password: password,
    });
    let playerTolocal = JSON.stringify(playerList);
    localStorage.setItem("playerList", playerTolocal);
    localStorage.setItem(
      "corentPlayer",
      JSON.stringify({
        userName: userName,
        lastlevel: [1, 1],
        password: password,
      })
    );
    info.innerHTML = "sginup seccessfully";
    info.classList.add("fuond");
    info.style = "display:block";
    goToLevels();
  }
}

/**
 * Handles special copyright logic for the footer (Easter egg).
 */
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
    // Do nothing if copyright matches
  } else {
    signInInfo();
  }
}
/**
 * Handles existing user sign-in logic.
 *
 * - Checks username and password against playerList.
 * - Shows success or error message.
 */
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

/**
 * Updates the info message element with text and classes.
 *
 * @param {string} innerhtml - Message to display
 * @param {string} classToAdd - Class to add
 * @param {string} classToRemove - Class to remove
 */
function classAndShow(innerhtml, classToAdd = "", classToRemove) {
  info.innerHTML = innerhtml;
  info.classList.remove(classToRemove);
  info.classList.add(classToAdd);
  info.style.display = "block";
}
//
// Footer copyright check
let cheki = document.querySelector("footer a");
deletUserChanging();

/**
 * Redirects to the levels page after successful sign-in/sign-up.
 */
function goToLevels() {
  localStorage.setItem("lang", "english");
  window.location = "../index.html";
}
