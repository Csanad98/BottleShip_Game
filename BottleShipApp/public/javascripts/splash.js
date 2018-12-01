var main = function() {
    
    
    //don't use sloppy parts of JS
    "use strict";

    //event handler for clicking on the button
    //listens on the button
$(".username_input button").on("click", function(event) {
    sayHello();
    savePlayerName();
    retrievePlayerName();
});

//if user entered her/his name then start the game
var addNickNameFromInput = function () {

    //declare the variable to store the new username
    var new_user = "";
    sayHello();
    
    if($(".username_input input").val() !== "") {

        //then get the entered value from the input field
        new_user = $("<p>").text($(".username_input input").val());

        //clear the input field
        $(".comment-input input").val("");
        sayHello();

    }
}

function sayHello() {
    alert("Hello ");
}


function savePlayerName(){
    var text_to_save=document.getElementById('submitButton').value;
    localStorage.setItem("playerName", text_to_save); // save the item
    }

function retrievePlayerName(){
    var playersName=localStorage.getItem("playersName"); // retrieve
    document.getElementById('textDiv').innerHTML = playersName; // display
}

}

$(document).ready(main);
