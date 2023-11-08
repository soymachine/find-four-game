class ConditionResult{
    constructor(isConditionMet, winningTeam = null, piecesArray = null){
        this.isConditionMet = isConditionMet
        this.winningTeam = winningTeam
        this.piecesArray = piecesArray
    }
}

export default ConditionResult