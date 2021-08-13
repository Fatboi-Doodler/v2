document.addEventListener('DOMContentLoaded', () => {
    const Grid = document.querySelector('.grid')
    const Gameover = document.createElement('div')
    const Platforms = []
    const Players = []
    const Keys = {}
    const DIRS = ["left", "up", "down", "right", "still"]
    const MAX_JUMP = 250;
    const MAX_PLATFORM_SPEED = 5;
    const MAX_WIDTH = document.body.offsetWidth || 1000
    const MAX_HEIGHT = document.body.offsetHeight || 800
    const PLATFORM_COUNT = Math.floor( MAX_WIDTH / 40) || 10
    let platId
    let IsGameover = false;

    class Platform {
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

    class Doodler {
        constructor(num) {
            this.id = num
            this.visual = document.createElement('div')
            Grid.appendChild(this.visual)
            this.fallId = null
            this.jumpId = null
            this.isFalling = false
            this.width = 75
            this.height = 75
            this.maxJump = MAX_JUMP
            this.scoreDiv = document.createElement('div')
            this.scoreDiv.classList.add(`score${this.id}`)
            const icon = document.createElement('div')
            icon.classList.add(`icon${this.id}`)
            Grid.appendChild(icon)
            Grid.appendChild(this.scoreDiv)
            this.restart()
            this.jumpEnd = this.bottom + this.maxJump
        }

        move(x, y){
            this.bottom += y;
            this.left += x;
            if(this.left < 0) this.left = 0;
            if(this.left + this.width + 10 > MAX_WIDTH) this.left = MAX_WIDTH - this.width - 10;
            this.visual.style.bottom = this.bottom + 'px';
            this.visual.style.left = this.left + 'px';
        }

        jump() {
            this.isFalling = false
            clearInterval(this.fallId)
            const boost = (this.id == 1 && Keys["w"] == true ) || (this.id == 2 && Keys["ArrowUp"] == true)
            this.jumpEnd = this.bottom + (boost ? this.maxJump * 1.5 : this.maxJump)
            this.jumpId = setInterval( () => {
                const diff = this.jumpEnd - this.bottom
                const delta = diff / this.maxJump * 8;
                this.move(0, delta)
                if(this.bottom > this.jumpEnd - this.height){
                    this.fall();
                }
            }, 20)
        }

        fall() {
            clearInterval(this.jumpId)
            clearInterval(this.fallId)
            this.isFalling = true
            this.fallId = setInterval( () => {
                const diff = this.jumpEnd - this.bottom
                const delta = Math.min( diff / this.maxJump * 8, 8);
                this.move(0, -delta);
                for(let platform of Platforms) {
                    if( this.bottom >= platform.bottom &&
                        this.bottom <= platform.bottom + platform.height &&
                        this.left + this.width > platform.left &&
                        this.left < platform.left + platform.width &&
                        !(this.id == 2 && Keys["ArrowDown"]) &&
                        !(this.id == 1 && Keys["s"]) &&
                        this.isFalling )
                    {
                        if(!platform.scored){
                            if(!IsGameover) this.scoreDiv.innerHTML = ++this.score;
                            platform.scored = this.id;
                            platform.visual.classList.add(`platform-scored${this.id}`)
                            if(!Platforms.find(platform => platform.scored == 0)) gameover();
                        }
                        this.jump()
                        break;
                    }
                    if( this.bottom < 0 ){
                        gameover();
                    }
                }

            }, 20)
        }

        stop() {
            clearInterval(this.jumpId)
            clearInterval(this.fallId)
            this.visual.classList.remove(`player${this.id}`)
        }

        restart() {
            this.score = 0;
            this.left = MAX_WIDTH * (2 * this.id - 1) / 4;
            this.bottom = MAX_HEIGHT/2
            this.startJump = this.bottom
            this.visual.classList.add(`player${this.id}`)
            this.scoreDiv.innerHTML = "0"
            this.move(0, 0)
            this.fall()
        }
    }

    function createPlatforms() {
        for(let i = 0; i < PLATFORM_COUNT; i++) {
          Platforms.push(new Platform())
        }
    }

    function movePlatforms(){
        platId = setInterval( function() {
            for(let platform of Platforms) {
                platform.update();
            }

        }, 50)
    }

    function gameover(){

        IsGameover = true;
        for(let p of Players){
            p.stop()
        }
        Gameover.classList.add('gameover')
        Grid.appendChild(Gameover)
    }

    function restart() {
        for(let p of Players){
            p.restart()
        }
        IsGameover = false;
        Gameover.classList.remove('gameover')
        Platforms.forEach(platform => {
            platform.scored = 0;
            platform.visual.classList.remove('platform-scored1')
            platform.visual.classList.remove('platform-scored2')
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
    }, false);

    document.addEventListener('keyup', (e) => {
        Keys[e.key] = false;
    }, false);

    setInterval( () => {
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
    }
    start()
});