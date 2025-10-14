class vector2{
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
        return new vector2(this.x+other.x, this.y+other.y)
    }
    sub(other){
        return new vector2(this.x-other.x, this.y-other.y)
    }
    mul(other){
        if (typeof(other) == "number"){
            return new vector2(this.x*other, this.y*other)
        }else{
            return new vector2(this.x*other.x, this.y*other.y)
        }
    }
    div(other){
        if (typeof(other) == "number"){
            return new vector2(this.x/other, this.y/other)
        }else{
            return new vector2(this.x/other.x, this.y/other.y)
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
        vertice = new vector2(vertice.x, vertice.y*Math.cos(angle.x))
        vertice = new vector2(vertice.x*Math.cos(angle.y), vertice.y)
        return vertice
    }
}

let body = document.body
/**@type {HTMLCanvasElement}*/
let canvas = document.getElementById("canvas")

body.style.height = "100%"
body.style.margin = 0
body.style.padding = 0
canvas.style.width = "100vw"
canvas.style.height = "100vh"
canvas.style.display = "block"
canvas.height = window.innerHeight
canvas.width = window.innerWidth

let ctx = canvas.getContext("2d")

const game = {
    config: {
        "FPS": 12
    }
}
game.updateFrame = (dt) => {}
game.drawFrame = () => {}

game.config.FPS = 12
const wait = time => new Promise(res => setTimeout(res, time))
async function _load(){
    while (true){
        const dt = 1/game.config.FPS
        canvas.height = window.innerHeight
        canvas.width = window.innerWidth
        game.updateFrame(dt)
        game.drawFrame()
        await wait(dt*1000)
    }
}
_load()