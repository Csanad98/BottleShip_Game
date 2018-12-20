var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  } 
}


/*

//using web sockets
var socket = new WebSocket("ws://localhost:3000");
            /* socket.onmessage = function(event){
                document.getElementById("hello").innerHTML = event.data;
            } */ /*
            socket.onopen = function(){
                socket.send(JSON.stringify({messageType: "connect"}));
                socket.send(JSON.stringify({messageType: "readyToPlay"}));
            };
*/