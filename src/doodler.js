import { Grid, MAX_WIDTH, MAX_HEIGHT, Platforms, NPCs, Drops, IsGameover, G, gameover } from '../index.js'
import { Character } from './character.js'

const JUMP_SPEED = 250
const JUMP_BOOST = 200
const COOLDOWN_SEC = 5
const AGE_INVINCIBILITY_SEC = 3
const HOTDOG_DURATION_SEC = 8
const WINGS_DURATION_SEC = 8
const PIZZA_DURATION_SEC = 8
let lastDoodlerId = 0

// gravity
// S = v0*t + 0.5*gt^2
// v = v0 + gt
export class Doodler extends Character {
    constructor() {

        super(`player${++lastDoodlerId}`)

        // id
        this.id = lastDoodlerId

        // properties
        this.invincible = false
        this.age = 0
        this.drops = 0
        this.boosting = false
        this.crawling = false
        this.flying = false
        this.bombing = false

        // iterval ids
        this.coolId = null
        this.spawnId = null
        this.invincibleId = null
        this.flyingId = null
        this.bombingId = null


        // cooldown div
        this.cooldownDiv = document.createElement('div')
        this.cooldownDiv.style.left = MAX_WIDTH * (2 * this.id - 1) / 4 + "px";
        this.cooldownDiv.style.bottom = MAX_HEIGHT/2 + "px";
        Grid.appendChild(this.cooldownDiv)

        // score and icon div
        this.score = 0
        this.scoreDiv = document.createElement('div')
        this.scoreDiv.classList.add(`score${this.id}`)
        const icon = document.createElement('div')
        icon.classList.add(`icon${this.id}`)
        Grid.appendChild(icon)
        Grid.appendChild(this.scoreDiv)

        // spawn
        this.restart()
    }

    render() {
        let lastTick = Date.now();
        this.cooldownDiv.innerHTML = ''
        clearInterval(this.coolId)
        clearInterval(this.renderId)
        clearInterval(this.spawnId)
        this.renderId = setInterval( () => {

            if( this.bottom < 0 ){
                if(this.bombing && !this.dying) this.bottom = MAX_HEIGHT;
                else this.die()
            }

            for(let i in Drops){
                const item = Drops[i]
                if( this.bottom + this.height >= item.bottom &&
                    this.bottom <= item.bottom + item.height &&
                    this.left + this.width >= item.left &&
                    this.left <= item.left + item.width &&
                    !this.dying)
                {
                    item.destroy()
                    Drops.splice(i, 1)
                    this.drops++
                    if(item.type == "hotdog") this.setInvincible(HOTDOG_DURATION_SEC * 1000)
                    if(item.type == "wings") this.setFlying(WINGS_DURATION_SEC * 1000)
                    if(item.type == "pizza") this.setBombing(PIZZA_DURATION_SEC * 1000)
                    break;
                }
            }

            for(let npc of NPCs){
                if( this.age > AGE_INVINCIBILITY_SEC &&
                    this.bottom + this.height >= npc.bottom &&
                    this.bottom <= npc.bottom + npc.height &&
                    this.left + this.width >= npc.left &&
                    this.left <= npc.left + npc.width &&
                    !npc.dying &&
                    !this.dying)
                {
                    if( this.invincible ||
                        this.bombing ||
                        this.vSpeed < 0 &&
                        this.bottom > npc.bottom + npc.height/2 &&
                        this.bottom <= npc.bottom + npc.height)
                    {
                        this.kills++;
                        this.scoreDiv.innerHTML = ++this.score;
                        npc.dying = true
                        npc.visual.classList.add('dead')
                    }
                    else {
                        npc.killcount.innerHTML = ++npc.kills
                        this.dying = true
                        this.visual.classList.add('dead')
                        break
                    }
                }
            }
            if(this.vSpeed < 0 && !this.dying){
                for(let platform of Platforms){
                    if( this.bottom >= platform.bottom &&
                        this.bottom <= platform.bottom + platform.height &&
                        this.left + this.width >= platform.left &&
                        this.left <= platform.left + platform.width &&
                        !this.crawling &&
                        !this.bombing)
                    {
                        if(!platform.scored){
                            if(!IsGameover) this.scoreDiv.innerHTML = ++this.score;
                            platform.scored = this.id;
                            platform.visual.classList.add(`platform-scored${this.id}`)
                            if(!Platforms.find(platform => platform.scored == 0)) gameover();
                        }
                        this.vSpeed = JUMP_SPEED + (this.boosting ? JUMP_BOOST : 0)
                    }
                }

            }
            const tdelta = (Date.now() - lastTick) / 1000;
            let sdelta = this.vSpeed * tdelta + 0.5 * G * tdelta**2
            this.vSpeed -= G * tdelta
            if(this.flying && !this.dying){
                this.vSpeed = this.boosting ? 8 : -8
                sdelta = this.boosting ? 3 : -3
            }
            this.move(this.dying ? 0 : this.speed, sdelta)
            lastTick = Date.now();
            this.age += tdelta

        }, 20)
    }

    setInvincible(duration) {
        this.visual.classList.add('invincible')
        clearTimeout(this.invincibleId)
        this.invincible = true
        this.invincibleId = setTimeout(() => {
            this.visual.classList.remove(`invincible`)
            this.invincible = false
            this.crawling = false
        }, duration)
    }

    setFlying(duration) {
        this.visual.classList.add('flying')
        clearTimeout(this.flyingId)
        this.flying = true
        this.flyingId = setTimeout(() => {
            this.visual.classList.remove(`flying`)
            this.flying = false
            this.crawling = false
        }, duration)
    }

    setBombing(duration) {
        this.visual.classList.add('bombing')
        clearTimeout(this.bombingId)
        this.bombing = true
        this.bombingId = setTimeout(() => {
            this.visual.classList.remove(`bombing`)
            this.bombing = false
            this.bottom = MAX_HEIGHT
        }, duration)
    }

    die() {
        clearInterval(this.renderId)
        this.visual.classList.remove(`player${this.id}`)
        let countdown = COOLDOWN_SEC
        this.cooldownDiv.classList.add(`countdown`)
        this.cooldownDiv.innerHTML = countdown;
        this.coolId = setInterval(()=> {
            this.cooldownDiv.innerHTML = --countdown;
        }, 1000)
        this.spawnId = setTimeout(() => {
            this.cooldownDiv.classList.remove(`countdown`)
            this.cooldownDiv.innerHTML = "";
            this.spawn()
        }, COOLDOWN_SEC * 1000)
    }

    restart() {
        this.score = 0;
        this.scoreDiv.innerHTML = "0"
        this.spawn()
    }

    spawn() {
        this.left = MAX_WIDTH * (2 * this.id - 1) / 4
        this.bottom = MAX_HEIGHT / 2
        this.dying = false
        this.visual.classList.add(`player${this.id}`)
        this.visual.classList.remove('dead')
        this.age = 0
        this.vSpeed = 0
        this.render()
    }
}