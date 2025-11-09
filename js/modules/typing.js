// Typing logic module for Typingo
// Exports: listenTyping, renderArticle

/**
 * Renders the article text as individual letter spans in the given container.
 * @param {HTMLElement} container - The DOM element to append the letters to
 * @param {string} text - The article text
 * @returns {HTMLElement[]} Array of created letter span elements
 */
export function renderArticle(container, text) {
  let letters = Array.from(text);
  let letterElements = [];
  for (let i = 0; i < letters.length; i++) {
    let span = document.createElement("span");
    span.appendChild(document.createTextNode(letters[i]));
    span.setAttribute("data-key", letters[i]);
    if (letters[i] == " ") {
      span.classList.add("space");
    }
    container.appendChild(span);
    letterElements.push(span);
  }
  return letterElements;
}

/**
 * Listens for keyboard events and updates the article letter states.
 * @param {HTMLElement[]} articalLetters - Array of letter elements
 * @param {function} getCurrentLetterIndex - Function returning the current letter index
 * @param {function} setCurrentLetterIndex - Function to update the current letter index
 * @param {function} onEnd - Callback when the last letter is reached
 */
export function listenTyping(
  articalLetters,
  getCurrentLetterIndex,
  setCurrentLetterIndex,
  onEnd
) {
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

  // create audio player (use correct constructor and file path)
  window.onkeydown = (ev) => {
    const click = new Audio("/sound/type.mp3");
    const wrong = new Audio("/sound/wrong.mp3");
    wrong.preload = "auto";
    wrong.currentTime = 0;
    click.preload = "auto";
    click.currentTime = 0;
    if (ev.key === "/") {
      ev.preventDefault();
    }
    let corentletter = getCurrentLetterIndex();
    if (!noClick.includes(ev.key)) {
      if (ev.key == "Backspace") {
        if (corentletter - 1 < 0) corentletter = 0;
        else corentletter--;
        setCurrentLetterIndex(corentletter);
        if (articalLetters[corentletter].classList.contains("right")) {
          articalLetters[corentletter].classList.remove("right");
        } else {
          articalLetters[corentletter].classList.remove("wrong");
          articalLetters[corentletter].classList.remove("fixed");
          articalLetters[corentletter].classList.add("deleted");
        }
      } else if (ev.key == articalLetters[corentletter].dataset.key) {
        click.play();
        if (articalLetters[corentletter].classList.contains("deleted")) {
          articalLetters[corentletter].classList.add("fixed");
        } else {
          articalLetters[corentletter].classList.add("right");
        }
        if (corentletter === articalLetters.length - 1) {
          onEnd();
        } else {
          setCurrentLetterIndex(corentletter + 1);
        }
      } else {
        wrong.play();
        articalLetters[corentletter].classList.add("wrong");
        if (corentletter === articalLetters.length - 1) {
          onEnd();
        } else {
          setCurrentLetterIndex(corentletter + 1);
        }
      }
    }
  };
}
