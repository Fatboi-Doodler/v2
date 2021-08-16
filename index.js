import { Platform } from './src/platform.js'
import { Doodler } from './src/doodler.js'
import { NPC } from './src/npc.js'
import { Drop } from './src/drop.js'

export const Grid = document.querySelector('.grid')
export const MAX_WIDTH = document.body.offsetWidth
export const MAX_HEIGHT = document.body.offsetHeight
export const G = 400

const Players = []
export const Drops = []
export const Platforms = []
export const NPCs = []
export let IsGameover = false;

const MAX_DROPS = 5
const DROP_INTERVAL_SEC = 20
const PLATFORM_COUNT = Math.floor( MAX_WIDTH / 50) || PLATFORM_COUNT
const GameoverDiv = document.createElement('div')
Grid.appendChild(GameoverDiv)

let DropsId = null


function createPlatforms() {
    for(let i = 0; i < PLATFORM_COUNT; i++) {
        Platforms.push(new Platform())
    }
}

function startDrops() {

    DropsId = setInterval(() => {
        if(Drops.length < MAX_DROPS) Drops.push(new Drop())
    }, DROP_INTERVAL_SEC * 1000)
}

function movePlatforms(){
    setInterval( function() {
        for(let platform of Platforms) {
            platform.update();
        }
    }, 50)
}

export function gameover(){

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

function keyHandler(e) {
    if(e.key === ' ' && e.type == "keyup" && IsGameover) {
        restart()
    }
    if(IsGameover) return;
    if(e.key == 'ArrowLeft') {
        Players[1].speed = e.type == "keydown" ? -4 : (Players[1].speed == 4 ? 4 : 0)
    }
    if (e.key == 'ArrowRight') {
        Players[1].speed = e.type == "keydown" ? 4 : (Players[1].speed == -4 ? -4 : 0)
    }
    if (e.key == 'ArrowUp') {
        Players[1].boosting = e.type == "keydown" ? true : false
    }
    if (e.key == 'ArrowDown') {
        Players[1].crawling = e.type == "keydown" ? true : false
    }
    if(e.keyCode == 65) {   // A
        Players[0].speed = e.type == "keydown" ? -4 : (Players[0].speed == 4 ? 4 : 0)
    }
    if (e.keyCode == 68) {  // D
        Players[0].speed = e.type == "keydown" ? 4 : (Players[0].speed == -4 ? -4 : 0)
    }
    if (e.keyCode == 87) {  // W
        Players[0].boosting = e.type == "keydown" ? true : false
    }
    if (e.keyCode == 83) {  // S
        Players[0].crawling = e.type == "keydown" ? true : false
    }

    e.preventDefault();
}

document.addEventListener('keydown', keyHandler, false);
document.addEventListener('keyup', keyHandler, false);

function start() {
    createPlatforms()
    movePlatforms()
    startDrops()
    Players.push(new Doodler())
    Players.push(new Doodler())
    NPCs.push(new NPC())
    NPCs.push(new NPC())
    NPCs.push(new NPC())
}
start()