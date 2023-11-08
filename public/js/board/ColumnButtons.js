import GlobalEvents from "../helpers/GlobalEvents.js"
import Constants from "../helpers/Constants.js"

class ColumnButtons {

    constructor() {
        
        
        this.offset = 10
        this.columnIndicator = document.querySelector("#column-indicator")
        this.columnIndicator.style.visibility = "hidden"

        console.log(`this.columnIndicator:${this.columnIndicator}`)
        this.buttons = {}

        const that = this
        for (let index = 0; index < Constants.COLUMNS; index++) {
            const id = index + 1
            const columnButton = document.querySelector(`#column-${id}-button`)
            const xPos = Number(window.getComputedStyle(columnButton,null).getPropertyValue("left").replace("px",""));

            columnButton.onclick = function(e){
                that.onClickColumn(id)
            }

            columnButton.onmouseover = function(e){
                that.onRollOverColumn(id)
            }

            this.buttons[id] = {
                dom: columnButton,
                xPos: xPos
            }
        }

        this.onUpdateColumnButtons({isEnabled: false})

        this.globalEvents = GlobalEvents.getInstance()
        this.globalEvents.subscribe(GlobalEvents.ON_UPDATE_COLUMN_BUTTONS, (config)=>{this.onUpdateColumnButtons(config)})
        this.globalEvents.subscribe(GlobalEvents.ON_GAME_START, ()=>{this.onGameStarts()})
        this.globalEvents.subscribe(GlobalEvents.ON_EXIT_GAME, ()=>{this.onExitGame()})
        this.globalEvents.subscribe(GlobalEvents.ON_PIECE_MOVEMENT_STARTED, ()=>{this.onPieceMovementStarted()})
        this.globalEvents.subscribe(GlobalEvents.ON_NEXT_TURN_ALLOWED, ()=>{this.onNextTurnAllowed()})
        this.globalEvents.subscribe(GlobalEvents.ON_CLICK_COLUMN_FROM_COMPUTER, (columnID)=>{this.onClickColumnFromComputer(columnID)})
        
    }

    onPieceMovementStarted(){
        this.onUpdateColumnButtons({isEnabled: false})
        this.columnIndicator.style.visibility = "hidden"
    }

    onNextTurnAllowed(){
        this.onUpdateColumnButtons({isEnabled: true})
    }
    
    onExitGame(){
        this.onUpdateColumnButtons({isEnabled: false})
        this.columnIndicator.style.visibility = "hidden"
    }

    onRollOverColumn(columnID){

        let x = this.buttons[columnID].xPos
        x += this.offset

        this.columnIndicator.style.left = x + "px";
        this.columnIndicator.style.visibility = "visible"
    }

    onClickColumnFromComputer(columnID){
        console.log(`columnID:${columnID}`)
        this.onClickColumn(columnID)
    }

    onClickColumn(columnID){
        // this.onUpdateColumnButtons({isEnabled:false})

        this.globalEvents.notify(GlobalEvents.ON_CLICK_COLUMN, columnID)
    }

    onUpdateColumnButtons(config){
        const isEnabled = config.isEnabled

        for (const key in this.buttons) {
            const columnButtonDom = this.buttons[key].dom
            if(isEnabled){
                columnButtonDom.style.visibility = "visible"
            }else{
                columnButtonDom.style.visibility = "hidden"
            }
        }
    }

    onGameStarts(){

    }



    
}

export default ColumnButtons;