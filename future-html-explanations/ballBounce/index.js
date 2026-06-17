(function () {
  const canvas = document.querySelector("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let canvasHeight = window.innerHeight;
  let canvasWidth = window.innerWidth;
  let halfHeight = canvasHeight / 2;
  let halfWidth = canvasWidth / 2;
  const ctx = canvas.getContext("2d");
  const circle1 = { x: halfWidth, y: halfHeight, radius: 100 }
  const circle2 = { x: 200, y: 200, radius: 100 }
  const spring = 0.05;
  let permitDrag = false;
  animate();
  function animate() {
    ctx.strokeStyle = "black"
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.beginPath();
    ctx.arc(circle1.x, circle1.y, circle1.radius, 0, 2 * Math.PI);
    ctx.fillText("ball1", circle1.x, circle1.y)
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(circle2.x, circle2.y, circle2.radius, 0, 2 * Math.PI);
    ctx.fillText("ball2", circle2.x, circle2.y)
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "red"
    ctx.arc(circle2.x, circle2.y, 10, 0, 2 * Math.PI);
    ctx.stroke();
    getMath(circle1, circle2)
    requestAnimationFrame(animate)
  }


  document.addEventListener('pointerdown', e => {
    if (pointCircle({ x: e.pageX, y: e.pageY }, circle2)) {
      permitDrag = true;
    }
  })
  document.addEventListener('pointermove', e => {
    if (permitDrag) {
      circle2.x = e.pageX;
      circle2.y = e.pageY;
    }
  })

  document.addEventListener('pointerup', e => {
    permitDrag = false;
  })
  function getMath(ball1, ball2) {
    if (ball1 === ball2) return;
    let dx = ball2.x - ball1.x;
    let dy = ball2.y - ball1.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let minDist = ball2.radius + ball1.radius;
    if (distance < minDist) {

      let angle = Math.atan2(dy, dx);
      // console.log("collision angle in degrees:", angle * 180 / Math.PI)
      // console.log("cosine of that angle:", Math.cos(angle));
      // console.log("sine of that angle:", Math.sin(angle));
      let targetX = ball1.x + Math.cos(angle) * minDist;
      // console.log("targetX", targetX);
      let targetY = ball1.y + Math.sin(angle) * minDist;

      ctx.beginPath();
      ctx.strokeStyle = "black"
      ctx.moveTo(circle1.x, circle1.y);
      let x = circle1.x + Math.cos(angle) * circle1.radius;
      let y = circle1.y + Math.sin(angle) * circle1.radius;
      ctx.lineTo(x, y);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "pink"
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "black"
      ctx.moveTo(circle2.x, circle2.y);
      let x2 = circle2.x - Math.cos(angle) * circle2.radius;
      let y2 = circle2.y - Math.sin(angle) * circle2.radius;
      ctx.lineTo(x2, y2);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "pink"
      ctx.arc(x2, y2, 5, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "orange";
      ctx.lineWidth = 5;
      ctx.moveTo(x2, y2);
      ctx.lineTo(x, y);
      ctx.stroke();

      let halfway = halfWayOfLine(circle1, circle2);
      ctx.beginPath();
      ctx.strokeStyle = "black"
      ctx.arc(halfway.x, halfway.y, 5, 0, 2 * Math.PI);
      ctx.stroke();

      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.strokeStyle = "red"
      ctx.lineWidth = 2;
      ctx.moveTo(x, y);
      ctx.lineTo(x, circle1.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black"
      ctx.moveTo(x, circle1.y);
      ctx.lineTo(circle1.x, circle1.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "red"
      ctx.arc(targetX, targetY, 10, 0, 2 * Math.PI);
      ctx.stroke();



      let xOverlap = targetX - ball2.x;
      let yOverlap = targetY - ball2.y;
      let ax = xOverlap * spring;
      let ay = yOverlap * spring;



      ball1.vx -= ax;
      ball1.vy -= ay;
      ball2.vx += ax;
      ball2.vy += ay;

    }
    // let dist = Math.abs(Math.floor(distanceBetweenPoints(circle1, circle2) - circle1.radius - circle2.radius));
    // console.log(`overlap of circles is is: ${dist}`)
  }

  function distanceBetweenPoints(startPoint, endPoint) {
    let a = startPoint.x - endPoint.x;
    let b = startPoint.y - endPoint.y;
    return Math.sqrt(a * a + b * b);
  }

  function halfWayOfLine(start, end) {
    return {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };
  }
  function pointCircle(mousePoint, circle) {

    // get distance between the point and circle's center
    // using the Pythagorean Theorem
    let distX = mousePoint.x - circle.x;
    let distY = mousePoint.y - circle.y;
    let distance = Math.sqrt((distX * distX) + (distY * distY));

    // if the distance is less than the circle's
    // radius the point is inside!
    if (distance <= circle.radius) {
      return true;
    }
    return false;
  }
})()