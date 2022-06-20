import EventEmitter from "./EventEmitter.js";

export default class Game {
    constructor(canvas){
        this.canvas = canvas;
        this.videoContext = this.canvas.getContext('2d');
        this.running = false;
        this.size = 20
        this.eventEmitter = new EventEmitter();
        this.canvas.addEventListener('click', (event) => this.eventEmitter.emit({name: 'click', args: event}));
        this.canvas.addEventListener('contextmenu', (event) => this.eventEmitter.emit({name: 'right_click', args: event}));
        this.eventEmitter.addListener({name: 'click', times: 1, callback: (args) => this.handleClick(args)});
        this.eventEmitter.addListener({name: 'right_click', times: 1, callback: (args) => this.handleRightClick(args)});
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
        this.videoContext.fillStyle="#BFBFBF";
        this.videoContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    paintPlayground(){
        for(let x = 0; x < this.canvas.width / this.size; x++){
            for (let y = 0; y < this.canvas.height / this.size; y++){
                this.videoContext.strokeStyle = "#8E8E8E";
                this.videoContext.fillStyle = "grey";
                this.videoContext.strokeRect(x * this.size, y * this.size, this.size, this.size);
                if (this.gameMatrix[x][y].bomb && this.gameMatrix[x][y].open) {
                    this.videoContext.fillStyle = 'red';
                    this.videoContext.fillRect(x * this.size, y * this.size, this.size, this.size);
                } else if(this.gameMatrix[x][y].open){
                    this.videoContext.fillRect(x * this.size, y * this.size, this.size, this.size);
                    this.videoContext.fillStyle = 'black';
                    this.videoContext.font = "15px Georgia";
                    this.videoContext.fillText(this.gameMatrix[x][y].mines.toString(), (x * this.size) + (this.size / 2), (y * this.size) + (this.size / 2));
                } else if(!this.gameMatrix[x][y].open && this.gameMatrix[x][y].safe) {
                    this.videoContext.fillStyle = 'yellow';
                    this.videoContext.fillRect(x * this.size, y * this.size, this.size, this.size);
                } else {
                    this.videoContext.strokeRect(x * this.size, y * this.size, this.size, this.size);
                }
            }
        }
    }

    getCoordinates(event){
        const matrixX = Math.floor(event.offsetX / this.size);
        const matrixY = Math.floor(event.offsetY / this.size);
        return {x: matrixX, y: matrixY};
    }

    handleClick(event){
        console.log(event);
        const {x, y} = this.getCoordinates(event);
        this.handleOpenMine(x, y)
    }
    
    handleOpenMine(x, y){
        console.log(`clicked on matrix x=${x} and y = ${x} and is bomb? ${this.gameMatrix[x][x].bomb}`);
        this.gameMatrix[x][y].open = true;
        const mines = this.calculateMines(x, y);
    }

    calculateMines(x, y){
        var mines = 0;
        var up, down, left, right, upleft, upright, downleft, downright;
        if (x === 0){
            left = 0;
            upleft = 0;
            downleft =0;
        } else if (x >= this.canvas.width / this.size - 1) {
            right = 0;
            upright = 0;
            downright = 0;
        }
        if (y == 0){
            up = 0;
            upleft = 0;
            upright = 0;
        } else if (y >= this.canvas.height / this.size - 1) {
            down = 0;
            downleft = 0;
            downright = 0;
        }
        if (typeof(up) == 'undefined'){
            up = this.gameMatrix[x][y-1].bomb ? 1 : 0;
        }
        if (typeof(down) == 'undefined'){
            down = this.gameMatrix[x][y+1].bomb ? 1 : 0;
        }

        if (typeof(left) == 'undefined'){
            left = this.gameMatrix[x - 1][y].bomb ? 1 : 0;
        }

        if (typeof(right) == 'undefined'){
            right = this.gameMatrix[x + 1][y].bomb ? 1 : 0;
        }
        if (typeof(upleft) == 'undefined' ){
            upleft = this.gameMatrix[x -1][y-1].bomb ? 1 : 0;
        }

        if (typeof(upright) == 'undefined'){
            upright = this.gameMatrix[x + 1][y-1].bomb ? 1 : 0;
        }

        if (typeof(downleft) == 'undefined'){
            downleft = this.gameMatrix[x -1][y+1].bomb ? 1 : 0;
        }
        if (typeof(downright) == 'undefined' ){
            downright = this.gameMatrix[x + 1][y+1].bomb ? 1 : 0;
        }
        mines = up + down + left + right + upleft + upright + downleft + downright;
        this.gameMatrix[x][y].mines = mines;
        console.log(this.gameMatrix[x][y]);
    }

    generateGameMatrix(){
        let result = [];
        for(let x = 0; x < this.videoContext.canvas.width / this.size; x++){
            for(let y = 0; y < this.videoContext.canvas.width / this.size; y++){
                let bomb = Math.floor(Math.random() * (1 - 0 + 1));
                if (!result[x]){
                    result[x] = [];
                }
                result[x][y] = {open: false, bomb: bomb > 0};
            }   
        }
        console.log(result);
        return result;
    }

    handleRightClick(event){
        event.preventDefault();
        const {x, y} = this.getCoordinates(event);
        this.gameMatrix[x][y].safe = true;
    }
}