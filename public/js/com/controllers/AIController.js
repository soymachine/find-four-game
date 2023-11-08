import Constants from "../../helpers/Constants.js"
import GlobalEvents from "../../helpers/GlobalEvents.js"

class AIController{
    constructor()
    {
        this.globalEvents = GlobalEvents.getInstance()
        this.globalEvents.subscribe(GlobalEvents.ON_BOARD_FOR_COMPUTER_TURN, (boardStructure)=>{this.onBoardForComputerturn(boardStructure)})

    }

    onBoardForComputerturn(boardStructure){
        const randomColumn = Math.floor(Math.random() * Constants.COLUMNS) + 1
        // Make sure at least that column is clickable
        console.log(`randomColumn:${randomColumn}`)
        
        this.globalEvents.notify(GlobalEvents.ON_CLICK_COLUMN_FROM_COMPUTER, randomColumn)
    }
}

export default AIController