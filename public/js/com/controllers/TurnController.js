import GlobalEvents from "../../helpers/GlobalEvents.js"
import Constants from "../../helpers/Constants.js"


class TurnController {

    constructor(){
        this.playerA = Constants.PLAYER_A
        this.playerB = Constants.PLAYER_B

        this.playerTurnName = document.querySelector("#player-turn-name")
        console.log(this.playerTurnName)

        this.globalEvents = GlobalEvents.getInstance()
        this.globalEvents.subscribe(GlobalEvents.ON_GAME_TYPE_SELECTED, (currentGameType)=>{this.onGameTypeSelected(currentGameType)})
        this.globalEvents.subscribe(GlobalEvents.ON_CLICK_COLUMN, ()=>{this.onClickColumn()})
        // no -> this.globalEvents.subscribe(GlobalEvents.ON_NEXT_TURN_ALLOWED, ()=>{this.onNextTurnAllowed()})
        this.globalEvents.subscribe(GlobalEvents.ON_WAITING_FOR_NEXT_TURN, ()=>{this.onWaitingForNextTurn()})
    }

    onGameTypeSelected(currentGameType){
        this.currentGameType = currentGameType

        if(this.currentGameType == Constants.PLAYER_VS_PLAYER){
            this.playerA = Constants.PLAYER_A
            this.playerB = Constants.PLAYER_B
        }else if(this.currentGameType == Constants.PLAYER_VS_COMPUTER){
            this.playerA = Constants.PLAYER_A
            this.playerB = Constants.COMPUTER
        }

        this.currentPlayer = this.playerA

        this.globalEvents.notify(GlobalEvents.ON_UPDATE_COLUMN_BUTTONS, {isEnabled: true})
        this.globalEvents.notify(GlobalEvents.ON_UPDATE_CURRENT_TURN, {currentPlayer: this.currentPlayer})
    }

    onWaitingForNextTurn(){
        // Update text
        this.playerTurnName.innerHTML  = `Player ${this.getPlayerNum()} turn`
        // Current turn have been updated, notify it!
        this.globalEvents.notify(GlobalEvents.ON_UPDATE_CURRENT_TURN, {currentPlayer: this.currentPlayer})

        // Do we accept input (next one is a human player) or won't (next play is computer player)
        if(this.currentPlayer == Constants.COMPUTER){
            this.globalEvents.notify(GlobalEvents.ON_COMPUTER_TURN)
        }else{
            this.globalEvents.notify(GlobalEvents.ON_NEXT_TURN_ALLOWED)
        }
    }

    onNextTurnAllowed(){
        
    }

    getPlayerNum(){
        if(this.currentPlayer == this.playerA){
            return 1
        }else{
            return 2
        } 
    }

    onClickColumn(){
        // Change current player
        // Depending on the game type next player may be a computer!
        if(this.currentPlayer == this.playerA){
            this.currentPlayer = this.playerB
        }else{
            this.currentPlayer = this.playerA
        }

    }
}



export default TurnController