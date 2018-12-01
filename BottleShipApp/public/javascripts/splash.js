


var savePlayerName = function(){
    var text_to_save=document.getElementById('playerName').value;
    alert(text_to_save);
    localStorage.setItem("playerName", text_to_save); // save the item
    var user=localStorage.getItem("playerName"); // retrieve
    retrievePlayerName();
    alert("Hello " + user );
}

function retrievePlayerName(){
    var playersName=localStorage.getItem("playerName"); // retrieve
    document.getElementById('textDiv').innerHTML = playersName; // display
}


