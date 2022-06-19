export default class EventEmitter{
    constructor(){
        this.listeners = new Set();
    }

    emit(event){
        this.listeners.forEach(listener => {
            if (listener.name == event.name) {
                for(let i = 0; i < listener.times; i++){
                    listener.callback(event.args);
                }
            }
        });
    }

    addListener(listener){
        this.listeners.add(listener);
    }
}