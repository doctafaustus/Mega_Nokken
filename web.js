
var express = require('express');
var app = express();
var http = require('http').Server(app);

var io = require('socket.io')(http);
var ejs = require('ejs');
var fs = require('fs');
var favicon = require('serve-favicon');

app.get('/', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});


app.use(favicon(__dirname + '/public/favicon.ico'));
  //since we are in a request handler function
  //we're using readFile instead of readFileSync
  fs.readFile('index.html', 'utf-8', function(err, content) {
    if (err) {
      res.end('error occurred');
      return;
    }

    var target_date = new Date("Oct 17, 2014 05:10:00").getTime(); //add 7 hours to current time
    var current_date = new Date().getTime();

    var renderedHtml = ejs.render(content, {target_date: target_date, current_date: current_date});  //get redered HTML code
    res.end(renderedHtml);
  });
});


app.use(express.static(__dirname + '/public'));

//var time = new Date();
//var timeInMillis = time.getTime();
//var timePlus5Seconds = timeInMillis + 50000;
//console.log(timeInMillis);

var clients = [];
var list = "";
var nodeList;
var scoreList;
var leaderList;

//Needed for Heroku to have client's connection working properly
io.onopen = function()  { 
      console.log('websocket opened');
      setInterval(function() {
        if (ws.bufferedAmount == 0)
          ws.send("Keep alive from client"  );
        }, 5000 );
};

                    
io.on('connection', function(socket) {
	clients.push(socket.id = new MakeObj(socket.id));
	console.log(socket.id.name + ' connected');
	listClients(clients);

	socket.on('newname', function(nameboard) {
		socket.id.name = nameboard;
		if (socket.id.name === "a") {
			socket.emit('adminRegistered');
			var adminPosition = clients.indexOf(socket.id);
			if (adminPosition > -1) {
				clients.splice(adminPosition, 1);
				listClients(clients);
				console.log("wacky weasel"); //Just to see if it works
			}
		}
		console.log("New name is " + socket.id.name);
		socket.id.lastQIndicator = "<img src='gray.png'>" + "<span>" + socket.id.name + "</span>";
	});

	socket.on('submission', function(submission, submitTimeInMillis) {
		socket.id.mySubmitTime = submitTimeInMillis;
		console.log(socket.id.name + ' Submit Time: ' + socket.id.mySubmitTime);
		console.log(submission);
		switch(questionNumber) {
			case "question1" : 
				getResults('Pig');
				break;
			case "question2" :
				getResults('Eighteen');
				break;
			case "question3" :
				getResults('Gastrocnemius');
				break;
			case "question4" :
				getResults('Flail');
				break;
			case "question5" : 
				getResults('Orange');
				break;
			case "question6" : 
				getResults('Juneau');
				break;
			case "question7" :
				getResults('Lincoln');
				break;
			case "question8" :
				getResults('David Adkins');
				break;
			case "question9" :
				getResults('Diamond');
				break;
			case "question10" : 
				getResults('Georgie Porgie');
				break;
			case "question11" : 
				getResults('Adrenaline');
				break;
			case "question12" :
				getResults('Mars and Murrie');
				break;
			case "question13" :
				getResults('Beowulf');
				break;
			case "question14" :
				getResults('J');
				break;
			case "question15" : 
				getResults('Pogs');
				break;
			case "question16" : 
				getResults('Nurses run');
				break;
			case "question17" : 
				getResults('Graphics Interchange Format');
				break;
			case "question18" : 
				getResults('Pulse Up');
				break;
			case "question19" : 
				getResults('Prince John');
				break;
			case "question20" : 
				getResults('Cigarettes');
				break;
			case "question21" : 
				getResults('King K. Rool');
				break;
			case "question22" : 
				getResults('Orange');
				break;
			case "question23" : 
				getResults('Dividend');
				break;
			case "question24" : 
				getResults('Pens');
				break;
			case "question25" : 
				getResults('Archaeologist');
				break;
			case "question26" : 
				getResults('BackRub');
				break;
			case "question27" : 
				getResults('Ulysses S. Grant');
				break;
			case "question28" : 
				getResults('1');
				break;
			case "question29" : 
				getResults('Green Onion');
				break;
			case "question30" : 
				getResults('James Brown');
				break;	
		}

		// Main getResults functionality
		function getResults(correctAnswer) {
			if (submission === correctAnswer) {
				//Time Stuff
				socket.id.myAnswerTime = socket.id.mySubmitTime - socket.id.myQuestionPresentTime;
				console.log(socket.id.name + ' Question Answered In: ' + socket.id.myAnswerTime + 'ms');
				socket.id.avgAnswerTimeArray.push(socket.id.myAnswerTime);
				var sum = 0;
				var average;
				for (var i = 0; i < socket.id.avgAnswerTimeArray.length; i++) {
					sum = sum + socket.id.avgAnswerTimeArray[i];
				}
				average = sum / socket.id.avgAnswerTimeArray.length;
				average = average / 1000;
				socket.id.myAverageAnswerTime = average.toFixed(2);;
				console.log(socket.id.name + ' AVG ANSWER TIME: ' + average);


				//Bonus for quick answer
				if (socket.id.myAnswerTime < 3001) {
					socket.id.rating += 125;
					var resultMessage = "Correct! +125 pts.";
					console.log("RATING FOR " + socket.id.name + " is:   " + socket.id.rating);
					socket.id.bonus = true;
				} else {
					socket.id.rating += 100;
					console.log("RATING FOR " + socket.id.name + " is:   " + socket.id.rating);
					var result = "CORRECT";
					var score = socket.id.rating;
					var resultMessage = "Correct! +100 pts.";
					socket.id.bonus = false;
				}

				socket.emit('transferresultmessage', resultMessage);
				socket.id.streak++;
				socket.id.streakReset = false;
				if (socket.id.streakReset !== true && socket.id.streak > socket.id.highStreak) {
					socket.id.highStreak++;
					console.log('High streak for ' + socket.id.name + ' is: ' + socket.id.highStreak);
				}
				socket.id.rightanswers++;
				socket.id.qFaced = socket.id.rightanswers + socket.id.wronganswers + socket.id.notanswered;
				console.log("Q Faced for " + socket.id.name +  ": " + socket.id.qFaced);
				socket.id.lastQIndicator = "<img src='green.png'>" + "<span>" + socket.id.name + "</span>";
			} else {
				console.log("FALSE");
				var result = "FALSE";
				var score = socket.id.rating;
				var resultMessage = "Incorrect (" + correctAnswer + ")";
				socket.emit('transferresultmessage', resultMessage);
				socket.id.streak = 0;
				socket.id.wronganswers++;
				socket.id.qFaced = socket.id.rightanswers + socket.id.wronganswers + socket.id.notanswered;
				console.log("Q Faced for " + socket.id.name +  ": " + socket.id.qFaced);
				socket.id.lastQIndicator = "<img src='red.png'>" + "<span>" + socket.id.name + "</span>";
				socket.id.bonus = false;
			}
		}
	});

	socket.on('questionpresenttime', function(timeInMillis) {
		socket.id.myQuestionPresentTime = timeInMillis;
		console.log(socket.id.name + ' Question Present Time: ' + socket.id.myQuestionPresentTime);
	});
	
	socket.on('resetstreak', function() {
		socket.id.streak = 0;
		socket.id.streakReset = true;
	});

	socket.on('noanswer', function() {
		socket.id.notanswered++;
		console.log('NOT ANSWERD: ' + socket.id.name + "  " + socket.id.notanswered);
		socket.id.qFaced = socket.id.rightanswers + socket.id.wronganswers + socket.id.notanswered;
		console.log("Q Faced for " + socket.id.name +  ": " + socket.id.qFaced);
		socket.id.lastQIndicator = "<img src='red.png'>" + "<span>" + socket.id.name + "</span>";
		socket.id.bonus = false;
	});


	socket.on('requestscores', function(rightAnswer) {
		var myScore = socket.id.rating;
		var myStreak = socket.id.streak;
		var myHighStreak = socket.id.highStreak;
		var tempRank = socket.id.rank;
		var myAvgAnswerTime = socket.id.myAverageAnswerTime;
		var myBonus = socket.id.bonus;
		socket.emit('returnscores', rightAnswer, myScore, myStreak, tempRank, myHighStreak, myAvgAnswerTime, myBonus);
	});

	socket.on('setq1', function() {
		header = q1[0];
		questionNumber = 'question1';
		io.emit('change_header', {
			header: header,
			qNum: 1,
			answerA: q1[1],
			answerB: q1[2],
			answerC: q1[3],
			answerD: q1[4]
		});
		var rightAnswer = q1[4];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});

	socket.on('setq2', function() {
		header = q2[0];
		questionNumber = 'question2';
		io.emit('change_header', {
			header: header,
			qNum: 2,
			answerA: q2[1],
			answerB: q2[2],
			answerC: q2[3],
			answerD: q2[4]
		});
		var rightAnswer = q2[1];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});

	socket.on('setq3', function() {
		header = q3[0];
		questionNumber = 'question3';
		io.emit('change_header', {
		    header: header,
			qNum: 3,		    
		    answerA: q3[1],
		    answerB: q3[2],
		    answerC: q3[3],
		    answerD: q3[4]
		});
		var rightAnswer = q3[1];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});

	// Start of New Questions
	socket.on('setq4', function() {
		header = q4[0];
		questionNumber = 'question4';
		io.emit('change_header', {
		    header: header,
			qNum: 4,
		    answerA: q4[1],
		    answerB: q4[2],
		    answerC: q4[3],
		    answerD: q4[4]
		});
		var rightAnswer = q4[3];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});

	socket.on('setq5', function() {
		header = q5[0];
		questionNumber = 'question5';
		io.emit('change_header', {
		    header: header,
			qNum: 5,
		    answerA: q5[1],
		    answerB: q5[2],
		    answerC: q5[3],
		    answerD: q5[4]
		});
		var rightAnswer = q5[3];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq6', function() {
		header = q6[0];
		questionNumber = 'question6';
		io.emit('change_header', {
		    header: header,
			qNum: 6,
		    answerA: q6[1],
		    answerB: q6[2],
		    answerC: q6[3],
		    answerD: q6[4]
		});
		var rightAnswer = q6[3];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});		

	socket.on('setq7', function() {
		header = q7[0];
		questionNumber = 'question7';
		io.emit('change_header', {
		    header: header,
			qNum: 7,
		    answerA: q7[1],
		    answerB: q7[2],
		    answerC: q7[3],
		    answerD: q7[4]
		});
		var rightAnswer = q7[4];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});

	socket.on('setq8', function() {
		header = q8[0];
		questionNumber = 'question8';
		io.emit('change_header', {
		    header: header,
			qNum: 8,
		    answerA: q8[1],
		    answerB: q8[2],
		    answerC: q8[3],
		    answerD: q8[4]
		});
		var rightAnswer = q8[1];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});		

	socket.on('setq9', function() {
		header = q9[0];
		questionNumber = 'question9';
		io.emit('change_header', {
		    header: header,
			qNum: 9,
		    answerA: q9[1],
		    answerB: q9[2],
		    answerC: q9[3],
		    answerD: q9[4]
		});
		var rightAnswer = q9[3];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq10', function() {
		header = q10[0];
		questionNumber = 'question10';
		io.emit('change_header', {
		    header: header,
			qNum: 10,
		    answerA: q10[1],
		    answerB: q10[2],
		    answerC: q10[3],
		    answerD: q10[4]
		});
		var rightAnswer = q10[2];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});		

	socket.on('setq11', function() {
		header = q11[0];
		questionNumber = 'question11';
		io.emit('change_header', {
		    header: header,
			qNum: 11,
		    answerA: q11[1],
		    answerB: q11[2],
		    answerC: q11[3],
		    answerD: q11[4]
		});
		var rightAnswer = q11[4];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq12', function() {
		header = q12[0];
		questionNumber = 'question12';
		io.emit('change_header', {
		    header: header,
			qNum: 12,
		    answerA: q12[1],
		    answerB: q12[2],
		    answerC: q12[3],
		    answerD: q12[4]
		});
		var rightAnswer = q12[2];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq13', function() {
		header = q13[0];
		questionNumber = 'question13';
		io.emit('change_header', {
		    header: header,
			qNum: 13,
		    answerA: q13[1],
		    answerB: q13[2],
		    answerC: q13[3],
		    answerD: q13[4]
		});
		var rightAnswer = q13[1];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq14', function() {
		header = q14[0];
		questionNumber = 'question14';
		io.emit('change_header', {
		    header: header,
			qNum: 14,
		    answerA: q14[1],
		    answerB: q14[2],
		    answerC: q14[3],
		    answerD: q14[4]
		});
		var rightAnswer = q14[3];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq15', function() {
		header = q15[0];
		questionNumber = 'question15';
		io.emit('change_header', {
		    header: header,
			qNum: 15,
		    answerA: q15[1],
		    answerB: q15[2],
		    answerC: q15[3],
		    answerD: q15[4]
		});
		var rightAnswer = q15[2];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq16', function() {
		header = q16[0];
		questionNumber = 'question16';
		io.emit('change_header', {
		    header: header,
			qNum: 16,
		    answerA: q16[1],
		    answerB: q16[2],
		    answerC: q16[3],
		    answerD: q16[4]
		});
		var rightAnswer = q16[1];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq17', function() {
		header = q17[0];
		questionNumber = 'question17';
		io.emit('change_header', {
		    header: header,
			qNum: 17,
		    answerA: q17[1],
		    answerB: q17[2],
		    answerC: q17[3],
		    answerD: q17[4]
		});
		var rightAnswer = q17[3];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq18', function() {
		header = q18[0];
		questionNumber = 'question18';
		io.emit('change_header', {
		    header: header,
			qNum: 18,
		    answerA: q18[1],
		    answerB: q18[2],
		    answerC: q18[3],
		    answerD: q18[4]
		});
		var rightAnswer = q18[3];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq19', function() {
		header = q19[0];
		questionNumber = 'question19';
		io.emit('change_header', {
		    header: header,
			qNum: 19,
		    answerA: q19[1],
		    answerB: q19[2],
		    answerC: q19[3],
		    answerD: q19[4]
		});
		var rightAnswer = q19[4];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq20', function() {
		header = q20[0];
		questionNumber = 'question20';
		io.emit('change_header', {
		    header: header,
			qNum: 20,
		    answerA: q20[1],
		    answerB: q20[2],
		    answerC: q20[3],
		    answerD: q20[4]
		});
		var rightAnswer = q20[3];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq21', function() {
		header = q21[0];
		questionNumber = 'question21';
		io.emit('change_header', {
		    header: header,
			qNum: 21,
		    answerA: q21[1],
		    answerB: q21[2],
		    answerC: q21[3],
		    answerD: q21[4]
		});
		var rightAnswer = q21[4];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq22', function() {
		header = q22[0];
		questionNumber = 'question22';
		io.emit('change_header', {
		    header: header,
			qNum: 22,
		    answerA: q22[1],
		    answerB: q22[2],
		    answerC: q22[3],
		    answerD: q22[4]
		});
		var rightAnswer = q22[1];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq23', function() {
		header = q23[0];
		questionNumber = 'question23';
		io.emit('change_header', {
		    header: header,
			qNum: 23,
		    answerA: q23[1],
		    answerB: q23[2],
		    answerC: q23[3],
		    answerD: q23[4]
		});
		var rightAnswer = q23[2];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq24', function() {
		header = q24[0];
		questionNumber = 'question24';
		io.emit('change_header', {
		    header: header,
			qNum: 24,
		    answerA: q24[1],
		    answerB: q24[2],
		    answerC: q24[3],
		    answerD: q24[4]
		});
		var rightAnswer = q24[4];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq25', function() {
		header = q25[0];
		questionNumber = 'question25';
		io.emit('change_header', {
		    header: header,
			qNum: 25,
		    answerA: q25[1],
		    answerB: q25[2],
		    answerC: q25[3],
		    answerD: q25[4]
		});
		var rightAnswer = q25[1];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq26', function() {
		header = q26[0];
		questionNumber = 'question26';
		io.emit('change_header', {
		    header: header,
			qNum: 26,
		    answerA: q26[1],
		    answerB: q26[2],
		    answerC: q26[3],
		    answerD: q26[4]
		});
		var rightAnswer = q26[4];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq27', function() {
		header = q27[0];
		questionNumber = 'question27';
		io.emit('change_header', {
		    header: header,
			qNum: 27,
		    answerA: q27[1],
		    answerB: q27[2],
		    answerC: q27[3],
		    answerD: q27[4]
		});
		var rightAnswer = q27[4];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq28', function() {
		header = q28[0];
		questionNumber = 'question28';
		io.emit('change_header', {
		    header: header,
			qNum: 28,
		    answerA: q28[1],
		    answerB: q28[2],
		    answerC: q28[3],
		    answerD: q28[4]
		});
		var rightAnswer = q28[2];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq29', function() {
		header = q29[0];
		questionNumber = 'question29';
		io.emit('change_header', {
		    header: header,
			qNum: 29,
		    answerA: q29[1],
		    answerB: q29[2],
		    answerC: q29[3],
		    answerD: q29[4]
		});
		var rightAnswer = q29[4];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('setq30', function() {
		header = q30[0];
		questionNumber = 'question30';
		io.emit('change_header', {
		    header: header,
			qNum: 30,
		    answerA: q30[1],
		    answerB: q30[2],
		    answerC: q30[3],
		    answerD: q30[4]
		});
		var rightAnswer = q30[3];
		io.emit('settimer');
		io.emit('disablebuttons', rightAnswer);
	});	

	socket.on('disconnect', function() {
		console.log(socket.id.name + ' disconneted');
		clients.splice(clients.indexOf(socket.id), 1);
	});
});


http.listen(process.env.PORT || 5000, function() {
	console.log("Server running on port 5000");
});

function listClients(myArray) {
	for (var i = 0; i < myArray.length; i++) {
		list = "Client#" + (i+1) + ": " + myArray[i].name + "\n";
		console.log(list);
	}
}

//Constructor function to mocket socket.id into an object w/ props
function MakeObj(socketid) {
	this.name = "Incoming Player...";
	this.rating = 0;
	this.nickname = undefined;
	this.streak = 0;
	this.highStreak = 0;
	this.streakReset = false;
	this.notanswered = 0;
	this.rightanswers = 0;
	this.wronganswers = 0;
	this.qFaced = this.notanswered + this.rightanswers + this.wronganswers;
	this.lastQIndicator = "<img src='gray.png'>" + "<span>" + this.name + "</span>";
	this.mySubmitTime = undefined;
	this.myQuestionPresentTime = undefined;
	this.myAnswerTime = undefined;
	this.avgAnswerTimeArray = [];
	this.myAverageAnswerTime = "--";
	this.bonus = false;
	this.onBoard = false;
}

var header = 'Get Ready...';
var answerA1 = 'A';
var answerB1 = 'B';
var answerC1 = 'C';
var answerD1 = 'D';
var questionNumber = 'question1';
var preGame = false;

io.on('connection', function(socket) {
	socket.on('getPreGame', function() {
		preGame = true;
		io.emit('showingPreVideo');
	});
	if (preGame == true) {
		socket.emit('showingPreVideo');
	}
	socket.on('getEndPreGame', function() {
		preGame = false;
		io.emit('gameIsReady');
	});
    socket.emit('change_header', {
        header: header,
        qNum: 0,
        answerA: answerA1,
        answerB: answerB1,
        answerC: answerC1,
        answerD: answerD1
    });
    socket.on('getRanks', function() {
		//Rank code
    	var sorted = [];
    	for (var u = 0; u < clients.length; u++) {
    		clients[u].rank = 0;
    		clients[u].tie = false;
    		console.log("rank cleared to: " + clients[u].rank + " And rating is " + clients[u].rating);
    	}
		for (var i = 0; i < clients.length; i++) {
			sorted.push(clients[i]);
		}
		sorted.sort(function(a, b) {
			return b.rating-a.rating;
		});
		for(var i = 0; i < sorted.length; i++) {
			// original ranking
			sorted[i].rank = i + 1;   
		}
		function sortRanking() {
			for (var k = 0; k < sorted.length; k++) {
				for (var h = 1; h < sorted.length + 1; h++) {
					if (sorted[k+h] !== undefined) {
					    if (sorted[k+h].tie !== true) {
					        if (sorted[k].rating === sorted[h + k].rating) {
					            sorted[k].rank = k + 1;
					            sorted[h + k].rank = k + 1;
					            sorted[k].tie = true;
					            sorted[h + k].tie = true;
					        }
					    }
					}    
				}
			}
		}
		sortRanking();
		for (var r = 0; r < clients.length; r++){
			console.log("Rank for " + clients[r].name + " is: " + clients[r].rank);
		}
		//End of Rank code
		//scoreList = ""; //Make the list of players and their scores 
		nodeList = ""; //Make the list of players and their scores 
		leaderList = "";

		var newSorted = [];
		for (var i = 0; i < clients.length; i++) {
			newSorted.push(clients[i]);
		}
		newSorted.sort(function(a, b) {
			return b.rating-a.rating;
		});

		//Node Table
		var nodetableheading = "<table id='nodeTable'>" + "<tr id='myRow'>" + "\n";
		var nodeCounter = 0;
		for (var i = 0; i < newSorted.length; i++) {
			nodeCounter++;
			console.log("nodeCounter value: " + nodeCounter);
			if (nodeCounter % 13 === 0) {
				nodeCounter = 0;
				nodeList = nodeList + "</tr>" + "<tr>" + "<td class='tooltip'>" + newSorted[i].lastQIndicator + "</td>" + "\n";
				nodeCounter++;
			} else {
				nodeList = nodeList + "<td class='tooltip'>" + newSorted[i].lastQIndicator + "</td>" + "\n";
			} 
		} 
		nodeList = nodetableheading + nodeList + "</tr>" + "\n" + "</table>";
		console.log(nodeList);

		//Leaderboard
		var leadertableheading = "<table id='leaderTable'>";
		for (var i = 0; i < newSorted.length; i++) { 
			if (i < 10) {
			  leaderList = leaderList + "<tr>" + "<td class='leaderplace'>" + newSorted[i].rank + "." + "</td>" + "<td align='left' class='leaderplayer'>" + 
			  newSorted[i].name + "</td>" + "<td class='leaderscore'>" + newSorted[i].rating + "</td>" + "<tr/>"; 
			}
		} 
		leaderList = leadertableheading + leaderList + "</table>";
		//console.log(leaderList); 

		/*
		//Old Score Chart
		var tableheading = "<table id='scoreTable'>" +
   							'<tr>' +
						      '<th class="place">Place</th>' +
						      '<th class="player">Player</th>' +
						      '<th class="score">Score</th>' +
						      '<th class="hstreak">High Streak</th>' +
						      '<th class="nodetest">Node</th>' +
						   '</tr>';
		for (var i = 0; i < newSorted.length; i++) { 
		  scoreList = scoreList + "<tr>" + "<td>" + newSorted[i].rank + "</td>" + "<td align='left'>" + 
		  newSorted[i].name + "</td>" + "<td>" + newSorted[i].rating + "</td>" + "<td>" + newSorted[i].highStreak + 
		  "</td>" + "<td>" + newSorted[i].lastQIndicator + "</td>" + "<tr/>"; 
		} 
		scoreList = tableheading + scoreList + "</table>";
		//console.log(scoreList);
		*/

		var winners = [];
		for (var i = 0; i < clients.length; i++) {
			if (clients[i].rank === 1) {
				winners.push(clients[i]);
			}
		}
		console.log('Num winners: ' + winners.length);
		winnerList = "";
		for (var j = 0; j < winners.length; j++) {
			winnerList = winnerList + winners[j].name + " ";
		}
		var winnerList2 = "Congratulations, " + winnerList;
		console.log(winnerList2);
		io.emit('ranksready', winnerList2);
	});
	socket.on('requestrank', function(winnerList2){
		var myRank = socket.id.rank;
		var usersplaying = clients.length;
socket.emit('publishrank', myRank, nodeList, winnerList2, usersplaying, leaderList, scoreList);
	});
	socket.on('getChart', function(){
		var group1 = 0; //The number of players who have a score of 0-1
		var group2 = 0;
		var group3 = 0;
		var group4 = 0;
		var group5 = 0;
		for (var i = 0; i < clients.length; i++) {
			if (clients[i].rightanswers < 2) {
				group1++;
				console.log(clients[i].name);
			}
			else if (clients[i].rightanswers < 4) {
				group2++;
				console.log(clients[i].name);
			}
			else if (clients[i].rightanswers < 6) {
				group3++;
				console.log(clients[i].name);
			}
			else if (clients[i].rightanswers < 8) {
				group4++;
				console.log(clients[i].name);
			}
			else if (clients[i].rightanswers < 11) {
				group5++;
				console.log(clients[i].name);
			}
		}
		console.log("Number of Players in Gorup1 = " + group1);
		console.log("Number of Players in Gorup2 = " + group2);
		console.log("Number of Players in Gorup3 = " + group3);
		console.log("Number of Players in Gorup4 = " + group4);
		console.log("Number of Players in Gorup5 = " + group5);
		io.emit('questionchart', group1, group2, group3, group4, group5);
	});
	socket.on('getChart2', function(){
		var group1 = 0; //The number of players who have a score of 0-1
		var group2 = 0;
		var group3 = 0;
		var group4 = 0;
		var group5 = 0;
		for (var i = 0; i < clients.length; i++) {
			if (clients[i].rightanswers < 5) {
				group1++;
				console.log(clients[i].name);
			}
			else if (clients[i].rightanswers < 9) {
				group2++;
				console.log(clients[i].name);
			}
			else if (clients[i].rightanswers < 13) {
				group3++;
				console.log(clients[i].name);
			}
			else if (clients[i].rightanswers < 17) {
				group4++;
				console.log(clients[i].name);
			}
			else if (clients[i].rightanswers < 21) {
				group5++;
				console.log(clients[i].name);
			}
		}
		io.emit('questionchart2', group1, group2, group3, group4, group5);
	});
	socket.on('getChart3', function(){
		var group1 = 0; //The number of players who have a score of 0-1
		var group2 = 0;
		var group3 = 0;
		var group4 = 0;
		var group5 = 0;
		for (var i = 0; i < clients.length; i++) {
			if (clients[i].rightanswers < 7) {
				group1++;
				console.log(clients[i].name);
			}
			else if (clients[i].rightanswers < 13) {
				group2++;
				console.log(clients[i].name);
			}
			else if (clients[i].rightanswers < 19) {
				group3++;
				console.log(clients[i].name);
			}
			else if (clients[i].rightanswers < 25) {
				group4++;
				console.log(clients[i].name);
			}
			else if (clients[i].rightanswers < 31) {
				group5++;
				console.log(clients[i].name);
			}
		}
		io.emit('questionchart3', group1, group2, group3, group4, group5);
	});
	socket.on('getPieChart', function(){
		console.log("Pie Chart Activated");
		var myRightAnswers = socket.id.rightanswers;
		var myWrongAnswers = socket.id.notanswered + socket.id.wronganswers; 
		socket.emit('piechart', myRightAnswers, myWrongAnswers);
	});
	socket.on('getPreVideo', function(){
		io.emit('showingPreVideo');
	});
	socket.on('getVideo', function(){
		io.emit('showingVideo');
	});
	socket.on('hideVideo', function(){
		io.emit('hidingVideo');
	});
	socket.on('finalVideo', function(){
		io.emit('endVideo');
	});
});



var q1 = ['Prosciutto is made from what animal?', 'Chicken', 'Cow', 'Fish', 'Pig'];
var q2 = ['How many claws does a housecat have?', 'Eighteen', 'Twenty', 'Sixteen', 'Fourteen'];
var q3 = ['What is another name for the calf muscle?', 'Gastrocnemius', 'Gluteus Maximus', 'Soleus', 'Tibialis Anterior'];
var q4 = ['What kind of weapon features a heavy swinging stick with a spiked ball and chain?', 'Pike', 'Glaive', 'Flail', 'Bludgeon'];
var q5 = ['What flavor is triple sec liquor?', 'Vanilla', 'None', 'Orange', 'Lime'];
var q6 = ['What is the capital of Alaska?', 'Anchorage', 'Fairbanks', 'Juneau', 'Seward'];
var q7 = ['Which car company manufactures the \'Navigator\'?', 'Nissan', 'Honda', 'GMC', 'Lincoln'];
var q8 = ['What is Sinbad\'s real name?', 'David Adkins', 'Carlos Ignacio', 'Sam Simms', 'Myron Oaks'];
var q9 = ['What is April\'s birthstone?', 'Emerald', 'Ruby', 'Diamond', 'Topaz'];
var q10 = ['Which nursery rhyme character \'kissed the girls and made them cry\'?', 'Jack Sprat', 'Georgie Porgie', 'Old King Cole', 'Little Tommy Tucker'];
var q11 = ['What is the common term for epinephrine?', 'Testosterone', 'Estrogen', 'Serotonin', 'Adrenaline'];
var q12 = ['Regarding the candy, what does \'M&M\' stand for?', 'Marshall Mathers', 'Mars and Murrie', 'Mine & Mine', 'Mr. Murphy\'s'];
var q13 = ['Which character killed the monster, Grendel?', 'Beowulf', 'Hercules', 'Perseus', 'Achilles'];
var q14 = ['What is Homer Simpson\'s middle initial?', 'A', 'C', 'J', 'B'];
var q15 = ['What 1990\'s fad involved something known as a slammer?', 'Tamagotchi', 'Pogs', 'Pokemon', 'Beanie Babies'];
var q16 = ['Which phrase is a palindrome?', 'Nurses run', 'A dime a dozen', 'Ding dong', 'Right as rain'];
var q17 = ['What does GIF stand for?', 'Google Image File', 'Graphical Image Format', 'Graphics Interchange Format', 'Graphics Image File'];
var q18 = ['Which exercise will strengthen your abs?', 'Burpee', 'Snatch', 'Pulse Up', 'Chair Dip'];
var q19 = ['Who is the main villain in Disney\'s Robin Hood?', 'The Sheriff of Nottingham', 'Sir Hiss', 'Friar Tuck', 'Prince John'];
var q20 = ['Virginia Slims is a brand of what product?', 'Dietary Supplements', 'Shapewear', 'Cigarettes', 'Liquor'];
var q21 = ['Who is the final boss in the SNES game, Donkey Kong Country?', 'King DeDeDe', 'Bowser', 'King Koopa', 'King K. Rool'];
var q22 = ['A kumquat is a small Japanese variety of what sort of fruit?', 'Orange', 'Lime', 'Pear', 'Lemon'];
var q23 = ['What is another name for a sum of money paid regularly by a company to its shareholders?', 'Bond', 'Dividend', 'Disbursement', 'Restitution'];
var q24 = ['The company, Bic, is know for manufacturing what product?', 'Staplers', 'Crayons', 'Paper', 'Pens'];
var q25 = ['What type of scientist studies ancient human culture?', 'Archaeologist', 'Zoologist', 'Paleontologist', 'Gynecologist'];
var q26 = ['What was Google\'s original name?', 'CompuServe', 'Lycos', 'Excite', 'BackRub'];
var q27 = ['Which president is featured on the $50 bill?', 'Thomas Jefferson', 'Benjamin Franklin', 'Andrew Jackson', 'Ulysses S. Grant'];
var q28 = ['How many U.S. states begin with the letter \'H\'?', '0', '1', '2', '3'];
var q29 = ['A scallion is also known as what?', 'Shallot', 'Chive', 'Endive', 'Green Onion'];
var q30 = ['What artist is known for the 1985 hit song \'Living in America\'?', 'Stevie Wonder', 'Lionel Richie', 'James Brown', 'Prince'];



	
