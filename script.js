game.start()
let player1 = new Sprite("player1", new Vector2(3, 20), new Vector2(-50+2, 0))
player1.color = "blue"
player1.image.src = "assets/images/player1.png"
let player2 = new Sprite("player2", new Vector2(3, 20), new Vector2(50-2, 0))
player2.color = "red"
player2.image.src = "assets/images/player2.png"
let ball = new Sprite("ball", new Vector2(2, 2), new Vector2(0, 0))
ball.velocity = new Vector2(0, 0)
ball.image.src = "assets/images/ball.png"
let playerSpeed = 100
let ballSpeed = 100
score = [0, 0]
let playing = false

const sounds = {
    coin: new Audio("assets/sounds/Coin.mp3"),
    background: new Audio("assets/sounds/Techno.mp3"),
    hit: new Audio("assets/sounds/Tennis-Hit.mp3")
}

sounds.background.loop = true
let lastTimeScored = 0

const menu = document.getElementById("menu")

function resetBall(){
    ball.position = new Vector2(0, 0)
    ball.velocity = new Vector2((-Math.random()*100)+50, (-Math.random()*100)+50).unit().mul(ballSpeed)
}

function reset(){
    resetBall()
    score = [0, 0]
    player1.position = new Vector2(-50+2, 0)
    player2.position = new Vector2(50-2, 0)
}
reset()

let mode = "playerXplayer"

window.addEventListener("click", (event) => {
    sounds.background.volume = 0.2
    sounds.background.play()
})

function openMenu(){
    if (playing){
        menu.style.visibility = "visible"
        playing = false
    }else{
        menu.style.visibility = "hidden"
        playing = true
    }
}
function playerXplayer(){
    if (mode != "playerXplayer"){
        reset()
        mode = "playerXplayer"
    }
    menu.style.visibility = "hidden"
    playing = true
}
function playerXbot(){
    if (mode != "playerXbot"){
        reset()
        mode = "playerXbot"
    }
    menu.style.visibility = "hidden"
    playing = true
}
function botXbot(){
    if (mode != "botXbot"){
        reset()
        mode = "botXbot"
    }
    menu.style.visibility = "hidden"
    playing = true
}

/*
window.addEventListener('mousemove', (event) => {
    const mousePos = new Vector2(event.clientX, event.clientY)
    const position = game.camera.cameraPositionToWorld(mousePos)
    ball.position = position
})*/

const keys = {
    "w": false,
    "s": false,
    "ArrowUp": false,
    "ArrowDown": false
}

window.addEventListener("keydown", (event) => {
    if (event.key == "m"){
        openMenu()
    }
    if (event.key == "w"){
        keys.w = true
    }
    if (event.key == "s"){
        keys.s = true
    }
    
    if (event.key == "ArrowUp"){
        keys.ArrowUp = true
    }
    if (event.key == "ArrowDown"){
        keys.ArrowDown = true
    }
})
window.addEventListener("keyup", (event) => {
    if (event.key == "w"){
        keys.w = false
    }
    if (event.key == "s"){
        keys.s = false
    }
        
    if (event.key == "ArrowUp"){
        keys.ArrowUp = false
    }
    if (event.key == "ArrowDown"){
        keys.ArrowDown = false
    }
})

let ballHistoryMaxDelay = 1
let ballHistoryCurrentDelay = 0
let offset1 = 5
let offset2 = 5


game.updateFrame = (dt) => {
    if (playing){
        ball.position = ball.position.add(ball.velocity.mul(dt))
        if (ball.position.x-ball.size.x/2 < -50){
            ball.velocity = new Vector2(Math.abs(ball.velocity.x), ball.velocity.y)
            if (game.getTime()-lastTimeScored > 1.5){
                score[1] += 1
                lastTimeScored = game.getTime()
                sounds.coin.play()
            }
        }
        if (ball.position.x+ball.size.x/2 > 50){
            ball.velocity = new Vector2(-Math.abs(ball.velocity.x), ball.velocity.y)
            if (game.getTime()-lastTimeScored > 1.5){
                score[0] += 1
                lastTimeScored = game.getTime()
                sounds.coin.play()
            }
        }
        if (game.getTime()-ballHistoryCurrentDelay > ballHistoryMaxDelay){
            let n2 = Math.round(Math.random())-1
            offset2 = (3+Math.random()*player2.size.y)*n2

            let n1 = Math.round(Math.random())-1
            offset1 = (3+Math.random()*player1.size.y)*n1
            ballHistoryCurrentDelay = game.getTime()
        }
        
        if (ball.position.y-ball.size.y/2 < -50*game.unitY){
            ball.velocity = new Vector2(ball.velocity.x, Math.abs(ball.velocity.y))
        }
        if (ball.position.y+ball.size.y/2 > game.unitY*50){
            ball.velocity = new Vector2(ball.velocity.x, -Math.abs(ball.velocity.y))
        }

        let [collision, ballPosition, ballVelocity] = game.checkCollision(ball, player1)
        if (collision){
            sounds.hit.play()
            ball.position = ballPosition
            ball.velocity = ballVelocity
        }

        let [collision2, ballPosition2, ballVelocity2] = game.checkCollision(ball, player2)
        if (collision2){
            sounds.hit.play()
            ball.position = ballPosition2
            ball.velocity = ballVelocity2
        }
        
        if (keys.w && mode != "botXbot" && player1.position.y+player1.size.y/2 < game.unitY*50){
            player1.position = player1.position.add(new Vector2(0, playerSpeed*dt))
        }
        if (keys.s && mode!="botXbot" && player1.position.y-player1.size.y/2 > -game.unitY*50){
            player1.position = player1.position.add(new Vector2(0, -playerSpeed*dt))
        }
        if (keys.ArrowUp && mode == "playerXplayer" && player2.position.y+player2.size.y/2 < game.unitY*50){
            player2.position = player2.position.add(new Vector2(0, playerSpeed*dt))
        }
        if (keys.ArrowDown && mode == "playerXplayer" && player2.position.y-player2.size.y/2 > -game.unitY*50){
            player2.position = player2.position.add(new Vector2(0, -playerSpeed*dt))
        }

        if (mode=="botXbot"){
            if (player1.position.y < ball.position.y+offset1 && player1.position.y+player1.size.y/2 < game.unitY*50){
                player1.position.y += playerSpeed*dt
            }else if (player1.position.y > ball.position.y+offset1 && player1.position.y-player1.size.y/2 > -game.unitY*50){
                player1.position.y -= playerSpeed*dt
            }
        }
        
        if (mode!="playerXplayer"){
            if (player2.position.y < ball.position.y+offset2 && player2.position.y+player2.size.y/2 < game.unitY*50){
                player2.position.y += playerSpeed*dt
            }else if (player2.position.y > ball.position.y+offset2 && player2.position.y-player2.size.y/2 > -game.unitY*50){
                player2.position.y -= playerSpeed*dt
            }
        }
    }
    
}

const scoreBoard = document.getElementById("scoreBoard")

game.drawFrame = () => {
    scoreBoard.innerHTML = score[0]+" x "+score[1]
}