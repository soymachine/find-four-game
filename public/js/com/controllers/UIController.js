import GlobalEvents from "../../helpers/GlobalEvents.js"
import Constants from "../../helpers/Constants.js"

class UIController {

    constructor() {
        this.globalEvents = GlobalEvents.getInstance()
        this.globalEvents.subscribe(GlobalEvents.ON_UPDATE_CURRENT_TURN, (config)=>{this.onUpdateCurrentTurn(config)})
        this.globalEvents.subscribe(GlobalEvents.ON_GAME_ENDED, (config)=>{this.onGameEnded()})

        // WIDTH
        this.uiWidth = 687
        this.animationDuration = 500
        this.currentGameType = Constants.PLAYER_VS_COMPUTER
        
        // Scope
        const that = this

        // Current player circle color
        this.playerCircle = document.querySelector("#player-circle")
        this.currentPlayerCircleClass = ""

        // Game symbol image
        this.gameSymbol = document.querySelector("#game-symbol")
        this.updateGameSymbol(0, false)

        // References to dom elements
        this.startView = document.querySelector("#start-view")
        this.typeView = document.querySelector("#type-view")
        this.gameView = document.querySelector("#game-view")

        this.allViews = document.querySelector('.ui-view');
        
        // Buttons
        // Start
        this.startButton = document.querySelector("#start-button")
        this.startButton.onclick = function(e){
            that.onClickStart()
        }

        // Player-vs-player
        this.playerVSplayerButton = document.querySelector("#player-vs-player-button")
        this.playerVSplayerButton.onclick = function(e){
            that.onClickMode(Constants.PLAYER_VS_PLAYER)
        }

        // Player-vs-computer
        this.playerVScomputerButton = document.querySelector("#player-vs-computer-button")
        this.playerVScomputerButton.onclick = function(e){
            that.onClickMode(Constants.PLAYER_VS_COMPUTER)
        }


        // Restart Button
        this.restartButton = document.querySelector("#restart-button")
        this.restartButton.onclick = function(e){
            that.onClickRestart()
        }

        // Exit Button
        this.exitButton = document.querySelector("#exit-button")
        this.exitButton.onclick = function(e){
            that.onClickExit()
        }

        // Home Button
        this.homeButton = document.querySelector("#home-button")
        this.homeButton.onclick = function(e){
            that.onClickExit()
        }

        // that.onClickMode(Constants.PLAYER_VS_PLAYER)
    }

    onGameEnded(){

        // Hide Exit button
        anime({
            targets: "#exit-button",
            left: 110,
            duration: 250,
            easing: 'easeOutQuad'
        });

        // Show Home button
        anime({
            targets: "#home-button",
            top: 26,
            duration: 250,
            easing: 'easeOutQuad'
        });
    }

    updateGameSymbol(opacity, isAnimated){
        if(isAnimated){
            anime({
                targets: "#game-symbol",
                opacity: opacity,
                duration:this.animationDuration,
                easing: 'easeOutQuad'
            });
        }else{
            this.gameSymbol.style.opacity = opacity
        }
    }

    onUpdateCurrentTurn(config){
        const currentPlayer = config.currentPlayer

        // Remove previous class
        if(this.currentPlayerCircleClass != ""){
            this.playerCircle.classList.remove(this.currentPlayerCircleClass) 
        }

        let classCircle = ""
        if(currentPlayer == Constants.PLAYER_A){
            classCircle = "circle-player_a"
        }else{
            classCircle = "circle-player_b"
        }

        this.currentPlayerCircleClass = classCircle
        this.playerCircle.classList.add(this.currentPlayerCircleClass) 
    }

    onClickExit(){
        this.showView(UIController.START_VIEW)
        this.globalEvents.notify(GlobalEvents.ON_EXIT_GAME)
        this.updateGameSymbol(0, true)

        this.restoreUIButtons()
    }

    restoreUIButtons(){
        // Show Exit button
        anime({
            targets: "#exit-button",
            left: 0,
            duration: 250,
            easing: 'easeOutQuad'
        });

        // Hide Home button
        anime({
            targets: "#home-button",
            top: 130,
            duration: 250,
            easing: 'easeOutQuad'
        });
    }
    
    onClickRestart(){
        this.showView(UIController.TYPE_VIEW)

        this.globalEvents.notify(GlobalEvents.ON_RESTART_GAME)
    }

    onClickStart(){
        this.showView(UIController.TYPE_VIEW)
    }

    onClickMode(gameType){
        this.currentGameType = gameType

        this.showView(UIController.GAME_VIEW)

        this.globalEvents.notify(GlobalEvents.ON_GAME_TYPE_SELECTED, this.currentGameType)
        this.globalEvents.notify(GlobalEvents.ON_GAME_START)
        this.updateGameSymbol(1, true)
    }

    moveToNewUI(newSection){

    }

    showView(newView)
    {
        let xDestination = 0

        switch(newView){
            case UIController.START_VIEW:
                xDestination = 0                
                break;
            case UIController.TYPE_VIEW:
                xDestination = -this.uiWidth * 1
                break;
            case UIController.GAME_VIEW:
                xDestination = -this.uiWidth * 2
                break;
        }

        anime({
            targets: ".ui-view",
            translateX: xDestination,
            duration:this.animationDuration,
            easing: 'easeInOutQuad'
        });
    }
}

UIController.START_VIEW = "START_VIEW"
UIController.TYPE_VIEW = "TYPE_VIEW"
UIController.GAME_VIEW = "GAME_VIEW"


export default UIController;