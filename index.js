import { Platform } from './src/platform.js'
import { Doodler } from './src/doodler.js'
import { NPC } from './src/npc.js'

export const Grid = document.querySelector('.grid')
export const MAX_WIDTH = document.body.offsetWidth
export const MAX_HEIGHT = document.body.offsetHeight
export const G = 400

const Players = []
export const Platforms = []
export const NPCs = []
export let IsGameover = false;

const PLATFORM_COUNT = Math.floor( MAX_WIDTH / 50) || PLATFORM_COUNT
const GameoverDiv = document.createElement('div')
Grid.appendChild(GameoverDiv)

function createPlatforms() {
    for(let i = 0; i < PLATFORM_COUNT; i++) {
        Platforms.push(new Platform())
    }
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
    if(e.key == 'a') {
        Players[0].speed = e.type == "keydown" ? -4 : (Players[0].speed == 4 ? 4 : 0)
    }
    if (e.key == 'd') {
        Players[0].speed = e.type == "keydown" ? 4 : (Players[0].speed == -4 ? -4 : 0)
    }
    if (e.key == 'w') {
        Players[0].boosting = e.type == "keydown" ? true : false
    }
    if (e.key == 's') {
        Players[0].crawling = e.type == "keydown" ? true : false
    }

    e.preventDefault();
}

document.addEventListener('keydown', keyHandler, false);
document.addEventListener('keyup', keyHandler, false);

function start() {
    createPlatforms()
    movePlatforms()
    Players.push(new Doodler(1))
    Players.push(new Doodler(2))
    NPCs.push(new NPC(1))
    NPCs.push(new NPC(2))
    NPCs.push(new NPC(3))
}
start()