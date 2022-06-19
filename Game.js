import EventEmitter from "./EventEmitter.js";

export default class Game {
    constructor(canvas){
        this.canvas = canvas;
        this.videoContext = this.canvas.getContext('2d');
        this.running = false;
        this.size = 20
        this.eventEmitter = new EventEmitter();
        this.canvas.addEventListener('click', (event) => this.eventEmitter.emit({name: 'click', args: event}));
        this.eventEmitter.addListener({name: 'click', times: 1, callback: (args) => this.handleClick(args)});
        this.printed = false;
        this.setup();
    }

    setup(){
        this.gameMatrix = this.generateGameMatrix();
    }

    start(){
        this.running = true;
        requestAnimationFrame(() => this.mainLoop());
    }
    
    update(){
    }
    
    draw(){
        this.paintBackground();
        this.paintPlayground();
    }
    
    mainLoop(){
        this.update();
        this.draw();
        requestAnimationFrame(() => this.mainLoop());
    }
    
    paintBackground(){
        this.videoContext.fillStyle="grey";
        this.videoContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    paintPlayground(){
        for(let x = 0; x < this.canvas.width / this.size; x++){
            for (let y = 0; y < this.canvas.height / this.size; y++){
                this.videoContext.fillStyle = "black";
                this.videoContext.strokeRect(x * this.size, y * this.size, this.size, this.size);
            }
        }
        this.printed = true;
    }

    handleClick(event){
        console.log('handling click with event', event);
        const matrixX = Math.floor(event.offsetX / this.size);
        const matrixY = Math.floor(event.offsetY / this.size);
        console.log(`clicked on matrix x=${matrixX} and y = ${matrixY}`);
    }

    generateGameMatrix(){
        let result = [];
        for(let x = 0; x < this.videoContext.canvas.width / this.size; x++){
            for(let y = 0; y < this.videoContext.canvas.width / this.size; y++){
                let bomb = Math.floor(Math.random() * (1 - 0 + 1));
                if (!result[x]){
                    result[x] = [];
                }
                result[x][y] = {open: false, bomb: bomb};
            }   
        }
        console.log(result);
        return result;
    }
}