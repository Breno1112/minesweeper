import Dashboard from "./Dashboard.js";
import EventEmitter from "./EventEmitter.js";

export default class Game {
    constructor(canvas){
        this.canvas = canvas;
        this.videoContext = this.canvas.getContext('2d');
        this.running = false;
        this.eventEmitter = new EventEmitter();
        this.canvas.addEventListener('click', (event) => this.eventEmitter.emit({name: 'click', args: event}));
        this.eventEmitter.addListener({name: 'click', times: 1, callback: (args) => this.handleClick(args)})
        this.setup();
    }

    setup(){
        this.dashboard = new Dashboard(this.videoContext);
    }

    start(){
        this.running = true;
        requestAnimationFrame(() => this.mainLoop());
    }
    
    update(){
        this.dashboard.update();
    }
    
    draw(){
        this.paintBackground();
        this.dashboard.draw();
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

    handleClick(event){
        console.log('handling click with event', event);
    }
}