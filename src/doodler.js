import { Grid, MAX_WIDTH, MAX_HEIGHT, Platforms, NPCs, Keys, IsGameover, G, gameover } from '../index.js'

const JUMP_SPEED = 250
const JUMP_BOOST = 200
const COOLDOWN_SEC = 5
const AGE_INVINCIBILITY_SEC = 3

// gravity
// S = v0*t + 0.5*gt^2
// v = v0 + gt
export class Doodler {
    constructor(num) {
        this.id = num
        this.visual = document.createElement('div')
        Grid.appendChild(this.visual)
        this.renderId = null
        this.coolId = null
        this.width = 75
        this.height = 75
        this.age = 0
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
                if( this.age > AGE_INVINCIBILITY_SEC &&
                    this.bottom >= npc.bottom &&
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
            this.age += tdelta

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
        this.age = 0
    }
}