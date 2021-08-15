const Platforms = []
const Players = []
const NPCs = []
const Keys = {}
const DIRS = ["left", "up", "down", "right", "still"]
const G = 400
const JUMP_SPEED = 250
const JUMP_BOOST = 200
const MAX_PLATFORM_SPEED = 5;
const COOLDOWN_SEC = 5
const Grid = document.querySelector('.grid')
const MAX_WIDTH = document.body.offsetWidth
const MAX_HEIGHT = document.body.offsetHeight
const PLATFORM_COUNT = Math.floor( MAX_WIDTH / 50) || PLATFORM_COUNT
const GameoverDiv = document.createElement('div')
Grid.appendChild(GameoverDiv)
let IsGameover = false;

class Platform {
    constructor() {
        this.width = 100
        this.height = 15
        this.left = Math.max(0, Math.random() * MAX_WIDTH - this.width)
        this.bottom = Math.max(0, Math.random() * MAX_HEIGHT - this.height - 100)
        this.moving = DIRS[Math.floor(Math.random() * DIRS.length)]
        this.scored = 0
        this.speed = Math.random() * MAX_PLATFORM_SPEED;
        this.visual = document.createElement('div')
        const visual = this.visual
        visual.classList.add('platform')
        visual.style.left = this.left + 'px'
        visual.style.bottom = this.bottom + 'px'
        Grid.appendChild(visual)
    }

    update() {
        if(this.moving == "up"){
            this.move(0, this.speed);
            if(this.bottom > MAX_HEIGHT - this.height * 3 - this.speed) this.moving = "down"
        }
        else if(this.moving == "down"){
            this.move(0, -this.speed);
            if(this.bottom < 0) this.moving = "up"
        }
        else if(this.moving == "left"){
            this.move(-this.speed, 0);
            if(this.left < 0) this.moving = "right"
        }
        else if(this.moving == "right"){
            this.move(this.speed, 0);
            if(this.left > MAX_WIDTH - this.width - this.speed) this.moving = "left"
        }
    }

    move(x, y){

        this.bottom += y;
        this.left += x;
        this.visual.style.left = this.left + 'px'
        this.visual.style.bottom = this.bottom + 'px'
    }
}

// gravity
// S = v0*t + 0.5*gt^2
// v = v0 + gt
class Doodler {
    constructor(num) {
        this.id = num
        this.visual = document.createElement('div')
        Grid.appendChild(this.visual)
        this.renderId = null
        this.coolId = null
        this.width = 75
        this.height = 75
        this.cooldownDiv = document.createElement('div')
        this.cooldownDiv.style.left = MAX_WIDTH * (2 * this.id - 1) / 4 + "px";
        this.cooldownDiv.style.bottom = MAX_HEIGHT/2 + "px";
        this.scoreDiv = document.createElement('div')
        this.scoreDiv.classList.add(`score${this.id}`)
        const icon = document.createElement('div')
        icon.classList.add(`icon${this.id}`)
        Grid.appendChild(icon)
        Grid.appendChild(this.scoreDiv)
        Grid.appendChild(this.cooldownDiv)
        this.restart()
    }

    move(x, y){
        this.bottom += y;
        this.left += x;
        if(this.left < 0) this.left = 0;
        if(this.left + this.width + 10 > MAX_WIDTH) this.left = MAX_WIDTH - this.width - 10;
        this.visual.style.bottom = this.bottom + 'px';
        this.visual.style.left = this.left + 'px';
    }

    render() {
        this.vSpeed = 0
        let lastTick = Date.now();
        clearInterval(this.coolId)
        clearInterval(this.renderId)
        this.renderId = setInterval( () => {

            if( this.bottom < 0 ){
                this.die()
                return
            }

            for(let npc of NPCs){
                if(this.bottom >= npc.bottom &&
                    this.bottom <= npc.bottom + npc.height &&
                    this.left + this.width > npc.left &&
                    this.left < npc.left + npc.width)
                {
                    npc.killcount.innerHTML = ++npc.kills
                    this.die()
                    return
                }
            }
            if(this.vSpeed < 0){
                for(let platform of Platforms){
                    if( this.bottom >= platform.bottom &&
                        this.bottom <= platform.bottom + platform.height &&
                        this.left + this.width > platform.left &&
                        this.left < platform.left + platform.width &&
                        !(this.id == 2 && Keys["ArrowDown"]) &&
                        !(this.id == 1 && Keys["s"]))
                    {
                        if(!platform.scored){
                            if(!IsGameover) this.scoreDiv.innerHTML = ++this.score;
                            platform.scored = this.id;
                            platform.visual.classList.add(`platform-scored${this.id}`)
                            if(!Platforms.find(platform => platform.scored == 0)) gameover();
                        }
                        this.vSpeed = JUMP_SPEED
                        if(this.id == 2 && Keys["ArrowUp"] || this.id == 1 && Keys["w"]){
                            this.vSpeed += JUMP_BOOST;
                        }
                    }
                }

            }
            const tdelta = (Date.now() - lastTick) / 1000;
            const sdelta = this.vSpeed * tdelta + 0.5 * G * tdelta**2
            this.vSpeed -= G * tdelta
            this.move(0, sdelta)
            lastTick = Date.now();

        }, 20)
    }

    die() {
        clearInterval(this.renderId)
        this.stop()
        let countdown = COOLDOWN_SEC
        this.cooldownDiv.classList.add(`countdown`)
        this.cooldownDiv.innerHTML = countdown;
        this.coolId = setInterval(()=> {
            this.cooldownDiv.innerHTML = --countdown;
        }, 1000)
        setTimeout(() => {
            this.cooldownDiv.classList.remove(`countdown`)
            this.cooldownDiv.innerHTML = "";
            this.spawn()
        }, COOLDOWN_SEC * 1000)
    }

    stop() {
        clearInterval(this.renderId)
        this.visual.classList.remove(`player${this.id}`)
    }

    restart() {
        this.score = 0;
        this.scoreDiv.innerHTML = "0"
        this.spawn()
    }

    spawn() {
        this.left = MAX_WIDTH * (2 * this.id - 1) / 4;
        this.bottom = MAX_HEIGHT/2
        this.render()
        this.visual.classList.add(`player${this.id}`)
    }
}

class NPC {
    constructor(num) {
        this.id = num
        this.visual = document.createElement('div')
        Grid.appendChild(this.visual)
        this.killcount = document.createElement('span')
        this.killcount.classList.add('killcount')
        this.visual.appendChild(this.killcount)
        this.renderId = null
        this.width = 75
        this.height = 75
        this.kills = 0
        this.spawn()
        this.speed = Math.random()>0.5 ? 2 : -2;
    }

    move(x, y){
        this.bottom += y;
        this.left += x;
        if(this.left < 0){
            this.left = 0;
            this.speed = Math.abs(this.speed)
        }
        if(this.left + this.width + 10 > MAX_WIDTH) {
            this.left = MAX_WIDTH - this.width - 10;
            this.speed = - Math.abs(this.speed)
        }
        this.visual.style.bottom = this.bottom + 'px';
        this.visual.style.left = this.left + 'px';
    }

    render() {
        this.vSpeed = 0
        let lastTick = Date.now();
        this.renderId = setInterval( () => {

            if(this.bottom < 0 ) this.die();

            if(this.vSpeed < 0){
                for(let platform of Platforms){
                    if( this.bottom >= platform.bottom &&
                        this.bottom <= platform.bottom + platform.height &&
                        this.left + this.width > platform.left &&
                        this.left < platform.left + platform.width )
                    {
                        this.vSpeed = Math.random() * 300;
                        break
                    }
                }
            }
            const tdelta = (Date.now() - lastTick) / 1000;
            const sdelta = this.vSpeed * tdelta + 0.5 * G * tdelta**2
            this.vSpeed -= G * tdelta
            this.move(this.speed, sdelta)
            lastTick = Date.now();

        }, 20)
    }

    die() {
        clearInterval(this.renderId)
        this.spawn()
    }

    spawn() {
        this.left = Math.random() * MAX_WIDTH;
        this.bottom = MAX_HEIGHT
        this.render()
        this.visual.classList.add(`npc`)
    }
}

function createPlatforms() {
    for(let i = 0; i < PLATFORM_COUNT; i++) {
        Platforms.push(new Platform())
    }
}

function movePlatforms(){
    setInterval( function() {
        for(let platform of Platforms) {
            platform.update();
        }

    }, 50)
}

function gameover(){

    IsGameover = true;
    GameoverDiv.classList.add('gameover')
}

function restart() {
    for(let p of Players){
        p.restart()
    }
    IsGameover = false;
    GameoverDiv.classList.remove('gameover')
    Platforms.forEach(platform => {
        platform.scored = 0;
        platform.visual.classList.remove('platform-scored1')
        platform.visual.classList.remove('platform-scored2')
    })
    NPCs.forEach(npc => {
        npc.killcount.innerHTML = ""
        npc.kills = 0
    })
}

document.addEventListener('keydown', (e) => {
    if(IsGameover){
        if(e.key === ' ') {
            restart()
        }
    }
    else {
        Keys[e.key] = true;
    }
    e.preventDefault();
}, false);

document.addEventListener('keyup', (e) => {
    Keys[e.key] = false;
}, false);

setInterval( () => {
    if(IsGameover) return;
    if(Keys['ArrowLeft']) {
        Players[1].move(-4, 0);
    }
    if (Keys['ArrowRight']) {
        Players[1].move(4, 0);
    }
    if(Keys['a']) {
        Players[0].move(-4, 0);
    }
    if (Keys['d']) {
        Players[0].move(4, 0);
    }

}, 20)


function start() {
    createPlatforms()
    movePlatforms()
    Players.push(new Doodler(1))
    Players.push(new Doodler(2))
    NPCs.push(new NPC(1))
    NPCs.push(new NPC(2))
    NPCs.push(new NPC(3))
    // GameoverDiv.classList.add('gameover')
    // GameoverDiv.classList.add('player1')
}
start()