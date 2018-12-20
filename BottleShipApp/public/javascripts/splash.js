

//fullscreen
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
// statistics 1: number of distinct users ever played
// (function DistinctUsersPlayed(){
//   let UserCount = Database.getPlayerCount;
//   document.getElementById('distinctUsersPlayed').innerHTML = "Number of Distinct users ever playeed: " + UserCount;
// }());
