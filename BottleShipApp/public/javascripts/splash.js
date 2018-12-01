function sayHello() {
    alert("Hello");
}

function save(){
    var text_to_save=document.getElementById('submitButton').value;
    localStorage.setItem("playersName", text_to_save); // save the item
    }

function retrieve(){
    var playersName=localStorage.getItem("playersName"); // retrieve
    document.getElementById('textDiv').innerHTML = playersName; // display
}