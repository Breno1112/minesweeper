export default class KeyboardHandler{
    constructor(){
        this.listeners = [];
        window.addEventListener('keypress', (event) => this.handleKeyPress(event));
    }

    handleKeyPress(event) {
        this.listeners.forEach(listener => {
            if (listener.name === event.key) {
                for (let i = 0; i < listener.times; i++){
                    listener.callback(event);
                }
            }
        });
    }

    addListener(listener){
        this.listeners.push(listener);
    }
}