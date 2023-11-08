import GlobalEvents from "../../helpers/GlobalEvents.js"
import Constants from "../../helpers/Constants.js"
import Slot from "../../data/Slot.js"
import ConditionResult from "../../data/ConditionResult.js"
import CheckAxisResult from "../../data/CheckAxisResult.js"

class BoardController {

    constructor() {
        this.holderDOM = document.querySelector("#grid")
        this.globalEvents = GlobalEvents.getInstance()
        this.globalEvents.subscribe(GlobalEvents.ON_CLICK_COLUMN, (columnID)=>{this.onClickColumn(columnID)})
        this.globalEvents.subscribe(GlobalEvents.ON_UPDATE_CURRENT_TURN, (config)=>{this.onUpdateCurrentTurn(config)})
        this.globalEvents.subscribe(GlobalEvents.ON_EXIT_GAME, ()=>{this.onExitGame()})
        this.globalEvents.subscribe(GlobalEvents.ON_COMPUTER_TURN, ()=>{this.onComputerTurn()})
        //this.globalEvents.subscribe(GlobalEvents.ON_DIFFICULTY_SELECTED, (difficultyID)=>{this.onDifficultySelected(difficultyID)})

        

        // Counter for each piece to have an id
        this.counter = 0
        this.pieceWidth = 64
        this.pieceMargin = 32
        this.startYPosition = -40
        this.xInitialOffset = 23
        this.yInitialOffset = 24
        this.animationDuration = 5 // 50 es lo óptimo
        this.pieceFadeOutDuration = 500 // 50 es lo óptimo
        this.currentPieceRow = -1
        this.currentPieceColumn = -1
        // Create array structure
        this.rows = Constants.ROWS
        this.columns = Constants.COLUMNS
        this.halfRows = Math.round(this.rows / 2)
        this.halfColumns = Math.round(this.columns / 2)

        this.createBoardStructure()
    }

    createBoardStructure()
    {
        this.structure = []
        
        for(let i=0; i<this.columns; i++){

            this.structure[i] = []

            for(let j=0; j<this.rows; j++){
                this.structure[i][j] = new Slot({i, j})
            }   
        }
    }

    onComputerTurn(){
        // Send event with the current structure to the AI to make its play
        this.globalEvents.notify(GlobalEvents.ON_BOARD_FOR_COMPUTER_TURN, this.structure)
    }

    onUpdateCurrentTurn(config){
        this.currentPlayer = config.currentPlayer
    }

    onClickColumn(columnID){
        // TODO First, need to check if the column have blank space to play a piece here

        // Create a new piece depending on the player's turn
        const pieceID = this.counter++
        const pieceName = `piece-${pieceID}`
        const playerClass = this.getCurrentPlayerColor(false)

        // Create the HTML code for the piece and add it to the div container
        let piece = `<div id="${pieceName}" class="playing-piece playing-piece-${playerClass}"></div>`
        this.appendHtml(this.holderDOM, piece)

        // Define the X position for the piece
        const x = this.xInitialOffset + ((this.pieceWidth + this.pieceMargin) * (columnID - 1))
        piece = document.querySelector(`#${pieceName}`)
        piece.style.left = `${x}px`

        // Place the piece at the top
        piece.style.top = `${this.startYPosition}px`

        // Define the Y position to travel to, depending on the available row
        const avaialbleRow = this.findAvailableRow(columnID - 1)
        const yDestination = this.yInitialOffset + ((this.pieceWidth + this.pieceMargin) * (avaialbleRow))
        //piece.style.top = `${yDestination}px`

        this.currentPieceRow = columnID - 1
        this.currentPieceColumn = avaialbleRow

        this.movePiece(pieceName, yDestination, avaialbleRow)
        // console.log(avaialbleRow)

        // Update data model
        this.structure[columnID-1][avaialbleRow].piece = this.currentPlayer
        this.structure[columnID-1][avaialbleRow].domElement = piece
        this.structure[columnID-1][avaialbleRow].pieceName = pieceName
    }

    movePiece(pieceName, yDestination, avaialbleRow){
        // Notify a piece is moving
        this.globalEvents.notify(GlobalEvents.ON_PIECE_MOVEMENT_STARTED)
        
        const duration = 300 + (avaialbleRow * this.animationDuration)
        const animation = anime({
            targets: `#${pieceName}`,
            top: yDestination,
            duration: duration,
            easing: 'easeInQuart',

        })

        animation.finished.then(()=>{
            this.onPieceMovementEnded()
        })
    }

    onPieceMovementEnded(){
        // Check for win condition
        const conditionResult = this.checkForWinCondition()
        //console.log(conditionResult)
        if(conditionResult.isConditionMet){
            // A pleyer has won, finish the current game
            const delay = 2000
            
            // Scope
            const that = this

            const timeoutId = setTimeout(function(){
                
                // Notifiy
                that.globalEvents.notify(GlobalEvents.ON_GAME_ENDED, {
                    winningTeam: conditionResult.winningTeam,
                })

                // Clear board
                that.clearBoard()

                clearTimeout(timeoutId);    
            }, delay);

            // change color of the winning pieces
            conditionResult.piecesArray.map((piece, indx) =>{
                const currentPieceClass = `playing-piece-${this.getCurrentPlayerColor(false)}`
                const winnerPieceClass =  `playing-piece-${this.getCurrentPlayerColor(true)}`
                const pieceDomElement = piece.domElement
                const delay = 100 * indx
                const timeoutId = setTimeout(function(){
                    pieceDomElement.classList.remove(currentPieceClass) 
                    pieceDomElement.classList.add(winnerPieceClass)
                    clearTimeout(timeoutId);    
                }, delay);

            })
        }else{
            // NO player has won yet, keep on playing

            // Enable next player interaction, wait, what if next player is computer?
            // This is responsability of TurnController
            this.globalEvents.notify(GlobalEvents.ON_WAITING_FOR_NEXT_TURN)
            
            
        }

        
    }

    checkForWinCondition(){
        let checkAxisResult = new CheckAxisResult()
        let winningTeam = ""
        upperloop:
        for(let column=0; column< this.columns; column++){
            for(let row=0; row<this.rows; row++){
                const slot = this.structure[column][row]
                if(slot.piece == null) continue

                // east axis => check only if i < half columns
                if(column < this.halfColumns){
                    //console.log(`checking east axis for column:${column} row:${row}`)
                    checkAxisResult = this.checkAxis(1, 0, column, row)
                    if(checkAxisResult.isConditionMet) {
                        //console.log(`isWinConditionMet es TRUE!! hacemos BREAK`)
                        winningTeam = slot.piece
                        break upperloop
                    }
                }

                // south axis => check only if i < half rows
                if(row < this.halfRows){
                    //console.log(`checking south axis for column:${column} row:${row}`)
                    checkAxisResult = this.checkAxis(0, 1, column, row)
                    if(checkAxisResult.isConditionMet) {
                        //console.log(`isWinConditionMet es TRUE!!  hacemos BREAK`)
                        winningTeam = slot.piece
                        break upperloop

                    }
                }
                
                // north-east axis
                if(column < this.halfColumns && row >= this.halfRows){
                    //console.log(`checking north-east axis for column:${column} row:${row}`)
                    checkAxisResult = this.checkAxis(1, -1, column, row)
                    if(checkAxisResult.isConditionMet) {
                        //console.log(`isWinConditionMet es TRUE!! hacemos BREAK`)
                        winningTeam = slot.piece
                        break upperloop
                    }
                }

                // south-east axis
                if(column < this.halfColumns && row < this.halfRows){
                    //console.log(`checking south-east axis for column:${column} row:${row}`)
                    checkAxisResult = this.checkAxis(1, 1, column, row)
                    if(checkAxisResult.isConditionMet) {
                        //console.log(`isWinConditionMet es TRUE!! hacemos BREAK`)
                        winningTeam = slot.piece
                        break upperloop
                    }
                }
                
            }   
        }

        // console.log(`isWinConditionMet:${isWinConditionMet}`)
        const conditionResult = new ConditionResult(checkAxisResult.isConditionMet, winningTeam, checkAxisResult.piecesArray)
        return conditionResult
    }

    checkAxis(horizontalAxisDirection, verticalAxisDirection, startingColumn, startingRow){
        // console.log(`------------------ START (de este axis: ${horizontalAxisDirection}-${verticalAxisDirection}) para pieza ${column}-${row}----------------`)
        // horizontal axis
        let lastColumn = startingColumn + (4 * horizontalAxisDirection)
        let lastRow = startingRow + (4 * verticalAxisDirection)
       

        if(startingColumn == lastColumn) lastColumn++
        if(startingRow == lastRow) lastRow++

        //console.log(`checkAxis current startingColumn: ${startingColumn} lastColumn:${lastColumn}`)
        //console.log(`checkAxis current startingRow: ${startingRow} lastRow:${lastRow}`)
        
        let currentPlayer = ""
        let pieces = []
        let isConditionMet = true
        const checkAxisResult = new CheckAxisResult()
        

        // Loop 4 positions, depending on the direction will increase rows, columns or both
        let column = startingColumn
        let row = startingRow
        for (let index = 0; index < 4; index++) {
            const slot = this.structure[column][row]
            if(slot.piece == undefined){
                isConditionMet = false
                break
            }else{
                if(currentPlayer == ""){
                    currentPlayer = slot.piece
                    //console.log(`[1] seteamos current player: ${currentPlayer} para column:${i} row:${j} iniciamos búsqueda`)
                }else{
                    if(currentPlayer != slot.piece){
                        // if the current slot is different than the previous slot it's no match
                        //console.log(`[2] current búsqueda es ${currentPlayer} pero este slot.piece es ${slot.piece} para column:${i} row:${j}`)
                        isConditionMet = false
                        break
                    }
                }
                pieces.push(slot)
            }

            // Next iteration
            column += horizontalAxisDirection
            row += verticalAxisDirection
        }

        checkAxisResult.piecesArray = pieces
        checkAxisResult.isConditionMet = isConditionMet
        return checkAxisResult
    }

    getCurrentPlayerColor(isWinner){
        let player = ""
        if(this.currentPlayer == Constants.PLAYER_A){
            player = "red"
        }else{
            player = "yellow"
        }

        if(isWinner){
            return `${player}-winner`
        }else{
            return `${player}-active`
        }
    }

    findAvailableRow(column){
        
        for(let j = this.rows-1; j >= 0; j--){
            const slot = this.structure[column][j]
            const isAvailable = slot.isAvailable()
            if(slot.isAvailable()){
                return j
            }
        }  

        return -1
    }

    appendHtml(el, str) {
        var div = document.createElement('div');
        div.innerHTML = str;
        while (div.children.length > 0) {
          el.appendChild(div.children[0]);
        }
    }
    
    onExitGame(){
        // Clean the board of pieces

        // Remove all pieces for the dom
        const playingPieces = document.querySelectorAll(".playing-piece");

        for (const playingPiece of playingPieces) {
            playingPiece.remove();
        }

        // Clean the structure model
        for(let i=0; i<this.columns; i++){
            for(let j=0; j<this.rows; j++){
                this.structure[i][j].piece = null
            }   
        }
    }

    clearBoard(){
        for(let i=0; i<this.columns; i++){
            for(let j=0; j<this.rows; j++){
                if(this.structure[i][j].piece != null){
                    const pieceName = this.structure[i][j].pieceName
                    const domElement = this.structure[i][j].domElement
                    console.log(domElement)
    
                    const animation = anime({
                        targets: `#${pieceName}`,
                        opacity: 0,
                        duration: this.pieceFadeOutDuration,
                        easing: 'easeInQuart',        
                    })
    
                    animation.finished.then(()=>{
                        // Remove this elements from the dom
                        // domElement.remove()
                    })
                }
                
            }   
        }
    }
}

export default BoardController;