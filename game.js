class Vector2{
    constructor(x=0, y=0){
        this.x = x
        this.y = y
    }
    text(){
        return `(${this.x}, ${this.y})`
    }
    rText(precision=10){
        return `(${Math.round(this.x*precision)/precision}, ${Math.round(this.y*precision)/precision})`
    }
    add(other){
        return new Vector2(this.x+other.x, this.y+other.y)
    }
    sub(other){
        return new Vector2(this.x-other.x, this.y-other.y)
    }
    mul(other){
        if (typeof(other) == "number"){
            return new Vector2(this.x*other, this.y*other)
        }else{
            return new Vector2(this.x*other.x, this.y*other.y)
        }
    }
    div(other){
        if (typeof(other) == "number"){
            return new Vector2(this.x/other, this.y/other)
        }else{
            return new Vector2(this.x/other.x, this.y/other.y)
        }
    }
    magnitude(){
        return Math.sqrt(this.x*this.x+this.y*this.y)
    }
    unit(){
        return this.div(this.magnitude())
    }
    //Reverificar
    rotate(angle){
        let vertice = this
        angle = angle.mul(Math.PI).div(180)
        vertice = new Vector2(vertice.x, vertice.y*Math.cos(angle.x))
        vertice = new Vector2(vertice.x*Math.cos(angle.y), vertice.y)
        return vertice
    }
}

const game = {
    config: {
        FPS: 60
    },
    world: [],
    camera: {
        position: new Vector2(0, 0),
        velocity: new Vector2(0, 0),
        rotation: 0,
        zoom: 1
    },
    
    canvas: undefined,
    backgroundColor: "black",
    ctx: undefined,
    unitY: 0,
    running: false
}

game.start = (canvas) => {
    const body = document.body
    body.style.height = "100%"
    body.style.margin = 0
    body.style.padding = 0
    
    /**@type {HTMLCanvasElement}*/
    game.canvas = canvas
    game.canvas.style.width = "100vw"
    game.canvas.style.height = "100vh"
    game.canvas.style.display = "block"
    game.canvas.height = window.innerHeight
    game.canvas.width = window.innerWidth
    game.canvas.style.zIndex = 0
    game.unitY = canvas.height/canvas.width
    game.running = true
    game.ctx = game.canvas.getContext("2d")
}

class Sprite{
    constructor(name, size, position){
        this.name = name
        this.size = size
        this.position = position
        this.image = new Image()
        game.world.push(this)
    }
}


game.checkCollision = (sprite, other) => {
    let velocity, position
    let collision = false
    if (sprite.position.x-sprite.size.x/2 < other.position.x+other.size.x/2 && sprite.position.y-sprite.size.y/2 < other.position.y+other.size.y/2 && sprite.position.y+sprite.size.y/2 > other.position.y-other.size.y/2 && sprite.position.x+sprite.size.x/2 > other.position.x-other.size.x/2){
        collision = true
        velocity = new Vector2(sprite.velocity.x, sprite.velocity.y)
        position = new Vector2(other.position.x+other.size.x/2+other.size.x/2, sprite.position.y)
    }
    return [collision, position, velocity]
}

game.updateFrame = (dt) => {}
game.drawFrame = () => {}

const wait = time => new Promise(res => setTimeout(res, time))
async function _load(){
    while (true){
        const dt = 1/game.config.FPS
        if (game.running){
            game.canvas.height = window.innerHeight
            game.canvas.width = window.innerWidth
            windowY = canvas.height/canvas.width
            game.updateFrame(dt)
            game.unitY = canvas.height/canvas.width
            game.ctx.fillStyle = game.backgroundColor
            game.ctx.fillRect(0, 0, canvas.width, canvas.height)
            const unit = canvas.width/100
            game.ctx.imageSmoothingEnabled = false
            for (sprite of game.world){
                game.ctx.drawImage(sprite.image, (sprite.position.x-sprite.size.x/2)*unit, (sprite.position.y-sprite.size.y/2)*unit, sprite.size.x*unit, sprite.size.y*unit)
            }

            game.drawFrame()
        }
        
        await wait(dt*1000)
    }
}
_load()