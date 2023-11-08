import GlobalEvents from "../../helpers/GlobalEvents.js"
import Constants from "../../helpers/Constants.js"

class EndGameController
{
    constructor(){
        this.animationDuration = 1000
        this.resultView = document.querySelector("#game-result-view")
        this.holesMask = document.querySelector(".holes-mask")
        this.playerScore = document.querySelector("#player-score")
        this.winPlayer = document.querySelector("#win-player")
         
        this.isGameEnded = false
        this.currentPlayerScoreClass = ""

        this.resultView.style.display = "none"

        this.globalEvents = GlobalEvents.getInstance()
        this.globalEvents.subscribe(GlobalEvents.ON_GAME_ENDED, (config)=>{this.onGameEnded(config)})
        this.globalEvents.subscribe(GlobalEvents.ON_EXIT_GAME, ()=>{this.onExitGame()})
    }

    onGameEnded(config)
    {
        this.isGameEnded = true

        // Visual elements
        this.resultView.style.opacity = 0
        this.resultView.style.display = "flex"

        anime({
            targets: ".holes-mask, #game-symbol",
            opacity: 0,
            duration:this.animationDuration,
            easing: 'easeOutQuad'
        })
        
        anime({
            targets: "#game-result-view",
            opacity: 1,
            duration:this.animationDuration,
            easing: 'easeOutQuad',
            delay:1000
        })

        // Change winner color
        const winningTeam = config.winningTeam
        this.removeCurrentPlayerScoreClass()
        if(winningTeam == Constants.PLAYER_A){
            this.addCurrentPlayerScoreClass("player-score-a")
            this.playerScore.classList.add("player-score-a")
            this.winPlayer.innerHTML = "Player 1 win!"
        }else{
            this.addCurrentPlayerScoreClass("player-score-b")
            this.winPlayer.innerHTML = "Player 2 win!"
        }
    }

    onExitGame(){
        this.isGameEnded = false
        
        const animation = anime({
            targets: "#game-result-view",
            opacity: 0,
            duration:this.animationDuration,
            easing: 'easeOutQuad'
        })


        animation.finished.then(()=>{
            this.resultView.style.display = "none"
        })
        // 

        anime({
            targets: ".holes-mask",
            opacity: 1,
            duration:this.animationDuration,
            easing: 'easeOutQuad'
        })
    }

    removeCurrentPlayerScoreClass(){
        if(this.currentPlayerScoreClass != ""){
            this.playerScore.classList.remove(this.currentPlayerScoreClass)
        }
    }

    addCurrentPlayerScoreClass(newClass){
        this.playerScore.classList.add(newClass)
        this.currentPlayerScoreClass = newClass
    }
}

export default EndGameController