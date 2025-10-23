game.start(document.getElementById("canvas"))

let player1 = new Sprite("player1", new Vector2(3, 20), new Vector2(2, game.unitY*50))
player1.color = "blue"
player1.image.src = "assets/player1.png"
let player2 = new Sprite("player2", new Vector2(3, 20), new Vector2(100-2, game.unitY*50))
player2.color = "red"
player2.image.src = "assets/player2.png"
let ball = new Sprite("ball", new Vector2(2, 2), new Vector2(50, 50*game.unitY))
ball.velocity = new Vector2(0, 0)
ball.image.src = "assets/ball.png"
let playerSpeed = 5
let ballSpeed = 100
score = [0, 0]
let playing = false

let lastTimeScored = 0

const menu = document.getElementById("menu")

function getTime(){
    const now = new Date()
    return now.getMilliseconds()/1000+now.getSeconds()+now.getMinutes()*60+now.getHours()*60*60
}

function resetBall(){
    ball.position = new Vector2(50, 50*game.unitY)
    ball.velocity = new Vector2((-Math.random()*100)+50, (-Math.random()*100)+50).unit().mul(ballSpeed)
}

function reset(){
    resetBall()
    score = [0, 0]
    player2.position = new Vector2(2, game.unitY*50)
    player2.position = new Vector2(100-2, game.unitY*50)
}
reset()

let mode = "playerXplayer"

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

window.addEventListener("keydown", (event) => {
    if (event.key == "m"){
        openMenu()
    }
    if (playing){
        if (mode != "botXbot" && event.key == "w" && player1.position.y > player1.size.y/2){
            player1.position = player1.position.add(new Vector2(0, -playerSpeed))
        }
        if (mode!="botXbot" && event.key == "s" && player1.position.y < game.unitY*100-player1.size.y/2){
            player1.position = player1.position.add(new Vector2(0, playerSpeed))
        }
        
        if (mode == "playerXplayer" && event.key == "ArrowUp" && player2.position.y > player2.size.y/2){
            player2.position = player2.position.add(new Vector2(0, -playerSpeed))
        }
        if (mode == "playerXplayer" && event.key == "ArrowDown" && player2.position.y < game.unitY*100-player2.size.y/2){
            player2.position = player2.position.add(new Vector2(0, playerSpeed))
        }
    }
})

game.updateFrame = (dt) => {
    if (playing){
        ball.position = ball.position.add(ball.velocity.mul(dt))
        if (ball.position.x-ball.size.x/2 < 0){
            ball.velocity = new Vector2(-ball.velocity.x, ball.velocity.y)
            if (getTime()-lastTimeScored > 2){
                score[1] += 1
                lastTimeScored = getTime()
            }
        }
        if (ball.position.x+ball.size.x/2 > 100){
            ball.velocity = new Vector2(-ball.velocity.x, ball.velocity.y)
            if (getTime()-lastTimeScored > 2){
                score[0] += 1
                lastTimeScored = getTime()
            }
        }
        if (ball.position.y-ball.size.y/2 < 0){
            ball.velocity = new Vector2(ball.velocity.x, -ball.velocity.y)
        }
        if (ball.position.y+ball.size.y/2 > game.unitY*100){
            ball.velocity = new Vector2(ball.velocity.x, -ball.velocity.y)
        }

        let [collision, ballPosition, ballVelocity] = game.checkCollision(ball, player1)
        if (collision){
            ball.velocity = new Vector2(-ball.velocity.x, ball.velocity.y)
        }

        let [collision2, ballPosition2, ballVelocity2] = game.checkCollision(ball, player2)
        if (collision2){
            ball.velocity = new Vector2(-ball.velocity.x, ball.velocity.y)
        }

        if (mode=="botXbot"){
            if (player1.position.y-ball.position.y < 0){
                player1.position.y += playerSpeed*4*dt
            }else{
                player1.position.y -= playerSpeed*4*dt
            }
        }
        
        if (mode!="playerXplayer"){
            if (player2.position.y-ball.position.y < 0){
                player2.position.y += playerSpeed*Math.random()*5*dt
            }else{
                player2.position.y -= playerSpeed*Math.random()*5*dt
            }
        }
        
    }
    
}

const scoreBoard = document.getElementById("scoreBoard")

game.drawFrame = () => {
    scoreBoard.innerHTML = score[0]+" x "+score[1]
}