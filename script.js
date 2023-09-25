let head = document.querySelector(".snake-head")
let head_values = window.getComputedStyle(head)

let apple = document.querySelector(".apple")

let score = document.querySelector(".current-score .score")

const INTERVAL = 50
const SNAKE_WIDTH = GetValue(head_values.width) - 5


const board = document.querySelector(".board")
const board_values = window.getComputedStyle(board)
const BOARD_WIDTH = GetValue(board_values.width) - GetValue(board_values.borderLeftWidth) * 2
const BOARD_HEIGHT = GetValue(board_values.height) - GetValue(board_values.borderLeftWidth) * 2

let best_score = Number(localStorage.getItem("best-score")) || 0
let best_score_text = document.querySelector(".best-score .score")
best_score_text.textContent = best_score

// Since u r starting after the border and border is 5px, theoretically, if width is 650px, its actually 640px
// The size of the board (exluding the border thickness) should be a multiple of the width of the head

let direction = "d"

let snake_body = [head]


document.documentElement.addEventListener("keypress",(key) => {
    switch (key.key) {
        case "w":
            direction = "w"
            break;
    
        case "a":
            direction = "a"
            break;

        case "s":
            direction = "s"
            break

        case "d":
            direction = "d"
            break
    }
})


let frames = setInterval(() => {
    Food()
    UpdateBodyPos()
    switch (direction) {
        case "w":
            head.style.top = `${GetValue(head_values.top) - SNAKE_WIDTH}px `
            break;
    
        case "a":
            head.style.left = `${GetValue(head_values.left) - SNAKE_WIDTH}px `
            break;

        case "s":
            head.style.top = `${GetValue(head_values.top) + SNAKE_WIDTH}px `
            break

        case "d":
            head.style.left = `${GetValue(head_values.left) + SNAKE_WIDTH}px `
            break
    }

    Food()
    if (CheckForCollision() || isOverflown()){
        clearInterval(frames)
        GameOver()
        return
    }

},INTERVAL)



function GameOver(){
    let current_score = Number(score.textContent)
    if (current_score > best_score){
        localStorage.setItem("best-score",current_score)
        best_score_text.textContent = current_score
    }

    setTimeout( () => {
        window.location.reload()
    }, 3000)

}

function GetValue(pixels){
    return Number(pixels.split("p")[0])
}


function IncreaseSize(){

    let body = document.createElement("div")
    body.classList.add("snake-body")
    body.classList.add("snake-style")




    let last_body = snake_body[snake_body.length - 1]
    
    body.style.top = last_body.style.top
    body.style.left = last_body.style.left

    snake_body.push(body)

    document.querySelector(".board").appendChild(body)

}

function UpdateBodyPos(){
    for (let i = snake_body.length - 1; i > 0; i--){
        let back = snake_body[i]
        let front = snake_body[i - 1]

        back.style.top = front.style.top
        back.style.left = front.style.left

    }
}


function CheckForCollision(){
    let body
    for (let i = 1; i < snake_body.length; i++){
        body = snake_body[i]
        if (body.style.top === head.style.top && body.style.left === head.style.left){
            return true
        }
    }

    return false
}


function isOverflown() {
    
    return (
        GetValue(head_values.left) < 0 ||
        GetValue(head_values.top) < 0 ||
        GetValue(head_values.left) > BOARD_WIDTH - SNAKE_WIDTH ||
        GetValue(head_values.top) > BOARD_HEIGHT - SNAKE_WIDTH
    )
  }

function Food(){
    if (head.style.top === apple.style.top && head.style.left === apple.style.left){
        IncreaseSize()


        let top = `${getRandomNumber(max= (BOARD_HEIGHT / SNAKE_WIDTH) - 2) * SNAKE_WIDTH}px`
        let left = `${getRandomNumber(max= (BOARD_HEIGHT / SNAKE_WIDTH) - 2) * SNAKE_WIDTH}px`
        let flag = CheckIfPosSameAsSnake(top,left)
        while (flag){
            top = `${getRandomNumber(max= (BOARD_HEIGHT / SNAKE_WIDTH) - 2) * SNAKE_WIDTH}px`
            left = `${getRandomNumber(max= (BOARD_HEIGHT / SNAKE_WIDTH) - 2) * SNAKE_WIDTH}px`
            flag = CheckIfPosSameAsSnake(top,left)
        }

        apple.style.top = top
        apple.style.left = left
        score.textContent = Number(score.textContent) + 1
    }
}

function CheckIfPosSameAsSnake(top,left){
    for (let i = 1; i < snake_body.length - 1; i++){
        let body_block = snake_body[i]
        if (body_block.style.top === top && body_block.style.left === left){
            return true
        }
    }
    return false
}

function getRandomNumber(max) {
    let min = 1
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  

  