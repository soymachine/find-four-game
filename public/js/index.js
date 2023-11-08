import EndGameController from './com/controllers/EndGameController.js';
import GameController from './com/controllers/GameController.js'
import ColumnButtons from './board/ColumnButtons.js'
import AIController from './com/controllers/AIController.js';

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
       
       
    }
}


document.addEventListener("DOMContentLoaded", function() {
     // Initialize your application or run some code.
    Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
        // GameController
        const endGameController = new EndGameController()
        const gameController = new GameController()
        // Handle the column buttons
        const columnButtons = new ColumnButtons()
        // AI for computer turns
        const aiController = new AIController()
        
    })
});