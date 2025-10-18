game.config.FPS = 60

let windowY = canvas.height/canvas.width

const Imagem = new Image()
Imagem.src = "assets/ball.png"


let player1 = new Sprite("player1", new vector2(3, 20), new vector2(2, windowY*50))
player1.color = "blue"
player1.image.src = "assets/player1.png"
let player2 = new Sprite("player2", new vector2(3, 20), new vector2(100-2, windowY*50))
player2.color = "red"
player2.image.src = "assets/player2.png"
let ball = new Sprite("ball", new vector2(2, 2), new vector2(50, 50*windowY))
ball.velocity = new vector2(0, 0)
ball.image.src = "assets/ball.png"
let playerSpeed = 5
let ballSpeed = 100
score = [0, 0]

let lastTimeScored = 1e+5

function getTime(){
    const now = new Date()
    return now.getMilliseconds()+now.getSeconds()*1000+now.getMinutes()*1000*60
}

function resetBall(){
    ball.position = new vector2(50, 50*windowY)
    ball.velocity = new vector2((-Math.random()*100)+50, (-Math.random()*100)+50).unit().mul(ballSpeed)
}

function reset(){
    resetBall()
    score = [0, 0]
}
reset()

window.addEventListener("keydown", (event) => {
    if (event.key == "r"){
        reset()
    }
    if (event.key == "w" && player1.position.y > player1.size.y/2){
        player1.position = player1.position.add(new vector2(0, -playerSpeed))
    }
    if (event.key == "s" && player1.position.y < windowY*100-player1.size.y/2){
        player1.position = player1.position.add(new vector2(0, playerSpeed))
    }
    
    if (event.key == "ArrowUp" && player2.position.y > player2.size.y/2){
        player2.position = player2.position.add(new vector2(0, -playerSpeed))
    }
    if (event.key == "ArrowDown" && player2.position.y < windowY*100-player2.size.y/2){
        player2.position = player2.position.add(new vector2(0, playerSpeed))
    }
})

game.updateFrame = (dt) => {
    ball.position = ball.position.add(ball.velocity.mul(dt))
    if (ball.position.x-ball.size.x/2 < 0){
        ball.velocity = new vector2(-ball.velocity.x, ball.velocity.y)
        if (getTime()-lastTimeScored > 3000){
            score[1] += 1
            lastTimeScored = getTime()
        }
    }
    if (ball.position.x+ball.size.x/2 > 100){
        ball.velocity = new vector2(-ball.velocity.x, ball.velocity.y)
        if (getTime()-lastTimeScored > 3000){
            score[0] += 1
            lastTimeScored = getTime()
        }
    }
    if (ball.position.y-ball.size.y/2 < 0){
        ball.velocity = new vector2(ball.velocity.x, -ball.velocity.y)
    }
    if (ball.position.y+ball.size.y/2 > windowY*100){
        ball.velocity = new vector2(ball.velocity.x, -ball.velocity.y)
    }

    let [collision, ballPosition, ballVelocity] = game.checkCollision(ball, player1)
    if (collision){
        ball.velocity = new vector2(-ball.velocity.x, ball.velocity.y)
    }

    let [collision2, ballPosition2, ballVelocity2] = game.checkCollision(ball, player2)
    if (collision2){
        ball.velocity = new vector2(-ball.velocity.x, ball.velocity.y)
    }
    if (player1.position.y-ball.position.y < 0){
        player1.position.y += playerSpeed*4*dt
    }else{
        player1.position.y -= playerSpeed*4*dt
    }
    if (player2.position.y-ball.position.y < 0){
        player2.position.y += playerSpeed*Math.random()*5*dt
    }else{
        player2.position.y -= playerSpeed*Math.random()*5*dt
    }
}

game.drawFrame = () => {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const unit = canvas.width/100
    windowY = canvas.height/canvas.width
    ctx.imageSmoothingEnabled = false
    for (sprite of game.world){
        ctx.drawImage(sprite.image, (sprite.position.x-sprite.size.x/2)*unit, (sprite.position.y-sprite.size.y/2)*unit, sprite.size.x*unit, sprite.size.y*unit)
    }
    ctx.fillStyle = "white"
    ctx.font = "bold 50px verdana"
    ctx.fillText(score[0]+" x "+score[1], unit*46.5, unit*5)
}