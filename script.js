game.config.FPS = 60
game.cSize = (size) => {
    //unit to pixels
    return size/canvas.width*100
}
game.cPos = (position) => {
    //unit to pixels
    return new vector2(position.x/canvas.width, position.y/canvas.height)
}
let playerList = []
class p{
    constructor(name, position, color){
        this.name = name
        this.position = position
        this.size = new vector2(3, 30)
        this.color = color
        playerList.push(this)
    }
}
let player1 = new p("player1", new vector2(1, 50-15), "blue")
let player2 = new p("player2", new vector2(94, 50-15), "red")
let playerSpeed = 20
let ballSpeed = 100
score = [0, 0]

let ball = {
    "diameter": 2,
    "position": new vector2(49, 49),
    "velocity": new vector2()
}

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
    if (event.key == "s" && player1.position.y < 100-30){
        player1.position = player1.position.add(new vector2(0, playerSpeed))
    }
    if (event.key == "w" && player1.position.y > 0){
        player1.position = player1.position.add(new vector2(0, -playerSpeed))
    }
    if (event.key == "ArrowDown" && player2.position.y < 100-30){
        player2.position = player2.position.add(new vector2(0, playerSpeed))
    }
    if (event.key == "ArrowUp" && player2.position.y > 0){
        player2.position = player2.position.add(new vector2(0, -playerSpeed))
    }
})

game.updateFrame = (dt) => {
    ball.position = ball.position.add(ball.velocity.mul(dt))
    //console.log(ball.position.rText())
    let dist = Math.abs(player1.position.y-(ball.position.y-player1.size.y/2))
    if (dist>5){
        if (player1.position.y < ball.position.y-player1.size.y/2){
            player1.position.y += playerSpeed*dt*(Math.random()*3+1)
        }else{
            player1.position.y -= playerSpeed*dt*(Math.random()*3+1)
        }
    }
    dist = Math.abs(player2.position.y-(ball.position.y-player2.size.y/2))
    if (dist>5){
        if (player2.position.y < ball.position.y-player2.size.y/2){
            player2.position.y += playerSpeed*dt*(Math.random()*3+1)
        }else{
            player2.position.y -= playerSpeed*dt*(Math.random()*3+1)
        }
    }
    

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
    if (ball.position.y > 100){
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
    for (player of playerList){
        ctx.fillStyle = player.color
        ctx.fillRect(player.position.x*canvas.width/100, player.position.y*canvas.height/100, player.size.x*canvas.width/100, player.size.y*canvas.height/100)
    }
    ctx.fillStyle = "white"
    ctx.fillRect(ball.position.x*canvas.width/100, ball.position.y*canvas.height/100, ball.diameter*canvas.width/100, ball.diameter*canvas.width/100)
    ctx.font = "bold 50px verdana"
    ctx.fillText(score[0]+" x "+score[1], canvas.width/100*46.5, canvas.height/100*5)
    ctx.beginPath()
    ctx.arc(250, 300, 150, 0, Math.PI*2)
    ctx.stroke()
}