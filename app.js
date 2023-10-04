const canvas = document.getElementById("snakeCanvas1");
const ctx = canvas.getContext("2d");
// getContext() 會回傳一個drawing context

const snakeUnit = 20; //snake each unit
const row = canvas.height / snakeUnit; // 400 / 20 = 20
const column = canvas.width / snakeUnit; // 400 / 20 = 20

let snake = []; // arr中每個元素都是一個含有xy座標的物件
snake[0] = {
  x: 80,
  y: -0,
};
snake[1] = {
  x: 60,
  y: 0,
};
snake[2] = {
  x: 40,
  y: 0,
};
snake[3] = {
  x: 20,
  y: 0,
};

//讓window聽keyboard事件
window.addEventListener("keydown", changeDirection);
//定義現行蛇的方向
let d = "right";
let fruit = createFruit();
let score = 0;
loadHighestScore();
document.getElementById("score").innerHTML = "分數：" + score;

function changeDirection(e) {
  if (e.key == "ArrowLeft" && d != "right") {
    d = "left";
  } else if (e.key == "ArrowDown" && d != "up") {
    d = "down";
  } else if (e.key == "ArrowUp" && d != "down") {
    d = "up";
  } else if (e.key == "ArrowRight" && d != "left") {
    d = "right";
  }
}

function draw() {
  // 清掉圖
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 畫fruit
  ctx.fillStyle = "yellow";
  ctx.fillRect(fruit.x, fruit.y, snakeUnit, snakeUnit);

  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";
    ctx.fillRect(snake[i].x, snake[i].y, snakeUnit, snakeUnit);
    ctx.strokeRect(snake[i].x, snake[i].y, snakeUnit, snakeUnit);
  }

  //以目前的d的方向來決定下一次畫蛇要畫在哪裡
  //算出頭的位置
  let newHeadX = snake[0].x;
  let newHeadY = snake[0].y;
  if (d == "right") {
    newHeadX += snakeUnit;
    if (newHeadX >= canvas.width) {
      newHeadX = 0;
    }
  } else if (d == "left") {
    newHeadX -= snakeUnit;
    if (newHeadX < 0) {
      newHeadX = canvas.width - snakeUnit;
    }
  } else if (d == "up") {
    newHeadY -= snakeUnit;
    if (newHeadY < 0) {
      newHeadY = canvas.height - snakeUnit;
    }
  } else if (d == "down") {
    newHeadY += snakeUnit;
    if (newHeadY >= canvas.height) {
      newHeadY = 0;
    }
  }

  //把新蛇頭塞到array第一個element
  let newHead = {
    x: newHeadX,
    y: newHeadY,
  };

  // 如果碰到自己結束遊戲
  snake.forEach((e) => {
    if (e.x == newHead.x && e.y == newHeadY) {
      gameover();
    }
  });

  //判斷有沒有吃到果實, 如果有吃到就不pop掉最後一個elmenet
  if (newHead.x == fruit.x && newHead.y == fruit.y) {
    fruit = createFruit();
    score++;
    document.getElementById("score").innerHTML = "分數：" + score;
    updateHighestScoreIfScoreIsHigher(score);
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
}

function createFruit() {
  let fruitX =
    Math.floor((Math.random() * canvas.width) / snakeUnit) * snakeUnit;
  let fruitY =
    Math.floor((Math.random() * canvas.height) / snakeUnit) * snakeUnit;
  console.log("fruit is at:" + fruitX + "," + fruitY);
  return { x: fruitX, y: fruitY };
}

function gameover() {
  clearInterval(game);
}

let game = setInterval(draw, 100); // 每0.1秒執行一次draw

function loadHighestScore() {
  let hScore = localStorage.getItem("highestScore");
  if (hScore != null) {
    document.getElementById("highestScore").innerHTML = "最高分數：" + hScore;
  } else {
    document.getElementById("highestScore").innerHTML = "最高分數：" + 0;
  }
}

function updateHighestScoreIfScoreIsHigher(score) {
  let hScore = localStorage.getItem("highestScore");
  if (hScore == null) {
    hScore = 0;
  }
  if (score > hScore) {
    localStorage.setItem("highestScore", score);
    document.getElementById("highestScore").innerHTML = "最高分數：" + score;
  }
}
