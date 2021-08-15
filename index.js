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
export const Keys = {}
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

document.addEventListener('keydown', (e) => {
    if(IsGameover){
        if(e.key === ' ') {
            restart()
        }
    }
    else {
        Keys[e.key] = true;
    }
    e.preventDefault();
}, false);

document.addEventListener('keyup', (e) => {
    Keys[e.key] = false;
}, false);

setInterval( () => {
    if(IsGameover) return;
    if(Keys['ArrowLeft']) {
        Players[1].move(-4, 0);
    }
    if (Keys['ArrowRight']) {
        Players[1].move(4, 0);
    }
    if(Keys['a']) {
        Players[0].move(-4, 0);
    }
    if (Keys['d']) {
        Players[0].move(4, 0);
    }

}, 20)


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