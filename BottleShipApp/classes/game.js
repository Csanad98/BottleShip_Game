

/* every game has two players, identified by their WebSocket */

var game = function (gameID, playerA, playerB) {
    this.playerA = playerA;
    this.playerB = playerB;
    this.id = gameID;
    this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted, 
    //SHIPSELCTION means ships are being placed, IN PROGRESS means that players are in the guessing phrase
};
