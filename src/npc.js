import { Grid, MAX_WIDTH, MAX_HEIGHT, Platforms, G } from '../index.js'


export class NPC {
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
        this.dying = false
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
        this.left = Math.random() * MAX_WIDTH;
        this.bottom = MAX_HEIGHT
        this.visual.classList.add(`npc`)
        this.dying = false
        this.visual.classList.remove('dead')
        this.render()
    }
}
