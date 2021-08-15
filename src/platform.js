import { Grid, MAX_WIDTH, MAX_HEIGHT } from '../index.js'
const DIRS = ["left", "up", "down", "right", "still"]
const MAX_PLATFORM_SPEED = 5;

export class Platform {
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
