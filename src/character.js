import { Grid, MAX_WIDTH } from '../index.js'

export class Character {
    constructor(classname) {

        // character div and geometry
        this.visual = document.createElement('div')
        this.visual.classList.add(classname)
        Grid.appendChild(this.visual)
        this.height = this.visual.clientHeight
        this.width = this.visual.clientWidth

        this.dying = false
        this.speed = 0
        this.vSpeed = 0

        this.renderId = null
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
}