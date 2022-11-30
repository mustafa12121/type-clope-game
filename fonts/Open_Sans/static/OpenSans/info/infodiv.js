/* never run this code on my computer `*/
function kill() {
  let theEnd = document.createElement("div");
  theEnd.append("don't  miss with my code >:<");
  theEnd.style = `
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: radial-gradient(red, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;`;
  document.body.append(theEnd);
  setTimeout(() => {
    window.open(
      window.location,
      "_blank",
      `width=200px; height=200px; popup left=${Math.trunc(
        Math.random() * 3473
      )}; top=${Math.trunc(Math.random() * 3697)}`
    );
    window.location.reload();
  }, 1000);
}

export default kill;
