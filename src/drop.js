import { Grid, MAX_WIDTH, MAX_HEIGHT } from '../index.js'

let lastDropId = 0
const DROP_TYPES = ["hotdog", "pizza", "wings"]

export class Drop {
    constructor() {
        // id
        this.id = ++lastDropId

        this.type = DROP_TYPES[Math.floor(Math.random() * DROP_TYPES.length)]

        // visual and geometry
        this.visual = document.createElement('div')
        this.visual.classList.add(`drop`)
        this.visual.classList.add(`drop-${this.type}`)
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