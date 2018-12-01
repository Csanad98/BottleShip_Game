var main = function() {
    "use strict";

    //event handler for clicking on the button
    //listens on the button
    $(".username_input button").on("click", function(event) {
      addNickNameFromInput();
    });

    var addNickNameFromInput = function () {

        //declare the variable to store the new username
        var new_user = "";
        sayHello(new_user);
    
        if($(".username_input input").val() !== "") {

            //then get the entered value from the input field
            new_user = $("<p>").text($(".username_input input").val());

            //clear the input field
            $(".comment-input input").val("");
            sayHello();

        }
    }

    function sayHello(username) {
         alert("Hello " + username);
    }



}

function save(){
    var text_to_save=document.getElementById('submitButton').value;
    localStorage.setItem("playersName", text_to_save); // save the item
    }

function retrieve(){
    var playersName=localStorage.getItem("playersName"); // retrieve
    document.getElementById('textDiv').innerHTML = playersName; // display
}

$(document).ready(main);
