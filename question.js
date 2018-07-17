var qno = 0;
var rightAns = "";
var qMap = new Map();
var qMapAns = new Map();
var score=0,flag="start";
var length=0;
var qid=0;

var bringBadges = function(){
	$.get("question.json",
		function callQ(qData,status){
			length=qData.length;
			for(var p=0;p<length;p++){
				var ans = qData[p].ansid;
				qMapAns.set(p+1,ans);
			}
			for(var k=1;k<=length;k++){
				var element = document.createElement("input");
				element.type = "button";
				element.value = k;
				element.id = ("btn"+k);
				element.onclick = function() {
					colorBadges();
					clearResponse();
					var i=this.value;
					document.getElementById('qName').innerHTML=(qData[i-1].qid+1)+". "+qData[i-1].question;
					document.getElementById('opt1').innerHTML=qData[i-1].option1;
					document.getElementById('opt2').innerHTML=qData[i-1].option2;
					document.getElementById('opt3').innerHTML=qData[i-1].option3;
					document.getElementById('opt4').innerHTML=qData[i-1].option4;
					rightAns = qData[i-1].answer;
					qno=i;
					var opt = document.getElementsByName('option');
					opt[qMap.get(eval(i))].checked=true;
				};
				element.classList.add("round-btn");
				var foo = document.getElementById("panel");  
				foo.appendChild(element);
			}
	});
}


var questionFirst = function(){
	bringBadges();
	startTimer();
	$.get("question.json",
			function callQ(qData,status){
				length=qData.length;
				document.getElementById('qName').innerHTML=(qData[0].qid+1)+". "+qData[0].question;
				document.getElementById('opt1').innerHTML=qData[0].option1;
				document.getElementById('opt2').innerHTML=qData[0].option2;
				document.getElementById('opt3').innerHTML=qData[0].option3;
				document.getElementById('opt4').innerHTML=qData[0].option4;
				rightAns = qData[0].answer;
				qno++;
		});
	if(qno==1){
		$('#btnPrev').prop('disabled', true);
	}
	checkAnswer();
}

var storeResponse = function(answer){
	qMap.set(qno,answer);
}

var bringPrevious = function(id){
	return qMap.get(id);
}


var checkAnswer = function(){
	var opt = document.getElementsByName('option');
	for(var i=0;i<4;i++){
		if(opt[i].checked==true){
			var id = "opt"+(i+1);
			if(document.getElementById(id).innerHTML == rightAns)
				score++;
		}
	}
}

var clearResponse = function(){
	var opt = document.getElementsByName('option');
	for(var i=0;i<4;i++){
		if(opt[i].checked==true){
			opt[i].checked=false;
		}
	}
}


var nextQ = function(){
	$('#btnPrev').prop('disabled', false);
	var opt = document.getElementsByName('option');
	for(var i=0;i<4;i++){
		if(opt[i].checked==true){
			storeResponse(i);
			colorBadges();
		}
	}
	$.get("question.json",
			function callQ(qData,status){
				if(qno==qData.length-1){
					document.getElementById('btnNext').value="FINISH";
					flag="end";
				}
				for(var i=0;i<qData.length;i++){
					if(qData[i].qid==qno){
						document.getElementById('qName').innerHTML=(qData[i].qid+1)+". "+qData[i].question;
						document.getElementById('opt1').innerHTML=qData[i].option1;
						document.getElementById('opt2').innerHTML=qData[i].option2;
						document.getElementById('opt3').innerHTML=qData[i].option3;
						document.getElementById('opt4').innerHTML=qData[i].option4;
						rightAns = qData[i].answer;
					}
				}
				if(qMap.has(qno+1))
					opt[qMap.get(qno+1)].checked=true
				qno++;
		});
	checkAnswer();
	if(document.getElementById('btnNext').value== "FINISH" ){
		if(confirm("Do you want to submit?"))
			initiateScore();
	}
	else
		clearResponse();
}

var prevQ = function(){
	$.get("question.json",
			function callQ(qData,status){
				//var qData=JSON.parse(data);
				if(qno==1){
					$('#btnPrev').prop('disabled', true);
					return false;
				}
				qno=qno-2;
				for(var i=0;i<qData.length;i++){
					if(qData[i].qid==qno){
						document.getElementById('qName').innerHTML=(qData[i].qid+1)+". "+qData[i].question;
						document.getElementById('opt1').innerHTML=qData[i].option1;
						document.getElementById('opt2').innerHTML=qData[i].option2;
						document.getElementById('opt3').innerHTML=qData[i].option3;
						document.getElementById('opt4').innerHTML=qData[i].option4;
					}
				}
				qno++;
				var opt = document.getElementsByName('option');
				for(var i=0;i<4;i++){
					if(i==bringPrevious(qno)){
						opt[i].checked=true;
					}	
				}
		});
	document.getElementById('btnNext').value="NEXT";
}

function startTimer() {
	  var presentTime = document.getElementById('timeCount').innerHTML;
	  var timeArray = presentTime.split(/[:]+/);
	  var m = timeArray[0];
	  var s = checkSecond((timeArray[1] - 1));
	  if(eval(m)==0 && eval(s)==0){
		  document.getElementById('question').innerHTML="";
		  var display="<div style='font-size:28px;text-align:center;color:#3aa13c;font-weight:bold;margin-top:170px;'>Your Score is "+score +" / "+length +"</div>";
		  document.getElementById('screen').innerHTML = display;
		  document.getElementById('timeCount').style="color:#F3F1B1";
	  }
	  if(s==59){
		  m=m-1;
	  }
	  document.getElementById('timeCount').innerHTML = m + ":" + s;
	  setTimeout(startTimer, 1000);
}
	
function checkSecond(sec) {
	  if (sec < 10 && sec >= 0) {sec = "0" + sec}; // add zero in front of numbers < 10
	  if (sec < 0) {sec = "59"};
	  return sec;
}

var initiateScore = function(){
	var result=0;
	for(var p=1;p<=length;p++){
		if(qMapAns.get(p)==qMap.get(p)){
			result++;
		}
	}
	if(flag=="end"){
		var display="<div style='font-size:28px;text-align:center;color:#3aa13c;font-weight:bold;margin-top:170px;'>Your Score is "+result +" / "+length +"</div>";
		document.getElementById('screen').innerHTML = display;
		document.getElementById('timeCount').style="color:#F3F1B1";
	}
}

var colorBadges = function(){
	var i;
	for(i=1;i<=length;i++){
		if(qMap.has(i)){
			var w="btn"+i;
			var sidebtn = document.getElementById(w);
			sidebtn.style="background-color:lightgreen";
		}
	}
}
function validUser(){
	if(!document.hasFocus()){
		flag="end";
		initiateScore();
	}
}