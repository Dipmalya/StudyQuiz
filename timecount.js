function startTimer() {
	  //document.getElementById('timeCount').innerHTML = "05" + ":" + "00";
	  var presentTime = document.getElementById('timeCount').innerHTML;
	  var timeArray = presentTime.split(/[:]+/);
	  var m = timeArray[0];
	  var s = checkSecond((timeArray[1] - 1));
	  if(s==59){
		  m=m-1
	  }
	  document.getElementById('timeCount').innerHTML = m + ":" + s;
	  setTimeout(startTimer, 1000);
}
	
function checkSecond(sec) {
	  if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
	  if (sec < 0) {sec = "59"};
	  return sec;
}