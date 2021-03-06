import EventEmitter from "./EventEmitter.js";
import KeyboardHandler from "./KeyboardHandler.js";

export default class Game {
    constructor(canvas){
        this.keyboardHandler = new KeyboardHandler();
        this.keyboardHandler.addListener({name: "r", times: 1, callback: (args) => this.restart(args)});
        this.keyboardHandler.addListener({name: "R", times: 1, callback: (args) => this.restart(args)});
        this.canvas = canvas;
        this.videoContext = this.canvas.getContext('2d');
        this.running = false;
        this.size = 20
        this.maxMines = 100;
        this.eventEmitter = new EventEmitter();
        this.canvas.addEventListener('click', (event) => this.eventEmitter.emit({name: 'click', args: event}));
        this.canvas.addEventListener('contextmenu', (event) => this.eventEmitter.emit({name: 'right_click', args: event}));
        this.eventEmitter.addListener({name: 'click', times: 1, callback: (args) => this.handleClick(args)});
        this.eventEmitter.addListener({name: 'right_click', times: 1, callback: (args) => this.handleRightClick(args)});
        this.setup();
    }

    setup(){
        this.openFields = 0;
        this.gameMatrix = this.generateGameMatrix();
        this.generateMines();
        this.running = true;
    }

    start(){
        requestAnimationFrame(() => this.mainLoop());
    }
    
    update(){
        this.checkWin();
    }
    
    draw(){
        if(this.running){
            this.paintBackground();
            this.paintPlayground();
        }
    }
    
    mainLoop(){
        this.draw();
        this.update();
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
                    if(this.gameMatrix[x][y].mines > 0) {
                        this.videoContext.fillStyle = 'black';
                    this.videoContext.font = "15px Georgia";
                    this.videoContext.fillText(this.gameMatrix[x][y].mines.toString(), (x * this.size) + (this.size / 2), (y * this.size) + (this.size / 2));
                    }
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
        const {x, y} = this.getCoordinates(event);
        this.handleOpenMine(x, y)
    }
    
    handleOpenMine(x, y){
        if(!this.running){
            return;
        }
        if(!this.gameMatrix[x][y].open) {
            this.gameMatrix[x][y].open = true;
            this.openFields ++;
        }
        if(this.gameMatrix[x][y].bomb){
            this.paintBlownMine(x, y);
            this.end(false);
        }
        const mines = this.calculateMines(x, y);
        this.gameMatrix[x][y].mines = mines;
        if (mines < 1) {
            if(typeof(this.gameMatrix[x + 1]) != 'undefined'){
                if(typeof(this.gameMatrix[x + 1][y]) != 'undefined' && !this.gameMatrix[x + 1][y].open) {
                    this.handleOpenMine(x + 1, y);
                }
                if (typeof(this.gameMatrix[x + 1][y + 1]) != 'undefined' && !this.gameMatrix[x + 1][y + 1].open) {
                    this.handleOpenMine(x + 1, y + 1);
                }
                if (typeof(this.gameMatrix[x + 1][y - 1]) != 'undefined' && !this.gameMatrix[x + 1][y - 1].open) {
                    this.handleOpenMine(x + 1, y - 1);
                }
            }
            if(typeof(this.gameMatrix[x - 1]) != 'undefined'){
                if (typeof(this.gameMatrix[x - 1][y]) != 'undefined' && !this.gameMatrix[x - 1][y].open) {
                    this.handleOpenMine(x - 1, y);
                }
                if (typeof(this.gameMatrix[x - 1][y + 1]) != 'undefined' && !this.gameMatrix[x - 1][y + 1].open) {
                    this.handleOpenMine(x - 1, y + 1);
                }
                if (typeof(this.gameMatrix[x - 1][y - 1]) != 'undefined' && !this.gameMatrix[x - 1][y - 1].open) {
                    this.handleOpenMine(x - 1, y - 1);
                }
            }
            if (typeof(this.gameMatrix[x][y + 1]) != 'undefined' && !this.gameMatrix[x][y + 1].open) {
                this.handleOpenMine(x, y + 1);
            }
            if (typeof(this.gameMatrix[x][y - 1]) != 'undefined' && !this.gameMatrix[x][y - 1].open) {
                this.handleOpenMine(x, y - 1);
            }
        }
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
        return mines;
    }

    generateGameMatrix(){
        let result = [];
        for(let x = 0; x < this.videoContext.canvas.width / this.size; x++){
            for(let y = 0; y < this.videoContext.canvas.width / this.size; y++){
                if (!result[x]){
                    result[x] = [];
                }
                result[x][y] = {open: false, bomb: false};
            }   
        }
        return result;
    }

    handleRightClick(event){
        event.preventDefault();
        const {x, y} = this.getCoordinates(event);
        this.gameMatrix[x][y].safe = true;
    }

    generateMines(){
        try {
            for (let i = 0; i < this.maxMines; i++){
                const maxLen = this.canvas.width / this.size - 1;
                const x = Math.floor(Math.random() * (maxLen - 0 + 1)) + 0;;
                const y = Math.floor(Math.random() * (maxLen - 0 + 1)) + 0;
                this.gameMatrix[x][y].bomb = true;
            }
        } catch (e) {
        }
    }

    checkWin(){
        if (this.openFields === ((this.canvas.width / this.size) * this.canvas.height / this.size) - this.maxMines) {
            this.end(true);
        }
    }

    paintBlownMine(x, y) {
        this.videoContext.fillStyle = "red";
        this.videoContext.fillRect(x * this.size, y * this.size, this.size, this.size);
    }

    end(win){
        const message = win ? "You win!": "Game over. Press R to restart";
        this.running = false;
        this.videoContext.fillStyle="black";
        this.videoContext.font = "30px Georgia";
        this.videoContext.fillText(message, this.canvas.width / 3, this.canvas.height / 3);
    }

    restart(event) {
        this.setup();
    }
}