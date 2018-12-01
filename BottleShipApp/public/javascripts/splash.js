
//save user's name, which was entered to the input box
var savePlayerName = function(){
    var text_to_save=document.getElementById('playerName').value;
    
    localStorage.setItem("player_name", text_to_save); // save the item
    alert("Hello " + retrievePlayerName() );


}

//returns the player's name which was saved to the localStorage
var retrievePlayerName = function (){
    return localStorage.getItem("player_name"); // retrieve
}


