export function druCanvas(bers, canvas, conter, span) {
  let newCanvas = document.createElement("canvas");
  newCanvas.setAttribute("width", canvas.width);
  newCanvas.setAttribute("height", canvas.height);
  canvas.parentElement.appendChild(newCanvas);
  canvas.remove();
  let ctx = newCanvas.getContext("2d");
  let [centerX, centerY] = [newCanvas.width / 2, newCanvas.height / 2];
  let radius = Math.min(centerX, centerY) - 20;
  let fullCircle = 2 * Math.PI;
  ctx.lineWidth = 15;
  ctx.lineCap = "round";
  // Add shadow for depth
  ctx.shadowColor = "rgba(0,0,0,0.2)";
  ctx.shadowBlur = 8;
  // Draw background ring
  ctx.beginPath();
  ctx.strokeStyle = "#eee";
  ctx.arc(centerX, centerY, radius, 0, fullCircle);
  ctx.stroke();
  // Animate progress arc
  let i = 0,
    cont = 0;
  let druer = setInterval(() => {
    // Clear arc area only
    ctx.clearRect(0, 0, newCanvas.width, newCanvas.height);
    // Redraw background ring
    ctx.beginPath();
    ctx.strokeStyle = "#eee";
    ctx.arc(centerX, centerY, radius, 0, fullCircle);
    ctx.stroke();
    // Choose color and gradient
    let percent = i / (bers / 100);
    let grad = ctx.createLinearGradient(
      centerX - radius,
      centerY,
      centerX + radius,
      centerY
    );
    if (percent > 0.7) {
      grad.addColorStop(0, "#43e97b");
      grad.addColorStop(1, "#38f9d7");
    } else if (percent >= 0.5) {
      grad.addColorStop(0, "#f3f34c");
      grad.addColorStop(1, "#f9d423");
    } else {
      grad.addColorStop(0, "#ff5858");
      grad.addColorStop(1, "#f09819");
    }
    ctx.beginPath();
    ctx.strokeStyle = grad;
    ctx.arc(
      centerX,
      centerY,
      radius,
      -Math.PI / 2,
      -Math.PI / 2 + i * fullCircle
    );
    ctx.stroke();
    // Animate number in center
    if (span) {
      span.innerHTML = Math.min(Math.round(cont), conter);
      cont += (conter - cont) * 0.1 + 0.2; // Smooth ease
      if (Math.abs(conter - cont) < 0.5) cont = conter;
    }
    // Draw center text (big number)
    ctx.save();
    ctx.font = "bold 32px Teko, Arial";
    ctx.fillStyle = "#666";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(Math.round(i * bers)) + "%", centerX, centerY);
    ctx.restore();
    // Animate arc progress
    if (i >= bers / 100) {
      clearInterval(druer);
    }
    i += 0.01;
    if (i > bers / 100) i = bers / 100;
  }, 16);
}
