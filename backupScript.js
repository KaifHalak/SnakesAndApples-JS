// ==== VARIABLES ====

let snakeHead = document.querySelector(".snake-head")
let snakeHeadValues = window.getComputedStyle(snakeHead)

let board = document.querySelector(".board")
let boardValues = window.getComputedStyle(board)

let apple = document.querySelector(".apple")

let score = document.querySelector(".current-score .score")

let bestScore = Number(localStorage.getItem("best-score")) || 0
let bestScoreText = document.querySelector(".best-score .score")
bestScoreText.textContent = bestScore

let direction = "d"

let snakeBody = [snakeHead]

let playAgainButton = document.querySelector(".play-again-container button")
playAgainButton.addEventListener("click", () => {
    window.location.reload()
})

// ==== CONSTANTS ====

const GAME_SPEED = 70 // snake movement in ms

const SNAKE_WIDTH = GetValue(snakeHeadValues.width)

// Get the width and height excluding the borders
const BOARD_WIDTH = GetValue(boardValues.width) - GetValue(boardValues.borderLeftWidth) * 2
const BOARD_HEIGHT = GetValue(boardValues.height) - GetValue(boardValues.borderLeftWidth) * 2


// Detect key presses
document.documentElement.addEventListener("keypress",(key) => {
    switch (key.key) {
        case "w":
            if (direction === "s"){return}
            direction = "w"
            break;
    
        case "a":
            if (direction === "d"){return}
            direction = "a"
            break;

        case "s":
            if (direction === "w"){return}
            direction = "s"
            break

        case "d":
            if (direction === "a"){return}
            direction = "d"
            break
    }
})


// Each snake movement will correspond to its width
let frames = setInterval(() => {
    CheckFood()
    UpdateBodyPos()

    switch (direction) {
        case "w":
            snakeHead.style.top = `${GetValue(snakeHeadValues.top) - SNAKE_WIDTH}px `
            break;
    
        case "a":
            snakeHead.style.left = `${GetValue(snakeHeadValues.left) - SNAKE_WIDTH}px `
            break;

        case "s":
            snakeHead.style.top = `${GetValue(snakeHeadValues.top) + SNAKE_WIDTH}px `
            break

        case "d":
            snakeHead.style.left = `${GetValue(snakeHeadValues.left) + SNAKE_WIDTH}px `
            break

    }

    CheckFood()

    if (CheckForCollision() || CheckIfOutsideBoard()){
        clearInterval(frames)
        GameOver()
        return
    }

},GAME_SPEED)



function GameOver(){
    let currentScore = Number(score.textContent)
    if (currentScore > bestScore){
        localStorage.setItem("best-score",currentScore)
        bestScoreText.textContent = currentScore
    }   

    let playAgainContainer = document.querySelector(".play-again-container")
    playAgainContainer.classList.remove("hide")

}


function GetValue(pixels){
    // Ex 15px will return 15
    return Number(pixels.split("p")[0])
}


function IncreaseSize(){

    let body = document.createElement("div")
    body.classList.add("snake-body")
    body.classList.add("snake-style")


    let lastBody = snakeBody[snakeBody.length - 1]
    body.style.top = lastBody.style.top
    body.style.left = lastBody.style.left

    snakeBody.push(body)

    document.querySelector(".board").appendChild(body)

}

function UpdateBodyPos(){
    for (let i = snakeBody.length - 1; i > 0; i--){
        let back = snakeBody[i]
        let front = snakeBody[i - 1]

        back.style.top = front.style.top
        back.style.left = front.style.left

    }
}


function CheckForCollision(){
    let body
    for (let i = 1; i < snakeBody.length; i++){
        body = snakeBody[i]
        if (body.style.top === snakeHead.style.top && body.style.left === snakeHead.style.left){
            return true
        }
    }

    return false
}


function CheckIfOutsideBoard() {
    return (
        GetValue(snakeHeadValues.left) < 0 ||
        GetValue(snakeHeadValues.top) < 0 ||
        GetValue(snakeHeadValues.left) > BOARD_WIDTH - SNAKE_WIDTH ||
        GetValue(snakeHeadValues.top) > BOARD_HEIGHT - SNAKE_WIDTH
    )
  }

function CheckFood(){
    if (snakeHead.style.top === apple.style.top && snakeHead.style.left === apple.style.left){
        IncreaseSize()

        // Get a new position for the apple which is not occupied by the snake 
        let top = `${GetRandomNumber() * SNAKE_WIDTH}px`
        let left = `${GetRandomNumber() * SNAKE_WIDTH}px`
        let flag = CheckIfSamePositionAsSnake(top,left)
        while (flag){
            top = `${GetRandomNumber() * SNAKE_WIDTH}px`
            left = `${GetRandomNumber() * SNAKE_WIDTH}px`
            flag = CheckIfSamePositionAsSnake(top,left)
        }

        apple.style.top = top
        apple.style.left = left
        score.textContent = Number(score.textContent) + 1
    }
}

function CheckIfSamePositionAsSnake(top,left){
    for (let i = 1; i < snakeBody.length - 1; i++){
        let bodyBlock = snakeBody[i]
        if (bodyBlock.style.top === top && bodyBlock.style.left === left){
            return true
        }
    }
    return false
}

function GetRandomNumber() {
    // Return number between min and max
    const ERROR = 2
    let max = ((BOARD_HEIGHT / SNAKE_WIDTH) - ERROR)
    let min = 1
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  

  