import { MAX_WIDTH, MAX_HEIGHT, Platforms, G } from '../index.js'
import { Character } from './character.js'

let lastNPCId = 0

export class NPC extends Character{
    constructor() {
        super(`npc`)

        // id
        this.id = ++lastNPCId

        // visual
        this.killcount = document.createElement('span')
        this.killcount.classList.add('killcount')
        this.visual.appendChild(this.killcount)
        this.left = Math.random() * (MAX_WIDTH - this.width);
        this.bottom = MAX_HEIGHT

        // properties
        this.kills = 0
        this.speed = Math.random()>0.5 ? 2 : -2

        // spawn
        this.spawn()
    }

    render() {
        let lastTick = Date.now();
        clearInterval(this.renderId)
        this.renderId = setInterval( () => {

            if(this.bottom < 0 ) this.die();

            if(this.vSpeed < 0 && !this.dying){
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
        this.vSpeed = 0
        this.dying = false
        this.bottom = MAX_HEIGHT
        this.left = Math.random() * (MAX_WIDTH - this.width);
        this.visual.classList.remove('dead')
        this.render()
    }
}
