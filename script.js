game.config.FPS = 60

let player1 = new Sprite("player1", new vector2(3, 15), new vector2(1, 25-15))
player1.color = "blue"
let player2 = new Sprite("player2", new vector2(3, 15), new vector2(94, 25-15))
player2.color = "red"
let ball = new Sprite("ball", new vector2(2, 2), new vector2(49, 49))
ball.velocity = new vector2(0, 0)
let playerSpeed = 5
let ballSpeed = 100
score = [0, 0]

function reset(){
    score = [0, 0]
    ball.position = new vector2(49, 49)
    let r = Math.random()-0.5
    let n = 1
    if (r < 0){n = -1}
    ball.velocity = new vector2((Math.random()*30+20)*n, (Math.random()*30+20)*n).unit().mul(ballSpeed)
}
reset()

window.addEventListener("keydown", (event) => {
    if (event.key == "r"){
        reset()
    }
    if (event.key == "s" && player1.position.y < 40){
        player1.position = player1.position.add(new vector2(0, playerSpeed))
    }
    if (event.key == "w" && player1.position.y > 0){
        player1.position = player1.position.add(new vector2(0, -playerSpeed))
    }
    if (event.key == "ArrowDown" && player2.position.y < 40){
        player2.position = player2.position.add(new vector2(0, playerSpeed))
    }
    if (event.key == "ArrowUp" && player2.position.y > 0){
        player2.position = player2.position.add(new vector2(0, -playerSpeed))
    }
})

game.updateFrame = (dt) => {
    ball.position = ball.position.add(ball.velocity.mul(dt))
    

    if (ball.position.x < 0){
        ball.velocity = new vector2(-ball.velocity.x, ball.velocity.y)
        score[1] += 1
    }
    if (ball.position.x > 100){
        ball.velocity = new vector2(-ball.velocity.x, ball.velocity.y)
        score[0] += 1
    }
    if (ball.position.y < 0){
        ball.velocity = new vector2(ball.velocity.x, -ball.velocity.y)
    }
    if (ball.position.y > 55){
        ball.velocity = new vector2(ball.velocity.x, -ball.velocity.y)
    }
    if (ball.position.x < player1.size.x+player1.position.x && ball.position.y > player1.position.y && ball.position.y < player1.position.y+player1.size.y){
        ball.velocity = new vector2(-ball.velocity.x, ball.velocity.y)
        ball.position = new vector2(player1.size.x+player1.position.x, ball.position.y)
    }
    if (ball.position.x > player2.position.x && ball.position.y > player2.position.y && ball.position.y < player2.position.y+player2.size.y){
        ball.velocity = new vector2(-ball.velocity.x, ball.velocity.y)
        ball.position = new vector2(player2.position.x, ball.position.y)
    }
}

game.drawFrame = () => {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    const unit = canvas.width/100
    for (sprite of game.world){
        ctx.fillStyle = sprite.color
        ctx.fillRect(sprite.position.x*unit, sprite.position.y*unit, sprite.size.x*unit, sprite.size.y*unit)
    }
    ctx.fillStyle = "white"
    ctx.font = "bold 50px verdana"
    ctx.fillText(score[0]+" x "+score[1], canvas.width/100*46.5, canvas.height/100*5)
    ctx.beginPath()
    ctx.arc(250, 300, 150, 0, Math.PI*2)
    ctx.stroke()
}