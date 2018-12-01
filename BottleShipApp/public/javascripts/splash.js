
//save user's name, which was entered to the input box
var savePlayerName = function(){
    var text_to_save=document.getElementById('playerName').value;
    
    //if the input field is not empty
    if(text_to_save !== "") {

        localStorage.setItem("player_name", text_to_save); // save the item
        alert("Hello " + retrievePlayerName() + "! Click OK to get started with placing your ships!");
        window.open("placeShips.html", "_self");

    } else if(text_to_save === "") {
        alert("Please add your name to the input field to get started.");
    }

}

//returns the player's name which was saved to the localStorage
var retrievePlayerName = function (){
    return localStorage.getItem("player_name"); // retrieve
}


