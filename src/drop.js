import { Grid, MAX_WIDTH, MAX_HEIGHT } from '../index.js'

let lastDropId = 0

export class Drop {
    constructor() {
        this.id = ++lastDropId
        this.visual = document.createElement('div')
        this.visual.classList.add('hotdog')
        Grid.appendChild(this.visual)
        this.height = this.visual.clientHeight
        this.width = this.visual.clientWidth
        this.left = Math.random() * (MAX_WIDTH - this.width)
        this.bottom = Math.random() * (MAX_HEIGHT - this.height)
        this.visual.style.left = this.left + "px"
        this.visual.style.bottom = this.bottom + "px"
    }

    destroy() {
        Grid.removeChild(this.visual)
    }
}