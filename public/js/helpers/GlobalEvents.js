class GlobalEvents {

    constructor() {
        // Para los eventos
        this.events = {};

    }

    // TODO Suscribirse a un evento con una función
    // Ahora: suscribirse con una función
    subscribe(event = "", func) {
        if(this.events[event] == undefined){
            this.events[event] = []
        }

        this.events[event].push(func)
    }
     
    // TODO Desuscribirse a un evento con una función
    // Ahora: desuscribirse con una función
    unsubscribe(event = "", func) {
        if(this.events[event] != undefined){
            this.events[event] = this.events[event].filter((observer) => observer !== func)
        }
    }
     
    // Ahora: notifica siempre a todos los suscritores, no admite distinción del evento
    notify(event = "", data) {
        // Cuidado! No podemos notificar si no hay nadie escuchando este evento
        this.events[event]?.forEach((observer) => observer(data));
    }

    notifyWithDelay(delay, event, data) {
        const that = this
        const timeoutId = setTimeout(function(){
            that.notify(event, data)
            clearTimeout(timeoutId);    
        }, delay);
        
    }

}

GlobalEvents.myInstance = null
GlobalEvents.getInstance = ()=>{
    if(GlobalEvents.myInstance == null){
        GlobalEvents.myInstance = new GlobalEvents()   
    }
    
    return GlobalEvents.myInstance
}

GlobalEvents.ON_PROGRESS_LOADING = "ON_PROGRESS_LOADING"
GlobalEvents.ON_LOADING_COMPLETED = "ON_LOADING_COMPLETED"
GlobalEvents.ON_GAME_TYPE_SELECTED = "ON_GAME_TYPE_SELECTED"
GlobalEvents.ON_GAME_START = "ON_GAME_START"
GlobalEvents.ON_CLICK_COLUMN = "ON_CLICK_COLUMN"
GlobalEvents.ON_UPDATE_COLUMN_BUTTONS = "ON_UPDATE_COLUMN_BUTTONS"
GlobalEvents.ON_UPDATE_CURRENT_TURN = "ON_UPDATE_CURRENT_TURN"
GlobalEvents.ON_EXIT_GAME = "ON_EXIT_GAME"
GlobalEvents.ON_RESTART_GAME = "ON_RESTART_GAME"
GlobalEvents.ON_PIECE_MOVEMENT_STARTED = "ON_PIECE_MOVEMENT_STARTED"
GlobalEvents.ON_GAME_ENDED = "ON_GAME_ENDED"
GlobalEvents.ON_WAITING_FOR_NEXT_TURN = "ON_WAITING_FOR_NEXT_TURN"
GlobalEvents.ON_NEXT_TURN_ALLOWED = "ON_NEXT_TURN_ALLOWED"
GlobalEvents.ON_COMPUTER_TURN = "ON_COMPUTER_TURN"
GlobalEvents.ON_BOARD_FOR_COMPUTER_TURN = "ON_BOARD_FOR_COMPUTER_TURN"
GlobalEvents.ON_CLICK_COLUMN_FROM_COMPUTER = "ON_CLICK_COLUMN_FROM_COMPUTER"

export default GlobalEvents;