
class Slot {

    constructor({i, j}) {
        this.i = i
        this.j = j
        this.piece = null
        this.domElement = null
        this.pieceName = null
    }
    
    isAvailable(){
        return (this.piece == null)
    }
}

export default Slot;