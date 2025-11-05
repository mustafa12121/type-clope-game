// Keyboard UI module for Typingo
// Exports: createKeyboard, listenKeyboard, blinkKey, addShift, removeShift

/**
 * Creates the on-screen keyboard and appends it to the given container.
 * @param {HTMLElement} container - The DOM element to append the keyboard to
 * @returns {HTMLElement} The keyboard element
 */
export function createKeyboard() {
  let keylayoutEn = Array.from(
    "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./"
  );
  let keylayoutAr = [
    "ذ",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "-",
    "=",
    "ض",
    "ص",
    "ث",
    "ق",
    "ف",
    "غ",
    "ع",
    "ه",
    "خ",
    "ح",
    "ج",
    "د",
    "\\",
    "ش",
    "س",
    "ي",
    "ب",
    "ل",
    "ا",
    "ت",
    "ن",
    "م",
    "ك",
    "ط",
    "ئ",
    "ء",
    "ؤ",
    "ر",
    "لا",
    "ى",
    "ة",
    "و",
    "ز",
    "ظ",
  ];
  let keylayout;
  if (localStorage.getItem("lang") === "arabic") {
    keylayout = keylayoutAr;
  } else {
    keylayout = keylayoutEn;
  }
  let keybord = document.createElement("div");
  keybord.classList.add("keybord", "shadow");

  keybord.id = "keybord";
  let keys = keylayout;
  console.log(keylayout);
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
  // make the special keys spacifec ot arabic or english layouts @todo
  if (localStorage.getItem("lang") === "arabic") {
    creatkey(keybord, "tap", "Tap", "ض");
    creatkey(keybord, "Back", "Backspace", "=", false);
    creatkey(keybord, "capslock", "CapsLock", "ش");
    creatkey(keybord, "shift", "Shift", "ئ");
    creatkey(keybord, "shift", "Shift", "ظ", false);
    creatkey(keybord, "Enter", "Enter", "ط", false);
  } else {
    creatkey(keybord, "tap", "Tap", "q");
    creatkey(keybord, "Back", "Backspace", "=", false);
    creatkey(keybord, "capslock", "CapsLock", "a");
    creatkey(keybord, "shift", "Shift", "z");
    creatkey(keybord, "shift", "Shift", "/", false);
    creatkey(keybord, "Enter", "Enter", "'", false);
  }
  let space = document.createElement("div");
  space.append("space");
  space.setAttribute("data-key", " ");
  space.classList.add("key-shadow-out");
  keybord.appendChild(space);
  return keybord;
}

/**
 * Creates and inserts a special key into the keyboard.
 */
function creatkey(
  keybord,
  innerValue,
  dataValue,
  targetDataValue,
  befor = true
) {
  let key = document.createElement("span");
  key.append(innerValue);
  key.setAttribute("data-key", dataValue);
  key.classList.add("key-shadow-out");
  let target = keybord.querySelector(`[data-key="${targetDataValue}"]`);
  if (befor) {
    target.before(key);
  } else {
    target.after(key);
  }
}

/**
 * Animates a key to visually indicate a key press.
 * @param {HTMLElement} ele - The key element to animate
 */
export function blinkKey(ele) {
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
 * Highlights the appropriate Shift key for uppercase or special characters.
 * @param {HTMLElement} ele - The key element
 * @param {HTMLElement[]} keysArray - Array of key elements
 */
export function addShift(ele, keysArray) {
  let leftShiftKeys = Array.from("qwertasdfgzxcvb~!@#$%");
  if (localStorage.getItem("keybordLayout") == "arabic") {
    leftShiftKeys = Array.from('/:,.؟"');
  }
  let shifts = keysArray.filter((val) => {
    return val.dataset.key == "Shift";
  });
  ele.classList.add("courent");
  if (leftShiftKeys.includes(`${ele.dataset.key}`)) {
    shifts[0].classList.add("courent");
  } else {
    shifts[1].classList.add("courent");
  }
}

/**
 * Removes highlight from all Shift keys.
 */
export function removeShift(keybord) {
  keybord.querySelectorAll('[data-key="Shift"]').forEach((ele) => {
    blinkKey(ele);
    ele.classList.remove("courent");
  });
}

/**
 * Listens for keyboard events and updates the on-screen keyboard UI.
 * @param {HTMLElement} keybord - The keyboard element
 * @param {HTMLElement[]} articalLetters - Array of letter elements
 * @param {function} getCurrentLetterIndex - Function returning the current letter index
 */
export function listenKeyboard(keybord, articalLetters, getCurrentLetterIndex) {
  let keys = Array.from(keybord.children);
  let notShift = true;
  function shickKeys() {
    let corentletter = getCurrentLetterIndex();
    keys.forEach((ele) => {
      if (ele.dataset.key == articalLetters[corentletter].dataset.key) {
        ele.classList.add("courent");
      } else if (
        ele.dataset.key !== "Shift" &&
        ele.dataset.key.toUpperCase() !==
          articalLetters[corentletter].dataset.key
      ) {
        blinkKey(ele);
        ele.classList.remove("courent");
      }
      if (
        ele.dataset.key.toUpperCase() ===
          articalLetters[corentletter].dataset.key &&
        ele.dataset.key.toUpperCase() !== ele.dataset.key
      ) {
        addShift(ele, keys);
        notShift = false;
      }
    });
  }
  document.addEventListener("keyup", () => {
    notShift = true;
    shickKeys();
    if (notShift) {
      removeShift(keybord);
    }
  });
  shickKeys();
}
