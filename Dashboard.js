export default class Dashboard {
    constructor(videoContext){
        this.videoContext = videoContext;
        this.score = 0;
        this.time = 1000;
    }

    update(){

    }

    draw(){
        this.videoContext.fillStyle="yellow";
        this.videoContext.fillRect(this.videoContext.canvas.width / 2 - 20, 20, 40, 40)
    }
}