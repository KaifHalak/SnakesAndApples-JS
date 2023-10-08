// ==== VARIABLES ====
var snakeHead = document.querySelector(".snake-head");
var snakeHeadValues = window.getComputedStyle(snakeHead);
var board = document.querySelector(".board");
var boardValues = window.getComputedStyle(board);
var apple = document.querySelector(".apple");
var score = document.querySelector(".current-score .score");
var bestScore = Number(localStorage.getItem("best-score")) || 0;
var bestScoreText = document.querySelector(".best-score .score");
bestScoreText.textContent = bestScore.toString();
var direction = "d";
var snakeBody = [snakeHead];
var playAgainButton = document.querySelector(".play-again-container button");
playAgainButton.addEventListener("click", function () {
    window.location.reload();
});
// ==== CONSTANTS ====
var GAME_SPEED = 70; // snake movement in ms
var SNAKE_WIDTH = GetValue(snakeHeadValues.width);
// Get the width and height excluding the borders
var BOARD_WIDTH = GetValue(boardValues.width) - GetValue(boardValues.borderLeftWidth) * 2;
var BOARD_HEIGHT = GetValue(boardValues.height) - GetValue(boardValues.borderLeftWidth) * 2;
// Detect key presses
document.documentElement.addEventListener("keypress", function (key) {
    switch (key.key) {
        case "w":
            if (direction === "s") {
                return;
            }
            direction = "w";
            break;
        case "a":
            if (direction === "d") {
                return;
            }
            direction = "a";
            break;
        case "s":
            if (direction === "w") {
                return;
            }
            direction = "s";
            break;
        case "d":
            if (direction === "a") {
                return;
            }
            direction = "d";
            break;
    }
});
// Each snake movement will correspond to its width
var Frames = setInterval(function () {
    CheckFood();
    UpdateBodyPos();
    switch (direction) {
        case "w":
            snakeHead.style.top = "".concat(GetValue(snakeHeadValues.top) - SNAKE_WIDTH, "px ");
            break;
        case "a":
            snakeHead.style.left = "".concat(GetValue(snakeHeadValues.left) - SNAKE_WIDTH, "px ");
            break;
        case "s":
            snakeHead.style.top = "".concat(GetValue(snakeHeadValues.top) + SNAKE_WIDTH, "px ");
            break;
        case "d":
            snakeHead.style.left = "".concat(GetValue(snakeHeadValues.left) + SNAKE_WIDTH, "px ");
            break;
    }
    CheckFood();
    if (CheckForCollision() || CheckIfOutsideBoard()) {
        clearInterval(Frames);
        GameOver();
        return;
    }
}, GAME_SPEED);
function GameOver() {
    var currentScore = Number(score.textContent);
    if (currentScore > bestScore) {
        localStorage.setItem("best-score", currentScore.toString());
        bestScoreText.textContent = currentScore.toString();
    }
    var playAgainContainer = document.querySelector(".play-again-container");
    playAgainContainer.classList.remove("hide");
}
function GetValue(pixels) {
    // Ex 15px will return 15
    return Number(pixels.split("p")[0]);
}
function IncreaseSize() {
    var body = document.createElement("div");
    body.classList.add("snake-body");
    body.classList.add("snake-style");
    var lastBody = snakeBody[snakeBody.length - 1];
    body.style.top = lastBody.style.top;
    body.style.left = lastBody.style.left;
    snakeBody.push(body);
    document.querySelector(".board");
    var board = document.querySelector(".board");
    board.appendChild(body);
}
function UpdateBodyPos() {
    for (var i = snakeBody.length - 1; i > 0; i--) {
        var back = snakeBody[i];
        var front = snakeBody[i - 1];
        back.style.top = front.style.top;
        back.style.left = front.style.left;
    }
}
function CheckForCollision() {
    var body;
    for (var i = 1; i < snakeBody.length; i++) {
        body = snakeBody[i];
        if (body.style.top === snakeHead.style.top && body.style.left === snakeHead.style.left) {
            return true;
        }
    }
    return false;
}
function CheckIfOutsideBoard() {
    return (GetValue(snakeHeadValues.left) < 0 ||
        GetValue(snakeHeadValues.top) < 0 ||
        GetValue(snakeHeadValues.left) > BOARD_WIDTH - SNAKE_WIDTH ||
        GetValue(snakeHeadValues.top) > BOARD_HEIGHT - SNAKE_WIDTH);
}
function CheckFood() {
    if (snakeHead.style.top === apple.style.top && snakeHead.style.left === apple.style.left) {
        IncreaseSize();
        // Get a new position for the apple which is not occupied by the snake 
        var top_1 = "".concat(GetRandomNumber() * SNAKE_WIDTH, "px");
        var left = "".concat(GetRandomNumber() * SNAKE_WIDTH, "px");
        var flag = CheckIfSamePositionAsSnake(top_1, left);
        while (flag) {
            top_1 = "".concat(GetRandomNumber() * SNAKE_WIDTH, "px");
            left = "".concat(GetRandomNumber() * SNAKE_WIDTH, "px");
            flag = CheckIfSamePositionAsSnake(top_1, left);
        }
        apple.style.top = top_1;
        apple.style.left = left;
        score.textContent = (Number(score.textContent) + 1).toString();
    }
}
function CheckIfSamePositionAsSnake(top, left) {
    for (var i = 1; i < snakeBody.length - 1; i++) {
        var bodyBlock = snakeBody[i];
        if (bodyBlock.style.top === top && bodyBlock.style.left === left) {
            return true;
        }
    }
    return false;
}
function GetRandomNumber() {
    // Return number between min and max
    var ERROR = 2;
    var max = ((BOARD_HEIGHT / SNAKE_WIDTH) - ERROR);
    var min = 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
