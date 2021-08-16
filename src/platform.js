import { Grid, MAX_WIDTH, MAX_HEIGHT } from '../index.js'
const DIRS = ["left", "up", "down", "right", "still"]
const MAX_PLATFORM_SPEED = 5;

export class Platform {
    constructor() {
        // visual
        this.visual = document.createElement('div')
        this.visual.classList.add('platform')
        Grid.appendChild(this.visual)
        this.height = this.visual.clientHeight
        this.width = this.visual.clientWidth
        this.left = Math.random() * (MAX_WIDTH - this.width)
        this.bottom = Math.random() * (MAX_HEIGHT - this.height - 100)
        this.visual.style.left = this.left + 'px'
        this.visual.style.bottom = this.bottom + 'px'

        // properties
        this.moving = DIRS[Math.floor(Math.random() * DIRS.length)]
        this.scored = 0
        this.speed = Math.random() * MAX_PLATFORM_SPEED;
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
