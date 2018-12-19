

//using web sockets
var socket = new WebSocket("ws://localhost:3000");
            socket.onmessage = function(event){
                document.getElementById("hello").innerHTML = event.data;
            }
            socket.onopen = function(){
                socket.send(JSON.stringify({messageType: "connect"}));
                socket.send(JSON.stringify({messageType: "readyToPlay"}));
            };

