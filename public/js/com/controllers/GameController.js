import GlobalEvents from "../../helpers/GlobalEvents.js"
import Constants from "../../helpers/Constants.js"

import UIController from "./UIController.js"
import BoardController from "./BoardController.js"
import TurnController from "./TurnController.js"

class GameController {

    constructor() {

        // Logo image
        this.animationDuration = 500
        this.logo = document.querySelector("#logo")

        // Initial State
        this.state = GameController.SELECTING_LEVEL

        // UI Controller
        this.uiController = new UIController()

        // Board of pieces ("fichas")
        this.boardController = new BoardController()

        // Turns Controller
        this.turnController = new TurnController()
        

        this.globalEvents = GlobalEvents.getInstance()
        this.globalEvents.subscribe(GlobalEvents.ON_GAME_START, ()=>{this.onGameStart()})
        this.globalEvents.subscribe(GlobalEvents.ON_EXIT_GAME, ()=>{this.onExitGame()})

        // this.uiController.onClickMode(Constants.PLAYER_VS_PLAYER)
    }

    onExitGame(){
        this.changeLogoOpacity(1)
    }

    onGameStart(){
        this.changeLogoOpacity(0)
    }

    changeLogoOpacity(opacity){
        anime({
            targets: "#logo",
            opacity: opacity,
            duration:this.animationDuration,
            easing: 'easeOutQuad'
        });  
    }

    // End Game handlers
    onReplayClicked(){
        
    }

    onExitClicked(){
        
    }

    resetGame(){
       
    }

    changeState(newState)
    {
        switch(newState){
            case GameController.SELECTING_LEVEL:
                // If there is an ongoing game, reset it
                this.resetGame()
                    
                //this.viewsController.showView(GameController.LEVEL_SELECTOR_CONTAINER)
                break;
            case GameController.PLAYING:
                //this.viewsController.showView(GameController.GAME_CONTAINER)
                break;
        }
    }

    
}

GameController.SELECTING_LEVEL = "SELECTING_LEVEL"
GameController.PLAYING = "PLAYING"
GameController.LEVEL_SELECTOR_CONTAINER = "LEVEL_SELECTOR_CONTAINER"
GameController.GAME_CONTAINER = "GAME_CONTAINER"


export default GameController;